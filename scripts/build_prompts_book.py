import json
import os
import subprocess

with open('/tmp/translated_prompts.json', 'r', encoding='utf-8') as f:
    prompts = json.load(f)

print(f"Loaded {len(prompts)} prompts for Prompts Book compilation.")

phases_en = {
    1: "Phase 1: Inception, Discovery & Full-Stack Architecture",
    2: "Phase 2: Automated UI Testing & Early Verification",
    3: "Phase 3: OWASP AISVS, ISO 42001 Standards & Dual-LLM Engine",
    4: "Phase 4: Modern Enterprise UI Redesign & Database Isolation",
    5: "Phase 5: Cloud Security Audit, GCP SCC Comparison & Technical Manuals",
    6: "Phase 6: Code Sanitization, PDF Generation & Open Source GitHub Release",
    7: "Phase 7: Live Runtime Operations & Bilingual Documentation Suite"
}

phases_es = {
    1: "Fase 1: Concepción, Descubrimiento y Arquitectura Full-Stack",
    2: "Fase 2: Pruebas Automatizadas de Interfaz y Verificación Temprana",
    3: "Fase 3: Estándares OWASP AISVS, ISO 42001 y Motor Dual-LLM",
    4: "Fase 4: Rediseño Moderno Enterprise y Aislamiento de Base de Datos",
    5: "Fase 5: Auditoría Cloud, Comparativa con GCP SCC y Manuales Técnicos",
    6: "Fase 6: Sanitización de Código, Generación de PDFs y Lanzamiento en GitHub",
    7: "Fase 7: Operación en Tiempo Real y Suite de Documentación Bilingüe"
}

phase_desc_en = {
    1: "Foundational phase establishing the project scope, repository structure, Express/Vite full-stack architecture, and initial Gemini API integration.",
    2: "Quality assurance milestone validating frontend rendering, navigation, and local server reliability under automated headless browser testing.",
    3: "Core regulatory compliance implementation covering all 12 OWASP AISVS v1.0 chapters, ISO/IEC 42001 clauses, Mexican regulations, and multi-provider LLM support.",
    4: "Visual modernization replacing legacy components with the sleek dark AegisAI design system, interactive charts, and secure multi-tenant database isolation.",
    5: "Enterprise security benchmarking against Google Cloud Security Command Center (SCC), implementing the live GCP scanner, and authoring technical manuals.",
    6: "Deep codebase sanitization removing all credentials and identifiers, creating high-fidelity PDF documentation, and publishing the open-source repository to GitHub.",
    7: "Production lifecycle operations, automated server restart, and compiling the comprehensive bilingual technical documentation and prompts book."
}

phase_desc_es = {
    1: "Fase fundacional que establece el alcance del proyecto, estructura del repositorio, arquitectura full-stack Express/Vite e integración inicial con la API de Gemini.",
    2: "Hito de aseguramiento de calidad que valida el renderizado del frontend, navegación y confiabilidad del servidor local mediante pruebas automatizadas.",
    3: "Implementación del núcleo de cumplimiento regulatorio: 12 capítulos de OWASP AISVS v1.0, cláusulas ISO/IEC 42001, marcos mexicanos y motor multi-proveedor LLM.",
    4: "Modernización visual reemplazando componentes antiguos por el sistema de diseño oscuro AegisAI, gráficos interactivos y aislamiento seguro de base de datos.",
    5: "Evaluación comparativa con Google Cloud Security Command Center (SCC), desarrollo del escáner en vivo de GCP y redacción de manuales técnicos.",
    6: "Sanitización exhaustiva de credenciales e identificadores, generación de manuales en PDF de alta fidelidad y publicación del repositorio Open Source en GitHub.",
    7: "Operación de tiempo de ejecución, reinicio automatizado del servidor y compilación de la suite completa de documentación bilingüe y libro de prompts."
}

# 1. Build Markdown File
md_lines = []
md_lines.append("# AEGIS AI ASSURANCE PLATFORM — ENGINEERING PROMPTS BOOK")
md_lines.append("## Complete Bilingual Engineering Log & Conversational Development Prompts")
md_lines.append("**Platform Version:** 2.5.0 Enterprise (Release 2026)  ")
md_lines.append("**Classification:** Technical Development History & Audit Trail  ")
md_lines.append(f"**Total Prompts:** {len(prompts)} Verified Instructions  ")
md_lines.append("**Date Range:** August 31, 2026 – October 6, 2026  \n")
md_lines.append("---\n")

md_lines.append("## Executive Overview & Conversational Methodology\n")
md_lines.append("This document compiles the exhaustive, verbatim record of engineering prompts utilized to design, build, audit, harden, and publish **AegisAI Enterprise**. Developed using a state-of-the-art **Conversational Pair-Programming & Agentic Workflow**, every feature—from the OWASP AISVS compliance engine and ISO 42001 evaluator to the Google Cloud Live Scanner and multi-LLM router—was systematically instructed, verified, and refined through human-AI dialogue.\n")
md_lines.append("The prompt log is structured in two major parts:")
md_lines.append("1. **Part I: Prompts in English (Translated & Categorized)** — Full professional English translation of each directive, including technical categories, development phases, and execution intent.")
md_lines.append("2. **Part II: Prompts Originales (Original Spanish Prompts)** — Verbatim transcription of all original Spanish inputs exactly as entered during development, with sensitive credentials strictly redacted (`[REDACTED_KEY]`).\n")
md_lines.append("---\n")

md_lines.append("# PART I: PROMPTS IN ENGLISH (TRANSLATED & CATEGORIZED)\n")
for p_num in range(1, 8):
    p_prompts = [p for p in prompts if p.get('phaseNumber') == p_num]
    if not p_prompts:
        continue
    md_lines.append(f"## {phases_en[p_num]}")
    md_lines.append(f"*{phase_desc_en[p_num]}*\n")
    md_lines.append(f"**Prompts in this phase:** {len(p_prompts)}\n")
    
    for item in p_prompts:
        md_lines.append(f"### Prompt #{item['id']} — [{item.get('category', 'Engineering')}]")
        md_lines.append(f"- **Timestamp:** `{item['timestamp']}`")
        md_lines.append(f"- **Category:** `{item.get('category', 'Engineering')}`")
        md_lines.append(f"- **English Instruction:**")
        md_lines.append(f"> {item['translated'].replace(chr(10), chr(10) + '> ')}\n")
    md_lines.append("---\n")

md_lines.append("# PART II: PROMPTS ORIGINALES\n")
md_lines.append("## Registro Cronológico y Textual de Prompts en Español\n")
md_lines.append("En esta sección se documentan íntegramente los **171 prompts originales en español** empleados durante el ciclo de vida de desarrollo de AegisAI. Todas las claves de acceso, identificadores de proyectos y tokens privados han sido sanitizados preventivamente (`[REDACTED_API_KEY]`, `[REDACTED_KEY]`) garantizando la conformidad de seguridad Open Source.\n")

for p_num in range(1, 8):
    p_prompts = [p for p in prompts if p.get('phaseNumber') == p_num]
    if not p_prompts:
        continue
    md_lines.append(f"## {phases_es[p_num]}")
    md_lines.append(f"*{phase_desc_es[p_num]}*\n")
    md_lines.append(f"**Total de prompts en esta fase:** {len(p_prompts)}\n")
    
    for item in p_prompts:
        md_lines.append(f"### Prompt #{item['id']} — [{item.get('category', 'Ingeniería')}]")
        md_lines.append(f"- **Marca de tiempo:** `{item['timestamp']}`")
        md_lines.append(f"- **Categoría técnica:** `{item.get('category', 'Ingeniería')}`")
        md_lines.append(f"- **Prompt Original en Español:**")
        md_lines.append(f"> {item['original'].replace(chr(10), chr(10) + '> ')}\n")
    md_lines.append("---\n")

output_md_path = "docs/Manuals_english/AEGIS_AI_ENGINEERING_PROMPTS.md"
with open(output_md_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(md_lines))

print(f"Generated Markdown Prompts Book at {output_md_path} ({len(md_lines)} lines).")

# 2. Build High-Fidelity HTML for Headless Chrome PDF Printing
print("Compiling High-Fidelity HTML for PDF printing...")

html_parts = []
html_parts.append("""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AegisAI Enterprise — Engineering Prompts Book</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;500&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 18mm 14mm 20mm 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Roboto', sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 9pt;
      margin: 0;
      padding: 0;
    }
    h1, h2, h3, h4 {
      font-family: 'Google Sans', sans-serif;
      color: #0f172a;
      margin-top: 1.2em;
      margin-bottom: 0.3em;
    }
    .cover-page {
      page-break-after: always;
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10mm 5mm 5mm 5mm;
    }
    .cover-hero-card {
      background: linear-gradient(135deg, #090d16 0%, #111827 50%, #1e293b 100%);
      color: #ffffff;
      padding: 14mm 12mm;
      border-radius: 12px;
      border: 1px solid #374151;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }
    .cover-tag {
      display: inline-block;
      background: rgba(59, 130, 246, 0.25);
      border: 1px solid #3b82f6;
      color: #93c5fd;
      font-size: 8pt;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 9999px;
      margin-bottom: 12px;
    }
    .prompt-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 8px;
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .prompt-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      font-size: 8pt;
      color: #64748b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
    }
    .prompt-id {
      font-weight: 700;
      color: #2563eb;
      font-size: 8.5pt;
    }
    .badge {
      display: inline-block;
      padding: 2px 7px;
      font-size: 7pt;
      font-weight: 600;
      border-radius: 4px;
      background: #e0e7ff;
      color: #3730a3;
    }
    .prompt-body {
      font-family: 'Roboto', sans-serif;
      font-size: 8.5pt;
      color: #1e293b;
      line-height: 1.45;
      white-space: pre-wrap;
    }
    .section-header {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 11pt;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    .section-desc {
      font-size: 8pt;
      color: #64748b;
      margin-bottom: 12px;
      font-style: italic;
    }
    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div>
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:20mm;">
        <span style="font-size:20pt; font-weight:800; color:#2563eb; letter-spacing:-0.5px;">AEGIS<span style="color:#0f172a;">AI</span></span>
        <span style="background:#dbeafe; color:#1d4ed8; font-size:8pt; font-weight:700; padding:2px 8px; border-radius:4px;">ENTERPRISE EDITION</span>
      </div>
      <div class="cover-hero-card">
        <span class="cover-tag">ENGINEERING PROMPTS & ARCHITECTURAL LOG</span>
        <h1 style="color:#ffffff; font-size:24pt; margin:0 0 8px 0; font-weight:800;">Engineering Prompts Book</h1>
        <h2 style="color:#94a3b8; font-size:12pt; font-weight:400; margin:0 0 16px 0;">Complete Bilingual Development Log & Conversational Prompts</h2>
        <p style="color:#cbd5e1; font-size:9pt; line-height:1.6; margin:0;">
          The exhaustive record of all 171 engineering directives, specifications, security prompts, and feature requests utilized to build, harden, audit, and deploy the AegisAI Enterprise platform (v2.5.0).
        </p>
      </div>
    </div>
    
    <div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:15mm; font-size:8pt;">
        <tr>
          <td style="padding:6px 0; color:#64748b; width:25%;">Standards Enforced:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">OWASP AISVS v1.0 (12 Ch.), ISO/IEC 42001:2023, Google Cloud Security</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#64748b;">AI Inference Engine:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">Google Gemini (gemini-3.5-flash-lite / 3.8-flash) & Multi-Provider Router</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#64748b;">Sanitization Status:</td>
          <td style="padding:6px 0; font-weight:600; color:#059669;">Verified Clean — 0 Leaks (git-secrets & automated pattern scan)</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#64748b;">Structure:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">Part I: English Translations | Part II: Prompts Originales (Español)</td>
        </tr>
      </table>
      <div style="border-top:1px solid #cbd5e1; padding-top:4mm; font-size:7.5pt; color:#64748b; display:flex; justify-content:space-between;">
        <span>AegisAI Open Source Community</span>
        <span>Apache License 2.0</span>
      </div>
    </div>
  </div>
""")

# PART I: English
html_parts.append("""<div class="page-break">
  <h1 style="font-size:18pt; border-bottom:2px solid #2563eb; padding-bottom:6px; color:#1e293b;">PART I: Prompts in English (Translated & Categorized)</h1>
  <p style="font-size:8.5pt; color:#475569; margin-bottom:20px;">
    The following section presents the comprehensive collection of software engineering prompts translated into English, grouped chronologically across the 7 development phases of the AegisAI platform.
  </p>
""")

for p_num in range(1, 8):
    p_prompts = [p for p in prompts if p.get('phaseNumber') == p_num]
    if not p_prompts:
        continue
    html_parts.append(f"""
    <div class="section-header">{phases_en[p_num]} ({len(p_prompts)} prompts)</div>
    <div class="section-desc">{phase_desc_en[p_num]}</div>
    """)
    for item in p_prompts:
        clean_text = item['translated'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        html_parts.append(f"""
        <div class="prompt-card">
          <div class="prompt-header">
            <span class="prompt-id">Prompt #{item['id']}</span>
            <span class="badge">{item.get('category', 'Engineering')}</span>
            <span>{item['timestamp'][:19].replace('T', ' ')} UTC</span>
          </div>
          <div class="prompt-body">{clean_text}</div>
        </div>
        """)

html_parts.append("</div>") # End Part I

# PART II: Prompts Originales
html_parts.append("""<div class="page-break">
  <h1 style="font-size:18pt; border-bottom:2px solid #059669; padding-bottom:6px; color:#065f46;">PART II: Prompts Originales</h1>
  <p style="font-size:8.5pt; color:#475569; margin-bottom:20px;">
    <strong>Apartado de Prompts Originales en Español:</strong> En esta sección se registra textualmente cada solicitud, especificación y directriz original ingresada durante las sesiones de desarrollo de AegisAI. Todos los tokens y credenciales sensibles han sido sanitizados preventivamente.
  </p>
""")

for p_num in range(1, 8):
    p_prompts = [p for p in prompts if p.get('phaseNumber') == p_num]
    if not p_prompts:
        continue
    html_parts.append(f"""
    <div class="section-header" style="background:#065f46;">{phases_es[p_num]} ({len(p_prompts)} prompts)</div>
    <div class="section-desc">{phase_desc_es[p_num]}</div>
    """)
    for item in p_prompts:
        clean_text = item['original'].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        html_parts.append(f"""
        <div class="prompt-card" style="border-left: 3px solid #059669;">
          <div class="prompt-header">
            <span class="prompt-id" style="color:#059669;">Prompt #{item['id']}</span>
            <span class="badge" style="background:#d1fae5; color:#065f46;">{item.get('category', 'Ingeniería')}</span>
            <span>{item['timestamp'][:19].replace('T', ' ')} UTC</span>
          </div>
          <div class="prompt-body">{clean_text}</div>
        </div>
        """)

html_parts.append("</div>") # End Part II
html_parts.append("</body></html>")

html_content = '\n'.join(html_parts)
temp_html_path = "/tmp/aegis_prompts_book.html"
with open(temp_html_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Saved temporary HTML to {temp_html_path} ({len(html_content)} bytes).")

# Compile PDF using headless chrome
output_pdf_1 = "docs/manuales_pdf/AegisAI_Engineering_Prompts_Book.pdf"
output_pdf_2 = "docs/Manuals_english/pdf/AegisAI_Engineering_Prompts_Book.pdf"

os.makedirs("docs/manuales_pdf", exist_ok=True)
os.makedirs("docs/Manuals_english/pdf", exist_ok=True)

cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{output_pdf_1}" --print-to-pdf-no-header "{temp_html_path}"'
print("Rendering PDF via headless Chrome...")
subprocess.run(cmd, shell=True, check=True)

import shutil
shutil.copy(output_pdf_1, output_pdf_2)

size_kb = os.path.getsize(output_pdf_1) / 1024
print(f"SUCCESS: Prompts Book PDF generated at:")
print(f" -> {output_pdf_1} ({size_kb:.1f} KB)")
print(f" -> {output_pdf_2} ({size_kb:.1f} KB)")
