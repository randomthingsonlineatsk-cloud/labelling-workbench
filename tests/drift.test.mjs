// Label Drift Monitor and the UK mapping alias.
import assert from 'node:assert/strict';
import { packFor } from '../src/engine/pack.js';
import { driftOf, gapList, driftCsv, practicePortfolio, band, WEIGHTS, marketsFromProjects } from '../src/engine/drift.js';
import { autoMatch, mapKind } from '../src/engine/ccds.js';

const pack = packFor('us');
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('practice portfolio: eight markets, CCDS 4.0 current, scores ordered as the gaps say', () => {
  const p = practicePortfolio(pack);
  const d = driftOf(p.ccds, p.markets, p.asOf);
  assert.equal(d.current.v, '4.0');
  assert.equal(d.rows.length, 8);
  const s = Object.fromEntries(d.rows.map((r) => [r.id, r]));
  assert.equal(s.us.score, 100);
  assert.equal(s.ch.behind, 2);
  assert.ok(s.ch.score < s.uk.score && s.uk.score < s.eu.score);
  assert.equal(s.in.overdue.length, 1);
  assert.equal(s.ch.overdue.length, 1, 'Switzerland: HBV not started past its 30-day target');
  assert.equal(s.uk.justified, 1);
  assert.equal(band(s.us.score), 'ok'); assert.equal(band(s.ch.score), 'high');
  // The formula, by hand, for the UK: 1 version behind, 1 CCSI missing, 1 justified, change submitted (not overdue), open 55 days.
  assert.equal(s.uk.score, 100 - WEIGHTS.versionBehind - WEIGHTS.ccsiMissing - WEIGHTS.justified - 5);
  const gaps = gapList(d, p.asOf);
  assert.equal(gaps[0].risk, 3);
  assert.ok(gaps.some((g) => g.market === 'India' && /not submitted/.test(g.what)));
  assert.match(driftCsv(d).split('\n')[0], /Harmonisation score/);
});

t('UK SmPC and leaflet map with the EU targets', () => {
  assert.equal(mapKind('uk-smpc'), 'smpc'); assert.equal(mapKind('uk-pil'), 'pl');
  const uk = pack.samples.find((s) => s.id === 'uk-ostrevia-clean');
  const ccds = pack.samples.find((s) => s.id === 'ostrevia-ccds4').ccds.versions[0];
  const smpc = uk.docs.find((d) => d.kind === 'uk-smpc');
  const ind = ccds.statements.find((s) => s.key === 'ind');
  assert.equal(autoMatch(smpc, ind).found, true);
});

t('my projects: markets from mapped labels and change rows', () => {
  const ccds4 = pack.samples.find((s) => s.id === 'ostrevia-ccds4').ccds;
  const ccds = { ...ccds4, versions: ccds4.versions.filter((v) => v.status === 'effective') };
  const uk = pack.samples.find((s) => s.id === 'uk-ostrevia-clean');
  const projects = [{ id: 'p1', productId: 'nce-tablet', ccds, changes: [{ title: 'X', kind: 'warning', trigger: 'signal', startDate: '2026-10-01', markets: [{ market: 'uk', step: 1, deadline: '2026-10-31' }, { market: 'ca', step: 0, deadline: '2026-10-31' }] }] }];
  const docs = uk.docs.filter((d) => d.kind === 'uk-smpc').map((d) => ({ ...d, projectId: 'p1', ccdsMap: { version: '3.0', rows: {} } }));
  const r = marketsFromProjects(projects, () => docs, pack.core, 'nce-tablet', (m) => m.toUpperCase());
  const d = driftOf(r.ccds, r.markets, '2026-11-09');
  const ukRow = d.rows.find((x) => x.id === 'uk');
  assert.equal(ukRow.mapped, '3.0'); assert.equal(ukRow.overdue.length, 1);
  assert.ok(d.rows.find((x) => x.id === 'ca'));
});

console.log(`drift: ${n} tests passed`);
