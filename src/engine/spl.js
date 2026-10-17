// Practice SPL-style XML. It follows the general shape of an HL7 SPL document (document,
// structuredBody, sections with LOINC section codes) so learners can see how a label becomes
// structured data. It is NOT a validated SPL file and is marked as such inside the file.
import { blockTexts, sectionTitle } from './model.js';

const LOINC = {
  bw: ['34066-1', 'BOXED WARNING SECTION'], rmc: ['43683-2', 'RECENT MAJOR CHANGES SECTION'],
  1: ['34067-9', 'INDICATIONS & USAGE SECTION'], 2: ['34068-7', 'DOSAGE & ADMINISTRATION SECTION'], 3: ['43678-2', 'DOSAGE FORMS & STRENGTHS SECTION'],
  4: ['34070-3', 'CONTRAINDICATIONS SECTION'], 5: ['43685-7', 'WARNINGS AND PRECAUTIONS SECTION'], 6: ['34084-4', 'ADVERSE REACTIONS SECTION'],
  7: ['34073-7', 'DRUG INTERACTIONS SECTION'], 8: ['43684-0', 'USE IN SPECIFIC POPULATIONS SECTION'], 8.1: ['42228-7', 'PREGNANCY SECTION'],
  8.2: ['77290-5', 'LACTATION SECTION'], 8.3: ['77291-3', 'FEMALES & MALES OF REPRODUCTIVE POTENTIAL SECTION'], 8.4: ['34081-0', 'PEDIATRIC USE SECTION'],
  8.5: ['34082-8', 'GERIATRIC USE SECTION'], 9: ['42227-9', 'DRUG ABUSE AND DEPENDENCE SECTION'], 10: ['34088-5', 'OVERDOSAGE SECTION'],
  11: ['34089-3', 'DESCRIPTION SECTION'], 12: ['34090-1', 'CLINICAL PHARMACOLOGY SECTION'], 12.1: ['43679-0', 'MECHANISM OF ACTION SECTION'],
  12.2: ['43681-6', 'PHARMACODYNAMICS SECTION'], 12.3: ['43682-4', 'PHARMACOKINETICS SECTION'], 13: ['43680-8', 'NONCLINICAL TOXICOLOGY SECTION'],
  13.1: ['34083-6', 'CARCINOGENESIS & MUTAGENESIS & IMPAIRMENT OF FERTILITY SECTION'], 14: ['34092-7', 'CLINICAL STUDIES SECTION'],
  15: ['34093-5', 'REFERENCES SECTION'], 16: ['34069-5', 'HOW SUPPLIED SECTION'], 17: ['34076-0', 'PATIENT COUNSELING INFORMATION SECTION'],
  mg: ['42231-1', 'SPL MEDGUIDE SECTION'], ppi: ['42230-3', 'SPL PATIENT PACKAGE INSERT SECTION'], ifu: ['59845-8', 'INSTRUCTIONS FOR USE SECTION'],
  carton: ['51945-4', 'PACKAGE LABEL.PRINCIPAL DISPLAY PANEL'], other: ['42229-5', 'SPL UNCLASSIFIED SECTION'],
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => '  '.repeat(n);
// Deterministic UUID-shaped id from a string, so the same label gives the same ids.
function idFor(s) {
  let h1 = 0x811c9dc5; let h2 = 0x1b873593;
  for (const c of String(s)) { h1 = Math.imul(h1 ^ c.charCodeAt(0), 16777619) >>> 0; h2 = Math.imul(h2 ^ c.charCodeAt(0), 2246822519) >>> 0; }
  const x = (h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0')).repeat(2);
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-4${x.slice(13, 16)}-a${x.slice(17, 20)}-${x.slice(20, 32)}`;
}

function textXml(blocks, d) {
  const out = [];
  for (const b of blocks ?? []) {
    if (b.t === 'ul') { out.push(`${pad(d)}<list listType="unordered">`); for (const i of b.items) out.push(`${pad(d + 1)}<item>${esc(i)}</item>`); out.push(`${pad(d)}</list>`); }
    else if (b.t === 'table' || b.t === 'ar') {
      out.push(`${pad(d)}<table><tbody>`);
      for (const r of b.rows) out.push(`${pad(d + 1)}<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`);
      out.push(`${pad(d)}</tbody></table>`);
    } else if (b.t === 'fig') out.push(`${pad(d)}<paragraph>[Figure placeholder] ${esc(b.text)}</paragraph>`);
    else if (blockTexts(b)[0]) out.push(`${pad(d)}<paragraph>${esc(b.text)}</paragraph>`);
  }
  return out;
}

function sectionXml(code, title, blocks, subs, d, seed) {
  const [c, name] = LOINC[code] ?? LOINC.other;
  const out = [`${pad(d)}<component>`, `${pad(d + 1)}<section>`, `${pad(d + 2)}<id root="${idFor(seed)}"/>`, `${pad(d + 2)}<code code="${c}" codeSystem="2.16.840.1.113883.6.1" displayName="${esc(name)}"/>`, `${pad(d + 2)}<title>${esc(title)}</title>`];
  const body = textXml(blocks, d + 3);
  if (body.length) out.push(`${pad(d + 2)}<text>`, ...body, `${pad(d + 2)}</text>`);
  for (const s of subs ?? []) out.push(...sectionXml(s.code, s.title, s.blocks, s.subs, d + 2, `${seed}/${s.title}`));
  out.push(`${pad(d + 1)}</section>`, `${pad(d)}</component>`);
  return out;
}

export function splXml(doc, { product, date = new Date().toISOString().slice(0, 10) } = {}) {
  const m = doc.meta ?? {};
  const seed = `${doc.id}/${doc.kind}`;
  const comps = [];
  if (doc.kind === 'carton' || doc.kind === 'container') {
    const f = doc.fields ?? {};
    comps.push(...sectionXml('carton', 'PACKAGE LABEL - PRINCIPAL DISPLAY PANEL', [{ t: 'p', text: Object.values(f).filter(Boolean).join(' | ') }], [], 3, seed));
  } else if (doc.kind === 'pi') {
    if (doc.bw) comps.push(...sectionXml('bw', doc.bw.title, doc.bw.blocks, [], 3, `${seed}/bw`));
    if (doc.hl?.rmc?.length) comps.push(...sectionXml('rmc', 'RECENT MAJOR CHANGES', [{ t: 'ul', items: doc.hl.rmc.map((r) => `${r.heading}${r.num ? ` (${r.num})` : ''} ${r.date}`) }], [], 3, `${seed}/rmc`));
    for (const s of doc.sections ?? []) {
      comps.push(...sectionXml(s.num, sectionTitle(s), s.blocks, (s.subs ?? []).map((x) => ({ code: x.num, title: sectionTitle(x), blocks: x.blocks })), 3, `${seed}/${s.num}`));
    }
  } else {
    const code = ['mg', 'ppi', 'ifu'].includes(doc.kind) ? doc.kind : 'other';
    comps.push(...sectionXml(code, doc.fixed?.header ?? doc.title, [], (doc.sections ?? []).map((s) => ({ code: 'other', title: s.title, blocks: s.blocks })), 3, seed));
  }
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- PRACTICE FILE made by the Labelling Workbench. This is an SPL-style teaching example, NOT a validated',
    '     Structured Product Labeling file, and must not be submitted. Product and company are fictional.',
    '     LOINC section codes are given for learning; check them against the current FDA SPL resources. -->',
    '<document xmlns="urn:hl7-org:v3">',
    `  <id root="${idFor(`${seed}/doc/${doc.version ?? 0}`)}"/>`,
    '  <code code="34391-3" codeSystem="2.16.840.1.113883.6.1" displayName="HUMAN PRESCRIPTION DRUG LABEL"/>',
    `  <title>${esc(`${m.proprietaryName ?? ''} (${m.establishedName ?? ''}) ${m.dosageForm ?? ''}${m.route ? `, ${m.route}` : ''}`)}</title>`,
    `  <effectiveTime value="${date.replaceAll('-', '')}"/>`,
    `  <setId root="${idFor(seed)}"/>`,
    `  <versionNumber value="${(doc.version ?? 0) + 1}"/>`,
    `  <author><assignedEntity><representedOrganization><name>${esc(m.manufacturer ?? product?.holder?.name ?? '')} (fictional)</name></representedOrganization></assignedEntity></author>`,
    '  <component>',
    '    <structuredBody>',
    ...comps.map((l) => `  ${l}`),
    '    </structuredBody>',
    '  </component>',
    '</document>',
    '',
  ].join('\n');
}
