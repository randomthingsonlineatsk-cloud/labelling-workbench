"""Build the EU pack into src/packs/eu/. Run: python3 tools/packs/eu.py"""
import os
import re
import sys
sys.path.insert(0, os.path.dirname(__file__))

from lib import write
from eu_core import PACK, TEMPLATES, RULES, EXCIPIENTS, FREQUENCIES, NONSTANDARD_FREQ, PROMO, TERM_BASE, LANGS
from eu_samples import SAMPLES, AGENCY
from eu_learn import LESSONS, QUESTIONS, DRILLS, GLOSSARY

src_ids = {s['id'] for s in PACK['sources']}
for r in RULES:
    assert r['src'] in src_ids, f"rule {r['id']} cites unknown source {r['src']}"
for w in PACK['watch']:
    assert w['src'] in src_ids
for t in TEMPLATES.values():
    assert t['src'] in src_ids
for e in EXCIPIENTS:
    for k in ('pl', 'smpc', 'carton'):
        if k in e:
            re.compile(e[k], re.I)
rule_ids = {r['id'] for r in RULES}
sample_docs = {s['id']: {d['id'] for d in s['docs']} for s in SAMPLES}
for s in SAMPLES:
    for d in s['docs']:
        for k in d.get('answerKey', []):
            assert k['rule'] in rule_ids, k
for d in DRILLS:
    assert d['sample'] in sample_docs, d['id']
    for doc in [d['doc'], *d['goal'].get('docs', [])]:
        assert doc in sample_docs[d['sample']], (d['id'], doc)

quiz = []
for i, q in enumerate(QUESTIONS):
    k = i % len(q['options'])
    opts = q['options'][k:] + q['options'][:k]
    quiz.append({**q, 'options': opts, 'answer': opts.index(q['options'][q['answer']])})
for l in LESSONS:
    assert sum(1 for q in quiz if q['topic'] == l['id']) >= 4, l['id']

write('eu', 'pack.json', {**PACK, 'langs': LANGS})
write('eu', 'templates.json', TEMPLATES)
write('eu', 'rules.json', RULES)
write('eu', 'vocab.json', {'excipients': EXCIPIENTS, 'frequencies': FREQUENCIES, 'nonstandardFrequencies': NONSTANDARD_FREQ, 'promo': PROMO, 'termBase': TERM_BASE})
write('eu', 'samples.json', SAMPLES)
write('eu', 'agency.json', AGENCY)
write('eu', 'lessons.json', {'lessons': LESSONS})
write('eu', 'quiz.json', {'topics': [{'id': l['id'], 'label': f"{l['id']}. {l['title']}", 'module': 'eu'} for l in LESSONS], 'questions': quiz})
write('eu', 'drills.json', {'drills': DRILLS})
write('eu', 'glossary.json', {'terms': GLOSSARY})
print(f"EU pack {PACK['version']}: {len(RULES)} rules, {len(SAMPLES)} samples, {len(LESSONS)} lessons, {len(quiz)} questions, {len(DRILLS)} drills")
