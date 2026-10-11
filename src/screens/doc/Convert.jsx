import React, { useState } from 'react';
import { useApp, go } from '../../ctx.js';
import { targetOptions, oldBlocks, scoreMapping, buildPlr } from '../../engine/convert.js';

export default function Convert({ doc, project, product }) {
  const { pack, updateDoc, addDoc, user, toast } = useApp();
  const [checked, setChecked] = useState(false);
  const opts = targetOptions(pack);
  const mapping = doc.mapping ?? {};
  const blocks = oldBlocks(doc);
  const r = scoreMapping(doc, mapping);
  const marks = Object.fromEntries(r.rows.map((x) => [x.id, x.mark]));
  const set = (id, v) => { setChecked(false); updateDoc({ ...doc, mapping: { ...mapping, [id]: v } }, { action: 'map', detail: 'Conversion mapping' }); };
  const done = blocks.filter((b) => mapping[b.id]).length;
  const build = async () => {
    const d = buildPlr(pack, doc, mapping, product, project.id, user);
    await addDoc(d, 'PLR draft built from the older-format label');
    toast('PLR draft added. Write the Highlights next, then run the checks.');
    go(`/p/${project.id}/${d.id}/edit`);
  };
  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Convert to PLR</h2>
      <p className="small muted">Send each block of the older-format label (21 CFR 201.80) to the PLR section where it belongs (21 CFR 201.57). Precautions splits across several sections. Then build a PLR draft and finish it: Highlights, a PLLR Risk Summary in 8.1 and 8.2, and subsection headings.</p>
      <div className="panel row" style={{ marginBottom: '1rem' }}>
        <span>{done} of {blocks.length} mapped.</span>
        <button className="btn" disabled={done < blocks.length} onClick={() => setChecked(true)}>Check my mapping</button>
        {checked && <b aria-live="polite">Score: {r.score}% {r.score >= 80 ? '(pass)' : ''}</b>}
        <button className="btn primary" disabled={done < blocks.length} onClick={build}>Build PLR draft</button>
      </div>
      {blocks.map((b) => (
        <div key={b.id} className={`map-row ${checked ? marks[b.id] ?? '' : ''}`}>
          <div>
            <div className="from">From: {b.from}</div>
            <div className="small">{b.text}</div>
            {checked && marks[b.id] !== 'right' && b.target && <div className="small" style={{ color: marks[b.id] === 'close' ? 'var(--medium)' : 'var(--high)', fontWeight: 600 }}>{marks[b.id] === 'close' ? 'Right section, wrong subsection.' : 'Not this section.'} Expected: {opts.find((o) => o.value === b.target)?.label ?? b.target}</div>}
          </div>
          <label className="field"><span className="sr-only">PLR section for this block</span>
            <select value={mapping[b.id] ?? ''} onChange={(e) => set(b.id, e.target.value)}>
              <option value="">Choose a PLR section…</option>
              {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}
