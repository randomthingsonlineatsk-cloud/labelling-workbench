// User-test simulator for EU package leaflets. Each round has 10 simulated participants. For
// each question, whether a participant finds and understands the answer depends on whether the
// answer is in the section the question points to and on how readable that section is (reading
// grade, sentence length, medical jargon). Results are deterministic for the same text, so a
// rewrite is what changes them. A simplification: real tests use real people.
import { findSection, blockTexts } from './model.js';
import { readingGrade, sentences, words } from './text.js';
import { sha256 } from './sha256.js';

export const PER_ROUND = 10;
export const PASS = 16; // of 20, on the final text
const JARGON = ['posology', 'titrated', 'pyrexia', 'rigors', 'dysuria', 'oedema', 'dyspnoea', 'thoracic', 'thromboembolic', 'thromboembolism', 'cutaneous', 'malignancy', 'hepatic', 'imperative', 'initiation', 'immunomodulation', 'predispose', 'manifestations', 'necessitating', 'subsequent', 'irrespective', 'administration', 'vasculature', 'lumiravostat-mediated'];

const items = (s) => (s ? [...(s.blocks ?? []), ...(s.subs ?? []).flatMap((x) => x.blocks ?? [])].flatMap(blockTexts).filter((x) => x.trim()) : []);
export const leafletHash = (doc) => sha256(JSON.stringify(doc.sections ?? [])).slice(0, 12);

export function sectionReadability(doc, num) {
  const its = items(findSection(doc, num));
  const text = its.join('. ');
  const ss = its.flatMap((x) => sentences(x));
  const ws = words(text);
  const grade = readingGrade(text) ?? 8;
  const avg = ss.length ? ws.length / ss.length : 0;
  const jargon = JARGON.filter((j) => new RegExp(`\\b${j}\\b`, 'i').test(text));
  return { text, grade, avg, jargon };
}

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
function rng(seedHex) {
  let s = parseInt(seedHex.slice(0, 8), 16) >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

export function questionOdds(doc, q) {
  const r = sectionReadability(doc, q.section);
  const present = new RegExp(q.answer, 'i').test(r.text);
  // Long sentences and medical jargon drive the difficulty; reading grade alone overrates short
  // patient texts that use long but familiar words (tuberculosis, ingredients), so it is shown, not scored.
  const hard = Math.max(0, r.avg - 20) * 0.015 + Math.min(0.6, r.jargon.length * 0.07);
  return { present, find: present ? clamp(0.99 - hard * 0.8, 0.2, 0.99) : 0.12, understand: present ? clamp(0.99 - hard, 0.1, 0.99) : 0.1, ...r };
}

export function runRound(doc, n, at = new Date().toISOString()) {
  const hash = leafletHash(doc);
  const results = {};
  for (const q of doc.userTest?.questions ?? []) {
    const o = questionOdds(doc, q);
    const rand = rng(sha256(`${hash}|${n}|${q.id}`));
    let found = 0; let understood = 0;
    for (let i = 0; i < PER_ROUND; i++) { if (rand() < o.find) { found++; if (rand() < o.understand) understood++; } }
    results[q.id] = { found, understood };
  }
  return { n, at, hash, results };
}

// Passed when the last two rounds were on the current text and every question reached 16 of 20.
export function userTestResult(doc) {
  const ut = doc.userTest;
  if (!ut) return { passed: false, summary: 'No user test set up.', perQuestion: [] };
  const hash = leafletHash(doc);
  const last = (ut.rounds ?? []).slice(-2);
  const sameText = last.length === 2 && last.every((r) => r.hash === hash);
  const perQuestion = (ut.questions ?? []).map((q) => {
    const ok = last.reduce((k, r) => k + (r.results[q.id]?.understood ?? 0), 0);
    return { id: q.id, q: q.q, score: sameText ? ok : null, pass: sameText && ok >= PASS };
  });
  const failing = perQuestion.filter((p) => !p.pass);
  const passed = sameText && failing.length === 0 && perQuestion.length > 0;
  const onText = (ut.rounds ?? []).slice(-2).filter((r) => r.hash === hash).length;
  const summary = passed ? 'User test passed: every question at 16 of 20 or better on the final text.'
    : !ut.rounds?.length ? 'The leaflet has not been user tested yet.'
      : !sameText ? (onText === 1 && ut.rounds.at(-1).hash === hash ? 'One round on the current text so far: a second round of 10 on the same text completes the 20 participants.' : 'The text has changed since the last round: two rounds of 10 on the final text are needed.')
        : `${failing.length} question(s) below 16 of 20 in the last two rounds.`;
  return { passed, sameText, summary, perQuestion };
}
