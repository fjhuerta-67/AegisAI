#!/usr/bin/env python3
"""
Generates the standalone Single-Slide Presentation (PDF + Editable 16:9 PPTX in EN & ES)
for AegisAI Deployment Options & Ecosystem Value Proposition (Customers, Partners, Google Cloud)
matching the exact visual styling of all AegisAI Enterprise presentations.
"""

import os
import shutil
import subprocess

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    Presentation = Inches = Pt = PP_ALIGN = MSO_ANCHOR = MSO_SHAPE = None
    def RGBColor(*args):
        return args

# =====================================================================
# 1. HTML / CSS TEMPLATE FOR HIGH-RESOLUTION VECTOR PDF (EN & ES)
# =====================================================================

CSS = """
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
      padding: 13mm 18mm 11mm 18mm;
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
      width: 420px;
      height: 420px;
      background: radial-gradient(circle, rgba(37,99,235,0.13) 0%, rgba(37,99,235,0) 70%);
      top: -110px;
      left: -110px;
      border-radius: 50%;
      pointer-events: none;
    }

    .slide::after {
      content: "";
      position: absolute;
      width: 460px;
      height: 460px;
      background: radial-gradient(circle, rgba(16,185,129,0.09) 0%, rgba(16,185,129,0) 70%);
      bottom: -130px;
      right: -130px;
      border-radius: 50%;
      pointer-events: none;
    }

    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding-bottom: 7px;
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
      margin-top: 5px;
      margin-bottom: 6px;
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
      font-size: 18pt;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 3px 0;
      line-height: 1.18;
    }

    .slide-subtitle {
      font-size: 8.6pt;
      color: #94a3b8;
      margin: 0;
      line-height: 1.35;
    }

    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 10;
      margin: 4px 0;
      gap: 9px;
    }

    /* Top Deployment Modes Strip */
    .deploy-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .deploy-badge-card {
      background: linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(17, 24, 39, 0.85) 100%);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 8px;
      padding: 7px 11px;
      display: flex;
      align-items: center;
      gap: 9px;
      position: relative;
      overflow: hidden;
    }

    .deploy-badge-card::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3.5px;
      border-radius: 3px 0 0 3px;
    }

    .deploy-blue::before { background: #38bdf8; }
    .deploy-emerald::before { background: #10b981; }
    .deploy-purple::before { background: #a855f7; }
    .deploy-amber::before { background: #f59e0b; }

    .deploy-icon {
      width: 28px;
      height: 28px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Roboto Mono', monospace;
      font-size: 8.5pt;
      font-weight: 700;
      flex-shrink: 0;
    }

    .deploy-meta-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 8.4pt;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 1px 0;
    }

    .deploy-meta-sub {
      font-size: 7.1pt;
      color: #94a3b8;
      margin: 0;
      line-height: 1.25;
    }

    /* 3-Column Stakeholder Matrix */
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      flex: 1;
    }

    .stakeholder-card {
      background: rgba(17, 24, 39, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 10px;
      padding: 11px 13px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .stakeholder-blue {
      border-color: rgba(56, 189, 248, 0.45);
      background: linear-gradient(155deg, rgba(30, 58, 138, 0.25) 0%, rgba(17, 24, 39, 0.88) 100%);
    }

    .stakeholder-emerald {
      border-color: rgba(16, 185, 129, 0.45);
      background: linear-gradient(155deg, rgba(6, 78, 59, 0.25) 0%, rgba(17, 24, 39, 0.88) 100%);
    }

    .stakeholder-purple {
      border-color: rgba(168, 85, 247, 0.48);
      background: linear-gradient(155deg, rgba(76, 29, 149, 0.25) 0%, rgba(17, 24, 39, 0.88) 100%);
    }

    .pill {
      display: inline-block;
      padding: 2.5px 8px;
      border-radius: 9999px;
      font-size: 6.7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }

    .pill-blue { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.45); }
    .pill-green { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.45); }
    .pill-purple { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.45); }
    .pill-amber { background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.45); }

    .stakeholder-title {
      font-family: 'Google Sans', sans-serif;
      font-size: 12pt;
      font-weight: 800;
      color: #ffffff;
      margin: 5px 0 6px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .deploy-box {
      background: rgba(9, 13, 22, 0.72);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 7px;
      padding: 7px 10px;
      margin-bottom: 8px;
    }

    .deploy-box-label {
      font-family: 'Roboto Mono', monospace;
      font-size: 6.7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 3px;
      display: block;
    }

    .deploy-box-text {
      font-size: 7.7pt;
      color: #e2e8f0;
      line-height: 1.38;
      margin: 0;
    }

    .benefits-label {
      font-family: 'Roboto Mono', monospace;
      font-size: 6.8pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 4px;
      display: block;
    }

    .benefit-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 5.5px;
    }

    .benefit-item {
      font-size: 7.75pt;
      color: #cbd5e1;
      line-height: 1.38;
      padding-left: 11px;
      position: relative;
    }

    .benefit-item::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      font-weight: 800;
    }

    .benefit-blue::before { color: #38bdf8; }
    .benefit-green::before { color: #34d399; }
    .benefit-purple::before { color: #c084fc; }

    .stakeholder-footer-tag {
      margin-top: 7px;
      padding-top: 6px;
      border-top: 1px solid rgba(255, 255, 255, 0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 7.1pt;
      color: #94a3b8;
    }

    .summary-banner {
      background: linear-gradient(90deg, rgba(30, 58, 138, 0.32) 0%, rgba(6, 78, 59, 0.28) 50%, rgba(76, 29, 149, 0.32) 100%);
      border: 1px solid rgba(59, 130, 246, 0.4);
      border-radius: 8px;
      padding: 8px 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .summary-banner-text {
      font-size: 7.9pt;
      color: #e2e8f0;
      margin: 0;
      line-height: 1.35;
    }

    code {
      font-family: 'Roboto Mono', monospace;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 7.0pt;
      color: #38bdf8;
      white-space: nowrap;
    }

    .slide-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 7.3pt;
      color: #64748b;
      position: relative;
      z-index: 10;
    }
"""


def get_slide_html_en(slide_num_str: str = "01 / 01") -> str:
    return f"""
  <!-- SLIDE: DEPLOYMENT OPTIONS & ECOSYSTEM VALUE PROPOSITION -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Deployment &amp; Ecosystem Value</span>
      </div>
      <span class="slide-num">{slide_num_str}</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Adoption Models &amp; Strategic Value Proposition</span>
      <h2 class="slide-title">Deployment Options &amp; Benefits for Customers, Partners &amp; Google Cloud</h2>
      <p class="slide-subtitle">Frictionless deployment—from GitHub, local workstations, and Google Cloud Run to Antigravity and <code>go/aegis.ai</code>—turning AI compliance and security into a strategic accelerator.</p>
    </div>

    <div class="slide-body">
      <!-- Top Strip: 4 Deployment Channels -->
      <div class="deploy-strip">
        <div class="deploy-badge-card deploy-blue">
          <div class="deploy-icon" style="background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.35);">GH</div>
          <div>
            <div class="deploy-meta-title">GitHub Repository</div>
            <p class="deploy-meta-sub">Deploy via GitHub repo or CI/CD<br><code>github.com/fjhuerta-67/AegisAI</code></p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-emerald">
          <div class="deploy-icon" style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.35);">LOC</div>
          <div>
            <div class="deploy-meta-title">Local &amp; Google Cloud</div>
            <p class="deploy-meta-sub">Run locally (Node/Docker) or serverless on <strong>Cloud Run + IAP + Firestore</strong></p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-amber">
          <div class="deploy-icon" style="background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.35);">AGY</div>
          <div>
            <div class="deploy-meta-title">Google Antigravity</div>
            <p class="deploy-meta-sub">Run directly on <strong>Antigravity</strong> for instant single-instance evaluation</p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-purple">
          <div class="deploy-icon" style="background: rgba(168,85,247,0.15); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.35);">GO/</div>
          <div>
            <div class="deploy-meta-title">Internal Google Cloud Hub</div>
            <p class="deploy-meta-sub">Centrally deployed at <code>go/aegis.ai</code> for Delta, PSO, GCC &amp; Sales teams</p>
          </div>
        </div>
      </div>

      <!-- 3-Column Stakeholder Matrix -->
      <div class="grid-3">
        <!-- COLUMN 1: CUSTOMERS -->
        <div class="stakeholder-card stakeholder-blue">
          <div>
            <span class="pill pill-blue">Enterprise &amp; Public Sector</span>
            <div class="stakeholder-title">
              <span style="color: #38bdf8;">1. Customers</span>
              <span style="font-size: 7.5pt; color: #93c5fd; font-weight: 600;">Self-Service Assurance</span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #38bdf8;">Deployment Options</span>
              <p class="deploy-box-text">
                • Deploy directly via <strong>GitHub repository</strong><br>
                • Run <strong>locally</strong> or on <strong>Google Cloud</strong> (Cloud Run)<br>
                • Run directly on <strong>Antigravity</strong> for single-instance use
              </p>
            </div>

            <span class="benefits-label" style="color: #93c5fd;">Key Benefits &amp; Strategic Value</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-blue">
                <strong>Immediate Access to Remediation &amp; In-Depth Pre-Audit:</strong> Instant architectural pre-audit of AI projects paired with copy-pasteable code &amp; IaC remediation recipes.
              </li>
              <li class="benefit-item benefit-blue">
                <strong>End-to-End Security &amp; Compliance:</strong> Automated verification against OWASP AI-SVS v1.0, ISO/IEC 42001:2023 (AIMS), and NIST AI RMF 1.0.
              </li>
              <li class="benefit-item benefit-blue">
                <strong>EU &amp; Local Regulatory Orientation:</strong> Clear, actionable guidance on how to comply with <strong>EU regulations (EU AI Act)</strong> and <strong>possible forthcoming local regulations</strong> (e.g., statutory data privacy &amp; consumer protection laws).
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Outcome: <strong>Audit-Ready AI Architecture</strong></span>
            <span class="pill pill-blue" style="font-size: 6pt;">Shift-Left Compliance</span>
          </div>
        </div>

        <!-- COLUMN 2: PARTNERS -->
        <div class="stakeholder-card stakeholder-emerald">
          <div>
            <span class="pill pill-green">GSI, MSP &amp; Advisory Ecosystem</span>
            <div class="stakeholder-title">
              <span style="color: #34d399;">2. Partners</span>
              <span style="font-size: 7.5pt; color: #6ee7b7; font-weight: 600;">SDLC &amp; Advisory Multiplier</span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #34d399;">Deployment Options</span>
              <p class="deploy-box-text">
                • <strong>Same deployment options as Customers:</strong><br>
                • Deploy via <strong>GitHub repo</strong>, run <strong>locally</strong> or on <strong>Google Cloud</strong>, or run directly on <strong>Antigravity</strong> for single-instance use
              </p>
            </div>

            <span class="benefits-label" style="color: #6ee7b7;">Key Benefits &amp; Strategic Value</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-green">
                <strong>Perform Internal Pre-Audits:</strong> Harden and certify the partner's own internal AI accelerators, agents, and proprietary IP prior to release.
              </li>
              <li class="benefit-item benefit-green">
                <strong>Customer Pre-Audits Embedded in SDLC:</strong> Perform continuous pre-audits for customers directly integrated into delivery pipelines and <strong>Software Development Lifecycles (SDLC)</strong>.
              </li>
              <li class="benefit-item benefit-green">
                <strong>Pre-Audits as a Service (Managed Offering):</strong> Package and monetize high-value AI governance, security readiness, and regulatory pre-audits as a repeatable consulting service.
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Outcome: <strong>Repeatable Assurance Revenue</strong></span>
            <span class="pill pill-green" style="font-size: 6pt;">Pre-Audit as a Service</span>
          </div>
        </div>

        <!-- COLUMN 3: GOOGLE CLOUD -->
        <div class="stakeholder-card stakeholder-purple">
          <div>
            <span class="pill pill-purple">Field, Delivery &amp; Sales</span>
            <div class="stakeholder-title">
              <span style="color: #c084fc;">3. Google Cloud</span>
              <span style="font-size: 7.5pt; color: #d8b4fe; font-weight: 600;">Internal Hub: <code>go/aegis.ai</code></span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #c084fc;">Deployment Option</span>
              <p class="deploy-box-text">
                • Centrally deployed and accessible at <code>go/aegis.ai</code><br>
                • Hardened on Google Cloud Run behind IAP with keyless Vertex AI ADC &amp; Firestore persistence
              </p>
            </div>

            <span class="benefits-label" style="color: #d8b4fe;">Key Benefits &amp; Strategic Value</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-purple">
                <strong>Delta / PSO / GCC Engagements:</strong> Perform structured technical pre-audits for customers as an accelerator within <strong>Delta</strong>, <strong>Professional Services (PSO)</strong>, and <strong>Google Cloud Consulting (GCC)</strong> engagements.
              </li>
              <li class="benefit-item benefit-purple">
                <strong>Sales-Led Customer Project Pre-Audits:</strong> Sales and Customer Engineering teams can evaluate customer AI architectures in minutes to uncover compliance &amp; security gaps.
              </li>
              <li class="benefit-item benefit-purple">
                <strong>Position Gemini Enterprise Products with Normative Proof:</strong> Position <strong>Gemini Enterprise &amp; GCP AI Protection products</strong> (Model Armor, Model Garden/Registry, AutoSxS, Model Monitoring, SCC AI) based on their direct impact and alignment with normative and regulatory obligations.
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Outcome: <strong>Consumption &amp; Enterprise Trust</strong></span>
            <span class="pill pill-purple" style="font-size: 6pt;">Gemini Enterprise Pull-Through</span>
          </div>
        </div>
      </div>

      <!-- Bottom Ecosystem Flywheel Banner -->
      <div class="summary-banner">
        <p class="summary-banner-text">
          <strong>Unified Value Flywheel:</strong> <strong>Customers</strong> achieve immediate remediation, security, and EU/local regulatory readiness ➔ <strong>Partners</strong> embed pre-audits across customer SDLCs and deliver Pre-Audits as a Service ➔ <strong>Google Cloud (<code>go/aegis.ai</code>)</strong> accelerates Delta/PSO/GCC delivery and positions <strong>Gemini Enterprise Products</strong> mapped directly to normative &amp; statutory obligations.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Deployment Options &amp; Ecosystem Value (Customers • Partners • Google Cloud)</span>
      <span>GitHub: github.com/fjhuerta-67/AegisAI • Antigravity • Google Cloud Run • Internal: go/aegis.ai</span>
    </div>
  </div>
"""


def get_slide_html_es(slide_num_str: str = "01 / 01") -> str:
    return f"""
  <!-- SLIDE: OPCIONES DE DESPLIEGUE Y VALOR PARA EL ECOSISTEMA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Despliegue y Valor del Ecosistema</span>
      </div>
      <span class="slide-num">{slide_num_str}</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Modelos de Adopción y Propuesta de Valor Estratégica</span>
      <h2 class="slide-title">Opciones de Despliegue y Beneficios para Clientes, Partners y Google Cloud</h2>
      <p class="slide-subtitle">Despliegue versátil—desde GitHub, entornos locales y Google Cloud Run hasta Antigravity y <code>go/aegis.ai</code>—transformando el cumplimiento y la seguridad de IA en un acelerador de negocio.</p>
    </div>

    <div class="slide-body">
      <!-- Top Strip: 4 Deployment Channels -->
      <div class="deploy-strip">
        <div class="deploy-badge-card deploy-blue">
          <div class="deploy-icon" style="background: rgba(56,189,248,0.15); color: #38bdf8; border: 1px solid rgba(56,189,248,0.35);">GH</div>
          <div>
            <div class="deploy-meta-title">Repositorio GitHub</div>
            <p class="deploy-meta-sub">Clonación y despliegue vía GitHub o CI/CD<br><code>github.com/fjhuerta-67/AegisAI</code></p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-emerald">
          <div class="deploy-icon" style="background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.35);">LOC</div>
          <div>
            <div class="deploy-meta-title">Local y Google Cloud</div>
            <p class="deploy-meta-sub">Ejecución local (Node/Docker) o serverless en <strong>Cloud Run + IAP + Firestore</strong></p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-amber">
          <div class="deploy-icon" style="background: rgba(245,158,11,0.15); color: #fcd34d; border: 1px solid rgba(245,158,11,0.35);">AGY</div>
          <div>
            <div class="deploy-meta-title">Google Antigravity</div>
            <p class="deploy-meta-sub">Ejecución directa en <strong>Antigravity</strong> para uso inmediato en instancia única</p>
          </div>
        </div>

        <div class="deploy-badge-card deploy-purple">
          <div class="deploy-icon" style="background: rgba(168,85,247,0.15); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.35);">GO/</div>
          <div>
            <div class="deploy-meta-title">Hub Interno Google Cloud</div>
            <p class="deploy-meta-sub">Desplegado centralmente en <code>go/aegis.ai</code> para Delta, PSO, GCC y Ventas</p>
          </div>
        </div>
      </div>

      <!-- 3-Column Stakeholder Matrix -->
      <div class="grid-3">
        <!-- COLUMN 1: CUSTOMERS -->
        <div class="stakeholder-card stakeholder-blue">
          <div>
            <span class="pill pill-blue">Empresas y Sector Público</span>
            <div class="stakeholder-title">
              <span style="color: #38bdf8;">1. Clientes</span>
              <span style="font-size: 7.5pt; color: #93c5fd; font-weight: 600;">Autogestión y Cumplimiento</span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #38bdf8;">Opciones de Despliegue</span>
              <p class="deploy-box-text">
                • Despliegue desde el <strong>repositorio de GitHub</strong><br>
                • Ejecución <strong>local</strong> o en <strong>Google Cloud</strong> (Cloud Run)<br>
                • Ejecución directa en <strong>Antigravity</strong> para uso en instancia única
              </p>
            </div>

            <span class="benefits-label" style="color: #93c5fd;">Beneficios Clave y Valor Estratégico</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-blue">
                <strong>Acceso Inmediato a Remediación y Pre-Auditoría Profunda:</strong> Diagnóstico arquitectónico exhaustivo de proyectos de IA con recetas de código e IaC listas para aplicar.
              </li>
              <li class="benefit-item benefit-blue">
                <strong>Cumplimiento y Seguridad Integral:</strong> Verificación automatizada frente a OWASP AI-SVS v1.0, ISO/IEC 42001:2023 (AIMS) y NIST AI RMF 1.0.
              </li>
              <li class="benefit-item benefit-blue">
                <strong>Orientación en Regulaciones UE y Locales:</strong> Guía práctica sobre cómo cumplir con las <strong>regulaciones de la UE (EU AI Act)</strong> y <strong>posibles regulaciones locales próximas</strong> (protección al consumidor, datos personales y gobernanza algorítmica).
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Resultado: <strong>IA Lista para Auditoría</strong></span>
            <span class="pill pill-blue" style="font-size: 6pt;">Cumplimiento Shift-Left</span>
          </div>
        </div>

        <!-- COLUMN 2: PARTNERS -->
        <div class="stakeholder-card stakeholder-emerald">
          <div>
            <span class="pill pill-green">Ecosistema GSI, MSP y Consultoría</span>
            <div class="stakeholder-title">
              <span style="color: #34d399;">2. Partners</span>
              <span style="font-size: 7.5pt; color: #6ee7b7; font-weight: 600;">Multiplicador SDLC y Servicios</span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #34d399;">Opciones de Despliegue</span>
              <p class="deploy-box-text">
                • <strong>Mismas opciones de despliegue que los Clientes:</strong><br>
                • Vía <strong>repositorio GitHub</strong>, ejecución <strong>local</strong> o en <strong>Google Cloud</strong>, o directamente en <strong>Antigravity</strong> para instancia única
              </p>
            </div>

            <span class="benefits-label" style="color: #6ee7b7;">Beneficios Clave y Valor Estratégico</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-green">
                <strong>Pre-Auditorías Internas:</strong> Evaluar y endurecer los propios aceleradores, agentes y activos de IA del partner antes de su lanzamiento.
              </li>
              <li class="benefit-item benefit-green">
                <strong>Pre-Auditorías para Clientes en su SDLC:</strong> Ejecutar pre-auditorías continuas para clientes integradas directamente como compuertas de calidad en su <strong>Ciclo de Vida de Desarrollo de Software (SDLC)</strong>.
              </li>
              <li class="benefit-item benefit-green">
                <strong>Pre-Auditorías como Servicio (As-a-Service):</strong> Empaquetar y comercializar servicios recurrentes de pre-auditoría regulatoria, seguridad y gobernanza de IA de alto valor.
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Resultado: <strong>Nuevos Servicios Gestionados</strong></span>
            <span class="pill pill-green" style="font-size: 6pt;">Pre-Auditoría como Servicio</span>
          </div>
        </div>

        <!-- COLUMN 3: GOOGLE CLOUD -->
        <div class="stakeholder-card stakeholder-purple">
          <div>
            <span class="pill pill-purple">Equipos de Campo, Delivery y Ventas</span>
            <div class="stakeholder-title">
              <span style="color: #c084fc;">3. Google Cloud</span>
              <span style="font-size: 7.5pt; color: #d8b4fe; font-weight: 600;">Hub Interno: <code>go/aegis.ai</code></span>
            </div>

            <div class="deploy-box">
              <span class="deploy-box-label" style="color: #c084fc;">Opción de Despliegue</span>
              <p class="deploy-box-text">
                • Desplegado centralmente en <code>go/aegis.ai</code><br>
                • Endurecido en Google Cloud Run tras IAP con Vertex AI ADC sin llaves y persistencia en Firestore
              </p>
            </div>

            <span class="benefits-label" style="color: #d8b4fe;">Beneficios Clave y Valor Estratégico</span>
            <ul class="benefit-list">
              <li class="benefit-item benefit-purple">
                <strong>Compromisos Delta / PSO / GCC:</strong> Realizar pre-auditorías técnicas para clientes como parte integral de compromisos de <strong>Delta</strong>, <strong>Professional Services (PSO)</strong> y <strong>Google Cloud Consulting (GCC)</strong>.
              </li>
              <li class="benefit-item benefit-purple">
                <strong>Pre-Auditorías por Equipos de Ventas:</strong> Los equipos comerciales y de ingeniería de clientes pueden auditar proyectos de IA de clientes para identificar brechas reales.
              </li>
              <li class="benefit-item benefit-purple">
                <strong>Posicionamiento de Productos Gemini Enterprise:</strong> Posicionar <strong>productos de Gemini Enterprise y Google Cloud AI Protection</strong> (Model Armor, Model Garden/Registry, AutoSxS, Model Monitoring, SCC AI) basándose en su impacto y alineación con obligaciones normativas y regulatorias.
              </li>
            </ul>
          </div>

          <div class="stakeholder-footer-tag">
            <span>Resultado: <strong>Adopción y Confianza Enterprise</strong></span>
            <span class="pill pill-purple" style="font-size: 6pt;">Posicionamiento Gemini Enterprise</span>
          </div>
        </div>
      </div>

      <!-- Bottom Ecosystem Flywheel Banner -->
      <div class="summary-banner">
        <p class="summary-banner-text">
          <strong>Sinergia del Ecosistema:</strong> <strong>Clientes</strong> obtienen remediación inmediata, seguridad y orientación frente a regulaciones de la UE y locales ➔ <strong>Partners</strong> integran pre-auditorías en el SDLC y ofrecen Pre-Auditorías como Servicio ➔ <strong>Google Cloud (<code>go/aegis.ai</code>)</strong> potencia compromisos Delta/PSO/GCC y posiciona <strong>Productos Gemini Enterprise</strong> alineados con obligaciones normativas y regulatorias.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Opciones de Despliegue y Valor del Ecosistema (Clientes • Partners • Google Cloud)</span>
      <span>GitHub: github.com/fjhuerta-67/AegisAI • Antigravity • Google Cloud Run • Interno: go/aegis.ai</span>
    </div>
  </div>
"""


# =====================================================================
# 2. EDITABLE POWERPOINT (.PPTX) BUILDER FOR THE SINGLE SLIDE (EN & ES)
# =====================================================================

BG_DARK = RGBColor(10, 14, 23)
CARD_BG = RGBColor(17, 24, 39)
CARD_BLUE_BG = RGBColor(18, 33, 66)
CARD_GREEN_BG = RGBColor(11, 46, 43)
CARD_PURPLE_BG = RGBColor(38, 24, 64)
INNER_BOX_BG = RGBColor(9, 13, 22)

BORDER_SUBTLE = RGBColor(45, 55, 72)
BORDER_BLUE = RGBColor(59, 130, 246)
BORDER_SKY = RGBColor(56, 189, 248)
BORDER_GREEN = RGBColor(16, 185, 129)
BORDER_AMBER = RGBColor(245, 158, 11)
BORDER_PURPLE = RGBColor(168, 85, 247)

TEXT_WHITE = RGBColor(255, 255, 255)
TEXT_LIGHT = RGBColor(226, 232, 240)
TEXT_MUTED = RGBColor(148, 163, 184)
TEXT_SKY = RGBColor(56, 189, 248)
TEXT_BLUE = RGBColor(96, 165, 250)
TEXT_GREEN = RGBColor(52, 211, 153)
TEXT_AMBER = RGBColor(251, 191, 36)
TEXT_PURPLE = RGBColor(216, 180, 254)


def add_deployment_ecosystem_pptx_slide(prs: Presentation, idx: int = 1, total: int = 1, lang: str = "en"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = BG_DARK

    # Header
    tb = slide.shapes.add_textbox(Inches(0.6), Inches(0.30), Inches(2.0), Inches(0.42))
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

    tag_text = "Deployment & Ecosystem Value" if lang == "en" else "Despliegue y Valor del Ecosistema"
    pill = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.85), Inches(0.33), Inches(3.4), Inches(0.30)
    )
    pill.fill.solid()
    pill.fill.fore_color.rgb = CARD_BLUE_BG
    pill.line.color.rgb = BORDER_BLUE
    pill.line.width = Pt(1)
    pp = pill.text_frame.paragraphs[0]
    pp.alignment = PP_ALIGN.CENTER
    pr = pp.add_run()
    pr.text = tag_text.upper()
    pr.font.name = "Arial"
    pr.font.size = Pt(8.5)
    pr.font.bold = True
    pr.font.color.rgb = TEXT_BLUE

    snum = slide.shapes.add_textbox(Inches(11.5), Inches(0.32), Inches(1.23), Inches(0.32))
    sp = snum.text_frame.paragraphs[0]
    sp.alignment = PP_ALIGN.RIGHT
    sr = sp.add_run()
    sr.text = f"{idx:02d} / {total:02d}"
    sr.font.name = "Courier New"
    sr.font.size = Pt(11)
    sr.font.bold = True
    sr.font.color.rgb = TEXT_MUTED

    line_top = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.72), Inches(12.133), Inches(0.015))
    line_top.fill.solid()
    line_top.fill.fore_color.rgb = BORDER_SUBTLE
    line_top.line.fill.background()

    # Title Block
    tb_title = slide.shapes.add_textbox(Inches(0.6), Inches(0.80), Inches(12.133), Inches(1.02))
    ttf = tb_title.text_frame
    ttf.word_wrap = True
    ttf.margin_left = ttf.margin_top = ttf.margin_right = ttf.margin_bottom = 0

    p_cat = ttf.paragraphs[0]
    r_cat = p_cat.add_run()
    r_cat.text = (
        "ADOPTION MODELS & STRATEGIC VALUE PROPOSITION"
        if lang == "en"
        else "MODELOS DE ADOPCIÓN Y PROPUESTA DE VALOR ESTRATÉGICA"
    )
    r_cat.font.name = "Arial"
    r_cat.font.size = Pt(9.0)
    r_cat.font.bold = True
    r_cat.font.color.rgb = TEXT_SKY

    p_t = ttf.add_paragraph()
    p_t.space_before = Pt(2)
    r_t = p_t.add_run()
    r_t.text = (
        "Deployment Options & Benefits for Customers, Partners & Google Cloud"
        if lang == "en"
        else "Opciones de Despliegue y Beneficios para Clientes, Partners y Google Cloud"
    )
    r_t.font.name = "Arial"
    r_t.font.size = Pt(20)
    r_t.font.bold = True
    r_t.font.color.rgb = TEXT_WHITE

    p_sub = ttf.add_paragraph()
    p_sub.space_before = Pt(2)
    r_sub = p_sub.add_run()
    r_sub.text = (
        "Flexible deployment—via GitHub repo, Local, Google Cloud, Antigravity, or go/aegis.ai—delivering immediate pre-audits, remediation, and regulatory alignment."
        if lang == "en"
        else "Despliegue flexible—vía GitHub, Local, Google Cloud, Antigravity o go/aegis.ai—con acceso inmediato a pre-auditorías, remediación y alineación regulatoria."
    )
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10.2)
    r_sub.font.color.rgb = TEXT_MUTED

    # Top 4 Deployment Badges Strip
    strip_items = (
        [
            ("GITHUB REPOSITORY", "Deploy via github.com/fjhuerta-67/AegisAI or CI/CD", BORDER_SKY, TEXT_SKY),
            ("LOCAL & GOOGLE CLOUD", "Run locally (Node/Docker) or on Cloud Run + IAP", BORDER_GREEN, TEXT_GREEN),
            ("GOOGLE ANTIGRAVITY", "Run directly on Antigravity for single-instance use", BORDER_AMBER, TEXT_AMBER),
            ("INTERNAL: go/aegis.ai", "Central Google Cloud hub for Delta / PSO / GCC & Sales", BORDER_PURPLE, TEXT_PURPLE),
        ]
        if lang == "en"
        else [
            ("REPOSITORIO GITHUB", "Despliegue vía github.com/fjhuerta-67/AegisAI o CI/CD", BORDER_SKY, TEXT_SKY),
            ("LOCAL Y GOOGLE CLOUD", "Ejecución local (Node/Docker) o en Cloud Run + IAP", BORDER_GREEN, TEXT_GREEN),
            ("GOOGLE ANTIGRAVITY", "Ejecución directa en Antigravity para instancia única", BORDER_AMBER, TEXT_AMBER),
            ("INTERNO: go/aegis.ai", "Hub central en Google Cloud para Delta / PSO / GCC y Ventas", BORDER_PURPLE, TEXT_PURPLE),
        ]
    )

    strip_w = 2.92
    strip_gap = 0.15
    for i, (st_title, st_sub, st_border, st_color) in enumerate(strip_items):
        left = 0.6 + i * (strip_w + strip_gap)
        box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(1.86), Inches(strip_w), Inches(0.64)
        )
        box.adjustments[0] = 0.08
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = st_border
        box.line.width = Pt(1.2)
        btf = box.text_frame
        btf.word_wrap = True
        btf.margin_left = Inches(0.12)
        btf.margin_right = Inches(0.10)
        btf.margin_top = Inches(0.07)
        btf.margin_bottom = Inches(0.05)

        bp1 = btf.paragraphs[0]
        br1 = bp1.add_run()
        br1.text = st_title
        br1.font.name = "Arial"
        br1.font.size = Pt(8.5)
        br1.font.bold = True
        br1.font.color.rgb = st_color

        bp2 = btf.add_paragraph()
        bp2.space_before = Pt(2)
        br2 = bp2.add_run()
        br2.text = st_sub
        br2.font.name = "Arial"
        br2.font.size = Pt(8.0)
        br2.font.color.rgb = TEXT_LIGHT

    # 3 Stakeholder Columns
    if lang == "en":
        columns = [
            {
                "badge": "ENTERPRISE & PUBLIC SECTOR",
                "title": "1. Customers",
                "deploy_label": "DEPLOYMENT OPTIONS",
                "deploy_lines": [
                    "• Deploy via GitHub repo, run locally or on Google Cloud",
                    "• Or run directly on Antigravity for single-instance use",
                ],
                "benefit_label": "KEY BENEFITS",
                "benefits": [
                    "• Immediate Remediation & In-Depth Pre-Audit: Instant access to deep architectural pre-audits of AI projects and drop-in code/IaC remediation.",
                    "• Compliance & Security: Full verification across OWASP AI-SVS v1.0, ISO/IEC 42001:2023 & NIST AI RMF.",
                    "• EU & Local Regulatory Orientation: Actionable guidance on how to comply with EU regulations (EU AI Act) and possible forthcoming local regulations.",
                ],
                "bg": CARD_BLUE_BG,
                "border": BORDER_SKY,
                "accent": TEXT_SKY,
            },
            {
                "badge": "GSI, MSP & ADVISORY ECOSYSTEM",
                "title": "2. Partners",
                "deploy_label": "DEPLOYMENT OPTIONS",
                "deploy_lines": [
                    "• Same deployment options as Customers:",
                    "• GitHub repo, Local, Google Cloud, or directly on Antigravity for single-instance use",
                ],
                "benefit_label": "KEY BENEFITS",
                "benefits": [
                    "• Internal Pre-Audits: Validate and harden internal AI platforms, accelerators, and partner IP.",
                    "• Customer Pre-Audits in SDLC: Perform recurring pre-audits for customers embedded directly as part of their Software Development Lifecycle (SDLC).",
                    "• Pre-Audits as a Service: Deliver and monetize high-margin AI compliance, security, and regulatory readiness pre-audits as a managed service.",
                ],
                "bg": CARD_GREEN_BG,
                "border": BORDER_GREEN,
                "accent": TEXT_GREEN,
            },
            {
                "badge": "FIELD, DELIVERY & SALES",
                "title": "3. Google Cloud",
                "deploy_label": "DEPLOYMENT OPTION",
                "deploy_lines": [
                    "• Centrally deployed at go/aegis.ai",
                    "• Hardened Cloud Run + IAP + Keyless Vertex AI ADC",
                ],
                "benefit_label": "KEY BENEFITS",
                "benefits": [
                    "• Delta / PSO / GCC Engagements: Perform technical pre-audits for customers as part of Delta, PSO, and Google Cloud Consulting (GCC) engagements.",
                    "• Sales Customer Pre-Audits: Sales teams can perform rapid pre-audits on customers' AI projects to uncover security & governance gaps.",
                    "• Position Gemini Enterprise Products: Position Gemini Enterprise & GCP Security products based on their impact and alignment with normative and regulatory obligations.",
                ],
                "bg": CARD_PURPLE_BG,
                "border": BORDER_PURPLE,
                "accent": TEXT_PURPLE,
            },
        ]
    else:
        columns = [
            {
                "badge": "EMPRESAS Y SECTOR PÚBLICO",
                "title": "1. Clientes (Customers)",
                "deploy_label": "OPCIONES DE DESPLIEGUE",
                "deploy_lines": [
                    "• Despliegue vía repositorio GitHub, local o en Google Cloud",
                    "• O ejecución directa en Antigravity para uso en instancia única",
                ],
                "benefit_label": "BENEFICIOS CLAVE",
                "benefits": [
                    "• Acceso Inmediato a Remediación y Pre-Auditoría Profunda: Diagnóstico integral de proyectos de IA con código e IaC de remediación listos para usar.",
                    "• Cumplimiento y Seguridad: Evaluación automatizada en OWASP AI-SVS v1.0, ISO/IEC 42001:2023 y NIST AI RMF.",
                    "• Orientación Regulatoria UE y Local: Guía clara sobre cómo cumplir con regulaciones de la UE (EU AI Act) y posibles regulaciones locales próximas.",
                ],
                "bg": CARD_BLUE_BG,
                "border": BORDER_SKY,
                "accent": TEXT_SKY,
            },
            {
                "badge": "ECOSISTEMA GSI, MSP Y CONSULTORÍA",
                "title": "2. Partners",
                "deploy_label": "OPCIONES DE DESPLIEGUE",
                "deploy_lines": [
                    "• Mismas opciones de despliegue que los Clientes:",
                    "• Repositorio GitHub, Local, Google Cloud o directamente en Antigravity para instancia única",
                ],
                "benefit_label": "BENEFICIOS CLAVE",
                "benefits": [
                    "• Pre-Auditorías Internas: Validar y endurecer los propios aceleradores, agentes y soluciones de IA del partner.",
                    "• Pre-Auditorías en el SDLC del Cliente: Realizar pre-auditorías para clientes integradas directamente dentro de su ciclo de desarrollo (SDLC).",
                    "• Pre-Auditorías como Servicio: Ofrecer y monetizar pre-auditorías de seguridad y cumplimiento regulatorio de IA como servicio gestionado.",
                ],
                "bg": CARD_GREEN_BG,
                "border": BORDER_GREEN,
                "accent": TEXT_GREEN,
            },
            {
                "badge": "CAMPO, DELIVERY Y VENTAS",
                "title": "3. Google Cloud",
                "deploy_label": "OPCIÓN DE DESPLIEGUE",
                "deploy_lines": [
                    "• Desplegado centralmente en go/aegis.ai",
                    "• Cloud Run endurecido + IAP + Vertex AI ADC sin llaves",
                ],
                "benefit_label": "BENEFICIOS CLAVE",
                "benefits": [
                    "• Compromisos Delta / PSO / GCC: Realizar pre-auditorías para clientes como parte de compromisos de Delta, PSO y Google Cloud Consulting (GCC).",
                    "• Pre-Auditorías por Equipos de Ventas: Los equipos de ventas pueden auditar proyectos de clientes para detectar brechas de seguridad y gobernanza.",
                    "• Posicionar Productos Gemini Enterprise: Posicionar productos Gemini Enterprise según su impacto y alineación con obligaciones normativas y regulatorias.",
                ],
                "bg": CARD_PURPLE_BG,
                "border": BORDER_PURPLE,
                "accent": TEXT_PURPLE,
            },
        ]

    col_w = 3.91
    col_gap = 0.20
    col_top = 2.62
    col_h = 3.55

    for idx_c, col in enumerate(columns):
        c_left = 0.6 + idx_c * (col_w + col_gap)
        card = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE, Inches(c_left), Inches(col_top), Inches(col_w), Inches(col_h)
        )
        card.adjustments[0] = 0.04
        card.fill.solid()
        card.fill.fore_color.rgb = col["bg"]
        card.line.color.rgb = col["border"]
        card.line.width = Pt(1.4)

        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.vertical_anchor = MSO_ANCHOR.TOP
        ctf.margin_left = Inches(0.16)
        ctf.margin_right = Inches(0.16)
        ctf.margin_top = Inches(0.12)
        ctf.margin_bottom = Inches(0.10)

        p_b = ctf.paragraphs[0]
        rb = p_b.add_run()
        rb.text = col["badge"]
        rb.font.name = "Arial"
        rb.font.size = Pt(7.8)
        rb.font.bold = True
        rb.font.color.rgb = col["accent"]

        p_ct = ctf.add_paragraph()
        p_ct.space_before = Pt(2)
        rct = p_ct.add_run()
        rct.text = col["title"]
        rct.font.name = "Arial"
        rct.font.size = Pt(13.5)
        rct.font.bold = True
        rct.font.color.rgb = TEXT_WHITE

        p_dl = ctf.add_paragraph()
        p_dl.space_before = Pt(5)
        rdl = p_dl.add_run()
        rdl.text = col["deploy_label"]
        rdl.font.name = "Courier New"
        rdl.font.size = Pt(8.2)
        rdl.font.bold = True
        rdl.font.color.rgb = col["accent"]

        for dline in col["deploy_lines"]:
            p_d = ctf.add_paragraph()
            p_d.space_before = Pt(2)
            rd = p_d.add_run()
            rd.text = dline
            rd.font.name = "Arial"
            rd.font.size = Pt(8.8)
            rd.font.bold = True
            rd.font.color.rgb = TEXT_WHITE

        p_bl = ctf.add_paragraph()
        p_bl.space_before = Pt(6)
        rbl = p_bl.add_run()
        rbl.text = col["benefit_label"]
        rbl.font.name = "Courier New"
        rbl.font.size = Pt(8.2)
        rbl.font.bold = True
        rbl.font.color.rgb = col["accent"]

        for bline in col["benefits"]:
            p_ben = ctf.add_paragraph()
            p_ben.space_before = Pt(3)
            rben = p_ben.add_run()
            rben.text = bline
            rben.font.name = "Arial"
            rben.font.size = Pt(8.5)
            rben.font.color.rgb = TEXT_LIGHT

    # Bottom Summary Callout Bar
    banner = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), Inches(6.26), Inches(12.133), Inches(0.56)
    )
    banner.adjustments[0] = 0.06
    banner.fill.solid()
    banner.fill.fore_color.rgb = CARD_BG
    banner.line.color.rgb = BORDER_BLUE
    banner.line.width = Pt(1.2)
    btf2 = banner.text_frame
    btf2.word_wrap = True
    btf2.margin_left = Inches(0.16)
    btf2.margin_right = Inches(0.16)
    btf2.margin_top = Inches(0.08)
    bp = btf2.paragraphs[0]
    br_lead = bp.add_run()
    br_lead.text = "Unified Ecosystem Flywheel: " if lang == "en" else "Sinergia del Ecosistema: "
    br_lead.font.name = "Arial"
    br_lead.font.size = Pt(9.2)
    br_lead.font.bold = True
    br_lead.font.color.rgb = TEXT_SKY

    br_body = bp.add_run()
    br_body.text = (
        "Customers gain immediate remediation, security & EU/local regulatory orientation ➔ Partners scale internal & SDLC pre-audits or offer Pre-Audits as a Service ➔ Google Cloud (go/aegis.ai) accelerates Delta/PSO/GCC delivery and positions Gemini Enterprise Products mapped to normative obligations."
        if lang == "en"
        else "Clientes logran remediación inmediata, seguridad y orientación regulatoria UE/local ➔ Partners integran pre-auditorías en el SDLC u ofrecen Pre-Auditorías como Servicio ➔ Google Cloud (go/aegis.ai) impulsa compromisos Delta/PSO/GCC y posiciona Productos Gemini Enterprise alineados con obligaciones normativas."
    )
    br_body.font.name = "Arial"
    br_body.font.size = Pt(8.8)
    br_body.font.color.rgb = TEXT_LIGHT

    # Footer
    line_bot = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(6.92), Inches(12.133), Inches(0.015))
    line_bot.fill.solid()
    line_bot.fill.fore_color.rgb = BORDER_SUBTLE
    line_bot.line.fill.background()

    fl = slide.shapes.add_textbox(Inches(0.6), Inches(6.98), Inches(6.5), Inches(0.32))
    flr = fl.text_frame.paragraphs[0].add_run()
    flr.text = (
        "AegisAI Enterprise • Deployment Options & Ecosystem Value (Customers • Partners • Google Cloud)"
        if lang == "en"
        else "AegisAI Enterprise • Opciones de Despliegue y Valor del Ecosistema (Clientes • Partners • Google Cloud)"
    )
    flr.font.name = "Arial"
    flr.font.size = Pt(8.5)
    flr.font.color.rgb = TEXT_MUTED

    fr = slide.shapes.add_textbox(Inches(7.1), Inches(6.98), Inches(5.633), Inches(0.32))
    frp = fr.text_frame.paragraphs[0]
    frp.alignment = PP_ALIGN.RIGHT
    frr = frp.add_run()
    frr.text = "GitHub • Local • Google Cloud Run • Antigravity • go/aegis.ai"
    frr.font.name = "Arial"
    frr.font.size = Pt(8.5)
    frr.font.color.rgb = TEXT_MUTED

    # Speaker Notes
    notes_slide = slide.notes_slide
    ntf = notes_slide.notes_text_frame
    if lang == "en":
        ntf.text = (
            "SPEAKER NOTES — DEPLOYMENT OPTIONS & ECOSYSTEM VALUE PROPOSITION:\n\n"
            "1. CUSTOMERS:\n"
            "• Deployment: Can deploy directly via the GitHub repository, run locally or on Google Cloud (Cloud Run), or run directly on Google Antigravity for single-instance use.\n"
            "• Benefit: Immediate access to actionable code/IaC remediation and in-depth architectural pre-audits of AI projects. Provides comprehensive Compliance, Security (OWASP AI-SVS, ISO/IEC 42001), and clear orientation on how to comply with EU regulations (EU AI Act) as well as forthcoming local regulations.\n\n"
            "2. PARTNERS:\n"
            "• Deployment: Same flexible deployment options as customers (GitHub repo, Local, Google Cloud, or directly on Antigravity for single-instance use).\n"
            "• Benefit: Partners can perform internal pre-audits on their own AI solutions, perform recurring pre-audits for customers embedded directly as part of their Software Development Lifecycle (SDLC), or monetize Pre-Audits as a Service.\n\n"
            "3. GOOGLE CLOUD:\n"
            "• Deployment: Centrally deployed and accessible internally at go/aegis.ai.\n"
            "• Benefit: Delivery teams can perform pre-audits for customers as part of Delta, PSO, and GCC engagements. Sales teams can perform pre-audits on customers' AI projects and position Gemini Enterprise Products (Model Armor, Model Garden/Registry, Vertex Evaluation AutoSxS, Model Monitoring, SCC AI Protection) based on their measurable impact and alignment with normative and regulatory obligations."
        )
    else:
        ntf.text = (
            "NOTAS DEL ORADOR — OPCIONES DE DESPLIEGUE Y VALOR DEL ECOSISTEMA:\n\n"
            "1. CLIENTES (CUSTOMERS):\n"
            "• Despliegue: Pueden desplegar vía repositorio de GitHub, ejecutar localmente o en Google Cloud (Cloud Run), o ejecutar directamente en Google Antigravity para uso en instancia única.\n"
            "• Beneficio: Acceso inmediato a remediación y pre-auditoría profunda de proyectos de IA. Cumplimiento, Seguridad y orientación práctica sobre cómo cumplir con las regulaciones de la UE (EU AI Act) y posibles regulaciones locales próximas.\n\n"
            "2. PARTNERS:\n"
            "• Despliegue: Mismas opciones de despliegue que los clientes (repositorio GitHub, local, Google Cloud o directamente en Antigravity).\n"
            "• Beneficio: Pueden realizar pre-auditorías internas, ejecutar pre-auditorías para clientes como parte de su ciclo de desarrollo (SDLC) o comercializar pre-auditorías como servicio.\n\n"
            "3. GOOGLE CLOUD:\n"
            "• Despliegue: Desplegado internamente en go/aegis.ai.\n"
            "• Beneficio: Permite realizar pre-auditorías para clientes como parte de compromisos de Delta / PSO / GCC. Los equipos de ventas pueden realizar pre-auditorías en los proyectos de los clientes y posicionar productos de Gemini Enterprise basándose en su impacto y alineación con las obligaciones normativas y regulatorias."
        )

    return slide


def main():
    os.makedirs("docs/Manuals_english/pdf", exist_ok=True)
    os.makedirs("docs/manuales_pdf/english", exist_ok=True)
    os.makedirs("docs/manuales_pdf", exist_ok=True)

    # 1. Generate Standalone Single-Slide English PDF
    html_en = f"<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><style>{CSS}</style></head><body>{get_slide_html_en('01 / 01')}</body></html>"
    tmp_en = "/tmp/aegis_deployment_slide_en.html"
    with open(tmp_en, "w", encoding="utf-8") as f:
        f.write(html_en)

    pdf_en = "docs/Manuals_english/pdf/AegisAI_Deployment_and_Ecosystem_Slide.pdf"
    pdf_en_mirror = "docs/manuales_pdf/english/AegisAI_Deployment_and_Ecosystem_Slide.pdf"
    subprocess.run(
        f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{pdf_en}" --print-to-pdf-no-header "{tmp_en}"',
        shell=True,
        check=True,
    )
    shutil.copy(pdf_en, pdf_en_mirror)
    print(f"Created EN Single-Slide PDF: {pdf_en} ({os.path.getsize(pdf_en)/1024:.1f} KB)")

    # 2. Generate Standalone Single-Slide Spanish PDF
    html_es = f"<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'><style>{CSS}</style></head><body>{get_slide_html_es('01 / 01')}</body></html>"
    tmp_es = "/tmp/aegis_deployment_slide_es.html"
    with open(tmp_es, "w", encoding="utf-8") as f:
        f.write(html_es)

    pdf_es = "docs/manuales_pdf/AegisAI_Slide_Despliegue_y_Ecosistema.pdf"
    subprocess.run(
        f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{pdf_es}" --print-to-pdf-no-header "{tmp_es}"',
        shell=True,
        check=True,
    )
    print(f"Created ES Single-Slide PDF: {pdf_es} ({os.path.getsize(pdf_es)/1024:.1f} KB)")

    # 3. Generate Standalone Single-Slide English & Spanish PPTX
    prs_en = Presentation()
    prs_en.slide_width = Inches(13.333)
    prs_en.slide_height = Inches(7.5)
    add_deployment_ecosystem_pptx_slide(prs_en, 1, 1, "en")
    pptx_en = "docs/Manuals_english/pdf/AegisAI_Deployment_and_Ecosystem_Slide.pptx"
    pptx_en_mirror = "docs/manuales_pdf/english/AegisAI_Deployment_and_Ecosystem_Slide.pptx"
    prs_en.save(pptx_en)
    shutil.copy(pptx_en, pptx_en_mirror)
    print(f"Created EN Single-Slide PPTX: {pptx_en} ({os.path.getsize(pptx_en)/1024:.1f} KB)")

    prs_es = Presentation()
    prs_es.slide_width = Inches(13.333)
    prs_es.slide_height = Inches(7.5)
    add_deployment_ecosystem_pptx_slide(prs_es, 1, 1, "es")
    pptx_es = "docs/manuales_pdf/AegisAI_Slide_Despliegue_y_Ecosistema.pptx"
    prs_es.save(pptx_es)
    print(f"Created ES Single-Slide PPTX: {pptx_es} ({os.path.getsize(pptx_es)/1024:.1f} KB)")


if __name__ == "__main__":
    main()
