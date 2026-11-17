// The patient leaflet (EU package leaflet or US Medication Guide) as a file for the Plain Language
// Lab, which practises readability, risk numbers and user testing on it. The structure stays in
// this app; the Lab reads the headings and text, and does not keep a second copy of the templates.
import { blocksText } from './model.js';

export const LEAFLET_KIND = 'labelling-workbench/patient-leaflet';
export const LEAFLET_KINDS = ['pl', 'mg'];

function flat(sections, out = [], depth = 0) {
  for (const s of sections ?? []) {
    out.push({ num: s.num, heading: s.title, depth, text: blocksText(s.blocks).trim() });
    flat(s.subs, out, depth + 1);
  }
  return out;
}

/** A package leaflet or Medication Guide as headings and text, with the product's names. */
export function leafletFile(doc, { app = 'Labelling Workbench' } = {}) {
  if (!LEAFLET_KINDS.includes(doc.kind)) throw new Error('Only a package leaflet or a Medication Guide can be sent to the Plain Language Lab.');
  const m = doc.meta ?? {};
  return {
    kind: LEAFLET_KIND, schema: 1, exportedUtc: new Date().toISOString(), app,
    region: doc.kind === 'pl' ? 'eu' : 'us', docKind: doc.kind, title: doc.title,
    product: { brand: m.proprietaryName ?? '', inn: m.establishedName ?? '', form: m.dosageForm ?? '', strengths: m.strengths ?? [], manufacturer: m.manufacturer ?? '' },
    sections: flat(doc.sections),
  };
}
