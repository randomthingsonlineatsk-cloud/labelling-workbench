import React, { useState } from 'react';
import { useApp } from '../ctx.js';

export default function Glossary() {
  const { pack } = useApp();
  const [q, setQ] = useState('');
  const terms = [...pack.glossary.terms].sort((a, b) => a.term.localeCompare(b.term)).filter((t) => !q || `${t.term} ${t.def}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="page" style={{ maxWidth: 820 }}>
      <p className="small"><a href="#/learn">Learn</a> / Glossary</p>
      <h1>Glossary</h1>
      <label className="field" style={{ maxWidth: 360, marginBottom: '1rem' }}>Search <input type="search" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      <dl>
        {terms.map((t) => <div key={t.term} style={{ padding: '.5rem 0', borderTop: '1px solid var(--line)' }}><dt style={{ fontWeight: 700 }}>{t.term}</dt><dd style={{ margin: '.15rem 0 0' }}>{t.def}</dd></div>)}
      </dl>
    </div>
  );
}
