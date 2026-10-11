import React from 'react';

const MISSING = (label) => <span className="missing-field">[{label} missing]</span>;

// A schematic carton: principal display panel on the left, side panel on the right. Type sizes
// are drawn in proportion (1 pt shown as about 1.3 px) so the established-name rule is visible.
export default function CartonMock({ doc, fields }) {
  const f = fields ?? doc.fields ?? {};
  const s = doc.sizes ?? {};
  const px = (pt, d) => `${Math.max(7, (pt || d) * 1.3)}px`;
  const bars = [3, 1, 2, 1, 1, 3, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 1, 2];
  return (
    <div className="carton" role="img" aria-label={`Mock-up of the ${doc.kind}: ${f.proprietaryName ?? ''} ${f.strength ?? ''}`}>
      <div className="pdp">
        <div className="band" style={{ background: doc.colour ?? '#23615c' }} />
        <div className="ndc">{f.ndc || MISSING('NDC')}</div>
        <div className="pn" style={{ fontSize: px(s.proprietaryName, 18) }}>{f.proprietaryName || MISSING('Proprietary name')}</div>
        <div style={{ fontSize: px(s.establishedName, 10) }}>{f.establishedName || MISSING('Established name')}</div>
        <div className="str" style={{ fontSize: px(s.strength, 14), color: doc.colour ?? '#23615c' }}>{f.strength || MISSING('Strength')}</div>
        <div style={{ fontSize: '.8rem' }}>{f.route || MISSING('Route')}</div>
        <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{f.netQuantity || MISSING('Net quantity')}</div>
        {f.mgStatement && <div style={{ fontSize: '.72rem', fontWeight: 700, border: '1px solid #111', padding: '.2rem .35rem' }}>{f.mgStatement}</div>}
        <div className="rx">{f.rxOnly || MISSING('Rx only')}</div>
      </div>
      <div className="side">
        <div>{f.dosageStatement || (doc.kind === 'carton' ? MISSING('Dosage statement') : null)}</div>
        <div>{f.storage || MISSING('Storage')}</div>
        <div>{f.manufacturer || MISSING('Manufacturer')}</div>
        <div style={{ fontFamily: 'var(--mono)' }}>{f.lot || MISSING('Lot')}<br />{f.expiry || MISSING('Expiry')}</div>
        <div className="row" style={{ alignItems: 'flex-end', gap: '.6rem' }}>
          {doc.barcode ? <div className="barcode" aria-hidden="true">{bars.map((w, i) => <span key={i} style={{ width: w }} />)}</div> : <span className="missing-field">[no linear bar code]</span>}
          {doc.twoD && <div className="dm" aria-hidden="true" />}
        </div>
      </div>
    </div>
  );
}
