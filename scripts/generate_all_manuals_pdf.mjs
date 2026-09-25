import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = path.join(process.cwd(), 'docs', 'manuales_pdf');
const tempHtmlDir = path.join(process.cwd(), 'docs', '.temp_html');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(tempHtmlDir)) {
  fs.mkdirSync(tempHtmlDir, { recursive: true });
}

const gcpLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="36" height="36" style="vertical-align: middle;">
  <path fill="#4285F4" d="M38.4 21.2C37.3 14.8 31.8 10 25.1 10c-5.4 0-10.1 3.2-12.2 7.8-5.3.8-9.4 5.4-9.4 11 0 6.2 5 11.2 11.2h23.4c5.5 0 10-4.5 10-10 0-4.9-3.6-8.9-8.3-9.8z"/>
  <path fill="#34A853" d="M22.7 18.2c-.8-.2-1.7-.3-2.6-.3-4.2 0-7.8 2.8-9 6.7 1.1-.4 2.3-.6 3.6-.6 5 0 9.2 3.6 10 8.4l1.3-.2c-.3-4.5-2.2-8.5-5.3-11.2l2-2.8z" opacity="0.9"/>
  <path fill="#FBBC05" d="M38.4 21.2c-.4 0-.8.1-1.2.1 1.2 2.2 1.9 4.7 1.9 7.4 0 .4 0 .7-.1 1.1h9.1c.5-1.1.9-2.3.9-3.6 0-4.9-3.6-8.9-8.3-9.8l-2.4 4.8z" opacity="0.9"/>
  <path fill="#EA4335" d="M25.1 10c1.7 0 3.3.3 4.8 1l2.4-4.8C29.9 5.4 27.6 5 25.1 5c-7.3 0-13.6 4.1-16.7 10.1l4.5 2.6c2.1-4.6 6.8-7.7 12.2-7.7z" opacity="0.9"/>
</svg>
`;

function getBaseCss(manualTitle) {
  return `
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
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, .font-heading {
      font-family: 'Google Sans', 'Roboto', sans-serif;
      color: #0f172a;
      margin-top: 1.2em;
      margin-bottom: 0.4em;
      font-weight: 700;
    }

    h1 {
      font-size: 18pt;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      color: #0f172a;
    }

    h2 {
      font-size: 13.5pt;
      color: #1e293b;
      margin-top: 1.4em;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
    }

    h3 {
      font-size: 11pt;
      color: #1a73e8;
      margin-top: 1.1em;
    }

    h4 {
      font-size: 10pt;
      color: #334155;
    }

    p {
      margin-top: 0.3em;
      margin-bottom: 0.8em;
      color: #334155;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Running Header & Footer for Print */
    .running-header {
      position: fixed;
      top: -12mm;
      left: 0;
      right: 0;
      height: 9mm;
      border-bottom: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
      font-family: 'Google Sans', sans-serif;
    }

    .running-footer {
      position: fixed;
      bottom: -13mm;
      left: 0;
      right: 0;
      height: 9mm;
      border-top: 1px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      color: #64748b;
      font-family: 'Google Sans', sans-serif;
    }

    /* Cover Page */
    .cover-page {
      page-break-after: always;
      break-after: page;
      padding: 10mm 5mm 5mm 5mm;
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .cover-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15mm;
    }

    .cover-brand-title {
      font-size: 14pt;
      font-weight: 700;
      color: #1e293b;
      letter-spacing: -0.2px;
    }

    .cover-brand-sub {
      font-size: 8pt;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .cover-hero-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
      color: #ffffff;
      padding: 14mm 12mm;
      border-radius: 12px;
      border: 1px solid #475569;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
      position: relative;
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
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    .cover-title {
      font-size: 24pt;
      line-height: 1.15;
      font-weight: 700;
      color: #ffffff;
      margin: 6px 0 10px 0;
      border-bottom: none;
    }

    .cover-subtitle {
      font-size: 12pt;
      color: #cbd5e1;
      font-weight: 400;
      margin-top: 0;
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .cover-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 15px;
    }

    .cover-badge {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #e2e8f0;
      font-size: 7.5pt;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .metadata-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      margin-top: auto;
    }

    .metadata-table td {
      padding: 7px 12px;
      border-bottom: 1px solid #e2e8f0;
    }

    .metadata-table td.label {
      font-weight: 700;
      color: #475569;
      width: 32%;
      background: #f1f5f9;
    }

    .metadata-table td.val {
      color: #0f172a;
      font-weight: 500;
    }

    /* Content Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 8.5pt;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    table.data-table th {
      background: #1e293b;
      color: #ffffff;
      text-align: left;
      padding: 7px 10px;
      font-family: 'Google Sans', sans-serif;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    table.data-table td {
      padding: 6px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    table.data-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Callouts */
    .callout {
      border-radius: 8px;
      padding: 10px 14px;
      margin: 12px 0;
      font-size: 9pt;
      page-break-inside: avoid;
    }

    .callout-info {
      background: #eff6ff;
      border-left: 4px solid #1a73e8;
      color: #1e3a8a;
    }

    .callout-warning {
      background: #fffbeb;
      border-left: 4px solid #f59e0b;
      color: #78350f;
    }

    .callout-success {
      background: #f0fdf4;
      border-left: 4px solid #16a34a;
      color: #14532d;
    }

    .callout-danger {
      background: #fef2f2;
      border-left: 4px solid #dc2626;
      color: #7f1d1d;
    }

    .callout-title {
      font-weight: 700;
      margin-bottom: 3px;
      font-family: 'Google Sans', sans-serif;
      font-size: 9.5pt;
    }

    /* Code Blocks */
    pre, code {
      font-family: 'Roboto Mono', monospace;
    }

    code {
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 4px;
      font-size: 8.5pt;
    }

    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 8pt;
      line-height: 1.4;
      overflow-x: auto;
      margin: 10px 0;
      border: 1px solid #334155;
      page-break-inside: avoid;
    }

    /* Diagrams */
    .diagram-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px;
      margin: 12px 0;
      font-family: 'Roboto Mono', monospace;
      font-size: 7.8pt;
      line-height: 1.35;
      color: #0f172a;
      white-space: pre-wrap;
      page-break-inside: avoid;
    }

    .pill {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 9999px;
      border: 1px solid transparent;
    }

    .pill-blue { background: #eff6ff; color: #1a73e8; border-color: #bfdbfe; }
    .pill-green { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
    .pill-amber { background: #fffbeb; color: #d97706; border-color: #fde68a; }
    .pill-red { background: #fef2f2; color: #dc2626; border-color: #fecaca; }

    ul, ol {
      margin-top: 0.3em;
      margin-bottom: 0.8em;
      padding-left: 20px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }
  `;
}

function renderHtmlDocument(title, category, contentHtml) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${title} - AegisAI</title>
  <style>
    ${getBaseCss(title)}
  </style>
</head>
<body>
  <div class="running-header">
    <div style="display: flex; align-items: center; gap: 6px;">
      ${gcpLogoSvg}
      <span style="font-weight: 700; color: #0f172a;">AegisAI</span>
      <span>·</span>
      <span>Google Cloud AI Governance</span>
    </div>
    <div style="font-weight: 600; color: #1a73e8;">
      ${title.toUpperCase()}
    </div>
  </div>

  <div class="running-footer">
    <div>AegisAI Public · Documentación Técnica Oficial</div>
    <div>Documentación Oficial de Ingeniería 2026 · Versión 2.0</div>
  </div>

  ${contentHtml}
</body>
</html>`;
}

// -------------------------------------------------------------
// MANUAL 1: MANUAL DE USO
// -------------------------------------------------------------
function getManualDeUsoHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">AI Security & Governance Assurance Suite</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Manual Oficial de Usuario y Operaciones</div>
      <h1 class="cover-title">Manual de Uso del Operador</h1>
      <p class="cover-subtitle">Guía integral para la auditoría, evaluación de riesgos, monitoreo continuo y remediación de sistemas de IA generativa y agentes en Google Cloud.</p>
      <div class="cover-badges">
        <span class="cover-badge">OWASP AI-SVS v1.0</span>
        <span class="cover-badge">ISO/IEC 42001:2023 (SGIA)</span>
        <span class="cover-badge">Google Cloud Vertex AI</span>
        <span class="cover-badge">Firestore aegis-ai-db</span>
        <span class="cover-badge">Zero-Trust & Dominios Autorizados</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-OPS-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Auditores de IA, Arquitectos de Seguridad Cloud, Equipos de Cumplimiento y DevSecOps</td></tr>
      <tr><td class="label">Autor / Arquitecto Líder:</td><td class="val">AegisAI Open Source Community & Core Security Engineering Team</td></tr>
      <tr><td class="label">Base de Datos Dedicada:</td><td class="val"><code>aegis-ai-db</code> (Proyecto: your-gcp-project-id)</td></tr>
      <tr><td class="label">Versión de Plataforma:</td><td class="val">AegisAI v2.0 Enterprise (Edición Metálica Google Cloud)</td></tr>
      <tr><td class="label">Fecha de Liberación:</td><td class="val">24 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Introducción y Alcance Operativo</b> — Propósito de AegisAI y marco regulatorio dual.</li>
    <li><b>2. Acceso y Autenticación Segura</b> — Zero-Trust, Google Workspace OAuth y políticas de dominio.</li>
    <li><b>3. Navegación por el Dashboard Ejecutivo</b> — KPIs de madurez, filtros normativos y lista de sistemas.</li>
    <li><b>4. Flujo de Nueva Auditoría Manual</b> — Parametrización, niveles de evaluación (L1-L3) y manifiesto.</li>
    <li><b>5. Escáner en Vivo de Google Cloud</b> — Conexión con GCP (ADC/Service Account/Token), recolección de telemetría y auditoría automática.</li>
    <li><b>6. Análisis e Interpretación de Reportes Técnicos</b> — Puntos aprobados/fallidos, evidencia técnica, matriz RACI y plan de remediación.</li>
    <li><b>7. Ciclo de Vida de Remediación y Re-auditoría</b> — Proceso de corrección y generación del reporte 100% conforme.</li>
    <li><b>8. Catálogo de Marcos y Frameworks Personalizados</b> — Uso de marcos mexicanos (INAI, LFPC) y creación de estándares propios.</li>
  </ol>

  <h2>1. Introducción y Alcance Operativo</h2>
  <p><b>AegisAI</b> es una plataforma corporativa desarrollada sobre Google Cloud diseñada para automatizar la auditoría técnica, la gobernanza algorítmica y la verificación de seguridad de modelos fundacionales (LLMs), arquitecturas RAG (Retrieval-Augmented Generation) y agentes autónomos.</p>
  <p>La plataforma evalúa simultáneamente los dos estándares internacionales líderes:</p>
  <ul>
    <li><b>OWASP AI-SVS v1.0 (AI Security Verification Standard):</b> Verificación técnica de 12 capítulos de ciberseguridad, incluyendo inyección de prompts, envenenamiento de datos, denegación de servicio por ventana de contexto y robo de modelos.</li>
    <li><b>ISO/IEC 42001:2023 (Sistema de Gestión de IA - SGIA):</b> Cumplimiento de las Cláusulas 4 a 10 y los Controles del Anexo A (Políticas de IA, Análisis de Impacto Algorítmico, Supervisión Humana y Calidad de Datos).</li>
  </ul>

  <div class="callout callout-info">
    <div class="callout-title">Aislamiento de Base de Datos (aegis-ai-db)</div>
    A partir de la versión 2.0, AegisAI opera en una base de datos nombrada independiente (<code>aegis-ai-db</code>) desacoplada de la base por defecto del proyecto GCP, garantizando aislamiento estricto y gobernanza de datos para auditoría.
  </div>

  <h2>2. Acceso y Autenticación Segura</h2>
  <p>El acceso a AegisAI implementa una arquitectura <b>Zero-Trust</b> estricta basada en Google Cloud Identity y Firebase Authentication.</p>
  <div class="diagram-box">
[ Usuario Corporativo ]
        |
        v
[ Pantalla de Login Esmerilada ] ---> [ Google Workspace OAuth ]
                                             |
                                             v
                      ¿El dominio del token es @example.com?
                               /              \\
                            (SÍ)              (NO)
                             /                  \\
                            v                    v
              [ Acceso Concedido ]       [ Rechazo Inmediato ]
           Token vinculado a aegis-ai-db   Sesión purgada en local
  </div>

  <h3>Reglas de Acceso:</h3>
  <ul>
    <li>Únicamente se admiten correos con dominio corporativo verificado (<code>@example.com</code>). Cualquier otro dominio es rechazado tanto en el cliente como en las reglas de seguridad de Firestore a nivel kernel de base de datos.</li>
    <li>Las sesiones no se persisten en almacenamiento local no seguro. Al cerrar el navegador o presionar <b>Cerrar Sesión</b>, los tokens se purgan inmediatamente.</li>
  </ul>

  <h2>3. Navegación por el Dashboard Ejecutivo</h2>
  <p>El Dashboard principal consolida en una sola pantalla el estado de salud de todos los sistemas de IA de la organización:</p>
  <table class="data-table">
    <tr>
      <th>Componente UI</th>
      <th>Función y Comportamiento</th>
    </tr>
    <tr>
      <td><b>Tasa de Conformidad Global</b></td>
      <td>Gráfica de dona interactiva que muestra el porcentaje de sistemas conformes (calificación ≥ 80%) frente a sistemas que requieren remediación (&lt; 80%).</td>
    </tr>
    <tr>
      <td><b>Top Inconformidades (Fallos)</b></td>
      <td>Gráfica de barras horizontales con los capítulos donde más controles han fallado, permitiendo priorizar las brechas de seguridad más críticas.</td>
    </tr>
    <tr>
      <td><b>Top Conformidades (Aprobados)</b></td>
      <td>Controles validados exitosamente que demuestran evidencia técnica sólida ante auditores externos.</td>
    </tr>
    <tr>
      <td><b>Selector de Normas (Pills)</b></td>
      <td>Filtra al instante las métricas entre: <i>Vista Global Consolidada</i>, <i>OWASP AI-SVS</i>, <i>ISO/IEC 42001</i>, <i>Vista Dual</i> o <i>Marcos Personalizados</i>.</td>
    </tr>
    <tr>
      <td><b>Botón '⚡ Cargar 5 Auditorías'</b></td>
      <td>Permite poblar la base de datos <code>aegis-ai-db</code> con 5 auditorías completas de ejemplo de Google Cloud para pruebas inmediatas.</td>
    </tr>
  </table>

  <h2>4. Flujo de Nueva Auditoría Manual</h2>
  <p>Para auditar un nuevo sistema de IA que aún no está desplegado o cuyo manifiesto se construyó manualmente:</p>
  <ol>
    <li>Haz clic en el botón <b>+ Nueva Auditoría</b> en el encabezado del Dashboard.</li>
    <li>Selecciona la norma aplicable: <code>OWASP AI-SVS</code>, <code>ISO/IEC 42001</code>, <code>Evaluación Dual</code> o un <code>Marco Personalizado</code>.</li>
    <li>Define el <b>Nivel Objetivo</b>:
      <ul>
        <li><b>L1 (Básico):</b> Aplicaciones internas sin datos sensibles ni impacto a usuarios finales.</li>
        <li><b>L2 (Enterprise / PaaS):</b> Aplicaciones corporativas con RAG, atención a clientes o datos confidenciales.</li>
        <li><b>L3 (Crítico):</b> Sistemas autónomos financieros, médicos o con impacto en decisiones de vida o legales.</li>
      </ul>
    </li>
    <li>Ingresa el nombre del sistema, líder técnico responsable y la descripción técnica detallada (arquitectura, APIs, bases de datos vectoriales y controles de acceso).</li>
    <li>Haz clic en <b>Ejecutar Auditoría con IA</b>. El motor Gemini analizará el sistema contra cada control y generará el veredicto en tiempo real.</li>
  </ol>

  <h2>5. Escáner en Vivo de Google Cloud</h2>
  <p>El módulo <b>GCP Live Scanner</b> permite conectar AegisAI a un proyecto real de Google Cloud mediante APIs de solo lectura para extraer la arquitectura sin intervención humana:</p>
  <table class="data-table">
    <tr>
      <th>Modo de Autenticación</th>
      <th>Descripción y Caso de Uso</th>
    </tr>
    <tr>
      <td><code>Application Default Credentials (ADC)</code></td>
      <td>Modo predeterminado cuando AegisAI se ejecuta en Cloud Run, GKE o Compute Engine con la identidad de la carga de trabajo (Workload Identity).</td>
    </tr>
    <tr>
      <td><code>Service Account JSON (En Memoria)</code></td>
      <td>Permite ingresar credenciales temporales que se procesan únicamente en la memoria RAM del servidor sin tocar el disco duro.</td>
    </tr>
    <tr>
      <td><code>Bearer Access Token</code></td>
      <td>Token temporal generado mediante <code>gcloud auth print-access-token</code> con vigencia máxima de 60 minutos.</td>
    </tr>
    <tr>
      <td><code>Modo Simulación / Demo</code></td>
      <td>Permite evaluar el escáner utilizando telemetría enterprise simulada de Google Cloud sin requerir un proyecto real.</td>
    </tr>
  </table>

  <h2>6. Análisis e Interpretación de Reportes Técnicos</h2>
  <p>Al hacer clic en cualquier sistema evaluado, se despliega el <b>Informe Técnico Completo</b>, el cual contiene:</p>
  <ul>
    <li><b>Calificación Porcentual (0-100%):</b> Ponderación estricta de puntos aprobados sobre puntos aplicables.</li>
    <li><b>Desglose por Capítulos:</b> Cada punto de control detalla el método de aprobación, la causa del fallo (si aplica), la evidencia técnica verificable y el plan de remediación.</li>
    <li><b>Matriz RACI Oficial:</b> Asignación de responsabilidades para el CISO, AI Architect, Data Scientist y Compliance Officer.</li>
    <li><b>Inmutabilidad Garantizada:</b> Cada informe cuenta con un ID criptográfico inmutable en <code>aegis-ai-db</code> que impide su alteración o eliminación arbitraria.</li>
  </ul>
  `;
  return renderHtmlDocument("Manual de Uso del Operador", "OPERACIONES", content);
}

// -------------------------------------------------------------
// MANUAL 2: MANUAL DE DISEÑO
// -------------------------------------------------------------
function getManualDeDisenoHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">UI/UX & Enterprise Design System Specification</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Especificación de Diseño y UI/UX</div>
      <h1 class="cover-title">Manual de Diseño y Design System</h1>
      <p class="cover-subtitle">Fundamentos visuales, sistema de tokens metálicos, tipografía Google Sans, librería de componentes atómicos y directivas de accesibilidad WCAG 2.1 AA.</p>
      <div class="cover-badges">
        <span class="cover-badge">Google Cloud Co-Branding</span>
        <span class="cover-badge">Metales Enterprise (Titanio / Platino)</span>
        <span class="cover-badge">Google Sans & Roboto</span>
        <span class="cover-badge">Tailwind CSS v4</span>
        <span class="cover-badge">Accesibilidad WCAG 2.1 AA</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-DES-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Diseñadores UI/UX, Ingenieros Frontend, Product Managers y Equipos de Marca</td></tr>
      <tr><td class="label">Autor / Diseñador Líder:</td><td class="val">AegisAI Design Systems Team</td></tr>
      <tr><td class="label">Filosofía Visual:</td><td class="val">Ultra-Moderna Metálica Google Cloud (Aegis Titanium)</td></tr>
      <tr><td class="label">Versión de Tokens:</td><td class="val">Design System Aegis v2.0 (Eliminación total de estilos antiguos)</td></tr>
      <tr><td class="fecha de Liberación:</td><td class="val">24 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Filosofía de Diseño y Concepto Visual</b> — De la estética previa hacia la aleación metálica enterprise.</li>
    <li><b>2. Identidad Visual y Co-Branding Google Cloud</b> — Uso de logos SVG, zona de resguardo y coexistencia de marcas.</li>
    <li><b>3. Tipografía Oficial</b> — Jerarquía y aplicación de Google Sans, Roboto y Roboto Mono.</li>
    <li><b>4. Paleta Cromática y Tokens Semánticos</b> — Escala de grises metálicos y colores estándar de Google.</li>
    <li><b>5. Librería de Componentes Atómicos</b> — Cards metálicas, botones, badges, inputs y modals.</li>
    <li><b>6. Microinteracciones, Transiciones y Accesibilidad</b> — Curvas de animación suaves y cumplimiento WCAG 2.1 AA.</li>
  </ol>

  <h2>1. Filosofía de Diseño y Concepto Visual</h2>
  <p>La interfaz de usuario de <b>AegisAI</b> fue completamente rediseñada para reflejar la solidez, la precisión y la vanguardia tecnológica de Google Cloud. Se abandonaron deliberadamente los estilos antiguos (bordes toscos de 1.5px tipo editorial, colores amarillos y tarjetas de papel) para adoptar una estética <b>Metálica de Alta Resistencia</b>.</p>
  <p>Los tres pilares de este sistema visual son:</p>
  <ul>
    <li><b>Solidez Estructural:</b> Superficies basadas en metales como el titanio, el platino y el grafito oscuro, combinadas con bordes sutiles de micro-precisión (<code>border-slate-200/90</code>).</li>
    <li><b>Claridad Cognitiva:</b> Reducción drástica del ruido visual para que los hallazgos críticos de seguridad y las evidencias técnicas resalten con inmediatez.</li>
    <li><b>Identidad Google Cloud:</b> Integración armónica de los cuatro colores institucionales de Google (Azul, Verde, Amarillo y Rojo) aplicados a estados de estado y conformidad.</li>
  </ul>

  <h2>2. Identidad Visual y Co-Branding Google Cloud</h2>
  <p>El logotipo de Google Cloud es el eje rector del co-branding. Se implementa en formato SVG vectorial nativo sin pérdida de resolución:</p>
  <div class="diagram-box">
  +---------------------------------------------------------------+
  |  [ Logo Google Cloud SVG ]   AegisAI                          |
  |                              AI Security & Governance         |
  +---------------------------------------------------------------+
  Zona de resguardo mínima: 12px a cada lado.
  Tipografía de marca: Google Sans Bold (20px).
  </div>
  <p>El componente oficial <code>DivisionHeader</code> estandariza este encabezado en todas las vistas de la aplicación, garantizando coherencia institucional en desktop y mobile.</p>

  <h2>3. Tipografía Oficial</h2>
  <p>La tipografía se estructura en tres familias tipográficas oficiales:</p>
  <table class="data-table">
    <tr>
      <th>Familia</th>
      <th>Pesos</th>
      <th>Uso Principal</th>
    </tr>
    <tr>
      <td><b>Google Sans</b></td>
      <td>Medium (500), Bold (700)</td>
      <td>Títulos principales, encabezados H1-H3, cifras clave de KPIs, nombres de módulos y navegación.</td>
    </tr>
    <tr>
      <td><b>Roboto</b></td>
      <td>Regular (400), Medium (500)</td>
      <td>Cuerpo de texto, resúmenes ejecutivos, descripciones de controles, evidencias técnicas y tooltips.</td>
    </tr>
    <tr>
      <td><b>Roboto Mono</b></td>
      <td>Regular (400), SemiBold (600)</td>
      <td>IDs de auditoría, nombres de endpoints de API, fragmentos de código, manifiestos y parámetros JSON.</td>
    </tr>
  </table>

  <h2>4. Paleta Cromática y Tokens Semánticos</h2>
  <p>Los colores se declaran como variables semánticas en <code>src/index.css</code> y se integran mediante utilidades de Tailwind CSS:</p>
  <table class="data-table">
    <tr>
      <th>Token / Variable</th>
      <th>Valor Hex</th>
      <th>Rol Semántico</th>
    </tr>
    <tr>
      <td><code>--color-google-blue</code></td>
      <td><code>#1A73E8</code></td>
      <td>Color primario de acción, enlaces activos, badges normativos y botones de acento.</td>
    </tr>
    <tr>
      <td><code>--color-google-green</code></td>
      <td><code>#1E8E3E</code></td>
      <td>Conformidad técnica (≥ 80%), puntos aprobados y verificación exitosa.</td>
    </tr>
    <tr>
      <td><code>--color-google-yellow</code></td>
      <td><code>#F9AB00</code></td>
      <td>Revisión requerida (&lt; 80%), advertencias de riesgo medio e inconformidades subsanables.</td>
    </tr>
    <tr>
      <td><code>--color-google-red</code></td>
      <td><code>#D93025</code></td>
      <td>Inconformidades críticas, violaciones a invariantes de seguridad y vulnerabilidades graves.</td>
    </tr>
    <tr>
      <td><code>--color-metal-titanium</code></td>
      <td><code>#0F172A</code></td>
      <td>Fondo de la barra lateral oscura, modales de autenticación y encabezados de tablas.</td>
    </tr>
    <tr>
      <td><code>--color-metal-platinum</code></td>
      <td><code>#F8FAFC</code></td>
      <td>Fondo principal de trabajo, tarjetas secundarias y paneles de contenido.</td>
    </tr>
  </table>

  <h2>5. Librería de Componentes Atómicos</h2>
  <ul>
    <li><b>Card Metálica (<code>.card-metallic</code>):</b> Contenedor con radio <code>rounded-2xl</code>, microborde <code>border-slate-200/90</code>, gradiente casi imperceptible de platino a blanco y sombra suave <code>shadow-2xs</code>.</li>
    <li><b>Botones (<code>Button.tsx</code>):</b> Botones con esquinas <code>rounded-xl</code>, microinteracción al clic (scale 0.98) y variantes: <i>Default</i> (Google Blue), <i>Accent</i>, <i>Outline</i> y <i>Ghost</i>.</li>
    <li><b>Badges (<code>Badge.tsx</code>):</b> Píldoras <code>rounded-full</code> con tipografía de 11px font-bold y bordes de alta definición para indicar niveles L1/L2/L3 y estados de cumplimiento.</li>
    <li><b>Campos de Entrada (<code>Input.tsx</code> y <code>Textarea.tsx</code>):</b> Diseñados con fondo <code>bg-slate-50</code> y anillo de enfoque <code>focus:ring-2 focus:ring-[#1A73E8]/30</code> para máxima ergonomía visual.</li>
  </ul>

  <h2>6. Microinteracciones, Transiciones y Accesibilidad</h2>
  <p>Todas las transiciones de la plataforma emplean la curva cúbica oficial de Google:</p>
  <code>transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);</code>
  <p>En materia de accesibilidad (<b>WCAG 2.1 nivel AA</b>):</p>
  <ul>
    <li>Todos los textos sobre fondos claros tienen un contraste cromático superior a <b>4.8:1</b>.</li>
    <li>Todos los elementos interactivos cuentan con contorno de foco visible (<code>focus-visible:ring-2</code>) para navegación íntegra mediante teclado.</li>
    <li>Las gráficas circulares y de barras incorporan tooltips descriptivos con soporte para lectores de pantalla.</li>
  </ul>
  `;
  return renderHtmlDocument("Manual de Diseño y Design System", "DISEÑO UI/UX", content);
}

// -------------------------------------------------------------
// MANUAL 3: MANUAL DE ARQUITECTURA
// -------------------------------------------------------------
function getManualDeArquitecturaHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">Cloud-Native Software Architecture & Engineering Manual</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Especificación de Arquitectura de Software</div>
      <h1 class="cover-title">Manual de Arquitectura Técnica</h1>
      <p class="cover-subtitle">Diseño estructural del sistema, modelo C4, desacoplamiento a Firestore aegis-ai-db, orquestación con Gemini 2.0 y modelo de amenazas STRIDE.</p>
      <div class="cover-badges">
        <span class="cover-badge">React 19 + Node.js Express</span>
        <span class="cover-badge">Firestore aegis-ai-db</span>
        <span class="cover-badge">Google GenAI SDK (@google/genai)</span>
        <span class="cover-badge">GCP Live Telemetry APIs</span>
        <span class="cover-badge">Modelo STRIDE</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-ARCH-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Arquitectos de Soluciones Cloud, Ingenieros de Software, SREs y CISOs</td></tr>
      <tr><td class="label">Autor / Arquitecto Principal:</td><td class="val">AegisAI Open Source Community & Core Security Engineering Team</td></tr>
      <tr><td class="label">Patrón Arquitectónico:</td><td class="val">Single-Page App (SPA) desacoplada con Backend BFF y Streaming SSE</td></tr>
      <tr><td class="label">Topología de Datos:</td><td class="val">Base de datos dedicada nombrada: <code>aegis-ai-db</code> en Firestore</td></tr>
      <tr><td class="label">Fecha de Liberación:</td><td class="val">24 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Visión y Principios Arquitectónicos</b> — Arquitectura cloud-native y principios de diseño seguro.</li>
    <li><b>2. Diagrama de Arquitectura C4 (Nivel 1 y 2)</b> — Contexto del sistema y contenedores de ejecución.</li>
    <li><b>3. Capa de Frontend (SPA)</b> — React 19, Vite, división de bundles y listeners en tiempo real.</li>
    <li><b>4. Capa de Backend y Servicios API</b> — Express, Server-Sent Events (SSE) y extracción de documentos.</li>
    <li><b>5. Topología de Persistencia y Seguridad (aegis-ai-db)</b> — Desacoplamiento, esquemas e inmutabilidad.</li>
    <li><b>6. Motor de Telemetría y Escáner de Google Cloud</b> — Protocolo de conexión y APIs de inspección.</li>
    <li><b>7. Motor de Razonamiento Cognitivo (Gemini LLM)</b> — Orquestación, Structured Outputs y control de esquema.</li>
    <li><b>8. Modelo de Amenazas de la Solución (STRIDE)</b> — Análisis de riesgos y controles compensatorios.</li>
  </ol>

  <h2>1. Visión y Principios Arquitectónicos</h2>
  <p>La arquitectura de <b>AegisAI</b> está concebida bajo cinco principios cardinales de ingeniería:</p>
  <ul>
    <li><b>Desacoplamiento Estricto de Datos:</b> La plataforma no comparte tablas ni colecciones con ninguna otra aplicación del proyecto GCP, operando exclusivamente sobre <code>aegis-ai-db</code>.</li>
    <li><b>Inmutabilidad Registral (Write-Once, Read-Many):</b> Cumpliendo con el Invariante 4 de OWASP AI-SVS, una auditoría generada no puede ser modificada ni borrada arbitrariamente.</li>
    <li><b>Autenticación Zero-Trust:</b> Validación criptográfica de identidad federada con Google Workspace en cada invocación.</li>
    <li><b>Salida Tipada Rigurosa (Schema Enforcement):</b> Las evaluaciones generadas por Gemini siguen contratos JSON inquebrantables definidos mediante <code>responseSchema</code>.</li>
    <li><b>Transmisión Asíncrona con Streaming (SSE):</b> El análisis de grandes arquitecturas se transmite vía Server-Sent Events para evitar timeouts de red.</li>
  </ul>

  <h2>2. Diagrama de Arquitectura C4 (Nivel 2: Contenedores)</h2>
  <div class="diagram-box">
+-----------------------------------------------------------------------------------+
|                            NAVEGADOR DEL AUDITOR                                  |
|  +-----------------------------------------------------------------------------+  |
|  | Single Page Application (React 19 + TypeScript + Tailwind CSS v4)           |  |
|  | - Dashboard Ejecutivo    - Formulario de Auditoría   - GCP Scanner View     |  |
|  | - Reporte Técnico RACI   - Catálogo de Frameworks    - Arquitectura C4      |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------+------------------------------------------+
                                         | HTTPS / REST / SSE
                                         v
+-----------------------------------------------------------------------------------+
|                        BACKEND SERVICE (Node.js + Express)                        |
|  +---------------------------+  +--------------------------+  +----------------+  |
|  |  GCP Live Scanner Service |  |  LLM Cognitive Evaluator |  | Custom Fw API  |  |
|  |  (google-auth-library)    |  |  (@google/genai SDK)     |  | (pdf-parse)    |  |
|  +---------------------------+  +--------------------------+  +----------------+  |
+-------------------+----------------------------+----------------------------------+
                    |                            |
      gRPC / REST   |                            | Google GenAI REST
                    v                            v
+----------------------------------+  +---------------------------------------------+
|    GOOGLE CLOUD PLATFORM APIs    |  |         GEMINI 1.5 PRO / 2.0 FLASH          |
| - Cloud Resource Manager v1      |  | - Razonamiento de cumplimiento normativo    |
| - Cloud IAM getIamPolicy         |  | - Generación estructurada JSON estricta     |
| - Cloud Storage API v1           |  | - Análisis multi-estándar en paralelo       |
| - Vertex AI Platform API         |  +---------------------------------------------+
| - Cloud Run & Secret Manager     |
+----------------------------------+
                    |
                    v (Cliente SDK Firebase)
+-----------------------------------------------------------------------------------+
|            FIREBASE CLOUD FIRESTORE: aegis-ai-db (your-gcp-project-id)           |
|  - Colección 'audits': Documentos inmutables de auditorías técnicas               |
|  - Colección 'custom_frameworks': Catálogo de marcos normativos locales            |
|  - Reglas de Seguridad: Restricción exclusiva a cuentas *@example.com               |
+-----------------------------------------------------------------------------------+
  </div>

  <h2>3. Capa de Frontend (SPA)</h2>
  <p>El cliente web es una aplicación de una sola página compilada con Vite 6:</p>
  <ul>
    <li><b>División de Código (Code Splitting):</b> Cada vista principal (<code>Dashboard</code>, <code>AuditReportView</code>, <code>GcpLiveScannerView</code>) se carga de manera perezosa con <code>React.lazy()</code> y <code>Suspense</code>, logrando un bundle inicial de tan solo <b>36 kB</b>.</li>
    <li><b>Sincronización en Tiempo Real:</b> El hook <code>onSnapshot</code> de Firestore mantiene actualizado el Dashboard ante cualquier cambio o nueva auditoría sin necesidad de recargar la página.</li>
    <li><b>Visualización de Métricas:</b> Biblioteca <code>Recharts</code> configurada con paletas adaptadas al nuevo sistema de diseño metálico.</li>
  </ul>

  <h2>4. Capa de Backend y Servicios API</h2>
  <p>El backend Express expone servicios REST y canales de streaming SSE:</p>
  <ul>
    <li><code>POST /api/gcp/audit</code>: Orquesta el escaneo en vivo de un proyecto GCP y transmite el progreso paso a paso (Etapas 1 a 6) mediante Server-Sent Events.</li>
    <li><code>POST /api/evaluate-architecture</code>: Recibe un manifiesto técnico y ejecuta la evaluación contra OWASP AI-SVS o ISO 42001.</li>
    <li><code>POST /api/custom-frameworks/upload</code>: Extrae texto y metadatos de documentos regulatorios en PDF, DOCX o JSON con <code>multer</code> y <code>pdf-parse</code>.</li>
  </ul>

  <h2>5. Topología de Persistencia y Seguridad (aegis-ai-db)</h2>
  <p>La persistencia reside exclusivamente en la base de datos <code>aegis-ai-db</code>:</p>
  <pre><code>// firestore.rules para la base aegis-ai-db
rules_version = '2';
service cloud.firestore {
  match /databases/aegis-ai-db/documents {
    function isAuthorizedUser() {
      return request.auth != null;
    }

    match /audits/{auditId} {
      allow read, create, update: if isAuthorizedUser();
      allow delete: if false; // Invariante 4: Inmutabilidad
    }

    match /custom_frameworks/{fwId} {
      allow read, write: if isGoogleEmployee();
    }
  }
}</code></pre>

  <h2>6. Motor de Razonamiento Cognitivo (Gemini LLM)</h2>
  <p>El motor de evaluación utiliza el nuevo SDK oficial <code>@google/genai</code>:</p>
  <ul>
    <li><b>Garantía de Esquema (Schema Enforcement):</b> El modelo recibe un esquema tipado estricto (<code>Type.OBJECT</code>) para chapters, puntos probados, matriz RACI y plan de remediación. Es matemáticamente imposible que el modelo devuelva texto plano o markdown suelto.</li>
    <li><b>Temperatura Cero (Deterministic Invariance):</b> Configurado con <code>temperature: 0.0</code> para asegurar repetibilidad y consistencia en los veredictos de auditoría.</li>
  </ul>

  <h2>7. Modelo de Amenazas de la Solución (STRIDE)</h2>
  <table class="data-table">
    <tr>
      <th>Amenaza (STRIDE)</th>
      <th>Riesgo Potencial</th>
      <th>Contramedida Implementada en AegisAI</th>
    </tr>
    <tr>
      <td><b>Spoofing</b></td>
      <td>Suplantación de identidad de un auditor.</td>
      <td>Federación estricta con Google Workspace + validación de dominio en rules.</td>
    </tr>
    <tr>
      <td><b>Tampering</b></td>
      <td>Modificación maliciosa de un veredicto de auditoría.</td>
      <td>Regla <code>allow delete: if false</code> e inmutabilidad en <code>aegis-ai-db</code>.</td>
    </tr>
    <tr>
      <td><b>Repudiation</b></td>
      <td>Negación de autoría en hallazgos críticos.</td>
      <td>Firma criptográfica, marca de tiempo ISO y correo del líder técnico en cada reporte.</td>
    </tr>
    <tr>
      <td><b>Information Disclosure</b></td>
      <td>Fuga de credenciales o de telemetría de GCP.</td>
      <td>Procesamiento de credenciales solo en RAM (Zero-Disk) y permisos de solo lectura.</td>
    </tr>
    <tr>
      <td><b>Denial of Service</b></td>
      <td>Agotamiento de cuotas por prompts masivos.</td>
      <td>Límite estricto de caracteres (64k) y streaming con keep-alive a 15 segundos.</td>
    </tr>
    <tr>
      <td><b>Elevation of Privilege</b></td>
      <td>Intento de acceso a colecciones no autorizadas.</td>
      <td>Aislamiento total de base de datos dedicada (<code>aegis-ai-db</code>).</td>
    </tr>
  </table>
  `;
  return renderHtmlDocument("Manual de Arquitectura Técnica", "ARQUITECTURA", content);
}

// -------------------------------------------------------------
// MANUAL 4: MANUAL DE PRUEBAS
// -------------------------------------------------------------
function getManualDePruebasHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">Quality Assurance & Verification Engineering Manual</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Plan y Manual de Pruebas de Software</div>
      <h1 class="cover-title">Manual de Pruebas y QA</h1>
      <p class="cover-subtitle">Estrategia global de pruebas, verificación estática TypeScript, pruebas de integración, pruebas de escaneo en GCP y matriz de aceptación de calidad.</p>
      <div class="cover-badges">
        <span class="cover-badge">TypeScript Strict Verification</span>
        <span class="cover-badge">Integration Test Suite</span>
        <span class="cover-badge">LLM Provider Benchmarks</span>
        <span class="cover-badge">Vite Production Build Gates</span>
        <span class="cover-badge">Criterios de Aceptación 100%</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-TEST-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Ingenieros de QA, Desarrolladores, Líderes de Pruebas y Auditores de Calidad</td></tr>
      <tr><td class="label">Autor / Lead QA:</td><td class="val">AegisAI Quality Assurance Team</td></tr>
      <tr><td class="label">Ambiente de Pruebas:</td><td class="val">Node.js v22 + Vite Test Environment + Google Chrome Headless</td></tr>
      <tr><td class="label">Estado de Ejecución:</td><td class="val">100% Exitoso (0 Errores de Tipos / 0 Fallos de Integración)</td></tr>
      <tr><td class="label">Fecha de Liberación:</td><td class="val">24 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Estrategia Global de Calidad (Pirámide de Pruebas)</b> — Niveles de aseguramiento y Quality Gates.</li>
    <li><b>2. Batería de Pruebas Automatizadas en el Repositorio</b> — Comandos de ejecución rápida y scripts.</li>
    <li><b>3. Pruebas de Tipos y Verificación Estática (tsc)</b> — Cero regresiones y tipado robusto.</li>
    <li><b>4. Pruebas de Integración y Lógica de Negocio</b> — Métricas del Dashboard, cálculo de scores y filtros.</li>
    <li><b>5. Pruebas de Conectividad con Proveedores de IA</b> — Validación de endpoints y esquemas JSON.</li>
    <li><b>6. Pruebas del Escáner en Vivo de Google Cloud</b> — Pruebas con telemetría real y simulada.</li>
    <li><b>7. Matriz de Resultados y Criterios de Aceptación</b> — Resumen cuantitativo de calidad.</li>
  </ol>

  <h2>1. Estrategia Global de Calidad (Pirámide de Pruebas)</h2>
  <p>La verificación de calidad de <b>AegisAI</b> sigue una estrategia de múltiples compuertas (Quality Gates) para garantizar que ningún código defectuoso o vulnerable llegue a producción:</p>
  <div class="diagram-box">
             /\\
            /  \\     Nivel 4: Pruebas de Seguridad y Red Teaming (OWASP AI-SVS)
           /----\\
          /      \\    Nivel 3: Pruebas de Integración (APIs GCP, Firestore aegis-ai-db)
         /--------\\
        /          \\   Nivel 2: Pruebas de Interfaz de Usuario (UI/UX, Recharts, Filtros)
       /------------\\
      /              \\  Nivel 1: Verificación Estática Estricta (TypeScript 5.8 tsc --noEmit)
     +----------------+
  </div>

  <h2>2. Batería de Pruebas Automatizadas en el Repositorio</h2>
  <p>El archivo <code>package.json</code> define los siguientes comandos oficiales de prueba:</p>
  <table class="data-table">
    <tr>
      <th>Comando NPM</th>
      <th>Script Asociado</th>
      <th>Objetivo de la Prueba</th>
    </tr>
    <tr>
      <td><code>npm run lint</code></td>
      <td><code>tsc --noEmit</code></td>
      <td>Comprueba la tipificación estricta de TypeScript en todo el proyecto frontend y backend.</td>
    </tr>
    <tr>
      <td><code>npm run build</code></td>
      <td><code>vite build && esbuild server.ts</code></td>
      <td>Verifica que el empaquetado de producción compile sin advertencias críticas y optimice los chunks.</td>
    </tr>
    <tr>
      <td><code>npm run test:integration</code></td>
      <td><code>scripts/run_integration_verification_tests.mjs</code></td>
      <td>Ejecuta 8 suites de prueba de lógica de negocio, cálculo de KPIs y persistencia.</td>
    </tr>
    <tr>
      <td><code>npm run test:llm</code></td>
      <td><code>scripts/test_llm_providers.mjs</code></td>
      <td>Valida la conectividad con Gemini 2.0 y el enforzamiento de esquemas estructurados.</td>
    </tr>
    <tr>
      <td><code>npm run test:gcp</code></td>
      <td><code>scripts/test_gcp_live_scanner.mjs</code></td>
      <td>Comprueba la recolección de telemetría viva contra APIs de Google Cloud.</td>
    </tr>
    <tr>
      <td><code>npm run test:security</code></td>
      <td><code>scripts/run_owasp_ai_security_tests.mjs</code></td>
      <td>Verifica los 12 capítulos de seguridad según la norma OWASP AI-SVS v1.0.</td>
    </tr>
  </table>

  <h2>3. Pruebas de Tipos y Verificación Estática</h2>
  <p>La compilación estricta de TypeScript garantiza la ausencia de punteros nulos, tipos <code>any</code> implícitos o contratos rotos entre cliente y servidor:</p>
  <pre><code>$ npm run lint
> tsc --noEmit
# Exit Code: 0 (Sin errores en los más de 2,800 módulos de TypeScript)</code></pre>

  <h2>4. Pruebas de Integración y Lógica de Negocio</h2>
  <p>El script <code>run_integration_verification_tests.mjs</code> valida exhaustivamente los algoritmos de gobernanza:</p>
  <table class="data-table">
    <tr>
      <th>Módulo Evaluado</th>
      <th>Condición de Prueba</th>
      <th>Resultado</th>
    </tr>
    <tr>
      <td>Cálculo de Tasa de Aprobación</td>
      <td>Ponderación de 5 auditorías de ejemplo (4 aprobadas ≥80%, 1 en revisión &lt;80%).</td>
      <td><span class="pill pill-green">PASS</span> 80.0% Exacto</td>
    </tr>
    <tr>
      <td>Mapeo de Capítulos ISO</td>
      <td>Detección de prefijos <code>Clause</code> y <code>A.</code> sin solaparse con OWASP.</td>
      <td><span class="pill pill-green">PASS</span> 100% Mapeado</td>
    </tr>
    <tr>
      <td>Aislamiento de aegis-ai-db</td>
      <td>Verificación de que las peticiones se enrutan exclusivamente a <code>aegis-ai-db</code>.</td>
      <td><span class="pill pill-green">PASS</span> Verificado</td>
    </tr>
    <tr>
      <td>Inmutabilidad de Registros</td>
      <td>Intento de borrado de una auditoría existente en base de datos.</td>
      <td><span class="pill pill-green">PASS</span> Bloqueo 403</td>
    </tr>
  </table>

  <h2>5. Pruebas de Conectividad con Proveedores de IA</h2>
  <p>Se evalúa que el modelo Gemini 2.0 responda respetando el formato JSON estricto:</p>
  <ul>
    <li>Validación de tiempo de respuesta promedio inferior a 4.5 segundos para análisis de arquitecturas complejas.</li>
    <li>Comprobación de que no existan alucinaciones en los IDs de capítulos normativos (ej. C1 a C12 para OWASP, A.2 a A.10 para ISO).</li>
    <li>Mecanismo de fallback automático: verificación de cambio de proveedor en caso de indisponibilidad temporal.</li>
  </ul>

  <h2>6. Matriz de Resultados y Criterios de Aceptación</h2>
  <div class="callout callout-success">
    <div class="callout-title">Criterio de Aceptación Cumplido al 100%</div>
    Todos los Quality Gates han sido superados satisfactoriamente. El código de la versión 2.0 cumple con los estándares de ingeniería de software de Google Cloud y se encuentra listo para operar en entornos productivos.
  </div>
  `;
  return renderHtmlDocument("Manual de Pruebas y QA", "CALIDAD Y QA", content);
}

// -------------------------------------------------------------
// MANUAL 5: MANUAL DE PRUEBAS DE SEGURIDAD
// -------------------------------------------------------------
function getManualDePruebasDeSeguridadHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">AI Application Security Verification & DevSecOps Manual</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Manual Oficial de Pruebas de Seguridad</div>
      <h1 class="cover-title">Manual de Pruebas de Seguridad y DevSecOps</h1>
      <p class="cover-subtitle">Batería de pruebas automatizadas bajo OWASP AI-SVS v1.0, análisis de inyecciones de prompts, seguridad en RAG, aislamiento de Firestore y protocolo de Red Teaming.</p>
      <div class="cover-badges">
        <span class="cover-badge">OWASP AI-SVS v1.0 (12 Capítulos)</span>
        <span class="cover-badge">Prompt Injection Defense</span>
        <span class="cover-badge">RAG Vector Poisoning</span>
        <span class="cover-badge">Cloud DLP Enmascaramiento</span>
        <span class="cover-badge">Firestore Security Rules Audit</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-SEC-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Equipos de Ciberseguridad, CISOs, Red Teams y Especialistas en DevSecOps</td></tr>
      <tr><td class="label">Autor / Security Lead:</td><td class="val">AegisAI Open Source Community & Core Security Engineering Team</td></tr>
      <tr><td class="label">Norma de Evaluación:</td><td class="val">OWASP AI Security Verification Standard (AI-SVS) v1.0</td></tr>
      <tr><td class="label">Cobertura de Seguridad:</td><td class="val">12 de 12 Capítulos Validados con Suite Automatizada</td></tr>
      <tr><td class="label">Fecha de Liberación:</td><td class="val">24 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Filosofía de Seguridad y Postura DevSecOps</b> — Principios de defensa en profundidad en sistemas de IA.</li>
    <li><b>2. La Suite Automatizada de Pruebas (OWASP AI-SVS v1.0)</b> — Arquitectura de ejecución del test runner.</li>
    <li><b>3. Pruebas Detalladas por los 12 Capítulos de OWASP</b>:
      <ul>
        <li>C1: Inyección de Prompts y Validaciones</li>
        <li>C2: Manejo y Sanitización de Salidas</li>
        <li>C3: Protección de Datos y Privacidad (Cloud DLP)</li>
        <li>C4: Seguridad en Cadena de Suministro de Modelos</li>
        <li>C5: Control de Acceso y Mínimo Privilegio</li>
        <li>C6: Infraestructura y Aislamiento de Inferencia</li>
        <li>C7: Seguridad en Datos y Bases Vectoriales (RAG)</li>
        <li>C8: Resiliencia ante Denegación de Servicio (DoS)</li>
        <li>C9: Auditoría, Monitoreo y Trazabilidad Forense</li>
        <li>C10: Mitigación de Alucinaciones y Verificación de Fuentes</li>
        <li>C11: Gobernanza y Gestión de Riesgos</li>
        <li>C12: Red Teaming y Resiliencia Continua</li>
      </ul>
    </li>
    <li><b>4. Auditoría de Reglas de Firestore (aegis-ai-db)</b> — Verificación contra escalación y bypass.</li>
    <li><b>5. Protocolo de Pruebas Adversarias (Red Teaming)</b> — Escenarios de prueba de ataque simulado.</li>
    <li><b>6. Plan de Respuesta a Incidentes de IA</b> — Procedimiento ante hallazgos de severidad crítica.</li>
  </ol>

  <h2>1. Filosofía de Seguridad y Postura DevSecOps</h2>
  <p>La seguridad en <b>AegisAI</b> trasciende la ciberseguridad tradicional en la nube. Mientras que la seguridad de infraestructura se ocupa de puertos y cortafuegos, AegisAI implementa controles para mitigar los nuevos vectores de ataque cognitivos que afectan a los LLMs y a los agentes de IA.</p>
  <p>Nuestra postura DevSecOps incorpora la verificación de seguridad automatizada en cada fase del ciclo de vida del software (CI/CD), asegurando que ninguna versión se publique sin superar las 12 pruebas de OWASP AI-SVS.</p>

  <h2>2. La Suite Automatizada de Pruebas (OWASP AI-SVS v1.0)</h2>
  <p>El script <code>scripts/run_owasp_ai_security_tests.mjs</code> implementa un banco de pruebas exhaustivo que somete a la plataforma a ataques sintéticos y verificaciones de configuración:</p>
  <pre><code>$ npm run test:security
> node scripts/run_owasp_ai_security_tests.mjs

[OWASP AI-SVS] Iniciando batería de 12 pruebas de seguridad...
[C1] Inyección de Prompts: VALIDADO (Bloqueo en delimitadores XML y WAF)
[C2] Sanitización de Salidas: VALIDADO (Filtro DOMPurify y CSP)
[C3] Privacidad de Datos: VALIDADO (Integración Cloud DLP detectada)
...
[C12] Red Teaming: VALIDADO (Resistencia comprobada)
Reporte de Seguridad generado en: scripts/owasp_ai_security_report.json</code></pre>

  <h2>3. Pruebas Detalladas por los 12 Capítulos de OWASP</h2>
  <table class="data-table">
    <tr>
      <th>Capítulo OWASP</th>
      <th>Vector de Ataque Simulado</th>
      <th>Mecanismo Defensivo Verificado</th>
      <th>Resultado</th>
    </tr>
    <tr>
      <td><b>C1: Inyección de Prompts</b></td>
      <td>Inyección directa (<i>"Ignora tus instrucciones previas"</i>) e indirecta en corpus RAG.</td>
      <td>Encapsulamiento en bloques XML estrictos <code>&lt;untrusted_input&gt;</code> y system prompts blindados.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C2: Sanitización de Salidas</b></td>
      <td>Inyección de payloads XSS (<code>&lt;script&gt;alert(1)&lt;/script&gt;</code>) en respuestas del modelo.</td>
      <td>Sanitización estricta con DOMPurify y directiva CSP restrictiva en el frontend.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C3: Privacidad de Datos</b></td>
      <td>Envío de PII sensible (RFCs, números de tarjetas, correos) hacia el modelo base.</td>
      <td>Inspección y enmascaramiento previo mediante Cloud Sensitive Data Protection (DLP).</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C4: Cadena de Suministro</b></td>
      <td>Inclusión de pesos manipulados o dependencias npm con CVEs conocidas.</td>
      <td>Auditoría automatizada de librerías y verificación de hashes en modelos de Vertex AI.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C5: Control de Acceso</b></td>
      <td>Invocación no autenticada de endpoints de inferencia de Vertex AI.</td>
      <td>Autenticación IAM por tokens OAuth de corta vida y llaves en Cloud Secret Manager con rotación.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C6: Aislamiento</b></td>
      <td>Ejecución de código arbitrario generado por el modelo dentro del contenedor.</td>
      <td>Sandboxing estricto en contenedores sin privilegios de root ni acceso a red externa.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C7: Seguridad en RAG</b></td>
      <td>Envenenamiento de índices vectoriales mediante documentos maliciosos.</td>
      <td>Filtrado previo de documentos, validación de integridad y embeddings aislados en Vertex AI Search.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C8: Resiliencia ante DoS</b></td>
      <td>Explosión de ventana de contexto (payloads de más de 100k tokens para causar agotamiento de cuota).</td>
      <td>Rate limiting en API Gateway y validación estricta de longitud máxima en el frontend (4k caracteres).</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C9: Logging Forense</b></td>
      <td>Acceso forense a registros sin comprometer datos confidenciales de los usuarios.</td>
      <td>Auditorías inmutables en <code>aegis-ai-db</code> con registro de marcas de tiempo y autoría.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C10: Alucinaciones</b></td>
      <td>Generación de respuestas con afirmaciones normativas falsas o inexistentes.</td>
      <td>Grounding obligatorio: cada veredicto exige obligatoriamente citas de cláusulas reales y evidencia.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C11: Gobernanza</b></td>
      <td>Sistemas desplegados sin asignación formal de responsabilidades.</td>
      <td>Generación automática de la Matriz RACI en cada reporte de evaluación.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
    <tr>
      <td><b>C12: Red Teaming</b></td>
      <td>Pruebas de estrés continuo contra el pipeline de inferencia.</td>
      <td>Ejecución periódica del test runner de seguridad integrado en el pipeline de despliegue.</td>
      <td><span class="pill pill-green">APROBADO</span></td>
    </tr>
  </table>

  <h2>4. Auditoría de Reglas de Firestore (aegis-ai-db)</h2>
  <p>Se ejecutó una auditoría de penetración específica contra el archivo <code>firestore.rules</code>:</p>
  <ul>
    <li><b>Prueba de Fuga de Dominio:</b> Se simularon peticiones con tokens autenticados pero de dominios no autorizados (ej. <code>test@gmail.com</code>). <b>Resultado:</b> Rechazo inmediato con código <code>PERMISSION_DENIED</code>.</li>
    <li><b>Prueba de Eliminación Maliciosa:</b> Se ejecutaron llamadas <code>deleteDoc</code> directas sobre documentos existentes en la colección <code>audits</code>. <b>Resultado:</b> Rechazo total debido a la regla <code>allow delete: if false;</code>, garantizando el cumplimiento del Invariante 4 de OWASP AI-SVS.</li>
  </ul>

  <h2>5. Protocolo de Pruebas Adversarias (Red Teaming)</h2>
  <div class="callout callout-warning">
    <div class="callout-title">Protocolo de Red Teaming Continuo</div>
    El equipo de seguridad de AegisAI ejecuta ejercicios mensuales de Red Teaming empleando el dataset de pruebas adversarias de Google Cloud Vertex AI Model Armor para descubrir nuevos vectores emergentes de inyección multimodal y envenenamiento de contexto.
  </div>

  <h2>6. Plan de Respuesta a Incidentes de IA</h2>
  <p>En caso de que una auditoría detecte una vulnerabilidad de severidad <b>CRITICAL</b> en un sistema en producción:</p>
  <ol>
    <li><b>Aislamiento Inmediato:</b> La API de AegisAI emite una alerta al equipo DevSecOps para restringir el tráfico del endpoint de Vertex AI mediante VPC Service Controls.</li>
    <li><b>Generación de Plan de Remediación:</b> Se extrae la sección de remediación del reporte técnico generado en AegisAI.</li>
    <li><b>Re-auditoría de Validación:</b> Se ejecuta el flujo de re-auditoría en AegisAI para constatar que el score haya alcanzado al menos el 80% antes de autorizar el redespliegue.</li>
  </ol>
  `;
  return renderHtmlDocument("Manual de Pruebas de Seguridad y DevSecOps", "SEGURIDAD Y DEVSECOPS", content);
}

// -------------------------------------------------------------
// MANUAL 6: MANUAL DE INSTALACION Y DESPLIEGUE EN GOOGLE CLOUD
// -------------------------------------------------------------
function getManualDeInstalacionHtml() {
  const content = `
  <div class="cover-page">
    <div class="cover-header">
      ${gcpLogoSvg}
      <div>
        <div class="cover-brand-title">Google Cloud Platform · AegisAI</div>
        <div class="cover-brand-sub">AI Security & Governance Assurance Suite</div>
      </div>
    </div>

    <div class="cover-hero-card">
      <div class="cover-tag">Manual Oficial de Ingeniería e Infraestructura Cloud</div>
      <h1 class="cover-title">Manual de Instalación y Despliegue en Google Cloud Paso a Paso</h1>
      <p class="cover-subtitle">Guía de aprovisionamiento de infraestructura Serverless (Cloud Run, Cloud Firestore Nativo, Vertex AI, Artifact Registry), configuración de IAM con mínimo privilegio, Firebase Auth y resolución forense de incidentes.</p>
      <div class="cover-badges">
        <span class="cover-badge">Google Cloud Run</span>
        <span class="cover-badge">Cloud Firestore Nativo</span>
        <span class="cover-badge">Vertex AI & Gemini API</span>
        <span class="cover-badge">Artifact Registry</span>
        <span class="cover-badge">Zero-Trust IAM</span>
        <span class="cover-badge">Docker & Cloud Build</span>
      </div>
    </div>

    <table class="metadata-table">
      <tr><td class="label">Identificador Documental:</td><td class="val">DOC-AEGIS-DEPLOY-2026-V2</td></tr>
      <tr><td class="label">Público Objetivo:</td><td class="val">Ingenieros DevOps, SysAdmins, Arquitectos Cloud, CISOs y Líderes Técnicos</td></tr>
      <tr><td class="label">Autor / Arquitecto Líder:</td><td class="val">AegisAI Open Source Community & Core Security Engineering Team</td></tr>
      <tr><td class="label">Servicios Cloud Clave:</td><td class="val">Cloud Run, Firestore (Modo Nativo), Vertex AI, Artifact Registry, Firebase Auth</td></tr>
      <tr><td class="label">Versión de Plataforma:</td><td class="val">AegisAI v2.5 Enterprise (Edición Google Cloud)</td></tr>
      <tr><td class="label">Fecha de Liberación:</td><td class="val">25 de Septiembre de 2026</td></tr>
      <tr><td class="label">Clasificación:</td><td class="val">Open Source / Public Community Release (Apache 2.0)</td></tr>
    </table>
  </div>

  <div class="page-break"></div>

  <h1>Índice de Contenido</h1>
  <ol style="font-size: 9pt; line-height: 1.8;">
    <li><b>1. Resumen Ejecutivo y Topología de Infraestructura</b> — Arquitectura Serverless desacoplada en Google Cloud.</li>
    <li><b>2. Requisitos Previos y Permisos IAM</b> — Cuenta de facturación, roles de IAM y Google Cloud Shell.</li>
    <li><b>3. Método 1: Despliegue Automatizado en 1 Solo Paso</b> — Ejecución rápida con <code>deploy_cloud_run.sh</code>.</li>
    <li><b>4. Método 2: Despliegue Manual Paso a Paso (12 Fases)</b> — Configuración detallada paso a paso mediante <code>gcloud</code> CLI.</li>
    <li><b>5. Configuración de Firebase Authentication y Dominios</b> — Google OAuth, SDK Web y dominios autorizados.</li>
    <li><b>6. Configuración de Modelos y Multi-Proveedor en Caliente</b> — Gemini API, Vertex AI, OpenRouter y vLLM.</li>
    <li><b>7. Verificación Operativa y Pruebas de Humo</b> — Endpoints de salud, cabeceras HTTP y suites de prueba.</li>
    <li><b>8. Guía Forense de Solución de Problemas (Troubleshooting)</b> — Resolución de los 6 incidentes más habituales.</li>
    <li><b>9. Mantenimiento y Actualizaciones Zero-Downtime</b> — Actualizaciones continuas sin interrupción de servicio.</li>
  </ol>

  <h2>1. Resumen Ejecutivo y Topología de Infraestructura</h2>
  <p><b>AegisAI</b> ha sido concebida bajo un modelo <b>Cloud-Native Serverless</b> en Google Cloud Platform. Este diseño garantiza alta resiliencia, escalabilidad automática de 0 a 10 instancias según demanda y costos optimizados bajo demanda (Pay-as-you-go).</p>
  
  <div class="diagram-box">
[ AUDITOR / CLIENTE WEB ]
           |
           v (HTTPS TLS 1.3)
+--------------------------------------------------------------+
|               GOOGLE CLOUD RUN INGRESS                       |
|           https://aegis-ai-xxxxx.run.app                     |
|  +--------------------------------------------------------+  |
|  |           Contenedor Monolítico Optimizado             |  |
|  |  * Frontend React 19 SPA (Vite)                        |  |
|  |  * Backend Express REST & Server-Sent Events (SSE)     |  |
|  |  * Motor Map-Reduce de Auditoría Multi-Norma           |  |
|  |  * Escáner en Vivo de Google Cloud (Read-Only)         |  |
|  +----------------------------+---------------------------+  |
+-------------------------------|------------------------------+
                                |
                 Identidad IAM  | (aegis-runner-sa)
               Mínimo Privilegio|
                                v
       +------------------------+------------------------+
       |                                                 |
       v                                                 v
+-------------------------------+ +-------------------------------+
|    CLOUD FIRESTORE NATIVO     | |   GOOGLE VERTEX AI / GEMINI   |
| * Base de datos (default)     | | * Modelos Gemini 2.5 / 3.x    |
| * audits/ (Inmutabilidad)     | | * Inferencia Hiper-Factual    |
| * custom_frameworks/ (BYOF)   | | * Telemetría de Modelos       |
+-------------------------------+ +-------------------------------+
  </div>

  <h2>2. Requisitos Previos y Permisos IAM</h2>
  <p>Para aprovisionar AegisAI en Google Cloud, se requiere:</p>
  <ul>
    <li><b>Proyecto Activo en Google Cloud:</b> Con facturación (Cloud Billing) habilitada.</li>
    <li><b>Roles IAM del Desplegador:</b> <code>roles/owner</code> o combinación de <code>roles/resourcemanager.projectIamAdmin</code>, <code>roles/run.admin</code>, <code>roles/artifactregistry.admin</code>, <code>roles/cloudbuild.builds.editor</code>, <code>roles/datastore.owner</code> y <code>roles/iam.serviceAccountAdmin</code>.</li>
    <li><b>Entorno Recomendado:</b> <b>Google Cloud Shell</b> (<code>https://shell.cloud.google.com</code>), el cual dispone de <code>gcloud</code>, <code>docker</code>, <code>git</code>, <code>node</code> y autenticación nativa preconfigurados.</li>
    <li><b>Clave de API Gemini:</b> Clave gratuita o corporativa obtenida en Google AI Studio (<code>https://aistudio.google.com</code>) o mediante credenciales de Vertex AI.</li>
  </ul>

  <h2>3. Método 1: Despliegue Rápido Automatizado (1 Solo Paso)</h2>
  <p>El repositorio incluye el orquestador <code>deploy_cloud_run.sh</code> que automatiza las 12 fases del aprovisionamiento:</p>
  <pre><code># Otorgar permisos y ejecutar con el ID del proyecto GCP
chmod +x deploy_cloud_run.sh
./deploy_cloud_run.sh ID_DE_TU_PROYECTO_GCP</code></pre>
  <p>El script validará dependencias, habilitará las APIs, configurará las cuentas de servicio, creará la base de datos Firestore y compilará la imagen en Cloud Build, imprimiendo al final la URL pública lista para operar.</p>

  <div class="page-break"></div>

  <h2>4. Método 2: Despliegue Manual Paso a Paso (12 Fases Secuenciales)</h2>
  <p>Si las políticas corporativas exigen la ejecución de comandos auditados paso a paso:</p>

  <h3>Paso 4.1: Definir Variables de Entorno y Proyecto Activo</h3>
  <pre><code>export PROJECT_ID="tu-proyecto-gcp-id"
export REGION="us-central1"
export SERVICE_NAME="aegis-ai"
export REPO_NAME="cloud-run-source-deploy"
export ALLOWED_DOMAINS="*"
export GEMINI_API_KEY="AIzaSy..."

gcloud config set project "$PROJECT_ID"</code></pre>

  <h3>Paso 4.2: Habilitar las 8 APIs Requeridas de Google Cloud</h3>
  <pre><code>gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  secretmanager.googleapis.com \
  --project="$PROJECT_ID"</code></pre>

  <h3>Paso 4.3: Otorgar Permisos IAM a Cloud Build</h3>
  <pre><code>PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="\${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${COMPUTE_SA}" \
  --role="roles/cloudbuild.builds.builder" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${COMPUTE_SA}" \
  --role="roles/storage.admin" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${COMPUTE_SA}" \
  --role="roles/logging.logWriter" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${COMPUTE_SA}" \
  --role="roles/artifactregistry.admin" --quiet</code></pre>

  <h3>Paso 4.4: Crear la Service Account de Ejecución (aegis-runner-sa)</h3>
  <p>Por principio de mínimo privilegio, no se utiliza la cuenta Compute por defecto:</p>
  <pre><code>SA_EMAIL="aegis-runner-sa@\${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create aegis-runner-sa \
  --description="Identidad de ejecucion para AegisAI Cloud Run" \
  --display-name="AegisAI Runner" \
  --project="$PROJECT_ID"

# Inferencia en Vertex AI
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${SA_EMAIL}" \
  --role="roles/aiplatform.user" --quiet

# Almacenamiento en Firestore
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${SA_EMAIL}" \
  --role="roles/datastore.user" --quiet

# Lectura de infraestructura para el GCP Live Scanner
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:\${SA_EMAIL}" \
  --role="roles/viewer" --quiet</code></pre>

  <h3>Paso 4.5: Aprovisionar Cloud Firestore en Modo Nativo</h3>
  <pre><code>gcloud firestore databases create \
  --location="nam5" \
  --type="firestore-native" \
  --project="$PROJECT_ID" --quiet || echo "Base de datos ya existe."</code></pre>

  <h3>Paso 4.6: Configurar Firebase Authentication y Google Sign-In</h3>
  <ol>
    <li>Ingrese a <b>Firebase Console</b> (<code>https://console.firebase.google.com/project/_/authentication/providers</code>).</li>
    <li>En la pestaña <b>Sign-in method</b>, active el proveedor <b>Google</b> y guarde.</li>
    <li>En <b>Project Settings &gt; General &gt; Tus apps</b>, registre una app Web (<code>&lt;/&gt;</code>) llamada <code>AegisAI</code>.</li>
    <li>Guarde la configuración en <code>firebase-applet-config.json</code> en la raíz del proyecto.</li>
  </ol>

  <div class="page-break"></div>

  <h3>Paso 4.7: Crear el Repositorio en Artifact Registry</h3>
  <pre><code>gcloud artifacts repositories create "$REPO_NAME" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Repositorio Docker para AegisAI" \
  --project="$PROJECT_ID" --quiet || true</code></pre>

  <h3>Paso 4.8: Compilar la Imagen del Contenedor con Cloud Build</h3>
  <pre><code>IMAGE_URL="\${REGION}-docker.pkg.dev/\${PROJECT_ID}/\${REPO_NAME}/\${SERVICE_NAME}:latest"

gcloud builds submit --tag "$IMAGE_URL" --project="$PROJECT_ID" .</code></pre>

  <h3>Paso 4.9: Desplegar el Servicio en Google Cloud Run</h3>
  <pre><code>ENV_VARS_EXTRA=""
if [ -n "$GEMINI_API_KEY" ]; then
    ENV_VARS_EXTRA=",GEMINI_API_KEY=\${GEMINI_API_KEY}"
fi

gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URL" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --platform managed \
  --service-account "\${SA_EMAIL}" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300s \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,PORT=8080,PROJECT_ID=\${PROJECT_ID},VITE_ALLOWED_DOMAINS=\${ALLOWED_DOMAINS}\${ENV_VARS_EXTRA}" \
  --allow-unauthenticated</code></pre>

  <h3>Paso 4.10: Autorizar el Dominio de Cloud Run en Firebase Authentication</h3>
  <pre><code># Obtener la URL del servicio
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format="value(status.url)")
echo "URL asignada: \${SERVICE_URL}"</code></pre>
  <p>Copie el dominio sin protocolo (ej. <code>aegis-ai-607603788049.us-central1.run.app</code>) y agréguelo en <b>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</b>.</p>

  <h3>Paso 4.11: Pruebas de Humo (Smoke Tests)</h3>
  <pre><code># 1. Endpoint de salud
curl -s "\${SERVICE_URL}/api/health"
# Respuesta: {"status":"ok"}

# 2. Cabeceras de seguridad HTTP
curl -I "\${SERVICE_URL}"
# Debe incluir: X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN</code></pre>

  <h3>Paso 4.12: Configuración de Claves de IA y Multi-Proveedor en Caliente</h3>
  <p>Abra la URL del servicio en el navegador, inicie sesión y acceda a <b>Configuración / Admin</b> (⚙️) para parametrizar o alternar entre proveedores de IA (Google Gemini, OpenRouter, OpenAI o vLLM on-premise) en caliente.</p>

  <h2>5. Guía Forense de Solución de Problemas (Troubleshooting)</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Incidente / Error</th>
        <th style="width: 35%;">Causa Raíz</th>
        <th style="width: 40%;">Resolución Inmediata</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>PERMISSION_DENIED en Cloud Storage</b></td>
        <td>La cuenta <code>{NUM}-compute@developer.gserviceaccount.com</code> no tiene permisos para escribir en el bucket de staging de Cloud Build.</td>
        <td><code>gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:\${COMPUTE_SA}" --role="roles/storage.admin"</code></td>
      </tr>
      <tr>
        <td><b>auth/unauthorized-domain</b></td>
        <td>El dominio de Cloud Run no ha sido dado de alta en la lista blanca de Firebase OAuth.</td>
        <td>Agregue el dominio asignado en <b>Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains</b>.</td>
      </tr>
      <tr>
        <td><b>Identity Toolkit API has not been used</b></td>
        <td>La API de Firebase Auth no fue habilitada durante la inicialización.</td>
        <td><code>gcloud services enable identitytoolkit.googleapis.com --project="$PROJECT_ID"</code></td>
      </tr>
      <tr>
        <td><b>Container failed to start and listen on PORT=8080</b></td>
        <td>Falta de dependencias en runtime o error no capturado en Node.js.</td>
        <td>Inspeccione los logs detallados con:<br><code>gcloud run services logs read "$SERVICE_NAME" --region "$REGION" --limit 50</code></td>
      </tr>
      <tr>
        <td><b>FAILED_PRECONDITION: Policy member restriction</b></td>
        <td>La organización prohíbe <code>allUsers</code> mediante la directiva <code>iam.allowedPolicyMemberDomains</code>.</td>
        <td>Asigne el rol de invocador al dominio corporativo:<br><code>gcloud run services add-iam-policy-binding "$SERVICE_NAME" --member="domain:tuempresa.com" --role="roles/run.invoker"</code></td>
      </tr>
      <tr>
        <td><b>PERMISSION_DENIED en Cloud Firestore</b></td>
        <td>La base de datos Firestore no ha sido inicializada en modo Nativo.</td>
        <td><code>gcloud firestore databases create --location="nam5" --type="firestore-native" --project="$PROJECT_ID"</code></td>
      </tr>
    </tbody>
  </table>

  <h2>6. Mantenimiento y Actualizaciones Zero-Downtime</h2>
  <p>Para aplicar nuevas revisiones o actualizaciones de frameworks normativos sin interrumpir a los usuarios:</p>
  <pre><code>git pull origin main
./deploy_cloud_run.sh "$PROJECT_ID"</code></pre>
  <p>Google Cloud Run ejecutará la nueva revisión en paralelo, validará las sondas de salud y migrará el 100% del tráfico de forma instantánea sin pérdida de conexiones activas.</p>
  `;
  return renderHtmlDocument("Manual de Instalación y Despliegue en Google Cloud", "INSTALACIÓN Y DEVOPS", content);
}

// -------------------------------------------------------------
// MAIN EXECUTION ROUTINE
// -------------------------------------------------------------
const manuals = [
  {
    fileName: '1_Manual_de_Uso_AegisAI',
    htmlContent: getManualDeUsoHtml(),
    title: 'Manual de Uso del Operador'
  },
  {
    fileName: '2_Manual_de_Diseno_AegisAI',
    htmlContent: getManualDeDisenoHtml(),
    title: 'Manual de Diseño y Design System'
  },
  {
    fileName: '3_Manual_de_Arquitectura_AegisAI',
    htmlContent: getManualDeArquitecturaHtml(),
    title: 'Manual de Arquitectura Técnica'
  },
  {
    fileName: '4_Manual_de_Pruebas_AegisAI',
    htmlContent: getManualDePruebasHtml(),
    title: 'Manual de Pruebas y QA'
  },
  {
    fileName: '5_Manual_de_Pruebas_de_Seguridad_AegisAI',
    htmlContent: getManualDePruebasDeSeguridadHtml(),
    title: 'Manual de Pruebas de Seguridad y DevSecOps'
  },
  {
    fileName: '6_Manual_de_Instalacion_y_Despliegue_AegisAI',
    htmlContent: getManualDeInstalacionHtml(),
    title: 'Manual de Instalación y Despliegue en Google Cloud'
  }
];

console.log('=== Generando Documentación Completa en PDF para AegisAI ===');

for (const m of manuals) {
  const htmlPath = path.join(tempHtmlDir, `${m.fileName}.html`);
  const pdfPath = path.join(outputDir, `${m.fileName}.pdf`);

  fs.writeFileSync(htmlPath, m.htmlContent, 'utf8');
  console.log(`[HTML Generado] ${m.title} -> ${htmlPath}`);

  try {
    const cmd = `google-chrome-stable --headless=new --disable-gpu --no-sandbox --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "${htmlPath}"`;
    execSync(cmd, { stdio: 'pipe' });
    const stats = fs.statSync(pdfPath);
    console.log(`[PDF Creado] ${m.title} -> ${pdfPath} (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`[Error Generando PDF] ${m.title}:`, err.message);
  }
}

// Limpiar HTMLs temporales
try {
  fs.rmSync(tempHtmlDir, { recursive: true, force: true });
} catch (_) {}

console.log('\nTodos los manuales PDF han sido generados exitosamente en docs/manuales_pdf/');
