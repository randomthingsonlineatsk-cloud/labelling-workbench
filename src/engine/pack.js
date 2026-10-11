// Content packs. The engine never hard-codes a region: templates, rules, vocabulary and samples
// come from the pack folder, built by tools/packs/<region>.py.
import usPack from '../packs/us/pack.json' with { type: 'json' };
import usTemplates from '../packs/us/templates.json' with { type: 'json' };
import usRules from '../packs/us/rules.json' with { type: 'json' };
import usVocab from '../packs/us/vocab.json' with { type: 'json' };
import usSamples from '../packs/us/samples.json' with { type: 'json' };
import usLessons from '../packs/us/lessons.json' with { type: 'json' };
import usQuiz from '../packs/us/quiz.json' with { type: 'json' };
import usDrills from '../packs/us/drills.json' with { type: 'json' };
import usGlossary from '../packs/us/glossary.json' with { type: 'json' };
import products from '../data/products.json' with { type: 'json' };

export const PACKS = {
  us: { ...usPack, templates: usTemplates, rules: usRules, vocab: usVocab, samples: usSamples, lessons: usLessons, quiz: usQuiz, drills: usDrills, glossary: usGlossary },
};

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
    .replaceAll('{manufacturer}', meta.manufacturer ?? '')
    .replaceAll('{phone}', meta.phone ?? '');
}

// Age of a pack in months, for the banner shown when a pack is more than 12 months old.
export function packAgeMonths(pack, today = new Date()) {
  const d = new Date(`${pack.asOf}T00:00:00Z`);
  return (today.getUTCFullYear() - d.getUTCFullYear()) * 12 + (today.getUTCMonth() - d.getUTCMonth());
}
