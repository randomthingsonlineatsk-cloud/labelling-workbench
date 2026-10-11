// Older-format (21 CFR 201.80) to PLR conversion exercise. The learner maps every block of
// the old label to a PLR section; the app scores the mapping and builds a PLR draft from it.
import { blankDoc, newBlock, uid, blockTexts } from './model.js';
import { templateFor } from './pack.js';

const FREE_SUB_TITLES = { '5.1': 'Warning or precaution 1 (rename)', '5.2': 'Warning or precaution 2 (rename)', '5.3': 'Warning or precaution 3 (rename)', '6.1': 'Clinical Trials Experience', '6.2': 'Postmarketing Experience', '14.1': 'Study 1 (rename)' };

export function targetOptions(pack) {
  const t = templateFor(pack, 'pi');
  const out = [];
  for (const s of t.sections) {
    if (s.fixedSubs) for (const x of s.fixedSubs) out.push({ value: x.num, label: `${x.num} ${x.title}` });
    else if (['5', '6'].includes(s.num)) Object.entries(FREE_SUB_TITLES).filter(([k]) => k.startsWith(`${s.num}.`)).forEach(([k, v]) => out.push({ value: k, label: `${k} ${v.replace(' (rename)', '')}` }));
    else out.push({ value: s.num, label: `${s.num} ${s.title}` });
  }
  return out;
}

export function oldBlocks(doc) {
  return (doc.sections ?? []).flatMap((s) => (s.blocks ?? []).map((b) => ({ id: b.id, from: s.title, text: blockTexts(b).join(' '), target: b.target ?? null })));
}

// Full mark when the PLR (sub)section matches; half when only the top-level section matches.
export function scoreMapping(doc, mapping) {
  const blocks = oldBlocks(doc).filter((b) => b.target);
  let pts = 0;
  const rows = blocks.map((b) => {
    const got = mapping[b.id] ?? '';
    const full = got === b.target;
    const half = !full && got && got.split('.')[0] === b.target.split('.')[0];
    pts += full ? 1 : half ? 0.5 : 0;
    return { ...b, got, mark: full ? 'right' : half ? 'close' : 'wrong' };
  });
  return { rows, score: blocks.length ? Math.round((pts / blocks.length) * 100) : 0 };
}

export function buildPlr(pack, oldDoc, mapping, product, projectId, user) {
  const t = templateFor(pack, 'pi');
  const doc = blankDoc(pack, 'pi', product, projectId, user);
  doc.title = 'Prescribing information (PLR draft from the older format)';
  doc.meta = { ...doc.meta, ...oldDoc.meta, revised: '' };
  const fixedTitle = Object.fromEntries(t.sections.flatMap((s) => (s.fixedSubs ?? []).map((x) => [x.num, x.title])));
  const filled = new Set();
  for (const b of oldBlocks(oldDoc)) {
    const target = mapping[b.id];
    if (!target) continue;
    const top = target.split('.')[0];
    let s = doc.sections.find((x) => x.num === top);
    if (!s) {
      const ts = t.sections.find((x) => x.num === top);
      s = { num: top, title: ts.title, blocks: [], subs: [] };
      doc.sections.push(s);
      doc.sections.sort((a, c) => Number(a.num) - Number(c.num));
    }
    let holder = s;
    if (target.includes('.')) {
      holder = s.subs.find((x) => x.num === target);
      if (!holder) { holder = { num: target, title: fixedTitle[target] ?? FREE_SUB_TITLES[target] ?? 'New subsection', blocks: [] }; s.subs.push(holder); s.subs.sort((a, c) => a.num.localeCompare(c.num, undefined, { numeric: true })); }
    }
    if (!filled.has(holder)) { holder.blocks = []; filled.add(holder); }
    holder.blocks.push({ ...newBlock('p'), id: uid('b'), text: b.text, note: `Moved from the older-format ${b.from} section.` });
  }
  return doc;
}
