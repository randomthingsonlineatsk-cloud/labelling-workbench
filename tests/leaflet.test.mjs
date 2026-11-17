// The leaflet export for the Plain Language Lab; also writes the Ostrevia worked examples into the
// Lab (src/domain/leaflets.json) when that repo sits beside this one.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { leafletFile, LEAFLET_KIND } from '../src/engine/leaflet.js';

const eu = JSON.parse(readFileSync(new URL('../src/packs/eu/samples.json', import.meta.url)));
const us = JSON.parse(readFileSync(new URL('../src/packs/us/samples.json', import.meta.url)));
const pl = eu.find((s) => s.id === 'eu-ostrevia-clean').docs.find((d) => d.kind === 'pl');
const mg = us.find((s) => s.id === 'ostrevia-clean').docs.find((d) => d.kind === 'mg');
const a = leafletFile(pl), b = leafletFile(mg);
assert.equal(a.kind, LEAFLET_KIND);
assert.equal(a.region, 'eu'); assert.equal(b.region, 'us');
assert.ok(a.sections.length >= 6 && a.sections.every((s) => s.heading));
assert.ok(a.sections.some((s) => /Do not take/.test(s.heading)));
assert.ok(b.sections.some((s) => /most important information/i.test(s.heading)));
assert.throws(() => leafletFile({ kind: 'pi', sections: [] }));
const lab = new URL('../../plain-language-lab/src/domain/', import.meta.url);
if (existsSync(lab)) writeFileSync(new URL('leaflets.json', lab), JSON.stringify({ 'ostrevia-pl-eu': a, 'ostrevia-mg-us': b }, null, 2) + '\n');
console.log('leaflet: ok');
