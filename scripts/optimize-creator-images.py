#!/usr/bin/env python3
"""Optimize the campus photos for web delivery.

The source PNGs are 2304x1536 at ~4 MB each. Served as-is that is ~16 MB of
images on a landing page, which is slower than the page it is decorating. This
resizes to 1600 px wide and writes JPEG q85 — visually identical at display
size, roughly 15x lighter.

Run: python scripts/optimize-creator-images.py
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT  # sources live at the repo root
DEST_DIR = ROOT / "public" / "creator-program"

MAX_WIDTH = 1600
QUALITY = 85


def optimize(path: Path) -> tuple[Path, int, int]:
    dest = DEST_DIR / (path.stem.replace("campus_", "campus-") + ".jpg")
    with Image.open(path) as im:
        im = im.convert("RGB")
        if im.width > MAX_WIDTH:
            height = round(im.height * (MAX_WIDTH / im.width))
            im = im.resize((MAX_WIDTH, height), Image.LANCZOS)
        im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
        size = im.size
    return dest, size[0], size[1]


def main() -> int:
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    sources = sorted(SRC_DIR.glob("campus_*.png"))
    if not sources:
        print("No campus_*.png found at the repo root.")
        return 1

    total_before = total_after = 0
    for src in sources:
        dest, w, h = optimize(src)
        before, after = src.stat().st_size, dest.stat().st_size
        total_before += before
        total_after += after
        print(
            f"{src.name:32} -> {dest.name:28} {w}x{h}  "
            f"{before/1024:7.0f} KB -> {after/1024:5.0f} KB"
        )

    saving = 100 * (1 - total_after / total_before)
    print(
        f"\n{total_before/1024/1024:.1f} MB -> {total_after/1024/1024:.1f} MB "
        f"({saving:.0f}% lighter)"
    )
    print(f"Written to {DEST_DIR.relative_to(ROOT)}/")
    print("\nThe source PNGs are now redundant for the site and can be deleted.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
