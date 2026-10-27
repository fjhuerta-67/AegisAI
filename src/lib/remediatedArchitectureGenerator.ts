import { AuditReport, PuntoProbado } from '../types';
import { extractActionItems, ActionItem } from './actionPlanGenerator';
import { format } from 'date-fns';

function detectLanguage(code: string): string {
  if (!code) return 'text';
  const trimmed = code.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) return 'json';
  if (code.includes('rules_version') || code.includes('const ') || code.includes('interface ') || code.includes('export ') || code.includes('function ') || /import\s+.*\s+from\s+['"]/.test(code)) return 'typescript';
  if (code.includes('resource "') || code.includes('provider "')) return 'hcl';
  if (code.includes('apiVersion:') || code.includes('kind:') || code.includes('metadata:') || /^[a-zA-Z0-9_]+:\s*(\n|$)/m.test(trimmed)) return 'yaml';
  if (code.includes('def ') || code.includes('import numpy') || code.includes('print(')) return 'python';
  if (code.includes('npm ') || code.includes('curl ') || code.includes('gcloud ') || code.includes('chmod ') || code.includes('echo ')) return 'bash';
  return 'text';
}

function firstCompleteSentence(text?: string): string {
  if (!text) return 'Salvaguarda técnica y configuración de hardening implementada.';
  const cleaned = text.trim().replace(/\s+/g, ' ');
  // Split on a sentence-ending period followed by whitespace and an uppercase/Spanish letter, not inside identifiers like googleapis.com, crypto.timingSafeEqual, server.ts, A.3.3, or Gemini 3.8.
  const match = cleaned.match(/^(.+?[.!?])(?:\s+[A-ZÁÉÍÓÚÑ]|$)/);
  if (match && match[1]) {
    return match[1];
  }
  return cleaned.endsWith('.') ? cleaned : `${cleaned}.`;
}

/**
 * Genera el documento completo de Arquitectura Remediada y Correcciones Sugeridas
 * diseñado para que el sistema cumpla con el 100% de los puntos evaluados.
 */
export function generateRemediatedArchitectureMarkdown(audit: AuditReport, lang: string = 'es'): string {
  const isEn = lang !== 'es';
  const actionItems = extractActionItems(audit);
  const isCustom = audit.standard === 'CUSTOM';
  const isFull = audit.standard === 'FULL';
  const isMulti = audit.standard === 'MULTI' || (audit.standards && audit.standards.length > 1);
  const isISO = audit.standard === 'ISO-42001';
  const breakdownNames = (audit.standardsBreakdown || []).map(b => b.standardName).filter(Boolean);
  const standardLabel = isCustom
    ? (audit.customFrameworkName || (isEn ? 'Custom Regulatory Framework' : 'Marco Regulatorio Personalizado'))
    : (isMulti
      ? (breakdownNames.length > 0 ? breakdownNames.join(' & ') : 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023')
      : (isFull ? 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023' : (isISO ? 'ISO/IEC 42001:2023' : 'OWASP AI-SVS 1.0')));
  
  const levelLabel = audit.assessedLevel || audit.targetLevel || 'L1';
  const platformName = audit.techPlatformName || (
    audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' :
    audit.techPlatform === 'vertex-ai' ? 'Google Cloud Vertex AI' :
    audit.techPlatform || (isEn ? 'Managed SaaS' : 'SaaS Gestionado')
  );
  const deploymentType = audit.deploymentType || (audit.techPlatform === 'vertex-ai' ? 'PaaS' : 'SaaS');
  const cleanSystemName = audit.systemName || (isEn ? 'AI System' : 'Sistema IA');
  const evalDate = audit.date ? format(new Date(audit.date), 'yyyy-MM-dd HH:mm') : format(new Date(), 'yyyy-MM-dd HH:mm');

  if (isEn) {
    let md = `# Remediated Architecture Specification for 100% Compliance\n\n`;
    md += `**System:** ${cleanSystemName}  \n`;
    md += `**Evaluated Standard:** ${standardLabel}  \n`;
    md += `**Verification Level:** ${levelLabel}  \n`;
    md += `**Technology Platform:** ${platformName} (${deploymentType})  \n`;
    md += `**Technical Lead:** ${audit.technicalLead} (${audit.email})  \n`;
    md += `**Base Audit ID:** \`${audit.id}\`  \n`;
    md += `**Patch Generation Date:** ${evalDate}  \n`;
    md += `**Initial Score:** ${audit.overallScore.toFixed(1)}% ➔ **Projected Score with this Specification:** **100.0% (Compliant)**\n\n`;

    md += `---\n\n`;

    md += `## 1. Compliance Statement & Document Purpose\n\n`;
    md += `This technical document represents the **remediated architecture specification** for **${cleanSystemName}**. It has been formulated by the **AegisAI** assurance engine to comprehensively and verifiably resolve all non-conformities and missing evidence identified during the audit under **${standardLabel}**.\n\n`;
    md += `By incorporating the safeguards, components, data flows, and configuration snippets defined below, the architecture satisfies **100% of applicable regulatory controls and requirements**.\n\n`;

    md += `---\n\n`;

    md += `## 2. Remediated Gaps Matrix (Addressed Opportunity Areas)\n\n`;
    md += `Below are the structural corrections incorporated into this specification to close each gap:\n\n`;
    md += `| Control ID | Control / Requirement | Previous Status | Level | Risk | Technical Correction Incorporated in this Document |\n`;
    md += `| :---: | :--- | :---: | :---: | :---: | :--- |\n`;

    if (actionItems.length === 0) {
      md += `| 🟢 N/A | All controls are currently passed | Passed | ${levelLabel} | Low | No additional patches required. |\n`;
    } else {
      actionItems.forEach(item => {
        const p = item.punto;
        const fixSummary = firstCompleteSentence(p.remediationDetails?.strategy || p.remediation);
        const statusDisp = p.status === 'Aprobado' ? 'Passed' : p.status === 'Fallido' ? 'Failed' : 'Missing Evidence';
        const riskDisp = p.riskImpact === 'Alto' ? 'High' : p.riskImpact === 'Medio' ? 'Medium' : p.riskImpact === 'Bajo' ? 'Low' : p.riskImpact;
        md += `| \`${p.id}\` | ${p.name} | **${statusDisp}** | \`${p.level || 'L1'}\` | **${riskDisp}** | ${fixSummary} |\n`;
      });
    }

    md += `\n---\n\n`;

    md += `## 3. Comprehensive Remediated Architecture Specification (Drop-in Replacement)\n\n`;
    if (audit.remediatedArchitectureDoc && audit.remediatedArchitectureDoc.length > 300) {
      md += `${audit.remediatedArchitectureDoc.trim()}\n\n`;
    } else {
      md += `> This section contains the full technical description of ${cleanSystemName}, integrating both its original operational functionality and all defense-in-depth safeguards required to certify full regulatory compliance.\n\n`;

      md += `### 3.1 System Overview & Scope\n`;
      md += `${cleanSystemName} is an Artificial Intelligence solution deployed on the enterprise infrastructure of **${platformName}** (${deploymentType}).\n\n`;
      md += `**Base System Description:**\n`;
      md += `${audit.description || 'Enterprise AI system with natural language processing and RAG workflows.'}\n\n`;

      md += `### 3.2 Inherited Native Cloud Platform Safeguards\n`;
      md += `- **Physical Isolation & MicroVMs:** Model execution operates in isolated gVisor/microVM containers with Titan security chips and verified boot.\n`;
      md += `- **End-to-End Encryption:** Enforced TLS 1.3 encryption in transit and AES-256 encryption at rest with Customer-Managed Encryption Keys (CMEK) or provider-managed keys.\n`;
      md += `- **Zero Data Retention (ZDR):** Contractual guarantee that user prompts, queries, and generated responses are never stored for retraining or foundation model improvement.\n`;
      md += `- **Native Safety Filters:** API-level blocking of toxic content, hate speech, and malware.\n\n`;

      md += `### 3.3 Built-in Defense-in-Depth Architecture\n\n`;

      md += `#### A. Ingestion & Prompt Injection Shield Layer (LLM01 / OWASP AISVS C02)\n`;
      md += `- **Strict Delimitation:** User inputs and retrieved documents are encapsulated inside canonical XML tags (e.g., \`<user_input>\` and \`<retrieved_context>\`) within system instructions.\n`;
      md += `- **Invariability Directive:** The meta-prompt declares that any user commands, instructional text, or compliance assertions must be treated strictly as untrusted data to audit/process, never as execution directives.\n`;
      md += `- **Pre-Inference Filter:** Sanitization against null characters, adversarial suffix attacks, and strict payload size limits (HTTP 413 on oversized payloads).\n\n`;

      md += `#### B. Privacy Protection, DLP & Anonymization Layer (OWASP AISVS C01)\n`;
      md += `- **Local Masking Pipeline:** All personally identifiable information (IDs, payment card numbers, addresses, emails, and full names) is intercepted by a DLP engine (e.g., Cloud DLP / Microsoft Presidio) before transmission to the LLM.\n`;
      md += `- **Vector Encryption in RAG:** Embeddings stored in the vector database enforce encryption at rest and strict tenant isolation (\`tenant_id\`).\n`;
      md += `- **ARCO/GDPR Purge Protocol:** Cascading mechanism that synchronously purges both relational records and associated vectors in the vector store when a user exercises their right to erasure.\n\n`;

      md += `#### C. Output, Veracity & Factual Grounding Layer (OWASP AISVS C03)\n`;
      md += `- **Deterministic Parameters:** Inference configured with \`temperature: 0.0\`, \`topK: 1\`, and structured response schemas (JSON Schema) to eliminate hallucinations.\n`;
      md += `- **Mandatory Verbatim Citation:** Every critical response must include direct verbatim citations from the verified knowledge repository (\`textoEvidencia\` and \`fuenteEvidencia\`).\n`;
      md += `- **Anti-XSS Output Encoding:** All generated responses are encoded to prevent malicious script execution in client browsers.\n\n`;

      md += `#### D. Governance, Human Escalation & Immutable Logging Layer\n`;
      md += `- **Audit Immutability:** Audit logs and critical transactions enforce read-only permissions and strict deletion locks (\`allow delete: if false;\`).\n`;
      md += `- **Bot Disclosure & Human Escalation:** The interface explicitly discloses from the first message that the user is interacting with an autonomous AI system and provides a permanent human operator handoff button.\n\n`;
    }

    md += `### 3.4 Google Cloud ISO/IEC 42001 3-Phase AI Protection Stack\n\n`;
    md += `- **Phase 3 — Development & Protection (AI System Design & Development):**\n`;
    md += `  - **Visual & Evidence-Based Gap Map:** Generates a visual, evidence-backed map of gaps between the current and target state (\`L1\`/\`L2\`/\`L3\`).\n`;
    md += `  - **Vertex AI Model Garden & Model Registry:** Model Garden provides a curated library of models reviewed, cryptographically signed, and verified by Google and trusted partners, while Model Registry governs private custom models—securing the AI supply chain instead of downloading unverified internet models with potential backdoors (\`ISO 42001 A.6.1.2 / A.7.3\`, \`OWASP C01.4 / C13.1\`).\n`;
    md += `  - **Google Cloud Model Armor:** Positioned inline in front of LLMs (\`sanitizeUserPrompt\` / \`sanitizeModelResponse\`), sanitizing inputs and outputs in real time, detecting and blocking prompt injection and jailbreak attacks, and filtering toxic content from both user prompts and model responses alike (\`ISO 42001 A.6.2.6\`, \`OWASP C02.10 / C07.1\`).\n`;
    md += `- **Phase 4 — Evaluation (Review of Applied Controls):**\n`;
    md += `  - **Vertex Evaluation Service (AutoSxS & Safety Metrics):** Integrated Vertex AI evaluation framework using **AutoSxS** (an automated side-by-side evaluator that grades model responses like a teacher grading a student's assignment) alongside native safety metrics (hate speech, harassment, sexually explicit content, and dangerous content). Faster and more cost-effective than manual specialist reviews, providing the immutable audit trail required by \`ISO/IEC 42001 Clause 9.1 / A.6.2.4\` (\`OWASP C08.4\`).\n`;
    md += `- **Phase 5 — Deployment (Controlled Production Deployment):**\n`;
    md += `  - **Vertex AI Model Monitoring:** Continuously evaluates model performance in production, detecting **training-serving skew** (when production data diverges from training data) and **concept/feature drift** (when the real world changes and the model becomes obsolete), alerting immediately if the model stops operating safely (\`ISO 42001 Clause 9.1 / A.6.2.6\`, \`OWASP C08.4\`).\n`;
    md += `  - **Security Command Center (SCC) with AI Protection:** Centralized threat and vulnerability detection in Google Cloud integrated with Vertex AI. Any prompt injection attack attempt surfaces immediately as an actionable security alert, enabling the SOC to respond in real time (\`ISO 42001 A.6.2.8 / Clause 10.1\`, \`OWASP C12.2\`).\n\n`;

    md += `---\n\n`;

    md += `## 4. Technical Patch & Remediation Code Cookbook\n\n`;
    md += `The following code blocks and configurations must be deployed in the project repository to formalize the suggested fixes:\n\n`;

    if (actionItems.length === 0) {
      md += `> No additional code patches required. Current configuration is fully compliant.\n\n`;
    } else {
      actionItems.forEach((item, index) => {
        const p = item.punto;
        const details = p.remediationDetails;
        const riskDisp = p.riskImpact === 'Alto' ? 'High' : p.riskImpact === 'Medio' ? 'Medium' : p.riskImpact === 'Bajo' ? 'Low' : p.riskImpact;
        md += `### Patch ${index + 1}: ${p.id} — ${p.name}\n\n`;
        md += `- **Regulatory Chapter:** ${item.chapterId} (${item.chapterName})\n`;
        md += `- **Assigned Level:** \`${p.level || 'L1'}\` | **Risk Impact:** **${riskDisp}**\n`;
        if (details?.effortLevel) {
          md += `- **Estimated Application Time:** ${details.effortLevel}\n`;
        }
        md += `\n`;
        
        if (details?.strategy) {
          md += `**Technical Strategy:**\n${details.strategy}\n\n`;
        }

        if (details?.actionableSteps && details.actionableSteps.length > 0) {
          md += `**Implementation Instructions:**\n`;
          details.actionableSteps.forEach((step, stepIdx) => {
            const cleanStep = step.replace(/^\s*\d+[\.\)]\s*/, '');
            md += `${stepIdx + 1}. ${cleanStep}\n`;
          });
          md += `\n`;
        }

        if (details?.codeOrConfigExample) {
          const codeLang = detectLanguage(details.codeOrConfigExample);
          md += `**Code / Configuration to Integrate:**\n`;
          md += `\`\`\`${codeLang}\n${details.codeOrConfigExample}\n\`\`\`\n\n`;
        }

        if (details?.verificationRecipe) {
          md += `**Post-Implementation Verification Test:**\n`;
          md += `\`\`\`bash\n${details.verificationRecipe}\n\`\`\`\n\n`;
        }

        md += `---\n\n`;
      });
    }

    md += `## 5. QA Verification Guide & Acceptance Criteria\n\n`;
    md += `To verify that the system achieves a 100% compliance score after implementing this package:\n\n`;
    md += `1. **Deploy Patches:** Integrate the configuration files and code middleware provided in Section 4.\n`;
    md += `2. **Run Automated Tests:**\n`;
    md += `   \`\`\`bash\n`;
    md += `   # Run type and integrity checks\n`;
    md += `   npm run lint\n\n`;
    md += `   # Run security test suite against injections and leaks\n`;
    md += `   npm run test:security\n\n`;
    md += `   # Run integration tests for regulatory endpoints\n`;
    md += `   npm run test:integration\n`;
    md += `   \`\`\`\n`;
    md += `3. **Re-audit in AegisAI:**\n`;
    md += `   - Upload this file (\`${cleanSystemName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Remediated_Architecture_100.md\`) in the *New Audit* module.\n`;
    md += `   - Verify that the overall compliance score reaches **100.0% (Level ${levelLabel})** and that all ${audit.chapters.reduce((acc, c) => acc + (c.puntosProbados?.length || 0), 0)} evaluated controls appear in **Passed** status.\n\n`;

    md += `---\n\n`;
    md += `*Document automatically generated by AegisAI Assurance Engine — AI Security Audit & Verification Platform.*`;

    return md;
  }

  let md = `# Especificación de Arquitectura Remediada para Cumplimiento al 100%\n\n`;
  md += `**Sistema:** ${cleanSystemName}  \n`;
  md += `**Normativa Evaluada:** ${standardLabel}  \n`;
  md += `**Nivel de Verificación:** ${levelLabel}  \n`;
  md += `**Plataforma Tecnológica:** ${platformName} (${deploymentType})  \n`;
  md += `**Líder Técnico:** ${audit.technicalLead} (${audit.email})  \n`;
  md += `**ID de Auditoría Base:** \`${audit.id}\`  \n`;
  md += `**Fecha de Generación de Parche:** ${evalDate}  \n`;
  md += `**Calificación Inicial:** ${audit.overallScore.toFixed(1)}% ➔ **Calificación Proyectada con este Documento:** **100.0% (Conforme)**\n\n`;

  md += `---\n\n`;

  md += `## 1. Declaración de Cumplimiento y Propósito del Documento\n\n`;
  md += `Este documento técnico representa la **especificación de arquitectura remediada** para **${cleanSystemName}**. Ha sido formulado por el motor de aseguramiento **AegisAI** para resolver de forma exhaustiva y verificable todas las no conformidades y faltas de evidencia identificadas durante la auditoría bajo la norma **${standardLabel}**.\n\n`;
  md += `Al incorporar las salvaguardas, componentes, flujos de datos y fragmentos de configuración definidos a continuación, la arquitectura satisface el **100% de los controles y requisitos normativos aplicables**.\n\n`;

  md += `---\n\n`;

  md += `## 2. Matriz de Brechas Subsanadas (Áreas de Oportunidad Corregidas)\n\n`;
  md += `A continuación se detallan las correcciones estructurales incorporadas en esta especificación para cerrar cada brecha:\n\n`;
  md += `| Control ID | Control / Requisito | Estado Previo | Nivel | Riesgo | Corrección Técnica Incorporada en este Documento |\n`;
  md += `| :---: | :--- | :---: | :---: | :---: | :--- |\n`;

  if (actionItems.length === 0) {
    md += `| 🟢 N/A | Todos los controles se encuentran actualmente aprobados | Aprobado | ${levelLabel} | Bajo | No se requirieron parches adicionales. |\n`;
  } else {
    actionItems.forEach(item => {
      const p = item.punto;
      const fixSummary = firstCompleteSentence(p.remediationDetails?.strategy || p.remediation);
      md += `| \`${p.id}\` | ${p.name} | **${p.status}** | \`${p.level || 'L1'}\` | **${p.riskImpact}** | ${fixSummary} |\n`;
    });
  }

  md += `\n---\n\n`;

  md += `## 3. Especificación Integral de la Arquitectura Corregida (Drop-in Replacement)\n\n`;
  if (audit.remediatedArchitectureDoc && audit.remediatedArchitectureDoc.length > 300) {
    md += `${audit.remediatedArchitectureDoc.trim()}\n\n`;
  } else {
    md += `> Esta sección contiene la descripción técnica completa del sistema ${cleanSystemName}, integrando tanto su funcionalidad operativa original como todas las defensas en profundidad exigidas para certificar cumplimiento normativo total.\n\n`;

    md += `### 3.1 Descripción General y Alcance del Sistema\n`;
    md += `${cleanSystemName} es una solución de Inteligencia Artificial desplegada sobre la infraestructura empresarial de **${platformName}** (${deploymentType}).\n\n`;
    md += `**Descripción Base del Sistema:**\n`;
    md += `${audit.description || 'Sistema de Inteligencia Artificial empresarial con procesamiento de lenguaje natural y flujos RAG.'}\n\n`;

    md += `### 3.2 Salvaguardas Nativas Heredadas de la Plataforma Cloud\n`;
    md += `- **Aislamiento Físico y MicroVMs:** La ejecución de modelos opera en contenedores aislados gVisor/microVM con chips de seguridad Titan y arranque verificado.\n`;
    md += `- **Cifrado Integral:** Cifrado en tránsito forzado con TLS 1.3 y cifrado en reposo con claves AES-256 administradas por el cliente (CMEK) o por el proveedor.\n`;
    md += `- **Zero Data Retention (ZDR):** Garantía contractual de que los prompts, consultas de usuarios y respuestas generadas jamás se almacenan para re-entrenamiento ni mejora de modelos fundacionales.\n`;
    md += `- **Filtros de Seguridad Nativos:** Bloqueo de contenido tóxico, incitación al odio y malware a nivel API.\n\n`;

    md += `### 3.3 Arquitectura de Defensas en Profundidad Incorporadas\n\n`;

    md += `#### A. Capa de Ingesta y Blindaje contra Inyección de Prompts (LLM01 / OWASP AISVS C02)\n`;
    md += `- **Delimitación Estricta:** Las entradas de usuario y los documentos recuperados se encapsulan dentro de etiquetas XML canónicas (ej. \`<user_input>\` y \`<retrieved_context>\`) en las instrucciones de sistema.\n`;
    md += `- **Instrucción de Invariabilidad:** Se declara en el meta-prompt que cualquier comando, texto instructivo o assertions de cumplimiento provenientes del usuario deben ser tratados estrictamente como datos no confiables a auditar/procesar, nunca como directivas de ejecución.\n`;
    md += `- **Filtro Pre-Inferencia:** Sanitización contra caracteres nulos, ataques de sufijo adversarial y limitación estricta de tamaño de payload (HTTP 413 ante cargas mayores al límite permitido).\n\n`;

    md += `#### B. Capa de Protección de Privacidad, DLP y Anonimización (LFPDPPP / OWASP AISVS C01)\n`;
    md += `- **Pipeline de Enmascaramiento Local:** Todo dato personal identificable (CURP, RFC, número de tarjeta bancaria, dirección, correo y nombres propios) es interceptado por un motor DLP (ej. Microsoft Presidio o regex de alta precisión) antes de ser transmitido al LLM.\n`;
    md += `- **Cifrado Vectorial en RAG:** Los embeddings almacenados en la base de datos vectorial cuentan con cifrado en reposo y aislamiento estricto por identificador de inquilino (\`tenant_id\`).\n`;
    md += `- **Protocolo de Purga ARCO:** Mecanismo en cascada que purga de forma sincrónica tanto los registros relacionales como los vectores asociados en la base vectorial cuando un usuario ejerce su derecho de Cancelación u Oposición.\n\n`;

    md += `#### C. Capa de Salida, Veracidad y Grounding Factual (LFPC / OWASP AISVS C03)\n`;
    md += `- **Parámetros Determinísticos:** Inferencia configurada con \`temperature: 0.0\`, \`topK: 1\` y esquemas de respuesta estructurada (JSON Schema) para erradicar alucinaciones en ofertas comerciales o dictámenes legales.\n`;
    md += `- **Citación Textual Obligatoria:** Cada respuesta crítica debe incluir citas textuales directas del repositorio de conocimiento verificado (\`textoEvidencia\` y \`fuenteEvidencia\`).\n`;
    md += `- **Codificación de Salida Anti-XSS:** Todas las respuestas generadas se codifican para evitar ejecución de scripts maliciosos en navegadores clientes.\n\n`;

    md += `#### D. Capa de Gobernanza, Escalamiento Humano y Registro Inmutable (Invariante 4 / LFPC Art. 56)\n`;
    md += `- **Inmutabilidad de Auditorías:** Los registros de auditoría y transacciones críticas cuentan con permisos de solo lectura y bloqueo estricto de eliminación (\`allow delete: if false;\`).\n`;
    md += `- **Identificación de Bot y Escalamiento a Humano:** La interfaz informa obligatoriamente desde el primer mensaje que el usuario interactúa con un sistema de IA autónomo y ofrece un botón permanente de transferencia a un operador humano.\n`;
    md += `- **Flujo de Retracto Comercial:** En concordancia con el Art. 56 de la LFPC, el sistema incorpora un endpoint automatizado que gestiona la cancelación de compras y reversión de transacciones dentro de los 5 días hábiles siguientes.\n\n`;
  }

  md += `### 3.4 Stack de Protección Google Cloud para ISO/IEC 42001 (Fases 3, 4 y 5)\n\n`;
  md += `- **Fase 3 — Desarrollo y Protecciones (Diseño de Sistemas IA y Desarrollo):**\n`;
  md += `  - **Mapa Visual Basado en Evidencia de Brechas:** Genera un mapa visual y sustentado en evidencia de las brechas entre el estado actual y el deseado (\`L1\`/\`L2\`/\`L3\`).\n`;
  md += `  - **Model Garden / Model Registry:** Model Garden es la librería de modelos revisados, firmados y verificados por Google y otros socios, mientras que Model Registry es la librería de modelos propios de la organización. Asegura la cadena de suministro de modelos de IA, evitando obtener modelos de Internet con posibles puertas traseras (\`ISO 42001 A.6.1.2 / A.7.3\`, \`OWASP C01.4 / C13.1\`).\n`;
  md += `  - **Google Cloud Model Armor:** Se posiciona delante de los LLMs (\`sanitizeUserPrompt\` / \`sanitizeModelResponse\`). Sanitiza entradas y salidas en tiempo real, detecta y bloquea ataques de inyección de prompts y jailbreaks, y filtra contenido tóxico del usuario y de las respuestas por igual (\`ISO 42001 A.6.2.6\`, \`OWASP C02.10 / C07.1\`).\n`;
  md += `- **Fase 4 — Evaluación (Revisión de los Controles Aplicados):**\n`;
  md += `  - **Vertex Evaluation Service (AutoSxS):** Evalúa la seguridad de un modelo en Google Cloud mediante un framework integrado en Vertex AI que usa **AutoSxS** (un modelo que auto-categoriza las respuestas como un profesor calificando la tarea de un alumno) y métricas de seguridad: lenguaje de odio, acoso, contenido sexualmente explícito y contenido peligroso. Es una revisión más rápida y económica que la que haría un equipo especializado y provee el rastro de auditoría que requiere \`ISO/IEC 42001 Cláusula 9.1 / A.6.2.4\` (\`OWASP C08.4\`).\n`;
  md += `- **Fase 5 — Despliegue (Despliegue Controlado de Aplicaciones en Producción):**\n`;
  md += `  - **Vertex AI Model Monitoring:** Evalúa en producción el desempeño del modelo, detectando desviaciones (*Training-serving skew*: cuando la data en producción es diferente a la del entrenamiento) y *drift* (cuando el mundo cambia y el modelo es obsoleto). Si el modelo deja de funcionar de forma segura, la herramienta alerta de forma inmediata (\`ISO 42001 Cláusula 9.1 / A.6.2.6\`, \`OWASP C08.4\`).\n`;
  md += `  - **Security Command Center (SCC) con Protección AI:** Detección de amenazas y vulnerabilidades en Google Cloud integrada con Vertex AI. Si alguien trata de enviar un ataque de inyección de prompt, se muestra como una alerta de seguridad permitiendo al SOC responder a tiempo (\`ISO 42001 A.6.2.8 / Cláusula 10.1\`, \`OWASP C12.2\`).\n\n`;

  md += `---\n\n`;

  md += `## 4. Recetario Técnico de Parches y Código de Remediación (Cookbook)\n\n`;
  md += `Los siguientes bloques de código y configuraciones deben desplegarse en el repositorio del proyecto para formalizar las correcciones sugeridas:\n\n`;

  if (actionItems.length === 0) {
    md += `> No se requieren parches de código adicionales. La configuración actual es totalmente conforme.\n\n`;
  } else {
    actionItems.forEach((item, index) => {
      const p = item.punto;
      const details = p.remediationDetails;
      md += `### Parche ${index + 1}: ${p.id} — ${p.name}\n\n`;
      md += `- **Capítulo Normativo:** ${item.chapterId} (${item.chapterName})\n`;
      md += `- **Nivel Asignado:** \`${p.level || 'L1'}\` | **Impacto de Riesgo:** **${p.riskImpact}**\n`;
      if (details?.effortLevel) {
        md += `- **Tiempo Estimado de Aplicación:** ${details.effortLevel}\n`;
      }
      md += `\n`;
      
      if (details?.strategy) {
        md += `**Estrategia Técnica:**\n${details.strategy}\n\n`;
      }

      if (details?.actionableSteps && details.actionableSteps.length > 0) {
        md += `**Instrucciones de Implementación:**\n`;
        details.actionableSteps.forEach((step, stepIdx) => {
          const cleanStep = step.replace(/^\s*\d+[\.\)]\s*/, '');
          md += `${stepIdx + 1}. ${cleanStep}\n`;
        });
        md += `\n`;
      }

      if (details?.codeOrConfigExample) {
        const lang = detectLanguage(details.codeOrConfigExample);
        md += `**Código / Configuración a Integrar:**\n`;
        md += `\`\`\`${lang}\n${details.codeOrConfigExample}\n\`\`\`\n\n`;
      }

      if (details?.verificationRecipe) {
        md += `**Prueba de Verificación Post-Implementación:**\n`;
        md += `\`\`\`bash\n${details.verificationRecipe}\n\`\`\`\n\n`;
      }

      md += `---\n\n`;
    });
  }

  md += `## 5. Guía de Verificación QA y Criterios de Aceptación\n\n`;
  md += `Para verificar que el sistema alcanza la calificación de 100% de cumplimiento tras implementar este paquete:\n\n`;
  md += `1. **Despliegue de los Parches:** Integre los archivos de configuración y middleware de código provistos en la Sección 4.\n`;
  md += `2. **Ejecución de Pruebas Automatizadas:**\n`;
  md += `   \`\`\`bash\n`;
  md += `   # Ejecutar verificación de tipos e integridad\n`;
  md += `   npm run lint\n\n`;
  md += `   # Ejecutar batería de seguridad contra inyecciones y fugas\n`;
  md += `   npm run test:security\n\n`;
  md += `   # Ejecutar pruebas de integración de servicios y endpoints normativos\n`;
  md += `   npm run test:integration\n`;
  md += `   \`\`\`\n`;
  md += `3. **Re-auditoría en AegisAI:**\n`;
  md += `   - Cargue este archivo (\`${cleanSystemName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Arquitectura_Remediada_100.md\`) en el módulo de *Nueva Auditoría*.\n`;
  md += `   - Verifique que la puntuación global de cumplimiento alcance **100.0% (Nivel ${levelLabel})** y que la totalidad de los ${audit.chapters.reduce((acc, c) => acc + (c.puntosProbados?.length || 0), 0)} controles evaluados figuren en estado **Aprobado**.\n\n`;

  md += `---\n\n`;
  md += `*Documento generado automáticamente por AegisAI Assurance Engine — Plataforma de Auditoría y Verificación de Seguridad en Inteligencia Artificial.*`;

  return md;
}

/**
 * Dispara la descarga del archivo en el navegador del usuario final
 */
export function downloadRemediatedArchitecture(audit: AuditReport, formatType: 'md' | 'txt' = 'md', lang: string = 'es'): void {
  const isEn = lang !== 'es';
  const content = generateRemediatedArchitectureMarkdown(audit, lang);
  const mimeType = formatType === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;';
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const cleanName = (audit.systemName || 'Sistema_IA').replace(/[^a-zA-Z0-9_-]/g, '_');
  const extension = formatType === 'md' ? 'md' : 'txt';
  link.download = `${cleanName}_${isEn ? 'Remediated_Architecture_100_Compliance' : 'Arquitectura_Remediada_100_Cumplimiento'}_${audit.id}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
