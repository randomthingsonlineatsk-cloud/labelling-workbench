// Company core data sheet (CCDS): versions, mapping a local label to it, the deviation register
// and the impact of a new version. The CCDS lives on the project (project.ccds); each label
// carries its own mapping (doc.ccdsMap = { version, rows: { key: { status, justification } } }).
import { findSection, blocksText } from './model.js';

export const MAP_KINDS = ['pi', 'mg'];
export const MAP_STATUS = { aligned: 'Aligned', deviates: 'Deviates', na: 'Not applicable' };
export const MIN_JUSTIFICATION = 15;

export const effectiveVersions = (ccds) => (ccds?.versions ?? []).filter((v) => v.status === 'effective');
export const currentVersion = (ccds) => effectiveVersions(ccds).at(-1) ?? null;
export const draftVersion = (ccds) => (ccds?.versions ?? []).find((v) => v.status === 'draft') ?? null;
export const versionByV = (ccds, v) => (ccds?.versions ?? []).find((x) => x.v === v) ?? null;

const nextV = (v) => { const [a] = String(v ?? '0').split('.'); return `${Number(a) + 1}.0`; };

// Starts a draft from the current effective version (or returns the open draft).
export function startDraft(ccds) {
  const open = draftVersion(ccds);
  if (open) return open;
  const cur = currentVersion(ccds);
  const d = { v: nextV(cur?.v), date: '', status: 'draft', note: '', statements: JSON.parse(JSON.stringify(cur?.statements ?? [])) };
  ccds.versions.push(d);
  return d;
}

export function makeEffective(ccds, v, date) {
  const d = versionByV(ccds, v);
  if (!d || d.status !== 'draft') throw new Error('Only a draft version can be made effective.');
  if (!d.note?.trim()) throw new Error('Give the reason for the change before making the version effective.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) throw new Error('Give the effective date as yyyy-mm-dd.');
  for (const x of effectiveVersions(ccds)) x.status = 'superseded';
  d.status = 'effective';
  d.date = date;
  return d;
}

// The text of a label in the places a statement is mapped to.
export function targetText(doc, target) {
  if (target === 'bw') return [doc.bw?.title ?? '', blocksText(doc.bw?.blocks)].join('\n');
  if (target === 'hl') return Object.values(doc.hl ?? {}).filter(Array.isArray).map((b) => (b[0]?.t ? blocksText(b) : '')).join('\n');
  const s = findSection(doc, target);
  if (!s) return '';
  return [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))].join('\n');
}

const safeRe = (t) => { try { return new RegExp(t, 'i'); } catch { return new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); } };

// Is the statement present in this label? Every term group must match in the mapped text.
export function autoMatch(doc, st) {
  const targets = st.targets?.[doc.kind] ?? [];
  if (!targets.length) return { applies: false, found: false, missingTerms: [] };
  const text = targets.map((t) => targetText(doc, t)).join('\n');
  const terms = st.terms?.[doc.kind] ?? [];
  const missingTerms = terms.filter((t) => !safeRe(t).test(text));
  return { applies: true, found: text.trim().length > 0 && missingTerms.length === 0, missingTerms, targets };
}

// One row per statement that applies to this kind of label.
export function mappingRows(doc, version) {
  if (!version) return [];
  const rows = doc.ccdsMap?.version === version.v ? doc.ccdsMap.rows ?? {} : {};
  return version.statements.map((st) => {
    const m = autoMatch(doc, st);
    if (!m.applies) return null;
    const row = rows[st.key] ?? {};
    const status = row.status || (m.found ? 'aligned' : '');
    return { st, ...m, row, status, confirmed: !!row.status, justified: (row.justification ?? '').trim().length >= MIN_JUSTIFICATION };
  }).filter(Boolean);
}

// Issues for the checks list. Needs the project (for its CCDS).
export function coreIssues(doc, project, add) {
  if (!project?.ccds || !MAP_KINDS.includes(doc.kind) || doc.role === 'reference') return;
  const cur = currentVersion(project.ccds);
  if (!cur) return;
  const L = (key, label) => ({ area: 'core', key, label: `Core data sheet, ${label}` });
  const mappedTo = doc.ccdsMap?.version;
  if (!mappedTo) add('CORE-VERSION', L('version', 'mapping'), `This label has not been mapped to CCDS ${cur.v}.`, 'Open the Core data sheet tab and map the label.');
  else if (mappedTo !== cur.v) add('CORE-VERSION', L('version', 'mapping'), `This label is mapped to CCDS ${mappedTo}; the effective version is ${cur.v}.`, `Assess the label against ${cur.v} on the Core data sheet tab.`);
  const version = versionByV(project.ccds, mappedTo) ?? cur;
  for (const r of mappingRows(doc, version)) {
    const where = L(r.st.key, r.st.heading);
    const short = r.st.text.length > 80 ? `${r.st.text.slice(0, 80)}…` : r.st.text;
    if (r.status === 'deviates' || r.status === 'na') {
      if (!r.justified) add('CORE-DEV-JUST', where, `"${short}" is marked ${MAP_STATUS[r.status].toLowerCase()} without a justification.`, `Write the reason (at least ${MIN_JUSTIFICATION} characters).`);
    } else if (!r.found && r.status !== 'aligned') {
      add('CORE-MAP', where, `${r.st.ccsi ? 'Core safety statement' : 'CCDS statement'} not found in ${r.targets.join(', ')}: "${short}"`, 'Add it to the label, or mark it as a deviation with a justification.', r.st.ccsi ? 'error' : 'warning');
    } else if (!r.found && r.status === 'aligned') {
      add('CORE-MAP', where, `Marked aligned, but ${r.missingTerms.map((t) => `"${t.split('|')[0]}"`).join(', ')} not found in ${r.targets.join(', ')}.`, 'Check the label text, or change the status.', 'warning');
    }
  }
}

export function setRow(doc, version, key, patch) {
  if (!doc.ccdsMap || doc.ccdsMap.version !== version.v) {
    const keep = doc.ccdsMap?.rows ?? {};
    doc.ccdsMap = { version: version.v, rows: Object.fromEntries(Object.entries(keep).filter(([k]) => version.statements.some((s) => s.key === k))) };
  }
  doc.ccdsMap.rows[key] = { ...(doc.ccdsMap.rows[key] ?? {}), ...patch, at: new Date().toISOString() };
}

// Moves a label's mapping to a version, keeping rows for statements that are unchanged.
export function remap(doc, fromVersion, toVersion) {
  const old = doc.ccdsMap?.rows ?? {};
  const rows = {};
  for (const s of toVersion.statements) {
    const prev = fromVersion?.statements.find((x) => x.key === s.key);
    if (old[s.key] && prev && prev.text === s.text) rows[s.key] = old[s.key];
  }
  doc.ccdsMap = { version: toVersion.v, rows };
}

// What changed between two versions, and where in each label it lands.
export function impactOf(from, to, docs) {
  const out = [];
  const before = new Map((from?.statements ?? []).map((s) => [s.key, s]));
  const after = new Map(to.statements.map((s) => [s.key, s]));
  for (const s of to.statements) {
    const p = before.get(s.key);
    if (!p) out.push({ change: 'added', st: s });
    else if (p.text !== s.text || p.ccsi !== s.ccsi) out.push({ change: 'changed', st: s, prev: p });
  }
  for (const [k, p] of before) if (!after.has(k)) out.push({ change: 'removed', st: p });
  return out.map((x) => ({ ...x, labels: docs.filter((d) => MAP_KINDS.includes(d.kind) && d.role !== 'reference' && (x.st.targets?.[d.kind] ?? []).length).map((d) => ({ docId: d.id, title: d.title, kind: d.kind, targets: x.st.targets[d.kind] })) }));
}

// The deviation register across a project's labels.
export function deviationRegister(project, docs) {
  const cur = currentVersion(project.ccds);
  const out = [];
  for (const d of docs) {
    if (!MAP_KINDS.includes(d.kind) || d.role === 'reference') continue;
    const version = versionByV(project.ccds, d.ccdsMap?.version) ?? cur;
    for (const r of mappingRows(d, version)) {
      if (r.status === 'deviates' || r.status === 'na' || (!r.found && r.status !== 'aligned')) {
        out.push({ label: d.title, kind: d.kind, version: version.v, key: r.st.key, heading: r.st.heading, ccsi: r.st.ccsi, statement: r.st.text, status: r.status ? MAP_STATUS[r.status] : 'Missing (no decision)', justification: r.row.justification ?? '', where: r.targets.join(', ') });
      }
    }
  }
  return out;
}

const csvCell = (v) => { const s = String(v ?? ''); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const toCsv = (rows, cols) => [cols.map((c) => c[1]).join(','), ...rows.map((r) => cols.map((c) => csvCell(typeof c[0] === 'function' ? c[0](r) : r[c[0]])).join(','))].join('\n');
