// Rule checks. runChecks(doc, ctx) returns issues: { ruleId, severity, loc, msg, hint, key }.
// Every check is tied to a rule card in the pack, which carries the source and any simplification.
import { templateFor, ruleById, fill } from './pack.js';
import { textEntries, blockTexts, blocksText, hasContent, sectionNums, findSection, sectionTitle, HL_LABEL } from './model.js';
import { strengths, normStrength, monthIndex, todayMonth, readingGrade, sentences, wordCount, levenshtein, norm, escapeRe } from './text.js';
import { coreIssues } from './ccds.js';
import { agencyIssues } from './agency.js';
import { checkEu, EU_KINDS } from './checks-eu.js';
import { checkIn, IN_KINDS } from './checks-in.js';
import { checkIntl, INTL_KINDS } from './checks-intl.js';

export const HL_LINE_CHARS = 65;
export const HL_MAX_LINES = 76;
export const BW_MAX_LINES = 20;

const lines = (t) => Math.max(1, Math.ceil(norm(t).length / HL_LINE_CHARS));
const blockLines = (blocks) => (blocks ?? []).reduce((n, b) => n + blockTexts(b).filter((t) => t.trim()).reduce((k, t) => k + lines(t), 0), 0);

// Estimated length of Highlights (not counting the boxed warning), in lines of a half page.
export function highlightsLines(doc, pack) {
  const t = templateFor(pack, 'pi');
  const hl = doc.hl ?? {};
  const m = doc.meta ?? {};
  let n = lines(hl.limitation) + lines(`${m.proprietaryName} (${m.establishedName}) ${m.dosageForm}, ${m.route}`) + 1; // + Initial U.S. Approval
  if ((hl.rmc ?? []).length) n += 1 + hl.rmc.length;
  for (const h of t.hl) if (h.kind !== 'rmc' && hasContent(hl[h.key])) n += 1 + blockLines(hl[h.key]);
  n += lines(hl.pci) + 1; // + Revised
  return n;
}
export const boxedLines = (doc) => (doc.hl?.bw?.length ? 1 + blockLines(doc.hl.bw) + (doc.hl.bwClose ? lines(doc.hl.bwClose) : 0) : 0);

function issueKey(i) { return `${i.ruleId}|${i.loc?.area ?? ''}:${i.loc?.key ?? ''}|${i.msg.slice(0, 60)}`; }

export function runChecks(doc, ctx) {
  const { pack } = ctx;
  const out = [];
  const add = (ruleId, loc, msg, hint, severity) => {
    const r = ruleById(pack, ruleId);
    const i = { ruleId, severity: severity ?? r?.severity ?? 'warning', loc, msg, hint };
    i.key = issueKey(i);
    out.push(i);
  };
  const kind = doc.kind;
  if (kind === 'pi') { checkHighlights(doc, ctx, add); checkFpi(doc, ctx, add); if (doc.role === 'generic') checkGeneric(doc, ctx, add); }
  if (kind === 'pi-old') checkOld(doc, ctx, add);
  if (kind === 'mg' || kind === 'ppi' || kind === 'ifu') checkPatient(doc, ctx, add);
  if (kind === 'carton' || kind === 'container') checkCarton(doc, ctx, add);
  if (kind === 'pmi') checkPmi(doc, ctx, add);
  if (EU_KINDS.includes(kind)) checkEu(doc, ctx, add);
  if (IN_KINDS.includes(kind)) checkIn(doc, ctx, add);
  if (INTL_KINDS.includes(kind)) checkIntl(doc, ctx, add);
  if (['pi', 'mg', 'ppi', 'pmi'].includes(kind) && doc.role !== 'reference') checkPromo(doc, ctx, add);
  checkMedErrors(doc, ctx, add);
  checkName(doc, ctx, add);
  if (ctx.project) coreIssues(doc, ctx.project, add);
  agencyIssues(doc, add);
  const waivers = doc.waivers ?? {};
  for (const i of out) if (waivers[i.key] && i.severity !== 'error') i.waived = waivers[i.key];
  return out;
}

export function summarise(issues) {
  const open = issues.filter((i) => !i.waived);
  return { errors: open.filter((i) => i.severity === 'error').length, warnings: open.filter((i) => i.severity === 'warning').length, info: open.filter((i) => i.severity === 'info').length, waived: issues.filter((i) => i.waived).length };
}
// Approval needs zero errors, and every warning fixed or waived with a reason.
export const canApprove = (issues) => { const s = summarise(issues); return s.errors === 0 && s.warnings === 0; };

const projectDocs = (ctx) => ctx.docs ?? [];
const patientKind = (doc, ctx) => {
  const kinds = projectDocs(ctx).map((d) => d.kind);
  if (doc.meta?.patientLabeling === 'mg' || kinds.includes('mg')) return 'mg';
  if (doc.meta?.patientLabeling || kinds.includes('ppi') || kinds.includes('ifu')) return 'ppi';
  return '';
};
const docStrengths = (doc, ctx) => (doc.meta?.strengths ?? ctx.product?.strengths ?? []).map(normStrength);

// ---------------------------------------------------------------- Highlights
function checkHighlights(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'pi');
  const hl = doc.hl ?? {};
  const m = doc.meta ?? {};
  const L = (key, label) => ({ area: 'hl', key, label: `Highlights, ${label}` });
  const nums = sectionNums(doc);

  const lim = fill(t.fixed.limitation, m);
  if (norm(hl.limitation) !== norm(lim)) add('US-HL-LIM', L('lim', 'limitation statement'), 'The limitation statement is not the required wording.', `Use: "${lim}"`);

  const missing = ['proprietaryName', 'establishedName', 'dosageForm', 'route'].filter((k) => !norm(m[k]));
  if (missing.length) add('US-HL-TITLE', L('title', 'product title'), `The product title is missing: ${missing.map((k) => ({ proprietaryName: 'proprietary name', establishedName: 'established name', dosageForm: 'dosage form', route: 'route' }[k])).join(', ')}.`, 'Fill the product title fields at the top of Highlights.');
  else if (!/^for .+ use$/i.test(norm(m.route))) add('US-HL-TITLE', L('title', 'product title'), `The route "${m.route}" is not in the usual form.`, 'Write the route as "for oral use", "for intravenous use" and so on.');

  const year = Number(m.initialApproval);
  const thisYear = (ctx.today ?? new Date()).getFullYear();
  if (!/^\d{4}$/.test(String(m.initialApproval ?? '')) || year < 1938 || year > thisYear) add('US-HL-APPROVAL', L('approval', 'Initial U.S. Approval'), m.initialApproval ? `"${m.initialApproval}" is not a valid year.` : 'Initial U.S. Approval is missing.', 'Give the four-digit year the active moiety was first approved in the US.');

  // Boxed warning summary
  const fpiBw = doc.bw && hasContent(doc.bw.blocks);
  if (fpiBw) {
    if (!hasContent(hl.bw)) add('US-HL-BW', L('bw', 'boxed warning'), 'The full prescribing information has a boxed warning, but Highlights has no boxed warning summary.', 'Add a short summary of the boxed warning to Highlights.');
    else {
      if (norm(hl.bwClose) !== norm(t.fixed.bwClose)) add('US-HL-BW', L('bw', 'boxed warning'), 'The closing line of the boxed warning summary is missing or reworded.', `End with: "${t.fixed.bwClose}"`);
      const n = boxedLines(doc);
      if (n > BW_MAX_LINES) add('US-HL-BW', L('bw', 'boxed warning'), `The boxed warning summary is about ${n} lines; the limit is ${BW_MAX_LINES}.`, 'Shorten the summary; the full text stays in the full prescribing information.');
    }
    if (!/^WARNING:/.test(norm(doc.bw.title)) || doc.bw.title !== doc.bw.title.toUpperCase()) add('US-HL-BW', { area: 'bw', key: 'bw', label: 'Boxed warning' }, 'The boxed warning heading should start with "WARNING:" and be in capital letters.', 'For example "WARNING: SERIOUS INFECTIONS".');
  } else if (hasContent(hl.bw)) add('US-HL-BW', L('bw', 'boxed warning'), 'Highlights has a boxed warning summary but the full prescribing information has no boxed warning.', 'Add the full boxed warning, or remove the summary.');

  // Recent Major Changes
  const rev = monthIndex(m.revised);
  for (const [i, r] of (hl.rmc ?? []).entries()) {
    const where = L('rmc', 'Recent Major Changes');
    const top = r.num ? r.num.split('.')[0] : '';
    const isBw = !r.num && /^boxed warning/i.test(norm(r.heading));
    if (!isBw && !['1', '2', '4', '5'].includes(top)) add('US-HL-RMC', where, `Entry ${i + 1} (${r.heading || 'no heading'}${r.num ? `, ${r.num}` : ''}) is not a section that can be listed.`, 'Only the Boxed Warning and sections 1, 2, 4 and 5 can appear in Recent Major Changes.');
    else if (r.num && !nums.has(r.num)) add('US-HL-RMC', where, `Entry ${i + 1} cites ${r.num}, which is not in the full prescribing information.`, 'Check the section number.');
    const d = monthIndex(r.date);
    if (d === null) add('US-HL-RMC', where, `Entry ${i + 1} has no date in MM/YYYY form.`, 'Give the month and year of the change, for example 08/2026.');
    else if (rev !== null && d > rev) add('US-HL-RMC', where, `Entry ${i + 1} (${r.date}) is later than the revision date.`, 'The revision date must be the date of the latest change.');
    else if (rev !== null && rev - d >= 12) add('US-HL-RMC', where, `Entry ${i + 1} (${r.date}) is ${rev - d} months older than the revision date.`, 'Remove entries once they have been listed for a year (at the next printing).');
  }

  // Each Highlights statement cites its section
  const refRe = /\(([\d.,\s]+)\)\s*$/;
  for (const h of t.hl) {
    if (h.kind === 'rmc') continue;
    const blocks = hl[h.key] ?? [];
    if (h.need === 'required' && !hasContent(blocks)) { add('US-HL-REF', L(h.key, HL_LABEL[h.key]), `${HL_LABEL[h.key]} in Highlights is empty.`, `Summarise section ${h.ref}.`, 'error'); continue; }
    for (const b of blocks) for (const text of blockTexts(b)) {
      const s = norm(text);
      if (!s || /:$/.test(s) || /SUSPECTED ADVERSE REACTIONS/.test(s)) continue;
      const mm = refRe.exec(s);
      if (!mm) { add('US-HL-REF', L(h.key, HL_LABEL[h.key]), `"${s.slice(0, 70)}${s.length > 70 ? '…' : ''}" does not cite a section.`, `End the statement with the section number in parentheses, for example "(${h.ref})".`); continue; }
      for (const n of mm[1].split(/\s*,\s*/).map((x) => x.trim()).filter(Boolean)) if (!nums.has(n)) add('US-HL-REF', L(h.key, HL_LABEL[h.key]), `"(${n})" does not exist in the full prescribing information.`, 'Point to an existing section or subsection.');
    }
  }

  // Adverse reaction contact statement
  const ar = blocksText(hl.ar);
  const needs = ['To report SUSPECTED ADVERSE REACTIONS, contact', '1-800-FDA-1088', 'www.fda.gov/medwatch'];
  const lacking = needs.filter((x) => !ar.includes(x));
  if (lacking.length || (m.manufacturer && !ar.includes(m.manufacturer))) add('US-HL-AR', L('ar', 'Adverse Reactions'), `The reporting statement is incomplete${lacking.length ? `: missing ${lacking.map((x) => `"${x}"`).join(', ')}` : ': the manufacturer name does not match the product title page'}.`, `Use: "${fill(ctx.pack.templates.pi.fixed.arContact, m)}"`);

  const pk = patientKind(doc, ctx);
  const pciWant = pk === 'mg' ? t.fixed.pciMG : pk ? t.fixed.pciPPI : t.fixed.pci;
  if (norm(hl.pci).replace(/\.$/, '') !== norm(pciWant).replace(/\.$/, '')) add('US-HL-PCI', L('pci', 'counselling statement'), 'The patient counselling statement is not the required wording.', `Use: "${pciWant}"`);

  if (monthIndex(m.revised) === null) add('US-HL-REV', L('rev', 'revision date'), m.revised ? `"${m.revised}" is not in MM/YYYY form.` : 'The revision date is missing.', 'Write it as "Revised: 08/2026".');
  else if (monthIndex(m.revised) > todayMonth(ctx.today ?? new Date())) add('US-HL-REV', L('rev', 'revision date'), 'The revision date is in the future.', 'Use the month of the most recent change.');

  const n = highlightsLines(doc, ctx.pack);
  if (n > HL_MAX_LINES) add('US-HL-LEN', L('len', 'length'), `Highlights are about ${n} lines; a half page holds about ${HL_MAX_LINES}.`, 'Shorten the summaries, or request a waiver.');

  // Contraindications in Highlights against section 4
  const s4 = findSection(doc, '4');
  const count = (blocks) => (blocks ?? []).reduce((k, b) => k + blockTexts(b).filter((x) => x.trim() && !/:$/.test(x.trim())).length, 0);
  const fpiCi = count(s4?.blocks); const hlCi = count(hl.ci);
  if (fpiCi && hlCi < fpiCi) add('US-HL-CI', L('ci', 'Contraindications'), `Section 4 has ${fpiCi} contraindication(s) but Highlights lists ${hlCi}.`, 'Summarise every contraindication in Highlights.');
  if (!fpiCi && hlCi && !/^none\.?/i.test(norm(blocksText(hl.ci)))) add('US-HL-CI', L('ci', 'Contraindications'), 'Highlights lists contraindications that section 4 does not have.', 'Make Highlights and section 4 agree.');
}

// ---------------------------------------------------------------- Full prescribing information
function checkFpi(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'pi');
  const nums = sectionNums(doc);
  const tmpl = Object.fromEntries(t.sections.map((s) => [s.num, s]));
  const S = (s) => ({ area: 'sec', key: s.num, label: sectionTitle(s) });

  // Order, headings and unknown sections
  let last = 0;
  for (const s of doc.sections ?? []) {
    const ts = tmpl[s.num];
    if (!ts) { add('US-PI-SEC-TITLE', S(s), `Section ${s.num} is not a PLR section.`, 'PLR sections are numbered 1 to 17.'); continue; }
    if (Number(s.num) < last) add('US-PI-SEC-TITLE', S(s), `Section ${s.num} is out of order.`, 'Sections appear in numerical order.');
    last = Number(s.num);
    if (s.title !== ts.title) add('US-PI-SEC-TITLE', S(s), `Heading "${s.title}" should be "${ts.title}".`, 'Use the heading set by the regulation, in capitals.');
    const fixed = Object.fromEntries((ts.fixedSubs ?? []).map((x) => [x.num, x]));
    for (const x of s.subs ?? []) {
      if (!x.num.startsWith(`${s.num}.`)) add('US-PI-SEC-TITLE', S(x), `Subsection ${x.num} is filed under section ${s.num}.`, 'Move it to the right section.');
      if (fixed[x.num] && x.title !== fixed[x.num].title) add('US-PI-SEC-TITLE', S(x), `Heading "${x.title}" should be "${fixed[x.num].title}".`, 'Fixed subsections keep their regulation wording.');
      if (ts.fixedSubs && !fixed[x.num] && !ts.extraSubs) add('US-PI-SEC-TITLE', S(x), `${x.num} is not one of the fixed subsections of section ${s.num}.`, `Section ${s.num} uses ${ts.fixedSubs.map((f) => f.num).join(', ')}.`);
    }
  }
  // Required content
  for (const ts of t.sections) {
    if (ts.num === '4') continue;
    const s = (doc.sections ?? []).find((x) => x.num === ts.num);
    const filled = s && (hasContent(s.blocks) || (s.subs ?? []).some((x) => hasContent(x.blocks)));
    const loc = { area: 'sec', key: ts.num, label: `${ts.num} ${ts.title}` };
    if (!filled && ts.need === 'required') add('US-PI-SEC-REQ', loc, `Section ${ts.num} ${ts.title} is missing or empty.`, 'This section is required in PLR format.');
    if (!filled && ts.need === 'recommended') add('US-PI-SEC-REQ', loc, `Section ${ts.num} ${ts.title} is missing or empty.`, 'Most products need this section; if it does not apply, waive this warning with a reason.', 'warning');
    if (s) for (const fs of ts.fixedSubs ?? []) {
      const x = (s.subs ?? []).find((y) => y.num === fs.num);
      const ok = x && hasContent(x.blocks);
      const l2 = { area: 'sec', key: fs.num, label: `${fs.num} ${fs.title}` };
      if (!ok && fs.need === 'required') add('US-PI-SEC-REQ', l2, `${fs.num} ${fs.title} is missing or empty.`, 'This subsection is required.');
      if (!ok && fs.need === 'recommended') add('US-PI-SEC-REQ', l2, `${fs.num} ${fs.title} is missing or empty.`, 'Expected for most products; waive with a reason if it does not apply.', 'warning');
    }
  }
  // Contraindications
  const s4 = findSection(doc, '4');
  if (!s4 || !hasContent(s4.blocks)) add('US-PI-CI-NONE', { area: 'sec', key: '4', label: '4 CONTRAINDICATIONS' }, 'Section 4 is empty.', 'List each contraindication, or write "None."');

  // Cross-references
  for (const e of textEntries(doc)) {
    if (e.loc.area !== 'sec' && e.loc.area !== 'bw') continue;
    for (const mm of e.text.matchAll(/\[see ([^\]]+)\]/gi)) {
      for (const p of mm[1].matchAll(/\(([\d.,\s]+)\)/g)) {
        for (const n of p[1].split(/\s*,\s*/).map((x) => x.trim()).filter(Boolean)) if (!nums.has(n)) add('US-PI-XREF', e.loc, `Cross-reference (${n}) points to a section that does not exist.`, 'Fix the number, or add the section.');
      }
    }
  }
  // Boxed warning refers to section 5
  if (doc.bw && hasContent(doc.bw.blocks) && !/\(5(\.\d+)?/.test(blocksText(doc.bw.blocks))) add('US-PI-BW-REF', { area: 'bw', key: 'bw', label: 'Boxed warning' }, 'The boxed warning does not point to Warnings and Precautions.', 'Add "[see Warnings and Precautions (5.x)]" after each risk.');

  // PLLR
  for (const e of textEntries(doc)) if (/pregnancy category\s+[ABCDX]\b/i.test(e.text)) add('US-PI-PLLR', e.loc, 'A pregnancy letter category is used.', 'Letter categories were removed by the PLLR; describe the risk in a Risk Summary instead.');
  for (const n of ['8.1', '8.2']) {
    const x = findSection(doc, n);
    if (x && hasContent(x.blocks) && !blocksText(x.blocks).split('\n').some((l) => /^risk summary\b/i.test(norm(l)))) add('US-PI-PLLR', { area: 'sec', key: n, label: sectionTitle(x) }, `${n} has no "Risk Summary".`, 'Start the subsection with a Risk Summary.');
  }
  // Section 6 statement
  const s6 = findSection(doc, '6');
  if (s6) {
    const all = [blocksText(s6.blocks), ...(s6.subs ?? []).map((x) => blocksText(x.blocks))].join('\n');
    const hasData = /\d+(\.\d+)?%/.test(all) || (s6.subs ?? []).some((x) => x.blocks.some((b) => b.t === 'table'));
    if (hasData && !norm(all).includes(norm(t.fixed.arStatement))) add('US-PI-AR-STMT', { area: 'sec', key: (s6.subs?.[0]?.num) ?? '6', label: s6.subs?.[0] ? sectionTitle(s6.subs[0]) : '6 ADVERSE REACTIONS' }, 'The standard clinical trials statement is missing.', `Add: "${t.fixed.arStatement}"`);
  }
  // Strengths
  const want = docStrengths(doc, ctx);
  if (want.length) {
    const check = (loc, text) => { for (const s of new Set(strengths(text))) if (!want.includes(s) && !/\/kg/.test(text)) add('US-PI-STR', loc, `${s} is not one of the strengths (${want.join(', ')}).`, 'Make the strengths agree everywhere.'); };
    check({ area: 'hl', key: 'dfs', label: 'Highlights, Dosage Forms and Strengths' }, blocksText(doc.hl?.dfs));
    const s3 = findSection(doc, '3'); if (s3) check({ area: 'sec', key: '3', label: sectionTitle(s3) }, blocksText(s3.blocks));
    const s16 = findSection(doc, '16'); if (s16) check({ area: 'sec', key: '16', label: sectionTitle(s16) }, blocksText(s16.blocks).split('\n').filter((l) => /tablet|capsule|vial|strength|mg|mcg/i.test(l) && !/store|°/i.test(l)).join('\n'));
    const hlStr = new Set(strengths(blocksText(doc.hl?.dfs)));
    const missing = want.filter((s) => !hlStr.has(s));
    if (hlStr.size && missing.length) add('US-PI-STR', { area: 'hl', key: 'dfs', label: 'Highlights, Dosage Forms and Strengths' }, `Highlights do not list ${missing.join(', ')}.`, 'List every strength.');
  }
  // Section 17 and patient labelling
  const pk = patientKind(doc, ctx);
  const s17 = findSection(doc, '17');
  if (pk && s17) {
    const txt = blocksText(s17.blocks);
    const ok = pk === 'mg' ? /Medication Guide/.test(txt) : /patient labeling/i.test(txt);
    if (!ok) add('US-PI-17-MG', { area: 'sec', key: '17', label: sectionTitle(s17) }, `Section 17 does not tell the prescriber to advise reading the ${pk === 'mg' ? 'Medication Guide' : 'patient labeling'}.`, pk === 'mg' ? 'Start with: "Advise the patient to read the FDA-approved patient labeling (Medication Guide)."' : 'Start with: "Advise the patient to read the FDA-approved patient labeling (Patient Information)."');
  }
}

// ---------------------------------------------------------------- Generic labelling
const permittedSame = new Set(['3', '11', '16', '17']);
export function carveFindings(gen) {
  const out = [];
  const carved = (gen.carveOuts ?? []).filter((c) => (gen.carved ?? []).includes(c.num));
  for (const c of carved) {
    if (findSection(gen, c.num)) out.push({ loc: { area: 'sec', key: c.num, label: c.num }, msg: `${c.num} ${c.name} is carved out but the subsection is still there.`, c });
    const re = new RegExp(c.keywords.map(escapeRe).join('|'), 'i');
    const seen = new Set();
    for (const e of textEntries(gen)) {
      if (e.loc.key === c.num) continue;
      if (re.test(e.text)) {
        const k = `${e.loc.area}:${e.loc.key}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ loc: e.loc, msg: `Mentions the carved-out indication (${c.name}): "${norm(e.text).slice(0, 80)}…"`, c });
      }
    }
  }
  return out;
}
function checkGeneric(doc, ctx, add) {
  for (const f of carveFindings(doc)) add('US-ANDA-CARVE', f.loc, f.msg, 'Remove the indication everywhere it depends on: Highlights, dosing, adverse reactions and clinical studies.');
  const ref = projectDocs(ctx).find((d) => d.role === 'reference' && d.kind === 'pi');
  if (!ref) return;
  for (const row of compareSections(ref, doc)) if (row.status === 'different') add('US-ANDA-SAME', { area: 'sec', key: row.num, label: row.label }, `${row.label} differs from the reference label and is not a permitted difference.`, 'Open Compare to see the words that differ.');
}

// Section-by-section comparison of a generic label with its reference. Words naming the product
// and the company are normalised first; sentences about a carved-out indication are left to the
// carve-out check.
export function compareSections(ref, gen) {
  const rn = ref.meta?.proprietaryName ?? ''; const gn = gen.meta?.proprietaryName ?? '';
  const carved = (gen.carveOuts ?? []).filter((c) => (gen.carved ?? []).includes(c.num));
  const kw = carved.length ? new RegExp(carved.flatMap((c) => c.keywords).map(escapeRe).join('|'), 'i') : null;
  const swap = (s) => norm(s).split(rn).join(gn).split(ref.meta?.manufacturer ?? '\u0000').join(gen.meta?.manufacturer ?? '').split(ref.meta?.phone ?? '\u0000').join(gen.meta?.phone ?? '');
  const prep = (text, isRef) => sentences(isRef ? swap(text) : norm(text)).filter((s) => !(kw && kw.test(s))).join(' ');
  const rows = [];
  const all = new Map();
  const collect = (d, side) => { for (const s of d.sections ?? []) { all.set(s.num, { ...(all.get(s.num) ?? {}), [side]: s, label: sectionTitle(s), top: s.num }); for (const x of s.subs ?? []) all.set(x.num, { ...(all.get(x.num) ?? {}), [side]: x, label: sectionTitle(x), top: s.num }); } };
  collect(ref, 'ref'); collect(gen, 'gen');
  for (const [num, v] of all) {
    const carvedSec = carved.some((c) => c.num === num);
    const a = v.ref ? prep(blocksText(v.ref.blocks), true) : null;
    const b = v.gen ? prep(blocksText(v.gen.blocks), false) : null;
    let status;
    if (carvedSec) status = v.gen ? 'carve-left' : 'carved';
    else if (a === null) status = 'extra';
    else if (b === null) status = (a === '' ? 'same' : 'missing');
    else if (a === b) status = 'same';
    else if (permittedSame.has(v.top)) status = 'permitted';
    else if (kw && !a && !b) status = 'same';
    else status = 'different';
    if (status === 'missing' && kw && !a) status = 'same';
    rows.push({ num, label: v.label, status, ref: v.ref, gen: v.gen, a: a ?? '', b: b ?? '' });
  }
  return rows.sort((x, y) => x.num.localeCompare(y.num, undefined, { numeric: true }));
}

// ---------------------------------------------------------------- Older format
function checkOld(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'pi-old');
  const order = t.sections.map((s) => s.title);
  let last = -1;
  for (const s of doc.sections ?? []) {
    const i = order.indexOf(s.title);
    const loc = { area: 'sec', key: s.num, label: s.title };
    if (i < 0) add('US-PI-SEC-TITLE', loc, `"${s.title}" is not an older-format section heading.`, 'Use the headings in 21 CFR 201.80.');
    else if (i < last) add('US-PI-SEC-TITLE', loc, `${s.title} is out of order.`, 'Follow the order in 21 CFR 201.80.');
    last = Math.max(last, i);
  }
  for (const ts of t.sections) if (ts.need === 'required' && !(doc.sections ?? []).some((s) => s.title === ts.title && hasContent(s.blocks))) add('US-PI-SEC-REQ', { area: 'sec', key: ts.num, label: ts.title }, `${ts.title} is missing or empty.`, 'Required in the older format.');
  for (const e of textEntries(doc)) if (/pregnancy category\s+[ABCDX]\b/i.test(e.text)) add('US-PI-PLLR', e.loc, 'Uses a pregnancy letter category.', 'Older-format labels must move to PLLR content when they are next revised in a way that triggers it; convert this to an 8.1 Risk Summary.', 'warning');
}

// ---------------------------------------------------------------- Patient labelling
function checkPatient(doc, ctx, add) {
  const t = templateFor(ctx.pack, doc.kind);
  const m = doc.meta ?? {};
  const S = (s) => ({ area: 'sec', key: s.num, label: s.title });
  const want = t.sections.map((s) => ({ ...s, titles: [s.title, ...(s.alt ?? [])].map((x) => fill(x, m)) }));
  let last = -1;
  for (const s of doc.sections ?? []) {
    const i = want.findIndex((w) => w.num === s.num);
    if (i < 0) continue;
    if (!want[i].titles.includes(norm(s.title))) add('US-PT-HEAD', S(s), `Heading "${s.title}" should be "${want[i].titles[0]}".`, 'Use the template heading with the product name.');
    if (i < last) add('US-PT-HEAD', S(s), `"${s.title}" is out of order.`, 'Follow the template order.');
    last = Math.max(last, i);
  }
  for (const w of want) {
    const s = (doc.sections ?? []).find((x) => x.num === w.num);
    if (s && hasContent(s.blocks)) continue;
    const loc = { area: 'sec', key: w.num, label: w.titles[0] };
    if (w.need === 'required') add('US-PT-HEAD', loc, `"${w.titles[0]}" is missing or empty.`, 'This heading is required.');
    if (w.need === 'recommended') add('US-PT-HEAD', loc, `"${w.titles[0]}" is missing or empty.`, 'Expected in most leaflets; waive with a reason if it does not apply.', 'warning');
  }
  const f = doc.fixed ?? {};
  const F = (k, l) => ({ area: 'fixed', key: k, label: l });
  if (norm(f.header) !== t.fixed.header) add('US-PT-FIXED', F('header', 'Title'), `The title should be "${t.fixed.header}".`, 'Use the exact title.');
  if (t.fixed.sideEffects && norm(f.sideEffects) !== norm(t.fixed.sideEffects)) add('US-PT-FIXED', F('sideEffects', 'Side-effect statement'), 'The side-effect reporting statement is missing or reworded.', `Use: "${t.fixed.sideEffects}"`);
  if (norm(f.approval) !== norm(t.fixed.approval)) add('US-PT-FIXED', F('approval', 'Approval statement'), 'The FDA approval statement is missing or reworded.', `Use: "${t.fixed.approval}"`);
  if (monthIndex(m.revised) === null) add('US-PT-FIXED', F('revised', 'Revision date'), 'The revision date is missing or not in MM/YYYY form.', 'Write it as "Revised: 08/2026".');

  if (doc.kind === 'mg') {
    const pi = projectDocs(ctx).find((d) => d.kind === 'pi' && d.role !== 'reference');
    const m1 = (doc.sections ?? []).find((s) => s.num === 'm1');
    if (pi?.bw && hasContent(pi.bw.blocks) && !(m1 && hasContent(m1.blocks))) add('US-MG-PI', { area: 'sec', key: 'm1', label: 'Most important information' }, 'The prescribing information has a boxed warning, but the Medication Guide does not open with the most important information.', 'Explain the boxed-warning risks first, in plain words.');
  }
  // Readability hints
  const body = (doc.sections ?? []).map((s) => blocksText(s.blocks)).join('\n');
  const g = readingGrade(body);
  if (g !== null && g > 8) add('US-PT-READ', { area: 'doc', key: 'all', label: 'Whole leaflet' }, `Estimated reading grade ${g}. Aim for grade 6 to 8.`, 'Use shorter sentences and everyday words.');
  let long = 0;
  for (const e of textEntries(doc)) {
    if (e.loc.area !== 'sec') continue;
    for (const s of sentences(e.text)) if (wordCount(s) > 25 && long < 6) { long++; add('US-PT-READ', e.loc, `Long sentence (${wordCount(s)} words): "${s.slice(0, 60)}…"`, 'Split it into two sentences.'); }
    for (const [term, plain] of Object.entries(ctx.pack.vocab.jargon)) {
      if (new RegExp(`\\b${escapeRe(term)}\\b`, 'i').test(e.text)) add('US-PT-READ', e.loc, `"${term}" is a medical term.`, `Try "${plain}".`);
    }
  }
}

// ---------------------------------------------------------------- Carton and container
function checkCarton(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'carton');
  const f = doc.fields ?? {};
  const F = (k, label) => ({ area: 'field', key: k, label });
  for (const fd of t.fields) {
    const need = fd.need[doc.kind];
    if (norm(f[fd.key])) continue;
    if (need === 'required') add('US-CC-REQ', F(fd.key, fd.label), `${fd.label} is missing.`, `Required (${fd.at}).`);
    if (need === 'recommended') add('US-CC-REQ', F(fd.key, fd.label), `${fd.label} is missing.`, `Expected on this label (${fd.at}); waive with a reason if space does not allow.`, 'warning');
  }
  if (norm(f.ndc) && !/^NDC\s+(\d{4}-\d{4}-\d{2}|\d{5}-\d{3}-\d{2}|\d{5}-\d{4}-\d{1})$/.test(norm(f.ndc))) add('US-CC-NDC', F('ndc', 'NDC'), `"${f.ndc}" is not a 10-digit NDC in a 4-4-2, 5-3-2 or 5-4-1 configuration.`, 'For example "NDC 99999-1010-3".');
  if (!doc.barcode) add('US-CC-BARCODE', F('barcode', 'Bar code'), 'There is no linear bar code with the NDC.', 'Add the bar code (201.25).');
  const p = Number(doc.sizes?.proprietaryName); const e = Number(doc.sizes?.establishedName);
  if (p && e && e * 2 < p) add('US-CC-ESTNAME', F('establishedName', 'Established name'), `The established name (${e} pt) is less than half the size of the proprietary name (${p} pt).`, `Make it at least ${Math.ceil(p / 2)} pt.`);
  const pi = projectDocs(ctx).find((d) => d.kind === 'pi' && d.role !== 'reference');
  const want = (pi?.meta?.strengths ?? ctx.product?.strengths ?? []).map(normStrength);
  const got = strengths(f.strength);
  if (norm(f.strength) && want.length && !got.some((s) => want.includes(s))) add('US-CC-STR', F('strength', 'Strength'), `"${f.strength}" is not one of the approved strengths (${want.join(', ')}).`, 'Use a strength from the prescribing information.');
  if (doc.injectable && norm(f.strength)) {
    const perTotal = got.some((s) => /\/\d/.test(s)); const perMl = got.some((s) => /\/mL$/.test(s));
    if (!perTotal || !perMl) add('US-CC-PERML', F('strength', 'Strength'), 'Injectable strength should give the amount per total volume and per mL.', 'For example "50 mg/5 mL (10 mg/mL)".');
  }
  const needsMg = projectDocs(ctx).some((d) => d.kind === 'mg') || pi?.meta?.patientLabeling === 'mg';
  if (doc.kind === 'carton' && needsMg && !/Medication Guide/.test(f.mgStatement ?? '')) add('US-CC-MG', F('mgStatement', 'Medication Guide statement'), 'The Medication Guide dispensing statement is missing.', `Add: "${t.fixed.mgStatement}"`);
}

// ---------------------------------------------------------------- Medication-error checks
function checkMedErrors(doc, ctx, add) {
  const abbr = ctx.pack.vocab.abbreviations.map((a) => ({ ...a, re: new RegExp(a.pattern) }));
  for (const e of textEntries(doc)) {
    const tz = e.text.match(/\b\d+\.0+\s*(mg|mcg|g|mL|units?|%)/);
    if (tz) add('US-ME-TZ', e.loc, `Trailing zero in "${tz[0]}".`, `Write "${tz[0].replace(/\.0+/, '')}".`);
    const nd = e.text.match(/(^|[\s(])\.\d+/);
    if (nd) add('US-ME-ND', e.loc, `Naked decimal "${nd[0].trim()}".`, `Write "0${nd[0].trim().replace(/^\(/, '')}".`);
    for (const a of abbr) { const mm = e.text.match(a.re); if (mm) add('US-ME-ABBR', e.loc, `Error-prone abbreviation ${a.label} in "${mm[0].trim()}".`, `Write "${a.use}" in full.`); }
  }
}

// ---------------------------------------------------------------- Established name spelling
function checkName(doc, ctx, add) {
  const est = String(doc.meta?.establishedName ?? doc.fields?.establishedName ?? '').toLowerCase().replace(/[()]/g, ' ');
  const targets = est.split(/[\s,/-]+/).filter((w) => w.length >= 6 && !['tablets', 'tablet', 'injection', 'capsules', 'aerosol', 'inhalation', 'solution'].includes(w));
  if (!targets.length) return;
  const seen = new Set();
  for (const e of textEntries(doc)) {
    for (const w of e.text.match(/[A-Za-z]{6,}/g) ?? []) {
      const lw = w.toLowerCase();
      for (const t of targets) {
        if (lw === t || seen.has(lw)) continue;
        const d = levenshtein(lw, t);
        if (d > 0 && d <= 2 && Math.abs(lw.length - t.length) <= 2) { seen.add(lw); add('US-NAME', e.loc, `"${w}" looks like a misspelling of ${t}.`, `Write "${t}".`); }
      }
    }
  }
}

// ---------------------------------------------------------------- Proposed PMI (Watch)
const RISK_WORDS = { infection: 'infection', infections: 'infection', malignancy: 'cancer|malignan|lymphoma', malignancies: 'cancer|malignan|lymphoma', thrombosis: 'blood clot|thrombo', mortality: 'death|died', hepatotoxicity: 'liver', suicidal: 'suicid' };
export function boxedRisks(pi) {
  const title = norm(pi?.bw?.title ?? '');
  if (!title) return [];
  return title.replace(/^WARNING:\s*/i, '').split(/,\s*(?:AND\s+)?|\s+AND\s+/i).map((x) => x.trim()).filter(Boolean).map((phrase) => {
    const w = phrase.toLowerCase().split(/\s+/).at(-1);
    return { phrase, re: RISK_WORDS[w] ?? escapeRe(w.slice(0, 6)) };
  });
}
function checkPmi(doc, ctx, add) {
  const t = templateFor(ctx.pack, 'pmi');
  const m = doc.meta ?? {};
  const want = [];
  for (const s of t.sections) { want.push(s); for (const x of s.fixedSubs ?? []) want.push(x); }
  for (const w of want) {
    const s = findSection(doc, w.num);
    const title = fill(w.title, m);
    const loc = { area: 'sec', key: w.num, label: title };
    const filled = s && (hasContent(s.blocks) || (s.subs ?? []).some((x) => hasContent(x.blocks)));
    if (!s) add('US-PMI-HEAD', loc, `"${title}" is missing.`, 'Keep every proposed heading, in order.');
    else if (norm(s.title) !== norm(title)) add('US-PMI-HEAD', loc, `Heading "${s.title}" should be "${title}".`, 'Use the proposed heading wording.');
    else if (!filled && !(w.fixedSubs ?? []).length) add('US-PMI-HEAD', loc, `"${title}" is empty.`, 'Every section of the PMI needs content.');
  }
  const all = textEntries(doc).filter((e) => e.loc.area === 'sec').map((e) => e.text).join('\n');
  const words = wordCount(all);
  if (words > t.pageWords) add('US-PMI-LEN', { area: 'sec', key: 'p0', label: 'Length' }, `About ${words} words; one page holds about ${t.pageWords} at 10 point.`, 'Cut to what a patient needs most; the details stay in the prescribing information.');
  const p3 = findSection(doc, 'p3');
  if (p3 && hasContent(p3.blocks) && !norm(blocksText(p3.blocks)).toLowerCase().startsWith(norm(t.fixed.useStart).toLowerCase().replace(/\.$/, ''))) add('US-PMI-USE', { area: 'sec', key: 'p3', label: 'Directions for Use' }, 'Directions for Use do not start with "Use exactly as prescribed."', 'Make it the first sentence.');
  const pi = (ctx.docs ?? []).find((d) => d.kind === 'pi' && d.role !== 'reference');
  const warn = norm(blocksText(findSection(doc, 'p1.1')?.blocks)).toLowerCase();
  for (const r of boxedRisks(pi)) if (!new RegExp(r.re, 'i').test(warn)) add('US-PMI-BW', { area: 'sec', key: 'p1.1', label: 'Important Safety Information, Warnings' }, `The boxed warning risk "${r.phrase.toLowerCase()}" is not in Warnings.`, 'Explain each boxed warning risk in plain words.');
  const g = readingGrade(all);
  if (words > 40 && g > 8) add('US-PMI-READ', { area: 'sec', key: 'p0', label: 'Reading level' }, `Estimated reading grade ${g.toFixed(1)}.`, 'Shorter sentences and everyday words bring it down; grade 6 to 8 is a common target.', 'info');
}
function checkPromo(doc, ctx, add) {
  const words = ctx.pack.vocab?.promo ?? [];
  if (!words.length) return;
  const re = new RegExp(`\\b(${words.map(escapeRe).join('|')})\\b`, 'i');
  for (const e of textEntries(doc)) {
    if (e.loc.area === 'fixed') continue;
    const mm = re.exec(e.text);
    if (mm) add('US-PMI-PROMO', e.loc, `"${mm[1]}" reads as promotional.`, 'Labelling states facts and the evidence for them; remove claims of superiority.');
  }
}
