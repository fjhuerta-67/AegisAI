import os
import shutil
import subprocess

css = """
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700;800&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;600&display=swap');

    @page {
      size: 297mm 210mm; /* A4 Landscape */
      margin: 0;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: 'Roboto', sans-serif;
      background: #090d16;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }

    .slide {
      width: 297mm;
      height: 210mm;
      page-break-after: always;
      break-after: page;
      padding: 14mm 18mm 12mm 18mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #090d16;
    }

    .slide::before {
      content: "";
      position: absolute;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0) 70%);
      top: -100px;
      left: -100px;
      border-radius: 50%;
      pointer-events: none;
    }

    .slide::after {
      content: "";
      position: absolute;
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0) 70%);
      bottom: -120px;
      right: -120px;
      border-radius: 50%;
      pointer-events: none;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 8px;
      position: relative;
      z-index: 10;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo-text {
      font-family: 'Google Sans', sans-serif;
      font-size: 16pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #3b82f6;
    }

    .brand-logo-text span {
      color: #ffffff;
    }

    .brand-tag {
      background: rgba(59, 130, 246, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.4);
      color: #93c5fd;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .slide-num {
      font-family: 'Roboto Mono', monospace;
      font-size: 8.5pt;
      color: #64748b;
      font-weight: 600;
    }

    .title-block {
      margin-top: 6px;
      margin-bottom: 8px;
      position: relative;
      z-index: 10;
    }

    .slide-category {
      font-size: 7.8pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
      margin-bottom: 2px;
    }

    .slide-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 18.5pt;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 4px 0;
      line-height: 1.2;
    }

    .slide-subtitle {
      font-size: 8.8pt;
      color: #94a3b8;
      margin: 0;
      line-height: 1.38;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
      margin: 4px 0;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }

    .card {
      background: rgba(17, 24, 39, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 11px 14px;
      backdrop-filter: blur(8px);
    }

    .card-highlight {
      border-color: rgba(59, 130, 246, 0.45);
      background: linear-gradient(145deg, rgba(30, 58, 138, 0.24) 0%, rgba(17, 24, 39, 0.85) 100%);
    }

    .card-emerald {
      border-color: rgba(16, 185, 129, 0.45);
      background: linear-gradient(145deg, rgba(6, 78, 59, 0.24) 0%, rgba(17, 24, 39, 0.85) 100%);
    }

    .card-danger {
      border-color: rgba(239, 68, 68, 0.4);
      background: linear-gradient(145deg, rgba(127, 29, 29, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%);
    }

    .card-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 10.2pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .card-text {
      font-size: 8pt;
      color: #cbd5e1;
      line-height: 1.45;
      margin: 0;
    }

    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .pill-blue { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .pill-red { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .pill-green { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .pill-amber { background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.4); }
    .pill-purple { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.4); }

    .slide-table { width: 100%; border-collapse: collapse; font-size: 7.8pt; }
    .slide-table th { background: rgba(30, 41, 59, 0.9); color: #f8fafc; text-align: left; padding: 6px 8px; font-weight: 700; border-bottom: 2px solid #334155; }
    .slide-table td { padding: 5.5px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); color: #cbd5e1; vertical-align: middle; }
    .slide-table tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }

    .stat-box { text-align: center; padding: 9px 8px; }
    .stat-number { font-family: 'Google Sans', sans-serif; font-size: 22pt; font-weight: 800; line-height: 1.05; margin-bottom: 3px; }
    .stat-label { font-size: 7.5pt; color: #94a3b8; font-weight: 500; line-height: 1.3; }

    /* Executive FinOps Visual Charts */
    .finops-kpi-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 9px;
    }
    .finops-kpi-card {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(9, 13, 22, 0.95) 100%);
      border-radius: 9px;
      padding: 7px 11px;
      border: 1px solid rgba(255,255,255,0.09);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
    }
    .finops-kpi-card::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }
    .finops-kpi-green::before { background: linear-gradient(180deg, #10b981, #34d399); }
    .finops-kpi-sky::before { background: linear-gradient(180deg, #0ea5e9, #38bdf8); }
    .finops-kpi-amber::before { background: linear-gradient(180deg, #f59e0b, #fbbf24); }
    .finops-kpi-purple::before { background: linear-gradient(180deg, #8b5cf6, #c084fc); }

    .finops-main-grid {
      display: grid;
      grid-template-columns: 1.42fr 1fr;
      gap: 12px;
      flex: 1;
    }
    .hbar-row {
      padding: 5.5px 8px;
      border-radius: 7px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.06);
      margin-bottom: 5.5px;
    }
    .hbar-row-active {
      background: linear-gradient(90deg, rgba(6, 78, 59, 0.35) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1px solid rgba(16, 185, 129, 0.45);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.12);
    }
    .hbar-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .hbar-track {
      width: 100%;
      height: 8.5px;
      background: rgba(30, 41, 59, 0.85);
      border-radius: 999px;
      overflow: hidden;
      position: relative;
      margin-bottom: 3px;
    }
    .hbar-fill {
      height: 100%;
      border-radius: 999px;
    }
    .vbar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 215px;
      padding: 18px 8px 4px 8px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.35);
      background-image: repeating-linear-gradient(
        to top,
        rgba(148, 163, 184, 0.11) 0px,
        rgba(148, 163, 184, 0.11) 1px,
        transparent 1px,
        transparent 40px
      );
      gap: 8px;
      position: relative;
    }
    .vbar-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      height: 100%;
    }
    .vbar-val {
      font-family: 'Roboto Mono', monospace;
      font-size: 6.8pt;
      font-weight: 700;
      margin-bottom: 4px;
      white-space: nowrap;
    }
    .vbar-pillar {
      width: 100%;
      max-width: 34px;
      border-radius: 5px 5px 0 0;
    }
    .vbar-lbl {
      font-size: 6.4pt;
      color: #cbd5e1;
      text-align: center;
      margin-top: 5px;
      line-height: 1.15;
      font-weight: 600;
      white-space: nowrap;
    }

    .step-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 8px 11px;
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
    }

    .step-number {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 8pt;
      flex-shrink: 0;
    }

    .slide-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.3pt;
      color: #64748b;
      position: relative;
      z-index: 10;
    }

    .cover-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 14px 32px;
    }

    .cover-title-big {
      font-family: 'Google Sans', sans-serif;
      font-size: 30pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.12;
      margin: 10px 0 10px 0;
      letter-spacing: -0.8px;
    }

    .cover-title-big span {
      background: linear-gradient(90deg, #38bdf8 0%, #34d399 50%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-desc-big {
      font-size: 10pt;
      color: #94a3b8;
      max-width: 820px;
      line-height: 1.55;
      margin: 0 auto 18px auto;
    }

    .tech-badges-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; max-width: 880px; }
    code { font-family: 'Roboto Mono', monospace; font-size: 7.3pt; color: #93c5fd; background: rgba(30,41,59,0.75); padding: 1px 4px; border-radius: 3px; }
"""

html_en = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AegisAI Enterprise — Product Evolution, Self-Audit & FinOps Economics</title>
  <style>{css}</style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Engineering Evolution & FinOps Case Study</span>
      </div>
      <span class="slide-num">01 / 12</span>
    </div>

    <div class="cover-container">
      <div class="pill pill-blue" style="font-size: 8.2pt; padding: 4px 12px; margin-bottom: 8px;">
        From Google AI Studio PoC to Antigravity Enterprise RC
      </div>
      <h1 class="cover-title-big">
        Assurance, Self-Auditing &<br><span>GenAI FinOps Economics</span>
      </h1>
      <p class="cover-desc-big">
        How <strong>AegisAI Enterprise</strong> was prototyped in <strong>Google AI Studio (Gemini 3.6 Flash)</strong>, architected with <strong>Gemini 3.1 Pro (5%)</strong>, engineered at scale in <strong>Google Antigravity (Gemini 3.8 Flash — 80% combined Flash)</strong>, self-audited (68.9% ➔ 97.8%), hardened &amp; QA-verified with <strong>Gemini 4.0 Argon (10%)</strong> and <strong>Claude Opus 5.5 Max (5%)</strong>, and presented as a Release Candidate to <strong>Farmacias del Ahorro</strong>, <strong>Asociación Mexicana de Franquicias</strong>, and <strong>Grupo Coppel</strong>—for a total build cost of <strong>$215.24 USD</strong> ($319.80 w/ full agentic loops).
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">1. AI Studio PoC (Gemini 3.6 Flash)</span>
        <span class="pill pill-blue">2. Arch (3.1 Pro 5%) + Bulk Build (3.8 Flash 74%)</span>
        <span class="pill pill-green">3. Hardening &amp; QA (4.0 Argon 10% + Opus 5.5 5%)</span>
        <span class="pill pill-purple">4. RC: Farmacias del Ahorro • AMF • Coppel</span>
        <span class="pill pill-amber">5. Audit Cost: $0.43–$1.55 (Batch: $0.21) vs $8.55–$31.09</span>
        <span class="pill pill-green">6. Total App Build Cost: $215.24 USD</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise v2.5 • Executive &amp; FinOps Presentation</span>
      <span>Google Cloud Run • Vertex AI • Cloud Firestore • Identity-Aware Proxy</span>
      <span>October 2026</span>
    </div>
  </div>

  <!-- SLIDE 2: 4-STAGE PRODUCT EVOLUTION -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Product Evolution</span>
      </div>
      <span class="slide-num">02 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">End-to-End Multi-Model Engineering Lifecycle</span>
      <h2 class="slide-title">How We Built, Self-Audited, and Validated AegisAI</h2>
      <p class="slide-subtitle">A four-stage right-sized multi-model engineering journey (80% Flash • 10% Argon • 5% 3.1 Pro • 5% Opus 5.5 Max).</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Phase 1 • Proof of Concept (~6% Tokens)</div>
          <div class="card-title" style="color: #38bdf8;">1. Prototyped in Google AI Studio (Gemini 3.6 Flash — $6.53)</div>
          <p class="card-text">
            • Built the initial Proof of Concept in <strong>Google AI Studio</strong> using <strong>Gemini 3.6 Flash</strong> (~45 iterations, 4.20M In / 0.90M Out tokens @ official $0.75/$3.75 rate).<br>
            • Validated structured JSON Schema output generation, multimodal PDF/diagram ingestion, and initial React UI scaffolding.<br>
            • Proved that Flash-class models with strict system instructions and temperature <code>0.0</code> evaluate complex security controls rapidly.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Phase 2 • Architecture (5%) &amp; Bulk Build (74%)</div>
          <div class="card-title" style="color: #60a5fa;">2. Architected in 3.1 Pro ($14.06) &amp; Built in 3.8 Flash ($70.65)</div>
          <p class="card-text">
            • <strong>Architecture (Gemini 3.1 Pro, 5%):</strong> Designed the 4-layer Zero-Trust topology, 12-batch Map-Reduce engine, 265-control taxonomy &amp; Firestore security model (3.55M In / 0.58M Out @ $2.00/$12.00).<br>
            • <strong>Bulk Construction (Gemini 3.8 Flash, 74%):</strong> Executed <strong>171+ engineering prompts</strong> in <strong>Google Antigravity</strong> to build the Express/React 19 stack, GCP Live Scanner, 17 bilingual PDF manuals ($65.85), and live Vertex AI self-audits ($4.80). Combined Flash = <strong>80% of tokens for $77.18</strong> ($38.59 Batch).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">Phase 3 • Self-Audit, Hardening (10%) &amp; QA (5%)</div>
          <div class="card-title" style="color: #34d399;">3. Self-Audited (68.9%➔97.8%) + Hardened in Argon &amp; Opus 5.5</div>
          <p class="card-text">
            • Baseline self-audit (<code>MULTI-2026-0437</code>) on <code>Originaldocs.zip</code> scored <strong>68.9%</strong> (35 gaps).<br>
            • <strong>Gemini 4.0 Argon (10%, $25.70):</strong> Keyless Vertex AI ADC, Cloud IAP perimeter, 308 Firestore rules unit tests &amp; 4K/8K architecture diagrams (7.10M In / 1.15M Out @ $2.00/$10.00).<br>
            • <strong>Claude Opus 5.5 Max (5%, $96.45):</strong> Adversarial red-team review, constant-time auth, SSRF/DNS rebinding fixes &amp; QA ➔ <strong>97.8%</strong> (<code>MULTI-2026-8983</code>, 0 failures).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-purple" style="margin-bottom: 6px;">Phase 4 • Enterprise Field Validation</div>
          <div class="card-title" style="color: #d8b4fe;">4. Release Candidate (RC) Presented to Industry Leaders</div>
          <p class="card-text">
            • Presented the hardened Release Candidate (RC) to three major Mexican organizations:<br>
            &nbsp;&nbsp;1. <strong>Farmacias del Ahorro</strong> (Healthcare &amp; Retail Pharmacy)<br>
            &nbsp;&nbsp;2. <strong>Asociación Mexicana de Franquicias (AMF)</strong> (Franchise Ecosystem)<br>
            &nbsp;&nbsp;3. <strong>Grupo Coppel</strong> (Financial Services &amp; Omnichannel Retail)<br>
            • Validated multi-standard compliance (OWASP AI-SVS, ISO 42001, LFPC &amp; LFPDPPP).
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • 4-Stage Multi-Model Evolution</span>
      <span>3.6 Flash (PoC) ➔ 3.1 Pro (Arch) + 3.8 Flash (Build) ➔ 4.0 Argon + Opus 5.5 Max (Hardening &amp; QA) ➔ RC</span>
    </div>
  </div>

  <!-- SLIDE 3: SELF-AUDIT LOOP (DOGFOODING) -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Self-Audit Case Study</span>
      </div>
      <span class="slide-num">03 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Eating Our Own Dogfood</span>
      <h2 class="slide-title">Running AegisAI's Codebase & Documentation Against Itself</h2>
      <p class="slide-subtitle">How AegisAI diagnosed 35 OWASP AI-SVS & ISO 42001 gaps in its own prototype and guided its own remediation to 97.8%.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#f87171;">1. Baseline Self-Audit</span> (<code>MULTI-2026-0437</code>)</div>
          <p class="card-text">
            • <strong>Overall Score:</strong> <strong style="color:#fca5a5;">68.9% (Level L2)</strong><br>
            • <strong>OWASP AI-SVS v1.0:</strong> 71.8% (17 gaps)<br>
            • <strong>ISO/IEC 42001:2023:</strong> 66.7% (18 gaps)<br>
            • <strong>Key Findings Detected by AegisAI:</strong><br>
            &nbsp;&nbsp;– Writable <code>/app/config</code> in container (<code>C04.1</code>)<br>
            &nbsp;&nbsp;– Timing-vulnerable token check <code>===</code> (<code>C05.3</code>)<br>
            &nbsp;&nbsp;– Legacy <code>roles/viewer</code> on runtime SA (<code>C05.2</code>)<br>
            &nbsp;&nbsp;– Missing SHA-256 normative manifest (<code>C01.4</code>)<br>
            &nbsp;&nbsp;– Missing ISO 42001 AIMS Policy & Appeal docs
          </p>
        </div>

        <div class="card card-highlight">
          <div class="card-title"><span style="color:#60a5fa;">2. Full-Stack Remediation in Antigravity</span></div>
          <p class="card-text">
            • <strong>Generator Fixes:</strong> Untruncated Section 4 Cookbook (all 35 patches), smart sentence-boundary splitter, accurate syntax tags.<br>
            • <strong>Container & Cloud:</strong> <code>chmod -R a-w /app</code> (<code>C04.1</code>), Cloud IAP + SSRF/IMDS blocker (<code>C04.3</code>), pruned <code>roles/viewer</code> (<code>C05.2</code>).<br>
            • <strong>Runtime Guardrails:</strong> SHA-256 manifest (<code>C01.4</code>), crescendo detector (<code>C02.10</code>), <code>crypto.timingSafeEqual</code> (<code>C05.3</code>), Anti-DoW quotas (<code>C11.1</code>), sagas (<code>C09.4</code>).<br>
            • <strong>Docs & Rules:</strong> Authored Manual 8 (ISO 42001 AIMS) & passed 308/308 Firestore rules unit tests.
          </p>
        </div>

        <div class="card card-emerald">
          <div class="card-title"><span style="color:#34d399;">3. Post-Fix Re-Audit</span> (<code>MULTI-2026-8983</code>)</div>
          <p class="card-text">
            • <strong>Overall Score:</strong> <strong style="color:#6ee7b7;">97.8% (+28.9 pts)</strong><br>
            • <strong>ISO/IEC 42001:2023:</strong> <strong style="color:#6ee7b7;">100.0%</strong> (54/54 mandatory passed, <strong>0 Failed</strong>)<br>
            • <strong>OWASP AI-SVS v1.0:</strong> <strong style="color:#6ee7b7;">94.7%</strong> (45/49 passed, <strong>0 Failed</strong>)<br>
            • <strong>Telemetry Recorded in Firestore:</strong><br>
            &nbsp;&nbsp;– Model: <code>gemini-3.8-flash</code> on Vertex AI<br>
            &nbsp;&nbsp;– Input Tokens: <code>1,758,724</code><br>
            &nbsp;&nbsp;– Output Tokens: <code>100,715</code><br>
            &nbsp;&nbsp;– Zero critical or high-risk failures remaining
          </p>
        </div>
      </div>

      <div class="card" style="background: rgba(30, 41, 59, 0.5);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Why Self-Auditing Matters:</strong> Running AegisAI against its own architecture and manuals proved that the evaluator does not hallucinate approvals—it caught subtle issues (such as <code>providedToken === configuredToken</code> and missing ISO 42001 whistleblowing/appeal channels) and verified their closure once remediated.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Closed-Loop Self-Audit Verification</span>
      <span>Firestore Audit IDs: MULTI-2026-0437 (Baseline 68.9%) ➔ MULTI-2026-8983 (Remediated 97.8%)</span>
    </div>
  </div>

  <!-- SLIDE 4: RC PRESENTATIONS TO ENTERPRISE CLIENTS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Enterprise Release Candidate</span>
      </div>
      <span class="slide-num">04 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Market Validation & Executive Roadshow</span>
      <h2 class="slide-title">Release Candidate (RC) Presented to Strategic Enterprises</h2>
      <p class="slide-subtitle">Following our self-audit hardening loop, the AegisAI Release Candidate was presented to three flagship Mexican organizations.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Healthcare & Retail Pharmacy</div>
          <div class="card-title" style="color: #60a5fa;">Farmacias del Ahorro</div>
          <p class="card-text">
            • <strong>Use Case Focus:</strong> Auditing clinical/pharmacy digital assistants, prescription triage bots, and omnichannel customer service AI.<br>
            • <strong>Key AegisAI Capabilities Demonstrated:</strong><br>
            &nbsp;&nbsp;– Strict <strong>LFPDPPP</strong> sensitive health/PII data protection & pre-inference DLP masking.<br>
            &nbsp;&nbsp;– Hallucination prevention (<code>temperature: 0.0</code>) and human escalation workflows (<code>ISO 42001 A.5.2</code>).<br>
            &nbsp;&nbsp;– Continuous RAG grounding telemetry (<code>C08.4</code>) on Google Cloud Vertex AI.
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">National Franchise Ecosystem</div>
          <div class="card-title" style="color: #34d399;">Asociación Mexicana de Franquicias</div>
          <p class="card-text">
            • <strong>Use Case Focus:</strong> Standardizing AI adoption, customer chatbots, and automated marketing compliance across hundreds of member franchises.<br>
            • <strong>Key AegisAI Capabilities Demonstrated:</strong><br>
            &nbsp;&nbsp;– <strong>LFPC (Profeco 2026)</strong> compliance: preventing deceptive AI commercial patterns and enforcing Art. 56 5-day cooling-off retraction.<br>
            &nbsp;&nbsp;– <strong>BYOF Engine:</strong> Custom franchise governance templates with low-cost Flash evaluations (<code>$0.43/audit</code> standard or <code>$0.21/audit</code> Batch).
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-purple" style="margin-bottom: 6px;">Financial Services & Retail</div>
          <div class="card-title" style="color: #d8b4fe;">Grupo Coppel</div>
          <p class="card-text">
            • <strong>Use Case Focus:</strong> High-scale credit scoring ML, fraud detection engines, and enterprise GenAI engineering governance.<br>
            • <strong>Key AegisAI Capabilities Demonstrated:</strong><br>
            &nbsp;&nbsp;– Simultaneous <strong>OWASP AI-SVS v1.0 (Level L2/L3) + ISO/IEC 42001:2023</strong> certification readiness.<br>
            &nbsp;&nbsp;– Multi-tenant domain isolation (<code>C05.4</code>, <code>C08.1</code>), Cloud IAP Zero-Trust perimeter, and keyless <strong>GCP Live Scanner</strong>.<br>
            &nbsp;&nbsp;– Drop-in remediated architecture & Terraform/TypeScript cookbook generation.
          </p>
        </div>
      </div>

      <div class="card" style="background: rgba(30, 41, 59, 0.45);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Executive Feedback Highlights:</strong> Enterprise stakeholders highlighted AegisAI's ability to combine <strong>global technical standards (OWASP AI-SVS + ISO 42001)</strong> with <strong>Mexican statutory law (LFPDPPP + LFPC)</strong> while delivering ready-to-deploy remediation code at a fraction of traditional consulting costs.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Release Candidate (RC) Executive Roadshow</span>
      <span>Validated with Farmacias del Ahorro • Asociación Mexicana de Franquicias • Grupo Coppel</span>
    </div>
  </div>

  <!-- SLIDE 5: UNIT ECONOMICS - PER AUDIT COST COMPARISON -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Unit Economics & Model Benchmark</span>
      </div>
      <span class="slide-num">05 / 12</span>
    </div>

    <div class="title-block" style="margin-bottom: 5px;">
      <span class="slide-category">FinOps Analysis: Cost per Complete OWASP AI-SVS + ISO/IEC 42001 Audit</span>
      <h2 class="slide-title">Gemini (3.8 Flash, 4.0 Argon, 3.1 Pro) vs. Claude (Fable 5.1, Opus 5.5)</h2>
      <p class="slide-subtitle">Calculated from real production Firestore token telemetry using Official 2026 Rate Cards per full dual-standard audit.</p>
    </div>

    <div class="slide-body" style="justify-content: flex-start;">
      <!-- Top Executive KPI Hero Strip -->
      <div class="finops-kpi-strip">
        <div class="finops-kpi-card finops-kpi-green">
          <div>
            <div style="font-size:6.5pt; color:#6ee7b7; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Standard Audit (3.8 Flash)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#34d399; line-height:1.1;">$0.43 <span style="font-size:8.5pt; font-weight:600; color:#a7f3d0;">USD</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;">Batch/Flex Tier: <strong style="color:#6ee7b7;">$0.21 USD</strong></div>
          </div>
          <span class="pill pill-green" style="font-size:6.2pt;">1.0x BASE</span>
        </div>

        <div class="finops-kpi-card finops-kpi-sky">
          <div>
            <div style="font-size:6.5pt; color:#7dd3fc; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">10-PDF Suite Audit (3.8 Flash)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#38bdf8; line-height:1.1;">$1.55 <span style="font-size:8.5pt; font-weight:600; color:#bae6fd;">USD</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;">1.64M In + 86.5K Out (<strong style="color:#7dd3fc;">$0.78 Batch</strong>)</div>
          </div>
          <span class="pill pill-blue" style="font-size:6.2pt;">12 BATCHES</span>
        </div>

        <div class="finops-kpi-card finops-kpi-amber">
          <div>
            <div style="font-size:6.5pt; color:#fcd34d; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Cost Advantage vs. Opus 5.5</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#fbbf24; line-height:1.1;">20.0x <span style="font-size:8.5pt; font-weight:600; color:#fde68a;">Cheaper</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;"><strong style="color:#fcd34d;">40.0x</strong> vs Batch • <strong style="color:#fcd34d;">6.7x</strong> vs Std Opus</div>
          </div>
          <span class="pill pill-amber" style="font-size:6.2pt;">VERIFIED</span>
        </div>

        <div class="finops-kpi-card finops-kpi-purple">
          <div>
            <div style="font-size:6.5pt; color:#d8b4fe; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Monthly OpEx Savings (1K Audits)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#c084fc; line-height:1.1;">95.0% <span style="font-size:8.5pt; font-weight:600; color:#e9d5ff;">Saved</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;"><strong style="color:#e9d5ff;">$428/mo</strong> vs. $8,550/mo (Opus Max)</div>
          </div>
          <span class="pill pill-purple" style="font-size:6.2pt;">-$8,122/MO</span>
        </div>
      </div>

      <!-- Main Visual Charts Grid -->
      <div class="finops-main-grid">
        <!-- LEFT PANEL: Horizontal Dual-Workload Bar Chart -->
        <div class="card" style="padding: 9px 12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <div>
              <div class="card-title" style="font-size:9.5pt; margin-bottom:1px; color:#f8fafc;">Per-Audit Cost & Multiplier Benchmark (USD)</div>
              <div style="font-size:6.7pt; color:#94a3b8;">Dual-Bar Comparison: Standard Audit (370K In / 40K Out) vs. Full 10-PDF Suite (1.64M In / 86.5K Out)</div>
            </div>
            <div style="display:flex; gap:8px; font-size:6.4pt; font-weight:700;">
              <span style="display:flex; align-items:center; gap:4px; color:#e2e8f0;"><span style="width:9px; height:9px; border-radius:2px; background:#34d399; display:inline-block;"></span>Standard Audit</span>
              <span style="display:flex; align-items:center; gap:4px; color:#94a3b8;"><span style="width:9px; height:9px; border-radius:2px; background:rgba(56,189,248,0.45); border:1px solid #38bdf8; display:inline-block;"></span>10-PDF Bundle</span>
            </div>
          </div>

          <!-- Row 1: Gemini 3.8 Flash -->
          <div class="hbar-row hbar-row-active">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#34d399; font-size:8.5pt;">Gemini 3.8 Flash</strong>
                <span class="pill pill-green" style="font-size:5.8pt; padding:1px 6px;">DEFAULT ENGINE</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#a7f3d0;">$0.75 In / $3.75 Out</span>
              </div>
              <span class="pill pill-green" style="font-size:6.3pt;">1.0x Baseline</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 6.5%; background: linear-gradient(90deg, #059669, #34d399); box-shadow: 0 0 8px #10b981;"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 11.5%; background: rgba(52, 211, 153, 0.45); border-right: 2px solid #34d399;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#6ee7b7;">Std: $0.43 <span style="font-size:6.2pt; color:#a7f3d0;">(Batch $0.21)</span></div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#a7f3d0;">$1.55</strong> ($0.78)</div>
              </div>
            </div>
          </div>

          <!-- Row 2: Gemini 4.0 Argon -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#38bdf8; font-size:8.3pt;">Gemini 4.0 Argon</strong>
                <span class="pill pill-blue" style="font-size:5.8pt; padding:1px 6px;">FRONTIER</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$2.00 In / $10.00 Out</span>
              </div>
              <span class="pill pill-blue" style="font-size:6.3pt;">2.67x vs Flash</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 15.5%; background: linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 24.5%; background: rgba(56, 189, 248, 0.4); border-right: 2px solid #38bdf8;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#7dd3fc;">Std: $1.14 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#bae6fd;">$4.15 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 3: Gemini 3.1 Pro -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#60a5fa; font-size:8.3pt;">Gemini 3.1 Pro</strong>
                <span class="pill pill-blue" style="font-size:5.8pt; padding:1px 6px;">DEEP REASONING</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$2.00 In / $12.00 Out</span>
              </div>
              <span class="pill pill-blue" style="font-size:6.3pt;">2.78x – 2.85x</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 17%; background: linear-gradient(90deg, #2563eb, #60a5fa);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 26%; background: rgba(96, 165, 250, 0.4); border-right: 2px solid #60a5fa;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#93c5fd;">Std: $1.22 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#bfdbfe;">$4.32 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 4: Claude Fable 5.1 Medium -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#fcd34d; font-size:8.3pt;">Claude Fable 5.1 Medium</strong>
                <span class="pill pill-amber" style="font-size:5.8pt; padding:1px 6px;">EXTERNAL</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$3.00 In / $15.00 Out</span>
              </div>
              <span class="pill pill-amber" style="font-size:6.3pt;">4.0x (8.0x vs Batch)</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 24%; background: linear-gradient(90deg, #d97706, #fbbf24);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 36%; background: rgba(251, 191, 36, 0.4); border-right: 2px solid #fbbf24;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#fde68a;">Std: $1.71 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#fef08a;">$6.22 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 5: Claude Opus 5.5 Max -->
          <div class="hbar-row" style="margin-bottom:0; border-color: rgba(239,68,68,0.35); background: rgba(127,29,29,0.14);">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#f87171; font-size:8.3pt;">Claude Opus 5.5 Max</strong>
                <span class="pill pill-red" style="font-size:5.8pt; padding:1px 6px;">MAX TIER</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#fca5a5;">$15.00 / $75.00 <span style="color:#94a3b8;">(Std: $5/$25)</span></span>
              </div>
              <span class="pill pill-red" style="font-size:6.3pt;">20.0x (40x Batch / 6.7x Std)</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 68%; background: linear-gradient(90deg, #dc2626, #f87171);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 100%; background: rgba(248, 113, 113, 0.5); border-right: 2px solid #ef4444;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#fca5a5;">Std: $8.55 <span style="font-size:6.2pt; color:#cbd5e1;">(Std $2.85)</span></div>
                <div style="font-size:6.8pt; color:#fca5a5;">10-PDF: <strong>$31.09</strong> ($10.36)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Vertical Column Chart + Firestore Telemetry Breakdown -->
        <div style="display:flex; flex-direction:column; gap:10px; justify-content:space-between;">
          <!-- Top Right Card: Vertical Column Chart (Monthly Spend @ 1,000 Audits) -->
          <div class="card" style="padding: 9px 12px; flex: 1; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="card-title" style="font-size:9.2pt; margin-bottom:1px; color:#f8fafc;">Monthly Run-Rate @ 1,000 Audits / Mo</div>
                <div style="font-size:6.6pt; color:#94a3b8;">Total monthly cloud inference bill for 1,000 standard dual-standard audits</div>
              </div>
              <span class="pill pill-green" style="font-size:6pt;">SAVE $8,122 / MO</span>
            </div>

            <div class="vbar-chart">
              <!-- Col 1: 3.8 Flash Batch -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#6ee7b7;">$214</div>
                <div class="vbar-pillar" style="height: 8%; min-height: 7px; background: linear-gradient(180deg, #34d399, #059669); box-shadow: 0 0 8px rgba(16,185,129,0.5);"></div>
                <div class="vbar-lbl" style="color:#6ee7b7;">3.8 Flash<br><span style="font-size:5.6pt; color:#94a3b8;">(Batch)</span></div>
              </div>
              <!-- Col 2: 3.8 Flash Std -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#34d399;">$428</div>
                <div class="vbar-pillar" style="height: 14%; min-height: 12px; background: linear-gradient(180deg, #10b981, #047857); box-shadow: 0 0 8px rgba(16,185,129,0.4);"></div>
                <div class="vbar-lbl" style="color:#34d399;">3.8 Flash<br><span style="font-size:5.6pt; color:#94a3b8;">(Std)</span></div>
              </div>
              <!-- Col 3: 4.0 Argon -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#7dd3fc;">$1,140</div>
                <div class="vbar-pillar" style="height: 27%; background: linear-gradient(180deg, #38bdf8, #0284c7);"></div>
                <div class="vbar-lbl">4.0 Argon<br><span style="font-size:5.6pt; color:#94a3b8;">(2.67x)</span></div>
              </div>
              <!-- Col 4: 3.1 Pro -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#93c5fd;">$1,220</div>
                <div class="vbar-pillar" style="height: 30%; background: linear-gradient(180deg, #60a5fa, #2563eb);"></div>
                <div class="vbar-lbl">3.1 Pro<br><span style="font-size:5.6pt; color:#94a3b8;">(2.85x)</span></div>
              </div>
              <!-- Col 5: Fable 5.1 -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fde68a;">$1,710</div>
                <div class="vbar-pillar" style="height: 40%; background: linear-gradient(180deg, #fbbf24, #d97706);"></div>
                <div class="vbar-lbl">Fable 5.1<br><span style="font-size:5.6pt; color:#94a3b8;">(4.0x)</span></div>
              </div>
              <!-- Col 6: Opus 5.5 Std -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fdba74;">$2,850</div>
                <div class="vbar-pillar" style="height: 56%; background: linear-gradient(180deg, #fb923c, #ea580c);"></div>
                <div class="vbar-lbl">Opus 5.5<br><span style="font-size:5.6pt; color:#94a3b8;">(Std 6.7x)</span></div>
              </div>
              <!-- Col 7: Opus 5.5 Max -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fca5a5;">$8,550</div>
                <div class="vbar-pillar" style="height: 92%; background: linear-gradient(180deg, #f87171, #b91c1c); box-shadow: 0 0 10px rgba(239,68,68,0.4);"></div>
                <div class="vbar-lbl" style="color:#fca5a5;">Opus Max<br><span style="font-size:5.6pt; color:#fca5a5;">(20.0x)</span></div>
              </div>
            </div>
          </div>

          <!-- Bottom Right Card: Firestore Token Telemetry Composition -->
          <div class="card card-emerald" style="padding: 9px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
              <div class="card-title" style="font-size:8.8pt; margin-bottom:0; color:#6ee7b7;">Production Token Telemetry (Cloud Firestore)</div>
              <span style="font-family:'Roboto Mono',monospace; font-size:6.2pt; color:#a7f3d0;">15 Map-Reduce Calls / Audit</span>
            </div>

            <!-- Profile A Segmented Bar -->
            <div style="margin-bottom:6px;">
              <div style="display:flex; justify-content:space-between; font-size:6.7pt; margin-bottom:2px;">
                <span style="color:#e2e8f0; font-weight:700;">Profile A: Standard Architecture Audit (408.6K tok)</span>
                <span style="font-family:'Roboto Mono',monospace; color:#6ee7b7;">90.3% In / 9.7% Out</span>
              </div>
              <div style="display:flex; height:8px; border-radius:999px; overflow:hidden; background:#1e293b;">
                <div style="width:90.3%; background:linear-gradient(90deg, #059669, #34d399);"></div>
                <div style="width:9.7%; background:#f59e0b;"></div>
              </div>
              <div style="font-size:6.2pt; color:#94a3b8; margin-top:2px;">
                Audits <code>MULTI-2026-0507</code> & <code>1250</code>: Avg <code>368,827</code> Input + <code>39,812</code> Output tokens
              </div>
            </div>

            <!-- Profile B Segmented Bar -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:6.7pt; margin-bottom:2px;">
                <span style="color:#e2e8f0; font-weight:700;">Profile B: Full 10-PDF Suite Audit (1.725M tok)</span>
                <span style="font-family:'Roboto Mono',monospace; color:#38bdf8;">95.0% In / 5.0% Out</span>
              </div>
              <div style="display:flex; height:8px; border-radius:999px; overflow:hidden; background:#1e293b;">
                <div style="width:95.0%; background:linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                <div style="width:5.0%; background:#f59e0b;"></div>
              </div>
              <div style="font-size:6.2pt; color:#94a3b8; margin-top:2px;">
                Audits <code>MULTI-2026-0437</code> & <code>8983</code>: Avg <code>1,638,410</code> Input + <code>86,495</code> Output (~136K ctx/batch)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Unit Economics & Model Cost Benchmark (Official 2026 Pricing)</span>
      <span>Telemetry Source: Cloud Firestore (aegis-ai-db) Audits MULTI-2026-0437, 8983, 0507 & 1250</span>
    </div>
  </div>

  <!-- SLIDE 6: TOTAL COST OF BUILDING AEGIS AI -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Total Build Cost (TCO)</span>
      </div>
      <span class="slide-num">06 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Engineering ROI &amp; Multi-Model Lifecycle Breakdown (80% Flash • 10% Argon • 5% Pro • 5% Opus)</span>
      <h2 class="slide-title">How Much Money We Spent Creating AegisAI: $215.24 USD Total</h2>
      <p class="slide-subtitle">Right-sized multi-model engineering across AI Studio PoC, System Architecture, Bulk Full-Stack Construction, Frontier Hardening &amp; Adversarial QA.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 10px;">
        <div class="card stat-box card-emerald">
          <div class="stat-number" style="color: #34d399;">$215.24</div>
          <div class="stat-label"><strong>Total Money Spent</strong> creating AegisAI ($319.80 w/ full agentic loops)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">~71.0M</div>
          <div class="stat-label">Total Input Tokens (<strong>80% Flash</strong> for $77.18 • 10% Argon • 5% Pro • 5% Opus)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">$1,931</div>
          <div class="stat-label">What the exact same token volume costs if run <strong>100% on Claude Opus 5.5 Max</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #fcd34d;">~$95,000</div>
          <div class="stat-label">Equivalent traditional engineering cost (4 DevSecOps engineers × 3 months)</div>
        </div>
      </div>

      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 24%;">Development Phase &amp; Role</th>
            <th style="width: 24%;">Model &amp; Token Share</th>
            <th style="width: 24%;">Engineering Scope &amp; Token Volume</th>
            <th style="width: 14%;">Actual Spend (2026)</th>
            <th style="width: 14%;">If 100% Opus 5.5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Rapid PoC &amp; Schema Validation</strong></td>
            <td>AI Studio • <code>Gemini 3.6 Flash</code> (~6%)</td>
            <td>~45 PoC iterations, JSON schema &amp; PDF tests • 4.20M In / 0.90M Out</td>
            <td><strong style="color:#6ee7b7;">$6.53 USD</strong></td>
            <td>$130.50 USD</td>
          </tr>
          <tr>
            <td><strong>2. System Architecture &amp; Blueprint</strong></td>
            <td>Antigravity • <code>Gemini 3.1 Pro</code> (<strong>5%</strong>)</td>
            <td>Zero-Trust topology, 12-batch Map-Reduce, 265 controls • 3.55M In / 0.58M Out</td>
            <td><strong style="color:#6ee7b7;">$14.06 USD</strong></td>
            <td>$96.45 USD</td>
          </tr>
          <tr>
            <td><strong>3. Bulk Build, Manuals &amp; Audits</strong></td>
            <td>Antigravity + Vertex • <code>Gemini 3.8 Flash</code> (<strong>74%</strong>)</td>
            <td>171 prompts, 17 PDFs ($65.85) + Live Self-Audits ($4.80) • 52.60M In / 8.32M Out</td>
            <td><strong style="color:#6ee7b7;">$70.65 USD</strong></td>
            <td>$1,412.70 USD</td>
          </tr>
          <tr>
            <td><strong>4. Frontier Hardening &amp; Visuals</strong></td>
            <td>Antigravity • <code>Gemini 4.0 Argon</code> (<strong>10%</strong>)</td>
            <td>Keyless Vertex ADC, Cloud IAP, 308 rules tests, 4K diagrams • 7.10M In / 1.15M Out</td>
            <td><strong style="color:#6ee7b7;">$25.70 USD</strong></td>
            <td>$192.90 USD</td>
          </tr>
          <tr>
            <td><strong>5. Adversarial Bugfixing &amp; QA</strong></td>
            <td>Antigravity • <code>Claude Opus 5.5 Max</code> (<strong>5%</strong>)</td>
            <td>Red-team code review, timing-safe auth, SSRF/DNS fixes • 3.55M In / 0.58M Out</td>
            <td><strong style="color:#6ee7b7;">$96.45 USD</strong></td>
            <td>$96.45 USD</td>
          </tr>
          <tr>
            <td><strong>6. Google Cloud Serverless Infra</strong></td>
            <td>Cloud Build (9x), Cloud Run, Firestore, IAP</td>
            <td>9 container builds, scale-to-zero runtime, <code>aegis-ai-db</code> • <strong>Total: $215.24 USD</strong></td>
            <td><strong style="color:#6ee7b7;">$1.85 USD</strong></td>
            <td>$1.85 USD</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Multi-Model Development TCO ($215.24 Direct / $319.80 Full Agentic Loops)</span>
      <span>88.9% Savings vs. 100% Claude Opus 5.5 Max ($1,930.85) • 99.77% Savings vs. Traditional Staffing</span>
    </div>
  </div>

  <!-- SLIDE 7: THE PROBLEM -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Risk Landscape</span>
      </div>
      <span class="slide-num">07 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">The Problem to Solve</span>
      <h2 class="slide-title">The Critical Security Blindspot in Enterprise GenAI Adoption</h2>
      <p class="slide-subtitle">Enterprises are shipping generative AI models, agentic workflows, MCP tools, and RAG pipelines without architectural verification or ISO 42001 governance.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Ungoverned AI Access & Breaches</div>
          <p class="card-text">Per <strong>IBM Cost of a Data Breach 2025</strong>, <strong>13% of organizations</strong> reported breaches of AI models or applications, and <strong>97% of those</strong> lacked proper AI access controls or formal impact assessments (<code>ISO 42001 A.5.1</code>).</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Multi-Turn & Agentic Attack Surface</div>
          <p class="card-text">RAG pipelines, MCP servers, and autonomous agents introduce critical vectors: <strong>Multi-Turn Crescendo Prompt Injection</strong> (<code>C02.10</code>), <strong>Normative/Vector Poisoning</strong> (<code>C01.4</code>), and SSRF/IMDS exfiltration (<code>C04.3</code>).</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> CISO vs Data Science Silo</div>
          <p class="card-text">Security teams lack tools to audit agent graphs, MCP manifests (<code>C10.1</code>), and pre-retrieval vector ACLs (<code>C08.1</code>); AI developers lack automated mappings to formal compliance clauses.</p>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 12px;">
        <div class="card">
          <div class="card-title" style="color: #f59e0b;">Lack of Operationalized Governance (ISO/IEC 42001)</div>
          <p class="card-text">Organizations struggle to operationalize <strong>ISO/IEC 42001:2023</strong> requirements—such as Corporate AI Policies (<code>A.2.1</code>), Confidential Whistleblowing (<code>A.3.3</code>), AI Asset Inventories (<code>A.4.1</code>), and Human Verdict Appeals (<code>A.5.2</code>)—into software engineering workflows.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #38bdf8;">Proliferation of "Shadow AI" & Denial of Wallet</div>
          <p class="card-text">Unregulated external API calls, timing-vulnerable token checks (<code>C05.3</code>), over-privileged service accounts (<code>C05.2</code>), missing Anti-DoW token budgets (<code>C11.1</code>), and exposed logit probabilities (<code>C11.4</code>).</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • AI Risk Assessment</span>
      <span>Source: OWASP GenAI Security Project (AI-SVS v1.0) & ISO/IEC 42001:2023</span>
    </div>
  </div>

  <!-- SLIDE 8: COMPLIANCE MATRIX -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Governance & Standards</span>
      </div>
      <span class="slide-num">08 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Compliance Matrix</span>
      <h2 class="slide-title">Multi-Standard Framework Support & ISO/IEC 42001 AIMS</h2>
      <p class="slide-subtitle">Simultaneous evaluation across global technical security standards, management systems, and regional privacy statutes.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 20%;">Standard / Framework</th>
            <th style="width: 24%;">Technical & Governance Scope</th>
            <th style="width: 40%;">Key Controls Verified & Enforced by AegisAI</th>
            <th style="width: 16%;">Assurance Level</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #60a5fa;">OWASP AI-SVS v1.0</strong></td>
            <td>AI Security Verification Standard (12 Chapters)</td>
            <td><code>C01.4</code> SHA-256 Manifest, <code>C02.10</code> Crescendo Guard, <code>C04.1</code> Read-Only Container, <code>C04.3</code> Cloud IAP & SSRF Block, <code>C05.2–C05.4</code> Constant-Time Auth & IAM, <code>C08.1/C08.4</code> RAG ACLs, <code>C09.4</code> Sagas, <code>C10.1–C10.5</code> MCP Security, <code>C11.1/C11.4</code> Anti-DoW & Logprobs Off, <code>C12.2</code> SIEM Alerts.</td>
            <td><span class="pill pill-green">L1 / L2 / L3 Ready</span></td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">ISO/IEC 42001:2023</strong></td>
            <td>AI Management System (AIMS Clauses 4–10 & Annex A)</td>
            <td><code>Clause 4.1/4.2</code> Context & Stakeholders, <code>Clause 5/A.2.1/A.2.3</code> Corporate AI Policy, <code>Clause 7/A.3.3</code> Competency & Whistleblowing, <code>A.4.1</code> AI Asset Inventory, <code>A.5.1–A.5.3</code> Impact Assessment & Human Appeal, <code>Clause 9</code> KPIs & Internal Audit, <code>A.9.1/A.9.2</code> Acceptable Use.</td>
            <td><span class="pill pill-green">Certification Ready</span></td>
          </tr>
          <tr>
            <td><strong style="color: #34d399;">Mexican Regulatory (2026)</strong></td>
            <td>Consumer Protection (LFPC) & Personal Data (LFPDPPP)</td>
            <td>Algorithmic transparency, deceptive commercial pattern prevention, Art. 56 5-day cooling-off retraction, ARCO cascading deletion, and DLP PII masking.</td>
            <td><span class="pill pill-blue">Regional Statutory</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">BYOF Custom Framework</strong></td>
            <td><em>Bring Your Own Framework</em> (Multi-Tenant)</td>
            <td>Admin-authenticated ingestion (<code>C05.3</code>) with SHA-256 integrity checks (<code>C01.4</code>) and pre-retrieval tenant domain ACL filtering (<code>allowedDomains</code>, <code>C08.1</code>).</td>
            <td><span class="pill pill-amber">Tenant Isolated</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card" style="margin-top: 10px; background: rgba(30, 41, 59, 0.45);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Unified Cross-Framework Map-Reduce:</strong> Evaluates 103+ combined OWASP AI-SVS & ISO/IEC 42001 controls in parallel batches using constrained chapter ID enums so ISO Clauses 9/10 and Annex A.9/A.10 never collide with OWASP C09/C10.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Frameworks & Compliance Engine</span>
      <span>Aligned with OWASP AI-SVS v1.0, ISO/IEC 42001:2023, NIST AI RMF & EU AI Act</span>
    </div>
  </div>

  <!-- SLIDE 9: TECHNICAL ARCHITECTURE -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">System Engineering</span>
      </div>
      <span class="slide-num">09 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Software Architecture</span>
      <h2 class="slide-title">4-Layer Zero-Trust & Defense-in-Depth Architecture</h2>
      <p class="slide-subtitle">Hardened serverless architecture deployed on Google Cloud Run behind Identity-Aware Proxy (IAP) with keyless Vertex AI inference.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4">
        <div class="card">
          <div class="card-title" style="color: #38bdf8;">1. Perimeter & SPA</div>
          <p class="card-text">
            • <strong>Cloud IAP</strong> (<code>--no-allow-unauthenticated</code>)<br>
            • <strong>React 19 + TS + Vite</strong><br>
            • Firebase Auth OAuth 2.0 domain allowlist (<code>google.com</code>, <code>altostrat.com</code>)<br>
            • Embedded ISO 42001 Policy, Appeal (<code>A.5.2</code>) & Whistleblowing (<code>A.3.3</code>) UI
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #60a5fa;">2. Hardened API Layer</div>
          <p class="card-text">
            • <strong>Read-Only Container</strong> (<code>chmod -R a-w /app</code>, <code>C04.1</code>)<br>
            • Constant-time token check (<code>crypto.timingSafeEqual</code>, <code>C05.3</code>)<br>
            • Firebase Admin <code>verifyIdToken()</code><br>
            • DNS Rebinding Guard (<code>C10.5</code>) & MCP Signature Verifier (<code>C10.1</code>)<br>
            • Anti-DoW Quotas (<code>C11.1</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #34d399;">3. AI Engine & Guardrails</div>
          <p class="card-text">
            • <strong>Vertex AI</strong> (<code>gemini-3.8-flash</code>) via keyless ADC<br>
            • Least-privilege SA (<code>aegis-runner-sa</code>: zero <code>roles/viewer</code>, <code>C05.2</code>)<br>
            • Multi-Turn Crescendo Detector (<code>C02.10</code>)<br>
            • <code>responseLogprobs: false</code> (<code>C11.4</code>)<br>
            • Outbound SSRF/IMDS Block (<code>C04.3</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #a78bfa;">4. Data, Integrity & Sagas</div>
          <p class="card-text">
            • <strong>Cloud Firestore</strong> (<code>aegis-ai-db</code>) via Admin SDK<br>
            • 308/308 tested <code>firestore.rules</code><br>
            • Immutable audits (<code>allow delete: if false</code>) & <code>ownerUid</code> ACLs (<code>C05.4</code>)<br>
            • SHA-256 Manifest (<code>C01.4</code>)<br>
            • Compensating Sagas (<code>C09.4</code>)
          </p>
        </div>
      </div>

      <div class="card card-highlight" style="margin-top: 12px;">
        <div class="card-title" style="font-size: 9.5pt; color: #93c5fd;">Zero-Trust Isolation & Structured Security Alerting (C12.2):</div>
        <p class="card-text" style="font-size: 8pt;">
          Runtime state writes exclusively to Firestore (<code>system_config/admin_settings</code>) and ephemeral <code>/tmp/aegis-runtime-cache</code>. Every security event (prompt injection escalation, SSRF block, token mismatch, DoW quota breach, saga rollback) emits a structured JSON alert (<code>aegis-security-alerting-c12-2</code>) to Google Cloud Logging.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • C4 Container & Security Architecture</span>
      <span>Deployed on Google Cloud Run (Revision aegis-ai-00009-gk6)</span>
    </div>
  </div>

  <!-- SLIDE 10: PRACTICAL WORKFLOW -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Operational Flow</span>
      </div>
      <span class="slide-num">10 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Operational Execution</span>
      <h2 class="slide-title">The Auditor's Workflow: From Ingestion to 100% Hardening</h2>
      <p class="slide-subtitle">Six-stage deterministic assurance lifecycle with built-in human oversight and automated code remediation.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 14px;">
        <div style="display: flex; flex-direction: column; gap: 9px;">
          <div class="step-box">
            <div class="step-number">1</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Authenticated Ingestion & Pre-Flight Guardrails</strong>
              <p class="card-text">Corporate user (verified via Cloud IAP + Firebase ID Token) uploads PDFs/ZIPs/specs; <code>inspectPromptAndTrackSession</code> (<code>C02.10</code>) and DLP masking sanitize input.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">2</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">SHA-256 Verified & Tenant-Filtered Context</strong>
              <p class="card-text">Normative snapshots verified against <code>integrity-manifest.json</code> (<code>C01.4</code>) and custom frameworks filtered by <code>tenantDomain</code> (<code>C08.1</code>) are loaded.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">3</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Deterministic Vertex AI Map-Reduce Evaluation</strong>
              <p class="card-text"><code>gemini-3.8-flash</code> (<code>temperature: 0.0</code>, <code>responseLogprobs: false</code>, 180s timeout) evaluates each batch under strict chapter enum schemas.</p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 9px;">
          <div class="step-box">
            <div class="step-number" style="background: #10b981;">4</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Executive Dashboard & Human Appeal (ISO A.5.2)</strong>
              <p class="card-text">Interactive radar charts, L1/L2/L3 maturity breakdown, and direct Verdict Appeal / Human Review workflow (<code>ai-appeals@aegisai.enterprise</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">5</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">100% Remediated Architecture & Full Cookbook</strong>
              <p class="card-text">Synthesizes Section 3 drop-in architecture + Section 4 Cookbook for all <code>1..N</code> findings with accurate syntax tags (<code>typescript</code>, <code>hcl</code>, <code>yaml</code>, <code>python</code>, <code>bash</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">6</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Immutable Persistence & Compensating Saga</strong>
              <p class="card-text">Saved to Firestore with <code>ownerUid</code>/<code>tenantDomain</code> attribution (<code>C05.4</code>), <code>runCompensatingSaga</code> rollback safety (<code>C09.4</code>), and AIMS KPI recording (<code>C08.4</code>).</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • 6-Stage Assurance Lifecycle</span>
      <span>Full multi-standard OWASP AI-SVS + ISO/IEC 42001 traceability</span>
    </div>
  </div>

  <!-- SLIDE 11: OWASP AI-SVS & ISO 42001 DEFENSE-IN-DEPTH MATRIX -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Defense-in-Depth Matrix</span>
      </div>
      <span class="slide-num">11 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">End-to-End Remediation Traceability</span>
      <h2 class="slide-title">OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 Controls Enforced</h2>
      <p class="slide-subtitle">Comprehensive architectural and governance controls implemented across code, container, cloud perimeter, and AIMS policies.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;">OWASP AI-SVS v1.0 Technical Controls (17 Hardened Domains)</div>
          <p class="card-text" style="font-size: 7.8pt; line-height: 1.45;">
            • <strong>C01.4 Normative Integrity:</strong> <code>verifyNormativeSnapshotsIntegrity()</code> SHA-256 manifest check at startup.<br>
            • <strong>C02.10 Crescendo Defense:</strong> <code>inspectPromptAndTrackSession()</code> multi-turn escalation blocker (HTTP 422).<br>
            • <strong>C04.1 & C04.3 Infrastructure:</strong> Read-only <code>/app</code> (<code>chmod -R a-w</code>), Cloud IAP, VPC egress & <code>validateOutboundEndpoint()</code> SSRF/IMDS block.<br>
            • <strong>C05.2, C05.3 & C05.4 Auth/IAM:</strong> Pruned <code>roles/viewer</code> on <code>aegis-runner-sa</code>, <code>crypto.timingSafeEqual</code>, Firebase ID token verification & Firestore <code>ownerUid</code> ACLs.<br>
            • <strong>C08.1 & C08.4 RAG/Grounding:</strong> Tenant domain ACL pre-filtering & continuous grounding telemetry.<br>
            • <strong>C09.4 & C10.1–C10.5 Agents/MCP:</strong> <code>runCompensatingSaga()</code> rollback, MCP Ed25519/HMAC manifest verification, OAuth 2.1 PKCE & <code>dnsRebindingGuard</code>.<br>
            • <strong>C11.1, C11.4 & C12.2 FinOps/SIEM:</strong> <code>acquireAntiDoWQuota()</code>, <code>responseLogprobs: false</code> & <code>emitSecurityAlert()</code>.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #a78bfa;">ISO/IEC 42001:2023 AIMS Governance Controls (18 Clauses & Annex A)</div>
          <p class="card-text" style="font-size: 7.8pt; line-height: 1.45;">
            • <strong>Clause 4.1 & 4.2 Context & Stakeholders:</strong> Formal internal/external issue matrix, societal role as AI assurance provider & stakeholder mapping.<br>
            • <strong>Clause 5.1, 5.2, A.2.1 & A.2.3 Leadership & AI Policy:</strong> Executive-approved Corporate AI Policy with annual revision cycle.<br>
            • <strong>Clause 7.2, 7.3 & A.3.3 Competency & Whistleblowing:</strong> Mandatory role training & confidential ethics reporting (<code>ai-ethics-whistleblower@aegisai.enterprise</code>).<br>
            • <strong>A.4.1 Resource & Tooling Inventory:</strong> Cataloged models, normative corpora, runtime SAs & KMS secrets.<br>
            • <strong>A.5.1, A.5.2 & A.5.3 Impact Assessment & Appeals:</strong> Formal AIIA methodology, quantitative risk thresholds & human appeal channel (<code>ai-appeals@aegisai.enterprise</code>).<br>
            • <strong>Clause 9.1–9.3 & A.9.1/A.9.2 Assurance & Use:</strong> Continuous KPIs, semi-annual internal audits, management review & acceptable use notices.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Complete OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 Traceability</span>
      <span>Documented in Manual 2 (Architecture), Manual 3 (Admin), Manual 4/6 (Deployment) & Manual 8 (ISO 42001 AIMS)</span>
    </div>
  </div>

  <!-- SLIDE 12: ROADMAP -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Strategic Vision</span>
      </div>
      <span class="slide-num">12 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolution & Roadmap</span>
      <h2 class="slide-title">Next Horizons in AegisAI Platform Engineering</h2>
      <p class="slide-subtitle">Our forward-looking roadmap following our Release Candidate presentations to Farmacias del Ahorro, AMF, and Grupo Coppel.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 8px;">Q4 2026 • Near Term</div>
          <div class="card-title" style="color: #38bdf8;">Native CI/CD Shift-Left Gates</div>
          <p class="card-text">
            Official <strong>GitHub Actions</strong> and <strong>GitLab CI Runners</strong> to automatically block pull requests introducing prompt injection vulnerabilities, unsigned MCP manifests, or unencrypted vector storage before merging.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-green" style="margin-bottom: 8px;">Q1 2027 • Medium Term</div>
          <div class="card-title" style="color: #34d399;">Multi-Agent Graph Auditing</div>
          <p class="card-text">
            Specialized auditing module for complex autonomous agent workflows (LangGraph, CrewAI, AutoGen): tool authorization boundary checks, compensating saga verification, and inter-agent memory sandboxing.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-amber" style="margin-bottom: 8px;">Q2 2027 • Long Term</div>
          <div class="card-title" style="color: #fcd34d;">Autonomous IaC Remediation</div>
          <p class="card-text">
            One-click automated synthesis of <strong>Terraform Modules</strong> and <strong>Helm Charts</strong> that directly apply Cloud IAP, VPC Service Controls, and Cloud Armor remediation recipes to cloud clusters.
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.5); border-color: rgba(59, 130, 246, 0.4);">
        <div class="card-title" style="color: #ffffff; font-size: 10pt;">
          <span>🎯</span> Conclusion: Enterprise AI Assurance Built for $215.24 Multi-Model, Auditing for $0.43–$1.55 (Batch: $0.21)
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          By combining <strong>Gemini 3.6 &amp; 3.8 Flash (80%)</strong> for rapid PoC and bulk construction with <strong>Gemini 3.1 Pro (5%)</strong> for architecture and <strong>Gemini 4.0 Argon (10%) + Claude Opus 5.5 Max (5%)</strong> for deep hardening &amp; QA, AegisAI was built at <strong>88.9% lower cost than all-Opus ($1,931)</strong> and <strong>99.77% lower cost than traditional staffing (~$95k)</strong>.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Strategic Vision 2026-2027</span>
      <span>Contact: opensource@aegis-ai.dev • GitHub: github.com/fjhuerta-67/AegisAI</span>
    </div>
  </div>

</body>
</html>
"""

html_es = f"""<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AegisAI Enterprise — Evolución del Producto, Auto-Auditoría y Economía FinOps</title>
  <style>{css}</style>
</head>
<body>

  <!-- SLIDE 1: PORTADA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Caso de Estudio de Ingeniería y FinOps</span>
      </div>
      <span class="slide-num">01 / 12</span>
    </div>

    <div class="cover-container">
      <div class="pill pill-blue" style="font-size: 8.2pt; padding: 4px 12px; margin-bottom: 8px;">
        De PoC en Google AI Studio a Release Candidate en Antigravity
      </div>
      <h1 class="cover-title-big">
        Aseguramiento, Auto-Auditoría y<br><span>Economía FinOps en GenAI</span>
      </h1>
      <p class="cover-desc-big">
        Cómo <strong>AegisAI Enterprise</strong> fue prototipado en <strong>Google AI Studio (Gemini 3.6 Flash)</strong>, diseñado con <strong>Gemini 3.1 Pro (5%)</strong>, construido a escala en <strong>Google Antigravity (Gemini 3.8 Flash — 80% combinado en Flash)</strong>, auto-auditado (68.9% ➔ 97.8%), endurecido y verificado en QA con <strong>Gemini 4.0 Argon (10%)</strong> y <strong>Claude Opus 5.5 Max (5%)</strong>, y presentado como Release Candidate ante <strong>Farmacias del Ahorro</strong>, <strong>Asociación Mexicana de Franquicias</strong> y <strong>Grupo Coppel</strong>—con una inversión total de <strong>$215.24 USD</strong> ($319.80 c/ bucles agénticos).
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">1. PoC en AI Studio (Gemini 3.6 Flash)</span>
        <span class="pill pill-blue">2. Arq. (3.1 Pro 5%) + Construcción (3.8 Flash 74%)</span>
        <span class="pill pill-green">3. Hardening y QA (4.0 Argon 10% + Opus 5.5 5%)</span>
        <span class="pill pill-purple">4. RC: Farmacias del Ahorro • AMF • Coppel</span>
        <span class="pill pill-amber">5. Costo por Auditoría: $0.43–$1.55 (Batch: $0.21) vs $8.55–$31.09</span>
        <span class="pill pill-green">6. Costo Total de Creación: $215.24 USD</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise v2.5 • Presentación Ejecutiva y FinOps</span>
      <span>Google Cloud Run • Vertex AI • Cloud Firestore • Identity-Aware Proxy</span>
      <span>Octubre 2026</span>
    </div>
  </div>

  <!-- SLIDE 2: EVOLUCIÓN EN 4 ETAPAS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Evolución del Producto</span>
      </div>
      <span class="slide-num">02 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Ciclo de Vida de Ingeniería Multi-Modelo de Extremo a Extremo</span>
      <h2 class="slide-title">Cómo Construimos, Auto-Auditamos y Validamos AegisAI</h2>
      <p class="slide-subtitle">Un recorrido de ingeniería multi-modelo en cuatro etapas (80% Flash • 10% Argon • 5% 3.1 Pro • 5% Opus 5.5 Max).</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Fase 1 • Prueba de Concepto (~6% Tokens)</div>
          <div class="card-title" style="color: #38bdf8;">1. Prototipado en Google AI Studio (Gemini 3.6 Flash — $6.53)</div>
          <p class="card-text">
            • Se construyó la Prueba de Concepto inicial en <strong>Google AI Studio</strong> utilizando <strong>Gemini 3.6 Flash</strong> (~45 iteraciones, 4.20M In / 0.90M Out tokens @ tarifa oficial $0.75/$3.75).<br>
            • Se validó la generación estructurada bajo JSON Schema, la ingesta multimodal de PDFs/diagramas y la interfaz inicial en React.<br>
            • Demostró que los modelos Flash con temperatura <code>0.0</code> evalúan controles complejos en segundos.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Fase 2 • Arquitectura (5%) y Construcción (74%)</div>
          <div class="card-title" style="color: #60a5fa;">2. Arquitectura en 3.1 Pro ($14.06) y Build en 3.8 Flash ($70.65)</div>
          <p class="card-text">
            • <strong>Arquitectura (Gemini 3.1 Pro, 5%):</strong> Diseño de topología Zero-Trust de 4 capas, motor Map-Reduce de 12 lotes, taxonomía de 265 controles y aislamiento Firestore (3.55M In / 0.58M Out @ $2.00/$12.00).<br>
            • <strong>Construcción Masiva (Gemini 3.8 Flash, 74%):</strong> Más de <strong>171 prompts</strong> en <strong>Google Antigravity</strong> construyendo Express/React 19, GCP Live Scanner, 17 manuales PDF ($65.85) y auto-auditorías en vivo ($4.80). Familia Flash = <strong>80% de tokens por $77.18</strong> ($38.59 Batch).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">Fase 3 • Auto-Auditoría, Hardening (10%) y QA (5%)</div>
          <div class="card-title" style="color: #34d399;">3. Auto-Auditado (68.9%➔97.8%) + Endurecido en Argon y Opus 5.5</div>
          <p class="card-text">
            • La auto-auditoría base (<code>MULTI-2026-0437</code>) sobre <code>Originaldocs.zip</code> obtuvo <strong>68.9%</strong> (35 brechas).<br>
            • <strong>Gemini 4.0 Argon (10%, $25.70):</strong> Vertex AI ADC sin llaves, perímetro Cloud IAP, 308 pruebas Firestore y diagramas 4K/8K (7.10M In / 1.15M Out @ $2.00/$10.00).<br>
            • <strong>Claude Opus 5.5 Max (5%, $96.45):</strong> Revisión red-team adversarial, auth en tiempo constante, filtros SSRF/DNS y QA ➔ <strong>97.8%</strong> (<code>MULTI-2026-8983</code>, 0 fallos).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-purple" style="margin-bottom: 6px;">Fase 4 • Validación Empresarial</div>
          <div class="card-title" style="color: #d8b4fe;">4. Presentación de Release Candidate (RC) a Líderes en México</div>
          <p class="card-text">
            • Presentamos el Release Candidate (RC) endurecido ante tres organizaciones líderes:<br>
            &nbsp;&nbsp;1. <strong>Farmacias del Ahorro</strong> (Salud y Retail Farmacéutico)<br>
            &nbsp;&nbsp;2. <strong>Asociación Mexicana de Franquicias (AMF)</strong> (Ecosistema de Franquicias)<br>
            &nbsp;&nbsp;3. <strong>Grupo Coppel</strong> (Servicios Financieros y Retail Omnicanal)<br>
            • Se validó el cumplimiento simultáneo de OWASP AI-SVS, ISO 42001, LFPC y LFPDPPP.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Evolución Multi-Modelo en 4 Etapas</span>
      <span>3.6 Flash (PoC) ➔ 3.1 Pro (Arq.) + 3.8 Flash (Build) ➔ 4.0 Argon + Opus 5.5 Max (Hardening y QA) ➔ RC</span>
    </div>
  </div>

  <!-- SLIDE 3: AUTO-AUDITORÍA (DOGFOODING) -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Caso de Auto-Auditoría</span>
      </div>
      <span class="slide-num">03 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Verificación en Bucle Cerrado ("Dogfooding")</span>
      <h2 class="slide-title">Auditando el Código y Manuales de AegisAI con AegisAI</h2>
      <p class="slide-subtitle">Cómo AegisAI diagnosticó 35 brechas de OWASP AI-SVS e ISO 42001 en su propio prototipo y guió su remediación hasta 97.8%.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#f87171;">1. Auto-Auditoría Base</span> (<code>MULTI-2026-0437</code>)</div>
          <p class="card-text">
            • <strong>Puntaje Global:</strong> <strong style="color:#fca5a5;">68.9% (Nivel L2)</strong><br>
            • <strong>OWASP AI-SVS v1.0:</strong> 71.8% (17 brechas)<br>
            • <strong>ISO/IEC 42001:2023:</strong> 66.7% (18 brechas)<br>
            • <strong>Hallazgos Detectados por AegisAI:</strong><br>
            &nbsp;&nbsp;– Directorio <code>/app/config</code> escribible (<code>C04.1</code>)<br>
            &nbsp;&nbsp;– Comparación <code>===</code> vulnerable a timing (<code>C05.3</code>)<br>
            &nbsp;&nbsp;– Rol <code>roles/viewer</code> en SA de ejecución (<code>C05.2</code>)<br>
            &nbsp;&nbsp;– Falta de manifiesto SHA-256 (<code>C01.4</code>)<br>
            &nbsp;&nbsp;– Falta de Manual AIMS ISO 42001 y canal ético
          </p>
        </div>

        <div class="card card-highlight">
          <div class="card-title"><span style="color:#60a5fa;">2. Remediación Integral en Antigravity</span></div>
          <p class="card-text">
            • <strong>Generador:</strong> Recetario Sección 4 sin truncar (los 35 parches completos), corte por oración completa y detección precisa de lenguaje.<br>
            • <strong>Contenedor y Cloud:</strong> <code>chmod -R a-w /app</code> (<code>C04.1</code>), Cloud IAP + bloqueo SSRF/IMDS (<code>C04.3</code>), revocación de <code>roles/viewer</code> (<code>C05.2</code>).<br>
            • <strong>Guardrails:</strong> Manifiesto SHA-256 (<code>C01.4</code>), detector crescendo (<code>C02.10</code>), <code>crypto.timingSafeEqual</code> (<code>C05.3</code>), cuotas Anti-DoW (<code>C11.1</code>), sagas (<code>C09.4</code>).<br>
            • <strong>Manuales y Reglas:</strong> Manual 8 AIMS ISO 42001 y 308/308 pruebas de reglas Firestore aprobadas.
          </p>
        </div>

        <div class="card card-emerald">
          <div class="card-title"><span style="color:#34d399;">3. Re-Auditoría Post-Fix</span> (<code>MULTI-2026-8983</code>)</div>
          <p class="card-text">
            • <strong>Puntaje Global:</strong> <strong style="color:#6ee7b7;">97.8% (+28.9 pts)</strong><br>
            • <strong>ISO/IEC 42001:2023:</strong> <strong style="color:#6ee7b7;">100.0%</strong> (54/54 controles aprobados, <strong>0 Fallidos</strong>)<br>
            • <strong>OWASP AI-SVS v1.0:</strong> <strong style="color:#6ee7b7;">94.7%</strong> (45/49 aprobados, <strong>0 Fallidos</strong>)<br>
            • <strong>Telemetría Real en Firestore:</strong><br>
            &nbsp;&nbsp;– Modelo: <code>gemini-3.8-flash</code> en Vertex AI<br>
            &nbsp;&nbsp;– Tokens de Entrada: <code>1,758,724</code><br>
            &nbsp;&nbsp;– Tokens de Salida: <code>100,715</code><br>
            &nbsp;&nbsp;– Cero controles fallidos restantes
          </p>
        </div>
      </div>

      <div class="card" style="background: rgba(30, 41, 59, 0.5);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Valor del Bucle de Auto-Auditoría:</strong> Ejecutar AegisAI contra su propia documentación demostró que el motor no alucina aprobaciones: detectó vulnerabilidades sutiles de código y gobernanza, generó las recetas de corrección y certificó el 97.8% tras aplicar los cambios.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Verificación de Auto-Auditoría en Bucle Cerrado</span>
      <span>IDs en Firestore: MULTI-2026-0437 (Base 68.9%) ➔ MULTI-2026-8983 (Remediada 97.8%)</span>
    </div>
  </div>

  <!-- SLIDE 4: PRESENTACIÓN RC A CLIENTES -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Release Candidate Empresarial</span>
      </div>
      <span class="slide-num">04 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Validación de Mercado y Roadshow Ejecutivo</span>
      <h2 class="slide-title">Presentación del Release Candidate (RC) a Líderes en México</h2>
      <p class="slide-subtitle">Tras completar el endurecimiento por auto-auditoría, presentamos el Release Candidate ante tres organizaciones estratégicas.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3" style="margin-bottom: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Salud y Retail Farmacéutico</div>
          <div class="card-title" style="color: #60a5fa;">Farmacias del Ahorro</div>
          <p class="card-text">
            • <strong>Enfoque del Caso de Uso:</strong> Auditoría de asistentes digitales farmacéuticos, orientación clínica y atención omnicanal con IA.<br>
            • <strong>Capacidades Clave Demostradas:</strong><br>
            &nbsp;&nbsp;– Protección estricta de datos sensibles de salud/PII bajo la <strong>LFPDPPP</strong> y enmascaramiento DLP pre-inferencia.<br>
            &nbsp;&nbsp;– Mitigación de alucinaciones (<code>temperature: 0.0</code>) y escalamiento a revisión humana (<code>ISO 42001 A.5.2</code>).<br>
            &nbsp;&nbsp;– Telemetría continua de citación y anclaje RAG (<code>C08.4</code>) en Vertex AI.
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">Ecosistema Nacional de Franquicias</div>
          <div class="card-title" style="color: #34d399;">Asociación Mexicana de Franquicias</div>
          <p class="card-text">
            • <strong>Enfoque del Caso de Uso:</strong> Estandarización de gobernanza de IA, chatbots comerciales y publicidad automatizada en redes de franquicias.<br>
            • <strong>Capacidades Clave Demostradas:</strong><br>
            &nbsp;&nbsp;– Cumplimiento <strong>LFPC (Profeco 2026)</strong>: prevención de patrones oscuros y retracto comercial de 5 días (Art. 56).<br>
            &nbsp;&nbsp;– <strong>Motor BYOF:</strong> Marcos normativos propios para franquicias con auditorías Flash de bajo costo (<code>$0.43 USD</code> estándar o <code>$0.21 USD</code> en Batch).
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-purple" style="margin-bottom: 6px;">Servicios Financieros y Retail</div>
          <div class="card-title" style="color: #d8b4fe;">Grupo Coppel</div>
          <p class="card-text">
            • <strong>Enfoque del Caso de Uso:</strong> Modelos de riesgo crediticio, prevención de fraude transaccional y gobernanza corporativa de GenAI a gran escala.<br>
            • <strong>Capacidades Clave Demostradas:</strong><br>
            &nbsp;&nbsp;– Certificación simultánea <strong>OWASP AI-SVS v1.0 (Nivel L2/L3) + ISO/IEC 42001:2023</strong>.<br>
            &nbsp;&nbsp;– Aislamiento multi-inquilino por dominio (<code>C05.4</code>, <code>C08.1</code>), borde Cloud IAP Zero-Trust y <strong>GCP Live Scanner</strong> sin llaves.<br>
            &nbsp;&nbsp;– Generación de arquitectura remediada y recetario Terraform/TypeScript.
          </p>
        </div>
      </div>

      <div class="card" style="background: rgba(30, 41, 59, 0.45);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Impacto en las Presentaciones RC:</strong> Los comités directivos destacaron la capacidad única de AegisAI para unificar <strong>estándares globales (OWASP AI-SVS + ISO 42001)</strong> con <strong>legislación mexicana (LFPDPPP + LFPC)</strong> entregando código listo para producción en minutos.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Roadshow Ejecutivo del Release Candidate (RC)</span>
      <span>Validado con Farmacias del Ahorro • Asociación Mexicana de Franquicias • Grupo Coppel</span>
    </div>
  </div>

  <!-- SLIDE 5: ECONOMÍA UNITARIA POR AUDITORÍA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Economía Unitaria y Benchmark de Modelos</span>
      </div>
      <span class="slide-num">05 / 12</span>
    </div>

    <div class="title-block" style="margin-bottom: 5px;">
      <span class="slide-category">Análisis FinOps: Costo por Auditoría Completa OWASP AI-SVS + ISO/IEC 42001</span>
      <h2 class="slide-title">Gemini (3.8 Flash, 4.0 Argon, 3.1 Pro) vs. Claude (Fable 5.1, Opus 5.5)</h2>
      <p class="slide-subtitle">Calculado con telemetría real de tokens en Firestore bajo Tarifas Oficiales 2026 por auditoría dual completa.</p>
    </div>

    <div class="slide-body" style="justify-content: flex-start;">
      <!-- Top Executive KPI Hero Strip -->
      <div class="finops-kpi-strip">
        <div class="finops-kpi-card finops-kpi-green">
          <div>
            <div style="font-size:6.5pt; color:#6ee7b7; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Auditoría Estándar (3.8 Flash)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#34d399; line-height:1.1;">$0.43 <span style="font-size:8.5pt; font-weight:600; color:#a7f3d0;">USD</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;">Nivel Batch/Flex: <strong style="color:#6ee7b7;">$0.21 USD</strong></div>
          </div>
          <span class="pill pill-green" style="font-size:6.2pt;">1.0x BASE</span>
        </div>

        <div class="finops-kpi-card finops-kpi-sky">
          <div>
            <div style="font-size:6.5pt; color:#7dd3fc; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Suite 10 PDFs (3.8 Flash)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#38bdf8; line-height:1.1;">$1.55 <span style="font-size:8.5pt; font-weight:600; color:#bae6fd;">USD</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;">1.64M In + 86.5K Out (<strong style="color:#7dd3fc;">$0.78 Batch</strong>)</div>
          </div>
          <span class="pill pill-blue" style="font-size:6.2pt;">12 LOTES</span>
        </div>

        <div class="finops-kpi-card finops-kpi-amber">
          <div>
            <div style="font-size:6.5pt; color:#fcd34d; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Ventaja vs. Opus 5.5 Max</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#fbbf24; line-height:1.1;">20.0x <span style="font-size:8.5pt; font-weight:600; color:#fde68a;">Menor</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;"><strong style="color:#fcd34d;">40.0x</strong> vs Batch • <strong style="color:#fcd34d;">6.7x</strong> vs Opus Est.</div>
          </div>
          <span class="pill pill-amber" style="font-size:6.2pt;">VERIFICADO</span>
        </div>

        <div class="finops-kpi-card finops-kpi-purple">
          <div>
            <div style="font-size:6.5pt; color:#d8b4fe; font-weight:700; text-transform:uppercase; letter-spacing:0.6px;">Ahorro OpEx Mensual (1K Aud.)</div>
            <div style="font-family:'Google Sans',sans-serif; font-size:17pt; font-weight:800; color:#c084fc; line-height:1.1;">95.0% <span style="font-size:8.5pt; font-weight:600; color:#e9d5ff;">Ahorro</span></div>
            <div style="font-size:6.5pt; color:#94a3b8;"><strong style="color:#e9d5ff;">$428/mes</strong> vs. $8,550/mes (Opus Max)</div>
          </div>
          <span class="pill pill-purple" style="font-size:6.2pt;">-$8,122/MES</span>
        </div>
      </div>

      <!-- Main Visual Charts Grid -->
      <div class="finops-main-grid">
        <!-- LEFT PANEL: Horizontal Dual-Workload Bar Chart -->
        <div class="card" style="padding: 9px 12px; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <div>
              <div class="card-title" style="font-size:9.5pt; margin-bottom:1px; color:#f8fafc;">Benchmark de Costo por Auditoría y Multiplicador (USD)</div>
              <div style="font-size:6.7pt; color:#94a3b8;">Gráfica Dual: Auditoría Estándar (370K In / 40K Out) vs. Suite 10 PDFs (1.64M In / 86.5K Out)</div>
            </div>
            <div style="display:flex; gap:8px; font-size:6.4pt; font-weight:700;">
              <span style="display:flex; align-items:center; gap:4px; color:#e2e8f0;"><span style="width:9px; height:9px; border-radius:2px; background:#34d399; display:inline-block;"></span>Aud. Estándar</span>
              <span style="display:flex; align-items:center; gap:4px; color:#94a3b8;"><span style="width:9px; height:9px; border-radius:2px; background:rgba(56,189,248,0.45); border:1px solid #38bdf8; display:inline-block;"></span>Suite 10 PDFs</span>
            </div>
          </div>

          <!-- Row 1: Gemini 3.8 Flash -->
          <div class="hbar-row hbar-row-active">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#34d399; font-size:8.5pt;">Gemini 3.8 Flash</strong>
                <span class="pill pill-green" style="font-size:5.8pt; padding:1px 6px;">MOTOR BASE</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#a7f3d0;">$0.75 In / $3.75 Out</span>
              </div>
              <span class="pill pill-green" style="font-size:6.3pt;">1.0x Base</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 6.5%; background: linear-gradient(90deg, #059669, #34d399); box-shadow: 0 0 8px #10b981;"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 11.5%; background: rgba(52, 211, 153, 0.45); border-right: 2px solid #34d399;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#6ee7b7;">Est: $0.43 <span style="font-size:6.2pt; color:#a7f3d0;">(Batch $0.21)</span></div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#a7f3d0;">$1.55</strong> ($0.78)</div>
              </div>
            </div>
          </div>

          <!-- Row 2: Gemini 4.0 Argon -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#38bdf8; font-size:8.3pt;">Gemini 4.0 Argon</strong>
                <span class="pill pill-blue" style="font-size:5.8pt; padding:1px 6px;">FRONTIER</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$2.00 In / $10.00 Out</span>
              </div>
              <span class="pill pill-blue" style="font-size:6.3pt;">2.67x vs Flash</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 15.5%; background: linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 24.5%; background: rgba(56, 189, 248, 0.4); border-right: 2px solid #38bdf8;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#7dd3fc;">Est: $1.14 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#bae6fd;">$4.15 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 3: Gemini 3.1 Pro -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#60a5fa; font-size:8.3pt;">Gemini 3.1 Pro</strong>
                <span class="pill pill-blue" style="font-size:5.8pt; padding:1px 6px;">RAZONAMIENTO</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$2.00 In / $12.00 Out</span>
              </div>
              <span class="pill pill-blue" style="font-size:6.3pt;">2.78x – 2.85x</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 17%; background: linear-gradient(90deg, #2563eb, #60a5fa);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 26%; background: rgba(96, 165, 250, 0.4); border-right: 2px solid #60a5fa;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#93c5fd;">Est: $1.22 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#bfdbfe;">$4.32 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 4: Claude Fable 5.1 Medium -->
          <div class="hbar-row">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#fcd34d; font-size:8.3pt;">Claude Fable 5.1 Medium</strong>
                <span class="pill pill-amber" style="font-size:5.8pt; padding:1px 6px;">EXTERNO</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#94a3b8;">$3.00 In / $15.00 Out</span>
              </div>
              <span class="pill pill-amber" style="font-size:6.3pt;">4.0x (8.0x vs Batch)</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 24%; background: linear-gradient(90deg, #d97706, #fbbf24);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 36%; background: rgba(251, 191, 36, 0.4); border-right: 2px solid #fbbf24;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#fde68a;">Est: $1.71 USD</div>
                <div style="font-size:6.8pt; color:#94a3b8;">10-PDF: <strong style="color:#fef08a;">$6.22 USD</strong></div>
              </div>
            </div>
          </div>

          <!-- Row 5: Claude Opus 5.5 Max -->
          <div class="hbar-row" style="margin-bottom:0; border-color: rgba(239,68,68,0.35); background: rgba(127,29,29,0.14);">
            <div class="hbar-top">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="color:#f87171; font-size:8.3pt;">Claude Opus 5.5 Max</strong>
                <span class="pill pill-red" style="font-size:5.8pt; padding:1px 6px;">NIVEL MAX</span>
                <span style="font-family:'Roboto Mono',monospace; font-size:6.5pt; color:#fca5a5;">$15.00 / $75.00 <span style="color:#94a3b8;">(Est: $5/$25)</span></span>
              </div>
              <span class="pill pill-red" style="font-size:6.3pt;">20.0x (40x Batch / 6.7x Est)</span>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 158px; align-items:center; gap:8px;">
              <div>
                <div class="hbar-track">
                  <div class="hbar-fill" style="width: 68%; background: linear-gradient(90deg, #dc2626, #f87171);"></div>
                </div>
                <div class="hbar-track" style="height:6.5px; margin-bottom:0;">
                  <div class="hbar-fill" style="width: 100%; background: rgba(248, 113, 113, 0.5); border-right: 2px solid #ef4444;"></div>
                </div>
              </div>
              <div style="text-align:right; font-family:'Roboto Mono',monospace; line-height:1.25;">
                <div style="font-size:7.6pt; font-weight:700; color:#fca5a5;">Est: $8.55 <span style="font-size:6.2pt; color:#cbd5e1;">(Est $2.85)</span></div>
                <div style="font-size:6.8pt; color:#fca5a5;">10-PDF: <strong>$31.09</strong> ($10.36)</div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT PANEL: Vertical Column Chart + Firestore Telemetry Breakdown -->
        <div style="display:flex; flex-direction:column; gap:10px; justify-content:space-between;">
          <!-- Top Right Card: Vertical Column Chart (Monthly Spend @ 1,000 Audits) -->
          <div class="card" style="padding: 9px 12px; flex: 1; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div class="card-title" style="font-size:9.2pt; margin-bottom:1px; color:#f8fafc;">Gasto Mensual @ 1,000 Auditorías / Mes</div>
                <div style="font-size:6.6pt; color:#94a3b8;">Factura mensual de inferencia por 1,000 auditorías estándar multi-norma</div>
              </div>
              <span class="pill pill-green" style="font-size:6pt;">AHORRA $8,122 / MES</span>
            </div>

            <div class="vbar-chart">
              <!-- Col 1: 3.8 Flash Batch -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#6ee7b7;">$214</div>
                <div class="vbar-pillar" style="height: 8%; min-height: 7px; background: linear-gradient(180deg, #34d399, #059669); box-shadow: 0 0 8px rgba(16,185,129,0.5);"></div>
                <div class="vbar-lbl" style="color:#6ee7b7;">3.8 Flash<br><span style="font-size:5.6pt; color:#94a3b8;">(Batch)</span></div>
              </div>
              <!-- Col 2: 3.8 Flash Std -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#34d399;">$428</div>
                <div class="vbar-pillar" style="height: 14%; min-height: 12px; background: linear-gradient(180deg, #10b981, #047857); box-shadow: 0 0 8px rgba(16,185,129,0.4);"></div>
                <div class="vbar-lbl" style="color:#34d399;">3.8 Flash<br><span style="font-size:5.6pt; color:#94a3b8;">(Est.)</span></div>
              </div>
              <!-- Col 3: 4.0 Argon -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#7dd3fc;">$1,140</div>
                <div class="vbar-pillar" style="height: 27%; background: linear-gradient(180deg, #38bdf8, #0284c7);"></div>
                <div class="vbar-lbl">4.0 Argon<br><span style="font-size:5.6pt; color:#94a3b8;">(2.67x)</span></div>
              </div>
              <!-- Col 4: 3.1 Pro -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#93c5fd;">$1,220</div>
                <div class="vbar-pillar" style="height: 30%; background: linear-gradient(180deg, #60a5fa, #2563eb);"></div>
                <div class="vbar-lbl">3.1 Pro<br><span style="font-size:5.6pt; color:#94a3b8;">(2.85x)</span></div>
              </div>
              <!-- Col 5: Fable 5.1 -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fde68a;">$1,710</div>
                <div class="vbar-pillar" style="height: 40%; background: linear-gradient(180deg, #fbbf24, #d97706);"></div>
                <div class="vbar-lbl">Fable 5.1<br><span style="font-size:5.6pt; color:#94a3b8;">(4.0x)</span></div>
              </div>
              <!-- Col 6: Opus 5.5 Std -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fdba74;">$2,850</div>
                <div class="vbar-pillar" style="height: 56%; background: linear-gradient(180deg, #fb923c, #ea580c);"></div>
                <div class="vbar-lbl">Opus 5.5<br><span style="font-size:5.6pt; color:#94a3b8;">(Est 6.7x)</span></div>
              </div>
              <!-- Col 7: Opus 5.5 Max -->
              <div class="vbar-col">
                <div class="vbar-val" style="color:#fca5a5;">$8,550</div>
                <div class="vbar-pillar" style="height: 92%; background: linear-gradient(180deg, #f87171, #b91c1c); box-shadow: 0 0 10px rgba(239,68,68,0.4);"></div>
                <div class="vbar-lbl" style="color:#fca5a5;">Opus Max<br><span style="font-size:5.6pt; color:#fca5a5;">(20.0x)</span></div>
              </div>
            </div>
          </div>

          <!-- Bottom Right Card: Firestore Token Telemetry Composition -->
          <div class="card card-emerald" style="padding: 9px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
              <div class="card-title" style="font-size:8.8pt; margin-bottom:0; color:#6ee7b7;">Telemetría Real de Tokens (Cloud Firestore)</div>
              <span style="font-family:'Roboto Mono',monospace; font-size:6.2pt; color:#a7f3d0;">15 Llamadas Map-Reduce / Aud.</span>
            </div>

            <!-- Profile A Segmented Bar -->
            <div style="margin-bottom:6px;">
              <div style="display:flex; justify-content:space-between; font-size:6.7pt; margin-bottom:2px;">
                <span style="color:#e2e8f0; font-weight:700;">Perfil A: Auditoría Estándar de Arquitectura (408.6K tok)</span>
                <span style="font-family:'Roboto Mono',monospace; color:#6ee7b7;">90.3% In / 9.7% Out</span>
              </div>
              <div style="display:flex; height:8px; border-radius:999px; overflow:hidden; background:#1e293b;">
                <div style="width:90.3%; background:linear-gradient(90deg, #059669, #34d399);"></div>
                <div style="width:9.7%; background:#f59e0b;"></div>
              </div>
              <div style="font-size:6.2pt; color:#94a3b8; margin-top:2px;">
                Auditorías <code>MULTI-2026-0507</code> y <code>1250</code>: Promedio <code>368,827</code> Entrada + <code>39,812</code> Salida
              </div>
            </div>

            <!-- Profile B Segmented Bar -->
            <div>
              <div style="display:flex; justify-content:space-between; font-size:6.7pt; margin-bottom:2px;">
                <span style="color:#e2e8f0; font-weight:700;">Perfil B: Suite Completa 10 PDFs (1.725M tok)</span>
                <span style="font-family:'Roboto Mono',monospace; color:#38bdf8;">95.0% In / 5.0% Out</span>
              </div>
              <div style="display:flex; height:8px; border-radius:999px; overflow:hidden; background:#1e293b;">
                <div style="width:95.0%; background:linear-gradient(90deg, #0284c7, #38bdf8);"></div>
                <div style="width:5.0%; background:#f59e0b;"></div>
              </div>
              <div style="font-size:6.2pt; color:#94a3b8; margin-top:2px;">
                Auditorías <code>MULTI-2026-0437</code> y <code>8983</code>: Promedio <code>1,638,410</code> Entrada + <code>86,495</code> Salida (~136K ctx/lote)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Economía Unitaria y Comparativa de Modelos (Tarifas Oficiales 2026)</span>
      <span>Fuente de Telemetría: Cloud Firestore (aegis-ai-db) Auditorías MULTI-2026-0437, 8983, 0507 y 1250</span>
    </div>
  </div>

  <!-- SLIDE 6: COSTO TOTAL DE CREACIÓN DE AEGIS AI -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Costo Total de Creación (TCO)</span>
      </div>
      <span class="slide-num">06 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">ROI de Ingeniería y Desglose Multi-Modelo (80% Flash • 10% Argon • 5% Pro • 5% Opus)</span>
      <h2 class="slide-title">Cuánto Dinero Gastamos Creando AegisAI: $215.24 USD en Total</h2>
      <p class="slide-subtitle">Ingeniería multi-modelo optimizada entre PoC en AI Studio, Arquitectura de Sistema, Construcción Full-Stack, Hardening y QA Adversarial.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 10px;">
        <div class="card stat-box card-emerald">
          <div class="stat-number" style="color: #34d399;">$215.24</div>
          <div class="stat-label"><strong>Inversión Total Realizada</strong> creando AegisAI ($319.80 c/ bucles agénticos)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">~71.0M</div>
          <div class="stat-label">Tokens de Entrada Totales (<strong>80% Flash</strong> por $77.18 • 10% Argon • 5% Pro • 5% Opus)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">$1,931</div>
          <div class="stat-label">Lo que cuesta el mismo volumen si se ejecuta <strong>100% en Claude Opus 5.5 Max</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #fcd34d;">~$95,000</div>
          <div class="stat-label">Costo equivalente de desarrollo tradicional (4 ingenieros DevSecOps × 3 meses)</div>
        </div>
      </div>

      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 24%;">Fase y Rol en el Ciclo</th>
            <th style="width: 24%;">Modelo y Participación</th>
            <th style="width: 24%;">Alcance de Ingeniería y Tokens</th>
            <th style="width: 14%;">Gasto Real (2026)</th>
            <th style="width: 14%;">Si 100% Opus 5.5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. PoC Rápido y Esquemas JSON</strong></td>
            <td>AI Studio • <code>Gemini 3.6 Flash</code> (~6%)</td>
            <td>~45 iteraciones PoC, JSON schema y PDFs • 4.20M In / 0.90M Out</td>
            <td><strong style="color:#6ee7b7;">$6.53 USD</strong></td>
            <td>$130.50 USD</td>
          </tr>
          <tr>
            <td><strong>2. Arquitectura y Diseño Base</strong></td>
            <td>Antigravity • <code>Gemini 3.1 Pro</code> (<strong>5%</strong>)</td>
            <td>Topología Zero-Trust, Map-Reduce 12 lotes, 265 controles • 3.55M In / 0.58M Out</td>
            <td><strong style="color:#6ee7b7;">$14.06 USD</strong></td>
            <td>$96.45 USD</td>
          </tr>
          <tr>
            <td><strong>3. Construcción, Manuales y Auditorías</strong></td>
            <td>Antigravity + Vertex • <code>Gemini 3.8 Flash</code> (<strong>74%</strong>)</td>
            <td>171 prompts, 17 PDFs ($65.85) + Auto-Auditorías ($4.80) • 52.60M In / 8.32M Out</td>
            <td><strong style="color:#6ee7b7;">$70.65 USD</strong></td>
            <td>$1,412.70 USD</td>
          </tr>
          <tr>
            <td><strong>4. Hardening Profundo y Diagramas</strong></td>
            <td>Antigravity • <code>Gemini 4.0 Argon</code> (<strong>10%</strong>)</td>
            <td>Vertex ADC sin llaves, Cloud IAP, 308 tests Firestore, 4K • 7.10M In / 1.15M Out</td>
            <td><strong style="color:#6ee7b7;">$25.70 USD</strong></td>
            <td>$192.90 USD</td>
          </tr>
          <tr>
            <td><strong>5. Bugfixing Adversarial y QA</strong></td>
            <td>Antigravity • <code>Claude Opus 5.5 Max</code> (<strong>5%</strong>)</td>
            <td>Red-team cruzado, auth tiempo constante, filtros SSRF/DNS • 3.55M In / 0.58M Out</td>
            <td><strong style="color:#6ee7b7;">$96.45 USD</strong></td>
            <td>$96.45 USD</td>
          </tr>
          <tr>
            <td><strong>6. Infraestructura Serverless GCP</strong></td>
            <td>Cloud Build (9x), Cloud Run, Firestore, IAP</td>
            <td>9 builds de contenedor, Cloud Run scale-to-zero, <code>aegis-ai-db</code> • <strong>Total: $215.24 USD</strong></td>
            <td><strong style="color:#6ee7b7;">$1.85 USD</strong></td>
            <td>$1.85 USD</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Costo Total Multi-Modelo ($215.24 Directo / $319.80 c/ Bucles Agénticos)</span>
      <span>88.9% de Ahorro vs. 100% Claude Opus 5.5 Max ($1,930.85) • 99.77% de Ahorro vs. Desarrollo Tradicional</span>
    </div>
  </div>

  <!-- SLIDE 7: EL PROBLEMA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Panorama de Riesgos</span>
      </div>
      <span class="slide-num">07 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">El Problema a Resolver</span>
      <h2 class="slide-title">El Punto Ciego Crítico en la Adopción Empresarial de GenAI</h2>
      <p class="slide-subtitle">Las organizaciones despliegan modelos generativos, flujos agénticos, herramientas MCP y pipelines RAG sin verificación arquitectónica ni gobernanza ISO 42001.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Brechas de Acceso y Despliegue sin Gobierno</div>
          <p class="card-text">Según <strong>IBM Cost of a Data Breach 2025</strong>, el <strong>13% de las organizaciones</strong> sufrió brechas en modelos o aplicaciones de IA, y el <strong>97% de ellas</strong> carecía de controles de acceso adecuados o Evaluación de Impacto (<code>ISO 42001 A.5.1</code>).</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Superficie Multi-Turno y Agéntica</div>
          <p class="card-text">Pipelines RAG, servidores MCP y agentes introducen vectores críticos: <strong>Inyección Multi-Turno Crescendo</strong> (<code>C02.10</code>), <strong>Envenenamiento Normativo/Vectorial</strong> (<code>C01.4</code>) y SSRF/IMDS (<code>C04.3</code>).</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Silo entre CISO y Ciencia de Datos</div>
          <p class="card-text">Los equipos de seguridad carecen de herramientas para auditar grafos de agentes, manifiestos MCP (<code>C10.1</code>) y ACLs vectoriales (<code>C08.1</code>) antes de producción.</p>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 12px;">
        <div class="card">
          <div class="card-title" style="color: #f59e0b;">Brecha de Gobernanza Operativa (ISO/IEC 42001)</div>
          <p class="card-text">Dificultad para operacionalizar los controles de <strong>ISO/IEC 42001:2023</strong> —como Políticas Corporativas de IA (<code>A.2.1</code>), Canal Ético Confidencial (<code>A.3.3</code>), Inventario de Activos IA (<code>A.4.1</code>) y Apelación Humana (<code>A.5.2</code>)— en el ciclo de ingeniería.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #38bdf8;">Proliferación de "Shadow AI" y Denial of Wallet</div>
          <p class="card-text">Invocaciones externas sin cuotas, comparación insegura de tokens (<code>C05.3</code>), cuentas de servicio sobre-privilegiadas (<code>C05.2</code>), falta de presupuestos Anti-DoW (<code>C11.1</code>) y exposición de logprobs (<code>C11.4</code>).</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Diagnóstico de Riesgos de IA</span>
      <span>Fuente: OWASP GenAI Security Project (AI-SVS v1.0) & ISO/IEC 42001:2023</span>
    </div>
  </div>

  <!-- SLIDE 8: MATRIZ DE CUMPLIMIENTO -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Gobernanza y Estándares</span>
      </div>
      <span class="slide-num">08 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Matriz de Cumplimiento</span>
      <h2 class="slide-title">Soporte Multi-Estándar y Gobernanza AIMS ISO/IEC 42001</h2>
      <p class="slide-subtitle">Evaluación simultánea de estándares técnicos globales de seguridad en IA, sistemas de gestión y leyes de privacidad.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 20%;">Estándar / Marco</th>
            <th style="width: 24%;">Alcance Técnico y de Gobernanza</th>
            <th style="width: 40%;">Controles Clave Verificados y Aplicados por AegisAI</th>
            <th style="width: 16%;">Nivel</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #60a5fa;">OWASP AI-SVS v1.0</strong></td>
            <td>Estándar de Verificación de Seguridad en IA (12 Capítulos)</td>
            <td><code>C01.4</code> Manifiesto SHA-256, <code>C02.10</code> Guardia Crescendo, <code>C04.1</code> Contenedor Read-Only, <code>C04.3</code> Cloud IAP y Bloqueo SSRF, <code>C05.2–C05.4</code> Auth en Tiempo Constante e IAM, <code>C08.1/C08.4</code> ACLs RAG, <code>C09.4</code> Sagas, <code>C10.1–C10.5</code> Seguridad MCP, <code>C11.1/C11.4</code> Anti-DoW y Logprobs Off, <code>C12.2</code> Alertas SIEM.</td>
            <td><span class="pill pill-green">L1 / L2 / L3 Listo</span></td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">ISO/IEC 42001:2023</strong></td>
            <td>Sistema de Gestión de IA (AIMS Cláusulas 4–10 y Anexo A)</td>
            <td><code>Cláusula 4.1/4.2</code> Contexto y Stakeholders, <code>Cláusula 5/A.2.1/A.2.3</code> Política Corporativa IA, <code>Cláusula 7/A.3.3</code> Competencia y Canal Ético, <code>A.4.1</code> Inventario IA, <code>A.5.1–A.5.3</code> Evaluación de Impacto y Apelación Humana, <code>Cláusula 9</code> KPIs y Auditoría Interna, <code>A.9.1/A.9.2</code> Uso Aceptable.</td>
            <td><span class="pill pill-green">Certificación Lista</span></td>
          </tr>
          <tr>
            <td><strong style="color: #34d399;">Regulación Mexicana (2026)</strong></td>
            <td>Protección al Consumidor (LFPC) y Datos Personales (LFPDPPP)</td>
            <td>Transparencia algorítmica, prevención de patrones oscuros, retracto de 5 días (Art. 56 LFPC), purga en cascada ARCO y enmascaramiento DLP.</td>
            <td><span class="pill pill-blue">Estatutario Local</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">Marco BYOF Personalizado</strong></td>
            <td><em>Bring Your Own Framework</em> (Multi-Inquilino)</td>
            <td>Ingesta autenticada por administrador (<code>C05.3</code>) con verificación SHA-256 (<code>C01.4</code>) y pre-filtrado ACL por dominio de inquilino (<code>allowedDomains</code>, <code>C08.1</code>).</td>
            <td><span class="pill pill-amber">Aislado por Tenant</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card" style="margin-top: 10px; background: rgba(30, 41, 59, 0.45);">
        <p class="card-text" style="font-size: 8pt;">
          <strong>Motor Map-Reduce Cruzado sin Colisiones:</strong> Evalúa más de 103 controles combinados de OWASP AI-SVS e ISO/IEC 42001 en lotes paralelos usando enums de capítulo restringidos para que las Cláusulas 9/10 y Anexo A.9/A.10 jamás colisionen con C09/C10.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Frameworks & Compliance Engine</span>
      <span>Alineado con OWASP AI-SVS v1.0, ISO/IEC 42001:2023, NIST AI RMF y EU AI Act</span>
    </div>
  </div>

  <!-- SLIDE 9: ARQUITECTURA TÉCNICA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Ingeniería del Sistema</span>
      </div>
      <span class="slide-num">09 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Arquitectura de Software</span>
      <h2 class="slide-title">Arquitectura Zero-Trust de 4 Capas y Defensa en Profundidad</h2>
      <p class="slide-subtitle">Arquitectura serverless endurecida en Google Cloud Run detrás de Identity-Aware Proxy (IAP) con inferencia Vertex AI sin llaves.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4">
        <div class="card">
          <div class="card-title" style="color: #38bdf8;">1. Perímetro y SPA</div>
          <p class="card-text">
            • <strong>Cloud IAP</strong> (<code>--no-allow-unauthenticated</code>)<br>
            • <strong>React 19 + TS + Vite</strong><br>
            • Lista blanca OAuth 2.0 en Firebase Auth (<code>google.com</code>, <code>altostrat.com</code>)<br>
            • Avisos visibles ISO 42001 de Política, Apelación (<code>A.5.2</code>) y Canal Ético (<code>A.3.3</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #60a5fa;">2. Capa API Endurecida</div>
          <p class="card-text">
            • <strong>Contenedor Read-Only</strong> (<code>chmod -R a-w /app</code>, <code>C04.1</code>)<br>
            • Tokens en tiempo constante (<code>crypto.timingSafeEqual</code>, <code>C05.3</code>)<br>
            • Firebase Admin <code>verifyIdToken()</code><br>
            • Guardia DNS Rebinding (<code>C10.5</code>) y Firma MCP (<code>C10.1</code>)<br>
            • Cuotas Anti-DoW (<code>C11.1</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #34d399;">3. Motor IA y Guardrails</div>
          <p class="card-text">
            • <strong>Vertex AI</strong> (<code>gemini-3.8-flash</code>) vía ADC sin llaves<br>
            • SA de mínimo privilegio (<code>aegis-runner-sa</code>: cero <code>roles/viewer</code>, <code>C05.2</code>)<br>
            • Detector Multi-Turno Crescendo (<code>C02.10</code>)<br>
            • <code>responseLogprobs: false</code> (<code>C11.4</code>)<br>
            • Bloqueo SSRF/IMDS (<code>C04.3</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #a78bfa;">4. Datos, Integridad y Sagas</div>
          <p class="card-text">
            • <strong>Cloud Firestore</strong> (<code>aegis-ai-db</code>) vía Admin SDK<br>
            • 308/308 pruebas <code>firestore.rules</code><br>
            • Auditorías inmutables (<code>allow delete: if false</code>) y ACLs <code>ownerUid</code> (<code>C05.4</code>)<br>
            • Manifiesto SHA-256 (<code>C01.4</code>)<br>
            • Sagas Compensatorias (<code>C09.4</code>)
          </p>
        </div>
      </div>

      <div class="card card-highlight" style="margin-top: 12px;">
        <div class="card-title" style="font-size: 9.5pt; color: #93c5fd;">Aislamiento Zero-Trust y Alertamiento Estructurado de Seguridad (C12.2):</div>
        <p class="card-text" style="font-size: 8pt;">
          El estado en tiempo de ejecución se persiste exclusivamente en Firestore (<code>system_config/admin_settings</code>) y caché efímero <code>/tmp/aegis-runtime-cache</code>. Cada evento de seguridad emite una alerta JSON estructurada (<code>aegis-security-alerting-c12-2</code>) hacia Google Cloud Logging.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Arquitectura de Contenedores y Seguridad C4</span>
      <span>Desplegado en Google Cloud Run (Revisión aegis-ai-00009-gk6)</span>
    </div>
  </div>

  <!-- SLIDE 10: FLUJO OPERATIVO -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Flujo Operativo</span>
      </div>
      <span class="slide-num">10 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Ejecución Operativa</span>
      <h2 class="slide-title">Flujo del Auditor: De la Ingesta al Blindaje al 100%</h2>
      <p class="slide-subtitle">Ciclo determinístico de aseguramiento en 6 etapas con supervisión humana integrada y remediación automatizada.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 14px;">
        <div style="display: flex; flex-direction: column; gap: 9px;">
          <div class="step-box">
            <div class="step-number">1</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Ingesta Autenticada y Guardrails Pre-Vuelo</strong>
              <p class="card-text">El usuario corporativo (verificado por Cloud IAP + Firebase ID Token) carga PDFs/ZIPs; <code>inspectPromptAndTrackSession</code> (<code>C02.10</code>) y DLP sanean la entrada.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">2</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Contexto Verificado SHA-256 y Filtrado por Tenant</strong>
              <p class="card-text">Se validan los snapshots normativos contra <code>integrity-manifest.json</code> (<code>C01.4</code>) y se filtran los marcos por <code>tenantDomain</code> (<code>C08.1</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">3</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Evaluación Determinística Map-Reduce en Vertex AI</strong>
              <p class="card-text"><code>gemini-3.8-flash</code> (<code>temperature: 0.0</code>, <code>responseLogprobs: false</code>, timeout 180s) evalúa cada lote bajo enums estrictos de capítulos.</p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 9px;">
          <div class="step-box">
            <div class="step-number" style="background: #10b981;">4</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Tablero Ejecutivo y Apelación Humana (ISO A.5.2)</strong>
              <p class="card-text">Gráficos radar interactivos, madurez L1/L2/L3 y flujo directo de Apelación de Dictamen / Revisión Humana (<code>ai-appeals@aegisai.enterprise</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">5</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Arquitectura Remediada al 100% y Recetario Completo</strong>
              <p class="card-text">Sintetiza la Sección 3 drop-in + Sección 4 Cookbook para todos los hallazgos <code>1..N</code> con etiquetas precisas (<code>typescript</code>, <code>hcl</code>, <code>yaml</code>, <code>python</code>, <code>bash</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">6</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Persistencia Inmutable y Saga Compensatoria</strong>
              <p class="card-text">Guardado en Firestore con atribución <code>ownerUid</code>/<code>tenantDomain</code> (<code>C05.4</code>), protección <code>runCompensatingSaga</code> (<code>C09.4</code>) y registro de KPIs AIMS (<code>C08.4</code>).</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Ciclo de Aseguramiento en 6 Etapas</span>
      <span>Trazabilidad completa multi-estándar OWASP AI-SVS + ISO/IEC 42001</span>
    </div>
  </div>

  <!-- SLIDE 11: MATRIZ DE DEFENSA EN PROFUNDIDAD -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Matriz de Defensa en Profundidad</span>
      </div>
      <span class="slide-num">11 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Trazabilidad Integral de Remediación</span>
      <h2 class="slide-title">Controles OWASP AI-SVS v1.0 & ISO/IEC 42001:2023 Implementados</h2>
      <p class="slide-subtitle">Controles arquitectónicos y de gobernanza aplicados en código, contenedor, perímetro cloud y políticas AIMS.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;">Controles Técnicos OWASP AI-SVS v1.0 (17 Dominios Endurecidos)</div>
          <p class="card-text" style="font-size: 7.8pt; line-height: 1.45;">
            • <strong>C01.4 Integridad Normativa:</strong> <code>verifyNormativeSnapshotsIntegrity()</code> con manifiesto SHA-256 al arranque.<br>
            • <strong>C02.10 Defensa Crescendo:</strong> <code>inspectPromptAndTrackSession()</code> bloquea escalación multi-turno (HTTP 422).<br>
            • <strong>C04.1 & C04.3 Infraestructura:</strong> <code>/app</code> solo lectura (<code>chmod -R a-w</code>), Cloud IAP, egreso VPC y bloqueo SSRF/IMDS <code>validateOutboundEndpoint()</code>.<br>
            • <strong>C05.2, C05.3 & C05.4 Auth/IAM:</strong> Revocación de <code>roles/viewer</code> en <code>aegis-runner-sa</code>, <code>crypto.timingSafeEqual</code>, verificación de Firebase ID token y ACLs <code>ownerUid</code>.<br>
            • <strong>C08.1 & C08.4 RAG/Grounding:</strong> Pre-filtrado ACL por dominio de inquilino y telemetría continua.<br>
            • <strong>C09.4 & C10.1–C10.5 Agentes/MCP:</strong> <code>runCompensatingSaga()</code>, firma MCP Ed25519/HMAC, OAuth 2.1 PKCE y <code>dnsRebindingGuard</code>.<br>
            • <strong>C11.1, C11.4 & C12.2 FinOps/SIEM:</strong> <code>acquireAntiDoWQuota()</code>, <code>responseLogprobs: false</code> y <code>emitSecurityAlert()</code>.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #a78bfa;">Controles de Gobernanza AIMS ISO/IEC 42001:2023 (18 Cláusulas y Anexo A)</div>
          <p class="card-text" style="font-size: 7.8pt; line-height: 1.45;">
            • <strong>Cláusula 4.1 & 4.2 Contexto y Stakeholders:</strong> Matriz de cuestiones internas/externas, rol de proveedor de aseguramiento IA y partes interesadas.<br>
            • <strong>Cláusula 5.1, 5.2, A.2.1 & A.2.3 Liderazgo y Política IA:</strong> Política Corporativa de IA aprobada por dirección con revisión anual.<br>
            • <strong>Cláusula 7.2, 7.3 & A.3.3 Competencia y Canal Ético:</strong> Capacitación por rol y canal confidencial de denuncias (<code>ai-ethics-whistleblower@aegisai.enterprise</code>).<br>
            • <strong>A.4.1 Inventario de Recursos y Herramientas:</strong> Catálogo de modelos, corpus normativos, cuentas de servicio y secretos KMS.<br>
            • <strong>A.5.1, A.5.2 & A.5.3 Evaluación de Impacto y Apelación:</strong> Metodología AIIA, umbrales cuantitativos y canal de apelación humana (<code>ai-appeals@aegisai.enterprise</code>).<br>
            • <strong>Cláusula 9.1–9.3 & A.9.1/A.9.2 Aseguramiento y Uso:</strong> KPIs continuos, auditoría interna semestral, revisión directiva y avisos de uso aceptable.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Trazabilidad Completa OWASP AI-SVS v1.0 & ISO/IEC 42001:2023</span>
      <span>Documentado en Manual 2 (Arquitectura), Manual 3 (Admin), Manual 4/6 (Despliegue) y Manual 8 (Gobernanza AIMS)</span>
    </div>
  </div>

  <!-- SLIDE 12: ROADMAP -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Visión Estratégica</span>
      </div>
      <span class="slide-num">12 / 12</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolución y Roadmap</span>
      <h2 class="slide-title">Siguientes Pasos en la Ingeniería de AegisAI</h2>
      <p class="slide-subtitle">Hoja de ruta tras las presentaciones del Release Candidate a Farmacias del Ahorro, AMF y Grupo Coppel.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 8px;">Q4 2026 • Corto Plazo</div>
          <div class="card-title" style="color: #38bdf8;">Compuertas CI/CD Shift-Left</div>
          <p class="card-text">
            <strong>GitHub Actions</strong> y <strong>GitLab CI Runners</strong> oficiales para bloquear automáticamente <em>pull requests</em> con vulnerabilidades de prompt injection, manifiestos MCP sin firma o vectores sin cifrar.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-green" style="margin-bottom: 8px;">Q1 2027 • Mediano Plazo</div>
          <div class="card-title" style="color: #34d399;">Auditoría de Grafos Multi-Agente</div>
          <p class="card-text">
            Módulo especializado para auditar flujos de agentes autónomos complejos (LangGraph, CrewAI, AutoGen): validación de fronteras de autorización, sagas compensatorias y sandboxing de memoria.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-amber" style="margin-bottom: 8px;">Q2 2027 • Largo Plazo</div>
          <div class="card-title" style="color: #fcd34d;">Auto-Remediación con IaC</div>
          <p class="card-text">
            Síntesis automatizada de módulos de <strong>Terraform</strong> y <strong>Helm Charts</strong> que apliquen políticas de Cloud IAP, VPC Service Controls y Cloud Armor en un clic.
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.5); border-color: rgba(59, 130, 246, 0.4);">
        <div class="card-title" style="color: #ffffff; font-size: 10pt;">
          <span>🎯</span> Conclusión: Aseguramiento Empresarial Construido por $215.24 USD Multi-Modelo, Auditando por $0.43–$1.55 USD (Batch: $0.21)
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          Combinando <strong>Gemini 3.6 y 3.8 Flash (80%)</strong> para el PoC y la construcción masiva con <strong>Gemini 3.1 Pro (5%)</strong> en arquitectura y <strong>Gemini 4.0 Argon (10%) + Claude Opus 5.5 Max (5%)</strong> para hardening profundo y QA, AegisAI se construyó con un <strong>88.9% de ahorro frente a 100% Opus ($1,931)</strong> y un <strong>99.77% de ahorro frente al desarrollo tradicional (~$95k)</strong>.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Roadmap Estratégico 2026-2027</span>
      <span>Contacto: opensource@aegis-ai.dev • GitHub: github.com/fjhuerta-67/AegisAI</span>
    </div>
  </div>

</body>
</html>
"""

os.makedirs("docs/Manuals_english/pdf", exist_ok=True)
os.makedirs("docs/manuales_pdf/english", exist_ok=True)
os.makedirs("docs/manuales_pdf", exist_ok=True)

temp_en = "/tmp/aegis_evolution_en.html"
with open(temp_en, "w", encoding="utf-8") as f:
    f.write(html_en)

out_en_new = "docs/Manuals_english/pdf/AegisAI_Evolution_and_FinOps_Presentation.pdf"
out_en_mirror1 = "docs/manuales_pdf/english/AegisAI_Evolution_and_FinOps_Presentation.pdf"

cmd_en = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{out_en_new}" --print-to-pdf-no-header "{temp_en}"'
subprocess.run(cmd_en, shell=True, check=True)
shutil.copy(out_en_new, out_en_mirror1)

temp_es = "/tmp/aegis_evolution_es.html"
with open(temp_es, "w", encoding="utf-8") as f:
    f.write(html_es)

out_es_new = "docs/manuales_pdf/AegisAI_Presentacion_Evolucion_y_Costos.pdf"

cmd_es = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{out_es_new}" --print-to-pdf-no-header "{temp_es}"'
subprocess.run(cmd_es, shell=True, check=True)

print(f"Created English Evolution & FinOps Presentation: {out_en_new} ({os.path.getsize(out_en_new)/1024:.1f} KB)")
print(f"Created Spanish Evolution & FinOps Presentation: {out_es_new} ({os.path.getsize(out_es_new)/1024:.1f} KB)")
