// Word-level diff (longest common subsequence) for version comparison, reference-label
// comparison and the artwork proof check.
import { blocksText, sectionTitle } from './model.js';
import { FIELD_LABEL } from './model.js';

const tokens = (s) => String(s ?? '').split(/(\s+)/).filter((t) => t !== '');

// Returns [{ op: 'same' | 'del' | 'add', text }], merged into runs.
export function diffWords(a, b) {
  const A = tokens(a); const B = tokens(b);
  const n = A.length; const m = B.length;
  if (n * m > 4_000_000) return [{ op: 'del', text: a }, { op: 'add', text: b }];
  const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  const push = (op, text) => { const last = out[out.length - 1]; if (last && last.op === op) last.text += text; else out.push({ op, text }); };
  let i = 0; let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) { push('same', A[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { push('del', A[i]); i++; } else { push('add', B[j]); j++; }
  }
  while (i < n) push('del', A[i++]);
  while (j < m) push('add', B[j++]);
  return out;
}
export const changed = (parts) => parts.some((p) => p.op !== 'same');

// Flatten a label into comparable rows: one per section, Highlights heading, field or statement.
export function rowsOf(doc) {
  const rows = [];
  if (doc.kind === 'carton' || doc.kind === 'container') {
    for (const [k, v] of Object.entries(doc.fields ?? {})) rows.push({ key: `f:${k}`, label: FIELD_LABEL[k] ?? k, text: v ?? '' });
    rows.push({ key: 'sizes', label: 'Type sizes (pt)', text: Object.entries(doc.sizes ?? {}).map(([k, v]) => `${FIELD_LABEL[k] ?? k} ${v}`).join(', ') });
    rows.push({ key: 'codes', label: 'Codes', text: `${doc.barcode ? 'linear bar code' : 'no linear bar code'}; ${doc.twoD ? '2D data matrix' : 'no 2D code'}` });
    return rows;
  }
  const m = doc.meta ?? {};
  rows.push({ key: 'meta', label: 'Title and dates', text: `${m.proprietaryName} (${m.establishedName}) ${m.dosageForm}, ${m.route}. Initial U.S. Approval: ${m.initialApproval ?? ''}. Revised: ${m.revised ?? ''}` });
  if (doc.hl) {
    rows.push({ key: 'hl:lim', label: 'Highlights, limitation statement', text: doc.hl.limitation ?? '' });
    if (doc.hl.bw?.length) rows.push({ key: 'hl:bw', label: 'Highlights, boxed warning', text: `${blocksText(doc.hl.bw)}\n${doc.hl.bwClose ?? ''}` });
    rows.push({ key: 'hl:rmc', label: 'Highlights, Recent Major Changes', text: (doc.hl.rmc ?? []).map((r) => `${r.heading} (${r.num}) ${r.date}`).join('\n') });
    for (const [k, v] of Object.entries(doc.hl)) if (Array.isArray(v) && k !== 'bw' && k !== 'rmc') rows.push({ key: `hl:${k}`, label: `Highlights, ${k}`, text: blocksText(v) });
    rows.push({ key: 'hl:pci', label: 'Highlights, counselling statement', text: doc.hl.pci ?? '' });
  }
  if (doc.bw) rows.push({ key: 'bw', label: 'Boxed warning', text: `${doc.bw.title}\n${blocksText(doc.bw.blocks)}` });
  for (const s of doc.sections ?? []) {
    rows.push({ key: `s:${s.num}`, label: sectionTitle(s), text: `${s.title}\n${blocksText(s.blocks)}` });
    for (const x of s.subs ?? []) rows.push({ key: `s:${x.num}`, label: sectionTitle(x), text: `${x.title}\n${blocksText(x.blocks)}` });
  }
  if (doc.fixed) for (const [k, v] of Object.entries(doc.fixed)) rows.push({ key: `fx:${k}`, label: `Statement: ${k}`, text: v ?? '' });
  return rows;
}

// Compare two versions of a label. Each row: { key, label, status: same|changed|added|removed, parts }
export function compareDocs(a, b) {
  const ra = new Map(rowsOf(a).map((r) => [r.key, r]));
  const rb = new Map(rowsOf(b).map((r) => [r.key, r]));
  const keys = [...new Set([...ra.keys(), ...rb.keys()])];
  return keys.map((k) => {
    const x = ra.get(k); const y = rb.get(k);
    if (!x) return { key: k, label: y.label, status: 'added', parts: [{ op: 'add', text: y.text }] };
    if (!y) return { key: k, label: x.label, status: 'removed', parts: [{ op: 'del', text: x.text }] };
    const parts = diffWords(x.text, y.text);
    return { key: k, label: y.label, status: changed(parts) ? 'changed' : 'same', parts };
  });
}

// Artwork proof: approved carton fields against the printer's proof.
export function proofCheck(approved, proof) {
  return Object.keys({ ...approved, ...proof }).map((k) => {
    const parts = diffWords(approved[k] ?? '', proof[k] ?? '');
    return { key: k, label: FIELD_LABEL[k] ?? k, ok: !changed(parts), parts };
  });
}
