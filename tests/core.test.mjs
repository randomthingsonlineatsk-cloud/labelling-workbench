// Phase 2 tests: core data sheet mapping, change requests and 505(o)(4), agency rounds,
// hand-off files, PMI checks, the core drills and the core certificate.
import assert from 'node:assert/strict';
import { PACKS, productById, PRODUCTS } from '../src/engine/pack.js';
import { runChecks, canApprove } from '../src/engine/checks.js';
import { projectFromSample, findSection, blankDoc } from '../src/engine/model.js';
import { currentVersion, draftVersion, versionByV, startDraft, makeEffective, mappingRows, setRow, remap, impactOf, deviationRegister, toCsv } from '../src/engine/ccds.js';
import { newChange, setStep, respondO4, o4Clock, trackerRows, classifierFile, applyRolloutFile, addDays, sampleChange, CCDS_CHANGE_KIND } from '../src/engine/changes.js';
import { scriptFor, submitDraft, sendResponse, responseProblems, openRound, satisfied, responseTable } from '../src/engine/agency.js';
import { labellingPackage, ccsiFile, productFromEctdFile, m1Section, LABEL_PKG_KIND } from '../src/engine/handoff.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { exportProject, parseProjectFile } from '../src/engine/io.js';
import { certificateStatus } from '../src/engine/certificate.js';
import { submissionPayload, verifySubmission, asProjectFile, SUBMISSION_KIND, DEFAULT_API } from '../src/engine/classroom.js';

const pack = PACKS.us;
const core = pack.core;
const user = { userId: 'u-test', classId: null };
const clone = (x) => JSON.parse(JSON.stringify(x));
const sample = (id) => pack.samples.find((s) => s.id === id);
const drill = (id) => pack.drills.drills.find((d) => d.id === id);
const open = (id) => { const s = sample(id); const product = productById(s.productId); const r = projectFromSample(s, user, { pack, product }); const c = sampleChange(core, s, r.docs, user); if (c) r.project.changes = [c]; return { ...r, s, product }; };
const issuesOf = (doc, ctx) => runChecks(doc, ctx).filter((i) => !i.waived);
const ids = (is) => is.map((i) => i.ruleId);
let n = 0;
const t = (name, fn) => { fn(); n++; };
const addPara = (doc, num, text) => findSection(doc, num).blocks.push({ id: `t${Math.random()}`, t: 'p', text });

t('pack merge: core rules, sources, lessons, drills and samples are present', () => {
  for (const id of ['CORE-MAP', 'CORE-DEV-JUST', 'CORE-VERSION', 'CORE-AGENCY', 'US-PMI-HEAD']) assert.ok(pack.rules.some((r) => r.id === id), id);
  for (const r of pack.rules) assert.ok(pack.sources.some((s) => s.id === r.src), `${r.id} source`);
  assert.equal(pack.lessons.lessons.filter((l) => l.module === 'core').length, 4);
  assert.equal(pack.drills.drills.filter((d) => d.module === 'core' && d.capstone).length, 1);
  for (const s of pack.samples.filter((x) => x.module === 'core')) assert.ok(s.docs.length >= 2, s.id);
  assert.ok(pack.kinds.includes('pmi'));
});

t('unmapped label: version warning, CCSI gap error, non-CCSI gap warning', () => {
  const { project, docs, product } = open('ostrevia-ccds');
  const pi = docs.find((d) => d.kind === 'pi');
  const is = issuesOf(pi, { pack, docs, product, project });
  assert.ok(is.some((i) => i.ruleId === 'CORE-VERSION'));
  assert.ok(is.some((i) => i.ruleId === 'CORE-MAP' && i.severity === 'error' && /vaccination/.test(i.msg)));
  assert.ok(is.some((i) => i.ruleId === 'CORE-MAP' && i.severity === 'warning' && /renal/i.test(i.msg)));
  assert.equal(canApprove(is), false);
  const mg = docs.find((d) => d.kind === 'mg');
  assert.ok(!issuesOf(mg, { pack, docs, product, project }).some((i) => i.ruleId === 'CORE-MAP'), 'the Medication Guide carries every statement mapped to it');
});

t('mapping: justify the gaps and the core findings clear; a short reason does not count', () => {
  const { project, docs, product } = open('ostrevia-ccds');
  const ctx = { pack, docs, product, project };
  const pi = docs.find((d) => d.kind === 'pi');
  const cur = currentVersion(project.ccds);
  setRow(pi, cur, 'wp-hz', { status: 'deviates', justification: 'too short' });
  assert.ok(issuesOf(pi, ctx).some((i) => i.ruleId === 'CORE-DEV-JUST'));
  setRow(pi, cur, 'wp-hz', { justification: 'FDA asked for vaccination advice by reference to ACIP guidance only (fictional).' });
  setRow(pi, cur, 'ar-renal', { status: 'na', justification: 'No renal impairment subsection in the US label; data not reviewed by FDA (fictional).' });
  assert.deepEqual(ids(issuesOf(pi, ctx)).filter((x) => x.startsWith('CORE')), []);
  const reg = deviationRegister(project, docs);
  assert.equal(reg.length, 2);
  assert.match(toCsv(reg, [['key', 'Statement'], ['justification', 'Justification']]), /wp-hz,FDA asked/);
  const rows = mappingRows(pi, cur);
  assert.ok(rows.find((r) => r.st.key === 'wp-inf').found);
});

t('mapping: adding the statement to the label also clears it', () => {
  const { project, docs, product } = open('ostrevia-ccds');
  const pi = docs.find((d) => d.kind === 'pi');
  setRow(pi, currentVersion(project.ccds), 'ar-renal', { status: 'na', justification: 'Renal data not reviewed for the US application (fictional).' });
  addPara(pi, '5.1', 'Consider vaccination against herpes zoster before starting OSTREVIA, following current immunization guidelines.');
  assert.deepEqual(ids(issuesOf(pi, { pack, docs, product, project })).filter((x) => x.startsWith('CORE')), []);
});

t('CCDS versions: draft, reason and date required, impact lists the new statement and the labels', () => {
  const { project, docs } = open('ostrevia-ccds4');
  const d = draftVersion(project.ccds);
  assert.equal(d.v, '4.0');
  const imp = impactOf(currentVersion(project.ccds), d, docs);
  assert.equal(imp.length, 1);
  assert.equal(imp[0].change, 'added');
  assert.deepEqual(imp[0].labels.map((l) => l.kind).sort(), ['mg', 'pi']);
  assert.throws(() => makeEffective(project.ccds, '4.0', '2026-13-01'), /yyyy-mm-dd/);
  const blank = clone(project.ccds); versionByV(blank, '4.0').note = ''; assert.throws(() => makeEffective(blank, '4.0', '2026-10-01'), /reason/);
  makeEffective(project.ccds, '4.0', '2026-10-01');
  assert.equal(currentVersion(project.ccds).v, '4.0');
  assert.equal(versionByV(project.ccds, '3.0').status, 'superseded');
  assert.equal(startDraft(project.ccds).v, '5.0');
});

t('a new effective version flags labels mapped to the old one; remap keeps unchanged decisions', () => {
  const { project, docs, product } = open('ostrevia-ccds4');
  const pi = docs.find((d) => d.kind === 'pi');
  makeEffective(project.ccds, '4.0', '2026-10-01');
  const is = issuesOf(pi, { pack, docs, product, project });
  assert.ok(is.some((i) => i.ruleId === 'CORE-VERSION' && /3\.0/.test(i.msg)));
  remap(pi, versionByV(project.ccds, '3.0'), versionByV(project.ccds, '4.0'));
  assert.equal(pi.ccdsMap.version, '4.0');
  assert.equal(pi.ccdsMap.rows['wp-hz'].status, 'deviates', 'unchanged statement keeps its decision');
  const is2 = issuesOf(pi, { pack, docs, product, project });
  assert.ok(is2.some((i) => i.ruleId === 'CORE-MAP' && /Hepatitis B/.test(i.msg)));
});

t('change requests: deadlines by safety, statuses set targets, lateness flags', () => {
  const c = newChange(core, { trigger: 'ccds', kind: 'warning', title: 'x', startDate: '2026-10-01', markets: ['us', 'eu'], user });
  assert.equal(c.markets[0].deadline, '2026-10-31');
  const ed = newChange(core, { trigger: 'other', kind: 'editorial', title: 'y', startDate: '2026-10-01', markets: ['us'] });
  assert.equal(ed.markets[0].deadline, '2026-12-30');
  assert.throws(() => newChange(core, { trigger: 'ccds', kind: 'warning', startDate: '01/10/2026' }));
  setStep(core, c, 'us', 3, '2026-10-20');
  const us = c.markets.find((m) => m.market === 'us');
  assert.deepEqual(Object.keys(us.dates), ['Wording drafted', 'Submitted', 'Approved']);
  assert.equal(us.shipTarget, addDays('2026-10-20', core.targets.shipDays));
  const rows = trackerRows(core, c, '2026-11-15');
  assert.equal(rows.find((r) => r.market === 'eu').lateSubmit, 'overdue');
  assert.equal(rows.find((r) => r.market === 'us').lateSubmit, '');
  setStep(core, c, 'us', 1, '2026-10-21');
  assert.equal(c.markets[0].dates.Approved, undefined, 'moving back clears later dates');
});

t('505(o)(4): 30-day clock, supplement on time, rebuttal needs reasons and starts discussions', () => {
  const c = newChange(core, { trigger: 'o4', kind: 'warning', title: 'z', startDate: '2026-10-01', markets: ['us'] });
  assert.equal(c.o4.dueOn, '2026-10-31');
  assert.equal(c.markets[0].deadline, '2026-10-31');
  assert.equal(o4Clock(c, '2026-10-11').left, 20);
  assert.ok(o4Clock(c, '2026-11-02').late);
  assert.throws(() => respondO4(core, c, { response: 'rebuttal', date: '2026-10-10', reasons: 'no' }), /reasons/);
  const r = clone(c); respondO4(core, r, { response: 'rebuttal', date: '2026-10-10', reasons: 'The reported cases have alternative explanations and no dechallenge information (fictional).' });
  assert.equal(r.o4.discussUntil, '2026-11-09'); assert.equal(r.o4.orderBy, '2026-11-24');
  respondO4(core, c, { response: 'supplement', date: '2026-11-02' });
  assert.equal(c.o4.late, true);
});

t('classifier hand-off: change file out, rollout file back in', () => {
  const { project, product } = open('ostrevia-ccds4');
  const c = newChange(core, { trigger: 'ccds', kind: 'warning', title: 'HBV', text: 'Hepatitis B reactivation', ccdsVersion: '4.0', startDate: '2026-10-01', markets: ['us', 'eu'] });
  const f = classifierFile({ change: c, product, project, user });
  assert.equal(f.kind, CCDS_CHANGE_KIND);
  assert.deepEqual(f.regions, ['us', 'eu']);
  assert.equal(f.ccds.kind, 'warning');
  assert.equal(f.product.id, 'nce-tablet');
  const back = { kind: 'variations-classifier/ccds-rollout', schema: 1, regions: [{ region: 'us', step: 2, dates: { Submitted: '2026-10-15' }, classification: 'CBE-0' }, { region: 'in', step: 1, dates: {}, classification: 'Major' }] };
  const notes = applyRolloutFile(core, c, JSON.stringify(back));
  assert.equal(c.markets.find((m) => m.market === 'us').classification, 'CBE-0');
  assert.equal(c.markets.find((m) => m.market === 'us').step, 2);
  assert.ok(c.markets.some((m) => m.market === 'in'));
  assert.equal(notes.length, 1);
  assert.throws(() => applyRolloutFile(core, c, '{"kind":"other"}'));
});

t('agency rounds: accept needs the text change, decline brings a follow-up, then agreement', () => {
  const { project, docs, product } = open('ostrevia-o4');
  const pi = docs.find((d) => d.kind === 'pi');
  const script = scriptFor(pack, project, pi);
  assert.equal(script.length, 6);
  pi.status = 'draft';
  submitDraft(pi, script, '2026-10-05');
  assert.ok(issuesOf(pi, { pack, docs, product, project }).some((i) => i.ruleId === 'CORE-AGENCY'));
  const r = openRound(pi);
  for (const c of r.comments) c.decision = c.kind === 'question' ? 'answer' : 'accept';
  r.comments.find((c) => c.kind === 'question').reply = 'Yes, listed with this revision date.';
  assert.ok(responseProblems(pi, r).length >= 4, 'accepted comments whose change is missing');
  assert.throws(() => sendResponse(pi, '2026-10-06'));
  // Make the changes, but decline the promotional comment.
  findSection(pi, '5').subs.push({ num: '5.6', title: 'Hypersensitivity Reactions', blocks: [{ id: 'h1', t: 'p', text: 'Serious hypersensitivity reactions, including angioedema and anaphylaxis, have been reported. Discontinue OSTREVIA and start appropriate treatment if a serious hypersensitivity reaction occurs.' }] });
  pi.hl.wp[0].items.push('Hypersensitivity reactions: Discontinue if serious reactions occur. (5.6)');
  findSection(pi, '6').subs.push({ num: '6.2', title: 'Postmarketing Experience', blocks: [{ id: 'h2', t: 'p', text: 'The following adverse reactions have been identified during postapproval use. Because these reactions are reported voluntarily from a population of uncertain size, it is not always possible to estimate their frequency. Immune system disorders: angioedema, anaphylaxis.' }] });
  addPara(pi, '17', 'Hypersensitivity Reactions: Advise patients to stop OSTREVIA and get emergency help for swelling of the face, lips or tongue, or trouble breathing [see Warnings and Precautions (5.6)].');
  const promo = r.comments.find((c) => c.id === 'pi-4');
  promo.decision = 'decline'; promo.reply = 'Marketing would like to keep the statement.';
  assert.deepEqual(responseProblems(pi, r), []);
  const res = sendResponse(pi, '2026-10-06');
  assert.equal(res.agreed, false);
  assert.equal(openRound(pi).comments.length, 1);
  assert.match(openRound(pi).comments[0].text, /must be removed/);
  const sec14 = findSection(pi, '14'); sec14.blocks = sec14.blocks.filter((b) => !/superior/.test(b.text ?? ''));
  openRound(pi).comments[0].decision = 'accept';
  assert.equal(satisfied(pi, openRound(pi).comments[0]), true);
  assert.equal(sendResponse(pi, '2026-10-08').agreed, true);
  assert.equal(pi.agency.agreedOn, '2026-10-08');
  assert.ok(!issuesOf(pi, { pack, docs, product, project }).some((i) => i.ruleId === 'CORE-AGENCY'));
  assert.equal(responseTable(pi).length, 7);
});

t('PMI: blank fails the proposed checks; a good one passes; promotional words are caught', () => {
  const { project, docs, product } = open('ostrevia-pmi');
  const pmi = docs.find((d) => d.kind === 'pmi');
  const ctx = { pack, docs, product, project };
  const blank = ids(issuesOf(pmi, ctx));
  for (const id of ['US-PMI-HEAD', 'US-PMI-BW']) assert.ok(blank.includes(id), id);
  assert.ok(!blank.some((x) => x.startsWith('US-PMI') && issuesOf(pmi, ctx).find((i) => i.ruleId === x).severity === 'error'), 'Watch: never errors');
  const put = (num, text) => { findSection(pmi, num).blocks = [{ id: `p${num}`, t: 'p', text }]; };
  put('p0', 'OSTREVIA is a prescription medicine for adults with chronic hand eczema that is not controlled by steroid creams.');
  put('p1.1', 'Serious infections can happen and can cause death. Cancer, including lymphoma, has happened. Blood clots in the legs or lungs can happen.');
  put('p1.2', 'Do not take OSTREVIA if you are allergic to it or any of its ingredients.');
  put('p1.3', 'Get medical help right away for fever, chest pain, leg swelling or sudden shortness of breath.');
  put('p1.4', 'Tell your health care provider if you have an infection, have had TB or a blood clot, or are pregnant.');
  put('p2', 'Common cold, headache, nausea and acne.');
  put('p3', 'Use exactly as prescribed. Take 1 tablet by mouth each day. Store at room temperature.');
  assert.deepEqual(ids(issuesOf(pmi, ctx)).filter((x) => x.startsWith('US-PMI') && x !== 'US-PMI-READ'), []);
  assert.equal(evaluateDrill(drill('pmi-write'), { docs, sample: sample('ostrevia-pmi'), pack, product, project }).score, 100);
  put('p2', 'The best treatment. Common cold and headache.');
  assert.ok(ids(issuesOf(pmi, ctx)).includes('US-PMI-PROMO'));
  put('p3', 'Take 1 tablet each day.');
  assert.ok(ids(issuesOf(pmi, ctx)).includes('US-PMI-USE'));
});

t('drill: map the label to the CCDS scores from 0 to 100', () => {
  const { project, docs, product, s } = open('ostrevia-ccds');
  const ctx = { docs, sample: s, pack, product, project };
  assert.equal(evaluateDrill(drill('ccds-map'), ctx).score, 0);
  const cur = currentVersion(project.ccds);
  const pi = docs.find((d) => d.kind === 'pi'); const mg = docs.find((d) => d.kind === 'mg');
  setRow(pi, cur, 'wp-hz', { status: 'deviates', justification: 'FDA asked for vaccination advice by reference only (fictional).' });
  setRow(pi, cur, 'ar-renal', { status: 'na', justification: 'Renal data were not reviewed for the US application (fictional).' });
  setRow(mg, cur, 'ind', { status: 'aligned' });
  assert.equal(evaluateDrill(drill('ccds-map'), ctx).score, 100);
});

t('capstone: roll out CCDS 4.0 end to end', () => {
  const { project, docs, product, s } = open('ostrevia-ccds4');
  const ctx = { docs, sample: s, pack, product, project };
  const d = drill('ccds-rollout');
  assert.equal(evaluateDrill(d, ctx).score, 0);
  makeEffective(project.ccds, '4.0', '2026-10-01');
  const c = newChange(core, { trigger: 'ccds', kind: 'warning', title: 'HBV', ccdsVersion: '4.0', startDate: '2026-10-01', markets: ['us', 'eu', 'in'] });
  project.changes = [c];
  const pi = docs.find((x) => x.kind === 'pi'); const mg = docs.find((x) => x.kind === 'mg');
  addPara(pi, '2.2', 'Test for hepatitis B virus infection before starting OSTREVIA.');
  addPara(pi, '5.1', 'Hepatitis B virus reactivation has been reported. Screen patients for hepatitis B before starting treatment and monitor patients with past infection.');
  findSection(mg, 'm1').blocks[1].items.push('Hepatitis B coming back. Tell your healthcare provider if you have ever had hepatitis B.');
  for (const x of [pi, mg]) remap(x, versionByV(project.ccds, '3.0'), versionByV(project.ccds, '4.0'));
  pi.status = 'approved'; mg.status = 'approved';
  setStep(core, c, 'us', 4, '2026-10-20');
  const r = evaluateDrill(d, ctx);
  assert.deepEqual(r.goals.filter((g) => !g.done).map((g) => g.label), []);
  assert.equal(r.score, 100);
});

t('drill: 505(o)(4) response scores the clock, every requested change and agreement', () => {
  const { project, docs, product, s } = open('ostrevia-o4');
  const ctx = { docs, sample: s, pack, product, project };
  const r0 = evaluateDrill(drill('o4-respond'), ctx);
  assert.ok(r0.score < 20);
  assert.equal(r0.goals.length, 1 + 5 + 1 + 2);
  const ch = project.changes[0];
  respondO4(core, ch, { response: 'supplement', date: ch.o4.notifiedOn });
  const pi = docs.find((d) => d.kind === 'pi'); const mg = docs.find((d) => d.kind === 'mg');
  for (const d of [pi, mg]) d.status = 'draft';
  findSection(pi, '5').subs.push({ num: '5.6', title: 'Hypersensitivity Reactions', blocks: [{ id: 'h1', t: 'p', text: 'Serious hypersensitivity reactions, including angioedema and anaphylaxis, have been reported. Discontinue OSTREVIA if a serious reaction occurs.' }] });
  pi.hl.wp[0].items.push('Hypersensitivity reactions: Discontinue if serious reactions occur. (5.6)');
  findSection(pi, '6').subs.push({ num: '6.2', title: 'Postmarketing Experience', blocks: [{ id: 'h2', t: 'p', text: 'These reactions are reported voluntarily from a population of uncertain size: angioedema, anaphylaxis.' }] });
  addPara(pi, '17', 'Hypersensitivity: Advise patients to stop OSTREVIA and get emergency help for swelling of the face or trouble breathing.');
  const s14 = findSection(pi, '14'); s14.blocks = s14.blocks.filter((b) => !/superior/.test(b.text ?? ''));
  findSection(mg, 'm7').blocks.push({ id: 'm', t: 'p', text: 'Serious allergic reactions. Stop taking OSTREVIA and get emergency help right away if you have swelling of your face, lips, mouth or tongue, trouble breathing or hives.' });
  for (const d of [pi, mg]) {
    submitDraft(d, scriptFor(pack, project, d), '2026-10-05');
    for (const c of openRound(d).comments) { c.decision = c.kind === 'question' ? 'answer' : 'accept'; if (c.kind === 'question') c.reply = 'Confirmed; no further change needed.'; }
    assert.equal(sendResponse(d, '2026-10-06').agreed, true);
  }
  const r1 = evaluateDrill(drill('o4-respond'), ctx);
  assert.deepEqual(r1.goals.filter((g) => !g.done).map((g) => g.label), []);
});

t('hand-off: labelling package places labels in Module 1.14 by status', () => {
  const { project, docs, product } = open('ostrevia-ccds');
  const pi = docs.find((d) => d.kind === 'pi');
  assert.equal(m1Section(pi), '1.14.2.3');
  assert.equal(m1Section({ ...pi, status: 'draft' }), '1.14.1.3');
  assert.equal(m1Section({ ...pi, status: 'draft' }, { annotated: true }), '1.14.1.2');
  assert.equal(m1Section(docs.find((d) => d.kind === 'carton')), '1.14.2.1');
  assert.equal(m1Section(docs.find((d) => d.kind === 'mg')), '1.14.2.2');
  const pkg = labellingPackage({ project, docs, product, pack, user });
  assert.equal(pkg.kind, LABEL_PKG_KIND);
  assert.equal(pkg.submission.submissionType, 'labeling-supplement');
  assert.equal(pkg.documents.length, docs.length);
  assert.ok(pkg.documents.every((d) => d.section.startsWith('1.14.') && d.fileName.endsWith('.pdf') && d.content.length > 0));
  const draft = labellingPackage({ project, docs: [{ ...pi, status: 'draft' }], product, pack, user });
  assert.deepEqual(draft.documents.map((d) => d.section), ['1.14.1.3', '1.14.1.2']);
});

t('hand-off: CCSI file has only core safety statements; eCTD project file gives the product', () => {
  const { project, product } = open('ostrevia-ccds');
  const f = ccsiFile({ project, product, user });
  assert.equal(f.ccds.version, '3.0');
  assert.equal(f.statements.length, currentVersion(project.ccds).statements.filter((s) => s.ccsi).length);
  const r = productFromEctdFile(JSON.stringify({ kind: 'ectd-dossier-builder/project', project: { productId: 'talmisartan-er', region: 'EU', name: 'Talvera XR MAA' } }), PRODUCTS);
  assert.equal(r.product.id, 'talmisartan-er');
  assert.equal(r.region, 'EU');
  assert.equal(r.warnings.length, 0, 'EU has a pack now');
  assert.equal(productFromEctdFile(JSON.stringify({ kind: 'ectd-dossier-builder/project', project: { productId: 'nce-tablet', region: 'JP' } }), PRODUCTS).warnings.length, 1);
  assert.throws(() => productFromEctdFile('{"kind":"x"}', PRODUCTS));
});

t('project file round trip keeps the CCDS, mapping, change requests and their links', () => {
  const { project, docs } = open('ostrevia-o4');
  const text = exportProject({ project, docs, versions: [], reviews: [], audit: [], pack, user });
  const r = parseProjectFile(text, { userId: 'u-2', classId: 'c9' }, pack);
  assert.equal(r.project.ccds.versions.length, 1);
  assert.equal(r.project.changes.length, 1);
  const newIds = new Set(r.docs.map((d) => d.id));
  assert.ok(r.project.changes[0].docIds.length === 2 && r.project.changes[0].docIds.every((id) => newIds.has(id)));
  assert.ok(r.docs.find((d) => d.kind === 'pi').ccdsMap);
});

t('core certificate: its own lessons, core quiz round and the core capstone', () => {
  const lessonsDone = Object.fromEntries(pack.lessons.lessons.map((l) => [`us-${l.id}`, { best: 100 }]));
  let st = certificateStatus({ region: 'core', lessons: pack.lessons, drills: pack.drills, attempts: [], lessonsDone });
  assert.equal(st.lessons.length, 4);
  assert.equal(st.drills.length, 4);
  assert.equal(st.eligible, false);
  st = certificateStatus({ region: 'core', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'all', score: 100, total: 10 }, { kind: 'drill', drillId: 'ccds-rollout', score: 100 }], lessonsDone });
  assert.equal(st.eligible, false, 'a US round does not count');
  st = certificateStatus({ region: 'core', lessons: pack.lessons, drills: pack.drills, attempts: [{ kind: 'quiz', topic: 'core', score: 90, total: 10 }, { kind: 'drill', drillId: 'ccds-rollout', score: 100 }], lessonsDone });
  assert.equal(st.eligible, true);
  const us = certificateStatus({ region: 'us', lessons: pack.lessons, drills: pack.drills, attempts: [], lessonsDone });
  assert.equal(us.lessons.length, 11);
});

t('blank PMI document starts with the proposed headings', () => {
  const d = blankDoc(pack, 'pmi', productById('nce-tablet'), 'p', user);
  assert.deepEqual(d.sections.map((s) => s.num), ['p0', 'p1', 'p2', 'p3']);
  assert.deepEqual(d.sections[1].subs.map((s) => s.num), ['p1.1', 'p1.2', 'p1.3', 'p1.4']);
  assert.match(d.sections[0].title, /^OSTREVIA \(lumiravostat\)/);
});

t('classroom: a drill project is sent with its score and re-scored by the instructor', () => {
  const { project, docs, product } = open('ostrevia-pmi');
  assert.throws(() => submissionPayload({ project, docs, versions: [], reviews: [], audit: [], pack, user, product }), /not a drill/);
  project.drill = { id: 'pmi-write', startedAt: '2026-10-11T00:00:00Z', done: { score: 0, at: '2026-10-11T00:30:00Z' } };
  const p = submissionPayload({ project, docs, versions: [], reviews: [], audit: [], pack, user, product });
  assert.equal(p.project.kind, SUBMISSION_KIND);
  assert.equal(p.project.project.drill.id, 'pmi-write', 'the Worker reads project.project.drill.id');
  assert.equal(p.score, 0);
  assert.equal(p.checks.length, 5);
  const v = verifySubmission(JSON.parse(JSON.stringify(p.project)), { pack, productById });
  assert.equal(v.score, 0);
  const r = parseProjectFile(asProjectFile(p.project), user, pack);
  assert.equal(r.docs.length, docs.length);
  assert.match(DEFAULT_API, /\/lw\/v1$/);
});

console.log(`core: ${n} tests passed`);
