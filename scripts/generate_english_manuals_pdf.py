import os
import re
import html
import subprocess

css = """
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Roboto+Mono:wght@400;500;600&display=swap');

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
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  color: #1e293b;
  background: #ffffff;
  line-height: 1.55;
  font-size: 9.5pt;
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5 {
  font-family: 'Google Sans', 'Roboto', sans-serif;
  color: #0f172a;
  margin-top: 1.2em;
  margin-bottom: 0.4em;
  font-weight: 700;
}

h1 {
  font-size: 17pt;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 6px;
  color: #0f172a;
}

h2 {
  font-size: 13pt;
  color: #1e293b;
  margin-top: 1.4em;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 4px;
}

h3 {
  font-size: 10.5pt;
  color: #1a73e8;
  margin-top: 1.1em;
}

h4 {
  font-size: 9.5pt;
  color: #334155;
}

p {
  margin-top: 0.3em;
  margin-bottom: 0.7em;
  color: #334155;
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
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
  color: #ffffff;
  padding: 14mm 12mm;
  border-radius: 12px;
  border: 1px solid #475569;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  margin-bottom: 12mm;
}

.cover-tag {
  display: inline-block;
  background: rgba(26, 115, 232, 0.25);
  border: 1px solid rgba(26, 115, 232, 0.8);
  color: #93c5fd;
  font-size: 8pt;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.cover-title {
  font-size: 22pt;
  line-height: 1.15;
  font-weight: 700;
  color: #ffffff;
  margin: 6px 0 10px 0;
}

.cover-subtitle {
  font-size: 11pt;
  color: #cbd5e1;
  font-weight: 400;
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 8.5pt;
  page-break-inside: avoid;
}

th, td {
  border: 1px solid #cbd5e1;
  padding: 6px 8px;
  text-align: left;
}

th {
  background: #f1f5f9;
  font-weight: 700;
  color: #0f172a;
}

tr:nth-child(even) td {
  background: #f8fafc;
}

pre {
  background: #0f172a;
  color: #f8fafc;
  padding: 10px 12px;
  border-radius: 6px;
  font-family: 'Roboto Mono', monospace;
  font-size: 8pt;
  line-height: 1.4;
  overflow-x: auto;
  page-break-inside: avoid;
}

code {
  font-family: 'Roboto Mono', monospace;
  font-size: 8.5pt;
  background: #f1f5f9;
  padding: 1px 4px;
  border-radius: 3px;
  color: #0f172a;
}

pre code {
  background: transparent;
  color: inherit;
  padding: 0;
}

blockquote {
  border-left: 4px solid #3b82f6;
  background: #eff6ff;
  padding: 8px 12px;
  margin: 10px 0;
  border-radius: 0 6px 6px 0;
  font-size: 9pt;
  color: #1e3a8a;
  page-break-inside: avoid;
}

.badge {
  display: inline-block;
  padding: 2px 6px;
  font-size: 7.5pt;
  font-weight: 600;
  border-radius: 4px;
  background: #e2e8f0;
  color: #334155;
}

ul, ol {
  margin: 6px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 4px;
}
"""

def md_to_html_body(md_text):
    lines = md_text.split('\n')
    out = []
    in_code = False
    in_table = False
    in_ul = False
    in_ol = False

    for line in lines:
        stripped = line.strip()

        # Code block
        if stripped.startswith('```'):
            if in_code:
                out.append('</code></pre>')
                in_code = False
            else:
                lang = stripped[3:].strip()
                out.append(f'<pre><code class="language-{lang}">')
                in_code = True
            continue

        if in_code:
            out.append(html.escape(line))
            continue

        # Tables
        if '|' in stripped and ('---' in stripped or stripped.startswith('|')):
            if '---' in stripped:
                continue
            cols = [c.strip() for c in stripped.split('|')[1:-1]]
            if not in_table:
                out.append('<table><thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in cols) + '</tr></thead><tbody>')
                in_table = True
            else:
                out.append('<tr>' + ''.join(f'<td>{html.escape(c)}</td>' for c in cols) + '</tr>')
            continue
        elif in_table:
            out.append('</tbody></table>')
            in_table = False

        # Lists
        if stripped.startswith('- ') or stripped.startswith('* '):
            if not in_ul:
                out.append('<ul>')
                in_ul = True
            item_text = stripped[2:]
            # inline bold/code
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
            item_text = re.sub(r'`(.*?)`', r'<code>\1</code>', item_text)
            out.append(f'<li>{item_text}</li>')
            continue
        elif in_ul and not (stripped.startswith('- ') or stripped.startswith('* ')):
            out.append('</ul>')
            in_ul = False

        if re.match(r'^\d+\.\s', stripped):
            if not in_ol:
                out.append('<ol>')
                in_ol = True
            item_text = re.sub(r'^\d+\.\s', '', stripped)
            item_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item_text)
            item_text = re.sub(r'`(.*?)`', r'<code>\1</code>', item_text)
            out.append(f'<li>{item_text}</li>')
            continue
        elif in_ol and not re.match(r'^\d+\.\s', stripped):
            out.append('</ol>')
            in_ol = False

        # Headings
        if stripped.startswith('# '):
            out.append(f'<h1>{html.escape(stripped[2:])}</h1>')
        elif stripped.startswith('## '):
            out.append(f'<h2>{html.escape(stripped[3:])}</h2>')
        elif stripped.startswith('### '):
            out.append(f'<h3>{html.escape(stripped[4:])}</h3>')
        elif stripped.startswith('#### '):
            out.append(f'<h4>{html.escape(stripped[5:])}</h4>')
        elif stripped.startswith('> '):
            quote_text = stripped[2:]
            quote_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', quote_text)
            quote_text = re.sub(r'`(.*?)`', r'<code>\1</code>', quote_text)
            out.append(f'<blockquote>{quote_text}</blockquote>')
        elif stripped == '---':
            out.append('<hr style="border:none; border-top:1px solid #e2e8f0; margin:15px 0;"/>')
        elif stripped:
            p_text = stripped
            p_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', p_text)
            p_text = re.sub(r'`(.*?)`', r'<code>\1</code>', p_text)
            out.append(f'<p>{p_text}</p>')

    if in_code: out.append('</code></pre>')
    if in_table: out.append('</tbody></table>')
    if in_ul: out.append('</ul>')
    if in_ol: out.append('</ol>')
    return '\n'.join(out)

manuals_to_compile = [
    {
        "md": "docs/Manuals_english/1_END_USER_MANUAL.md",
        "pdf": "1_End_User_Manual_AegisAI.pdf",
        "title": "End User & Auditor Manual",
        "sub": "Operational Guide for AI Architecture Assessment & Verification"
    },
    {
        "md": "docs/Manuals_english/2_SOFTWARE_ARCHITECTURE_DOCUMENT.md",
        "pdf": "2_Software_Architecture_Document_AegisAI.pdf",
        "title": "Software Architecture Document",
        "sub": "Decoupled Architecture, Threat Modeling & Multi-Standard Engine"
    },
    {
        "md": "docs/Manuals_english/3_ADMINISTRATION_AND_OPERATIONS_MANUAL.md",
        "pdf": "3_Administration_and_Operations_Manual_AegisAI.pdf",
        "title": "Administration & Operations Manual",
        "sub": "DevSecOps, Secrets Governance, Quota Management & Observability"
    },
    {
        "md": "docs/Manuals_english/4_INSTALLATION_AND_DEPLOYMENT_MANUAL.md",
        "pdf": "4_Installation_and_Deployment_Manual_AegisAI.pdf",
        "title": "Installation & Deployment Manual",
        "sub": "Self-Contained Deployment Guide for Cloud Run, Docker & Local Runtime"
    },
    {
        "md": "docs/Manuals_english/5_TEST_PLAN_AND_SECURITY_REPORT.md",
        "pdf": "5_Test_Plan_and_Security_Report_AegisAI.pdf",
        "title": "Test Plan & Security Verification Report",
        "sub": "Exhaustive Quality Assurance, OWASP LLM Top 10 & Regression Suite"
    },
    {
        "md": "docs/Manuals_english/6_STEP_BY_STEP_GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md",
        "pdf": "6_Step_by_Step_Google_Cloud_Deployment_Guide.pdf",
        "title": "Step-by-Step Google Cloud Deployment Guide",
        "sub": "Zero-to-Hero Cloud Run, Artifact Registry & Secret Manager Procedure"
    },
    {
        "md": "docs/Manuals_english/7_DEVELOPMENT_AND_MAINTENANCE_GUIDE.md",
        "pdf": "7_Development_and_Maintenance_Guide.pdf",
        "title": "Development & Maintenance Guide",
        "sub": "Coding Standards, Testing Frameworks & Contribution Guidelines"
    }
]

os.makedirs("docs/Manuals_english/pdf", exist_ok=True)
os.makedirs("docs/manuales_pdf/english", exist_ok=True)

print("=== Compiling High-Fidelity English PDFs for all 7 Manuals ===")

for item in manuals_to_compile:
    md_file = item["md"]
    pdf_name = item["pdf"]
    print(f"\nProcessing {md_file} -> {pdf_name}...")

    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()

    body_html = md_to_html_body(md_text)

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{html.escape(item['title'])} - AegisAI</title>
  <style>{css}</style>
</head>
<body>
  <div class="cover-page">
    <div>
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:20mm;">
        <span style="font-size:20pt; font-weight:800; color:#2563eb; letter-spacing:-0.5px;">AEGIS<span style="color:#0f172a;">AI</span></span>
        <span style="background:#dbeafe; color:#1d4ed8; font-size:8pt; font-weight:700; padding:2px 8px; border-radius:4px;">ENTERPRISE EDITION</span>
      </div>
      <div class="cover-hero-card">
        <span class="cover-tag">TECHNICAL DOCUMENTATION SUITE</span>
        <div class="cover-title">{html.escape(item['title'])}</div>
        <div class="cover-subtitle">{html.escape(item['sub'])}</div>
      </div>
    </div>
    <div>
      <table style="width:100%; border-collapse:collapse; margin-bottom:15mm; font-size:8pt;">
        <tr>
          <td style="padding:6px 0; color:#64748b; width:25%;">Platform Version:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">2.5.0 Enterprise Edition</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#64748b;">Compliance Scope:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">OWASP AISVS v1.0, ISO/IEC 42001:2023, Google Cloud Security</td>
        </tr>
        <tr>
          <td style="padding:6px 0; color:#64748b;">License:</td>
          <td style="padding:6px 0; font-weight:600; color:#0f172a;">Apache License 2.0 (Open Source)</td>
        </tr>
      </table>
      <div style="border-top:1px solid #cbd5e1; padding-top:4mm; font-size:7.5pt; color:#64748b; display:flex; justify-content:space-between;">
        <span>AegisAI Engineering Team</span>
        <span>Confidentiality: Public / Open Source</span>
      </div>
    </div>
  </div>

  <div style="page-break-after:always;"></div>
  {body_html}
</body>
</html>
"""

    temp_html = f"/tmp/eng_{pdf_name}.html"
    with open(temp_html, 'w', encoding='utf-8') as f:
        f.write(full_html)

    out_path_1 = os.path.join("docs/Manuals_english/pdf", pdf_name)
    out_path_2 = os.path.join("docs/manuales_pdf/english", pdf_name)

    cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{out_path_1}" --print-to-pdf-no-header "{temp_html}"'
    subprocess.run(cmd, shell=True, check=True)

    import shutil
    shutil.copy(out_path_1, out_path_2)

    kb = os.path.getsize(out_path_1) / 1024
    print(f" -> Generated {out_path_1} ({kb:.1f} KB)")

print("\nAll 7 English Manuals compiled to PDF successfully!")
