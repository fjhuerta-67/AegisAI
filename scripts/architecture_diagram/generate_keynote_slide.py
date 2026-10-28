#!/usr/bin/env python3
"""
AegisAI — 7-Minute Keynote Presentation Slide (Giant Text Edition)
Billboard scale: Massive typography designed for projectors & 15-foot viewing distance.
2 spacious hero blocks per pillar, zero paragraph text, huge icons.
"""

import subprocess, sys, os
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent.parent / "docs" / "architecture"
OUT_DIR.mkdir(parents=True, exist_ok=True)
SCRIPT_DIR = Path(__file__).parent

# 16:9 Presentation Canvas (2800 x 1575)
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
  background:{bg};border:3px solid {border};border-radius:32px;overflow:hidden;box-shadow:0 8px 36px rgba(0,0,0,0.06);">
  <div style="position:absolute;top:28px;left:32px;right:32px;display:flex;align-items:center;justify-content:space-between;">
    <div>
      <div style="font-size:16px;font-weight:900;letter-spacing:3px;text-transform:uppercase;color:{tc};">PILLAR {stage_num}</div>
      <div style="font-size:30px;font-weight:900;color:{TEXT1};margin-top:4px;letter-spacing:-0.5px;">{title}</div>
      <div style="font-size:18px;color:{MUTED};margin-top:4px;font-weight:700;">{subtitle}</div>
    </div>
    <div style="width:54px;height:54px;border-radius:16px;background:white;border:3px solid {border};
      display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900;color:{tc};box-shadow:0 4px 14px rgba(0,0,0,0.1);">{stage_num}</div>
  </div>
</div>"""

def keynote_card(id_, x, y, w, h, icon, headline, bullets, badge, bc=BLUE, bbg=LBLUE, icon_bg=LBLUE):
    bullets_html = "".join(f"""
      <div style="display:flex;align-items:center;gap:12px;margin-top:14px;">
        <div style="width:10px;height:10px;border-radius:50%;background:{bc};flex-shrink:0;"></div>
        <div style="font-size:20px;font-weight:700;color:{TEXT2};">{b}</div>
      </div>""" for b in bullets)

    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:white;border-radius:24px;border:2.5px solid {BORDER};
  box-shadow:0 6px 24px rgba(0,0,0,0.07);padding:32px 34px;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="display:flex;align-items:center;gap:20px;margin-bottom:16px;">
      <div style="width:72px;height:72px;border-radius:20px;background:{icon_bg};display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;">{icon}</div>
      <div>
        <div style="font-size:27px;font-weight:900;color:{TEXT1};line-height:1.2;letter-spacing:-0.3px;">{headline}</div>
      </div>
    </div>
    <div style="margin-top:12px;">{bullets_html}</div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;border-top:2px solid #F1F3F4;padding-top:18px;margin-top:16px;">
    <span style="display:inline-block;background:{bbg};color:{bc};font-size:16px;font-weight:900;padding:8px 18px;border-radius:24px;letter-spacing:0.5px;">{badge}</span>
    <span style="font-size:16px;font-weight:800;color:{GREEN};display:flex;align-items:center;gap:6px;">✓ Verified in Code</span>
  </div>
</div>"""

def flow_step(num, title, sub, color):
    return f"""
<div style="display:flex;align-items:center;gap:16px;flex:1;">
  <div style="width:46px;height:46px;border-radius:50%;background:{color};color:white;
    font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;
    box-shadow:0 4px 12px rgba(0,0,0,0.22);flex-shrink:0;">{num}</div>
  <div>
    <div style="font-size:18px;font-weight:900;color:{TEXT1};">{title}</div>
    <div style="font-size:15px;font-weight:700;color:{MUTED};line-height:1.2;">{sub}</div>
  </div>
</div>"""

def step_badge(n, x, y, label, color=BLUE):
    return f"""
<div style="position:absolute;left:{x-24}px;top:{y-24}px;width:48px;height:48px;
  border-radius:50%;background:{color};color:white;
  font-size:20px;font-weight:900;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 16px rgba(0,0,0,0.3);z-index:35;">{n}</div>
{f'<div style="position:absolute;left:{x-80}px;top:{y+32}px;width:160px;text-align:center;font-size:15px;font-weight:900;color:{color};line-height:1.2;z-index:35;text-shadow:0 1px 3px white;">{label}</div>' if label else ''}"""

def svg_defs(*cols):
    d = "<defs>"
    for c in set(cols):
        cid = c.replace("#","")
        d += f'''<marker id="a{cid}" markerWidth="12" markerHeight="9" refX="11" refY="4.5" orient="auto">
          <polygon points="0 0,12 4.5,0 9" fill="{c}"/>
        </marker>'''
    return d + "</defs>"

def arr(x1, y1, x2, y2, c, dash=False, sw=4.5):
    da = 'stroke-dasharray="10 8"' if dash else ''
    cid = c.replace("#","")
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}" {da} marker-end="url(#a{cid})" opacity="0.95"/>'

# ── Assemble Keynote Slide ───────────────────────────────────────────────────

def build_html():
    TOP = 230
    ZH = 1120
    BOT = TOP + ZH # 1350

    # 4 Pillars Horizontal Geometry (W = 2800)
    # Margins: 80px left and right. Gaps: 60px.
    # W_pillar = 615px
    X1, X2, X3, X4 = 80, 755, 1430, 2105
    W_COL = 615

    # 1. PILLAR BACKGROUNDS
    p1 = pillar("p1", X1, TOP, W_COL, ZH, "1", "Perimeter &amp; Identity", "Zero-Trust Google Auth", LBLUE, "#99C2FF", BLUE)
    p2 = pillar("p2", X2, TOP, W_COL, ZH, "2", "AegisAI Serverless Core", "Multi-Standard Audit Engine", LTEAL, "#80CBC4", TEAL)
    p3 = pillar("p3", X3, TOP, W_COL, ZH, "3", "Google Vertex AI", "Model Armor &amp; Gemini", LORANGE, "#FFB74D", ORANGE)
    p4 = pillar("p4", X4, TOP, W_COL, ZH, "4", "Sovereign Storage &amp; Trail", "nam5 Multi-Region DB", LBROWN, "#FFD54F", AMBER)

    # 2 SPACIOUS HERO CARDS PER PILLAR (Card Width = 567px, Height = 450px each!)
    CW = 567
    CX1, CX2, CX3, CX4 = X1 + 24, X2 + 24, X3 + 24, X4 + 24
    CY1 = TOP + 130
    CY2 = CY1 + 450 + 36 # TOP + 616
    CH = 450

    # ── PILLAR 1: ZERO-TRUST PERIMETER ───────────────────────────────────────
    c1a = keynote_card("c1a", CX1, CY1, CW, CH, "🔒",
                       "Cloud IAP &amp; Google Auth",
                       [
                           "Strict Corporate Domain Allowlist",
                           "Zero Public Backend Access",
                           "Google OAuth 2.0 Identity Tokens",
                           "Keyless Admin via Secret Manager"
                       ],
                       "Zero Trust Perimeter", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)

    c1b = keynote_card("c1b", CX1, CY2, CW, CH, "🛡️",
                       "Anti-Denial-of-Wallet (DoW)",
                       [
                           "Built-In 30 Req / 15 Min Rolling Quota",
                           "Active Concurrency &amp; Token Limiter",
                           "Blocks Budget Exploitation Attacks",
                           "Native Cloud Run Serverless Defense"
                       ],
                       "Anti-DoW Guardrails", bc=ORANGE, bbg=LORANGE, icon_bg=LORANGE)

    # ── PILLAR 2: AEGISAI SERVERLESS CORE ────────────────────────────────────
    c2a = keynote_card("c2a", CX2, CY1, CW, CH, "🧠",
                       "Audit Intelligence Engine",
                       [
                           "Automated Architecture Blueprints Scoring",
                           "ISO/IEC 42001 &amp; OWASP AISVS Mapping",
                           "Verbatim Technical Evidence Extraction",
                           "100% Serverless Cloud Run (Zero Idle Cost)"
                       ],
                       "Core Audit Engine", bc=BLUE, bbg=LBLUE, icon_bg=LBLUE)

    c2b = keynote_card("c2b", CX2, CY2, CW, CH, "🔍",
                       "AI-Focused GCP Scanner",
                       [
                           "Audits Training Bucket IAM Permissions",
                           "CMEK Encryption Checks on Vector DBs",
                           "Deep AI Workload Audit (Beyond SCC)",
                           "Real-Time SSE Streaming to Dashboard"
                       ],
                       "AI-Specific Posture", bc=TEAL, bbg=LTEAL, icon_bg=LTEAL)

    # ── PILLAR 3: GOOGLE VERTEX AI & GUARDRAILS ──────────────────────────────
    c3a = keynote_card("c3a", CX3, CY1, CW, CH, "🛡️",
                       "Google Model Armor Firewall",
                       [
                           "Real-Time Inline Prompt-Injection Filter",
                           "Blocks Jailbreak &amp; Toxic Payloads",
                           "Sub-15ms Latency Overhead",
                           "Active Defense Before Model Invocation"
                       ],
                       "Active AI Guardrail", bc=RED, bbg=LRED, icon_bg=LRED)

    c3b = keynote_card("c3b", CX3, CY2, CW, CH, "✨",
                       "Gemini Multimodal Reasoning",
                       [
                           "Flagship Gemini Multimodal Reasoning",
                           "Supports Any Gemini Model (3.8 / Pro)",
                           "Ambient ADC Access (Zero Stored Keys)",
                           "Commercial Terms: Zero Data Training"
                       ],
                       "Enterprise Vertex AI", bc=ORANGE, bbg=LORANGE, icon_bg=LORANGE)

    # ── PILLAR 4: SOVEREIGN STORAGE & AUDIT TRAIL ────────────────────────────
    c4a = keynote_card("c4a", CX4, CY1, CW, CH, "🌍",
                       "Firestore nam5 Multi-Region",
                       [
                           "Authoritative Geo-Redundant US Storage",
                           "Fully Encrypted At-Rest &amp; In-Transit",
                           "Database-Tier Security Rules Enforced",
                           "High-Availability Multi-Region SLA"
                       ],
                       "nam5 Sovereign DB", bc=AMBER, bbg=LBROWN, icon_bg=LBROWN)

    c4b = keynote_card("c4b", CX4, CY2, CW, CH, "🚨",
                       "Security Alerts &amp; Audit Vault",
                       [
                           "Immutable Audit Reports Collection",
                           "Live Log of Intercepted Prompt Attacks",
                           "Tamper-Evident Cloud Logging Stream",
                           "Exportable to Enterprise SIEM / SOC"
                       ],
                       "Immutable Evidence", bc=PURPLE, bbg=LPURP, icon_bg=LPURP)

    # ── 2. TOP HERO FLOW RIBBON ──────────────────────────────────────────────
    flow_ribbon = f"""
<div style="position:absolute;left:80px;top:106px;width:{W-160}px;height:96px;
  background:white;border:3px solid {BORDER};border-radius:24px;
  display:flex;align-items:center;padding:0 36px;box-shadow:0 6px 20px rgba(0,0,0,0.06);z-index:40;">
  <div style="font-size:15px;font-weight:900;letter-spacing:2.5px;text-transform:uppercase;color:{TEXT1};margin-right:32px;white-space:nowrap;display:flex;align-items:center;gap:12px;">
    <span style="font-size:28px;">⚡</span> THE 60-SECOND AUDIT FLOW
  </div>
  <div style="height:48px;width:3px;background:{BORDER};margin-right:32px;"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-grow:1;gap:18px;">
    {flow_step("1", "Blueprint Input", "Upload AI architecture", BLUE)}
    <div style="color:{BORDER};font-size:30px;font-weight:300;">→</div>
    {flow_step("2", "Zero-Trust IAP", "Domain verified gate", GREEN)}
    <div style="color:{BORDER};font-size:30px;font-weight:300;">→</div>
    {flow_step("3", "Evidence Scan", "Engine & GCP scanner", TEAL)}
    <div style="color:{BORDER};font-size:30px;font-weight:300;">→</div>
    {flow_step("4", "Model Armor", "Block prompt attacks", RED)}
    <div style="color:{BORDER};font-size:30px;font-weight:300;">→</div>
    {flow_step("5", "Gemini Reason", "Score against ISO", ORANGE)}
    <div style="color:{BORDER};font-size:30px;font-weight:300;">→</div>
    {flow_step("6", "Audit Stored", "nam5 DB & alerts", AMBER)}
  </div>
</div>"""

    # ── 3. SVG CONNECTORS ACROSS GAPS ────────────────────────────────────────
    defs = svg_defs(BLUE, GREEN, ORANGE, RED, AMBER, PURPLE, TEAL)

    # Gaps between pillars: x = 725, 1400, 2075
    a1 = arr(695, TOP + 350, 755, TOP + 350, BLUE)
    a2 = arr(1370, TOP + 350, 1430, TOP + 350, RED)
    a3 = arr(2045, TOP + 350, 2105, TOP + 350, AMBER)

    ret_y = BOT - 48
    ret_arrow = f"""
  <path d="M 2105,{ret_y} L 1370,{ret_y}" stroke="{PURPLE}" stroke-width="4.5" stroke-dasharray="10 8" fill="none" marker-end="url(#a{PURPLE.replace('#','')})"/>
  <rect x="1560" y="{ret_y-20}" width="350" height="40" rx="20" fill="{PURPLE}" opacity="0.95"/>
  <text x="1735" y="{ret_y+7}" text-anchor="middle" fill="white" font-family="'Google Sans',Arial,sans-serif" font-size="16px" font-weight="900">Real-Time SSE Result Stream to Dashboard</text>
"""

    svg = f"""<svg style="position:absolute;top:0;left:0;width:{W}px;height:{H}px;overflow:visible;pointer-events:none;z-index:30;">
  {defs}
  {a1}{a2}{a3}
  {ret_arrow}
</svg>"""

    step_badges = "".join([
        step_badge("①", 725,  TOP + 350, "Authorized Ingress", BLUE),
        step_badge("②", 1400, TOP + 350, "Sanitized AI Call", RED),
        step_badge("③", 2075, TOP + 350, "Store Evidence", AMBER),
    ])

    # ── 4. BOTTOM COMPLIANCE & SOVEREIGNTY FOOTER ────────────────────────────
    FOOTER_Y = 1385
    stds = [
        ("ISO/IEC 42001:2023", "Phases 3, 4 & 5 (Design, Eval & Deploy)"),
        ("OWASP AISVS v1.0", "AI Security Verification Standard (L1–L3)"),
        ("EU AI Act Ready", "High-Risk AI Governance & Transparency"),
        ("Mexico NOM AI Ready", "Data Protection & Security Alignment"),
    ]
    stds_html = "".join(f"""
    <div style="background:{LBLUE};border:2.5px solid #99C2FF;border-radius:18px;padding:14px 22px;flex:1;">
      <div style="font-size:18px;font-weight:900;color:{DBLUE};">{s}</div>
      <div style="font-size:14px;font-weight:700;color:{TEXT2};margin-top:4px;">{d}</div>
    </div>""" for s, d in stds)

    sovereignty = [
        ("100% Serverless", "Scales to zero · Zero idle cost"),
        ("nam5 Multi-Region", "US geo-redundancy · Encrypted"),
        ("Zero Data Training", "Prompts never train base models"),
        ("Keyless IAM Security", "Ambient ADC · Zero static keys"),
    ]
    sov_html = "".join(f"""
    <div style="display:flex;align-items:center;gap:14px;flex:1;">
      <div style="font-size:26px;line-height:1;">🛡️</div>
      <div>
        <div style="font-size:17px;font-weight:900;color:{TEXT1};">{title}</div>
        <div style="font-size:13.5px;font-weight:700;color:{MUTED};margin-top:2px;">{desc}</div>
      </div>
    </div>""" for title, desc in sovereignty)

    footer = f"""
<div style="position:absolute;left:80px;top:{FOOTER_Y}px;width:{W-160}px;height:160px;
  background:white;border:3px solid {BORDER};border-radius:26px;padding:22px 36px;
  display:flex;align-items:stretch;gap:40px;box-shadow:0 6px 24px rgba(0,0,0,0.06);">
  <div style="flex:1.25;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;">📜</span> AUDITED REGULATORY COMPLIANCE FRAMEWORKS
    </div>
    <div style="display:flex;gap:16px;align-items:stretch;">{stds_html}</div>
  </div>
  <div style="width:2.5px;background:{BORDER};margin:4px 0;"></div>
  <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
    <div style="font-size:14px;font-weight:900;letter-spacing:2px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;">🔐</span> GOOGLE CLOUD ENTERPRISE PRIVACY &amp; SOVEREIGNTY
    </div>
    <div style="display:flex;gap:18px;align-items:stretch;">{sov_html}</div>
  </div>
</div>"""

    # ── 5. TOP EXECUTIVE TITLE BAR ───────────────────────────────────────────
    header = f"""
<div style="position:absolute;top:0;left:0;width:{W}px;height:88px;
  background:linear-gradient(135deg, {BLUE} 0%, {DBLUE} 100%);
  display:flex;align-items:center;padding:0 48px;gap:20px;z-index:100;box-shadow:0 4px 28px rgba(13,71,161,0.3);">
  <div style="width:56px;height:56px;background:white;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:32px;box-shadow:0 3px 12px rgba(0,0,0,0.2);">🛡️</div>
  <div>
    <div style="color:white;font-size:26px;font-weight:900;letter-spacing:-0.3px;">AegisAI — Enterprise Architecture Overview</div>
    <div style="color:rgba(255,255,255,0.85);font-size:15px;margin-top:2px;font-weight:600;">
      Automated AI Security, Governance &amp; Compliance Auditing Platform on Google Cloud
    </div>
  </div>
  <div style="margin-left:auto;display:flex;gap:44px;align-items:center;">
    {"".join(f'''
    <div style="text-align:right;">
      <div style="color:white;font-size:21px;font-weight:900;letter-spacing:0.5px;">{val}</div>
      <div style="color:rgba(255,255,255,0.75);font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">{lbl}</div>
    </div>''' for val, lbl in [
        ("100% Serverless", "Cloud Run Compute"),
        ("Zero Trust", "Perimeter & Identity"),
        ("Model Armor", "Real-Time AI Guardrail"),
        ("Multi-Region nam5", "Sovereign Storage"),
    ])}
  </div>
</div>"""

    elements = [
        header, flow_ribbon,
        p1, p2, p3, p4,
        c1a, c1b,
        c2a, c2b,
        c3a, c3b,
        c4a, c4b,
        svg, step_badges,
        footer
    ]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>AegisAI — Keynote Presentation Architecture (Giant Text)</title>
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

    print("Generating Giant Text Keynote HTML...")
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
