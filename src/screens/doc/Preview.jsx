import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { templateFor } from '../../engine/pack.js';
import { sectionTitle, hasContent } from '../../engine/model.js';
import CartonMock from '../../components/CartonMock.jsx';

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
  const m = doc.meta ?? {};
  if (doc.kind === 'carton' || doc.kind === 'container') return <div><CartonMock doc={doc} /><p className="small muted" style={{ marginTop: '.5rem' }}>Schematic only. Export a PDF from the Export tab.</p></div>;
  const t = templateFor(pack, doc.kind);
  return (
    <div>
      <div className="row no-print" style={{ marginBottom: '.75rem' }}>
        <label className="row small"><input type="checkbox" checked={anno} onChange={(e) => setAnno(e.target.checked)} /> Show annotations (annotated label)</label>
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
        </>) : (<>
          {doc.fixed?.header && <h2 style={{ textAlign: 'center' }}>{doc.fixed.header}</h2>}
          <p style={{ textAlign: 'center' }}><b>{m.proprietaryName}</b> ({m.establishedName}) {m.dosageForm}</p>
          {(doc.sections ?? []).map((s) => <section key={s.num}><h3>{s.title}</h3><Blocks blocks={s.blocks} anno={anno} /></section>)}
          {doc.fixed?.sideEffects && <p><b>{doc.fixed.sideEffects}</b></p>}
          {doc.fixed?.approval && <p style={{ fontSize: '.8rem' }}>{doc.fixed.approval} Revised: {m.revised}</p>}
        </>)}
      </article>
    </div>
  );
}
