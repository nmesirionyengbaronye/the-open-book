#!/usr/bin/env python3
"""Design system for the Uni UI Creator Program documents.

One place for palette, type scale, and page furniture so all eight documents
look like one set. Built on ReportLab's canvas API for precise control over the
grid layout used throughout the original field guides.

Print assumption: light background, dark text, gold used only as an accent.
A dark PDF wastes ink and reads poorly on the phone screens most creators will
actually open these on.
"""

from __future__ import annotations

from dataclasses import dataclass

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

# Millimetre → points.
mm = 72 / 25.4

# ---------------------------------------------------------------------------
# Palette
# ---------------------------------------------------------------------------

INK = HexColor("#141418")        # primary body text
INK_SOFT = HexColor("#4A4A55")   # secondary text
INK_FAINT = HexColor("#8A8A96")  # tertiary / captions
GOLD = HexColor("#B8860B")       # printed gold — darker than the web gold so
GOLD_LIGHT = HexColor("#D4AF37") # it survives on white without vibrating
RULE = HexColor("#E4E4E8")       # hairlines
PANEL = HexColor("#F7F7F9")      # card fills
PANEL_GOLD = HexColor("#FDF8EC")  # callout fill
WHITE = HexColor("#FFFFFF")

POSITIVE = HexColor("#1F7A4D")
NEGATIVE = HexColor("#B3261E")

# ---------------------------------------------------------------------------
# Page geometry (A4)
# ---------------------------------------------------------------------------

PAGE_W, PAGE_H = A4
MARGIN_X = 20 * mm
MARGIN_TOP = 18 * mm
MARGIN_BOT = 16 * mm

CONTENT_W = PAGE_W - 2 * MARGIN_X
TOP_Y = PAGE_H - MARGIN_TOP
BOTTOM_Y = MARGIN_BOT


@dataclass
class Fonts:
    """Registered font handles.

    Prefers DejaVu Sans because it carries U+20A6 (₦), the naira sign. The
    built-in Helvetica uses WinAnsiEncoding, which has no such glyph — every
    commission figure in these documents would silently render as a missing
    character or a black box. When DejaVu is not installed we fall back to
    Helvetica and substitute a written "NGN", which is unambiguous but uglier.

    Looked for: DejaVu alongside matplotlib (ships it), next to Pillow, and in
    the system font directory.
    """

    h1: str = "UniUI-Bold"
    h2: str = "UniUI-Bold"
    h3: str = "UniUI-Bold"
    body: str = "UniUI"
    italic: str = "UniUI-Italic"
    mono: str = "Courier"
    # True when a real naira glyph is available.
    has_naira: bool = True


def _candidate_dirs() -> list[str]:
    import glob
    import os

    dirs: list[str] = []
    try:
        import matplotlib

        dirs.append(
            os.path.join(
                os.path.dirname(matplotlib.__file__), "mpl-data", "fonts", "ttf"
            )
        )
    except Exception:
        pass
    try:
        from PIL import ImageFont

        dirs.append(os.path.dirname(ImageFont.__file__))
    except Exception:
        pass
    dirs += [r"C:\Windows\Fonts", "/usr/share/fonts/truetype/dejavu", "/usr/share/fonts"]
    return dirs


def _register_dejavu() -> bool:
    import glob
    import os

    wanted = {
        "UniUI": "DejaVuSans.ttf",
        "UniUI-Bold": "DejaVuSans-Bold.ttf",
        "UniUI-Italic": "DejaVuSans-Oblique.ttf",
        "UniUI-BoldItalic": "DejaVuSans-BoldOblique.ttf",
    }
    found: dict[str, str] = {}
    for d in _candidate_dirs():
        if not os.path.isdir(d):
            continue
        for name, filename in wanted.items():
            if name in found:
                continue
            hits = glob.glob(os.path.join(d, filename))
            if hits:
                found[name] = hits[0]

    if "UniUI" not in found:
        return False
    try:
        for name, path in found.items():
            pdfmetrics.registerFont(TTFont(name, path))
    except Exception:
        return False
    return "UniUI-Bold" in found


def _build_fonts() -> Fonts:
    if _register_dejavu():
        return Fonts()
    # No DejaVu: Helvetica renders everything except the naira sign.
    return Fonts(
        h1="Helvetica-Bold",
        h2="Helvetica-Bold",
        h3="Helvetica-Bold",
        body="Helvetica",
        italic="Helvetica-Oblique",
        has_naira=False,
    )


F = _build_fonts()

# DejaVu Sans is roughly 9% wider than Helvetica at the same point size, so the
# per-line character budgets below are scaled when it is the active face.
_WIDTH_FACTOR = 0.91 if F.has_naira else 1.0


def naira(value: str | float) -> str:
    """Format money for print.

    Always two decimal places. Stripping trailing zeros would render N1,437.50
    as "N1,437.5", which reads as a typo in a document that states commission
    rates — and these figures are what creators hold you to.
    """
    if isinstance(value, str):
        s = f"{float(value.replace(',', '')):,.2f}"
    else:
        s = f"{value:,.2f}"
    return f"₦{s}" if F.has_naira else f"NGN {s}"


def chars(width: float, size: float) -> int:
    """How many characters of `size`pt fit in `width` points.

    0.50 em average glyph width is a good approximation for lowercase prose in
    both Helvetica and DejaVu; the width factor above corrects for the face.
    """
    return max(8, int((width * _WIDTH_FACTOR) / (size * 0.50)))


class Doc:
    """A single PDF document with automatic page management.

    Use as a context manager so the page furniture (header rule, footer, page
    numbers) is drawn on every page including the first.

        with Doc(path, doc_id="DOC 02", title="Creator Program Overview",
                 total_pages=None) as d:
            d.cover(...)
            d.section("01", "What this is")
    """

    def __init__(self, path, doc_id: str, title: str, eyebrow: str = ""):
        self.canvas: Canvas = Canvas(str(path), pagesize=A4)
        self.canvas.setTitle(title)
        self.canvas.setAuthor("Uni UI")
        self.canvas.setSubject(eyebrow or title)
        self.doc_id = doc_id
        self.title = title
        self.eyebrow = eyebrow
        self.page = 0
        self.y = TOP_Y

    # -- lifecycle ----------------------------------------------------------

    def __enter__(self) -> "Doc":
        return self

    def __exit__(self, *exc) -> None:
        self.close()

    def close(self) -> None:
        self.canvas.save()

    # -- page control -------------------------------------------------------

    def new_page(self, first: bool = False) -> None:
        if not first:
            self.canvas.showPage()
        self.page += 1
        self.canvas.setLineWidth(0.5)
        self.canvas.setStrokeColor(RULE)
        self.canvas.line(MARGIN_X, PAGE_H - 12 * mm, PAGE_W - MARGIN_X, PAGE_H - 12 * mm)
        self._running_head(first)
        self.y = TOP_Y

    def _running_head(self, cover: bool) -> None:
        c = self.canvas
        c.setFont(F.h3, 7.5)
        c.setFillColor(GOLD)
        c.drawString(MARGIN_X, PAGE_H - 10 * mm, "UNIUI")
        c.setFillColor(INK_FAINT)
        c.drawCentredString(PAGE_W / 2, PAGE_H - 10 * mm, self.title.upper())
        c.drawRightString(
            PAGE_W - MARGIN_X, PAGE_H - 10 * mm, f"CREATOR PROGRAM  ·  {self.doc_id}"
        )

    def footer(self) -> None:
        c = self.canvas
        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(MARGIN_X, 12 * mm, PAGE_W - MARGIN_X, 12 * mm)
        c.setFont(F.body, 7.5)
        c.setFillColor(INK_FAINT)
        c.drawString(MARGIN_X, 8.5 * mm, "waitlist.uniui.com.ng/creators")
        c.drawRightString(PAGE_W - MARGIN_X, 8.5 * mm, f"{self.page:02d}")

    def space(self, h: float) -> None:
        self.y -= h

    def need(self, h: float) -> None:
        """Break to a new page if `h` points would overflow the text block."""
        if self.y - h < BOTTOM_Y + 6 * mm:
            self.footer()
            self.new_page()

    # -- primitives ---------------------------------------------------------

    def text(
        self,
        s: str,
        size: float = 9.5,
        leading: float = 14,
        font: str = F.body,
        color: Color = INK,
        indent: float = 0,
        width: float | None = None,
    ) -> None:
        self.need(leading)
        w = (width or CONTENT_W) - indent
        c = self.canvas
        c.setFont(font, size)
        c.setFillColor(color)
        for ln in wrap(s, chars(w, size)):
            c.drawString(MARGIN_X + indent, self.y - size, ln)
            self.y -= leading
        self.y -= 2

    def label(self, s: str, color: Color = GOLD) -> None:
        """Small uppercase eyebrow."""
        self.need(16)
        self.canvas.setFont(F.h3, 7.5)
        self.canvas.setFillColor(color)
        self.canvas.drawString(MARGIN_X, self.y - 8, s.upper())
        self.y -= 16

    def rule(self, color: Color = RULE, gap: float = 8) -> None:
        self.y -= gap
        self.canvas.setStrokeColor(color)
        self.canvas.setLineWidth(0.5)
        self.canvas.line(MARGIN_X, self.y, PAGE_W - MARGIN_X, self.y)
        self.y -= gap

    # -- blocks -------------------------------------------------------------

    def cover(
        self,
        kicker: str,
        title: str,
        standfirst: str,
        tagline: tuple[str, ...],
        meta: str,
    ) -> None:
        """Full-bleed opening page."""
        self.new_page(first=True)
        c = self.canvas
        y = PAGE_H - 78 * mm

        c.setFont(F.h3, 8)
        c.setFillColor(GOLD)
        c.drawString(MARGIN_X, y, f"{self.eyebrow.upper()}  ·  {self.doc_id}")
        y -= 12 * mm

        c.setFillColor(INK)
        for i, line in enumerate(title):
            c.setFont(F.h1, 30 if i == 0 else 22)
            c.drawString(MARGIN_X, y, line)
            y -= 12 * mm if i == 0 else 10 * mm
        y -= 4 * mm

        c.setStrokeColor(GOLD)
        c.setLineWidth(1.4)
        c.line(MARGIN_X, y, MARGIN_X + 26 * mm, y)
        y -= 12 * mm

        c.setFont(F.italic, 12.5)
        c.setFillColor(INK_SOFT)
        for ln in wrap(standfirst, chars(CONTENT_W * 0.72, 12.5)):
            c.drawString(MARGIN_X, y, ln)
            y -= 7 * mm

        y -= 14 * mm
        for i, t in enumerate(tagline):
            c.setFont(F.h1 if i == 0 else F.body, 15 if i == 0 else 15)
            c.setFillColor(INK if i == 0 else INK_SOFT)
            c.drawString(MARGIN_X, y, t)
            y -= 8.5 * mm
        y -= 16 * mm

        c.setStrokeColor(RULE)
        c.setLineWidth(0.5)
        c.line(MARGIN_X, y, PAGE_W - MARGIN_X, y)
        y -= 9 * mm

        c.setFont(F.body, 8.5)
        c.setFillColor(INK_FAINT)
        for ln in wrap(meta, chars(CONTENT_W, 8.5)):
            c.drawString(MARGIN_X, y, ln)
            y -= 5 * mm

        self.footer()
        self.new_page()

    def section(self, number: str, title: str, intro: str = "") -> None:
        """Numbered section heading, with an optional lead paragraph."""
        self.need(70)
        y = self.y
        self.canvas.setFont(F.h3, 8)
        self.canvas.setFillColor(GOLD)
        self.canvas.drawString(MARGIN_X, y - 8, number.upper())
        y -= 15

        self.canvas.setFont(F.h1, 15)
        self.canvas.setFillColor(INK)
        for ln in wrap(title, chars(CONTENT_W * 0.8, 15)):
            self.canvas.drawString(MARGIN_X, y - 12, ln)
            y -= 19

        y -= 3
        self.canvas.setStrokeColor(GOLD)
        self.canvas.setLineWidth(1.2)
        self.canvas.line(MARGIN_X, y, MARGIN_X + 18 * mm, y)
        y -= 11

        if intro:
            self.canvas.setFont(F.body, 9.5)
            self.canvas.setFillColor(INK_SOFT)
            for ln in wrap(intro, chars(CONTENT_W, 9.5)):
                self.canvas.drawString(MARGIN_X, y - 8, ln)
                y -= 13
        self.y = y

    def subhead(self, title: str, kicker: str = "") -> None:
        self.need(40)
        self.y -= 6
        self.canvas.setFont(F.h3, 10.5)
        self.canvas.setFillColor(INK)
        self.canvas.drawString(MARGIN_X, self.y - 9, title)
        self.y -= 17
        if kicker:
            self.canvas.setFont(F.body, 8.5)
            self.canvas.setFillColor(INK_FAINT)
            self.canvas.drawString(MARGIN_X, self.y - 7, kicker)
            self.y -= 13
        self.y -= 3

    def callout(self, title: str, body: str, kind: str = "key") -> None:
        """Highlighted note. 'key' = gold, 'warn' = red-tinted."""
        lines = wrap(body, chars(CONTENT_W - 14 * mm, 9))
        h = 20 * mm + 4.6 * mm * len(lines)
        self.need(h)

        c = self.canvas
        fill = PANEL_GOLD if kind == "key" else HexColor("#FDF3F2")
        edge = GOLD if kind == "key" else NEGATIVE

        c.setFillColor(fill)
        c.setStrokeColor(edge)
        c.setLineWidth(0.6)
        c.rect(MARGIN_X, self.y - h, CONTENT_W, h, stroke=0, fill=1)
        c.setLineWidth(2)
        c.setStrokeColor(edge)
        c.line(MARGIN_X, self.y - h, MARGIN_X, self.y)

        ty = self.y - 12
        c.setFont(F.h3, 8)
        c.setFillColor(edge)
        c.drawString(MARGIN_X + 6 * mm, ty, title.upper())
        ty -= 14
        c.setFont(F.body, 9)
        c.setFillColor(INK)
        for ln in lines:
            c.drawString(MARGIN_X + 6 * mm, ty, ln)
            ty -= 12

        self.y -= h + 8

    def bullets(self, items: list[str], marker: str = "•") -> None:
        for it in items:
            self.need(16)
            c = self.canvas
            c.setFillColor(GOLD)
            c.setFont(F.body, 9.5)
            c.drawString(MARGIN_X + 1, self.y - 9, marker)
            c.setFillColor(INK)
            for i, ln in enumerate(wrap(it, chars(CONTENT_W - 8 * mm, 9.5))):
                c.drawString(MARGIN_X + 6 * mm, self.y - 9, ln)
                self.y -= 13
            self.y -= 3

    def steps(self, items: list[tuple[str, str, str]]) -> None:
        """Numbered (num, title, body) stack."""
        for num, title, body in items:
            self.need(30)
            c = self.canvas
            c.setFont(F.h3, 8)
            c.setFillColor(GOLD)
            c.drawString(MARGIN_X, self.y - 8, num)
            c.setFont(F.h3, 10.5)
            c.setFillColor(INK)
            c.drawString(MARGIN_X + 16 * mm, self.y - 8, title)
            y = self.y - 21
            c.setFont(F.body, 9)
            c.setFillColor(INK_SOFT)
            for ln in wrap(body, chars(CONTENT_W - 18 * mm, 9)):
                c.drawString(MARGIN_X + 16 * mm, y, ln)
                y -= 12.5
            self.y = y - 4

    def cards(
        self,
        items: list[tuple[str, str, str]],
        cols: int = 2,
        numbered: bool = False,
        tone: str = "plain",
    ) -> None:
        """Responsive grid of small panels: (eyebrow, title, body)."""
        gap = 5 * mm
        w = (CONTENT_W - gap * (cols - 1)) / cols
        rows = (len(items) + cols - 1) // cols
        pad = 4.5 * mm

        for r in range(rows):
            chunk = items[r * cols : (r + 1) * cols]
            tallest = 0
            boxes = []
            for col_i, (eyebrow, title, body) in enumerate(chunk):
                h = 8 * mm + len(wrap(body, chars(w - pad * 2, 8.2))) * 4.6 * mm
                if eyebrow:
                    h += 5 * mm
                if title:
                    h += 6 * mm + len(wrap(title, chars(w - pad * 2, 9.5))) * 2 * mm
                h += pad * 2
                boxes.append((eyebrow, title, body, h))
                tallest = max(tallest, h)

            self.need(tallest + gap)
            top = self.y
            for col_i, (eyebrow, title, body, _h) in enumerate(boxes):
                x = MARGIN_X + col_i * (w + gap)
                h = boxes[col_i][3]
                c = self.canvas
                fill = PANEL if tone == "plain" else PANEL_GOLD
                c.setFillColor(fill)
                c.setStrokeColor(RULE)
                c.setLineWidth(0.5)
                c.rect(x, top - h, w, h, stroke=1, fill=1)

                ty = top - pad - 4
                if eyebrow:
                    c.setFont(F.h3, 6.8)
                    c.setFillColor(GOLD if tone != "warn" else NEGATIVE)
                    c.drawString(x + pad, ty, eyebrow.upper())
                    ty -= 10
                if title:
                    c.setFont(F.h3, 9.5)
                    c.setFillColor(INK)
                    for ln in wrap(title, chars(w - pad * 2, 9.5)):
                        c.drawString(x + pad, ty, ln)
                        ty -= 12
                    ty -= 1
                c.setFont(F.body, 8.2)
                c.setFillColor(INK_SOFT)
                for ln in wrap(body, chars(w - pad * 2, 8.2)):
                    c.drawString(x + pad, ty, ln)
                    ty -= 10.5

            self.y = top - tallest - gap

    def checklist(self, groups: list[tuple[str, list[str]]]) -> None:
        for title, items in groups:
            self.need(28)
            self.label(title, INK_FAINT)
            for it in items:
                self.need(16)
                c = self.canvas
                c.setStrokeColor(INK_FAINT)
                c.setLineWidth(0.7)
                c.rect(MARGIN_X + 1, self.y - 10, 7, 7, stroke=1, fill=0)
                c.setFont(F.body, 9)
                c.setFillColor(INK)
                c.drawString(MARGIN_X + 7 * mm, self.y - 9, it)
                self.y -= 13.5
            self.y -= 5

    def table(
        self,
        headers: list[str],
        rows: list[list[str]],
        widths: list[float] | None = None,
        align_right: list[int] | None = None,
        highlight: set[int] | None = None,
        font_size: float = 8.4,
    ) -> None:
        """Data table. `highlight` marks row indices to tint gold."""
        n = len(headers)
        widths = widths or [CONTENT_W / n] * n
        align_right = align_right or []
        highlight = highlight or set()

        def draw_header():
            self.need(22)
            c = self.canvas
            c.setFillColor(PANEL)
            c.rect(MARGIN_X, self.y - 13, CONTENT_W, 14, stroke=0, fill=1)
            c.setFont(F.h3, 7.2)
            c.setFillColor(INK)
            x = MARGIN_X
            for i, h in enumerate(headers):
                if i in align_right:
                    c.drawRightString(x + widths[i] - 4, self.y - 9, h.upper())
                else:
                    c.drawString(x + 4, self.y - 9, h.upper())
                x += widths[i]
            self.y -= 16

        draw_header()
        for ri, row in enumerate(rows):
            wrapped = [
                wrap(
                    str(cell),
                    chars(widths[i] - 8, font_size),
                )
                for i, cell in enumerate(row)
            ]
            h = max(len(w) for w in wrapped) * (font_size + 3.2) + 7

            if self.y - h < BOTTOM_Y + 6 * mm:
                self.footer()
                self.new_page()
                draw_header()

            c = self.canvas
            if ri in highlight:
                c.setFillColor(PANEL_GOLD)
                c.rect(MARGIN_X, self.y - h + 4, CONTENT_W, h, stroke=0, fill=1)
            elif ri % 2 == 1:
                c.setFillColor(HexColor("#FAFAFB"))
                c.rect(MARGIN_X, self.y - h + 4, CONTENT_W, h, stroke=0, fill=1)

            x = MARGIN_X
            for i, cell in enumerate(row):
                c.setFont(F.h3 if i == 0 else F.body, font_size)
                c.setFillColor(INK)
                yy = self.y - 5
                for ln in wrapped[i]:
                    if i in align_right:
                        c.drawRightString(x + widths[i] - 4, yy, ln)
                    else:
                        c.drawString(x + 4, yy, ln)
                    yy -= font_size + 3.2
                x += widths[i]

            self.y -= h + 1
            c.setStrokeColor(RULE)
            c.setLineWidth(0.4)
            c.line(MARGIN_X, self.y + 3, PAGE_W - MARGIN_X, self.y + 3)

        self.y -= 8

    def worksheet(self, blocks: list[tuple[str, list[str]]]) -> None:
        """Fill-in worksheet: label then ruled writing lines."""
        for title, fields in blocks:
            self.need(34)
            self.label(title, INK_FAINT)
            for f in fields:
                self.need(22)
                c = self.canvas
                c.setFont(F.body, 9)
                c.setFillColor(INK)
                c.drawString(MARGIN_X, self.y - 9, f)
                self.y -= 20
                c.setStrokeColor(RULE)
                c.setLineWidth(0.5)
                c.line(MARGIN_X, self.y, PAGE_W - MARGIN_X, self.y)
            self.y -= 6


def wrap(s: str, chars: int) -> list[str]:
    """Greedy word wrap. Good enough for fixed-width layout at known sizes."""
    words, lines, cur = s.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if len(trial) <= chars:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines
