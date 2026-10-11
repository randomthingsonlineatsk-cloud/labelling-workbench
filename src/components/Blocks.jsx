import React, { useState } from 'react';
import { newBlock } from '../engine/model.js';

const TYPE_LABEL = { p: 'Paragraph', ul: 'List', table: 'Table', box: 'Boxed text' };

// Edits a list of blocks. Lists are one item per line; tables are one row per line with cells
// separated by " | ". Each block can carry an annotation (the source of the statement).
export default function Blocks({ blocks = [], onChange, readOnly = false, label = 'Text', types = ['p', 'ul', 'table'], idPrefix = '' }) {
  const [notesOpen, setNotesOpen] = useState({});
  const set = (i, b) => onChange(blocks.map((x, j) => (j === i ? b : x)));
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= blocks.length) return; const n = [...blocks]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); };
  const del = (i) => onChange(blocks.filter((_, j) => j !== i));
  return (
    <div>
      {blocks.map((b, i) => {
        const id = `${idPrefix}${b.id}`;
        const value = b.t === 'ul' ? (b.items ?? []).join('\n') : b.t === 'table' ? (b.rows ?? []).map((r) => r.join(' | ')).join('\n') : b.text ?? '';
        const onText = (v) => {
          if (b.t === 'ul') set(i, { ...b, items: v.split('\n') });
          else if (b.t === 'table') set(i, { ...b, rows: v.split('\n').map((r) => r.split('|').map((c) => c.trim())) });
          else set(i, { ...b, text: v });
        };
        const rows = Math.min(14, Math.max(3, Math.ceil(value.length / 90) + value.split('\n').length));
        return (
          <div key={b.id} className={`block ${b.t === 'box' ? 'box' : ''}`} id={id}>
            <div className="block-bar">
              <span className="k">{TYPE_LABEL[b.t]}{b.t === 'ul' ? ' · one item per line' : b.t === 'table' ? ' · one row per line, cells split by |' : ''}</span>
              {!readOnly && <>
                <button type="button" className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${TYPE_LABEL[b.t].toLowerCase()} ${i + 1} up`}>↑</button>
                <button type="button" className="icon-btn" onClick={() => move(i, 1)} disabled={i === blocks.length - 1} aria-label={`Move ${TYPE_LABEL[b.t].toLowerCase()} ${i + 1} down`}>↓</button>
              </>}
              <button type="button" className="icon-btn" onClick={() => setNotesOpen({ ...notesOpen, [b.id]: !notesOpen[b.id] })} aria-expanded={!!(notesOpen[b.id] || b.note)}>{b.note ? 'Annotation ✓' : 'Annotate'}</button>
              {!readOnly && <button type="button" className="icon-btn" onClick={() => del(i)} aria-label={`Delete ${TYPE_LABEL[b.t].toLowerCase()} ${i + 1}`}>Delete</button>}
            </div>
            <textarea className={b.t === 'table' ? 'table-src' : ''} value={value} rows={rows} readOnly={readOnly} onChange={(e) => onText(e.target.value)} aria-label={`${label}: ${TYPE_LABEL[b.t].toLowerCase()} ${i + 1}`} spellCheck />
            {(notesOpen[b.id] || b.note) && (
              <label className="note-field small" style={{ display: 'block' }}>
                <span className="sr-only">Annotation for {TYPE_LABEL[b.t].toLowerCase()} {i + 1}</span>
                <input type="text" value={b.note ?? ''} readOnly={readOnly} placeholder="Source of this statement: study, CCDS section, agency request…" onChange={(e) => set(i, { ...b, note: e.target.value })} />
              </label>
            )}
          </div>
        );
      })}
      {!readOnly && (
        <div className="row small">
          <span className="muted">Add:</span>
          {types.map((t) => <button type="button" key={t} className="icon-btn" onClick={() => onChange([...blocks, newBlock(t)])}>+ {TYPE_LABEL[t]}</button>)}
        </div>
      )}
    </div>
  );
}
