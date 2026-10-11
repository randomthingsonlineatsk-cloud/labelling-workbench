"""Build the core pack into src/packs/core/. Run: python3 tools/packs/core.py

The core pack holds the company core data sheet (CCDS) tools, change management, agency comment
rounds and the proposed PMI template. The app merges it into the US pack at load time.
"""
import os
import re
import sys
sys.path.insert(0, os.path.dirname(__file__))

from lib import write
from core_data import PACK, RULES, PROMO_WORDS, PMI_TEMPLATE, AGENCY, SAMPLES
from core_learn import LESSONS, QUESTIONS, DRILLS, GLOSSARY

src_ids = {s['id'] for s in PACK['sources']}
for r in RULES:
    assert r['src'] in src_ids, f"rule {r['id']} cites unknown source {r['src']}"
    assert r.get('at'), r['id']
assert PMI_TEMPLATE['src'] in src_ids

# Every statement's match terms must be valid regular expressions, and keys unique per version.
for s in SAMPLES:
    for v in (s.get('ccds') or {}).get('versions', []):
        keys = [x['key'] for x in v['statements']]
        assert len(keys) == len(set(keys)), (s['id'], v['v'])
        for x in v['statements']:
            for kind in ('pi', 'mg'):
                for t in x['terms'][kind]:
                    re.compile(t, re.I)
for sid, docs in AGENCY.items():
    assert any(s['id'] == sid for s in SAMPLES), sid
    for kind, comments in docs.items():
        assert len({c['id'] for c in comments}) == len(comments)

# Spread the right answers: rotate each question's options so the answer is not always first.
quiz = []
for i, q in enumerate(QUESTIONS):
    k = i % len(q['options'])
    opts = q['options'][k:] + q['options'][:k]
    quiz.append({**q, 'options': opts, 'answer': opts.index(q['options'][q['answer']])})
topics = {l['id'] for l in LESSONS}
for t in topics:
    assert sum(1 for q in quiz if q['topic'] == t) >= 4, t

write('core', 'pack.json', PACK)
write('core', 'rules.json', RULES)
write('core', 'vocab.json', {'promo': PROMO_WORDS})
write('core', 'templates.json', {'pmi': PMI_TEMPLATE})
write('core', 'agency.json', AGENCY)
write('core', 'samples.json', SAMPLES)
write('core', 'lessons.json', {'lessons': LESSONS})
write('core', 'quiz.json', {'topics': [{'id': l['id'], 'label': f"{l['id']}. {l['title']}", 'module': 'core'} for l in LESSONS], 'questions': quiz})
write('core', 'drills.json', {'drills': DRILLS})
write('core', 'glossary.json', {'terms': GLOSSARY})
print(f"Core pack {PACK['version']}: {len(RULES)} rules, {len(SAMPLES)} samples, {len(LESSONS)} lessons, {len(quiz)} questions, {len(DRILLS)} drills")
