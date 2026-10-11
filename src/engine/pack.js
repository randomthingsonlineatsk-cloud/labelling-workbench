// Content packs. The engine never hard-codes a region: templates, rules, vocabulary and samples
// come from the pack folders, built by tools/packs/<region>.py. All packs are merged into one at
// load: document kinds, rule ids and lesson ids are distinct per region, and each project names
// its region. The core pack (CCDS, change management, agency rounds, the proposed PMI) applies to
// every region.
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
import euPack from '../packs/eu/pack.json' with { type: 'json' };
import euTemplates from '../packs/eu/templates.json' with { type: 'json' };
import euRules from '../packs/eu/rules.json' with { type: 'json' };
import euVocab from '../packs/eu/vocab.json' with { type: 'json' };
import euSamples from '../packs/eu/samples.json' with { type: 'json' };
import euAgency from '../packs/eu/agency.json' with { type: 'json' };
import euLessons from '../packs/eu/lessons.json' with { type: 'json' };
import euQuiz from '../packs/eu/quiz.json' with { type: 'json' };
import euDrills from '../packs/eu/drills.json' with { type: 'json' };
import euGlossary from '../packs/eu/glossary.json' with { type: 'json' };
import inPack from '../packs/in/pack.json' with { type: 'json' };
import inTemplates from '../packs/in/templates.json' with { type: 'json' };
import inRules from '../packs/in/rules.json' with { type: 'json' };
import inVocab from '../packs/in/vocab.json' with { type: 'json' };
import inSamples from '../packs/in/samples.json' with { type: 'json' };
import inLessons from '../packs/in/lessons.json' with { type: 'json' };
import inQuiz from '../packs/in/quiz.json' with { type: 'json' };
import inDrills from '../packs/in/drills.json' with { type: 'json' };
import inGlossary from '../packs/in/glossary.json' with { type: 'json' };
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

const META = (p) => ({ id: p.id, name: p.name, short: p.short, version: p.version, asOf: p.asOf, about: p.about, watch: p.watch });

const merged = {
  ...usPack,
  regions: { us: META(usPack), eu: META(euPack), in: META(inPack) },
  kinds: [...usPack.kinds, 'pmi'],
  kindsByRegion: { us: [...usPack.kinds, 'pmi'], eu: euPack.kinds, in: inPack.kinds },
  langs: euPack.langs,
  watch: [...usPack.watch.map((w) => ({ ...w, region: 'us' })), ...euPack.watch.map((w) => ({ ...w, region: 'eu' })), ...inPack.watch.map((w) => ({ ...w, region: 'in' }))],
  sources: [...usPack.sources, ...corePack.sources, ...euPack.sources, ...inPack.sources],
  templates: { ...usTemplates, ...coreTemplates, ...euTemplates, ...inTemplates },
  rules: [...usRules, ...coreRules, ...euRules, ...inRules],
  vocab: { ...usVocab, promo: coreVocab.promo, eu: euVocab, in: inVocab },
  samples: [...usSamples.map((x) => ({ ...x, region: 'us' })), ...coreSamples.map(expandCoreSample), ...euSamples.map((x) => ({ ...x, module: 'eu' })), ...inSamples.map((x) => ({ ...x, region: 'in', module: 'in' }))],
  lessons: { ...usLessons, lessons: [...usLessons.lessons, ...coreLessons.lessons, ...euLessons.lessons, ...inLessons.lessons] },
  quiz: { topics: [...usQuiz.topics, ...coreQuiz.topics, ...euQuiz.topics, ...inQuiz.topics], questions: [...usQuiz.questions, ...coreQuiz.questions, ...euQuiz.questions, ...inQuiz.questions] },
  drills: { drills: [...usDrills.drills, ...coreDrills.drills, ...euDrills.drills, ...inDrills.drills] },
  glossary: { terms: [...usGlossary.terms.filter((t) => !/^CC(DS|SI)$|^PMI$/.test(t.term)), ...coreGlossary.terms, ...euGlossary.terms, ...inGlossary.terms].sort((a, b) => a.term.localeCompare(b.term)) },
  core: corePack,
  agency: { ...coreAgency, ...euAgency },
};

export const PACKS = { us: merged };
export const MODULES = { us: { id: 'us', label: 'US labelling', short: 'US' }, core: { id: 'core', label: 'Core data sheet and change management', short: 'Core' }, eu: { id: 'eu', label: 'EU product information', short: 'EU' }, in: { id: 'in', label: 'India labelling', short: 'India' } };
export const REGION_LABEL = { us: 'United States', eu: 'European Union', in: 'India' };
export const kindsFor = (pack, region = 'us') => pack.kindsByRegion?.[region] ?? pack.kinds;
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
  const asOf = Object.values(pack.regions ?? {}).map((r) => r.asOf).sort()[0] ?? pack.asOf;
  const d = new Date(`${asOf}T00:00:00Z`);
  return (today.getUTCFullYear() - d.getUTCFullYear()) * 12 + (today.getUTCMonth() - d.getUTCMonth());
}
