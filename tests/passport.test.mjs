// Skills Passport record: one per region certificate; seal and code recompute.
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { lwRecord, sealOf, LW_CERT_NAME } from '../src/engine/passport.js';
import { verificationCode } from '../src/engine/certificate.js';
import { sha256 } from '../src/engine/sha256.js';

const status = { region: 'eu', lessons: [{ id: 30, best: 90 }], drills: [{ id: 'eu-cap', best: 100 }], quiz: { score: 85 }, criteria: [{ label: 'Lessons', done: 1, of: 1 }, { label: 'Quiz', done: 1, of: 1 }, { label: 'Capstone', done: 1, of: 1 }], eligible: true };
const r = lwRecord({ name: 'Asha Rao', userId: 'u-123', status, date: '2026-11-09' });
assert.equal(r.certificate, LW_CERT_NAME.eu);
assert.equal(r.code, verificationCode({ name: 'Asha Rao', userId: 'u-123', status, date: '2026-11-09' }));
const h = sha256(r.basis).toUpperCase();
assert.equal(r.code, `LW-${h.slice(0, 4)}-${h.slice(4, 8)}-${h.slice(8, 12)}`);
assert.equal(r.seal, sealOf(r));
assert.ok(r.criteria.every((c) => c.met));
if (process.env.PASSPORT_FIXTURES) writeFileSync(`${process.env.PASSPORT_FIXTURES}/lw-eu.json`, JSON.stringify(r, null, 2));
console.log('passport: 5 checks passed');
