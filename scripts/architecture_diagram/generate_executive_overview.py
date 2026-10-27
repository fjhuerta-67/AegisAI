#!/usr/bin/env python3
"""
AegisAI Executive Architecture Overview Generator
Designed specifically for C-level directors & senior leadership.
Visual style: clean, conceptual, high-contrast 16:9 widescreen layout.
Covers all system components, data flow lifecycle, and ISO 42001 alignment.
"""

import subprocess, sys, os
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent.parent / "docs" / "architecture"
OUT_DIR.mkdir(parents=True, exist_ok=True)
SCRIPT_DIR = Path(__file__).parent

# 16:9 Widescreen aspect ratio (2800 x 1575)
W, H = 2800, 1575

# ── Color Palette ────────────────────────────────────────────────────────────
BLUE   = "#1A73E8"
DBLUE  = "#0D47A1"
GREEN  = "#34A853"
ORANGE = "#FA7B17"
RED    = "#EA4335"
AMBER  = "#F9AB00"
PURPLE = "#9334E6"
TEAL   = "#007B83"

LBLUE  = "#F0F6FF"
LGREEN = "#F0FBF4"
LORANGE= "#FFF7EC"
LRED   = "#FFF0F0"
LPURP  = "#F8F2FF"
LTEAL  = "#F0FAFA"
LBROWN = "#FFFDF0"

BORDER = "#DADCE0"
TEXT1  = "#202124"
TEXT2  = "#3C4043"
MUTED  = "#5F6368"

# ── Component Helpers ────────────────────────────────────────────────────────

def zone(id_, x, y, w, h, stage_num, title, subtitle, bg, border, tc):
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:{bg};border:2px solid {border};border-radius:20px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
  <div style="position:absolute;top:16px;left:20px;right:20px;display:flex;align-items:flex-start;justify-content:space-between;">
    <div>
      <div style="font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:{tc};opacity:0.85;">{title}</div>
      <div style="font-size:12px;color:{tc};opacity:0.65;margin-top:2px;font-weight:500;">{subtitle}</div>
    </div>
    <div style="width:24px;height:24px;border-radius:6px;background:white;border:1.5px solid {border};
      display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:{tc};box-shadow:0 1px 4px rgba(0,0,0,0.05);">{stage_num}</div>
  </div>
</div>"""

def card(id_, x, y, w, h, icon, name, desc, badge=None, bc=BLUE, bbg=LBLUE, extra_tag=None):
    badge_html = ""
    if badge:
        badge_html = f'''<div style="display:flex;align-items:center;gap:6px;margin-top:10px;">
          <span style="display:inline-block;background:{bbg};color:{bc};font-size:10.5px;font-weight:700;padding:3.5px 10px;border-radius:14px;letter-spacing:0.3px;white-space:nowrap;">{badge}</span>
          {f'<span style="font-size:10.5px;font-weight:600;color:{MUTED};">{extra_tag}</span>' if extra_tag else ''}
        </div>'''
    return f"""
<div id="{id_}" style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;
  background:white;border-radius:14px;border:1.5px solid {BORDER};
  box-shadow:0 3px 12px rgba(0,0,0,0.05);padding:18px 20px;display:flex;flex-direction:column;justify-content:space-between;">
  <div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:38px;height:38px;border-radius:10px;background:{bbg};display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">{icon}</div>
      <div style="font-size:15px;font-weight:700;color:{TEXT1};line-height:1.2;">{name}</div>
    </div>
    <div style="font-size:12.5px;color:{TEXT2};line-height:1.5;margin-top:4px;">{desc}</div>
  </div>
  {badge_html}
</div>"""

def step_badge(n, x, y, label, color=BLUE):
    return f"""
<div style="position:absolute;left:{x-15}px;top:{y-15}px;width:30px;height:30px;
  border-radius:50%;background:{color};color:white;
  font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;
  box-shadow:0 3px 8px rgba(0,0,0,0.22);z-index:35;">{n}</div>
{f'<div style="position:absolute;left:{x-45}px;top:{y+18}px;width:90px;text-align:center;font-size:10.5px;font-weight:700;color:{color};line-height:1.1;z-index:35;text-shadow:0 1px 2px white;">{label}</div>' if label else ''}"""

def svg_defs(*cols):
    d = "<defs>"
    for c in set(cols):
        cid = c.replace("#","")
        d += f'''<marker id="a{cid}" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0,9 3.5,0 7" fill="{c}"/>
        </marker>'''
    return d + "</defs>"

def arr(x1, y1, x2, y2, c, dash=False, sw=2.5):
    da = 'stroke-dasharray="7 5"' if dash else ''
    cid = c.replace("#","")
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{sw}" {da} marker-end="url(#a{cid})" opacity="0.9"/>'

# ── Diagram Assembly ─────────────────────────────────────────────────────────

def build_html():
    TOP = 175
    ZH = 1095
    BOT = TOP + ZH # 1270

    # Column Horizontal Anchors (40px gaps)
    # Col 1: 40 .. 370 (w 330)
    # Col 2: 410 .. 750 (w 340)
    # Col 3: 790 .. 1330 (w 540)
    # Col 4: 1370 .. 1830 (w 460)
    # Col 5: 1870 .. 2200 (w 330)
    # Col 6: 2240 .. 2760 (w 520)

    # 1. ZONE BACKGROUNDS
    z1 = zone("z1", 40,   TOP, 330, ZH, "1", "WHO ACCESSED", "Users, Pipelines &amp; Admins", LBLUE, "#BBD6FB", BLUE)
    z2 = zone("z2", 410,  TOP, 340, ZH, "2", "PERIMETER &amp; AUTH", "Zero Trust Identity Gate", LGREEN, "#B6E2C3", GREEN)
    z3 = zone("z3", 790,  TOP, 540, ZH, "3", "AEGISAI PLATFORM", "Cloud Run Serverless Compute", LBLUE, "#B0D0F8", BLUE)
    z4 = zone("z4", 1370, TOP, 460, ZH, "4", "GOOGLE AI ENGINE", "Vertex AI &amp; Responsible Guardrails", LORANGE, "#FCD8A8", ORANGE)
    z5 = zone("z5", 1870, TOP, 330, ZH, "5", "AUDITED DATA STORE", "Firestore Multi-Region Encrypted", LBROWN, "#F6DE84", AMBER)
    z6 = zone("z6", 2240, TOP, 520, ZH, "6", "SECOPS &amp; ISO 42001", "Observability &amp; Continuous Compliance", LRED, "#F9C2C2", RED)

    # CARD GEOMETRY INSIDE ZONES (4 rows, rel_y: 65, 320, 575, 830. h = 230)
    Y1, Y2, Y3, Y4 = TOP + 65, TOP + 320, TOP + 575, TOP + 830
    H_CARD = 230

    # ── COLUMN 1: USERS & CLIENTS (w = 296, x = 57) ─────────────────────────
    w1, x1 = 296, 57
    c1a = card("c1a", x1, Y1, w1, H_CARD, "👥", "Corporate Users",
               "Enterprise team members sign in using standard corporate Google Workspace accounts. Zero software installation required.",
               badge="Google Identity", bc=BLUE, bbg=LBLUE, extra_tag="Allowed Domains")
    c1b = card("c1b", x1, Y2, w1, H_CARD, "⚙️", "CI/CD Pipelines",
               "Automated security scans in GitHub Actions, GitLab CI, or Jenkins. Blocks deployment if AI compliance score falls below threshold.",
               badge="Automated Gate", bc=GREEN, bbg=LGREEN, extra_tag="OIDC Tokens")
    c1c = card("c1c", x1, Y3, w1, H_CARD, "🔧", "Security Operations",
               "Security teams and auditors manage compliance frameworks, view real-time risk alerts, and export executive audit packs.",
               badge="Admin Console", bc=ORANGE, bbg=LORANGE, extra_tag="Role-based")
    c1d = card("c1d", x1, Y4, w1, H_CARD, "🖥️", "Executive Dashboard",
               "Modern React SPA delivering interactive compliance heatmaps, gap analyses, and downloadable board-ready PDF audit reports.",
               badge="Real-time UI", bc=PURPLE, bbg=LPURP, extra_tag="Live Stream")

    # ── COLUMN 2: ZERO TRUST PERIMETER (w = 306, x = 427) ───────────────────
    w2, x2 = 306, 427
    c2a = card("c2a", x2, Y1, w2, H_CARD, "🌐", "Google Front End (GFE)",
               "Global Anycast edge network providing DDoS mitigation, TLS 1.3 encryption, and Google-managed automated SSL certificates.",
               badge="Global Edge", bc=TEAL, bbg=LTEAL, extra_tag="TLS 1.3")
    c2b = card("c2b", x2, Y2, w2, H_CARD, "🔒", "Identity-Aware Proxy",
               "Verifies user identity and strict domain whitelist before requests touch application code. Complete Zero-Trust perimeter barrier.",
               badge="Zero Trust Gate", bc=GREEN, bbg=LGREEN, extra_tag="No VPN needed")
    c2c = card("c2c", x2, Y3, w2, H_CARD, "🔑", "Firebase Auth Engine",
               "Issues tamper-proof, short-lived JWT identity tokens for in-app authorization, strictly tied to verified Google accounts.",
               badge="OAuth 2.0 / OIDC", bc=ORANGE, bbg=LORANGE, extra_tag="Short-lived")
    c2d = card("c2d", x2, Y4, w2, H_CARD, "🗝️", "Secret Manager",
               "Centralized cryptographic key and credential vault. Zero credentials stored in code, Git repositories, or environment files.",
               badge="Keyless Security", bc=PURPLE, bbg=LPURP, extra_tag="Auto-rotated")

    # ── COLUMN 3: AEGISAI PLATFORM (w = 506, x = 807) ──────────────────────
    w3, x3 = 506, 807
    c3a = card("c3a", x3, Y1, w3, H_CARD, "📡", "API Gateway &amp; Anti-DoW",
               "Single hardened entry point. Validates caller authorization, enforces API rate limits, and defends against Denial-of-Wallet exploitation.",
               badge="Cloud Run Service", bc=BLUE, bbg=LBLUE, extra_tag="Auto-scales to zero")
    c3b = card("c3b", x3, Y2, w3, H_CARD, "🧠", "Audit Intelligence Engine",
               "Parses architecture blueprints and policies. Maps technical findings directly to ISO/IEC 42001, OWASP AISVS, and EU AI Act controls.",
               badge="Core Logic", bc=BLUE, bbg=LBLUE, extra_tag="Multi-framework")
    c3c = card("c3c", x3, Y3, w3, H_CARD, "🔀", "AI Router &amp; Fallback Mesh",
               "Orchestrates model requests with automated multi-provider failover, strict timeout enforcement, and token budget management.",
               badge="High Availability", bc=TEAL, bbg=LTEAL, extra_tag="99.9% Uptime")
    c3d = card("c3d", x3, Y4, w3, H_CARD, "📋", "GCP Security Posture Scanner",
               "Automated cloud discovery auditing IAM configurations, VPC settings, and AI workloads against CIS Foundations benchmarks.",
               badge="Infrastructure Audit", bc=GREEN, bbg=LGREEN, extra_tag="Real-time Scan")

    # ── COLUMN 4: GOOGLE AI & GUARDRAILS (w = 426, x = 1387) ───────────────
    w4, x4 = 426, 1387
    c4a = card("c4a", x4, Y1, w4, H_CARD, "🛡️", "Google Model Armor",
               "Real-time bidirectional AI firewall. Neutralizes prompt injections and jailbreaks on input; filters sensitive data and toxic content on output.",
               badge="Active Guardrails", bc=RED, bbg=LRED, extra_tag="Sub-15ms inline")
    c4b = card("c4b", x4, Y2, w4, H_CARD, "✨", "Gemini 3.8 Flash (Vertex AI)",
               "Google Cloud flagship multimodal AI. Performs deep analytical reasoning over technical evidence, generating defensible compliance verdicts.",
               badge="Enterprise AI", bc=ORANGE, bbg=LORANGE, extra_tag="Keyless ADC")
    c4c = card("c4c", x4, Y3, w4, H_CARD, "🌿", "Model Garden &amp; Registry",
               "Curated, verified model supply chain. Ensures only cryptographically signed and vetted models are invoked across the lifecycle.",
               badge="Supply Chain Security", bc=GREEN, bbg=LGREEN, extra_tag="Tamper-proof")
    c4d = card("c4d", x4, Y4, w4, H_CARD, "📊", "Vertex Evaluation &amp; Monitoring",
               "Continuous quality and drift supervision. Benchmarks model accuracy, hallucination rates, and safety drift against production SLOs.",
               badge="Quality Gate", bc=PURPLE, bbg=LPURP, extra_tag="AutoSxS Rater")

    # ── COLUMN 5: DATA STORE (w = 296, x = 1887) ───────────────────────────
    w5, x5 = 296, 1887
    # 5 items in Col 5: heights tailored to fit
    c5a = card("c5a", x5, TOP+65,  w5, 180, "📁", "Audit Repository",
               "Immutable compliance verdicts, verbatim technical evidence, and remediated architecture models.",
               badge="Audits Collection", bc="#8E5E00", bbg=LBROWN)
    c5b = card("c5b", x5, TOP+265, w5, 180, "📚", "Compliance Standards",
               "Live regulatory catalogs: ISO 42001:2023, OWASP AISVS v1.0, EU AI Act, Mexico NOM.",
               badge="Standards Catalog", bc="#8E5E00", bbg=LBROWN)
    c5c = card("c5c", x5, TOP+465, w5, 180, "🔐", "API Key Credential Store",
               "Scoped, revocable programmatic credentials for CI/CD pipelines and external automation.",
               badge="Key Vault", bc="#8E5E00", bbg=LBROWN)
    c5d = card("c5d", x5, TOP+665, w5, 180, "🚨", "Security Event Ledger",
               "Audit trail of injection attempts, unauthorized access trials, and anomalous evaluations.",
               badge="Security Alerts", bc=RED, bbg=LRED)
    c5e = card("c5e", x5, TOP+865, w5, 195, "📜", "Firestore Security Rules",
               "Multi-region nam5 database. Encrypted at rest &amp; in transit. Client access strictly enforced at database tier.",
               badge="nam5 Multi-Region", bc=BLUE, bbg=LBLUE, extra_tag="CMEK Encrypted")

    # ── COLUMN 6: SECOPS & ISO 42001 (Split into 2 sub-columns of width 230)
    # Left Sub-column: SecOps (x = 2256)
    w6s, x6s1, x6s2 = 230, 2256, 2514
    c6a = card("c6a", x6s1, Y1, w6s, H_CARD, "📋", "Cloud Logging",
               "Immutable, centralized audit logs recording every request, evaluation step, and AI interaction.",
               badge="Tamper-proof Log", bc=BLUE, bbg=LBLUE)
    c6b = card("c6b", x6s1, Y2, w6s, H_CARD, "🔍", "Security Command Center",
               "Enterprise threat detection with AI Protection. Automatically escalates prompt injections to SOC incidents.",
               badge="Active Threat Intel", bc=RED, bbg=LRED)
    c6c = card("c6c", x6s1, Y3, w6s, H_CARD, "📈", "Cloud Monitoring",
               "Real-time operational dashboards tracking latency, error budgets, and 95%+ citation grounding SLOs.",
               badge="SLO Alerting", bc=TEAL, bbg=LTEAL)
    c6d = card("c6d", x6s1, Y4, w6s, H_CARD, "🏢", "SIEM &amp; SOC Webhooks",
               "Instant incident forwarding to enterprise SOCs (Chronicle, Splunk, Sentinel) via authenticated webhooks.",
               badge="Enterprise SIEM", bc=PURPLE, bbg=LPURP)

    # Right Sub-column: ISO/IEC 42001 AI Lifecycle (x = 2514)
    c6e = card("c6e", x6s2, Y1, w6s, H_CARD, "🏗️", "ISO Phase 3: Develop",
               "Verified supply chain via Model Garden, active prompt sanitization with Model Armor, and automated remediation plans.",
               badge="AI Protections", bc=BLUE, bbg=LBLUE, extra_tag="Controls A.6-A.8")
    c6f = card("c6f", x6s2, Y2, w6s, H_CARD, "✅", "ISO Phase 4: Evaluate",
               "Objective AutoSxS autorating and reproducible safety evaluations serving as formal quality gate before promotion.",
               badge="AI Evaluation", bc=GREEN, bbg=LGREEN, extra_tag="Clause 9.1")
    c6g = card("c6g", x6s2, Y3, w6s, H_CARD, "🚀", "ISO Phase 5: Deploy",
               "Immutable container hashes, zero-downtime revision rollouts, and pre-traffic zero-trust smoke testing.",
               badge="Controlled Release", bc=ORANGE, bbg=LORANGE, extra_tag="Clause 10.1")
    c6h = card("c6h", x6s2, Y4, w6s, H_CARD, "🔄", "Clause 10: Improvement",
               "Audit verdicts and security findings automatically feed back into architectural redesign, closing the governance loop.",
               badge="Continuous Loop", bc=PURPLE, bbg=LPURP, extra_tag="Feedback Cycle")

    # ── 2. EXECUTIVE STEP FLOW BAR (Top banner beneath header) ─────────────
    flow_bar = f"""
<div style="position:absolute;left:40px;top:95px;width:{W-80}px;height:62px;
  background:white;border:1.5px solid {BORDER};border-radius:14px;
  display:flex;align-items:center;padding:0 24px;box-shadow:0 2px 10px rgba(0,0,0,0.04);z-index:40;">
  <div style="font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:{TEXT1};margin-right:20px;white-space:nowrap;display:flex;align-items:center;gap:8px;">
    <span style="font-size:16px;">⚡</span> END-TO-END AUDIT LIFECYCLE
  </div>
  <div style="height:30px;width:1.5px;background:{BORDER};margin-right:20px;"></div>
  <div style="display:flex;align-items:center;justify-content:space-between;flex-grow:1;">
    {"".join(f'''
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:26px;height:26px;border-radius:50%;background:{c};color:white;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.15);">{num}</div>
      <div>
        <div style="font-size:12px;font-weight:700;color:{TEXT1};">{title}</div>
        <div style="font-size:10.5px;color:{MUTED};">{sub}</div>
      </div>
    </div>
    {f'<div style="color:{BORDER};font-size:18px;font-weight:300;">→</div>' if num != "6" else ""}
    ''' for num, title, sub, c in [
        ("1", "Request Submission", "User or CI/CD initiates audit", BLUE),
        ("2", "Zero-Trust Perimeter", "Identity & domain whitelist check", GREEN),
        ("3", "Evidence Extraction", "Engine parses blueprints & configs", BLUE),
        ("4", "Model Armor Firewall", "Input screened for prompt attacks", RED),
        ("5", "Gemini Reasoning", "Verdicts mapped to ISO & AISVS", ORANGE),
        ("6", "Evidence & SOC Alert", "Report saved, events sent to SIEM", PURPLE),
    ])}
  </div>
</div>"""

    # ── 3. SVG ARROWS & STEP BADGES (Traversing the 40px gaps) ──────────────
    defs = svg_defs(BLUE, GREEN, ORANGE, RED, AMBER, PURPLE, MUTED, TEAL)
    
    # Gap 1 (370 -> 410): Users -> Perimeter
    a1 = arr(370, TOP + 180, 410, TOP + 180, BLUE)
    a2 = arr(370, TOP + 435, 410, TOP + 435, GREEN)
    
    # Gap 2 (750 -> 790): Perimeter -> Cloud Run
    a3 = arr(750, TOP + 180, 790, TOP + 180, BLUE)
    a4 = arr(750, TOP + 435, 790, TOP + 435, GREEN)
    
    # Gap 3 (1330 -> 1370): Cloud Run -> Google AI
    a5 = arr(1330, TOP + 180, 1370, TOP + 180, RED)
    a6 = arr(1330, TOP + 435, 1370, TOP + 435, ORANGE)
    
    # Gap 4 (1830 -> 1870): AI/Engine -> Firestore Data Store
    a7 = arr(1830, TOP + 180, 1870, TOP + 180, AMBER)
    a8 = arr(1830, TOP + 435, 1870, TOP + 435, AMBER)
    
    # Gap 5 (2200 -> 2240): Data/Events -> SecOps & ISO
    a9  = arr(2200, TOP + 180, 2240, TOP + 180, RED)
    a10 = arr(2200, TOP + 750, 2240, TOP + 750, PURPLE)

    # Return stream (bottom of platform from Data Store to Dashboard)
    ret_y = BOT - 45
    ret_arrow = f"""
  <path d="M 1887,{ret_y} L 350,{ret_y}" stroke="{PURPLE}" stroke-width="2.5" stroke-dasharray="8 5" fill="none" marker-end="url(#a{PURPLE.replace('#','')})"/>
  <rect x="980" y="{ret_y-12}" width="220" height="24" rx="12" fill="{PURPLE}" opacity="0.95"/>
  <text x="1090" y="{ret_y+4}" text-anchor="middle" fill="white" font-family="'Google Sans',Arial,sans-serif" font-size="11.5" font-weight="700">Real-Time SSE Result Stream</text>
"""

    svg = f"""<svg style="position:absolute;top:0;left:0;width:{W}px;height:{H}px;overflow:visible;pointer-events:none;z-index:30;">
  {defs}
  {a1}{a2}{a3}{a4}{a5}{a6}{a7}{a8}{a9}{a10}
  {ret_arrow}
</svg>"""

    # Badges sitting precisely in the 40px gaps
    step_badges = "".join([
        step_badge("1", 390,  TOP + 180, "HTTPS Ingress", BLUE),
        step_badge("2", 390,  TOP + 435, "ID Token", GREEN),
        step_badge("3", 770,  TOP + 180, "Auth Request", BLUE),
        step_badge("4", 1350, TOP + 180, "Sanitize", RED),
        step_badge("5", 1350, TOP + 435, "AI Reasoning", ORANGE),
        step_badge("6", 1850, TOP + 180, "Save Verdict", AMBER),
        step_badge("7", 2220, TOP + 180, "Security Log", RED),
        step_badge("8", 2220, TOP + 750, "SIEM Push", PURPLE),
    ])

    # ── 4. ENTERPRISE DEFENSE-IN-DEPTH SECURITY BAND ─────────────────────────
    BAND_Y = 1290
    security_controls = [
        ("Cloud Armor", "Enterprise L7 WAF &amp; DDoS protection"),
        ("VPC Service Controls", "Data exfiltration prevention perimeter"),
        ("Workload Identity", "Zero static service account keys"),
        ("Artifact Registry", "Vulnerability scanning &amp; provenance"),
        ("Binary Authorization", "Cryptographic container signature validation"),
        ("Confidential Computing", "Memory encryption in use via AMD SEV"),
        ("nam5 Multi-Region", "High-availability geo-redundant storage"),
        ("Customer-Managed Keys", "CMEK envelope encryption at rest"),
    ]
    controls_html = "".join(f"""
    <div style="background:white;border:1.5px solid {BORDER};border-radius:12px;padding:10px 16px;flex:1;min-width:0;box-shadow:0 2px 6px rgba(0,0,0,0.03);">
      <div style="font-size:12px;font-weight:800;color:{TEXT1};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">🛡️ {title}</div>
      <div style="font-size:10.5px;color:{MUTED};margin-top:2px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{desc}</div>
    </div>""" for title, desc in security_controls)

    security_band = f"""
<div style="position:absolute;left:40px;top:{BAND_Y}px;width:{W-80}px;height:120px;
  background:linear-gradient(90deg, #F0F6FF 0%, #F0FBF4 35%, #FFF7EC 70%, #FFF0F0 100%);
  border:2px solid {BORDER};border-radius:18px;padding:16px 24px;box-shadow:0 4px 16px rgba(0,0,0,0.03);">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
    <div style="font-size:11px;font-weight:800;letter-spacing:1.8px;text-transform:uppercase;color:{TEXT1};display:flex;align-items:center;gap:8px;">
      <span>🔐</span> GOOGLE CLOUD ENTERPRISE DEFENSE-IN-DEPTH FOUNDATION
    </div>
    <div style="font-size:11px;font-weight:600;color:{MUTED};">Certified FedRAMP High · HIPAA · SOC 1/2/3 · PCI-DSS Compliant Infrastructure</div>
  </div>
  <div style="display:flex;gap:14px;align-items:stretch;">{controls_html}</div>
</div>"""

    # ── 5. LEGEND & COMPLIANCE FOOTER ────────────────────────────────────────
    FOOTER_Y = 1430
    legend_items = [
        (BLUE,   "User / API Ingress"),
        (GREEN,  "Zero-Trust Identity Validation"),
        (RED,    "Security &amp; Model Armor Guardrails"),
        (ORANGE, "Vertex AI Inference &amp; Reasoning"),
        (AMBER,  "Encrypted Database Transaction"),
        (PURPLE, "Real-time Stream / SOC Incident Event"),
    ]
    legend_html = "".join(f"""
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="width:28px;height:3.5px;background:{c};border-radius:2px;"></div>
      <span style="font-size:12px;font-weight:600;color:{TEXT2};">{lbl}</span>
    </div>""" for c, lbl in legend_items)

    compliance_badges = [
        ("ISO/IEC 42001:2023", "Certified AI Management"),
        ("OWASP AISVS v1.0", "AI Verification Standard"),
        ("EU AI Act Ready", "High-Risk AI Compliance"),
        ("Mexico NOM AI Ready", "National Standard Alignment"),
    ]
    comp_html = "".join(f"""
    <div style="background:{LBLUE};border:1px solid #C2D7FA;border-radius:8px;padding:4px 12px;display:flex;align-items:center;gap:6px;">
      <span style="font-size:12px;font-weight:800;color:{DBLUE};">{std}</span>
      <span style="font-size:10.5px;color:{MUTED};">· {sub}</span>
    </div>""" for std, sub in compliance_badges)

    footer = f"""
<div style="position:absolute;left:40px;top:{FOOTER_Y}px;width:{W-80}px;height:105px;
  background:white;border:1.5px solid {BORDER};border-radius:16px;padding:16px 28px;
  display:flex;align-items:center;justify-content:space-between;box-shadow:0 3px 12px rgba(0,0,0,0.04);">
  <div>
    <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:{MUTED};margin-bottom:8px;">DATA FLOW NOTATION</div>
    <div style="display:flex;gap:24px;align-items:center;">{legend_html}</div>
  </div>
  <div style="height:50px;width:1.5px;background:{BORDER};margin:0 24px;"></div>
  <div>
    <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:{MUTED};margin-bottom:8px;">STANDARDS BENCHMARK COVERAGE</div>
    <div style="display:flex;gap:12px;align-items:center;">{comp_html}</div>
  </div>
</div>"""

    # ── 6. TOP TITLE BAR ─────────────────────────────────────────────────────
    header = f"""
<div style="position:absolute;top:0;left:0;width:{W}px;height:80px;
  background:linear-gradient(135deg, {BLUE} 0%, {DBLUE} 100%);
  display:flex;align-items:center;padding:0 40px;gap:16px;z-index:100;box-shadow:0 4px 20px rgba(13,71,161,0.25);">
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
        ("100% Serverless", "Cloud Run Infrastructure"),
        ("Zero Trust", "Perimeter & Identity"),
        ("Model Armor", "Real-Time AI Guardrails"),
        ("ISO/IEC 42001", "Continuous Governance"),
    ])}
  </div>
</div>"""

    elements = [
        header, flow_bar,
        z1, z2, z3, z4, z5, z6,
        c1a, c1b, c1c, c1d,
        c2a, c2b, c2c, c2d,
        c3a, c3b, c3c, c3d,
        c4a, c4b, c4c, c4d,
        c5a, c5b, c5c, c5d, c5e,
        c6a, c6b, c6c, c6d, c6e, c6f, c6g, c6h,
        svg, step_badges,
        security_band, footer
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
    render_js = SCRIPT_DIR / "_exec_render.cjs"

    print("Generating Executive HTML...")
    html_content = build_html()
    html_file.write_text(html_content, encoding="utf-8")
    print(f"  → Written {html_file} ({html_file.stat().st_size:,} bytes)")

    render_js.write_text(PUPPETEER_SCRIPT, encoding="utf-8")

    env = os.environ.copy()
    env["NODE_PATH"] = "/tmp/pup_standalone/node_modules"

    print("Rendering executive diagram (1x, 4K, PDF)...")
    res = subprocess.run(
        ["node", str(render_js), str(html_file), str(OUT_DIR)],
        env=env, capture_output=True, text=True
    )

    print(res.stdout)
    if res.stderr:
        print("STDERR:", res.stderr)
    print("Generating Vector SVG from PDF...")
    pdf_file = OUT_DIR / "AegisAI_Executive_Overview.pdf"
    svg_file = OUT_DIR / "AegisAI_Executive_Overview.svg"
    r_svg = subprocess.run(["pdftocairo", "-svg", str(pdf_file), str(svg_file)], capture_output=True, text=True)
    if svg_file.exists():
        print(f"✓ Generated Vector SVG: {svg_file.stat().st_size:,} bytes")
    else:
        print("Warning: pdftocairo could not generate SVG:", r_svg.stderr)

    if render_js.exists():
        render_js.unlink()

    print(f"\nAll executive assets saved in {OUT_DIR}")

