// Data model: projects hold label documents. A document is one region-specific label of one
// kind (PI, Medication Guide, carton...). Text lives in blocks inside sections; Highlights and
// carton fields have their own shapes. Every record carries userId and classId.
import { templateFor, fill, ruleStamp } from './pack.js';

export const SCHEMA_VERSION = 1;
export const uid = (p = 'x') => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
export const now = () => new Date().toISOString();
const clone = (x) => (typeof structuredClone === 'function' ? structuredClone(x) : JSON.parse(JSON.stringify(x)));

export const KIND_LABEL = { pi: 'Prescribing information', 'pi-old': 'Prescribing information (older format)', mg: 'Medication Guide', ppi: 'Patient Information', ifu: 'Instructions for Use', carton: 'Carton', container: 'Container label', pmi: 'Patient Medication Information (proposed)', smpc: 'SmPC', pl: 'Package leaflet', 'eu-outer': 'Outer carton (EU)', 'eu-blister': 'Blister (EU)', 'eu-annex2': 'Annex II (EU)', 'eu-small': 'Small immediate packaging (EU)', 'in-pi': 'Package insert (India)', 'in-carton': 'Carton (India)', 'in-label': 'Strip or container label (India)', 'ca-pm': 'Product monograph (Canada)', 'ca-pmi': 'Patient Medication Information (Canada)', 'ca-label': 'Outer label (Canada)', 'ch-fi': 'Fachinformation (Switzerland)', 'ch-pi': 'Patienteninformation (Switzerland)', 'jp-pi': 'Package insert (Japan)', 'au-pi': 'Product Information (Australia)', 'au-cmi': 'Consumer Medicine Information (Australia)', 'who-smpc': 'SmPC (WHO prequalification)' };
export const STATUS = { draft: 'Draft', review: 'In review', changes: 'Changes requested', approved: 'Approved', superseded: 'Superseded', submitted: 'Sent to agency' };

export const AR_HEAD = ['Adverse reaction', 'Drug (%)', 'Placebo (%)'];
export const isTable = (b) => b?.t === 'table' || b?.t === 'ar';
export const newBlock = (t = 'p') => ({ id: uid('b'), t, ...(t === 'ul' ? { items: [''] } : t === 'table' ? { rows: [['', ''], ['', '']] } : t === 'ar' ? { rows: [[...AR_HEAD], ['', '', '']] } : t === 'fig' ? { text: '', alt: '' } : { text: '' }) });
// Adverse-reaction table: the first row holds the column headings; every other cell after the
// term must be a percentage, a count or a frequency category. Returns the problems found.
export function arProblems(b) {
  const out = [];
  const rows = (b.rows ?? []).slice(1).filter((r) => r.some((c) => String(c ?? '').trim()));
  const cols = (b.rows?.[0] ?? []).length;
  if (cols < 2) out.push('Give at least a term column and one treatment column.');
  for (const [i, r] of rows.entries()) {
    if (!String(r[0] ?? '').trim()) out.push(`Row ${i + 1} has no adverse reaction term.`);
    for (const c of r.slice(1)) if (String(c ?? '').trim() && !/^(<\s*)?\d+(\.\d+)?\s*%?$|^\d+\s*\(\d+(\.\d+)?%?\)$|^(very common|common|uncommon|rare|very rare|not known)$/i.test(String(c).trim())) out.push(`Row ${i + 1}: "${c}" is not a percentage, a count or a frequency category.`);
    if (r.length !== cols) out.push(`Row ${i + 1} has ${r.length} cells; the headings have ${cols}.`);
  }
  return out;
}

function freshIds(doc) {
  const walk = (blocks) => (blocks ?? []).forEach((b) => { b.id = uid('b'); });
  if (doc.hl) for (const v of Object.values(doc.hl)) if (Array.isArray(v) && v[0]?.t) walk(v);
  if (doc.bw) walk(doc.bw.blocks);
  for (const s of doc.sections ?? []) { walk(s.blocks); for (const x of s.subs ?? []) walk(x.blocks); }
  return doc;
}

// A label document made from a sample, owned by the current user.
export function docFromSample(projectId, d, user) {
  const doc = freshIds(clone(d));
  return { ...doc, id: uid('d'), sampleDocId: d.id, projectId, userId: user?.userId ?? null, classId: user?.classId ?? null, status: d.status ?? 'draft', version: 0, waivers: {}, createdAt: now(), updatedAt: now() };
}

export function projectFromSample(sample, user, { pack = null, product = null } = {}) {
  const id = uid('p');
  const docs = sample.docs.map((d) => docFromSample(id, d, user));
  // Keep the sample's order: labels are listed by creation time.
  const t0 = Date.now();
  docs.forEach((d, i) => { d.createdAt = new Date(t0 + i).toISOString(); d.updatedAt = d.createdAt; });
  const project = { id, title: sample.title, productId: sample.productId, region: sample.region ?? 'us', sampleId: sample.id, about: sample.about, userId: user?.userId ?? null, classId: user?.classId ?? null, createdAt: now(), updatedAt: now(), proof: sample.proof ? clone(sample.proof) : null };
  if (project.proof) project.proof.docId = docs.find((d) => d.sampleDocId === sample.proof.docId)?.id ?? null;
  // Core samples: the CCDS, a starting mapping with recorded deviations, extra blank labels.
  if (sample.ccds) project.ccds = clone(sample.ccds);
  if (sample.mapped) for (const d of docs) if (d.kind === 'pi' || d.kind === 'mg') d.ccdsMap = { version: sample.mapped, rows: clone(sample.mappedRows?.[d.kind] ?? {}) };
  if (pack && product) for (const k of sample.blank ?? []) { const d = blankDoc(pack, k, product, id, user); d.sampleDocId = k; d.createdAt = new Date(t0 + docs.length).toISOString(); docs.push(d); }
  project.changes = [];
  if (pack) project.ruleStamp = ruleStamp(pack, project.region);
  return { project, docs };
}

// A blank document of a kind, with the template's sections in place and empty.
export function blankDoc(pack, kind, product, projectId, user) {
  const t = templateFor(pack, kind);
  if (EU_KINDS.includes(kind)) return blankEuDoc(pack, kind, product, projectId, user);
  if (IN_KINDS.includes(kind)) return blankInDoc(pack, kind, product, projectId, user);
  if (MORE_KINDS.includes(kind)) return blankMoreDoc(pack, kind, product, projectId, user);
  const meta = {
    proprietaryName: (product?.brandName ?? '').toUpperCase(), establishedName: product?.inn ?? '',
    dosageForm: (product?.dosageForm ?? '').split(',')[0], route: product?.route ? `for ${product.route} use` : '',
    controlled: '', initialApproval: product?.approvalDate?.slice(0, 4) ?? '', revised: '', manufacturer: product?.holder?.name ?? '', phone: '', patientLabeling: '',
  };
  const base = { id: uid('d'), kind, projectId, title: KIND_LABEL[kind], meta, status: 'draft', version: 0, waivers: {}, userId: user?.userId ?? null, classId: user?.classId ?? null, createdAt: now(), updatedAt: now() };
  if (kind === 'carton' || kind === 'container') {
    const fields = Object.fromEntries(t.fields.map((f) => [f.key, '']));
    Object.assign(fields, { proprietaryName: meta.proprietaryName, establishedName: product ? `(${product.inn}) ${meta.dosageForm}` : '', strength: product?.strengths?.[0] ?? '', dosageForm: meta.dosageForm, rxOnly: 'Rx only', lot: 'LOT: XXXXXX', expiry: 'EXP: YYYY-MM', mgStatement: '' });
    return { ...base, fields, sizes: { proprietaryName: 18, establishedName: 10, strength: 14 }, barcode: true, twoD: true, colour: '#2f6f6a', injectable: /inject|infusion/.test(product?.dosageForm ?? '') };
  }
  const sections = t.sections.filter((s) => s.need !== 'optional').map((s) => ({ num: s.num, title: s.title.includes('{name}') ? fill(s.title, meta) : s.title, blocks: [newBlock()], subs: (s.fixedSubs ?? []).filter((x) => x.need !== 'optional').map((x) => ({ num: x.num, title: fill(x.title, meta), blocks: [newBlock()] })) }));
  if (kind === 'pi') {
    const hl = { limitation: fill(t.fixed.limitation, meta), bw: [], bwClose: '', rmc: [], pci: t.fixed.pci };
    for (const h of t.hl) if (h.kind !== 'rmc') hl[h.key] = h.key === 'ar' ? [newBlock(), { ...newBlock(), text: fill(t.fixed.arContact, meta) }] : [newBlock()];
    return { ...base, meta, hl, bw: null, sections };
  }
  if (t.fixed) return { ...base, meta, fixed: Object.fromEntries(Object.entries(t.fixed).map(([k, v]) => [k, fill(v, meta)])), sections };
  return { ...base, meta, sections };
}

export const EU_KINDS = ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'];
export const IN_KINDS = ['in-pi', 'in-carton', 'in-label'];
export const MORE_KINDS = ['ca-pm', 'ca-pmi', 'ca-label', 'ch-fi', 'ch-pi', 'jp-pi', 'au-pi', 'au-cmi', 'who-smpc'];
export const regionOfKind = (kind) => (EU_KINDS.includes(kind) ? 'eu' : IN_KINDS.includes(kind) ? 'in' : MORE_KINDS.includes(kind) ? kind.split('-')[0] : 'us');

// Canada, Switzerland, Japan, Australia and WHO PQ documents: the template's sections, the
// product's regional details, and the fixed statements (the black triangle only when it applies).
function blankMoreDoc(pack, kind, product, projectId, user) {
  const t = templateFor(pack, kind);
  const r = kind.split('-')[0];
  const reg = product?.[r] ?? {};
  const upper = ['ca', 'jp', 'au'].includes(r);
  const meta = {
    proprietaryName: upper ? (product?.brandName ?? '').toUpperCase() : product?.brandName ?? '', establishedName: product?.inn ?? '', dosageForm: product?.dosageForm ?? '', route: product?.route ?? '',
    strengths: kind === 'ca-label' ? (product?.strengths ?? []).slice(0, 1) : product?.strengths ?? [], manufacturer: reg.holder?.name ?? reg.sponsor?.name ?? product?.holder?.name ?? '', lang: r === 'ch' ? 'de' : 'en',
  };
  if (r === 'ca') Object.assign(meta, { scheduleSymbol: 'Pr', revised: '', swp: false, ...(kind === 'ca-label' ? { sizes: { brand: 16, proper: 9 } } : {}) });
  if (r === 'ch') Object.assign(meta, { additionalMonitoring: !!reg.additionalMonitoring, authNumber: reg.authNumber ?? '' });
  if (r === 'jp') Object.assign(meta, { warnings: false });
  if (r === 'au') Object.assign(meta, { additionalMonitoring: !!reg.blackTriangle });
  if (r === 'who') Object.assign(meta, { pqRef: reg.pqRef ?? '' });
  const sections = t.sections.filter((s) => s.need !== 'optional').map((s) => ({ num: s.num, title: fill(s.title, meta), blocks: [newBlock()], subs: (s.fixedSubs ?? []).filter((x) => x.need !== 'optional').map((x) => ({ num: x.num, title: fill(x.title, meta), blocks: [newBlock()] })) }));
  const fixed = Object.fromEntries(Object.entries(t.fixed ?? {}).map(([k, v]) => [k, k === 'blackTriangle' && !meta.additionalMonitoring ? '' : fill(v, meta).replace('{month}', 'MONTH YEAR')]));
  return { id: uid('d'), kind, projectId, title: KIND_LABEL[kind], meta, fixed, sections, status: 'draft', version: 0, waivers: {}, userId: user?.userId ?? null, classId: user?.classId ?? null, createdAt: now(), updatedAt: now() };
}

// India documents: the CDSCO insert format or the Rule 96 label particulars. Brand names in
// capitals; schedule, Schedule H2 status and type sizes in the metadata. Labels start with the
// schedule's red box and symbol filled in, the insert with the RMP statement.
function blankInDoc(pack, kind, product, projectId, user) {
  const t = templateFor(pack, kind);
  const ind = product?.in ?? {};
  const meta = {
    proprietaryName: (product?.brandName ?? '').toUpperCase(), establishedName: product?.inn ?? '', dosageForm: product?.dosageForm ?? '', route: product?.route ?? '',
    strengths: kind === 'in-pi' ? product?.strengths ?? [] : (product?.strengths ?? []).slice(0, 1), manufacturer: ind.manufacturer ?? product?.holder?.name ?? '', revised: '',
    schedule: ind.schedule ?? 'H', h2: !!ind.h2, sizes: { proper: 14, brand: 10 }, lang: 'en',
  };
  const sch = pack.vocab?.in?.schedules?.[meta.schedule];
  const start = { c1: sch?.symbol ?? '', c11: 'B. No.: ', c12: 'Mfg. Date: MM/YYYY', c13: 'Exp. Date: MM/YYYY', c10: 'Mfg. Lic. No.: ' };
  const sections = t.sections.filter((s) => s.need !== 'optional').map((s) => {
    const blocks = s.num === 'c6' && sch ? [{ id: uid('b'), t: 'box', text: [sch.header, ...sch.text].join('\n') }] : [{ ...newBlock(), text: start[s.num] ?? '' }];
    return { num: s.num, title: s.title, blocks, subs: (s.fixedSubs ?? []).filter((x) => x.need !== 'optional').map((x) => ({ num: x.num, title: x.title, blocks: [newBlock()] })) };
  });
  const fixed = Object.fromEntries(Object.entries(t.fixed ?? {}).map(([k, v]) => [k, fill(v, meta)]));
  return { id: uid('d'), kind, projectId, title: KIND_LABEL[kind], meta, fixed, sections, status: 'draft', version: 0, waivers: {}, userId: user?.userId ?? null, classId: user?.classId ?? null, createdAt: now(), updatedAt: now() };
}

// EU documents: QRD sections, the product's EU details, names in normal case.
function blankEuDoc(pack, kind, product, projectId, user) {
  const t = templateFor(pack, kind);
  const eu = product?.eu ?? {};
  const meta = {
    proprietaryName: product?.brandName ?? '', establishedName: product?.inn ?? '', dosageForm: product?.dosageForm ?? '', route: product?.route ?? '',
    strengths: product?.strengths ?? [], manufacturer: eu.holder?.name ?? product?.holder?.name ?? '', revised: '', additionalMonitoring: !!eu.additionalMonitoring,
    excipients: eu.excipients ?? [], lang: 'en', procedure: eu.route ?? 'centralised', maNumber: eu.maNumber ?? '',
  };
  const sections = t.sections.filter((s) => s.need === 'required').map((s) => ({ num: s.num, title: fill(s.title, meta), blocks: [newBlock()], subs: (s.fixedSubs ?? []).filter((x) => x.need === 'required').map((x) => ({ num: x.num, title: fill(x.title, meta), blocks: [newBlock()] })) }));
  const fixed = Object.fromEntries(Object.entries(t.fixed ?? {}).map(([k, v]) => [k, k === 'blackTriangle' && !meta.additionalMonitoring ? '' : fill(v, meta)]));
  return { id: uid('d'), kind, projectId, title: KIND_LABEL[kind], meta, fixed, sections, status: 'draft', version: 0, waivers: {}, userId: user?.userId ?? null, classId: user?.classId ?? null, createdAt: now(), updatedAt: now() };
}

// ---------- reading text ----------
export const blockTexts = (b) => (b.t === 'ul' ? b.items ?? [] : isTable(b) ? (b.rows ?? []).flat() : [b.text ?? '']);
export const blocksText = (blocks) => (blocks ?? []).flatMap(blockTexts).join('\n');
export const hasContent = (blocks) => (blocks ?? []).some((b) => blockTexts(b).some((t) => t.trim()));

export function sectionTitle(s) { return s.num && /^\d/.test(s.num) ? `${s.num} ${s.title}` : s.title; }

// Every piece of text in a document with where it sits. loc.area: hl | bw | sec | field | fixed | meta
export function textEntries(doc) {
  const out = [];
  const add = (loc, text, blockId) => { if (text) out.push({ loc, text, blockId }); };
  const addBlocks = (loc, blocks) => (blocks ?? []).forEach((b) => blockTexts(b).forEach((t) => add(loc, t, b.id)));
  if (doc.kind === 'carton' || doc.kind === 'container') {
    for (const [k, v] of Object.entries(doc.fields ?? {})) add({ area: 'field', key: k, label: FIELD_LABEL[k] ?? k }, v);
    return out;
  }
  if (doc.hl) {
    add({ area: 'hl', key: 'lim', label: 'Highlights, limitation statement' }, doc.hl.limitation);
    addBlocks({ area: 'hl', key: 'bw', label: 'Highlights, boxed warning' }, doc.hl.bw);
    for (const [k, v] of Object.entries(doc.hl)) if (Array.isArray(v) && k !== 'bw' && k !== 'rmc') addBlocks({ area: 'hl', key: k, label: `Highlights, ${HL_LABEL[k] ?? k}` }, v);
    add({ area: 'hl', key: 'pci', label: 'Highlights, counselling statement' }, doc.hl.pci);
  }
  if (doc.bw) { add({ area: 'bw', key: 'bw', label: 'Boxed warning' }, doc.bw.title); addBlocks({ area: 'bw', key: 'bw', label: 'Boxed warning' }, doc.bw.blocks); }
  for (const s of doc.sections ?? []) {
    addBlocks({ area: 'sec', key: s.num, label: sectionTitle(s) }, s.blocks);
    for (const x of s.subs ?? []) addBlocks({ area: 'sec', key: x.num, label: sectionTitle(x) }, x.blocks);
  }
  if (doc.fixed) for (const [k, v] of Object.entries(doc.fixed)) add({ area: 'fixed', key: k, label: `Fixed statement (${k})` }, v);
  return out;
}

export const FIELD_LABEL = { proprietaryName: 'Proprietary name', establishedName: 'Established name', strength: 'Strength', dosageForm: 'Dosage form', route: 'Route', netQuantity: 'Net quantity', rxOnly: 'Rx only statement', ndc: 'NDC', dosageStatement: 'Dosage statement', storage: 'Storage', lot: 'Lot number', expiry: 'Expiration date', manufacturer: 'Manufacturer', mgStatement: 'Medication Guide statement' };
export const HL_LABEL = { rmc: 'Recent Major Changes', ind: 'Indications and Usage', da: 'Dosage and Administration', dfs: 'Dosage Forms and Strengths', ci: 'Contraindications', wp: 'Warnings and Precautions', ar: 'Adverse Reactions', di: 'Drug Interactions', usp: 'Use in Specific Populations' };

// All section and subsection numbers present in a document.
export function sectionNums(doc) {
  const set = new Set();
  for (const s of doc.sections ?? []) { set.add(s.num); for (const x of s.subs ?? []) set.add(x.num); }
  return set;
}
export function findSection(doc, num) {
  for (const s of doc.sections ?? []) {
    if (s.num === num) return s;
    for (const x of s.subs ?? []) if (x.num === num) return x;
  }
  return null;
}

// ---------- editing helpers ----------
// Rewrite cross-references after subsections move: map is { oldNum: newNum }.
export function rewriteRefs(doc, map) {
  if (!Object.keys(map).length) return doc;
  const re = /\(((?:\d{1,2}(?:\.\d{1,2})?)(?:\s*,\s*\d{1,2}(?:\.\d{1,2})?)*)\)/g;
  const fix = (t) => String(t).replace(re, (m, inner) => `(${inner.split(/\s*,\s*/).map((n) => map[n] ?? n).join(', ')})`);
  const fixBlocks = (blocks) => (blocks ?? []).forEach((b) => {
    if (b.t === 'ul') b.items = b.items.map(fix); else if (isTable(b)) b.rows = b.rows.map((r) => r.map(fix)); else b.text = fix(b.text ?? '');
  });
  if (doc.hl) { for (const v of Object.values(doc.hl)) if (Array.isArray(v) && v[0]?.id) fixBlocks(v); for (const r of doc.hl.rmc ?? []) if (map[r.num]) r.num = map[r.num]; }
  if (doc.bw) fixBlocks(doc.bw.blocks);
  for (const s of doc.sections ?? []) { fixBlocks(s.blocks); for (const x of s.subs ?? []) fixBlocks(x.blocks); }
  return doc;
}

// Move a free subsection up or down within its section; numbers follow the order and
// every cross-reference in the document is rewritten. Fixed subsections (8.x, 12.x) never move.
export function moveSub(doc, parentNum, index, dir) {
  const s = doc.sections.find((x) => x.num === parentNum);
  const j = index + dir;
  if (!s || j < 0 || j >= s.subs.length) return doc;
  [s.subs[index], s.subs[j]] = [s.subs[j], s.subs[index]];
  return renumberSubs(doc, parentNum);
}
export function renumberSubs(doc, parentNum) {
  const s = doc.sections.find((x) => x.num === parentNum);
  const map = {};
  s.subs.forEach((x, i) => { const n = `${parentNum}.${i + 1}`; if (x.num !== n) { map[x.num] = n; x.num = n; } });
  return rewriteRefs(doc, map);
}

export function touch(x) { return { ...x, updatedAt: now() }; }
