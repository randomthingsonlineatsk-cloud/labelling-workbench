import React, { useMemo, useState } from 'react';
import { useApp } from '../../ctx.js';
import { splXml } from '../../engine/spl.js';
import { download, slug } from '../../engine/io.js';
import { labellingPackage, ccsiFile, m1Section } from '../../engine/handoff.js';
import { currentVersion } from '../../engine/ccds.js';
import { uid, now } from '../../engine/model.js';
import { epiHtml } from '../../engine/epi.js';
import { go } from '../../ctx.js';

export default function Export({ doc, docs, issues, product, project }) {
  const { pack, toast, user, addDoc } = useApp();
  const eu = ['smpc', 'pl', 'eu-outer', 'eu-blister', 'in-pi', 'in-carton', 'in-label'].includes(doc.kind); // not US: no SPL, no US Module 1.14
  const [lang, setLang] = useState('fr');
  const startTranslation = async () => {
    const d = JSON.parse(JSON.stringify(doc));
    Object.assign(d, { id: uid('d'), role: 'translation', sourceDocId: doc.id, title: `${doc.title} (${pack.langs?.[lang] ?? lang})`, status: 'draft', version: 0, waivers: {}, agency: undefined, userTest: undefined, ccdsMap: undefined, sampleDocId: undefined, createdAt: now(), updatedAt: now(), meta: { ...d.meta, lang } });
    await addDoc(d, `Translation into ${pack.langs?.[lang] ?? lang} started (copy of the English to translate)`);
    go(`/p/${project.id}/${d.id}/edit`);
  };
  const [busy, setBusy] = useState('');
  const xml = useMemo(() => (eu ? '' : splXml(doc, { product })), [doc, product, eu]);
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
        {!eu && <div className="card"><h3>Practice SPL-style XML</h3><p className="small">Sections with LOINC codes, in the general shape of an SPL file. Not validated; never submit it.</p><button className="btn small" onClick={() => download(`${name}-practice-spl.xml`, xml, 'application/xml')}>Download XML</button></div>}
        {(doc.kind === 'smpc' || doc.kind === 'pl') && <div className="card"><h3>ePI view (HTML)</h3><p className="small">The document as structured sections with stable identifiers, the way an ePI is organised. Simplified; not HL7 FHIR.</p><button className="btn small" onClick={() => download(`${name}-epi-view.html`, epiHtml(doc), 'text/html')}>Download HTML</button></div>}
        {(doc.kind === 'smpc' || doc.kind === 'pl') && doc.role !== 'translation' && <div className="card"><h3>Start a translation</h3><p className="small">Copies this document as a draft translation to work on, linked to it for the translation review.</p>
          <div className="row"><select aria-label="Language" value={lang} onChange={(e) => setLang(e.target.value)}>{Object.entries(pack.langs ?? {}).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select><button className="btn small" onClick={startTranslation}>Start</button></div>
          <p className="small muted" style={{ margin: 0 }}>The practice term base covers French.</p></div>}
      </div>
      <h3>For the other apps</h3>
      <div className="cat-grid" style={{ marginBottom: '1.25rem' }}>
        {!eu && <div className="card"><h3>Module 1 labelling package</h3><p className="small">Every label in this project, placed for US Module 1.14 (this label goes to {m1Section(doc)}). In the <a href="https://randomthingsonlineatsk-cloud.github.io/ectd-dossier-builder/" target="_blank" rel="noreferrer">eCTD Dossier Builder</a>, open a US project for {product?.brandName} and use "Import labelling package" on the Sequences tab.</p><button className="btn small primary" onClick={() => download(`${slug(product?.brandName)}-labelling-package.json`, JSON.stringify(labellingPackage({ project, docs, product, pack, user }), null, 1))}>Download package</button></div>}
        {currentVersion(project?.ccds) && <div className="card"><h3>CCSI for pharmacovigilance</h3><p className="small">The core safety statements of CCDS {currentVersion(project.ccds).v}, the reference for whether a reaction is listed.</p><button className="btn small" onClick={() => download(`${slug(product?.brandName)}-ccsi.json`, JSON.stringify(ccsiFile({ project, product, user }), null, 1))}>Download CCSI file</button></div>}
      </div>
      <p className="small muted">The whole project (all labels, versions, reviews, the core data sheet, change requests and the audit trail) downloads from the button at the top of the page.</p>
      {!eu && <details>
        <summary className="small" style={{ cursor: 'pointer', fontWeight: 600 }}>Show the XML</summary>
        <pre className="panel" style={{ overflow: 'auto', maxHeight: '60vh', fontSize: '.75rem' }}>{xml}</pre>
      </details>}
    </div>
  );
}
