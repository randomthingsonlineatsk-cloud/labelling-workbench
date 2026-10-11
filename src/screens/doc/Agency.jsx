import React from 'react';
import { useApp } from '../../ctx.js';
import { scriptFor, openRound, satisfied, responseProblems, submitDraft, sendResponse, responseTable, DECISIONS, MIN_REPLY } from '../../engine/agency.js';
import { today } from '../../engine/changes.js';
import { toCsv } from '../../engine/ccds.js';
import { download, slug } from '../../engine/io.js';
import { RuleCard } from '../../components/ui.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));

export default function Agency({ project, doc }) {
  const { pack, updateDoc, saveDocNow, addVersion, toast } = useApp();
  const script = scriptFor(pack, project, doc);
  const rounds = doc.agency?.rounds ?? [];
  const round = openRound(doc);
  const problems = round ? responseProblems(doc, round) : [];
  const editable = doc.status === 'draft' || doc.status === 'changes';

  const submit = async () => {
    const d = clone(doc);
    submitDraft(d, script, today());
    await addVersion({ docId: doc.id, projectId: project.id, version: doc.version ?? 0, n: doc.version ?? 0, status: 'submitted', snapshot: clone(doc), note: 'Draft labelling submitted to the agency (practice)' });
    await saveDocNow(d, { action: 'agency', detail: 'Draft labelling submitted to the agency; round 1 comments received' });
    toast(`${script.length} agency comment(s) received.`);
  };
  const setC = (id, patch) => { const d = clone(doc); const c = openRound(d).comments.find((x) => x.id === id); Object.assign(c, patch); updateDoc(d, { action: 'agency', detail: `Response to ${id}` }); };
  const send = async () => {
    const d = clone(doc);
    try {
      const r = sendResponse(d, today());
      await addVersion({ docId: doc.id, projectId: project.id, version: doc.version ?? 0, n: doc.version ?? 0, status: 'submitted', snapshot: clone(d), note: `Response to agency round ${round.n}` });
      await saveDocNow(d, { action: 'agency', detail: r.agreed ? 'Labelling agreed with the agency' : `Response sent; ${r.followUps} follow-up comment(s)` });
      toast(r.agreed ? 'The agency agrees the labelling. You can now take it through approval.' : `The agency came back on ${r.followUps} comment(s).`, r.agreed ? 'info' : 'warn');
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>Agency comments</h2>
          <p className="small muted" style={{ margin: 0 }}>Practice negotiation: the agency's comments are scripted for this sample. Answer each one (accept, partly accept or decline with a reason), change the label where you accept, and send the response.</p>
        </div>
        {rounds.length > 0 && <button className="btn small" onClick={() => download(`${slug(doc.title)}-response-table.csv`, toCsv(responseTable(doc), [['round', 'Round'], ['id', 'Comment'], ['where', 'Where'], ['comment', 'Agency comment'], ['decision', 'Decision'], ['reply', 'Reason or reply'], ['inText', 'Change in the text'], ['respondedOn', 'Responded']]), 'text/csv')}>Response table (CSV)</button>}
      </div>
      <RuleCard pack={pack} id="CORE-AGENCY" />

      {!script && !rounds.length && <p className="small" style={{ marginTop: '1rem' }}>No agency review is scripted for this label. Open the sample "Ostrevia: respond to a 505(o)(4) notification" to practise a comment round.</p>}

      {script && !rounds.length && (
        <div className="panel" style={{ marginTop: '1rem' }}>
          <p style={{ marginTop: 0 }}>Submit the draft labelling when your proposed changes are in the text. The agency replies at once in this practice (in reality it takes weeks).</p>
          {!editable && <div className="callout warn">This version is {doc.status}. Start a new version on the Review tab and make your changes first.</div>}
          <button className="btn primary" disabled={!editable} onClick={submit}>Submit draft labelling to the agency</button>
        </div>
      )}

      {doc.agency?.agreedOn && <div className="callout good" style={{ marginTop: '1rem' }} role="status">Labelling agreed with the agency on {doc.agency.agreedOn}. Take this version through review and approval.</div>}

      {[...rounds].reverse().map((r) => (
        <section key={r.n} className="panel" style={{ marginTop: '1rem' }}>
          <div className="section-head"><h3 style={{ margin: 0 }}>Round {r.n}</h3><span className="small muted">Received {r.sentOn}{r.respondedOn ? ` · answered ${r.respondedOn}` : ' · open'}</span></div>
          {r.comments.map((c) => {
            const open = !r.respondedOn;
            const ok = satisfied(doc, c);
            const prob = open ? problems.find((p) => p.id === c.id) : null;
            const options = c.kind === 'question' ? ['answer'] : ['accept', 'partial', 'decline'];
            return (
              <div key={c.id} className="issue" style={{ display: 'block', marginTop: '.6rem' }}>
                <div className="small muted">{c.id} · {c.where} · {c.kind}</div>
                <p style={{ margin: '.25rem 0' }}>{c.text}</p>
                {c.previous && <p className="small muted" style={{ margin: 0 }}>Your earlier reply: {c.previous}</p>}
                {ok !== null && c.kind !== 'question' && <p className="small" style={{ margin: '.2rem 0', color: ok ? 'var(--ok)' : 'var(--high)', fontWeight: 600 }}>{ok ? 'The change is in the label text.' : 'The change is not in the label text yet.'}</p>}
                {open ? (
                  <div className="stack" style={{ marginTop: '.4rem' }}>
                    <div className="row" role="radiogroup" aria-label={`Decision on ${c.id}`}>
                      {options.map((o) => <label key={o} className="row small"><input type="radio" name={`dec-${c.id}`} checked={c.decision === o} onChange={() => setC(c.id, { decision: o })} /> {DECISIONS[o]}</label>)}
                    </div>
                    {c.decision && c.decision !== 'accept' && <label className="field small">{c.decision === 'answer' ? 'Answer' : 'Reason'} (at least {MIN_REPLY} characters)<textarea rows={2} value={c.reply ?? ''} onChange={(e) => setC(c.id, { reply: e.target.value })} /></label>}
                    {prob && <span className="small" style={{ color: 'var(--high)' }}>{prob.msg}</span>}
                  </div>
                ) : <p className="small" style={{ margin: '.2rem 0' }}><b>{DECISIONS[c.decision]}</b>{c.reply ? `: ${c.reply}` : ''}</p>}
              </div>
            );
          })}
          {!r.respondedOn && <div className="row" style={{ marginTop: '.8rem' }}><button className="btn primary" disabled={problems.length > 0} onClick={send}>Send the response</button>{problems.length > 0 && <span className="small muted">{problems.length} comment(s) still need attention.</span>}</div>}
        </section>
      ))}
    </div>
  );
}
