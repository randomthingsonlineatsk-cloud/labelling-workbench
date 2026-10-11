// Agency comment rounds. Draft labelling is "submitted"; scripted agency comments come back;
// the user accepts, partly accepts or declines each one; the response goes back and either the
// agency follows up on what it did not accept, or the labelling is agreed.
// doc.agency = { rounds: [{ n, sentOn, comments: [...], respondedOn }], agreedOn }
import { findSection, blocksText } from './model.js';
import { targetText } from './ccds.js';

export const DECISIONS = { accept: 'Accept', partial: 'Partly accept', decline: 'Decline', answer: 'Answer' };
export const MIN_REPLY = 15;

export const scriptFor = (pack, project, doc) => pack.agency?.[project?.sampleId]?.[doc.sampleDocId] ?? null;
export const openRound = (doc) => { const r = doc.agency?.rounds?.at(-1); return r && !r.respondedOn ? r : null; };
export const agreed = (doc) => !!doc.agency?.agreedOn;

// Where an "expect" looks: a section (a top-level number includes its subsections), a
// Highlights key, or the whole label.
function areaText(doc, e) {
  if (e.area === 'hl') return e.key === 'rmc' ? (doc.hl?.rmc ?? []).map((r) => `${r.heading} ${r.num} ${r.date}`).join('\n') : blocksText(doc.hl?.[e.key]);
  if (e.area === 'sec') return /^\d+$/.test(e.num) || /^m\d+$/.test(e.num) || /^p\d+$/.test(e.num) ? targetText(doc, e.num) : blocksText(findSection(doc, e.num)?.blocks);
  return JSON.stringify(doc.sections ?? []);
}

const re = (t) => new RegExp(t, 'i');

// Is the text change the comment asks for in the label? null when the comment asks for nothing.
export function satisfied(doc, c) {
  const e = c.expect;
  if (!e) return null;
  const text = areaText(doc, e);
  if (e.area === 'hl' && e.key === 'rmc') return (doc.hl?.rmc ?? []).length > 0;
  const all = (e.all ?? []).every((t) => re(t).test(text));
  const none = (e.none ?? []).every((t) => !re(t).test(text));
  return all && none;
}

// Problems that stop the response being sent.
export function responseProblems(doc, round) {
  const out = [];
  for (const c of round.comments) {
    if (!c.decision) { out.push({ id: c.id, msg: 'No decision yet.' }); continue; }
    if ((c.decision === 'decline' || c.decision === 'partial' || c.decision === 'answer') && (c.reply ?? '').trim().length < MIN_REPLY) out.push({ id: c.id, msg: `Write the ${c.decision === 'answer' ? 'answer' : 'reason'} (at least ${MIN_REPLY} characters).` });
    if (c.decision === 'accept' && satisfied(doc, c) === false) out.push({ id: c.id, msg: 'Accepted, but the label text does not show the change yet.' });
  }
  return out;
}

export function submitDraft(doc, script, date) {
  if (doc.agency?.rounds?.length) throw new Error('This label has already been submitted.');
  doc.agency = { rounds: [{ n: 1, sentOn: date, comments: script.map((c) => ({ ...c, decision: '', reply: '' })), respondedOn: '' }], agreedOn: '' };
  return doc.agency.rounds[0];
}

// Sends the response. Declines with a scripted follow-up, and partial accepts where the change
// is not in the text, come back in the next round; otherwise the labelling is agreed.
export function sendResponse(doc, date) {
  const round = openRound(doc);
  if (!round) throw new Error('There is no open round.');
  const problems = responseProblems(doc, round);
  if (problems.length) throw new Error(`${problems.length} comment(s) still need attention.`);
  round.respondedOn = date;
  const follow = [];
  for (const c of round.comments) {
    if (c.decision === 'decline' && c.ifDeclined) follow.push({ ...c, id: `${c.id}-r${round.n + 1}`, text: c.ifDeclined, ifDeclined: c.ifDeclined, decision: '', reply: '', previous: c.reply });
    else if (c.decision === 'partial' && satisfied(doc, c) === false) follow.push({ ...c, id: `${c.id}-r${round.n + 1}`, text: `We have reviewed your response ("${(c.reply ?? '').slice(0, 120)}"). The change is still not in the labeling: ${c.text}`, decision: '', reply: '', previous: c.reply });
  }
  if (follow.length) doc.agency.rounds.push({ n: round.n + 1, sentOn: date, comments: follow, respondedOn: '' });
  else doc.agency.agreedOn = date;
  return { agreed: !follow.length, followUps: follow.length };
}

export function agencyIssues(doc, add) {
  const r = openRound(doc);
  if (!r) return;
  const left = r.comments.filter((c) => !c.decision).length;
  add('CORE-AGENCY', { area: 'agency', key: `r${r.n}`, label: `Agency comments, round ${r.n}` }, left ? `${left} of ${r.comments.length} agency comments in round ${r.n} have no response.` : `The response to round ${r.n} has not been sent.`, 'Answer every comment on the Agency comments tab and send the response.');
}

export const responseTable = (doc) => (doc.agency?.rounds ?? []).flatMap((r) => r.comments.map((c) => ({ round: r.n, id: c.id, where: c.where, comment: c.text, decision: DECISIONS[c.decision] ?? '', reply: c.reply ?? '', inText: satisfied(doc, c) === null ? '' : satisfied(doc, c) ? 'Yes' : 'No', sentOn: r.sentOn, respondedOn: r.respondedOn })));
