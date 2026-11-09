import React, { useMemo, useState } from 'react';
import { useApp } from '../ctx.js';
import { PRODUCTS, REGION_LABEL } from '../engine/pack.js';
import { driftOf, gapList, driftCsv, marketsFromProjects, practicePortfolio, band, CELL, FORMULA, STEPS } from '../engine/drift.js';
import { download } from '../engine/io.js';

const MARK = { aligned: '✓', justified: 'J', missing: '✗', na: '·' };
const TONE = { aligned: 'var(--ok-bg)', justified: 'var(--medium-bg)', missing: 'var(--high-bg)', na: 'transparent' };
const INK = { aligned: 'var(--ok)', justified: 'var(--medium)', missing: 'var(--high)', na: 'var(--ink-3, #888)' };

// Label Drift Monitor: one product, every market, against the core data sheet.
export default function Drift() {
  const { pack, projects, docsOf } = useApp();
  const [source, setSource] = useState('practice');
  const [productId, setProductId] = useState('nce-tablet');
  const today = new Date().toISOString().slice(0, 10);
  const data = useMemo(() => {
    if (source === 'practice') return practicePortfolio(pack);
    const r = marketsFromProjects(projects, docsOf, pack.core, productId, (m) => REGION_LABEL[m] ?? m.toUpperCase());
    return { ...r, asOf: today };
  }, [source, productId, pack, projects, docsOf, today]);
  const d = data.ccds ? driftOf(data.ccds, data.markets, data.asOf) : null;
  const gaps = d ? gapList(d, data.asOf) : [];
  const product = PRODUCTS.find((p) => p.id === (source === 'practice' ? 'nce-tablet' : productId));
  const avg = d && d.rows.length ? Math.round(d.rows.reduce((s, r) => s + r.score, 0) / d.rows.length) : null;
  return (
    <div className="page" style={{ maxWidth: 1250 }}>
      <h1>Label drift monitor</h1>
      <p>How far each market’s label has drifted from the company core data sheet (CCDS): the version each market is mapped to, every statement of the current CCDS (aligned, a justified deviation, or missing), the labelling changes still open and how old they are. Each market gets one harmonisation score. This is the gap that safety reviews, audits and inspections look at.</p>
      <section className="panel" style={{ marginBottom: '1rem' }}>
        <div className="row" style={{ gap: '1rem', flexWrap: 'wrap', alignItems: 'end' }}>
          <label className="field" style={{ minWidth: 260 }}>Data
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="practice">Practice portfolio: Ostrevia after CCDS 4.0</option>
              <option value="mine">My projects in this browser</option>
            </select>
          </label>
          {source === 'mine' && (
            <label className="field" style={{ minWidth: 220 }}>Product
              <select value={productId} onChange={(e) => setProductId(e.target.value)}>{PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.brandName}</option>)}</select>
            </label>
          )}
          {d && <button className="btn" onClick={() => download(`label-drift-${product?.brandName ?? 'product'}-${data.asOf}.csv`.toLowerCase(), driftCsv(d), 'text/csv')}>Download as CSV</button>}
        </div>
        <p className="small muted" style={{ marginBottom: 0 }}>{source === 'practice' ? `Practice data for ${product?.brandName}, as of ${data.asOf}: CCDS 4.0 (hepatitis B reactivation) became effective on 15 September 2026, after 3.0 (thrombosis) in August. Markets, statuses and dates are invented.` : 'Built from your projects for this product: labels mapped on the Core data sheet tab (US prescribing information and Medication Guide, EU and UK SmPC and leaflet), and the market rows of every labelling change. Other markets show their changes only.'}</p>
      </section>

      {!d ? (
        <section className="panel"><p>No core data sheet yet for this product in your projects. Open a core data sheet sample from the Projects page (for example “Ostrevia: roll out CCDS 4.0”), map the labels, then come back.</p></section>
      ) : (<>
        <section className="panel" style={{ marginBottom: '1rem' }}>
          <div className="row" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            <div><div className="small muted">Current CCDS</div><div style={{ fontSize: 'var(--step-2)', fontWeight: 700 }}>{d.current.v}</div><div className="small muted">effective {d.current.date}</div></div>
            <div><div className="small muted">Markets</div><div style={{ fontSize: 'var(--step-2)', fontWeight: 700 }}>{d.rows.length}</div></div>
            <div><div className="small muted">Average harmonisation</div><div style={{ fontSize: 'var(--step-2)', fontWeight: 700 }}>{avg ?? '—'}</div></div>
            <div><div className="small muted">Core safety statements missing</div><div style={{ fontSize: 'var(--step-2)', fontWeight: 700 }}>{d.rows.reduce((s, r) => s + r.ccsiMissing, 0)}</div></div>
            <div><div className="small muted">Safety changes past target</div><div style={{ fontSize: 'var(--step-2)', fontWeight: 700 }}>{d.rows.reduce((s, r) => s + r.overdue.length, 0)}</div></div>
          </div>
        </section>

        <section className="panel" style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: 'var(--step-1)' }}>Heatmap</h2>
          <p className="small muted">Columns are the statements of CCDS {d.current.v}; core safety statements (CCSI) are marked ●. ✓ aligned · J justified deviation · ✗ missing · · not mapped in this market.</p>
          <div className="table-wrap" tabIndex={0}>
            <table className="data" style={{ fontSize: 'var(--step--1)' }}>
              <thead>
                <tr>
                  <th>Market</th><th>Score</th><th>Mapped to</th><th>Open changes</th>
                  {d.statements.map((s) => <th key={s.key} title={`${s.heading}: ${s.text}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap', padding: '.3rem .15rem' }}>{s.ccsi ? '● ' : ''}{s.key}</th>)}
                </tr>
              </thead>
              <tbody>
                {d.rows.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.label}</strong></td>
                    <td><span className={`pill ${band(r.score)}`}>{r.score}</span></td>
                    <td>{r.mapped ?? '—'}{r.behind ? <div className="small" style={{ color: 'var(--high)' }}>{r.behind} behind</div> : null}</td>
                    <td className="small">{r.open.length ? r.open.map((c) => <div key={c.title}>{c.title.split(' (')[0]}: {STEPS[c.step ?? 0].toLowerCase()}{r.overdue.includes(c) ? <strong style={{ color: 'var(--high)' }}> · overdue</strong> : ''}</div>) : <span className="muted">none</span>}</td>
                    {d.statements.map((s) => { const c = r.cells?.[s.key] ?? 'na'; return <td key={s.key} title={`${s.heading}: ${CELL[c]}`} aria-label={`${s.key}: ${CELL[c]}`} style={{ background: TONE[c], color: INK[c], textAlign: 'center', fontWeight: 700 }}>{MARK[c]}</td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginBottom: 0 }}>Harmonisation score: {FORMULA} 85 and above is green, 60 to 84 amber, below 60 red. Weights are the app’s training defaults, not a regulatory standard; a company sets its own.</p>
        </section>

        <section className="panel">
          <h2 style={{ fontSize: 'var(--step-1)' }}>Gaps to close, worst first ({gaps.length})</h2>
          <div className="table-wrap" tabIndex={0}>
            <table className="data">
              <thead><tr><th>Risk</th><th>Market</th><th>Gap</th><th>Next step</th></tr></thead>
              <tbody>{gaps.map((g, i) => <tr key={i}><td><span className={`pill ${g.risk === 3 ? 'high' : g.risk === 2 ? 'medium' : 'low'}`}>{g.risk === 3 ? 'High' : g.risk === 2 ? 'Medium' : 'Low'}</span></td><td>{g.market}</td><td className="small">{g.what}</td><td className="small">{g.action}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </>)}
    </div>
  );
}
