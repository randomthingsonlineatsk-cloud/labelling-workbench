import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { templateFor } from '../../engine/pack.js';
import { sectionTitle, hasContent } from '../../engine/model.js';
import CartonMock from '../../components/CartonMock.jsx';
import { epiSections, epiHtml } from '../../engine/epi.js';
import { download, slug } from '../../engine/io.js';

const EU = ['smpc', 'pl', 'eu-outer', 'eu-blister'];

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

function Blocks({ blocks, anno }) {
  return (blocks ?? []).map((b) => (
    <React.Fragment key={b.id}>
      {b.t === 'ul' ? <ul>{b.items.filter((x) => x.trim()).map((x, i) => <li key={i}>{x}</li>)}</ul>
        : b.t === 'table' ? <table><tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>
          : b.t === 'box' ? <div className="bwbox">{b.text}</div>
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
          {doc.fixed?.header && <h2 style={{ textAlign: 'center' }}>{doc.fixed.header}</h2>}
          {doc.fixed?.nameLine ? <p style={{ textAlign: 'center', whiteSpace: 'pre-line' }}><b>{doc.fixed.nameLine}</b></p> : <p style={{ textAlign: 'center' }}><b>{m.proprietaryName}</b> ({m.establishedName}) {m.dosageForm}</p>}
          {doc.fixed?.blackTriangle && <p><b>{doc.fixed.blackTriangle}</b></p>}
          {doc.fixed?.readFirst && <div className="bwbox"><p>{doc.fixed.readFirst}</p></div>}
          {(doc.sections ?? []).map((s) => (
            <section key={s.num}>
              <h3>{/^\d/.test(s.num) && EU.includes(doc.kind) ? sectionTitle(s) : s.title}</h3>
              <Blocks blocks={s.blocks} anno={anno} />
              {(s.subs ?? []).map((x) => <div key={x.num}><h4>{/^\d/.test(x.num) ? sectionTitle(x) : x.title}</h4><Blocks blocks={x.blocks} anno={anno} /></div>)}
            </section>
          ))}
          {doc.fixed?.sideEffects && <p><b>{doc.fixed.sideEffects}</b></p>}
          {doc.fixed?.approval && <p style={{ fontSize: '.8rem' }}>{doc.fixed.approval} Revised: {m.revised}</p>}
          {doc.fixed?.lastRevised && <p style={{ fontSize: '.85rem' }}>{doc.fixed.lastRevised}</p>}
        </>)}
      </article>
    </div>
  );
}
