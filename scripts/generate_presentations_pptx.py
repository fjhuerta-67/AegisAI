#!/usr/bin/env python3
"""
Generates native, fully editable 16:9 Widescreen PowerPoint (.pptx) decks
compatible with Google Slides and Microsoft PowerPoint for:
1. AegisAI Executive & Technical Architecture Presentation (10 slides, EN & ES)
2. AegisAI Evolution, Self-Audit, RC Roadshow & FinOps Presentation (12 slides, EN & ES)
3. AegisAI Complete Master Presentation (Combined 14-slide unified deck, EN & ES)
"""

import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Colors matching the AegisAI Enterprise Dark Theme
BG_DARK = RGBColor(10, 14, 23)          # #0a0e17
CARD_BG = RGBColor(17, 24, 39)          # #111827
CARD_BLUE_BG = RGBColor(18, 33, 66)     # highlighted blue card
CARD_GREEN_BG = RGBColor(11, 46, 43)    # highlighted emerald card
CARD_RED_BG = RGBColor(52, 20, 30)      # highlighted danger card
CARD_PURPLE_BG = RGBColor(38, 24, 64)   # highlighted purple card
TABLE_HEADER_BG = RGBColor(30, 41, 59)  # #1e293b
TABLE_ROW_ALT = RGBColor(15, 23, 42)    # #0f172a

BORDER_SUBTLE = RGBColor(45, 55, 72)
BORDER_BLUE = RGBColor(59, 130, 246)
BORDER_SKY = RGBColor(56, 189, 248)
BORDER_GREEN = RGBColor(16, 185, 129)
BORDER_RED = RGBColor(239, 68, 68)
BORDER_AMBER = RGBColor(245, 158, 11)
BORDER_PURPLE = RGBColor(168, 85, 247)

TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_LIGHT = RGBColor(226, 232, 240)
TEXT_MUTED = RGBColor(148, 163, 184)
TEXT_SKY = RGBColor(56, 189, 248)
TEXT_BLUE = RGBColor(96, 165, 250)
TEXT_GREEN = RGBColor(52, 211, 153)
TEXT_RED = RGBColor(248, 113, 113)
TEXT_AMBER = RGBColor(251, 191, 36)
TEXT_PURPLE = RGBColor(216, 180, 254)


def new_widescreen_prs() -> Presentation:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    return prs


def set_slide_bg(slide, color=BG_DARK):
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_header_footer(slide, tag_text: str, slide_idx: int, total_slides: int, footer_left: str, footer_right: str):
    # Brand Logo "AEGISAI"
    tb = slide.shapes.add_textbox(Inches(0.6), Inches(0.32), Inches(2.0), Inches(0.45))
    tf = tb.text_frame
    tf.word_wrap = False
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    r1 = p.add_run()
    r1.text = "AEGIS"
    r1.font.name = "Arial"
    r1.font.size = Pt(18)
    r1.font.bold = True
    r1.font.color.rgb = TEXT_WHITE
    r2 = p.add_run()
    r2.text = "AI"
    r2.font.name = "Arial"
    r2.font.size = Pt(18)
    r2.font.bold = True
    r2.font.color.rgb = TEXT_BLUE

    # Brand Pill Tag
    pill = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.85), Inches(0.35), Inches(3.4), Inches(0.32)
    )
    pill.fill.solid()
    pill.fill.fore_color.rgb = CARD_BLUE_BG
    pill.line.color.rgb = BORDER_BLUE
    pill.line.width = Pt(1)
    ptf = pill.text_frame
    ptf.word_wrap = False
    ptf.margin_left = Inches(0.1)
    ptf.margin_right = Inches(0.1)
    ptf.margin_top = Inches(0.02)
    ptf.margin_bottom = Inches(0.02)
    pp = ptf.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pr = pp.add_run()
    pr.text = tag_text.upper()
    pr.font.name = "Arial"
    pr.font.size = Pt(8.5)
    pr.font.bold = True
    pr.font.color.rgb = TEXT_BLUE

    # Slide Number
    snum = slide.shapes.add_textbox(Inches(11.5), Inches(0.34), Inches(1.23), Inches(0.35))
    stf = snum.text_frame
    sp = stf.paragraphs[0]
    sp.alignment = PP_ALIGN.RIGHT
    sr = sp.add_run()
    sr.text = f"{slide_idx:02d} / {total_slides:02d}"
    sr.font.name = "Courier New"
    sr.font.size = Pt(11)
    sr.font.bold = True
    sr.font.color.rgb = TEXT_MUTED

    # Header Divider Line
    line_top = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.76), Inches(12.133), Inches(0.015))
    line_top.fill.solid()
    line_top.fill.fore_color.rgb = BORDER_SUBTLE
    line_top.line.fill.background()

    # Footer Divider Line
    line_bot = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(6.92), Inches(12.133), Inches(0.015))
    line_bot.fill.solid()
    line_bot.fill.fore_color.rgb = BORDER_SUBTLE
    line_bot.line.fill.background()

    # Footer Left
    fl = slide.shapes.add_textbox(Inches(0.6), Inches(6.98), Inches(6.0), Inches(0.32))
    flp = fl.text_frame.paragraphs[0]
    flr = flp.add_run()
    flr.text = footer_left
    flr.font.name = "Arial"
    flr.font.size = Pt(8.5)
    flr.font.color.rgb = TEXT_MUTED

    # Footer Right
    fr = slide.shapes.add_textbox(Inches(6.6), Inches(6.98), Inches(6.133), Inches(0.32))
    frp = fr.text_frame.paragraphs[0]
    frp.alignment = PP_ALIGN.RIGHT
    frr = frp.add_run()
    frr.text = footer_right
    frr.font.name = "Arial"
    frr.font.size = Pt(8.5)
    frr.font.color.rgb = TEXT_MUTED


def add_title_block(slide, category: str, title: str, subtitle: str):
    tb = slide.shapes.add_textbox(Inches(0.6), Inches(0.86), Inches(12.133), Inches(1.15))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p_cat = tf.paragraphs[0]
    r_cat = p_cat.add_run()
    r_cat.text = category.upper()
    r_cat.font.name = "Arial"
    r_cat.font.size = Pt(9.5)
    r_cat.font.bold = True
    r_cat.font.color.rgb = TEXT_SKY

    p_title = tf.add_paragraph()
    p_title.space_before = Pt(2)
    r_title = p_title.add_run()
    r_title.text = title
    r_title.font.name = "Arial"
    r_title.font.size = Pt(22)
    r_title.font.bold = True
    r_title.font.color.rgb = TEXT_WHITE

    p_sub = tf.add_paragraph()
    p_sub.space_before = Pt(3)
    r_sub = p_sub.add_run()
    r_sub.text = subtitle
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = TEXT_MUTED


def add_card(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    title: str,
    bullets: list[str],
    badge: str = "",
    bg_color=CARD_BG,
    border_color=BORDER_SUBTLE,
    title_color=TEXT_WHITE,
    badge_color=TEXT_SKY,
    font_size: float = 10.0,
):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height)
    )
    shape.adjustments[0] = 0.04
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1.25)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.TOP
    tf.margin_left = Inches(0.18)
    tf.margin_right = Inches(0.18)
    tf.margin_top = Inches(0.14)
    tf.margin_bottom = Inches(0.12)

    first_used = False
    if badge:
        p_badge = tf.paragraphs[0]
        first_used = True
        r_b = p_badge.add_run()
        r_b.text = badge.upper()
        r_b.font.name = "Arial"
        r_b.font.size = Pt(8)
        r_b.font.bold = True
        r_b.font.color.rgb = badge_color

    if title:
        p_t = tf.paragraphs[0] if not first_used else tf.add_paragraph()
        if first_used:
            p_t.space_before = Pt(3)
        first_used = True
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = "Arial"
        r_t.font.size = Pt(12.5)
        r_t.font.bold = True
        r_t.font.color.rgb = title_color

    for b in bullets:
        p_b = tf.paragraphs[0] if not first_used else tf.add_paragraph()
        if first_used:
            p_b.space_before = Pt(4)
        first_used = True
        r_b = p_b.add_run()
        r_b.text = b
        r_b.font.name = "Arial"
        r_b.font.size = Pt(font_size)
        r_b.font.color.rgb = TEXT_LIGHT


def add_stat_card(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    stat_value: str,
    stat_label: str,
    value_color=TEXT_GREEN,
    border_color=BORDER_SUBTLE,
):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height)
    )
    shape.adjustments[0] = 0.06
    shape.fill.solid()
    shape.fill.fore_color.rgb = CARD_BG
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1.25)

    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.14)
    tf.margin_right = Inches(0.14)
    tf.margin_top = Inches(0.08)
    tf.margin_bottom = Inches(0.08)

    p1 = tf.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = stat_value
    r1.font.name = "Arial"
    r1.font.size = Pt(24)
    r1.font.bold = True
    r1.font.color.rgb = value_color

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(3)
    r2 = p2.add_run()
    r2.text = stat_label
    r2.font.name = "Arial"
    r2.font.size = Pt(9)
    r2.font.color.rgb = TEXT_MUTED


def add_styled_table(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    headers: list[str],
    rows: list[list[str]],
    col_widths: list[float],
    highlight_row_Zero: bool = False,
    font_size: float = 9.5,
):
    table_shape = slide.shapes.add_table(
        len(rows) + 1, len(headers), Inches(left), Inches(top), Inches(width), Inches(height)
    )
    table = table_shape.table
    for idx, w in enumerate(col_widths):
        table.columns[idx].width = Inches(w)

    # Header Row
    for c_idx, h_text in enumerate(headers):
        cell = table.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = TABLE_HEADER_BG
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        r = p.add_run()
        r.text = h_text
        r.font.name = "Arial"
        r.font.size = Pt(font_size)
        r.font.bold = True
        r.font.color.rgb = TEXT_SKY

    # Data Rows
    for r_idx, row_data in enumerate(rows):
        is_first = highlight_row_Zero and (r_idx == 0)
        bg = CARD_GREEN_BG if is_first else (CARD_BG if r_idx % 2 == 0 else TABLE_ROW_ALT)
        for c_idx, val in enumerate(row_data):
            cell = table.cell(r_idx + 1, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            r = p.add_run()
            r.text = val
            r.font.name = "Arial"
            r.font.size = Pt(font_size)
            r.font.bold = is_first or (c_idx == 0)
            if is_first:
                r.font.color.rgb = TEXT_GREEN if c_idx > 0 else TEXT_WHITE
            elif c_idx == 0:
                r.font.color.rgb = TEXT_WHITE
            else:
                r.font.color.rgb = TEXT_LIGHT


def add_cover_slide(
    prs: Presentation,
    slide_idx: int,
    total_slides: int,
    tag_text: str,
    pill_banner: str,
    main_title_line1: str,
    main_title_line2: str,
    subtitle_desc: str,
    badges: list[tuple[str, RGBColor, RGBColor]],
    footer_left: str,
    footer_right: str,
):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    add_header_footer(slide, tag_text, slide_idx, total_slides, footer_left, footer_right)

    # Top Banner Pill
    banner = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(3.1), Inches(1.45), Inches(7.133), Inches(0.4)
    )
    banner.fill.solid()
    banner.fill.fore_color.rgb = CARD_BLUE_BG
    banner.line.color.rgb = BORDER_BLUE
    bp = banner.text_frame.paragraphs[0]
    bp.alignment = PP_ALIGN.CENTER
    br = bp.add_run()
    br.text = pill_banner.upper()
    br.font.name = "Arial"
    br.font.size = Pt(10)
    br.font.bold = True
    br.font.color.rgb = TEXT_SKY

    # Main Title
    tb = slide.shapes.add_textbox(Inches(0.8), Inches(2.05), Inches(11.733), Inches(1.75))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.alignment = PP_ALIGN.CENTER
    r1 = p1.add_run()
    r1.text = main_title_line1
    r1.font.name = "Arial"
    r1.font.size = Pt(34)
    r1.font.bold = True
    r1.font.color.rgb = TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(4)
    r2 = p2.add_run()
    r2.text = main_title_line2
    r2.font.name = "Arial"
    r2.font.size = Pt(34)
    r2.font.bold = True
    r2.font.color.rgb = TEXT_SKY

    # Description
    desc_tb = slide.shapes.add_textbox(Inches(1.2), Inches(3.85), Inches(10.933), Inches(1.3))
    dtf = desc_tb.text_frame
    dtf.word_wrap = True
    dp = dtf.paragraphs[0]
    dp.alignment = PP_ALIGN.CENTER
    dr = dp.add_run()
    dr.text = subtitle_desc
    dr.font.name = "Arial"
    dr.font.size = Pt(12.5)
    dr.font.color.rgb = TEXT_LIGHT

    # 2x3 Grid of Feature Badges
    cols = 3
    w = 3.65
    h = 0.46
    gap_x = 0.25
    gap_y = 0.16
    start_x = (13.333 - (cols * w + (cols - 1) * gap_x)) / 2
    start_y = 5.35

    for i, (b_text, b_bg, b_fg) in enumerate(badges[:6]):
        r = i // cols
        c = i % cols
        bx = start_x + c * (w + gap_x)
        by = start_y + r * (h + gap_y)
        b_shape = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(bx), Inches(by), Inches(w), Inches(h)
        )
        b_shape.adjustments[0] = 0.5
        b_shape.fill.solid()
        b_shape.fill.fore_color.rgb = b_bg
        b_shape.line.color.rgb = b_fg
        b_shape.line.width = Pt(1)
        btf = b_shape.text_frame
        btf.vertical_anchor = MSO_ANCHOR.MIDDLE
        bp = btf.paragraphs[0]
        bp.alignment = PP_ALIGN.CENTER
        br = bp.add_run()
        br.text = b_text
        br.font.name = "Arial"
        br.font.size = Pt(9.5)
        br.font.bold = True
        br.font.color.rgb = b_fg


# ==============================================================================
# SLIDE BUILDERS (MODULAR SO WE CAN ASSEMBLE DECK 1, DECK 2, AND MASTER DECK 3)
# ==============================================================================

def slide_evolution_4stages(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Product Evolution", idx, total,
                          "AegisAI Enterprise • 4-Stage Product Evolution",
                          "AI Studio (3.8–3.6 Flash) ➔ Antigravity (3.8 Flash) ➔ Self-Audit ➔ Enterprise RC")
        add_title_block(
            slide,
            "End-to-End Engineering Lifecycle",
            "How We Built, Self-Audited, and Validated AegisAI",
            "A four-stage agentic software engineering journey from rapid Proof of Concept to Enterprise Release Candidate.",
        )
        cards = [
            ("Phase 1 • Proof of Concept", "1. Prototyped in Google AI Studio (Gemini 3.8 to 3.6 Flash)", [
                "• Built the initial Proof of Concept in Google AI Studio using Gemini 3.8 Flash with dynamic fallback to Gemini 3.6 Flash.",
                "• Validated structured JSON Schema output generation, multi-chapter normative reasoning, and initial React UI scaffolding.",
                "• Proved that Flash-class models with strict system instructions and temperature 0.0 evaluate complex security controls accurately.",
            ], CARD_BLUE_BG, BORDER_BLUE, TEXT_SKY, TEXT_SKY),
            ("Phase 2 • Full-Stack Engineering", "2. Migrated to Google Antigravity (Worked Upon with 3.8 Flash)", [
                "• Moved the repository into Google Antigravity (AGY) powered by Gemini 3.8 Flash.",
                "• Executed 171+ conversational engineering prompts across 7 structured phases to build the Express/TypeScript backend, parallel Map-Reduce evaluator, keyless GCP Live Scanner, Firestore persistence, and 16 bilingual PDF manuals.",
                "• Deployed to Google Cloud Run behind Identity-Aware Proxy (IAP).",
            ], CARD_BLUE_BG, BORDER_BLUE, TEXT_BLUE, TEXT_BLUE),
            ("Phase 3 • Dogfooding & Hardening", "3. Self-Audited Codebase & Docs Against AegisAI Itself", [
                "• Uploaded AegisAI's own codebase and 10-PDF documentation bundle (Originaldocs.zip) into the live Cloud Run app to run a full OWASP AI-SVS v1.0 + ISO/IEC 42001:2023 audit.",
                "• Baseline self-audit (MULTI-2026-0437) scored 68.9% and flagged 35 gaps (6 Failed, 29 Missing Evidence).",
                "• Remediated both documentation and application, re-auditing at 97.8% (MULTI-2026-8983, 100% ISO 42001, 0 failures).",
            ], CARD_GREEN_BG, BORDER_GREEN, TEXT_GREEN, TEXT_GREEN),
            ("Phase 4 • Enterprise Field Validation", "4. Release Candidate (RC) Presented to Industry Leaders", [
                "• Presented the hardened Release Candidate (RC) to three flagship Mexican organizations:",
                "   1. Farmacias del Ahorro (Healthcare & Retail Pharmacy)",
                "   2. Asociación Mexicana de Franquicias — AMF (National Franchise Ecosystem)",
                "   3. Grupo Coppel (Financial Services & Omnichannel Retail)",
                "• Validated multi-standard compliance (OWASP AI-SVS, ISO 42001, LFPC & LFPDPPP).",
            ], CARD_PURPLE_BG, BORDER_PURPLE, TEXT_PURPLE, TEXT_PURPLE),
        ]
    else:
        add_header_footer(slide, "Evolución del Producto", idx, total,
                          "AegisAI Enterprise • Evolución del Producto en 4 Etapas",
                          "AI Studio (3.8–3.6 Flash) ➔ Antigravity (3.8 Flash) ➔ Auto-Auditoría ➔ Release Candidate")
        add_title_block(
            slide,
            "Ciclo de Vida de Ingeniería de Extremo a Extremo",
            "Cómo Construimos, Auto-Auditamos y Validamos AegisAI",
            "Un recorrido de ingeniería agéntica en cuatro etapas desde la prueba de concepto hasta el Release Candidate empresarial.",
        )
        cards = [
            ("Fase 1 • Prueba de Concepto (PoC)", "1. Prototipado en Google AI Studio (Gemini 3.8 a 3.6 Flash)", [
                "• Construcción de la Prueba de Concepto inicial en Google AI Studio utilizando Gemini 3.8 Flash con conmutación a Gemini 3.6 Flash.",
                "• Validación de generación bajo JSON Schema estricto, razonamiento normativo multi-capítulo e interfaz inicial en React.",
                "• Demostró que los modelos Flash con temperatura 0.0 evalúan controles complejos de seguridad con precisión determinística.",
            ], CARD_BLUE_BG, BORDER_BLUE, TEXT_SKY, TEXT_SKY),
            ("Fase 2 • Ingeniería Full-Stack", "2. Migración a Google Antigravity (Desarrollado con 3.8 Flash)", [
                "• Migración del código base a Google Antigravity (AGY) operando con Gemini 3.8 Flash.",
                "• Ejecución de más de 171 prompts de ingeniería en 7 fases para construir el backend Express/TypeScript, el motor Map-Reduce, el GCP Live Scanner, Firestore y los 16 manuales PDF bilingües.",
                "• Desplegado en Google Cloud Run detrás de Identity-Aware Proxy (IAP).",
            ], CARD_BLUE_BG, BORDER_BLUE, TEXT_BLUE, TEXT_BLUE),
            ("Fase 3 • Dogfooding y Endurecimiento", "3. Auto-Auditoría de Código y Manuales contra AegisAI", [
                "• Con el prototipo en Cloud Run, cargamos el propio código y paquete de 10 PDFs de AegisAI (Originaldocs.zip) dentro de la plataforma para auditarla contra OWASP AI-SVS v1.0 e ISO/IEC 42001:2023.",
                "• La auto-auditoría base (MULTI-2026-0437) obtuvo 68.9% y detectó 35 brechas (6 Fallidos, 29 Falta Evidencia).",
                "• Remediamos manuales y aplicación, alcanzando 97.8% en re-auditoría (MULTI-2026-8983, 100% ISO 42001, 0 fallos).",
            ], CARD_GREEN_BG, BORDER_GREEN, TEXT_GREEN, TEXT_GREEN),
            ("Fase 4 • Validación Empresarial", "4. Release Candidate (RC) Presentado a Líderes en México", [
                "• Presentación del Release Candidate (RC) endurecido ante tres organizaciones líderes:",
                "   1. Farmacias del Ahorro (Salud y Retail Farmacéutico)",
                "   2. Asociación Mexicana de Franquicias — AMF (Ecosistema de Franquicias)",
                "   3. Grupo Coppel (Servicios Financieros y Retail Omnicanal)",
                "• Validación simultánea de OWASP AI-SVS, ISO 42001, LFPC y LFPDPPP.",
            ], CARD_PURPLE_BG, BORDER_PURPLE, TEXT_PURPLE, TEXT_PURPLE),
        ]

    positions = [
        (0.6, 2.12, 5.95, 2.25),
        (6.78, 2.12, 5.95, 2.25),
        (0.6, 4.52, 5.95, 2.25),
        (6.78, 4.52, 5.95, 2.25),
    ]
    for (badge, title, bullets, bg, border, tc, bc), (x, y, w, h) in zip(cards, positions):
        add_card(slide, x, y, w, h, title, bullets, badge=badge, bg_color=bg, border_color=border, title_color=tc, badge_color=bc, font_size=9.5)


def slide_self_audit_loop(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Self-Audit Case Study", idx, total,
                          "AegisAI Enterprise • Closed-Loop Self-Audit Verification",
                          "Firestore Audit IDs: MULTI-2026-0437 (Baseline 68.9%) ➔ MULTI-2026-8983 (Remediated 97.8%)")
        add_title_block(
            slide,
            "Eating Our Own Dogfood",
            "Running AegisAI's Codebase & Documentation Against Itself",
            "How AegisAI diagnosed 35 OWASP AI-SVS & ISO 42001 gaps in its own prototype and verified its own remediation to 97.8%.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "1. Baseline Self-Audit (MULTI-2026-0437)", [
            "• Overall Score: 68.9% (Level L2)",
            "• OWASP AI-SVS v1.0: 71.8% (17 gaps)",
            "• ISO/IEC 42001:2023: 66.7% (18 gaps)",
            "• Key Findings Caught by AegisAI:",
            "  – Writable /app/config in container (C04.1)",
            "  – Timing-vulnerable === token check (C05.3)",
            "  – Legacy roles/viewer on runtime SA (C05.2)",
            "  – Missing SHA-256 normative manifest (C01.4)",
            "  – Missing ISO 42001 AIMS Policy & Appeal docs",
        ], badge="Before Hardening", bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, badge_color=TEXT_RED, font_size=9.3)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "2. Full-Stack Remediation in Antigravity", [
            "• Generator Fixes: Untruncated Section 4 Cookbook (all 35 patches), smart sentence-boundary splitter, accurate syntax tags.",
            "• Container & Cloud: chmod -R a-w /app (C04.1), Cloud IAP + SSRF/IMDS blocker (C04.3), pruned roles/viewer (C05.2).",
            "• Runtime Guardrails: SHA-256 manifest (C01.4), crescendo detector (C02.10), crypto.timingSafeEqual (C05.3), Anti-DoW quotas (C11.1), sagas (C09.4).",
            "• Docs & Rules: Authored Manual 8 (ISO 42001 AIMS) & passed 308/308 Firestore rules unit tests.",
        ], badge="Engineering Execution", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, badge_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "3. Post-Fix Re-Audit (MULTI-2026-8983)", [
            "• Overall Score: 97.8% (+28.9 pts)",
            "• ISO/IEC 42001:2023: 100.0% (54/54 mandatory controls passed, 0 Failed)",
            "• OWASP AI-SVS v1.0: 94.7% (45/49 controls passed, 0 Failed)",
            "• Real Firestore Telemetry:",
            "  – Model: gemini-3.8-flash on Vertex AI",
            "  – Input Tokens: 1,758,724",
            "  – Output Tokens: 100,715",
            "  – Zero critical or high-risk failures remaining",
        ], badge="Verified Release Candidate", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=9.3)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Why Self-Auditing Matters: Running AegisAI against its own architecture and manuals proved that the evaluator does not hallucinate approvals—it caught subtle code & governance gaps (such as providedToken === configuredToken and missing ISO 42001 whistleblowing/appeal channels) and verified their closure once remediated."
        ], bg_color=CARD_BG, border_color=BORDER_SKY, font_size=9.5)
    else:
        add_header_footer(slide, "Caso de Auto-Auditoría", idx, total,
                          "AegisAI Enterprise • Verificación en Bucle Cerrado",
                          "IDs en Firestore: MULTI-2026-0437 (Base 68.9%) ➔ MULTI-2026-8983 (Remediado 97.8%)")
        add_title_block(
            slide,
            "Verificación en Bucle Cerrado ('Dogfooding')",
            "Auditando el Código y Manuales de AegisAI con AegisAI",
            "Cómo AegisAI diagnosticó 35 brechas de OWASP AI-SVS e ISO 42001 en su propio prototipo y guió su remediación hasta 97.8%.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "1. Auto-Auditoría Base (MULTI-2026-0437)", [
            "• Puntaje Global: 68.9% (Nivel L2)",
            "• OWASP AI-SVS v1.0: 71.8% (17 brechas)",
            "• ISO/IEC 42001:2023: 66.7% (18 brechas)",
            "• Hallazgos Detectados por AegisAI:",
            "  – Directorio /app/config escribible (C04.1)",
            "  – Comparación === vulnerable a timing (C05.3)",
            "  – Rol roles/viewer en SA de ejecución (C05.2)",
            "  – Falta de manifiesto SHA-256 (C01.4)",
            "  – Falta de Manual AIMS ISO 42001 y apelación",
        ], badge="Antes del Endurecimiento", bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, badge_color=TEXT_RED, font_size=9.3)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "2. Remediación Integral en Antigravity", [
            "• Generador: Recetario Sección 4 sin truncar (los 35 parches completos), corte por oración completa y detección precisa de lenguaje.",
            "• Contenedor y Cloud: chmod -R a-w /app (C04.1), Cloud IAP + bloqueo SSRF/IMDS (C04.3), revocación de roles/viewer (C05.2).",
            "• Guardrails: Manifiesto SHA-256 (C01.4), detector crescendo (C02.10), crypto.timingSafeEqual (C05.3), cuotas Anti-DoW (C11.1), sagas (C09.4).",
            "• Manuales y Reglas: Manual 8 AIMS ISO 42001 y 308/308 pruebas de reglas Firestore aprobadas.",
        ], badge="Ejecución de Ingeniería", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, badge_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "3. Re-Auditoría Post-Fix (MULTI-2026-8983)", [
            "• Puntaje Global: 97.8% (+28.9 pts)",
            "• ISO/IEC 42001:2023: 100.0% (54/54 controles aprobados, 0 Fallidos)",
            "• OWASP AI-SVS v1.0: 94.7% (45/49 aprobados, 0 Fallidos)",
            "• Telemetría Real en Firestore:",
            "  – Modelo: gemini-3.8-flash en Vertex AI",
            "  – Tokens de Entrada: 1,758,724",
            "  – Tokens de Salida: 100,715",
            "  – Cero fallos críticos o altos restantes",
        ], badge="Release Candidate Verificado", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=9.3)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Valor de la Auto-Auditoría: Auditar AegisAI consigo misma demostró que el motor no alucina aprobaciones: detectó vulnerabilidades sutiles (como providedToken === configuredToken y brechas documentales de ISO 42001) y verificó su cierre tras la remediación."
        ], bg_color=CARD_BG, border_color=BORDER_SKY, font_size=9.5)


def slide_rc_roadshow(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Enterprise Release Candidate", idx, total,
                          "AegisAI Enterprise • Release Candidate (RC) Executive Roadshow",
                          "Validated with Farmacias del Ahorro • Asociación Mexicana de Franquicias • Grupo Coppel")
        add_title_block(
            slide,
            "Market Validation & Executive Roadshow",
            "Release Candidate (RC) Presented to Strategic Enterprises",
            "Following our self-audit hardening loop, the AegisAI Release Candidate was presented to three flagship Mexican organizations.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "Farmacias del Ahorro", [
            "• Use Case Focus: Auditing clinical/pharmacy digital assistants, prescription triage bots, and omnichannel customer service AI.",
            "• Key Capabilities Demonstrated:",
            "  – Strict LFPDPPP sensitive health/PII data protection & pre-inference DLP masking.",
            "  – Hallucination prevention (temperature: 0.0) and human clinical escalation workflows (ISO 42001 A.5.2).",
            "  – Continuous RAG grounding telemetry (C08.4) on Google Cloud Vertex AI.",
        ], badge="Healthcare & Retail Pharmacy", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, badge_color=TEXT_SKY, font_size=9.5)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "Asociación Mexicana de Franquicias", [
            "• Use Case Focus: Standardizing AI adoption, customer chatbots, and automated marketing compliance across hundreds of member franchises.",
            "• Key Capabilities Demonstrated:",
            "  – LFPC (Profeco 2026) compliance: preventing deceptive AI commercial patterns and enforcing Art. 56 5-day cooling-off retraction.",
            "  – BYOF Engine: Custom franchise governance templates with low-cost Flash evaluations ($0.08/audit).",
        ], badge="National Franchise Ecosystem", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=9.5)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "Grupo Coppel", [
            "• Use Case Focus: High-scale credit scoring ML, fraud detection engines, and enterprise GenAI engineering governance.",
            "• Key Capabilities Demonstrated:",
            "  – Simultaneous OWASP AI-SVS v1.0 (Level L2/L3) + ISO/IEC 42001:2023 certification readiness.",
            "  – Multi-tenant domain isolation (C05.4, C08.1), Cloud IAP Zero-Trust perimeter, and keyless GCP Live Scanner.",
            "  – Drop-in remediated architecture & Terraform/TypeScript cookbook generation.",
        ], badge="Financial Services & Retail", bg_color=CARD_PURPLE_BG, border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, badge_color=TEXT_PURPLE, font_size=9.5)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Executive Feedback Highlights: Enterprise stakeholders highlighted AegisAI's ability to combine global technical standards (OWASP AI-SVS + ISO 42001) with Mexican statutory law (LFPDPPP + LFPC) while delivering ready-to-deploy remediation code at a fraction of traditional consulting costs."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.5)
    else:
        add_header_footer(slide, "Release Candidate Empresarial", idx, total,
                          "AegisAI Enterprise • Roadshow Ejecutivo del Release Candidate (RC)",
                          "Validado con Farmacias del Ahorro • Asociación Mexicana de Franquicias • Grupo Coppel")
        add_title_block(
            slide,
            "Validación de Mercado y Roadshow Ejecutivo",
            "Release Candidate (RC) Presentado ante Empresas Estratégicas",
            "Tras completar el ciclo de auto-auditoría y endurecimiento, presentamos el Release Candidate ante tres organizaciones líderes en México.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "Farmacias del Ahorro", [
            "• Enfoque del Caso de Uso: Auditoría de asistentes digitales farmacéuticos, orientación clínica y atención omnicanal con IA.",
            "• Capacidades Clave Demostradas:",
            "  – Protección estricta de datos sensibles de salud/PII bajo la LFPDPPP y enmascaramiento DLP pre-inferencia.",
            "  – Mitigación de alucinaciones (temperature: 0.0) y escalamiento a revisión humana (ISO 42001 A.5.2).",
            "  – Telemetría continua de citación y anclaje RAG (C08.4) en Vertex AI.",
        ], badge="Salud y Retail Farmacéutico", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, badge_color=TEXT_SKY, font_size=9.5)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "Asociación Mexicana de Franquicias", [
            "• Enfoque del Caso de Uso: Estandarización de gobernanza de IA, chatbots comerciales y publicidad automatizada en redes de franquicias.",
            "• Capacidades Clave Demostradas:",
            "  – Cumplimiento LFPC (Profeco 2026): prevención de patrones oscuros y retracto comercial de 5 días (Art. 56).",
            "  – Motor BYOF: Marcos normativos propios para franquicias con auditorías Flash de ultra bajo costo ($0.08 USD).",
        ], badge="Ecosistema Nacional de Franquicias", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=9.5)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "Grupo Coppel", [
            "• Enfoque del Caso de Uso: Modelos de riesgo crediticio, prevención de fraude transaccional y gobernanza corporativa de GenAI a gran escala.",
            "• Capacidades Clave Demostradas:",
            "  – Certificación simultánea OWASP AI-SVS v1.0 (Nivel L2/L3) + ISO/IEC 42001:2023.",
            "  – Aislamiento multi-inquilino por dominio (C05.4, C08.1), borde Cloud IAP Zero-Trust y GCP Live Scanner sin llaves.",
            "  – Generación de arquitectura remediada y recetario Terraform/TypeScript.",
        ], badge="Servicios Financieros y Retail", bg_color=CARD_PURPLE_BG, border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, badge_color=TEXT_PURPLE, font_size=9.5)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Impacto en las Presentaciones RC: Los comités directivos destacaron la capacidad única de AegisAI para unificar estándares globales (OWASP AI-SVS + ISO 42001) con legislación mexicana (LFPDPPP + LFPC) entregando código listo para producción en minutos."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.5)


def slide_finops_per_audit(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Unit Economics & Model Benchmark", idx, total,
                          "AegisAI Enterprise • Unit Economics & Model Cost Benchmark",
                          "Telemetry Source: Cloud Firestore (aegis-ai-db) Audits MULTI-2026-0437, 8983, 0507 & 1250")
        add_title_block(
            slide,
            "FinOps Analysis: Cost per Complete OWASP AI-SVS + ISO/IEC 42001 Audit",
            "Gemini (3.8 Flash, 3.1 Pro, 4.0 Argon) vs. Claude (Fable 5.1, Opus 5.5)",
            "Calculated from real production Firestore token telemetry across 12 Map-Reduce LLM calls per full dual-standard audit.",
        )
        headers = [
            "Model Tier",
            "API Rate Card (In / Out per 1M)",
            "Standard Audit (370K In + 40K Out)",
            "Full 10-PDF Bundle (1.64M In + 86.5K Out)",
            "Multiplier vs. Gemini 3.8 Flash",
        ]
        rows = [
            ["Gemini 3.8 Flash (Production)", "$0.15 / $0.60", "$0.08 USD ($0.0795)", "$0.30 USD ($0.2979)", "1.0x (Baseline)"],
            ["Gemini 3.1 Pro", "$1.25 / $10.00", "$0.86 USD ($0.8625)", "$2.92 USD ($2.9150)", "9.8x – 10.8x"],
            ["Gemini 4.0 Argon (Frontier)", "$2.00 / $12.00", "$1.22 USD ($1.2200)", "$4.32 USD ($4.3180)", "14.5x – 15.3x"],
            ["Claude Fable 5.1 Medium", "$3.00 / $15.00", "$1.71 USD ($1.7100)", "$6.22 USD ($6.2175)", "20.9x – 21.5x Costlier"],
            ["Claude Opus 5.5 Max", "$15.00 / $75.00", "$8.55 USD ($8.5500)", "$31.09 USD ($31.0875)", "104.4x – 107.5x Costlier"],
        ]
        add_styled_table(slide, 0.6, 2.08, 12.133, 2.55, headers, rows, [2.733, 2.2, 2.4, 2.6, 2.2], highlight_row_Zero=True, font_size=9.5)

        add_card(slide, 0.6, 4.82, 3.88, 1.9, "Real Telemetry Basis (Firestore)", [
            "• Standard Audit (MULTI-2026-0507 / 1250): Avg 368,827 input + 39,812 output tokens.",
            "• Full 10-PDF ZIP Audit (MULTI-2026-0437 / 8983): Avg 1,638,410 input + 86,495 output tokens across 12 batch calls (~136K context/call).",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.0)

        add_card(slide, 4.72, 4.82, 3.88, 1.9, "Annual FinOps @ 1,000 Audits/Yr", [
            "• Gemini 3.8 Flash: $298 / yr (Full ZIP) or $80 / yr (Std)",
            "• Gemini 3.1 Pro: $2,915 / yr (Full ZIP) or $863 / yr (Std)",
            "• Gemini 4.0 Argon: $4,318 / yr (Full ZIP) or $1,220 / yr",
        ], border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.0)

        add_card(slide, 8.85, 4.82, 3.88, 1.9, "Competitor Spend @ 1,000 Audits/Yr", [
            "• Claude Fable 5.1 Medium: $6,218 / yr (21x higher)",
            "• Claude Opus 5.5 Max: $31,088 / yr (104x higher)",
            "• Savings with Gemini 3.8 Flash: >99% cost reduction.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.0)
    else:
        add_header_footer(slide, "Economía Unitaria y Benchmark", idx, total,
                          "AegisAI Enterprise • Economía Unitaria por Auditoría",
                          "Fuente: Telemetría Real en Cloud Firestore (aegis-ai-db) Auditorías MULTI-2026-0437, 8983, 0507 y 1250")
        add_title_block(
            slide,
            "Análisis FinOps: Costo por Auditoría Completa OWASP AI-SVS + ISO/IEC 42001",
            "Gemini (3.8 Flash, 3.1 Pro, 4.0 Argon) vs. Claude (Fable 5.1, Opus 5.5)",
            "Calculado con telemetría real de tokens en Firestore a través de las 12 llamadas Map-Reduce por auditoría multi-estándar.",
        )
        headers = [
            "Modelo de IA",
            "Tarifa API (In / Out por 1M)",
            "Auditoría Estándar (370K In + 40K Out)",
            "Suite 10 PDFs (1.64M In + 86.5K Out)",
            "Multiplicador vs. 3.8 Flash",
        ]
        rows = [
            ["Gemini 3.8 Flash (Producción)", "$0.15 / $0.60", "$0.08 USD ($0.0795)", "$0.30 USD ($0.2979)", "1.0x (Base)"],
            ["Gemini 3.1 Pro", "$1.25 / $10.00", "$0.86 USD ($0.8625)", "$2.92 USD ($2.9150)", "9.8x – 10.8x"],
            ["Gemini 4.0 Argon (Frontier)", "$2.00 / $12.00", "$1.22 USD ($1.2200)", "$4.32 USD ($4.3180)", "14.5x – 15.3x"],
            ["Claude Fable 5.1 Medium", "$3.00 / $15.00", "$1.71 USD ($1.7100)", "$6.22 USD ($6.2175)", "20.9x – 21.5x más caro"],
            ["Claude Opus 5.5 Max", "$15.00 / $75.00", "$8.55 USD ($8.5500)", "$31.09 USD ($31.0875)", "104.4x – 107.5x más caro"],
        ]
        add_styled_table(slide, 0.6, 2.08, 12.133, 2.55, headers, rows, [2.733, 2.2, 2.4, 2.6, 2.2], highlight_row_Zero=True, font_size=9.5)

        add_card(slide, 0.6, 4.82, 3.88, 1.9, "Base de Telemetría Real (Firestore)", [
            "• Auditoría Estándar (MULTI-2026-0507 / 1250): Promedio 368,827 tokens entrada + 39,812 salida.",
            "• Auditoría ZIP 10 PDFs (MULTI-2026-0437 / 8983): Promedio 1,638,410 entrada + 86,495 salida en 12 lotes (~136K contexto/llamada).",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.0)

        add_card(slide, 4.72, 4.82, 3.88, 1.9, "FinOps Anual @ 1,000 Auditorías/Año", [
            "• Gemini 3.8 Flash: $298 / año (ZIP) o $80 / año (Estándar)",
            "• Gemini 3.1 Pro: $2,915 / año (ZIP) o $863 / año (Estándar)",
            "• Gemini 4.0 Argon: $4,318 / año (ZIP) o $1,220 / año",
        ], border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.0)

        add_card(slide, 8.85, 4.82, 3.88, 1.9, "Gasto Competidor @ 1,000 Auditorías/Año", [
            "• Claude Fable 5.1 Medium: $6,218 / año (21x mayor)",
            "• Claude Opus 5.5 Max: $31,088 / año (104x mayor)",
            "• Ahorro con Gemini 3.8 Flash: >99% de reducción en costos.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.0)


def slide_total_build_cost(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Total Build Cost (TCO)", idx, total,
                          "AegisAI Enterprise • Total Cost of Development (TCO)",
                          "99.0% Savings vs. Claude Opus 5.5 Max • 99.98% Savings vs. Traditional Software Staffing")
        add_title_block(
            slide,
            "Engineering ROI & Development Cost Breakdown",
            "How Much Money We Spent Creating AegisAI: $19.41 USD Total",
            "Complete accounting of all AI token consumption and Google Cloud infrastructure from initial AI Studio PoC to Enterprise RC.",
        )
        add_stat_card(slide, 0.6, 2.05, 2.85, 1.25, "$19.41", "Total Money Spent creating AegisAI (Tokens + GCP Infra)", TEXT_GREEN, BORDER_GREEN)
        add_stat_card(slide, 3.69, 2.05, 2.85, 1.25, "~71.0M", "Total Input Tokens across AI Studio, Antigravity & Audits", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 6.78, 2.05, 2.85, 1.25, "$1,931", "What the exact same token volume costs on Claude Opus 5.5 Max", TEXT_AMBER, BORDER_AMBER)
        add_stat_card(slide, 9.88, 2.05, 2.85, 1.25, "~$95,000", "Equivalent traditional engineering cost (4 engineers × 3 mos)", TEXT_PURPLE, BORDER_PURPLE)

        headers = ["Development Phase", "Platform & Model Used", "Volume / Engineering Activity", "Actual Spend", "If Run on Opus 5.5"]
        rows = [
            ["1. Proof of Concept (PoC)", "Google AI Studio (Gemini 3.8–3.6 Flash)", "~45 iterations • ~4.2M In / ~0.9M Out tokens", "$1.17 USD", "$130.50 USD"],
            ["2. Core Full-Stack & Manuals (Phases 1–7)", "Google Antigravity (Gemini 3.8 Flash)", "171 logged prompts + 16 PDFs • ~38.0M In / ~6.5M Out", "$9.60 USD", "$1,057.50 USD"],
            ["3. Cloud Hardening & OWASP/ISO Fixes", "Google Antigravity (Gemini 3.8 Flash)", "Cloud IAP, 308 rules tests, 35 controls • ~24.0M In / ~3.8M Out", "$5.88 USD", "$645.00 USD"],
            ["4. Live Self-Audits & QA Suites", "Vertex AI (Gemini 3.8 Flash)", "MULTI-2026-0437, 8983, 0507, 1250 • ~4.8M In / ~0.32M Out", "$0.91 USD", "$96.00 USD"],
            ["5. Google Cloud Infrastructure", "Cloud Build, Cloud Run, Firestore, IAM", "9 container builds, scale-to-zero runtime, aegis-ai-db", "$1.85 USD", "$1.85 USD"],
            ["TOTAL APP CREATION SPEND", "AI Studio + Antigravity + Google Cloud", "~71.0M Input + ~11.52M Output Tokens + Cloud Infra", "$19.41 USD", "$1,930.85 USD"],
        ]
        add_styled_table(slide, 0.6, 3.45, 12.133, 3.25, headers, rows, [2.8, 2.8, 3.533, 1.5, 1.5], highlight_row_Zero=False, font_size=9.0)
    else:
        add_header_footer(slide, "Costo Total de Creación (TCO)", idx, total,
                          "AegisAI Enterprise • Costo Total de Desarrollo (TCO)",
                          "99.0% de Ahorro vs. Claude Opus 5.5 Max • 99.98% de Ahorro vs. Desarrollo Tradicional")
        add_title_block(
            slide,
            "ROI de Ingeniería y Desglose de Costos de Desarrollo",
            "Cuánto Dinero Gastamos Creando AegisAI: $19.41 USD en Total",
            "Contabilidad completa de consumo de tokens de IA e infraestructura Google Cloud desde el PoC en AI Studio hasta el Release Candidate.",
        )
        add_stat_card(slide, 0.6, 2.05, 2.85, 1.25, "$19.41", "Inversión Total para crear AegisAI (Tokens IA + GCP)", TEXT_GREEN, BORDER_GREEN)
        add_stat_card(slide, 3.69, 2.05, 2.85, 1.25, "~71.0M", "Tokens Totales de Entrada en AI Studio, Antigravity y QA", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 6.78, 2.05, 2.85, 1.25, "$1,931", "Costo del mismo volumen de tokens en Claude Opus 5.5 Max", TEXT_AMBER, BORDER_AMBER)
        add_stat_card(slide, 9.88, 2.05, 2.85, 1.25, "~$95,000", "Costo equivalente de ingeniería tradicional (4 ing. × 3 meses)", TEXT_PURPLE, BORDER_PURPLE)

        headers = ["Fase de Desarrollo", "Plataforma y Modelo Utilizado", "Volumen / Actividad de Ingeniería", "Gasto Real", "En Opus 5.5 Max"]
        rows = [
            ["1. Prueba de Concepto (PoC)", "Google AI Studio (Gemini 3.8–3.6 Flash)", "~45 iteraciones • ~4.2M In / ~0.9M Out tokens", "$1.17 USD", "$130.50 USD"],
            ["2. Full-Stack y Manuales (Fases 1–7)", "Google Antigravity (Gemini 3.8 Flash)", "171 prompts + 16 PDFs • ~38.0M In / ~6.5M Out tokens", "$9.60 USD", "$1,057.50 USD"],
            ["3. Endurecimiento Cloud y Remediación", "Google Antigravity (Gemini 3.8 Flash)", "Cloud IAP, 308 tests, 35 controles • ~24.0M In / ~3.8M Out", "$5.88 USD", "$645.00 USD"],
            ["4. Auto-Auditorías en Vivo y QA", "Vertex AI (Gemini 3.8 Flash)", "MULTI-2026-0437, 8983, 0507, 1250 • ~4.8M In / ~0.32M Out", "$0.91 USD", "$96.00 USD"],
            ["5. Infraestructura Google Cloud", "Cloud Build, Cloud Run, Firestore, IAM", "9 builds de contenedor, Cloud Run scale-to-zero, aegis-ai-db", "$1.85 USD", "$1.85 USD"],
            ["INVERSIÓN TOTAL DE CREACIÓN", "AI Studio + Antigravity + Google Cloud", "~71.0M Entrada + ~11.52M Salida + Infraestructura Cloud", "$19.41 USD", "$1,930.85 USD"],
        ]
        add_styled_table(slide, 0.6, 3.45, 12.133, 3.25, headers, rows, [2.8, 2.8, 3.533, 1.5, 1.5], highlight_row_Zero=False, font_size=9.0)


def slide_problem(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Risk Landscape", idx, total,
                          "AegisAI Enterprise • AI Risk Assessment",
                          "Source: IBM Cost of a Data Breach 2025, OWASP AI-SVS v1.0 & ISO/IEC 42001:2023")
        add_title_block(
            slide,
            "The Problem to Solve",
            "The Critical Security Blindspot in Enterprise GenAI Adoption",
            "Enterprises are shipping generative AI models, agentic workflows, MCP tools, and RAG pipelines without architectural verification or ISO 42001 governance.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 2.25, "⚠ Ungoverned AI Access & Breaches", [
            "Per IBM Cost of a Data Breach 2025, 13% of organizations reported breaches of AI models or applications, and 97% of those lacked proper AI access controls or formal impact assessments (ISO 42001 A.5.1).",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 4.72, 2.12, 3.88, 2.25, "⚠ Multi-Turn & Agentic Attack Surface", [
            "RAG pipelines, MCP servers, and autonomous agents introduce critical vectors: Multi-Turn Crescendo Prompt Injection (C02.10), Normative/Vector Poisoning (C01.4), and SSRF/IMDS exfiltration (C04.3).",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 8.85, 2.12, 3.88, 2.25, "⚠ CISO vs. Data Science Silo", [
            "Security teams lack tools to audit agent graphs, MCP manifests (C10.1), and pre-retrieval vector ACLs (C08.1); AI developers lack automated mappings to formal compliance clauses.",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 0.6, 4.55, 5.95, 2.15, "Lack of Operationalized Governance (ISO/IEC 42001)", [
            "Organizations struggle to operationalize ISO/IEC 42001:2023 requirements—such as Corporate AI Policies (A.2.1), Confidential Whistleblowing (A.3.3), AI Asset Inventories (A.4.1), and Human Verdict Appeals (A.5.2)—into software engineering workflows.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.8)

        add_card(slide, 6.78, 4.55, 5.95, 2.15, "Proliferation of 'Shadow AI' & Denial of Wallet", [
            "Unregulated external API calls, timing-vulnerable token checks (C05.3), over-privileged service accounts (C05.2), missing Anti-DoW token budgets (C11.1), and exposed logit probabilities (C11.4).",
        ], border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.8)
    else:
        add_header_footer(slide, "Panorama de Riesgos", idx, total,
                          "AegisAI Enterprise • Diagnóstico de Riesgos de IA",
                          "Fuente: IBM Cost of a Data Breach 2025, OWASP AI-SVS v1.0 e ISO/IEC 42001:2023")
        add_title_block(
            slide,
            "El Problema a Resolver",
            "El Punto Ciego Crítico en la Adopción Empresarial de GenAI",
            "Las organizaciones despliegan modelos generativos, flujos agénticos, herramientas MCP y pipelines RAG sin verificación arquitectónica ni gobernanza ISO 42001.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 2.25, "⚠ Brechas de Acceso y Despliegue sin Gobierno", [
            "Según IBM Cost of a Data Breach 2025, el 13% de las organizaciones sufrió brechas en modelos o aplicaciones de IA, y el 97% de ellas carecía de controles de acceso adecuados o Evaluación de Impacto (ISO 42001 A.5.1).",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 4.72, 2.12, 3.88, 2.25, "⚠ Superficie Multi-Turno y Agéntica", [
            "Pipelines RAG, servidores MCP y agentes introducen vectores críticos: Inyección Multi-Turno Crescendo (C02.10), Envenenamiento Normativo/Vectorial (C01.4) y exfiltración SSRF/IMDS (C04.3).",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 8.85, 2.12, 3.88, 2.25, "⚠ Silo entre CISO y Ciencia de Datos", [
            "Los equipos de seguridad carecen de herramientas para auditar grafos de agentes, manifiestos MCP (C10.1) y ACLs vectoriales (C08.1) antes de pasar a producción.",
        ], bg_color=CARD_RED_BG, border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)

        add_card(slide, 0.6, 4.55, 5.95, 2.15, "Brecha de Gobernanza Operativa (ISO/IEC 42001)", [
            "Dificultad para operacionalizar los controles de ISO/IEC 42001:2023 —como Políticas Corporativas de IA (A.2.1), Canal Ético Confidencial (A.3.3), Inventario de Activos IA (A.4.1) y Apelación Humana (A.5.2)— en el ciclo de ingeniería.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.8)

        add_card(slide, 6.78, 4.55, 5.95, 2.15, "Proliferación de 'Shadow AI' y Denial of Wallet", [
            "Invocaciones externas sin cuotas, comparación insegura de tokens (C05.3), cuentas de servicio sobre-privilegiadas (C05.2), falta de presupuestos Anti-DoW (C11.1) y exposición de logprobs (C11.4).",
        ], border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.8)


def slide_impact(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Consequence Analysis", idx, total,
                          "AegisAI Enterprise • Impact & Business Continuity Analysis",
                          "Criteria aligned with ISO/IEC 42001:2023 Clause 6 & Annex A.5")
        add_title_block(
            slide,
            "Impact of Inaction",
            "The Real Cost of Neglecting Proactive AI Assurance",
            "Operating unverified AI systems exposes organizations to severe financial, regulatory, and operational liabilities.",
        )
        add_stat_card(slide, 0.6, 2.08, 2.85, 1.45, "€35M", "or 7% of global annual turnover in EU AI Act Art. 99 penalties", TEXT_RED, BORDER_RED)
        add_stat_card(slide, 3.69, 2.08, 2.85, 1.45, "97%", "of breached AI apps lacked proper AI access controls (IBM 2025)", TEXT_AMBER, BORDER_AMBER)
        add_stat_card(slide, 6.78, 2.08, 2.85, 1.45, "10 / 10", "Automated OWASP LLM Top-10 risk checks enforced per audit", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 9.88, 2.08, 2.85, 1.45, "148", "Built-in controls (AISVS 56, ISO 42001 54, EU 10, LFPDPPP/LFPC 28)", TEXT_GREEN, BORDER_GREEN)

        add_card(slide, 0.6, 3.75, 3.88, 2.95, "Exfiltration of Secrets, IMDS & PII", [
            "Multi-turn crescendo jailbreaks and SSRF payloads engineered to extract cloud metadata (169.254.169.254), API keys, or cross-tenant records when pre-retrieval ACLs (C08.1) are absent.",
        ], border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)
        add_card(slide, 4.72, 3.75, 3.88, 2.95, "Regulatory Injunctions & Non-Conformity", [
            "Failure to demonstrate ISO/IEC 42001 AIMS controls, GDPR/LFPDPPP ARCO cascading deletion, or LFPC Art. 56 cooling-off mechanisms triggers mandatory shutdowns and statutory fines.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.8)
        add_card(slide, 8.85, 3.75, 3.88, 2.95, "Unappealable Algorithmic Harm", [
            "Hallucinated compliance verdicts or biased automated decisions without human-in-the-loop appeal channels (ISO 42001 A.5.2) or ethics whistleblowing (A.3.3) erode institutional trust.",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.8)
    else:
        add_header_footer(slide, "Análisis de Consecuencias", idx, total,
                          "AegisAI Enterprise • Análisis de Impacto y Continuidad de Negocio",
                          "Criterios alineados con ISO/IEC 42001:2023 Cláusula 6 y Anexo A.5")
        add_title_block(
            slide,
            "Impacto de la Inacción",
            "El Costo Real de Omitir la Auditoría Preventiva de IA",
            "Operar sistemas de IA sin verificación expone a la organización a sanciones financieras, legales y operativas severas.",
        )
        add_stat_card(slide, 0.6, 2.08, 2.85, 1.45, "€35M", "o 7% de facturación global anual en multas de EU AI Act Art. 99", TEXT_RED, BORDER_RED)
        add_stat_card(slide, 3.69, 2.08, 2.85, 1.45, "97%", "de las apps de IA vulneradas carecían de control de acceso (IBM 2025)", TEXT_AMBER, BORDER_AMBER)
        add_stat_card(slide, 6.78, 2.08, 2.85, 1.45, "10 / 10", "Chequeos automatizados de OWASP LLM Top-10 por auditoría", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 9.88, 2.08, 2.85, 1.45, "148", "Controles integrados (AISVS 56, ISO 54, EU 10, LFPDPPP/LFPC 28)", TEXT_GREEN, BORDER_GREEN)

        add_card(slide, 0.6, 3.75, 3.88, 2.95, "Exfiltración de Secretos, IMDS y PII", [
            "Ataques multi-turno crescendo y SSRF diseñados para extraer metadatos cloud (169.254.169.254), llaves API o registros entre inquilinos cuando faltan ACLs pre-recuperación (C08.1).",
        ], border_color=BORDER_RED, title_color=TEXT_RED, font_size=9.8)
        add_card(slide, 4.72, 3.75, 3.88, 2.95, "Sanciones Regulatorias y Suspensión", [
            "Incumplimiento de controles AIMS ISO/IEC 42001, purga en cascada ARCO (LFPDPPP/GDPR) o retracto comercial del Art. 56 LFPC provoca suspensiones y litigios.",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.8)
        add_card(slide, 8.85, 3.75, 3.88, 2.95, "Decisiones Algorítmicas Inapelables", [
            "Dictámenes alucinados o decisiones automatizadas sesgadas sin canal de apelación humana (ISO 42001 A.5.2) ni canal ético (A.3.3) erosionan la confianza institucional.",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.8)


def slide_solution(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Value Proposition", idx, total,
                          "AegisAI Enterprise • Value Proposition & Core Capabilities",
                          "Powered by Google Cloud Vertex AI (Gemini 3.8 Flash)")
        add_title_block(
            slide,
            "Our Solution",
            "AegisAI: Comprehensive & Automated AI Assurance",
            "Transforming AI security and ISO 42001 governance auditing from weeks of manual review into deterministic, evidence-backed verification.",
        )
        add_card(slide, 0.6, 2.12, 5.95, 2.65, "🛡 Shift-Left Multi-Standard Verification", [
            "• Inspects architecture documents, PDFs, ZIP bundles, microservice specs, and live GCP telemetry against OWASP AI-SVS v1.0 and ISO/IEC 42001:2023 simultaneously.",
            "• Deterministic Map-Reduce evaluation with strict chapter enum schemas (buildBatchChaptersSchema).",
            "• Mandatory verbatim citation grounding (textoEvidencia & fuenteEvidencia).",
            "• Pre-inference DLP masking and C02.10 multi-turn crescendo prompt injection blocking.",
        ], bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.5)

        add_card(slide, 6.78, 2.12, 5.95, 2.65, "⚡ 100% Remediated Architecture & Full Cookbook", [
            "• Synthesizes a complete Drop-in Replacement Architecture Specification (Section 3) plus a full, untruncated Patch Cookbook (Section 4) for every finding.",
            "• Renders all 1..N failed and missing-evidence controls with zero truncation.",
            "• Smart sentence-boundary truncation (truncateAtSentenceBoundary) prevents mid-word cuts.",
            "• Accurate syntax highlighting for typescript, hcl (Terraform), yaml, python, and bash.",
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.5)

        add_card(slide, 0.6, 4.95, 3.88, 1.78, "Keyless GCP Live Scanner", [
            "• Inspects Vertex AI, Cloud Run, Secret Manager, and IAM via ephemeral read-only caller tokens (C05.2).",
        ], border_color=BORDER_SKY, title_color=TEXT_SKY, font_size=9.5)

        add_card(slide, 4.72, 4.95, 3.88, 1.78, "SHA-256 Normative Integrity", [
            "• Startup verification against integrity-manifest.json (C01.4) + tenant-isolated BYOF (C08.1).",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.5)

        add_card(slide, 8.85, 4.95, 3.88, 1.78, "Continuous AIMS Telemetry", [
            "• Tracks citation grounding coverage, JSON schema fidelity, latency, and human appeals (C08.4 / Clause 9.1).",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.5)
    else:
        add_header_footer(slide, "Propuesta de Valor", idx, total,
                          "AegisAI Enterprise • Propuesta de Valor y Capacidades Clave",
                          "Impulsado por Google Cloud Vertex AI (Gemini 3.8 Flash)")
        add_title_block(
            slide,
            "Nuestra Solución",
            "AegisAI: Aseguramiento Integral y Automatizado de IA",
            "Transformando semanas de auditoría manual en verificación determinística respaldada por evidencia textual y código de remediación.",
        )
        add_card(slide, 0.6, 2.12, 5.95, 2.65, "🛡 Verificación Multi-Estándar Shift-Left", [
            "• Inspecciona documentos de arquitectura, PDFs, paquetes ZIP, microservicios y telemetría GCP en vivo contra OWASP AI-SVS v1.0 e ISO/IEC 42001:2023 simultáneamente.",
            "• Evaluación Map-Reduce determinística con esquemas enum estrictos por lote (buildBatchChaptersSchema).",
            "• Citación textual obligatoria (textoEvidencia y fuenteEvidencia).",
            "• Enmascaramiento DLP pre-inferencia y bloqueo de inyección multi-turno crescendo (C02.10).",
        ], bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.5)

        add_card(slide, 6.78, 2.12, 5.95, 2.65, "⚡ Arquitectura Remediada al 100% y Recetario Completo", [
            "• Sintetiza una Especificación de Arquitectura Corregida Drop-in (Sección 3) más un Recetario Técnico Completo (Sección 4) para cada hallazgo.",
            "• Incluye la totalidad de los hallazgos 1..N sin truncamiento.",
            "• Corte inteligente por oración completa (truncateAtSentenceBoundary).",
            "• Detección precisa de lenguaje para bloques typescript, hcl (Terraform), yaml, python y bash.",
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.5)

        add_card(slide, 0.6, 4.95, 3.88, 1.78, "Escáner GCP sin Llaves", [
            "• Inspecciona Vertex AI, Cloud Run, Secret Manager e IAM con tokens efímeros de solo lectura (C05.2).",
        ], border_color=BORDER_SKY, title_color=TEXT_SKY, font_size=9.5)

        add_card(slide, 4.72, 4.95, 3.88, 1.78, "Integridad Normativa SHA-256", [
            "• Verificación al arranque contra integrity-manifest.json (C01.4) + BYOF aislado por inquilino (C08.1).",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.5)

        add_card(slide, 8.85, 4.95, 3.88, 1.78, "Telemetría Continua AIMS", [
            "• Mide cobertura de citación, fidelidad JSON, latencia y apelaciones humanas (C08.4 / Cláusula 9.1).",
        ], border_color=BORDER_AMBER, title_color=TEXT_AMBER, font_size=9.5)


def slide_compliance_matrix(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Governance & Standards", idx, total,
                          "AegisAI Enterprise • Frameworks & Compliance Engine",
                          "Aligned with OWASP AI-SVS v1.0, ISO/IEC 42001:2023, NIST AI RMF & EU AI Act")
        add_title_block(
            slide,
            "Compliance Matrix",
            "Multi-Standard Framework Support & ISO/IEC 42001 AIMS",
            "Simultaneous evaluation across global technical security standards, management systems, and regional privacy statutes.",
        )
        headers = ["Standard / Framework", "Technical & Governance Scope", "Key Controls Verified & Enforced by AegisAI", "Assurance Level"]
        rows = [
            ["OWASP AI-SVS v1.0", "AI Security Verification Standard (12 Chapters)", "C01.4 SHA-256 Manifest, C02.10 Crescendo Guard, C04.1 Read-Only Container, C04.3 Cloud IAP & SSRF Block, C05.2–C05.4 Constant-Time Auth & IAM, C08.1/C08.4 RAG ACLs, C09.4 Sagas, C10.1–C10.5 MCP Security, C11.1/C11.4 Anti-DoW & Logprobs Off, C12.2 SIEM Alerts.", "L1 / L2 / L3 Ready"],
            ["ISO/IEC 42001:2023", "AI Management System (AIMS Clauses 4–10 & Annex A)", "Clause 4.1/4.2 Context & Stakeholders, Clause 5/A.2.1/A.2.3 Corporate AI Policy, Clause 7/A.3.3 Competency & Whistleblowing, A.4.1 AI Asset Inventory, A.5.1–A.5.3 Impact Assessment & Human Appeal, Clause 9 KPIs & Internal Audit, A.9.1/A.9.2 Acceptable Use.", "Certification Ready"],
            ["Mexican Regulatory (2026)", "Consumer Protection (LFPC) & Personal Data (LFPDPPP)", "Algorithmic transparency, deceptive commercial pattern prevention, Art. 56 5-day cooling-off retraction, ARCO cascading deletion, and DLP PII masking.", "Regional Statutory"],
            ["BYOF Custom Framework", "Bring Your Own Framework (Multi-Tenant)", "Admin-authenticated ingestion (C05.3) with SHA-256 integrity checks (C01.4) and pre-retrieval tenant domain ACL filtering (allowedDomains, C08.1).", "Tenant Isolated"],
        ]
        add_styled_table(slide, 0.6, 2.08, 12.133, 3.65, headers, rows, [2.3, 2.7, 5.333, 1.8], highlight_row_Zero=False, font_size=9.0)
        add_card(slide, 0.6, 5.88, 12.133, 0.86, "", [
            "Unified Cross-Framework Map-Reduce: Evaluates 103+ combined OWASP AI-SVS & ISO/IEC 42001 controls in parallel batches using constrained chapter ID enums so ISO Clauses 9/10 and Annex A.9/A.10 never collide with OWASP C09/C10."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.2)
    else:
        add_header_footer(slide, "Gobernanza y Estándares", idx, total,
                          "AegisAI Enterprise • Motor de Marcos y Cumplimiento",
                          "Alineado con OWASP AI-SVS v1.0, ISO/IEC 42001:2023, NIST AI RMF y EU AI Act")
        add_title_block(
            slide,
            "Matriz de Cumplimiento",
            "Soporte Multi-Estándar y Gobernanza AIMS ISO/IEC 42001",
            "Evaluación simultánea de estándares técnicos globales de seguridad en IA, sistemas de gestión y leyes de privacidad.",
        )
        headers = ["Estándar / Marco", "Alcance Técnico y Gobernanza", "Controles Clave Verificados y Aplicados por AegisAI", "Nivel"]
        rows = [
            ["OWASP AI-SVS v1.0", "Estándar de Verificación de Seguridad en IA (12 Capítulos)", "C01.4 Manifiesto SHA-256, C02.10 Guardia Crescendo, C04.1 Contenedor Read-Only, C04.3 Cloud IAP y Bloqueo SSRF, C05.2–C05.4 Auth en Tiempo Constante e IAM, C08.1/C08.4 ACLs RAG, C09.4 Sagas, C10.1–C10.5 Seguridad MCP, C11.1/C11.4 Anti-DoW y Logprobs Off, C12.2 Alertas SIEM.", "L1 / L2 / L3 Listo"],
            ["ISO/IEC 42001:2023", "Sistema de Gestión de IA (AIMS Cláusulas 4–10 y Anexo A)", "Cláusula 4.1/4.2 Contexto y Stakeholders, Cláusula 5/A.2.1/A.2.3 Política Corporativa IA, Cláusula 7/A.3.3 Competencia y Canal Ético, A.4.1 Inventario IA, A.5.1–A.5.3 Evaluación de Impacto y Apelación Humana, Cláusula 9 KPIs y Auditoría Interna, A.9.1/A.9.2 Uso Aceptable.", "Certificación Lista"],
            ["Regulación Mexicana (2026)", "Protección al Consumidor (LFPC) y Datos Personales (LFPDPPP)", "Transparencia algorítmica, prevención de patrones oscuros, retracto de 5 días (Art. 56 LFPC), purga en cascada ARCO y enmascaramiento DLP.", "Estatutario Local"],
            ["Marco BYOF Personalizado", "Bring Your Own Framework (Multi-Inquilino)", "Ingesta autenticada por administrador (C05.3) con verificación SHA-256 (C01.4) y pre-filtrado ACL por dominio de inquilino (allowedDomains, C08.1).", "Aislado por Tenant"],
        ]
        add_styled_table(slide, 0.6, 2.08, 12.133, 3.65, headers, rows, [2.3, 2.7, 5.333, 1.8], highlight_row_Zero=False, font_size=9.0)
        add_card(slide, 0.6, 5.88, 12.133, 0.86, "", [
            "Motor Map-Reduce Cruzado sin Colisiones: Evalúa más de 103 controles combinados de OWASP AI-SVS e ISO/IEC 42001 en lotes paralelos usando enums de capítulo restringidos para que las Cláusulas 9/10 y Anexo A.9/A.10 jamás colisionen con C09/C10."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.2)


def slide_architecture(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "System Engineering", idx, total,
                          "AegisAI Enterprise • C4 Container & Security Architecture",
                          "Deployed on Google Cloud Run (Revision aegis-ai-00013)")
        add_title_block(
            slide,
            "Software Architecture",
            "4-Layer Zero-Trust & Defense-in-Depth Architecture",
            "Hardened serverless architecture deployed on Google Cloud Run behind Identity-Aware Proxy (IAP) with keyless Vertex AI ADC inference.",
        )
        add_card(slide, 0.6, 2.12, 2.88, 3.55, "1. Perimeter & SPA", [
            "• Cloud IAP (--no-allow-unauthenticated)",
            "• React 19 + TS + Vite",
            "• Firebase Auth OAuth 2.0 domain allowlist (google.com, altostrat.com)",
            "• Embedded ISO 42001 Policy, Appeal (A.5.2) & Whistleblowing (A.3.3) UI",
        ], border_color=BORDER_SKY, title_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 3.68, 2.12, 2.88, 3.55, "2. Hardened API & Model Armor", [
            "• Read-Only Container (chmod -R a-w /app, C04.1)",
            "• Google Cloud Model Armor inline prompt/response sanitizer",
            "• Constant-time token check (crypto.timingSafeEqual, C05.3)",
            "• DNS Rebinding Guard (C10.5) & MCP Signature Verifier (C10.1)",
            "• Anti-DoW Quotas (C11.1)",
        ], border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.3)

        add_card(slide, 6.76, 2.12, 2.88, 3.55, "3. Keyless Vertex AI & Multi-LLM", [
            "• Vertex AI (gemini-3.8-flash) via keyless IAM ADC (no Gemini API key needed)",
            "• Model Garden / Model Registry signed provenance (C01.4)",
            "• Multi-Provider Engine (Claude, OpenRouter, OpenAI, Local Proxy)",
            "• Multi-Turn Crescendo Detector (C02.10) & Logprobs Off (C11.4)",
            "• Outbound SSRF/IMDS Block (C04.3)",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.3)

        add_card(slide, 9.85, 2.12, 2.88, 3.55, "4. Data, AutoSxS & SCC AI", [
            "• Cloud Firestore (aegis-ai-db) via Admin SDK (308/308 rules tests)",
            "• Vertex Evaluation Service (AutoSxS) & Model Monitoring (skew/drift)",
            "• Security Command Center (SCC) AI Protection real-time SOC alerts",
            "• SHA-256 Manifest (C01.4) & Compensating Sagas (C09.4)",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.3)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Zero-Trust Isolation & SCC AI Alerting (C12.2): Runtime state writes exclusively to Firestore (system_config/admin_settings) and ephemeral /tmp/aegis-runtime-cache. Every prompt injection or security event emits a real-time SCC AI Protection alert to the SOC."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.3)
    else:
        add_header_footer(slide, "Ingeniería del Sistema", idx, total,
                          "AegisAI Enterprise • Arquitectura C4 y Seguridad",
                          "Desplegado en Google Cloud Run (Revisión aegis-ai-00013)")
        add_title_block(
            slide,
            "Arquitectura de Software",
            "Arquitectura Zero-Trust de 4 Capas y Defensa en Profundidad",
            "Arquitectura serverless endurecida en Google Cloud Run detrás de Identity-Aware Proxy (IAP) con inferencia Vertex AI ADC sin llaves API.",
        )
        add_card(slide, 0.6, 2.12, 2.88, 3.55, "1. Perímetro y SPA", [
            "• Cloud IAP (--no-allow-unauthenticated)",
            "• React 19 + TS + Vite",
            "• Lista blanca OAuth 2.0 en Firebase Auth (google.com, altostrat.com)",
            "• Avisos visibles ISO 42001 de Política, Apelación (A.5.2) y Canal Ético (A.3.3)",
        ], border_color=BORDER_SKY, title_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 3.68, 2.12, 2.88, 3.55, "2. API Endurecida y Model Armor", [
            "• Contenedor Read-Only (chmod -R a-w /app, C04.1)",
            "• Google Cloud Model Armor sanitizando entradas/salidas en línea",
            "• Tokens en tiempo constante (crypto.timingSafeEqual, C05.3)",
            "• Guardia DNS Rebinding (C10.5) y Firma MCP (C10.1)",
            "• Cuotas Anti-DoW (C11.1)",
        ], border_color=BORDER_BLUE, title_color=TEXT_BLUE, font_size=9.3)

        add_card(slide, 6.76, 2.12, 2.88, 3.55, "3. Vertex AI ADC y Multi-LLM", [
            "• Vertex AI (gemini-3.8-flash) vía IAM ADC sin requerir llave API Gemini",
            "• Model Garden / Model Registry con modelos firmados (C01.4)",
            "• Motor Multi-Proveedor (Claude, OpenRouter, OpenAI, Local Proxy)",
            "• Detector Multi-Turno Crescendo (C02.10) y Logprobs Off (C11.4)",
            "• Bloqueo SSRF/IMDS (C04.3)",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.3)

        add_card(slide, 9.85, 2.12, 2.88, 3.55, "4. Datos, AutoSxS y SCC AI", [
            "• Cloud Firestore (aegis-ai-db) vía Admin SDK (308/308 pruebas)",
            "• Vertex Evaluation Service (AutoSxS) y Model Monitoring (skew/drift)",
            "• Security Command Center (SCC) AI Protection con alertas SOC en tiempo real",
            "• Manifiesto SHA-256 (C01.4) y Sagas Compensatorias (C09.4)",
        ], border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, font_size=9.3)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Aislamiento Zero-Trust y Alertas SCC AI (C12.2): El estado dinámico se guarda exclusivamente en Firestore (system_config/admin_settings) y /tmp/aegis-runtime-cache. Cada intento de inyección de prompts emite una alerta en tiempo real hacia SCC AI Protection para respuesta inmediata del SOC."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.3)


def slide_gcp_iso42001_lifecycle(prs: Presentation, idx: int, total: int, lang: str = "en"):
    """Dedicated slide for the 3-Phase ISO/IEC 42001 Google Cloud AI Protection Stack."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Google Cloud AI Protection", idx, total,
                          "AegisAI Enterprise • ISO/IEC 42001 Phases 3, 4 & 5 Protection Stack",
                          "Model Garden/Registry • Model Armor • Vertex Evaluation (AutoSxS) • Model Monitoring • SCC AI Protection")
        add_title_block(
            slide,
            "Google Cloud AI Protection Lifecycle (ISO/IEC 42001)",
            "5 Native Google Cloud Security & Governance Products Across Phases 3, 4 & 5",
            "How AegisAI operationalizes ISO/IEC 42001:2023 and OWASP AI-SVS v1.0 across Development, Evaluation, and Production Deployment.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "Phase 3: Development & Protections", [
            "Objective: AI System Design, Development & Supply Chain Protection.",
            "• Visual & Evidence-Based Gap Map: Maps current vs. desired state (L1/L2/L3) with verbatim evidence.",
            "• Model Garden / Model Registry: Reviewed library (Garden) & private library (Registry). Models are signed & verified by Google and partners—preventing untrusted internet models with backdoors (ISO A.6.1.2 / A.7.3, C01.4).",
            "• Model Armor: Inline in front of LLMs. Sanitizes inputs & outputs in real time, blocks prompt injections & jailbreaks, and filters toxic content from user and model responses alike (ISO A.6.2.6, C02.10).",
        ], badge="PHASE 3 • DESIGN & BUILD", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_SKY, badge_color=TEXT_SKY, font_size=8.7)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "Phase 4: Evaluation of Controls", [
            "Objective: Automated Review & Audit Trail of Applied Controls.",
            "• Vertex Evaluation Service (AutoSxS): Integrated Vertex AI evaluation framework using AutoSxS—which automatically categorizes and grades model responses like a teacher grading a student's homework.",
            "• Automated Safety Metrics: Evaluates hate speech, harassment, sexually explicit content, and dangerous content.",
            "• ISO 42001 Audit Trail: Faster and far more cost-effective than manual review by human specialists, generating the immutable audit trail required by ISO/IEC 42001 Clause 9.1 & A.6.2.4 (OWASP C08.4).",
        ], badge="PHASE 4 • EVALUATION", bg_color=CARD_PURPLE_BG, border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, badge_color=TEXT_PURPLE, font_size=8.7)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "Phase 5: Controlled Deployment", [
            "Objective: Controlled Production Rollout, Drift Detection & SOC Response.",
            "• Vertex AI Model Monitoring: Evaluates production performance by detecting training-serving skew (when live data differs from training data) and drift (when the world changes and the model becomes obsolete), alerting immediately if safety degrades (ISO Clause 9.1 / A.6.2.6).",
            "• Security Command Center (SCC) with AI Protection: Threat & vulnerability detection integrated with Vertex AI. Prompt injection attempts surface as real-time security alerts so the SOC can respond in time (ISO A.6.2.8 / C12.2).",
        ], badge="PHASE 5 • DEPLOYMENT", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=8.7)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "End-to-End Live GCP Scanner & Remediated Blueprint Integration: AegisAI's Live GCP Scanner inspects all 5 services via ephemeral read-only OAuth tokens, and Section 3.4 of every generated Remediated Architecture Blueprint outputs drop-in Terraform/TypeScript enforcement recipes for all 3 phases."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.1)
    else:
        add_header_footer(slide, "Protección IA en Google Cloud", idx, total,
                          "AegisAI Enterprise • Stack de Protección ISO/IEC 42001 (Fases 3, 4 y 5)",
                          "Model Garden/Registry • Model Armor • Vertex Evaluation (AutoSxS) • Model Monitoring • SCC con Protección AI")
        add_title_block(
            slide,
            "Ciclo de Vida de Protección IA en Google Cloud (ISO 42001)",
            "5 Productos Nativos de Seguridad y Gobernanza en las Fases 3, 4 y 5",
            "Cómo AegisAI operacionaliza ISO/IEC 42001:2023 y OWASP AI-SVS v1.0 en Desarrollo, Evaluación y Despliegue Controlado en Producción.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.55, "Fase 3: Desarrollo y Protecciones", [
            "Objetivo: Diseño de sistemas AI, desarrollo y cadena de suministro.",
            "• Mapa Visual de Brechas: Genera un mapa visual y basado en evidencia de las brechas entre el estado actual y el deseado (L1/L2/L3).",
            "• Model Garden / Model Registry: Librería de modelos revisados (Garden) y modelos personales (Registry). Modelos firmados y verificados por Google y socios, evitando modelos de Internet con posibles puertas traseras (ISO A.6.1.2 / A.7.3, C01.4).",
            "• Model Armor: Se posiciona delante de los LLM. Sanitiza entradas y salidas en tiempo real, bloquea inyección de prompts y jailbreaks, y filtra contenido tóxico del usuario y respuestas por igual (ISO A.6.2.6, C02.10).",
        ], badge="FASE 3 • DISEÑO Y PROTECCIÓN", bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_SKY, badge_color=TEXT_SKY, font_size=8.6)

        add_card(slide, 4.72, 2.12, 3.88, 3.55, "Fase 4: Evaluación de Controles", [
            "Objetivo: Revisión automatizada de los controles aplicados.",
            "• Vertex Evaluation Service (AutoSxS): Marco integrado en Vertex AI que utiliza AutoSxS (categoriza y califica respuestas automáticamente como un maestro calificando la tarea de un alumno).",
            "• Métricas de Seguridad: Evalúa discurso de odio, acoso, contenido sexualmente explícito y contenido peligroso.",
            "• Pista de Auditoría ISO 42001: Más rápido y económico que la revisión manual por especialistas, proporcionando la pista de auditoría exigida por ISO/IEC 42001 Cláusula 9.1 y A.6.2.4 (OWASP C08.4).",
        ], badge="FASE 4 • EVALUACIÓN", bg_color=CARD_PURPLE_BG, border_color=BORDER_PURPLE, title_color=TEXT_PURPLE, badge_color=TEXT_PURPLE, font_size=8.6)

        add_card(slide, 8.85, 2.12, 3.88, 3.55, "Fase 5: Despliegue Controlado", [
            "Objetivo: Despliegue controlado en producción y respuesta SOC.",
            "• Vertex AI Model Monitoring: Evalúa el rendimiento en producción detectando sesgo entrenamiento-producción (training-serving skew) y deriva (drift, cuando el mundo cambia y el modelo queda obsoleto), alertando de inmediato si deja de operar con seguridad (ISO Cláusula 9.1 / A.6.2.6).",
            "• Security Command Center (SCC) con Protección AI: Detección de amenazas y vulnerabilidades integrada con Vertex AI. Si alguien envía una inyección de prompts, aparece como alerta en tiempo real para que el SOC responda a tiempo (ISO A.6.2.8 / C12.2).",
        ], badge="FASE 5 • DESPLIEGUE", bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=8.6)

        add_card(slide, 0.6, 5.82, 12.133, 0.92, "", [
            "Integración en Escáner GCP en Vivo y Blueprint Remediado: El Escáner GCP en Vivo de AegisAI audita estos 5 servicios con tokens efímeros de solo lectura, y la Sección 3.4 de cada Arquitectura Remediada genera recetas Terraform/TypeScript listas para producción en las 3 fases."
        ], bg_color=CARD_BG, border_color=BORDER_BLUE, font_size=9.1)


def slide_workflow(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Operational Flow", idx, total,
                          "AegisAI Enterprise • 6-Stage Assurance Lifecycle",
                          "Full multi-standard OWASP AI-SVS + ISO/IEC 42001 traceability")
        add_title_block(
            slide,
            "Operational Execution",
            "The Auditor's Workflow: From Ingestion to 100% Hardening",
            "Six-stage deterministic assurance lifecycle with built-in human oversight and automated code remediation.",
        )
        steps = [
            ("1. Authenticated Ingestion & Model Armor Guardrails", "Corporate user (verified via Cloud IAP + Firebase ID Token) uploads PDFs/ZIPs/specs; Model Armor, inspectPromptAndTrackSession (C02.10) & DLP sanitize input.", BORDER_BLUE, TEXT_SKY),
            ("2. SHA-256 Verified & Model Garden Provenance", "Normative snapshots verified against integrity-manifest.json (C01.4), signed Model Garden/Registry verification & tenant-filtered BYOF (C08.1).", BORDER_BLUE, TEXT_SKY),
            ("3. Deterministic Vertex AI Map-Reduce & AutoSxS", "gemini-3.8-flash (keyless ADC, temperature: 0.0, responseLogprobs: false) evaluates batches with Vertex Evaluation Service (AutoSxS) audit trail.", BORDER_BLUE, TEXT_SKY),
            ("4. Visual Gap Map & Human Appeal (ISO A.5.2)", "Interactive radar charts, evidence-based L1/L2/L3 gap map, and direct Verdict Appeal / Human Review workflow (ai-appeals@aegisai.enterprise).", BORDER_GREEN, TEXT_GREEN),
            ("5. 100% Remediated Architecture & Full Cookbook", "Synthesizes Section 3 drop-in architecture (incl. 3-Phase GCP Protection Stack) + Section 4 Cookbook for all 1..N findings with syntax tags.", BORDER_GREEN, TEXT_GREEN),
            ("6. Model Monitoring, SCC AI & Compensating Saga", "Saved to Firestore with ownerUid ACLs (C05.4), runCompensatingSaga rollback (C09.4), Model Monitoring skew/drift checks & SCC AI real-time SOC alerts.", BORDER_GREEN, TEXT_GREEN),
        ]
    else:
        add_header_footer(slide, "Flujo Operativo", idx, total,
                          "AegisAI Enterprise • Ciclo de Aseguramiento en 6 Etapas",
                          "Trazabilidad completa multi-estándar OWASP AI-SVS + ISO/IEC 42001")
        add_title_block(
            slide,
            "Ejecución Operativa",
            "Flujo de Trabajo del Auditor: De la Ingesta al Blindaje 100%",
            "Ciclo de aseguramiento determinístico en seis etapas con supervisión humana integrada y remediación automática de código.",
        )
        steps = [
            ("1. Ingesta Autenticada y Model Armor Pre-Vuelo", "El auditor corporativo (Cloud IAP + Firebase ID Token) carga PDFs/ZIPs; Model Armor, inspectPromptAndTrackSession (C02.10) y DLP sanean la entrada.", BORDER_BLUE, TEXT_SKY),
            ("2. Contexto SHA-256 y Cadena de Suministro Model Garden", "Snapshots normativos verificados con integrity-manifest.json (C01.4), procedencia firmada en Model Garden/Registry y BYOF por tenantDomain (C08.1).", BORDER_BLUE, TEXT_SKY),
            ("3. Evaluación Map-Reduce en Vertex AI y AutoSxS", "gemini-3.8-flash (ADC sin llaves, temperature: 0.0, responseLogprobs: false) evalúa cada lote con pista de auditoría Vertex Evaluation (AutoSxS).", BORDER_BLUE, TEXT_SKY),
            ("4. Mapa Visual de Brechas y Apelación Humana (A.5.2)", "Gráficos radar interactivos, mapa de brechas L1/L2/L3 basado en evidencia y flujo de Apelación / Revisión Humana (ai-appeals@aegisai.enterprise).", BORDER_GREEN, TEXT_GREEN),
            ("5. Arquitectura Remediada al 100% y Recetario Completo", "Sintetiza la Sección 3 (incl. Stack GCP de 3 Fases ISO 42001) + Sección 4 (Recetario para todos los hallazgos 1..N) con etiquetas de sintaxis precisas.", BORDER_GREEN, TEXT_GREEN),
            ("6. Model Monitoring, SCC AI y Saga Compensatoria", "Guardado en Firestore con ACLs ownerUid (C05.4), reversión runCompensatingSaga (C09.4), monitoreo de skew/drift y alertas SOC en tiempo real vía SCC AI.", BORDER_GREEN, TEXT_GREEN),
        ]

    for i, (stitle, sdesc, border, tcol) in enumerate(steps):
        col = i // 3
        row = i % 3
        x = 0.6 + col * 6.18
        y = 2.12 + row * 1.52
        add_card(slide, x, y, 5.95, 1.38, stitle, [sdesc], border_color=border, title_color=tcol, font_size=9.5)


def slide_specs_benchmarks(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Specs & Verification", idx, total,
                          "AegisAI Enterprise • Verified Engineering Benchmarks",
                          "Audited against OWASP AI-SVS v1.0 & ISO/IEC 42001:2023")
        add_title_block(
            slide,
            "Technical Specifications & Benchmarks",
            "Verified DevSecOps, Firestore Rules & Self-Audit Metrics",
            "Production telemetry and automated verification results from AegisAI v2.5 (Cloud Run revision aegis-ai-00013).",
        )
        add_stat_card(slide, 0.6, 2.08, 2.85, 1.4, "97.8%", "Self-Audit Score (100% ISO 42001 • 94.7% OWASP AI-SVS)", TEXT_GREEN, BORDER_GREEN)
        add_stat_card(slide, 3.69, 2.08, 2.85, 1.4, "308 / 308", "Cloud Firestore Security Rules Unit Tests Passed", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 6.78, 2.08, 2.85, 1.4, "5 GCP AI", "Native ISO 42001 Security Services (Phases 3, 4 & 5)", TEXT_PURPLE, BORDER_PURPLE)
        add_stat_card(slide, 9.88, 2.08, 2.85, 1.4, "0 Failed", "Zero Failed Mandatory Controls in Post-Remediation Audit", TEXT_AMBER, BORDER_AMBER)

        add_card(slide, 0.6, 3.68, 5.95, 3.0, "Runtime, Container & GCP Protection Specs", [
            "• Cloud Run Service: aegis-ai (us-central1, Cloud IAP enforced --no-allow-unauthenticated)",
            "• Container Rootfs: Non-root user aegisuser with chmod -R a-w /app (C04.1)",
            "• Service Account: aegis-runner-sa restricted strictly to roles/aiplatform.user + roles/datastore.user (C05.2)",
            "• 3-Phase GCP Stack: Model Garden/Registry, Model Armor, Vertex Evaluation (AutoSxS), Model Monitoring & SCC AI Protection",
            "• Outbound Network: validateOutboundEndpoint() blocks RFC 1918, loopback & IMDS 169.254.169.254 (C04.3)",
        ], border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 6.78, 3.68, 5.95, 3.0, "Keyless Vertex AI, Multi-Provider & FinOps Specs", [
            "• Default Engine: Google Vertex AI (gemini-3.8-flash) via keyless IAM ADC (no Gemini API key required)",
            "• Multi-Provider Support: Anthropic Claude, OpenRouter, OpenAI Direct & Local/Corporate Proxy",
            "• Anti-DoW Quotas (C11.1): 12 audits / 10 min, max 2 concurrent jobs, 1.5M tokens / 24h per user",
            "• Multi-Turn Guard (C02.10): Model Armor + 6-turn sliding-window crescendo detector (HTTP 422)",
            "• Bilingual Documentation Suite: 8 English PDFs + 9 Spanish PDFs + 3 Executive/FinOps/Master Decks",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.3)
    else:
        add_header_footer(slide, "Especificaciones y Benchmarks", idx, total,
                          "AegisAI Enterprise • Métricas de Ingeniería Verificadas",
                          "Auditado contra OWASP AI-SVS v1.0 e ISO/IEC 42001:2023")
        add_title_block(
            slide,
            "Especificaciones Técnicas y Benchmarks",
            "Métricas Verificadas de DevSecOps, Reglas Firestore y Auto-Auditoría",
            "Telemetría de producción y resultados de verificación automatizada de AegisAI v2.5 (revisión Cloud Run aegis-ai-00013).",
        )
        add_stat_card(slide, 0.6, 2.08, 2.85, 1.4, "97.8%", "Puntaje Auto-Auditoría (100% ISO 42001 • 94.7% OWASP)", TEXT_GREEN, BORDER_GREEN)
        add_stat_card(slide, 3.69, 2.08, 2.85, 1.4, "308 / 308", "Pruebas Unitarias de Reglas Cloud Firestore Aprobadas", TEXT_SKY, BORDER_BLUE)
        add_stat_card(slide, 6.78, 2.08, 2.85, 1.4, "5 GCP AI", "Servicios Nativos de Protección ISO 42001 (Fases 3, 4 y 5)", TEXT_PURPLE, BORDER_PURPLE)
        add_stat_card(slide, 9.88, 2.08, 2.85, 1.4, "0 Fallos", "Cero Controles Obligatorios Fallidos Post-Remediación", TEXT_AMBER, BORDER_AMBER)

        add_card(slide, 0.6, 3.68, 5.95, 3.0, "Endurecimiento de Runtime, Contenedor y Stack GCP", [
            "• Servicio Cloud Run: aegis-ai (us-central1, Cloud IAP obligatorio --no-allow-unauthenticated)",
            "• Sistema de Archivos: Usuario no-root aegisuser con chmod -R a-w /app (C04.1)",
            "• Cuenta de Servicio: aegis-runner-sa restringida a roles/aiplatform.user + roles/datastore.user (C05.2)",
            "• Stack GCP de 3 Fases: Model Garden/Registry, Model Armor, Vertex Evaluation (AutoSxS), Model Monitoring y SCC AI Protection",
            "• Red Saliente: validateOutboundEndpoint() bloquea RFC 1918, loopback e IMDS 169.254.169.254 (C04.3)",
        ], border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.3)

        add_card(slide, 6.78, 3.68, 5.95, 3.0, "Vertex AI sin Llaves, Multi-Proveedor y FinOps", [
            "• Motor Predeterminado: Google Vertex AI (gemini-3.8-flash) vía IAM ADC sin requerir llave API Gemini",
            "• Soporte Multi-Proveedor: Anthropic Claude, OpenRouter, OpenAI Directo y Proxy Local/Corporativo",
            "• Cuotas Anti-DoW (C11.1): 12 auditorías / 10 min, máx 2 concurrentes, 1.5M tokens / 24h por usuario",
            "• Guardia Multi-Turno (C02.10): Model Armor + detector crescendo en ventana de 6 turnos (HTTP 422)",
            "• Suite Documental Bilingüe: 8 PDFs en inglés + 9 PDFs en español + 3 Presentaciones Ejecutivas/FinOps",
        ], border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.3)


def slide_controls_enforced(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Defense-in-Depth Matrix", idx, total,
                          "AegisAI Enterprise • Complete OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 Traceability",
                          "Documented in Manual 2 (Architecture), Manual 3 (Admin), Manual 4/6 (Deployment) & Manual 8 (ISO 42001 AIMS)")
        add_title_block(
            slide,
            "End-to-End Remediation Traceability",
            "OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 Controls Enforced",
            "Comprehensive architectural and governance controls implemented across code, container, cloud perimeter, and AIMS policies.",
        )
        add_card(slide, 0.6, 2.12, 5.95, 4.55, "OWASP AI-SVS v1.0 Technical Controls (17 Hardened Domains)", [
            "• C01.4 & C13.1 Supply Chain: SHA-256 manifest verification + signed Vertex AI Model Garden / Registry provenance.",
            "• C02.10 & C07.1 Prompt/Output Guard: Google Cloud Model Armor inline sanitization + 6-turn Crescendo blocker (HTTP 422).",
            "• C04.1 & C04.3 Infrastructure: Read-only /app (chmod -R a-w), Cloud IAP, VPC egress & validateOutboundEndpoint() SSRF/IMDS block.",
            "• C05.2, C05.3 & C05.4 Auth/IAM: Pruned roles/viewer on aegis-runner-sa, crypto.timingSafeEqual, Firebase ID token & Firestore ownerUid ACLs.",
            "• C08.1 & C08.4 RAG & Evaluation: Tenant domain ACL pre-filtering, Vertex Evaluation Service (AutoSxS) & Model Monitoring skew/drift.",
            "• C09.4 & C10.1–C10.5 Agents/MCP: runCompensatingSaga() rollback, MCP Ed25519/HMAC manifest verification, OAuth 2.1 PKCE & dnsRebindingGuard.",
            "• C11.1, C11.4 & C12.2 FinOps/SIEM: acquireAntiDoWQuota(), responseLogprobs: false & SCC AI Protection real-time SOC alerts.",
        ], bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.1)

        add_card(slide, 6.78, 2.12, 5.95, 4.55, "ISO/IEC 42001:2023 AIMS Governance Controls (18 Clauses & Annex A)", [
            "• Clause 4.1 & 4.2 Context & Stakeholders: Formal internal/external issue matrix, societal role as AI assurance provider & stakeholder mapping.",
            "• Clause 5.1, 5.2, A.2.1 & A.2.3 Leadership & AI Policy: Executive-approved Corporate AI Policy with annual revision cycle.",
            "• Clause 7.2, 7.3 & A.3.3 Competency & Whistleblowing: Mandatory role training & confidential ethics reporting (ai-ethics-whistleblower@aegisai.enterprise).",
            "• A.4.1, A.6.1.2 & A.7.3 AI Asset & Model Supply Chain: Cataloged models verified via Vertex AI Model Garden & private Model Registry.",
            "• A.5.1–A.5.3 & A.6.2.6 Impact, Appeals & Runtime Safety: Formal AIIA, human appeal channel, Model Armor & Vertex AI Model Monitoring.",
            "• Clause 9.1–9.3, A.6.2.4 & A.6.2.8 Assurance & SOC: Vertex Evaluation (AutoSxS) audit trail, semi-annual audits & SCC AI Protection alerts.",
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.1)
    else:
        add_header_footer(slide, "Matriz de Defensa en Profundidad", idx, total,
                          "AegisAI Enterprise • Trazabilidad Completa OWASP AI-SVS v1.0 e ISO/IEC 42001:2023",
                          "Documentado en Manual 2 (Diseño), Manual 3 (Arquitectura), Manual 6 (Despliegue) y Manual 8 (AIMS ISO 42001)")
        add_title_block(
            slide,
            "Trazabilidad Integral de Remediación",
            "Controles Aplicados de OWASP AI-SVS v1.0 e ISO/IEC 42001:2023",
            "Controles arquitectónicos y de gobernanza implementados en código, contenedor, perímetro cloud y políticas AIMS.",
        )
        add_card(slide, 0.6, 2.12, 5.95, 4.55, "Controles Técnicos OWASP AI-SVS v1.0 (17 Dominios Endurecidos)", [
            "• C01.4 y C13.1 Cadena de Suministro: Verificación SHA-256 al arranque + modelos firmados en Vertex AI Model Garden / Registry.",
            "• C02.10 y C07.1 Sanitización en Línea: Google Cloud Model Armor + bloqueo multi-turno Crescendo inspectPromptAndTrackSession() (HTTP 422).",
            "• C04.1 y C04.3 Infraestructura: /app de solo lectura (chmod -R a-w), Cloud IAP, VPC y filtro SSRF/IMDS validateOutboundEndpoint().",
            "• C05.2, C05.3 y C05.4 Auth/IAM: Revocación de roles/viewer en aegis-runner-sa, crypto.timingSafeEqual, Firebase ID token y ACLs ownerUid.",
            "• C08.1 y C08.4 RAG y Evaluación: Pre-filtrado ACL por dominio, Vertex Evaluation Service (AutoSxS) y Model Monitoring (skew/drift).",
            "• C09.4 y C10.1–C10.5 Agentes/MCP: Reversión runCompensatingSaga(), firma Ed25519/HMAC MCP, OAuth 2.1 PKCE y dnsRebindingGuard.",
            "• C11.1, C11.4 y C12.2 FinOps/SIEM: acquireAntiDoWQuota(), responseLogprobs: false y alertas SOC en tiempo real vía SCC AI Protection.",
        ], bg_color=CARD_BLUE_BG, border_color=BORDER_BLUE, title_color=TEXT_SKY, font_size=9.1)

        add_card(slide, 6.78, 2.12, 5.95, 4.55, "Controles de Gobernanza ISO/IEC 42001:2023 AIMS (18 Cláusulas y Anexo A)", [
            "• Cláusula 4.1 y 4.2 Contexto y Stakeholders: Matriz FODA/PESTEL, rol como proveedor de aseguramiento IA y registro de partes interesadas.",
            "• Cláusula 5.1, 5.2, A.2.1 y A.2.3 Liderazgo y Política IA: Política Corporativa de IA aprobada con ciclo de revisión anual.",
            "• Cláusula 7.2, 7.3 y A.3.3 Competencia y Canal Ético: Certificación anual de auditores y canal confidencial (ai-ethics-whistleblower@aegisai.enterprise).",
            "• A.4.1, A.6.1.2 y A.7.3 Activos y Cadena de Suministro IA: Catálogo de modelos verificados y firmados vía Model Garden y Model Registry.",
            "• A.5.1–A.5.3 y A.6.2.6 Impacto, Apelación y Seguridad: Metodología AIIA, apelación humana, Model Armor y Vertex AI Model Monitoring.",
            "• Cláusula 9.1–9.3, A.6.2.4 y A.6.2.8 Evaluación y SOC: Pista de auditoría Vertex Evaluation (AutoSxS), auditorías internas y alertas SCC AI.",
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_GREEN, font_size=9.1)


def slide_roadmap(prs: Presentation, idx: int, total: int, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide)
    if lang == "en":
        add_header_footer(slide, "Strategic Vision", idx, total,
                          "AegisAI Enterprise • Strategic Vision 2026–2027",
                          "Contact: opensource@aegis-ai.dev • GitHub: github.com/fjhuerta-67/AegisAI")
        add_title_block(
            slide,
            "Evolution & Roadmap",
            "Next Horizons in AegisAI Platform Engineering",
            "Our forward-looking roadmap following our Release Candidate presentations to Farmacias del Ahorro, AMF, and Grupo Coppel.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.2, "Native CI/CD Shift-Left Gates", [
            "Official GitHub Actions and GitLab CI Runners to automatically block pull requests introducing prompt injection vulnerabilities, unsigned MCP manifests, or unencrypted vector storage before merging.",
        ], badge="Q4 2026 • Near Term", border_color=BORDER_BLUE, title_color=TEXT_SKY, badge_color=TEXT_SKY, font_size=10.0)

        add_card(slide, 4.72, 2.12, 3.88, 3.2, "Multi-Agent Graph Auditing", [
            "Specialized auditing module for complex autonomous agent workflows (LangGraph, CrewAI, AutoGen): tool authorization boundary checks, compensating saga verification, and inter-agent memory sandboxing.",
        ], badge="Q1 2027 • Medium Term", border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=10.0)

        add_card(slide, 8.85, 2.12, 3.88, 3.2, "Autonomous IaC Remediation", [
            "One-click automated synthesis of Terraform Modules and Helm Charts that directly apply Cloud IAP, VPC Service Controls, and Model Armor remediation recipes to cloud clusters.",
        ], badge="Q2 2027 • Long Term", border_color=BORDER_AMBER, title_color=TEXT_AMBER, badge_color=TEXT_AMBER, font_size=10.0)

        add_card(slide, 0.6, 5.52, 12.133, 1.2, "🎯 Conclusion: Enterprise AI Assurance Built for $19.41, Auditing for $0.08–$0.30", [
            "By combining Google AI Studio, Google Antigravity, Vertex AI Gemini 3.8 Flash, Model Garden/Registry, Model Armor, AutoSxS, Model Monitoring, and SCC AI Protection, AegisAI delivers world-class OWASP AI-SVS & ISO/IEC 42001 assurance at >99% lower cost."
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_WHITE, font_size=9.6)
    else:
        add_header_footer(slide, "Visión Estratégica", idx, total,
                          "AegisAI Enterprise • Visión Estratégica 2026–2027",
                          "Contacto: opensource@aegis-ai.dev • GitHub: github.com/fjhuerta-67/AegisAI")
        add_title_block(
            slide,
            "Evolución y Hoja de Ruta",
            "Siguientes Horizontes en la Ingeniería de AegisAI",
            "Hoja de ruta estratégica tras nuestras presentaciones del Release Candidate ante Farmacias del Ahorro, AMF y Grupo Coppel.",
        )
        add_card(slide, 0.6, 2.12, 3.88, 3.2, "Compuertas Nativas CI/CD Shift-Left", [
            "GitHub Actions y GitLab CI Runners oficiales para bloquear automáticamente Pull Requests que introduzcan vulnerabilidades de inyección de prompts, manifiestos MCP sin firma o bases vectoriales sin cifrado.",
        ], badge="Q4 2026 • Corto Plazo", border_color=BORDER_BLUE, title_color=TEXT_SKY, badge_color=TEXT_SKY, font_size=10.0)

        add_card(slide, 4.72, 2.12, 3.88, 3.2, "Auditoría de Grafos Multi-Agente", [
            "Módulo especializado para auditar flujos de agentes autónomos (LangGraph, CrewAI, AutoGen): fronteras de autorización de herramientas, sagas compensatorias y aislamiento de memoria entre agentes.",
        ], badge="Q1 2027 • Mediano Plazo", border_color=BORDER_GREEN, title_color=TEXT_GREEN, badge_color=TEXT_GREEN, font_size=10.0)

        add_card(slide, 8.85, 2.12, 3.88, 3.2, "Auto-Remediación con IaC", [
            "Síntesis automatizada en un clic de módulos de Terraform y Helm Charts que aplican directamente políticas de Cloud IAP, VPC Service Controls y Model Armor en clústeres productivos.",
        ], badge="Q2 2027 • Largo Plazo", border_color=BORDER_AMBER, title_color=TEXT_AMBER, badge_color=TEXT_AMBER, font_size=10.0)

        add_card(slide, 0.6, 5.52, 12.133, 1.2, "🎯 Conclusión: Aseguramiento Empresarial Construido por $19.41, Auditando por $0.08–$0.30", [
            "Combinando Google AI Studio, Google Antigravity, Vertex AI Gemini 3.8 Flash, Model Garden/Registry, Model Armor, AutoSxS, Model Monitoring y SCC AI Protection, AegisAI opera con >99% menor costo que las alternativas tradicionales."
        ], bg_color=CARD_GREEN_BG, border_color=BORDER_GREEN, title_color=TEXT_WHITE, font_size=9.6)


# ==============================================================================
# ASSEMBLE THE 3 DECKS (IN BOTH ENGLISH AND SPANISH)
# ==============================================================================

def build_executive_deck(lang: str = "en") -> Presentation:
    """Deck 1: 11-Slide Hardened Executive & Technical Presentation."""
    prs = new_widescreen_prs()
    total = 11
    if lang == "en":
        add_cover_slide(
            prs, 1, total,
            "Executive & Technical Presentation",
            "Google Cloud AI Security & ISO/IEC 42001 AIMS Governance Platform",
            "Assurance, Governance &",
            "Continuous AI Auditing",
            "Comprehensive platform to assess, audit, and harden Enterprise Artificial Intelligence Architectures (GenAI, LLMs, Autonomous Agents, MCP & RAG) under global standards OWASP AI-SVS v1.0 (Level L2/L3) and ISO/IEC 42001:2023.",
            [
                ("Cloud IAP Zero-Trust Perimeter", CARD_BLUE_BG, TEXT_SKY),
                ("Vertex AI Gemini 3.8 Flash (Keyless ADC)", CARD_BLUE_BG, TEXT_BLUE),
                ("Model Garden & Model Armor (Phase 3)", CARD_GREEN_BG, TEXT_GREEN),
                ("Vertex Evaluation AutoSxS (Phase 4)", CARD_PURPLE_BG, TEXT_PURPLE),
                ("Model Monitoring & SCC AI (Phase 5)", CARD_GREEN_BG, TEXT_GREEN),
                ("308/308 Firestore Rules Tests Passed", CARD_BLUE_BG, TEXT_SKY),
            ],
            "AegisAI Enterprise v2.5 • Hardened Release 2026",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )
    else:
        add_cover_slide(
            prs, 1, total,
            "Presentación Ejecutiva y Técnica",
            "Google Cloud AI Security & ISO/IEC 42001 AIMS Governance Platform",
            "Aseguramiento, Gobernanza y",
            "Auditoría Continua de IA",
            "Plataforma integral para evaluar, auditar y blindar Arquitecturas de Inteligencia Artificial Empresarial (GenAI, LLMs, Agentes Autónomos, MCP y RAG) bajo estándares mundiales OWASP AI-SVS v1.0 (Nivel L2/L3) e ISO/IEC 42001:2023.",
            [
                ("Perímetro Zero-Trust Cloud IAP", CARD_BLUE_BG, TEXT_SKY),
                ("Vertex AI Gemini 3.8 Flash (ADC sin llaves)", CARD_BLUE_BG, TEXT_BLUE),
                ("Model Garden y Model Armor (Fase 3)", CARD_GREEN_BG, TEXT_GREEN),
                ("Vertex Evaluation AutoSxS (Fase 4)", CARD_PURPLE_BG, TEXT_PURPLE),
                ("Model Monitoring y SCC AI (Fase 5)", CARD_GREEN_BG, TEXT_GREEN),
                ("308/308 Pruebas Firestore Aprobadas", CARD_BLUE_BG, TEXT_SKY),
            ],
            "AegisAI Enterprise v2.5 • Edición Endurecida 2026",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )

    slide_problem(prs, 2, total, lang)
    slide_impact(prs, 3, total, lang)
    slide_solution(prs, 4, total, lang)
    slide_compliance_matrix(prs, 5, total, lang)
    slide_architecture(prs, 6, total, lang)
    slide_gcp_iso42001_lifecycle(prs, 7, total, lang)
    slide_workflow(prs, 8, total, lang)
    slide_specs_benchmarks(prs, 9, total, lang)
    slide_controls_enforced(prs, 10, total, lang)
    slide_roadmap(prs, 11, total, lang)
    return prs


def build_evolution_finops_deck(lang: str = "en") -> Presentation:
    """Deck 2: 13-Slide Evolution, Self-Audit, RC Roadshow, GCP Protection & FinOps Presentation."""
    prs = new_widescreen_prs()
    total = 13
    if lang == "en":
        add_cover_slide(
            prs, 1, total,
            "Engineering Evolution & FinOps Case Study",
            "From Google AI Studio PoC to Antigravity Enterprise RC",
            "Assurance, Self-Auditing &",
            "GenAI FinOps Economics",
            "How AegisAI Enterprise was prototyped in Google AI Studio (Gemini 3.8 to 3.6 Flash), engineered in Google Antigravity (Gemini 3.8 Flash), self-audited against OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 (68.9% ➔ 97.8%), and presented as an RC to Farmacias del Ahorro, Asociación Mexicana de Franquicias, and Grupo Coppel—for a total build cost of $19.41 USD.",
            [
                ("1. AI Studio PoC (Gemini 3.8–3.6 Flash)", CARD_BLUE_BG, TEXT_SKY),
                ("2. Antigravity Full-Stack Build (3.8 Flash)", CARD_BLUE_BG, TEXT_BLUE),
                ("3. Self-Audit Loop: 68.9% ➔ 97.8%", CARD_GREEN_BG, TEXT_GREEN),
                ("4. RC: Farmacias del Ahorro • AMF • Coppel", CARD_PURPLE_BG, TEXT_PURPLE),
                ("5. 3-Phase GCP ISO 42001 Protection Stack", CARD_BLUE_BG, TEXT_SKY),
                ("6. Total App Build Cost: $19.41 USD", CARD_GREEN_BG, TEXT_GREEN),
            ],
            "AegisAI Enterprise v2.5 • Evolution & FinOps Presentation",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )
    else:
        add_cover_slide(
            prs, 1, total,
            "Caso de Estudio de Ingeniería y FinOps",
            "De PoC en Google AI Studio a Release Candidate en Antigravity",
            "Aseguramiento, Auto-Auditoría y",
            "Economía FinOps en GenAI",
            "Cómo AegisAI Enterprise fue prototipado en Google AI Studio (Gemini 3.8 a 3.6 Flash), desarrollado en Google Antigravity (Gemini 3.8 Flash), auto-auditado bajo OWASP AI-SVS v1.0 e ISO/IEC 42001:2023 (68.9% ➔ 97.8%), y presentado como Release Candidate ante Farmacias del Ahorro, Asociación Mexicana de Franquicias y Grupo Coppel—por $19.41 USD en total.",
            [
                ("1. PoC en AI Studio (Gemini 3.8–3.6 Flash)", CARD_BLUE_BG, TEXT_SKY),
                ("2. Ingeniería en Antigravity (3.8 Flash)", CARD_BLUE_BG, TEXT_BLUE),
                ("3. Auto-Auditoría: 68.9% ➔ 97.8%", CARD_GREEN_BG, TEXT_GREEN),
                ("4. RC: Farmacias del Ahorro • AMF • Coppel", CARD_PURPLE_BG, TEXT_PURPLE),
                ("5. Stack GCP ISO 42001 en 3 Fases", CARD_BLUE_BG, TEXT_SKY),
                ("6. Costo Total de Creación: $19.41 USD", CARD_GREEN_BG, TEXT_GREEN),
            ],
            "AegisAI Enterprise v2.5 • Presentación de Evolución y FinOps",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )

    slide_evolution_4stages(prs, 2, total, lang)
    slide_self_audit_loop(prs, 3, total, lang)
    slide_rc_roadshow(prs, 4, total, lang)
    slide_finops_per_audit(prs, 5, total, lang)
    slide_total_build_cost(prs, 6, total, lang)
    slide_problem(prs, 7, total, lang)
    slide_compliance_matrix(prs, 8, total, lang)
    slide_architecture(prs, 9, total, lang)
    slide_gcp_iso42001_lifecycle(prs, 10, total, lang)
    slide_workflow(prs, 11, total, lang)
    slide_controls_enforced(prs, 12, total, lang)
    slide_roadmap(prs, 13, total, lang)
    return prs


def build_unified_master_deck_16(lang: str = "en") -> Presentation:
    """Deck 3: 16-Slide Unified Master Presentation combining EVERY unique slide from both presentations."""
    prs = new_widescreen_prs()
    total = 16
    if lang == "en":
        add_cover_slide(
            prs, 1, total,
            "Unified Master Presentation (Executive + Evolution + FinOps)",
            "Google Cloud AI Security, ISO/IEC 42001 AIMS & GenAI FinOps Platform",
            "AegisAI Enterprise: Architecture,",
            "Evolution, Self-Audit & FinOps",
            "Complete 16-Slide Master Deck combining the Executive & Technical Architecture Presentation with the 3-Phase ISO 42001 Google Cloud Protection Stack, 4-Stage Product Evolution (AI Studio ➔ Antigravity), Recursive Self-Audit (68.9% ➔ 97.8%), Enterprise RC Roadshow, and FinOps Model Cost Benchmark ($19.41 USD Total Build Cost).",
            [
                ("1. AI Studio PoC (Gemini 3.8–3.6 Flash)", CARD_BLUE_BG, TEXT_SKY),
                ("2. Antigravity Full-Stack Build (3.8 Flash)", CARD_BLUE_BG, TEXT_BLUE),
                ("3. Self-Audit Loop: 68.9% ➔ 97.8%", CARD_GREEN_BG, TEXT_GREEN),
                ("4. RC: Farmacias del Ahorro • AMF • Coppel", CARD_PURPLE_BG, TEXT_PURPLE),
                ("5. 3-Phase GCP ISO 42001 Protection Stack", CARD_BLUE_BG, TEXT_SKY),
                ("6. Total App Build Cost: $19.41 USD", CARD_GREEN_BG, TEXT_GREEN),
            ],
            "AegisAI Enterprise v2.5 • Unified Master Presentation",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )
    else:
        add_cover_slide(
            prs, 1, total,
            "Presentación Maestra Unificada (Ejecutiva + Evolución + FinOps)",
            "Google Cloud AI Security, ISO/IEC 42001 AIMS & GenAI FinOps Platform",
            "AegisAI Enterprise: Arquitectura,",
            "Evolución, Auto-Auditoría y FinOps",
            "Presentación Maestra Unificada de 16 diapositivas que combina la Presentación Ejecutiva y de Arquitectura Técnica con el Stack GCP ISO 42001 en 3 Fases, la Evolución en 4 Etapas (AI Studio ➔ Antigravity), Auto-Auditoría (68.9% ➔ 97.8%), Roadshow del Release Candidate y Benchmark FinOps ($19.41 USD de Costo Total de Creación).",
            [
                ("1. PoC en AI Studio (Gemini 3.8–3.6 Flash)", CARD_BLUE_BG, TEXT_SKY),
                ("2. Ingeniería en Antigravity (3.8 Flash)", CARD_BLUE_BG, TEXT_BLUE),
                ("3. Auto-Auditoría: 68.9% ➔ 97.8%", CARD_GREEN_BG, TEXT_GREEN),
                ("4. RC: Farmacias del Ahorro • AMF • Coppel", CARD_PURPLE_BG, TEXT_PURPLE),
                ("5. Stack GCP ISO 42001 en 3 Fases", CARD_BLUE_BG, TEXT_SKY),
                ("6. Costo Total de Creación: $19.41 USD", CARD_GREEN_BG, TEXT_GREEN),
            ],
            "AegisAI Enterprise v2.5 • Presentación Maestra Unificada",
            "Google Cloud Run • Vertex AI • Model Armor • AutoSxS • SCC AI Protection",
        )

    slide_problem(prs, 2, total, lang)
    slide_impact(prs, 3, total, lang)
    slide_solution(prs, 4, total, lang)
    slide_evolution_4stages(prs, 5, total, lang)
    slide_self_audit_loop(prs, 6, total, lang)
    slide_rc_roadshow(prs, 7, total, lang)
    slide_finops_per_audit(prs, 8, total, lang)
    slide_total_build_cost(prs, 9, total, lang)
    slide_compliance_matrix(prs, 10, total, lang)
    slide_architecture(prs, 11, total, lang)
    slide_gcp_iso42001_lifecycle(prs, 12, total, lang)
    slide_workflow(prs, 13, total, lang)
    slide_specs_benchmarks(prs, 14, total, lang)
    slide_controls_enforced(prs, 15, total, lang)
    slide_roadmap(prs, 16, total, lang)
    return prs


if __name__ == "__main__":
    os.makedirs("docs/Manuals_english/pdf", exist_ok=True)
    os.makedirs("docs/manuales_pdf/english", exist_ok=True)
    os.makedirs("docs/manuales_pdf", exist_ok=True)

    outputs = [
        ("docs/Manuals_english/pdf/AegisAI_Executive_Presentation.pptx", build_executive_deck("en")),
        ("docs/Manuals_english/pdf/AegisAI_Evolution_and_FinOps_Presentation.pptx", build_evolution_finops_deck("en")),
        ("docs/Manuals_english/pdf/AegisAI_Complete_Master_Presentation.pptx", build_unified_master_deck_16("en")),
        ("docs/manuales_pdf/AegisAI_Presentacion_Ejecutiva.pptx", build_executive_deck("es")),
        ("docs/manuales_pdf/AegisAI_Presentacion_Evolucion_y_Costos.pptx", build_evolution_finops_deck("es")),
        ("docs/manuales_pdf/AegisAI_Presentacion_Maestra_Completa.pptx", build_unified_master_deck_16("es")),
    ]

    for path, prs in outputs:
        prs.save(path)
        size_kb = os.path.getsize(path) / 1024.0
        print(f"Created {path} ({len(prs.slides)} slides, {size_kb:.1f} KB)")
        if path.startswith("docs/Manuals_english/pdf/"):
            mirror = os.path.join("docs/manuales_pdf/english", os.path.basename(path))
            shutil.copy(path, mirror)

