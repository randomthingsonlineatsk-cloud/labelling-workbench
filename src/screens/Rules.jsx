import React, { useState } from 'react';
import { useApp } from '../ctx.js';
import { packAgeMonths, sourceOf } from '../engine/pack.js';
import { KIND_LABEL } from '../engine/model.js';

export default function Rules() {
  const { pack } = useApp();
  const [kind, setKind] = useState('');
  const rules = pack.rules.filter((r) => !kind || r.kinds.includes(kind));
  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <h1>Rules and sources</h1>
      <div className="cat-grid" style={{ marginBottom: '1.25rem' }}>
        {Object.values(pack.regions).map((r) => (
          <div key={r.id} className="panel">
            <h2 style={{ fontSize: 'var(--step-1)' }}>{r.name}</h2>
            <p className="small">Version <b>{r.version}</b>, as of <b>{r.asOf}</b>. {pack.rules.filter((x) => x.id.startsWith(`${r.id.toUpperCase()}-`)).length} rule cards, {pack.samples.filter((x) => (x.region ?? 'us') === r.id).length} sample projects.</p>
            <p className="small">{r.about}</p>
            <details className="small">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>About this pack: sources and change log</summary>
              <h3 style={{ fontSize: '1rem', margin: '.5rem 0 .25rem' }}>Sources</h3>
              <ul style={{ margin: 0 }}>{(r.sources ?? []).map((id) => { const s = sourceOf(pack, id); return <li key={id}>{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}</li>; })}</ul>
              <h3 style={{ fontSize: '1rem', margin: '.5rem 0 .25rem' }}>Change log</h3>
              <ul style={{ margin: 0 }}>{(r.changes ?? []).map((c) => <li key={c.version}><b>{c.version}</b> ({c.date}): {c.notes}</li>)}</ul>
            </details>
          </div>
        ))}
        <div className="panel">
          <h2 style={{ fontSize: 'var(--step-1)' }}>{pack.core.name}</h2>
          <p className="small">Version <b>{pack.core.version}</b>, as of <b>{pack.core.asOf}</b>. {pack.rules.filter((x) => x.id.startsWith('CORE-')).length} rule cards; applies to every region.</p>
          <p className="small">{pack.core.about}</p>
          <details className="small"><summary style={{ cursor: 'pointer', fontWeight: 600 }}>About this pack: change log</summary><ul style={{ margin: 0 }}>{(pack.core.changes ?? []).map((c) => <li key={c.version}><b>{c.version}</b> ({c.date}): {c.notes}</li>)}</ul></details>
        </div>
      </div>
      <p className="small muted">Packs are built by generator scripts (tools/packs/us.py, core.py, eu.py, in.py, intl.py) and every rule must cite a source or the build fails. The oldest pack is {packAgeMonths(pack)} month(s) old.</p>
      <h2 style={{ fontSize: 'var(--step-2)' }}>Watch items</h2>
      <p className="small muted">Rules that are proposed or changing. The app teaches them but never reports them as errors.</p>
      <div className="cat-grid" style={{ marginBottom: '1.5rem' }}>
        {pack.watch.map((w) => { const s = sourceOf(pack, w.src); return <div key={w.id} className="card"><span className="kicker">Watch · {{ eu: 'EU', in: 'India', ca: 'Canada', ch: 'Switzerland', jp: 'Japan', au: 'Australia', who: 'WHO PQ' }[w.region] ?? 'US'}</span><h3>{w.title}</h3><p className="small" style={{ margin: 0 }}>{w.text}</p><a className="small" href={s.url} target="_blank" rel="noreferrer">{s.title}</a></div>; })}
      </div>
      <div className="section-head"><h2 style={{ margin: 0, fontSize: 'var(--step-2)' }}>Rule cards</h2>
        <label className="field" style={{ minWidth: 240 }}>Applies to
          <select value={kind} onChange={(e) => setKind(e.target.value)}><option value="">All labels</option>{[...new Set(Object.values(pack.kindsByRegion).flat())].map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}</select>
        </label>
      </div>
      <div className="issues">
        {rules.map((r) => {
          const s = sourceOf(pack, r.src);
          return (
            <div key={r.id} className={`issue ${r.severity}`} style={{ gridTemplateColumns: '1fr' }}>
              <div>
                <div className="where">{r.id} · {r.severity === 'info' ? 'hint' : r.severity} · {r.kinds.map((k) => KIND_LABEL[k]).join(', ')}</div>
                <div className="msg">{r.title}</div>
                <p className="small" style={{ margin: '.2rem 0' }}>{r.text}</p>
                <p className="small" style={{ margin: 0 }}>Source: <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>, {r.at}.</p>
                {r.simplified && <p className="simplified small" style={{ margin: '.3rem 0 0' }}><b>Simplified:</b> {r.simplified}</p>}
              </div>
            </div>
          );
        })}
      </div>
      <h2 style={{ fontSize: 'var(--step-2)', marginTop: '1.5rem' }}>Sources</h2>
      <ul className="small">{pack.sources.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.title}</a></li>)}</ul>
    </div>
  );
}
