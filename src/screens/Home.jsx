import React, { useMemo, useRef, useState } from 'react';
import { useApp, go } from '../ctx.js';
import { PRODUCTS } from '../engine/pack.js';
import { runChecks, summarise } from '../engine/checks.js';
import { KIND_LABEL } from '../engine/model.js';
import { readFile } from '../engine/io.js';
import { Counts, Modal, fmtDate } from '../components/ui.jsx';

const KINDS = ['pi', 'mg', 'ppi', 'ifu', 'carton', 'container'];

export default function Home() {
  const { pack, projects, docs, createFromSample, createBlank, importProject, toast, product } = useApp();
  const [showNew, setShowNew] = useState(false);
  const fileRef = useRef(null);
  const sums = useMemo(() => {
    const out = {};
    for (const p of projects) {
      const ds = docs.filter((d) => d.projectId === p.id);
      const all = ds.flatMap((d) => runChecks(d, { pack, docs: ds, product: product(p.productId) }));
      out[p.id] = { sum: summarise(all), n: ds.length, approved: ds.filter((d) => d.status === 'approved').length };
    }
    return out;
  }, [projects, docs, pack, product]);

  const open = async (sampleId) => {
    const { project, docs: ds } = await createFromSample(sampleId);
    go(`/p/${project.id}/${ds[ds.length > 1 && ds[0].role === 'reference' ? 1 : 0].id}`);
  };
  const onImport = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const r = await importProject(await readFile(f));
      toast(`Imported "${r.project.title}".`);
      r.warnings.forEach((w) => toast(w, 'warn'));
    } catch (err) { toast(err.message, 'error'); }
  };

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="kicker">Labelling practice · US pack {pack.version}</p>
          <h1>Write a label, then check it against the rules</h1>
          <p className="lede">Author prescribing information in PLR format, Medication Guides and carton labels for fictional products. Every check names its regulation or guidance, and says where the app simplifies.</p>
          <div className="row">
            <button className="btn primary" onClick={() => open('ostrevia-errors')}>Try the error hunt</button>
            <button className="btn" onClick={() => open('ostrevia-clean')}>Open a clean label</button>
            <a className="btn ghost" href="#/learn">Start with the lessons</a>
          </div>
        </div>
        <div className="mini-label" aria-hidden="true">
          <div className="hl-title">HIGHLIGHTS OF PRESCRIBING INFORMATION</div>
          <div className="small">OSTREVIA (lumiravostat) tablets, for oral use · Initial U.S. Approval: 2023</div>
          <div className="boxw"><b>WARNING: SERIOUS INFECTIONS, MALIGNANCY, AND THROMBOSIS</b><br />See full prescribing information for complete boxed warning.</div>
          <div className="small"><b>RECENT MAJOR CHANGES</b> · Warnings and Precautions, Thrombosis (5.3) 08/2026</div>
          <div className="ln" style={{ width: '92%' }} /><div className="ln" style={{ width: '78%' }} /><div className="ln" style={{ width: '85%' }} />
          <div className="small" style={{ marginTop: '.4rem' }}><span className="sev error">2 errors</span> <span className="sev warning">1 warning</span> <span className="muted">· 5.9 does not exist</span></div>
        </div>
      </section>

      <div className="section-head"><h2>Your projects</h2>
        <div className="row">
          <button className="btn" onClick={() => setShowNew(true)}>New blank project</button>
          <button className="btn ghost" onClick={() => fileRef.current?.click()}>Import a project file</button>
          <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImport} />
        </div>
      </div>
      {projects.length === 0 ? <p className="muted">No projects yet. Open a sample below, or start a blank project.</p> : (
        <div className="list">
          {projects.map((p) => (
            <a key={p.id} className="list-item" href={`#/p/${p.id}`} style={{ textDecoration: 'none', color: 'var(--ink)' }}>
              <div>
                <h3>{p.title}{p.drill ? <span className="pill medium" style={{ marginLeft: '.5rem' }}>Drill</span> : null}</h3>
                <span className="small muted">{product(p.productId)?.brandName} · {sums[p.id]?.n ?? 0} label(s), {sums[p.id]?.approved ?? 0} approved · updated {fmtDate(p.updatedAt)}</span>
              </div>
              <Counts sum={sums[p.id]?.sum} />
            </a>
          ))}
        </div>
      )}

      <div className="section-head"><h2>Start from a sample</h2><span className="small muted">Each opens as your own copy; the sample stays unchanged.</span></div>
      <div className="sample-grid">
        {pack.samples.map((s) => (
          <div key={s.id} className="sample-card">
            <span className="kicker">{s.level}</span>
            <h3>{s.title}</h3>
            <p className="small" style={{ margin: 0 }}>{s.about}</p>
            <p className="small muted" style={{ margin: 0 }}>{s.docs.map((d) => d.title).join(' · ')}</p>
            <div><button className="btn small primary" onClick={() => open(s.id)}>Open a copy</button></div>
          </div>
        ))}
      </div>
      {showNew && <NewProject onClose={() => setShowNew(false)} onCreate={async (v) => { const p = await createBlank(v); setShowNew(false); go(`/p/${p.id}`); }} />}
    </div>
  );
}

function NewProject({ onClose, onCreate }) {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [kinds, setKinds] = useState(['pi', 'carton']);
  const [title, setTitle] = useState('');
  const toggle = (k) => setKinds((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]));
  return (
    <Modal title="New blank project" onClose={onClose}>
      <div className="stack">
        <label className="field">Product (fictional)
          <select value={productId} onChange={(e) => setProductId(e.target.value)}>
            {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.brandName} ({p.inn}), {p.dosageForm}</option>)}
          </select>
        </label>
        <label className="field">Project name <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional" /></label>
        <fieldset className="plain">
          <legend className="small" style={{ fontWeight: 600, color: 'var(--ink-2)' }}>Labels to create (US)</legend>
          {KINDS.map((k) => <label key={k} className="row small" style={{ margin: '.25rem 0' }}><input type="checkbox" checked={kinds.includes(k)} onChange={() => toggle(k)} /> {KIND_LABEL[k]}</label>)}
        </fieldset>
        <div className="row"><button className="btn primary" disabled={!kinds.length} onClick={() => onCreate({ productId, kinds, title })}>Create</button><button className="btn ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </Modal>
  );
}
