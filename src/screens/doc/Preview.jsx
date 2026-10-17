import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { templateFor } from '../../engine/pack.js';
import { sectionTitle, hasContent } from '../../engine/model.js';
import CartonMock from '../../components/CartonMock.jsx';
import { epiSections, epiHtml } from '../../engine/epi.js';
import { download, slug } from '../../engine/io.js';

const EU = ['smpc', 'eu-annex2', 'pl', 'eu-outer', 'eu-blister', 'eu-small'];
const IN = ['in-pi', 'in-carton', 'in-label'];
const NUMBERED = ['ca-pm', 'jp-pi', 'au-pi', 'au-cmi', 'who-smpc'];
const JP_HDR = [['revised', 'Date of revision'], ['commodity', 'Standard Commodity Classification No.'], ['approval', 'Approval number'], ['storage', 'Storage, shelf life'], ['category', 'Therapeutic category'], ['regulatory', 'Regulatory classification']];
const PARTS = { 'ca-pm': { 1: 'PART I: HEALTH PROFESSIONAL INFORMATION', 13: 'PART II: SCIENTIFIC INFORMATION' } };
const txt = (s) => (s?.blocks ?? []).flatMap((b) => (b.t === 'ul' ? b.items : (b.t === 'table' || b.t === 'ar') ? b.rows.flat() : [b.text ?? ''])).filter((x) => x.trim()).join(' ');

// An Indian carton or strip, schematic: the symbol top left in red, the proper name larger than
// the brand name (scaled from the type sizes), the Rule 97 caution in a red box, then the
// Rule 96 particulars and the MRP.
function InLabelMock({ doc }) {
  const sec = (n) => (doc.sections ?? []).find((s) => s.num === n);
  const sz = doc.meta?.sizes ?? {};
  const scale = (pt, fallback) => `${Math.max(0.7, Math.min(2.6, (Number(pt) || fallback) / 8))}rem`;
  const order = (doc.sections ?? []).map((s) => s.num).filter((n) => n === 'c2' || n === 'c3');
  const rest = (doc.sections ?? []).filter((s) => !['c1', 'c2', 'c3', 'c6'].includes(s.num));
  return (
    <div className="in-label" aria-label="Label schematic">
      <div className="in-symbol">{txt(sec('c1'))}</div>
      {order.map((n) => n === 'c2'
        ? <div key={n} style={{ fontSize: scale(sz.proper, 14), fontWeight: 700, lineHeight: 1.15 }}>{txt(sec('c2'))}</div>
        : <div key={n} style={{ fontSize: scale(sz.brand, 10), fontWeight: 600, color: 'var(--ink-2)' }}>{txt(sec('c3'))}</div>)}
      <p className="small muted" style={{ margin: '.2rem 0 .6rem' }}>Proper name {sz.proper ?? '?'} pt · brand name {sz.brand ?? '?'} pt</p>
      {(sec('c6')?.blocks ?? []).map((b) => (b.t === 'box' ? <div key={b.id} className="in-redbox">{b.text}</div> : b.text?.trim() ? <p key={b.id} className="small">{b.text}</p> : null))}
      {rest.map((s) => { const v = txt(s); return v ? <p key={s.num} className="in-part">{s.num === 'c16' ? <span className="in-qr" aria-hidden="true" /> : null}{v}</p> : null; })}
    </div>
  );
}

// A structured view of the product information, the way an ePI organises it: typed sections with
// stable identifiers and language. Simplified; not FHIR.
function EpiView({ doc }) {
  const secs = epiSections(doc);
  return (
    <div lang={doc.meta?.lang ?? 'en'}>
      <p className="small muted">ePI view: {secs.length} sections, language "{doc.meta?.lang ?? 'en'}", document type {doc.kind === 'smpc' ? 'SmPC' : 'Package leaflet'}. Each section has a stable identifier that an ePI keeps across versions and languages.</p>
      {secs.map((x) => (
        <section key={x.id} style={{ borderLeft: '3px solid var(--line)', paddingLeft: '.75rem', margin: '.6rem 0' }}>
          <div className="small muted" style={{ fontFamily: 'var(--mono, monospace)' }}>{x.id}</div>
          <h4 style={{ margin: '.1rem 0' }}>{x.title}</h4>
          {x.paras.map((p, i) => <p key={i} style={{ margin: '.2rem 0' }}>{p}</p>)}
        </section>
      ))}
    </div>
  );
}

function Blocks({ blocks, anno, red }) {
  return (blocks ?? []).map((b) => (
    <React.Fragment key={b.id}>
      {b.t === 'ul' ? <ul>{b.items.filter((x) => x.trim()).map((x, i) => <li key={i}>{x}</li>)}</ul>
        : b.t === 'fig' ? <figure className="fig-ph"><div className="fig-box" role="img" aria-label={b.alt || b.text || 'Figure'}>Figure placeholder</div><figcaption>{b.text}</figcaption></figure>
        : b.t === 'ar' ? <table className="ar"><thead><tr>{(b.rows[0] ?? []).map((c, j) => <th key={j}>{c}</th>)}</tr></thead><tbody>{b.rows.slice(1).map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
        : b.t === 'table' ? <table><tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
          : b.t === 'box' ? <div className={red ? 'in-redbox' : 'bwbox'}>{b.text}</div>
            : b.text?.trim() ? <p>{b.text}</p> : null}
      {anno && b.note && <span className="anno">Annotation: {b.note}</span>}
    </React.Fragment>
  ));
}

export default function Preview({ doc }) {
  const { pack } = useApp();
  const [anno, setAnno] = useState(false);
  const [epi, setEpi] = useState(false);
  const m = doc.meta ?? {};
  if (doc.kind === 'carton' || doc.kind === 'container') return <div><CartonMock doc={doc} /><p className="small muted" style={{ marginTop: '.5rem' }}>Schematic only. Export a PDF from the Export tab.</p></div>;
  const t = templateFor(pack, doc.kind);
  if (doc.kind === 'in-carton' || doc.kind === 'in-label') return <div><InLabelMock doc={doc} /><p className="small muted" style={{ marginTop: '.5rem' }}>Schematic only: the type sizes come from "Product, schedule and type sizes" on the Edit tab. Export a PDF from the Export tab.</p></div>;
  const red = IN.includes(doc.kind) || doc.kind === 'jp-pi';
  return (
    <div>
      <div className="row no-print" style={{ marginBottom: '.75rem' }}>
        <label className="row small"><input type="checkbox" checked={anno} onChange={(e) => setAnno(e.target.checked)} /> Show annotations (annotated label)</label>
        {(doc.kind === 'smpc' || doc.kind === 'pl') && <label className="row small"><input type="checkbox" checked={epi} onChange={(e) => setEpi(e.target.checked)} /> ePI view (simplified, Watch)</label>}
        {epi && <button className="btn small" onClick={() => download(`${slug(doc.title)}-epi-view.html`, epiHtml(doc), 'text/html')}>Download ePI view (HTML)</button>}
        <button className="btn small" onClick={() => window.print()}>Print</button>
      </div>
      <article className="label-paper" aria-label={`Preview of ${doc.title}`}>
        <p className="watermark">Training use only · fictional product · not an approved label</p>
        {doc.kind === 'pi' ? (<>
          <div className="hl">
            <h4 style={{ borderBottom: 0 }}>HIGHLIGHTS OF PRESCRIBING INFORMATION</h4>
            <p>{doc.hl?.limitation}</p>
            <p><b>{m.proprietaryName} ({m.establishedName}) {m.dosageForm}, {m.route}{m.controlled ? ` ${m.controlled}` : ''}</b><br />Initial U.S. Approval: {m.initialApproval}</p>
            {doc.hl?.bio && <p><b>{doc.hl.bio}</b></p>}
            {doc.hl?.bioNote && <p style={{ fontSize: '.75rem' }}>{doc.hl.bioNote}</p>}
            {doc.hl?.bw?.length > 0 && <div className="bwbox"><b>{doc.bw?.title}</b><Blocks blocks={doc.hl.bw} anno={anno} /><p><i>{doc.hl.bwClose}</i></p></div>}
            {doc.hl?.rmc?.length > 0 && <><h4>RECENT MAJOR CHANGES</h4>{doc.hl.rmc.map((r, i) => <p key={i}>{r.heading}{r.num ? ` (${r.num})` : ''} <span style={{ float: 'right' }}>{r.date}</span></p>)}</>}
            {t.hl.filter((h) => h.kind !== 'rmc' && hasContent(doc.hl?.[h.key])).map((h) => <React.Fragment key={h.key}><h4>{h.title}</h4><Blocks blocks={doc.hl[h.key]} anno={anno} /></React.Fragment>)}
            <p><b>{doc.hl?.pci}</b></p>
            <p><b>Revised: {m.revised}</b></p>
          </div>
          <h3 style={{ marginTop: '1.25rem' }}>FULL PRESCRIBING INFORMATION: CONTENTS</h3>
          <ul style={{ columns: 2, fontSize: '.8rem', fontFamily: 'var(--font)' }}>
            {doc.bw && <li>{doc.bw.title}</li>}
            {(doc.sections ?? []).map((s) => <li key={s.num}>{sectionTitle(s)}{(s.subs ?? []).map((x) => <div key={x.num} style={{ paddingLeft: '1rem' }}>{sectionTitle(x)}</div>)}</li>)}
          </ul>
          <h3>FULL PRESCRIBING INFORMATION</h3>
          {doc.bw && <div className="bwbox"><b>{doc.bw.title}</b><Blocks blocks={doc.bw.blocks} anno={anno} /></div>}
          {(doc.sections ?? []).map((s) => (
            <section key={s.num}>
              <h3>{sectionTitle(s)}</h3>
              <Blocks blocks={s.blocks} anno={anno} />
              {(s.subs ?? []).map((x) => <div key={x.num}><h4>{sectionTitle(x)}</h4><Blocks blocks={x.blocks} anno={anno} /></div>)}
            </section>
          ))}
        </>) : epi ? <EpiView doc={doc} /> : (<>
          {doc.fixed?.title && <h2 style={{ textAlign: 'center' }}>{doc.fixed.title}</h2>}
          {doc.kind === 'jp-pi' && <table><tbody>{JP_HDR.map(([k, l]) => <tr key={k}><td>{l}</td><td>{doc.fixed?.[k]}</td></tr>)}</tbody></table>}
          {doc.fixed?.header && (red ? <p style={{ textAlign: 'center', fontWeight: 700 }}>{doc.fixed.header}</p> : <h2 style={{ textAlign: 'center' }}>{doc.fixed.header}</h2>)}
          {doc.fixed?.nameLine ? <p style={{ textAlign: 'center', whiteSpace: 'pre-line' }}><b>{doc.fixed.nameLine}</b></p> : <p style={{ textAlign: 'center' }}>{m.scheduleSymbol && <sup>{m.scheduleSymbol}</sup>}<b>{m.proprietaryName}</b> ({m.establishedName}) {m.dosageForm}</p>}
          {doc.fixed?.blackTriangle && <p><b>{doc.fixed.blackTriangle}</b></p>}
          {doc.fixed?.readFirst && <div className="bwbox"><p>{doc.fixed.readFirst}</p></div>}
          {doc.fixed?.readThis && <p style={{ textAlign: 'center' }}><b>{doc.fixed.readThis}</b></p>}
          {doc.fixed?.intro && <p><i>{doc.fixed.intro}</i></p>}
          {doc.fixed?.summaryIntro && <p><i>{doc.fixed.summaryIntro}</i></p>}
          {(doc.sections ?? []).map((s) => (
            <section key={s.num}>
              {PARTS[doc.kind]?.[s.num] && <h2>{PARTS[doc.kind][s.num]}</h2>}
              <h3>{/^\d/.test(s.num) && (EU.includes(doc.kind) || red || NUMBERED.includes(doc.kind)) ? sectionTitle(s) : s.title}</h3>
              <Blocks blocks={s.blocks} anno={anno} red={red} />
              {(s.subs ?? []).map((x) => <div key={x.num}><h4>{/^\d/.test(x.num) ? sectionTitle(x) : x.title}</h4><Blocks blocks={x.blocks} anno={anno} red={red} /></div>)}
            </section>
          ))}
          {doc.fixed?.sideEffects && <p><b>{doc.fixed.sideEffects}</b></p>}
          {doc.fixed?.approval && <p style={{ fontSize: '.8rem' }}>{doc.fixed.approval} Revised: {m.revised}</p>}
          {doc.fixed?.lastRevised && <p style={{ fontSize: '.85rem' }}>{doc.fixed.lastRevised}</p>}
          {doc.fixed?.prepared && <p style={{ fontSize: '.85rem' }}>{doc.fixed.prepared}</p>}
          {doc.fixed?.lastChecked && <p style={{ fontSize: '.85rem' }}>{doc.fixed.lastChecked}</p>}
        </>)}
      </article>
    </div>
  );
}
