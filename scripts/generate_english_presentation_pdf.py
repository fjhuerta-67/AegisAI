import os
import shutil
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AegisAI Enterprise - Executive & Technical Presentation</title>
  <style>
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
      padding: 15mm 18mm 13mm 18mm;
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
      margin-top: 8px;
      margin-bottom: 10px;
      position: relative;
      z-index: 10;
    }

    .slide-category {
      font-size: 8pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: block;
      margin-bottom: 3px;
    }

    .slide-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 19pt;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 5px 0;
      line-height: 1.2;
    }

    .slide-subtitle {
      font-size: 9pt;
      color: #94a3b8;
      margin: 0;
      line-height: 1.4;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
      margin: 6px 0;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; }

    .card {
      background: rgba(17, 24, 39, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px 14px;
      backdrop-filter: blur(8px);
    }

    .card-highlight {
      border-color: rgba(59, 130, 246, 0.4);
      background: linear-gradient(145deg, rgba(30, 58, 138, 0.22) 0%, rgba(17, 24, 39, 0.82) 100%);
    }

    .card-danger {
      border-color: rgba(239, 68, 68, 0.4);
      background: linear-gradient(145deg, rgba(127, 29, 29, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%);
    }

    .card-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 10.5pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .card-text {
      font-size: 8.2pt;
      color: #cbd5e1;
      line-height: 1.48;
      margin: 0;
    }

    .pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .pill-blue { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); }
    .pill-red { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .pill-green { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .pill-amber { background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.4); }

    .slide-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
    .slide-table th { background: rgba(30, 41, 59, 0.85); color: #f8fafc; text-align: left; padding: 6px 9px; font-weight: 700; border-bottom: 2px solid #334155; }
    .slide-table td { padding: 6px 9px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; vertical-align: top; }
    .slide-table tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }

    .stat-box { text-align: center; padding: 10px 8px; }
    .stat-number { font-family: 'Google Sans', sans-serif; font-size: 24pt; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 7.8pt; color: #94a3b8; font-weight: 500; }

    .step-box {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 9px 11px;
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
      padding-top: 7px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
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
      padding: 16px 36px;
    }

    .cover-title-big {
      font-family: 'Google Sans', sans-serif;
      font-size: 32pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      margin: 12px 0 10px 0;
      letter-spacing: -1px;
    }

    .cover-title-big span {
      background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-desc-big {
      font-size: 10.5pt;
      color: #94a3b8;
      max-width: 780px;
      line-height: 1.55;
      margin: 0 auto 20px auto;
    }

    .tech-badges-row { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; max-width: 860px; }
    code { font-family: 'Roboto Mono', monospace; font-size: 7.5pt; color: #93c5fd; background: rgba(30,41,59,0.7); padding: 1px 4px; border-radius: 3px; }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Enterprise Edition v2.5 (Hardened)</span>
      </div>
      <span class="slide-num">01 / 10</span>
    </div>

    <div class="cover-container">
      <div class="pill pill-blue" style="font-size: 8.5pt; padding: 4px 12px; margin-bottom: 10px;">
        Google Cloud Zero-Trust AI Security & ISO/IEC 42001 AIMS Governance Platform
      </div>
      <h1 class="cover-title-big">
        Assurance, Governance &<br><span>Continuous AI Auditing</span>
      </h1>
      <p class="cover-desc-big">
        End-to-end platform to assess, audit, and harden Enterprise Artificial Intelligence Architectures (GenAI, LLMs, Autonomous Agents, MCP & RAG) under global standards <strong>OWASP AI-SVS v1.0 (Level L2/L3)</strong> and <strong>ISO/IEC 42001:2023</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">OWASP AI-SVS v1.0 (12 Chapters)</span>
        <span class="pill pill-blue">ISO/IEC 42001:2023 AIMS</span>
        <span class="pill pill-green">Cloud IAP Zero-Trust Edge (C04.3)</span>
        <span class="pill pill-amber">Vertex AI Gemini 3.8 Flash (Keyless ADC)</span>
        <span class="pill pill-green">SHA-256 Normative Integrity (C01.4)</span>
        <span class="pill pill-blue">Crescendo Guardrails (C02.10) & Anti-DoW (C11.1)</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise Assurance Platform</span>
      <span>Apache License 2.0 • Open Source • Cloud Run + Vertex AI + Firestore</span>
      <span>October 2026</span>
    </div>
  </div>

  <!-- SLIDE 2: THE PROBLEM -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Risk Landscape</span>
      </div>
      <span class="slide-num">02 / 10</span>
    </div>

    <div class="title-block">
      <span class="slide-category">The Problem to Solve</span>
      <h2 class="slide-title">The Critical Security Blindspot in Enterprise GenAI Adoption</h2>
      <p class="slide-subtitle">Enterprises are shipping generative AI models, agentic workflows, MCP tools, and RAG pipelines without architectural verification or ISO 42001 governance.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Accelerated Ungoverned Deployment</div>
          <p class="card-text"><strong>13% of organizations</strong> already reported breaches of AI models or applications, and <strong>97%</strong> of those lacked proper AI access controls (IBM, 2025).</p>
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

  <!-- SLIDE 3: IMPACT OF NEGLECT -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Consequence Analysis</span>
      </div>
      <span class="slide-num">03 / 10</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Impact of Inaction</span>
      <h2 class="slide-title">The Real Cost of Neglecting Proactive AI Assurance</h2>
      <p class="slide-subtitle">Operating unverified AI systems exposes organizations to severe financial, regulatory, and operational liabilities.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #ef4444;">€35M</div>
          <div class="stat-label">or 7% of global annual turnover in statutory <strong>EU AI Act</strong> penalties</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #f59e0b;">$4.88M</div>
          <div class="stat-label">Average global cost of an enterprise data breach (IBM Security 2024)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">13%</div>
          <div class="stat-label">of organizations reported breaches of AI models or apps (IBM 2025)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">97%</div>
          <div class="stat-label">of those lacked proper AI access controls (IBM 2025)</div>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Exfiltration of Secrets, IMDS & PII</div>
          <p class="card-text">Multi-turn crescendo jailbreaks and SSRF payloads engineered to extract cloud metadata (<code>169.254.169.254</code>), API keys, or cross-tenant records when pre-retrieval ACLs (<code>C08.1</code>) are absent.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Regulatory Injunctions & Non-Conformity</div>
          <p class="card-text">Failure to demonstrate ISO/IEC 42001 AIMS controls, GDPR/LFPDPPP ARCO cascading deletion, or LFPC Art. 56 cooling-off mechanisms triggers mandatory shutdowns and statutory fines.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Unappealable Algorithmic Harm</div>
          <p class="card-text">Hallucinated compliance verdicts or biased automated decisions without human-in-the-loop appeal channels (<code>ISO 42001 A.5.2</code>) or ethics whistleblowing (<code>A.3.3</code>) erode institutional trust.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Impact & Business Continuity Analysis</span>
      <span>Criteria aligned with ISO/IEC 42001:2023 Clause 6 & Annex A.5</span>
    </div>
  </div>

  <!-- SLIDE 4: HOW WE SOLVE IT -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Value Proposition</span>
      </div>
      <span class="slide-num">04 / 10</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Our Solution</span>
      <h2 class="slide-title">AegisAI: Comprehensive & Automated AI Assurance</h2>
      <p class="slide-subtitle">Transforming AI security and ISO 42001 governance auditing from weeks of manual review into deterministic, evidence-backed verification.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;"><span>🛡</span> Shift-Left Multi-Standard Verification</div>
          <p class="card-text" style="font-size: 8.5pt; margin-bottom: 6px;">
            AegisAI inspects architecture documents, PDFs, ZIP bundles, microservice specs, and live GCP telemetry against <strong>OWASP AI-SVS v1.0</strong> and <strong>ISO/IEC 42001:2023</strong> simultaneously.
          </p>
          <ul style="font-size: 7.8pt; color: #cbd5e1; margin: 0; padding-left: 16px; line-height: 1.45;">
            <li>Deterministic Map-Reduce evaluation with strict chapter enum schemas (<code>buildBatchChaptersSchema</code>).</li>
            <li>Mandatory verbatim citation grounding (<code>textoEvidencia</code> & <code>fuenteEvidencia</code>).</li>
            <li>Pre-inference DLP masking and C02.10 multi-turn crescendo prompt injection blocking.</li>
          </ul>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #34d399;"><span>⚡</span> 100% Remediated Architecture & Full Cookbook</div>
          <p class="card-text" style="font-size: 8.5pt; margin-bottom: 6px;">
            Beyond diagnostics, AegisAI synthesizes a complete <strong>Drop-in Replacement Architecture Specification</strong> (Section 3) plus a full, untruncated <strong>Patch Cookbook</strong> (Section 4) for every finding.
          </p>
          <ul style="font-size: 7.8pt; color: #cbd5e1; margin: 0; padding-left: 16px; line-height: 1.45;">
            <li>Renders all <code>1..N</code> non-passing controls without truncation, even on 35+ finding multi-standard audits.</li>
            <li>Sentence-boundary summary extraction and accurate syntax tags (<code>typescript</code>, <code>hcl</code>, <code>yaml</code>, <code>python</code>, <code>bash</code>).</li>
            <li>Executive PDF & Markdown exports ready for certification auditors and engineering teams.</li>
          </ul>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 12px;">
        <div class="card">
          <div class="card-title">1. Cryptographic Integrity (C01.4)</div>
          <p class="card-text">Normative snapshots verified at startup against a SHA-256 manifest (<code>integrity-manifest.json</code>).</p>
        </div>
        <div class="card">
          <div class="card-title">2. Keyless GCP Live Scanner (C05.2)</div>
          <p class="card-text">Read-only inspection of Vertex AI, Cloud Run, IAM & Secret Manager using ephemeral caller credentials.</p>
        </div>
        <div class="card">
          <div class="card-title">3. Continuous AIMS Telemetry (C08.4)</div>
          <p class="card-text">Real-time KPI tracking of citation grounding coverage, JSON schema fidelity, and control posture.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Shift-Left AI Security Paradigm</span>
      <span>Designed for CISOs, Cloud Architects, AIMS Officers & MLOps Engineers</span>
    </div>
  </div>

  <!-- SLIDE 5: COMPLIANCE MATRIX -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Governance & Standards</span>
      </div>
      <span class="slide-num">05 / 10</span>
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
            <td><span class="pill pill-green">54 controls</span></td>
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

  <!-- SLIDE 6: TECHNICAL ARCHITECTURE -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">System Engineering</span>
      </div>
      <span class="slide-num">06 / 10</span>
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
            • Firebase Auth OAuth 2.0 domain allowlist (<code>google.com</code>, <code>example.com</code>)<br>
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

  <!-- SLIDE 7: PRACTICAL WORKFLOW -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Operational Flow</span>
      </div>
      <span class="slide-num">07 / 10</span>
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

  <!-- SLIDE 8: TECH SPECS & BENCHMARKS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Technical Specs</span>
      </div>
      <span class="slide-num">08 / 10</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Architecture Specs & DevSecOps Verification</span>
      <h2 class="slide-title">Verified Security Benchmarks & Production Posture</h2>
      <p class="slide-subtitle">Continuously validated through automated Firestore rules tests, OWASP AI-SVS verification harnesses, and Cloud Run preflight checks.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">308/308</div>
          <div class="stat-label">Cloud Firestore Security Rules unit tests passed (<code>projects:test</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">6 / 6</div>
          <div class="stat-label">Normative snapshots verified via <strong>SHA-256</strong> manifest at startup (<code>C01.4</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">0</div>
          <div class="stat-label">Leaked secrets or broad IAM roles (<code>roles/viewer</code> pruned, <code>C05.2</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #34d399;">100%</div>
          <div class="stat-label">Untruncated patch cookbook generation across all 35+ multi-standard controls</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Hardened Cloud Run & Container Posture</div>
          <p class="card-text" style="font-size: 8.2pt;">
            • <strong>Immutable Container (C04.1):</strong> Non-root <code>aegisuser</code> with <code>chmod -R a-w /app</code>.<br>
            • <strong>Zero-Trust Perimeter (C04.3):</strong> Cloud IAP + <code>--no-allow-unauthenticated</code> + VPC private egress + SSRF/IMDS blocker.<br>
            • <strong>Secret Manager & Constant-Time Auth (C05.3):</strong> Mounted <code>ADMIN_API_TOKEN</code> verified via SHA-256 + <code>crypto.timingSafeEqual</code>.<br>
            • <strong>Anti-DoW FinOps Protection (C11.1):</strong> Per-user sliding-window rate limits, concurrency caps (3), and 500k 24h token budgets.
          </p>
        </div>

        <div class="card">
          <div class="card-title">Observability, Privacy & AIMS Governance</div>
          <p class="card-text" style="font-size: 8.2pt;">
            • <strong>Structured Cloud Logging (C12.2):</strong> Real-time <code>WARNING</code>/<code>CRITICAL</code> alerts (<code>aegis-security-alerting-c12-2</code>).<br>
            • <strong>Continuous AIMS Telemetry (C08.4 / Clause 9.1):</strong> Live citation grounding & schema fidelity metrics at <code>/api/admin/aims-telemetry</code>.<br>
            • <strong>Zero Data Retention (ZDR):</strong> Vertex AI enterprise privacy guarantees.<br>
            • <strong>Bilingual Documentation Suite:</strong> 8 English & 8 Spanish Manuals + ISO 42001 AIMS Manual compiled to PDF.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Technical Benchmarks & QA Telemetry</span>
      <span>Verified on Node.js 22 / TypeScript 5.8 / Google Cloud Run</span>
    </div>
  </div>

  <!-- SLIDE 9: OWASP AI-SVS & ISO 42001 DEFENSE-IN-DEPTH MATRIX -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Defense-in-Depth Matrix</span>
      </div>
      <span class="slide-num">09 / 10</span>
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

  <!-- SLIDE 10: ROADMAP -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Strategic Vision</span>
      </div>
      <span class="slide-num">10 / 10</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolution & Roadmap</span>
      <h2 class="slide-title">Next Horizons in AegisAI Platform Engineering</h2>
      <p class="slide-subtitle">Our forward-looking roadmap to advance autonomous enterprise AI assurance and regulatory automation.</p>
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
          <span>🎯</span> Conclusion: Security & Governance that Accelerate Innovation
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          AegisAI provides the <strong>architectural certainty, cryptographic integrity, and ISO/IEC 42001 governance</strong> needed for enterprises to deploy frontier AI systems on Google Cloud with complete confidence.
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

temp_html_path = "/tmp/aegis_presentation_en.html"
with open(temp_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

os.makedirs("docs/Manuals_english/pdf", exist_ok=True)

output_pdf_eng = "docs/Manuals_english/pdf/AegisAI_Executive_Presentation.pdf"

cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{output_pdf_eng}" --no-pdf-header-footer "{temp_html_path}"'
subprocess.run(cmd, shell=True, check=True)

size_kb = os.path.getsize(output_pdf_eng) / 1024
print("English Presentation PDF successfully created at:")
print(f" -> {output_pdf_eng} ({size_kb:.1f} KB)")
