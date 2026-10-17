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
import caPack from '../packs/ca/pack.json' with { type: 'json' };
import caTemplates from '../packs/ca/templates.json' with { type: 'json' };
import caRules from '../packs/ca/rules.json' with { type: 'json' };
import caSamples from '../packs/ca/samples.json' with { type: 'json' };
import chPack from '../packs/ch/pack.json' with { type: 'json' };
import chTemplates from '../packs/ch/templates.json' with { type: 'json' };
import chRules from '../packs/ch/rules.json' with { type: 'json' };
import chSamples from '../packs/ch/samples.json' with { type: 'json' };
import jpPack from '../packs/jp/pack.json' with { type: 'json' };
import jpTemplates from '../packs/jp/templates.json' with { type: 'json' };
import jpRules from '../packs/jp/rules.json' with { type: 'json' };
import jpSamples from '../packs/jp/samples.json' with { type: 'json' };
import auPack from '../packs/au/pack.json' with { type: 'json' };
import auTemplates from '../packs/au/templates.json' with { type: 'json' };
import auRules from '../packs/au/rules.json' with { type: 'json' };
import auSamples from '../packs/au/samples.json' with { type: 'json' };
import whoPack from '../packs/who/pack.json' with { type: 'json' };
import whoTemplates from '../packs/who/templates.json' with { type: 'json' };
import whoRules from '../packs/who/rules.json' with { type: 'json' };
import whoSamples from '../packs/who/samples.json' with { type: 'json' };
import intlRules from '../packs/intl/rules.json' with { type: 'json' };
import intlSamples from '../packs/intl/samples.json' with { type: 'json' };
import intlVocab from '../packs/intl/vocab.json' with { type: 'json' };
import intlLessons from '../packs/intl/lessons.json' with { type: 'json' };
import intlQuiz from '../packs/intl/quiz.json' with { type: 'json' };
import intlDrills from '../packs/intl/drills.json' with { type: 'json' };
import intlGlossary from '../packs/intl/glossary.json' with { type: 'json' };
import products from '../data/products.json' with { type: 'json' };
import { sha256 } from './sha256.js';

const clone = (x) => JSON.parse(JSON.stringify(x));

// A core sample names a base US sample, the documents to keep, text patches and extra blank docs.
function expandCoreSample(s) {
  const base = [...usSamples, ...euSamples].find((x) => x.id === s.base);
  const docs = clone(base.docs.filter((d) => s.docs.includes(d.id)));
  for (const p of s.patch ?? []) {
    const d = docs.find((x) => x.id === p.doc);
    const sec = d?.sections?.find((x) => x.num === p.num);
    if (sec) sec.blocks.push({ id: `patch-${p.num}`, t: 'p', text: p.append });
  }
  for (const d of docs) d.status = s.approved ? 'approved' : d.status;
  return { ...s, docs, module: 'core', proof: null };
}

const META = (p) => ({ id: p.id, name: p.name, short: p.short, version: p.version, asOf: p.asOf, about: p.about, watch: p.watch, changes: p.changes ?? [], sources: (p.sources ?? []).map((s) => s.id) });

const MORE = [[caPack, caTemplates, caRules, caSamples], [chPack, chTemplates, chRules, chSamples], [jpPack, jpTemplates, jpRules, jpSamples], [auPack, auTemplates, auRules, auSamples], [whoPack, whoTemplates, whoRules, whoSamples]];
const MORE_KINDS = MORE.flatMap(([p]) => p.kinds);

const merged = {
  ...usPack,
  regions: { us: META(usPack), eu: META(euPack), in: META(inPack), ...Object.fromEntries(MORE.map(([p]) => [p.id, META(p)])), intl: { id: 'intl', name: 'Several markets', short: 'Multi', version: caPack.version, asOf: caPack.asOf, changes: caPack.changes, about: 'The rule cards shared by the Canada, Switzerland, Japan, Australia and WHO packs (strengths, promotional wording), and the capstone that takes one safety change to four of these markets.', watch: [] } },
  kinds: [...usPack.kinds, 'pmi'],
  kindsByRegion: { us: [...usPack.kinds, 'pmi'], eu: euPack.kinds, in: inPack.kinds, ...Object.fromEntries(MORE.map(([p]) => [p.id, p.kinds])), intl: MORE_KINDS },
  langs: euPack.langs,
  watch: [...usPack.watch.map((w) => ({ ...w, region: 'us' })), ...euPack.watch.map((w) => ({ ...w, region: 'eu' })), ...inPack.watch.map((w) => ({ ...w, region: 'in' })), ...MORE.flatMap(([p]) => p.watch.map((w) => ({ ...w, region: p.id })))],
  sources: [...usPack.sources, ...corePack.sources, ...euPack.sources, ...inPack.sources, ...MORE.flatMap(([p]) => p.sources)],
  templates: { ...usTemplates, ...coreTemplates, ...euTemplates, ...inTemplates, ...Object.assign({}, ...MORE.map((m) => m[1])) },
  rules: [...usRules, ...coreRules, ...euRules, ...inRules, ...MORE.flatMap((m) => m[2]), ...intlRules],
  vocab: { ...usVocab, promo: coreVocab.promo, eu: euVocab, in: inVocab, intl: intlVocab },
  samples: [...usSamples.map((x) => ({ ...x, region: 'us' })), ...coreSamples.map(expandCoreSample), ...euSamples.map((x) => ({ ...x, module: 'eu' })), ...inSamples.map((x) => ({ ...x, region: 'in', module: 'in' })), ...MORE.flatMap((m) => m[3]).map((x) => ({ ...x, module: 'intl' })), ...intlSamples.map((x) => ({ ...x, module: 'intl' }))],
  lessons: { ...usLessons, lessons: [...usLessons.lessons, ...coreLessons.lessons, ...euLessons.lessons, ...inLessons.lessons, ...intlLessons.lessons] },
  quiz: { topics: [...usQuiz.topics, ...coreQuiz.topics, ...euQuiz.topics, ...inQuiz.topics, ...intlQuiz.topics], questions: [...usQuiz.questions, ...coreQuiz.questions, ...euQuiz.questions, ...inQuiz.questions, ...intlQuiz.questions] },
  drills: { drills: [...usDrills.drills, ...coreDrills.drills, ...euDrills.drills, ...inDrills.drills, ...intlDrills.drills] },
  glossary: { terms: [...usGlossary.terms.filter((t) => !/^CC(DS|SI)$|^PMI$/.test(t.term)), ...coreGlossary.terms, ...euGlossary.terms, ...inGlossary.terms, ...intlGlossary.terms].sort((a, b) => a.term.localeCompare(b.term)) },
  core: corePack,
  agency: { ...coreAgency, ...euAgency },
};

export const PACKS = { us: merged };
export const MODULES = { us: { id: 'us', label: 'US labelling', short: 'US' }, core: { id: 'core', label: 'Core data sheet and change management', short: 'Core' }, eu: { id: 'eu', label: 'EU product information', short: 'EU' }, in: { id: 'in', label: 'India labelling', short: 'India' }, intl: { id: 'intl', label: 'More markets: Canada, Switzerland, Japan, Australia, WHO PQ', short: 'More markets' } };
export const REGION_LABEL = { us: 'United States', eu: 'European Union', in: 'India', ca: 'Canada', ch: 'Switzerland', jp: 'Japan', au: 'Australia', who: 'WHO prequalification', intl: 'Several markets' };
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
    .replaceAll('{phone}', meta.phone ?? '')
    .replaceAll('{form}', meta.dosageForm ?? '');
}

// Rule fingerprints: one short hash per rule card that applies to a region (its own rules and the
// core rules). Stored with a project when it is made, so an old project opened with a newer pack
// can list the rules that were added, removed or changed since.
export function ruleStamp(pack, region = 'us') {
  const kinds = new Set(kindsFor(pack, region));
  const out = {};
  for (const r of pack.rules) {
    if (!r.id.startsWith('CORE-') && !r.kinds?.some((k) => kinds.has(k))) continue;
    out[r.id] = sha256(JSON.stringify([r.title, r.text, r.severity, r.kinds, r.at])).slice(0, 10);
  }
  return out;
}
export const packVersions = (pack) => Object.fromEntries([...Object.values(pack.regions ?? {}).map((r) => [r.id, r.version]), ['core', pack.core?.version]]);
export function ruleChanges(stamp, pack, region = 'us') {
  if (!stamp) return null;
  const now = ruleStamp(pack, region);
  const title = (id) => ruleById(pack, id)?.title ?? id;
  const added = Object.keys(now).filter((id) => !(id in stamp)).map((id) => ({ id, title: title(id) }));
  const removed = Object.keys(stamp).filter((id) => !(id in now)).map((id) => ({ id, title: id }));
  const changed = Object.keys(now).filter((id) => id in stamp && stamp[id] !== now[id]).map((id) => ({ id, title: title(id) }));
  return added.length + removed.length + changed.length ? { added, removed, changed } : null;
}

// Age of a pack in months, for the banner shown when a pack is more than 12 months old.
export function packAgeMonths(pack, today = new Date()) {
  const asOf = Object.values(pack.regions ?? {}).map((r) => r.asOf).sort()[0] ?? pack.asOf;
  const d = new Date(`${asOf}T00:00:00Z`);
  return (today.getUTCFullYear() - d.getUTCFullYear()) * 12 + (today.getUTCMonth() - d.getUTCMonth());
}
