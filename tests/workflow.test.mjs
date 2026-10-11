// Workflow tests: the capstone end to end, conversion, renumbering, comparison, exports.
import assert from 'node:assert/strict';
import { PACKS, productById } from '../src/engine/pack.js';
import { runChecks, canApprove } from '../src/engine/checks.js';
import { projectFromSample, moveSub, findSection, blankDoc } from '../src/engine/model.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { scoreMapping, buildPlr, oldBlocks } from '../src/engine/convert.js';
import { compareDocs, proofCheck, diffWords } from '../src/engine/diff.js';
import { splXml } from '../src/engine/spl.js';
import { exportProject, parseProjectFile } from '../src/engine/io.js';
import { certificateStatus, verificationCode } from '../src/engine/certificate.js';

const pack = PACKS.us;
const user = { userId: 'u-test', classId: null };
const sample = (id) => pack.samples.find((s) => s.id === id);
const drill = (id) => pack.drills.drills.find((d) => d.id === id);
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('capstone: a full safety update scores 100', () => {
  const s = sample('ostrevia-clean');
  const { docs } = projectFromSample(s, user);
  const pi = docs.find((d) => d.kind === 'pi');
  const mg = docs.find((d) => d.kind === 'mg');
  const product = productById(s.productId);
  assert.equal(evaluateDrill(drill('capstone'), { docs, sample: s, pack, product }).score, 0);
  findSection(pi, '5').subs.push({ num: '5.6', title: 'Interstitial Lung Disease', blocks: [{ id: 'n1', t: 'p', text: 'Interstitial lung disease, including serious cases, has been reported in patients treated with OSTREVIA. Interrupt OSTREVIA in patients with new or worsening cough or shortness of breath and evaluate promptly.' }] });
  pi.hl.wp[0].items.push('Interstitial lung disease: Interrupt treatment and evaluate new or worsening respiratory symptoms. (5.6)');
  pi.meta.revised = '10/2026';
  pi.hl.rmc = [{ heading: 'Warnings and Precautions, Interstitial Lung Disease', num: '5.6', date: '10/2026' }];
  findSection(pi, '17').blocks.push({ id: 'n2', t: 'p', text: 'Interstitial Lung Disease: Advise patients to report new or worsening cough or shortness of breath [see Warnings and Precautions (5.6)].' });
  mg.meta.revised = '10/2026';
  mg.sections[0].blocks[1].items.push('Lung problems. Some people have had swelling of the lungs. Tell your healthcare provider right away if you have a new or worse cough or shortness of breath.');
  const ctx = { pack, docs, product, today: new Date('2026-10-11') };
  const piIssues = runChecks(pi, ctx).filter((i) => i.severity !== 'info');
  assert.ok(canApprove(runChecks(pi, ctx)), JSON.stringify(piIssues.map((i) => i.msg)));
  assert.ok(canApprove(runChecks(mg, ctx)));
  pi.status = 'approved'; mg.status = 'approved';
  const r = evaluateDrill(drill('capstone'), { docs, sample: s, pack, product });
  assert.equal(r.score, 100, JSON.stringify(r.goals));
});

t('rules drill scores from the planted findings', () => {
  const s = sample('nelvaprox-convert');
  const { docs } = projectFromSample(s, user);
  const product = productById(s.productId);
  assert.equal(evaluateDrill(drill('carton-fix'), { docs, sample: s, pack, product }).score, 0);
  const c = docs.find((d) => d.kind === 'carton');
  Object.assign(c.fields, { strength: '50 mg/5 mL (10 mg/mL)', rxOnly: 'Rx only', ndc: 'NDC 99996-501-10' });
  c.barcode = true; c.sizes.establishedName = 8;
  assert.equal(evaluateDrill(drill('carton-fix'), { docs, sample: s, pack, product }).score, 100);
});

t('conversion: the answer key scores 100 and builds a PLR draft', () => {
  const s = sample('nelvaprox-convert');
  const old = s.docs.find((d) => d.kind === 'pi-old');
  const key = Object.fromEntries(oldBlocks(old).map((b) => [b.id, b.target]));
  assert.equal(scoreMapping(old, key).score, 100);
  const half = { ...key }; const first5 = oldBlocks(old).find((b) => b.target === '5.1'); half[first5.id] = '5.2';
  assert.ok(scoreMapping(old, half).score < 100 && scoreMapping(old, half).score > 90);
  const plr = buildPlr(pack, old, key, productById(s.productId), 'p1', user);
  assert.ok(findSection(plr, '8.1').blocks[0].text.includes('Pregnancy Category B'));
  const ids = new Set(runChecks(plr, { pack, docs: [plr], product: productById(s.productId) }).map((i) => i.ruleId));
  assert.ok(ids.has('US-PI-PLLR') && ids.has('US-HL-REV') && ids.has('US-HL-REF'), 'the draft still needs PLLR work and Highlights');
  assert.ok(findSection(plr, '14').blocks.length === 1);
});

t('moving a subsection renumbers cross-references', () => {
  const { docs } = projectFromSample(sample('ostrevia-clean'), user);
  const pi = docs[0];
  moveSub(pi, '5', 0, 1); // 5.1 Serious Infections <-> 5.2 Malignancy
  assert.equal(findSection(pi, '5.1').title, 'Malignancy');
  assert.ok(pi.bw.blocks[0].items[0].includes('(5.2)'), 'boxed warning infection ref now 5.2');
  assert.ok(pi.hl.wp[0].items[0].endsWith('(5.2)'));
  assert.ok(findSection(pi, '2.2').blocks[0].text.includes('(5.2, 5.4)'));
  const iss = runChecks(pi, { pack, docs, product: productById('nce-tablet'), today: new Date('2026-10-11') });
  assert.ok(!iss.some((i) => i.ruleId === 'US-PI-XREF' || i.ruleId === 'US-HL-REF'));
});

t('version comparison finds the edited section only', () => {
  const s = sample('ostrevia-clean');
  const a = s.docs[0]; const b = JSON.parse(JSON.stringify(a));
  b.sections[0].blocks[0].text += ' Extra sentence.';
  const rows = compareDocs(a, b).filter((r) => r.status !== 'same');
  assert.equal(rows.length, 1);
  assert.ok(rows[0].parts.some((p) => p.op === 'add' && p.text.includes('Extra')));
});

t('proof check finds the two printer errors', () => {
  const s = sample('ostrevia-clean');
  const carton = s.docs.find((d) => d.kind === 'carton');
  assert.deepEqual(proofCheck(carton.fields, s.proof.fields).filter((r) => !r.ok).map((r) => r.key).sort(), ['ndc', 'storage']);
});

t('diffWords', () => assert.deepEqual(diffWords('a b c', 'a x c').map((p) => p.op), ['same', 'del', 'add', 'same']));

t('SPL-style XML is balanced and marked as practice', () => {
  for (const d of sample('ostrevia-clean').docs) {
    const x = splXml(d, { date: '2026-10-11' });
    assert.ok(x.includes('NOT a validated'));
    const open = (x.match(/<section>/g) ?? []).length; const close = (x.match(/<\/section>/g) ?? []).length;
    assert.equal(open, close);
    assert.ok(!/&(?!amp;|lt;|gt;|quot;)/.test(x.replace(/<!--[\s\S]*?-->/, '')));
  }
});

t('project file round trip with checksum', () => {
  const { project, docs } = projectFromSample(sample('talmisartan-generic'), user);
  const text = exportProject({ project, docs, versions: [], reviews: [], audit: [], pack, user });
  const r = parseProjectFile(text, { userId: 'u-other', classId: 'c1' }, pack);
  assert.equal(r.warnings.length, 0);
  assert.equal(r.docs.length, 2);
  assert.ok(r.docs.every((d) => d.projectId === r.project.id && d.userId === 'u-other' && d.classId === 'c1'));
  const tampered = text.replace('Hyperkalemia may occur', 'Hyperkalaemia may occur');
  assert.equal(parseProjectFile(tampered, user, pack).warnings.length, 1);
  assert.throws(() => parseProjectFile('{"kind":"other"}', user, pack));
});

t('blank documents start with the template and fail the right checks', () => {
  const p = productById('nce-tablet');
  for (const k of pack.kinds.filter((x) => x !== 'pi-old')) {
    const d = blankDoc(pack, k, p, 'p', user);
    const iss = runChecks(d, { pack, docs: [d], product: p });
    assert.ok(iss.some((i) => i.severity === 'error'), k);
  }
});

t('certificate needs lessons, quiz and capstone', () => {
  const lessonsDone = Object.fromEntries(pack.lessons.lessons.map((l) => [`us-${l.id}`, { best: 100 }]));
  let st = certificateStatus({ lessons: pack.lessons, drills: pack.drills, attempts: [], lessonsDone });
  assert.equal(st.eligible, false);
  st = certificateStatus({ lessons: pack.lessons, drills: pack.drills, lessonsDone, attempts: [{ kind: 'quiz', region: 'us', topic: 'all', total: 10, score: 90 }, { kind: 'drill', drillId: 'capstone', score: 100 }] });
  assert.equal(st.eligible, true);
  assert.match(verificationCode({ name: 'A Learner', userId: 'u', status: st, date: '2026-10-11' }), /^LW-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/);
});

t('lessons have four or more check questions each', () => {
  for (const l of pack.lessons.lessons) assert.ok(pack.quiz.questions.filter((q) => q.topic === l.id).length >= 4, l.title);
  for (const q of pack.quiz.questions) assert.ok(q.answer >= 0 && q.answer < q.options.length, q.id);
});

console.log(`workflow: ${n} tests passed`);
