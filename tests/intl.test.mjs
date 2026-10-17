// Phase 5 tests: Canada, Switzerland, Japan, Australia and WHO PQ packs, the four-market capstone
// and the more-markets certificate.
import assert from 'node:assert/strict';
import { PACKS, productById, kindsFor, fill } from '../src/engine/pack.js';
import { runChecks, summarise } from '../src/engine/checks.js';
import { projectFromSample, findSection, blankDoc, regionOfKind } from '../src/engine/model.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { sampleChange, setStep } from '../src/engine/changes.js';
import { certificateStatus } from '../src/engine/certificate.js';
import { labelPdf, certificatePdf } from '../src/engine/pdf.js';

const pack = PACKS.us;
const user = { userId: 'u-test', classId: null };
const today = new Date('2026-10-11');
const sample = (id) => pack.samples.find((s) => s.id === id);
const drill = (id) => pack.drills.drills.find((d) => d.id === id);
const open = (id) => { const s = sample(id); const product = productById(s.productId); const r = projectFromSample(s, user, { pack, product }); const c = sampleChange(pack.core, s, r.docs, user); if (c) r.project.changes = [c]; return { ...r, s, product }; };
const issues = (doc, o) => runChecks(doc, { pack, docs: o.docs, product: o.product, project: o.project, today }).filter((i) => !i.waived);
const ids = (is) => new Set(is.map((i) => i.ruleId));
const put = (doc, num, ...texts) => { findSection(doc, num).blocks = texts.map((text, i) => ({ id: `t${num}${i}`, t: 'p', text })); };
const add = (doc, num, text) => findSection(doc, num).blocks.push({ id: `a${Math.random()}`, t: 'p', text });
let n = 0;
const tests = [];
const t = (name, fn) => tests.push([name, fn]);

const REGIONS = ['ca', 'ch', 'jp', 'au', 'who'];
const CLEAN = { ca: 'ca-ostrevia-clean', ch: 'ch-ostrevia-clean', jp: 'jp-ostrevia-clean', au: 'au-ostrevia-clean', who: 'who-malvaren-clean' };
const ERRORS = { ca: 'ca-ostrevia-errors', ch: 'ch-ostrevia-errors', jp: 'jp-ostrevia-errors', au: 'au-ostrevia-errors', who: 'who-malvaren-errors' };

t('five regions merged: kinds, rules with sources, samples, five lessons, 40 questions', () => {
  for (const r of REGIONS) { assert.ok(pack.regions[r], r); assert.ok(kindsFor(pack, r).length >= 1, r); }
  assert.deepEqual(kindsFor(pack, 'au'), ['au-pi', 'au-cmi']);
  assert.deepEqual(kindsFor(pack, 'ca'), ['ca-pm', 'ca-pmi', 'ca-label']);
  assert.equal(regionOfKind('who-smpc'), 'who');
  for (const r of pack.rules) assert.ok(pack.sources.some((s) => s.id === r.src), r.id);
  assert.equal(pack.lessons.lessons.filter((l) => l.module === 'intl').length, 5);
  assert.equal(pack.quiz.questions.filter((q) => q.module === 'intl').length, 40);
  assert.equal(new Set(pack.lessons.lessons.map((l) => l.id)).size, pack.lessons.lessons.length);
  assert.equal(new Set(pack.rules.map((r) => r.id)).size, pack.rules.length);
  assert.ok(pack.core.markets.find((m) => m.id === 'au')?.pack);
});

for (const r of REGIONS) {
  t(`${r}: clean sample has no errors or warnings`, () => {
    const o = open(CLEAN[r]);
    assert.equal(o.project.region, r);
    for (const d of o.docs) { const s = summarise(issues(d, o)); assert.equal(s.errors + s.warnings, 0, `${d.sampleDocId}: ${JSON.stringify(issues(d, o).map((i) => i.msg))}`); }
  });
  t(`${r}: error sample reports exactly its answer key`, () => {
    const o = open(ERRORS[r]);
    for (const d of o.docs) {
      const want = new Set(sample(ERRORS[r]).docs.find((x) => x.id === d.sampleDocId).answerKey.map((k) => k.rule));
      const got = ids(issues(d, o).filter((i) => i.severity !== 'info'));
      assert.deepEqual([...got].sort(), [...want].sort(), d.sampleDocId);
    }
  });
  t(`${r}: blank documents start from the template and fail the required checks`, () => {
    const product = productById(r === 'who' ? 'pq-antimalarial' : 'nce-tablet');
    for (const k of kindsFor(pack, r)) {
      const d = blankDoc(pack, k, product, 'p', user);
      assert.ok(d.sections.length > 3, k);
      assert.ok(runChecks(d, { pack, docs: [d], product, today }).some((i) => i.severity === 'error' && /-REQ$/.test(i.ruleId)), k);
    }
  });
}

t('Canada: proper name half the brand size; DIN must match the product; Pr only on prescription drugs', () => {
  const o = open('ca-ostrevia-clean');
  const label = o.docs.find((d) => d.kind === 'ca-label');
  label.meta.sizes = { brand: 16, proper: 8 };
  assert.ok(!ids(issues(label, o)).has('CA-PROPER'), 'exactly half is allowed');
  put(label, 'l6', 'DIN 09990102');
  assert.ok(issues(label, o).some((i) => i.ruleId === 'CA-DIN' && /not this product/.test(i.msg)));
  label.meta.scheduleSymbol = '';
  assert.ok(issues(label, o).some((i) => i.ruleId === 'CA-PR' && /not a prescription drug/.test(i.msg)));
});

t('Canada: the box needs cross-references and is limited to about 20 lines', () => {
  const o = open('ca-ostrevia-clean');
  const pm = o.docs.find((d) => d.kind === 'ca-pm');
  findSection(pm, '3').blocks = [{ id: 'b', t: 'box', text: Array.from({ length: 22 }, (_, i) => `• Warning ${i + 1} (see 7 WARNINGS AND PRECAUTIONS)`).join('\n') }];
  assert.ok(issues(pm, o).some((i) => i.ruleId === 'CA-SWP' && /20/.test(i.msg)));
});

t('Switzerland: no black triangle when not monitored; authorisation number must match', () => {
  const o = open('ch-ostrevia-clean');
  const fi = o.docs.find((d) => d.kind === 'ch-fi');
  fi.meta.additionalMonitoring = false;
  assert.equal(issues(fi, o).find((i) => i.ruleId === 'CH-BT')?.severity, 'warning');
  fi.meta.authNumber = '99102';
  assert.ok(issues(fi, o).some((i) => i.ruleId === 'CH-ZUL' && /99102/.test(i.msg)));
});

t('Japan: a missing optional section keeps the numbers; a moved-up section is flagged', () => {
  const o = open('jp-ostrevia-clean');
  const pi = o.docs.find((d) => d.kind === 'jp-pi');
  pi.sections = pi.sections.filter((s) => s.num !== '21');
  assert.ok(!ids(issues(pi, o)).has('JP-HEAD'), 'leaving out 21 is fine');
  pi.sections.find((s) => s.num === '22').num = '21';
  assert.ok(issues(pi, o).some((i) => i.ruleId === 'JP-HEAD' && /it is section 22/.test(i.msg)));
  assert.ok(!issues(pi, o).some((i) => i.ruleId === 'JP-REQ' && /22 PACKAGING/.test(i.msg)), 'not also reported as missing');
});

t('Australia: CMI summary longer than a page is a warning', () => {
  const o = open('au-ostrevia-clean');
  const cmi = o.docs.find((d) => d.kind === 'au-cmi');
  for (let i = 0; i < 50; i++) add(cmi, 'sum', `Point ${i}: something the patient should know about the medicine and its use.`);
  assert.equal(issues(cmi, o).find((i) => i.ruleId === 'AU-CMI-SUM')?.severity, 'warning');
});

t('WHO: excipient amounts are not strengths; a table without frequency categories is flagged', () => {
  const o = open('who-malvaren-clean');
  const smpc = o.docs[0];
  assert.ok(!ids(issues(smpc, o)).has('INTL-STR'));
  findSection(smpc, '4.8').blocks = [{ id: 't', t: 'table', rows: [['Reaction', 'Rate'], ['Vomiting', '12%']] }];
  assert.ok(issues(smpc, o).some((i) => i.ruleId === 'WHO-48' && /no frequency/.test(i.msg)));
});

t('capstone: one ILD signal implemented in four markets', () => {
  const o = open('intl-ostrevia-ild');
  assert.equal(o.project.region, 'intl');
  const ch = o.project.changes[0];
  assert.deepEqual(ch.markets.map((m) => m.market), ['ca', 'ch', 'jp', 'au']);
  assert.equal(ch.docIds.length, 5);
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('intl-ild'), ctx).score, 0);
  const [ca, chfi, jp, au, cmi] = ['ca-pm', 'ch-fi', 'jp-pi', 'au-pi', 'au-cmi'].map((k) => o.docs.find((d) => d.kind === k));
  add(ca, '7', 'Respiratory: Interstitial lung disease (ILD), including fatal cases, has been reported. Interrupt treatment while ILD is investigated and discontinue if it is confirmed.');
  add(ca, '8.5', 'Respiratory, thoracic and mediastinal disorders: interstitial lung disease.');
  ca.meta.revised = '2026-10-30';
  findSection(ca, 'rmlc').blocks = [{ id: 'r', t: 'table', rows: [['Section', 'Date'], ['7 WARNINGS AND PRECAUTIONS, Respiratory', '2026-10'], ['7 WARNINGS AND PRECAUTIONS, Hepatic/Biliary/Pancreatic', '2026-08']] }];
  add(chfi, 'f6', 'Interstitial lung disease: cases, some fatal, have been reported. Interrupt treatment if ILD is suspected; discontinue if confirmed.');
  findSection(chfi, 'f10').blocks.splice(2, 0, { id: 'ild', t: 'p', text: 'Post-marketing: interstitial lung disease (frequency not known).' });
  put(chfi, 'f19', 'Oktober 2026');
  add(jp, '8', '8.3 Interstitial lung disease may occur. Instruct patients to contact a physician promptly if cough, dyspnoea or fever occurs.');
  add(jp, '11.1', '11.1.3 Interstitial lung disease (frequency unknown)');
  jp.fixed.revised = 'Revised: October 2026 (3rd version)';
  add(au, '4.4', 'Interstitial lung disease: interrupt treatment while ILD is investigated and discontinue if confirmed.');
  add(au, '4.8', 'Post-marketing experience: interstitial lung disease (frequency not known).');
  put(au, '10', '30 October 2026');
  findSection(cmi, '6').blocks.splice(3, 0, { id: 'c', t: 'p', text: 'Serious: new or worse cough, breathlessness or fever (signs of a lung problem). Call your doctor straight away.' });
  for (const d of [ca, chfi, jp, au, cmi]) { const s = summarise(issues(d, o)); assert.equal(s.errors + s.warnings, 0, `${d.kind}: ${JSON.stringify(issues(d, o).map((i) => i.msg))}`); }
  for (const d of [ca, chfi, jp, au, cmi]) d.status = 'approved';
  for (const m of ch.markets) { m.classification = 'Safety labelling change (fictional)'; setStep(pack.core, ch, m.market, 2, ch.startDate); }
  const r = evaluateDrill(drill('intl-ild'), ctx);
  assert.deepEqual(r.goals.filter((g) => !g.done).map((g) => g.label), []);
  assert.equal(r.score, 100);
});

t('fix drills reach 100 when the clean text is restored', () => {
  const o = open('au-ostrevia-errors');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('au-fix'), ctx).score, 0);
  const clean = sample('au-ostrevia-clean');
  for (const d of o.docs) { const c = clean.docs.find((x) => x.id === d.sampleDocId); Object.assign(d, JSON.parse(JSON.stringify({ sections: c.sections, meta: c.meta, fixed: c.fixed }))); }
  assert.equal(evaluateDrill(drill('au-fix'), ctx).score, 100);
});

t('more-markets certificate: five lessons, a module quiz round and the capstone', () => {
  const lessonsDone = Object.fromEntries(pack.lessons.lessons.map((l) => [`us-${l.id}`, { best: 100 }]));
  const st = certificateStatus({ region: 'intl', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'intl', score: 90, total: 10 }, { kind: 'drill', drillId: 'intl-ild', score: 100 }], lessonsDone });
  assert.equal(st.lessons.length, 5);
  assert.equal(st.drills.length, 6);
  assert.equal(st.eligible, true);
});

t('fill() replaces {form} for the Australian title line', () => {
  assert.equal(fill('AUSTRALIAN PRODUCT INFORMATION – {NAME} ({established}) {form}', { proprietaryName: 'OSTREVIA', establishedName: 'lumiravostat', dosageForm: 'film-coated tablets' }), 'AUSTRALIAN PRODUCT INFORMATION – OSTREVIA (lumiravostat) film-coated tablets');
});

for (const [name, fn] of tests) { await fn(); n++; void name; }

// PDFs build for every Phase 5 document kind, and the certificate.
for (const id of Object.values(CLEAN)) for (const d of sample(id).docs) { const b = await labelPdf({ ...d, version: 1 }, pack); assert.ok(b.length > 1500, `${id}/${d.id}`); n++; }
assert.ok((await certificatePdf({ name: 'Test Learner', userId: 'u', status: { region: 'intl', lessons: [], drills: [], quiz: { score: 90 } }, code: 'LW-TEST' })).length > 1500); n++;

t('Canada PMI: standard statements and the serious warnings box follow the monograph', () => {
  const o = open(CLEAN.ca);
  const pmi = o.docs.find((d) => d.kind === 'ca-pmi');
  const pm = o.docs.find((d) => d.kind === 'ca-pm');
  findSection(pmi, 'm16').blocks = [{ id: 'r', t: 'p', text: 'Report side effects to your doctor.' }];
  assert.ok(ids(issues(pmi, o)).has('CA-PMI-STD'));
  pmi.sections = pmi.sections.filter((s) => s.num !== 'm0');
  assert.ok(ids(issues(pmi, o)).has('CA-SWP'), 'box required while the monograph has one');
  pm.meta.swp = false; findSection(pm, '3').blocks = [];
  assert.ok(!ids(issues(pmi, o)).has('CA-SWP'), 'no box needed when the monograph has none');
});

console.log(`intl: ${n} tests passed`);
