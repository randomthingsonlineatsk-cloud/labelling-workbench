// EU checks: QRD headings and required sections, black triangle, 4.8, excipients, standard
// leaflet statements, labelling particulars, Braille, safety features, and translation review.
// Called from runChecks for EU document kinds. Every check is tied to a rule card in the EU pack.
import { templateFor, fill } from './pack.js';
import { findSection, blocksText, blockTexts, hasContent, textEntries, sectionTitle } from './model.js';
import { strengths, normStrength, readingGrade, norm, escapeRe } from './text.js';
import { userTestResult } from './usertest.js';
import { carveFindings, compareSections } from './checks.js';

export const EU_KINDS = ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'];

const secText = (s) => (s ? [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))].join('\n') : '');
const textOf = (doc, num) => secText(findSection(doc, num));
const filled = (s) => !!s && (hasContent(s.blocks) || (s.subs ?? []).some((x) => hasContent(x.blocks)));
const L = (s, title) => ({ area: 'sec', key: s?.num ?? title, label: s ? sectionTitle(s) : title });
const variants = (t) => { const a = norm(t); return new Set([a, norm(a.replace(/<[^>]*>/g, '')), norm(a.replace(/[<>]/g, ''))].map((x) => x.toLowerCase())); };
const sameHeading = (actual, want, prefix) => {
  const a = norm(actual).toLowerCase();
  if (prefix) return a.startsWith(norm(want).toLowerCase().split(' contains')[0] + ' contains');
  return variants(want).has(a);
};
const euVocab = (ctx) => ctx.pack.vocab?.eu ?? {};
const smpcOf = (ctx) => (ctx.docs ?? []).find((d) => d.kind === 'smpc' && d.role !== 'translation');

export function checkEu(doc, ctx, add) {
  if (doc.role === 'translation') { checkTranslation(doc, ctx, add); return; }
  const t = templateFor(ctx.pack, doc.kind);
  checkHeadings(doc, t, ctx, add);
  if (doc.kind === 'smpc') checkSmpc(doc, t, ctx, add);
  if (doc.kind === 'smpc' && doc.role === 'generic') checkEuGeneric(doc, ctx, add);
  if (doc.kind === 'pl') checkPl(doc, t, ctx, add);
  if (doc.kind === 'eu-outer') checkOuter(doc, t, ctx, add);
  if (doc.kind === 'eu-blister') checkBlister(doc, ctx, add);
  if (doc.kind === 'eu-small') checkSmall(doc, ctx, add);
  if (doc.kind === 'eu-annex2') checkAnnex2(doc, t, add);
  if (doc.kind === 'smpc' || doc.kind === 'pl') checkPromoEu(doc, ctx, add);
  for (const e of textEntries(doc)) if (/\bQR code\b/i.test(e.text)) { add('EU-QR', e.loc, 'A QR code is mentioned.', 'Submit the QR code and the content it links to for assessment.'); break; }
}

function checkHeadings(doc, t, ctx, add) {
  const m = doc.meta ?? {};
  const order = t.sections.map((s) => s.num);
  const present = (doc.sections ?? []).map((s) => s.num);
  let last = -1;
  for (const s of doc.sections ?? []) {
    const i = order.indexOf(s.num);
    if (i < 0) { add('EU-HEAD', L(s), `"${s.title}" is not a heading of the QRD template.`, 'Remove it, or move its content under the right heading.', 'warning'); continue; }
    if (i < last) add('EU-HEAD', L(s), `"${s.title}" is out of order.`, 'Keep the QRD order.');
    last = Math.max(last, i);
  }
  const needExcipients = (m.excipients ?? []).length > 0;
  for (const ts of t.sections) {
    const s = findSection(doc, ts.num);
    const want = fill(ts.title, m);
    const required = ts.need === 'required' || (doc.kind === 'eu-outer' && ts.num === '3' && needExcipients);
    if (!s) { if (required) add('EU-REQ', { area: 'sec', key: ts.num, label: want }, `"${want}" is missing.`, 'Add the section with its content.'); continue; }
    if (!sameHeading(s.title, want)) add('EU-HEAD', L(s), `Heading "${s.title}" should be "${want}".`, 'Use the QRD heading exactly.');
    if (required && !filled(s)) add('EU-REQ', L(s), `"${want}" is empty.`, 'Fill it, or use the template wording for sections that do not apply (for example "Not applicable.").');
    for (const fs of ts.fixedSubs ?? []) {
      const x = (s.subs ?? []).find((y) => y.num === fs.num);
      const wantSub = fill(fs.title, m);
      const prefix = /contains/.test(fs.title) && fs.title.startsWith('{name}');
      if (!x) {
        const needed = fs.need === 'required' || (prefix && doc.kind === 'pl' && needExcipients);
        if (needed && !prefix) add('EU-REQ', { area: 'sec', key: fs.num, label: wantSub }, `"${wantSub}" is missing.`, 'Add the subheading with its content.');
        continue;
      }
      if (!sameHeading(x.title, wantSub, prefix)) add('EU-HEAD', L(x), `Heading "${x.title}" should be "${wantSub}".`, 'Use the QRD heading exactly.');
      if (fs.need === 'required' && !hasContent(x.blocks)) add('EU-REQ', L(x), `"${wantSub}" is empty.`, 'Fill it.');
    }
  }
  void present;
}

function checkBlackTriangle(doc, t, add) {
  const m = doc.meta ?? {};
  const want = t.fixed.blackTriangle;
  const have = norm(doc.fixed?.blackTriangle ?? '');
  const loc = { area: 'fixed', key: 'blackTriangle', label: 'Black triangle statement' };
  if (m.additionalMonitoring && have !== norm(want)) add('EU-BT', loc, have ? 'The black triangle statement is not the standard wording.' : 'The product is under additional monitoring, but the black triangle statement is missing.', `Start with: "${want}"`);
  if (!m.additionalMonitoring && have) add('EU-BT', loc, 'The product is not under additional monitoring, but the black triangle statement is there.', 'Remove it.', 'warning');
}

function checkExcipients(doc, ctx, add, where, field) {
  const list = euVocab(ctx).excipients ?? [];
  for (const ex of doc.meta?.excipients ?? []) {
    const rule = list.find((r) => r.key === ex.key);
    if (!rule || !rule[field]) continue;
    const text = where.text;
    if (!new RegExp(rule[field], 'i').test(text)) add('EU-EXC', where.loc, `${rule.label} (${ex.amount} per ${ex.per}${ex.note ? `, ${ex.note}` : ''}): the required ${field === 'pl' ? 'leaflet statement' : field === 'smpc' ? 'SmPC information' : 'carton statement'} is missing.`, field === 'pl' ? `Add under "${fill('{name} contains', doc.meta)} ...": "${rule.text}"` : field === 'smpc' ? 'Add the information to section 4.4 and name the excipient in section 2.' : `Name it in section 3: "Contains ${rule.label.toLowerCase().split(' (')[0]}. See the package leaflet for further information."`);
  }
}

function checkStrengths(doc, ctx, add, nums) {
  const want = (doc.meta?.strengths ?? ctx.product?.strengths ?? []).map(normStrength);
  if (!want.length) return;
  for (const n of nums) {
    const s = findSection(doc, n);
    if (!s) continue;
    for (const x of new Set(strengths(blocksText(s.blocks)))) if (!want.includes(x)) add('EU-STR', L(s), `${x} is not a strength of this product (${want.join(', ')}).`, 'Make the strengths agree everywhere.');
  }
}

function checkSmpc(doc, t, ctx, add) {
  checkBlackTriangle(doc, t, add);
  const s48 = findSection(doc, '4.8');
  if (s48) {
    const tx = blocksText(s48.blocks);
    if (!/Appendix V/.test(tx) || !/Reporting suspected adverse reactions after authorisation/i.test(tx)) add('EU-48-REPORT', L(s48), 'The standard text on reporting suspected adverse reactions is missing.', `End 4.8 with "Reporting of suspected adverse reactions" and: "${t.reporting}"`);
    const bad = (euVocab(ctx).nonstandardFrequencies ?? []).filter((w) => new RegExp(`\\b${escapeRe(w)}\\b`, 'i').test(tx));
    if (bad.length) add('EU-48-FREQ', L(s48), `Non-standard frequency words: ${bad.map((w) => `"${w}"`).join(', ')}.`, 'Use the frequency categories: very common, common, uncommon, rare, very rare, not known.');
    const hasTable = (s48.blocks ?? []).some((b) => b.t === 'table' || b.t === 'ar');
    if (hasTable && !(euVocab(ctx).frequencies ?? []).some((f) => new RegExp(`\\b${f}\\b`, 'i').test(tx))) add('EU-48-FREQ', L(s48), 'The table of adverse reactions has no frequency categories.', 'Give each reaction a frequency category.');
  }
  const s44 = findSection(doc, '4.4');
  checkExcipients(doc, ctx, add, { text: blocksText(s44?.blocks), loc: s44 ? L(s44) : { area: 'sec', key: '4.4', label: '4.4' } }, 'smpc');
  checkStrengths(doc, ctx, add, ['1', '2']);
  const s10 = findSection(doc, '10');
  if (s10 && hasContent(s10.blocks) && !/(\d{1,2}\/\d{4}|\b(January|February|March|April|May|June|July|August|September|October|November|December)\b \d{4}|\d{2}\/\d{2}\/\d{4})/.test(blocksText(s10.blocks))) add('EU-DATE', L(s10), 'Section 10 has no date in a recognised form.', 'Give the month and year, for example "August 2026".');
}

function checkPl(doc, t, ctx, add) {
  checkBlackTriangle(doc, t, add);
  const f = doc.fixed ?? {};
  if (!/Read all of this leaflet carefully/i.test(f.readFirst ?? '')) add('EU-PL-STD', { area: 'fixed', key: 'readFirst', label: '"Read all of this leaflet" box' }, 'The "Read all of this leaflet carefully" box is missing.', `Use: "${t.fixed.readFirst}"`);
  const rep = findSection(doc, 'pl4.1');
  if (!rep || !/Appendix V/.test(blocksText(rep.blocks)) || !/national reporting system/i.test(blocksText(rep.blocks))) add('EU-PL-STD', rep ? L(rep) : { area: 'sec', key: 'pl4', label: 'Reporting of side effects' }, 'The reporting statement pointing to Appendix V is missing or incomplete.', `Use: "${t.reporting}"`);
  if (!/last revised in\s+(\d{2}\/\d{4}|[A-Za-z]+ \d{4})/i.test(f.lastRevised ?? '')) add('EU-DATE', { area: 'fixed', key: 'lastRevised', label: 'Last revised line' }, 'The leaflet does not give the month and year it was last revised.', 'End with "This leaflet was last revised in August 2026."');
  const s2 = findSection(doc, 'pl2');
  checkExcipients(doc, ctx, add, { text: secText(s2), loc: s2 ? L(s2) : { area: 'sec', key: 'pl2', label: 'Section 2' } }, 'pl');
  const smpc = smpcOf(ctx);
  if (smpc) {
    const ci = blocksText(findSection(smpc, '4.3')?.blocks);
    const dnt = findSection(doc, 'pl2.1');
    if (/hypersensitivity|allerg/i.test(ci) && !/allerg/i.test(blocksText(dnt?.blocks))) add('EU-PL-CONSIST', dnt ? L(dnt) : { area: 'sec', key: 'pl2', label: 'Do not take' }, 'SmPC 4.3 contraindicates hypersensitivity, but "Do not take" does not mention allergy.', 'Add "if you are allergic to [active substance] or any of the other ingredients of this medicine (listed in section 6)".');
    const want = (smpc.meta?.strengths ?? []).map(normStrength);
    const s61 = findSection(doc, 'pl6.1');
    for (const x of new Set(strengths(blocksText(s61?.blocks)))) if (want.length && !want.includes(x)) add('EU-PL-CONSIST', L(s61), `${x} in the leaflet is not a strength in the SmPC.`, 'Make the strengths agree.');
  }
  const all = (doc.sections ?? []).flatMap((s) => [s, ...(s.subs ?? [])]).flatMap((s) => (s.blocks ?? []).flatMap(blockTexts)).join('. ');
  const g = readingGrade(all);
  if (g !== null && g > 9) add('EU-PL-READ', { area: 'sec', key: 'pl1', label: 'Reading level' }, `Estimated reading grade ${g.toFixed(1)}.`, 'Shorter sentences and everyday words help patients; a user test will show where.', 'info');
  if (doc.userTest) {
    const r = userTestResult(doc, ctx.pack);
    if (!r.passed) add('EU-UT', { area: 'usertest', key: 'ut', label: 'User test' }, r.summary, 'Run rounds on the User test tab until two final rounds of 10 on the same text pass every question.');
  }
}

function checkOuter(doc, t, ctx, add) {
  const sec = (n) => findSection(doc, n);
  const s6 = sec('6');
  if (s6 && norm(blocksText(s6.blocks)) !== t.standard['6']) add('EU-LAB-CHILD', L(s6), 'The warning is not the required wording.', `Use: "${t.standard['6']}"`);
  const s16 = sec('16');
  const name = doc.meta?.proprietaryName ?? ctx.product?.brandName ?? '';
  const bt = blocksText(s16?.blocks);
  const multi = (ctx.product?.strengths ?? []).length > 1;
  const st = (doc.meta?.strengths ?? [])[0];
  if (s16 && !/justification for not including braille accepted/i.test(bt) && (!new RegExp(escapeRe(name), 'i').test(bt) || (multi && st && !bt.includes(st.split(' ')[0])))) add('EU-BRAILLE', L(s16), bt.trim() ? 'The Braille text does not give the name and strength.' : 'No Braille text.', `Give the text to emboss, for example "${name.toLowerCase()} ${st ?? ''}".`.replace(' "', ' "'));
  const s17 = sec('17');
  if (s17 && norm(blocksText(s17.blocks)) !== t.standard['17']) add('EU-SF', L(s17), 'The 2D barcode statement is missing or reworded.', `Use: "${t.standard['17']}"`);
  const s18 = sec('18');
  if (s18) {
    const lines = (s18.blocks ?? []).flatMap(blockTexts).map((x) => norm(x));
    const missing = ['PC', 'SN'].filter((k) => !lines.some((l) => new RegExp(`^${k}\\b`).test(l)));
    if (missing.length) add('EU-SF', L(s18), `The human-readable data lack ${missing.join(' and ')}.`, 'Show PC (product code), SN (serial number) and, where required, NN (national number), one per line.');
  }
  const s3 = sec('3');
  checkExcipients(doc, ctx, add, { text: blocksText(s3?.blocks), loc: s3 ? L(s3) : { area: 'sec', key: '3', label: '3 LIST OF EXCIPIENTS' } }, 'carton');
  checkStrengths(doc, ctx, add, ['1', '2']);
  const smpc = smpcOf(ctx);
  const s12 = sec('12');
  if (smpc && s12) {
    const allowed = new Set(blocksText(findSection(smpc, '8')?.blocks).match(/EU\/\d\/\d{2}\/\d{4}\/\d{3}/g) ?? []);
    for (const n of blocksText(s12.blocks).match(/EU\/\d\/\d{2}\/\d{4}\/\d{3}/g) ?? []) if (allowed.size && !allowed.has(n)) add('EU-LAB-PART', L(s12), `${n} is not one of the authorisation numbers in SmPC section 8.`, 'Use the number for this strength and pack size.');
  }
  if ((doc.meta?.procedure ?? 'centralised') === 'centralised' && !sec('bb')) add('EU-BLUEBOX', { area: 'sec', key: '18', label: 'Blue box' }, 'No blue box: fine for the common EU text; national particulars (price, reimbursement) would go in one.', 'Add national details only in a blue box, never in the common text.', 'info');
}

function checkEuGeneric(doc, ctx, add) {
  for (const f of carveFindings(doc)) add('EU-GEN-CARVE', f.loc, f.msg, 'Remove every mention that depends on the left-out indication: 4.1, 4.2, 4.8 and 5.1.');
  const ref = (ctx.docs ?? []).find((d) => d.role === 'reference' && d.kind === 'smpc');
  if (!ref) return;
  for (const row of compareSections(ref, doc)) if (row.status === 'different' || row.status === 'missing') add('EU-GEN-SAME', { area: 'sec', key: row.num, label: row.label }, `${row.label} ${row.status === 'missing' ? 'is missing from' : 'differs from'} the reference SmPC and is not a permitted difference.`, 'Open Compare to see the words that differ.');
}

function checkBlister(doc, ctx, add) {
  checkStrengths(doc, ctx, add, ['1']);
  checkExpLot(doc, add);
}

// Immediate packaging: the expiry date after "EXP" and the batch number after "Lot" (QRD).
function checkExpLot(doc, add) {
  const s3 = findSection(doc, '3');
  const s4 = findSection(doc, '4');
  if (s3 && hasContent(s3.blocks) && !/\bEXP\b/.test(blocksText(s3.blocks))) add('EU-SMALL', L(s3), 'The expiry date is not preceded by "EXP".', 'Write "EXP"; the date is printed on the packaging line.');
  if (s4 && hasContent(s4.blocks) && !/\bLot\b/.test(blocksText(s4.blocks))) add('EU-SMALL', L(s4), 'The batch number is not preceded by "Lot".', 'Write "Lot"; the number is printed on the packaging line.');
}

function checkSmall(doc, ctx, add) {
  checkStrengths(doc, ctx, add, ['1']);
  checkExpLot(doc, add);
  const s1 = findSection(doc, '1');
  const route = String(doc.meta?.route ?? '').toLowerCase();
  const ROUTE = { intravenous: 'IV|intravenous', subcutaneous: 'SC|subcutaneous', intramuscular: 'IM|intramuscular', oral: 'oral', ocular: 'ocular|eye', cutaneous: 'cutaneous', inhalation: 'inhalation' };
  const re = new RegExp(`\\b(${ROUTE[route] ?? (route || 'IV|SC|IM|oral')})\\b`, 'i');
  if (s1 && hasContent(s1.blocks) && !re.test(blocksText(s1.blocks))) add('EU-SMALL', L(s1), 'The route of administration is not given with the name.', `Add the route, for example "${route === 'intravenous' ? 'IV' : route || 'IV'}".`);
  const s5 = findSection(doc, '5');
  if (s5 && hasContent(s5.blocks) && !/\d+(\.\d+)?\s*(mL|ml|L|mg|g|mcg|µg|units?|IU|tablets?|capsules?|doses?)\b/i.test(blocksText(s5.blocks))) add('EU-SMALL', L(s5), 'The contents are not given by weight, volume or unit.', 'For example "5 mL" or "50 mg/5 mL".');
}

function checkAnnex2(doc, t, add) {
  const sB = findSection(doc, 'B');
  if (sB && hasContent(sB.blocks) && !/subject to (restricted |special )?(and restricted )?medical prescription|not subject to medical prescription/i.test(blocksText(sB.blocks))) add('EU-A2', L(sB), 'Section B does not give the legal status for supply.', 'For example "Medicinal product subject to medical prescription."');
  if (sB && !hasContent(sB.blocks)) add('EU-A2', L(sB), 'Section B does not give the legal status for supply.', 'For example "Medicinal product subject to medical prescription."');
  const c1 = findSection(doc, 'C.1');
  if (c1 && !(/EURD list/i.test(blocksText(c1.blocks)) && /107c\(7\)/.test(blocksText(c1.blocks)))) add('EU-A2', L(c1), 'The PSUR statement is not the standard text (EURD list, Article 107c(7)).', `Use: "${t.standard['C.1']}"`);
  const d1 = findSection(doc, 'D.1');
  if (d1 && !(/Module 1\.8\.2/.test(blocksText(d1.blocks)) && /updated RMP/i.test(blocksText(d1.blocks)))) add('EU-A2', L(d1), 'The RMP statement is not the standard text (Module 1.8.2, when an updated RMP is due).', 'Use the template statement on the risk management plan.');
}

function checkPromoEu(doc, ctx, add) {
  const words = euVocab(ctx).promo ?? [];
  const re = new RegExp(`\\b(${words.map(escapeRe).join('|')})\\b`, 'i');
  for (const e of textEntries(doc)) {
    if (e.loc.area === 'fixed') continue;
    const mm = re.exec(e.text);
    if (mm) add('EU-PROMO', e.loc, `"${mm[1]}" reads as promotional.`, 'State the data; remove comparative or superlative claims.');
  }
}

// ---------------------------------------------------------------- translations
export const sourceOfTranslation = (doc, docs) => (docs ?? []).find((d) => d.role !== 'translation' && ((doc.sourceDocId && d.id === doc.sourceDocId) || (doc.sourceSampleDocId && d.sampleDocId === doc.sourceSampleDocId)));
const numbersIn = (t) => (String(t).match(/\d+(?:[.,]\d+)?/g) ?? []).map((x) => x.replace(',', '.'));
export const termBaseFor = (ctx, lang) => [...(ctx.pack.vocab?.eu?.termBase?.[lang] ?? []), ...(ctx.project?.termBase?.[lang] ?? [])];

export function translationPairs(doc, src) {
  const out = [];
  for (const s of src.sections ?? []) {
    out.push({ num: s.num, src: s, tgt: findSection(doc, s.num), own: [s.title, blocksText(s.blocks)].join('\n') });
    for (const x of s.subs ?? []) out.push({ num: x.num, src: x, tgt: findSection(doc, x.num), own: [x.title, blocksText(x.blocks)].join('\n') });
  }
  return out.map((p) => ({ ...p, srcText: p.own, tgtText: p.tgt ? [p.tgt.title, blocksText(p.tgt.blocks)].join('\n') : '', srcBody: blocksText(p.src.blocks), tgtBody: p.tgt ? blocksText(p.tgt.blocks) : '' }));
}

export function translationFindings(doc, ctx) {
  const src = sourceOfTranslation(doc, ctx.docs);
  if (!src) return [];
  const terms = termBaseFor(ctx, doc.meta?.lang);
  const out = [];
  for (const p of translationPairs(doc, src)) {
    const loc = { area: 'sec', key: p.num, label: p.tgt ? sectionTitle(p.tgt) : sectionTitle(p.src) };
    if (!p.tgt || !norm(p.tgtText) || (norm(p.srcBody) && !norm(p.tgtBody))) { out.push({ rule: 'EU-TR-MISS', loc, msg: `"${p.src.title}" has no translation.`, hint: 'Translate the section.' }); continue; }
    for (const tb of terms) {
      if (new RegExp(`\\b${escapeRe(tb.source)}\\b`, 'i').test(p.srcText) && !new RegExp(escapeRe(tb.target), 'i').test(p.tgtText)) out.push({ rule: 'EU-TR-TERM', loc, msg: `"${tb.source}" should be translated as "${tb.target}".`, hint: tb.note ?? 'Use the approved term from the term base.' });
    }
    const left = numbersIn(p.tgtText);
    const missing = [];
    for (const n of numbersIn(p.srcText)) { const i = left.indexOf(n); if (i >= 0) left.splice(i, 1); else missing.push(n); }
    if (missing.length) out.push({ rule: 'EU-TR-NUM', loc, msg: `Number(s) ${[...new Set(missing)].join(', ')} from the source are missing.`, hint: 'Check doses, durations and strengths against the source.' });
  }
  return out;
}

function checkTranslation(doc, ctx, add) {
  for (const f of translationFindings(doc, ctx)) add(f.rule, f.loc, f.msg, f.hint);
}
