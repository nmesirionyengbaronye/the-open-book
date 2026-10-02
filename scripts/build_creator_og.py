#!/usr/bin/env python3
"""Generate the /creators social share image.

A page-specific OG image matters for a recruitment page: creator DMs and the
WhatsApp group are where most of the traffic originates, and those are the
surfaces that unfurl a link. A generic brand card reads as an ad; a card that
names the program reads as an invitation.

Output: public/og-creators.jpg at 1200x630 (the size both Facebook and X
prefer for summary_large_image).

Run: python scripts/optimize-creator-images.py
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "creator-program" / "campus-group_study.jpg"
OUT = ROOT / "public" / "og-creators.jpg"

W, H = 1200, 630
GOLD = (212, 175, 55)
CREAM = (247, 244, 236)
DIM = (168, 160, 145)


def dejavu(size: int, bold: bool = False) -> str:
    import glob
    import os

    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    dirs = []
    try:
        import matplotlib

        dirs.append(
            os.path.join(os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf")
        )
    except Exception:
        pass
    dirs.append(r"C:\Windows\Fonts")
    for d in dirs:
        hits = glob.glob(os.path.join(d, name))
        if hits:
            return hits[0]
    raise SystemExit(f"Could not locate {name}")


def main() -> int:
    if not SRC.exists():
        raise SystemExit(f"Missing source image: {SRC}")

    base = Image.open(SRC).convert("RGB")
    # Crop to the target aspect ratio before scaling, so nothing is squashed.
    target = W / H
    if base.width / base.height > target:
        nw = int(base.height * target)
        base = base.crop(((base.width - nw) // 2, 0, (base.width + nw) // 2, base.height))
    else:
        nh = int(base.width / target)
        top = int((base.height - nh) * 0.35)  # bias upward, away from the ground
        base = base.crop((0, top, base.width, top + nh))
    base = base.resize((W, H), Image.LANCZOS)

    # Push the photo back so type stays legible over it.
    base = ImageEnhance.Brightness(base).enhance(0.52)
    base = ImageEnhance.Color(base).enhance(0.75)
    base = base.filter(ImageFilter.GaussianBlur(1.4))

    # Gradient scrim, heaviest at the left where the text sits.
    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for x in range(W):
        t = x / W
        sd.line([(x, 0), (x, H)], fill=int(232 * max(0.0, 1 - t * 1.55)))
    sd.rectangle([0, 0, W, H], outline=0, width=0)
    base = Image.composite(base, Image.new("RGB", (W, H), (8, 8, 12)), scrim)

    d = ImageDraw.Draw(base, "RGBA")

    d.rectangle([64, 62, 74, 96], fill=GOLD)

    d.text((96, 60), "UNIUI", font=ImageFont.truetype(dejavu(30, True), 30), fill=GOLD)
    d.text(
        (96, 84),
        "CREATOR PROGRAM",
        font=ImageFont.truetype(dejavu(20), 20),
        fill=CREAM,
    )

    title = ImageFont.truetype(dejavu(74, True), 74)
    d.text((64, 210), "Create.", font=title, fill=(255, 255, 255))
    d.text((64, 296), "Share.", font=title, fill=(255, 255, 255))
    d.text((64, 382), "Refer.", font=title, fill=(255, 255, 255))
    d.text((64, 468), "Earn.", font=title, fill=GOLD)

    sub = ImageFont.truetype(dejavu(27), 27)
    d.text(
        (68, 572),
        "For Nigerian student creators  ·  No follower minimum",
        font=sub,
        fill=CREAM,
    )

    base.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"  {OUT.relative_to(ROOT)}  {W}x{H}  {OUT.stat().st_size/1024:.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())