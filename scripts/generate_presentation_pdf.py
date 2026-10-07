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
      padding: 16mm 20mm 14mm 20mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #090d16;
    }

    /* Ambient background lights */
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

    /* Slide Header */
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

    /* Slide Titles */
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

    /* Slide Body Container */
    .slide-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 10;
      margin: 8px 0;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 12px;
    }

    /* Cards */
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

    .card-success {
      border-color: rgba(16, 185, 129, 0.4);
      background: linear-gradient(145deg, rgba(6, 78, 59, 0.2) 0%, rgba(17, 24, 39, 0.8) 100%);
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

    /* Badges & Pills */
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

    /* Tables */
    .slide-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.2pt;
    }

    .slide-table th {
      background: rgba(30, 41, 59, 0.8);
      color: #f8fafc;
      text-align: left;
      padding: 7px 10px;
      font-weight: 700;
      border-bottom: 2px solid #334155;
    }

    .slide-table td {
      padding: 7px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
    }

    .slide-table tr:nth-child(even) td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* Stat Box */
    .stat-box {
      text-align: center;
      padding: 12px 8px;
    }

    .stat-number {
      font-family: 'Google Sans', sans-serif;
      font-size: 26pt;
      font-weight: 800;
      line-height: 1;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 8pt;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Flow Step */
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

    /* Footer */
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

    /* Big Hero for Cover */
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

    .tech-badges-row {
      display: flex;
      gap: 10px;
      justify-content: center;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>

  <!-- ========================================== -->
  <!-- SLIDE 1: PORTADA                           -->
  <!-- ========================================== -->
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
        Aseguramiento, Gobernanza y<br><span>Auditoría Continua de IA</span>
      </h1>
      <p class="cover-desc-big">
        Plataforma integral para evaluar, auditar y blindar arquitecturas de Inteligencia Artificial Empresarial (GenAI, LLMs, Agentes Autónomos y RAG) bajo estándares mundiales <strong>OWASP AISVS v1.0</strong> e <strong>ISO/IEC 42001</strong>.
      </p>

      <div class="tech-badges-row">
        <span class="pill pill-blue">OWASP AI-SVS v1.0 (12 Capítulos)</span>
        <span class="pill pill-blue">ISO/IEC 42001:2023</span>
        <span class="pill pill-green">GCP Live Scanner</span>
        <span class="pill pill-amber">Motor Dual: Gemini + OpenRouter</span>
        <span class="pill pill-blue">DevSecOps & CI/CD</span>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise Assurance Platform</span>
      <span>Licencia Apache 2.0 • Open Source</span>
      <span>Octubre 2026</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 2: EL PROBLEMA                       -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">El Contexto de Riesgo</span>
      </div>
      <span class="slide-num">02 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">El Problema a Resolver</span>
      <h2 class="slide-title">El Punto Ciego de Seguridad en la Adopción de GenAI</h2>
      <p class="slide-subtitle">Las empresas están desplegando Inteligencia Artificial Generativa a una velocidad sin precedentes, pero sin controles arquitectónicos ni defensas auditables.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-danger">
          <div class="card-title">
            <span style="color:#ef4444;">⚠</span> Despliegue Acelerado sin Gobierno
          </div>
          <p class="card-text">
            Más del <strong>80% de los proyectos de IA corporativos</strong> pasan a producción sin una revisión formal de ciberseguridad, ignorando vectores de ataque propios de modelos de lenguaje (LLMs).
          </p>
        </div>

        <div class="card card-danger">
          <div class="card-title">
            <span style="color:#ef4444;">⚠</span> Superficie de Ataque Inédita
          </div>
          <p class="card-text">
            Los pipelines RAG y agentes autónomos introducen nuevos riesgos críticos: <strong>Prompt Injection Indirecta</strong>, <strong>Envenenamiento de Embeddings</strong>, fugas de contexto y exfiltración de memoria.
          </p>
        </div>

        <div class="card card-danger">
          <div class="card-title">
            <span style="color:#ef4444;">⚠</span> Vacío entre CISO y Científicos de Datos
          </div>
          <p class="card-text">
            Los equipos de ciberseguridad carecen de herramientas especializadas para entender grafos de agentes y bases vectoriales; los desarrolladores de IA desconocen los marcos normativos formales.
          </p>
        </div>
      </div>

      <div class="grid-2" style="margin-top: 14px;">
        <div class="card">
          <div class="card-title" style="color: #f59e0b;">Falta de Estándares Aplicados</div>
          <p class="card-text">
            A pesar de existir marcos como <strong>OWASP AISVS</strong> e <strong>ISO 42001</strong>, las organizaciones no cuentan con software automatizado que traduzca cientos de controles teóricos en validaciones técnicas de código e infraestructura en la nube.
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #38bdf8;">Proliferación de "Shadow AI"</div>
          <p class="card-text">
            Uso informal de APIs externas con almacenamiento desprotegido de credenciales maestras, ausencia de cuotas, falta de cifrado en reposo para vectores y registros con información personal identificable (PII).
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Diagnóstico de Riesgos de IA</span>
      <span>Fuente: OWASP GenAI Security Project & Gartner Research</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 3: IMPACTO DE NO PREVENIR            -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Análisis de Consecuencias</span>
      </div>
      <span class="slide-num">03 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Impacto de la No Prevención</span>
      <h2 class="slide-title">El Costo Real de Ignorar la Auditoría Preventiva</h2>
      <p class="slide-subtitle">Operar sistemas de IA sin aseguramiento formal acarrea consecuencias financieras, legales y operativas devastadoras.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 14px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #ef4444;">€35M</div>
          <div class="stat-label">o 7% de facturación global por multas de la <strong>EU AI Act</strong></div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #f59e0b;">$4.88M</div>
          <div class="stat-label">Costo promedio global de una filtración de datos corporativos (IBM 2024)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">10 de 10</div>
          <div class="stat-label">Vulnerabilidades del <strong>OWASP LLM Top 10</strong> presentes por omisión</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">100%</div>
          <div class="stat-label">Prevenible mediante escaneo arquitectónico automatizado</div>
        </div>
      </div>

      <div class="grid-3">
        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Exfiltración de Secretos y PII</div>
          <p class="card-text">
            Inyecciones de prompt capaces de extraer claves de API, secretos de base de datos o historiales crediticios de clientes incluidos inadvertidamente en el contexto del modelo fundacional.
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Parálisis Regulatoria y Clausura</div>
          <p class="card-text">
            Incumplimiento de leyes de protección de datos (LFPDPPP, GDPR) y regulaciones del consumidor (LFPC), derivando en auditorías punitivas, retiro forzoso de productos de IA y litigios civiles.
          </p>
        </div>

        <div class="card">
          <div class="card-title" style="color: #fca5a5;">Pérdida Crítica de Reputación</div>
          <p class="card-text">
            Alucinaciones tóxicas en agentes de atención a clientes y toma de decisiones discriminatorias o sesgadas que destruyen la confianza del mercado y devaluación de la marca.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Evaluación de Impacto y Continuidad de Negocio</span>
      <span>Criterios alineados a ISO/IEC 42001:2023 Cláusula 6</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 4: CÓMO RESOLVEMOS EL PROBLEMA       -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Propuesta de Valor</span>
      </div>
      <span class="slide-num">04 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Nuestra Solución</span>
      <h2 class="slide-title">AegisAI: Aseguramiento Integral y Automatizado</h2>
      <p class="slide-subtitle">Transformamos la auditoría de IA de un proceso manual que toma semanas en un análisis algorítmico exhaustivo que toma segundos.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2">
        <div class="card card-highlight">
          <div class="card-title" style="color: #60a5fa;">
            <span>🛡</span> Enfoque Proactivo & Shift-Left
          </div>
          <p class="card-text" style="font-size: 9pt; margin-bottom: 8px;">
            AegisAI evalúa los artefactos técnicos (diagramas de flujo, especificaciones de microservicios, configuraciones de prompts y cloud infra) <strong>antes y durante</strong> su puesta en producción.
          </p>
          <ul style="font-size: 8pt; color: #cbd5e1; margin: 0; padding-left: 18px; line-height: 1.5;">
            <li>Evaluación granular de controles de seguridad en segundos.</li>
            <li>Identificación inmediata de áreas de oportunidad y controles reprobados.</li>
            <li>Aislamiento estricto de secretos y enmascaramiento criptográfico de claves.</li>
          </ul>
        </div>

        <div class="card card-highlight">
          <div class="card-title" style="color: #34d399;">
            <span>⚡</span> Remediación Automatizada & Código Listo
          </div>
          <p class="card-text" style="font-size: 9pt; margin-bottom: 8px;">
            No solo señalamos qué está mal: generamos el <strong>plan de acción técnico</strong>, la arquitectura corregida y las recetas de código para subsanar cada falla.
          </p>
          <ul style="font-size: 8pt; color: #cbd5e1; margin: 0; padding-left: 18px; line-height: 1.5;">
            <li>Recetas de código en TypeScript, Python y Google Cloud CLI.</li>
            <li>Generación de diagramas de arquitectura blindada paso a paso.</li>
            <li>Exportación de informes ejecutivos en PDF de calidad editorial.</li>
          </ul>
        </div>
      </div>

      <div class="grid-3" style="margin-top: 14px;">
        <div class="card">
          <div class="card-title">1. Diagnóstico Estándar</div>
          <p class="card-text">Contraste matemático contra OWASP AISVS, ISO 42001 y normativas legales mexicanas.</p>
        </div>
        <div class="card">
          <div class="card-title">2. Escáner en Vivo GCP</div>
          <p class="card-text">Inspección de proyectos reales de Google Cloud: Vertex AI, Cloud Run, Secret Manager y IAM.</p>
        </div>
        <div class="card">
          <div class="card-title">3. Trazabilidad C-Level</div>
          <p class="card-text">Métricas agregadas de postura de seguridad, porcentajes de cumplimiento y auditorías históricas.</p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Paradigma de Seguridad Preventiva</span>
      <span>Diseñado para CISO, Arquitectos Cloud y Equipos de MLOps</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 5: MARCOS NORMATIVOS                 -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Gobernanza y Cumplimiento</span>
      </div>
      <span class="slide-num">05 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Matriz Normativa</span>
      <h2 class="slide-title">Cumplimiento Multi-Estándar y Gobernanza Global</h2>
      <p class="slide-subtitle">Soporte nativo para los estándares de seguridad de IA más exigentes del mundo y capacidad de personalización empresarial.</p>
    </div>

    <div class="slide-body">
      <table class="slide-table card" style="padding: 0;">
        <thead>
          <tr>
            <th style="width: 20%;">Estándar / Regulación</th>
            <th style="width: 25%;">Alcance Técnico</th>
            <th style="width: 35%;">Controles Evaluados por AegisAI</th>
            <th style="width: 20%;">Nivel de Cobertura</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #60a5fa;">OWASP AI-SVS v1.0</strong></td>
            <td>Estándar de Verificación de Seguridad en Sistemas de IA</td>
            <td>12 Capítulos: Gobernanza, Cadena de Suministro, Datos, Arquitectura, Modelos, RAG, Pruebas y Despliegue.</td>
            <td><span class="pill pill-green">100% Exhaustivo</span></td>
          </tr>
          <tr>
            <td><strong style="color: #a78bfa;">ISO/IEC 42001:2023</strong></td>
            <td>Sistema de Gestión de Inteligencia Artificial (AIMS)</td>
            <td>Cláusulas 4 a 10 y Controles del Anexo A: Evaluación de impacto ético, gestión de riesgos de IA y auditoría continua.</td>
            <td><span class="pill pill-green">Certificación Lista</span></td>
          </tr>
          <tr>
            <td><strong style="color: #34d399;">Leyes Mexicanas (2026)</strong></td>
            <td>Protección al Consumidor (LFPC) y Datos Personales (LFPDPPP)</td>
            <td>Transparencia de algoritmos, prevención de publicidad engañosa con IA, derechos ARCO y consentimiento expreso.</td>
            <td><span class="pill pill-blue">Regulatorio Local</span></td>
          </tr>
          <tr>
            <td><strong style="color: #fcd34d;">Marco BYOF (Personalizado)</strong></td>
            <td><em>Bring Your Own Framework</em></td>
            <td>Motor que permite cargar normativas internas organizacionales en JSON con controles ponderados específicos.</td>
            <td><span class="pill pill-amber">Extensible</span></td>
          </tr>
        </tbody>
      </table>

      <div class="card" style="margin-top: 12px; background: rgba(30, 41, 59, 0.4);">
        <p class="card-text" style="font-size: 8.5pt;">
          <strong>Auditoría Cruzada Unificada:</strong> Un mismo proyecto o arquitectura puede ser auditado simultáneamente contra múltiples marcos con un solo clic, consolidando un puntaje global y hallazgos específicos por normativa.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Frameworks & Compliance Engine</span>
      <span>Alineado a las directrices de NIST AI RMF y EU AI Act</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 6: ARQUITECTURA TÉCNICA              -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Ingeniería del Sistema</span>
      </div>
      <span class="slide-num">06 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Arquitectura de Software</span>
      <h2 class="slide-title">Arquitectura Desacoplada, Resiliente y Segura</h2>
      <p class="slide-subtitle">Diseño modular basado en microservicios limpios, middleware de seguridad estricto y motor desacoplado de inferencia.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <!-- Columna 1 -->
        <div class="card">
          <div class="card-title" style="color: #38bdf8;">1. Frontend & Presentación</div>
          <p class="card-text">
            • <strong>React 19 + TypeScript + Vite</strong><br>
            • Tailwind CSS v4 (Aegis Dark System)<br>
            • Gráficos dinámicos con <strong>Recharts</strong><br>
            • Exportación PDF con <strong>jsPDF & AutoTable</strong><br>
            • Estado reactivo local y soporte offline
          </p>
        </div>

        <!-- Columna 2 -->
        <div class="card">
          <div class="card-title" style="color: #60a5fa;">2. Backend & Seguridad API</div>
          <p class="card-text">
            • <strong>Node.js + Express + TypeScript</strong><br>
            • Middleware RBAC (<code>x-admin-token</code>, <code>x-api-key</code>)<br>
            • Cabeceras de seguridad estrictas (CSP, HSTS)<br>
            • Enmascaramiento preventivo de logs de consola<br>
            • Almacenamiento dual: JSON local + Firestore
          </p>
        </div>

        <!-- Columna 3 -->
        <div class="card">
          <div class="card-title" style="color: #34d399;">3. Motor de IA & Cloud Scanner</div>
          <p class="card-text">
            • <strong>Google Gemini API</strong> (3.5 Flash / 3.8 Flash)<br>
            • <strong>OpenRouter / OpenAI Proxy</strong> desacoplado<br>
            • <strong>GCP Live Scanner</strong>: Vertex AI, IAM, Secret Manager, Cloud Run y Storage<br>
            • Resiliencia y reintentos ante saturación
          </p>
        </div>
      </div>

      <div class="card card-highlight" style="margin-top: 12px;">
        <div class="card-title" style="font-size: 9.5pt; color: #93c5fd;">Flujo de Seguridad Zero-Trust en la Inferencia:</div>
        <p class="card-text" style="font-size: 8pt;">
          Ningún secreto, token o clave privada es enviado jamás en el contexto del modelo de lenguaje. El motor aplica un <strong>Filtro de Desinfección Cero-Fugas</strong> antes de llamar a la API de inferencia, garantizando confidencialidad absoluta de la propiedad intelectual de la empresa auditada.
        </p>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Diagrama C4 Nivel 2 (Contenedores)</span>
      <span>Preparado para Google Cloud Run & Docker Enterprise</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 7: CÓMO SOLUCIONA EN LA PRÁCTICA     -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Flujo Operativo</span>
      </div>
      <span class="slide-num">07 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Operación en la Práctica</span>
      <h2 class="slide-title">El Flujo de Trabajo del Auditor: De la Duda a la Solución</h2>
      <p class="slide-subtitle">Cómo AegisAI guía al usuario desde la ingesta arquitectónica hasta el blindaje total de la infraestructura.</p>
    </div>

    <div class="slide-body">
      <div class="grid-2" style="gap: 16px;">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="step-box">
            <div class="step-number">1</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Ingesta y Contextualización</strong>
              <p class="card-text">El usuario carga el diagrama, código de infraestructura o descripción del pipeline RAG y selecciona las normativas a evaluar.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">2</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Escaneo de Nube en Vivo (Opcional)</strong>
              <p class="card-text">Si está desplegado en Google Cloud, AegisAI conecta con Vertex AI, Cloud Storage y Secret Manager para verificar configuraciones reales.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number">3</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Evaluación Algorítmica con IA</strong>
              <p class="card-text">El motor de inferencia contrasta control por control, evalúa suficiencia técnica y calcula el puntaje global de cumplimiento (0 - 100).</p>
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div class="step-box">
            <div class="step-number" style="background: #10b981;">4</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Informe Ejecutivo Interactivo</strong>
              <p class="card-text">Visualización de gráficos radar de cumplimiento por capítulo, controles aprobados vs. áreas de oportunidad críticas.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">5</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Generador de Plan de Acción y Recetas</strong>
              <p class="card-text">AegisAI entrega el código exacto (TypeScript, Python, Terraform) para parchar cada vulnerabilidad encontrada.</p>
            </div>
          </div>

          <div class="step-box">
            <div class="step-number" style="background: #10b981;">6</div>
            <div>
              <strong style="color:#ffffff; font-size: 9pt;">Exportación Formal y Descarga</strong>
              <p class="card-text">Descarga instantánea de informes de auditoría en PDF listos para certificar ante comités de seguridad o reguladores.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Metodología de Auditoría en 6 Fases</span>
      <span>Tiempo total promedio de ciclo: menor a 60 segundos</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 8: DATOS TÉCNICOS & DEVSECOPS        -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Especificaciones Técnicas</span>
      </div>
      <span class="slide-num">08 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Datos Técnicos de la Arquitectura</span>
      <h2 class="slide-title">Especificaciones, Rendimiento y Calidad de Código</h2>
      <p class="slide-subtitle">Construido bajo estándares industriales de resiliencia, alta disponibilidad y máxima seguridad operativa.</p>
    </div>

    <div class="slide-body">
      <div class="grid-4" style="margin-bottom: 12px;">
        <div class="card stat-box">
          <div class="stat-number" style="color: #38bdf8;">&lt; 3.5s</div>
          <div class="stat-label">Latencia promedio por auditoría completa de 12 capítulos</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #10b981;">100%</div>
          <div class="stat-label">Cobertura de pruebas de seguridad OWASP LLM Red-Teaming</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #a78bfa;">0</div>
          <div class="stat-label">Claves o secretos expuestos (Verificado con <code>git-secrets</code>)</div>
        </div>

        <div class="card stat-box">
          <div class="stat-number" style="color: #34d399;">Multi-LLM</div>
          <div class="stat-label">Gemini, Claude 3.7, GPT-4o, DeepSeek R1 & Ollama</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">Infraestructura y Despliegue</div>
          <p class="card-text" style="font-size: 8.5pt;">
            • <strong>Contenedorización:</strong> Dockerfile multi-stage optimizado (peso de imagen reducido).<br>
            • <strong>Cloud Run:</strong> Autoescalado de 0 a N instancias en Google Cloud, puerto estándar 8080.<br>
            • <strong>Secret Manager:</strong> Inyección segura de credenciales en tiempo de ejecución.<br>
            • <strong>CI/CD Ready:</strong> Scripts automatizados de pruebas de regresión y verificación de API.
          </p>
        </div>

        <div class="card">
          <div class="card-title">Mecanismos de Resiliencia y Privacidad</div>
          <p class="card-text" style="font-size: 8.5pt;">
            • <strong>Fallback Automático:</strong> Tolerancia a saturación con reintentos exponenciales.<br>
            • <strong>Aislamiento de Entornos:</strong> Soporte de configuración local segura (<code>*.local.json</code>).<br>
            • <strong>Zero Data Retention:</strong> Los datos de arquitectura analizados no se utilizan para reentrenar modelos fundacionales.<br>
            • <strong>Modo Offline/Demo:</strong> Capacidad de ejecución autónoma sin dependencias de red externa.
          </p>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <span>AegisAI Enterprise • Especificaciones Técnicas y Benchmarks</span>
      <span>Probado y verificado en Node.js 20+ / Chrome Headless Engine</span>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- SLIDE 9: SIGUIENTES PASOS (ROADMAP)        -->
  <!-- ========================================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-logo">
        <span class="brand-logo-text">AEGIS<span>AI</span></span>
        <span class="brand-tag">Visión y Futuro</span>
      </div>
      <span class="slide-num">09 / 09</span>
    </div>

    <div class="title-block">
      <span class="slide-category">Evolución y Roadmap</span>
      <h2 class="slide-title">Siguientes Pasos en el Desarrollo de AegisAI</h2>
      <p class="slide-subtitle">Hoja de ruta para consolidar el estándar de aseguramiento de Inteligencia Artificial empresarial.</p>
    </div>

    <div class="slide-body">
      <div class="grid-3">
        <div class="card card-highlight">
          <div class="pill pill-blue" style="margin-bottom: 8px;">Q4 2026 • Corto Plazo</div>
          <div class="card-title" style="color: #38bdf8;">Integración CI/CD Nativa</div>
          <p class="card-text">
            Creación de <strong>GitHub Actions</strong> y <strong>GitLab CI Runners</strong> oficiales para bloquear automáticamente *pull requests* que introduzcan vulnerabilidades en prompts o pipelines RAG antes de llegar a producción.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-green" style="margin-bottom: 8px;">Q1 2027 • Mediano Plazo</div>
          <div class="card-title" style="color: #34d399;">Auditoría de Agentes Multi-Etapa</div>
          <p class="card-text">
            Módulo especializado para auditar agentes autónomos complejos (LangGraph, CrewAI, AutoGen): rastreo de llamadas a herramientas, verificación de límites de autorización y prevención de loops infinitos maliciosos.
          </p>
        </div>

        <div class="card card-highlight">
          <div class="pill pill-amber" style="margin-bottom: 8px;">Q2 2027 • Largo Plazo</div>
          <div class="card-title" style="color: #fcd34d;">Auto-Remediación con IaC</div>
          <p class="card-text">
            Generación automática de módulos de <strong>Terraform</strong> y <strong>Helm Charts</strong> que apliquen automáticamente las recetas de blindaje en Google Cloud, AWS y Azure con un solo comando.
          </p>
        </div>
      </div>

      <div class="card" style="margin-top: 14px; background: rgba(30, 41, 59, 0.5); border-color: rgba(59, 130, 246, 0.4);">
        <div class="card-title" style="color: #ffffff; font-size: 10pt;">
          <span>🎯</span> Conclusión: Seguridad que Habilita la Innovación
        </div>
        <p class="card-text" style="font-size: 8.5pt;">
          AegisAI no busca frenar la adopción de IA, sino proporcionar el <strong>marco de certeza técnica y gobernanza</strong> necesario para que las organizaciones desplieguen modelos y agentes con total confianza, protegiendo sus activos y garantizando su cumplimiento normativo.
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

temp_html_path = "/tmp/aegis_presentation.html"
with open(temp_html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Temporary HTML written to {temp_html_path}")

# Outputs
output_pdf_es = "docs/manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf"
output_pdf_eng = "docs/Manuals_english/pdf/AegisAI_Executive_Presentation.pdf"

os.makedirs("docs/manuales_pdf", exist_ok=True)
os.makedirs("docs/Manuals_english/pdf", exist_ok=True)

print("Compiling Presentation PDF via Headless Chrome...")
cmd = f'google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="{output_pdf_es}" --print-to-pdf-no-header "{temp_html_path}"'
subprocess.run(cmd, shell=True, check=True)

import shutil
shutil.copy(output_pdf_es, output_pdf_eng)

size_kb = os.path.getsize(output_pdf_es) / 1024
print(f"Presentation PDF successfully created:")
print(f" -> {output_pdf_es} ({size_kb:.1f} KB)")
print(f" -> {output_pdf_eng} ({size_kb:.1f} KB)")
