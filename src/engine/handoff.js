// Hand-off files to the other apps.
//  - Labelling package: the eCTD Dossier Builder imports it into US Module 1.14.
//  - CCSI file: the current core safety information, for a pharmacovigilance app.
//  - eCTD project file: read to start a labelling project for the same fictional product.
// Keep the labelling package schema in step with ectd-dossier-builder/src/engine/labelpkg.js.
import { now, KIND_LABEL, textEntries } from './model.js';
import { currentVersion } from './ccds.js';
import { slug } from './io.js';

export const LABEL_PKG_KIND = 'labelling-workbench/labelling-package';
export const CCSI_KIND = 'labelling-workbench/ccsi';
export const ECTD_PROJECT_KIND = 'ectd-dossier-builder/project';

// US Module 1.14 placement: draft (1.14.1) or final (1.14.2), by kind; listed drug in 1.14.3.
export function m1Section(doc, { annotated = false } = {}) {
  if (doc.role === 'reference') return '1.14.3.2';
  const final = doc.status === 'approved';
  if (doc.kind === 'carton' || doc.kind === 'container') return final ? '1.14.2.1' : '1.14.1.1';
  if (annotated) return '1.14.1.2';
  if (['mg', 'ppi', 'ifu', 'pmi'].includes(doc.kind)) return final ? '1.14.2.2' : '1.14.1.3';
  return final ? '1.14.2.3' : '1.14.1.3';
}

const plain = (doc) => textEntries(doc).map((e) => e.text).join('\n');
const pagesOf = (text) => Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 550));

export function labellingPackage({ project, docs, product, pack, user, change = null }) {
  const out = [];
  for (const d of docs) {
    const text = plain(d);
    const base = `${slug(product.brandName)}-${slug(KIND_LABEL[d.kind] ?? d.kind)}`;
    out.push({ id: d.id, kind: d.kind, role: d.role ?? null, status: d.status, version: d.version ?? 0, section: m1Section(d), title: `${product.brandName} ${d.role === 'reference' ? 'reference listed drug labeling' : KIND_LABEL[d.kind]}${d.status === 'approved' ? '' : ' (draft)'}`, fileName: `${base}${d.status === 'approved' ? '' : '-draft'}.pdf`, pages: pagesOf(text), content: text.slice(0, 20000) });
    const notes = d.kind === 'pi' && d.status !== 'approved' && d.role !== 'reference' && JSON.stringify(d.sections ?? []).includes('"note"');
    if (notes) out.push({ id: `${d.id}-annotated`, kind: d.kind, role: 'annotated', status: d.status, version: d.version ?? 0, section: m1Section(d, { annotated: true }), title: `${product.brandName} annotated draft labeling text`, fileName: `${base}-annotated.pdf`, pages: pagesOf(text) + 1, content: `Annotated draft labeling. Each statement is linked to its source in the Labelling Workbench export.\n\n${text.slice(0, 18000)}` });
  }
  const anyDraft = docs.some((d) => d.status !== 'approved');
  return {
    kind: LABEL_PKG_KIND, schema: 1, createdAt: now(),
    notice: 'Training only. Fictional product and company; not approved labeling and not suitable for a real submission.',
    app: { name: 'Labelling Workbench', author: 'Khan Gulrez Shagufa Fazal Ahmed' },
    userId: user?.userId ?? null, classId: user?.classId ?? null,
    projectId: project.id, region: 'US',
    product: { id: product.id, ectdProductId: product.id, brandName: product.brandName, inn: product.inn },
    pack: { id: pack.id, version: pack.version, asOf: pack.asOf },
    submission: {
      submissionType: 'labeling-supplement', subType: 'application',
      description: (change?.title ? `Labeling supplement: ${change.title}` : `Labeling for ${product.brandName}`) + (anyDraft ? ' (draft labeling)' : ''),
      trigger: change?.trigger ?? null, o4: change?.o4 ? { notifiedOn: change.o4.notifiedOn, response: change.o4.response } : null,
    },
    documents: out,
  };
}

export function ccsiFile({ project, product, user }) {
  const v = currentVersion(project.ccds);
  if (!v) throw new Error('There is no effective CCDS version.');
  return {
    kind: CCSI_KIND, schema: 1, createdAt: now(),
    notice: 'Training only. Fictional product; reference safety information for practice.',
    app: { name: 'Labelling Workbench', author: 'Khan Gulrez Shagufa Fazal Ahmed' },
    userId: user?.userId ?? null, classId: user?.classId ?? null,
    product: { id: product.id, brandName: product.brandName, inn: product.inn },
    ccds: { version: v.v, effective: v.date, owner: project.ccds.owner ?? '' },
    statements: v.statements.filter((s) => s.ccsi).map((s) => ({ key: s.key, heading: s.heading, text: s.text })),
    use: 'Reference safety information: an adverse reaction in these statements is listed; one that is not is unlisted.',
  };
}

// Reads an eCTD Dossier Builder project file and returns the product and region it is for.
export function productFromEctdFile(text, products) {
  let d;
  try { d = JSON.parse(text); } catch { throw new Error('This file is not valid JSON.'); }
  if (d?.kind !== ECTD_PROJECT_KIND || !d.project) throw new Error('This is not an eCTD Dossier Builder project file.');
  const p = products.find((x) => x.id === d.project.productId);
  if (!p) throw new Error(`The eCTD project is for a product this app does not have (${d.project.productId}).`);
  const region = d.project.region ?? 'US';
  return { product: p, region, name: d.project.name ?? '', warnings: !['US', 'EU'].includes(region) ? [`The eCTD project is for ${region}; this app has US and EU packs, so the labels start in US format.`] : [] };
}
