// Phase 4 tests: the India pack (CDSCO insert format, Rule 96 particulars, Rule 97 red box and
// symbol, proper-name size, MRP, Schedule H2 QR code, the directive capstone, India certificate).
import assert from 'node:assert/strict';
import { PACKS, productById, kindsFor } from '../src/engine/pack.js';
import { runChecks, summarise, canApprove } from '../src/engine/checks.js';
import { projectFromSample, findSection, blankDoc, regionOfKind } from '../src/engine/model.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { sampleChange, setStep } from '../src/engine/changes.js';
import { certificateStatus } from '../src/engine/certificate.js';

const pack = PACKS.us;
const user = { userId: 'u-test', classId: null };
const sample = (id) => pack.samples.find((s) => s.id === id);
const drill = (id) => pack.drills.drills.find((d) => d.id === id);
const open = (id) => { const s = sample(id); const product = productById(s.productId); const r = projectFromSample(s, user, { pack, product }); const c = sampleChange(pack.core, s, r.docs, user); if (c) r.project.changes = [c]; return { ...r, s, product }; };
const issues = (doc, o) => runChecks(doc, { pack, docs: o.docs, product: o.product, project: o.project }).filter((i) => !i.waived);
const ids = (is) => new Set(is.map((i) => i.ruleId));
const put = (doc, num, ...texts) => { findSection(doc, num).blocks = texts.map((text, i) => ({ id: `t${num}${i}`, t: 'p', text })); };
const add = (doc, num, text) => findSection(doc, num).blocks.push({ id: `a${Math.random()}`, t: 'p', text });
const addSection = (doc, num, title, text) => { doc.sections.push({ num, title, blocks: [{ id: `s${num}`, t: 'p', text }], subs: [] }); };
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('India pack is merged: kinds, rules with sources, samples, five lessons', () => {
  assert.deepEqual(kindsFor(pack, 'in'), ['in-pi', 'in-carton', 'in-label']);
  assert.equal(pack.rules.filter((r) => r.id.startsWith('IN-')).length, 13);
  for (const r of pack.rules) assert.ok(pack.sources.some((s) => s.id === r.src), r.id);
  assert.equal(pack.samples.filter((s) => s.region === 'in').length, 3);
  assert.equal(pack.lessons.lessons.filter((l) => l.module === 'in').length, 5);
  assert.equal(new Set(pack.lessons.lessons.map((l) => l.id)).size, pack.lessons.lessons.length, 'lesson ids unique across modules');
  assert.equal(pack.quiz.questions.filter((q) => q.module === 'in').length, 25);
  assert.equal(regionOfKind('in-carton'), 'in');
});

t('clean India set: no errors or warnings', () => {
  const o = open('in-ostrevia-clean');
  assert.equal(o.project.region, 'in');
  for (const d of o.docs) { const s = summarise(issues(d, o)); assert.equal(s.errors + s.warnings, 0, `${d.sampleDocId}: ${JSON.stringify(issues(d, o).map((i) => i.msg))}`); }
});

t('error set: exactly the 14 planted findings', () => {
  const o = open('in-ostrevia-errors');
  let total = 0;
  for (const d of o.docs) {
    const got = issues(d, o).filter((i) => i.severity !== 'info');
    const want = sample('in-ostrevia-errors').docs.find((x) => x.id === d.sampleDocId).answerKey;
    assert.deepEqual(got.map((i) => i.ruleId).sort(), want.map((k) => k.rule).sort(), d.sampleDocId);
    total += got.length;
  }
  assert.equal(total, 14);
});

t('Rule 97: the box must carry the schedule wording; the symbol follows the schedule', () => {
  const o = open('in-ostrevia-clean');
  const carton = o.docs.find((d) => d.kind === 'in-carton');
  carton.meta.schedule = 'H1';
  const is = issues(carton, o);
  assert.ok(is.some((i) => i.ruleId === 'IN-97-BOX' && /Schedule H1/.test(i.msg)), 'H wording under H1');
  assert.ok(!ids(is).has('IN-97-SYM'), 'H1 also uses Rx');
  findSection(carton, 'c6').blocks = [{ id: 'b', t: 'box', text: 'SCHEDULE H1 PRESCRIPTION DRUG - CAUTION\nIt is dangerous to take this preparation except in accordance with the medical advice.\nNot to be sold by retail without the prescription of a Registered Medical Practitioner.' }];
  assert.ok(!ids(issues(carton, o)).has('IN-97-BOX'), 'a plain hyphen is accepted for the dash');
  carton.meta.schedule = 'X';
  assert.ok(issues(carton, o).some((i) => i.ruleId === 'IN-97-SYM' && /XRx/.test(i.hint)));
  carton.meta.schedule = 'none';
  const none = issues(carton, o);
  assert.equal(none.find((i) => i.ruleId === 'IN-97-BOX')?.severity, 'warning');
  assert.equal(none.find((i) => i.ruleId === 'IN-97-SYM')?.severity, 'warning');
});

t('proper name: two sizes larger and before the brand', () => {
  const o = open('in-ostrevia-clean');
  const strip = o.docs.find((d) => d.kind === 'in-label');
  strip.meta.sizes = { proper: 11, brand: 10 };
  assert.ok(ids(issues(strip, o)).has('IN-NAME'));
  strip.meta.sizes = { proper: 12, brand: 10 };
  assert.ok(!ids(issues(strip, o)).has('IN-NAME'));
  const [a, b] = [strip.sections.findIndex((s) => s.num === 'c2'), strip.sections.findIndex((s) => s.num === 'c3')];
  [strip.sections[a], strip.sections[b]] = [strip.sections[b], strip.sections[a]];
  assert.ok(issues(strip, o).some((i) => i.ruleId === 'IN-NAME' && /before the proper name/.test(i.msg)));
});

t('Rule 96 dates need the prefix and the month and year', () => {
  const o = open('in-ostrevia-clean');
  const strip = o.docs.find((d) => d.kind === 'in-label');
  put(strip, 'c13', 'Exp. Date: soon');
  assert.ok(issues(strip, o).some((i) => i.ruleId === 'IN-96-PART' && /month and year/.test(i.msg)));
  put(strip, 'c13', 'Exp. Date: 08/2029');
  put(strip, 'c12', 'Mfg. Date: Sep. 2026');
  assert.ok(!ids(issues(strip, o)).has('IN-96-PART'));
});

t('Schedule J claims and promotional words are flagged; warnings alone can be waived', () => {
  const o = open('in-ostrevia-clean');
  const pi = o.docs.find((d) => d.kind === 'in-pi');
  add(pi, '4.1', 'Regular use prevents tuberculosis.');
  const is = issues(pi, o);
  assert.ok(ids(is).has('IN-SCHJ'));
  assert.equal(summarise(is).errors, 0);
  for (const i of is) pi.waivers[i.key] = 'Test waiver';
  assert.ok(canApprove(runChecks(pi, { pack, docs: o.docs, product: o.product })));
});

t('blank India documents start with the format, the red box and the symbol', () => {
  const p = productById('nce-tablet');
  const pi = blankDoc(pack, 'in-pi', p, 'p', user);
  assert.equal(pi.meta.proprietaryName, 'OSTREVIA');
  assert.equal(findSection(pi, '4.5').title, 'Drug interactions');
  assert.ok(pi.fixed.header.startsWith('For the use of a Registered Medical Practitioner'));
  assert.ok(runChecks(pi, { pack, docs: [pi], product: p }).some((i) => i.ruleId === 'IN-REQ'));
  const carton = blankDoc(pack, 'in-carton', p, 'p', user);
  assert.equal(findSection(carton, 'c6').blocks[0].t, 'box');
  assert.equal(findSection(carton, 'c1').blocks[0].text, 'Rx');
  const is = ids(runChecks(carton, { pack, docs: [carton], product: p }));
  assert.ok(is.has('IN-REQ') && !is.has('IN-97-BOX') && !is.has('IN-97-SYM'));
});

t('capstone: implement the CDSCO directive end to end', () => {
  const o = open('in-ostrevia-directive');
  const ch = o.project.changes[0];
  assert.equal(ch.trigger, 'cdsco');
  assert.equal(ch.markets[0].market, 'in');
  assert.equal(ch.docIds.length, 3, 'insert, carton and strip are in the change');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('in-directive'), ctx).score, 0);
  const [pi, carton, strip] = ['in-pi', 'in-carton', 'in-label'].map((k) => o.docs.find((d) => d.kind === k));
  for (const d of [carton, strip]) assert.ok(ids(issues(d, o)).has('IN-H2'), 'H2 product without a QR code');
  add(pi, '4.4', 'Before starting treatment, screen all patients for latent tuberculosis with an interferon-gamma release assay (IGRA) or tuberculin skin test, and a chest X-ray.');
  add(pi, '9', 'Tell patients they will be tested for tuberculosis (a blood or skin test and a chest X-ray) before starting treatment.');
  put(pi, '12', 'November 2026');
  const qr = 'QR code encoding: unique product identification code; proper and generic name; brand name; name and address of the manufacturer; batch number; date of manufacturing; date of expiry; manufacturing licence number.';
  addSection(carton, 'c16', 'QR code (Schedule H2)', qr);
  addSection(strip, 'c16', 'QR code (Schedule H2)', 'QR code with the brand name and batch number.');
  assert.ok(issues(strip, o).some((i) => i.ruleId === 'IN-H2' && /unique product identification code/.test(i.msg)), 'partial QR data is flagged');
  put(strip, 'c16', qr);
  put(carton, 'c14', 'M.R.P. ₹ 3,600.00 for 30 tablets (inclusive of all taxes)');
  put(strip, 'c14', 'M.R.P. ₹ 1,200.00 per strip of 10 tablets (inclusive of all taxes)');
  for (const d of [pi, carton, strip]) assert.equal(summarise(issues(d, o)).errors + summarise(issues(d, o)).warnings, 0, `${d.sampleDocId}: ${JSON.stringify(issues(d, o).map((i) => i.msg))}`);
  ch.markets[0].classification = 'Notification: safety labelling change (fictional)';
  setStep(pack.core, ch, 'in', 2, ch.startDate);
  for (const d of [pi, carton, strip]) d.status = 'approved';
  const r = evaluateDrill(drill('in-directive'), ctx);
  assert.deepEqual(r.goals.filter((g) => !g.done).map((g) => g.label), []);
  assert.equal(r.score, 100);
});

t('the label drill scores the carton and strip together', () => {
  const o = open('in-ostrevia-errors');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('in-label-fix'), ctx).score, 0);
  const clean = sample('in-ostrevia-clean');
  for (const id of ['carton-10', 'strip-10']) {
    const d = o.docs.find((x) => x.sampleDocId === id);
    const c = clean.docs.find((x) => x.id === id);
    d.sections = JSON.parse(JSON.stringify(c.sections)); d.meta = JSON.parse(JSON.stringify(c.meta));
  }
  assert.equal(evaluateDrill(drill('in-label-fix'), ctx).score, 100);
});

t('India certificate: India lessons, an India quiz round and the India capstone', () => {
  const lessonsDone = Object.fromEntries(pack.lessons.lessons.map((l) => [`us-${l.id}`, { best: 100 }]));
  const st = certificateStatus({ region: 'in', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'in', score: 90, total: 10 }, { kind: 'drill', drillId: 'in-directive', score: 100 }], lessonsDone });
  assert.equal(st.lessons.length, 5);
  assert.equal(st.drills.length, 3);
  assert.equal(st.eligible, true);
  const noCap = certificateStatus({ region: 'in', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'in', score: 90, total: 10 }], lessonsDone });
  assert.equal(noCap.eligible, false);
});

console.log(`in: ${n} tests passed`);
