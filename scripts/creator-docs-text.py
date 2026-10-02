#!/usr/bin/env python3
"""Extract text from the Creator Program PDFs.

Used to align the site copy with the documents that will actually be sent to
creators, so the /creators page cannot drift from the PDFs.

Run: python scripts/creator-docs-text.py
"""

import sys
from pathlib import Path

from pypdf import PdfReader

# The documents contain the naira sign, which the default Windows console
# encoding (cp1252) cannot represent. Force UTF-8 so extraction does not abort
# halfway through page one.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent


def main() -> int:
    pdfs = sorted(ROOT.glob("*.pdf"))
    if not pdfs:
        print("No PDFs found at the repo root.")
        return 1

    for pdf in pdfs:
        print("\n" + "=" * 78)
        print(pdf.name)
        print("=" * 78)
        try:
            reader = PdfReader(pdf)
        except Exception as exc:  # noqa: BLE001
            print(f"  (unreadable: {exc})")
            continue
        for i, page in enumerate(reader.pages, 1):
            text = (page.extract_text() or "").strip()
            if not text:
                print(f"\n--- page {i} ---\n  (no extractable text)")
                continue
            print(f"\n--- page {i} ---")
            print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
