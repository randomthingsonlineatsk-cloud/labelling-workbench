"""Build the India pack into src/packs/in/. Run: python3 tools/packs/in.py"""
import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from lib import write
from in_core import PACK, TEMPLATES, RULES, SCHEDULES, SCHEDULE_LABEL, H2_FIELDS, PROMO, SCHJ
from in_samples import SAMPLES
from in_learn import LESSONS, QUESTIONS, DRILLS, GLOSSARY

src_ids = {s['id'] for s in PACK['sources']}
for r in RULES:
    assert r['src'] in src_ids, r['id']
for w in PACK['watch']:
    assert w['src'] in src_ids
for t in TEMPLATES.values():
    assert t['src'] in src_ids
rule_ids = {r['id'] for r in RULES}
docs = {s['id']: {d['id'] for d in s['docs']} for s in SAMPLES}
for s in SAMPLES:
    for d in s['docs']:
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

write('in', 'pack.json', PACK)
write('in', 'templates.json', TEMPLATES)
write('in', 'rules.json', RULES)
write('in', 'vocab.json', {'schedules': SCHEDULES, 'scheduleLabels': SCHEDULE_LABEL, 'h2': H2_FIELDS, 'promo': PROMO, 'schj': SCHJ})
write('in', 'samples.json', SAMPLES)
write('in', 'lessons.json', {'lessons': LESSONS})
write('in', 'quiz.json', {'topics': [{'id': l['id'], 'label': f"{l['id']}. {l['title']}", 'module': 'in'} for l in LESSONS], 'questions': quiz})
write('in', 'drills.json', {'drills': DRILLS})
write('in', 'glossary.json', {'terms': GLOSSARY})
print(f"India pack {PACK['version']}: {len(RULES)} rules, {len(SAMPLES)} samples, {len(LESSONS)} lessons, {len(quiz)} questions, {len(DRILLS)} drills")
