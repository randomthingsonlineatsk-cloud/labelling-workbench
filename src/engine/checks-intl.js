// Phase 5 checks: Canada (product monograph, outer label), Switzerland (Fachinformation, patient
// information), Japan (package insert), Australia (PI, CMI) and WHO prequalification (SmPC).
// Called from runChecks for these document kinds. Every check is tied to a rule card.
import { templateFor, fill } from './pack.js';
import { findSection, blocksText, hasContent, textEntries, sectionTitle } from './model.js';
import { strengths, norm, escapeRe } from './text.js';

export const INTL_KINDS = ['ca-pm', 'ca-pmi', 'ca-label', 'ch-fi', 'ch-pi', 'jp-pi', 'au-pi', 'au-cmi', 'who-smpc'];
const PREFIX = { ca: 'CA', ch: 'CH', jp: 'JP', au: 'AU', who: 'WHO' };
export const intlRegion = (kind) => kind.split('-')[0];

const secText = (s) => (s ? [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))].join('\n') : '');
const filled = (s) => !!s && (hasContent(s.blocks) || (s.subs ?? []).some((x) => hasContent(x.blocks)));
const L = (s, title) => ({ area: 'sec', key: s?.num ?? title, label: s ? sectionTitle(s) : title });
const F = (key, label) => ({ area: 'fixed', key, label });
const simple = (t) => norm(String(t ?? '')).toLowerCase().replace(/[‐‑‒–—―-]/g, '-').replace(/\s+/g, ' ').trim();
const has = (text, part) => simple(text).includes(simple(part));
const V = (ctx) => ctx.pack.vocab?.intl ?? {};
const EN_MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
const DE_MONTHS = 'Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember';
const MONTH_INDEX = Object.fromEntries(EN_MONTHS.split('|').map((m, i) => [m.toLowerCase(), i]));
// "20 September 2023" or "September 2023" -> months since year 0
function monthOf(text) {
  const m = new RegExp(`(?:\\b\\d{1,2}\\s+)?\\b(${EN_MONTHS})\\s+(\\d{4})\\b`, 'i').exec(String(text ?? ''));
  return m ? Number(m[2]) * 12 + MONTH_INDEX[m[1].toLowerCase()] : null;
}
const isoMonth = (d) => { const m = /^(\d{4})-(\d{2})/.exec(String(d ?? '')); return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null; };
const validIso = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d ?? '')) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`)) && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d;

export function checkIntl(doc, ctx, add) {
  const t = templateFor(ctx.pack, doc.kind);
  const P = PREFIX[intlRegion(doc.kind)];
  if (doc.kind === 'jp-pi') checkJpHeadings(doc, t, add);
  else checkHeadings(doc, t, P, add);
  ({ 'ca-pm': checkCaPm, 'ca-pmi': checkCaPmi, 'ca-label': checkCaLabel, 'ch-fi': checkChFi, 'ch-pi': checkChPi, 'jp-pi': checkJp, 'au-pi': checkAuPi, 'au-cmi': checkAuCmi, 'who-smpc': checkWho })[doc.kind](doc, t, ctx, add);
  checkStrengths(doc, ctx, add);
  checkPromo(doc, ctx, add);
}

// ---------------------------------------------------------------- headings
function checkHeadings(doc, t, P, add) {
  const m = doc.meta ?? {};
  const order = t.sections.map((s) => s.num);
  let last = -1;
  for (const s of doc.sections ?? []) {
    const i = order.indexOf(s.num);
    if (i < 0) { if (doc.kind !== 'ca-label') add(`${P}-HEAD`, L(s), `"${s.title}" is not a heading of the template.`, 'Remove it, or move its content under the right heading.', 'warning'); continue; }
    if (i < last) add(`${P}-HEAD`, L(s), `"${s.title}" is out of order.`, 'Keep the order of the template.');
    last = Math.max(last, i);
  }
  for (const ts of t.sections) {
    const s = findSection(doc, ts.num);
    const want = fill(ts.title, m);
    const label = /^\d/.test(ts.num) ? `${ts.num} ${want}` : want;
    if (!s) { if (ts.need === 'required') add(`${P}-REQ`, { area: 'sec', key: ts.num, label }, `"${label}" is missing.`, 'Add the section with its content.'); continue; }
    if (doc.kind !== 'ca-label' && simple(s.title) !== simple(want)) add(`${P}-HEAD`, L(s), `Heading "${s.title}" should be "${want}".`, 'Use the heading of the template.');
    if (ts.need === 'required' && !filled(s)) add(`${P}-REQ`, L(s), `"${label}" is empty.`, doc.kind === 'ca-label' ? 'This item must be on the label.' : 'Fill it, or say why it does not apply.');
    for (const fs of ts.fixedSubs ?? []) {
      const x = (s.subs ?? []).find((y) => y.num === fs.num);
      const wantSub = fill(fs.title, m);
      if (!x) { if (fs.need === 'required') add(`${P}-REQ`, { area: 'sec', key: fs.num, label: `${fs.num} ${wantSub}` }, `"${fs.num} ${wantSub}" is missing.`, 'Add the subheading with its content.'); continue; }
      if (simple(x.title) !== simple(wantSub)) add(`${P}-HEAD`, L(x), `Heading "${x.title}" should be "${wantSub}".`, 'Use the heading of the template.');
      if (fs.need === 'required' && !hasContent(x.blocks)) add(`${P}-REQ`, L(x), `"${fs.num} ${wantSub}" is empty.`, 'Fill it, or say why it does not apply.');
    }
  }
}

// Japan: numbers are kept even when a section is left out, so a heading under the wrong number
// is reported as a renumbering.
function checkJpHeadings(doc, t, add) {
  const byNum = Object.fromEntries(t.sections.map((s) => [s.num, s]));
  const byTitle = Object.fromEntries(t.sections.map((s) => [simple(s.title), s]));
  const covered = new Set();
  let last = 0;
  for (const s of doc.sections ?? []) {
    const ts = byNum[s.num];
    const other = byTitle[simple(s.title)];
    if (other && other.num !== s.num) {
      add('JP-HEAD', L(s), `"${s.title}" is numbered ${s.num}; it is section ${other.num}.`, `Numbers are not moved up when a section is left out: use ${other.num}.`);
      covered.add(other.num);
      continue;
    }
    if (!ts) { add('JP-HEAD', L(s), `${s.num} is not a section number of the format.`, 'Use the numbers 1 to 26.', 'warning'); continue; }
    covered.add(s.num);
    if (simple(s.title) !== simple(ts.title)) add('JP-HEAD', L(s), `Section ${s.num} should be headed "${ts.title}".`, 'Use the heading of the format.');
    if (Number(s.num) < last) add('JP-HEAD', L(s), `Section ${s.num} is out of order.`, 'Keep the numeric order.');
    last = Math.max(last, Number(s.num));
    for (const fs of ts.fixedSubs ?? []) {
      const x = (s.subs ?? []).find((y) => y.num === fs.num);
      if (!x) { if (fs.need === 'required') add('JP-REQ', { area: 'sec', key: fs.num, label: `${fs.num} ${fs.title}` }, `"${fs.num} ${fs.title}" is missing.`, 'Add the subsection.'); continue; }
      if (simple(x.title) !== simple(fs.title)) add('JP-HEAD', L(x), `Subsection ${fs.num} should be headed "${fs.title}".`, 'Use the heading of the format.');
      if (fs.need === 'required' && !hasContent(x.blocks)) add('JP-REQ', L(x), `"${fs.num} ${fs.title}" is empty.`, 'Fill it.');
    }
    if (ts.need === 'required' && !filled(s)) add('JP-REQ', L(s), `"${s.num} ${ts.title}" is empty.`, 'Fill it.');
  }
  for (const ts of t.sections) if (ts.need === 'required' && !covered.has(ts.num)) add('JP-REQ', { area: 'sec', key: ts.num, label: `${ts.num} ${ts.title}` }, `"${ts.num} ${ts.title}" is missing.`, 'Add the section.');
}

// ---------------------------------------------------------------- Canada
function checkCaPm(doc, t, ctx, add) {
  const m = doc.meta ?? {};
  const loc = F('title', 'Title page');
  if (simple(doc.fixed?.title) !== simple(t.fixed.title)) add('CA-TITLE', loc, 'The title is not "Product Monograph Including Patient Medication Information".', `Use: "${t.fixed.title}"`);
  if (m.scheduleSymbol !== 'Pr') add('CA-TITLE', F('symbol', 'Scheduling symbol'), m.scheduleSymbol ? `The scheduling symbol "${m.scheduleSymbol}" should be "Pr" for a prescription drug.` : 'The Pr symbol before the brand name is missing.', 'Set the scheduling symbol to Pr.');
  if (!validIso(m.revised)) add('CA-TITLE', F('dates', 'Date of authorization'), m.revised ? `The date of authorization "${m.revised}" is not a date in YYYY-MM-DD form.` : 'The date of authorization is missing.', 'Write it as YYYY-MM-DD, for example 2026-08-20.');

  const s3 = findSection(doc, '3');
  if (m.swp && !filled(s3)) add('CA-SWP', s3 ? L(s3) : { area: 'sec', key: '3', label: '3 SERIOUS WARNINGS AND PRECAUTIONS BOX' }, 'Serious warnings were identified, but section 3 is missing or empty.', 'Add the box with each serious warning as a bullet.');
  if (filled(s3)) {
    const lines = secText(s3).split('\n').filter((x) => x.trim()).reduce((n, x) => n + Math.max(1, Math.ceil(norm(x).length / 90)), 0);
    if (lines > 20) add('CA-SWP', L(s3), `The box is about ${lines} lines; the template asks for no more than 20.`, 'Keep the box short and point to the detailed sections.');
    if (!/\(see\s+\d/i.test(secText(s3))) add('CA-SWP', L(s3), 'The box has no cross-references to the detailed sections.', 'End each bullet with a reference such as "(see 7 WARNINGS AND PRECAUTIONS, Immune)".');
  }

  const rm = findSection(doc, 'rmlc');
  const t0 = ctx.today ?? new Date();
  const rev = validIso(m.revised) ? isoMonth(m.revised) : t0.getFullYear() * 12 + t0.getMonth();
  const nums = new Set((doc.sections ?? []).map((s) => s.num));
  for (const b of rm?.blocks ?? []) {
    const rows = b.t === 'table' ? b.rows : [];
    for (const [i, r] of rows.entries()) {
      const [sec, date] = r.map((x) => String(x ?? '').trim());
      if (i === 0 && !/^\d{4}/.test(date)) continue;
      if (!sec && !date) continue;
      const d = /^\d{4}-\d{2}$/.test(date) ? isoMonth(date) : null;
      const cited = /^(\d+)/.exec(sec)?.[1];
      if (d === null) add('CA-RMLC', L(rm), `"${sec}": the date "${date}" is not in YYYY-MM form.`, 'Give the month of approval as YYYY-MM.');
      else if (rev !== null && d > rev) add('CA-RMLC', L(rm), `"${sec}" (${date}) is later than the date of authorization.`, 'Check the dates.');
      else if (rev !== null && rev - d > 24) add('CA-RMLC', L(rm), `"${sec}" (${date}) is ${rev - d} months older than the date of authorization.`, 'Remove entries after 24 months.');
      if (cited && !nums.has(cited)) add('CA-RMLC', L(rm), `"${sec}" cites section ${cited}, which is not in the monograph.`, 'Check the section.');
    }
  }
}

function checkCaPmi(doc, t, ctx, add) {
  if (simple(doc.fixed?.readThis) !== simple(t.fixed.readThis)) add('CA-PMI-STD', F('readThis', 'Opening line'), 'The opening line is not the standard wording.', `Use: "${t.fixed.readThis}"`);
  const od = findSection(doc, 'm12');
  if (filled(od)) {
    const tx = secText(od);
    if (!/1-844[ -]?(POISON-X|764-7669)/i.test(tx) || !/poison control/i.test(tx)) add('CA-PMI-STD', L(od), 'The Overdose box does not give the poison control text and Health Canada\'s toll-free number.', 'Use the template text ending "1-844 POISON-X (1-844-764-7669) immediately, even if there are no signs or symptoms."');
  }
  const rep = findSection(doc, 'm16');
  if (filled(rep)) {
    const tx = secText(rep);
    if (!/1-866-234-2345/.test(tx) || !/does not provide medical advice/i.test(tx)) add('CA-PMI-STD', L(rep), 'Reporting side effects does not give the Canada Vigilance toll-free number 1-866-234-2345 and the medical-advice note.', 'Use the template text for reporting side effects.');
  }
  const pm = (ctx.docs ?? []).find((d) => d.kind === 'ca-pm');
  const boxed = !!doc.meta?.swp || (!!pm && (pm.meta?.swp || filled(findSection(pm, '3'))));
  const m0 = findSection(doc, 'm0');
  if (boxed && !filled(m0)) add('CA-SWP', m0 ? L(m0) : { area: 'sec', key: 'm0', label: 'Serious warnings and precautions' }, 'The product monograph has a Serious Warnings and Precautions box, but the Patient Medication Information has none.', 'Add the box at the top, with each serious warning in plain language.');
}

function checkCaLabel(doc, t, ctx, add) {
  const m = doc.meta ?? {};
  const v = V(ctx);
  const sec = (n) => findSection(doc, n);
  const txt = (n) => secText(sec(n));
  const at = (n, title) => (sec(n) ? L(sec(n)) : { area: 'sec', key: n, label: title });
  const l1 = norm(txt('l1'));
  if (m.scheduleSymbol === 'Pr' && l1 !== 'Pr') add('CA-PR', at('l1', 'Scheduling symbol'), l1 ? `"${l1}" is shown; a Canadian prescription drug shows "Pr".` : 'The Pr symbol is missing.', 'Put "Pr" in the upper left quarter of the principal display panel.');
  if (m.scheduleSymbol !== 'Pr' && /^Pr$/.test(l1)) add('CA-PR', at('l1', 'Scheduling symbol'), '"Pr" is shown, but the drug is not a prescription drug.', 'Remove the symbol.');
  if (filled(sec('l6'))) {
    const tx = txt('l6');
    const mm = /\b(?:DIN|Drug Identification Number|Drogue\s*:\s*identification numérique)\b\s*:?\s*(\d+)/i.exec(tx);
    const want = ctx.product?.ca?.din;
    if (!mm) add('CA-DIN', at('l6', 'DIN'), 'The DIN is not shown with "DIN".', 'Write "DIN 12345678".');
    else if (mm[1].length !== 8) add('CA-DIN', at('l6', 'DIN'), `"${mm[1]}" has ${mm[1].length} digits; a DIN has eight.`, want ? `The DIN of this product is ${want}.` : 'Check the DIN.');
    else if (want && mm[1] !== want) add('CA-DIN', at('l6', 'DIN'), `DIN ${mm[1]} is not this product's DIN (${want}).`, 'Check the DIN.');
  }
  const sz = m.sizes ?? {};
  if (Number(sz.brand) > 0 && Number(sz.proper) > 0 && Number(sz.proper) * 2 < Number(sz.brand)) add('CA-PROPER', F('sizes', 'Type sizes'), `The proper name is ${sz.proper} pt and the brand name ${sz.brand} pt.`, `Print the proper name at least half the size of the brand name (${Math.ceil(Number(sz.brand) / 2)} pt or more).`);
  if (filled(sec('l11')) && !/\bLot\b/i.test(txt('l11'))) add('CA-LAB', at('l11', 'Lot number'), 'The lot number is not shown with "Lot".', 'Write "Lot: XXXXXX".');
  if (filled(sec('l12'))) {
    const tx = txt('l12');
    if (!/\bEXP\b/i.test(tx)) add('CA-LAB', at('l12', 'Expiry date'), 'The expiry date is not shown with "EXP".', 'Write "EXP: YYYY-MM".');
    else if (!/(YYYY-MM|\d{4}[-/ ]\d{2}\b|\b\d{2}[-/ ]\d{4}|\b[A-Z]{2,4}\.?\s?\d{4})/i.test(tx)) add('CA-LAB', at('l12', 'Expiry date'), 'The expiry date does not give the month and year.', 'Write "EXP: YYYY-MM".');
  }
  for (const [n, fr] of Object.entries(v.frMarkers ?? {})) {
    if (filled(sec(n)) && !new RegExp(fr.re, 'i').test(txt(n))) add('CA-BIL', at(n, fr.label), `The ${fr.label} is in English only.`, 'Give it in English and French.');
  }
  if (filled(sec('l14'))) {
    const tx = txt('l14');
    const contact = /\d{3}[-. ]\d{3}[-. ]\d{4}|www\.|https?:|@|\b[A-Z]\d[A-Z] ?\d[A-Z]\d\b/i.test(tx);
    const report = /report|signal|déclar/i.test(tx) && /side effect|adverse|injur|effets? secondaires?|indésirable/i.test(tx);
    if (!contact || !report) add('CA-REPORT', L(sec('l14')), !contact ? 'There is no telephone number, website, email or postal address in Canada.' : 'The label does not say that side effects can be reported to that contact.', 'For example: "To report side effects: 1-800-555-0199" in English and French.');
  }
}

// ---------------------------------------------------------------- Switzerland
function checkBtCh(doc, add) {
  const m = doc.meta ?? {};
  const bt = doc.fixed?.blackTriangle ?? '';
  const loc = F('blackTriangle', 'Black triangle');
  const core = ['Dieses Arzneimittel unterliegt einer zusätzlichen Überwachung.', 'Dies ermöglicht eine schnelle Identifizierung neuer Erkenntnisse über die Sicherheit.'];
  if (m.additionalMonitoring && (!bt.trim().startsWith('▼') || !core.every((c) => has(bt, c)))) add('CH-BT', loc, bt.trim() ? 'The black triangle text is not the standard wording.' : 'The product is under additional monitoring, but the black triangle and its text are missing.', `Start with "▼ ${core.join(' ')}"`);
  if (!m.additionalMonitoring && bt.trim()) add('CH-BT', loc, 'The product is not under additional monitoring, but the black triangle is shown.', 'Remove it.', 'warning');
}
function checkZul(doc, num, add) {
  const s = findSection(doc, num);
  if (!filled(s)) return;
  const tx = secText(s);
  const mm = /\b(\d{5})\s*\(Swissmedic\)/.exec(tx);
  const want = doc.meta?.authNumber;
  if (!mm) add('CH-ZUL', L(s), 'The authorisation number is not the five-digit number followed by "(Swissmedic)".', `Write "${want ?? '12345'} (Swissmedic)".`);
  else if (want && mm[1] !== String(want)) add('CH-ZUL', L(s), `${mm[1]} is not the authorisation number of this product (${want}).`, 'Use the same number in the Fachinformation and the patient information.');
}
function checkCat(doc, num, add) {
  const s = findSection(doc, num);
  if (filled(s) && !/Abgabekategorie\s*[A-E]\b/.test(secText(s))) add('CH-CAT', L(s), 'The dispensing category is not given.', 'Add "Abgabekategorie B" (or A, C, D, E).');
}
function checkChFi(doc, t, ctx, add) {
  checkBtCh(doc, add);
  const s10 = findSection(doc, 'f10');
  if (filled(s10) && !(/ElViS/.test(secText(s10)) && /meld|anzuzeigen|report/i.test(secText(s10)))) add('CH-ELVIS', L(s10), 'The request to report suspected adverse reactions through ElViS is missing.', 'End the section with the reporting paragraph that names ElViS (Electronic Vigilance System).');
  checkZul(doc, 'f16', add);
  checkCat(doc, 'f17', add);
  const s19 = findSection(doc, 'f19');
  if (filled(s19) && !new RegExp(`\\b(${DE_MONTHS}|${EN_MONTHS})\\s+\\d{4}\\b`).test(secText(s19))) add('CH-DATE', L(s19), 'The date of the information does not give the month and year.', 'For example "August 2026".');
}
function checkChPi(doc, t, ctx, add) {
  if (simple(doc.fixed?.header) !== simple(t.fixed.header)) add('CH-HEAD', F('header', 'Title'), 'The patient information does not start with "Information für Patientinnen und Patienten".', `Use: "${t.fixed.header}"`);
  checkBtCh(doc, add);
  checkZul(doc, 'p10', add);
  checkCat(doc, 'p11', add);
  if (!new RegExp(`wurde im (${DE_MONTHS}) \\d{4} letztmals durch die Arzneimittelbehörde \\(Swissmedic\\) geprüft`).test(doc.fixed?.lastChecked ?? '')) add('CH-DATE', F('lastChecked', 'Last line'), 'The last line does not give the month and year the text was checked by Swissmedic.', '"Diese Packungsbeilage wurde im August 2026 letztmals durch die Arzneimittelbehörde (Swissmedic) geprüft."');
}

// ---------------------------------------------------------------- Japan
function checkJp(doc, t, ctx, add) {
  const v = V(ctx);
  const f = doc.fixed ?? {};
  const bad = (v.jpHeader ?? []).filter((h) => !new RegExp(h.re, 'i').test(f[h.key] ?? ''));
  if (bad.length) add('JP-HDR', F('header', 'Header items'), `Missing or not in the usual form: ${bad.map((h) => h.label.toLowerCase()).join('; ')}.`, 'Fill every header item; the commodity number of a drug starts with 87, the approval number has 16 characters.');
  const s1 = findSection(doc, '1');
  if (doc.meta?.warnings) {
    if (!filled(s1)) add('JP-WARN', s1 ? L(s1) : { area: 'sec', key: '1', label: '1 WARNINGS' }, 'Serious, irreversible adverse reactions can occur, but section 1 Warnings is missing or empty.', 'Add the warnings at the top.');
    else if (!(s1.blocks ?? []).some((b) => b.t === 'box' && b.text?.trim())) add('JP-WARN', L(s1), 'The warnings are not set apart in a box.', 'Put the warnings in a boxed block.');
  }
  const s2 = findSection(doc, '2');
  for (const b of s2?.blocks ?? []) {
    const items = b.t === 'ul' ? b.items : b.t === 'p' || b.t === 'box' ? String(b.text ?? '').split('\n') : [];
    for (const it of items.filter((x) => x.trim())) {
      if (!/hypersensitiv/i.test(it) && !/\[[^\]]+\]/.test(it)) add('JP-CI', L(s2), `"${it.slice(0, 70)}" gives no reason in [ ].`, 'Add the reason briefly in square brackets, for example "[Symptoms may worsen. See 9.1.1.]".');
    }
  }
}

// ---------------------------------------------------------------- Australia
function checkBtAu(doc, add) {
  const m = doc.meta ?? {};
  const bt = doc.fixed?.blackTriangle ?? '';
  const loc = F('blackTriangle', 'Black triangle');
  const ok = bt.trim().startsWith('▼') && /subject to additional monitoring/i.test(bt) && /www\.tga\.gov\.au\/reporting-problems/i.test(bt);
  if (m.additionalMonitoring && !ok) add('AU-BT', loc, bt.trim() ? 'The black triangle statement is not the standard wording.' : 'The medicine is in the black triangle scheme, but the ▼ and statement are missing.', 'Use the standard statement at the top of the first page.');
  if (!m.additionalMonitoring && bt.trim()) add('AU-BT', loc, 'The medicine is not in the black triangle scheme, but the statement is shown.', 'Remove it.', 'warning');
}
function checkAuPi(doc, t, ctx, add) {
  const m = doc.meta ?? {};
  const title = doc.fixed?.title ?? '';
  if (!/^AUSTRALIAN PRODUCT INFORMATION\s*[–-]/.test(norm(title)) || !has(title, m.proprietaryName ?? '') || !has(title, m.establishedName ?? '')) add('AU-TITLE', F('title', 'Title'), `"${title || '(none)'}" is not the PI title line.`, `Use: "${fill(t.fixed.title, m).replace('{form}', m.dosageForm ?? '')}"`);
  checkBtAu(doc, add);
  const v = V(ctx);
  const s48 = findSection(doc, '4.8');
  if (filled(s48) && !/www\.tga\.gov\.au\/reporting-problems/i.test(secText(s48))) add('AU-PI-STD', L(s48), 'Section 4.8 does not point to www.tga.gov.au/reporting-problems.', 'End with the paragraph "Reporting suspected adverse effects".');
  const s49 = findSection(doc, '4.9');
  if (filled(s49) && !/13\s?11\s?26/.test(secText(s49))) add('AU-PI-STD', L(s49), 'The Poisons Information Centre number is missing.', `Add: "${v.auPic}"`);
  const s7 = findSection(doc, '7');
  if (filled(s7) && !/Schedule\s*\d|Prescription Only Medicine|Pharmacy Medicine|Pharmacist Only Medicine|Unscheduled|Not scheduled/i.test(secText(s7))) add('AU-PI-STD', L(s7), 'Section 7 does not give a Poisons Standard schedule.', 'For example "Prescription Only Medicine (Schedule 4)".');
  const d9 = monthOf(secText(findSection(doc, '9')));
  const d10 = monthOf(secText(findSection(doc, '10')));
  if (filled(findSection(doc, '9')) && d9 === null) add('AU-PI-STD', L(findSection(doc, '9')), 'The date of first approval is not a date.', 'For example "12 March 2025".');
  if (filled(findSection(doc, '10')) && d10 === null) add('AU-PI-STD', L(findSection(doc, '10')), 'The date of revision is not a date.', 'For example "20 August 2026".');
  if (d9 !== null && d10 !== null && d10 < d9) add('AU-PI-STD', L(findSection(doc, '10')), 'The date of revision is earlier than the date of first approval.', 'Check the dates.');
}
function checkAuCmi(doc, t, ctx, add) {
  const v = V(ctx);
  const f = doc.fixed ?? {};
  checkBtAu(doc, add);
  if (!has(f.summaryIntro, 'The full CMI on the next page has more details.')) add('AU-CMI-STD', F('summaryIntro', 'Summary introduction'), 'The CMI summary does not open with the standard introduction.', `Use: "${t.fixed.summaryIntro}"`);
  const s6 = findSection(doc, '6');
  if (filled(s6)) {
    const tx = secText(s6);
    const miss = (v.auCmiSe ?? []).filter((x) => !has(tx, x));
    if (miss.length) add('AU-CMI-STD', L(s6), `Standard sentences missing: ${miss.map((x) => `"${x}"`).join(', ')}.`, 'Use the template sentences.');
    if (!/www\.tga\.gov\.au\/reporting-problems/i.test(tx)) add('AU-CMI-STD', L(s6), 'The statement on reporting side effects to the TGA is missing.', `Add: "${v.auCmiReport}"`);
  }
  if (!new RegExp(`This leaflet was prepared in (${EN_MONTHS}) \\d{4}`, 'i').test(f.prepared ?? '')) add('AU-CMI-STD', F('prepared', 'Prepared line'), 'The leaflet does not say the month and year it was prepared.', '"This leaflet was prepared in August 2026."');
  const sum = findSection(doc, 'sum');
  if (filled(sum)) {
    const n = secText(sum).split('\n').filter((x) => x.trim()).reduce((k, x) => k + Math.max(1, Math.ceil(norm(x).length / 90)), 0);
    if (n > 45) add('AU-CMI-SUM', L(sum), `The summary is about ${n} lines; it should fit on one page.`, 'Keep only the key points under each heading.');
  }
}

// ---------------------------------------------------------------- WHO
function checkWho(doc, t, ctx, add) {
  const v = V(ctx);
  const intro = doc.fixed?.intro ?? '';
  if (!/Prequalification/i.test(intro) || !/national/i.test(intro)) add('WHO-INTRO', F('intro', 'Opening statement'), 'The statement on the scope of the SmPC is missing.', `Use: "${t.fixed.intro}"`);
  const s8 = findSection(doc, '8');
  if (filled(s8)) {
    const ref = norm(secText(s8));
    const want = doc.meta?.pqRef ?? ctx.product?.who?.pqRef;
    if (!/^[A-Z]{2}\d{3}(\([a-z]\))?$/.test(ref)) add('WHO-REF', L(s8), `"${ref}" is not a WHO reference number.`, want ? `Use "${want}".` : 'For example "MA999(a)".');
    else if (want && ref !== want) add('WHO-REF', L(s8), `"${ref}" is not this product's WHO reference number (${want}).`, `Use "${want}".`);
  }
  const s9 = findSection(doc, '9'); const s10 = findSection(doc, '10');
  const d9 = monthOf(secText(s9)); const d10 = monthOf(secText(s10));
  if (filled(s9) && (d9 === null || !/\b\d{1,2}\s+[A-Z][a-z]+\s+\d{4}/.test(secText(s9)))) add('WHO-DATE', L(s9), 'The date of prequalification is not a full date.', 'For example "20 September 2023".');
  if (filled(s10) && d10 === null) add('WHO-DATE', L(s10), 'The date of revision does not give the month and year.', 'For example "July 2026".');
  if (d9 !== null && d10 !== null && d10 < d9) add('WHO-DATE', L(s10), 'The date of revision is earlier than the date of prequalification.', 'Check the dates.');
  const s48 = findSection(doc, '4.8');
  if (filled(s48)) {
    const tx = secText(s48);
    const bad = (v.nonstandardFrequencies ?? []).filter((w) => new RegExp(`\\b${escapeRe(w)}\\b`, 'i').test(tx));
    if (bad.length) add('WHO-48', L(s48), `Non-standard frequency words: ${bad.map((w) => `"${w}"`).join(', ')}.`, 'Use very common, common, uncommon, rare, very rare, not known.');
    else if (!(v.frequencies ?? []).some((w) => new RegExp(`\\b${w}\\b`, 'i').test(tx))) add('WHO-48', L(s48), 'Section 4.8 gives no frequency categories.', 'Give each reaction a MedDRA frequency category.');
  }
}

// ---------------------------------------------------------------- shared
const STR_SECTIONS = { 'ca-pm': ['6'], 'ca-label': ['l4', 'l9'], 'ch-fi': ['f2'], 'ch-pi': ['p9'], 'jp-pi': ['3.1'], 'au-pi': ['2'], 'au-cmi': ['7'], 'who-smpc': ['2'] };
function checkStrengths(doc, ctx, add) {
  const want = new Set((doc.meta?.strengths ?? ctx.product?.strengths ?? []).flatMap((s) => strengths(s)));
  if (!want.size) return;
  for (const n of STR_SECTIONS[doc.kind] ?? []) {
    const s = findSection(doc, n);
    if (!s) continue;
    // Excipient amounts (for example "1.5 mg saccharin sodium") are not strengths.
    const text = [...(s.blocks ?? []), ...(s.subs ?? []).flatMap((y) => y.blocks ?? [])].filter((b) => b.t !== 'p' || !/excipient|sodium|lactose/i.test(b.text ?? '')).map((b) => blocksText([b])).join('\n');
    for (const x of new Set(strengths(text))) if (!want.has(x)) add('INTL-STR', L(s), `${x} is not a strength of this product (${[...want].join(', ')}).`, 'Make the strengths agree with the product.');
  }
}
function checkPromo(doc, ctx, add) {
  const seen = new Set();
  for (const e of textEntries(doc)) {
    for (const w of V(ctx).promo ?? []) {
      if (seen.has(w) || !new RegExp(`\\b${escapeRe(w)}\\b`, 'i').test(e.text)) continue;
      seen.add(w);
      add('INTL-PROMO', e.loc, `"${w}" is promotional.`, 'State the facts; remove claims of superiority.');
    }
  }
}
