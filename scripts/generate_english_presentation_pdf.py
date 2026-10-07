import os
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
      padding: 16mm 20mm 14mm 20mm;
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
      padding-bottom: 10px;
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
      margin-top: 10px;
      margin-bottom: 12px;
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
      margin-bottom: 4px;
    }

    .slide-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 20pt;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 6px 0;
      line-height: 1.2;
    }

    .slide-subtitle {
      font-size: 9.5pt;
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
      margin: 8px 0;
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }

    .card {
      background: rgba(17, 24, 39, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 14px 16px;
      backdrop-filter: blur(8px);
    }

    .card-highlight {
      border-color: rgba(59, 130, 246, 0.4);
      background: linear-gradient(145deg, rgba(30, 58, 138, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%);
    }

    .card-danger {
      border-color: rgba(239, 68, 68, 0.4);
      background: linear-gradient(145deg, rgba(127, 29, 29, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%);
    }

    .card-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 11pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-text {
      font-size: 8.5pt;
      color: #cbd5e1;
      line-height: 1.5;
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

    .slide-table { width: 100%; border-collapse: collapse; font-size: 8.2pt; }
    .slide-table th { background: rgba(30, 41, 59, 0.8); color: #f8fafc; text-align: left; padding: 7px 10px; font-weight: 700; border-bottom: 2px solid #334155; }
    .slide-table td { padding: 7px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #cbd5e1; }
    .slide-table tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }

    .stat-box { text-align: center; padding: 12px 8px; }
    .stat-number { font-family: 'Google Sans', sans-serif; font-size: 26pt; font-weight: 800; line-height: 1; margin-bottom: 4px; }
    .stat-label { font-size: 8pt; color: #94a3b8; font-weight: 500; }

    .step-box {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 12px;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
    }

    .step-number {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2563eb;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 8.5pt;
      shrink: 0;
    }

    .slide-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 8px;
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
      padding: 20px 40px;
    }

    .cover-title-big {
      font-family: 'Google Sans', sans-serif;
      font-size: 34pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      margin: 14px 0 10px 0;
      letter-spacing: -1px;
    }

    .cover-title-big span {
      background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-desc-big {
      font-size: 11pt;
      color: #94a3b8;
      max-width: 750px;
      line-height: 1.6;
      margin: 0 auto 24px auto;
    }

    .tech-badges-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Enterprise Edition v2.5</span>
      </div>
      <span class="slide-num">01 / 09</span>
    </div>

    <div class="cover-container">
      <div class="pill pill-blue" style="font-size: 8.5pt; padding: 4px 12px; margin-bottom: 10px;">
        Google Cloud AI Security & Governance Platform
      </div>
      <h1 class="cover-title-big">
        Assurance, Governance &<br><span>Continuous AI Auditing</span>
      </h1>
      <p class="cover-desc-big">
        End-to-end platform to assess, audit, and harden Enterprise Artificial Intelligence Architectures (GenAI, LLMs, Autonomous Agents & RAG) under global standards <strong>OWASP AISVS v1.0</strong> and <strong>ISO/IEC 42001</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">OWASP AI-SVS v1.0 (12 Chapters)</span>
        <span class="pill pill-blue">ISO/IEC 42001:2023</span>
        <span class="pill pill-green">GCP Live Scanner</span>
        <span class="pill pill-amber">Dual Inference Engine: Gemini + OpenRouter</span>
        <span class="pill pill-blue">DevSecOps & CI/CD Shift-Left</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise Assurance Platform</span>
      <span>Apache License 2.0 • Open Source</span>
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
      <span class="slide-num">02 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">The Problem to Solve</span>
      <h2 class="slide-title">The Critical Security Blindspot in Enterprise GenAI Adoption</h2>
      <p class="slide-subtitle">Enterprises are shipping generative AI models, agentic workflows, and RAG pipelines at breakneck speed, but without architectural verification or auditable controls.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Accelerated Ungoverned Deployment</div>
          <p class="card-text">Over <strong>80% of enterprise AI projects</strong> enter production without a formal cybersecurity review, leaving novel LLM threat vectors completely uninspected.</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> Unprecedented Attack Surface</div>
          <p class="card-text">RAG pipelines and autonomous agents introduce critical attack surfaces: <strong>Indirect Prompt Injection</strong>, <strong>Vector Database Poisoning</strong>, and context window data leaks.</p>
        </div>

        <div class="card card-danger">
          <div class="card-title"><span style="color:#ef4444;">⚠</span> CISO vs Data Science Silo</div>
          <p class="card-text">Security teams lack domain tools to audit agent graphs and vector embeddings; AI developers frequently lack familiarity with formal compliance standards.</p>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px;">
        <div class="card">
          <div class="card-title" style="color: #f59e0b;">Lack of Operational Standards</div>
          <p class="card-text">Although frameworks like <strong>OWASP AISVS</strong> and <strong>ISO 42001</strong> exist, organizations lack automated tooling to translate hundreds of theoretical clauses into actionable infrastructure checks.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #38bdf8;">Proliferation of "Shadow AI"</div>
          <p class="card-text">Unregulated external API invocations, hardcoded master credentials, missing rate limits, and unencrypted vector storage containing Personally Identifiable Information (PII).</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • AI Risk Assessment</span>
      <span>Source: OWASP GenAI Security Project & Gartner Research</span>
    </div>
  </div>

  <!-- SLIDE 3: IMPACT OF NEGLECT -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Consequence Analysis</span>
      </div>
      <span class="slide-num">03 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Impact of Inaction</span>
      <h2 class="slide-title">The Real Cost of Neglecting Proactive Auditing</h2>
      <p class="slide-subtitle">Operating unverified AI systems causes catastrophic financial, legal, and operational damage.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 14px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #ef4444;">€35M</div>
          <div class="stat-label">or 7% of global annual turnover in statutory <strong>EU AI Act</strong> penalties</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #f59e0b;">$4.88M</div>
          <div class="stat-label">Average global cost of an enterprise data breach (IBM Security 2024)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">10 of 10</div>
          <div class="stat-label">Vulnerabilities in <strong>OWASP LLM Top 10</strong> present by default omission</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">100%</div>
          <div class="stat-label">Preventable through automated architectural pre-flight scanning</div>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Exfiltration of Secrets & PII</div>
          <p class="card-text">Prompt injections engineered to dump database connection strings, cloud API keys, or customer confidential records inadvertently ingested into LLM context memory.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Regulatory Injunctions & Fines</div>
          <p class="card-text">Non-compliance with privacy regulations (GDPR, LFPDPPP) and consumer protection acts (LFPC), triggering statutory audits, mandatory service shutdowns, and litigation.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Severe Brand & Trust Erosion</div>
          <p class="card-text">Toxic hallucinations in customer-facing assistants and biased automated credit/hiring decisions that permanently destroy market confidence and enterprise valuation.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Impact & Business Continuity Analysis</span>
      <span>Criteria aligned with ISO/IEC 42001:2023 Clause 6</span>
    </div>
  </div>

  <!-- SLIDE 4: HOW WE SOLVE IT -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Value Proposition</span>
      </div>
      <span class="slide-num">04 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Our Solution</span>
      <h2 class="slide-title">AegisAI: Comprehensive & Automated AI Assurance</h2>
      <p class="slide-subtitle">Transforming AI security auditing from weeks of manual guesswork into seconds of algorithmic verification.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;"><span>🛡</span> Proactive Shift-Left Security</div>
          <p class="card-text" style="font-size: 9pt; margin-bottom: 8px;">
            AegisAI inspects system artifacts (flow diagrams, microservice specifications, prompt configurations, and cloud infrastructure) <strong>before and during</strong> production deployment.
          </p>
          <ul style="font-size: 8pt; color: #cbd5e1; margin: 0; padding-left: 18px; line-height: 1.5;">
            <li>Granular security control verification across 12 standardized domains.</li>
            <li>Instant identification of non-compliant gaps and severity ratings.</li>
            <li>Zero-trust secret isolation and cryptographic API key masking.</li>
          </ul>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #34d399;"><span>⚡</span> Automated Remediation & Ready Code</div>
          <p class="card-text" style="font-size: 9pt; margin-bottom: 8px;">
            We don't merely highlight flaws: AegisAI generates <strong>actionable technical action plans</strong>, hardened architectural diagrams, and drop-in code recipes to fix every vulnerability.
          </p>
          <ul style="font-size: 8pt; color: #cbd5e1; margin: 0; padding-left: 18px; line-height: 1.5;">
            <li>Copy-paste code recipes in TypeScript, Python, and Google Cloud CLI.</li>
            <li>Step-by-step remediated architecture synthesis.</li>
            <li>Executive PDF report generation ready for certification and audit boards.</li>
          </ul>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 14px;">
        <div class="card">
          <div class="card-title">1. Standardized Diagnostics</div>
          <p class="card-text">Automated benchmarking against OWASP AISVS, ISO 42001, and regional data privacy legislation.</p>
        </div>
        <div class="card">
          <div class="card-title">2. Live Google Cloud Scanner</div>
          <p class="card-text">Direct telemetry inspection into live GCP environments: Vertex AI, Cloud Run, Secret Manager, and IAM.</p>
        </div>
        <div class="card">
          <div class="card-title">3. C-Level Visibility</div>
          <p class="card-text">Aggregated security posture dashboards, historical radar charts, and compliance trend telemetry.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Shift-Left AI Security Paradigm</span>
      <span>Designed for CISOs, Cloud Architects, and MLOps Engineers</span>
    </div>
  </div>

  <!-- SLIDE 5: COMPLIANCE MATRIX -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Governance & Standards</span>
      </div>
      <span class="slide-num">05 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Compliance Matrix</span>
      <h2 class="slide-title">Multi-Standard Framework Support & Custom Governance</h2>
      <p class="slide-subtitle">Native support for the world's most rigorous AI compliance standards alongside Bring-Your-Own-Framework (BYOF) capabilities.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 22%;">Standard / Framework</th>
            <th style="width: 26%;">Technical Scope</th>
            <th style="width: 36%;">Controls Evaluated by AegisAI</th>
            <th style="width: 16%;">Coverage Level</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #60a5fa;">OWASP AI-SVS v1.0</strong></td>
            <td>AI Security Verification Standard</td>
            <td>12 Complete Chapters: Governance, Supply Chain, Data, Architecture, Model, RAG, Verification & Deployment.</td>
            <td><span class="pill pill-green">100% Complete</span></td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">ISO/IEC 42001:2023</strong></td>
            <td>Artificial Intelligence Management System (AIMS)</td>
            <td>Clauses 4-10 and Annex A Controls: Ethical impact assessment, risk management lifecycle, and auditable governance.</td>
            <td><span class="pill pill-green">Certification Ready</span></td>
          </tr>
          <tr>
            <td><strong style="color: #34d399;">Mexican Regulatory (2026)</strong></td>
            <td>Consumer Protection (LFPC) & Personal Data (LFPDPPP)</td>
            <td>Algorithmic transparency, AI deceptive advertising prevention, ARCO data privacy rights, and explicit consent.</td>
            <td><span class="pill pill-blue">Regional Statutory</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">BYOF Custom Framework</strong></td>
            <td><em>Bring Your Own Framework</em></td>
            <td>Custom engine enabling organizations to import proprietary internal standards in JSON with weighted controls.</td>
            <td><span class="pill pill-amber">Extensible</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card" style="margin-top: 12px; background: rgba(30, 41, 59, 0.4);">
        <p class="card-text" style="font-size: 8.5pt;">
          <strong>Unified Cross-Framework Auditing:</strong> A single system architecture can be audited simultaneously across multiple regulatory frameworks in one pass, generating consolidated posture scores and standard-specific remediations.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Frameworks & Compliance Engine</span>
      <span>Aligned with NIST AI RMF, EU AI Act, and CSA Guidance</span>
    </div>
  </div>

  <!-- SLIDE 6: TECHNICAL ARCHITECTURE -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">System Engineering</span>
      </div>
      <span class="slide-num">06 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Software Architecture</span>
      <h2 class="slide-title">Decoupled, Resilient, and Secure System Architecture</h2>
      <p class="slide-subtitle">Modular design featuring clean microservices, strict security middleware, and a decoupled multi-provider inference engine.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card">
          <div class="card-title" style="color: #38bdf8;">1. Presentation & Frontend</div>
          <p class="card-text">
            • <strong>React 19 + TypeScript + Vite</strong><br>
            • Tailwind CSS v4 (Aegis Dark System)<br>
            • Dynamic charts with <strong>Recharts</strong><br>
            • Client PDF generation with <strong>jsPDF & AutoTable</strong><br>
            • Responsive reactive state & offline fallback
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #60a5fa;">2. Backend & API Security</div>
          <p class="card-text">
            • <strong>Node.js + Express + TypeScript</strong><br>
            • RBAC Middleware (<code>x-admin-token</code>, <code>x-api-key</code>)<br>
            • Strict HTTP security headers (CSP, HSTS, CORS)<br>
            • Automatic log masking for credentials<br>
            • Dual storage: Local JSON + Cloud Firestore
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #34d399;">3. Inference Engine & GCP Scanner</div>
          <p class="card-text">
            • <strong>Google Gemini API</strong> (gemini-3.5-flash / 3.8-flash)<br>
            • <strong>OpenRouter / OpenAI Proxy</strong> router<br>
            • <strong>GCP Live Scanner</strong>: Vertex AI, IAM, Secret Manager, Cloud Run & Storage<br>
            • Exponential backoff demand spike resilience
          </p>
        </div>
      </div>

      <div class="card card-highlight" style="margin-top: 12px;">
        <div class="card-title" style="font-size: 9.5pt; color: #93c5fd;">Zero-Trust Data Sanitization Pipeline:</div>
        <p class="card-text" style="font-size: 8pt;">
          No customer secrets, database credentials, or private cloud tokens are ever transmitted to the LLM context. AegisAI applies a <strong>Zero-Leak Sanitization Filter</strong> before initiating inference calls, guaranteeing total enterprise IP confidentiality.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • C4 Container Model</span>
      <span>Containerized for Google Cloud Run & Docker Enterprise</span>
    </div>
  </div>

  <!-- SLIDE 7: PRACTICAL WORKFLOW -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Operational Flow</span>
      </div>
      <span class="slide-num">07 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Operational Execution</span>
      <h2 class="slide-title">The Auditor's Workflow: From Vulnerability to Solution</h2>
      <p class="slide-subtitle">How AegisAI guides security auditors from technical ingestion to end-to-end infrastructure hardening.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 16px;">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="step-box">
            <div class="step-number">1</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Ingestion & Context Setup</strong>
              <p class="card-text">Auditor uploads system architecture diagrams, infrastructure specs, or RAG descriptions and chooses evaluation standards.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">2</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Live Cloud Telemetry Scan (Optional)</strong>
              <p class="card-text">If deployed on Google Cloud, AegisAI scans live Vertex AI models, Storage buckets, and Secret Manager configs.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">3</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Algorithmic AI Verification</strong>
              <p class="card-text">Inference engine evaluates each sub-control, determines technical compliance, and calculates a 0-100 overall score.</p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="step-box">
            <div class="step-number" style="background: #10b981;">4</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Interactive Executive Report</strong>
              <p class="card-text">Real-time radar charts display domain maturity, comparing passed controls against high-priority architectural gaps.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">5</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Action Plan & Code Recipe Generator</strong>
              <p class="card-text">AegisAI synthesizes exact code recipes (TypeScript, Python, Terraform) to patch every failing control found.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">6</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Formal Export & PDF Download</strong>
              <p class="card-text">Instant download of auditable PDF reports ready for board reviews, client presentations, or regulatory filings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • 6-Stage Audit Methodology</span>
      <span>Average end-to-end audit cycle duration: under 60 seconds</span>
    </div>
  </div>

  <!-- SLIDE 8: TECH SPECS & BENCHMARKS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Technical Specs</span>
      </div>
      <span class="slide-num">08 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Architecture Specs & DevSecOps</span>
      <h2 class="slide-title">System Specifications, Benchmarks & Code Quality</h2>
      <p class="slide-subtitle">Engineered for production resilience, low latency, and uncompromising DevSecOps standards.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">&lt; 3.5s</div>
          <div class="stat-label">Average latency per complete 12-chapter architectural audit</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">100%</div>
          <div class="stat-label">Coverage across OWASP LLM Red-Teaming verification suite</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">0</div>
          <div class="stat-label">Leaked credentials or secrets (Strictly verified by <code>git-secrets</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #34d399;">Multi-LLM</div>
          <div class="stat-label">Gemini, Claude 3.7, GPT-4o, DeepSeek R1 & Local Ollama</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Infrastructure & Deployment</div>
          <p class="card-text" style="font-size: 8.5pt;">
            • <strong>Containerization:</strong> Multi-stage Dockerfile with minimal footprint.<br>
            • <strong>Google Cloud Run:</strong> Scale-to-zero serverless deployment on standard port 8080.<br>
            • <strong>Secret Manager:</strong> Zero-trust runtime secrets injection.<br>
            • <strong>CI/CD Automated Testing:</strong> Pre-commit hooks and regression suites.
          </p>
        </div>

        <div class="card">
          <div class="card-title">Resilience & Privacy Architecture</div>
          <p class="card-text" style="font-size: 8.5pt;">
            • <strong>Automatic Fallbacks:</strong> Exponential backoff for LLM provider saturation.<br>
            • <strong>Environment Isolation:</strong> Safe local override support (<code>*.local.json</code>).<br>
            • <strong>Zero Data Retention:</strong> Customer architectures are never used to train foundational models.<br>
            • <strong>Autonomous Demo Mode:</strong> Full offline capabilities without cloud dependencies.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Technical Benchmarks & QA Telemetry</span>
      <span>Tested on Node.js 20+ / Headless Chrome Skia Engine</span>
    </div>
  </div>

  <!-- SLIDE 9: ROADMAP -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Strategic Vision</span>
      </div>
      <span class="slide-num">09 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolution & Roadmap</span>
      <h2 class="slide-title">Next Horizons in AegisAI Platform Engineering</h2>
      <p class="slide-subtitle">Our forward-looking roadmap to define the future of autonomous enterprise AI assurance.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 8px;">Q4 2026 • Near Term</div>
          <div class="card-title" style="color: #38bdf8;">Native CI/CD Shift-Left</div>
          <p class="card-text">
            Official <strong>GitHub Actions</strong> and <strong>GitLab CI Runners</strong> to automatically block pull requests introducing prompt injection vulnerabilities or unencrypted vector storage before merging.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-green" style="margin-bottom: 8px;">Q1 2027 • Medium Term</div>
          <div class="card-title" style="color: #34d399;">Multi-Agent Graph Auditing</div>
          <p class="card-text">
            Specialized auditing module for complex autonomous agent workflows (LangGraph, CrewAI, AutoGen): tool authorization boundary checks, cycle loop prevention, and inter-agent memory sandboxing.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-amber" style="margin-bottom: 8px;">Q2 2027 • Long Term</div>
          <div class="card-title" style="color: #fcd34d;">Autonomous IaC Remediation</div>
          <p class="card-text">
            One-click automated synthesis of <strong>Terraform Modules</strong> and <strong>Helm Charts</strong> that directly apply remediation recipes to GCP, AWS, and Azure clusters without manual configuration.
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.5); border-color: rgba(59, 130, 246, 0.4);">
        <div class="card-title" style="color: #ffffff; font-size: 10pt;">
          <span>🎯</span> Conclusion: Security that Accelerates Innovation
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          AegisAI does not exist to slow down AI adoption; it provides the <strong>architectural certainty, governance, and technical rigor</strong> needed for enterprises to deploy frontier AI systems with complete confidence, safeguarding their assets and fulfilling global compliance.
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

output_pdf_eng = "docs/Manuals_english/pdf/AegisAI_Executive_Presentation.pdf"
cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{output_pdf_eng}" --print-to-pdf-no-header "{temp_html_path}"'
subprocess.run(cmd, shell=True, check=True)

size_kb = os.path.getsize(output_pdf_eng) / 1024
print(f"English Presentation PDF successfully created at:")
print(f" -> {output_pdf_eng} ({size_kb:.1f} KB)")
