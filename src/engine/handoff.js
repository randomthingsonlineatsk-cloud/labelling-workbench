// Hand-off files to the other apps.
//  - Labelling package: the eCTD Dossier Builder imports it into the Module 1 labelling node of
//    the project's region (US 1.14, EU 1.3.1, India 1.3, Canada 1.3.1/1.3.2, Switzerland
//    1.3.1/1.3.2, Japan 1.8).
//  - CCSI file: the current core safety information, for a pharmacovigilance app.
//  - eCTD project file: read to start a labelling project for the same fictional product.
// Keep the labelling package schema in step with ectd-dossier-builder/src/engine/labelpkg.js.
import { now, KIND_LABEL, textEntries } from './model.js';
import { currentVersion } from './ccds.js';
import { slug } from './io.js';

export const LABEL_PKG_KIND = 'labelling-workbench/labelling-package';
export const CCSI_KIND = 'labelling-workbench/ccsi';
export const ECTD_PROJECT_KIND = 'ectd-dossier-builder/project';

// Regions the eCTD Dossier Builder has a Module 1 for, and the default submission for a labelling change.
export const PKG_REGIONS = { us: 'US', eu: 'EU', in: 'IN', ca: 'CA', ch: 'CH', jp: 'JP' };
const SUBMISSION = {
  us: { submissionType: 'labeling-supplement', subType: 'application' },
  eu: { submissionType: 'var-type2', subType: 'initial' },
  in: { submissionType: 'post-approval-change', subType: 'application' },
  ca: { submissionType: 'snds', subType: 'initial' },
  ch: { submissionType: 'var-type2', subType: 'initial' },
  jp: { submissionType: 'jp_partial-change', subType: 'jp_ctd' },
};
export const PKG_NODE = { eu: 'EU 1.3.1 (SmPC, Annex II, labelling and package leaflet, combined)', in: 'India 1.3 (general information on the drug product)', ca: 'Canada 1.3.1 (product monograph) and 1.3.2 (labels)', ch: 'Switzerland 1.3.1 (information for professionals) and 1.3.2 (patient information)', jp: 'Japan 1.8 (draft package insert)', us: 'US 1.14 (draft 1.14.1, final 1.14.2)' };
const regionOf = (doc) => (/^(smpc|pl|eu-)/.test(doc.kind) ? 'eu' : String(doc.kind).split('-')[0]);

// US Module 1.14 placement: draft (1.14.1) or final (1.14.2), by kind; listed drug in 1.14.3.
// Other regions: their Module 1 product-information node.
export function m1Section(doc, { annotated = false } = {}) {
  const r = regionOf(doc);
  if (r === 'eu') return 'eu:1.3.1';
  if (r === 'in') return 'in:1.3';
  if (r === 'ca') return doc.kind === 'ca-label' ? 'ca:1.3.2' : 'ca:1.3.1';
  if (r === 'ch') return doc.kind === 'ch-pi' ? 'ch:1.3.2' : 'ch:1.3.1';
  if (r === 'jp') return 'jp:1.8';
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
  const region = project.region ?? 'us';
  if (!PKG_REGIONS[region]) throw new Error('The eCTD Dossier Builder has no Module 1 for this region.');
  const out = [];
  // EU: the SmPC, Annex II, labelling and leaflet go in 1.3.1 as one combined document per language.
  if (region === 'eu') {
    const eu = docs.filter((d) => d.role !== 'reference' && d.role !== 'translation');
    const text = eu.map((d) => `${KIND_LABEL[d.kind]}\n${plain(d)}`).join('\n\n');
    const final = eu.every((d) => d.status === 'approved');
    out.push({ id: `${project.id}-combined`, kind: 'eu-combined', role: null, status: final ? 'approved' : 'draft', version: Math.max(0, ...eu.map((d) => d.version ?? 0)), section: 'eu:1.3.1', lang: 'en',
      title: `SmPC, Annex II, Labelling and Package Leaflet (English) - ${product.brandName}${final ? '' : ' (draft)'}`, fileName: `ema-${slug(product.brandName)}-combined-pi-en${final ? '' : '-draft'}.pdf`, pages: pagesOf(text), content: text.slice(0, 20000) });
    docs = [];
  }
  for (const d of docs) {
    if (region !== 'us' && d.role === 'reference') continue;
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
    projectId: project.id, region: PKG_REGIONS[region],
    product: { id: product.id, ectdProductId: product.id, brandName: product.brandName, inn: product.inn },
    pack: { id: pack.id, version: pack.version, asOf: pack.asOf },
    submission: {
      ...SUBMISSION[region],
      description: (change?.title ? `${region === 'us' ? 'Labeling supplement' : 'Product information change'}: ${change.title}` : `Labelling for ${product.brandName}`) + (anyDraft || out.some((x) => x.status !== 'approved') ? ' (draft labelling)' : ''),
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
  return { product: p, region, name: d.project.name ?? '', warnings: !['US', 'EU', 'IN', 'CA', 'CH', 'JP'].includes(region) ? [`The eCTD project is for ${region}; this app has no pack for it, so the labels start in US format.`] : [] };
}
