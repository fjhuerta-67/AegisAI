#!/usr/bin/env python3
"""
AegisAI — 7-Minute Keynote / Presentation Slide
Billboard-style typography: giant text, zero paragraphs, maximum impact.
Designed so the speaker owns the room and the slide provides instant visual proof.
"""

import subprocess, sys, os
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent.parent / "docs" / "architecture"
OUT_DIR.mkdir(parents=True, exist_ok=True)
SCRIPT_DIR = Path(__file__).parent

# 16:9 Widescreen Presentation Canvas
W, H = 2800, 1575

# ── Color Palette ────────────────────────────────────────────────────────────
BLUE   = "#1A73E8"
DBLUE  = "#0D47A1"
GREEN  = "#188038"
ORANGE = "#E37400"
RED    = "#D93025"
AMBER  = "#F29900"
PURPLE = "#8430CE"
TEAL   = "#007B83"

LBLUE  = "#E8F0FE"
LGREEN = "#CEEAD6"
LORANGE= "#FFE0B2"
LRED   = "#FCE8E6"
LPURP  = "#F3E8FD"
LTEAL  = "#E0F2F1"
LBROWN = "#FEF7E0"

BORDER = "#DADCE0"
TEXT1  = "#202124"
TEXT2  = "#3C4043"
MUTED  = "#5F6368"

def pillar(id_, x, y, w, h, stage_num, title, subtitle, bg, border, tc):
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:{bg};border:2.5px solid {border};border-radius:28px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.05);">
  <div style="position:absolute;top:24px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;">
    <div>
      <div style="font-size:13px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;color:{tc};opacity:0.95;">PILLAR {stage_num}</div>
      <div style="font-size:24px;font-weight:900;color:{TEXT1};margin-top:2px;letter-spacing:-0.3px;">{title}</div>
      <div style="font-size:14px;color:{MUTED};margin-top:2px;font-weight:600;">{subtitle}</div>
    </div>
    <div style="width:42px;height:42px;border-radius:12px;background:white;border:2.5px solid {border};
      display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;color:{tc};box-shadow:0 2px 10px rgba(0,0,0,0.08);">{stage_num}</div>
  </div>
</div>"""

def keynote_card(id_, x, y, w, h, icon, headline, key_tag, pill_text, bc=BLUE, bbg=LBLUE, icon_bg=LBLUE):
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:white;border-radius:20px;border:2px solid {BORDER};
  box-shadow:0 4px 20px rgba(0,0,0,0.06);padding:24px 26px;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="display:flex;align-items:center;gap:18px;margin-bottom:12px;">
      <div style="width:54px;height:54px;border-radius:14px;background:{icon_bg};display:flex;align-items:center;justify-content:center;font-size:30px;flex-shrink:0;">{icon}</div>
      <div>
        <div style="font-size:20px;font-weight:900;color:{TEXT1};line-height:1.2;letter-spacing:-0.2px;">{headline}</div>
        <div style="font-size:14px;font-weight:700;color:{bc};margin-top:4px;">{key_tag}</div>
      </div>
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;border-top:1.5px solid #F1F3F4;padding-top:12px;">
    <span style="display:inline-block;background:{bbg};color:{bc};font-size:12.5px;font-weight:800;padding:5px 14px;border-radius:20px;letter-spacing:0.4px;">{pill_text}</span>
    <span style="font-size:12.5px;font-weight:700;color:{MUTED};">Verified in Code ✓</span>
  </div>
</div>"""

def flow_step(num, title, sub, color):
    return f"""
<div style="display:flex;align-items:center;gap:14px;flex:1;">
  <div style="width:38px;height:38px;border-radius:50%;background:{color};color:white;
    font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;
    box-shadow:0 3px 10px rgba(0,0,0,0.2);flex-shrink:0;">{num}</div>
  <div>
    <div style="font-size:14.5px;font-weight:900;color:{TEXT1};">{title}</div>
    <div style="font-size:12px;font-weight:600;color:{MUTED};line-height:1.2;">{sub}</div>
  </div>
</div>"""

def step_badge(n, x, y, label, color=BLUE):
    return f"""
<div style="position:absolute;left:{x-20}px;top:{y-20}px;width:40px;height:40px;
  border-radius:50%;background:{color};color:white;
  font-size:16px;font-weight:900;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 12px rgba(0,0,0,0.28);z-index:35;">{n}</div>
{f'<div style="position:absolute;left:{x-65}px;top:{y+26}px;width:130px;text-align:center;font-size:12px;font-weight:800;color:{color};line-height:1.2;z-index:35;text-shadow:0 1px 3px white;">{label}</div>' if label else ''}"""

def svg_defs(*cols):
    d = "<defs>"
    for c in set(cols):
        cid = c.replace("#","")
        d += f'''<marker id="a{cid}" markerWidth="11" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0,11 4,0 8" fill="{c}"/>
        </marker>'''
    return d + "</defs>"

def arr(x1, y1, x2, y2, c, dash=False, sw=3.5):
    da = 'stroke-dasharray="9 6"' if dash else ''
    cid = c.replace("#","")
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}" {da} marker-end="url(#a{cid})" opacity="0.95"/>'

# ── Assemble Diagram ─────────────────────────────────────────────────────────

def build_html():
    TOP = 200
    ZH = 1160
    BOT = TOP + ZH # 1360

    # 4 Pillars Horizontal Geometry (W = 2800)
    # Margins: 80px left and right. Gaps: 60px.
    # W_pillar = 615px
    X1, X2, X3, X4 = 80, 755, 1430, 2105
    W_COL = 615

    # 1. PILLAR BACKGROUNDS
    p1 = pillar("p1", X1, TOP, W_COL, ZH, "1", "Perimeter &amp; Identity", "Zero-Trust Access &amp; Quotas", LBLUE, "#A6C8FF", BLUE)
    p2 = pillar("p2", X2, TOP, W_COL, ZH, "2", "AegisAI Serverless Core", "Audit Engine &amp; Posture Scanner", LTEAL, "#8FD0CC", TEAL)
    p3 = pillar("p3", X3, TOP, W_COL, ZH, "3", "Google Vertex AI", "Model Armor &amp; Gemini Multimodal", LORANGE, "#FFCC80", ORANGE)
    p4 = pillar("p4", X4, TOP, W_COL, ZH, "4", "Sovereign Storage &amp; Trail", "nam5 Multi-Region &amp; Logging", LBROWN, "#FFE082", AMBER)

    # 4 Cards per Pillar
    # Card Width = 615 - 48 = 567px
    # Height = 238px. Gaps = 26px.
    CW = 567
    CX1, CX2, CX3, CX4 = X1 + 24, X2 + 24, X3 + 24, X4 + 24
    CY1 = TOP + 104
    CY2 = CY1 + 238 + 26 # TOP + 368
    CY3 = CY2 + 238 + 26 # TOP + 632
    CY4 = CY3 + 238 + 26 # TOP + 896
    CH = 238

    # ── PILLAR 1: ZERO-TRUST PERIMETER ───────────────────────────────────────
    c1a = keynote_card("c1a", CX1, CY1, CW, CH, "👥",
                       "Corporate Google Sign-In",
                       "Strict Domain Allowlist · Zero Personal Leaks",
                       "Google OAuth 2.0", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)
    c1b = keynote_card("c1b", CX1, CY2, CW, CH, "🔒",
                       "Cloud Identity-Aware Proxy",
                       "Zero-Trust Perimeter · Zero Public Backend Access",
                       "Cloud IAP Enforced", bc=GREEN, bbg=LGREEN, icon_bg=LGREEN)
    c1c = keynote_card("c1c", CX1, CY3, CW, CH, "🛡️",
                       "Anti-Denial-of-Wallet (DoW)",
                       "Built-in 30 Req / 15 Min Rolling Quota &amp; Concurrency",
                       "Built-in Serverless Defense", bc=ORANGE, bbg=LORANGE, icon_bg=LORANGE)
    c1d = keynote_card("c1d", CX1, CY4, CW, CH, "🗝️",
                       "Secret Manager Credentials",
                       "Keyless Container Access · Zero Code Secrets",
                       "Keyless Security", bc=PURPLE, bbg=LPURP, icon_bg=LPURP)

    # ── PILLAR 2: AEGISAI SERVERLESS CORE ────────────────────────────────────
    c2a = keynote_card("c2a", CX2, CY1, CW, CH, "🧠",
                       "Multi-Framework Audit Engine",
                       "Automated Architecture Scoring · ISO 42001 &amp; AISVS",
                       "Cloud Run Serverless", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)
    c2b = keynote_card("c2b", CX2, CY2, CW, CH, "🔍",
                       "AI-Focused GCP Scanner",
                       "Deep AI Workload Audit (Beyond Generic SCC)",
                       "Live Environment Audit", bc=TEAL, bbg=LTEAL, icon_bg=LTEAL)
    c2c = keynote_card("c2c", CX2, CY3, CW, CH, "🔀",
                       "Resilient Model Failover",
                       "In-Code Model Router · Automated Retries &amp; Fallbacks",
                       "High Availability", bc=GREEN, bbg=LGREEN, icon_bg=LGREEN)
    c2d = keynote_card("c2d", CX2, CY4, CW, CH, "🖥️",
                       "Live Executive Dashboard",
                       "Real-Time SSE Streaming · Downloadable Board Packs",
                       "Interactive UI &amp; PDF", bc=PURPLE, bbg=LPURP, icon_bg=LPURP)

    # ── PILLAR 3: GOOGLE VERTEX AI & GUARDRAILS ──────────────────────────────
    c3a = keynote_card("c3a", CX3, CY1, CW, CH, "🛡️",
                       "Google Model Armor Firewall",
                       "Real-Time Inline Prompt-Injection &amp; Jailbreak Filter",
                       "Sub-15ms Inline Guardrail", bc=RED, bbg=LRED, icon_bg=LRED)
    c3b = keynote_card("c3b", CX3, CY2, CW, CH, "✨",
                       "Gemini Multimodal Reasoning",
                       "Flagship AI Engine · Supports Any Gemini Version",
                       "3.8 Flash / Pro / Any Model", bc=ORANGE, bbg=LORANGE, icon_bg=LORANGE)
    c3c = keynote_card("c3c", CX3, CY3, CW, CH, "🔑",
                       "Keyless Service Account (ADC)",
                       "Native Google Cloud Identity · Zero Static API Keys",
                       "Ambient ADC", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)
    c3d = keynote_card("c3d", CX3, CY4, CW, CH, "🔒",
                       "Zero Customer Data Training",
                       "Commercial Vertex AI Terms · 100% Private Tenancy",
                       "Enterprise Privacy", bc=GREEN, bbg=LGREEN, icon_bg=LGREEN)

    # ── PILLAR 4: SOVEREIGN STORAGE & AUDIT TRAIL ────────────────────────────
    c4a = keynote_card("c4a", CX4, CY1, CW, CH, "🌍",
                       "Firestore nam5 Multi-Region",
                       "Geo-Redundant US Storage · Encrypted At-Rest &amp; Transit",
                       "nam5 Multi-Region", bc=AMBER, bbg=LBROWN, icon_bg=LBROWN)
    c4b = keynote_card("c4b", CX4, CY2, CW, CH, "📁",
                       "Tamper-Proof Audit Vault",
                       "Immutable Evidence Trail · Verbatim Citations &amp; Plans",
                       "Audits Repository", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)
    c4c = keynote_card("c4c", CX4, CY3, CW, CH, "🚨",
                       "Active Security Alert Ledger",
                       "Live Record of Intercepted Prompt Attacks &amp; Quotas",
                       "security_alerts Collection", bc=RED, bbg=LRED, icon_bg=LRED)
    c4d = keynote_card("c4d", CX4, CY4, CW, CH, "📋",
                       "Google Cloud Logging Trail",
                       "Tamper-Evident Structured JSON Logs · SIEM Exportable",
                       "Centralized Audit Log", bc=TEAL, bbg=LTEAL, icon_bg=LTEAL)

    # ── 2. TOP HERO FLOW RIBBON ──────────────────────────────────────────────
    flow_ribbon = f"""
<div style="position:absolute;left:80px;top:98px;width:{W-160}px;height:78px;
  background:white;border:2px solid {BORDER};border-radius:20px;
  display:flex;align-items:center;padding:0 32px;box-shadow:0 4px 18px rgba(0,0,0,0.05);z-index:40;">
  <div style="font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};margin-right:28px;white-space:nowrap;display:flex;align-items:center;gap:10px;">
    <span style="font-size:22px;">⚡</span> THE 60-SECOND AUDIT FLOW
  </div>
  <div style="height:40px;width:2px;background:{BORDER};margin-right:28px;"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-grow:1;gap:16px;">
    {flow_step("1", "Blueprint Input", "Upload AI architecture", BLUE)}
    <div style="color:{BORDER};font-size:24px;font-weight:300;">→</div>
    {flow_step("2", "Zero-Trust IAP", "Domain verified gate", GREEN)}
    <div style="color:{BORDER};font-size:24px;font-weight:300;">→</div>
    {flow_step("3", "Evidence Scan", "Parse configs & GCP", TEAL)}
    <div style="color:{BORDER};font-size:24px;font-weight:300;">→</div>
    {flow_step("4", "Model Armor", "Block prompt attacks", RED)}
    <div style="color:{BORDER};font-size:24px;font-weight:300;">→</div>
    {flow_step("5", "Gemini Reason", "Score against ISO", ORANGE)}
    <div style="color:{BORDER};font-size:24px;font-weight:300;">→</div>
    {flow_step("6", "Audit Stored", "nam5 DB & alerts", AMBER)}
  </div>
</div>"""

    # ── 3. SVG CONNECTORS ACROSS GAPS (60px gaps) ────────────────────────────
    defs = svg_defs(BLUE, GREEN, ORANGE, RED, AMBER, PURPLE, TEAL)

    # Gap 1 (695 -> 755): Pillar 1 -> Pillar 2
    a1 = arr(695, TOP + 220, 755, TOP + 220, BLUE)
    # Gap 2 (1370 -> 1430): Pillar 2 -> Pillar 3
    a2 = arr(1370, TOP + 220, 1430, TOP + 220, RED)
    # Gap 3 (2045 -> 2105): Pillar 3 -> Pillar 4
    a3 = arr(2045, TOP + 220, 2105, TOP + 220, AMBER)

    # Return stream: From Pillar 4 (Firestore) back to Pillar 2 (Dashboard)
    ret_y = BOT - 42
    ret_arrow = f"""
  <path d="M 2105,{ret_y} L 1370,{ret_y}" stroke="{PURPLE}" stroke-width="3.5" stroke-dasharray="9 6" fill="none" marker-end="url(#a{PURPLE.replace('#','')})"/>
  <rect x="1580" y="{ret_y-16}" width="310" height="32" rx="16" fill="{PURPLE}" opacity="0.95"/>
  <text x="1735" y="{ret_y+5}" text-anchor="middle" fill="white" font-family="'Google Sans',Arial,sans-serif" font-size="13px" font-weight="800">Real-Time SSE Result Stream to Dashboard</text>
"""

    svg = f"""<svg style="position:absolute;top:0;left:0;width:{W}px;height:{H}px;overflow:visible;pointer-events:none;z-index:30;">
  {defs}
  {a1}{a2}{a3}
  {ret_arrow}
</svg>"""

    # Badges centered in the 60px gaps
    step_badges = "".join([
        step_badge("①", 725,  TOP + 220, "Authorized Ingress", BLUE),
        step_badge("②", 1400, TOP + 220, "Sanitized AI Call", RED),
        step_badge("③", 2075, TOP + 220, "Store Evidence", AMBER),
    ])

    # ── 4. BOTTOM COMPLIANCE & SOVEREIGNTY FOOTER ────────────────────────────
    FOOTER_Y = 1390
    stds = [
        ("ISO/IEC 42001:2023", "AI Management System (Phases 3, 4 & 5)"),
        ("OWASP AISVS v1.0", "AI Security Verification Standard (L1–L3)"),
        ("EU AI Act Ready", "High-Risk AI Governance & Transparency"),
        ("Mexico NOM AI Ready", "Data Sovereignty & Security Alignment"),
    ]
    stds_html = "".join(f"""
    <div style="background:{LBLUE};border:2px solid #BBD6FB;border-radius:14px;padding:10px 20px;flex:1;">
      <div style="font-size:14.5px;font-weight:900;color:{DBLUE};">{s}</div>
      <div style="font-size:11.5px;font-weight:700;color:{TEXT2};margin-top:2px;">{d}</div>
    </div>""" for s, d in stds)

    sovereignty = [
        ("100% Serverless", "Scales to zero · Zero idle cost"),
        ("nam5 Multi-Region", "US geo-redundancy · Encrypted"),
        ("Zero Data Training", "Prompts never train base models"),
        ("Keyless IAM Security", "Ambient ADC · Zero static keys"),
    ]
    sov_html = "".join(f"""
    <div style="display:flex;align-items:center;gap:12px;flex:1;">
      <div style="font-size:20px;line-height:1;">🛡️</div>
      <div>
        <div style="font-size:13.5px;font-weight:900;color:{TEXT1};">{title}</div>
        <div style="font-size:11.5px;font-weight:600;color:{MUTED};margin-top:1px;">{desc}</div>
      </div>
    </div>""" for title, desc in sovereignty)

    footer = f"""
<div style="position:absolute;left:80px;top:{FOOTER_Y}px;width:{W-160}px;height:148px;
  background:white;border:2px solid {BORDER};border-radius:22px;padding:20px 32px;
  display:flex;align-items:stretch;gap:36px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">
  <div style="flex:1.25;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:8px;">
      <span>📜</span> AUDITED REGULATORY FRAMEWORKS
    </div>
    <div style="display:flex;gap:14px;align-items:stretch;">{stds_html}</div>
  </div>
  <div style="width:2px;background:{BORDER};margin:4px 0;"></div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:12px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:8px;">
      <span>🔐</span> ENTERPRISE SOVEREIGNTY &amp; PRIVACY
    </div>
    <div style="display:flex;gap:16px;align-items:stretch;">{sov_html}</div>
  </div>
</div>"""

    # ── 5. TOP EXECUTIVE TITLE BAR ───────────────────────────────────────────
    header = f"""
<div style="position:absolute;top:0;left:0;width:{W}px;height:82px;
  background:linear-gradient(135deg, {BLUE} 0%, {DBLUE} 100%);
  display:flex;align-items:center;padding:0 44px;gap:16px;z-index:100;box-shadow:0 4px 24px rgba(13,71,161,0.28);">
  <div style="width:50px;height:50px;background:white;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;box-shadow:0 2px 10px rgba(0,0,0,0.18);">🛡️</div>
  <div>
    <div style="color:white;font-size:22px;font-weight:900;letter-spacing:-0.2px;">AegisAI — Enterprise Architecture Overview</div>
    <div style="color:rgba(255,255,255,0.85);font-size:13px;margin-top:2px;font-weight:500;">
      Automated AI Security, Governance &amp; Compliance Auditing Platform on Google Cloud
    </div>
  </div>
  <div style="margin-left:auto;display:flex;gap:40px;align-items:center;">
    {"".join(f'''
    <div style="text-align:right;">
      <div style="color:white;font-size:18px;font-weight:900;letter-spacing:0.5px;">{val}</div>
      <div style="color:rgba(255,255,255,0.75);font-size:10.5px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;">{lbl}</div>
    </div>''' for val, lbl in [
        ("100% Serverless", "Cloud Run Infrastructure"),
        ("Zero Trust", "Perimeter & Identity"),
        ("Model Armor", "Real-Time AI Guardrail"),
        ("Multi-Region nam5", "Sovereign Storage"),
    ])}
  </div>
</div>"""

    elements = [
        header, flow_ribbon,
        p1, p2, p3, p4,
        c1a, c1b, c1c, c1d,
        c2a, c2b, c2c, c2d,
        c3a, c3b, c3c, c3d,
        c4a, c4b, c4c, c4d,
        svg, step_badges,
        footer
    ]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>AegisAI — Keynote Presentation Architecture</title>
<style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
body {{
  width:{W}px; height:{H}px;
  background:#F4F6F9;
  font-family:'Google Sans','Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  overflow:hidden;
  -webkit-font-smoothing:antialiased;
}}
</style>
</head>
<body>
{"".join(elements)}
</body>
</html>"""

# ── Puppeteer Render Engine ──────────────────────────────────────────────────
PUPPETEER_SCRIPT = r"""
const pup = require('puppeteer');
const path = require('path');
const fs   = require('fs');

(async () => {
  const htmlFile = process.argv[2];
  const outDir   = process.argv[3];
  const W = 2800, H = 1575;

  const browser = await pup.launch({
    executablePath: '/usr/bin/google-chrome-stable',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--force-device-scale-factor=1'
    ],
    headless: true,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(htmlFile), { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // QA Check for overflows
  const overflows = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('[id]').forEach(el => {
      if (el.scrollHeight > el.clientHeight + 4 || el.scrollWidth > el.clientWidth + 4) {
        bad.push({
          id: el.id,
          sh: el.scrollHeight, ch: el.clientHeight,
          sw: el.scrollWidth,  cw: el.clientWidth
        });
      }
    });
    return bad;
  });

  if (overflows.length > 0) {
    console.error('⚠️ Layout QA Warnings (overflow detected):');
    overflows.forEach(o => console.error(`  #${o.id}: scrollH ${o.sh} > clientH ${o.ch} | scrollW ${o.sw} > clientW ${o.cw}`));
  } else {
    console.log('✓ Layout QA: perfectly clean, no overflowing elements');
  }

  // 1x Presentation PNG
  const png1x = path.join(outDir, 'AegisAI_Keynote_Architecture.png');
  await page.screenshot({ path: png1x, fullPage: false });
  console.log('✓ Generated 1x PNG:', fs.statSync(png1x).size, 'bytes');

  // 4K Ultra-HD PNG
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  const png4k = path.join(outDir, 'AegisAI_Keynote_Architecture_4K.png');
  await page.screenshot({ path: png4k, fullPage: false });
  console.log('✓ Generated 4K PNG:', fs.statSync(png4k).size, 'bytes');

  // Vector PDF
  const pdf = path.join(outDir, 'AegisAI_Keynote_Architecture.pdf');
  await page.pdf({
    path: pdf,
    width: W + 'px',
    height: H + 'px',
    printBackground: true,
    pageRanges: '1',
  });
  console.log('✓ Generated Vector PDF:', fs.statSync(pdf).size, 'bytes');

  await browser.close();
  console.log('All keynote assets rendered successfully.');
})().catch(err => {
  console.error('Error during render:', err);
  process.exit(1);
});
"""

if __name__ == "__main__":
    html_file = OUT_DIR / "AegisAI_Keynote_Architecture.html"
    render_cjs = SCRIPT_DIR / "_keynote_render.cjs"

    print("Generating Keynote HTML...")
    html_content = build_html()
    html_file.write_text(html_content, encoding="utf-8")
    print(f"  → Written {html_file} ({html_file.stat().st_size:,} bytes)")

    render_cjs.write_text(PUPPETEER_SCRIPT, encoding="utf-8")

    env = os.environ.copy()
    env["NODE_PATH"] = "/tmp/pup_standalone/node_modules"

    print("Rendering keynote diagram (1x, 4K, PDF)...")
    res = subprocess.run(
        ["node", str(render_cjs), str(html_file), str(OUT_DIR)],
        env=env, capture_output=True, text=True
    )

    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    if res.returncode != 0:
        sys.exit(res.returncode)

    print("Generating Vector SVG from PDF...")
    pdf_file = OUT_DIR / "AegisAI_Keynote_Architecture.pdf"
    svg_file = OUT_DIR / "AegisAI_Keynote_Architecture.svg"
    r_svg = subprocess.run(["pdftocairo", "-svg", str(pdf_file), str(svg_file)], capture_output=True, text=True)
    if svg_file.exists():
        print(f"✓ Generated Vector SVG: {svg_file.stat().st_size:,} bytes")
    else:
        print("Warning: pdftocairo could not generate SVG:", r_svg.stderr)

    if render_cjs.exists():
        render_cjs.unlink()

    print(f"\nAll keynote presentation assets successfully saved in {OUT_DIR}")
