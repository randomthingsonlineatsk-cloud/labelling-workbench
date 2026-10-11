import React, { useMemo, useState } from 'react';
import { useApp, go } from '../ctx.js';
import { moduleOf } from '../engine/pack.js';

export async function openSample(app, sampleId, docSampleId, tab = 'edit', focus = null, extra = {}) {
  const { project, docs } = await app.createFromSample(sampleId, extra);
  const d = docs.find((x) => x.sampleDocId === docSampleId) ?? docs[0];
  if (focus) {
    const f = /^\d/.test(focus) ? { node: focus.split('.')[0], sub: focus.includes('.') ? focus : undefined } : { node: focus };
    try { sessionStorage.setItem('lw-focus', JSON.stringify(f)); } catch { /* storage blocked */ }
  }
  go(`/p/${project.id}/${d.id}/${tab}`);
}

export function Learn() {
  const { pack, lessonsDone } = useApp();
  const ls = pack.lessons.lessons;
  const groups = [['us', 'US labelling', 'The prescribing information, patient labelling, carton and container, SPL and generic labelling.'], ['core', 'Core data sheet and change management', 'The company core data sheet, mapping and deviations, safety labelling changes, agency comment rounds and implementation.'], ['eu', 'EU product information', 'The QRD template, SmPC 4.8, excipients, additional monitoring, user testing, Braille and safety features, translations, PRAC wording and ePI.'], ['in', 'India labelling', 'Rule 96 label particulars, the Rule 97 red-box cautions and symbols, the CDSCO package insert format, Schedule H2 QR codes, and the MRP and proper-name rules.'], ['intl', 'More markets: Canada, Switzerland, Japan, Australia, WHO PQ', 'The Canadian product monograph and label, the Swiss Fachinformation and patient information, the Japanese package insert, the Australian PI and CMI, and the SmPC of a WHO-prequalified medicine.']];
  return (
    <div className="page">
      <h1>Learn</h1>
      <p>{ls.length} short lessons in three modules. Each ends with a four-question check (pass at 80%) and a "Try it" button that opens a sample at the right place. The <a href="#/glossary">glossary</a> explains the terms. Each module has its own certificate on the <a href="#/progress">progress page</a>.</p>
      {groups.map(([m, title, about]) => (
        <section key={m} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 'var(--step-2)', marginBottom: '.2rem' }}>{title}</h2>
          <p className="small muted" style={{ marginTop: 0 }}>{about}</p>
          <div className="lesson-grid">
            {ls.filter((l) => moduleOf(l) === m).map((l) => {
              const best = lessonsDone[`us-${l.id}`]?.best;
              return (
                <a key={l.id} className="lesson-card" href={`#/learn/${l.id}`}>
                  <span className="n">{l.id}</span>
                  <strong>{l.title}</strong>
                  <span className="small muted">{l.minutes} min{best !== undefined ? ` · check ${best}%` : ''}</span>
                  {best >= 80 && <span className="sev ok" style={{ justifySelf: 'start' }}>Passed</span>}
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function Lesson({ id }) {
  const app = useApp();
  const { pack, saveLesson, toast } = app;
  const l = pack.lessons.lessons.find((x) => x.id === id);
  const qs = useMemo(() => pack.quiz.questions.filter((q) => q.topic === id).slice(0, 4), [pack, id]);
  const [ans, setAns] = useState({});
  if (!l) return <div className="page"><h1>Lesson not found</h1></div>;
  const done = Object.keys(ans).length === qs.length;
  const right = qs.filter((q) => ans[q.id] === q.answer).length;
  const next = pack.lessons.lessons.find((x) => x.id === id + 1);
  return (
    <div className="page lesson">
      <p className="small"><a href="#/learn">Learn</a> / Lesson {l.id}</p>
      <h1>{l.title}</h1>
      {l.sections.map((s) => (
        <section key={s.h}>
          <h2 style={{ fontSize: 'var(--step-2)' }}>{s.h}</h2>
          {s.p.map((p) => <p key={p.slice(0, 40)}>{p}</p>)}
        </section>
      ))}
      <section>
        <h2 style={{ fontSize: 'var(--step-2)' }}>Check</h2>
        {qs.map((q, i) => {
          const a = ans[q.id];
          return (
            <div key={q.id} className="quiz-q">
              <fieldset>
                <legend>{i + 1}. {q.q}</legend>
                {q.options.map((o, j) => (
                  <label key={o} className={`quiz-opt ${a !== undefined && j === q.answer ? 'right' : a === j ? 'wrong' : ''}`}>
                    <input type="radio" name={q.id} disabled={a !== undefined} checked={a === j} onChange={() => setAns({ ...ans, [q.id]: j })} /> <span>{o}</span>
                  </label>
                ))}
              </fieldset>
              {a !== undefined && <p className="small" style={{ margin: '.4rem 0 0' }}>{a === q.answer ? 'Correct. ' : 'Not quite. '}{q.why} <span className="muted">({q.cite})</span></p>}
            </div>
          );
        })}
        <div className="row">
          {done && <button className="btn primary" onClick={async () => { const s = Math.round((right / qs.length) * 100); await saveLesson(l.id, s); toast(`Lesson ${l.id}: ${right} of ${qs.length}${s >= 80 ? ', passed' : ''}.`); }}>Save result ({right} of {qs.length})</button>}
          {done && <button className="btn ghost" onClick={() => setAns({})}>Try again</button>}
          {l.tryIt && <button className="btn" onClick={() => openSample(app, l.tryIt.sample, l.tryIt.doc, l.tryIt.tab ?? 'edit', l.tryIt.focus)}>Try it on a sample</button>}
          {next && <a className="btn ghost" href={`#/learn/${next.id}`}>Next lesson</a>}
        </div>
      </section>
    </div>
  );
}
