#!/usr/bin/env python3
"""
AegisAI — C-Level Executive Architecture Overview
Designed specifically for board-level and executive presentations.
Clean 4-pillar strategic layout, 16:9 widescreen, 100% verified & defensible.
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

# ── Helper Components ────────────────────────────────────────────────────────

def pillar(id_, x, y, w, h, stage_num, title, subtitle, bg, border, tc):
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:{bg};border:2px solid {border};border-radius:24px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,0.04);">
  <div style="position:absolute;top:22px;left:26px;right:26px;display:flex;align-items:flex-start;justify-content:space-between;">
    <div>
      <div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:{tc};opacity:0.9;">PILLAR {stage_num}</div>
      <div style="font-size:18px;font-weight:800;color:{TEXT1};margin-top:2px;">{title}</div>
      <div style="font-size:12.5px;color:{MUTED};margin-top:2px;font-weight:500;">{subtitle}</div>
    </div>
    <div style="width:34px;height:34px;border-radius:10px;background:white;border:2px solid {border};
      display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:{tc};box-shadow:0 2px 8px rgba(0,0,0,0.06);">{stage_num}</div>
  </div>
</div>"""

def card(id_, x, y, w, h, icon, name, desc, badge=None, bc=BLUE, bbg=LBLUE, extra_tag=None):
    badge_html = ""
    if badge:
        badge_html = f'''<div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px;">
          <span style="display:inline-block;background:{bbg};color:{bc};font-size:11px;font-weight:700;padding:4px 12px;border-radius:16px;letter-spacing:0.3px;white-space:nowrap;">{badge}</span>
          {f'<span style="font-size:11px;font-weight:600;color:{MUTED};">{extra_tag}</span>' if extra_tag else ''}
        </div>'''
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:white;border-radius:16px;border:1.5px solid {BORDER};
  box-shadow:0 4px 16px rgba(0,0,0,0.06);padding:22px 24px;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:10px;">
      <div style="width:44px;height:44px;border-radius:12px;background:{bbg};display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;">{icon}</div>
      <div style="font-size:16.5px;font-weight:700;color:{TEXT1};line-height:1.2;">{name}</div>
    </div>
    <div style="font-size:13px;color:{TEXT2};line-height:1.55;margin-top:4px;">{desc}</div>
  </div>
  {badge_html}
</div>"""

def flow_step(num, title, desc, color):
    return f"""
<div style="display:flex;align-items:center;gap:12px;flex:1;">
  <div style="width:32px;height:32px;border-radius:50%;background:{color};color:white;
    font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 8px rgba(0,0,0,0.18);flex-shrink:0;">{num}</div>
  <div>
    <div style="font-size:12.5px;font-weight:700;color:{TEXT1};">{title}</div>
    <div style="font-size:11px;color:{MUTED};line-height:1.2;">{desc}</div>
  </div>
</div>"""

def step_badge(n, x, y, label, color=BLUE):
    return f"""
<div style="position:absolute;left:{x-17}px;top:{y-17}px;width:34px;height:34px;
  border-radius:50%;background:{color};color:white;
  font-size:14px;font-weight:800;display:flex;align-items:center;justify-content:center;
  box-shadow:0 3px 10px rgba(0,0,0,0.25);z-index:35;">{n}</div>
{f'<div style="position:absolute;left:{x-55}px;top:{y+22}px;width:110px;text-align:center;font-size:11px;font-weight:700;color:{color};line-height:1.15;z-index:35;text-shadow:0 1px 2px white;">{label}</div>' if label else ''}"""

def svg_defs(*cols):
    d = "<defs>"
    for c in set(cols):
        cid = c.replace("#","")
        d += f'''<marker id="a{cid}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0,10 3.5,0 7" fill="{c}"/>
        </marker>'''
    return d + "</defs>"

def arr(x1, y1, x2, y2, c, dash=False, sw=3):
    da = 'stroke-dasharray="8 6"' if dash else ''
    cid = c.replace("#","")
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}" {da} marker-end="url(#a{cid})" opacity="0.95"/>'

# ── Assemble Diagram ─────────────────────────────────────────────────────────

def build_html():
    TOP = 195
    ZH = 1170
    BOT = TOP + ZH # 1365

    # 4 Pillars Horizontal Geometry:
    # Margins: left=80, right=80. Gaps: 60px.
    # W_pillar = 615px
    # Col 1: 80 .. 695
    # Gap 1: 695 .. 755
    # Col 2: 755 .. 1370
    # Gap 2: 1370 .. 1430
    # Col 3: 1430 .. 2045
    # Gap 3: 2045 .. 2105
    # Col 4: 2105 .. 2720
    X1, X2, X3, X4 = 80, 755, 1430, 2105
    W_COL = 615

    # 1. PILLAR BACKGROUNDS
    p1 = pillar("p1", X1, TOP, W_COL, ZH, "1", "Perimeter &amp; Identity", "Zero-Trust Access &amp; Anti-DoW Quotas", LBLUE, "#BBD6FB", BLUE)
    p2 = pillar("p2", X2, TOP, W_COL, ZH, "2", "AegisAI Intelligence Core", "Serverless Engine &amp; Posture Scanner", LTEAL, "#A3D9D5", TEAL)
    p3 = pillar("p3", X3, TOP, W_COL, ZH, "3", "Google Vertex AI &amp; Guardrails", "Model Armor Firewall &amp; Gemini Reasoning", LORANGE, "#FCD8A8", ORANGE)
    p4 = pillar("p4", X4, TOP, W_COL, ZH, "4", "Sovereign Storage &amp; Audit Trail", "Multi-Region Firestore &amp; Cloud Logging", LBROWN, "#F6DE84", AMBER)

    # CARD GEOMETRY INSIDE PILLARS (4 cards per pillar)
    # Inside each pillar: padding x=24px, card width = 615 - 48 = 567px
    # Card heights: 242px each. Gaps: 24px.
    CW = 567
    CX1, CX2, CX3, CX4 = X1 + 24, X2 + 24, X3 + 24, X4 + 24
    CY1 = TOP + 98
    CY2 = CY1 + 242 + 24 # TOP + 364
    CY3 = CY2 + 242 + 24 # TOP + 630
    CY4 = CY3 + 242 + 24 # TOP + 896
    CH = 242

    # ── PILLAR 1 CARDS: PERIMETER & IDENTITY ─────────────────────────────────
    c1a = card("c1a", CX1, CY1, CW, CH, "👥", "Corporate Google Sign-In",
               "Enterprise authentication via Google OAuth 2.0. Access is strictly locked to approved corporate email domains with zero personal account leakage.",
               badge="Google Identity", bc=BLUE, bbg=LBLUE, extra_tag="Domain Allowlist")
    c1b = card("c1b", CX1, CY2, CW, CH, "🔒", "Cloud Identity-Aware Proxy (IAP)",
               "Zero-Trust perimeter gate deployed directly in front of Cloud Run. Verifies user identity before any packet reaches the application backend.",
               badge="Zero Trust Gate", bc=GREEN, bbg=LGREEN, extra_tag="No Public Backend")
    c1c = card("c1c", CX1, CY3, CW, CH, "🛡️", "Built-In Anti-DoW Rate Limiter",
               "Application-level defense against Denial-of-Wallet attacks. Enforces rolling window request quotas (30 req / 15 min) and concurrency controls.",
               badge="Anti-DoW Defense", bc=ORANGE, bbg=LORANGE, extra_tag="Concurrency Guard")
    c1d = card("c1d", CX1, CY4, CW, CH, "🗝️", "Secret Manager Credentials",
               "Centralized administrative token storage. Privileged tokens are resolved at container runtime via Secret Manager — zero hardcoded keys in code.",
               badge="Keyless Secrets", bc=PURPLE, bbg=LPURP, extra_tag="Zero Static Keys")

    # ── PILLAR 2 CARDS: AEGISAI PLATFORM CORE ────────────────────────────────
    c2a = card("c2a", CX2, CY1, CW, CH, "🧠", "Multi-Framework Audit Engine",
               "Core intelligence engine that analyzes AI system architecture blueprints and data flows, automatically scoring against ISO 42001, OWASP AISVS, and EU AI Act.",
               badge="Automated Audit", bc=BLUE, bbg=LBLUE, extra_tag="Cloud Run Serverless")
    c2b = card("c2b", CX2, CY2, CW, CH, "🔍", "AI-Focused GCP Posture Scanner",
               "Audits live GCP infrastructure with focus on AI risks: scans training bucket IAM, CMEK on vector stores, and Vertex AI endpoint exposure (beyond generic SCC).",
               badge="AI-Specific Posture", bc=TEAL, bbg=LTEAL, extra_tag="Live Environment")
    c2c = card("c2c", CX2, CY3, CW, CH, "🔀", "Resilient AI Model Router",
               "Orchestrates model requests with automated retry logic, token budget controls, and seamless fallback between Gemini models during provider incidents.",
               badge="High Availability", bc=GREEN, bbg=LGREEN, extra_tag="Automated Failover")
    c2d = card("c2d", CX2, CY4, CW, CH, "🖥️", "Executive Compliance Dashboard",
               "Interactive React dashboard delivering live Server-Sent Events (SSE) audit progression, interactive gap heatmaps, and downloadable executive PDF audit packs.",
               badge="Real-Time UI", bc=PURPLE, bbg=LPURP, extra_tag="PDF Audit Export")

    # ── PILLAR 3 CARDS: GOOGLE VERTEX AI & GUARDRAILS ────────────────────────
    c3a = card("c3a", CX3, CY1, CW, CH, "🛡️", "Google Model Armor Firewall",
               "Active bidirectional AI firewall operating in front of the model. Neutralizes prompt injections and jailbreak attacks in real-time before model invocation.",
               badge="Inline Guardrails", bc=RED, bbg=LRED, extra_tag="Sub-15ms Latency")
    c3b = card("c3b", CX3, CY2, CW, CH, "✨", "Gemini Multimodal Reasoning",
               "Google Cloud flagship AI powering deep analytical reasoning over technical evidence. Supports Gemini 3.8 Flash, Pro, 2.5, or any configured model.",
               badge="Supports Any Gemini Model", bc=ORANGE, bbg=LORANGE, extra_tag="3.8 Flash / Pro")
    c3c = card("c3c", CX3, CY3, CW, CH, "🔑", "Keyless Service Account (ADC)",
               "Cloud Run runtime executes with dedicated service account credentials. Directly accesses Vertex AI via ambient ADC with zero stored API keys.",
               badge="Keyless IAM", bc=BLUE, bbg=LBLUE, extra_tag="Ambient ADC")
    c3d = card("c3d", CX3, CY4, CW, CH, "🔒", "Enterprise Data Privacy Guarantee",
               "Executed under Google Cloud Vertex AI commercial terms: customer prompts, evidence blueprints, and audit results are never used to train base models.",
               badge="Zero Data Training", bc=GREEN, bbg=LGREEN, extra_tag="Private Tenancy")

    # ── PILLAR 4 CARDS: STORAGE & AUDIT EVIDENCE ─────────────────────────────
    c4a = card("c4a", CX4, CY1, CW, CH, "🌍", "Firestore nam5 Multi-Region",
               "Authoritative NoSQL storage running across geo-redundant US multi-regions. Fully encrypted at rest and in transit with high availability SLA.",
               badge="nam5 Multi-Region", bc=AMBER, bbg=LBROWN, extra_tag="High Availability")
    c4b = card("c4b", CX4, CY2, CW, CH, "📁", "Tamper-Proof Audit Repository",
               "Immutable collection of evaluation reports (`audits`) containing verbatim technical citations, compliance scores (L1–L3), and remediation specifications.",
               badge="Audits Collection", bc=BLUE, bbg=LBLUE, extra_tag="Immutable Evidence")
    c4c = card("c4c", CX4, CY3, CW, CH, "🚨", "Security Event Ledger",
               "Real-time database collection (`security_alerts`) logging every intercepted prompt injection attempt, quota exceedance, and unauthorized access attempt.",
               badge="Security Alerts", bc=RED, bbg=LRED, extra_tag="Active Threat Log")
    c4d = card("c4d", CX4, CY4, CW, CH, "📋", "Google Cloud Logging Trail",
               "Structured JSON operational log stream. Emits tamper-evident telemetry for every audit event, enabling complete traceability and enterprise SIEM export.",
               badge="Tamper-Evident Trail", bc=TEAL, bbg=LTEAL, extra_tag="Cloud Logging")

    # ── 2. TOP HERO FLOW RIBBON ──────────────────────────────────────────────
    flow_ribbon = f"""
<div style="position:absolute;left:80px;top:100px;width:{W-160}px;height:72px;
  background:white;border:1.5px solid {BORDER};border-radius:18px;
  display:flex;align-items:center;padding:0 28px;box-shadow:0 4px 16px rgba(0,0,0,0.04);z-index:40;">
  <div style="font-size:11.5px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};margin-right:24px;white-space:nowrap;display:flex;align-items:center;gap:10px;">
    <span style="font-size:18px;">⚡</span> END-TO-END AUDIT LIFECYCLE
  </div>
  <div style="height:36px;width:1.5px;background:{BORDER};margin-right:24px;"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-grow:1;gap:16px;">
    {flow_step("1", "Request Submission", "User uploads AI blueprint & configs", BLUE)}
    <div style="color:{BORDER};font-size:20px;font-weight:300;">→</div>
    {flow_step("2", "Perimeter Authorization", "IAP checks Google domain whitelist", GREEN)}
    <div style="color:{BORDER};font-size:20px;font-weight:300;">→</div>
    {flow_step("3", "Evidence Extraction", "Engine extracts configs & scans GCP", TEAL)}
    <div style="color:{BORDER};font-size:20px;font-weight:300;">→</div>
    {flow_step("4", "Model Armor Firewall", "Input screened for prompt injections", RED)}
    <div style="color:{BORDER};font-size:20px;font-weight:300;">→</div>
    {flow_step("5", "Gemini Reasoning", "Scored against ISO 42001 & AISVS", ORANGE)}
    <div style="color:{BORDER};font-size:20px;font-weight:300;">→</div>
    {flow_step("6", "Evidence & Alerting", "Saved to nam5 DB; alerts to logging", AMBER)}
  </div>
</div>"""

    # ── 3. SVG ARROWS ACROSS THE 3 GAPS (60px gaps) ──────────────────────────
    defs = svg_defs(BLUE, GREEN, ORANGE, RED, AMBER, PURPLE, TEAL)

    # Gap 1 (695 -> 755): Pillar 1 -> Pillar 2
    a1 = arr(695, TOP + 220, 755, TOP + 220, BLUE)
    # Gap 2 (1370 -> 1430): Pillar 2 -> Pillar 3
    a2 = arr(1370, TOP + 220, 1430, TOP + 220, RED)
    # Gap 3 (2045 -> 2105): Pillar 3 -> Pillar 4
    a3 = arr(2045, TOP + 220, 2105, TOP + 220, AMBER)

    # Return stream: From Pillar 4 (Firestore) back to Pillar 2 (Dashboard)
    ret_y = BOT - 40
    ret_arrow = f"""
  <path d="M 2105,{ret_y} L 1370,{ret_y}" stroke="{PURPLE}" stroke-width="3" stroke-dasharray="8 6" fill="none" marker-end="url(#a{PURPLE.replace('#','')})"/>
  <rect x="1600" y="{ret_y-14}" width="275" height="28" rx="14" fill="{PURPLE}" opacity="0.95"/>
  <text x="1737" y="{ret_y+5}" text-anchor="middle" fill="white" font-family="'Google Sans',Arial,sans-serif" font-size="12" font-weight="700">Real-Time SSE Result Stream to UI</text>
"""

    svg = f"""<svg style="position:absolute;top:0;left:0;width:{W}px;height:{H}px;overflow:visible;pointer-events:none;z-index:30;">
  {defs}
  {a1}{a2}{a3}
  {ret_arrow}
</svg>"""

    # Badges centered in the 60px gaps (x = 725, 1400, 2075)
    step_badges = "".join([
        step_badge("①", 725,  TOP + 220, "Authorized Ingress", BLUE),
        step_badge("②", 1400, TOP + 220, "Sanitized AI Call", RED),
        step_badge("③", 2075, TOP + 220, "Store Evidence", AMBER),
    ])

    # ── 4. BOTTOM COMPLIANCE & SOVEREIGNTY FOOTER ────────────────────────────
    FOOTER_Y = 1395
    compliance_standards = [
        ("ISO/IEC 42001:2023", "AI Management System", "Phases 3, 4 & 5 (Design, Evaluation & Deployment)"),
        ("OWASP AISVS v1.0", "AI Verification Standard", "L1–L3 Controls & Adversarial Robustness"),
        ("EU AI Act Ready", "High-Risk AI Governance", "Transparency, Human Oversight & Risk Mitigation"),
        ("Mexico NOM AI Ready", "National Standards", "Data Sovereignty & Security Alignment"),
    ]
    stds_html = "".join(f"""
    <div style="background:{LBLUE};border:1.5px solid #C2D7FA;border-radius:12px;padding:8px 18px;flex:1;">
      <div style="font-size:13px;font-weight:800;color:{DBLUE};">{std}</div>
      <div style="font-size:11px;font-weight:700;color:{TEXT1};margin-top:2px;">{sub}</div>
      <div style="font-size:10.5px;color:{MUTED};margin-top:1px;">{desc}</div>
    </div>""" for std, sub, desc in compliance_standards)

    sovereignty_points = [
        ("100% Serverless", "Cloud Run compute scales to zero with zero idle cost"),
        ("nam5 Multi-Region", "Geo-redundant storage with Google-managed at-rest encryption"),
        ("Zero Data Training", "Prompts and evidence are never used to train base AI models"),
        ("Keyless IAM Security", "Ambient Application Default Credentials (ADC) across services"),
    ]
    sov_html = "".join(f"""
    <div style="display:flex;align-items:flex-start;gap:10px;flex:1;">
      <div style="font-size:16px;line-height:1;">🛡️</div>
      <div>
        <div style="font-size:12px;font-weight:800;color:{TEXT1};">{title}</div>
        <div style="font-size:10.5px;color:{MUTED};margin-top:1px;line-height:1.3;">{desc}</div>
      </div>
    </div>""" for title, desc in sovereignty_points)

    footer = f"""
<div style="position:absolute;left:80px;top:{FOOTER_Y}px;width:{W-160}px;height:140px;
  background:white;border:1.5px solid {BORDER};border-radius:20px;padding:18px 28px;
  display:flex;align-items:stretch;gap:28px;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
  <div style="flex:1.2;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:8px;">
      <span>📜</span> AUDITED REGULATORY COMPLIANCE FRAMEWORKS
    </div>
    <div style="display:flex;gap:12px;align-items:stretch;">{stds_html}</div>
  </div>
  <div style="width:1.5px;background:{BORDER};margin:4px 0;"></div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:8px;">
      <span>🔐</span> GOOGLE CLOUD ENTERPRISE SOVEREIGNTY &amp; PRIVACY
    </div>
    <div style="display:flex;gap:16px;align-items:stretch;">{sov_html}</div>
  </div>
</div>"""

    # ── 5. TOP EXECUTIVE TITLE BAR ───────────────────────────────────────────
    header = f"""
<div style="position:absolute;top:0;left:0;width:{W}px;height:82px;
  background:linear-gradient(135deg, {BLUE} 0%, {DBLUE} 100%);
  display:flex;align-items:center;padding:0 44px;gap:16px;z-index:100;box-shadow:0 4px 20px rgba(13,71,161,0.25);">
  <div style="width:48px;height:48px;background:white;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">🛡️</div>
  <div>
    <div style="color:white;font-size:21px;font-weight:800;letter-spacing:-0.2px;">AegisAI — Executive Architecture Overview</div>
    <div style="color:rgba(255,255,255,0.8);font-size:12.5px;margin-top:2px;">
      Enterprise AI Security, Governance &amp; Compliance Auditing Platform on Google Cloud
    </div>
  </div>
  <div style="margin-left:auto;display:flex;gap:36px;align-items:center;">
    {"".join(f'''
    <div style="text-align:right;">
      <div style="color:white;font-size:17px;font-weight:800;letter-spacing:0.5px;">{val}</div>
      <div style="color:rgba(255,255,255,0.7);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">{lbl}</div>
    </div>''' for val, lbl in [
        ("100% Serverless", "Cloud Run Architecture"),
        ("Zero Trust", "Perimeter & Identity"),
        ("Model Armor", "Active AI Guardrails"),
        ("Multi-Region nam5", "Encrypted Data Store"),
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
<title>AegisAI — Executive Architecture Overview</title>
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

  // 1x Presentation PNG (2800 x 1575)
  const png1x = path.join(outDir, 'AegisAI_Executive_Overview.png');
  await page.screenshot({ path: png1x, fullPage: false });
  console.log('✓ Generated 1x PNG:', fs.statSync(png1x).size, 'bytes');

  // 4K Ultra-HD PNG (5600 x 3150, 2x scale)
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
  const png4k = path.join(outDir, 'AegisAI_Executive_Overview_4K.png');
  await page.screenshot({ path: png4k, fullPage: false });
  console.log('✓ Generated 4K PNG:', fs.statSync(png4k).size, 'bytes');

  // Vector PDF (Single 16:9 Landscape Slide)
  const pdf = path.join(outDir, 'AegisAI_Executive_Overview.pdf');
  await page.pdf({
    path: pdf,
    width: W + 'px',
    height: H + 'px',
    printBackground: true,
    pageRanges: '1',
  });
  console.log('✓ Generated Vector PDF:', fs.statSync(pdf).size, 'bytes');

  await browser.close();
  console.log('All executive assets rendered successfully.');
})().catch(err => {
  console.error('Error during render:', err);
  process.exit(1);
});
"""

if __name__ == "__main__":
    html_file = OUT_DIR / "AegisAI_Executive_Overview.html"
    render_cjs = SCRIPT_DIR / "_exec_render.cjs"

    print("Generating Executive HTML...")
    html_content = build_html()
    html_file.write_text(html_content, encoding="utf-8")
    print(f"  → Written {html_file} ({html_file.stat().st_size:,} bytes)")

    render_cjs.write_text(PUPPETEER_SCRIPT, encoding="utf-8")

    env = os.environ.copy()
    env["NODE_PATH"] = "/tmp/pup_standalone/node_modules"

    print("Rendering executive diagram (1x, 4K, PDF)...")
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
    pdf_file = OUT_DIR / "AegisAI_Executive_Overview.pdf"
    svg_file = OUT_DIR / "AegisAI_Executive_Overview.svg"
    r_svg = subprocess.run(["pdftocairo", "-svg", str(pdf_file), str(svg_file)], capture_output=True, text=True)
    if svg_file.exists():
        print(f"✓ Generated Vector SVG: {svg_file.stat().st_size:,} bytes")
    else:
        print("Warning: pdftocairo could not generate SVG:", r_svg.stderr)

    if render_cjs.exists():
        render_cjs.unlink()

    print(f"\nAll executive assets successfully saved in {OUT_DIR}")
