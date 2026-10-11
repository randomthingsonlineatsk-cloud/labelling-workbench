import React, { useState } from 'react';
import { useApp } from '../../ctx.js';
import { translationPairs, translationFindings, sourceOfTranslation, termBaseFor } from '../../engine/checks-eu.js';
import { sectionTitle } from '../../engine/model.js';
import { RuleCard } from '../../components/ui.jsx';

const clone = (x) => JSON.parse(JSON.stringify(x));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Highlights term-base words in a text.
function Marked({ text, terms }) {
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map(esc).join('|')})`, 'gi');
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <React.Fragment key={i}>{part}</React.Fragment>))}</>;
}

export default function Translation({ doc, docs, project, ctx, setTab }) {
  const { pack, saveProject, toast } = useApp();
  const src = sourceOfTranslation(doc, docs);
  const lang = doc.meta?.lang ?? 'fr';
  const terms = termBaseFor({ pack, project }, lang);
  const [add, setAdd] = useState({ source: '', target: '' });
  if (!src) return <p>The source document for this translation is not in the project.</p>;
  const findings = translationFindings(doc, { ...ctx, project });
  const pairs = translationPairs(doc, src);
  return (
    <div style={{ maxWidth: 1200 }}>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Translation review: {pack.langs?.[lang] ?? lang}</h2>
      <p className="small muted">Source: {src.title}. Each section is compared with its source: approved terms from the term base, every number, and missing sections. Edit the translation on the Edit tab; answer the member state's comments on the Agency comments tab.</p>
      <div className="grid-2" style={{ alignItems: 'start', margin: '.75rem 0' }}>
        <RuleCard pack={pack} id="EU-TR-TERM" />
        <RuleCard pack={pack} id="EU-TR-NUM" />
      </div>
      <p><b>{findings.length ? `${findings.length} finding(s)` : 'No findings: the translation matches the source.'}</b></p>
      {pairs.map((p) => {
        const f = findings.filter((x) => x.loc.key === p.num);
        return (
          <div key={p.num} className="cmp-row" style={f.length ? { borderLeft: '3px solid var(--high)', paddingLeft: '.6rem' } : undefined}>
            <div className="grid-2" style={{ alignItems: 'start' }}>
              <div lang="en"><b className="small">{sectionTitle(p.src)}</b><p className="small" style={{ whiteSpace: 'pre-line', margin: '.2rem 0' }}><Marked text={p.srcText.split('\n').slice(1).join('\n')} terms={terms.map((t) => t.source)} /></p></div>
              <div lang={lang}><b className="small">{p.tgt ? sectionTitle(p.tgt) : '(missing)'}</b><p className="small" style={{ whiteSpace: 'pre-line', margin: '.2rem 0' }}><Marked text={p.tgtText.split('\n').slice(1).join('\n')} terms={terms.map((t) => t.target)} /></p></div>
            </div>
            {f.map((x, i) => <p key={i} className="small" style={{ color: 'var(--high)', margin: '.2rem 0' }}>{x.msg} <span className="muted">{x.hint}</span></p>)}
            {f.length > 0 && <button className="btn small" onClick={() => setTab('edit', { node: p.num.split('.')[0], sub: p.num.includes('.') ? p.num : undefined })}>Edit this section</button>}
          </div>
        );
      })}
      <h3 style={{ marginTop: '1.25rem' }}>Term base ({pack.langs?.[lang] ?? lang})</h3>
      <div className="table-wrap" tabIndex={0}><table className="data"><thead><tr><th>English</th><th>Approved term</th><th>Note</th></tr></thead>
        <tbody>{terms.map((t, i) => <tr key={i}><td>{t.source}</td><td lang={lang}>{t.target}</td><td className="small">{t.note ?? (i >= (pack.vocab.eu?.termBase?.[lang]?.length ?? 0) ? 'added in this project' : '')}</td></tr>)}</tbody></table></div>
      <form className="row" style={{ marginTop: '.6rem', alignItems: 'end' }} onSubmit={async (e) => { e.preventDefault(); if (!add.source.trim() || !add.target.trim()) return; const p = clone(project); p.termBase = { ...(p.termBase ?? {}), [lang]: [...(p.termBase?.[lang] ?? []), { source: add.source.trim(), target: add.target.trim() }] }; await saveProject(p); setAdd({ source: '', target: '' }); toast('Term added to this project’s term base.'); }}>
        <label className="field">English term<input type="text" value={add.source} onChange={(e) => setAdd({ ...add, source: e.target.value })} /></label>
        <label className="field">Approved translation<input type="text" lang={lang} value={add.target} onChange={(e) => setAdd({ ...add, target: e.target.value })} /></label>
        <button className="btn" type="submit">Add term</button>
      </form>
    </div>
  );
}
