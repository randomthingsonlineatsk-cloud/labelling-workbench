// Project file export and import: one JSON file with the project, its labels, versions,
// reviews and audit trail, the pack version used and a SHA-256 checksum of the contents.
import { SCHEMA_VERSION, uid } from './model.js';
import { sha256 } from './sha256.js';

export const FILE_KIND = 'labelling-workbench/project';

export function exportProject({ project, docs, versions, reviews, audit, pack, user }) {
  const body = { project, docs, versions, reviews, audit };
  return JSON.stringify({
    kind: FILE_KIND, schema: SCHEMA_VERSION, exportedAt: new Date().toISOString(),
    notice: 'Training use only. Fictional products and companies; not regulatory advice.',
    pack: { id: pack.id, version: pack.version, asOf: pack.asOf },
    user: { userId: user?.userId ?? null, classId: user?.classId ?? null, displayName: user?.displayName ?? '' },
    checksum: sha256(JSON.stringify(body)),
    ...body,
  }, null, 1);
}

// Returns the records to store, owned by the importing user, with fresh ids, plus warnings.
export function parseProjectFile(text, user, pack) {
  let d;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  if (d?.kind !== FILE_KIND) throw new Error('This is not a Labelling Workbench project file.');
  if (d.schema > SCHEMA_VERSION) throw new Error('This file was saved by a newer version of the app.');
  const warnings = [];
  const body = { project: d.project, docs: d.docs ?? [], versions: d.versions ?? [], reviews: d.reviews ?? [], audit: d.audit ?? [] };
  if (d.checksum && sha256(JSON.stringify(body)) !== d.checksum) warnings.push('The checksum does not match: the file was edited after export. It has been imported anyway.');
  if (d.pack && pack && d.pack.version !== pack.version) warnings.push(`This project was made with pack ${d.pack.version} (${d.pack.asOf}); this app uses ${pack.version} (${pack.asOf}). Some rules may have changed.`);
  const own = (x) => ({ ...x, importedFrom: { userId: x.userId ?? null, classId: x.classId ?? null }, userId: user?.userId ?? x.userId, classId: user?.classId ?? x.classId ?? null });
  const pid = uid('p');
  const docIds = Object.fromEntries(body.docs.map((x) => [x.id, uid('d')]));
  const project = own({ ...body.project, id: pid, title: `${body.project.title} (imported)` });
  if (project.proof?.docId) project.proof.docId = docIds[project.proof.docId] ?? null;
  return {
    warnings,
    project,
    docs: body.docs.map((x) => own({ ...x, id: docIds[x.id], projectId: pid })),
    versions: body.versions.map((x) => own({ ...x, id: uid('v'), docId: docIds[x.docId], projectId: pid, snapshot: { ...x.snapshot, id: docIds[x.docId], projectId: pid } })),
    reviews: body.reviews.map((x) => own({ ...x, id: uid('r'), docId: docIds[x.docId], projectId: pid })),
    audit: body.audit.map((x) => own({ ...x, id: uid('a'), entityId: docIds[x.entityId] ?? pid, projectId: pid })),
  };
}

export function download(filename, data, type = 'application/json') {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export const readFile = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsText(file);
});

export const slug = (s) => String(s ?? 'label').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
