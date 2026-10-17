// Phase 3 tests: the EU pack (QRD templates, checks, excipients, labelling, user test,
// translation review, PRAC capstone, ePI view, EU certificate).
import assert from 'node:assert/strict';
import { PACKS, productById, kindsFor } from '../src/engine/pack.js';
import { runChecks, summarise, canApprove } from '../src/engine/checks.js';
import { projectFromSample, findSection, blankDoc } from '../src/engine/model.js';
import { runRound, userTestResult, leafletHash } from '../src/engine/usertest.js';
import { translationFindings } from '../src/engine/checks-eu.js';
import { scriptFor, submitDraft, openRound, sendResponse } from '../src/engine/agency.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { sampleChange, setStep } from '../src/engine/changes.js';
import { epiSections, epiHtml } from '../src/engine/epi.js';
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
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('EU pack is merged: kinds, rules with sources, samples with region, nine lessons', () => {
  assert.deepEqual(kindsFor(pack, 'eu'), ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small']);
  assert.ok(pack.rules.filter((r) => r.id.startsWith('EU-')).length >= 20);
  for (const r of pack.rules) assert.ok(pack.sources.some((s) => s.id === r.src), r.id);
  assert.ok(pack.samples.filter((s) => s.region === 'eu' && s.module === 'eu').length === 8);
  assert.equal(pack.lessons.lessons.filter((l) => l.module === 'eu').length, 9);
  assert.equal(new Set(pack.lessons.lessons.map((l) => l.id)).size, pack.lessons.lessons.length, 'lesson ids unique across modules');
  assert.equal(pack.regions.eu.version, '1.1.0');
  assert.equal(pack.regions.eu.changes[0].version, '1.1.0', 'the change log starts with the current version');
});

t('clean EU set: no errors or warnings on any document', () => {
  const o = open('eu-ostrevia-clean');
  assert.equal(o.project.region, 'eu');
  for (const d of o.docs) { const s = summarise(issues(d, o)); assert.equal(s.errors + s.warnings, 0, `${d.sampleDocId}: ${JSON.stringify(issues(d, o).filter((i) => i.severity !== 'info').map((i) => i.msg))}`); }
});

t('black triangle: required when monitored, flagged when not', () => {
  const o = open('eu-ostrevia-clean');
  const smpc = o.docs.find((d) => d.kind === 'smpc');
  smpc.meta.additionalMonitoring = false;
  assert.ok(issues(smpc, o).some((i) => i.ruleId === 'EU-BT' && i.severity === 'warning'));
  smpc.meta.additionalMonitoring = true; smpc.fixed.blackTriangle = 'This medicine is new.';
  assert.ok(issues(smpc, o).some((i) => i.ruleId === 'EU-BT' && i.severity === 'error'));
});

t('4.8: a table without frequency categories is flagged', () => {
  const o = open('eu-ostrevia-clean');
  const smpc = o.docs.find((d) => d.kind === 'smpc');
  const s48 = findSection(smpc, '4.8');
  s48.blocks = s48.blocks.map((b) => (b.t === 'table' ? { ...b, rows: [['System organ class', 'Reaction', 'Rate'], ['Nervous system disorders', 'Headache', '9%']] } : b)).filter((b) => b.t !== 'p' || /Reporting|Appendix/.test(b.text));
  assert.ok(ids(issues(smpc, o)).has('EU-48-FREQ'));
});

t('excipients: lactose needs SmPC 4.4, leaflet section 2 and carton section 3; adding them clears it', () => {
  const o = open('eu-ostrevia-lactose');
  const [smpc, pl, outer] = ['smpc', 'pl', 'outer-25'].map((k) => o.docs.find((d) => d.sampleDocId === k));
  for (const d of [smpc, pl, outer]) assert.ok(ids(issues(d, o)).has('EU-EXC'), d.sampleDocId);
  assert.ok(evaluateDrill(drill('eu-lactose'), { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project }).score === 0);
  add(smpc, '4.4', 'Lactose: patients with rare hereditary problems of galactose intolerance, total lactase deficiency or glucose-galactose malabsorption should not take the 25 mg tablets.');
  add(pl, 'pl2.8', 'Ostrevia 25 mg contains lactose. If you have been told by your doctor that you have an intolerance to some sugars, contact your doctor before taking this medicinal product.');
  put(outer, '3', 'Contains lactose and sodium. See the package leaflet for further information.');
  for (const d of [smpc, pl, outer]) assert.ok(!ids(issues(d, o)).has('EU-EXC'), d.sampleDocId);
  assert.equal(evaluateDrill(drill('eu-lactose'), { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project }).score, 100);
});

t('labelling: QR code and blue box are hints only; Braille needs the strength when there are several', () => {
  const o = open('eu-ostrevia-clean');
  const outer = o.docs.find((d) => d.kind === 'eu-outer');
  put(outer, '16', 'ostrevia');
  assert.ok(ids(issues(outer, o)).has('EU-BRAILLE'));
  put(outer, '16', 'ostrevia 10 mg');
  add(outer, '5', 'Scan the QR code for the leaflet.');
  const is = issues(outer, o);
  assert.equal(is.find((i) => i.ruleId === 'EU-QR')?.severity, 'info');
  assert.equal(is.find((i) => i.ruleId === 'EU-BLUEBOX')?.severity, 'info');
  assert.ok(canApprove(is));
});

t('blank EU documents start with the QRD headings and fail the required checks', () => {
  const p = productById('nce-tablet');
  for (const k of kindsFor(pack, 'eu')) {
    const d = blankDoc(pack, k, p, 'p', user);
    assert.ok(d.sections.length > 0, k);
    assert.ok(runChecks(d, { pack, docs: [d], product: p }).some((i) => i.severity === 'error'), k);
  }
  const pl = blankDoc(pack, 'pl', p, 'p', user);
  assert.equal(pl.meta.proprietaryName, 'Ostrevia');
  assert.equal(findSection(pl, 'pl2.1').title, 'Do not take Ostrevia');
  assert.ok(pl.fixed.blackTriangle.startsWith('▼'), 'monitored product gets the triangle');
});

t('user test: the jargon draft fails; plain rewrites and two rounds on the final text pass', () => {
  const o = open('eu-ostrevia-usertest');
  const pl = o.docs.find((d) => d.kind === 'pl');
  pl.userTest.rounds.push(runRound(pl, 1));
  let r = userTestResult(pl);
  assert.equal(r.passed, false);
  assert.ok(ids(issues(pl, o)).has('EU-UT'));
  const clean = sample('eu-ostrevia-clean').docs.find((d) => d.id === 'pl');
  for (const num of ['pl2.2', 'pl3', 'pl4']) findSection(pl, num).blocks = JSON.parse(JSON.stringify(findSection(clean, num).blocks));
  pl.userTest.rounds.push(runRound(pl, 2));
  assert.equal(userTestResult(pl).passed, false, 'one round on the final text is not enough');
  pl.userTest.rounds.push(runRound(pl, 3));
  r = userTestResult(pl);
  assert.equal(r.passed, true, JSON.stringify(r.perQuestion));
  assert.ok(!ids(issues(pl, o)).has('EU-UT'));
  assert.equal(evaluateDrill(drill('eu-usertest'), { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project }).score, 100);
  add(pl, 'pl5', 'Store in the original package.');
  assert.notEqual(leafletHash(pl), pl.userTest.rounds.at(-1).hash);
  assert.equal(userTestResult(pl).passed, false, 'a later edit needs new rounds');
});

t('translation: finds the dose, the missing period and the term; fixing them and the linguistic review completes the drill', () => {
  const o = open('eu-ostrevia-translation');
  const fr = o.docs.find((d) => d.sampleDocId === 'pl-fr');
  const f = translationFindings(fr, { pack, docs: o.docs, project: o.project });
  assert.deepEqual(f.map((x) => x.rule).sort(), ['EU-TR-NUM', 'EU-TR-NUM', 'EU-TR-TERM']);
  const en = o.docs.find((d) => d.sampleDocId === 'pl');
  assert.equal(summarise(issues(en, o)).errors, 0, 'the English source is clean');
  put(fr, 'pl3', 'Veillez à toujours prendre ce médicament en suivant exactement les indications de votre médecin ou pharmacien.', 'La dose recommandée est d’un comprimé de 10 mg une fois par jour. Votre médecin peut l’augmenter à un comprimé de 25 mg après 12 semaines.');
  add(fr, 'pl2.6', 'N’allaitez pas pendant 4 jours après la dernière dose.');
  const s4 = findSection(fr, 'pl4');
  s4.title = '4. Quels sont les effets indésirables éventuels';
  s4.blocks[0].text = s4.blocks[0].text.replace('effets secondaires', 'effets indésirables');
  s4.subs[0].title = 'Déclaration des effets indésirables';
  assert.deepEqual(translationFindings(fr, { pack, docs: o.docs, project: o.project }), []);
  const script = scriptFor(pack, o.project, fr);
  assert.equal(script.length, 4);
  submitDraft(fr, script, '2026-10-11');
  for (const c of openRound(fr).comments) { c.decision = c.kind === 'question' ? 'answer' : 'accept'; c.reply = 'Confirmed, thank you.'; }
  assert.equal(sendResponse(fr, '2026-10-12').agreed, true);
  assert.equal(evaluateDrill(drill('eu-translation'), { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project }).score, 100);
});

t('a project term base adds terms to the check', () => {
  const o = open('eu-ostrevia-translation');
  const fr = o.docs.find((d) => d.sampleDocId === 'pl-fr');
  o.project.termBase = { fr: [{ source: 'eczema', target: 'dermatite' }] };
  assert.ok(translationFindings(fr, { pack, docs: o.docs, project: o.project }).some((x) => /eczema/.test(x.msg)));
});

t('capstone: implement the PRAC recommendation end to end', () => {
  const o = open('eu-ostrevia-prac');
  const ch = o.project.changes[0];
  assert.equal(ch.trigger, 'prac');
  assert.equal(ch.markets[0].market, 'eu');
  assert.equal(ch.markets[0].deadline, (() => { const d = new Date(`${ch.startDate}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 60); return d.toISOString().slice(0, 10); })(), 'the recommendation sets 60 days');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('eu-prac'), ctx).score, 0);
  const smpc = o.docs.find((d) => d.kind === 'smpc'); const pl = o.docs.find((d) => d.kind === 'pl');
  add(smpc, '4.4', 'Drug reaction with eosinophilia and systemic symptoms (DRESS), which can be life-threatening or fatal, has been reported. If signs and symptoms suggestive of DRESS appear, Ostrevia should be withdrawn immediately.');
  findSection(smpc, '4.8').blocks.splice(3, 0, { id: 'd1', t: 'p', text: 'Skin and subcutaneous tissue disorders, frequency not known: drug reaction with eosinophilia and systemic symptoms (DRESS).' });
  add(pl, 'pl2.2', 'Stop taking Ostrevia and get medical help straight away if you get a widespread rash, high body temperature and enlarged lymph nodes (DRESS).');
  add(pl, 'pl4', 'Not known: widespread rash, high body temperature and enlarged lymph nodes (DRESS or drug hypersensitivity syndrome).');
  for (const d of [smpc, pl]) assert.equal(summarise(issues(d, o)).errors + summarise(issues(d, o)).warnings, 0, JSON.stringify(issues(d, o).map((i) => i.msg)));
  ch.markets[0].classification = 'Type IA-IN, C.3.a';
  setStep(pack.core, ch, 'eu', 2, ch.startDate);
  smpc.status = 'approved'; pl.status = 'approved';
  const r = evaluateDrill(drill('eu-prac'), ctx);
  assert.deepEqual(r.goals.filter((g) => !g.done).map((g) => g.label), []);
});

t('ePI view: stable section ids, language and a watermark', () => {
  const pl = sample('eu-ostrevia-clean').docs.find((d) => d.id === 'pl');
  const secs = epiSections(pl);
  assert.ok(secs.some((x) => x.id === 'pl-2.1' && x.title === 'Do not take Ostrevia'));
  assert.equal(secs[0].id, 'pl-additional-monitoring');
  const html = epiHtml(pl);
  assert.match(html, /<html lang="en">/);
  assert.match(html, /not HL7 FHIR/);
});

t('EU certificate: EU lessons, an EU quiz round and the EU capstone', () => {
  const lessonsDone = Object.fromEntries(pack.lessons.lessons.map((l) => [`us-${l.id}`, { best: 100 }]));
  const st = certificateStatus({ region: 'eu', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'eu', score: 90, total: 10 }, { kind: 'drill', drillId: 'eu-prac', score: 100 }], lessonsDone });
  assert.equal(st.lessons.length, 9);
  assert.equal(st.drills.length, 9);
  assert.equal(st.eligible, true);
});

t('Annex II and the small vial label: standard statements, EXP, Lot and route', () => {
  const o = open('eu-ostrevia-clean');
  const a2 = o.docs.find((d) => d.kind === 'eu-annex2');
  assert.equal(summarise(issues(a2, o)).errors, 0);
  put(a2, 'D.1', 'The MAH has an RMP.');
  assert.ok(ids(issues(a2, o)).has('EU-A2'));
  const v = open('eu-nelvaprox-vial');
  const vial = v.docs[0];
  assert.equal(evaluateDrill(drill('eu-annex2-vial'), { docs: v.docs, sample: v.s, pack, product: v.product, project: v.project }).score, 0);
  put(vial, '1', 'Nelvaprox 10 mg/mL solution for injection', 'velnaprozine', 'IV');
  put(vial, '3', 'EXP');
  assert.equal(summarise(issues(vial, v)).errors, 0, JSON.stringify(issues(vial, v).map((i) => i.msg)));
  assert.equal(evaluateDrill(drill('eu-annex2-vial'), { docs: v.docs, sample: v.s, pack, product: v.product, project: v.project }).score, 100);
  put(vial, '5', 'some liquid');
  assert.ok(ids(issues(vial, v)).has('EU-SMALL'));
});

console.log(`eu: ${n} tests passed`);
