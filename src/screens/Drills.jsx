import React from 'react';
import { useApp } from '../ctx.js';
import { openSample } from './Learn.jsx';

export default function Drills() {
  const app = useApp();
  const { pack, attempts, projects } = app;
  const start = (d) => {
    const tab = d.goal.type === 'convert' ? 'convert' : 'checks';
    openSample(app, d.sample, d.doc, tab, null, { drill: { id: d.id, startedAt: new Date().toISOString() }, title: `Drill: ${d.title}` });
  };
  return (
    <div className="page">
      <h1>Drills</h1>
      <p>Timed tasks scored by the check engine. Each opens a fresh copy of a sample with a drill bar showing the clock, the goals and your score so far; submit when you are done. Going over time is recorded but does not fail the drill.</p>
      <div className="cat-grid">
        {pack.drills.drills.map((d) => {
          const a = attempts.filter((x) => x.kind === 'drill' && x.drillId === d.id);
          const best = a.length ? Math.max(...a.map((x) => x.score)) : null;
          const openOne = projects.find((p) => p.drill?.id === d.id && !p.drill.done);
          return (
            <div key={d.id} className="card" style={d.capstone ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 1px var(--accent)' } : undefined}>
              {d.capstone && <span className="kicker">Capstone · needed for the certificate</span>}
              <h3>{d.title}</h3>
              <p className="small" style={{ margin: 0 }}>{d.about}</p>
              <p className="small muted" style={{ margin: 0 }}>{d.minutes} minutes · {best === null ? 'not attempted' : `best ${best}%`}</p>
              <div className="row">
                <button className="btn small primary" onClick={() => start(d)}>Start</button>
                {openOne && <a className="btn small" href={`#/p/${openOne.id}`}>Continue</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
