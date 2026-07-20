#!/usr/bin/env python3
"""Fidelity check: diff the plain text of a converted legal fragment against
an independent extraction (mammoth) of the same .docx.

The converter (docx2html.py) adds clause numbers that mammoth drops, so
<span class="num">…</span> prefixes are stripped before comparing. Everything
else — every word of legal text, in order — must match after whitespace
normalisation. Exits non-zero and prints a unified diff on any mismatch.

With --page, the first argument is a full built page (public/legal/…): the
comparison is restricted to its <article> element, with page-furniture
elements marked data-chrome="1" removed first — everything else inside the
article is contract text and must match the .docx extraction.

Usage: check.py [--page] <converted-or-page.html> <mammoth.html>
"""
import sys, re, html, difflib


def text_of(path, strip_nums=False, page=False):
    t = open(path, encoding='utf-8').read()
    if page:
        m = re.search(r'<article>(.*)</article>', t, re.S)
        if not m:
            sys.exit(f'{path}: no <article> found')
        t = m.group(1)
        t = re.sub(r'<(\w+)[^>]*data-chrome="1"[^>]*>.*?</\1>', '', t, flags=re.S)
    if strip_nums:
        t = re.sub(r'<span class="num">[^<]*</span>', '', t)
    # tags -> line breaks so sentences stay comparable chunks
    t = re.sub(r'<(p|li|tr|td|h\d|table|ul|div)[^>]*>', '\n', t)
    t = re.sub(r'<[^>]+>', '', t)
    t = html.unescape(t)
    lines = []
    for line in t.split('\n'):
        line = re.sub(r'\s+', ' ', line).strip()
        if line:
            lines.append(line)
    return lines


args = [a for a in sys.argv[1:] if a != '--page']
page = '--page' in sys.argv
ours = text_of(args[0], strip_nums=True, page=page)
ref = text_of(args[1])

# compare as a single normalised word stream (paragraph splits may differ
# between the two converters without any wording difference)
ours_words = ' '.join(ours).split()
ref_words = ' '.join(ref).split()

if ours_words == ref_words:
    print(f'OK: {sys.argv[1]} — {len(ours_words)} words, identical to reference extraction')
    sys.exit(0)

sm = difflib.SequenceMatcher(None, ref_words, ours_words, autojunk=False)
print(f'DIFFERENCES in {sys.argv[1]} (reference -> converted):')
n = 0
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal':
        continue
    n += 1
    print(f'  [{op}] ref: {" ".join(ref_words[i1:i2])!r}  ->  ours: {" ".join(ours_words[j1:j2])!r}')
print(f'{n} difference hunks, ref {len(ref_words)} words vs ours {len(ours_words)} words')
sys.exit(1)
