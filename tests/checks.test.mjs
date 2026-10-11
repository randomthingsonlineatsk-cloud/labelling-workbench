// Rule tests: every rule must pass on a clean sample and fail on a planted error.
import assert from 'node:assert/strict';
import { PACKS, productById } from '../src/engine/pack.js';
import { runChecks, summarise, canApprove, highlightsLines, HL_MAX_LINES } from '../src/engine/checks.js';
import { strengths, readingGrade, monthIndex } from '../src/engine/text.js';

const pack = PACKS.us;
const today = new Date('2026-10-11');
const clone = (x) => JSON.parse(JSON.stringify(x));
const sample = (id) => pack.samples.find((s) => s.id === id);
const check = (s, docId, mut) => {
  const docs = clone(s.docs);
  const d = docs.find((x) => x.id === docId);
  if (mut) mut(d, docs);
  return runChecks(d, { pack, docs, product: productById(s.productId), today });
};
const ids = (iss) => new Set(iss.filter((i) => !i.waived).map((i) => i.ruleId));
let n = 0;
const t = (name, fn) => { fn(); n++; };

// --- pack integrity
t('every rule cites a known source', () => { for (const r of pack.rules) assert.ok(pack.sources.some((s) => s.id === r.src), r.id); });
t('rule ids are unique', () => assert.equal(new Set(pack.rules.map((r) => r.id)).size, pack.rules.length));

// --- clean samples
const clean = sample('ostrevia-clean');
for (const d of clean.docs) {
  t(`clean ${d.id} has no errors or warnings`, () => {
    const iss = check(clean, d.id);
    const s = summarise(iss);
    assert.equal(s.errors + s.warnings, 0, JSON.stringify(iss.filter((i) => i.severity !== 'info').map((i) => i.msg)));
  });
}
t('reference label is clean', () => { const s = summarise(check(sample('talmisartan-generic'), 'ref')); assert.equal(s.errors + s.warnings, 0); });
t('Highlights of the clean label fit the half page', () => assert.ok(highlightsLines(clean.docs[0], pack) <= HL_MAX_LINES));

// --- planted errors: every answer-key rule is reported
for (const s of pack.samples) for (const d of s.docs) {
  for (const k of d.answerKey ?? []) t(`${s.id}/${d.id} reports ${k.rule}`, () => assert.ok(ids(check(s, d.id)).has(k.rule), `${k.rule}: ${k.what}`));
}

// --- one rule at a time on the clean PI
const pi = (mut) => ids(check(clean, 'pi', mut));
t('HL-LIM', () => assert.ok(pi((d) => { d.hl.limitation = 'Highlights.'; }).has('US-HL-LIM')));
t('HL-TITLE route form', () => assert.ok(pi((d) => { d.meta.route = 'oral'; }).has('US-HL-TITLE')));
t('HL-APPROVAL future year', () => assert.ok(pi((d) => { d.meta.initialApproval = '2099'; }).has('US-HL-APPROVAL')));
t('HL-BW missing summary', () => assert.ok(pi((d) => { d.hl.bw = []; }).has('US-HL-BW')));
t('HL-BW too long', () => assert.ok(pi((d) => { d.hl.bw = [{ id: 'x', t: 'ul', items: Array(25).fill('A long line of boxed warning text that goes on and on to fill a whole line in the column.') }]; }).has('US-HL-BW')));
t('HL-BW heading not WARNING:', () => assert.ok(pi((d) => { d.bw.title = 'Serious infections'; }).has('US-HL-BW')));
t('HL-RMC allowed sections', () => assert.ok(pi((d) => { d.hl.rmc.push({ heading: 'Clinical Studies', num: '14', date: '08/2026' }); }).has('US-HL-RMC')));
t('HL-RMC too old', () => assert.ok(pi((d) => { d.hl.rmc[1].date = '07/2025'; }).has('US-HL-RMC')));
t('HL-RMC 11 months is fine', () => assert.ok(!pi((d) => { d.hl.rmc[1].date = '09/2025'; }).has('US-HL-RMC')));
t('HL-RMC later than revised', () => assert.ok(pi((d) => { d.hl.rmc[1].date = '09/2026'; }).has('US-HL-RMC')));
t('HL-REF missing reference', () => assert.ok(pi((d) => { d.hl.ci[0].text = 'Known hypersensitivity to lumiravostat.'; }).has('US-HL-REF')));
t('HL-AR', () => assert.ok(pi((d) => { d.hl.ar[1].text = 'Call us.'; }).has('US-HL-AR')));
t('HL-PCI without MG wording', () => assert.ok(pi((d) => { d.hl.pci = 'See 17 for PATIENT COUNSELING INFORMATION'; }).has('US-HL-PCI')));
t('HL-REV future', () => assert.ok(pi((d) => { d.meta.revised = '12/2026'; d.hl.rmc.forEach((r) => { r.date = '12/2026'; }); }).has('US-HL-REV')));
t('HL-LEN', () => assert.ok(pi((d) => { d.hl.wp[0].items.push(...Array(40).fill('Another precaution that takes up a full line of the Highlights column here. (5.1)')); }).has('US-HL-LEN')));
t('HL-CI fewer in Highlights', () => assert.ok(pi((d) => { d.sections.find((s) => s.num === '4').blocks.push({ id: 'y', t: 'p', text: 'Second contraindication.' }); }).has('US-HL-CI')));
t('SEC-REQ missing section 11', () => assert.ok(pi((d) => { d.sections = d.sections.filter((s) => s.num !== '11'); }).has('US-PI-SEC-REQ')));
t('SEC-TITLE order', () => assert.ok(pi((d) => { d.sections.reverse(); }).has('US-PI-SEC-TITLE')));
t('8.6+ subsections allowed', () => assert.ok(!pi(() => {}).has('US-PI-SEC-TITLE')));
t('XREF', () => assert.ok(pi((d) => { d.sections[0].blocks[0].text += ' [see Warnings and Precautions (5.8)]'; }).has('US-PI-XREF')));
t('PLLR letter category', () => assert.ok(pi((d) => { d.sections.find((s) => s.num === '8').subs[0].blocks.push({ id: 'z', t: 'p', text: 'Pregnancy Category X.' }); }).has('US-PI-PLLR')));
t('STR', () => assert.ok(pi((d) => { d.sections.find((s) => s.num === '3').blocks[0].items.push('5 mg: blue tablets'); }).has('US-PI-STR')));
t('17-MG', () => assert.ok(pi((d) => { d.sections.find((s) => s.num === '17').blocks.shift(); }).has('US-PI-17-MG')));
t('ME-TZ', () => assert.ok(pi((d) => { d.sections[0].blocks[0].text += ' Give 2.0 mg.'; }).has('US-ME-TZ')));
t('ME-ND', () => assert.ok(pi((d) => { d.sections[0].blocks[0].text += ' Give .5 mg.'; }).has('US-ME-ND')));
t('ME-ABBR units', () => assert.ok(pi((d) => { d.sections[0].blocks[0].text += ' Give 10 U.'; }).has('US-ME-ABBR')));
t('ME-TZ ignores 10.5 mg', () => assert.ok(!pi((d) => { d.sections[0].blocks[0].text += ' Give 10.5 mg.'; }).has('US-ME-TZ')));
t('NAME misspelling', () => assert.ok(pi((d) => { d.sections[0].blocks[0].text += ' lumirovostat'; }).has('US-NAME')));

// --- patient labelling
t('MG missing required heading', () => assert.ok(ids(check(clean, 'mg', (d) => { d.sections = d.sections.filter((s) => s.num !== 'm10'); })).has('US-PT-HEAD')));
t('MG approval statement', () => assert.ok(ids(check(clean, 'mg', (d) => { d.fixed.approval = ''; })).has('US-PT-FIXED')));
t('MG most important info required with boxed warning', () => assert.ok(ids(check(clean, 'mg', (d) => { d.sections[0].blocks = []; })).has('US-MG-PI')));
t('PPI and IFU have no errors', () => { const s = sample('brezovent-patient'); for (const d of s.docs) assert.equal(summarise(check(s, d.id)).errors, 0); });

// --- carton
const ctn = (mut) => ids(check(clean, 'carton', mut));
t('CC-NDC', () => assert.ok(ctn((d) => { d.fields.ndc = 'NDC 1234-567'; }).has('US-CC-NDC')));
t('CC-STR', () => assert.ok(ctn((d) => { d.fields.strength = '50 mg'; }).has('US-CC-STR')));
t('CC-REQ storage', () => assert.ok(ctn((d) => { d.fields.storage = ''; }).has('US-CC-REQ')));
t('container may omit dosage statement', () => assert.ok(!ids(check(clean, 'container')).has('US-CC-REQ')));
t('injectable carton passes with per total volume and per mL', () => {
  const s = sample('nelvaprox-convert');
  const r = ids(check(s, 'carton', (d) => { d.fields.strength = '50 mg/5 mL (10 mg/mL)'; d.fields.rxOnly = 'Rx only'; d.fields.ndc = 'NDC 99996-501-10'; d.barcode = true; d.sizes.establishedName = 8; }));
  assert.equal(r.size, 0, [...r].join(','));
});

// --- generic
t('generic fixed by completing the carve-out', () => {
  const s = sample('talmisartan-generic');
  const r = check(s, 'pi', (d, docs) => {
    d.hl.ind = [d.hl.ind[0], { id: 'i', t: 'ul', items: ['Treatment of hypertension, to lower blood pressure. (1.1)'] }];
    d.hl.da = [{ id: 'a', t: 'ul', items: ['Hypertension: 40 mg once daily; range 20 mg to 80 mg once daily. (2.1)'] }];
    const s6 = d.sections.find((x) => x.num === '6').subs[0]; s6.blocks = s6.blocks.slice(0, 2);
    const s14 = d.sections.find((x) => x.num === '14'); s14.subs = s14.subs.filter((x) => x.num !== '14.2');
    const ref = docs.find((x) => x.role === 'reference');
    d.sections.find((x) => x.num === '5').subs[2].blocks = clone(ref.sections.find((x) => x.num === '5').subs[2].blocks).map((b) => ({ ...b, text: b.text.replaceAll('CORVENZA', 'TALMISARTAN TABLETS') }));
  });
  const open = r.filter((i) => !i.waived && i.severity !== 'info');
  assert.equal(open.length, 0, JSON.stringify(open.map((i) => `${i.ruleId} ${i.msg}`)));
});

// --- waivers and approval rule
t('warnings can be waived, errors cannot', () => {
  const docs = clone(clean.docs);
  const d = docs[0];
  d.sections = d.sections.filter((s) => s.num !== '10');
  let iss = runChecks(d, { pack, docs, product: productById('nce-tablet'), today });
  assert.ok(!canApprove(iss));
  const w = iss.find((i) => i.ruleId === 'US-PI-SEC-REQ');
  d.waivers = { [w.key]: 'No overdose experience; section omitted.' };
  iss = runChecks(d, { pack, docs, product: productById('nce-tablet'), today });
  assert.ok(canApprove(iss));
  d.meta.revised = 'bad'; d.waivers = Object.fromEntries(runChecks(d, { pack, docs, today }).map((i) => [i.key, 'x']));
  assert.ok(!canApprove(runChecks(d, { pack, docs, today })));
});

// --- text helpers
t('strength parsing', () => { assert.deepEqual(strengths('50 mg/5 mL (10 mg/mL) and 90 mcg per actuation'), ['50 mg/5 mL', '10 mg/mL', '90 mcg per actuation']); assert.deepEqual(strengths('10.0 mg'), ['10 mg']); });
t('month index', () => { assert.equal(monthIndex('08/2026') - monthIndex('08/2025'), 12); assert.equal(monthIndex('13/2026'), null); });
t('reading grade is a number', () => assert.ok(readingGrade('Take one tablet each day. Swallow it whole.') < 6));

console.log(`checks: ${n} tests passed`);
