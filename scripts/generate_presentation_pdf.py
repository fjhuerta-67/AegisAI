import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AegisAI Enterprise - Presentación Ejecutiva y Técnica</title>
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

  <!-- SLIDE 1: PORTADA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Enterprise Edition v2.5 (Hardened)</span>
      </div>
      <span class="slide-num">01 / 11</span>
    </div>

    <div class="cover-container">
      <div class="pill pill-blue" style="font-size: 8.5pt; padding: 4px 12px; margin-bottom: 10px;">
        Google Cloud Zero-Trust AI Security & ISO/IEC 42001 AIMS Governance Platform
      </div>
      <h1 class="cover-title-big">
        Aseguramiento, Gobernanza y<br><span>Auditoría Continua de IA</span>
      </h1>
      <p class="cover-desc-big">
        Plataforma integral para evaluar, auditar y blindar arquitecturas de Inteligencia Artificial Empresarial (GenAI, LLMs, Agentes Autónomos, MCP y RAG) bajo estándares mundiales <strong>OWASP AI-SVS v1.0 (Nivel L2/L3)</strong> e <strong>ISO/IEC 42001:2023</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">OWASP AI-SVS v1.0 (12 Capítulos)</span>
        <span class="pill pill-blue">ISO/IEC 42001:2023 AIMS</span>
        <span class="pill pill-green">Model Garden y Model Armor (Fase 3)</span>
        <span class="pill pill-amber">Vertex AI Gemini 3.8 Flash (ADC sin Llaves)</span>
        <span class="pill pill-purple">Vertex Evaluation AutoSxS (Fase 4)</span>
        <span class="pill pill-green">Model Monitoring y SCC AI (Fase 5)</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise Assurance Platform</span>
      <span>Licencia Apache 2.0 • Open Source • Cloud Run + Vertex AI + Model Armor + AutoSxS + SCC AI</span>
      <span>Octubre 2026</span>
    </div>
  </div>

  <!-- SLIDE 2: EL PROBLEMA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Panorama de Riesgos</span>
      </div>
      <span class="slide-num">02 / 11</span>
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

  <!-- SLIDE 3: IMPACTO -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Análisis de Consecuencias</span>
      </div>
      <span class="slide-num">03 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Impacto de la Inacción</span>
      <h2 class="slide-title">El Costo Real de Omitir la Auditoría Preventiva de IA</h2>
      <p class="slide-subtitle">Operar sistemas de IA sin verificación expone a la organización a sanciones financieras, legales y operativas severas.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #ef4444;">€35M</div>
          <div class="stat-label">o 7% de facturación global anual en multas estatutarias del <strong>EU AI Act Art. 99</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #f59e0b;">97%</div>
          <div class="stat-label">de las apps de IA vulneradas carecían de control de acceso (<strong>IBM 2025</strong>; 13% sufrió brechas)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">10 / 10</div>
          <div class="stat-label">Chequeos automatizados de <strong>OWASP LLM Top-10</strong> ejecutados por auditoría</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">148</div>
          <div class="stat-label">Controles integrados (AISVS 56, ISO 42001 54, EU AI Act 10, LFPDPPP 14, LFPC 14)</div>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Exfiltración de Secretos, IMDS y PII</div>
          <p class="card-text">Ataques multi-turno crescendo y SSRF diseñados para extraer metadatos cloud (<code>169.254.169.254</code>), llaves API o registros entre inquilinos cuando faltan ACLs pre-recuperación (<code>C08.1</code>).</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Sanciones Regulatorias y Suspensión</div>
          <p class="card-text">Incumplimiento de controles AIMS ISO/IEC 42001, purga en cascada ARCO (LFPDPPP/GDPR) o retracto comercial del Art. 56 LFPC provoca suspensiones y litigios.</p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Decisiones Algorítmicas Inapelables</div>
          <p class="card-text">Dictámenes alucinados o decisiones automatizadas sesgadas sin canal de apelación humana (<code>ISO 42001 A.5.2</code>) ni canal ético (<code>A.3.3</code>) erosionan la confianza institucional.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Análisis de Impacto y Continuidad de Negocio</span>
      <span>Criterios alineados con ISO/IEC 42001:2023 Cláusula 6 y Anexo A.5</span>
    </div>
  </div>

  <!-- SLIDE 4: NUESTRA SOLUCIÓN -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Propuesta de Valor</span>
      </div>
      <span class="slide-num">04 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Nuestra Solución</span>
      <h2 class="slide-title">AegisAI: Aseguramiento Integral y Automatizado de IA</h2>
      <p class="slide-subtitle">Transformando semanas de auditoría manual en verificación determinística respaldada por evidencia textual y código de remediación.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;"><span>🛡</span> Verificación Multi-Estándar Shift-Left</div>
          <p class="card-text" style="font-size: 8.5pt; margin-bottom: 6px;">
            AegisAI inspecciona documentos de arquitectura, PDFs, paquetes ZIP, microservicios y telemetría GCP en vivo contra <strong>OWASP AI-SVS v1.0</strong> e <strong>ISO/IEC 42001:2023</strong> simultáneamente.
          </p>
          <ul style="font-size: 7.8pt; color: #cbd5e1; margin: 0; padding-left: 16px; line-height: 1.45;">
            <li>Evaluación Map-Reduce determinística con esquemas enum estrictos por lote (<code>buildBatchChaptersSchema</code>).</li>
            <li>Citación textual obligatoria (<code>textoEvidencia</code> y <code>fuenteEvidencia</code>).</li>
            <li>Enmascaramiento DLP pre-inferencia, Google Cloud Model Armor y bloqueo de inyección multi-turno crescendo (<code>C02.10</code>).</li>
          </ul>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #34d399;"><span>⚡</span> Arquitectura Remediada al 100% y Recetario Completo</div>
          <p class="card-text" style="font-size: 8.5pt; margin-bottom: 6px;">
            Más allá del diagnóstico, AegisAI sintetiza una <strong>Especificación de Arquitectura Corregida Drop-in</strong> (Sección 3, incl. Stack GCP en 3 Fases) más un <strong>Recetario Técnico Completo</strong> (Sección 4).
          </p>
          <ul style="font-size: 7.8pt; color: #cbd5e1; margin: 0; padding-left: 16px; line-height: 1.45;">
            <li>Renderiza todos los parches <code>1..N</code> sin truncamiento, incluso en auditorías con más de 35 hallazgos.</li>
            <li>Resúmenes por oración completa y detección precisa de lenguaje (<code>typescript</code>, <code>hcl</code>, <code>yaml</code>, <code>python</code>, <code>bash</code>).</li>
            <li>Exportación ejecutiva en PDF y Markdown lista para comités de certificación e ingeniería.</li>
          </ul>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 12px;">
        <div class="card">
          <div class="card-title">1. Integridad Criptográfica (C01.4)</div>
          <p class="card-text">Snapshots normativos verificados con manifiesto SHA-256 + procedencia firmada en Model Garden / Registry.</p>
        </div>
        <div class="card">
          <div class="card-title">2. GCP Live Scanner sin Llaves (C05.2)</div>
          <p class="card-text">Inspección de solo lectura sobre Vertex AI, Model Armor, AutoSxS, Model Monitoring, SCC AI, Cloud Run e IAM.</p>
        </div>
        <div class="card">
          <div class="card-title">3. Telemetría Continua AIMS (C08.4)</div>
          <p class="card-text">Monitoreo en tiempo real de cobertura de citación, fidelidad JSON, AutoSxS y postura de controles.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Paradigma Shift-Left de Seguridad en IA</span>
      <span>Diseñado para CISOs, Arquitectos Cloud, Oficiales AIMS e Ingenieros MLOps</span>
    </div>
  </div>

  <!-- SLIDE 5: MATRIZ DE CUMPLIMIENTO -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Gobernanza y Estándares</span>
      </div>
      <span class="slide-num">05 / 11</span>
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
            <td><code>C01.4</code> SHA-256 y Model Garden, <code>C02.10</code> Model Armor y Guardia Crescendo, <code>C04.1</code> Contenedor Read-Only, <code>C04.3</code> Cloud IAP y Bloqueo SSRF, <code>C05.2–C05.4</code> Auth en Tiempo Constante e IAM, <code>C08.1/C08.4</code> ACLs RAG y AutoSxS, <code>C09.4</code> Sagas, <code>C10.1–C10.5</code> Seguridad MCP, <code>C11.1/C11.4</code> Anti-DoW y Logprobs Off, <code>C12.2</code> Alertas SCC AI.</td>
            <td><span class="pill pill-green">L1 / L2 / L3 Listo</span></td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">ISO/IEC 42001:2023</strong></td>
            <td>Sistema de Gestión de IA (AIMS Cláusulas 4–10 y Anexo A)</td>
            <td><code>Cláusula 4.1/4.2</code> Contexto y Stakeholders, <code>Cláusula 5/A.2.1/A.2.3</code> Política Corporativa IA, <code>A.6.1.2/A.7.3</code> Model Garden/Registry, <code>A.6.2.6</code> Model Armor y Model Monitoring, <code>Cláusula 9.1/A.6.2.4</code> Vertex Evaluation (AutoSxS), <code>A.6.2.8</code> SCC AI Protection.</td>
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

  <!-- SLIDE 6: ARQUITECTURA TÉCNICA -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Ingeniería del Sistema</span>
      </div>
      <span class="slide-num">06 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Arquitectura de Software</span>
      <h2 class="slide-title">Arquitectura Zero-Trust de 4 Capas y Defensa en Profundidad</h2>
      <p class="slide-subtitle">Arquitectura serverless endurecida en Google Cloud Run detrás de Identity-Aware Proxy (IAP) con inferencia Vertex AI ADC sin llaves API.</p>
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
          <div class="card-title" style="color: #60a5fa;">2. API Endurecida y Model Armor</div>
          <p class="card-text">
            • <strong>Contenedor Read-Only</strong> (<code>chmod -R a-w /app</code>, <code>C04.1</code>)<br>
            • <strong>Google Cloud Model Armor</strong> sanitizando entradas/salidas en línea<br>
            • Tokens en tiempo constante (<code>crypto.timingSafeEqual</code>, <code>C05.3</code>)<br>
            • Guardia DNS Rebinding (<code>C10.5</code>) y Firma MCP (<code>C10.1</code>)<br>
            • Cuotas Anti-DoW (<code>C11.1</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #34d399;">3. Vertex AI ADC y Multi-LLM</div>
          <p class="card-text">
            • <strong>Vertex AI</strong> (<code>gemini-3.8-flash</code>) vía IAM ADC sin requerir llave API Gemini<br>
            • <strong>Model Garden / Registry</strong> con modelos firmados (<code>C01.4</code>)<br>
            • Motor Multi-Proveedor (Claude, OpenRouter, OpenAI, Local Proxy)<br>
            • Detector Multi-Turno Crescendo (<code>C02.10</code>) y Logprobs Off (<code>C11.4</code>)<br>
            • Bloqueo SSRF/IMDS (<code>C04.3</code>)
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #a78bfa;">4. Datos, AutoSxS y SCC AI</div>
          <p class="card-text">
            • <strong>Cloud Firestore</strong> (<code>aegis-ai-db</code>) vía Admin SDK (308/308 pruebas)<br>
            • <strong>Vertex Evaluation (AutoSxS)</strong> y <strong>Model Monitoring</strong> (skew/drift)<br>
            • <strong>Security Command Center (SCC) con Protección AI</strong> en tiempo real<br>
            • Manifiesto SHA-256 (<code>C01.4</code>) y Sagas Compensatorias (<code>C09.4</code>)
          </p>
        </div>
      </div>

      <div class="card card-highlight" style="margin-top: 12px;">
        <div class="card-title" style="font-size: 9.5pt; color: #93c5fd;">Aislamiento Zero-Trust y Alertamiento SCC con Protección AI (C12.2):</div>
        <p class="card-text" style="font-size: 8pt;">
          El estado en tiempo de ejecución se persiste exclusivamente en Firestore (<code>system_config/admin_settings</code>) y caché efímero <code>/tmp/aegis-runtime-cache</code>. Cada evento de seguridad (escalación de prompt injection, bloqueo SSRF, fallo de token, exceso de cuota DoW, reversión de saga) emite una alerta JSON estructurada hacia Google Cloud Logging y <strong>Security Command Center (SCC) con Protección AI</strong> para respuesta inmediata del SOC.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Arquitectura de Contenedores y Seguridad C4</span>
      <span>Desplegado en Google Cloud Run (Revisión aegis-ai-00013)</span>
    </div>
  </div>

  <!-- SLIDE 7: CICLO DE VIDA DE PROTECCIÓN IA EN GOOGLE CLOUD (ISO/IEC 42001 FASES 3, 4 Y 5) -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Protección IA en Google Cloud</span>
      </div>
      <span class="slide-num">07 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Ciclo de Vida de Protección IA en Google Cloud (ISO/IEC 42001)</span>
      <h2 class="slide-title">5 Productos Nativos de Seguridad y Gobernanza en las Fases 3, 4 y 5</h2>
      <p class="slide-subtitle">Cómo AegisAI operacionaliza ISO/IEC 42001:2023 y OWASP AI-SVS v1.0 en Desarrollo, Evaluación y Despliegue Controlado en Producción.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 6px;">FASE 3 • DESARROLLO Y PROTECCIONES</div>
          <div class="card-title" style="color: #38bdf8;">Diseño de Sistemas AI y Cadena de Suministro</div>
          <p class="card-text" style="font-size: 7.7pt; line-height: 1.42;">
            • <strong>Mapa Visual de Brechas:</strong> Genera un mapa visual y basado en evidencia de las brechas entre el estado actual y el deseado (<code>L1/L2/L3</code>).<br>
            • <strong>Model Garden / Model Registry:</strong> Librería de modelos revisados (Garden) y modelos personales (Registry). Todos los modelos están firmados y verificados por Google y socios, evitando obtener modelos de Internet con posibles puertas traseras (<code>ISO A.6.1.2 / A.7.3</code>, <code>C01.4</code>).<br>
            • <strong>Model Armor:</strong> Se posiciona delante de los LLM. Sanitiza entradas y salidas en tiempo real, detecta y bloquea inyección de prompts y jailbreaks, y filtra contenido tóxico del usuario y de las respuestas por igual (<code>ISO A.6.2.6</code>, <code>C02.10</code>).
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-purple" style="margin-bottom: 6px;">FASE 4 • EVALUACIÓN DE CONTROLES</div>
          <div class="card-title" style="color: #a78bfa;">Revisión de los Controles Aplicados</div>
          <p class="card-text" style="font-size: 7.7pt; line-height: 1.42;">
            • <strong>Vertex Evaluation Service (AutoSxS):</strong> Marco integrado en Vertex AI que utiliza <strong>AutoSxS</strong> (categoriza y califica respuestas automáticamente como un maestro calificando la tarea de un alumno).<br>
            • <strong>Métricas de Seguridad:</strong> Evalúa discurso de odio, acoso, contenido sexualmente explícito y contenido peligroso.<br>
            • <strong>Pista de Auditoría ISO 42001:</strong> Mucho más rápido y económico que la revisión manual por especialistas humanos, proporcionando la pista de auditoría exigida por <code>ISO/IEC 42001 Cláusula 9.1 y A.6.2.4</code> (<code>OWASP C08.4</code>).
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-green" style="margin-bottom: 6px;">FASE 5 • DESPLIEGUE CONTROLADO</div>
          <div class="card-title" style="color: #34d399;">Despliegue Controlado en Producción y SOC</div>
          <p class="card-text" style="font-size: 7.7pt; line-height: 1.42;">
            • <strong>Vertex AI Model Monitoring:</strong> Evalúa el rendimiento en producción detectando <strong>sesgo entre entrenamiento y producción</strong> (<em>training-serving skew</em>) y <strong>deriva</strong> (<em>drift</em>, cuando el mundo cambia y el modelo queda obsoleto), alertando de inmediato si deja de operar con seguridad (<code>ISO Cláusula 9.1 / A.6.2.6</code>).<br>
            • <strong>Security Command Center (SCC) con Protección AI:</strong> Detección de amenazas y vulnerabilidades integrada con Vertex AI. Si alguien intenta enviar una inyección de prompts, aparece como alerta en tiempo real para que el SOC responda a tiempo (<code>ISO A.6.2.8 / C12.2</code>).
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 10px; background: rgba(30, 41, 59, 0.55); border-color: rgba(59, 130, 246, 0.4);">
        <p class="card-text" style="font-size: 7.9pt;">
          <strong>Integración en Escáner GCP en Vivo y Blueprint Remediado:</strong> El Escáner GCP en Vivo de AegisAI audita estos 5 servicios con tokens OAuth efímeros de solo lectura, y la Sección 3.4 de cada Arquitectura Remediada genera recetas Terraform/TypeScript listas para producción en las 3 fases.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Stack de Protección ISO/IEC 42001 (Fases 3, 4 y 5)</span>
      <span>Model Garden/Registry • Model Armor • Vertex Evaluation (AutoSxS) • Model Monitoring • SCC con Protección AI</span>
    </div>
  </div>

  <!-- SLIDE 8: FLUJO OPERATIVO -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Flujo Operativo</span>
      </div>
      <span class="slide-num">08 / 11</span>
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
              <strong style="color:#ffffff; font-size: 8.8pt;">Ingesta Autenticada y Model Armor Pre-Vuelo</strong>
              <p class="card-text">El usuario corporativo (verificado por Cloud IAP + Firebase ID Token) carga PDFs/ZIPs; Model Armor, <code>inspectPromptAndTrackSession</code> (<code>C02.10</code>) y DLP sanean la entrada.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">2</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Contexto SHA-256 y Procedencia Model Garden</strong>
              <p class="card-text">Se validan los snapshots normativos contra <code>integrity-manifest.json</code> (<code>C01.4</code>), modelos firmados en Model Garden/Registry y marcos por <code>tenantDomain</code> (<code>C08.1</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">3</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Evaluación Map-Reduce en Vertex AI y AutoSxS</strong>
              <p class="card-text"><code>gemini-3.8-flash</code> (ADC sin llaves, <code>temperature: 0.0</code>, <code>responseLogprobs: false</code>) evalúa cada lote con pista de auditoría Vertex Evaluation (AutoSxS).</p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 9px;">
          <div class="step-box">
            <div class="step-number" style="background: #10b981;">4</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Mapa Visual de Brechas y Apelación Humana (A.5.2)</strong>
              <p class="card-text">Gráficos radar interactivos, mapa visual L1/L2/L3 basado en evidencia y flujo directo de Apelación / Revisión Humana (<code>ai-appeals@aegisai.enterprise</code>).</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">5</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Arquitectura Remediada al 100% y Recetario Completo</strong>
              <p class="card-text">Sintetiza la Sección 3 drop-in (incl. Stack GCP de 3 Fases ISO 42001) + Sección 4 Cookbook para todos los hallazgos <code>1..N</code> con etiquetas precisas.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">6</div>
            <div>
              <strong style="color:#ffffff; font-size: 8.8pt;">Model Monitoring, SCC AI y Saga Compensatoria</strong>
              <p class="card-text">Guardado en Firestore con atribución <code>ownerUid</code> (<code>C05.4</code>), protección <code>runCompensatingSaga</code> (<code>C09.4</code>), monitoreo de skew/drift y alertas SCC AI.</p>
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

  <!-- SLIDE 9: ESPECIFICACIONES Y BENCHMARKS -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Especificaciones Técnicas</span>
      </div>
      <span class="slide-num">09 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Especificaciones y Verificación DevSecOps</span>
      <h2 class="slide-title">Benchmarks de Seguridad Verificados y Postura en Producción</h2>
      <p class="slide-subtitle">Validado continuamente mediante pruebas unitarias de reglas Firestore, suites OWASP AI-SVS y chequeos preflight en Cloud Run.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">308/308</div>
          <div class="stat-label">Pruebas unitarias de Cloud Firestore Security Rules aprobadas (<code>projects:test</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">5 GCP AI</div>
          <div class="stat-label">Servicios Nativos de Protección ISO 42001 en las Fases 3, 4 y 5</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">0</div>
          <div class="stat-label">Secretos expuestos o roles IAM amplios (<code>roles/viewer</code> revocado, <code>C05.2</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #34d399;">97.8%</div>
          <div class="stat-label">Puntaje Auto-Auditoría (100% ISO 42001 • 94.7% OWASP AI-SVS)</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Postura Endurecida en Cloud Run y Stack GCP</div>
          <p class="card-text" style="font-size: 8.2pt;">
            • <strong>Contenedor Inmutable (C04.1):</strong> Usuario no-root <code>aegisuser</code> con <code>chmod -R a-w /app</code>.<br>
            • <strong>Perímetro Zero-Trust (C04.3):</strong> Cloud IAP + <code>--no-allow-unauthenticated</code> + egreso privado VPC + bloqueo SSRF/IMDS.<br>
            • <strong>Stack GCP de 3 Fases:</strong> Model Garden/Registry, Model Armor, Vertex Evaluation (AutoSxS), Model Monitoring y SCC con Protección AI.<br>
            • <strong>Protección FinOps Anti-DoW (C11.1):</strong> Límites por usuario de tasa, concurrencia y presupuesto de tokens en 24h.
          </p>
        </div>

        <div class="card">
          <div class="card-title">Vertex AI ADC sin Llaves, Multi-Proveedor y AIMS</div>
          <p class="card-text" style="font-size: 8.2pt;">
            • <strong>Vertex AI sin Llaves (Predeterminado):</strong> Conectado a <code>gemini-3.8-flash</code> vía IAM ADC sin requerir llave API Gemini.<br>
            • <strong>Motor Multi-Proveedor:</strong> Soporta Anthropic Claude, OpenRouter, OpenAI Directo y Proxy Local/Corporativo.<br>
            • <strong>SCC AI y Cloud Logging (C12.2):</strong> Alertas en tiempo real (<code>aegis-security-alerting-c12-2</code>) para respuesta del SOC.<br>
            • <strong>Suite Documental Bilingüe:</strong> 8 Manuales en Inglés y 9 en Español + 3 Presentaciones Ejecutivas/FinOps/Maestra.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Benchmarks Técnicos y Telemetría QA</span>
      <span>Verificado en Node.js 22 / TypeScript 5.8 / Google Cloud Run</span>
    </div>
  </div>

  <!-- SLIDE 10: MATRIZ DE DEFENSA EN PROFUNDIDAD -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Matriz de Defensa en Profundidad</span>
      </div>
      <span class="slide-num">10 / 11</span>
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
            • <strong>C01.4 y C13.1 Cadena de Suministro:</strong> <code>verifyNormativeSnapshotsIntegrity()</code> SHA-256 + procedencia firmada en Model Garden / Registry.<br>
            • <strong>C02.10 y C07.1 Sanitización en Línea:</strong> Google Cloud Model Armor + <code>inspectPromptAndTrackSession()</code> multi-turno (HTTP 422).<br>
            • <strong>C04.1 & C04.3 Infraestructura:</strong> <code>/app</code> solo lectura (<code>chmod -R a-w</code>), Cloud IAP, egreso VPC y bloqueo SSRF/IMDS <code>validateOutboundEndpoint()</code>.<br>
            • <strong>C05.2, C05.3 & C05.4 Auth/IAM:</strong> Revocación de <code>roles/viewer</code> en <code>aegis-runner-sa</code>, <code>crypto.timingSafeEqual</code>, Firebase ID token y ACLs <code>ownerUid</code>.<br>
            • <strong>C08.1 & C08.4 RAG y Evaluación:</strong> Pre-filtrado ACL por dominio, Vertex Evaluation Service (AutoSxS) y Model Monitoring (skew/drift).<br>
            • <strong>C09.4 & C10.1–C10.5 Agentes/MCP:</strong> <code>runCompensatingSaga()</code>, firma MCP Ed25519/HMAC, OAuth 2.1 PKCE y <code>dnsRebindingGuard</code>.<br>
            • <strong>C11.1, C11.4 & C12.2 FinOps/SIEM:</strong> <code>acquireAntiDoWQuota()</code>, <code>responseLogprobs: false</code> y alertas SOC en tiempo real vía SCC AI.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #a78bfa;">Controles de Gobernanza AIMS ISO/IEC 42001:2023 (18 Cláusulas y Anexo A)</div>
          <p class="card-text" style="font-size: 7.8pt; line-height: 1.45;">
            • <strong>Cláusula 4.1 & 4.2 Contexto y Stakeholders:</strong> Matriz de cuestiones internas/externas, rol de proveedor de aseguramiento IA y partes interesadas.<br>
            • <strong>Cláusula 5.1, 5.2, A.2.1 & A.2.3 Liderazgo y Política IA:</strong> Política Corporativa de IA aprobada por dirección con revisión anual.<br>
            • <strong>Cláusula 7.2, 7.3 & A.3.3 Competencia y Canal Ético:</strong> Capacitación por rol y canal confidencial de denuncias (<code>ai-ethics-whistleblower@aegisai.enterprise</code>).<br>
            • <strong>A.4.1, A.6.1.2 y A.7.3 Activos y Cadena de Suministro IA:</strong> Catálogo de modelos verificados y firmados vía Model Garden y Model Registry.<br>
            • <strong>A.5.1–A.5.3 y A.6.2.6 Impacto, Apelación y Seguridad:</strong> Metodología AIIA, canal de apelación humana, Model Armor y Vertex AI Model Monitoring.<br>
            • <strong>Cláusula 9.1–9.3, A.6.2.4 y A.6.2.8 Evaluación y SOC:</strong> Pista de auditoría Vertex Evaluation (AutoSxS), auditorías internas y alertas SCC AI.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Trazabilidad Completa OWASP AI-SVS v1.0 & ISO/IEC 42001:2023</span>
      <span>Documentado en Manual 2 (Arquitectura), Manual 3 (Admin), Manual 4/6 (Despliegue) y Manual 8 (Gobernanza AIMS)</span>
    </div>
  </div>

  <!-- SLIDE 11: ROADMAP -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Visión Estratégica</span>
      </div>
      <span class="slide-num">11 / 11</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolución y Roadmap</span>
      <h2 class="slide-title">Siguientes Pasos en la Ingeniería de AegisAI</h2>
      <p class="slide-subtitle">Hoja de ruta para consolidar el aseguramiento autónomo de Inteligencia Artificial empresarial.</p>
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
            Síntesis automatizada de módulos de <strong>Terraform</strong> y <strong>Helm Charts</strong> que apliquen políticas de Cloud IAP, VPC Service Controls y Model Armor en un clic.
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.5); border-color: rgba(59, 130, 246, 0.4);">
        <div class="card-title" style="color: #ffffff; font-size: 10pt;">
          <span>🎯</span> Conclusión: Seguridad y Gobernanza que Aceleran la Innovación
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          AegisAI proporciona la <strong>certeza arquitectónica, integridad criptográfica y el Stack de Protección IA de Google Cloud en 3 Fases (ISO/IEC 42001)</strong> necesarios para que las organizaciones desplieguen sistemas de IA con confianza total.
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

temp_html_path = "/tmp/aegis_presentation_es.html"
with open(temp_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

os.makedirs("docs/manuales_pdf", exist_ok=True)
output_pdf_es = "docs/manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf"

cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{output_pdf_es}" --print-to-pdf-no-header "{temp_html_path}"'
subprocess.run(cmd, shell=True, check=True)

size_kb = os.path.getsize(output_pdf_es) / 1024
print("Spanish Presentation PDF successfully created at:")
print(f" -> {output_pdf_es} ({size_kb:.1f} KB)")
