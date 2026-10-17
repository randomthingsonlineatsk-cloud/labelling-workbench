import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp, go } from '../ctx.js';
import { runChecks, summarise } from '../engine/checks.js';
import { evaluateDrill } from '../engine/drills.js';
import { blankDoc, KIND_LABEL } from '../engine/model.js';
import { exportProject, download, slug } from '../engine/io.js';
import { Counts, StatusPill, Modal } from '../components/ui.jsx';
import Editor from './doc/Editor.jsx';
import Checks from './doc/Checks.jsx';
import Review from './doc/Review.jsx';
import Versions from './doc/Versions.jsx';
import Export from './doc/Export.jsx';
import Preview from './doc/Preview.jsx';
import Compare from './doc/Compare.jsx';
import Convert from './doc/Convert.jsx';
import Proof from './doc/Proof.jsx';
import Core from './doc/Core.jsx';
import Changes from './doc/Changes.jsx';
import Agency from './doc/Agency.jsx';
import { scriptFor } from '../engine/agency.js';
import UserTest from './doc/UserTest.jsx';
import Translation from './doc/Translation.jsx';
import { kindsFor, ruleChanges, ruleStamp } from '../engine/pack.js';

const TAB_LABEL = { edit: 'Edit', preview: 'Preview', checks: 'Checks', review: 'Review', versions: 'Versions', compare: 'Compare with reference', convert: 'Convert to PLR', proof: 'Proof check', core: 'Core data sheet', agency: 'Agency comments', changes: 'Changes', usertest: 'User test', translation: 'Translation review', export: 'Export' };

export default function Project({ id, docId, tab }) {
  const app = useApp();
  const { pack, projectById, docsOf, product: productOf, saveProject, deleteProject, versions, reviews, audit, user, toast, addDoc } = app;
  const project = projectById(id);
  const docs = project ? docsOf(id) : [];
  const product = project ? productOf(project.productId) : null;
  const doc = docs.find((d) => d.id === docId) ?? docs.find((d) => d.role !== 'reference') ?? docs[0];
  const [focus, setFocus] = useState(() => {
    try { const f = JSON.parse(sessionStorage.getItem('lw-focus') ?? 'null'); sessionStorage.removeItem('lw-focus'); return f; } catch { return null; }
  });
  const lastDoc = useRef(null);
  const [showAdd, setShowAdd] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const ctx = useMemo(() => ({ pack, docs, product, project }), [pack, docs, product, project]);
  const issuesByDoc = useMemo(() => Object.fromEntries(docs.map((d) => [d.id, runChecks(d, ctx)])), [docs, ctx]);

  useEffect(() => { if (lastDoc.current && lastDoc.current !== doc?.id) setFocus(null); lastDoc.current = doc?.id; }, [doc?.id]);
  // Alt+1..9 and Alt+Shift+arrows (see the shortcuts dialog); the handler is set after the checks below.
  const keyRef = useRef(null);
  useEffect(() => { const h = (e) => keyRef.current?.(e); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);
  if (!project) return <div className="page"><h1>Project not found</h1><p><a href="#/">Back to projects</a></p></div>;
  if (!doc) return <div className="page"><h1>{project.title}</h1><p>This project has no labels. <button className="btn" onClick={() => setShowAdd(true)}>Add a label</button></p>{showAdd && <AddDoc project={project} product={product} onClose={() => setShowAdd(false)} />}</div>;

  const tabs = ['edit', 'preview', 'checks', 'review', 'versions'];
  if ((doc.role === 'generic' || doc.role === 'biosimilar') && docs.some((d) => d.role === 'reference')) tabs.push('compare');
  if (doc.kind === 'pi-old') tabs.push('convert');
  if ((doc.kind === 'carton' || doc.kind === 'container') && project.proof?.docId === doc.id) tabs.push('proof');
  if (doc.kind === 'pl' && doc.role !== 'translation') tabs.push('usertest');
  if (doc.role === 'translation') tabs.push('translation');
  tabs.push('core');
  if (scriptFor(pack, project, doc) || doc.agency) tabs.push('agency');
  tabs.push('changes', 'export');
  const cur = tabs.includes(tab) ? tab : 'edit';
  const issues = issuesByDoc[doc.id] ?? [];
  const setTab = (t, f) => { if (f !== undefined) setFocus(f); go(`/p/${project.id}/${doc.id}/${t}`); };
  keyRef.current = (e) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const n = /^Digit([1-9])$/.exec(e.code);
      if (n && !e.shiftKey && tabs[Number(n[1]) - 1]) { e.preventDefault(); setTab(tabs[Number(n[1]) - 1]); return; }
      if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        const i = docs.findIndex((d) => d.id === doc.id);
        const next = docs[i + (e.key === 'ArrowRight' ? 1 : -1)];
        if (next) { e.preventDefault(); go(`/p/${project.id}/${next.id}/${cur}`); }
      }
  };
  const props = { project, doc, docs, product, issues, ctx, focus, setFocus, setTab };

  const exportAll = () => {
    const ids = new Set(docs.map((d) => d.id));
    download(`${slug(project.title)}.labelling.json`, exportProject({ project, docs, versions: versions.filter((v) => ids.has(v.docId)), reviews: reviews.filter((r) => ids.has(r.docId)), audit: audit.filter((a) => a.projectId === project.id), pack, user }));
  };

  return (
    <div className="ws">
      <div className="ws-head">
        <div className="ws-title">
          <div>
            <p className="small" style={{ margin: 0 }}><a href="#/">Projects</a> / {product?.brandName} ({product?.inn}) · {{ eu: 'EU', in: 'India', ca: 'Canada', ch: 'Switzerland', jp: 'Japan', au: 'Australia', who: 'WHO PQ', intl: 'Several markets' }[project.region] ?? 'US'} · fictional</p>
            {renaming ? (
              <form className="row" onSubmit={async (e) => { e.preventDefault(); await saveProject({ ...project, title: e.target.t.value || project.title }); setRenaming(false); }}>
                <input name="t" type="text" defaultValue={project.title} aria-label="Project name" style={{ minWidth: 280 }} /><button className="btn small primary">Save</button>
              </form>
            ) : <h1>{project.title}</h1>}
          </div>
          <div className="row no-print">
            <button className="btn small ghost" onClick={() => setRenaming(!renaming)}>Rename</button>
            <button className="btn small" onClick={() => setShowAdd(true)}>Add a label</button>
            <button className="btn small" onClick={exportAll}>Download project file</button>
            <button className="btn small danger ghost" onClick={async () => { if (window.confirm(`Delete "${project.title}" and all its labels? This cannot be undone.`)) { await deleteProject(project); go('/'); } }}>Delete</button>
          </div>
        </div>
        {project.about && <p className="small muted" style={{ margin: '.3rem 0 0' }}>{project.about}</p>}
        {(() => {
          const rc = ruleChanges(project.ruleStamp, pack, project.region ?? 'us');
          if (!rc) return null;
          const line = (label, list) => list.length > 0 && <li>{label}: {list.map((r, i) => <React.Fragment key={r.id}>{i ? ', ' : ''}<a href="#/rules">{r.id}</a> ({r.title})</React.Fragment>)}</li>;
          return (
            <div className="callout warn" role="status" style={{ margin: '.5rem 0' }}>
              <b>The rules have changed since this project was made.</b> Re-run the checks and review these rule cards:
              <ul className="small" style={{ margin: '.3rem 0' }}>{line('Added', rc.added)}{line('Changed', rc.changed)}{line('Removed', rc.removed)}</ul>
              <button className="btn small" onClick={() => saveProject({ ...project, ruleStamp: ruleStamp(pack, project.region ?? 'us') })}>Mark as reviewed</button>
            </div>
          );
        })()}
        <div className="doc-tabs" role="list" aria-label="Labels in this project">
          {docs.map((d) => (
            <button key={d.id} className="doc-tab" role="listitem" aria-current={d.id === doc.id ? 'true' : undefined} onClick={() => go(`/p/${project.id}/${d.id}/${['compare', 'convert', 'proof', 'agency', 'usertest', 'translation'].includes(cur) ? 'edit' : cur}`)}>
              <span className="k">{d.role === 'reference' ? 'Reference (RLD)' : d.role === 'translation' ? `${KIND_LABEL[d.kind]} · ${(d.meta?.lang ?? '').toUpperCase()}` : KIND_LABEL[d.kind]}</span>
              <span className="t">{d.title}</span>
              <span className="row" style={{ gap: '.25rem' }}><StatusPill status={d.status} /> <Counts sum={summarise(issuesByDoc[d.id] ?? [])} /></span>
            </button>
          ))}
        </div>
        <div className="tabs" role="tablist" aria-label="Label views">
          {tabs.map((t) => <button key={t} role="tab" aria-selected={cur === t} onClick={() => setTab(t)}>{TAB_LABEL[t]}{t === 'checks' ? ` (${issues.filter((i) => !i.waived && i.severity !== 'info').length})` : ''}{t === 'changes' && (project.changes ?? []).length ? ` (${project.changes.length})` : ''}</button>)}
        </div>
      </div>
      {project.drill && <DrillBar project={project} docs={docs} />}
      <div className="ws-body" role="tabpanel">
        {cur === 'edit' && <Editor key={doc.id} {...props} />}
        {cur === 'preview' && <Preview key={doc.id} {...props} />}
        {cur === 'checks' && <Checks key={doc.id} {...props} />}
        {cur === 'review' && <Review key={doc.id} {...props} />}
        {cur === 'versions' && <Versions key={doc.id} {...props} />}
        {cur === 'compare' && <Compare key={doc.id} {...props} />}
        {cur === 'convert' && <Convert key={doc.id} {...props} />}
        {cur === 'proof' && <Proof key={doc.id} {...props} />}
        {cur === 'usertest' && <UserTest key={doc.id} {...props} />}
        {cur === 'translation' && <Translation key={doc.id} {...props} />}
        {cur === 'core' && <Core key={doc.id} {...props} />}
        {cur === 'agency' && <Agency key={doc.id} {...props} />}
        {cur === 'changes' && <Changes key={project.id} {...props} />}
        {cur === 'export' && <Export key={doc.id} {...props} />}
      </div>
      {showAdd && <AddDoc project={project} product={product} onClose={() => setShowAdd(false)} onAdded={(d) => go(`/p/${project.id}/${d.id}/edit`)} />}
    </div>
  );
}

function AddDoc({ project, product, onClose, onAdded }) {
  const { pack, user, addDoc } = useApp();
  const [kind, setKind] = useState('pi');
  return (
    <Modal title="Add a label" onClose={onClose}>
      <label className="field">Kind
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          {kindsFor(pack, project.region).filter((k) => k !== 'pi-old').map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
      </label>
      <p className="small muted">The label starts empty, with the template's required sections in place.</p>
      <div className="row"><button className="btn primary" onClick={async () => { const d = await addDoc(blankDoc(pack, kind, product, project.id, user), 'Blank label'); onClose(); onAdded?.(d); }}>Add</button><button className="btn ghost" onClick={onClose}>Cancel</button></div>
    </Modal>
  );
}

function DrillBar({ project, docs }) {
  const { pack, product: productOf, saveAttempt, saveProject, toast } = useApp();
  const drill = pack.drills.drills.find((d) => d.id === project.drill.id);
  const sample = pack.samples.find((s) => s.id === drill?.sample);
  const [nowT, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!drill || !sample) return null;
  const r = evaluateDrill(drill, { docs, sample, pack, product: productOf(project.productId), project });
  const secs = Math.floor((nowT - Date.parse(project.drill.startedAt)) / 1000);
  const left = drill.minutes * 60 - secs;
  const mmss = (s) => `${s < 0 ? '-' : ''}${Math.floor(Math.abs(s) / 60)}:${String(Math.abs(s) % 60).padStart(2, '0')}`;
  const done = project.drill.done;
  const submit = async () => {
    await saveAttempt({ kind: 'drill', drillId: drill.id, score: r.score, seconds: secs, late: left < 0, projectId: project.id });
    await saveProject({ ...project, drill: { ...project.drill, done: { score: r.score, at: new Date().toISOString() } } });
    toast(`Drill saved: ${r.score}%${left < 0 ? ' (over time)' : ''}.`);
  };
  return (
    <div className="drill-bar" role="region" aria-label="Drill">
      <strong>Drill: {drill.title}</strong>
      {done ? <span>Submitted: {done.score}%.</span> : <span className={`timer ${left < 0 ? 'late' : ''}`} aria-label="Time left">{mmss(left)}</span>}
      <ul className="goal-list">{r.goals.map((g) => <li key={g.label} className={g.done ? 'done' : ''}>{g.label}</li>)}</ul>
      <span>Score now: <b>{r.score}%</b></span>
      {!done && <button className="btn small primary" onClick={submit}>Submit drill</button>}
      {done && project.drill.assignment && <a className="btn small primary" href="#/classroom">Send it to your class</a>}
      {done && <a className="btn small" href="#/drills">Back to drills</a>}
    </div>
  );
}
