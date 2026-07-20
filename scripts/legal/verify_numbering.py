#!/usr/bin/env python3
"""Validate reconstructed clause numbering against Microsoft Word itself.

scripts/legal/word-numbering/<doc>.txt holds one ⟦number⟧text record per
paragraph, captured from Word's own rendering (each paragraph's list string).
This script aligns every numbered, non-bullet record with the numbered
paragraphs in the corresponding frozen fragment and fails on any divergence —
so the numbers customers cite from the web pages are provably the numbers
Word prints.

Known, accepted divergence: records with a number but no text (a stray
empty numbered paragraph, e.g. the section-break "ANNEX A" in the DPA) are
skipped with a notice — an empty paragraph renders as a lone number in Word
and is deliberately omitted from the web page.

Usage: verify_numbering.py <word-numbering.txt> <fragment.html>
"""
import sys, re, html, unicodedata


def norm(s):
    s = unicodedata.normalize('NFC', html.unescape(s))
    return re.sub(r'\s+', ' ', s).strip()


def is_bullet(num):
    return len(num) == 1 and not num.isalnum()


def word_records(path):
    out, skipped = [], 0
    for line in open(path, encoding='utf-8'):
        m = re.match(r'⟦([^⟧]*)⟧(.*)', line.rstrip('\n'))
        if not m:
            continue
        num, text = norm(m.group(1)), norm(m.group(2))
        if not num or is_bullet(num):
            continue
        if not text:
            skipped += 1
            print(f'  note: skipping empty numbered paragraph ⟦{num}⟧ '
                  f'(renders as a lone number in Word; omitted on the page)')
            continue
        out.append((num, text))
    return out


def fragment_records(path):
    t = open(path, encoding='utf-8').read()
    out = []
    for m in re.finditer(
            r'<(?:p|h\d)[^>]*>\s*<span class="num">([^<]+)</span>\s*(.*?)</(?:p|h\d)>', t):
        out.append((norm(m.group(1)), norm(re.sub(r'<[^>]+>', '', m.group(2)))))
    return out


w = word_records(sys.argv[1])
o = fragment_records(sys.argv[2])
bad = 0
for i in range(max(len(w), len(o))):
    wn, wt = w[i] if i < len(w) else ('<missing>', '')
    on, ot = o[i] if i < len(o) else ('<missing>', '')
    # case-insensitive text compare: Word may display style-level ALL CAPS
    if wn != on or wt[:40].lower() != ot[:40].lower():
        bad += 1
        print(f'  MISMATCH #{i}: word=⟦{wn}⟧{wt[:50]!r} vs page=⟦{on}⟧{ot[:50]!r}')

if bad:
    print(f'FAIL: {bad} numbering mismatches ({sys.argv[1]})')
    sys.exit(1)
print(f'OK: {len(o)} numbered paragraphs match Word exactly ({sys.argv[1]})')
