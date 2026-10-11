"""Build the US pack into src/packs/us/. Run: python3 tools/packs/us.py"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from lib import write
from us_core import PACK, TEMPLATES, RULES, ABBREVIATIONS, JARGON
from us_samples import SAMPLES

src_ids = {s['id'] for s in PACK['sources']}
for r in RULES:
    assert r['src'] in src_ids, f"rule {r['id']} cites unknown source {r['src']}"
    assert r.get('at'), f"rule {r['id']} has no citation"
for t in TEMPLATES.values():
    assert t['src'] in src_ids
    for f in t.get('fields', []):
        assert f['src'] in src_ids
for w in PACK['watch']:
    assert w['src'] in src_ids
rule_ids = {r['id'] for r in RULES}
for s in SAMPLES:
    for d in s['docs']:
        for k in d.get('answerKey', []):
            assert k['rule'] in rule_ids, k

for s_ in SAMPLES:
    for d in s_['docs']:
        if d['kind'] == 'pi':
            hl = d['hl']
            if hl.pop('bwNoClose', False):
                hl['bwClose'] = ''
            elif 'bwClose' not in hl:
                hl['bwClose'] = TEMPLATES['pi']['fixed']['bwClose'] if d.get('bw') else ''

write('us', 'pack.json', PACK)
write('us', 'templates.json', TEMPLATES)
write('us', 'rules.json', RULES)
write('us', 'vocab.json', {'abbreviations': ABBREVIATIONS, 'jargon': JARGON})
write('us', 'samples.json', SAMPLES)

try:
    from us_learn import LESSONS, QUIZ, DRILLS, GLOSSARY
    write('us', 'lessons.json', LESSONS)
    write('us', 'quiz.json', QUIZ)
    write('us', 'drills.json', DRILLS)
    write('us', 'glossary.json', GLOSSARY)
except ImportError:
    print('learning content not built yet')
print(f"US pack {PACK['version']}: {len(RULES)} rules, {len(SAMPLES)} sample projects")
