"""Helpers for the pack generators. Each generator writes plain JSON into src/packs/<region>/.

Run from the repo root:  python3 tools/packs/us.py
"""
import json
import os
import itertools

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
_ids = itertools.count(1)


def out_dir(region):
    d = os.path.join(ROOT, 'src', 'packs', region)
    os.makedirs(d, exist_ok=True)
    return d


def write(region, name, data):
    path = os.path.join(out_dir(region), name)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write('\n')
    return path


def bid():
    return f"b{next(_ids)}"


# Block builders. Every block has an id, a type and optional annotation (note + source).
def P(text, note=None):
    b = {'id': bid(), 't': 'p', 'text': text}
    if note:
        b['note'] = note
    return b


def UL(*items, note=None):
    b = {'id': bid(), 't': 'ul', 'items': list(items)}
    if note:
        b['note'] = note
    return b


def T(*rows, note=None):
    b = {'id': bid(), 't': 'table', 'rows': [list(r) for r in rows]}
    if note:
        b['note'] = note
    return b


def AR(*rows, note=None):
    """Adverse-reaction table: first row = column headings, then term and rates."""
    b = {'id': bid(), 't': 'ar', 'rows': [list(r) for r in rows]}
    if note:
        b['note'] = note
    return b


def BOX(text):
    return {'id': bid(), 't': 'box', 'text': text}


def sub(num, title, *blocks):
    return {'num': num, 'title': title, 'blocks': list(blocks)}


def sec(num, title, *blocks, subs=None):
    return {'num': num, 'title': title, 'blocks': list(blocks), 'subs': subs or []}
