// Drills: timed tasks scored by the check engine. A "rules" drill counts the open errors and
// warnings for the listed rules against the number in the untouched sample. The capstone checks
// a safety update from signal to approved labels.
import { runChecks } from './checks.js';
import { findSection, blocksText, hasContent } from './model.js';
import { monthIndex } from './text.js';
import { scoreMapping } from './convert.js';

const matches = (i, prefixes) => prefixes.some((p) => i.ruleId.startsWith(p)) && !i.waived && i.severity !== 'info';

export function evaluateDrill(drill, { docs, sample, pack, product, mapping }) {
  const g = drill.goal;
  if (g.type === 'rules') {
    const sDoc = sample.docs.find((d) => d.id === drill.doc);
    const doc = docs.find((d) => d.sampleDocId === drill.doc);
    const base = runChecks(sDoc, { pack, docs: sample.docs, product }).filter((i) => matches(i, g.prefixes)).length;
    const left = doc ? runChecks(doc, { pack, docs, product }).filter((i) => matches(i, g.prefixes)) : [];
    const score = base ? Math.max(0, Math.round((1 - left.length / base) * 100)) : 100;
    return { score, goals: [{ label: `Clear the ${base} starting findings (${left.length} left)`, done: left.length === 0 }], left };
  }
  if (g.type === 'convert') {
    const doc = docs.find((d) => d.sampleDocId === drill.doc);
    const r = scoreMapping(doc, mapping ?? doc?.mapping ?? {});
    return { score: r.score, goals: [{ label: `Map every block (${g.pass}% to pass)`, done: r.score >= g.pass }] };
  }
  if (g.type === 'capstone') {
    const pi = docs.find((d) => d.kind === 'pi');
    const mg = docs.find((d) => d.kind === 'mg');
    const kw = new RegExp(g.keyword, 'i');
    const s5 = pi && findSection(pi, g.section);
    const sub = s5?.subs?.find((x) => kw.test(x.title) || kw.test(blocksText(x.blocks)));
    const startRev = monthIndex(sample.docs.find((d) => d.kind === 'pi')?.meta?.revised);
    const rev = monthIndex(pi?.meta?.revised);
    const hlCites = sub && new RegExp(`\\(([\\d.,\\s]*\\b${sub.num.replace('.', '\\.')}\\b[\\d.,\\s]*)\\)`).test(blocksText(pi.hl?.wp));
    const rmc = sub && (pi.hl?.rmc ?? []).some((r) => r.num === sub.num && monthIndex(r.date) === rev);
    const mgItems = mg ? (mg.sections ?? []).flatMap((s) => blocksText(s.blocks).split('\n')) : [];
    const s17 = pi && findSection(pi, '17');
    const goals = [
      { label: `New Warnings and Precautions subsection on ${g.keyword}`, done: !!sub && hasContent(sub.blocks) },
      { label: 'Highlights Warnings and Precautions cite the new subsection', done: !!hlCites },
      { label: 'Recent Major Changes entry for it, dated with the revision date', done: !!rmc },
      { label: 'Revision date moved on from the previous label', done: rev !== null && startRev !== null && rev > startRev },
      { label: 'Medication Guide tells patients about the new risk', done: mgItems.some((x) => new RegExp(g.mgKeyword, 'i').test(x) && /cough/i.test(x)) },
      { label: 'Section 17 counsels patients about it', done: !!s17 && new RegExp(`${g.mgKeyword}|${g.keyword}`, 'i').test(blocksText(s17.blocks)) },
      { label: 'Prescribing information approved with no open findings', done: pi?.status === 'approved' },
      { label: 'Medication Guide approved with no open findings', done: mg?.status === 'approved' },
    ];
    return { score: Math.round((goals.filter((x) => x.done).length / goals.length) * 100), goals };
  }
  return { score: 0, goals: [] };
}
