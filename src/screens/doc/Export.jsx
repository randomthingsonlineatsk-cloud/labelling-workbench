import React, { useMemo, useState } from 'react';
import { useApp } from '../../ctx.js';
import { splXml } from '../../engine/spl.js';
import { download, slug } from '../../engine/io.js';

export default function Export({ doc, issues, product }) {
  const { pack, toast } = useApp();
  const [busy, setBusy] = useState('');
  const xml = useMemo(() => splXml(doc, { product }), [doc, product]);
  const name = slug(`${doc.meta?.proprietaryName ?? doc.fields?.proprietaryName ?? 'label'}-${doc.title}-v${doc.version ?? 0}`);
  const run = async (what, fn) => {
    setBusy(what);
    try { const pdf = await import('../../engine/pdf.js'); download(`${name}${what === 'annotated' ? '-annotated' : what === 'report' ? '-check-report' : ''}.pdf`, new Blob([await fn(pdf)], { type: 'application/pdf' })); }
    catch (e) { toast(`Could not make the PDF: ${e.message}`, 'error'); }
    setBusy('');
  };
  return (
    <div style={{ maxWidth: 980 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Export</h2>
      <p className="small muted">Every export is marked "Training use only". The layouts are a neutral house style and do not imitate any agency format.</p>
      <div className="cat-grid" style={{ marginBottom: '1.25rem' }}>
        <div className="card"><h3>Label PDF</h3><p className="small">The label as text, watermarked, with version and status in the footer.</p><button className="btn small primary" disabled={!!busy} onClick={() => run('label', (p) => p.labelPdf(doc, pack))}>{busy === 'label' ? 'Making…' : 'Download PDF'}</button></div>
        <div className="card"><h3>Annotated label PDF</h3><p className="small">The same label with each statement's annotation (its source) printed under it.</p><button className="btn small" disabled={!!busy} onClick={() => run('annotated', (p) => p.labelPdf(doc, pack, { annotate: true }))}>{busy === 'annotated' ? 'Making…' : 'Download PDF'}</button></div>
        <div className="card"><h3>Check report PDF</h3><p className="small">Every finding with its rule, source, fix and any waiver reason.</p><button className="btn small" disabled={!!busy} onClick={() => run('report', (p) => p.checkReportPdf(doc, pack, issues))}>{busy === 'report' ? 'Making…' : 'Download PDF'}</button></div>
        <div className="card"><h3>Practice SPL-style XML</h3><p className="small">Sections with LOINC codes, in the general shape of an SPL file. Not validated; never submit it.</p><button className="btn small" onClick={() => download(`${name}-practice-spl.xml`, xml, 'application/xml')}>Download XML</button></div>
      </div>
      <p className="small muted">The Module 1 labelling package for the eCTD Dossier Builder arrives in Phase 2. The whole project (all labels, versions, reviews and the audit trail) downloads from the button at the top of the page.</p>
      <details>
        <summary className="small" style={{ cursor: 'pointer', fontWeight: 600 }}>Show the XML</summary>
        <pre className="panel" style={{ overflow: 'auto', maxHeight: '60vh', fontSize: '.75rem' }}>{xml}</pre>
      </details>
    </div>
  );
}
