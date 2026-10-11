// Client for the classroom API: the shared Cloudflare Worker + D1 in the eCTD Dossier Builder
// repository, routes under /lw/v1. Assignments are drills. Without classroom mode the app stays
// fully browser-only; this is the only feature that talks to a server.
import { getMeta, setMeta } from './db.js';
import { evaluateDrill } from './drills.js';
import { exportProject, FILE_KIND } from './io.js';

export const DEFAULT_API = 'https://ectd-classroom.randomthingsonlineatsk.workers.dev/lw/v1';
export const BUILT_IN_API = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLASSROOM_API) || DEFAULT_API;
export const SUBMISSION_KIND = 'labelling-workbench/drill-submission';
export const SERVICE = 'lw-classroom';

export async function loadSession() {
  const s = (await getMeta('classroom', null)) ?? {};
  return { ...s, api: s.api || BUILT_IN_API };
}
export const saveSession = (s) => setMeta('classroom', s);

export async function api(session, method, path, body) {
  if (!session.api) throw new Error('No classroom server is set.');
  const base = session.api.replace(/\/+$/, '');
  let res;
  try {
    res = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(session.token ? { authorization: `Bearer ${session.token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Could not reach the classroom server. Check the address and your connection.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `The classroom server answered ${res.status}.`);
  return data;
}

// What a student sends: the drill project as a project file, and the score the drill bar gave.
export function submissionPayload({ project, docs, versions, reviews, audit, pack, user, product }) {
  if (!project.drill?.id) throw new Error('This project is not a drill.');
  const drill = pack.drills.drills.find((d) => d.id === project.drill.id);
  const sample = pack.samples.find((s) => s.id === drill?.sample);
  const file = JSON.parse(exportProject({ project, docs, versions, reviews, audit, pack, user }));
  const r = evaluateDrill(drill, { docs, sample, pack, product, project });
  return {
    project: { ...file, kind: SUBMISSION_KIND, schema: 1, submittedAt: new Date().toISOString() },
    score: project.drill.done?.score ?? r.score,
    axes: null, counts: null,
    checks: r.goals.map((g, i) => ({ id: `g${i + 1}`, label: g.label, ok: g.done })),
  };
}

// The instructor re-scores the submitted drill in their own browser, with this copy of the app.
export function verifySubmission(file, { pack, productById }) {
  if (file?.kind !== SUBMISSION_KIND) throw new Error('This is not a Labelling Workbench drill submission.');
  const drill = pack.drills.drills.find((d) => d.id === file.project?.drill?.id);
  if (!drill) throw new Error(`Drill ${file.project?.drill?.id} is not in this version of the app.`);
  const sample = pack.samples.find((s) => s.id === drill.sample);
  const r = evaluateDrill(drill, { docs: file.docs ?? [], sample, pack, product: productById(file.project.productId), project: file.project });
  return { score: r.score, checks: r.goals.map((g, i) => ({ id: `g${i + 1}`, label: g.label, ok: g.done })) };
}

// A submission as a project file the importer accepts.
export const asProjectFile = (file) => JSON.stringify({ ...file, kind: FILE_KIND });
export const isLate = (assignment, submittedAt) => submittedAt > assignment.dueAt;
