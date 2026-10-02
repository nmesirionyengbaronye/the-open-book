#!/usr/bin/env python3
"""Report page and word counts for the generated Creator Programme PDFs, and
assert that figures which contradict the current programme rules are absent.

The last part matters more than the counts. The first draft of these documents
quoted a flat N175 per subscriber — the Ambassador rate — which would have been
a written commitment to pay creators at a rate the programme does not use. A
regenerated set must never reintroduce it.
"""

from __future__ import annotations

import glob
import os
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

from pypdf import PdfReader  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "public" / "creator-program" / "docs"

# Text that must NOT appear. The first is the superseded Ambassador rate; the
# second is the launch-gated model this programme no longer uses.
FORBIDDEN = {
    "N175 per paying subscriber": "the superseded Ambassador flat rate",
    "175 per paying subscriber": "the superseded Ambassador flat rate",
    "get your link at launch": "the old launch-gated onboarding model",
}


def main() -> int:
    files = sorted(DOCS.glob("*.pdf"))
    if not files:
        print("No PDFs found. Run scripts/build_creator_docs.py first.")
        return 1

    total_pages = total_words = 0
    corpus = []

    for f in files:
        reader = PdfReader(f)
        text = "".join((p.extract_text() or "") for p in reader.pages)
        corpus.append(text)
        total_pages += len(reader.pages)
        total_words += len(text.split())
        print(f"{f.name[:46]:48} pages={len(reader.pages):<3} words={len(text.split())}")

    print("-" * 68)
    print(f"{'TOTAL':48} pages={total_pages:<3} words={total_words}")

    print("\nRequired figures present:")
    joined = " ".join(corpus)
    # Documents quote naira amounts, not raw rates — creators care what they
    # earn, not what percentage produces it. So assert the settled figures.
    checks = [
        # Standard per-subscriber figures (N2,500 Scholar).
        ("standard Starter first 250", "250"),
        ("standard Starter total 1,000", "1,000"),
        # Founding column: the permanent +2.5% bump, as settled totals.
        ("founding Starter total 1,437.50", "1,437.50"),
        ("founding Established total 2,312.50", "2,312.50"),
        ("founding Top total 2,437.50", "2,437.50"),
        ("network size 500", "500"),
        ("recruitment bonus 2,500", "2,500"),
        ("Deep Study cap 500", "500"),
    ]
    ok = True
    for label, needle in checks:
        found = needle in joined
        ok = ok and found
        print(f"  {'OK  ' if found else 'MISS'} {label}")

    print("\nSuperseded figures absent:")
    lowered = joined.lower()
    for needle, why in FORBIDDEN.items():
        bad = needle.lower() in lowered
        ok = ok and not bad
        print(f"  {'OK  ' if not bad else 'FAIL'} not present: {needle}  ({why})")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())