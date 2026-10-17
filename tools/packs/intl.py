"""Build the Phase 5 packs into src/packs/<ca|ch|jp|au|who>/ and the shared module into
src/packs/intl/. Run: python3 tools/packs/intl.py"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from lib import write
from intl_core import REGIONS, TEMPLATES, RULES, VOCAB
from intl_samples import SAMPLES
from intl_learn import LESSONS, QUESTIONS, DRILLS, GLOSSARY

sources = {s['id'] for p in REGIONS.values() for s in p['sources']}
for r in RULES:
    assert r['src'] in sources, r['id']
    for k in r['kinds']:
        assert k in TEMPLATES, (r['id'], k)
for p in REGIONS.values():
    for w in p['watch']:
        assert w['src'] in {s['id'] for s in p['sources']}, w
for t in TEMPLATES.values():
    assert t['src'] in sources, t['kind']
rule_ids = {r['id'] for r in RULES}
docs = {s['id']: {d['id'] for d in s['docs']} for s in SAMPLES}
for s in SAMPLES:
    for d in s['docs']:
        assert d['kind'] in TEMPLATES, d['kind']
        for k in d.get('answerKey', []):
            assert k['rule'] in rule_ids, k
for d in DRILLS:
    for doc in [d['doc'], *d['goal'].get('docs', [])]:
        assert doc in docs[d['sample']], (d['id'], doc)

quiz = []
for i, q in enumerate(QUESTIONS):
    k = i % len(q['options'])
    opts = q['options'][k:] + q['options'][:k]
    quiz.append({**q, 'options': opts, 'answer': opts.index(q['options'][q['answer']])})
for l in LESSONS:
    assert sum(1 for q in quiz if q['topic'] == l['id']) >= 4

region_of = lambda kind: kind.split('-')[0]
for rid, p in REGIONS.items():
    write(rid, 'pack.json', p)
    write(rid, 'templates.json', {k: v for k, v in TEMPLATES.items() if region_of(k) == rid})
    write(rid, 'rules.json', [r for r in RULES if r['id'].startswith(rid.upper() + '-')])
    write(rid, 'samples.json', [s for s in SAMPLES if s['region'] == rid])
write('intl', 'rules.json', [r for r in RULES if r['id'].startswith('INTL-')])
write('intl', 'samples.json', [s for s in SAMPLES if s['region'] == 'intl'])
write('intl', 'vocab.json', VOCAB)
write('intl', 'lessons.json', {'lessons': LESSONS})
write('intl', 'quiz.json', {'topics': [{'id': l['id'], 'label': f"{l['id']}. {l['title']}", 'module': 'intl'} for l in LESSONS], 'questions': quiz})
write('intl', 'drills.json', {'drills': DRILLS})
write('intl', 'glossary.json', {'terms': GLOSSARY})
print(f"More-markets packs {REGIONS['ca']['version']}: {len(REGIONS)} regions, {len(TEMPLATES)} kinds, {len(RULES)} rules, {len(SAMPLES)} samples, {len(LESSONS)} lessons, {len(quiz)} questions, {len(DRILLS)} drills")
