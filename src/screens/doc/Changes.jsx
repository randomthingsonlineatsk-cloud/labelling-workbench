import React, { useRef, useState } from 'react';
import { useApp, go } from '../../ctx.js';
import { newChange, setStep, respondO4, o4Clock, trackerRows, classifierFile, applyRolloutFile, today, isDate, marketRow } from '../../engine/changes.js';
import { labellingPackage } from '../../engine/handoff.js';
import { toCsv, currentVersion } from '../../engine/ccds.js';
import { download, slug, readFile } from '../../engine/io.js';
import { RuleCard, StatusPill } from '../../components/ui.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));
const CLASSIFIER = 'https://randomthingsonlineatsk-cloud.github.io/variations-classifier/';
const ECTD = 'https://randomthingsonlineatsk-cloud.github.io/ectd-dossier-builder/';

export default function Changes({ project, docs, product, focus }) {
  const { pack, saveProject, toast, user } = useApp();
  const core = pack.core;
  const changes = project.changes ?? [];
  const [sel, setSel] = useState(() => focus?.change ?? changes.at(-1)?.id ?? null);
  const [creating, setCreating] = useState(!changes.length);
  const c = changes.find((x) => x.id === sel);
  const mutate = async (fn, msg) => { const p = clone(project); const ch = p.changes.find((x) => x.id === sel); try { fn(ch, p); } catch (e) { toast(e.message, 'error'); return; } await saveProject(p); if (msg) toast(msg); };

  return (
    <div style={{ maxWidth: 1150 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>Changes and implementation</h2>
          <p className="small muted" style={{ margin: 0 }}>Each labelling change, its markets, deadlines and implementation. Submit and implementation targets are training defaults (safety {core.targets.submitDays.safety} days, other {core.targets.submitDays.other} days to submit; first shipment {core.targets.shipDays} days and old stock out {core.targets.stockOutDays} days after approval). Real companies set their own.</p>
        </div>
        <button className="btn small" onClick={() => setCreating(true)}>New change request</button>
      </div>

      {changes.length > 0 && (
        <div className="seg" role="group" aria-label="Change requests" style={{ margin: '.75rem 0', flexWrap: 'wrap' }}>
          {changes.map((x) => <button key={x.id} aria-pressed={x.id === sel && !creating} onClick={() => { setSel(x.id); setCreating(false); }}>{x.title.slice(0, 48)}{x.title.length > 48 ? '…' : ''}</button>)}
        </div>
      )}

      {creating && <NewChange project={project} docs={docs} onCancel={changes.length ? () => setCreating(false) : null} onCreate={async (ch) => { await saveProject({ ...clone(project), changes: [...changes, ch] }); setSel(ch.id); setCreating(false); toast('Change request created.'); }} />}

      {!creating && c && (
        <>
          <div className="panel" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>{c.title}</h3>
            <p className="small" style={{ margin: '.2rem 0' }}>{core.triggers.find((t) => t.id === c.trigger)?.label} · {core.kinds.find((k) => k.id === c.kind)?.label}{c.ccdsVersion ? ` · CCDS ${c.ccdsVersion}` : ''} · started {c.startDate}</p>
            {c.text && <p className="small muted" style={{ margin: '.2rem 0' }}>{c.text}</p>}
            <p className="small" style={{ margin: '.4rem 0 0' }}>Labels: {(c.docIds ?? []).map((id) => docs.find((d) => d.id === id)).filter(Boolean).map((d) => <a key={d.id} href={`#/p/${project.id}/${d.id}/edit`} style={{ marginRight: '.6rem' }}>{d.title} <StatusPill status={d.status} /></a>)}{!(c.docIds ?? []).length && 'none linked'}</p>
          </div>
          {c.o4 && <O4Panel c={c} core={core} mutate={mutate} pack={pack} />}
          <Tracker c={c} core={core} mutate={mutate} />
          <div className="cat-grid" style={{ marginTop: '1rem' }}>
            <div className="card">
              <h3>Classify it in the Variations Classifier</h3>
              <p className="small">Download the change for the classifier's labelling rollout, then bring its rollout file back here to fill in the classification and status of each market.</p>
              <div className="row">
                <button className="btn small primary" onClick={() => download(`${slug(c.title)}.ccds-change.json`, JSON.stringify(classifierFile({ change: c, product, project, user }), null, 1))}>Download change file</button>
                <RolloutImport onText={(text) => mutate((ch) => { const notes = applyRolloutFile(core, ch, text); if (notes.length) toast(notes.join(' ')); }, 'Rollout file imported.')} />
              </div>
              <a className="small" href={CLASSIFIER} target="_blank" rel="noreferrer">Open the Variations Classifier</a>
            </div>
            <div className="card">
              <h3>Labelling package for the eCTD</h3>
              <p className="small">The linked labels for US Module 1.14 (draft or final by status), with a manifest. The eCTD Dossier Builder imports it into a labeling supplement.</p>
              <button className="btn small" onClick={() => { const ds = (c.docIds ?? []).map((id) => docs.find((d) => d.id === id)).filter(Boolean); download(`${slug(product.brandName)}-labelling-package.json`, JSON.stringify(labellingPackage({ project, docs: ds.length ? ds : docs, product, pack, user, change: c }), null, 1)); }}>Download package</button>
              <a className="small" href={ECTD} target="_blank" rel="noreferrer">Open the eCTD Dossier Builder</a>
            </div>
            <div className="card">
              <h3>Tracker as CSV</h3>
              <p className="small">One row per market with the status, dates and flags.</p>
              <button className="btn small" onClick={() => download(`${slug(c.title)}-tracker.csv`, toCsv(trackerRows(core, c), [['label', 'Market'], ['status', 'Status'], ['deadline', 'Submit by'], [(r) => r.dates.Submitted ?? '', 'Submitted'], [(r) => r.dates.Approved ?? '', 'Approved'], ['classification', 'Classification'], ['shipTarget', 'First shipment target'], ['firstShip', 'First shipment'], ['stockOutTarget', 'Old stock out target'], ['oldStockOut', 'Old stock out'], [(r) => [r.lateSubmit, r.lateShip ? 'ship late' : '', r.lateStock ? 'stock late' : ''].filter(Boolean).join('; '), 'Flags']]), 'text/csv')}>Download CSV</button>
            </div>
          </div>
          {(c.log ?? []).length > 0 && <><h3>Log</h3><ul className="small">{c.log.map((l, i) => <li key={i}>{l.at.slice(0, 10)}: {l.text}</li>)}</ul></>}
          <button className="btn small danger ghost" style={{ marginTop: '1rem' }} onClick={async () => { if (window.confirm('Delete this change request?')) { await saveProject({ ...clone(project), changes: changes.filter((x) => x.id !== c.id) }); setSel(changes.find((x) => x.id !== c.id)?.id ?? null); } }}>Delete change request</button>
        </>
      )}
    </div>
  );
}

function RolloutImport({ onText }) {
  const ref = useRef(null);
  return (<>
    <button className="btn small" onClick={() => ref.current?.click()}>Import rollout file</button>
    <input ref={ref} type="file" accept=".json,application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) onText(await readFile(f)); e.target.value = ''; }} />
  </>);
}

function NewChange({ project, docs, onCancel, onCreate }) {
  const { pack, toast, user } = useApp();
  const core = pack.core;
  const cur = currentVersion(project.ccds);
  const [f, setF] = useState({ trigger: 'signal', kind: 'warning', title: '', text: '', startDate: today(), markets: [project.region === 'eu' ? 'eu' : 'us'], ccdsVersion: cur?.v ?? '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (m) => setF({ ...f, markets: f.markets.includes(m) ? f.markets.filter((x) => x !== m) : [...f.markets, m] });
  const create = () => {
    try { onCreate(newChange(core, { ...f, ccdsVersion: f.trigger === 'ccds' ? f.ccdsVersion : '', docIds: docs.filter((d) => d.role !== 'reference' && ['pi', 'mg', 'ppi', 'ifu', 'pmi'].includes(d.kind)).map((d) => d.id), notice: f.trigger === 'o4' ? { from: 'FDA (fictional)', date: f.startDate, title: 'Safety labeling change notification under section 505(o)(4)', text: f.text } : null, user })); }
    catch (e) { toast(e.message, 'error'); }
  };
  return (
    <form className="panel grid-2" onSubmit={(e) => { e.preventDefault(); create(); }} aria-label="New change request" style={{ marginBottom: '1rem' }}>
      <label className="field">What started it<select value={f.trigger} onChange={set('trigger')}>{core.triggers.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</select></label>
      <label className="field">Kind of change<select value={f.kind} onChange={set('kind')}>{core.kinds.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}</select></label>
      <label className="field">Title<input type="text" value={f.title} onChange={set('title')} placeholder="for example: Photosensitivity warning" /></label>
      <label className="field">{f.trigger === 'o4' ? 'Notification date' : 'Start date'}<input type="text" inputMode="numeric" value={f.startDate} onChange={set('startDate')} placeholder="yyyy-mm-dd" /></label>
      {f.trigger === 'ccds' && <label className="field">CCDS version<input type="text" value={f.ccdsVersion} onChange={set('ccdsVersion')} /></label>}
      <label className="field" style={{ gridColumn: '1 / -1' }}>{f.trigger === 'o4' ? 'What FDA said (fictional)' : 'Core wording or summary (fictional)'}<textarea rows={2} value={f.text} onChange={set('text')} /></label>
      <fieldset style={{ gridColumn: '1 / -1', border: 0, padding: 0 }}>
        <legend className="small" style={{ fontWeight: 600 }}>Markets</legend>
        <div className="row">{core.markets.map((m) => <label key={m.id} className="row small"><input type="checkbox" checked={f.markets.includes(m.id)} onChange={() => toggle(m.id)} /> {m.label}{m.pack ? '' : ' (tracking only)'}</label>)}</div>
      </fieldset>
      <div className="row"><button className="btn primary" type="submit" disabled={!f.markets.length || !isDate(f.startDate)}>Create</button>{onCancel && <button className="btn ghost" type="button" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}

function O4Panel({ c, core, mutate, pack }) {
  const [r, setR] = useState({ response: 'supplement', date: today(), reasons: '' });
  const clock = o4Clock(c);
  const o = c.o4;
  return (
    <div className="panel" style={{ marginBottom: '1rem', borderColor: clock.late ? 'var(--high)' : undefined }}>
      <h3 style={{ marginTop: 0 }}>505(o)(4) notification</h3>
      {c.notice && <><p className="small" style={{ margin: '.2rem 0' }}><b>{c.notice.title}</b> · {c.notice.from} · {o.notifiedOn}</p><p className="small">{c.notice.text}</p>{c.notice.sections && <p className="small muted">Sections named: {c.notice.sections.join('; ')}.</p>}</>}
      <p style={{ fontWeight: 700, color: clock.late ? 'var(--high)' : 'var(--ink)' }} aria-live="polite">{clock.text}</p>
      <RuleCard pack={pack} id="CORE-AGENCY" />
      {!o.respondedOn ? (
        <div className="stack">
          <div className="row" role="radiogroup" aria-label="Response">
            <label className="row small"><input type="radio" name="o4r" checked={r.response === 'supplement'} onChange={() => setR({ ...r, response: 'supplement' })} /> Supplement with the proposed labelling changes</label>
            <label className="row small"><input type="radio" name="o4r" checked={r.response === 'rebuttal'} onChange={() => setR({ ...r, response: 'rebuttal' })} /> Rebuttal: no change is warranted</label>
          </div>
          {r.response === 'rebuttal' && <label className="field">Your reasons<textarea rows={3} value={r.reasons} onChange={(e) => setR({ ...r, reasons: e.target.value })} /></label>}
          <div className="row" style={{ alignItems: 'end' }}>
            <label className="field">Date sent<input type="text" inputMode="numeric" value={r.date} onChange={(e) => setR({ ...r, date: e.target.value })} /></label>
            <button className="btn primary" onClick={() => mutate((ch) => respondO4(core, ch, r), r.response === 'supplement' ? 'Supplement recorded. Submit the draft labelling on the Agency comments tab.' : 'Rebuttal recorded.')}>Record the response</button>
          </div>
          <p className="small muted">A supplement means drafting the new labelling now: start a new version of each label, make the changes, then submit them on the Agency comments tab.</p>
        </div>
      ) : (
        <div className="small">
          {o.response === 'rebuttal' && <><div className="callout warn" style={{ margin: '.4rem 0' }}>{o.fdaView}</div><p>Discussions until {o.discussUntil}; FDA may order the change by {o.orderBy}, after which you have {core.targets.o4.afterOrder} days to submit. To move on, record a supplement instead.</p><button className="btn small" onClick={() => mutate((ch) => { ch.o4 = { ...ch.o4, respondedOn: '', response: '', reasons: '' }; ch.log.push({ at: new Date().toISOString(), text: 'Rebuttal withdrawn after discussions; supplement to follow.' }); })}>Withdraw the rebuttal</button></>}
        </div>
      )}
    </div>
  );
}

function Tracker({ c, core, mutate }) {
  const rows = trackerRows(core, c);
  const [dates, setDates] = useState({});
  const [add, setAdd] = useState('');
  const missing = core.markets.filter((m) => !c.markets.some((x) => x.market === m.id));
  return (
    <div>
      <div className="section-head"><h3 style={{ margin: 0 }}>Markets</h3>
        {missing.length > 0 && <span className="row small"><select aria-label="Add market" value={add} onChange={(e) => setAdd(e.target.value)}><option value="">Add a market…</option>{missing.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}</select><button className="btn small" disabled={!add} onClick={() => { mutate((ch) => { ch.markets.push(marketRow(core, ch, add)); }); setAdd(''); }}>Add</button></span>}
      </div>
      <div className="table-wrap" tabIndex={0}>
        <table className="data">
          <thead><tr><th>Market</th><th>Status</th><th>Submit by</th><th>Classification</th><th>First shipment</th><th>Old stock out</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const d = dates[r.market] ?? today();
              return (
                <tr key={r.market}>
                  <td><b>{r.label}</b>{!core.markets.find((m) => m.id === r.market)?.pack && <div className="small muted">tracking only</div>}</td>
                  <td style={{ minWidth: 190 }}>
                    <select aria-label={`Status for ${r.label}`} value={r.step} onChange={(e) => mutate((ch) => setStep(core, ch, r.market, Number(e.target.value), d))}>{core.statuses.map((s, i) => <option key={s} value={i}>{s}</option>)}</select>
                    <input type="text" aria-label={`Date for ${r.label}`} inputMode="numeric" value={d} onChange={(e) => setDates({ ...dates, [r.market]: e.target.value })} style={{ width: '7.5rem', marginLeft: '.3rem' }} />
                    <div className="small muted">{Object.entries(r.dates).map(([k, v]) => `${k} ${v}`).join(' · ')}</div>
                  </td>
                  <td>{r.deadline}{r.lateSubmit && <div className="small" style={{ color: 'var(--high)', fontWeight: 600 }}>{r.lateSubmit}</div>}</td>
                  <td><input type="text" aria-label={`Classification for ${r.label}`} value={r.classification} onChange={(e) => mutate((ch) => { ch.markets.find((x) => x.market === r.market).classification = e.target.value; })} placeholder={r.market === 'us' ? 'for example CBE-0' : ''} style={{ width: '9rem' }} /></td>
                  <td><input type="text" aria-label={`First shipment for ${r.label}`} inputMode="numeric" value={r.firstShip} onChange={(e) => mutate((ch) => { ch.markets.find((x) => x.market === r.market).firstShip = e.target.value; })} placeholder="yyyy-mm-dd" style={{ width: '7.5rem' }} />{r.shipTarget && <div className={`small ${r.lateShip ? '' : 'muted'}`} style={r.lateShip ? { color: 'var(--high)', fontWeight: 600 } : undefined}>target {r.shipTarget}</div>}</td>
                  <td><input type="text" aria-label={`Old stock out for ${r.label}`} inputMode="numeric" value={r.oldStockOut} onChange={(e) => mutate((ch) => { ch.markets.find((x) => x.market === r.market).oldStockOut = e.target.value; })} placeholder="yyyy-mm-dd" style={{ width: '7.5rem' }} />{r.stockOutTarget && <div className={`small ${r.lateStock ? '' : 'muted'}`} style={r.lateStock ? { color: 'var(--high)', fontWeight: 600 } : undefined}>target {r.stockOutTarget}</div>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="small muted">Pick the status and the date it happened; earlier steps get the same date if they have none. Approval sets the shipment and stock targets.</p>
    </div>
  );
}
