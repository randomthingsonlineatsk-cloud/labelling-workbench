import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { canApprove, summarise } from '../../engine/checks.js';
import { sectionTitle } from '../../engine/model.js';
import { download, slug } from '../../engine/io.js';
import { Counts, StatusPill, fmtDate } from '../../components/ui.jsx';

const FLOW = [['draft', 'Draft'], ['review', 'In review'], ['changes', 'Changes requested'], ['approved', 'Approved']];
const ACTION = { submit: 'Submitted for review', comment: 'Comment', 'request-changes': 'Changes requested', recommend: 'Recommended for approval', approve: 'Approved', withdraw: 'Withdrawn from review', 'new-version': 'New version started' };

export default function Review({ doc, issues, project }) {
  const { reviews, audit, versions, addReview, saveDocNow, addVersion, putVersion, putReview, user, toast } = useApp();
  const [role, setRole] = useState(doc.status === 'review' ? 'reviewer' : 'author');
  const [note, setNote] = useState('');
  const [where, setWhere] = useState('');
  const [sign, setSign] = useState({ name: user?.displayName ?? '', reason: 'Approved: content agreed and all checks resolved.' });
  const mine = reviews.filter((r) => r.docId === doc.id).sort((a, b) => a.at.localeCompare(b.at));
  const thisVersion = mine.filter((r) => (r.version ?? 0) === (doc.version ?? 0));
  const open = thisVersion.filter((r) => r.action === 'comment' && !r.resolved);
  const sum = summarise(issues);
  const ready = canApprove(issues);
  const places = doc.sections ? [...(doc.hl ? ['Highlights'] : []), ...(doc.bw ? ['Boxed warning'] : []), ...doc.sections.flatMap((s) => [sectionTitle(s), ...(s.subs ?? []).map(sectionTitle)])] : ['Label text', 'Mock-up'];
  const base = { docId: doc.id, projectId: project.id, version: doc.version ?? 0 };
  const snapshot = (d) => JSON.parse(JSON.stringify(d));

  const setStatus = async (status, auditDetail) => saveDocNow({ ...doc, status }, { action: 'status', detail: auditDetail ?? status });
  const submit = async () => {
    await addVersion({ ...base, n: doc.version ?? 0, status: 'review', snapshot: snapshot({ ...doc, status: 'review' }) });
    await addReview({ ...base, role: 'author', action: 'submit', text: note || 'Submitted for review.' });
    await setStatus('review', `Submitted version ${doc.version ?? 0} for review`);
    setNote(''); setRole('reviewer');
    toast('Submitted for review. Switch roles to review it.');
  };
  const comment = async () => { await addReview({ ...base, role: 'reviewer', action: 'comment', text: note, where }); setNote(''); };
  const requestChanges = async () => {
    await addReview({ ...base, role: 'reviewer', action: 'request-changes', text: note || 'Please address the comments.' });
    await setStatus('changes', 'Reviewer requested changes');
    const v = versions.find((x) => x.docId === doc.id && x.n === (doc.version ?? 0) && x.status === 'review');
    if (v) await putVersion({ ...v, status: 'changes' });
    setNote(''); setRole('author');
  };
  const recommend = async () => { await addReview({ ...base, role: 'reviewer', action: 'recommend', text: note || 'Recommended for approval.' }); setNote(''); setRole('approver'); };
  const approve = async () => {
    const d = { ...doc, status: 'approved', approvedAt: new Date().toISOString(), approvedBy: sign.name.trim() };
    for (const v of versions.filter((x) => x.docId === doc.id && x.status === 'approved')) await putVersion({ ...v, status: 'superseded' });
    const existing = versions.find((x) => x.docId === doc.id && x.n === (doc.version ?? 0) && x.status !== 'superseded');
    const rec = { ...base, n: doc.version ?? 0, status: 'approved', snapshot: snapshot(d), signedBy: sign.name.trim(), reason: sign.reason.trim() };
    if (existing) await putVersion({ ...existing, ...rec, at: new Date().toISOString() }); else await addVersion(rec);
    await addReview({ ...base, role: 'approver', action: 'approve', text: `${sign.reason.trim()} Signed: ${sign.name.trim()} (practice sign-off, not an electronic signature).` });
    await saveDocNow(d, { action: 'approve', detail: `Version ${doc.version ?? 0} approved by ${sign.name.trim()}` });
    toast(`Version ${doc.version ?? 0} approved.`);
  };
  const withdraw = async () => { await addReview({ ...base, role: 'author', action: 'withdraw', text: 'Withdrawn to make more changes.' }); await setStatus('draft', 'Withdrawn from review'); setRole('author'); };
  const newVersion = async () => {
    await saveDocNow({ ...doc, status: 'draft', version: (doc.version ?? 0) + 1 }, { action: 'new-version', detail: `Started version ${(doc.version ?? 0) + 1}` });
    setRole('author');
  };
  const trail = audit.filter((a) => a.entityId === doc.id).sort((a, b) => b.at.localeCompare(a.at));
  const exportTrail = () => download(`${slug(doc.title)}-audit-trail.csv`, ['time,user,action,detail', ...trail.map((a) => [a.at, a.userId, a.action, `"${String(a.detail ?? '').replaceAll('"', '""')}"`].join(','))].join('\n'), 'text/csv');

  const idx = FLOW.findIndex(([k]) => k === doc.status);
  return (
    <div style={{ maxWidth: 980 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>Review and approval</h2>
          <p className="small muted" style={{ margin: 0 }}>Practice workflow: one person can play each role. Approval needs no open errors and every warning fixed or waived with a reason.</p>
        </div>
        <div className="role-switch" role="group" aria-label="Your role">
          {['author', 'reviewer', 'approver'].map((r) => <button key={r} aria-pressed={role === r} onClick={() => setRole(r)}>{r[0].toUpperCase() + r.slice(1)}</button>)}
        </div>
      </div>
      <ul className="flow" aria-label="Status">
        {FLOW.map(([k, l], i) => <li key={k} className={doc.status === k ? 'now' : (doc.status === 'approved' && i < 3 && k !== 'changes') || (idx > i && k !== 'changes') ? 'done' : ''}>{l}</li>)}
      </ul>
      <div className="panel stack" style={{ marginBottom: '1rem' }}>
        <div className="row"><b>Version {doc.version ?? 0}</b> <StatusPill status={doc.status} /> <Counts sum={sum} zero="No open findings" /> {sum.waived ? <span className="sev waived">{sum.waived} waived</span> : null} {open.length ? <span className="pill medium">{open.length} open comment(s)</span> : null}</div>

        {role === 'author' && (doc.status === 'draft' || doc.status === 'changes') && (<>
          <label className="field">Note to the reviewer <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What changed and why" /></label>
          <div className="row"><button className="btn primary" onClick={submit}>Submit for review</button>{!ready && <span className="small muted">You can submit with open findings; the approver cannot approve until they are cleared.</span>}</div>
        </>)}
        {role === 'author' && doc.status === 'review' && <div className="row"><span className="small">Waiting for the reviewer.</span><button className="btn small ghost" onClick={withdraw}>Withdraw to edit</button></div>}

        {role === 'reviewer' && doc.status === 'review' && (<>
          <div className="grid-2">
            <label className="field">Where <select value={where} onChange={(e) => setWhere(e.target.value)}><option value="">Whole label</option>{places.map((p) => <option key={p}>{p}</option>)}</select></label>
            <label className="field">Comment <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} /></label>
          </div>
          <div className="row">
            <button className="btn" disabled={!note.trim()} onClick={comment}>Add comment</button>
            <button className="btn" onClick={requestChanges}>Request changes</button>
            <button className="btn primary" onClick={recommend}>Recommend approval</button>
          </div>
        </>)}
        {role === 'reviewer' && doc.status !== 'review' && <p className="small muted">Nothing to review: the label is {doc.status}.</p>}

        {role === 'approver' && doc.status === 'review' && (<>
          {!ready && <div className="callout bad">Cannot approve: {sum.errors} error(s) and {sum.warnings} warning(s) open. Ask the author to fix them (request changes as reviewer).</div>}
          {open.length > 0 && <div className="callout warn">{open.length} reviewer comment(s) are not resolved.</div>}
          {Object.keys(doc.waivers ?? {}).length > 0 && <div className="small"><b>Waivers to accept:</b><ul>{Object.entries(doc.waivers).map(([k, v]) => <li key={k}>{k.split('|')[0]}: {v}</li>)}</ul></div>}
          <div className="grid-2">
            <label className="field">Your name (typed) <input type="text" value={sign.name} onChange={(e) => setSign({ ...sign, name: e.target.value })} /></label>
            <label className="field">Reason <input type="text" value={sign.reason} onChange={(e) => setSign({ ...sign, reason: e.target.value })} /></label>
          </div>
          <div className="row"><button className="btn primary" disabled={!ready || sign.name.trim().length < 2} onClick={approve}>Approve version {doc.version ?? 0}</button><span className="small muted">Practice sign-off only; not a compliant electronic signature.</span></div>
        </>)}
        {role === 'approver' && doc.status !== 'review' && <p className="small muted">{doc.status === 'approved' ? `Approved${doc.approvedBy ? ` by ${doc.approvedBy}` : ''}.` : 'Approval opens when the label is in review.'}</p>}
        {doc.status === 'approved' && <div><button className="btn" onClick={newVersion}>Start version {(doc.version ?? 0) + 1}</button></div>}
      </div>

      <h3>Review history</h3>
      {mine.length === 0 ? <p className="muted small">No review activity yet.</p> : (
        <ul className="timeline">
          {mine.map((r) => (
            <li key={r.id} className={`${r.action} ${r.resolved ? 'resolved' : ''}`}>
              <b>v{r.version ?? 0} · {ACTION[r.action] ?? r.action}</b> <span className="muted">({r.role}, {fmtDate(r.at)})</span>{r.where ? <> · <i>{r.where}</i></> : null}
              <div>{r.text}</div>
              {r.action === 'comment' && <button className="btn small ghost" onClick={() => putReview({ ...r, resolved: !r.resolved })}>{r.resolved ? 'Reopen' : 'Mark resolved'}</button>}
            </li>
          ))}
        </ul>
      )}
      <div className="section-head" style={{ marginTop: '1.5rem' }}><h3 style={{ margin: 0 }}>Audit trail</h3><button className="btn small" onClick={exportTrail} disabled={!trail.length}>Download CSV</button></div>
      <p className="small muted">Append-only. Typing in one place within two minutes is recorded as one edit.</p>
      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>When</th><th>Action</th><th>Detail</th></tr></thead>
          <tbody>{trail.slice(0, 60).map((a) => <tr key={a.id}><td>{fmtDate(a.at)}</td><td>{a.action}</td><td>{a.detail}</td></tr>)}</tbody>
        </table>
      </div>
      {trail.length > 60 && <p className="small muted">Showing the latest 60 of {trail.length}; the CSV has them all.</p>}
    </div>
  );
}
