import React, { useMemo, useState } from 'react';
import { useApp } from '../../ctx.js';
import { compareDocs } from '../../engine/diff.js';
import { download, slug } from '../../engine/io.js';
import { Diff, StatusPill, fmtDate } from '../../components/ui.jsx';

export default function Versions({ doc, project }) {
  const { versions, pack, createFromSample, docs: allDocs, toast } = useApp();
  const mine = versions.filter((v) => v.docId === doc.id).sort((a, b) => (b.n - a.n) || b.at.localeCompare(a.at));
  const sample = project.sampleId ? pack.samples.find((s) => s.id === project.sampleId)?.docs.find((d) => d.id === doc.sampleDocId) : null;
  const options = [
    { id: 'current', label: `Current (v${doc.version ?? 0}, ${doc.status})`, doc },
    ...mine.map((v) => ({ id: v.id, label: `v${v.n} ${v.status} · ${fmtDate(v.at)}`, doc: v.snapshot })),
    ...(sample ? [{ id: 'sample', label: 'Original sample (as first opened)', doc: sample }] : []),
  ];
  const [left, setLeft] = useState(options[1]?.id ?? options[options.length - 1]?.id ?? 'current');
  const [right, setRight] = useState('current');
  const [all, setAll] = useState(false);
  const L = options.find((o) => o.id === left) ?? options[0];
  const R = options.find((o) => o.id === right) ?? options[0];
  const rows = useMemo(() => compareDocs(L.doc, R.doc), [L, R]);
  const changedRows = rows.filter((r) => r.status !== 'same');
  const pdf = async () => {
    const { diffReportPdf } = await import('../../engine/pdf.js');
    download(`${slug(doc.title)}-comparison.pdf`, new Blob([await diffReportPdf(doc.title, rows, { left: L.label, right: R.label })], { type: 'application/pdf' }));
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Versions</h2>
      {mine.length === 0 ? <p className="small muted">No frozen versions yet. A version is saved when you submit for review and frozen when it is approved.</p> : (
        <div className="table-wrap" style={{ marginBottom: '1rem' }}>
          <table className="data">
            <thead><tr><th>Version</th><th>Status</th><th>Saved</th><th>Signed</th></tr></thead>
            <tbody>{mine.map((v) => <tr key={v.id}><td>v{v.n}</td><td><StatusPill status={v.status} /></td><td>{fmtDate(v.at)}</td><td>{v.signedBy ? `${v.signedBy}: ${v.reason}` : '—'}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      <div className="panel row" style={{ marginBottom: '1rem', alignItems: 'end' }}>
        <label className="field" style={{ minWidth: 260 }}>Compare <select value={left} onChange={(e) => setLeft(e.target.value)}>{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <label className="field" style={{ minWidth: 260 }}>with <select value={right} onChange={(e) => setRight(e.target.value)}>{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
        <label className="row small"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Show unchanged parts</label>
        <button className="btn" onClick={pdf}>Download comparison PDF</button>
      </div>
      <p className="small" aria-live="polite">{changedRows.length} part(s) differ. <span className="muted">Removed words are struck through; added words are highlighted.</span></p>
      {(all ? rows : changedRows).map((r) => (
        <div key={r.key} className="cmp-row">
          <h3>{r.label} <span className={`pill ${r.status === 'same' ? '' : r.status === 'removed' ? 'high' : r.status === 'added' ? 'ok' : 'medium'}`}>{r.status}</span></h3>
          <Diff parts={r.parts} />
        </div>
      ))}
    </div>
  );
}
