// Completion pass: the spec items finished after Phase 5. Adverse-reaction and figure blocks,
// changed-rule detection for old projects, pack change logs, EU Annex II and small packaging
// (tested in eu.test), biosimilar labelling, the EU generic against its reference, EU mapping to
// the CCDS, Module 1 packages for every eCTD region, the PV signal intake, the quiz bank, the
// offline service worker and failing cases for every rule.
import assert from 'node:assert/strict';
import { PACKS, productById, ruleStamp, ruleChanges } from '../src/engine/pack.js';
import { runChecks, summarise, compareSections } from '../src/engine/checks.js';
import { projectFromSample, findSection, newBlock, arProblems, blockTexts } from '../src/engine/model.js';
import { evaluateDrill } from '../src/engine/drills.js';
import { currentVersion, setRow } from '../src/engine/ccds.js';
import { labellingPackage, m1Section } from '../src/engine/handoff.js';
import { parseSignalFile, PV_SIGNAL_KIND, sampleChange } from '../src/engine/changes.js';
import { exportProject, parseProjectFile } from '../src/engine/io.js';
import { splXml } from '../src/engine/spl.js';
import { translationFindings } from '../src/engine/checks-eu.js';
import serviceWorker from '../tools/sw-plugin.js';
import { readdirSync, readFileSync } from 'node:fs';

const pack = PACKS.us;
const user = { userId: 'u-test', classId: null };
const sample = (id) => pack.samples.find((s) => s.id === id);
const drill = (id) => pack.drills.drills.find((d) => d.id === id);
const clone = (x) => JSON.parse(JSON.stringify(x));
const open = (id) => { const s = sample(id); const product = productById(s.productId); const r = projectFromSample(s, user, { pack, product }); const c = sampleChange(pack.core, s, r.docs, user); if (c) r.project.changes = [c]; return { ...r, s, product }; };
const issues = (doc, o) => runChecks(doc, { pack, docs: o.docs, product: o.product, project: o.project }).filter((i) => !i.waived);
const ids = (is) => new Set(is.map((i) => i.ruleId));
const put = (doc, num, ...texts) => { findSection(doc, num).blocks = texts.map((text, i) => ({ id: `t${num}${i}`, t: 'p', text })); };
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('adverse-reaction table: headings, rates or frequency categories, one cell per heading', () => {
  const b = newBlock('ar');
  assert.equal(b.rows[0].length, 3);
  b.rows = [['Adverse reaction', 'Drug (%)', 'Placebo (%)'], ['Headache', '8%', '5%'], ['Nausea', 'common', 'uncommon']];
  assert.deepEqual(arProblems(b), []);
  b.rows.push(['Rash', 'a few', '2%'], ['', '1%', '1%'], ['Dizziness', '3%']);
  const p = arProblems(b);
  assert.ok(p.some((x) => /"a few"/.test(x)) && p.some((x) => /no adverse reaction term/.test(x)) && p.some((x) => /2 cells/.test(x)), JSON.stringify(p));
  assert.ok(blockTexts(b).includes('Headache'), 'checks read the table text');
  const o = open('ostrevia-clean');
  const pi = o.docs.find((d) => d.kind === 'pi');
  assert.ok(findSection(pi, '6.1').blocks.some((x) => x.t === 'ar'), 'the US sample uses the block');
  assert.match(splXml(pi, { product: o.product }), /<td>Nasopharyngitis<\/td>/);
});

t('figure placeholder: caption is label text, alt text is kept, SPL marks the placeholder', () => {
  const o = open('ostrevia-clean');
  const pi = o.docs.find((d) => d.kind === 'pi');
  findSection(pi, '14').blocks.push({ ...newBlock('fig'), text: 'Figure 1: response over 16 weeks', alt: 'Line chart of response by week' });
  assert.ok(blockTexts(findSection(pi, '14').blocks.at(-1)).includes('Figure 1: response over 16 weeks'));
  assert.match(splXml(pi, { product: o.product }), /\[Figure placeholder\] Figure 1/);
  assert.equal(summarise(issues(pi, o)).errors, 0);
});

t('every pack has a change log that starts with its current version', () => {
  for (const r of Object.values(pack.regions)) {
    if (r.id === 'intl') continue;
    assert.ok(r.changes?.length, r.id);
    assert.equal(r.changes[0].version, r.version, r.id);
  }
  assert.equal(pack.core.changes[0].version, pack.core.version);
});

t('an old project lists the rules that changed since it was made', () => {
  const o = open('eu-ostrevia-clean');
  assert.ok(o.project.ruleStamp && Object.keys(o.project.ruleStamp).length > 10);
  assert.equal(ruleChanges(o.project.ruleStamp, pack, 'eu'), null, 'no change on the same pack');
  const old = { ...o.project.ruleStamp };
  old['EU-HEAD'] = 'different';
  delete old['EU-A2'];
  old['EU-RETIRED'] = 'x';
  const rc = ruleChanges(old, pack, 'eu');
  assert.deepEqual(rc.changed.map((r) => r.id), ['EU-HEAD']);
  assert.deepEqual(rc.added.map((r) => r.id), ['EU-A2']);
  assert.deepEqual(rc.removed.map((r) => r.id), ['EU-RETIRED']);
  const file = JSON.parse(exportProject({ project: { ...o.project, ruleStamp: old }, docs: o.docs, versions: [], reviews: [], audit: [], pack, user }));
  const r = parseProjectFile(JSON.stringify(file), user, pack);
  assert.ok(r.warnings.some((w) => /1 added, 1 changed, 1 removed/.test(w)), JSON.stringify(r.warnings));
  assert.deepEqual(r.project.ruleStamp, old, 'kept for the project page');
  assert.ok(Object.keys(ruleStamp(pack, 'us')).some((id) => id.startsWith('CORE-')), 'core rules apply to every region');
});

t('biosimilar: statement, footnote, own name; interchangeability is a hint only', () => {
  const o = open('selvanta-biosimilar');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  const pi = o.docs.find((d) => d.role === 'biosimilar');
  const ref = o.docs.find((d) => d.role === 'reference');
  assert.equal(summarise(issues(ref, o)).errors + summarise(issues(ref, o)).warnings, 0, JSON.stringify(issues(ref, o).map((i) => i.msg)));
  assert.equal(issues(pi, o).find((i) => i.ruleId === 'US-BIO-IC')?.severity, 'info');
  const diff = () => compareSections(ref, pi).filter((r) => !['same', 'permitted'].includes(r.status)).map((r) => r.num);
  assert.deepEqual(diff(), ['5.1'], 'its own proper name is not a difference; naming the reference is');
  assert.equal(evaluateDrill(drill('bio-label'), ctx).score, 0);
  pi.hl.bioNote = '* Biosimilar means that the biological product is approved based on data demonstrating that it is highly similar to an FDA-approved biological product, known as a reference product, and that there are no clinically meaningful differences between the biosimilar product and the reference product.';
  findSection(pi, '5.1').blocks = clone(findSection(ref, '5.1').blocks);
  assert.equal(evaluateDrill(drill('bio-label'), ctx).score, 100);
  assert.deepEqual(diff(), []);
  assert.equal(summarise(issues(pi, o)).errors, 0, JSON.stringify(issues(pi, o).filter((i) => i.severity === 'error').map((i) => i.msg)));
  pi.hl.bio = 'SELVANTA is biosimilar to ARVENTA.';
  assert.ok(ids(issues(pi, o)).has('US-BIO-STMT'), 'proper names are needed');
  assert.equal(o.docs.length, 2, 'reference and biosimilar');
});

t('EU generic: the left-out indication and the changed warning; permitted differences pass', () => {
  const o = open('eu-talmisartan-generic');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  const gen = o.docs.find((d) => d.role === 'generic');
  assert.equal(evaluateDrill(drill('eu-generic'), ctx).score, 0);
  const s42 = findSection(gen, '4.2');
  s42.blocks = s42.blocks.filter((b) => !/nephropathy/i.test(b.text));
  put(gen, '4.4', 'Hyperkalaemia: serum potassium should be monitored in patients at risk, such as those with renal impairment or diabetes, or those taking potassium supplements.',
    'Dual blockade of the renin-angiotensin-aldosterone system (RAAS): concomitant use of ACE inhibitors, angiotensin II receptor blockers or aliskiren increases the risk of hypotension, hyperkalaemia and decreased renal function and is not recommended.',
    'Pregnancy: angiotensin II receptor antagonists should not be initiated during pregnancy. When pregnancy is diagnosed, treatment should be stopped immediately.');
  assert.equal(summarise(issues(gen, o)).errors, 0, JSON.stringify(issues(gen, o).map((i) => i.msg)));
  assert.equal(evaluateDrill(drill('eu-generic'), ctx).score, 100);
  put(gen, '4.7', 'Talmisartan Ashvale is the best-tolerated option.');
  assert.ok(ids(issues(gen, o)).has('EU-GEN-SAME'));
});

t('EU mapping to the CCDS: the drill passes when the two EU gaps are justified', () => {
  const o = open('ostrevia-ccds-eu');
  assert.equal(o.project.region, 'eu');
  const ctx = { docs: o.docs, sample: o.s, pack, product: o.product, project: o.project };
  assert.equal(evaluateDrill(drill('ccds-map-eu'), ctx).score, 0);
  const cur = currentVersion(o.project.ccds);
  const smpc = o.docs.find((d) => d.kind === 'smpc'); const pl = o.docs.find((d) => d.kind === 'pl');
  setRow(smpc, cur, 'ar-renal', { status: 'deviates', justification: 'The EU SmPC gives renal advice in 4.2 in agreed wording (fictional).' });
  setRow(pl, cur, 'wp-hz', { status: 'na', justification: 'Vaccination advice is for prescribers; the leaflet does not carry it (fictional).' });
  setRow(pl, cur, 'ind', { status: 'aligned' });
  const r = evaluateDrill(drill('ccds-map-eu'), ctx);
  assert.equal(r.score, 100, JSON.stringify(r.goals));
});

t('labelling package for every eCTD region; AU and WHO have none', () => {
  const want = { 'eu-ostrevia-clean': ['EU', ['eu:1.3.1'], 'var-type2'], 'in-ostrevia-clean': ['IN', ['in:1.3'], 'post-approval-change'], 'ca-ostrevia-clean': ['CA', ['ca:1.3.1', 'ca:1.3.2'], 'snds'], 'ch-ostrevia-clean': ['CH', ['ch:1.3.1', 'ch:1.3.2'], 'var-type2'], 'jp-ostrevia-clean': ['JP', ['jp:1.8'], 'jp_partial-change'] };
  for (const [id, [region, nodes, type]] of Object.entries(want)) {
    const o = open(id);
    const pkg = labellingPackage({ project: o.project, docs: o.docs, product: o.product, pack, user });
    assert.equal(pkg.region, region, id);
    assert.equal(pkg.submission.submissionType, type, id);
    assert.deepEqual([...new Set(pkg.documents.map((d) => d.section))].sort(), nodes, id);
  }
  const eu = open('eu-ostrevia-clean');
  const pkg = labellingPackage({ project: eu.project, docs: eu.docs, product: eu.product, pack, user });
  assert.equal(pkg.documents.length, 1, 'one combined EU document');
  assert.match(pkg.documents[0].fileName, /^ema-/);
  assert.match(pkg.documents[0].content, /Annex II/);
  const au = open('au-ostrevia-clean');
  assert.throws(() => labellingPackage({ project: au.project, docs: au.docs, product: au.product, pack, user }), /no Module 1/);
  assert.equal(m1Section({ kind: 'pi', status: 'draft' }), '1.14.1.3', 'US unchanged');
});

t('PV signal file: fills a change request; wrong files are refused', () => {
  const file = { kind: PV_SIGNAL_KIND, schema: 1, product: { inn: 'lumiravostat' }, signal: { title: 'Interstitial lung disease', kind: 'warning', validatedOn: '2026-10-10', proposedWording: 'Interstitial lung disease has been reported.', evidence: '14 cases (fictional)', markets: ['us', 'eu'] } };
  const r = parseSignalFile(JSON.stringify(file), productById('nce-tablet'));
  assert.deepEqual(r.warnings, []);
  assert.equal(r.fields.trigger, 'signal');
  assert.equal(r.fields.startDate, '2026-10-10');
  assert.deepEqual(r.fields.markets, ['us', 'eu']);
  assert.match(r.fields.text, /Evidence: 14 cases/);
  assert.equal(parseSignalFile(file, productById('generic-tablet')).warnings.length, 1, 'another product');
  assert.throws(() => parseSignalFile('{"kind":"other"}'), /not a labelling signal/);
  assert.throws(() => parseSignalFile({ kind: PV_SIGNAL_KIND, signal: { title: 'x' } }), /proposed wording/);
});

t('quiz bank: every lesson has at least eight questions, all answerable', () => {
  const byTopic = {};
  for (const q of pack.quiz.questions) {
    byTopic[q.topic] = (byTopic[q.topic] ?? 0) + 1;
    assert.ok(q.options.length >= 2 && q.answer >= 0 && q.answer < q.options.length, q.id);
    assert.equal(new Set(q.options).size, q.options.length, `${q.id}: options are distinct`);
    assert.ok(q.cite, `${q.id}: cites a source`);
  }
  for (const l of pack.lessons.lessons) assert.ok((byTopic[l.id] ?? 0) >= 8, `lesson ${l.id} has ${byTopic[l.id] ?? 0}`);
  assert.equal(new Set(pack.quiz.questions.map((q) => q.id)).size, pack.quiz.questions.length);
});

t('failing cases for the rules no sample plants: US-PMI-LEN, EU-PL-READ, EU-TR-MISS', () => {
  const p = open('ostrevia-pmi');
  const pmi = p.docs.find((d) => d.kind === 'pmi');
  const long = Array.from({ length: 160 }, () => 'This medicine can cause serious side effects that you need to know about.').join(' ');
  put(pmi, findSectionKey(pmi), long);
  assert.ok(ids(issues(pmi, p)).has('US-PMI-LEN'));
  const o = open('eu-ostrevia-clean');
  const pl = o.docs.find((d) => d.kind === 'pl');
  put(pl, 'pl1', 'Ostrevia contains lumiravostat, an immunomodulatory kinase-inhibiting pharmacotherapeutic substance administered systemically, indicated for the amelioration of moderate-to-severe chronic inflammatory dermatological manifestations affecting the hands, characterised by erythema, desquamation and pruritus refractory to topical corticosteroid preparations.');
  assert.equal(issues(pl, o).find((i) => i.ruleId === 'EU-PL-READ')?.severity, 'info', 'a hint, never pass or fail');
  const tr = open('eu-ostrevia-translation');
  const fr = tr.docs.find((d) => d.sampleDocId === 'pl-fr');
  findSection(fr, 'pl5').blocks = [{ id: 'e', t: 'p', text: '' }];
  assert.ok(translationFindings(fr, { pack, docs: tr.docs, project: tr.project }).some((x) => x.rule === 'EU-TR-MISS'));
});
function findSectionKey(doc) { return doc.sections.find((s) => s.blocks)?.num; }

t('every rule card is planted in a sample or exercised by a test', () => {
  const dir = new URL('.', import.meta.url);
  const text = readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => readFileSync(new URL(f, dir), 'utf8')).join('\n');
  const TESTED = new Set(pack.rules.map((r) => r.id).filter((id) => text.includes(`'${id}'`)));
  const planted = new Set(pack.samples.flatMap((s) => s.docs.flatMap((d) => (d.answerKey ?? []).map((k) => k.rule))));
  const missing = pack.rules.filter((r) => !planted.has(r.id) && !TESTED.has(r.id)).map((r) => r.id);
  assert.deepEqual(missing, []);
});

t('service worker: the build precaches every file once and drops old caches', () => {
  let emitted;
  const plugin = serviceWorker();
  plugin.generateBundle.call({ emitFile: (f) => { emitted = f; } }, {}, { 'assets/index-abc.js': {}, 'index.html': {}, 'assets/pdf-def.js': {} });
  assert.equal(emitted.fileName, 'sw.js');
  const files = JSON.parse(/const FILES = (\[.*\]);/.exec(emitted.source)[1]);
  assert.deepEqual(files, ['./', './index.html', './favicon.svg', './assets/index-abc.js', './assets/pdf-def.js']);
  assert.match(emitted.source, /caches\.delete/);
  assert.match(emitted.source, /origin !== self\.location\.origin\) return/, 'the classroom API is never cached');
});

console.log(`completion: ${n} tests passed`);
