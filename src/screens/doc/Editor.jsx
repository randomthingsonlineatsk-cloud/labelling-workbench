import React, { useEffect, useMemo } from 'react';
import { useApp } from '../../ctx.js';
import { templateFor, fill } from '../../engine/pack.js';
import { newBlock, sectionTitle, hasContent, moveSub, renumberSubs, HL_LABEL, FIELD_LABEL, uid } from '../../engine/model.js';
import { highlightsLines, boxedLines, HL_MAX_LINES, BW_MAX_LINES } from '../../engine/checks.js';
import Blocks from '../../components/Blocks.jsx';
import { Sev, RuleCard } from '../../components/ui.jsx';
import CartonMock from '../../components/CartonMock.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));
export const editable = (doc) => doc.status === 'draft' || doc.status === 'changes';

// Which tree node an issue belongs to.
export function nodeOf(doc, loc) {
  if (!loc) return null;
  if (doc.kind === 'carton' || doc.kind === 'container') return 'fields';
  if (loc.area === 'hl') return 'hl';
  if (loc.area === 'bw') return 'bw';
  if (loc.area === 'fixed') return 'fixed';
  if (loc.area === 'sec') {
    if (doc.kind === 'pi' || doc.kind === 'pmi') return String(loc.key).split('.')[0];
    return loc.key;
  }
  return null;
}

export default function Editor({ doc, docs, issues, focus, setFocus, setTab, project }) {
  const { pack, updateDoc, saveDocNow, versions } = useApp();
  const t = templateFor(pack, doc.kind);
  const ro = !editable(doc);
  const change = (fn, detail) => { if (ro) return; const d = clone(doc); fn(d); updateDoc(d, { detail }); };

  if (doc.kind === 'carton' || doc.kind === 'container') return <CartonEditor doc={doc} docs={docs} issues={issues} change={change} ro={ro} pack={pack} />;

  const nodes = useMemo(() => {
    const out = [];
    if (doc.kind === 'pi') { out.push({ key: 'hl', label: 'Highlights', n: 'HL' }); out.push({ key: 'bw', label: doc.bw ? 'Boxed warning' : 'Boxed warning (none)', n: 'BW', absent: !doc.bw }); }
    if (doc.fixed || doc.kind === 'mg' || doc.kind === 'ppi' || doc.kind === 'ifu') out.push({ key: 'fixed', label: 'Title and statements', n: '·' });
    const present = new Map((doc.sections ?? []).map((s) => [s.num, s]));
    const seen = new Set();
    for (const ts of t.sections) {
      const s = present.get(ts.num);
      seen.add(ts.num);
      out.push({ key: ts.num, label: s ? s.title : fill(ts.title, doc.meta), n: /^\d/.test(ts.num) ? ts.num : '', absent: !s, subs: (s?.subs ?? []).map((x) => ({ key: x.num, label: x.title })) });
    }
    for (const s of doc.sections ?? []) if (!seen.has(s.num)) out.push({ key: s.num, label: s.title, n: s.num, extra: true });
    return out;
  }, [doc, t]);

  const sel = focus?.node && nodes.some((n) => n.key === focus.node) ? focus.node : nodes[0]?.key;
  const byNode = useMemo(() => {
    const m = {};
    for (const i of issues) { if (i.waived || i.severity === 'info') continue; const k = nodeOf(doc, i.loc); if (!k) continue; m[k] = m[k] === 'error' || i.severity === 'error' ? 'error' : 'warning'; }
    return m;
  }, [issues, doc]);
  const nodeIssues = issues.filter((i) => nodeOf(doc, i.loc) === sel);

  useEffect(() => {
    if (focus?.sub) document.getElementById(`sub-${focus.sub}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [focus]);

  const lastApproved = versions.filter((v) => v.docId === doc.id && v.status === 'approved').sort((a, b) => b.n - a.n)[0];
  const newVersion = async () => {
    const d = clone(doc);
    d.status = 'draft'; d.version = (doc.version ?? 0) + 1; d.waivers = { ...doc.waivers };
    await saveDocNow(d, { action: 'new-version', detail: `Started version ${d.version} from approved version ${doc.version}` });
  };

  return (
    <div className="editor">
      <nav aria-label="Sections">
        <ul className="tree">
          {nodes.map((n) => (
            <li key={n.key}>
              <button className="tnode" aria-current={sel === n.key ? 'true' : undefined} onClick={() => setFocus({ node: n.key })} style={n.absent ? { color: 'var(--ink-3)' } : undefined}>
                <span className={`dot ${byNode[n.key] ?? (n.absent ? 'empty' : 'clean')}`} aria-hidden="true" />
                <span className="n">{n.n}</span><span className="t">{n.label}</span>
                {byNode[n.key] && <span className="sr-only">({byNode[n.key]}s)</span>}
              </button>
              {sel === n.key && n.subs?.length > 0 && (
                <ul>{n.subs.map((x) => <li key={x.key}><button className="tnode" onClick={() => setFocus({ node: n.key, sub: x.key })}><span className="n">{x.key}</span><span className="t">{x.label}</span></button></li>)}</ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="pane">
        {ro && (
          <div className="readonly-banner">
            <span>{doc.status === 'approved' ? `Version ${doc.version} is approved and frozen.` : doc.status === 'superseded' ? 'This version has been superseded.' : 'This version is in review and cannot be edited.'}</span>
            {doc.status === 'approved' && <button className="btn small" onClick={newVersion}>Start version {(doc.version ?? 0) + 1}</button>}
            {doc.status === 'review' && <button className="btn small" onClick={() => setTab('review')}>Go to review</button>}
          </div>
        )}
        {nodeIssues.length > 0 && (
          <div className="inline-issues" aria-label="Findings here">
            {nodeIssues.slice(0, 8).map((i) => <div key={i.key} className="inline-issue"><Sev s={i.severity} waived={i.waived} /><span><b>{i.loc?.label}:</b> {i.msg} {i.hint && <span className="muted">{i.hint}</span>}</span></div>)}
            {nodeIssues.length > 8 && <button className="btn small ghost" onClick={() => setTab('checks')}>See all {nodeIssues.length} in Checks</button>}
          </div>
        )}
        <fieldset className="plain" disabled={ro}>
          {sel === 'hl' && <HighlightsPane doc={doc} docs={docs} change={change} ro={ro} pack={pack} />}
          {sel === 'bw' && <BoxedPane doc={doc} change={change} ro={ro} />}
          {sel === 'fixed' && <FixedPane doc={doc} change={change} ro={ro} t={t} />}
          {sel !== 'hl' && sel !== 'bw' && sel !== 'fixed' && <SectionPane key={sel} doc={doc} num={sel} change={change} ro={ro} t={t} />}
        </fieldset>
        {lastApproved && doc.status === 'draft' && <p className="small muted" style={{ marginTop: '1rem' }}>Version {lastApproved.n} was approved; see Versions to compare this draft with it.</p>}
      </div>
    </div>
  );
}

function MetaFields({ doc, change, fields }) {
  const m = doc.meta ?? {};
  return (
    <div className="grid-2" style={{ marginBottom: '1rem' }}>
      {fields.map(([k, label, hint]) => (
        <label key={k} className="field">{label}{hint && <small>{hint}</small>}
          {k === 'patientLabeling' ? (
            <select value={m[k] ?? ''} onChange={(e) => change((d) => { d.meta[k] = e.target.value; }, 'Patient labelling type')}>
              <option value="">None</option><option value="mg">Medication Guide</option><option value="ppi">Patient Information or IFU</option>
            </select>
          ) : <input type="text" value={m[k] ?? ''} onChange={(e) => change((d) => { d.meta[k] = e.target.value; }, `Product title: ${label}`)} />}
        </label>
      ))}
    </div>
  );
}

function Fixed({ label, value, want, onChange }) {
  return (
    <label className="field" style={{ marginBottom: '.75rem' }}>{label}
      <span className="fixed-text">
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={2} />
        {want && value !== want && <button type="button" className="icon-btn" onClick={() => onChange(want)} title={want}>Use required wording</button>}
      </span>
    </label>
  );
}

function Meter({ label, n, max }) {
  const pct = Math.min(100, Math.round((n / max) * 100));
  return (
    <div className="meter">
      <span>{label}: about <b>{n}</b> of {max} lines</span>
      <div className={`meter-bar ${n > max ? 'over' : n > max * 0.9 ? 'near' : ''}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={n} aria-label={label}><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function HighlightsPane({ doc, docs, change, pack }) {
  const t = templateFor(pack, 'pi');
  const hl = doc.hl ?? {};
  const m = doc.meta ?? {};
  const pk = docs.some((d) => d.kind === 'mg') || m.patientLabeling === 'mg' ? 'mg' : (m.patientLabeling || docs.some((d) => d.kind === 'ppi' || d.kind === 'ifu')) ? 'ppi' : '';
  const pciWant = pk === 'mg' ? t.fixed.pciMG : pk ? t.fixed.pciPPI : t.fixed.pci;
  return (
    <div>
      <div className="pane-head"><h2>Highlights of prescribing information</h2>
        <div style={{ minWidth: 240, display: 'grid', gap: '.4rem' }}>
          <Meter label="Highlights length" n={highlightsLines(doc, pack)} max={HL_MAX_LINES} />
          {hl.bw?.length > 0 && <Meter label="Boxed warning summary" n={boxedLines(doc)} max={BW_MAX_LINES} />}
        </div>
      </div>
      <h3>Product title and dates</h3>
      <MetaFields doc={doc} change={change} fields={[
        ['proprietaryName', 'Proprietary name', 'Capitals, as printed'], ['establishedName', 'Established name'], ['dosageForm', 'Dosage form', 'For example "tablets"'], ['route', 'Route', 'For example "for oral use"'],
        ['controlled', 'Controlled substance symbol', 'Leave blank if none'], ['initialApproval', 'Initial U.S. Approval', 'Year'], ['revised', 'Revised', 'MM/YYYY'],
        ['manufacturer', 'Manufacturer (for the reporting line)'], ['phone', 'Phone (for the reporting line)'], ['patientLabeling', 'Patient labelling'],
      ]} />
      <Fixed label="Limitation statement" value={hl.limitation} want={fill(t.fixed.limitation, m)} onChange={(v) => change((d) => { d.hl.limitation = v; }, 'Highlights limitation statement')} />
      {(doc.bw || hl.bw?.length > 0) && (
        <section className="sub-card">
          <h3>Boxed warning summary <span className="muted small">(heading comes from the full boxed warning: {doc.bw?.title || 'none'})</span></h3>
          <Blocks blocks={hl.bw ?? []} label="Boxed warning summary" types={['ul', 'p']} idPrefix="hlbw-" onChange={(b) => change((d) => { d.hl.bw = b; }, 'Highlights boxed warning')} />
          <Fixed label="Closing line" value={hl.bwClose} want={t.fixed.bwClose} onChange={(v) => change((d) => { d.hl.bwClose = v; }, 'Highlights boxed warning closing line')} />
        </section>
      )}
      <section className="sub-card">
        <h3>Recent Major Changes</h3>
        <p className="small muted">Boxed Warning and sections 1, 2, 4 and 5 only. Leave the number empty for the Boxed Warning.</p>
        {(hl.rmc ?? []).map((r, i) => (
          <div key={i} className="rmc-row">
            <input type="text" aria-label={`Change ${i + 1} heading`} value={r.heading} placeholder="Warnings and Precautions, Thrombosis" onChange={(e) => change((d) => { d.hl.rmc[i].heading = e.target.value; }, 'Recent Major Changes')} />
            <input type="text" aria-label={`Change ${i + 1} section number`} value={r.num} placeholder="5.3" onChange={(e) => change((d) => { d.hl.rmc[i].num = e.target.value.trim(); }, 'Recent Major Changes')} />
            <input type="text" aria-label={`Change ${i + 1} date`} value={r.date} placeholder="MM/YYYY" onChange={(e) => change((d) => { d.hl.rmc[i].date = e.target.value.trim(); }, 'Recent Major Changes')} />
            <button type="button" className="icon-btn" onClick={() => change((d) => { d.hl.rmc.splice(i, 1); }, 'Recent Major Changes')}>Remove</button>
          </div>
        ))}
        <button type="button" className="icon-btn" onClick={() => change((d) => { d.hl.rmc = [...(d.hl.rmc ?? []), { heading: '', num: '', date: d.meta.revised ?? '' }]; }, 'Recent Major Changes')}>+ Add a change</button>
      </section>
      {t.hl.filter((h) => h.kind !== 'rmc').map((h) => (
        <section key={h.key} className="sub-card">
          <h3>{h.title} <span className="muted small">summarises section {h.ref}</span></h3>
          <Blocks blocks={hl[h.key] ?? []} label={`Highlights ${HL_LABEL[h.key]}`} types={['ul', 'p']} idPrefix={`hl${h.key}-`} onChange={(b) => change((d) => { d.hl[h.key] = b; }, `Highlights ${HL_LABEL[h.key]}`)} />
        </section>
      ))}
      <section className="sub-card">
        <Fixed label="Patient counselling statement" value={hl.pci} want={pciWant} onChange={(v) => change((d) => { d.hl.pci = v; }, 'Highlights counselling statement')} />
        <p className="small">Revised: <b>{m.revised || '—'}</b> (edit it under Product title and dates)</p>
      </section>
    </div>
  );
}

function BoxedPane({ doc, change }) {
  if (!doc.bw) return (
    <div>
      <h2>Boxed warning</h2>
      <p>This label has no boxed warning. Add one only for serious risks that FDA requires to be boxed.</p>
      <button type="button" className="btn" onClick={() => change((d) => { d.bw = { title: 'WARNING: ', blocks: [newBlock('ul')] }; d.hl.bw = d.hl.bw?.length ? d.hl.bw : [newBlock('ul')]; }, 'Added boxed warning')}>Add a boxed warning</button>
    </div>
  );
  return (
    <div>
      <div className="pane-head"><h2>Boxed warning</h2><button type="button" className="btn small danger ghost" onClick={() => { if (window.confirm('Remove the boxed warning and its Highlights summary?')) change((d) => { d.bw = null; d.hl.bw = []; d.hl.bwClose = ''; }, 'Removed boxed warning'); }}>Remove</button></div>
      <label className="field" style={{ marginBottom: '.75rem' }}>Heading <small>Starts with "WARNING:", in capitals</small>
        <input type="text" value={doc.bw.title} onChange={(e) => change((d) => { d.bw.title = e.target.value; }, 'Boxed warning heading')} />
      </label>
      <Blocks blocks={doc.bw.blocks} label="Boxed warning" types={['ul', 'p']} idPrefix="bw-" onChange={(b) => change((d) => { d.bw.blocks = b; }, 'Boxed warning')} />
    </div>
  );
}

function FixedPane({ doc, change, t }) {
  const m = doc.meta ?? {};
  return (
    <div>
      <h2>Title and statements</h2>
      <MetaFields doc={doc} change={change} fields={[['proprietaryName', 'Proprietary name'], ['establishedName', 'Established name'], ['dosageForm', 'Dosage form'], ['revised', 'Revised', 'MM/YYYY'], ['manufacturer', 'Manufacturer or distributor']]} />
      {t.fixed && Object.entries(t.fixed).map(([k, v]) => (
        <Fixed key={k} label={{ header: 'Title', sideEffects: 'Side-effect reporting statement', approval: 'FDA approval statement', contact: 'Side-effect reporting statement', useStart: 'Opening of Directions for Use' }[k] ?? k} value={doc.fixed?.[k]} want={fill(v, m)} onChange={(val) => change((d) => { d.fixed = { ...(d.fixed ?? {}), [k]: val }; }, `Statement: ${k}`)} />
      ))}
    </div>
  );
}

function SectionPane({ doc, num, change, t }) {
  const ts = t.sections.find((s) => s.num === num);
  const idx = (doc.sections ?? []).findIndex((s) => s.num === num);
  const s = doc.sections?.[idx];
  const isPi = doc.kind === 'pi';
  const tmplTitle = ts ? fill(ts.title, doc.meta) : null;
  if (!s) return (
    <div>
      <h2>{ts && /^\d/.test(ts.num) ? `${ts.num} ` : ''}{tmplTitle}</h2>
      <p>This {ts?.need === 'optional' ? 'optional' : ts?.need ?? ''} section is not in the label.</p>
      <button type="button" className="btn" onClick={() => change((d) => {
        const ns = { num, title: tmplTitle, blocks: [newBlock()], subs: (ts.fixedSubs ?? []).filter((x) => x.need !== 'optional').map((x) => ({ num: x.num, title: x.title, blocks: [newBlock()] })) };
        const order = t.sections.map((x) => x.num);
        d.sections = [...d.sections, ns].sort((a, b) => order.indexOf(a.num) - order.indexOf(b.num));
      }, `Added section ${num}`)}>Add this section</button>
    </div>
  );
  const fixedSubs = ts?.fixedSubs ?? [];
  const missingFixed = fixedSubs.filter((f) => !s.subs?.some((x) => x.num === f.num));
  const freeSubs = isPi && !ts?.fixedSubs;
  const addSub = (n, title) => change((d) => {
    const sec = d.sections[idx];
    sec.subs = [...(sec.subs ?? []), { num: n, title, blocks: [newBlock()] }].sort((a, b) => a.num.localeCompare(b.num, undefined, { numeric: true }));
  }, `Added subsection ${n}`);
  const nextExtra = () => { const nums = (s.subs ?? []).map((x) => Number(x.num.split('.')[1])); return `${num}.${Math.max(fixedSubs.length, ...nums, 0) + 1}`; };
  return (
    <div>
      <div className="pane-head">
        <h2>{isPi ? `${s.num} ` : ''}{s.title}</h2>
        {ts?.need !== 'required' && <button type="button" className="btn small danger ghost" onClick={() => { if (window.confirm('Remove this section from the label?')) change((d) => { d.sections.splice(idx, 1); }, `Removed section ${num}`); }}>Remove section</button>}
      </div>
      <label className="field" style={{ marginBottom: '.75rem' }}>Heading
        <span className="fixed-text">
          <input type="text" value={s.title} onChange={(e) => change((d) => { d.sections[idx].title = e.target.value; }, `Heading ${num}`)} />
          {tmplTitle && s.title !== tmplTitle && <button type="button" className="icon-btn" onClick={() => change((d) => { d.sections[idx].title = tmplTitle; }, `Heading ${num}`)}>Use template heading</button>}
        </span>
      </label>
      <Blocks blocks={s.blocks} label={sectionTitle(s)} types={doc.kind === 'pi' ? ['p', 'ul', 'table'] : ['p', 'ul', 'box', 'table']} idPrefix={`s${num}-`} onChange={(b) => change((d) => { d.sections[idx].blocks = b; }, `Section ${num}`)} />
      {(s.subs ?? []).map((x, i) => {
        const fixed = fixedSubs.find((f) => f.num === x.num);
        return (
          <section key={x.num + i} className="sub-card" id={`sub-${x.num}`}>
            <div className="sub-head">
              <span className="num">{x.num}</span>
              <input type="text" value={x.title} aria-label={`Subsection ${x.num} heading`} onChange={(e) => change((d) => { d.sections[idx].subs[i].title = e.target.value; }, `Heading ${x.num}`)} />
              {fixed && x.title !== fixed.title && <button type="button" className="icon-btn" onClick={() => change((d) => { d.sections[idx].subs[i].title = fixed.title; }, `Heading ${x.num}`)}>Use "{fixed.title}"</button>}
              {freeSubs && <>
                <button type="button" className="icon-btn" disabled={i === 0} onClick={() => change((d) => { moveSub(d, num, i, -1); }, `Moved ${x.num} up; references renumbered`)} aria-label={`Move ${x.num} up`}>↑</button>
                <button type="button" className="icon-btn" disabled={i === s.subs.length - 1} onClick={() => change((d) => { moveSub(d, num, i, 1); }, `Moved ${x.num} down; references renumbered`)} aria-label={`Move ${x.num} down`}>↓</button>
              </>}
              {!(fixed && fixed.need === 'required') && <button type="button" className="icon-btn" onClick={() => { if (window.confirm(`Delete ${x.num} ${x.title}?`)) change((d) => { d.sections[idx].subs.splice(i, 1); if (freeSubs) renumberSubs(d, num); }, `Deleted ${x.num}`); }}>Delete</button>}
            </div>
            <Blocks blocks={x.blocks} label={sectionTitle(x)} idPrefix={`s${x.num}-`} onChange={(b) => change((d) => { d.sections[idx].subs[i].blocks = b; }, `Section ${x.num}`)} />
          </section>
        );
      })}
      {isPi && (
        <div className="row small" style={{ marginTop: '.75rem' }}>
          {freeSubs && <button type="button" className="icon-btn" onClick={() => addSub(`${num}.${(s.subs?.length ?? 0) + 1}`, 'New subsection')}>+ Add subsection {num}.{(s.subs?.length ?? 0) + 1}</button>}
          {missingFixed.map((f) => <button type="button" key={f.num} className="icon-btn" onClick={() => addSub(f.num, f.title)}>+ {f.num} {f.title}</button>)}
          {ts?.extraSubs && <button type="button" className="icon-btn" onClick={() => addSub(nextExtra(), 'Other population')}>+ {nextExtra()} other population</button>}
          {freeSubs && <span className="muted">Moving a subsection renumbers it and rewrites every cross-reference.</span>}
        </div>
      )}
    </div>
  );
}

function CartonEditor({ doc, docs, issues, change, ro, pack }) {
  const t = templateFor(pack, 'carton');
  const f = doc.fields ?? {};
  const needsMg = docs.some((d) => d.kind === 'mg');
  return (
    <div className="editor" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
      <div className="pane">
        {ro && <div className="readonly-banner">{doc.status === 'approved' ? 'Approved and frozen. Start a new version from the Review tab.' : 'In review; not editable.'}</div>}
        <h2 style={{ marginBottom: '.75rem' }}>Label text</h2>
        <fieldset className="plain" disabled={ro}>
          <div className="stack">
            {t.fields.map((fd) => {
              const need = fd.need[doc.kind];
              const iss = issues.filter((i) => i.loc?.key === fd.key && !i.waived && i.severity !== 'info');
              return (
                <label key={fd.key} className="field">{fd.label} <small>{need}{need !== 'optional' ? ` · ${fd.at}` : ''}</small>
                  <input type="text" value={f[fd.key] ?? ''} onChange={(e) => change((d) => { d.fields[fd.key] = e.target.value; }, fd.label)} aria-invalid={iss.length ? 'true' : undefined} />
                  {iss.map((i) => <span key={i.key} className="small" style={{ color: i.severity === 'error' ? 'var(--high)' : 'var(--medium)', fontWeight: 600 }}>{i.msg}</span>)}
                </label>
              );
            })}
            {doc.kind === 'carton' && (
              <label className="field">Medication Guide statement <small>{needsMg ? 'required (a Medication Guide exists)' : 'only when a Medication Guide is required'}</small>
                <input type="text" value={f.mgStatement ?? ''} onChange={(e) => change((d) => { d.fields.mgStatement = e.target.value; }, 'Medication Guide statement')} />
                {issues.filter((i) => i.loc?.key === 'mgStatement' && !i.waived).map((i) => <span key={i.key} className="small" style={{ color: 'var(--high)', fontWeight: 600 }}>{i.msg}</span>)}
              </label>
            )}
            <div className="grid-2">
              {['proprietaryName', 'establishedName', 'strength'].map((k) => (
                <label key={k} className="field">{FIELD_LABEL[k]} type size (pt)
                  <input type="number" min="4" max="48" value={doc.sizes?.[k] ?? ''} onChange={(e) => change((d) => { d.sizes = { ...(d.sizes ?? {}), [k]: Number(e.target.value) }; }, 'Type sizes')} />
                </label>
              ))}
              <label className="field">Panel colour <input type="color" value={doc.colour ?? '#23615c'} onChange={(e) => change((d) => { d.colour = e.target.value; }, 'Colour')} /></label>
            </div>
            <div className="row small">
              <label className="row"><input type="checkbox" checked={!!doc.barcode} onChange={(e) => change((d) => { d.barcode = e.target.checked; }, 'Bar code')} /> Linear bar code with NDC</label>
              <label className="row"><input type="checkbox" checked={!!doc.twoD} onChange={(e) => change((d) => { d.twoD = e.target.checked; }, '2D code')} /> 2D data matrix (product identifier)</label>
              <label className="row"><input type="checkbox" checked={!!doc.injectable} onChange={(e) => change((d) => { d.injectable = e.target.checked; }, 'Injectable')} /> Injectable</label>
            </div>
          </div>
        </fieldset>
      </div>
      <div style={{ position: 'sticky', top: 64 }}>
        <h2 style={{ fontSize: 'var(--step-1)' }}>Mock-up</h2>
        {issues.filter((i) => ['barcode'].includes(i.loc?.key) && !i.waived).map((i) => <p key={i.key} className="small" style={{ color: 'var(--high)', fontWeight: 600 }}>{i.msg}</p>)}
        <CartonMock doc={doc} />
        <p className="small muted" style={{ marginTop: '.5rem' }}>A schematic, not artwork. Codes are placeholders. Simplified: small-container exemptions and DSCSA serialisation details are not modelled.</p>
      </div>
    </div>
  );
}
