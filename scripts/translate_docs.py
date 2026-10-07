import urllib.request
import json
import time
import os
import re

api_key = ''
with open('.env') as f:
    for line in f:
        if line.startswith('GEMINI_API_KEY='):
            api_key = line.strip().split('=', 1)[1].strip('"\'')

docs_map = [
    {
        'src': 'docs/MANUAL_DE_USUARIO_FINAL.md',
        'dest': 'docs/Manuals_english/1_END_USER_MANUAL.md',
        'title': 'End User Manual'
    },
    {
        'src': 'docs/DOCUMENTO_DE_ARQUITECTURA_DE_SOFTWARE.md',
        'dest': 'docs/Manuals_english/2_SOFTWARE_ARCHITECTURE_DOCUMENT.md',
        'title': 'Software Architecture Document'
    },
    {
        'src': 'docs/MANUAL_DE_ADMINISTRACION_Y_OPERACION.md',
        'dest': 'docs/Manuals_english/3_ADMINISTRATION_AND_OPERATIONS_MANUAL.md',
        'title': 'Administration and Operations Manual'
    },
    {
        'src': 'docs/MANUAL_DE_INSTALACION_Y_DESPLIEGUE.md',
        'dest': 'docs/Manuals_english/4_INSTALLATION_AND_DEPLOYMENT_MANUAL.md',
        'title': 'Installation and Deployment Manual'
    },
    {
        'src': 'docs/PLAN_E_INFORME_DE_PRUEBAS.md',
        'dest': 'docs/Manuals_english/5_TEST_PLAN_AND_SECURITY_REPORT.md',
        'title': 'Test Plan and Security Report'
    },
    {
        'src': 'docs/GUIA_DE_INSTALACION_GOOGLE_CLOUD_PASO_A_PASO.md',
        'dest': 'docs/Manuals_english/6_STEP_BY_STEP_GOOGLE_CLOUD_DEPLOYMENT_GUIDE.md',
        'title': 'Step-by-Step Google Cloud Deployment Guide'
    },
    {
        'src': 'docs/GUIA_DE_DESARROLLO_Y_MANTENIMIENTO.md',
        'dest': 'docs/Manuals_english/7_DEVELOPMENT_AND_MAINTENANCE_GUIDE.md',
        'title': 'Development and Maintenance Guide'
    }
]

def call_gemini_translation(chunk):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key={api_key}"
    system_instruction = """You are an expert technical writer and enterprise documentation translator.
Translate the following Markdown documentation from Spanish to fluent, authoritative, idiomatic English.
Rules:
1. Maintain all Markdown syntax strictly: headers (#, ##, ###), bold, italics, tables, lists, alerts (> [!NOTE], > [!TIP], > [!IMPORTANT], etc.).
2. Keep code blocks and commands intact. Translate comments inside code blocks to English.
3. Keep technical acronyms intact: OWASP, AISVS, ISO/IEC 42001, RBAC, CI/CD, GCP, Cloud Run, Firestore, etc.
4. Return ONLY the translated Markdown. Do not include introductory notes or commentary."""

    payload = json.dumps({
        'contents': [
            {'role': 'user', 'parts': [{'text': f"{system_instruction}\n\nDocument to translate:\n\n{chunk}"}]}
        ]
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=90) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        return res['candidates'][0]['content']['parts'][0]['text']

def split_markdown_into_chunks(content, max_chars=3500):
    lines = content.split('\n')
    chunks = []
    current_chunk = []
    current_len = 0
    in_code_block = False

    for line in lines:
        if line.strip().startswith('```'):
            in_code_block = not in_code_block

        # Split at header boundary if size exceeds limit and not in code block
        if not in_code_block and (line.startswith('## ') or line.startswith('---')) and current_len > max_chars:
            chunks.append('\n'.join(current_chunk))
            current_chunk = [line]
            current_len = len(line)
        else:
            current_chunk.append(line)
            current_len += len(line) + 1

    if current_chunk:
        chunks.append('\n'.join(current_chunk))
    return chunks

print("=== Starting Technical Documentation Translation into docs/Manuals_english/ ===")

os.makedirs('docs/Manuals_english', exist_ok=True)

for doc in docs_map:
    src_path = doc['src']
    dest_path = doc['dest']
    print(f"\nTranslating '{src_path}' -> '{dest_path}'...")
    
    if not os.path.exists(src_path):
        print(f"Warning: {src_path} not found. Skipping.")
        continue

    with open(src_path, 'r', encoding='utf-8') as f:
        src_content = f.read()

    chunks = split_markdown_into_chunks(src_content, max_chars=3500)
    print(f"Divided into {len(chunks)} chunks.")

    translated_chunks = []
    for i, chunk in enumerate(chunks):
        print(f"  Translating chunk {i+1}/{len(chunks)} ({len(chunk)} chars)...")
        success = False
        for attempt in range(3):
            try:
                translated_text = call_gemini_translation(chunk)
                translated_chunks.append(translated_text.strip())
                success = True
                break
            except Exception as e:
                print(f"    Attempt {attempt+1} error: {e}. Retrying in 2s...")
                time.sleep(2)
        
        if not success:
            print(f"    Warning: Falling back to original chunk for chunk {i+1}")
            translated_chunks.append(chunk)
        time.sleep(1)

    final_content = '\n\n'.join(translated_chunks)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(final_content + '\n')
    print(f"Saved translated doc: {dest_path} ({len(final_content)} characters)")

print("\nAll technical manuals successfully translated into English!")
