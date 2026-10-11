import React, { useMemo, useState } from 'react';
import { useApp } from '../ctx.js';
import { certificateStatus, verificationCode } from '../engine/certificate.js';
import { download } from '../engine/io.js';

export default function Progress() {
  const { pack, attempts, lessonsDone, user, updateUser, toast, projects, docs } = useApp();
  const statuses = useMemo(() => ['us', 'core', 'eu'].map((region) => certificateStatus({ region, lessons: pack.lessons, drills: pack.drills, attempts, lessonsDone })), [pack, attempts, lessonsDone]);
  const status = { lessons: statuses.flatMap((s) => s.lessons), drills: statuses.flatMap((s) => s.drills), quiz: statuses[0].quiz };
  const [name, setName] = useState(user?.displayName ?? '');
  const approved = docs.filter((d) => d.status === 'approved').length;
  const make = async (st) => {
    if (name.trim().length < 2) { toast('Type your name as it should appear.', 'warn'); return; }
    await updateUser({ displayName: name.trim() });
    const date = new Date().toISOString().slice(0, 10);
    const code = verificationCode({ name, userId: user.userId, status: st, date });
    const { certificatePdf } = await import('../engine/pdf.js');
    download(`labelling-workbench-${st.region}-certificate-${date}.pdf`, new Blob([await certificatePdf({ name, userId: user.userId, status: st, code, region: pack.short, date })], { type: 'application/pdf' }));
  };
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <h1>Progress</h1>
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <div className="panel"><div className="score-big" style={{ fontSize: 'var(--step-3)', fontWeight: 800 }}>{status.lessons.filter((l) => l.best >= 80).length}/{status.lessons.length}</div><span className="small muted">lesson checks passed</span></div>
        <div className="panel"><div style={{ fontSize: 'var(--step-3)', fontWeight: 800 }}>{status.drills.filter((d) => d.best !== null).length}/{status.drills.length}</div><span className="small muted">drills attempted</span></div>
        <div className="panel"><div style={{ fontSize: 'var(--step-3)', fontWeight: 800 }}>{projects.length}</div><span className="small muted">projects · {approved} label version(s) approved</span></div>
      </div>
      <label className="field" style={{ maxWidth: 360, marginBottom: '1rem' }}>Name on the certificates <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></label>
      {statuses.map((st) => (
        <section key={st.region} style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: 'var(--step-2)' }}>{st.region === 'core' ? 'Core data sheet and change management certificate' : st.region === 'eu' ? 'EU product information certificate' : 'US labelling certificate'}</h2>
          <ul className="checks" style={{ marginBottom: '.75rem' }}>
            {st.criteria.map((c) => (
              <li key={c.id}><span className={`tick ${c.done >= c.of ? 'on' : ''}`} aria-hidden="true">{c.done >= c.of ? '✓' : ''}</span><span>{c.id === 'quiz' && st.region !== 'us' ? c.label.replace('A mixed quiz round', `An ${st.region === 'eu' ? 'EU' : 'core'} module quiz round`.replace('An core', 'A core')) : c.label}: <b>{c.done} of {c.of}</b></span></li>
            ))}
          </ul>
          <div className="row"><button className="btn primary" disabled={!st.eligible} onClick={() => make(st)}>Download certificate PDF</button>{!st.eligible && <span className="small muted">Opens when every criterion is met.</span>}</div>
        </section>
      ))}
      <p className="small muted">The certificate is a portfolio exercise, not an accreditation. Its verification code is a hash of your name, learner ID, date and scores.</p>
      <h3>Lessons</h3>
      <div className="table-wrap"><table className="data"><thead><tr><th>Lesson</th><th>Best check</th></tr></thead><tbody>{status.lessons.map((l) => <tr key={l.id}><td><a href={`#/learn/${l.id}`}>{l.id}. {l.title}</a></td><td>{l.best === null ? '—' : `${l.best}%`}</td></tr>)}</tbody></table></div>
      <h3 style={{ marginTop: '1.25rem' }}>Drills</h3>
      <div className="table-wrap"><table className="data"><thead><tr><th>Drill</th><th>Best</th></tr></thead><tbody>{status.drills.map((d) => <tr key={d.id}><td>{d.title}{d.capstone ? ' (capstone)' : ''}</td><td>{d.best === null ? '—' : `${d.best}%`}</td></tr>)}</tbody></table></div>
      <h3 style={{ marginTop: '1.25rem' }}>Quiz rounds</h3>
      <p className="small">{attempts.filter((a) => a.kind === 'quiz').length} saved; best mixed round {status.quiz ? `${status.quiz.score}%` : '—'}.</p>
      <p className="small muted">Learner ID {user?.userId}. Your progress is stored in this browser only; download project files to keep your work.</p>
    </div>
  );
}
