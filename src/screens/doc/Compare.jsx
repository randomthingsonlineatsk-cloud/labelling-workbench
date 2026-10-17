import React, { useMemo, useState } from 'react';
import { useApp } from '../../ctx.js';
import { compareSections, carveFindings } from '../../engine/checks.js';
import { diffWords } from '../../engine/diff.js';
import { download, slug } from '../../engine/io.js';
import { Diff, RuleCard } from '../../components/ui.jsx';
import { editable, nodeOf } from './Editor.jsx';

const STATUS = {
  same: ['Same', ''], permitted: ['Permitted difference', 'ok'], different: ['Not permitted', 'high'], missing: ['Missing in generic', 'high'],
  extra: ['Only in generic', 'medium'], carved: ['Carved out', 'ok'], 'carve-left': ['Carve-out incomplete', 'high'],
};

export default function Compare({ doc, docs, setTab }) {
  const { pack, updateDoc } = useApp();
  const ref = docs.find((d) => d.role === 'reference' && d.kind === doc.kind);
  const eu = doc.kind === 'smpc';
  const [all, setAll] = useState(false);
  const rows = useMemo(() => (ref ? compareSections(ref, doc) : []), [ref, doc]);
  const carve = useMemo(() => carveFindings(doc), [doc]);
  if (!ref) return <p>No reference label in this project.</p>;
  const shown = all ? rows : rows.filter((r) => r.status !== 'same');
  const toggle = (num) => {
    if (!editable(doc)) return;
    const d = JSON.parse(JSON.stringify(doc));
    d.carved = d.carved?.includes(num) ? d.carved.filter((x) => x !== num) : [...(d.carved ?? []), num];
    updateDoc(d, { action: 'carve-out', detail: `Carve-out of ${num} ${d.carved.includes(num) ? 'selected' : 'cleared'}` });
  };
  const pdf = async () => {
    const { diffReportPdf } = await import('../../engine/pdf.js');
    const r = rows.map((x) => ({ label: x.label, status: x.status, parts: diffWords(x.a, x.b) }));
    download(`${slug(doc.title)}-vs-reference.pdf`, new Blob([await diffReportPdf(`${doc.meta?.proprietaryName} against ${ref.meta?.proprietaryName}`, r, { left: `Reference: ${ref.meta?.proprietaryName}`, right: `Generic: ${doc.meta?.proprietaryName}` })], { type: 'application/pdf' }));
  };
  return (
    <div style={{ maxWidth: 1080 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Compare with the reference label</h2>
      <p className="small muted">Reference: {ref.meta?.proprietaryName} ({ref.meta?.manufacturer}, fictional {eu ? 'reference medicinal product' : 'RLD'}). Product, proper and company names are swapped before comparing, so only real differences show. {eu ? 'Sections 1 to 3 (strengths offered, composition, appearance), 6 (pharmaceutical particulars) and 7 to 10 (holder, numbers, dates) may differ.' : 'Sections 3, 11, 16 and 17 may differ (strengths offered, inactive ingredients, how supplied, company details).'}</p>
      {eu ? <RuleCard pack={pack} id="EU-GEN-SAME" /> : doc.role === 'biosimilar' ? <p className="small">A biosimilar's labeling incorporates the reference product's labeling with appropriate changes, so differences here are expected where the products differ (presentation, storage, excipients). The biosimilar rules are on the Checks tab.</p> : <RuleCard pack={pack} id="US-ANDA-SAME" />}
      {doc.role !== 'biosimilar' && <div className="panel" style={{ margin: '1rem 0' }}>
        <h3>{eu ? 'Indications left out (Article 11)' : 'Carve-outs (section viii)'}</h3>
        <RuleCard pack={pack} id={eu ? 'EU-GEN-CARVE' : 'US-ANDA-CARVE'} />
        {(doc.carveOuts ?? []).map((c) => (
          <label key={c.num} className="row" style={{ margin: '.5rem 0' }}>
            <input type="checkbox" checked={(doc.carved ?? []).includes(c.num)} onChange={() => toggle(c.num)} disabled={!editable(doc)} />
            <span><b>{c.num} {c.name}</b> <span className="small muted">· {c.protected}</span></span>
          </label>
        ))}
        {carve.length === 0 ? <p className="small" style={{ color: 'var(--ok)', fontWeight: 600 }}>No traces of carved-out indications remain.</p> : (
          <div className="issues">
            {carve.map((f, i) => (
              <div key={i} className="issue error">
                <span className="sev error">Left</span>
                <div><div className="where">{f.loc.label}</div><div className="msg">{f.msg}</div></div>
                <div className="acts"><button className="btn small" onClick={() => setTab('edit', { node: nodeOf(doc, f.loc), sub: String(f.loc.key).includes('.') ? f.loc.key : undefined })}>Go to</button></div>
              </div>
            ))}
          </div>
        )}
      </div>}
      <div className="row" style={{ marginBottom: '.75rem' }}>
        <label className="row small"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> Show sections that are the same</label>
        <button className="btn small" onClick={pdf}>Download comparison PDF</button>
      </div>
      {shown.map((r) => (
        <div key={r.num} className="cmp-row">
          <h3>{r.label} <span className={`pill ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span></h3>
          {r.status !== 'same' && r.status !== 'carved' && <Diff parts={diffWords(r.a, r.b)} />}
        </div>
      ))}
    </div>
  );
}
