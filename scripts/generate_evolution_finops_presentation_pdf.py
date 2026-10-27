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
        How <strong>AegisAI Enterprise</strong> was prototyped in <strong>Google AI Studio (Gemini 3.8 to 3.6 Flash)</strong>, engineered in <strong>Google Antigravity (Gemini 3.8 Flash)</strong>, self-audited against <strong>OWASP AI-SVS v1.0 & ISO/IEC 42001:2023</strong> (68.9% ➔ 97.8%), and presented as a Release Candidate to <strong>Farmacias del Ahorro</strong>, <strong>Asociación Mexicana de Franquicias</strong>, and <strong>Grupo Coppel</strong>—for a total build cost of <strong>$19.41 USD</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">1. AI Studio PoC (Gemini 3.8–3.6 Flash)</span>
        <span class="pill pill-blue">2. Antigravity Full-Stack Build (3.8 Flash)</span>
        <span class="pill pill-green">3. Self-Audit Loop: 68.9% ➔ 97.8%</span>
        <span class="pill pill-purple">4. RC: Farmacias del Ahorro • AMF • Coppel</span>
        <span class="pill pill-amber">5. Audit Cost: $0.08–$0.30 vs $8.55–$31.09</span>
        <span class="pill pill-green">6. Total App Build Cost: $19.41 USD</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise v2.5 • Executive & FinOps Presentation</span>
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
      <span class="slide-category">End-to-End Engineering Lifecycle</span>
      <h2 class="slide-title">How We Built, Self-Audited, and Validated AegisAI</h2>
      <p class="slide-subtitle">A four-stage agentic software engineering journey from rapid concept validation to enterprise release candidate.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Phase 1 • Proof of Concept</div>
          <div class="card-title" style="color: #38bdf8;">1. Prototyped in Google AI Studio (Gemini 3.8 to 3.6 Flash)</div>
          <p class="card-text">
            • Built the initial Proof of Concept in <strong>Google AI Studio</strong> using <strong>Gemini 3.8 Flash</strong> with automatic fallback to <strong>Gemini 3.6 Flash</strong>.<br>
            • Validated structured JSON Schema output generation, multi-chapter normative reasoning, and initial React UI scaffolding.<br>
            • Proved that Flash-class models with strict system instructions and temperature <code>0.0</code> could evaluate complex security controls rapidly.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Phase 2 • Full-Stack Engineering</div>
          <div class="card-title" style="color: #60a5fa;">2. Migrated to Google Antigravity (Worked Upon with 3.8 Flash)</div>
          <p class="card-text">
            • Transitioned the repository into <strong>Google Antigravity (AGY)</strong> powered by <strong>Gemini 3.8 Flash</strong>.<br>
            • Executed <strong>171+ conversational engineering prompts</strong> across 7 structured phases to build the Express/TypeScript backend, parallel Map-Reduce evaluator, keyless GCP Live Scanner, multi-tenant Firestore persistence, and 16 bilingual PDF manuals.<br>
            • Deployed to Google Cloud Run behind Identity-Aware Proxy (IAP).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">Phase 3 • Dogfooding & Hardening</div>
          <div class="card-title" style="color: #34d399;">3. Self-Audited Codebase & Docs Against AegisAI Itself</div>
          <p class="card-text">
            • Once the working prototype was live on Cloud Run, we uploaded <strong>AegisAI's own codebase and 10-PDF documentation bundle (<code>Originaldocs.zip</code>)</strong> into AegisAI to run a full <strong>OWASP AI-SVS v1.0 + ISO/IEC 42001:2023</strong> audit.<br>
            • Baseline self-audit (<code>MULTI-2026-0437</code>) scored <strong>68.9%</strong> and flagged 35 gaps (6 Failed, 29 Missing Evidence).<br>
            • We fixed both the documentation and the application, re-auditing at <strong>97.8%</strong> (<code>MULTI-2026-8983</code>, <strong>100% ISO 42001</strong>, 0 failures).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-purple" style="margin-bottom: 6px;">Phase 4 • Enterprise Field Validation</div>
          <div class="card-title" style="color: #d8b4fe;">4. Release Candidate (RC) Presented to Industry Leaders</div>
          <p class="card-text">
            • Presented the hardened Release Candidate (RC) to three major Mexican organizations:<br>
            &nbsp;&nbsp;1. <strong>Farmacias del Ahorro</strong> (Healthcare & Retail Pharmacy)<br>
            &nbsp;&nbsp;2. <strong>Asociación Mexicana de Franquicias (AMF)</strong> (Franchise Ecosystem)<br>
            &nbsp;&nbsp;3. <strong>Grupo Coppel</strong> (Financial Services & Omnichannel Retail)<br>
            • Validated multi-standard compliance (OWASP AI-SVS, ISO 42001, LFPC & LFPDPPP).
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • 4-Stage Product Evolution</span>
      <span>AI Studio (3.8–3.6 Flash) ➔ Antigravity (3.8 Flash) ➔ Self-Audit ➔ Enterprise RC</span>
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
            &nbsp;&nbsp;– <strong>BYOF Engine:</strong> Custom franchise governance templates with low-cost Flash evaluations (<code>$0.08/audit</code>).
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

    <div class="title-block">
      <span class="slide-category">FinOps Analysis: Cost per Complete OWASP AI-SVS + ISO/IEC 42001 Audit</span>
      <h2 class="slide-title">Gemini (3.8 Flash, 3.1 Pro, 4.0 Argon) vs. Claude (Fable 5.1, Opus 5.5)</h2>
      <p class="slide-subtitle">Calculated from real production Firestore token telemetry across 12 Map-Reduce LLM calls per full dual-standard audit.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 21%;">Model Tier</th>
            <th style="width: 17%;">API Rate Card<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(Input / Output per 1M tok)</span></th>
            <th style="width: 21%;">Standard Audit Cost<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(370K In + 40K Out tok)</span></th>
            <th style="width: 23%;">Full 10-PDF Bundle Audit<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(1.64M In + 86.5K Out tok)</span></th>
            <th style="width: 18%;">Cost Multiplier vs.<br>Gemini 3.8 Flash</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #34d399;">Gemini 3.8 Flash</strong> <span class="pill pill-green">Production</span></td>
            <td><code>$0.15</code> / <code>$0.60</code></td>
            <td><strong style="color: #6ee7b7; font-size: 9.5pt;">$0.08 USD</strong> <span style="color:#94a3b8;">($0.0795)</span></td>
            <td><strong style="color: #6ee7b7; font-size: 9.5pt;">$0.30 USD</strong> <span style="color:#94a3b8;">($0.2979)</span></td>
            <td><span class="pill pill-green">1.0x (Baseline)</span></td>
          </tr>
          <tr>
            <td><strong style="color: #60a5fa;">Gemini 3.1 Pro</strong></td>
            <td><code>$1.25</code> / <code>$10.00</code></td>
            <td><strong style="color: #93c5fd; font-size: 9.5pt;">$0.86 USD</strong> <span style="color:#94a3b8;">($0.8625)</span></td>
            <td><strong style="color: #93c5fd; font-size: 9.5pt;">$2.92 USD</strong> <span style="color:#94a3b8;">($2.9150)</span></td>
            <td><span class="pill pill-blue">9.8x – 10.8x</span></td>
          </tr>
          <tr>
            <td><strong style="color: #38bdf8;">Gemini 4.0 Argon</strong> <span class="pill pill-blue">Frontier</span></td>
            <td><code>$2.00</code> / <code>$12.00</code></td>
            <td><strong style="color: #bae6fd; font-size: 9.5pt;">$1.22 USD</strong> <span style="color:#94a3b8;">($1.2200)</span></td>
            <td><strong style="color: #bae6fd; font-size: 9.5pt;">$4.32 USD</strong> <span style="color:#94a3b8;">($4.3180)</span></td>
            <td><span class="pill pill-blue">14.5x – 15.3x</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">Claude Fable 5.1 Medium</strong></td>
            <td><code>$3.00</code> / <code>$15.00</code></td>
            <td><strong style="color: #fde68a; font-size: 9.5pt;">$1.71 USD</strong> <span style="color:#94a3b8;">($1.7100)</span></td>
            <td><strong style="color: #fde68a; font-size: 9.5pt;">$6.22 USD</strong> <span style="color:#94a3b8;">($6.2175)</span></td>
            <td><span class="pill pill-amber">20.9x – 21.5x costlier</span></td>
          </tr>
          <tr>
            <td><strong style="color: #f87171;">Claude Opus 5.5 Max</strong></td>
            <td><code>$15.00</code> / <code>$75.00</code></td>
            <td><strong style="color: #fca5a5; font-size: 9.5pt;">$8.55 USD</strong> <span style="color:#94a3b8;">($8.5500)</span></td>
            <td><strong style="color: #fca5a5; font-size: 9.5pt;">$31.09 USD</strong> <span style="color:#94a3b8;">($31.0875)</span></td>
            <td><span class="pill pill-red">104.4x – 107.5x costlier</span></td>
          </tr>
        </tbody>
      </table>

      <div class="grid-3" style="margin-top: 10px;">
        <div class="card">
          <div class="card-title" style="color:#34d399; font-size:9pt;">Real Telemetry Basis (Firestore)</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Standard Audit</strong> (<code>MULTI-2026-0507</code> / <code>1250</code>): Avg <code>368,827</code> input + <code>39,812</code> output tokens.<br>
            • <strong>Full 10-PDF ZIP Audit</strong> (<code>MULTI-2026-0437</code> / <code>8983</code>): Avg <code>1,638,410</code> input + <code>86,495</code> output tokens across 12 batch calls (~136K context/call).
          </p>
        </div>
        <div class="card">
          <div class="card-title" style="color:#60a5fa; font-size:9pt;">Annual FinOps @ 1,000 Audits/Yr</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Gemini 3.8 Flash:</strong> <strong>$298 / year</strong> (Full ZIP) or <strong>$80 / yr</strong> (Std)<br>
            • <strong>Gemini 3.1 Pro:</strong> <strong>$2,915 / year</strong><br>
            • <strong>Gemini 4.0 Argon:</strong> <strong>$4,318 / year</strong>
          </p>
        </div>
        <div class="card">
          <div class="card-title" style="color:#f87171; font-size:9pt;">Competitor Spend @ 1,000 Audits/Yr</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Claude Fable 5.1 Medium:</strong> <strong>$6,218 / year</strong> (21x higher)<br>
            • <strong>Claude Opus 5.5 Max:</strong> <strong>$31,088 / year</strong> (104x higher)<br>
            • <strong>Savings with Gemini 3.8 Flash:</strong> <strong>&gt;99% cost reduction</strong>.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Unit Economics & Model Cost Benchmark</span>
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
      <span class="slide-category">Engineering ROI & Development Cost Breakdown</span>
      <h2 class="slide-title">How Much Money We Spent Creating AegisAI: $19.41 USD Total</h2>
      <p class="slide-subtitle">Complete accounting of all AI token consumption and Google Cloud infrastructure from initial AI Studio PoC to Enterprise RC.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 10px;">
        <div class="card stat-box card-emerald">
          <div class="stat-number" style="color: #34d399;">$19.41</div>
          <div class="stat-label"><strong>Total Money Spent</strong> creating AegisAI (AI Tokens + GCP Infra)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">~71.0M</div>
          <div class="stat-label">Total Input Tokens across AI Studio, Antigravity (171+ prompts) & Self-Audits</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">$1,928</div>
          <div class="stat-label">What the exact same token volume would have cost on <strong>Claude Opus 5.5 Max</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #fcd34d;">~$95,000</div>
          <div class="stat-label">Equivalent traditional engineering cost (4 DevSecOps engineers × 3 months)</div>
        </div>
      </div>

      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 25%;">Development Phase</th>
            <th style="width: 24%;">Platform & Model Used</th>
            <th style="width: 23%;">Volume / Activity</th>
            <th style="width: 14%;">Actual Spend</th>
            <th style="width: 14%;">If Run on Opus 5.5</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Proof of Concept (PoC)</strong></td>
            <td>Google AI Studio (<code>Gemini 3.8–3.6 Flash</code>)</td>
            <td>~45 iterations • ~4.2M In / ~0.9M Out tokens</td>
            <td><strong style="color:#6ee7b7;">$1.17 USD</strong></td>
            <td>$130.50 USD</td>
          </tr>
          <tr>
            <td><strong>2. Core Full-Stack & Manuals (Phases 1–7)</strong></td>
            <td>Google Antigravity (<code>Gemini 3.8 Flash</code>)</td>
            <td>171 logged prompts + 16 PDFs • ~38.0M In / ~6.5M Out</td>
            <td><strong style="color:#6ee7b7;">$9.60 USD</strong></td>
            <td>$1,057.50 USD</td>
          </tr>
          <tr>
            <td><strong>3. Cloud Hardening & OWASP/ISO Fixes</strong></td>
            <td>Google Antigravity (<code>Gemini 3.8 Flash</code>)</td>
            <td>Argolis IAP, 308 rules tests, 35 controls • ~24.0M In / ~3.8M Out</td>
            <td><strong style="color:#6ee7b7;">$5.88 USD</strong></td>
            <td>$645.00 USD</td>
          </tr>
          <tr>
            <td><strong>4. Live Self-Audits & QA Test Harnesses</strong></td>
            <td>Vertex AI (<code>Gemini 3.8 / 3.1 Flash</code>)</td>
            <td><code>MULTI-2026-0437</code>, <code>8983</code>, <code>0507</code>, <code>1250</code> • ~4.8M In / ~0.32M Out</td>
            <td><strong style="color:#6ee7b7;">$0.91 USD</strong></td>
            <td>$96.00 USD</td>
          </tr>
          <tr>
            <td><strong>5. Google Cloud Infrastructure</strong></td>
            <td>Cloud Build, Cloud Run, Firestore, Secret Mgr</td>
            <td>9 container builds, scale-to-zero runtime, <code>aegis-ai-db</code></td>
            <td><strong style="color:#6ee7b7;">$1.85 USD</strong></td>
            <td>$1.85 USD</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Total Cost of Development (TCO)</span>
      <span>99.0% Savings vs. Claude Opus 5.5 Max • 99.98% Savings vs. Traditional Software Staffing</span>
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
          <span>🎯</span> Conclusion: Enterprise AI Assurance Built for $19.41, Auditing for $0.08–$0.30
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          By combining <strong>Google AI Studio</strong>, <strong>Google Antigravity</strong>, and <strong>Vertex AI Gemini 3.8 Flash</strong>, AegisAI proves that world-class OWASP AI-SVS & ISO/IEC 42001 assurance can be built and operated at <strong>&gt;99% lower cost</strong> than legacy frontier alternatives.
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
        Cómo <strong>AegisAI Enterprise</strong> fue prototipado en <strong>Google AI Studio (Gemini 3.8 a 3.6 Flash)</strong>, desarrollado en <strong>Google Antigravity (Gemini 3.8 Flash)</strong>, auto-auditado bajo <strong>OWASP AI-SVS v1.0 e ISO/IEC 42001:2023</strong> (68.9% ➔ 97.8%), y presentado como Release Candidate ante <strong>Farmacias del Ahorro</strong>, <strong>Asociación Mexicana de Franquicias</strong> y <strong>Grupo Coppel</strong>—con una inversión total de creación de <strong>$19.41 USD</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">1. PoC en AI Studio (Gemini 3.8–3.6 Flash)</span>
        <span class="pill pill-blue">2. Ingeniería en Antigravity (3.8 Flash)</span>
        <span class="pill pill-green">3. Auto-Auditoría: 68.9% ➔ 97.8%</span>
        <span class="pill pill-purple">4. RC: Farmacias del Ahorro • AMF • Coppel</span>
        <span class="pill pill-amber">5. Costo por Auditoría: $0.08–$0.30 vs $8.55–$31.09</span>
        <span class="pill pill-green">6. Costo Total de Creación: $19.41 USD</span>
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
      <span class="slide-category">Ciclo de Vida de Ingeniería de Extremo a Extremo</span>
      <h2 class="slide-title">Cómo Construimos, Auto-Auditamos y Validamos AegisAI</h2>
      <p class="slide-subtitle">Un recorrido de ingeniería agéntica en cuatro etapas desde la prueba de concepto hasta el Release Candidate empresarial.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 12px;">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Fase 1 • Prueba de Concepto (PoC)</div>
          <div class="card-title" style="color: #38bdf8;">1. Prototipado en Google AI Studio (Gemini 3.8 a 3.6 Flash)</div>
          <p class="card-text">
            • Se construyó la Prueba de Concepto inicial en <strong>Google AI Studio</strong> utilizando <strong>Gemini 3.8 Flash</strong> con conmutación dinámica a <strong>Gemini 3.6 Flash</strong>.<br>
            • Se validó la generación estructurada bajo JSON Schema, el razonamiento normativo multi-capítulo y la interfaz inicial en React.<br>
            • Se demostró que los modelos Flash con temperatura <code>0.0</code> evalúan controles complejos en segundos.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">Fase 2 • Ingeniería Full-Stack</div>
          <div class="card-title" style="color: #60a5fa;">2. Migración a Google Antigravity (Desarrollado con 3.8 Flash)</div>
          <p class="card-text">
            • Se migró la base de código a <strong>Google Antigravity (AGY)</strong> operando con <strong>Gemini 3.8 Flash</strong>.<br>
            • Se ejecutaron más de <strong>171 prompts de ingeniería conversacional</strong> en 7 fases para construir el backend Express/TypeScript, el motor Map-Reduce, el GCP Live Scanner, la persistencia en Firestore y los 16 manuales PDF bilingües.<br>
            • Desplegado en Google Cloud Run detrás de Identity-Aware Proxy (IAP).
          </p>
        </div>

        <div class="card card-emerald">
          <div class="pill pill-green" style="margin-bottom: 6px;">Fase 3 • Dogfooding y Endurecimiento</div>
          <div class="card-title" style="color: #34d399;">3. Auto-Auditoría del Código y Documentación contra AegisAI</div>
          <p class="card-text">
            • Con el prototipo funcional en Cloud Run, cargamos <strong>el propio código y paquete de 10 PDFs de AegisAI (<code>Originaldocs.zip</code>)</strong> dentro de la misma aplicación para auditarla contra <strong>OWASP AI-SVS v1.0 e ISO/IEC 42001:2023</strong>.<br>
            • La auto-auditoría base (<code>MULTI-2026-0437</code>) obtuvo <strong>68.9%</strong> y detectó 35 brechas (6 Fallidos, 29 Falta Evidencia).<br>
            • Corregimos documentación y aplicación, logrando <strong>97.8%</strong> en re-auditoría (<code>MULTI-2026-8983</code>, <strong>100% ISO 42001</strong>, 0 fallos).
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
      <span>AegisAI Enterprise • Evolución del Producto en 4 Etapas</span>
      <span>AI Studio (3.8–3.6 Flash) ➔ Antigravity (3.8 Flash) ➔ Auto-Auditoría ➔ Release Candidate</span>
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
            &nbsp;&nbsp;– <strong>Motor BYOF:</strong> Marcos normativos propios para franquicias con auditorías Flash de ultra bajo costo (<code>$0.08 USD</code>).
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

    <div class="title-block">
      <span class="slide-category">Análisis FinOps: Costo por Auditoría Completa OWASP AI-SVS + ISO/IEC 42001</span>
      <h2 class="slide-title">Gemini (3.8 Flash, 3.1 Pro, 4.0 Argon) vs. Claude (Fable 5.1, Opus 5.5)</h2>
      <p class="slide-subtitle">Calculado con telemetría real de tokens en Firestore a través de las 12 llamadas Map-Reduce por auditoría dual completa.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 21%;">Modelo de IA</th>
            <th style="width: 17%;">Tarifa API<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(Entrada / Salida por 1M tok)</span></th>
            <th style="width: 21%;">Auditoría Estándar<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(370K In + 40K Out tok)</span></th>
            <th style="width: 23%;">Auditoría Bundle 10 PDFs<br><span style="font-weight:400; font-size:7pt; color:#94a3b8;">(1.64M In + 86.5K Out tok)</span></th>
            <th style="width: 18%;">Multiplicador vs.<br>Gemini 3.8 Flash</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #34d399;">Gemini 3.8 Flash</strong> <span class="pill pill-green">Producción</span></td>
            <td><code>$0.15</code> / <code>$0.60</code></td>
            <td><strong style="color: #6ee7b7; font-size: 9.5pt;">$0.08 USD</strong> <span style="color:#94a3b8;">($0.0795)</span></td>
            <td><strong style="color: #6ee7b7; font-size: 9.5pt;">$0.30 USD</strong> <span style="color:#94a3b8;">($0.2979)</span></td>
            <td><span class="pill pill-green">1.0x (Base)</span></td>
          </tr>
          <tr>
            <td><strong style="color: #60a5fa;">Gemini 3.1 Pro</strong></td>
            <td><code>$1.25</code> / <code>$10.00</code></td>
            <td><strong style="color: #93c5fd; font-size: 9.5pt;">$0.86 USD</strong> <span style="color:#94a3b8;">($0.8625)</span></td>
            <td><strong style="color: #93c5fd; font-size: 9.5pt;">$2.92 USD</strong> <span style="color:#94a3b8;">($2.9150)</span></td>
            <td><span class="pill pill-blue">9.8x – 10.8x</span></td>
          </tr>
          <tr>
            <td><strong style="color: #38bdf8;">Gemini 4.0 Argon</strong> <span class="pill pill-blue">Frontier</span></td>
            <td><code>$2.00</code> / <code>$12.00</code></td>
            <td><strong style="color: #bae6fd; font-size: 9.5pt;">$1.22 USD</strong> <span style="color:#94a3b8;">($1.2200)</span></td>
            <td><strong style="color: #bae6fd; font-size: 9.5pt;">$4.32 USD</strong> <span style="color:#94a3b8;">($4.3180)</span></td>
            <td><span class="pill pill-blue">14.5x – 15.3x</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">Claude Fable 5.1 Medium</strong></td>
            <td><code>$3.00</code> / <code>$15.00</code></td>
            <td><strong style="color: #fde68a; font-size: 9.5pt;">$1.71 USD</strong> <span style="color:#94a3b8;">($1.7100)</span></td>
            <td><strong style="color: #fde68a; font-size: 9.5pt;">$6.22 USD</strong> <span style="color:#94a3b8;">($6.2175)</span></td>
            <td><span class="pill pill-amber">20.9x – 21.5x más caro</span></td>
          </tr>
          <tr>
            <td><strong style="color: #f87171;">Claude Opus 5.5 Max</strong></td>
            <td><code>$15.00</code> / <code>$75.00</code></td>
            <td><strong style="color: #fca5a5; font-size: 9.5pt;">$8.55 USD</strong> <span style="color:#94a3b8;">($8.5500)</span></td>
            <td><strong style="color: #fca5a5; font-size: 9.5pt;">$31.09 USD</strong> <span style="color:#94a3b8;">($31.0875)</span></td>
            <td><span class="pill pill-red">104.4x – 107.5x más caro</span></td>
          </tr>
        </tbody>
      </table>

      <div class="grid-3" style="margin-top: 10px;">
        <div class="card">
          <div class="card-title" style="color:#34d399; font-size:9pt;">Base de Telemetría Real (Firestore)</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Auditoría Estándar</strong> (<code>MULTI-2026-0507</code> / <code>1250</code>): Promedio <code>368,827</code> tokens entrada + <code>39,812</code> salida.<br>
            • <strong>Auditoría ZIP 10 PDFs</strong> (<code>MULTI-2026-0437</code> / <code>8983</code>): Promedio <code>1,638,410</code> entrada + <code>86,495</code> salida en 12 lotes (~136K contexto/lote).
          </p>
        </div>
        <div class="card">
          <div class="card-title" style="color:#60a5fa; font-size:9pt;">Costo Anual @ 1,000 Auditorías/Año</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Gemini 3.8 Flash:</strong> <strong>$298 / año</strong> (ZIP) o <strong>$80 / año</strong> (Estándar)<br>
            • <strong>Gemini 3.1 Pro:</strong> <strong>$2,915 / año</strong><br>
            • <strong>Gemini 4.0 Argon:</strong> <strong>$4,318 / año</strong>
          </p>
        </div>
        <div class="card">
          <div class="card-title" style="color:#f87171; font-size:9pt;">Gasto Competidor @ 1,000 Auditorías/Año</div>
          <p class="card-text" style="font-size:7.6pt;">
            • <strong>Claude Fable 5.1 Medium:</strong> <strong>$6,218 / año</strong> (21x mayor)<br>
            • <strong>Claude Opus 5.5 Max:</strong> <strong>$31,088 / año</strong> (104x mayor)<br>
            • <strong>Ahorro con Gemini 3.8 Flash:</strong> <strong>&gt;99% de reducción</strong>.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Economía Unitaria y Comparativa de Modelos</span>
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
      <span class="slide-category">ROI de Ingeniería y Desglose de Inversión</span>
      <h2 class="slide-title">Cuánto Dinero Gastamos Creando AegisAI: $19.41 USD en Total</h2>
      <p class="slide-subtitle">Contabilidad completa de consumo de tokens de IA e infraestructura Google Cloud desde el PoC en AI Studio hasta el Release Candidate.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 10px;">
        <div class="card stat-box card-emerald">
          <div class="stat-number" style="color: #34d399;">$19.41</div>
          <div class="stat-label"><strong>Inversión Total Realizada</strong> para crear AegisAI (Tokens IA + GCP)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">~71.0M</div>
          <div class="stat-label">Tokens de Entrada Totales en AI Studio, Antigravity (171+ prompts) y Auditorías</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">$1,928</div>
          <div class="stat-label">Lo que habría costado el mismo volumen de tokens en <strong>Claude Opus 5.5 Max</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #fcd34d;">~$95,000</div>
          <div class="stat-label">Costo equivalente de desarrollo tradicional (4 ingenieros DevSecOps × 3 meses)</div>
        </div>
      </div>

      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 25%;">Fase de Desarrollo</th>
            <th style="width: 24%;">Plataforma y Modelo</th>
            <th style="width: 23%;">Volumen / Actividad</th>
            <th style="width: 14%;">Gasto Real</th>
            <th style="width: 14%;">En Opus 5.5 Max</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Prueba de Concepto (PoC)</strong></td>
            <td>Google AI Studio (<code>Gemini 3.8–3.6 Flash</code>)</td>
            <td>~45 iteraciones • ~4.2M In / ~0.9M Out tokens</td>
            <td><strong style="color:#6ee7b7;">$1.17 USD</strong></td>
            <td>$130.50 USD</td>
          </tr>
          <tr>
            <td><strong>2. Desarrollo Full-Stack y Manuales (Fases 1–7)</strong></td>
            <td>Google Antigravity (<code>Gemini 3.8 Flash</code>)</td>
            <td>171 prompts registrados + 16 PDFs • ~38.0M In / ~6.5M Out</td>
            <td><strong style="color:#6ee7b7;">$9.60 USD</strong></td>
            <td>$1,057.50 USD</td>
          </tr>
          <tr>
            <td><strong>3. Hardening Cloud y Remediación OWASP/ISO</strong></td>
            <td>Google Antigravity (<code>Gemini 3.8 Flash</code>)</td>
            <td>Argolis IAP, 308 tests reglas, 35 controles • ~24.0M In / ~3.8M Out</td>
            <td><strong style="color:#6ee7b7;">$5.88 USD</strong></td>
            <td>$645.00 USD</td>
          </tr>
          <tr>
            <td><strong>4. Auto-Auditorías en Vivo y Suites QA</strong></td>
            <td>Vertex AI (<code>Gemini 3.8 / 3.1 Flash</code>)</td>
            <td><code>MULTI-2026-0437</code>, <code>8983</code>, <code>0507</code>, <code>1250</code> • ~4.8M In / ~0.32M Out</td>
            <td><strong style="color:#6ee7b7;">$0.91 USD</strong></td>
            <td>$96.00 USD</td>
          </tr>
          <tr>
            <td><strong>5. Infraestructura Google Cloud</strong></td>
            <td>Cloud Build, Cloud Run, Firestore, Secret Mgr</td>
            <td>9 builds de contenedor, Cloud Run scale-to-zero, <code>aegis-ai-db</code></td>
            <td><strong style="color:#6ee7b7;">$1.85 USD</strong></td>
            <td>$1.85 USD</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Costo Total de Creación (TCO)</span>
      <span>99.0% de Ahorro vs. Claude Opus 5.5 Max • 99.98% de Ahorro vs. Desarrollo Tradicional</span>
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
          <span>🎯</span> Conclusión: Aseguramiento Empresarial Construido por $19.41 USD, Auditando por $0.08–$0.30 USD
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          Combinando <strong>Google AI Studio</strong>, <strong>Google Antigravity</strong> y <strong>Vertex AI Gemini 3.8 Flash</strong>, AegisAI demuestra que el aseguramiento OWASP AI-SVS e ISO/IEC 42001 de clase mundial puede construirse y operarse a un costo <strong>&gt;99% menor</strong> que las alternativas tradicionales.
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
