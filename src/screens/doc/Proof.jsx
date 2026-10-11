import React, { useState } from 'react';
import { proofCheck } from '../../engine/diff.js';
import CartonMock from '../../components/CartonMock.jsx';
import { Diff } from '../../components/ui.jsx';

// The printer's proof against the approved carton text. Find the differences first, then reveal.
export default function Proof({ doc, project }) {
  const proof = project.proof;
  const [marked, setMarked] = useState({});
  const [reveal, setReveal] = useState(false);
  const rows = proofCheck(doc.fields ?? {}, proof.fields ?? {});
  const wrong = rows.filter((r) => !r.ok);
  const right = rows.filter((r) => (marked[r.key] ? !r.ok : r.ok)).length;
  return (
    <div style={{ maxWidth: 1080 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Proof check</h2>
      <p className="small muted">The printer has sent back artwork for this carton. Compare it with the approved text field by field, tick each field that differs, then reveal the answer. In real life every proof is checked word for word before release.</p>
      <div className="cmp-cols" style={{ marginBottom: '1rem' }}>
        <div style={{ background: 'none', padding: 0 }}><h3 className="small">Approved text</h3><CartonMock doc={doc} /></div>
        <div style={{ background: 'none', padding: 0 }}><h3 className="small">Printer's proof</h3><CartonMock doc={doc} fields={proof.fields} /></div>
      </div>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Differs?</th><th>Field</th><th>Approved</th><th>Proof</th>{reveal && <th>Result</th>}</tr></thead>
          <tbody>
            {rows.filter((r) => (doc.fields?.[r.key] ?? '') || (proof.fields?.[r.key] ?? '')).map((r) => (
              <tr key={r.key}>
                <td><input type="checkbox" aria-label={`${r.label} differs`} checked={!!marked[r.key]} onChange={(e) => setMarked({ ...marked, [r.key]: e.target.checked })} /></td>
                <td>{r.label}</td>
                <td>{doc.fields?.[r.key]}</td>
                <td>{reveal && !r.ok ? <Diff parts={r.parts} /> : proof.fields?.[r.key]}</td>
                {reveal && <td>{!r.ok ? (marked[r.key] ? '✓ found' : '✗ missed') : marked[r.key] ? '✗ no difference' : ''}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ marginTop: '.75rem' }}>
        <button className="btn primary" onClick={() => setReveal(true)}>Reveal</button>
        {reveal && <span aria-live="polite"><b>{wrong.filter((r) => marked[r.key]).length} of {wrong.length}</b> differences found; {right} of {rows.length} fields judged correctly.</span>}
      </div>
    </div>
  );
}
