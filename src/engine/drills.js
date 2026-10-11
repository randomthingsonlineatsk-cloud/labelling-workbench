// Drills: timed tasks scored by the check engine. A "rules" drill counts the open errors and
// warnings for the listed rules against the number in the untouched sample. The capstone checks
// a safety update from signal to approved labels.
import { runChecks } from './checks.js';
import { findSection, blocksText, hasContent } from './model.js';
import { monthIndex } from './text.js';
import { scoreMapping } from './convert.js';
import { currentVersion, versionByV, autoMatch } from './ccds.js';
import { satisfied, agreed } from './agency.js';
import { userTestResult } from './usertest.js';
import { translationFindings } from './checks-eu.js';

const matches = (i, prefixes) => prefixes.some((p) => i.ruleId.startsWith(p)) && !i.waived && i.severity !== 'info';

const score = (goals) => ({ score: goals.length ? Math.round((goals.filter((x) => x.done).length / goals.length) * 100) : 0, goals });
const coreErrors = (doc, ctx) => runChecks(doc, ctx).filter((i) => /^CORE-(MAP|DEV-JUST)$/.test(i.ruleId) && !i.waived && i.severity !== 'info');

export function evaluateDrill(drill, { docs, sample, pack, product, mapping, project }) {
  const g = drill.goal;
  const ctx = { pack, docs, product, project };
  if (g.type === 'ccds-map') {
    const cur = currentVersion(project?.ccds);
    const goals = [];
    for (const kind of g.docs) {
      const d = docs.find((x) => x.kind === kind);
      const label = kind === 'pi' ? 'prescribing information' : 'Medication Guide';
      const errs = d ? runChecks(d, ctx).filter((i) => i.ruleId.startsWith('CORE-') && i.ruleId !== 'CORE-AGENCY' && !i.waived && i.severity !== 'info') : [{}];
      goals.push({ label: `The ${label} is mapped to CCDS ${cur?.v ?? ''}`, done: !!d && d.ccdsMap?.version === cur?.v });
      goals.push({ label: `Every statement in the ${label} aligned or justified (${errs.length} open)`, done: !!d && d.ccdsMap?.version === cur?.v && errs.length === 0 });
    }
    return score(goals);
  }
  if (g.type === 'o4') {
    const ch = project?.changes?.find((c) => c.trigger === 'o4');
    const goals = [{ label: 'Response sent to FDA within the 30 days', done: !!ch?.o4?.respondedOn && !ch.o4.late }];
    for (const [kind, comments] of Object.entries(pack.agency?.[sample.id] ?? {})) {
      const d = docs.find((x) => x.sampleDocId === kind);
      for (const c of comments) if (c.expect && c.kind !== 'question') goals.push({ label: `${kind === 'pi' ? 'PI' : 'Medication Guide'}: ${c.where}`, done: !!d && satisfied(d, c) === true });
    }
    for (const kind of ['pi', 'mg']) { const d = docs.find((x) => x.sampleDocId === kind); goals.push({ label: `${kind === 'pi' ? 'Prescribing information' : 'Medication Guide'} agreed with the agency`, done: !!d && agreed(d) }); }
    return score(goals);
  }
  if (g.type === 'rollout') {
    const v = versionByV(project?.ccds, '4.0');
    const st = v?.statements.find((x) => x.key === g.key);
    const pi = docs.find((d) => d.kind === 'pi');
    const mg = docs.find((d) => d.kind === 'mg');
    const ch = (project?.changes ?? []).find((c) => c.ccdsVersion === '4.0');
    const us = ch?.markets.find((m) => m.market === 'us');
    const goals = [
      { label: 'CCDS 4.0 made effective', done: v?.status === 'effective' },
      { label: 'Change request for CCDS 4.0 covering the US, EU and India', done: !!ch && ['us', 'eu', 'in'].every((m) => ch.markets.some((x) => x.market === m)) },
      { label: 'Prescribing information covers hepatitis B screening and reactivation (2.2 and section 5)', done: !!pi && !!st && autoMatch(pi, st).found },
      { label: 'Medication Guide tells patients about hepatitis B', done: !!mg && !!st && autoMatch(mg, st).found },
      { label: 'Both labels mapped to CCDS 4.0 with no open gaps', done: [pi, mg].every((d) => d && d.ccdsMap?.version === '4.0' && coreErrors(d, ctx).length === 0) },
      { label: 'Prescribing information and Medication Guide approved', done: pi?.status === 'approved' && mg?.status === 'approved' && !!st && autoMatch(pi, st).found },
      { label: 'US approval date and first shipment recorded in the tracker', done: !!us?.dates?.Approved && !!us?.firstShip },
    ];
    return score(goals);
  }
  if (g.type === 'rules-multi') {
    const count = (list, dd) => list.reduce((n, d) => n + runChecks(d, { pack, docs: dd, product, project }).filter((i) => matches(i, g.prefixes)).length, 0);
    const base = count(sample.docs.filter((d) => g.docs.includes(d.id)), sample.docs);
    const mine = docs.filter((d) => g.docs.includes(d.sampleDocId));
    const left = count(mine, docs);
    return { score: base ? Math.max(0, Math.round((1 - left / base) * 100)) : 100, goals: g.docs.map((id) => { const d = docs.find((x) => x.sampleDocId === id); const n = d ? runChecks(d, { pack, docs, product, project }).filter((i) => matches(i, g.prefixes)).length : 1; return { label: `${d?.title ?? id}: ${n ? `${n} finding(s) left` : 'clear'}`, done: !n }; }) };
  }
  if (g.type === 'usertest') {
    const d = docs.find((x) => x.sampleDocId === drill.doc);
    const r = d ? userTestResult(d) : { perQuestion: [], passed: false, sameText: false };
    const rounds = d?.userTest?.rounds?.length ?? 0;
    const goals = [
      { label: 'At least one round run on the draft', done: rounds > 0 },
      ...r.perQuestion.map((p) => ({ label: `${p.id}: ${p.q} (${p.score ?? '-'} of 20)`, done: p.pass })),
      { label: 'Two final rounds on the same text', done: !!r.sameText },
    ];
    return score(goals);
  }
  if (g.type === 'translation') {
    const d = docs.find((x) => x.sampleDocId === drill.doc);
    const f = d ? translationFindings(d, { pack, docs, project }) : [{ rule: 'x' }];
    const by = (r) => f.filter((x) => x.rule === r).length;
    return score([
      { label: 'Every number matches the English', done: !!d && by('EU-TR-NUM') === 0 },
      { label: 'Approved terms from the term base used', done: !!d && by('EU-TR-TERM') === 0 },
      { label: 'Every section translated', done: !!d && by('EU-TR-MISS') === 0 },
      { label: 'Linguistic review comments answered and the translation agreed', done: !!d && agreed(d) },
    ]);
  }
  if (g.type === 'prac') {
    const smpc = docs.find((d) => d.kind === 'smpc'); const pl = docs.find((d) => d.kind === 'pl' && d.role !== 'translation');
    const t = (d, num) => (d ? [findSection(d, num)].filter(Boolean).flatMap((s) => [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))]).join('\n') : '');
    const ch = (project?.changes ?? []).find((c) => c.trigger === 'prac');
    const eu = ch?.markets.find((m) => m.market === 'eu');
    const s44 = /DRESS|eosinophilia/i.test(t(smpc, '4.4')) && /withdrawn|discontinu|stop/i.test(t(smpc, '4.4'));
    const s48 = /DRESS|eosinophilia/i.test(t(smpc, '4.8')) && /not known/i.test(t(smpc, '4.8'));
    const p2 = /DRESS|rash/i.test(t(pl, 'pl2')) && /temperature|fever/i.test(t(pl, 'pl2'));
    const p4 = /DRESS|drug hypersensitivity syndrome/i.test(t(pl, 'pl4'));
    return score([
      { label: 'SmPC 4.4: DRESS warning with the action to take', done: s44 },
      { label: 'SmPC 4.8: DRESS, frequency not known', done: s48 },
      { label: 'Leaflet section 2: warning signs and what to do', done: p2 },
      { label: 'Leaflet section 4: DRESS as a side effect', done: p4 },
      { label: 'SmPC and leaflet approved with the new wording', done: smpc?.status === 'approved' && pl?.status === 'approved' && s44 && p2 },
      { label: 'Variation classified in the tracker (EU)', done: !!eu?.classification?.trim() },
      { label: 'EU variation submitted before the deadline', done: !!eu?.dates?.Submitted && eu.dates.Submitted <= eu.deadline },
    ]);
  }
  if (g.type === 'directive') {
    const pi = docs.find((d) => d.kind === 'in-pi');
    const carton = docs.find((d) => d.kind === 'in-carton');
    const strip = docs.find((d) => d.kind === 'in-label');
    const t = (d, num) => (d ? [findSection(d, num)].filter(Boolean).flatMap((s) => [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))]).join('\n') : '');
    const startRev = t(sample.docs.find((d) => d.kind === 'in-pi'), '12').trim();
    const s44 = /IGRA|interferon[- ]gamma|tuberculin skin test|skin test|Mantoux/i.test(t(pi, '4.4')) && /chest X-?ray|chest radiograph/i.test(t(pi, '4.4'));
    const s9 = /tuberculosis|\bTB\b/i.test(t(pi, '9')) && /test|screen|X-?ray/i.test(t(pi, '9'));
    const rev = !!pi && t(pi, '12').trim() !== '' && t(pi, '12').trim() !== startRev;
    const h2 = (d) => !!d && hasContent(findSection(d, 'c16')?.blocks) && runChecks(d, ctx).filter((i) => i.ruleId === 'IN-H2' && !i.waived).length === 0;
    const price = (d, amount) => !!d && new RegExp(`(₹|Rs\\.?)\\s?${amount.replace(',', ',?')}(\\.00)?\\b`).test(t(d, 'c14')) && /inclusive of all taxes/i.test(t(d, 'c14'));
    const ch = (project?.changes ?? []).find((c) => c.trigger === 'cdsco');
    const inm = ch?.markets.find((m) => m.market === 'in');
    return score([
      { label: 'Package insert 4.4: screening with IGRA or a tuberculin skin test, and a chest X-ray', done: s44 },
      { label: 'Package insert section 9: patients told about tuberculosis screening', done: s9 },
      { label: 'Package insert date of revision moved on', done: rev },
      { label: 'Carton: QR code with every Schedule H2 data element', done: h2(carton) },
      { label: 'Strip: QR code with every Schedule H2 data element', done: h2(strip) },
      { label: 'Carton MRP ₹ 3,600.00, inclusive of all taxes', done: price(carton, '3,600') },
      { label: 'Strip MRP ₹ 1,200.00, inclusive of all taxes', done: price(strip, '1,200') },
      { label: 'Insert, carton and strip approved with the changes', done: [pi, carton, strip].every((d) => d?.status === 'approved') && s44 && h2(carton) && price(strip, '1,200') },
      { label: 'Change classified in the tracker (India)', done: !!inm?.classification?.trim() },
      { label: 'Submitted to CDSCO before the deadline', done: !!inm?.dates?.Submitted && inm.dates.Submitted <= inm.deadline },
    ]);
  }
  if (g.type === 'rollout-intl') {
    const ILD = /interstitial lung disease|pneumonitis/i;
    const by = (k) => docs.find((d) => d.kind === k);
    const orig = (k) => sample.docs.find((d) => d.kind === k);
    const t = (d, ...nums) => (d ? nums.map((n) => findSection(d, n)).filter(Boolean).flatMap((s) => [blocksText(s.blocks), ...(s.subs ?? []).map((x) => blocksText(x.blocks))]).join('\n') : '');
    const [ca, ch, jp, au, cmi] = ['ca-pm', 'ch-fi', 'jp-pi', 'au-pi', 'au-cmi'].map(by);
    const caDone = ILD.test(t(ca, '7')) && ILD.test(t(ca, '8.5'));
    const caRev = !!ca && ca.meta?.revised !== orig('ca-pm')?.meta?.revised && /^\d{4}-\d{2}-\d{2}$/.test(ca.meta?.revised ?? '');
    const caRmlc = !!ca && (findSection(ca, 'rmlc')?.blocks ?? []).some((b) => b.t === 'table' && b.rows.some((r) => /^7\b/.test(String(r[0]).trim()) && String(r[1]).trim() === String(ca.meta?.revised ?? '').slice(0, 7)));
    const chDone = ILD.test(t(ch, 'f6')) && ILD.test(t(ch, 'f10'));
    const chRev = !!ch && t(ch, 'f19').trim() !== t(orig('ch-fi'), 'f19').trim();
    const jpDone = ILD.test(t(jp, '8')) && ILD.test(t(jp, '11'));
    const jpRev = !!jp && (jp.fixed?.revised ?? '') !== (orig('jp-pi')?.fixed?.revised ?? '') && /20\d{2}/.test(jp.fixed?.revised ?? '');
    const auDone = ILD.test(t(au, '4.4')) && ILD.test(t(au, '4.8'));
    const auRev = !!au && t(au, '10').trim() !== t(orig('au-pi'), '10').trim();
    const cmiDone = /lung|breath/i.test(t(cmi, '6')) && /cough/i.test(t(cmi, '6')) && t(cmi, '6') !== t(orig('au-cmi'), '6');
    const ch2 = (project?.changes ?? []).find((c) => c.trigger === 'signal');
    const mk = (id) => ch2?.markets.find((m) => m.market === id);
    const markets = ['ca', 'ch', 'jp', 'au'];
    return score([
      { label: 'Canada: section 7 (Respiratory) and 8.5 Post-Market Adverse Reactions cover ILD', done: caDone },
      { label: 'Canada: revision date moved on and a Recent Major Label Changes entry for section 7 dated that month', done: caRev && caRmlc },
      { label: 'Switzerland: Warnhinweise und Vorsichtsmassnahmen and Unerwünschte Wirkungen cover ILD; Stand der Information updated', done: chDone && chRev },
      { label: 'Japan: 8 Important Precautions and 11 Adverse Reactions cover ILD; revision date updated', done: jpDone && jpRev },
      { label: 'Australia: PI 4.4 and 4.8 cover ILD; date of revision updated', done: auDone && auRev },
      { label: 'Australia: CMI section 6 tells patients about cough and breathlessness', done: cmiDone },
      { label: 'All five documents approved with the new wording', done: [ca, ch, jp, au, cmi].every((d) => d?.status === 'approved') && caDone && chDone && jpDone && auDone && cmiDone },
      { label: 'Change classified in the tracker for Canada, Switzerland, Japan and Australia', done: markets.every((m) => !!mk(m)?.classification?.trim()) },
      { label: 'Submitted in all four markets before the deadline', done: markets.every((m) => !!mk(m)?.dates?.Submitted && mk(m).dates.Submitted <= mk(m).deadline) },
    ]);
  }
  if (g.type === 'pmi') {
    const d = docs.find((x) => x.kind === 'pmi');
    const issues = d ? runChecks(d, ctx).filter((i) => i.ruleId.startsWith('US-PMI-') && i.severity !== 'info' && !i.waived) : [];
    const by = (id) => issues.filter((i) => i.ruleId === id).length;
    const goals = [
      { label: 'Every proposed heading, filled', done: !!d && by('US-PMI-HEAD') === 0 },
      { label: 'Every boxed warning risk under Warnings', done: !!d && by('US-PMI-BW') === 0 },
      { label: 'Directions for Use start with "Use exactly as prescribed."', done: !!d && by('US-PMI-USE') === 0 && /use exactly as prescribed/i.test(JSON.stringify(d.sections)) },
      { label: 'Fits on one page', done: !!d && by('US-PMI-HEAD') === 0 && by('US-PMI-LEN') === 0 },
      { label: 'No promotional words', done: !!d && by('US-PMI-HEAD') === 0 && by('US-PMI-PROMO') === 0 },
    ];
    return score(goals);
  }
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
