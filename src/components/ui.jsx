import React, { useEffect, useRef } from 'react';
import { ruleById, sourceOf } from '../engine/pack.js';
import { STATUS } from '../engine/model.js';

export function Mark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="6" fill="var(--ink)" />
      <path d="M8 6h12l5 5v15H8z" fill="var(--paper)" />
      <path d="M20 6v5h5z" fill="var(--accent)" />
      <rect x="11" y="13" width="11" height="5" fill="none" stroke="var(--ink)" strokeWidth="1.6" />
      <rect x="11" y="20.5" width="11" height="1.6" fill="var(--accent)" />
      <rect x="11" y="23.5" width="7" height="1.6" fill="var(--accent)" />
    </svg>
  );
}

const SEV_LABEL = { error: 'Error', warning: 'Warning', info: 'Hint' };
export const Sev = ({ s, waived }) => <span className={`sev ${waived ? 'waived' : s}`}>{waived ? 'Waived' : SEV_LABEL[s] ?? s}</span>;

export function Counts({ sum, zero = 'Clean' }) {
  if (!sum) return null;
  if (!sum.errors && !sum.warnings) return <span className="counts"><span className="sev ok">{zero}</span>{sum.info ? <span className="sev info">{sum.info} hint{sum.info > 1 ? 's' : ''}</span> : null}</span>;
  return (
    <span className="counts">
      {sum.errors ? <span className="sev error">{sum.errors} error{sum.errors > 1 ? 's' : ''}</span> : null}
      {sum.warnings ? <span className="sev warning">{sum.warnings} warning{sum.warnings > 1 ? 's' : ''}</span> : null}
    </span>
  );
}

export const StatusPill = ({ status }) => <span className={`status ${status}`}>{STATUS[status] ?? status}</span>;

export function RuleCard({ pack, id, open = false }) {
  const r = ruleById(pack, id);
  if (!r) return null;
  const s = sourceOf(pack, r.src);
  return (
    <details className="rule" open={open}>
      <summary>Rule {r.id}: {r.title}</summary>
      <p style={{ margin: '.3rem 0' }}>{r.text}</p>
      <p style={{ margin: 0 }}>Source: {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a> : s.title}, {r.at}.</p>
      {r.simplified && <p className="simplified" style={{ margin: '.3rem 0 0' }}><b>Simplified:</b> {r.simplified}</p>}
    </details>
  );
}

export function Diff({ parts }) {
  return (
    <div className="diff">
      {parts.map((p, i) => (p.op === 'same' ? <span key={i}>{p.text}</span> : p.op === 'add' ? <ins key={i}>{p.text}</ins> : <del key={i}>{p.text}</del>))}
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.querySelector('input, textarea, select, button')?.focus();
    const key = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="modal-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '');
