// Content packs. The engine never hard-codes a region: templates, rules, vocabulary and samples
// come from the pack folder, built by tools/packs/<region>.py. The core pack (CCDS, change
// management, agency comment rounds, the proposed PMI) is merged into the US pack at load.
import usPack from '../packs/us/pack.json' with { type: 'json' };
import usTemplates from '../packs/us/templates.json' with { type: 'json' };
import usRules from '../packs/us/rules.json' with { type: 'json' };
import usVocab from '../packs/us/vocab.json' with { type: 'json' };
import usSamples from '../packs/us/samples.json' with { type: 'json' };
import usLessons from '../packs/us/lessons.json' with { type: 'json' };
import usQuiz from '../packs/us/quiz.json' with { type: 'json' };
import usDrills from '../packs/us/drills.json' with { type: 'json' };
import usGlossary from '../packs/us/glossary.json' with { type: 'json' };
import corePack from '../packs/core/pack.json' with { type: 'json' };
import coreRules from '../packs/core/rules.json' with { type: 'json' };
import coreVocab from '../packs/core/vocab.json' with { type: 'json' };
import coreTemplates from '../packs/core/templates.json' with { type: 'json' };
import coreAgency from '../packs/core/agency.json' with { type: 'json' };
import coreSamples from '../packs/core/samples.json' with { type: 'json' };
import coreLessons from '../packs/core/lessons.json' with { type: 'json' };
import coreQuiz from '../packs/core/quiz.json' with { type: 'json' };
import coreDrills from '../packs/core/drills.json' with { type: 'json' };
import coreGlossary from '../packs/core/glossary.json' with { type: 'json' };
import products from '../data/products.json' with { type: 'json' };

const clone = (x) => JSON.parse(JSON.stringify(x));

// A core sample names a base US sample, the documents to keep, text patches and extra blank docs.
function expandCoreSample(s) {
  const base = usSamples.find((x) => x.id === s.base);
  const docs = clone(base.docs.filter((d) => s.docs.includes(d.id)));
  for (const p of s.patch ?? []) {
    const d = docs.find((x) => x.id === p.doc);
    const sec = d?.sections?.find((x) => x.num === p.num);
    if (sec) sec.blocks.push({ id: `patch-${p.num}`, t: 'p', text: p.append });
  }
  for (const d of docs) d.status = s.approved ? 'approved' : d.status;
  return { ...s, docs, module: 'core', proof: null };
}

const merged = {
  ...usPack,
  kinds: [...usPack.kinds, 'pmi'],
  sources: [...usPack.sources, ...corePack.sources],
  templates: { ...usTemplates, ...coreTemplates },
  rules: [...usRules, ...coreRules],
  vocab: { ...usVocab, promo: coreVocab.promo },
  samples: [...usSamples, ...coreSamples.map(expandCoreSample)],
  lessons: { ...usLessons, lessons: [...usLessons.lessons, ...coreLessons.lessons] },
  quiz: { topics: [...usQuiz.topics, ...coreQuiz.topics], questions: [...usQuiz.questions, ...coreQuiz.questions] },
  drills: { drills: [...usDrills.drills, ...coreDrills.drills] },
  glossary: { terms: [...usGlossary.terms.filter((t) => !/^CC(DS|SI)$|^PMI$/.test(t.term)), ...coreGlossary.terms].sort((a, b) => a.term.localeCompare(b.term)) },
  core: corePack,
  agency: coreAgency,
};

export const PACKS = { us: merged };
export const MODULES = { us: { id: 'us', label: 'US labelling', short: 'US' }, core: { id: 'core', label: 'Core data sheet and change management', short: 'Core' } };
export const moduleOf = (x) => x?.module ?? 'us';

export const PRODUCTS = products.products;
export const productById = (id) => PRODUCTS.find((p) => p.id === id);

export const packFor = (region = 'us') => PACKS[region];
export const templateFor = (pack, kind) => pack.templates[kind];
export const ruleById = (pack, id) => pack.rules.find((r) => r.id === id);
export const sourceOf = (pack, id) => pack.sources.find((s) => s.id === id) ?? { id, title: id };

// Fill {name} / {NAME} / {manufacturer} placeholders in fixed statements and headings.
export function fill(text, meta = {}) {
  return String(text ?? '')
    .replaceAll('{NAME}', meta.proprietaryName ?? '')
    .replaceAll('{name}', meta.proprietaryName ?? '')
    .replaceAll('{established}', meta.establishedName ?? '')
    .replaceAll('{manufacturer}', meta.manufacturer ?? '')
    .replaceAll('{phone}', meta.phone ?? '');
}

// Age of a pack in months, for the banner shown when a pack is more than 12 months old.
export function packAgeMonths(pack, today = new Date()) {
  const d = new Date(`${pack.asOf}T00:00:00Z`);
  return (today.getUTCFullYear() - d.getUTCFullYear()) * 12 + (today.getUTCMonth() - d.getUTCMonth());
}
