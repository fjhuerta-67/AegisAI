import React from 'react';
import { AuditReport, AISVSChapter, PuntoProbado } from '@/src/types';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check, 
  Code2, 
  Terminal, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldAlert,
  FileDown,
  FileText,
  Cloud,
  Cpu,
  Server,
  Info,
  Eye,
  X,
  RefreshCw,
  Award,
  Scale
} from 'lucide-react';
import { generateActionPlanMarkdown, generateActionPlanPDF, extractActionItems } from '@/src/lib/actionPlanGenerator';
import { downloadRemediatedArchitecture, generateRemediatedArchitectureMarkdown } from '@/src/lib/remediatedArchitectureGenerator';
import { DivisionLoopLogo } from '@/src/components/layout/BrandAssets';

interface AuditReportViewProps {
  audit: AuditReport;
  onUpdate?: (audit: AuditReport) => void;
  onBack: () => void;
  onReauditWithRemediation?: (remediatedText: string, audit: AuditReport) => void;
}

export function AuditReportView({ audit: initialAudit, onUpdate, onBack, onReauditWithRemediation }: AuditReportViewProps) {
  const [audit, setAudit] = React.useState<AuditReport>(initialAudit);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [exportingActionPdf, setExportingActionPdf] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<Record<string, boolean>>({});
  const [expandedHardening, setExpandedHardening] = React.useState<Record<string, boolean>>({});
  const [showRemediationModal, setShowRemediationModal] = React.useState(false);
  const [copiedRemediation, setCopiedRemediation] = React.useState(false);
  
  // Action Items for Specific Remediation Plan
  const actionItems = React.useMemo(() => extractActionItems(audit), [audit]);
  const criticalCount = React.useMemo(() => actionItems.filter(i => i.priorityWeight === 1).length, [actionItems]);
  const mediumCount = React.useMemo(() => actionItems.filter(i => i.priorityWeight === 2).length, [actionItems]);
  const lowCount = React.useMemo(() => actionItems.filter(i => i.priorityWeight === 3).length, [actionItems]);
  
  // Keep local state in sync if parent changes the audit
  React.useEffect(() => {
    setAudit(initialAudit);
  }, [initialAudit]);
  
  const [selectedStandardFilter, setSelectedStandardFilter] = React.useState<string>('ALL');
  const [activeChapterId, setActiveChapterId] = React.useState<string>(audit.chapters[0]?.chapterId || '');

  // Derived or stored standards breakdown
  const standardsList = React.useMemo(() => {
    if (audit.standardsBreakdown && audit.standardsBreakdown.length > 0) {
      return audit.standardsBreakdown;
    }
    // Fallback: derive from chapters if available
    const map = new Map<string, { standardId: string; standardName: string; score: number; totalControls: number; passedControls: number; failedControls: number }>();
    (audit.chapters || []).forEach(ch => {
      const sId = ch.standardId || (ch.chapterId.startsWith('ISO') || ch.chapterId.startsWith('A.') || ch.chapterId.startsWith('Clause') ? 'ISO-42001' : 'OWASP-AISVS');
      const sName = ch.standardName || (sId === 'ISO-42001' ? 'ISO/IEC 42001' : 'OWASP AI-SVS 1.0');
      if (!map.has(sId)) {
        map.set(sId, { standardId: sId, standardName: sName, score: 0, totalControls: 0, passedControls: 0, failedControls: 0 });
      }
      const entry = map.get(sId)!;
      ch.puntosProbados.forEach(p => {
        entry.totalControls++;
        if (p.status === 'Aprobado') entry.passedControls++;
        else entry.failedControls++;
      });
    });
    for (const entry of map.values()) {
      entry.score = entry.totalControls > 0 ? (entry.passedControls / entry.totalControls) * 100 : 0;
    }
    return Array.from(map.values());
  }, [audit]);

  const filteredChapters = React.useMemo(() => {
    if (selectedStandardFilter === 'ALL') return audit.chapters || [];
    return (audit.chapters || []).filter(ch => {
      const sId = ch.standardId || (ch.chapterId.startsWith('ISO') || ch.chapterId.startsWith('A.') || ch.chapterId.startsWith('Clause') ? 'ISO-42001' : 'OWASP-AISVS');
      return sId === selectedStandardFilter;
    });
  }, [audit.chapters, selectedStandardFilter]);

  const activeChapter = React.useMemo(() => {
    return audit.chapters.find(c => c.chapterId === activeChapterId) || filteredChapters[0] || audit.chapters[0];
  }, [audit.chapters, activeChapterId, filteredChapters]);

  const [filterScope, setFilterScope] = React.useState<'ALL' | 'MANDATORY' | 'RECOMMENDED' | 'INHERITED'>('ALL');

  const filteredPuntos = React.useMemo(() => {
    if (!activeChapter?.puntosProbados) return [];
    if (filterScope === 'MANDATORY') {
      return activeChapter.puntosProbados.filter(p => p.isMandatoryForTargetLevel);
    }
    if (filterScope === 'RECOMMENDED') {
      return activeChapter.puntosProbados.filter(p => !p.isMandatoryForTargetLevel);
    }
    if (filterScope === 'INHERITED') {
      return activeChapter.puntosProbados.filter(p => p.isInheritedFromPlatform);
    }
    return activeChapter.puntosProbados;
  }, [activeChapter, filterScope]);

  const chapterMandatoryCount = React.useMemo(() => {
    return activeChapter?.puntosProbados.filter(p => p.isMandatoryForTargetLevel).length || 0;
  }, [activeChapter]);

  const chapterRecommendedCount = React.useMemo(() => {
    return activeChapter?.puntosProbados.filter(p => !p.isMandatoryForTargetLevel).length || 0;
  }, [activeChapter]);

  const chapterInheritedCount = React.useMemo(() => {
    return activeChapter?.puntosProbados.filter(p => p.isInheritedFromPlatform).length || 0;
  }, [activeChapter]);

  const totalInheritedCount = React.useMemo(() => {
    let count = 0;
    (audit.chapters || []).forEach(ch => {
      (ch.puntosProbados || []).forEach(p => {
        if (p.isInheritedFromPlatform) count++;
      });
    });
    return count;
  }, [audit]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const toggleHardening = (puntoId: string) => {
    setExpandedHardening(prev => ({
      ...prev,
      [puntoId]: !prev[puntoId]
    }));
  };

  const handleDownloadActionPlanMarkdown = () => {
    const md = generateActionPlanMarkdown(audit);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanName = audit.systemName.replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `Plan_Accion_Remediacion_${cleanName}_${audit.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRemediatedMarkdown = () => {
    downloadRemediatedArchitecture(audit, 'md');
  };

  const handleDownloadRemediatedTxt = () => {
    downloadRemediatedArchitecture(audit, 'txt');
  };

  const handleCopyRemediatedText = () => {
    const text = generateRemediatedArchitectureMarkdown(audit);
    navigator.clipboard.writeText(text);
    setCopiedRemediation(true);
    setTimeout(() => setCopiedRemediation(false), 2500);
  };

  const handleReauditClick = () => {
    const text = generateRemediatedArchitectureMarkdown(audit);
    if (onReauditWithRemediation) {
      onReauditWithRemediation(text, audit);
    }
  };

  const handleExportActionPlanPDF = async () => {
    try {
      setExportingActionPdf(true);
      await generateActionPlanPDF(audit);
    } catch (err) {
      console.error("Error al exportar Plan de Acción PDF:", err);
      alert("Ocurrió un error al generar el Plan de Acción PDF.");
    } finally {
      setExportingActionPdf(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      setExportingPdf(true);
      const { default: jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = (autoTableModule as any).default || autoTableModule;
      const doc = new jsPDF();
      const isCustom = audit.standard === 'CUSTOM';
      const isISO = audit.standard === 'ISO-42001';
      const isFull = audit.standard === 'FULL';
      const isMulti = audit.standard === 'MULTI' || (audit.standards && audit.standards.length > 1) || standardsList.length > 1;
      const standardTitle = isMulti
        ? `MULTI-NORMATIVA 360° (${standardsList.map(s => s.standardName).join(' + ') || `${audit.standards?.length || 2} Normas`})`
        : isCustom
        ? (audit.customFrameworkName || 'Marco Personalizado')
        : (isFull ? 'COMPLETA (ISO 42001 & AISVS)' : (isISO ? 'ISO/IEC 42001' : 'OWASP AISVS 1.0'));
      
      // Header
      doc.setFontSize(18);
      doc.text(`REPORTE DE AUDITORÍA AEGIS AI`, 14, 18);
      doc.setFontSize(11);
      doc.text(`Marco(s): ${standardTitle}`, 14, 25);
      doc.text(`Sistema: ${audit.systemName}`, 14, 32);
      doc.text(`ID Auditoría: ${audit.id}`, 14, 39);
      doc.text(`Fecha: ${format(new Date(audit.date), 'yyyy-MM-dd HH:mm')}`, 14, 46);
      const levelLabel = audit.assessedLevel || audit.targetLevel || 'L1';
      const platformLabel = audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' : audit.techPlatform || 'SaaS');
      doc.text(`Plataforma Tecnológica: ${platformLabel} (${audit.deploymentType || 'SaaS'})`, 14, 53);
      doc.text(`Nivel de Verificación: ${levelLabel} ${audit.targetLevel === 'AUTO' ? '(Auto-detectado por IA)' : '(Seleccionado por usuario)'}`, 14, 60);
      doc.text(`Calificación Global de Cumplimiento: ${audit.overallScore.toFixed(1)}%`, 14, 67);
      
      let yPos = 76;

      // Multi-standard summary table
      if (standardsList.length > 1) {
        doc.setFontSize(12);
        doc.text("Desglose de Cumplimiento por Marco Normativo (Compliance 360°):", 14, yPos);
        yPos += 5;

        const breakdownData = standardsList.map(s => [
          s.standardName,
          `${s.score.toFixed(1)}%`,
          `${s.passedControls} / ${s.totalControls}`,
          `${s.failedControls}`,
          s.score >= 80 ? 'CUMPLE' : 'REVISIÓN REQUERIDA'
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [['Marco Normativo', 'Calificación', 'Aprobados / Total', 'Fallidos', 'Diagnóstico']],
          body: breakdownData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2.5 },
          headStyles: { fillColor: [30, 58, 138] }
        });

        yPos = (doc as any).lastAutoTable.finalY + 12;
      }
      
      audit.chapters.forEach(ch => {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFontSize(12);
        const stTag = ch.standardName ? `[${ch.standardName}] ` : '';
        doc.text(`${stTag}${ch.chapterId}: ${ch.chapterName}`, 14, yPos);
        yPos += 7;
        
        const bodyData = ch.puntosProbados.map(p => {
          let mitigationText = p.remediation || '';
          if (p.remediationDetails) {
            const { strategy, actionableSteps, verificationRecipe, effortLevel, recommendedTools } = p.remediationDetails;
            mitigationText = `[${effortLevel || 'Plan de Mitigación'}]\nEstrategia: ${strategy}\n\nPasos de Implementación:\n${actionableSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}`;
            if (recommendedTools && recommendedTools.length > 0) {
              mitigationText += `\n\nHerramientas: ${recommendedTools.join(', ')}`;
            }
            if (verificationRecipe) {
              mitigationText += `\n\nPrueba QA / Verificación:\n${verificationRecipe}`;
            }
          }
          const levelTag = p.level ? `[${p.level}${p.isMandatoryForTargetLevel ? ' • Mandatorio' : ' • Recomendación'}] ` : '';
          return [
            `${levelTag}${p.id}`,
            p.name,
            p.status,
            `Fuente: ${p.fuenteEvidencia}\n"${p.textoEvidencia}"\n\nAnálisis:\n${p.status === 'Aprobado' ? p.comoSeAprobo : p.comoFallo}`,
            p.riskImpact,
            mitigationText
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [['ID / Nivel', 'Control', 'Estado', 'Evidencia y Análisis', 'Riesgo', 'Ingeniería de Mitigación']],
          body: bodyData,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 2.5 },
          columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 32 },
            2: { cellWidth: 22 },
            3: { cellWidth: 48 },
            4: { cellWidth: 16 },
            5: { cellWidth: 52 }
          },
          headStyles: { fillColor: [15, 23, 42] }
        });
        
        yPos = (doc as any).lastAutoTable.finalY + 12;
      });

      doc.save(`${audit.id}_AegisAI_Report.pdf`);
    } catch (err) {
      console.error("Error al exportar PDF:", err);
      alert("Ocurrió un error al generar el documento PDF.");
    } finally {
      setExportingPdf(false);
    }
  };

  const toggleRemediation = (chapterId: string) => {
    setAudit(prev => {
      const newChapters = prev.chapters.map(ch => 
        ch.chapterId === chapterId ? { ...ch, remediated: !ch.remediated } : ch
      );
      
      // Calculate new score based on passed and remediated points
      const totalPoints = newChapters.reduce((acc, ch) => acc + ch.puntosProbados.length, 0);
      const passedPoints = newChapters.reduce((acc, ch) => {
        if (ch.remediated) return acc + ch.puntosProbados.length;
        return acc + ch.puntosProbados.filter(p => p.status === 'Aprobado').length;
      }, 0);
      
      const newScore = totalPoints > 0 ? (passedPoints / totalPoints) * 100 : 0;
      
      const newAudit = {
        ...prev,
        chapters: newChapters,
        overallScore: newScore
      };
      
      if (onUpdate) {
        onUpdate(newAudit);
      }
      
      return newAudit;
    });
  };

  const renderEffortBadge = (effort?: string) => {
    if (!effort) return null;
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-none border-[1.5px] border-[#1A1A1A] bg-[#ECECEC] text-[#1A1A1A]">
        <Clock className="w-3 h-3 text-[#1A1A1A]" />
        {effort}
      </span>
    );
  };

  const renderLevelBadge = (level?: 'L1' | 'L2' | 'L3', isMandatory?: boolean) => {
    if (!level) return null;
    const styles = {
      L1: 'bg-[#D9EBF7] text-[#1B5FA6]',
      L2: 'bg-[#FBF3C9] text-[#1A1A1A]',
      L3: 'bg-[#ECECEC] text-[#1A1A1A]'
    }[level] || 'bg-white text-[#1A1A1A]';

    const label = {
      L1: 'L1: Esencial',
      L2: 'L2: Estándar',
      L3: 'L3: Crítico'
    }[level] || level;

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border-[1.5px] border-[#1A1A1A] uppercase tracking-wider ${styles}`}>
          {label}
        </span>
        {isMandatory !== undefined && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-none border-[1.5px] border-[#1A1A1A] ${
            isMandatory
              ? 'bg-[#FBE017] text-[#1A1A1A]'
              : 'bg-[#ECECEC] text-[#1A1A1A]'
          }`}>
            {isMandatory ? 'MANDATORIO' : 'RECOMENDACIÓN SUPERIOR'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white text-[#1A1A1A]">
      {/* Top Editorial Bar */}
      <div className="min-h-[64px] border-b-[1.5px] border-[#1A1A1A] flex flex-wrap items-center justify-between px-6 py-2 shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="text-xs font-bold text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors border-[1.5px] border-[#1A1A1A] rounded-none px-3 py-1.5 flex items-center gap-1"
          >
            &larr; Volver
          </button>
          
          <div className="flex items-center gap-3">
            <DivisionLoopLogo className="h-7 w-auto" />
            <div className="w-[3px] h-6 bg-[#1A1A1A]"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#1A1A1A]">
                  Aegis<span className="text-[#1B5FA6]">AI</span> · Reporte de Auditoría
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-none border border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6]">
                  {audit.standard === 'MULTI' || (audit.standards && audit.standards.length > 1) || standardsList.length > 1
                    ? `MULTI-NORMATIVA (${standardsList.length})`
                    : audit.standard === 'CUSTOM'
                    ? (audit.customFrameworkName || 'BYOF')
                    : audit.standard === 'FULL'
                    ? 'DUAL ISO + AISVS'
                    : audit.standard === 'ISO-42001'
                    ? 'ISO 42001'
                    : 'OWASP AISVS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-1 flex-wrap">
          <div className="border-r-[1.5px] border-[#1A1A1A] pr-4 flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/60">Sistema</span>
            <span className="text-xs font-bold text-[#1A1A1A] truncate max-w-[160px]">{audit.systemName}</span>
          </div>

          <div className="border-r-[1.5px] border-[#1A1A1A] pr-4 flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/60">Plataforma</span>
            <span className="text-xs font-bold text-[#1B5FA6]">
              {audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Gemini Enterprise' : audit.techPlatform || 'SaaS')}
            </span>
          </div>

          <div className="border-r-[1.5px] border-[#1A1A1A] pr-4 flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#1A1A1A]/60">Cumplimiento ({audit.assessedLevel || audit.targetLevel || 'L1'})</span>
            <span className={`text-xs font-extrabold px-1.5 py-0.5 border border-[#1A1A1A] ${audit.overallScore >= 80 ? 'bg-[#D9EBF7] text-[#1B5FA6]' : 'bg-[#FBF3C9] text-[#1A1A1A]'}`}>
              {audit.overallScore.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {actionItems.length > 0 && (
              <button 
                onClick={handleDownloadRemediatedMarkdown}
                title="Descargar archivo con correcciones sugeridas y arquitectura remediada para 100% de cumplimiento"
                className="bg-[#FBE017] hover:bg-[#ebd009] text-[#1A1A1A] font-bold px-3 py-1.5 text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5"
              >
                <Sparkles size={14} className="text-[#1A1A1A]" />
                <span>Correcciones Sugeridas (.md)</span>
              </button>
            )}
            <button 
              onClick={handleDownloadActionPlanMarkdown}
              title="Descargar checklist técnico de remediación en formato Markdown (.md) con tareas [ ] y código"
              className="bg-white hover:bg-[#ECECEC] text-[#1A1A1A] font-bold px-3 py-1.5 text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5"
            >
              <FileDown size={14} className="text-[#1B5FA6]" />
              <span>Plan (MD)</span>
            </button>
            <button 
              onClick={handleExportActionPlanPDF} 
              disabled={exportingActionPdf}
              title="Descargar documento PDF del Plan de Acción y Remediación Técnica"
              className="bg-[#FBF3C9] hover:bg-[#f6ebad] text-[#1A1A1A] font-bold px-3 py-1.5 text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <FileText size={14} className="text-[#1A1A1A]" />
              <span>{exportingActionPdf ? 'Generando...' : 'Plan (PDF)'}</span>
            </button>
            <button 
              onClick={handleExportPDF} 
              disabled={exportingPdf}
              title="Exportar reporte de auditoría completo"
              className="bg-[#1B5FA6] hover:bg-[#164F86] text-white font-bold px-3.5 py-1.5 text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {exportingPdf ? 'Generando...' : 'Reporte Completo PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Chapter List */}
        <div className="w-[300px] border-r-[1.5px] border-[#1A1A1A] h-full flex flex-col bg-white shrink-0">
          <div className="p-3 border-b-[1.5px] border-[#1A1A1A] bg-[#ECECEC]/50 flex items-center justify-between">
            <span className="text-[11px] uppercase font-extrabold tracking-wider text-[#1A1A1A]">
              {standardsList.length > 1
                ? `Capítulos (${filteredChapters.length} de ${audit.chapters.length})`
                : audit.standard === 'CUSTOM'
                ? `${audit.customFrameworkName || 'Marco Personalizado'} (${audit.chapters?.length || 0})`
                : audit.standard === 'FULL'
                ? 'Cláusulas Combinadas'
                : audit.standard === 'ISO-42001'
                ? 'Cláusulas Normativas'
                : 'AISVS 1.0 (12 Capítulos)'}
            </span>
          </div>

          {standardsList.length > 1 && (
            <div className="p-2 border-b-[1.5px] border-[#1A1A1A] bg-white flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => {
                  setSelectedStandardFilter('ALL');
                  setActiveChapterId(audit.chapters[0]?.chapterId || '');
                }}
                className={`px-2 py-1 rounded-none text-[10px] font-bold border-[1.5px] border-[#1A1A1A] transition-all ${
                  selectedStandardFilter === 'ALL'
                    ? 'bg-[#1B5FA6] text-white'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
                }`}
              >
                Todas ({audit.chapters.length})
              </button>
              {standardsList.map(st => {
                const isSelected = selectedStandardFilter === st.standardId;
                const count = (audit.chapters || []).filter(c => (c.standardId || (c.chapterId.startsWith('ISO') || c.chapterId.startsWith('A.') || c.chapterId.startsWith('Clause') ? 'ISO-42001' : 'OWASP-AISVS')) === st.standardId).length;
                const shortLabel = st.standardId === 'OWASP-AISVS' ? 'AISVS' : st.standardId === 'ISO-42001' ? 'ISO' : st.standardId === 'MX-LFPDPPP' ? 'LFPDPPP' : st.standardId === 'MX-LFPC' ? 'LFPC' : st.standardId.replace('CUSTOM-', '');
                return (
                  <button
                    key={st.standardId}
                    type="button"
                    onClick={() => {
                      setSelectedStandardFilter(st.standardId);
                      const firstMatch = (audit.chapters || []).find(c => (c.standardId || (c.chapterId.startsWith('ISO') || c.chapterId.startsWith('A.') || c.chapterId.startsWith('Clause') ? 'ISO-42001' : 'OWASP-AISVS')) === st.standardId);
                      if (firstMatch) setActiveChapterId(firstMatch.chapterId);
                    }}
                    className={`px-2 py-1 rounded-none text-[10px] font-bold border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#D9EBF7] text-[#1B5FA6]'
                        : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
                    }`}
                    title={st.standardName}
                  >
                    <span>{shortLabel}</span>
                    <span className="opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="overflow-y-auto flex-1 divide-y divide-[#1A1A1A]/10">
            {filteredChapters.map((chapter) => {
              const hasFailing = chapter.puntosProbados.some(p => p.status !== 'Aprobado') && !chapter.remediated;
              const isSelected = activeChapter?.chapterId === chapter.chapterId;
              return (
                <div 
                  key={chapter.chapterId}
                  className={`px-4 py-3 text-xs cursor-pointer flex items-center justify-between transition-colors
                    ${isSelected 
                      ? 'bg-[#D9EBF7] font-bold text-[#1B5FA6] border-l-4 border-l-[#1B5FA6]' 
                      : 'hover:bg-[#ECECEC]/40 text-[#1A1A1A]'
                    }
                  `}
                  onClick={() => setActiveChapterId(chapter.chapterId)}
                >
                  <div className="flex flex-col truncate pr-2">
                    <span className="truncate">{chapter.chapterId}: {chapter.chapterName}</span>
                    {chapter.standardName && standardsList.length > 1 && (
                      <span className="text-[9px] text-[#1A1A1A]/60 font-mono truncate">{chapter.standardName}</span>
                    )}
                  </div>
                  <span className={`w-3 h-3 border border-[#1A1A1A] rounded-none shrink-0 ${hasFailing ? 'bg-[#FBE017]' : 'bg-[#1B5FA6]'}`}></span>
                </div>
              );
            })}
          </div>
          <div className="p-3 border-t-[1.5px] border-[#1A1A1A] bg-[#ECECEC]/30">
            <span className="text-[10px] uppercase font-bold tracking-wider block mb-1 text-[#1A1A1A]/60">Motor de Auditoría AI</span>
            <span className="text-[11px] font-mono text-[#1B5FA6] font-bold">
              {(audit as any).modelUsed || 'gemini-3.8-flash'}
            </span>
            <div className="w-full h-2 bg-white border border-[#1A1A1A] rounded-none mt-2 overflow-hidden">
              <div className="h-full bg-[#1B5FA6] transition-all" style={{ width: `${audit.overallScore}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-white">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#1A1A1A]/60">Líder Técnico</span>
              <span className="text-sm font-bold text-[#1A1A1A]">{audit.technicalLead}</span>
              <span className="text-xs text-[#1A1A1A]/70 mt-1">{audit.email}</span>
            </div>
            <div className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#1A1A1A]/60">Resumen Ejecutivo</span>
              <span className="text-xs text-[#1A1A1A] line-clamp-2 leading-relaxed" title={audit.executiveSummary}>{audit.executiveSummary}</span>
            </div>
            <div className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-wider mb-1 text-[#1A1A1A]/60">ID de Auditoría</span>
              <span className="text-xs font-mono font-bold text-[#1A1A1A]">{audit.id}</span>
              <span className="text-xs text-[#1A1A1A]/70 mt-1">Fecha: {format(new Date(audit.date), 'yyyy-MM-dd HH:mm')}</span>
            </div>
          </div>

          {/* Multi-Standard Compliance 360° Scorecard Grid */}
          {standardsList.length > 1 && (
            <div className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#1A1A1A]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 border border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6]">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#1A1A1A] flex items-center gap-2">
                      Evaluación Multi-Normativa: Compliance 360°
                      <span className="text-[10px] font-bold bg-[#ECECEC] text-[#1A1A1A] px-2 py-0.5 rounded-none border border-[#1A1A1A]">
                        {standardsList.length} Marcos Evaluados
                      </span>
                    </h3>
                    <p className="text-xs text-[#1A1A1A]/70">
                      Desglose independiente de conformidad técnica y regulatoria obtenido de forma simultánea.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/60 block">Calificación Global Ponderada</span>
                  <span className={`text-base font-extrabold px-2 py-0.5 border border-[#1A1A1A] ${audit.overallScore >= 80 ? 'bg-[#D9EBF7] text-[#1B5FA6]' : 'bg-[#FBF3C9] text-[#1A1A1A]'}`}>
                    {audit.overallScore.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {standardsList.map(st => {
                  const isPassing = st.score >= 80;
                  const badgeBg = isPassing ? 'bg-[#D9EBF7] text-[#1B5FA6]' : 'bg-[#FBF3C9] text-[#1A1A1A]';

                  return (
                    <div 
                      key={st.standardId}
                      className="border-[1.5px] border-[#1A1A1A] rounded-none p-4 bg-white hover:bg-[#D9EBF7]/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-none bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A]">
                            {st.standardId}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none border border-[#1A1A1A] ${badgeBg}`}>
                            {isPassing ? 'Cumple' : 'Revisión'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-[#1A1A1A] line-clamp-2 min-h-[32px] mb-2" title={st.standardName}>
                          {st.standardName}
                        </h4>
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-2xl font-black text-[#1A1A1A]">
                            {st.score.toFixed(1)}%
                          </span>
                          <span className="text-[11px] text-[#1A1A1A]/70 font-bold">
                            {st.passedControls} de {st.totalControls} aprobados
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-white border border-[#1A1A1A] rounded-none overflow-hidden mb-3">
                          <div 
                            className="h-full bg-[#1B5FA6] transition-all duration-500" 
                            style={{ width: `${Math.max(st.score, 4)}%` }}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStandardFilter(st.standardId);
                          const firstMatch = (audit.chapters || []).find(c => (c.standardId || (c.chapterId.startsWith('ISO') || c.chapterId.startsWith('A.') || c.chapterId.startsWith('Clause') ? 'ISO-42001' : 'OWASP-AISVS')) === st.standardId);
                          if (firstMatch) setActiveChapterId(firstMatch.chapterId);
                        }}
                        className="w-full text-center py-1.5 px-2 text-[11px] font-bold text-[#1A1A1A] bg-white hover:bg-[#ECECEC] rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center justify-center gap-1 mt-1"
                      >
                        <span>Filtrar Capítulos</span>
                        <ChevronDown size={12} className="-rotate-90" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Level Assessment Rationale Callout Banner */}
          {audit.levelAssessmentRationale && (
            <div className="bg-[#D9EBF7] border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex items-start justify-between text-[#1A1A1A]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 border-[1.5px] border-[#1A1A1A] bg-white text-[#1B5FA6] rounded-none flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-[#1A1A1A]">
                      Evaluación de Criticidad y Clasificación de Nivel {audit.targetLevel === 'AUTO' ? '(Auto-detectado por IA)' : '(Configurado por Usuario)'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-white text-[#1B5FA6] border border-[#1A1A1A]">
                      Nivel Efectivo: {audit.assessedLevel || audit.targetLevel || 'L1'}
                    </span>
                    <span className="text-[10px] font-bold text-[#1A1A1A]/70">
                      Taxonomía OWASP AI-SVS / EU AI Act
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A] mt-1 leading-relaxed">
                    {audit.levelAssessmentRationale}
                  </p>
                  <p className="text-[11px] text-[#1B5FA6] mt-1 font-bold">
                    ℹ️ La calificación de cumplimiento ({audit.overallScore.toFixed(1)}%) se calcula exclusivamente sobre los controles mandatorios para el Nivel {audit.assessedLevel || audit.targetLevel || 'L1'}. Los requisitos de niveles superiores evaluados se presentan como recomendaciones técnicas avanzadas sin penalizar la calificación de este nivel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Shared Responsibility & Platform Banner */}
          <div className="bg-[#ECECEC] border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex items-start justify-between text-[#1A1A1A]">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 border-[1.5px] border-[#1A1A1A] bg-white text-[#1A1A1A] rounded-none flex items-center justify-center shrink-0 mt-0.5">
                <Cloud size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-extrabold text-[#1A1A1A]">
                    Modelo de Responsabilidad Compartida: {audit.techPlatformName || (audit.techPlatform === 'gemini-enterprise' ? 'Google Gemini Enterprise' : audit.techPlatform || 'SaaS Gestionado')}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-white text-[#1A1A1A] border border-[#1A1A1A]">
                    Tipo: {audit.deploymentType || 'SaaS'}
                  </span>
                  {totalInheritedCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A]">
                      {totalInheritedCount} Controles Acreditados por Herencia
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A] mt-1 leading-relaxed">
                  Al operar sobre una plataforma gestionada enterprise, las salvaguardas de seguridad de pesos de modelos (OWASP AISVS Cap. 6), seguridad de centros de datos y cómputo confidencial (Cap. 7), y políticas de Zero Data Retention (Cap. 1 / ISO 42001) son provistas y certificadas contractualmente por la plataforma. La calificación refleja esta herencia técnica, enfocando las acciones de mitigación exclusivamente en la capa de aplicación y gobierno del cliente.
                </p>
              </div>
            </div>
          </div>

          {/* Remediation & Suggested Corrections File Card (100% Compliance Package) */}
          {actionItems.length > 0 && (
            <div className="bg-[#FBF3C9] border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#1A1A1A]">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 border-[1.5px] border-[#1A1A1A] bg-[#FBE017] text-[#1A1A1A] shrink-0">
                  <Sparkles size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-extrabold text-[#1A1A1A]">
                      Archivo de Correcciones Sugeridas (100% Cumplimiento)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-white text-[#1A1A1A] border border-[#1A1A1A]">
                      Drop-in Replacement
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A]">
                      {actionItems.length} Brechas Resueltas
                    </span>
                  </div>
                  <p className="text-xs text-[#1A1A1A] mt-1 max-w-2xl leading-relaxed">
                    Hemos preparado un archivo técnico con la arquitectura corregida y las recetas de código requeridas para que tu sistema satisfaga el <strong>100% de los puntos de la auditoría</strong>. Puedes descargarlo directamente, inspeccionarlo o re-auditar el sistema con él.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setShowRemediationModal(true)}
                  className="px-3 py-2 text-xs font-bold rounded-none bg-white border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#ECECEC] transition-all flex items-center gap-1.5"
                  title="Ver contenido del archivo corregido antes de descargarlo"
                >
                  <Eye size={14} className="text-[#1A1A1A]" />
                  <span>Ver Vista Previa</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRemediatedMarkdown}
                  className="px-3.5 py-2 text-xs font-bold rounded-none bg-[#FBE017] hover:bg-[#ebd009] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-1.5"
                  title="Descargar archivo en formato Markdown (.md) con todas las correcciones integradas"
                >
                  <FileDown size={14} />
                  <span>Descargar Archivo (.md)</span>
                </button>
                {onReauditWithRemediation && (
                  <button
                    type="button"
                    onClick={handleReauditClick}
                    className="px-3 py-2 text-xs font-bold rounded-none bg-[#1B5FA6] hover:bg-[#164F86] text-white border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-1.5"
                    title="Cargar la arquitectura corregida en una nueva auditoría para certificar 100% de cumplimiento"
                  >
                    <RefreshCw size={13} />
                    <span>Re-auditar</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Executive Action Plan Callout Banner */}
          {actionItems.length > 0 ? (
            <div className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex items-center justify-between text-[#1A1A1A]">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 border-[1.5px] border-[#1A1A1A] bg-[#FBF3C9] text-[#1A1A1A] flex items-center justify-center shrink-0">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-[#1A1A1A]">
                      Plan Específico de Acción y Remediación
                    </h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-none bg-[#FBF3C9] text-[#1A1A1A] border border-[#1A1A1A]">
                      {actionItems.length} {actionItems.length === 1 ? 'Control a Corregir' : 'Controles a Corregir'}
                    </span>
                    {criticalCount > 0 && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-none bg-[#FBE017] text-[#1A1A1A] border border-[#1A1A1A]">
                        {criticalCount} Alta/Crítica
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
                    Descarga el plan de acción específico con recetas de código, matriz RACI y checklist para que el equipo de desarrollo implemente las mitigaciones.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={handleDownloadActionPlanMarkdown}
                  className="px-3.5 py-2 text-xs font-bold rounded-none bg-white border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#ECECEC] transition-all flex items-center gap-1.5"
                >
                  <FileDown size={14} className="text-[#1B5FA6]" />
                  Descargar Checklist (.md)
                </button>
                <button
                  onClick={handleExportActionPlanPDF}
                  disabled={exportingActionPdf}
                  className="px-3.5 py-2 text-xs font-bold rounded-none bg-[#FBF3C9] hover:bg-[#f6ebad] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FileText size={14} />
                  {exportingActionPdf ? 'Generando...' : 'Descargar Plan (.pdf)'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#D9EBF7] border-[1.5px] border-[#1A1A1A] rounded-none p-3.5 flex items-center justify-between text-xs text-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-[#1B5FA6]" />
                <span className="font-bold">¡Arquitectura Conforme! No se detectaron no conformidades que requieran remediación.</span>
              </div>
              <button
                onClick={handleDownloadActionPlanMarkdown}
                className="px-3 py-1.5 rounded-none bg-white border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] font-bold hover:bg-[#ECECEC] text-xs flex items-center gap-1.5"
              >
                <FileDown size={13} />
                Descargar Resumen (.md)
              </button>
            </div>
          )}

          {/* Chapter Details Container */}
          <div className="flex-1 flex flex-col border-[1.5px] border-[#1A1A1A] rounded-none bg-white min-h-[500px] overflow-hidden">
            <div className="flex border-b-[1.5px] border-[#1A1A1A] bg-[#ECECEC] items-center justify-between px-6 py-3">
              <div className="font-extrabold text-xs text-[#1A1A1A] uppercase tracking-wider">Puntos de Prueba y Verificación AegisAI</div>
              <div className="font-bold text-xs text-[#1A1A1A]/70">Ingeniería de Mitigación 4D</div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-[#1A1A1A]/15">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-[#1A1A1A]">{activeChapter?.chapterId}: {activeChapter?.chapterName}</h2>
                  <p className="text-xs text-[#1A1A1A]/70 mt-1">Evaluación de requisitos de seguridad conforme al estándar oficial OWASP AISVS 1.0</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer border-[1.5px] border-[#1A1A1A] rounded-none px-3 py-1.5 bg-white hover:bg-[#ECECEC] transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded-none border-[1.5px] border-[#1A1A1A] text-[#1B5FA6] focus:ring-0 cursor-pointer"
                      checked={activeChapter?.remediated || false}
                      onChange={() => activeChapter && toggleRemediation(activeChapter.chapterId)}
                    />
                    <span className="text-xs font-bold text-[#1A1A1A]">Marcar Remediado</span>
                  </label>
                  <span className={`text-[10px] px-2.5 py-1 rounded-none border-[1.5px] border-[#1A1A1A] font-bold tracking-wider uppercase ${activeChapter?.remediated || !activeChapter?.puntosProbados.some(p => p.status !== 'Aprobado') ? 'bg-[#D9EBF7] text-[#1B5FA6]' : 'bg-[#FBF3C9] text-[#1A1A1A]'}`}>
                    {activeChapter?.remediated ? 'Remediado' : activeChapter?.puntosProbados.some(p => p.status !== 'Aprobado') ? 'Requiere Mitigación' : 'Cumple'}
                  </span>
                </div>
              </div>

              {/* Filter Tabs for Level Scope */}
              <div className="flex items-center gap-2 mb-6 border-b border-[#1A1A1A]/15 pb-3 flex-wrap">
                <span className="text-xs font-bold text-[#1A1A1A]/70 mr-1">Filtrar por alcance:</span>
                <button
                  type="button"
                  onClick={() => setFilterScope('ALL')}
                  className={`px-3 py-1 text-xs rounded-none font-bold border-[1.5px] border-[#1A1A1A] transition-colors ${
                    filterScope === 'ALL'
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
                  }`}
                >
                  Todos ({activeChapter?.puntosProbados.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterScope('MANDATORY')}
                  className={`px-3 py-1 text-xs rounded-none font-bold border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5 ${
                    filterScope === 'MANDATORY'
                      ? 'bg-[#1B5FA6] text-white'
                      : 'bg-[#D9EBF7] text-[#1B5FA6] hover:bg-[#c2e0f5]'
                  }`}
                >
                  <ShieldCheck size={13} />
                  Mandatorios Nivel {audit.assessedLevel || audit.targetLevel || 'L1'} ({chapterMandatoryCount})
                </button>
                {chapterRecommendedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterScope('RECOMMENDED')}
                    className={`px-3 py-1 text-xs rounded-none font-bold border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5 ${
                      filterScope === 'RECOMMENDED'
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-[#ECECEC] text-[#1A1A1A] hover:bg-[#dedede]'
                    }`}
                  >
                    <Sparkles size={13} />
                    Recomendaciones Superiores ({chapterRecommendedCount})
                  </button>
                )}
                {chapterInheritedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilterScope('INHERITED')}
                    className={`px-3 py-1 text-xs rounded-none font-bold border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5 ${
                      filterScope === 'INHERITED'
                        ? 'bg-[#1B5FA6] text-white'
                        : 'bg-[#D9EBF7] text-[#1B5FA6] hover:bg-[#c2e0f5]'
                    }`}
                  >
                    <Cloud size={13} />
                    Heredados de Plataforma ({chapterInheritedCount})
                  </button>
                )}
              </div>

              {/* Tested Points List */}
              <div className="space-y-6">
                {filteredPuntos.map(punto => {
                  const passed = punto.status === 'Aprobado';
                  const remediation = punto.remediationDetails;
                  
                  return (
                    <div 
                      key={punto.id} 
                      className={`border-[1.5px] border-[#1A1A1A] rounded-none p-5 transition-all bg-white text-[#1A1A1A] ${
                        passed ? 'border-l-8 border-l-[#1B5FA6]' : 
                        punto.status === 'Fallido' ? 'border-l-8 border-l-[#1A1A1A]' : 
                        'border-l-8 border-l-[#FBE017]'
                      }`}
                    >
                      {/* Control Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#ECECEC] border border-[#1A1A1A] px-2 py-0.5 rounded-none">
                            {punto.id}
                          </span>
                          {renderLevelBadge(punto.level, punto.isMandatoryForTargetLevel)}
                          {punto.isInheritedFromPlatform && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-none bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A]">
                              <Cloud size={11} />
                              HEREDADO: {punto.inheritedPlatformName || audit.techPlatformName || 'SaaS'}
                            </span>
                          )}
                          <span className="text-sm font-extrabold text-[#1A1A1A]">{punto.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-none font-bold uppercase tracking-wider flex items-center gap-1 border border-[#1A1A1A] ${
                            passed ? 'bg-[#D9EBF7] text-[#1B5FA6]' :
                            punto.status === 'Fallido' ? 'bg-[#ECECEC] text-[#1A1A1A]' :
                            'bg-[#FBF3C9] text-[#1A1A1A]'
                          }`}>
                            {passed ? <CheckCircle2 className="w-3 h-3 text-[#1B5FA6]" /> : punto.status === 'Fallido' ? <XCircle className="w-3 h-3 text-[#1A1A1A]" /> : <AlertTriangle className="w-3 h-3 text-[#1A1A1A]" />}
                            {punto.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-none border border-[#1A1A1A] bg-[#ECECEC] text-[#1A1A1A]">
                            Riesgo: {punto.riskImpact}
                          </span>
                        </div>
                      </div>

                      {/* Evidence Analysis Section */}
                      {passed ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          <div className="p-3 bg-white border border-[#1A1A1A] rounded-none">
                            <span className="text-[10px] uppercase font-bold tracking-wider block mb-1 text-[#1A1A1A]/70">
                              {punto.isInheritedFromPlatform ? 'Cumplimiento por Herencia' : 'Cómo se aprobó'}
                            </span>
                            <p className="text-xs leading-relaxed text-[#1A1A1A]">{punto.comoSeAprobo}</p>
                          </div>
                          <div className="p-3 rounded-none border border-[#1A1A1A] bg-[#D9EBF7]/40">
                            <span className="text-[10px] uppercase font-bold tracking-wider block mb-1 text-[#1B5FA6]">
                              {punto.isInheritedFromPlatform ? 'Garantía de Plataforma' : 'Evidencia'} (Fuente: {punto.fuenteEvidencia})
                            </span>
                            <p className="text-xs font-mono leading-relaxed break-words text-[#1A1A1A]">"{punto.textoEvidencia}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 p-3.5 bg-white border border-[#1A1A1A] rounded-none space-y-2">
                          <div>
                            <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#1A1A1A] flex items-center gap-1 mb-1">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#1A1A1A]" /> Falla de Auditoría AI / Falta Evidencia
                            </span>
                            <p className="text-xs text-[#1A1A1A] font-medium leading-relaxed">{punto.comoFallo}</p>
                          </div>
                          <div className="pt-2 border-t border-[#1A1A1A]/15">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/70 block mb-0.5">
                              Evidencia Inspeccionada (Fuente: {punto.fuenteEvidencia})
                            </span>
                            <p className="text-xs font-mono text-[#1A1A1A]/80 italic break-words">"{punto.textoEvidencia}"</p>
                          </div>
                        </div>
                      )}

                      {/* Remediation / Hardening Engineering Section */}
                      {remediation ? (
                        <div className="mt-4 rounded-none border-[1.5px] border-[#1A1A1A] bg-white overflow-hidden">
                          {/* Remediation Card Header */}
                          <div className="p-3 border-b-[1.5px] border-[#1A1A1A] flex flex-wrap items-center justify-between gap-2 bg-[#FBF3C9]">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-[#1A1A1A]" />
                              <span className="text-xs font-extrabold text-[#1A1A1A]">
                                {passed ? 'Guía de Hardening y Buenas Prácticas' : 'Plan de Ingeniería de Mitigación (AegisAI Defensivo)'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {renderEffortBadge(remediation.effortLevel)}
                              {remediation.recommendedTools && remediation.recommendedTools.length > 0 && (
                                <div className="flex items-center gap-1 flex-wrap">
                                  {remediation.recommendedTools.map((tool, tIdx) => (
                                    <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#1A1A1A] rounded-none text-[#1A1A1A] font-bold">
                                      {tool}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            {/* Strategy */}
                            <div>
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/60 block mb-1">
                                Estrategia Técnica
                              </span>
                              <p className="text-xs text-[#1A1A1A] leading-relaxed font-medium">
                                {remediation.strategy}
                              </p>
                            </div>

                            {/* Actionable Steps Checklist */}
                            {remediation.actionableSteps && remediation.actionableSteps.length > 0 && (
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/60 block mb-2">
                                  Checklist de Implementación
                                </span>
                                <div className="space-y-1.5">
                                  {remediation.actionableSteps.map((step, sIdx) => {
                                    const stepKey = `${punto.id}-step-${sIdx}`;
                                    const isDone = completedSteps[stepKey] || false;
                                    return (
                                      <label 
                                        key={sIdx} 
                                        onClick={() => toggleStep(stepKey)}
                                        className={`flex items-start gap-2.5 p-2 rounded-none cursor-pointer transition-colors text-xs border border-[#1A1A1A]/20 ${
                                          isDone ? 'bg-[#D9EBF7] text-[#1B5FA6] line-through opacity-80' : 'bg-white hover:bg-[#ECECEC] text-[#1A1A1A]'
                                        }`}
                                      >
                                        <input 
                                          type="checkbox" 
                                          checked={isDone} 
                                          readOnly 
                                          className="mt-0.5 rounded-none border border-[#1A1A1A] text-[#1B5FA6] focus:ring-0 cursor-pointer"
                                        />
                                        <span className="leading-snug">{step}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Concrete Code or Configuration Snippet */}
                            {remediation.codeOrConfigExample && (
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/70 flex items-center gap-1">
                                    <Code2 className="w-3.5 h-3.5 text-[#1B5FA6]" /> Ejemplo Concreto de Código / Configuración
                                  </span>
                                  <button
                                    onClick={() => handleCopy(remediation.codeOrConfigExample!, `${punto.id}-code`)}
                                    className="text-[11px] font-bold text-[#1A1A1A] hover:bg-[#ECECEC] flex items-center gap-1 bg-white border border-[#1A1A1A] px-2 py-0.5 rounded-none transition-colors"
                                    title="Copiar código"
                                  >
                                    {copiedId === `${punto.id}-code` ? (
                                      <>
                                        <Check className="w-3 h-3 text-[#1B5FA6]" />
                                        <span className="text-[#1B5FA6] font-bold">¡Copiado!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-[#1A1A1A]" />
                                        <span>Copiar</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="bg-[#1A1A1A] text-white rounded-none p-3.5 text-xs font-mono overflow-x-auto border border-[#1A1A1A] leading-relaxed">
                                  <pre className="whitespace-pre">{remediation.codeOrConfigExample}</pre>
                                </div>
                              </div>
                            )}

                            {/* QA Test Recipe */}
                            {remediation.verificationRecipe && (
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/70 flex items-center gap-1">
                                    <Terminal className="w-3.5 h-3.5 text-[#1B5FA6]" /> Receta de Validación QA / Pentesting
                                  </span>
                                  <button
                                    onClick={() => handleCopy(remediation.verificationRecipe!, `${punto.id}-recipe`)}
                                    className="text-[11px] font-bold text-[#1A1A1A] hover:bg-[#ECECEC] flex items-center gap-1 bg-white border border-[#1A1A1A] px-2 py-0.5 rounded-none transition-colors"
                                    title="Copiar comando de prueba"
                                  >
                                    {copiedId === `${punto.id}-recipe` ? (
                                      <>
                                        <Check className="w-3 h-3 text-[#1B5FA6]" />
                                        <span className="text-[#1B5FA6] font-bold">¡Copiado!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-[#1A1A1A]" />
                                        <span>Copiar</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <div className="bg-[#1A1A1A] text-[#FBE017] rounded-none p-3.5 text-xs font-mono overflow-x-auto border border-[#1A1A1A] leading-relaxed">
                                  <pre className="whitespace-pre">{remediation.verificationRecipe}</pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : punto.remediation ? (
                        /* Legacy report fallback */
                        <div className="mt-3 p-3 bg-[#FBF3C9] border border-[#1A1A1A] flex flex-col gap-2 rounded-none">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]">Guía de Remediación</span>
                            <span className="text-[10px] px-2 py-0.5 border border-[#1A1A1A] font-bold uppercase rounded-none bg-white text-[#1A1A1A]">
                              Riesgo: {punto.riskImpact}
                            </span>
                          </div>
                          <p className="text-xs text-[#1A1A1A] font-mono leading-relaxed">{punto.remediation}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Previa de Arquitectura Corregida */}
      {showRemediationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-none border-[2px] border-[#1A1A1A] max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b-[1.5px] border-[#1A1A1A] bg-[#ECECEC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-[#1A1A1A] bg-[#FBE017] text-[#1A1A1A]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#1A1A1A] text-base flex items-center gap-2">
                    Especificación de Arquitectura Remediada
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A]">
                      100% Cumplimiento Proyectado
                    </span>
                  </h3>
                  <p className="text-xs text-[#1A1A1A]/70">
                    Archivo generado con todas las correcciones sugeridas y parches de código listos para producción.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRemediationModal(false)}
                className="p-1.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors"
                title="Cerrar ventana"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: Markdown Content */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#1A1A1A] font-mono text-xs text-white leading-relaxed whitespace-pre-wrap">
              {generateRemediatedArchitectureMarkdown(audit)}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t-[1.5px] border-[#1A1A1A] bg-white flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyRemediatedText}
                  className="px-3.5 py-2 text-xs font-bold rounded-none bg-white border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors flex items-center gap-1.5"
                >
                  {copiedRemediation ? (
                    <>
                      <Check size={14} className="text-[#1B5FA6]" />
                      <span className="text-[#1B5FA6] font-bold">¡Copiado al portapapeles!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar Contenido</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRemediatedTxt}
                  className="px-3.5 py-2 text-xs font-bold rounded-none bg-white border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors flex items-center gap-1.5"
                  title="Descargar como texto plano (.txt)"
                >
                  <FileText size={14} />
                  <span>Descargar (.txt)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRemediationModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-none border-[1.5px] border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRemediatedMarkdown}
                  className="px-4 py-2 text-xs font-bold rounded-none bg-[#FBE017] hover:bg-[#ebd009] text-[#1A1A1A] border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-1.5"
                >
                  <FileDown size={14} />
                  <span>Descargar Archivo (.md)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

