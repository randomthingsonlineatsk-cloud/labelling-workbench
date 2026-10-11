// Labelling change requests: what started the change, which markets it reaches, each market's
// deadline and status, the 505(o)(4) clock when FDA started it, and implementation dates.
// project.changes = [change]. Market rows use the same steps as the Variations Classifier's
// labelling rollout, so a rollout can move between the two apps.
import { uid, now } from './model.js';

export const addDays = (date, n) => { if (!date) return ''; const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
export const daysBetween = (a, b) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);
export const today = () => new Date().toISOString().slice(0, 10);
export const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s ?? '') && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

const STEP_DATE = ['', 'Wording drafted', 'Submitted', 'Approved', 'Implemented'];

export function isSafety(core, change) {
  const k = core.kinds.find((x) => x.id === change.kind);
  const t = core.triggers.find((x) => x.id === change.trigger);
  return t?.safety ?? k?.safety ?? false;
}

export function marketRow(core, change, market) {
  // A PRAC recommendation (or a sample) can set its own deadline in days.
  const days = change.deadlineDays ?? (isSafety(core, change) ? core.targets.submitDays.safety : core.targets.submitDays.other);
  return { market, step: 0, dates: {}, deadline: addDays(change.startDate, change.trigger === 'o4' && market === 'us' ? core.targets.o4.respond : days), classification: '', firstShip: '', oldStockOut: '', note: '' };
}

export function newChange(core, { trigger, kind, title, text = '', ccdsVersion = '', startDate, markets = ['us'], notice = null, statements = [], docIds = [], user = null, deadlineDays = null }) {
  if (!isDate(startDate)) throw new Error('Give the start date as yyyy-mm-dd.');
  const c = { id: uid('c'), trigger, kind, title: title || core.kinds.find((k) => k.id === kind)?.label || 'Labelling change', text, ccdsVersion, startDate, statements, docIds, notice, deadlineDays: deadlineDays ?? null, createdAt: now(), userId: user?.userId ?? null, classId: user?.classId ?? null, markets: [], o4: null, log: [] };
  c.markets = markets.map((m) => marketRow(core, c, m));
  if (trigger === 'o4') c.o4 = { notifiedOn: startDate, dueOn: addDays(startDate, core.targets.o4.respond), response: '', respondedOn: '', reasons: '' };
  return c;
}

export function setStep(core, change, market, step, date) {
  const m = change.markets.find((x) => x.market === market);
  if (!m) return;
  if (!isDate(date)) throw new Error('Give the date as yyyy-mm-dd.');
  m.step = step;
  for (let i = 1; i <= step; i++) if (!m.dates[STEP_DATE[i]]) m.dates[STEP_DATE[i]] = date;
  for (let i = step + 1; i < STEP_DATE.length; i++) delete m.dates[STEP_DATE[i]];
  if (step >= 3) {
    m.shipTarget = addDays(m.dates.Approved, core.targets.shipDays);
    m.stockOutTarget = addDays(m.dates.Approved, core.targets.stockOutDays);
  }
  if (step >= 4 && !m.firstShip) m.firstShip = m.dates.Implemented;
}

// The 505(o)(4) response: a supplement with proposed changes, or a rebuttal with reasons.
export function respondO4(core, change, { response, date, reasons = '' }) {
  if (!change.o4) throw new Error('This change was not started by a 505(o)(4) notification.');
  if (!['supplement', 'rebuttal'].includes(response)) throw new Error('Choose a supplement or a rebuttal.');
  if (!isDate(date)) throw new Error('Give the date as yyyy-mm-dd.');
  if (response === 'rebuttal' && reasons.trim().length < 40) throw new Error('A rebuttal needs your reasons (at least 40 characters).');
  change.o4 = { ...change.o4, response, respondedOn: date, reasons, late: date > change.o4.dueOn };
  if (response === 'rebuttal') {
    // FDA disagrees with the (fictional) rebuttal: discussions, then an order.
    change.o4.discussUntil = addDays(date, core.targets.o4.discuss);
    change.o4.orderBy = addDays(change.o4.discussUntil, core.targets.o4.order);
    change.o4.fdaView = 'FDA reviewed the rebuttal and does not agree that no change is warranted: the postmarketing cases are consistent with a causal association. Discussions are open; if agreement is not reached FDA may order the change.';
  }
  return change.o4;
}

export function o4Clock(change, on = today()) {
  if (!change.o4) return null;
  const o = change.o4;
  if (o.respondedOn) return { done: true, late: o.late, text: `${o.response === 'supplement' ? 'Supplement' : 'Rebuttal'} sent ${o.respondedOn}${o.late ? ` (${daysBetween(o.dueOn, o.respondedOn)} days late)` : ', on time'}.` };
  const left = daysBetween(on, o.dueOn);
  return { done: false, late: left < 0, left, text: left >= 0 ? `${left} day(s) left to respond (due ${o.dueOn}).` : `Response overdue by ${-left} day(s) (due ${o.dueOn}).` };
}

// Tracker rows with lateness flags.
export function trackerRows(core, change, on = today()) {
  return change.markets.map((m) => {
    const label = core.markets.find((x) => x.id === m.market)?.label ?? m.market;
    const submitted = m.dates.Submitted;
    const lateSubmit = submitted ? submitted > m.deadline : on > m.deadline;
    const lateShip = m.shipTarget && !m.firstShip && on > m.shipTarget;
    const lateStock = m.stockOutTarget && !m.oldStockOut && on > m.stockOutTarget;
    return { ...m, label, status: core.statuses[m.step], lateSubmit: lateSubmit && m.step < 2 ? 'overdue' : submitted && lateSubmit ? 'late' : '', lateShip, lateStock, done: m.step >= 4 && !!m.oldStockOut };
  });
}

// ---------------------------------------------------------------- hand-off to the classifier
export const CCDS_CHANGE_KIND = 'labelling-workbench/ccds-change';
export const ROLLOUT_KIND = 'variations-classifier/ccds-rollout';

export function classifierFile({ change, product, project, user }) {
  return {
    kind: CCDS_CHANGE_KIND, schema: 1, createdAt: now(),
    notice: 'Training only. Fictional product and company; not regulatory advice.',
    app: { name: 'Labelling Workbench', author: 'Khan Gulrez Shagufa Fazal Ahmed' },
    userId: user?.userId ?? null, classId: user?.classId ?? null,
    changeId: change.id, projectId: project?.id ?? null,
    product: { id: product.id, brandName: product.brandName, inn: product.inn },
    ccds: { version: change.ccdsVersion || '', date: change.startDate, kind: change.kind, text: change.text || change.title },
    trigger: change.trigger,
    regions: change.markets.map((m) => m.market),
    status: Object.fromEntries(change.markets.map((m) => [m.market, { step: m.step, dates: m.dates }])),
  };
}

// Reads a rollout file exported by the Variations Classifier and updates the matching markets.
export function applyRolloutFile(core, change, text) {
  let d;
  try { d = typeof text === 'string' ? JSON.parse(text) : text; } catch { throw new Error('This file is not valid JSON.'); }
  if (d?.kind !== ROLLOUT_KIND) throw new Error('This is not a rollout file from the Variations Classifier.');
  if (d.schema > 1) throw new Error('This file was made by a newer version of the Variations Classifier.');
  const notes = [];
  for (const r of d.regions ?? []) {
    let m = change.markets.find((x) => x.market === r.region);
    if (!m) { m = marketRow(core, change, r.region); change.markets.push(m); notes.push(`Added ${r.region.toUpperCase()}.`); }
    if (r.classification) m.classification = r.classification;
    if (Number.isInteger(r.step) && r.step > m.step) { m.step = r.step; m.dates = { ...r.dates, ...m.dates }; }
  }
  change.log.push({ at: now(), text: `Rollout file imported from the Variations Classifier (${(d.regions ?? []).length} market(s)).` });
  return notes;
}

// The change request a sample starts with. Its notification arrived three days before the sample
// is opened, so a 505(o)(4) clock is already running.
export function sampleChange(core, sample, docs, user, on = today()) {
  if (!sample.change) return null;
  const start = addDays(on, -3);
  return newChange(core, { ...sample.change, notice: sample.change.notice ? { ...sample.change.notice, date: start } : null, startDate: start, docIds: docs.filter((d) => ['pi', 'mg', 'smpc', 'pl', 'in-pi', 'in-carton', 'in-label', 'ca-pm', 'ca-pmi', 'ch-fi', 'ch-pi', 'jp-pi', 'au-pi', 'au-cmi', 'who-smpc'].includes(d.kind) && d.role !== 'translation').map((d) => d.id), user });
}
