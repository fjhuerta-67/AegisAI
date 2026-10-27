import { AuditReport, PuntoProbado } from '../types';
import { format } from 'date-fns';

export interface ActionItem {
  chapterId: string;
  chapterName: string;
  punto: PuntoProbado;
  priorityWeight: number; // 1: Crítico/Alto, 2: Medio, 3: Bajo
}

export function extractActionItems(audit: AuditReport): ActionItem[] {
  const items: ActionItem[] = [];
  
  audit.chapters.forEach(ch => {
    ch.puntosProbados.forEach(p => {
      if (p.status !== 'Aprobado') {
        const impact = (p.riskImpact || '').toLowerCase();
        let weight = 2;
        if (impact.includes('crítico') || impact.includes('critico') || impact.includes('alto') || impact.includes('high')) {
          weight = 1;
        } else if (impact.includes('bajo') || impact.includes('low')) {
          weight = 3;
        }
        items.push({
          chapterId: ch.chapterId,
          chapterName: ch.chapterName,
          punto: p,
          priorityWeight: weight
        });
      }
    });
  });

  // Sort by priority weight ascending (1 -> 2 -> 3)
  items.sort((a, b) => a.priorityWeight - b.priorityWeight);
  return items;
}

function detectLanguage(code: string): string {
  if (!code) return 'text';
  if (code.includes('import ') || code.includes('def ') || code.includes('class ') || code.includes('print(')) return 'python';
  if (code.includes('apiVersion:') || code.includes('kind:') || code.includes('metadata:')) return 'yaml';
  if (code.includes('npm ') || code.includes('curl ') || code.includes('gcloud ') || code.includes('chmod ')) return 'bash';
  if (code.includes('const ') || code.includes('interface ') || code.includes('function ') || code.includes('export ')) return 'typescript';
  if (code.startsWith('{') && code.endsWith('}')) return 'json';
  return 'python';
}

export function generateActionPlanMarkdown(audit: AuditReport, lang: string = 'es'): string {
  const isEn = lang !== 'es';
  const actionItems = extractActionItems(audit);
  const isCustom = audit.standard === 'CUSTOM';
  const isFull = audit.standard === 'FULL';
  const isISO = audit.standard === 'ISO-42001';
  const standardLabel = isCustom
    ? (audit.customFrameworkName || (isEn ? 'Custom Regulatory Framework' : 'Marco Regulatorio Personalizado'))
    : (isFull ? 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023' : (isISO ? 'ISO/IEC 42001:2023' : 'OWASP AI-SVS 1.0'));
  const levelLabel = audit.assessedLevel || audit.targetLevel || 'L1';

  const criticalCount = actionItems.filter(i => i.priorityWeight === 1).length;
  const mediumCount = actionItems.filter(i => i.priorityWeight === 2).length;
  const lowCount = actionItems.filter(i => i.priorityWeight === 3).length;

  if (isEn) {
    let md = `# AegisAI • Technical Action & AI Security Remediation Plan\n\n`;
    md += `> **Reference Standard:** ${standardLabel}  \n`;
    md += `> **Technology Platform:** **${audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' : audit.techPlatform || 'Managed SaaS')}** (${audit.deploymentType || 'SaaS'})  \n`;
    md += `> **Audited Verification Level:** **${levelLabel}** ${audit.targetLevel === 'AUTO' ? '(Auto-detected by AI)' : '(Configured by User)'}  \n`;
    if (audit.levelAssessmentRationale) {
      md += `> **Criticality Rationale:** ${audit.levelAssessmentRationale}  \n`;
    }
    md += `> **Audited System:** ${audit.systemName}  \n`;
    md += `> **Responsible Technical Lead:** ${audit.technicalLead} (${audit.email})  \n`;
    md += `> **Audit ID:** \`${audit.id}\`  \n`;
    md += `> **Evaluation Date:** ${format(new Date(audit.date), 'yyyy-MM-dd HH:mm')}  \n`;
    md += `> **Compliance Score (Level ${levelLabel}):** **${audit.overallScore.toFixed(1)}%**  \n`;
    md += `> **Total Controls to Remediate:** **${actionItems.length}** (${criticalCount} High/Critical, ${mediumCount} Medium, ${lowCount} Low)\n\n`;

    md += `---\n\n`;
    md += `## 1. Executive Security Summary\n\n`;
    md += `${audit.executiveSummary || 'AI security controls compliance and verification audit.'}\n\n`;

    md += `### Remediation Prioritization Matrix\n\n`;
    md += `| Priority | Control ID | Control / Clause | Level | Scope | Risk | Estimated Effort | Status |\n`;
    md += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |\n`;
    
    if (actionItems.length === 0) {
      md += `| 🟢 N/A | \`N/A\` | All evaluated controls are Passed | - | Compliant | Low | 0 days | [x] Compliant |\n`;
    } else {
      actionItems.forEach(item => {
        const p = item.punto;
        const prioLabel = item.priorityWeight === 1 ? '🔴 HIGH' : item.priorityWeight === 2 ? '🟡 MEDIUM' : '🟢 LOW';
        const effort = p.remediationDetails?.effortLevel || '1-3 days';
        const scopeLabel = p.isMandatoryForTargetLevel ? `**MANDATORY (Level ${levelLabel})**` : 'Higher Recommendation';
        const riskDisp = p.riskImpact === 'Alto' ? 'High' : p.riskImpact === 'Medio' ? 'Medium' : p.riskImpact === 'Bajo' ? 'Low' : p.riskImpact;
        md += `| ${prioLabel} | \`${p.id}\` | ${p.name} | ${p.level || 'L1'} | ${scopeLabel} | **${riskDisp}** | ${effort} | [ ] Pending |\n`;
      });
    }

    md += `\n---\n\n`;
    md += `## 2. Detailed Technical Implementation Checklist\n\n`;

    if (actionItems.length === 0) {
      md += `> [!NOTE]\n> Congratulations! No non-conformities requiring remediation were detected in this system. The evaluated architecture satisfactorily complies with required controls.\n\n`;
    } else {
      actionItems.forEach((item, index) => {
        const p = item.punto;
        const details = p.remediationDetails;
        const prioBadge = item.priorityWeight === 1 ? '[CRITICAL / HIGH PRIORITY]' : item.priorityWeight === 2 ? '[MEDIUM PRIORITY]' : '[LOW PRIORITY]';
        const riskDisp = p.riskImpact === 'Alto' ? 'High' : p.riskImpact === 'Medio' ? 'Medium' : p.riskImpact === 'Bajo' ? 'Low' : p.riskImpact;

        md += `### ${index + 1}. ${prioBadge} ${p.id} - ${p.name}\n\n`;
        md += `- **Chapter:** ${item.chapterId}: ${item.chapterName}\n`;
        md += `- **Required Level:** \`${p.level || 'L1'}\`\n`;
        md += `- **Risk Severity:** **${riskDisp}**\n`;
        if (details?.effortLevel) {
          md += `- **Estimated Implementation Effort:** ${details.effortLevel}\n`;
        }
        if (details?.recommendedTools && details.recommendedTools.length > 0) {
          md += `- **Recommended Tools / Libraries:** ${details.recommendedTools.join(', ')}\n`;
        }
        md += `\n`;

        md += `#### Diagnosis & Root Cause of Non-Conformity\n`;
        md += `> [!WARNING]\n`;
        md += `> **Root Cause:** ${p.comoFallo || p.remediation || 'Missing technical implementation evidence or insufficient safeguard configuration.'}\n`;
        if (p.textoEvidencia && p.textoEvidencia !== 'N/A') {
          md += `>\n> *Detected Evidence (${p.fuenteEvidencia || 'Documentation/Code'}):* "${p.textoEvidencia}"\n`;
        }
        md += `\n`;

        if (details?.strategy) {
          md += `#### Defense-in-Depth Strategy\n`;
          md += `${details.strategy}\n\n`;
        }

        md += `#### Actionable Engineering Checklist\n`;
        if (details?.actionableSteps && details.actionableSteps.length > 0) {
          details.actionableSteps.forEach(step => {
            md += `- [ ] ${step}\n`;
          });
        } else {
          md += `- [ ] Apply recommended mitigation: ${p.remediation}\n`;
          md += `- [ ] Validate and record evidence in pre-production environment.\n`;
        }
        md += `\n`;

        if (details?.codeOrConfigExample) {
          md += `#### Reference Code / Technical Configuration Snippet\n`;
          md += `\`\`\`${detectLanguage(details.codeOrConfigExample)}\n${details.codeOrConfigExample}\n\`\`\`\n\n`;
        }

        if (details?.verificationRecipe) {
          md += `#### Acceptance Criteria & QA Verification Test\n`;
          md += `\`\`\`bash\n${details.verificationRecipe}\n\`\`\`\n\n`;
        }

        md += `---\n\n`;
      });
    }

    md += `## 3. Roles & Responsibilities Matrix (RACI) for Remediation\n\n`;
    md += `| Role | Responsibility in Remediation Plan |\n`;
    md += `| :--- | :--- |\n`;
    md += `| **Responsible (R)** | Software Engineer / ML Ops / DevSecOps (Implements fixes and code patches) |\n`;
    md += `| **Accountable (A)** | Technical Lead (${audit.technicalLead}) & CISO (Approve technical closure of non-conformity) |\n`;
    md += `| **Consulted (C)** | Cloud Architect / AI Security Specialist (Provides hardening guidelines) |\n`;
    md += `| **Informed (I)** | Product Owner / Compliance (Monitors mitigation progress) |\n\n`;

    md += `## 4. Vulnerability Sign-off & Closure Log\n\n`;
    md += `| Phase | Responsible | Signature | Date |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    md += `| **1. Remediation Implemented** | Developer / DevSecOps | _________________________ | ____/____/________ |\n`;
    md += `| **2. QA Tests Verified** | QA Engineer / Pentester | _________________________ | ____/____/________ |\n`;
    md += `| **3. Final Closure & Compliance** | Technical Lead / CISO | _________________________ | ____/____/________ |\n`;

    return md;
  }

  let md = `# AegisAI • Plan de Acción y Remediación Técnica de Seguridad IA\n\n`;
  md += `> **Normativa de Referencia:** ${standardLabel}  \n`;
  md += `> **Plataforma Tecnológica:** **${audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' : audit.techPlatform || 'SaaS Gestionado')}** (${audit.deploymentType || 'SaaS'})  \n`;
  md += `> **Nivel de Verificación Auditado:** **${levelLabel}** ${audit.targetLevel === 'AUTO' ? '(Auto-detectado por IA)' : '(Configurado por Usuario)'}  \n`;
  if (audit.levelAssessmentRationale) {
    md += `> **Justificación de Criticidad:** ${audit.levelAssessmentRationale}  \n`;
  }
  md += `> **Sistema Auditado:** ${audit.systemName}  \n`;
  md += `> **Líder Técnico Responsable:** ${audit.technicalLead} (${audit.email})  \n`;
  md += `> **ID de Auditoría:** \`${audit.id}\`  \n`;
  md += `> **Fecha de Evaluación:** ${format(new Date(audit.date), 'yyyy-MM-dd HH:mm')}  \n`;
  md += `> **Puntuación de Cumplimiento (Nivel ${levelLabel}):** **${audit.overallScore.toFixed(1)}%**  \n`;
  md += `> **Total de Controles a Corregir:** **${actionItems.length}** (${criticalCount} Alta/Crítica, ${mediumCount} Media, ${lowCount} Baja)\n\n`;

  md += `---\n\n`;
  md += `## 1. Resumen Ejecutivo del Estado de Seguridad\n\n`;
  md += `${audit.executiveSummary || 'Auditoría de cumplimiento y verificación de controles de seguridad en sistemas de Inteligencia Artificial.'}\n\n`;

  md += `### Matriz de Priorización de Remediación\n\n`;
  md += `| Prioridad | ID Control | Control / Cláusula | Nivel | Alcance | Riesgo | Esfuerzo Estimado | Estado |\n`;
  md += `| :---: | :---: | :--- | :---: | :---: | :---: | :---: | :---: |\n`;
  
  if (actionItems.length === 0) {
    md += `| 🟢 N/A | \`N/A\` | Todos los controles evaluados se encuentran Aprobados | - | Conforme | Bajo | 0 días | [x] Conforme |\n`;
  } else {
    actionItems.forEach(item => {
      const p = item.punto;
      const prioLabel = item.priorityWeight === 1 ? '🔴 ALTA' : item.priorityWeight === 2 ? '🟡 MEDIA' : '🟢 BAJA';
      const effort = p.remediationDetails?.effortLevel || '1-3 días';
      const scopeLabel = p.isMandatoryForTargetLevel ? `**MANDATORIO (Nivel ${levelLabel})**` : 'Recomendación Superior';
      md += `| ${prioLabel} | \`${p.id}\` | ${p.name} | ${p.level || 'L1'} | ${scopeLabel} | **${p.riskImpact}** | ${effort} | [ ] Pendiente |\n`;
    });
  }

  md += `\n---\n\n`;
  md += `## 2. Checklist Técnico Detallado de Implementación\n\n`;

  if (actionItems.length === 0) {
    md += `> [!NOTE]\n> ¡Felicitaciones! No se detectaron no conformidades que requieran remediación en este sistema. La arquitectura evaluada cumple satisfactoriamente con los controles requeridos.\n\n`;
  } else {
    actionItems.forEach((item, index) => {
      const p = item.punto;
      const details = p.remediationDetails;
      const prioBadge = item.priorityWeight === 1 ? '[PRIORIDAD CRÍTICA / ALTA]' : item.priorityWeight === 2 ? '[PRIORIDAD MEDIA]' : '[PRIORIDAD MENOR]';

      md += `### ${index + 1}. ${prioBadge} ${p.id} - ${p.name}\n\n`;
      md += `- **Capítulo:** ${item.chapterId}: ${item.chapterName}\n`;
      md += `- **Nivel Requerido:** \`${p.level || 'L1'}\`\n`;
      md += `- **Severidad de Riesgo:** **${p.riskImpact}**\n`;
      if (details?.effortLevel) {
        md += `- **Esfuerzo de Implementación Estimado:** ${details.effortLevel}\n`;
      }
      if (details?.recommendedTools && details.recommendedTools.length > 0) {
        md += `- **Herramientas / Librerías Recomendadas:** ${details.recommendedTools.join(', ')}\n`;
      }
      md += `\n`;

      md += `#### Diagnóstico y Causa Raíz de la No Conformidad\n`;
      md += `> [!WARNING]\n`;
      md += `> **Causa Raíz:** ${p.comoFallo || p.remediation || 'Falta evidencia técnica de implementación o configuración deficiente de salvaguardas.'}\n`;
      if (p.textoEvidencia && p.textoEvidencia !== 'N/A') {
        md += `>\n> *Evidencia Detectada (${p.fuenteEvidencia || 'Documentación/Código'}):* "${p.textoEvidencia}"\n`;
      }
      md += `\n`;

      if (details?.strategy) {
        md += `#### Estrategia de Defensa en Profundidad\n`;
        md += `${details.strategy}\n\n`;
      }

      md += `#### Checklist de Acciones Concretas (Tareas para Ingeniería)\n`;
      if (details?.actionableSteps && details.actionableSteps.length > 0) {
        details.actionableSteps.forEach(step => {
          md += `- [ ] ${step}\n`;
        });
      } else {
        md += `- [ ] Aplicar la mitigación recomendada: ${p.remediation}\n`;
        md += `- [ ] Validar y registrar evidencia en entorno de pre-producción.\n`;
      }
      md += `\n`;

      if (details?.codeOrConfigExample) {
        md += `#### Fragmento de Código / Configuración Técnica de Referencia\n`;
        md += `\`\`\`${detectLanguage(details.codeOrConfigExample)}\n${details.codeOrConfigExample}\n\`\`\`\n\n`;
      }

      if (details?.verificationRecipe) {
        md += `#### Criterio de Aceptación y Prueba de Verificación QA\n`;
        md += `\`\`\`bash\n${details.verificationRecipe}\n\`\`\`\n\n`;
      }

      md += `---\n\n`;
    });
  }

  md += `## 3. Matriz de Roles y Responsabilidades (RACI) para Remediación\n\n`;
  md += `| Rol | Responsabilidad en el Plan de Remediación |\n`;
  md += `| :--- | :--- |\n`;
  md += `| **Responsible (R)** | Ingeniero de Software / ML Ops / DevSecOps (Implementa las correcciones y parches de código) |\n`;
  md += `| **Accountable (A)** | Líder Técnico (${audit.technicalLead}) y CISO (Aprueban el cierre técnico de la no conformidad) |\n`;
  md += `| **Consulted (C)** | Arquitecto Cloud / Especialista de Seguridad en IA (Brinda lineamientos de hardening) |\n`;
  md += `| **Informed (I)** | Dueño del Producto / Compliance (Monitorea el avance de mitigación) |\n\n`;

  md += `## 4. Registro de Aprobación y Cierre de Vulnerabilidades\n\n`;
  md += `| Fase | Responsable | Firma | Fecha |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  md += `| **1. Remediación Implementada** | Desarrollador / DevSecOps | _________________________ | ____/____/________ |\n`;
  md += `| **2. Pruebas QA Verificadas** | Ingeniero de QA / Pentester | _________________________ | ____/____/________ |\n`;
  md += `| **3. Cierre y Conformidad Final** | Líder Técnico / CISO | _________________________ | ____/____/________ |\n`;

  return md;
}

export async function generateActionPlanPDF(audit: AuditReport, lang: string = 'es'): Promise<void> {
  const isEn = lang !== 'es';
  const { default: jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = (autoTableModule as any).default || autoTableModule;
  const doc = new jsPDF();
  const actionItems = extractActionItems(audit);
  const isCustom = audit.standard === 'CUSTOM';
  const isFull = audit.standard === 'FULL';
  const isISO = audit.standard === 'ISO-42001';
  const standardLabel = isCustom
    ? (audit.customFrameworkName || (isEn ? 'Custom Regulatory Framework' : 'Marco Regulatorio Personalizado'))
    : (isFull ? 'OWASP AI-SVS 1.0 & ISO/IEC 42001:2023' : (isISO ? 'ISO/IEC 42001:2023' : 'OWASP AI-SVS 1.0'));

  // Header Banner
  doc.setFillColor(15, 23, 42); // Dark Slate navy
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'AEGIS AI • TECHNICAL ACTION & REMEDIATION PLAN' : 'AEGIS AI • PLAN DE ACCIÓN Y REMEDIACIÓN TÉCNICA', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`AegisAI Assurance Platform | ${isEn ? 'Standard' : 'Normativa'}: ${standardLabel}`, 14, 23);

  // Metadata Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 38, 182, 44, 2, 2, 'FD');

  const levelLabel = audit.assessedLevel || audit.targetLevel || 'L1';
  const platformLabel = audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' : audit.techPlatform || (isEn ? 'Managed SaaS' : 'SaaS Gestionado'));

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Audited System:' : 'Sistema Auditado:', 18, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`${audit.systemName}`, 56, 44);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Platform / Type:' : 'Plataforma / Tipo:', 18, 51);
  doc.setFont('helvetica', 'normal');
  doc.text(`${platformLabel} (${audit.deploymentType || 'SaaS'})`, 56, 51);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Technical Lead:' : 'Líder Técnico:', 18, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(`${audit.technicalLead} (${audit.email})`, 56, 58);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Level / Tier:' : 'Nivel / Clasificación:', 18, 65);
  doc.setFont('helvetica', 'normal');
  doc.text(`${isEn ? 'Level' : 'Nivel'} ${levelLabel} ${audit.targetLevel === 'AUTO' ? (isEn ? '(Auto-detected by AI)' : '(Auto-detectado por IA)') : (isEn ? '(Selected)' : '(Seleccionado)')}`, 56, 65);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Date / ID:' : 'Fecha / ID:', 18, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(`${format(new Date(audit.date), 'yyyy-MM-dd HH:mm')} | ${audit.id}`, 56, 72);

  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? 'Score / Gap:' : 'Calificación / Brecha:', 18, 79);
  doc.setFont('helvetica', 'normal');
  const criticalCount = actionItems.filter(i => i.priorityWeight === 1).length;
  doc.text(
    isEn
      ? `${audit.overallScore.toFixed(1)}% Compliance (Level ${levelLabel}) | ${actionItems.length} Findings (${criticalCount} Critical/High)`
      : `${audit.overallScore.toFixed(1)}% Cumplimiento (Nivel ${levelLabel}) | ${actionItems.length} Hallazgos (${criticalCount} Críticos/Altos)`,
    56,
    79
  );

  let currentY = 90;

  // Table of Action Items Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(isEn ? '1. Prioritized Remediation Matrix' : '1. Matriz Priorizada de Remediación', 14, currentY);
  currentY += 4;

  const tableBody = actionItems.map((item, idx) => {
    const p = item.punto;
    const prio = isEn
      ? (item.priorityWeight === 1 ? 'HIGH/CRITICAL' : item.priorityWeight === 2 ? 'MEDIUM' : 'LOW')
      : (item.priorityWeight === 1 ? 'ALTA/CRÍTICA' : item.priorityWeight === 2 ? 'MEDIA' : 'BAJA');
    const effort = p.remediationDetails?.effortLevel || (isEn ? '1-3 days' : '1-3 días');
    const scopeTag = p.isMandatoryForTargetLevel
      ? (isEn ? `[Mandatory L${p.level || levelLabel}]` : `[Mandatorio L${p.level || levelLabel}]`)
      : `[Recom. L${p.level}]`;
    const riskDisp = isEn
      ? (p.riskImpact === 'Alto' ? 'High' : p.riskImpact === 'Medio' ? 'Medium' : p.riskImpact === 'Bajo' ? 'Low' : p.riskImpact)
      : p.riskImpact;
    return [
      `${idx + 1}`,
      prio,
      p.id,
      `${p.name}\n${scopeTag}`,
      riskDisp,
      effort,
      isEn ? '[ ] Pending' : '[ ] Pendiente'
    ];
  });

  if (tableBody.length === 0) {
    tableBody.push(
      isEn
        ? ['-', 'COMPLIANT', 'N/A', 'All audited controls are passed', 'Low', '0 days', '[x] Passed']
        : ['-', 'CONFORME', 'N/A', 'Todos los controles auditados están aprobados', 'Bajo', '0 días', '[x] Aprobado']
    );
  }

  autoTable(doc, {
    startY: currentY,
    head: [isEn ? ['#', 'Priority', 'ID', 'Control & Level', 'Risk', 'Effort', 'Status'] : ['#', 'Prioridad', 'ID', 'Control & Nivel', 'Riesgo', 'Esfuerzo', 'Estado']],
    body: tableBody,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 26 },
      2: { cellWidth: 20 },
      3: { cellWidth: 64 },
      4: { cellWidth: 18 },
      5: { cellWidth: 26 },
      6: { cellWidth: 20 }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 12;

  // Section 2: Detailed Remediation Cards
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? '2. Remediation Cards & Mitigation Engineering' : '2. Fichas de Remediación e Ingeniería de Mitigación', 14, currentY);
  currentY += 6;

  actionItems.forEach((item, idx) => {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    const p = item.punto;
    const details = p.remediationDetails;
    const prio = isEn
      ? (item.priorityWeight === 1 ? 'HIGH / CRITICAL' : item.priorityWeight === 2 ? 'MEDIUM' : 'LOW')
      : (item.priorityWeight === 1 ? 'ALTA / CRÍTICA' : item.priorityWeight === 2 ? 'MEDIA' : 'BAJA');

    const cardRows: any[] = [];

    // Diagnostic
    cardRows.push([
      isEn ? 'Diagnosis / Root Cause:' : 'Diagnóstico / Causa Raíz:',
      `${p.comoFallo || p.remediation || (isEn ? 'Missing technical evidence or insufficient configuration.' : 'Falta evidencia técnica o configuración deficiente.')}\n${isEn ? 'Detected evidence' : 'Evidencia detectada'} (${p.fuenteEvidencia || (isEn ? 'Code/Doc' : 'Código/Doc')}): "${p.textoEvidencia || 'N/A'}"`
    ]);

    // Strategy
    if (details?.strategy) {
      cardRows.push([isEn ? 'Defense Strategy:' : 'Estrategia de Defensa:', details.strategy]);
    }

    // Actionable Steps
    if (details?.actionableSteps && details.actionableSteps.length > 0) {
      const stepsText = details.actionableSteps.map((s, sIdx) => `${sIdx + 1}. [ ] ${s}`).join('\n');
      cardRows.push([isEn ? 'Implementation Steps:' : 'Pasos de Implementación:', stepsText]);
    } else {
      cardRows.push([isEn ? 'Implementation Steps:' : 'Pasos de Implementación:', `1. [ ] ${p.remediation}\n2. [ ] ${isEn ? 'Validate in test environment.' : 'Validar en entorno de pruebas.'}`]);
    }

    // Tools & Verification
    if (details?.recommendedTools && details.recommendedTools.length > 0) {
      cardRows.push([isEn ? 'Recommended Tools:' : 'Herramientas Recomendadas:', details.recommendedTools.join(', ')]);
    }
    if (details?.verificationRecipe) {
      cardRows.push([isEn ? 'QA Verification Test:' : 'Prueba de Verificación QA:', details.verificationRecipe]);
    }

    // Code snippet
    if (details?.codeOrConfigExample) {
      cardRows.push([isEn ? 'Suggested Code / Config:' : 'Código / Configuración Sugerida:', details.codeOrConfigExample]);
    }

    autoTable(doc, {
      startY: currentY,
      head: [[`#${idx + 1} - [${prio}] ${p.id}: ${p.name} (${isEn ? 'Level' : 'Nivel'} ${p.level || 'L1'} | ${isEn ? 'Effort' : 'Esfuerzo'}: ${details?.effortLevel || (isEn ? 'Medium' : 'Medio')})`, '']],
      body: cardRows,
      theme: 'plain',
      styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: {
        fillColor: item.priorityWeight === 1 ? [185, 28, 28] : [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8.5
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold' },
        1: { cellWidth: 140 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  });

  // Section 3: Signatures & Sign-off Table
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(isEn ? '3. Vulnerability Approval & Closure Log' : '3. Registro de Aprobación y Cierre de Vulnerabilidades', 14, currentY);
  currentY += 4;

  autoTable(doc, {
    startY: currentY,
    head: [isEn ? ['Role / Phase', 'Name & Title', 'Compliance Signature', 'Date'] : ['Rol / Fase', 'Nombre y Cargo', 'Firma de Conformidad', 'Fecha']],
    body: isEn
      ? [
          ['1. Remediation Implemented', 'Responsible Engineer / DevSecOps', '_________________________', '____/____/________'],
          ['2. QA Tests Verified', 'Quality Engineer / QA Tester', '_________________________', '____/____/________'],
          ['3. Final Approval & Closure', `${audit.technicalLead} (Technical Lead / CISO)`, '_________________________', '____/____/________']
        ]
      : [
          ['1. Remediación Implementada', 'Ingeniero Responsable / DevSecOps', '_________________________', '____/____/________'],
          ['2. Pruebas QA Verificadas', 'Ingeniero de Calidad / QA Tester', '_________________________', '____/____/________'],
          ['3. Aprobación y Cierre Final', `${audit.technicalLead} (Líder Técnico / CISO)`, '_________________________', '____/____/________']
        ],
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3.5 },
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] }
  });

  const cleanName = audit.systemName.replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${isEn ? 'Action_Remediation_Plan' : 'Plan_Accion_Remediacion'}_${cleanName}_${audit.id}.pdf`);
}
