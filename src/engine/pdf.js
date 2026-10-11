// PDFs made in the browser with pdf-lib: the label itself (clean or annotated), the check
// report, the version comparison, and the certificate. Every page carries a "Training use only"
// watermark. The layout is a neutral house style, not a copy of any agency's formatting.
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { blockTexts, sectionTitle, HL_LABEL, FIELD_LABEL } from './model.js';
import { templateFor, fill, sourceOf, ruleById } from './pack.js';

const INK = rgb(0.1, 0.13, 0.18);
const MUTED = rgb(0.38, 0.42, 0.48);
const ACCENT = rgb(0.17, 0.4, 0.38);
const NOTE = rgb(0.45, 0.3, 0.05);
const WARN = rgb(0.62, 0.14, 0.14);
const RED = rgb(0.78, 0.06, 0.18);
const LETTER = [612, 792];

const MAP = { '‘': "'", '’': "'", '“': '"', '”': '"', '–': '-', '—': '-', '→': '->', '≥': '>=', '≤': '<=', '…': '...', ' ': ' ', '•': '-', '✕': 'x', 'µ': 'mc', '▼': '(black triangle)', '×': 'x', '⁹': '^9', '«': '"', '»': '"', '₹': 'Rs.' };
const MAP_RE = new RegExp(`[${Object.keys(MAP).join('')}]`, 'g');
export const clean = (s) => String(s ?? '').replace(MAP_RE, (c) => MAP[c]).replace(/[^\x09\x0a\x0d\x20-\x7e\u00a1-\u00ff]/g, '?');

async function setup(title) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const italic = await pdf.embedFont(StandardFonts.HelveticaOblique);
  pdf.setTitle(title);
  pdf.setAuthor('Labelling Workbench');
  pdf.setCreator('Labelling Workbench (built by Khan Gulrez Shagufa Fazal Ahmed)');
  pdf.setSubject('Training use only. Fictional products and companies.');
  return { pdf, font, bold, italic };
}

function wrap(text, f, size, width) {
  const out = [];
  for (const para of clean(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (f.widthOfTextAtSize(next, size) <= width || !line) line = next;
      else { out.push(line); line = word; }
    }
    out.push(line);
  }
  return out;
}

function writer(pdf, fonts, { header, watermark = 'TRAINING USE ONLY' }) {
  const { font, bold } = fonts;
  const M = 54;
  let page; let y;
  const pages = [];
  const add = () => {
    page = pdf.addPage(LETTER);
    pages.push(page);
    const { height: H } = page.getSize();
    page.drawText(clean(watermark), { x: 110, y: 250, size: 44, font: bold, color: rgb(0.86, 0.88, 0.9), rotate: degrees(40), opacity: 0.5 });
    page.drawText(clean(header), { x: M, y: H - 32, size: 8, font, color: MUTED });
    y = H - 56;
  };
  add();
  const W = () => page.getWidth() - 2 * M;
  const need = (h) => { if (y - h < 56) add(); };
  const api = {
    text(str, { size = 9.5, f = font, color = INK, indent = 0, gap = 2.6 } = {}) {
      for (const line of wrap(str, f, size, W() - indent)) {
        need(size + gap);
        page.drawText(line, { x: M + indent, y: y - size, size, font: f, color });
        y -= size + gap;
      }
    },
    h(str, size = 11) { need(size + 16); y -= 6; api.text(str, { size, f: bold }); y -= 2; },
    space(n = 5) { y -= n; },
    rule() { need(10); page.drawLine({ start: { x: M, y: y - 4 }, end: { x: M + W(), y: y - 4 }, thickness: 0.6, color: rgb(0.75, 0.78, 0.82) }); y -= 10; },
    // A ruled box around a set of lines (boxed warning). Breaks across pages if it must.
    box(title, lines, { size = 9, border = INK, weight = 1 } = {}) {
      const all = [{ t: title, f: bold }, ...lines.map((t) => ({ t, f: font }))];
      const wrapped = all.flatMap((l) => wrap(l.t, l.f, size, W() - 16).map((t) => ({ t, f: l.f })));
      let i = 0;
      while (i < wrapped.length) {
        need(size * 3);
        const top = y;
        const room = Math.max(1, Math.floor((y - 60) / (size + 2.6)));
        const chunk = wrapped.slice(i, i + room);
        for (const l of chunk) { page.drawText(l.t, { x: M + 8, y: y - size - 4, size, font: l.f, color: INK }); y -= size + 2.6; }
        y -= 8;
        page.drawRectangle({ x: M, y, width: W(), height: top - y, borderColor: border, borderWidth: weight });
        y -= 6;
        i += chunk.length;
      }
    },
    finish(footer) { pages.forEach((p, i) => p.drawText(clean(`${footer} - page ${i + 1} of ${pages.length}`), { x: M, y: 30, size: 7.5, font, color: MUTED })); },
  };
  return api;
}

function writeBlocks(w, blocks, { annotate = false, italic, indent = 0, red = false } = {}) {
  for (const b of blocks ?? []) {
    if (b.t === 'ul') for (const it of b.items) w.text(`- ${it}`, { indent: indent + 8 });
    else if (b.t === 'table') { for (const [i, r] of b.rows.entries()) w.text(r.join('  |  '), { size: 8.5, f: i === 0 ? w.boldFont : undefined, indent }); w.space(3); }
    else if (b.t === 'box') { const [first, ...rest] = String(b.text ?? '').split('\n'); if (red) w.box(first, rest, { border: RED, weight: 2.5 }); else w.box('', [b.text]); }
    else if (blockTexts(b)[0]) w.text(b.text, { indent });
    if (annotate && b.note) w.text(`[Annotation: ${b.note}]`, { size: 8, f: italic, color: NOTE, indent: indent + 8 });
    w.space(2);
  }
}

const today = () => new Date().toISOString().slice(0, 10);
const footerFor = (doc) => `Labelling Workbench - training use only - fictional product - ${doc.title} v${doc.version ?? 0} (${doc.status}) - made ${today()}`;

// ---------- the label ----------
export async function labelPdf(doc, pack, { annotate = false } = {}) {
  const fonts = await setup(`${doc.meta?.proprietaryName ?? doc.title} - ${doc.title}${annotate ? ' (annotated)' : ''}`);
  const { pdf, italic, bold } = fonts;
  const m = doc.meta ?? {};
  const w = writer(pdf, fonts, { header: `${m.proprietaryName ?? doc.fields?.proprietaryName ?? ''} - ${doc.title}${annotate ? ' - ANNOTATED' : ''} - Labelling Workbench practice label` });
  w.boldFont = bold;
  const opts = { annotate, italic };
  if (doc.kind === 'pi') {
    const t = templateFor(pack, 'pi');
    const hl = doc.hl ?? {};
    w.h('HIGHLIGHTS OF PRESCRIBING INFORMATION', 11);
    w.text(hl.limitation ?? '', { size: 8.5 });
    w.space(4);
    w.text(`${m.proprietaryName} (${m.establishedName}) ${m.dosageForm}, ${m.route}${m.controlled ? ` ${m.controlled}` : ''}`, { f: bold });
    w.text(`Initial U.S. Approval: ${m.initialApproval ?? ''}`, { size: 9 });
    if (hl.bw?.length) w.box(doc.bw?.title ?? 'WARNING', [...hl.bw.flatMap(blockTexts).map((x) => `- ${x}`), hl.bwClose ?? '']);
    if (hl.rmc?.length) { w.h('RECENT MAJOR CHANGES', 9.5); for (const r of hl.rmc) w.text(`${r.heading}${r.num ? ` (${r.num})` : ''}    ${r.date}`, { size: 9 }); }
    for (const h of t.hl) {
      if (h.kind === 'rmc' || !(hl[h.key] ?? []).some((b) => blockTexts(b).some((x) => x.trim()))) continue;
      w.h(h.title, 9.5);
      writeBlocks(w, hl[h.key], opts);
    }
    w.text(hl.pci ?? '', { f: bold, size: 9 });
    w.text(`Revised: ${m.revised ?? ''}`, { size: 9 });
    w.rule();
    w.h('FULL PRESCRIBING INFORMATION: CONTENTS', 10);
    for (const s of doc.sections ?? []) { w.text(sectionTitle(s), { size: 8.5 }); for (const x of s.subs ?? []) w.text(sectionTitle(x), { size: 8.5, indent: 12 }); }
    w.rule();
    w.h('FULL PRESCRIBING INFORMATION', 11);
    if (doc.bw) w.box(doc.bw.title, doc.bw.blocks.flatMap(blockTexts).map((x) => `- ${x}`));
    for (const s of doc.sections ?? []) {
      w.h(sectionTitle(s), 10.5);
      writeBlocks(w, s.blocks, opts);
      for (const x of s.subs ?? []) { w.h(sectionTitle(x), 9.5); writeBlocks(w, x.blocks, opts); }
    }
  } else if (doc.kind === 'in-carton' || doc.kind === 'in-label') {
    const sec = (n) => (doc.sections ?? []).find((x) => x.num === n);
    const one = (n) => (sec(n)?.blocks ?? []).flatMap(blockTexts).filter((x) => x.trim()).join(' ');
    const sz = m.sizes ?? {};
    w.h(`${doc.kind === 'in-carton' ? 'Carton' : 'Strip or container label'} (India): text and layout notes`, 12);
    w.text(`Schedule: ${pack.vocab?.in?.scheduleLabels?.[m.schedule ?? 'none'] ?? m.schedule}. Type sizes: proper name ${sz.proper ?? '-'} pt, brand name ${sz.brand ?? '-'} pt.${m.h2 ? ' Schedule H2: QR code required.' : ''}`, { size: 8.5, color: MUTED });
    w.rule();
    if (one('c1')) w.text(one('c1'), { f: bold, size: 16, color: RED });
    for (const s of doc.sections ?? []) {
      if (s.num === 'c1') continue;
      w.text(s.title, { size: 8, color: MUTED });
      if (s.num === 'c2' || s.num === 'c3') { w.text(one(s.num), { f: bold, size: Math.max(8, Math.min(22, Number(s.num === 'c2' ? sz.proper : sz.brand) || 10)) }); w.space(3); continue; }
      writeBlocks(w, s.blocks, { ...opts, red: true });
      w.space(2);
    }
  } else if (doc.kind === 'carton' || doc.kind === 'container') {
    const f = doc.fields ?? {};
    w.h(`${doc.kind === 'carton' ? 'Carton' : 'Container label'}: text of the principal display panel and side panels`, 12);
    w.text(`Type sizes: proprietary name ${doc.sizes?.proprietaryName ?? '-'} pt, established name ${doc.sizes?.establishedName ?? '-'} pt, strength ${doc.sizes?.strength ?? '-'} pt. Codes: ${doc.barcode ? 'linear bar code with NDC' : 'no linear bar code'}; ${doc.twoD ? '2D data matrix (product identifier, serial, lot, expiry) placeholder' : 'no 2D code'}.`, { size: 8.5, color: MUTED });
    w.rule();
    for (const [k, v] of Object.entries(f)) if (v) { w.text(FIELD_LABEL[k] ?? k, { size: 8, color: MUTED }); w.text(v, { size: k === 'proprietaryName' ? 14 : 10, f: k === 'proprietaryName' || k === 'strength' ? bold : undefined }); w.space(3); }
  } else {
    const fx = doc.fixed ?? {};
    if (fx.header) w.h(fx.header, doc.kind === 'in-pi' ? 10 : 13);
    w.text(`${m.proprietaryName ?? ''} (${m.establishedName ?? ''}) ${m.dosageForm ?? ''}`, { f: bold });
    w.space(4);
    if (fx.nameLine) for (const l of fx.nameLine.split('\n')) w.text(l, { f: bold, size: 9.5 });
    if (fx.blackTriangle) { w.space(3); w.text(fx.blackTriangle, { f: bold, size: 9 }); }
    if (fx.readFirst) { w.space(3); w.text(fx.readFirst, { size: 8.5 }); }
    for (const s of doc.sections ?? []) {
      w.h(/^\d/.test(s.num) && ['smpc', 'eu-outer', 'eu-blister', 'in-pi'].includes(doc.kind) ? sectionTitle(s) : s.title, 10);
      writeBlocks(w, s.blocks, { ...opts, red: doc.kind === 'in-pi' });
      for (const x of s.subs ?? []) { w.h(/^\d/.test(x.num) ? sectionTitle(x) : x.title, 9.5); writeBlocks(w, x.blocks, opts); }
    }
    if (fx.lastRevised) w.text(fx.lastRevised, { size: 8.5 });
    if (fx.sideEffects) w.text(fx.sideEffects, { f: bold, size: 9 });
    if (fx.approval) { w.space(6); w.text(fx.approval, { size: 8.5 }); }
    if (m.revised && !fx.lastRevised && !['smpc', 'in-pi'].includes(doc.kind)) w.text(`Revised: ${m.revised}`, { size: 8.5 });
  }
  w.space(8);
  w.text('Training use only. Fictional product and company. Not an approved label and not for submission.', { size: 8, color: WARN });
  w.finish(footerFor(doc));
  return pdf.save();
}

// ---------- check report ----------
export async function checkReportPdf(doc, pack, issues) {
  const fonts = await setup(`Check report - ${doc.title}`);
  const w = writer(fonts.pdf, fonts, { header: `Labelling Workbench - check report - ${doc.title}` });
  w.h('Check report', 15);
  w.text(`${doc.meta?.proprietaryName ?? doc.fields?.proprietaryName ?? ''} - ${doc.title} - version ${doc.version ?? 0} (${doc.status}) - pack ${pack.short} ${pack.version} (${pack.asOf})`, { size: 9, color: MUTED });
  const open = issues.filter((i) => !i.waived);
  w.text(`${open.filter((i) => i.severity === 'error').length} errors, ${open.filter((i) => i.severity === 'warning').length} warnings, ${open.filter((i) => i.severity === 'info').length} hints, ${issues.filter((i) => i.waived).length} waived.`, { f: fonts.bold });
  w.rule();
  for (const i of issues) {
    const r = ruleById(pack, i.ruleId);
    w.text(`${i.waived ? 'WAIVED' : i.severity.toUpperCase()}  ${i.loc?.label ?? ''}`, { size: 9, f: fonts.bold, color: i.severity === 'error' && !i.waived ? WARN : INK });
    w.text(i.msg, { indent: 10 });
    if (i.hint) w.text(`Fix: ${i.hint}`, { size: 8.5, indent: 10, color: MUTED });
    if (i.waived) w.text(`Waiver reason: ${i.waived}`, { size: 8.5, indent: 10, color: NOTE });
    if (r) w.text(`Rule ${r.id}: ${r.title}. ${sourceOf(pack, r.src).title}, ${r.at}.${r.simplified ? ` Simplified: ${r.simplified}` : ''}`, { size: 7.5, indent: 10, color: MUTED });
    w.space(4);
  }
  w.finish(footerFor(doc));
  return fonts.pdf.save();
}

// ---------- comparison report ----------
export async function diffReportPdf(title, rows, { left = 'Before', right = 'After' } = {}) {
  const fonts = await setup(`Comparison - ${title}`);
  const w = writer(fonts.pdf, fonts, { header: `Labelling Workbench - comparison - ${title}` });
  w.h(`Comparison: ${title}`, 14);
  w.text(`${left} against ${right}. Deleted words are shown as [-like this-], added words as {+like this+}. Only rows that differ are listed.`, { size: 9, color: MUTED });
  w.rule();
  const differ = rows.filter((r) => r.status !== 'same' && r.status !== 'permitted-same');
  if (!differ.length) w.text('No differences.');
  for (const r of differ) {
    w.text(`${r.label}  (${r.status})`, { f: fonts.bold, size: 9.5 });
    w.text((r.parts ?? []).map((p) => (p.op === 'same' ? p.text : p.op === 'del' ? `[-${p.text}-]` : `{+${p.text}+}`)).join(''), { size: 8.5, indent: 10 });
    w.space(4);
  }
  w.finish(`Labelling Workbench - training use only - made ${today()}`);
  return fonts.pdf.save();
}

// ---------- certificate ----------
export async function certificatePdf({ name, userId, status, code, region = 'US', date = today() }) {
  const core = status.region === 'core';
  const eu = status.region === 'eu';
  const india = status.region === 'in';
  const { pdf, font, bold } = await setup('Labelling Workbench - portfolio certificate');
  const page = pdf.addPage([792, 612]);
  const { width: W, height: H } = page.getSize();
  const centre = (text, f, size, y, color = INK) => { const t = clean(text); page.drawText(t, { x: (W - f.widthOfTextAtSize(t, size)) / 2, y, size, font: f, color }); };
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: ACCENT, borderWidth: 2 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: ACCENT, borderWidth: 0.5 });
  [0, 1, 2, 3].forEach((i) => page.drawRectangle({ x: W / 2 - 36, y: H - 72 - i * 7, width: 72 - (i % 2) * 22, height: 3.5, color: i === 1 ? rgb(0.62, 0.14, 0.14) : ACCENT }));
  centre('LABELLING WORKBENCH', bold, 13, H - 112, ACCENT);
  centre(core ? 'Certificate of completion: core data sheet and change management' : eu ? 'Certificate of completion: EU product information' : india ? 'Certificate of completion: India labelling' : `Certificate of completion: ${region} labelling`, font, core ? 20 : eu ? 24 : 26, H - 152);
  centre('This certifies that', font, 12, H - 190, MUTED);
  centre(name.trim(), font, 28, H - 228);
  (india ? [
    `completed all ${status.lessons.length} India lessons and their checks, an India quiz round and the capstone drill`,
    'in the Labelling Workbench: Rule 96 label particulars, Rule 97 schedule cautions and symbols, the package insert,',
    'Schedule H2 QR codes, the MRP and proper-name rules, and implementing a CDSCO directive.',
  ] : eu ? [
    `completed all ${status.lessons.length} EU lessons and their checks, an EU quiz round and the capstone drill`,
    'in the Labelling Workbench: the QRD template, SmPC section 4.8, excipients, additional monitoring, user testing,',
    'Braille and safety features, translations and implementing PRAC safety wording.',
  ] : core ? [
    `completed all ${status.lessons.length} core lessons and their checks, a core quiz round and the capstone drill`,
    'in the Labelling Workbench: mapping labels to a company core data sheet, deviations, safety labelling changes,',
    'agency comment rounds and tracking implementation in every market.',
  ] : [
    `completed all ${status.lessons.length} ${region} lessons and their checks, a mixed quiz round and the capstone drill`,
    'in the Labelling Workbench, a browser-based practice tool for prescribing information, patient labelling,',
    'carton and container labels, generic labelling and the review of labels against the rules.',
  ]).forEach((t, i) => centre(t, font, 11, H - 266 - i * 16));
  page.drawText(clean(`Date: ${date}`), { x: 70, y: 120, size: 11, font, color: INK });
  page.drawText(clean(`Verification code: ${code}`), { x: 70, y: 102, size: 11, font, color: INK });
  page.drawText(clean(`Best mixed quiz: ${status.quiz?.score ?? '-'}%`), { x: 70, y: 84, size: 11, font, color: INK });
  const r = 'Built by Khan Gulrez Shagufa Fazal Ahmed';
  page.drawText(r, { x: W - 70 - font.widthOfTextAtSize(r, 11), y: 102, size: 11, font, color: INK });
  centre('PORTFOLIO EXERCISE. NOT AN ACCREDITATION OR A PROFESSIONAL QUALIFICATION.', bold, 10, 56, WARN);
  centre('All products, companies and labels in the exercises are fictional. Results are not regulatory advice.', font, 9, 44, MUTED);
  const w = writer(pdf, { font, bold }, { header: `Labelling Workbench - record of results - ${name.trim()}`, watermark: 'PORTFOLIO EXERCISE' });
  w.h('Record of results', 14);
  w.text(`${name.trim()} - ${date} - verification code ${code} - learner ID ${userId}`, { size: 9, color: MUTED });
  w.h('Lesson checks', 11);
  for (const l of status.lessons) w.text(`${l.id}. ${l.title}: ${l.best ?? '-'}%`, { size: 9 });
  w.h('Drills', 11);
  for (const d of status.drills) w.text(`${d.title}: ${d.best ?? '-'}${d.capstone ? ' (capstone)' : ''}`, { size: 9 });
  w.space(8);
  w.text('The verification code is a hash of the name, learner ID, date and scores. Anyone can recompute it from an exported project file; it is not a security feature.', { size: 8, color: MUTED });
  w.finish('Labelling Workbench - portfolio exercise, not an accreditation');
  return pdf.save();
}

export { HL_LABEL, fill };
