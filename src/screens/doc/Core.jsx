import React, { useMemo, useState } from 'react';
import { useApp } from '../../ctx.js';
import { currentVersion, draftVersion, versionByV, startDraft, makeEffective, mappingRows, setRow, remap, impactOf, deviationRegister, toCsv, MAP_KINDS, MAP_STATUS, MIN_JUSTIFICATION } from '../../engine/ccds.js';
import { newChange, today } from '../../engine/changes.js';
import { ccsiFile } from '../../engine/handoff.js';
import { download, slug } from '../../engine/io.js';
import { RuleCard } from '../../components/ui.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));
const KIND_TARGET_HINT = { pi: 'PI: section numbers, bw, hl', mg: 'Medication Guide: m1 to m10' };

export default function Core({ project, doc, docs, product, setTab }) {
  const { pack, saveProject, updateDoc, toast, user } = useApp();
  const ccds = project.ccds;
  const cur = currentVersion(ccds);
  const draft = draftVersion(ccds);
  const [viewV, setViewV] = useState(() => draft?.v ?? cur?.v ?? null);
  const view = versionByV(ccds, viewV) ?? draft ?? cur;
  const [eff, setEff] = useState({ date: today() });
  const mutate = async (fn, msg) => { const p = clone(project); fn(p); await saveProject(p); if (msg) toast(msg); return p; };

  if (!ccds) {
    return (
      <div style={{ maxWidth: 900 }}>
        <h2 style={{ fontSize: 'var(--step-2)' }}>Core data sheet</h2>
        <p>This project has no company core data sheet (CCDS) yet. The CCDS is the company's global reference for {product?.brandName}; its safety part (the CCSI) should be in every local label, or the difference justified.</p>
        <button className="btn primary" onClick={() => mutate((p) => { p.ccds = { productId: project.productId, owner: `${product?.holder?.name ?? 'The company'} (fictional), Global Labelling`, versions: [{ v: '1.0', date: '', status: 'draft', note: '', statements: [] }] }; }, 'Draft CCDS 1.0 started.')}>Start a core data sheet</button>
        <p className="small muted" style={{ marginTop: '1rem' }}>To practise with a complete CCDS, open the sample "Ostrevia: map the label to the core data sheet" from Projects.</p>
      </div>
    );
  }

  const prevOf = (v) => { const i = ccds.versions.findIndex((x) => x.v === v.v); return ccds.versions.slice(0, i).reverse().find((x) => x.status !== 'draft') ?? null; };
  const impact = draft ? impactOf(prevOf(draft) ?? cur, draft, docs) : [];
  const lastEff = cur && prevOf(cur) ? impactOf(prevOf(cur), cur, docs) : [];
  const editableV = view?.status === 'draft';
  const editSt = (key, patch) => mutate((p) => { const v = versionByV(p.ccds, view.v); const s = v.statements.find((x) => x.key === key); Object.assign(s, patch); });

  const startChange = async (v, items) => {
    const added = items.filter((x) => x.change !== 'removed');
    const first = added[0]?.st;
    const kind = /contraindic/i.test(first?.heading ?? '') ? 'contra' : /undesirable|adverse/i.test(first?.heading ?? '') ? 'adr' : /posology|dos/i.test(first?.heading ?? '') ? 'dosing' : /indication/i.test(first?.heading ?? '') ? 'indication' : 'warning';
    const c = newChange(pack.core, { trigger: 'ccds', kind, title: `CCDS ${v.v}: ${first ? `${first.heading.toLowerCase()} (${first.text.split(/[.,;]/)[0].slice(0, 60)})` : 'update'}`, text: added.map((x) => x.st.text).join(' '), ccdsVersion: v.v, startDate: v.date || today(), markets: ['us', 'eu', 'in'], statements: added.map((x) => x.st.key), docIds: [...new Set(items.flatMap((x) => x.labels.map((l) => l.docId)))], user });
    await mutate((p) => { p.changes = [...(p.changes ?? []), c]; }, `Change request started with deadlines for ${c.markets.length} markets.`);
    setTab('changes', { change: c.id });
  };

  return (
    <div style={{ maxWidth: 1100 }}>
      <div className="pane-head">
        <div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>Core data sheet: {product?.brandName}</h2>
          <p className="small muted" style={{ margin: 0 }}>{ccds.owner}. Effective version: <b>{cur ? `${cur.v} (${cur.date})` : 'none yet'}</b>{draft ? <> · draft {draft.v} open</> : null}.</p>
        </div>
        <div className="row">
          {cur && <button className="btn small" onClick={() => download(`${slug(product.brandName)}-ccsi-${cur.v}.json`, JSON.stringify(ccsiFile({ project, product, user }), null, 1))}>CCSI file for pharmacovigilance</button>}
          <button className="btn small" onClick={() => download(`${slug(project.title)}-deviation-register.csv`, toCsv(deviationRegister(project, docs), [['label', 'Label'], ['version', 'CCDS version'], ['key', 'Statement'], ['heading', 'Heading'], [(r) => (r.ccsi ? 'Yes' : 'No'), 'CCSI'], ['statement', 'CCDS text'], ['where', 'Mapped to'], ['status', 'Status'], ['justification', 'Justification']]), 'text/csv')}>Deviation register (CSV)</button>
        </div>
      </div>

      <div className="seg" role="group" aria-label="CCDS version" style={{ margin: '.75rem 0' }}>
        {ccds.versions.map((v) => <button key={v.v} aria-pressed={view?.v === v.v} onClick={() => setViewV(v.v)}>{v.v} · {v.status}</button>)}
        {!draft && <button onClick={async () => { let v; await mutate((p) => { v = startDraft(p.ccds); }, 'Draft started from the effective version.'); setViewV(v.v); }}>+ New draft</button>}
      </div>

      {view && (
        <div className="panel" style={{ marginBottom: '1rem' }}>
          <div className="section-head"><h3 style={{ margin: 0 }}>Version {view.v} <span className={`pill ${view.status === 'effective' ? 'ok' : view.status === 'draft' ? 'medium' : ''}`}>{view.status}</span></h3>{view.date && <span className="small muted">Effective {view.date}</span>}</div>
          {editableV ? (
            <label className="field">Reason for the change (labelling committee decision)<textarea rows={2} value={view.note} onChange={(e) => mutate((p) => { versionByV(p.ccds, view.v).note = e.target.value; })} /></label>
          ) : <p className="small" style={{ margin: '.25rem 0' }}>{view.note}</p>}
          {editableV && (
            <div className="row" style={{ alignItems: 'end' }}>
              <label className="field">Effective date<input type="text" inputMode="numeric" value={eff.date} onChange={(e) => setEff({ date: e.target.value })} placeholder="yyyy-mm-dd" /></label>
              <button className="btn primary" onClick={async () => { try { await mutate((p) => makeEffective(p.ccds, view.v, eff.date), `CCDS ${view.v} is effective. Every label now needs assessing against it.`); } catch (e) { toast(e.message, 'error'); } }}>Make {view.v} effective</button>
            </div>
          )}
          <Statements version={view} editable={editableV} onEdit={editSt} onAdd={() => mutate((p) => { const v = versionByV(p.ccds, view.v); v.statements.push({ key: `s${Date.now().toString(36)}`, heading: 'Special warnings and precautions', text: '', ccsi: true, targets: { pi: ['5'], mg: [] }, terms: { pi: [], mg: [] } }); })} onRemove={(key) => mutate((p) => { const v = versionByV(p.ccds, view.v); v.statements = v.statements.filter((s) => s.key !== key); })} />
        </div>
      )}

      {(impact.length > 0 || lastEff.length > 0) && (
        <div className="panel" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Impact {draft ? `of draft ${draft.v}` : `of ${cur.v}`}</h3>
          <ImpactList items={draft ? impact : lastEff} />
          {!draft && cur && !(project.changes ?? []).some((c) => c.ccdsVersion === cur.v) && <button className="btn primary" onClick={() => startChange(cur, lastEff)}>Start the change request for {cur.v}</button>}
          {!draft && cur && (project.changes ?? []).some((c) => c.ccdsVersion === cur.v) && <button className="btn small" onClick={() => setTab('changes', { change: project.changes.find((c) => c.ccdsVersion === cur.v).id })}>Open the change request for {cur.v}</button>}
          {draft && <p className="small muted">Make the draft effective to start the change request.</p>}
        </div>
      )}

      {MAP_KINDS.includes(doc.kind) && doc.role !== 'reference' && cur ? <Mapping doc={doc} project={project} cur={cur} updateDoc={updateDoc} pack={pack} /> : (
        <p className="small muted">Mapping applies to the prescribing information and the Medication Guide. Choose one of them above to map it.</p>
      )}
    </div>
  );
}

function ImpactList({ items }) {
  return (
    <ul className="list" style={{ margin: '0 0 .75rem' }}>
      {items.map((x) => (
        <li key={`${x.change}-${x.st.key}`} className="list-item" style={{ display: 'block' }}>
          <span className={`pill ${x.change === 'added' ? 'high' : x.change === 'removed' ? '' : 'medium'}`}>{x.change}</span> <b>{x.st.heading}</b>{x.st.ccsi ? <span className="pill" style={{ marginLeft: '.3rem' }}>CCSI</span> : null}
          <div className="small">{x.st.text}</div>
          {x.prev && <div className="small muted">Before: {x.prev.text}</div>}
          <div className="small muted">{x.labels.length ? x.labels.map((l) => `${l.title}: ${l.targets.join(', ')}`).join(' · ') : 'No label in this project carries it.'}</div>
        </li>
      ))}
    </ul>
  );
}

function Statements({ version, editable, onEdit, onAdd, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <details open={open || editable} onToggle={(e) => setOpen(e.target.open)} style={{ marginTop: '.75rem' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{version.statements.length} statements ({version.statements.filter((s) => s.ccsi).length} in the CCSI)</summary>
      <div className="table-wrap" tabIndex={0} style={{ marginTop: '.5rem' }}>
        <table className="data">
          <thead><tr><th>Heading</th><th>Statement</th><th>CCSI</th><th>Mapped to</th>{editable && <th />}</tr></thead>
          <tbody>
            {version.statements.map((s) => (
              <tr key={s.key}>
                <td style={{ minWidth: 140 }}>{editable ? <input type="text" aria-label="Heading" value={s.heading} onChange={(e) => onEdit(s.key, { heading: e.target.value })} /> : s.heading}</td>
                <td style={{ minWidth: 280 }}>{editable ? <textarea aria-label="Statement" rows={3} value={s.text} onChange={(e) => onEdit(s.key, { text: e.target.value })} /> : s.text}</td>
                <td>{editable ? <input type="checkbox" aria-label="In the CCSI" checked={!!s.ccsi} onChange={(e) => onEdit(s.key, { ccsi: e.target.checked })} /> : s.ccsi ? 'Yes' : 'No'}</td>
                <td style={{ minWidth: 170 }}>
                  {editable ? (<>
                    {['pi', 'mg'].map((k) => <label key={k} className="field small" title={KIND_TARGET_HINT[k]}>{k.toUpperCase()} sections<input type="text" value={(s.targets?.[k] ?? []).join(', ')} onChange={(e) => onEdit(s.key, { targets: { ...s.targets, [k]: e.target.value.split(/\s*,\s*/).filter(Boolean) } })} /></label>)}
                    <label className="field small" title="Words that show the statement is present; | separates alternatives">Key terms (PI)<input type="text" value={(s.terms?.pi ?? []).join(', ')} onChange={(e) => onEdit(s.key, { terms: { ...s.terms, pi: e.target.value.split(/\s*,\s*/).filter(Boolean) } })} /></label>
                  </>) : <span className="small">{Object.entries(s.targets ?? {}).filter(([, v]) => v.length).map(([k, v]) => `${k.toUpperCase()} ${v.join(', ')}`).join(' · ') || '—'}</span>}
                </td>
                {editable && <td><button className="btn small ghost" onClick={() => onRemove(s.key)} aria-label={`Remove ${s.heading}`}>Remove</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editable && <button className="btn small" style={{ marginTop: '.5rem' }} onClick={onAdd}>Add a statement</button>}
    </details>
  );
}

function Mapping({ doc, project, cur, updateDoc, pack }) {
  const mappedTo = doc.ccdsMap?.version;
  const version = versionByV(project.ccds, mappedTo) ?? cur;
  const rows = useMemo(() => mappingRows(doc, version), [doc, version]);
  const change = (key, patch, detail) => { const d = clone(doc); setRow(d, version, key, patch); updateDoc(d, { action: 'ccds-map', detail }); };
  const assess = () => { const d = clone(doc); remap(d, versionByV(project.ccds, mappedTo), cur); updateDoc(d, { action: 'ccds-map', detail: `Assessed against CCDS ${cur.v}` }); };
  const gaps = rows.filter((r) => ((r.status === 'deviates' || r.status === 'na') && !r.justified) || (!r.found && r.status !== 'aligned' && r.status !== 'deviates' && r.status !== 'na'));
  return (
    <div>
      <div className="section-head">
        <h3 style={{ margin: 0 }}>Mapping: {doc.title}</h3>
        <span className="small">{mappedTo ? `Mapped to CCDS ${mappedTo}` : 'Not mapped yet'} · {gaps.length ? <b style={{ color: 'var(--high)' }}>{gaps.length} open</b> : <b style={{ color: 'var(--ok)' }}>no open gaps</b>}</span>
      </div>
      <RuleCard pack={pack} id="CORE-MAP" />
      {mappedTo !== cur.v && (
        <div className="callout warn" style={{ margin: '.5rem 0' }}>
          {mappedTo ? `This label was assessed against CCDS ${mappedTo}. Version ${cur.v} is effective.` : `Assess this label against CCDS ${cur.v} to record the mapping.`}{' '}
          <button className="btn small primary" onClick={assess}>Assess against {cur.v}</button>
          <div className="small muted">Decisions for statements that did not change are kept.</div>
        </div>
      )}
      <p className="small muted">The app looks for each statement's key terms in the sections it maps to. A statement found there counts as aligned unless you say otherwise. Anything not found must be added to the label or justified (at least {MIN_JUSTIFICATION} characters).</p>
      <div className="table-wrap" tabIndex={0}>
        <table className="data">
          <thead><tr><th>CCDS statement</th><th>In the label?</th><th>Decision</th><th>Justification</th></tr></thead>
          <tbody>
            {rows.map((r) => {
              const open = gaps.includes(r);
              return (
                <tr key={r.st.key} style={open ? { background: 'color-mix(in srgb, var(--high) 8%, transparent)' } : undefined}>
                  <td style={{ minWidth: 260 }}><b className="small">{r.st.heading}{r.st.ccsi ? ' · CCSI' : ''}</b><div className="small">{r.st.text}</div></td>
                  <td className="small" style={{ minWidth: 140 }}>{r.found ? <span style={{ color: 'var(--ok)', fontWeight: 600 }}>Found</span> : <span style={{ color: 'var(--high)', fontWeight: 600 }}>Not found</span>} in {r.targets.join(', ')}{!r.found && r.missingTerms.length ? <div className="muted">missing: {r.missingTerms.map((t) => t.split('|')[0]).join(', ')}</div> : null}</td>
                  <td style={{ minWidth: 150 }}>
                    <select aria-label={`Decision for ${r.st.key}`} value={r.row.status ?? ''} onChange={(e) => change(r.st.key, { status: e.target.value }, `${r.st.key}: ${e.target.value || 'automatic'}`)}>
                      <option value="">{r.found ? 'Aligned (found)' : 'No decision'}</option>
                      {Object.entries(MAP_STATUS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                  </td>
                  <td style={{ minWidth: 220 }}>{(r.row.status === 'deviates' || r.row.status === 'na') ? <textarea aria-label={`Justification for ${r.st.key}`} rows={2} value={r.row.justification ?? ''} onChange={(e) => change(r.st.key, { justification: e.target.value }, `${r.st.key}: justification`)} placeholder="Why the label differs" /> : <span className="small muted">{r.row.justification ?? ''}</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
