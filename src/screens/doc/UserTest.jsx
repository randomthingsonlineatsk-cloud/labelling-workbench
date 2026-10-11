import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { runRound, userTestResult, questionOdds, leafletHash, PER_ROUND, PASS } from '../../engine/usertest.js';
import { findSection, sectionTitle } from '../../engine/model.js';
import { toCsv } from '../../engine/ccds.js';
import { download, slug } from '../../engine/io.js';
import { RuleCard } from '../../components/ui.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));

export default function UserTest({ doc, setTab }) {
  const { pack, saveDocNow, toast } = useApp();
  const ut = doc.userTest;
  const [q, setQ] = useState({ q: '', section: 'pl2', answer: '' });
  const sections = (doc.sections ?? []).flatMap((s) => [s, ...(s.subs ?? [])]);

  if (!ut) {
    return (
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ fontSize: 'var(--step-2)' }}>User test</h2>
        <p>Set up a readability test for this leaflet: write 12 to 15 questions on the key safety messages, dosing and use, each pointing to the section that answers it.</p>
        <button className="btn primary" onClick={async () => { const d = clone(doc); d.userTest = { questions: [], rounds: [] }; await saveDocNow(d, { action: 'user-test', detail: 'User test set up' }); }}>Set up a user test</button>
      </div>
    );
  }
  const res = userTestResult(doc);
  const hash = leafletHash(doc);
  const save = (fn, detail) => { const d = clone(doc); fn(d); return saveDocNow(d, { action: 'user-test', detail }); };
  const round = async () => {
    if (!ut.questions.length) { toast('Add the questions first.', 'warn'); return; }
    const n = (ut.rounds?.length ?? 0) + 1;
    await save((d) => { d.userTest.rounds.push(runRound(d, n)); }, `User test round ${n} run`);
    toast(`Round ${n}: ${PER_ROUND} participants tested.`);
  };
  const csv = () => download(`${slug(doc.title)}-user-test.csv`, toCsv(ut.questions.map((x) => ({ ...x, ...Object.fromEntries(ut.rounds.map((r) => [`r${r.n}`, `${r.results[x.id]?.understood ?? '-'}/${PER_ROUND}`])) })), [['id', 'Question id'], ['q', 'Question'], ['section', 'Section'], ...ut.rounds.map((r) => [`r${r.n}`, `Round ${r.n} (found and understood)`])]), 'text/csv');

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>User test (simulated)</h2>
          <p className="small muted" style={{ margin: 0 }}>Each round tests {PER_ROUND} simulated participants. Whether they find and understand an answer depends on whether it is in the section the question points to, and on sentence length and medical jargon there. The same text always gives the same results, so rewriting is what moves them. A real test uses real people.</p>
        </div>
        <div className="row"><button className="btn small" onClick={csv} disabled={!ut.rounds.length}>Results (CSV)</button></div>
      </div>
      <RuleCard pack={pack} id="EU-UT" />
      <div className={`callout ${res.passed ? 'good' : 'warn'}`} style={{ margin: '.75rem 0' }} role="status">{res.summary} Pass mark: {PASS} of 20 on each question, from the last two rounds on the same text.</div>
      <div className="row" style={{ marginBottom: '.75rem' }}>
        <button className="btn primary" onClick={round}>Run round {(ut.rounds?.length ?? 0) + 1} ({PER_ROUND} participants)</button>
        <span className="small muted">Leaflet text version {hash}. {ut.rounds.filter((r) => r.hash === hash).length} round(s) on this text.</span>
      </div>
      <div className="table-wrap" tabIndex={0}>
        <table className="data">
          <thead><tr><th>Question</th><th>Section</th>{ut.rounds.map((r) => <th key={r.n} title={r.hash === hash ? 'on the current text' : 'on an earlier text'}>R{r.n}{r.hash === hash ? '' : '*'}</th>)}<th>Last two</th><th>Why it may fail</th><th /></tr></thead>
          <tbody>
            {ut.questions.map((x, i) => {
              const o = questionOdds(doc, x);
              const pq = res.perQuestion.find((p) => p.id === x.id);
              const sec = findSection(doc, x.section);
              return (
                <tr key={x.id}>
                  <td style={{ minWidth: 220 }}><b className="small">{x.id}</b> {x.q}</td>
                  <td className="small"><button className="btn small ghost" onClick={() => setTab('edit', { node: String(x.section).split('.')[0], sub: String(x.section).includes('.') ? x.section : undefined })}>{sec ? sectionTitle(sec).slice(0, 34) : x.section}</button></td>
                  {ut.rounds.map((r) => <td key={r.n} className="small">{r.results[x.id]?.understood ?? '-'}/{PER_ROUND}</td>)}
                  <td>{pq?.score == null ? '—' : <span className={`pill ${pq.pass ? 'ok' : 'high'}`}>{pq.score}/20</span>}</td>
                  <td className="small" style={{ minWidth: 180 }}>{!o.present ? 'The answer is not in that section.' : [o.avg > 20 ? `long sentences (${Math.round(o.avg)} words)` : '', o.jargon.length ? `jargon: ${o.jargon.slice(0, 4).join(', ')}` : ''].filter(Boolean).join('; ') || 'reads well'}</td>
                  <td><button className="btn small ghost" aria-label={`Remove ${x.id}`} onClick={() => save((d) => { d.userTest.questions.splice(i, 1); }, `Removed question ${x.id}`)}>Remove</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <form className="panel grid-2" style={{ marginTop: '1rem' }} onSubmit={async (e) => { e.preventDefault(); if (!q.q.trim() || !q.answer.trim()) return; await save((d) => { d.userTest.questions.push({ id: `q${Date.now().toString(36).slice(-4)}`, q: q.q.trim(), section: q.section, answer: q.answer.trim() }); }, 'Question added'); setQ({ ...q, q: '', answer: '' }); }}>
        <label className="field">Question<input type="text" value={q.q} onChange={(e) => setQ({ ...q, q: e.target.value })} placeholder="for example: What should you do if you miss a dose?" /></label>
        <label className="field">Section with the answer<select value={q.section} onChange={(e) => setQ({ ...q, section: e.target.value })}>{sections.map((s) => <option key={s.num} value={s.num}>{s.title.slice(0, 60)}</option>)}</select></label>
        <label className="field">Words in a correct answer <small>separate alternatives with |</small><input type="text" value={q.answer} onChange={(e) => setQ({ ...q, answer: e.target.value })} placeholder="as soon as you remember|next dose" /></label>
        <div style={{ alignSelf: 'end' }}><button className="btn" type="submit">Add question</button></div>
      </form>
    </div>
  );
}
