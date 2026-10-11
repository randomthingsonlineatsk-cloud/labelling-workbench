import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { summarise, canApprove } from '../../engine/checks.js';
import { ruleById } from '../../engine/pack.js';
import { Sev, RuleCard, Counts, Modal } from '../../components/ui.jsx';
import { nodeOf, editable } from './Editor.jsx';

export default function Checks({ doc, issues, setTab }) {
  const { pack, updateDoc, user } = useApp();
  const [filter, setFilter] = useState('open');
  const [waiving, setWaiving] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const sum = summarise(issues);
  const shown = issues.filter((i) => (filter === 'all' ? true : filter === 'open' ? !i.waived && i.severity !== 'info' : filter === 'hints' ? i.severity === 'info' : i.waived));
  const goTo = (i) => {
    const node = nodeOf(doc, i.loc);
    const sub = i.loc?.area === 'sec' && String(i.loc.key).includes('.') ? i.loc.key : undefined;
    setTab('edit', node ? { node, sub } : null);
  };
  const ro = !editable(doc);
  const setWaiver = (key, reason) => {
    const d = JSON.parse(JSON.stringify(doc));
    d.waivers = { ...(d.waivers ?? {}) };
    if (reason) d.waivers[key] = `${reason} (${user?.displayName || 'learner'}, ${new Date().toISOString().slice(0, 10)})`; else delete d.waivers[key];
    updateDoc(d, { action: reason ? 'waive' : 'unwaive', detail: key });
  };
  const key = doc.answerKey ?? [];
  const found = new Set(issues.filter((i) => !i.waived).map((i) => i.ruleId));

  return (
    <div style={{ maxWidth: 980 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>Checks</h2>
          <p className="small muted" style={{ margin: 0 }}>{pack.name} pack {pack.version} ({pack.asOf}). Checks run as you type. Errors must be fixed; warnings can be fixed or waived with a reason; hints never block.</p>
        </div>
        <div className="row"><Counts sum={sum} zero="No open findings" />{sum.waived ? <span className="sev waived">{sum.waived} waived</span> : null}</div>
      </div>
      <div className={`callout ${canApprove(issues) ? '' : 'warn'}`} style={{ marginBottom: '1rem' }}>
        {canApprove(issues) ? 'Ready for approval: no open errors or warnings.' : `Not ready for approval: ${sum.errors} error(s) and ${sum.warnings} warning(s) open.`}
      </div>
      <div className="row" style={{ marginBottom: '.75rem' }}>
        <div className="seg" role="group" aria-label="Show">
          {[['open', `Open (${sum.errors + sum.warnings})`], ['hints', `Hints (${sum.info})`], ['waived', `Waived (${sum.waived})`], ['all', `All (${issues.length})`]].map(([k, l]) => <button key={k} aria-pressed={filter === k} onClick={() => setFilter(k)}>{l}</button>)}
        </div>
        {key.length > 0 && <button className="btn small ghost" onClick={() => setShowKey(!showKey)} aria-expanded={showKey}>{showKey ? 'Hide' : 'Show'} the answer key ({key.length} planted)</button>}
      </div>
      {showKey && (
        <div className="panel" style={{ marginBottom: '1rem' }}>
          <h3>Answer key</h3>
          <p className="small muted">What was planted in this sample. A tick means that rule is no longer reported.</p>
          <ul className="checks answer-key">
            {key.map((k, i) => <li key={i}><span className={`tick ${found.has(k.rule) ? '' : 'on'}`} aria-label={found.has(k.rule) ? 'still open' : 'cleared'}>{found.has(k.rule) ? '' : '✓'}</span><span className="small"><b>{k.where}</b>: {k.what} <span className="muted">({k.rule})</span></span></li>)}
          </ul>
        </div>
      )}
      {shown.length === 0 ? <p className="muted">Nothing to show here.</p> : (
        <div className="issues">
          {shown.map((i) => (
            <div key={i.key} className={`issue ${i.severity} ${i.waived ? 'is-waived' : ''}`}>
              <Sev s={i.severity} waived={i.waived} />
              <div>
                <div className="where">{i.loc?.label}</div>
                <div className="msg">{i.msg}</div>
                {i.hint && <div className="hint">Fix: {i.hint}</div>}
                {i.waived && <div className="hint">Waiver: {i.waived}</div>}
                <RuleCard pack={pack} id={i.ruleId} />
              </div>
              <div className="acts">
                <button className="btn small" onClick={() => goTo(i)}>Go to</button>
                {i.severity === 'warning' && !ro && (i.waived ? <button className="btn small ghost" onClick={() => setWaiver(i.key, null)}>Remove waiver</button> : <button className="btn small ghost" onClick={() => setWaiving(i)}>Waive…</button>)}
              </div>
            </div>
          ))}
        </div>
      )}
      {waiving && <WaiveModal issue={waiving} rule={ruleById(pack, waiving.ruleId)} onClose={() => setWaiving(null)} onSave={(r) => { setWaiver(waiving.key, r); setWaiving(null); }} />}
    </div>
  );
}

function WaiveModal({ issue, rule, onClose, onSave }) {
  const [reason, setReason] = useState('');
  return (
    <Modal title="Waive this warning" onClose={onClose}>
      <p className="small"><b>{issue.loc?.label}:</b> {issue.msg}</p>
      <p className="small muted">Rule {rule?.id}: {rule?.title}. The reason is kept with the label, shown to the approver and printed in the check report.</p>
      <label className="field">Reason <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="For example: section 7 omitted; no clinically relevant interactions identified (see 12.3)." /></label>
      <div className="row" style={{ marginTop: '.75rem' }}><button className="btn primary" disabled={reason.trim().length < 10} onClick={() => onSave(reason.trim())}>Waive</button><button className="btn ghost" onClick={onClose}>Cancel</button><span className="small muted">At least 10 characters.</span></div>
    </Modal>
  );
}
