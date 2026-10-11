// India checks: package insert headings and statements, Rule 96 label particulars, the Rule 97
// red-box caution and Rx symbol, proper-name type size, MRP, Schedule H2 QR code, strengths,
// Schedule J claims and promotional words. Called from runChecks for India document kinds. Every
// check is tied to a rule card in the India pack.
import { templateFor } from './pack.js';
import { findSection, blocksText, hasContent, textEntries, sectionTitle } from './model.js';
import { strengths, normStrength, norm, escapeRe } from './text.js';

export const IN_KINDS = ['in-pi', 'in-carton', 'in-label'];

const secText = (s) => (s ? [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))].join('\n') : '');
const filled = (s) => !!s && (hasContent(s.blocks) || (s.subs ?? []).some((x) => hasContent(x.blocks)));
const L = (s, title) => ({ area: 'sec', key: s?.num ?? title, label: s ? sectionTitle(s) : title });
const META = (key, label) => ({ area: 'fixed', key, label });
const simple = (t) => norm(String(t ?? '')).toLowerCase().replace(/[‐‑‒–—―-]/g, '-').replace(/\s+/g, ' ').trim();
const inVocab = (ctx) => ctx.pack.vocab?.in ?? {};
const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec';
const DATE_RE = new RegExp(`\\b\\d{1,2}[./-]\\d{1,2}[./-]\\d{2,4}\\b|\\b\\d{1,2}(st|nd|rd|th)?\\s+(${MONTHS})\\.?,?\\s+\\d{4}\\b|\\b(${MONTHS})\\.?\\s+\\d{1,2},?\\s+\\d{4}\\b`, 'i');
const MONTH_YEAR_RE = new RegExp(`\\b(MM\\/YYYY|MM\\/YY|(0?[1-9]|1[0-2])[./-](\\d{4}|\\d{2})|(${MONTHS})\\.?\\s*[-/ ]?\\s*\\d{2,4})\\b`, 'i');

export const scheduleOf = (doc) => doc.meta?.schedule ?? 'none';
export const boxBlocks = (doc) => (doc.sections ?? []).flatMap((s) => [s, ...(s.subs ?? [])]).flatMap((s) => (s.blocks ?? []).filter((b) => b.t === 'box').map((b) => ({ b, s })));
export const boxText = (vocab, schedule) => { const s = vocab.schedules?.[schedule]; return s ? [s.header, ...s.text].join('\n') : ''; };

export function checkIn(doc, ctx, add) {
  const t = templateFor(ctx.pack, doc.kind);
  checkRequired(doc, t, add);
  if (doc.kind === 'in-pi') checkPi(doc, ctx, add);
  else checkLabel(doc, ctx, add);
  checkStrengths(doc, ctx, add);
  checkClaims(doc, ctx, add);
}

function checkRequired(doc, t, add) {
  const order = t.sections.map((s) => s.num);
  let last = -1;
  for (const s of doc.sections ?? []) {
    const i = order.indexOf(s.num);
    if (i < 0) { if (doc.kind === 'in-pi') add('IN-HEAD', L(s), `"${s.title}" is not a heading of the package insert format.`, 'Remove it, or move its content under the right heading.', 'warning'); continue; }
    if (i < last && doc.kind === 'in-pi') add('IN-HEAD', L(s), `"${s.title}" is out of order.`, 'Keep the order of the format.');
    last = Math.max(last, i);
  }
  for (const ts of t.sections) {
    const s = findSection(doc, ts.num);
    const required = ts.need === 'required';
    if (!s) { if (required) add('IN-REQ', { area: 'sec', key: ts.num, label: ts.title }, `"${ts.title}" is missing.`, 'Add the section with its content.'); continue; }
    if (doc.kind === 'in-pi' && simple(s.title) !== simple(ts.title)) add('IN-HEAD', L(s), `Heading "${s.title}" should be "${ts.title}".`, 'Use the heading of the format.');
    if (required && !filled(s)) add('IN-REQ', L(s), `"${ts.title}" is empty.`, doc.kind === 'in-pi' ? 'Fill it, or write "Not applicable."' : 'Every mandatory particular of Rule 96 must be on the label.');
    for (const fs of ts.fixedSubs ?? []) {
      const x = (s.subs ?? []).find((y) => y.num === fs.num);
      if (!x) { if (fs.need === 'required') add('IN-REQ', { area: 'sec', key: fs.num, label: `${fs.num} ${fs.title}` }, `"${fs.num} ${fs.title}" is missing.`, 'Add the subheading with its content.'); continue; }
      if (simple(x.title) !== simple(fs.title)) add('IN-HEAD', L(x), `Heading "${x.title}" should be "${fs.title}".`, 'Use the heading of the format.');
      if (fs.need === 'required' && !hasContent(x.blocks)) add('IN-REQ', L(x), `"${fs.num} ${fs.title}" is empty.`, 'Fill it, or write "Not applicable."');
    }
  }
}

function checkPi(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'in-pi');
  const want = t.fixed?.header ?? '';
  const have = doc.fixed?.header ?? '';
  if (simple(have) !== simple(want)) add('IN-RMP', META('header', 'Top of the insert'), have ? 'The statement at the top is not the standard wording.' : 'The registered medical practitioner statement is missing.', `Use: "${want}"`);
  const s11 = findSection(doc, '11');
  if (s11 && filled(s11)) {
    const tx = secText(s11);
    if (!/permission|licen[cs]e|\bM\.?\s?L\.?\b/i.test(tx)) add('IN-PERM', L(s11), 'Section 11 does not give a permission or licence number.', 'Give the CDSCO permission number (or the manufacturing licence number) and its date.');
    else if (!DATE_RE.test(tx)) add('IN-PERM', L(s11), 'The date of the permission or licence is missing.', 'Add the date, for example "dated 14 March 2025".');
  }
  const s12 = findSection(doc, '12');
  if (s12 && filled(s12) && !(MONTH_YEAR_RE.test(secText(s12)) || DATE_RE.test(secText(s12)))) add('IN-REQ', L(s12), 'The date of revision has no month and year.', 'For example "September 2026".');
}

function checkLabel(doc, ctx, add) {
  const v = inVocab(ctx);
  const m = doc.meta ?? {};
  const sec = (n) => findSection(doc, n);
  const txt = (n) => secText(sec(n));
  const has = (n) => filled(sec(n));

  // Rule 96 prefixes and dates
  if (has('c11') && !/\b(B\.\s?No\.?|Batch\s+No\.?)/i.test(txt('c11'))) add('IN-96-PART', L(sec('c11')), 'The batch number is not preceded by "B. No." or "Batch No.".', 'Write "B. No.: XXXXXX".');
  if (has('c10') && !/(Mfg\.?\s?Lic\.?\s?No\.?|\bM\.\s?L\.)/i.test(txt('c10'))) add('IN-96-PART', L(sec('c10')), 'The manufacturing licence number is not preceded by "Mfg. Lic. No." or "M.L.".', 'Write "Mfg. Lic. No.: ..." with the licence number.');
  for (const [n, re, word, ex] of [['c12', /\bMfg\.?\s?Date\b|\bMfd\.?\b/i, 'Mfg. Date', 'Mfg. Date: MM/YYYY'], ['c13', /\bExp\.?\s?Date\b|\bExpiry\b|\bUse before\b/i, 'Exp. Date', 'Exp. Date: MM/YYYY']]) {
    if (!has(n)) continue;
    if (!re.test(txt(n))) add('IN-96-PART', L(sec(n)), `The date is not preceded by "${word}".`, `Write "${ex}".`);
    else if (!MONTH_YEAR_RE.test(txt(n))) add('IN-96-PART', L(sec(n)), 'The date does not give the month and year.', `Write "${ex}".`);
  }

  // Rule 97: red box and symbol
  const schedule = scheduleOf(doc);
  const sch = v.schedules?.[schedule];
  const boxes = boxBlocks(doc);
  if (sch) {
    const want = boxText(v, schedule);
    const loc = sec('c6') ? L(sec('c6')) : { area: 'sec', key: 'c6', label: 'Schedule caution or warning (red box)' };
    if (!boxes.length) {
      const words = simple(txt('c6'));
      add('IN-97-BOX', loc, words ? `The ${v.scheduleLabels?.[schedule] ?? schedule} caution is not in a red box.` : `A ${v.scheduleLabels?.[schedule] ?? schedule} drug needs the Rule 97 caution in a red box.`, `Add a red-box block with: "${want.replace('\n', ' ')}"`);
    } else {
      const ok = boxes.some(({ b }) => { const h = simple(b.text); return [sch.header, ...sch.text].every((line) => h.includes(simple(line))); });
      if (!ok) add('IN-97-BOX', L(boxes[0].s), `The red box does not carry the Rule 97 wording for ${v.scheduleLabels?.[schedule] ?? schedule}.`, `Use: "${want.replace('\n', ' ')}"`);
    }
  } else if (boxes.length && schedule === 'none') add('IN-97-BOX', L(boxes[0].s), 'The product has no schedule, but the label has a schedule box.', 'Check the schedule in Title and statements, or remove the box.', 'warning');
  const symbol = sch?.symbol ?? '';
  const c1 = norm(txt('c1'));
  if (symbol && c1 !== symbol) add('IN-97-SYM', sec('c1') ? L(sec('c1')) : { area: 'sec', key: 'c1', label: 'Symbol' }, c1 ? `The symbol "${c1}" should be "${symbol}" for ${v.scheduleLabels?.[schedule] ?? schedule}.` : `${symbol} is missing for a ${v.scheduleLabels?.[schedule] ?? schedule} drug.`, `Put "${symbol}" at the top left of the label, in red.`);
  if (!symbol && /^(N|X)?Rx$/.test(c1)) add('IN-97-SYM', L(sec('c1')), `"${c1}" is shown, but ${v.scheduleLabels?.[schedule] ?? 'this schedule'} has no symbol.`, 'Remove the symbol, or check the schedule.', 'warning');

  // Proper name two sizes larger than the brand name, and not after it
  const sz = m.sizes ?? {};
  if (Number.isFinite(Number(sz.proper)) && Number.isFinite(Number(sz.brand)) && sz.proper !== '' && sz.brand !== '' && Number(sz.proper) < Number(sz.brand) + 2) add('IN-NAME', META('sizes', 'Type sizes'), `The proper name is ${sz.proper} pt and the brand name ${sz.brand} pt.`, `Print the proper name at least two sizes larger than the brand name (${Number(sz.brand) + 2} pt or more).`);
  const order = (doc.sections ?? []).map((s) => s.num);
  if (order.includes('c2') && order.includes('c3') && order.indexOf('c3') < order.indexOf('c2')) add('IN-NAME', L(sec('c3')), 'The brand name comes before the proper name.', 'Put the brand name below or after the proper name.');

  // MRP
  if (has('c14')) {
    const tx = txt('c14');
    const miss = [];
    if (!/\bM\.?\s?R\.?\s?P\.?/.test(tx)) miss.push('"MRP" or "M.R.P."');
    if (!/(₹|\bRs\.?)\s?\d[\d,]*(\.\d{1,2})?/.test(tx)) miss.push('the price in ₹ or Rs.');
    if (!/inclusive of all taxes/i.test(tx)) miss.push('"inclusive of all taxes"');
    if (miss.length) add('IN-MRP', L(sec('c14')), `The price line is missing ${miss.join(', ')}.`, 'For example "M.R.P. ₹ 1,250.00 per strip of 10 tablets (inclusive of all taxes)".');
  }

  // Schedule H2 QR code
  if (m.h2) {
    const s = sec('c16');
    const tx = txt('c16');
    if (!s || !hasContent(s.blocks)) add('IN-H2', s ? L(s) : { area: 'sec', key: 'c16', label: 'QR code (Schedule H2)' }, 'The product is in Schedule H2, but the label has no QR code.', 'Add the QR code section and list the data it encodes.');
    else {
      const missing = (v.h2 ?? []).filter((f) => !new RegExp(f.re, 'i').test(tx));
      if (!/\bQR\b/i.test(tx)) missing.unshift({ label: 'the words "QR code"' });
      if (missing.length) add('IN-H2', L(s), `The QR code data is missing: ${missing.map((f) => f.label.toLowerCase()).join(', ')}.`, 'Schedule H2 lists eight data elements; the QR code must encode all of them.');
    }
  }
}

function checkStrengths(doc, ctx, add) {
  const want = (doc.meta?.strengths ?? ctx.product?.strengths ?? []).map(normStrength);
  if (!want.length) return;
  const nums = doc.kind === 'in-pi' ? ['1', '2', '3'] : ['c2', 'c4', 'c5'];
  for (const n of nums) {
    const s = findSection(doc, n);
    if (!s) continue;
    for (const x of new Set(strengths(secText(s)))) if (!want.includes(x)) add('IN-STR', L(s), `${x} is not a strength of this ${doc.kind === 'in-pi' ? 'product' : 'pack'} (${want.join(', ')}).`, 'Make the strengths agree with the approved product.');
  }
}

function checkClaims(doc, ctx, add) {
  const v = inVocab(ctx);
  const promo = v.promo ?? [];
  const schj = v.schj ?? [];
  const seenP = new Set();
  for (const e of textEntries(doc)) {
    for (const w of promo) {
      if (seenP.has(w)) continue;
      if (new RegExp(`\\b${escapeRe(w)}\\b`, 'i').test(e.text)) { seenP.add(w); add('IN-PROMO', e.loc, `"${w}" is promotional.`, 'State the facts; remove claims of superiority.'); }
    }
    for (const d of schj) {
      const re = new RegExp(`\\b(cures?|curing|prevents?|preventing|prevention of|eliminates?|guards? against)\\b[^.]{0,60}\\b${escapeRe(d)}\\b|\\b${escapeRe(d)}\\b[^.]{0,30}\\b(cured|prevented)\\b`, 'i');
      if (re.test(e.text)) { add('IN-SCHJ', e.loc, `The text claims to prevent or cure ${d}, a Schedule J disease.`, 'Remove the claim unless the drug is approved for it, and keep to the approved indication.'); break; }
    }
  }
}
