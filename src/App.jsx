import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppCtx } from './ctx.js';
import { db, getUser, getMeta, setMeta } from './engine/db.js';
import { PACKS, productById, packAgeMonths, REGION_LABEL } from './engine/pack.js';
import { projectFromSample, blankDoc, uid, now } from './engine/model.js';
import { sampleChange } from './engine/changes.js';
import { parseProjectFile } from './engine/io.js';
import Home from './screens/Home.jsx';
import Project from './screens/Project.jsx';
import { Learn, Lesson } from './screens/Learn.jsx';
import Quiz from './screens/Quiz.jsx';
import Drills from './screens/Drills.jsx';
import Glossary from './screens/Glossary.jsx';
import Progress from './screens/Progress.jsx';
import Rules from './screens/Rules.jsx';
import Classroom from './screens/Classroom.jsx';
import { Mark } from './components/ui.jsx';

function useHashRoute() {
  const read = () => (window.location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean).map(decodeURIComponent);
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const on = () => { setParts(read()); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parts;
}

const NAV = [['', 'Projects'], ['learn', 'Learn'], ['quiz', 'Quiz'], ['drills', 'Drills'], ['progress', 'Progress'], ['classroom', 'Classroom'], ['rules', 'Rules and sources']];

export default function App() {
  const route = useHashRoute();
  const pack = PACKS.us;
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [docs, setDocs] = useState([]);
  const [versions, setVersions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [audit, setAudit] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [lessonsDone, setLessonsDone] = useState({});
  const [theme, setTheme] = useState('system');
  const [toasts, setToasts] = useState([]);
  const [dbError, setDbError] = useState(null);
  const timers = useRef({});
  const lastAudit = useRef({});

  const toast = useCallback((text, kind = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), kind === 'info' ? 3500 : 7000);
  }, []);

  const reload = useCallback(async () => {
    const [p, d, v, r, a, at] = await Promise.all(['projects', 'docs', 'versions', 'reviews', 'audit', 'attempts'].map((s) => db.all(s)));
    p.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
    setProjects(p); setDocs(d); setVersions(v); setReviews(r); setAudit(a); setAttempts(at);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setUser(await getUser());
        setLessonsDone(await getMeta('lessons', {}));
        setTheme(await getMeta('theme', 'system'));
        await reload();
      } catch {
        setDbError('Your browser blocked local storage (IndexedDB). Work cannot be saved in this window; try a normal, non-private window.');
      }
    })();
  }, [reload]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => { window.scrollTo(0, 0); }, [route[0], route[1]]);

  const stamp = useCallback((x) => ({ ...x, userId: user?.userId ?? null, classId: user?.classId ?? null }), [user]);

  // Audit entries for edits are merged per document and place within two minutes, so typing
  // does not flood the trail.
  const addAudit = useCallback(async (entry) => {
    const k = `${entry.entityId}|${entry.action}|${entry.detail}`;
    const prev = lastAudit.current[k];
    const at = now();
    if (entry.action === 'edit' && prev && Date.now() - prev.t < 120000) {
      const rec = { ...prev.rec, at };
      lastAudit.current[k] = { t: Date.now(), rec };
      await db.put('audit', rec);
      setAudit((a) => a.map((x) => (x.id === rec.id ? rec : x)));
      return;
    }
    const rec = stamp({ id: uid('a'), at, ...entry });
    lastAudit.current[k] = { t: Date.now(), rec };
    await db.put('audit', rec);
    setAudit((a) => [...a, rec]);
  }, [stamp]);

  const ctx = useMemo(() => ({
    pack, user, projects, docs, versions, reviews, audit, attempts, lessonsDone, toast, reload, theme,
    product: (id) => productById(id),
    projectById: (id) => projects.find((p) => p.id === id),
    docsOf: (pid) => docs.filter((d) => d.projectId === pid).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    updateUser: async (fields) => { const next = { ...user, ...fields }; setUser(next); await setMeta('user', next); },
    // Editing: state updates at once, IndexedDB writes are debounced per document.
    updateDoc: (doc, { detail = 'edited', action = 'edit' } = {}) => {
      const next = { ...doc, updatedAt: now() };
      setDocs((ds) => ds.map((d) => (d.id === next.id ? next : d)));
      clearTimeout(timers.current[next.id]);
      timers.current[next.id] = setTimeout(() => { db.put('docs', next); }, 350);
      addAudit({ entity: 'doc', entityId: next.id, projectId: next.projectId, action, detail });
      setProjects((ps) => ps.map((p) => (p.id === next.projectId ? { ...p, updatedAt: next.updatedAt } : p)));
      return next;
    },
    saveDocNow: async (doc, auditEntry) => {
      const next = { ...doc, updatedAt: now() };
      clearTimeout(timers.current[next.id]);
      await db.put('docs', next);
      setDocs((ds) => (ds.some((d) => d.id === next.id) ? ds.map((d) => (d.id === next.id ? next : d)) : [...ds, next]));
      if (auditEntry) await addAudit({ entity: 'doc', entityId: next.id, projectId: next.projectId, ...auditEntry });
      return next;
    },
    deleteDoc: async (doc) => { await db.del('docs', doc.id); setDocs((ds) => ds.filter((d) => d.id !== doc.id)); await addAudit({ entity: 'doc', entityId: doc.id, projectId: doc.projectId, action: 'delete', detail: doc.title }); },
    // State first, then storage, so typing into project-level fields (CCDS, change requests) keeps up.
    saveProject: async (p) => { const next = { ...p, updatedAt: now() }; setProjects((ps) => [next, ...ps.filter((x) => x.id !== next.id)]); await db.put('projects', next); return next; },
    deleteProject: async (p) => {
      for (const d of docs.filter((x) => x.projectId === p.id)) await db.del('docs', d.id);
      for (const v of versions.filter((x) => x.projectId === p.id)) await db.del('versions', v.id);
      for (const r of reviews.filter((x) => x.projectId === p.id)) await db.del('reviews', r.id);
      await db.del('projects', p.id);
      await reload();
    },
    createFromSample: async (sampleId, extra = {}) => {
      const sample = pack.samples.find((s) => s.id === sampleId);
      const { project, docs: ds } = projectFromSample(sample, user, { pack, product: productById(sample.productId) });
      const c = sampleChange(pack.core, sample, ds, user);
      if (c) project.changes = [c];
      Object.assign(project, extra);
      await db.put('projects', project);
      for (const d of ds) await db.put('docs', d);
      await addAudit({ entity: 'project', entityId: project.id, projectId: project.id, action: 'create', detail: `From sample: ${sample.title}` });
      await reload();
      return { project, docs: ds };
    },
    createBlank: async ({ productId, kinds, title, region = 'us' }) => {
      const product = productById(productId);
      const project = stamp({ id: uid('p'), title: title || `${product.brandName}: new ${region === 'eu' ? 'EU product information' : region === 'in' ? 'India label set' : region === 'us' ? 'label set' : `${REGION_LABEL[region] ?? region} product information`}`, productId, region, createdAt: now(), updatedAt: now() });
      await db.put('projects', project);
      for (const k of kinds) {
        const d = blankDoc(pack, k, product, project.id, user);
        if (k === 'pi' && kinds.includes('mg')) d.meta.patientLabeling = 'mg';
        if (k === 'pi' && kinds.includes('mg')) d.hl.pci = pack.templates.pi.fixed.pciMG;
        await db.put('docs', d);
      }
      await addAudit({ entity: 'project', entityId: project.id, projectId: project.id, action: 'create', detail: 'Blank project' });
      await reload();
      return project;
    },
    addDoc: async (doc, detail = 'Added') => { await db.put('docs', doc); setDocs((ds) => [...ds, doc]); await addAudit({ entity: 'doc', entityId: doc.id, projectId: doc.projectId, action: 'create', detail }); return doc; },
    addVersion: async (v) => { const rec = stamp({ id: uid('v'), at: now(), ...v }); await db.put('versions', rec); setVersions((x) => [...x, rec]); return rec; },
    putVersion: async (v) => { await db.put('versions', v); setVersions((x) => x.map((y) => (y.id === v.id ? v : y))); },
    addReview: async (r) => { const rec = stamp({ id: uid('r'), at: now(), ...r }); await db.put('reviews', rec); setReviews((x) => [...x, rec]); await addAudit({ entity: 'doc', entityId: r.docId, projectId: r.projectId, action: r.action, detail: r.text?.slice(0, 120) ?? '' }); return rec; },
    putReview: async (r) => { await db.put('reviews', r); setReviews((x) => x.map((y) => (y.id === r.id ? r : y))); },
    addAudit,
    saveAttempt: async (fields) => { const rec = stamp({ id: uid('t'), at: now(), region: 'us', ...fields }); await db.put('attempts', rec); setAttempts((x) => [...x, rec]); return rec; },
    saveLesson: async (id, score) => {
      const key = `us-${id}`;
      const next = { ...lessonsDone, [key]: { best: Math.max(score, lessonsDone[key]?.best ?? 0), at: now(), userId: user?.userId, classId: user?.classId ?? null } };
      setLessonsDone(next); await setMeta('lessons', next);
    },
    importProject: async (text) => {
      const r = parseProjectFile(text, user, pack);
      await db.put('projects', r.project);
      for (const d of r.docs) await db.put('docs', d);
      for (const v of r.versions) await db.put('versions', v);
      for (const x of r.reviews) await db.put('reviews', x);
      for (const x of r.audit) await db.put('audit', x);
      await reload();
      return r;
    },
  }), [pack, user, projects, docs, versions, reviews, audit, attempts, lessonsDone, toast, reload, theme, addAudit, stamp]);

  const [section, a, b, c] = route;
  let screen;
  if (!section) screen = <Home />;
  else if (section === 'p' && a) screen = <Project key={a} id={a} docId={b} tab={c} />;
  else if (section === 'learn' && a) screen = <Lesson id={Number(a)} />;
  else if (section === 'learn') screen = <Learn />;
  else if (section === 'quiz') screen = <Quiz />;
  else if (section === 'drills') screen = <Drills />;
  else if (section === 'glossary') screen = <Glossary />;
  else if (section === 'progress') screen = <Progress />;
  else if (section === 'rules') screen = <Rules />;
  else if (section === 'classroom') screen = <Classroom />;
  else screen = <div className="page"><h1>Page not found</h1><p><a href="#/">Go to your projects</a></p></div>;

  const cycleTheme = async () => {
    const next = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
    setTheme(next); try { await setMeta('theme', next); } catch { /* storage blocked */ }
  };
  const current = section === 'p' ? '' : section === 'glossary' ? 'learn' : (section ?? '');
  const age = packAgeMonths(pack);

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        <a href="#main" className="sr-only">Skip to content</a>
        <header className="topbar">
          <a className="brand" href="#/"><Mark /> Labelling Workbench</a>
          <nav className="nav" aria-label="Main">
            {NAV.map(([k, l]) => <a key={k} href={`#/${k}`} aria-current={current === k ? 'page' : undefined}>{l}</a>)}
          </nav>
          <span className="spacer" />
          <button className="btn small ghost" onClick={cycleTheme} aria-label={`Theme: ${theme}. Change theme`}>Theme: {theme}</button>
        </header>
        {age > 12 && <div className="banner" role="note">A content pack is more than 12 months old (see Rules and sources). Rules may have changed since; check the sources before relying on a result.</div>}
        {dbError && <div className="callout bad" role="alert" style={{ margin: '1rem' }}>{dbError}</div>}
        <main id="main">{user || dbError ? screen : <div className="page muted">Loading…</div>}</main>
        <footer className="footer">
          <span>Built by <strong>Khan Gulrez Shagufa Fazal Ahmed</strong></span>
          <span>Training use only. Products, companies and people are fictional; nothing here is an approved label or regulatory advice. Your work stays in this browser.</span>
          <span>{Object.values(pack.regions).map((r) => `${r.short} pack ${r.version} (${r.asOf})`).join(' · ')} · Apache-2.0</span>
        </footer>
        <div className="toasts" aria-live="polite">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.kind}`} role={t.kind === 'error' ? 'alert' : 'status'}>
              <span>{t.text}</span>
              <button onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))} aria-label="Dismiss">✕</button>
            </div>
          ))}
        </div>
      </div>
    </AppCtx.Provider>
  );
}
