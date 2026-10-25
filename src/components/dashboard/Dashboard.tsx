import React, { useMemo, useState } from 'react';
import { AuditReport } from '@/src/types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  FileText, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  PieChart as PieChartIcon, 
  ShieldCheck, 
  Award, 
  Layers, 
  Info,
  SlidersHorizontal,
  Check,
  X,
  Lock,
  Scale
} from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { DivisionHeader } from '../layout/BrandAssets';

interface DashboardProps {
  audits: AuditReport[];
  onNewAudit: () => void;
  onViewAudit: (id: string) => void;
  onDeleteAudit: (id: string) => void;
  onSeedAudits?: () => Promise<void> | void;
  isSeeding?: boolean;
}

// Chapter metadata mapping for human-friendly tooltips
const CHAPTER_INFO: Record<string, { title: string; desc: string }> = {
  // OWASP AI-SVS Chapters
  'C1': { title: 'Inyección de Prompts y Validaciones', desc: 'Validación de entradas, sanitización y prevención de jailbreaks directos e indirectos.' },
  'C2': { title: 'Manejo y Sanitización de Salidas', desc: 'Tratamiento de respuestas del LLM como no confiables para prevenir XSS y ejecuciones maliciosas.' },
  'C3': { title: 'Protección de Datos y Privacidad', desc: 'Enmascaramiento de PII, retención de datos confidenciales y cumplimiento de normativas de privacidad.' },
  'C4': { title: 'Seguridad en Cadena de Suministro', desc: 'Verificación de procedencia de pesos de modelos, dependencias y librerías de terceros.' },
  'C5': { title: 'Control de Acceso y Autenticación', desc: 'Políticas de menor privilegio, API keys seguras y control RBAC en endpoints de IA.' },
  'C6': { title: 'Infraestructura y Aislamiento', desc: 'Sandboxing de ejecución de código, segmentación de redes y contención de contenedores.' },
  'C7': { title: 'Seguridad en Datos y RAG', desc: 'Prevención de envenenamiento en bases vectoriales, sanitización de corpus y embeddings.' },
  'C8': { title: 'Prevención de Denegación de Servicio', desc: 'Rate limiting, timeouts en inferencia y límites de tamaño en ventanas de contexto.' },
  'C9': { title: 'Auditoría, Logging y Monitoreo', desc: 'Trazabilidad de prompts y respuestas, detección de anomalías y retención de logs de seguridad.' },
  'C10': { title: 'Mitigación de Alucinaciones', desc: 'Grounding estricto, verificación de fuentes y umbrales de confianza del modelo.' },
  'C11': { title: 'Gobernanza y Gestión de Riesgos', desc: 'Evaluaciones de impacto algorítmico, comités de ética y documentación de riesgos.' },
  'C12': { title: 'Red Teaming y Resiliencia', desc: 'Pruebas de estrés adversario, simulación de ataques y validación continua.' },

  // ISO/IEC 42001 Chapters / Clauses
  'A.2': { title: 'Políticas relacionadas a IA', desc: 'Establecimiento de directrices organizacionales para el ciclo de vida y uso ético de la IA.' },
  'A.3': { title: 'Organización Interna y Roles', desc: 'Asignación formal de responsabilidades, roles de gobernanza y rendición de cuentas (RACI).' },
  'A.4': { title: 'Recursos para Sistemas de IA', desc: 'Disponibilidad de infraestructura, herramientas de validación y talento técnico capacitado.' },
  'A.5': { title: 'Evaluación de Impacto de IA', desc: 'Análisis de impacto ético, legal, social y de seguridad en individuos y procesos de negocio.' },
  'A.6': { title: 'Ciclo de Vida del Sistema de IA', desc: 'Control de diseño, desarrollo, pruebas, despliegue, operación y retiro de sistemas de IA.' },
  'A.7': { title: 'Datos para Sistemas de IA', desc: 'Calidad, procedencia, etiquetado y gobernanza de datos de entrenamiento y evaluación.' },
  'A.8': { title: 'Información y Transparencia', desc: 'Explicabilidad, divulgación a usuarios y documentación técnica para partes interesadas.' },
  'A.9': { title: 'Uso y Supervisión Humana', desc: 'Mecanismos de Human-in-the-loop, monitoreo operacional y control de decisiones automatizadas.' },
  'A.10': { title: 'Relaciones con Terceros y Proveedores', desc: 'Gestión de riesgos en proveedores de modelos base, APIs y servicios externos de IA.' },
  'Clause 4': { title: 'Contexto de la Organización', desc: 'Comprensión de necesidades de partes interesadas y alcance del sistema de gestión de IA.' },
  'Clause 5': { title: 'Liderazgo y Compromiso', desc: 'Compromiso de la alta dirección con la gobernanza de IA y asignación de autoridad.' },
  'Clause 6': { title: 'Planificación y Riesgos de IA', desc: 'Objetivos de IA y acciones planificadas para abordar riesgos y oportunidades.' },
  'Clause 7': { title: 'Soporte y Competencias', desc: 'Recursos, toma de conciencia, comunicación e información documentada del SGIA.' },
  'Clause 8': { title: 'Operación del SGIA', desc: 'Planificación, control operacional y ejecución de evaluaciones de impacto de IA.' },
  'Clause 9': { title: 'Evaluación del Desempeño', desc: 'Seguimiento, medición, auditoría interna y revisión por la dirección del SGIA.' },
  'Clause 10': { title: 'Mejora Continua', desc: 'Acciones correctivas ante no conformidades y optimización continua de la gobernanza de IA.' },
};

export function Dashboard({ audits, onNewAudit, onViewAudit, onDeleteAudit, onSeedAudits, isSeeding }: DashboardProps) {
  const [filter, setFilter] = useState<'All' | 'High' | 'Low'>('All');
  const [standardView, setStandardView] = useState<'ALL' | 'AISVS' | 'ISO42001' | 'DUAL' | 'CUSTOM'>('ALL');
  const [search, setSearch] = useState('');

  // Filter audits for the system list
  const filteredAudits = useMemo(() => {
    return audits.filter(a => {
      const hasAISVS = a.standard === 'AI-SVS' || a.standard === 'FULL' || a.standards?.includes('AI-SVS') || a.standards?.includes('OWASP-AISVS');
      const hasISO = a.standard === 'ISO-42001' || a.standard === 'FULL' || a.standards?.includes('ISO-42001');
      const hasCustom = a.standard === 'CUSTOM' || a.standards?.some(s => s.startsWith('MX-') || s === 'EU-AI-ACT' || s.startsWith('CUSTOM') || s.startsWith('fw-'));

      if (standardView === 'AISVS' && !hasAISVS) return false;
      if (standardView === 'ISO42001' && !hasISO) return false;
      if (standardView === 'CUSTOM' && !hasCustom) return false;
      if (standardView === 'DUAL' && !(hasAISVS && hasISO)) return false;
      if (filter === 'High' && a.overallScore < 80) return false;
      if (filter === 'Low' && a.overallScore >= 80) return false;
      if (search && !a.systemName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [audits, standardView, filter, search]);

  // Helper function to calculate metrics for a specific subset of audits and standard filter
  const computeMetrics = (targetStandard: 'ALL' | 'AISVS' | 'ISO42001' | 'CUSTOM') => {
    const relevantAudits = audits.filter(a => {
      if (targetStandard === 'AISVS') return a.standard === 'AI-SVS' || a.standard === 'FULL' || a.standards?.includes('AI-SVS') || a.standards?.includes('OWASP-AISVS') || !a.standard;
      if (targetStandard === 'ISO42001') return a.standard === 'ISO-42001' || a.standard === 'FULL' || a.standards?.includes('ISO-42001');
      if (targetStandard === 'CUSTOM') return a.standard === 'CUSTOM' || a.standards?.some(s => s.startsWith('MX-') || s === 'EU-AI-ACT' || s.startsWith('CUSTOM') || s.startsWith('fw-'));
      return true;
    });

    const approvedSystems: Array<{ id: string; name: string; score: number }> = [];
    const reviewSystems: Array<{ id: string; name: string; score: number }> = [];

    const failuresMap: Record<string, { count: number; systems: Set<string> }> = {};
    const passesMap: Record<string, { count: number; systems: Set<string> }> = {};

    relevantAudits.forEach(audit => {
      if (audit.overallScore >= 80) {
        approvedSystems.push({ id: audit.id, name: audit.systemName, score: audit.overallScore });
      } else {
        reviewSystems.push({ id: audit.id, name: audit.systemName, score: audit.overallScore });
      }

      audit.chapters.forEach(chapter => {
        // Filter chapters based on standard if strictly requested
        const sId = chapter.standardId;
        const isAISVSChapter = sId ? (sId === 'OWASP-AISVS' || sId === 'AI-SVS') : (chapter.chapterId.startsWith('C') || chapter.chapterName?.includes('AISVS'));
        const isISOChapter = sId ? (sId === 'ISO-42001') : (chapter.chapterId.startsWith('A.') || chapter.chapterId.startsWith('Clause') || chapter.chapterName?.includes('ISO'));
        const isCustomChapter = sId ? (sId.startsWith('MX-') || sId === 'EU-AI-ACT' || sId.startsWith('CUSTOM') || sId.startsWith('fw-')) : (chapter.chapterId.startsWith('FW-') || chapter.chapterId.startsWith('MX-'));

        if (targetStandard === 'AISVS' && !isAISVSChapter) return;
        if (targetStandard === 'ISO42001' && !isISOChapter) return;
        if (targetStandard === 'CUSTOM' && !isCustomChapter) return;

        chapter.puntosProbados.forEach(punto => {
          if (punto.status === 'Aprobado') {
            if (!passesMap[chapter.chapterId]) passesMap[chapter.chapterId] = { count: 0, systems: new Set() };
            passesMap[chapter.chapterId].count++;
            passesMap[chapter.chapterId].systems.add(audit.systemName);
          } else {
            if (!failuresMap[chapter.chapterId]) failuresMap[chapter.chapterId] = { count: 0, systems: new Set() };
            failuresMap[chapter.chapterId].count++;
            failuresMap[chapter.chapterId].systems.add(audit.systemName);
          }
        });
      });
    });

    const inconformities = Object.keys(failuresMap).map(k => {
      const info = CHAPTER_INFO[k] || { title: k, desc: '' };
      return {
        chapter: k,
        title: info.title,
        description: info.desc,
        count: failuresMap[k].count,
        systems: Array.from(failuresMap[k].systems)
      };
    }).sort((a, b) => b.count - a.count).slice(0, 8);

    const conformities = Object.keys(passesMap).map(k => {
      const info = CHAPTER_INFO[k] || { title: k, desc: '' };
      return {
        chapter: k,
        title: info.title,
        description: info.desc,
        count: passesMap[k].count,
        systems: Array.from(passesMap[k].systems)
      };
    }).sort((a, b) => b.count - a.count).slice(0, 8);

    const total = approvedSystems.length + reviewSystems.length;
    const approvalRatePercent = total > 0 ? ((approvedSystems.length / total) * 100).toFixed(0) : '0';

    const overallStatus = [
      { 
        name: 'Cumple (≥80%)', 
        value: approvedSystems.length, 
        color: '#1E8E3E', 
        systems: approvedSystems,
        percent: total > 0 ? ((approvedSystems.length / total) * 100).toFixed(1) : '0'
      },
      { 
        name: 'Revisión Req. (<80%)', 
        value: reviewSystems.length, 
        color: '#F9AB00', 
        systems: reviewSystems,
        percent: total > 0 ? ((reviewSystems.length / total) * 100).toFixed(1) : '0'
      }
    ];

    return { 
      totalAudits: relevantAudits.length, 
      approvedCount: approvedSystems.length, 
      reviewCount: reviewSystems.length, 
      approvalRatePercent,
      inconformities, 
      conformities, 
      overallStatus 
    };
  };

  const aisvsMetrics = useMemo(() => computeMetrics('AISVS'), [audits]);
  const isoMetrics = useMemo(() => computeMetrics('ISO42001'), [audits]);
  const customMetrics = useMemo(() => computeMetrics('CUSTOM'), [audits]);
  const globalMetrics = useMemo(() => computeMetrics('ALL'), [audits]);

  // Counts for tabs
  const aisvsCount = audits.filter(a => a.standard === 'AI-SVS' || a.standard === 'FULL' || a.standards?.includes('AI-SVS') || a.standards?.includes('OWASP-AISVS') || !a.standard).length;
  const isoCount = audits.filter(a => a.standard === 'ISO-42001' || a.standard === 'FULL' || a.standards?.includes('ISO-42001')).length;
  const customCount = audits.filter(a => a.standard === 'CUSTOM' || a.standards?.some(s => s.startsWith('MX-') || s === 'EU-AI-ACT' || s.startsWith('CUSTOM') || s.startsWith('fw-'))).length;

  // Custom Tooltip for Approval Rate (PieChart)
  const ApprovalRatePieTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const isApproved = data.name.includes('Cumple');

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/90 text-xs max-w-sm z-50 pointer-events-none font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            {isApproved ? <CheckCircle size={16} className="text-emerald-600" /> : <AlertTriangle size={16} className="text-amber-500" />}
            <span>{data.name}</span>
          </div>
          <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs border ${isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80' : 'bg-amber-50 text-amber-700 border-amber-200/80'}`}>
            {data.value} {data.value === 1 ? 'sistema' : 'sistemas'} ({data.percent}%)
          </span>
        </div>

        <p className="text-slate-600 mb-2 font-medium">
          {isApproved 
            ? 'Sistemas auditados que alcanzaron la calificación de cumplimiento (≥ 80%):' 
            : 'Sistemas que requieren remediación de vulnerabilidades o falta de evidencia (< 80%):'}
        </p>

        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {data.systems.length === 0 ? (
            <div className="text-slate-400 italic py-1">No hay sistemas en esta categoría.</div>
          ) : (
            data.systems.map((sys: any) => (
              <div key={sys.id} className="flex justify-between items-center bg-slate-50 border border-slate-200/70 px-2.5 py-1.5 rounded-xl">
                <div className="flex items-center gap-2 truncate mr-2">
                  {isApproved ? <Check size={12} className="text-emerald-600 shrink-0" /> : <X size={12} className="text-amber-600 shrink-0" />}
                  <span className="font-semibold text-slate-800 truncate">{sys.name}</span>
                </div>
                <span className={`font-bold shrink-0 text-[11px] px-2 py-0.5 rounded-full border ${sys.score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {Math.round(sys.score)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Custom Tooltip for Inconformities / Conformities Bar Charts
  const FindingsBarTooltip = ({ active, payload, isConformity }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200/90 text-xs max-w-md z-50 pointer-events-none font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-50 text-[#1A73E8] border border-blue-200/80 rounded-lg text-xs font-bold font-mono">
              {data.chapter}
            </span>
            <span className="text-sm font-bold text-slate-900 truncate max-w-[220px]">
              {data.title || data.chapter}
            </span>
          </div>
          <span className={`font-bold px-2.5 py-0.5 rounded-full text-xs border ${isConformity ? 'bg-blue-50 text-[#1A73E8] border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            {data.count} {isConformity ? 'aprobados' : 'fallos'}
          </span>
        </div>

        <div className="mb-2">
          <p className="text-slate-600 leading-relaxed font-medium">
            {isConformity
              ? 'Puntos de control validados satisfactoriamente con evidencia técnica verificable.'
              : 'Puntos de control no cumplidos o con falta de evidencia técnica documentada.'}
          </p>
          {data.description && (
            <div className="mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800">Objetivo del capítulo: </span>
              {data.description}
            </div>
          )}
        </div>

        {data.systems && data.systems.length > 0 && (
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <span>Sistemas con hallazgos en este capítulo:</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {data.systems.map((sysName: string, idx: number) => (
                <span key={idx} className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                  {sysName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render a 3-Card Metrics Section for a Standard
  const renderStandardMetricsSection = (
    title: string,
    subtitle: string,
    badgeText: string,
    badgeVariant: 'default' | 'secondary' | 'outline' | 'success',
    metrics: ReturnType<typeof computeMetrics>,
    accentColor: string,
    standardIcon: React.ReactNode
  ) => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 text-[#1A73E8] shadow-2xs">
              {standardIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-sans">{title}</h2>
                <Badge variant={badgeVariant} className="text-xs font-semibold rounded-full">
                  {badgeText}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-normal font-sans">{subtitle} • {metrics.totalAudits} sistemas evaluados</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/90 text-xs font-medium font-sans shadow-2xs">
            <span className="text-slate-500">Tasa de Aprobación Global:</span>
            <span className={`font-bold text-sm ${Number(metrics.approvalRatePercent) >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {metrics.approvalRatePercent}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Tasa de Aprobación */}
          <Card className="flex flex-col border border-slate-200/90 rounded-2xl shadow-2xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 bg-slate-50/70 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2 text-slate-800 font-bold">
                  <PieChartIcon size={15} className="text-[#1A73E8]" /> Tasa de Aprobación ({badgeText})
                </CardTitle>
                <div className="group relative cursor-pointer" title="Coloca el cursor sobre la gráfica para ver los sistemas aprobados y no aprobados">
                  <Info size={14} className="text-slate-400 hover:text-slate-700" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-4 relative bg-white">
              {metrics.totalAudits === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 text-xs italic font-sans">
                  <PieChartIcon size={32} className="mb-2 opacity-40 text-slate-400" />
                  No hay auditorías registradas para esta norma
                </div>
              ) : (
                <>
                  <div className="h-[180px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={metrics.overallStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {metrics.overallStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip content={<ApprovalRatePieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Centered Percentage Badge */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-extrabold text-slate-900 font-sans">{metrics.approvalRatePercent}%</span>
                      <span className="text-[9.5px] text-slate-400 font-semibold uppercase tracking-wider font-sans">Conformidad</span>
                    </div>
                  </div>
                  
                  {/* Legend below with hover assistance */}
                  <div className="flex justify-center gap-5 mt-2 text-xs border-t border-slate-100 pt-2 w-full font-sans">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                      <span className="text-slate-500 font-medium text-[11px]">Cumple (≥80%):</span>
                      <span className="font-bold text-slate-800 text-[11px]">{metrics.approvedCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-slate-500 font-medium text-[11px]">Revisión (&lt;80%):</span>
                      <span className="font-bold text-slate-800 text-[11px]">{metrics.reviewCount}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Top Inconformidades (Fallos) */}
          <Card className="flex flex-col border border-slate-200/90 rounded-2xl shadow-2xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 bg-amber-50/50 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2 text-amber-900 font-bold">
                  <AlertTriangle size={15} className="text-amber-600" /> Inconformidades (Fallos {badgeText})
                </CardTitle>
                <div className="group relative cursor-pointer" title="Coloca el cursor sobre cada barra para ver los detalles del capítulo y los sistemas afectados">
                  <Info size={14} className="text-amber-700/70 hover:text-amber-900" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4 bg-white">
              {metrics.inconformities.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-emerald-700 text-xs font-semibold font-sans">
                  <CheckCircle size={32} className="mb-2 opacity-80 text-emerald-600" />
                  Sin inconformidades registradas
                </div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.inconformities} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="chapter" tick={{ fontSize: 10, fontFamily: 'Google Sans', fontWeight: 600, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'Google Sans', fill: '#64748B' }} allowDecimals={false} />
                      <Tooltip content={<FindingsBarTooltip isConformity={false} />} cursor={{ fill: '#FEF3C750' }} />
                      <Bar dataKey="count" fill="#E2E8F0" radius={[4, 4, 0, 0]}>
                        {metrics.inconformities.map((entry, index) => (
                          <Cell key={`inconf-${index}`} fill={index === 0 ? '#F59E0B' : '#E2E8F0'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Top Conformidades (Aprobados) */}
          <Card className="flex flex-col border border-slate-200/90 rounded-2xl shadow-2xs bg-white">
            <CardHeader className="border-b border-slate-100 pb-3 bg-blue-50/50 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2 text-blue-900 font-bold">
                  <CheckCircle size={15} className="text-[#1A73E8]" /> Conformidades (Aprobados {badgeText})
                </CardTitle>
                <div className="group relative cursor-pointer" title="Coloca el cursor sobre cada barra para ver los controles aprobados y sistemas conformes">
                  <Info size={14} className="text-[#1A73E8]/70 hover:text-blue-900" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-4 bg-white">
              {metrics.conformities.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-slate-400 text-xs italic font-sans">
                  <CheckCircle size={32} className="mb-2 opacity-40 text-slate-400" />
                  Sin conformidades registradas aún
                </div>
              ) : (
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.conformities} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="chapter" tick={{ fontSize: 10, fontFamily: 'Google Sans', fontWeight: 600, fill: '#475569' }} />
                      <YAxis tick={{ fontSize: 10, fontFamily: 'Google Sans', fill: '#64748B' }} allowDecimals={false} />
                      <Tooltip content={<FindingsBarTooltip isConformity={true} />} cursor={{ fill: '#EFF6FF80' }} />
                      <Bar dataKey="count" fill="#DBEAFE" radius={[4, 4, 0, 0]}>
                        {metrics.conformities.map((entry, index) => (
                          <Cell key={`conf-${index}`} fill={index === 0 ? '#1A73E8' : '#DBEAFE'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 flex-1 overflow-y-auto bg-white font-sans max-w-7xl mx-auto w-full">
      {/* Top Header con firma institucional oficial */}
      <DivisionHeader 
        title="Dashboard de Seguridad y Gobernanza de IA"
        subtitle="Monitoreo de cumplimiento continuo según OWASP AI-SVS v1.0, ISO/IEC 42001, LFPDPPP y LFPC"
        actions={
          <div className="flex items-center gap-2.5">
            {onSeedAudits && (
              <Button 
                variant="outline" 
                onClick={() => onSeedAudits()} 
                disabled={isSeeding}
                className="cursor-pointer font-bold px-3.5 py-2 text-xs border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all rounded-xl shadow-2xs"
                title="Cargar 5 auditorías de ejemplo completas en aegis-ai-db"
              >
                {isSeeding ? 'Cargando...' : '⚡ Cargar 5 Auditorías'}
              </Button>
            )}
            <Button variant="accent" onClick={onNewAudit} className="cursor-pointer font-bold px-4 py-2 rounded-xl shadow-xs">
              + Nueva Auditoría
            </Button>
          </div>
        }
      />

      {/* Banner de Declaración de Principios */}
      <div className="mb-6 p-4.5 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 border border-slate-200/90 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="text-sm font-normal text-slate-800 leading-relaxed">
          Garantizar la <span className="mark-blue">seguridad técnica</span> y la <span className="mark-blue">gobernanza auditable</span> de los modelos y agentes de Inteligencia Artificial en toda la organización.
        </div>
        <div className="text-[11px] text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Google Cloud AI Governance & Architecture · AegisAI
        </div>
      </div>

      {/* Selector de Normas y Marcos (Pills Metálicas Modernas) */}
      <div className="bg-slate-100/90 p-1.5 border border-slate-200/90 rounded-2xl flex flex-wrap items-center gap-1.5 mb-6 shadow-2xs">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider px-3 py-1 flex items-center gap-1.5">
          <SlidersHorizontal size={14} className="text-[#1A73E8]" /> Norma:
        </span>

        <button
          onClick={() => setStandardView('ALL')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            standardView === 'ALL'
              ? 'bg-white text-[#1A73E8] border border-slate-200/90 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
          }`}
        >
          <Layers size={13} />
          <span>Vista Global Consolidada</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${standardView === 'ALL' ? 'bg-blue-50 text-[#1A73E8] border border-blue-200/80 font-bold' : 'bg-slate-200/80 text-slate-600'}`}>
            {audits.length}
          </span>
        </button>

        <button
          onClick={() => setStandardView('AISVS')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            standardView === 'AISVS'
              ? 'bg-white text-[#1A73E8] border border-slate-200/90 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
          }`}
        >
          <ShieldCheck size={13} />
          <span>OWASP AI-SVS</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${standardView === 'AISVS' ? 'bg-blue-50 text-[#1A73E8] border border-blue-200/80 font-bold' : 'bg-slate-200/80 text-slate-600'}`}>
            {aisvsCount}
          </span>
          <span className="text-[11px] font-bold">({aisvsMetrics.approvalRatePercent}%)</span>
        </button>

        <button
          onClick={() => setStandardView('ISO42001')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            standardView === 'ISO42001'
              ? 'bg-white text-[#1A73E8] border border-slate-200/90 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
          }`}
        >
          <Award size={13} />
          <span>ISO/IEC 42001</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${standardView === 'ISO42001' ? 'bg-blue-50 text-[#1A73E8] border border-blue-200/80 font-bold' : 'bg-slate-200/80 text-slate-600'}`}>
            {isoCount}
          </span>
          <span className="text-[11px] font-bold">({isoMetrics.approvalRatePercent}%)</span>
        </button>

        <button
          onClick={() => setStandardView('CUSTOM')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer ${
            standardView === 'CUSTOM'
              ? 'bg-white text-[#1A73E8] border border-slate-200/90 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
          }`}
        >
          <Scale size={13} />
          <span>Leyes y Políticas (BYOF)</span>
          <span className={`px-2 py-0.5 text-[10px] font-mono rounded-full ${standardView === 'CUSTOM' ? 'bg-blue-50 text-[#1A73E8] border border-blue-200/80 font-bold' : 'bg-slate-200/80 text-slate-600'}`}>
            {customCount}
          </span>
          {customCount > 0 && <span className="text-[11px] font-bold">({customMetrics.approvalRatePercent}%)</span>}
        </button>

        <button
          onClick={() => setStandardView('DUAL')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 ml-auto cursor-pointer ${
            standardView === 'DUAL'
              ? 'bg-slate-900 text-white border border-slate-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
          }`}
        >
          <Layers size={13} />
          <span>Comparativa Dual</span>
        </button>
      </div>

      {/* DASHBOARDS DISPLAY BASED ON SELECTED VIEW */}
      {standardView === 'ALL' && (
        renderStandardMetricsSection(
          "Métricas Globales de Cumplimiento",
          "Consolidado de todas las evaluaciones técnicas y de gestión",
          "Global Consolidado",
          "default",
          globalMetrics,
          "#1B5FA6",
          <Layers size={18} />
        )
      )}

      {standardView === 'AISVS' && (
        renderStandardMetricsSection(
          "Dashboard de Seguridad Técnica de IA",
          "Verificación contra OWASP AI Security Verification Standard (AISVS) v1.0",
          "OWASP AI-SVS v1.0",
          "default",
          aisvsMetrics,
          "#1B5FA6",
          <ShieldCheck size={18} />
        )
      )}

      {standardView === 'ISO42001' && (
        renderStandardMetricsSection(
          "Dashboard de Gestión y Gobernanza de IA",
          "Sistema de Gestión de Inteligencia Artificial según ISO/IEC 42001:2023",
          "ISO/IEC 42001:2023",
          "secondary",
          isoMetrics,
          "#1B5FA6",
          <Award size={18} />
        )
      )}

      {standardView === 'CUSTOM' && (
        renderStandardMetricsSection(
          "Dashboard de Leyes y Políticas (BYOF)",
          "Cumplimiento y verificación técnica de regulaciones y marcos normativos personalizados",
          "Leyes y Políticas (BYOF)",
          "secondary",
          customMetrics,
          "#1B5FA6",
          <Scale size={18} />
        )
      )}

      {standardView === 'DUAL' && (
        <div className="space-y-8">
          <div className="p-5 bg-[#FAFAFA] border-[1.5px] border-[#1A1A1A]">
            {renderStandardMetricsSection(
              "Dashboard OWASP AI-SVS v1.0 (Seguridad Técnica)",
              "Tasa de aprobación y análisis de controles técnicos de seguridad",
              "OWASP AI-SVS v1.0",
              "default",
              aisvsMetrics,
              "#1B5FA6",
              <ShieldCheck size={18} />
            )}
          </div>

          <div className="p-6 bg-slate-50/70 border border-slate-200/90 rounded-2xl shadow-2xs">
            {renderStandardMetricsSection(
              "Dashboard ISO/IEC 42001:2023 (Gobernanza y SGIA)",
              "Tasa de aprobación y análisis de cláusulas y anexos organizacionales",
              "ISO/IEC 42001:2023",
              "secondary",
              isoMetrics,
              "#1A73E8",
              <Award size={18} />
            )}
          </div>
        </div>
      )}

      {/* SYSTEMS LIST SECTION */}
      <div className="mt-10 pt-6 border-t border-slate-200/90">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Sistemas Evaluados ({filteredAudits.length})</h3>
            <p className="text-xs text-slate-500 font-normal">Haz clic en cualquier sistema para ver el reporte técnico detallado, matriz RACI y plan de remediación</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Buscar por nombre de sistema..."
              className="flex-1 sm:w-64 border border-slate-200/90 bg-slate-50/80 px-3.5 py-1.5 text-xs text-slate-900 rounded-xl placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/30 focus-visible:border-[#1A73E8] focus:bg-white transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="flex border border-slate-200/90 bg-slate-100/80 p-0.5 rounded-xl gap-0.5 text-xs shadow-2xs">
              <button 
                className={`px-3 py-1 font-semibold rounded-lg transition-all duration-150 cursor-pointer ${filter === 'All' ? 'bg-white text-[#1A73E8] shadow-2xs border border-slate-200/80' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setFilter('All')}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 font-semibold rounded-lg transition-all duration-150 cursor-pointer ${filter === 'High' ? 'bg-emerald-50 text-emerald-700 shadow-2xs border border-emerald-200/80' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setFilter('High')}
              >
                ≥ 80%
              </button>
              <button 
                className={`px-3 py-1 font-semibold rounded-lg transition-all duration-150 cursor-pointer ${filter === 'Low' ? 'bg-amber-50 text-amber-700 shadow-2xs border border-amber-200/80' : 'text-slate-600 hover:text-slate-900'}`}
                onClick={() => setFilter('Low')}
              >
                &lt; 80%
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {filteredAudits.map(audit => (
            <div 
              key={audit.id} 
              className="card-metallic rounded-2xl p-4.5 flex items-center justify-between transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer group" 
              onClick={() => onViewAudit(audit.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-base font-sans shrink-0 shadow-2xs ${
                  audit.overallScore >= 80 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/90' 
                    : 'bg-amber-50 text-amber-700 border-amber-200/90'
                }`}>
                  {Math.round(audit.overallScore)}%
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1A73E8] transition-colors">{audit.systemName}</h4>
                    <Badge variant={audit.overallScore >= 80 ? 'default' : 'warning'} className="text-[10.5px] rounded-full">
                      {audit.overallScore >= 80 ? 'Cumple' : 'Revisión Requerida'}
                    </Badge>
                    {audit.standard === 'MULTI' || (audit.standards && audit.standards.length > 1) ? (
                      <span className="text-[10.5px] bg-blue-50 text-[#1A73E8] border border-blue-200/80 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                        <Layers size={11} className="text-[#1A73E8]" />
                        Multi-Normativa ({audit.standards?.length || audit.standardsBreakdown?.length || 2} Normas)
                      </span>
                    ) : audit.standard === 'CUSTOM' ? (
                      <span className="text-[10.5px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Scale size={11} />
                        {audit.customFrameworkName || 'Marco Personalizado'}
                      </span>
                    ) : (
                      <Badge variant={audit.standard === 'FULL' ? 'default' : audit.standard === 'ISO-42001' ? 'secondary' : 'outline'} className="text-[10.5px] rounded-full">
                        {audit.standard === 'FULL' ? 'ISO 42001 & AI-SVS' : audit.standard === 'ISO-42001' ? 'ISO/IEC 42001' : 'OWASP AI-SVS'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 font-normal">
                    <span className="font-mono text-[11px] text-slate-600 font-medium">ID: {audit.id}</span>
                    <span>·</span>
                    <span>{format(new Date(audit.date), 'yyyy-MM-dd HH:mm')}</span>
                    <span>·</span>
                    <span>Líder: {audit.technicalLead}</span>
                    {audit.techPlatformName && (
                      <>
                        <span>·</span>
                        <span className="text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded-md text-[10.5px] border border-slate-200/80">
                          {audit.techPlatformName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span 
                  className="hidden sm:flex items-center gap-1 text-[10.5px] font-medium text-slate-600 bg-slate-100 border border-slate-200/90 px-2.5 py-1 rounded-full"
                  title="Registro Inmutable de Auditoría (Cumplimiento OWASP AISVS Invariante 4)"
                >
                  <Lock size={11} className="text-slate-500" />
                  Inmutable
                </span>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}

          {filteredAudits.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50/60 to-white shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center mx-auto mb-4 text-[#1A73E8]">
                <FileText size={28} />
              </div>
              <h4 className="text-base font-bold text-slate-900">No se encontraron sistemas registrados</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                La base de datos <span className="font-mono font-semibold text-slate-700">aegis-ai-db</span> está lista. Puedes iniciar una nueva auditoría desde cero o cargar las 5 auditorías enterprise preparadas para Google Cloud.
              </p>
              {onSeedAudits && (
                <Button
                  variant="accent"
                  onClick={() => onSeedAudits()}
                  disabled={isSeeding}
                  className="cursor-pointer font-bold px-5 py-2.5 rounded-xl shadow-sm text-xs inline-flex items-center gap-2"
                >
                  {isSeeding ? 'Cargando auditorías en aegis-ai-db...' : '⚡ Cargar 5 Auditorías de Ejemplo'}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
