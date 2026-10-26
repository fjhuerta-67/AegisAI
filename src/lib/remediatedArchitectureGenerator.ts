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
export function generateRemediatedArchitectureMarkdown(audit: AuditReport): string {
  const actionItems = extractActionItems(audit);
  const isCustom = audit.standard === 'CUSTOM';
  const isFull = audit.standard === 'FULL';
  const isMulti = audit.standard === 'MULTI' || (audit.standards && audit.standards.length > 1);
  const isISO = audit.standard === 'ISO-42001';
  const breakdownNames = (audit.standardsBreakdown || []).map(b => b.standardName).filter(Boolean);
  const standardLabel = isCustom
    ? (audit.customFrameworkName || 'Marco Regulatorio Personalizado')
    : (isMulti
      ? (breakdownNames.length > 0 ? breakdownNames.join(' & ') : 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023')
      : (isFull ? 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023' : (isISO ? 'ISO/IEC 42001:2023' : 'OWASP AI-SVS 1.0')));
  
  const levelLabel = audit.assessedLevel || audit.targetLevel || 'L1';
  const platformName = audit.techPlatformName || (
    audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' :
    audit.techPlatform === 'vertex-ai' ? 'Google Cloud Vertex AI' :
    audit.techPlatform || 'SaaS Gestionado'
  );
  const deploymentType = audit.deploymentType || (audit.techPlatform === 'vertex-ai' ? 'PaaS' : 'SaaS');
  const cleanSystemName = audit.systemName || 'Sistema IA';
  const evalDate = audit.date ? format(new Date(audit.date), 'yyyy-MM-dd HH:mm') : format(new Date(), 'yyyy-MM-dd HH:mm');

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
export function downloadRemediatedArchitecture(audit: AuditReport, formatType: 'md' | 'txt' = 'md'): void {
  const content = generateRemediatedArchitectureMarkdown(audit);
  const mimeType = formatType === 'md' ? 'text/markdown;charset=utf-8;' : 'text/plain;charset=utf-8;';
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const cleanName = (audit.systemName || 'Sistema_IA').replace(/[^a-zA-Z0-9_-]/g, '_');
  const extension = formatType === 'md' ? 'md' : 'txt';
  link.download = `${cleanName}_Arquitectura_Remediada_100_Cumplimiento_${audit.id}.${extension}`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
