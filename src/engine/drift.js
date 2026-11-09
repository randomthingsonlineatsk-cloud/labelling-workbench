// Label Drift Monitor: for one product, how far each market's label has drifted from the company
// core data sheet (CCDS). Per market: the CCDS version its labels are mapped to (versions behind),
// each statement of the current CCDS (aligned, a justified deviation, or missing), the labelling
// changes still open there, how old they are and whether a safety change is past its target.
// One harmonisation score per market, with the formula on screen. Works on a practice portfolio
// or on the user's own projects for a product.
import { currentVersion, effectiveVersions, versionByV, mappingRows, MAP_KINDS } from './ccds.js';
import { regionOfKind } from './model.js';
import { daysBetween, isSafety } from './changes.js';

export const CELL = { aligned: 'Aligned', justified: 'Justified deviation', missing: 'Missing', na: 'Not mapped' };
export const STEPS = ['Not started', 'Wording drafted', 'Submitted', 'Approved', 'Implemented'];
export const WEIGHTS = { versionBehind: 20, ccsiMissing: 10, otherMissing: 3, justified: 1, overdue: 10, agePerTenDays: 1, ageCap: 20 };
export const FORMULA = `100 − ${WEIGHTS.versionBehind} per CCDS version behind − ${WEIGHTS.ccsiMissing} per missing core safety statement − ${WEIGHTS.otherMissing} per other missing statement − ${WEIGHTS.justified} per justified deviation − ${WEIGHTS.overdue} per safety change past its submission target − 1 per 10 days the oldest open change has been open (at most ${WEIGHTS.ageCap}); never below 0.`;

// market: { id, label, mapped: 'x.y' | null, cells: { key: 'aligned'|'justified'|'missing'|'na' }, changes: [{ title, safety, start, deadline, step }] }
export function driftOf(ccds, markets, asOf) {
  const versions = effectiveVersions(ccds).length ? [...(ccds.versions ?? [])].filter((v) => v.status !== 'draft').sort((a, b) => (a.date || '').localeCompare(b.date || '')) : [];
  const cur = currentVersion(ccds);
  const idx = (v) => versions.findIndex((x) => x.v === v);
  const rows = markets.map((m) => {
    const behind = !cur ? 0 : m.mapped == null ? null : Math.max(0, idx(cur.v) - Math.max(0, idx(m.mapped)));
    const stmts = cur?.statements ?? [];
    const cell = (st) => m.cells?.[st.key] ?? 'na';
    const ccsiMissing = stmts.filter((st) => st.ccsi && cell(st) === 'missing').length;
    const otherMissing = stmts.filter((st) => !st.ccsi && cell(st) === 'missing').length;
    const justified = stmts.filter((st) => cell(st) === 'justified').length;
    const open = (m.changes ?? []).filter((c) => (c.step ?? 0) < 4);
    const overdue = open.filter((c) => c.safety && (c.step ?? 0) < 2 && c.deadline && c.deadline < asOf);
    const oldest = open.reduce((n, c) => Math.max(n, c.start ? daysBetween(c.start, asOf) : 0), 0);
    const W = WEIGHTS;
    const score = Math.max(0, Math.round(100 - W.versionBehind * (behind ?? 0) - W.ccsiMissing * ccsiMissing - W.otherMissing * otherMissing - W.justified * justified - W.overdue * overdue.length - Math.min(W.ageCap, Math.floor(oldest / 10) * W.agePerTenDays)));
    return { ...m, behind, ccsiMissing, otherMissing, justified, open, overdue, oldest, score };
  });
  return { current: cur, statements: cur?.statements ?? [], rows };
}

export const band = (score) => (score >= 85 ? 'ok' : score >= 60 ? 'medium' : 'high');

// The gaps across markets, worst first: what an auditor would ask about.
export function gapList(d, asOf) {
  const out = [];
  for (const r of d.rows) {
    if (r.behind) out.push({ market: r.label, risk: 3, what: `Labels mapped to CCDS ${r.mapped}; current is ${d.current.v} (${r.behind} version${r.behind > 1 ? 's' : ''} behind).`, action: 'Assess the label against the current CCDS and record each statement as aligned or a justified deviation.' });
    for (const st of d.statements) {
      if (r.cells?.[st.key] !== 'missing') continue;
      out.push({ market: r.label, risk: st.ccsi ? 3 : 1, what: `${st.ccsi ? 'Core safety statement' : 'Statement'} missing: ${st.heading}: “${st.text.length > 90 ? `${st.text.slice(0, 90)}…` : st.text}”`, action: st.ccsi ? 'Start (or chase) the labelling change, or record a justified deviation approved by the labelling committee.' : 'Add it at the next update, or record why it does not apply.' });
    }
    for (const c of r.overdue) out.push({ market: r.label, risk: 3, what: `Safety change “${c.title}” not submitted; target was ${c.deadline} (${daysBetween(c.deadline, asOf)} days ago).`, action: 'Escalate: submit, or document the agreed delay with the reason.' });
    for (const c of r.open.filter((x) => !r.overdue.includes(x))) out.push({ market: r.label, risk: c.safety ? 2 : 1, what: `“${c.title}”: ${STEPS[c.step ?? 0].toLowerCase()} since ${c.start} (${daysBetween(c.start, asOf)} days open).`, action: (c.step ?? 0) >= 3 ? 'Approved: implement on packs and in the systems, and plan the old stock.' : 'Keep it moving to approval and implementation.' });
  }
  return out.sort((a, b) => b.risk - a.risk || a.market.localeCompare(b.market));
}

export function driftCsv(d) {
  const head = ['Market', 'Mapped CCDS', 'Versions behind', 'Core safety statements missing', 'Other statements missing', 'Justified deviations', 'Open changes', 'Overdue safety changes', 'Oldest open (days)', 'Harmonisation score', ...d.statements.map((s) => `${s.key}${s.ccsi ? ' (CCSI)' : ''}`)];
  const q = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  return [head, ...d.rows.map((r) => [r.label, r.mapped ?? 'none', r.behind ?? '', r.ccsiMissing, r.otherMissing, r.justified, r.open.length, r.overdue.length, r.oldest, r.score, ...d.statements.map((s) => CELL[r.cells?.[s.key] ?? 'na'])])].map((r) => r.map(q).join(',')).join('\n') + '\n';
}

// ---------- the user's own projects for one product ----------
export function marketsFromProjects(projects, docsOf, core, productId, labelOf) {
  const ps = projects.filter((p) => p.productId === productId);
  const ccdsList = ps.map((p) => p.ccds).filter((c) => currentVersion(c));
  const ccds = ccdsList.sort((a, b) => (currentVersion(b).date || '').localeCompare(currentVersion(a).date || ''))[0] ?? null;
  const by = new Map();
  for (const p of ps) {
    for (const d of docsOf(p.id)) {
      if (!MAP_KINDS.includes(d.kind) || d.role === 'reference' || !ccds) continue;
      const mk = regionOfKind(d.kind);
      const m = by.get(mk) ?? { id: mk, label: labelOf(mk), mapped: null, cells: {}, changes: [] };
      const version = versionByV(ccds, d.ccdsMap?.version) ?? null;
      if (version && (!m.mapped || parseFloat(m.mapped) > parseFloat(version.v))) m.mapped = version.v;
      const cur = currentVersion(ccds);
      for (const r of mappingRows(d, cur)) {
        const v = r.status === 'deviates' || r.status === 'na' ? (r.justified ? 'justified' : 'missing') : r.found || r.status === 'aligned' ? 'aligned' : 'missing';
        const prev = m.cells[r.st.key];
        m.cells[r.st.key] = prev === 'missing' || v === 'missing' ? 'missing' : prev === 'justified' || v === 'justified' ? 'justified' : 'aligned';
      }
      by.set(mk, m);
    }
    for (const c of p.changes ?? []) for (const row of c.markets ?? []) {
      const m = by.get(row.market) ?? { id: row.market, label: labelOf(row.market), mapped: null, cells: {}, changes: [] };
      m.changes.push({ title: c.title, safety: isSafety(core, c), start: c.startDate, deadline: row.deadline, step: row.step ?? 0 });
      by.set(row.market, m);
    }
  }
  return { ccds, markets: [...by.values()] };
}

// ---------- a practice portfolio: Ostrevia after CCDS 4.0 ----------
export const PRACTICE_AS_OF = '2026-11-09';
export function practicePortfolio(pack) {
  const sample = pack.samples.find((s) => s.id === 'ostrevia-ccds4');
  const v3 = structuredClone(sample.ccds.versions.find((v) => v.v === '3.0'));
  const v4 = structuredClone(sample.ccds.versions.find((v) => v.v === '4.0'));
  v4.status = 'effective'; v4.date = '2026-09-15';
  v3.status = 'superseded';
  const v2 = { v: '2.0', date: '2025-11-20', status: 'superseded', note: 'Earlier version (practice data).', statements: v3.statements.filter((s) => s.key !== 'wp-thr') };
  const ccds = { productId: 'nce-tablet', owner: sample.ccds.owner, versions: [v2, v3, v4] };
  const all = (except = {}) => Object.fromEntries(v4.statements.map((s) => [s.key, except[s.key] ?? 'aligned']));
  const HBV = 'Hepatitis B virus reactivation (CCDS 4.0)';
  const THR = 'Thrombosis (CCDS 3.0)';
  const ch = (title, start, deadline, step, safety = true) => ({ title, safety, start, deadline, step });
  const hbv = (step) => ch(HBV, '2026-09-15', '2026-10-15', step);
  const markets = [
    { id: 'us', label: 'United States', mapped: '4.0', cells: all(), changes: [hbv(4)] },
    { id: 'eu', label: 'European Union', mapped: '4.0', cells: all(), changes: [hbv(3)] },
    { id: 'uk', label: 'United Kingdom', mapped: '3.0', cells: all({ 'wp-hbv': 'missing', 'ar-renal': 'justified' }), changes: [hbv(2)] },
    { id: 'ca', label: 'Canada', mapped: '3.0', cells: all({ 'wp-hbv': 'missing' }), changes: [hbv(1)] },
    { id: 'ch', label: 'Switzerland', mapped: '2.0', cells: all({ 'wp-hbv': 'missing', 'wp-thr': 'missing' }), changes: [ch(THR, '2026-08-03', '2026-09-02', 2), hbv(0)] },
    { id: 'jp', label: 'Japan', mapped: '4.0', cells: all({ lact: 'justified' }), changes: [hbv(4)] },
    { id: 'au', label: 'Australia', mapped: '3.0', cells: all({ 'wp-hbv': 'missing' }), changes: [hbv(3)] },
    { id: 'in', label: 'India', mapped: '3.0', cells: all({ 'wp-hbv': 'missing', 'wp-efd': 'missing', od: 'missing' }), changes: [hbv(0)] },
  ];
  return { ccds, markets, asOf: PRACTICE_AS_OF };
}
