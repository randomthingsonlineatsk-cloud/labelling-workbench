// A simplified electronic product information (ePI) view: the SmPC or leaflet as typed sections
// with stable identifiers and a language tag. Teaching aid only; it does not produce HL7 FHIR.
import { blockTexts } from './model.js';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function epiSections(doc) {
  const type = doc.kind === 'smpc' ? 'smpc' : 'pl';
  const out = [];
  const f = doc.fixed ?? {};
  if (f.blackTriangle) out.push({ id: `${type}-additional-monitoring`, title: 'Additional monitoring', paras: [f.blackTriangle] });
  if (f.readFirst) out.push({ id: `${type}-read-first`, title: 'Read all of this leaflet carefully', paras: [f.readFirst] });
  const add = (s) => out.push({ id: `${type}-${String(s.num).replace(/^pl/, '')}`, title: s.title, paras: (s.blocks ?? []).flatMap(blockTexts).filter((x) => x.trim()) });
  for (const s of doc.sections ?? []) { add(s); for (const x of s.subs ?? []) add(x); }
  if (f.lastRevised) out.push({ id: `${type}-last-revised`, title: 'Last revised', paras: [f.lastRevised] });
  return out;
}

export function epiHtml(doc) {
  const lang = doc.meta?.lang ?? 'en';
  const secs = epiSections(doc);
  return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><title>${esc(doc.title)} (ePI view, training)</title>
<style>body{font-family:system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;line-height:1.5}section{border-left:3px solid #ccc;padding-left:.75rem;margin:1rem 0}.id{font:12px monospace;color:#666}.wm{color:#a33;font-weight:600}</style></head><body>
<p class="wm">Training use only. Fictional product. Simplified ePI view, not an approved product information and not HL7 FHIR.</p>
<h1>${esc(doc.fixed?.header ?? doc.title)}</h1>
${secs.map((x) => `<section id="${esc(x.id)}"><div class="id">${esc(x.id)}</div><h2>${esc(x.title)}</h2>${x.paras.map((p) => `<p>${esc(p)}</p>`).join('')}</section>`).join('\n')}
</body></html>`;
}
