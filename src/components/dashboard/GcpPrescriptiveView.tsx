import React from 'react';
import { AuditReport } from '@/src/types';
import {
  generatePrescriptiveBlueprint,
  generatePrescriptiveBlueprintMarkdown,
  generatePrescriptiveBlueprintPDF,
  PrescriptiveLens,
  PrescriptivePillar
} from '@/src/lib/gcpPrescriptiveEngine';
import {
  Cloud,
  Terminal,
  ClipboardCheck,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  FileDown,
  FileText,
  Sparkles,
  ArrowRight,
  Layers,
  ShieldCheck,
  Clock,
  Users,
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/src/lib/i18n';

interface GcpPrescriptiveViewProps {
  audit: AuditReport;
  onOpenRemediationModal?: () => void;
  onSwitchToAuditStep?: () => void;
}

export function GcpPrescriptiveView({
  audit,
  onOpenRemediationModal,
  onSwitchToAuditStep
}: GcpPrescriptiveViewProps) {
  const { lang } = useLanguage();
  const isEs = lang === 'es';

  const blueprint = React.useMemo(
    () => generatePrescriptiveBlueprint(audit, lang),
    [audit, lang]
  );

  const [activeLens, setActiveLens] = React.useState<PrescriptiveLens>('infra');
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [exportingPdf, setExportingPdf] = React.useState(false);
  const [expandedControlsPillar, setExpandedControlsPillar] = React.useState<Record<string, boolean>>({});

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const handleDownloadBlueprintPdf = async () => {
    try {
      setExportingPdf(true);
      await generatePrescriptiveBlueprintPDF(audit, lang);
    } catch (err) {
      console.error('Error generating Prescriptive Blueprint PDF:', err);
    } finally {
      setExportingPdf(false);
    }
  };

  const handleDownloadBlueprintMd = () => {
    const md = generatePrescriptiveBlueprintMarkdown(audit, lang);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (audit.systemName || 'sistema').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `aegis-gcp-prescriptive-blueprint-${safeName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const waveBadgeColor = (wave: 1 | 2 | 3) => {
    if (wave === 1) return 'bg-[#D9EBF7] text-[#1B5FA6] border-[#1A1A1A]';
    if (wave === 2) return 'bg-[#FBF3C9] text-[#1A1A1A] border-[#1A1A1A]';
    return 'bg-[#ECECEC] text-[#1A1A1A] border-[#1A1A1A]';
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F7F7F5] text-[#1A1A1A] p-6 space-y-6">
      {/* Top Executive Hero Banner */}
      <div className="bg-white border-2 border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b-[1.5px] border-[#1A1A1A] pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="inline-flex items-center gap-1.5 bg-[#1B5FA6] text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 border border-[#1A1A1A]">
                <Cloud className="w-3.5 h-3.5" />
                {isEs ? 'PASO 2 POST-AUDITORÍA · PRESCRIPCIÓN GOOGLE CLOUD' : 'POST-AUDIT STEP 2 · GOOGLE CLOUD PRESCRIPTION'}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FBE017] text-[#1A1A1A] text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 border border-[#1A1A1A]">
                <Zap className="w-3.5 h-3.5" />
                {isEs
                  ? `${blueprint.totalFailedControls} Controles Consolidados en ${blueprint.activePillars.length} Frentes GCP`
                  : `${blueprint.totalFailedControls} Findings Consolidated into ${blueprint.activePillars.length} GCP Workstreams`}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1A1A1A]">
              {isEs
                ? 'Plano Prescriptivo Google Cloud y Remediación Técnica'
                : 'Google Cloud Prescriptive Blueprint & Tech Remediation'}
            </h2>
            <p className="text-sm text-[#1A1A1A]/80 mt-1 max-w-4xl">
              {isEs
                ? 'Sin leer las decenas de páginas de la auditoría: aquí tienes exactamente qué debe configurar tu equipo de Infraestructura, qué productos y cuotas pedir a Google Cloud y qué alcance de implementación exigir.'
                : 'Without reading dozens of pages of audit findings: here is exactly what your Infra team needs to configure, which services and quotas to request from Google Cloud, and the implementation scope & acceptance criteria.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadBlueprintPdf}
              disabled={exportingPdf}
              className="bg-[#FBE017] hover:bg-[#ebd009] text-[#1A1A1A] font-extrabold px-3.5 py-2 text-xs border-[1.5px] border-[#1A1A1A] flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-[2px_2px_0px_#1A1A1A]"
            >
              <FileText className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>
                {exportingPdf
                  ? isEs
                    ? 'Generando PDF...'
                    : 'Generating PDF...'
                  : isEs
                  ? 'Descargar Guía Prescriptiva (PDF)'
                  : 'Download Prescriptive Guide (PDF)'}
              </span>
            </button>

            <button
              onClick={() => handleCopy('slack-infra', blueprint.readySlackToInfraTeam)}
              className="bg-white hover:bg-[#ECECEC] text-[#1A1A1A] font-bold px-3 py-2 text-xs border-[1.5px] border-[#1A1A1A] flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'slack-infra' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Terminal className="w-3.5 h-3.5 text-[#1B5FA6]" />}
              <span>{copiedKey === 'slack-infra' ? (isEs ? '¡Copiado!' : 'Copied!') : (isEs ? 'Copiar Brief para Infra' : 'Copy Infra Team Brief')}</span>
            </button>

            <button
              onClick={() => handleCopy('email-gcp', blueprint.readyEmailToGoogleTeam)}
              className="bg-[#D9EBF7] hover:bg-[#c5e0f3] text-[#1A1A1A] font-bold px-3 py-2 text-xs border-[1.5px] border-[#1A1A1A] flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'email-gcp' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Mail className="w-3.5 h-3.5 text-[#1B5FA6]" />}
              <span>{copiedKey === 'email-gcp' ? (isEs ? '¡Copiado!' : 'Copied!') : (isEs ? 'Copiar Solicitud a Google Cloud' : 'Copy Request to Google Cloud')}</span>
            </button>

            <button
              onClick={handleDownloadBlueprintMd}
              className="bg-[#FBF3C9] hover:bg-[#f5e7a6] text-[#1A1A1A] font-bold px-3 py-2 text-xs border-[1.5px] border-[#1A1A1A] flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isEs ? 'Blueprint (.MD)' : 'Blueprint (.MD)'}</span>
            </button>

            {onOpenRemediationModal && (
              <button
                onClick={onOpenRemediationModal}
                className="bg-[#1B5FA6] hover:bg-[#154b85] text-white font-bold px-3.5 py-2 text-xs border-[1.5px] border-[#1A1A1A] flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isEs ? 'Auto-Remediar Documentos y Re-Auditar' : 'Auto-Remediate Docs & Re-Audit'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Key KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="border-[1.5px] border-[#1A1A1A] p-3.5 bg-[#F7F7F5]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
              {isEs ? '1. Consolidación de Hallazgos' : '1. Finding Deduplication'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1A1A1A]">{blueprint.totalFailedControls}</span>
              <ArrowRight className="w-4 h-4 text-[#1B5FA6]" />
              <span className="text-2xl font-extrabold text-[#1B5FA6]">
                {blueprint.activePillars.length} {isEs ? 'Frentes GCP' : 'GCP Pillars'}
              </span>
            </div>
            <div className="text-[11px] text-[#1A1A1A]/70 mt-1">
              {isEs
                ? 'Bloques arquitectónicos concretos en lugar de controles aislados'
                : 'Concrete architectural workstreams instead of isolated controls'}
            </div>
          </div>

          <div className="border-[1.5px] border-[#1A1A1A] p-3.5 bg-[#D9EBF7]/50">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
              {isEs ? '2. Salto de Cumplimiento Proyectado' : '2. Projected Compliance Lift'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1A1A1A]">{blueprint.currentScore.toFixed(1)}%</span>
              <ArrowRight className="w-4 h-4 text-[#1B5FA6]" />
              <span className="text-2xl font-extrabold text-emerald-700">~{blueprint.projectedScore.toFixed(1)}%</span>
            </div>
            <div className="text-[11px] text-[#1A1A1A]/70 mt-1">
              {isEs
                ? 'Al implementar los servicios prescritos de Google Cloud'
                : 'Upon deploying the prescribed Google Cloud services'}
            </div>
          </div>

          <div className="border-[1.5px] border-[#1A1A1A] p-3.5 bg-[#FBF3C9]/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
              {isEs ? '3. Quick Wins Inmediatos (Fase 1)' : '3. Immediate Quick Wins (Phase 1)'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1A1A1A]">
                {blueprint.quickWinCount} {isEs ? 'Servicios' : 'Services'}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 border border-[#1A1A1A] bg-white">
                {isEs ? 'Semanas 1–2' : 'Weeks 1–2'}
              </span>
            </div>
            <div className="text-[11px] text-[#1A1A1A]/70 mt-1">
              {isEs
                ? 'Model Armor + Cloud DLP sin re-arquitecturar tu app'
                : 'Model Armor + Cloud DLP with zero app re-architecture'}
            </div>
          </div>

          <div className="border-[1.5px] border-[#1A1A1A] p-3.5 bg-[#F7F7F5]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]/60">
              {isEs ? '4. Esfuerzo Estimado de Entrega' : '4. Estimated Implementation Effort'}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#1B5FA6]">
                {isEs ? `Talla ${blueprint.overallTShirtSize}` : `Size ${blueprint.overallTShirtSize}`}
              </span>
              <span className="text-xs font-bold text-[#1A1A1A]">({blueprint.totalEstimatedWeeks})</span>
            </div>
            <div className="text-[11px] text-[#1A1A1A]/70 mt-1">
              {isEs
                ? 'Ejecutable con tu equipo interno, Partner o Google Cloud'
                : 'Executable via internal team, Partner, or Google Cloud'}
            </div>
          </div>
        </div>
      </div>

      {/* 3-Lens Persona Switcher */}
      <div className="bg-white border-2 border-[#1A1A1A] p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#1B5FA6]">
              {isEs ? 'SELECCIONA QUÉ NECESITAS COMUNICAR O SOLICITAR:' : 'SELECT WHAT YOU NEED TO COMMUNICATE OR REQUEST:'}
            </span>
            <p className="text-xs text-[#1A1A1A]/70">
              {isEs
                ? 'Los mismos hallazgos consolidados en 3 guías prácticas: para tu equipo técnico, para pedir productos/cuotas a Google Cloud, o para definir el alcance y entregables del proyecto.'
                : 'The same audit findings distilled into 3 practical guides: for your engineering team, for requesting products/quotas from Google Cloud, or for scoping project deliverables and acceptance criteria.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveLens('infra')}
              className={`px-4 py-2.5 text-xs font-extrabold border-[1.5px] border-[#1A1A1A] flex items-center gap-2 transition-all ${
                activeLens === 'infra'
                  ? 'bg-[#1A1A1A] text-white shadow-[2px_2px_0px_#1B5FA6]'
                  : 'bg-[#F7F7F5] text-[#1A1A1A] hover:bg-[#ECECEC]'
              }`}
            >
              <Terminal className="w-4 h-4 shrink-0 text-[#FBE017]" />
              <div className="text-left">
                <div>{isEs ? '1. Para tu Equipo Tech e Infra' : '1. For Your Tech & Infra Team'}</div>
                <div className="text-[10px] font-normal opacity-80">
                  {isEs ? 'Qué configurar (gcloud / IaC)' : 'What to configure (gcloud / IaC)'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveLens('customer')}
              className={`px-4 py-2.5 text-xs font-extrabold border-[1.5px] border-[#1A1A1A] flex items-center gap-2 transition-all ${
                activeLens === 'customer'
                  ? 'bg-[#1B5FA6] text-white shadow-[2px_2px_0px_#1A1A1A]'
                  : 'bg-[#F7F7F5] text-[#1A1A1A] hover:bg-[#ECECEC]'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0 text-[#FBE017]" />
              <div className="text-left">
                <div>{isEs ? '2. Qué Pedir a Google Cloud' : '2. What to Ask Google Cloud For'}</div>
                <div className="text-[10px] font-normal opacity-80">
                  {isEs ? 'Productos, cuotas y plantillas' : 'Products, quotas & blueprints'}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveLens('roadmap')}
              className={`px-4 py-2.5 text-xs font-extrabold border-[1.5px] border-[#1A1A1A] flex items-center gap-2 transition-all ${
                activeLens === 'roadmap'
                  ? 'bg-[#FBE017] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A]'
                  : 'bg-[#F7F7F5] text-[#1A1A1A] hover:bg-[#ECECEC]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0 text-[#1A1A1A]" />
              <div className="text-left">
                <div>{isEs ? '3. Alcance y Entregables (SOW)' : '3. Implementation Scope & DoD'}</div>
                <div className="text-[10px] font-normal opacity-80">
                  {isEs ? 'Qué exigir a Consultoría / Partner' : 'Deliverables & acceptance criteria'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Prescriptive Pillars List */}
      <div className="space-y-5">
        {blueprint.activePillars.map((pillar: PrescriptivePillar, idx: number) => {
          const isExpanded = !!expandedControlsPillar[pillar.id];
          return (
            <div
              key={pillar.id}
              className="bg-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A] overflow-hidden"
            >
              {/* Pillar Header */}
              <div className="border-b-[1.5px] border-[#1A1A1A] px-6 py-4 bg-[#F7F7F5] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#1A1A1A] text-white text-[11px] font-extrabold px-2 py-0.5">
                      #{idx + 1}
                    </span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 border ${waveBadgeColor(pillar.wave)}`}>
                      {pillar.waveLabel}
                    </span>
                    <span className="bg-white text-[#1B5FA6] border border-[#1A1A1A] text-[11px] font-extrabold px-2.5 py-0.5">
                      {pillar.primaryProduct}
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 border border-[#1A1A1A] text-[11px] font-extrabold px-2 py-0.5">
                      {isEs
                        ? `Cierra ${pillar.matchedControls.length} controles (+${pillar.scoreLiftPercent.toFixed(1)}% cumplimiento)`
                        : `Resolves ${pillar.matchedControls.length} controls (+${pillar.scoreLiftPercent.toFixed(1)}% score lift)`}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#1A1A1A] pt-1">{pillar.title}</h3>
                  <p className="text-xs text-[#1A1A1A]/75">{pillar.subtitle}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 border border-[#1A1A1A] bg-white">
                    <Clock className="w-3.5 h-3.5 text-[#1B5FA6]" />
                    {pillar.tShirtSize} · {pillar.estimatedWeeks}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedControlsPillar((prev) => ({
                        ...prev,
                        [pillar.id]: !prev[pillar.id]
                      }))
                    }
                    className="text-xs font-bold px-3 py-1 border border-[#1A1A1A] bg-white hover:bg-[#ECECEC] flex items-center gap-1"
                  >
                    <span>
                      {isEs
                        ? `Ver ${pillar.matchedControls.length} controles que resuelve`
                        : `View ${pillar.matchedControls.length} resolved controls`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Resolved Controls Drawer */}
              {isExpanded && (
                <div className="border-b-[1.5px] border-[#1A1A1A] bg-[#FBF3C9]/35 px-6 py-3">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-2">
                    {isEs
                      ? 'Controles de la Auditoría que se aprueban al implementar este bloque de Google Cloud:'
                      : 'Audit controls satisfied automatically once this Google Cloud pillar is deployed:'}
                  </div>
                  {pillar.matchedControls.length === 0 ? (
                    <div className="text-xs text-[#1A1A1A]/70">
                      {isEs
                        ? 'Todos los controles asociados a este pilar ya se encuentran aprobados en la auditoría actual.'
                        : 'All controls mapped to this pillar are already passed in the current audit.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {pillar.matchedControls.map((ctrl) => (
                        <div
                          key={`${ctrl.chapterId}-${ctrl.id}`}
                          className="bg-white border border-[#1A1A1A] px-2.5 py-1.5 text-xs flex items-start justify-between gap-2"
                        >
                          <div>
                            <span className="font-mono font-extrabold text-[#1B5FA6] mr-1.5">{ctrl.id}</span>
                            <span className="font-medium text-[#1A1A1A]">{ctrl.name}</span>
                          </div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#FBF3C9] border border-[#1A1A1A] shrink-0">
                            {ctrl.chapterId}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* LENS 1: TECH & INFRA TEAM RUNBOOK */}
              {activeLens === 'infra' && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="bg-[#D9EBF7]/40 border-[1.5px] border-[#1A1A1A] p-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6] mb-1">
                        {isEs ? 'QUÉ DECIRLE A TU EQUIPO DE INFRAESTRUCTURA / DEVOPS' : 'DIRECTIVE FOR YOUR INFRA & DEVOPS TEAM'}
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed">{pillar.infraDirective}</p>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-2">
                        {isEs ? 'Checklist Técnico de Implementación:' : 'Engineering Implementation Checklist:'}
                      </div>
                      <ul className="space-y-2">
                        {pillar.infraChecklist.map((step, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                            <CheckCircle2 className="w-4 h-4 text-[#1B5FA6] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase text-[#1A1A1A]/70">
                        {isEs ? 'APIs de GCP requeridas:' : 'Required GCP APIs:'}
                      </span>
                      {pillar.apisToEnable.map((api) => (
                        <code
                          key={api}
                          className="text-[11px] font-mono font-bold bg-[#ECECEC] border border-[#1A1A1A] px-2 py-0.5"
                        >
                          {api}
                        </code>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-3">
                    <div className="border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-white">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-white/20 bg-black/40">
                        <span className="text-[11px] font-mono font-bold text-[#FBE017] flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          {isEs ? 'Comandos gcloud / Quickstart de Remediación' : 'gcloud CLI / Remediation Quickstart'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`cmd-${pillar.id}`, pillar.gcloudAndTerraformSnippet)}
                          className="text-[11px] font-bold px-2 py-0.5 bg-white/10 hover:bg-white/20 text-white flex items-center gap-1"
                        >
                          {copiedKey === `cmd-${pillar.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>{isEs ? 'Copiado' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{isEs ? 'Copiar Comandos' : 'Copy Commands'}</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[11px] font-mono text-slate-100 overflow-x-auto leading-relaxed">
                        {pillar.gcloudAndTerraformSnippet}
                      </pre>
                    </div>

                    <div className="border border-[#1A1A1A] bg-[#F7F7F5] p-3 flex items-center justify-between gap-2">
                      <div className="text-[11px] font-mono truncate">
                        <span className="font-bold text-[#1B5FA6] mr-2">
                          {isEs ? 'Verificación QA:' : 'QA Verification:'}
                        </span>
                        <span>{pillar.verificationCommand}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(`verify-${pillar.id}`, pillar.verificationCommand)}
                        className="text-[11px] font-bold px-2 py-1 border border-[#1A1A1A] bg-white hover:bg-[#ECECEC] shrink-0"
                      >
                        {copiedKey === `verify-${pillar.id}` ? (isEs ? 'Copiado' : 'Copied') : (isEs ? 'Copiar' : 'Copy')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* LENS 2: WHAT TO ASK GOOGLE CLOUD FOR (PRODUCTS, QUOTAS & BLUEPRINTS) */}
              {activeLens === 'customer' && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#FBF3C9]/60 border-[1.5px] border-[#1A1A1A] p-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A]/70 mb-1">
                        {isEs ? 'QUÉ PEDIRLE A TU EQUIPO DE GOOGLE CLOUD' : 'WHAT TO REQUEST FROM GOOGLE CLOUD'}
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed">{pillar.customerAskSummary}</p>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-2">
                        {isEs ? 'Lista de Solicitudes Concretas a Google Cloud:' : 'Concrete Requests to Make to Google Cloud:'}
                      </div>
                      <ul className="space-y-2">
                        {pillar.customerChecklist.map((item, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                            <ShieldCheck className="w-4 h-4 text-[#1B5FA6] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div className="border-[1.5px] border-[#1A1A1A] p-4 bg-[#D9EBF7]/35 space-y-3">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6]">
                          {isEs ? 'PRODUCTOS Y SERVICIOS GOOGLE CLOUD A SOLICITAR' : 'GOOGLE CLOUD PRODUCTS & SERVICES TO REQUEST'}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          <span className="text-xs font-extrabold px-2.5 py-1 bg-[#1B5FA6] text-white border border-[#1A1A1A]">
                            {pillar.primaryProduct}
                          </span>
                          {pillar.supportingProducts.map((sp) => (
                            <span
                              key={sp}
                              className="text-xs font-bold px-2.5 py-1 bg-white text-[#1A1A1A] border border-[#1A1A1A]"
                            >
                              {sp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#1A1A1A]/20 pt-3">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A]/70">
                          {isEs ? 'ACOMPAÑAMIENTO TÉCNICO QUE PUEDES PEDIR A GOOGLE CLOUD' : 'TECHNICAL GUIDANCE / WORKSTREAM TO REQUEST FROM GOOGLE CLOUD'}
                        </div>
                        <div className="text-sm font-extrabold text-[#1A1A1A] mt-0.5">{pillar.psoOfferingName}</div>
                        <p className="text-xs text-[#1A1A1A]/75 mt-1">
                          <strong>{isEs ? 'Resultado esperado:' : 'Expected outcome:'}</strong> {pillar.psoDeliverable}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LENS 3: IMPLEMENTATION SCOPE, DELIVERABLES & ACCEPTANCE CRITERIA */}
              {activeLens === 'roadmap' && (
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#FBE017]/35 border-[1.5px] border-[#1A1A1A] p-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-1">
                        {isEs
                          ? 'OBJETIVO DEL FRENTE DE IMPLEMENTACIÓN'
                          : 'IMPLEMENTATION WORKSTREAM OBJECTIVE'}
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] leading-relaxed">{pillar.scopeObjective}</p>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold uppercase tracking-wider text-[#1A1A1A] mb-2">
                        {isEs
                          ? 'Criterios de Aceptación (Cómo verificar que quedó bien implementado):'
                          : 'Acceptance Criteria (Definition of Done to verify delivery):'}
                      </div>
                      <ul className="space-y-2">
                        {pillar.acceptanceCriteria.map((ac, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <span>{ac}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-[1.5px] border-[#1A1A1A] p-3.5 bg-white">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6] mb-1 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        {isEs ? 'PREGUNTA DE DEFINICIÓN ARQUITECTÓNICA (SCOPING):' : 'KEY ARCHITECTURAL SCOPING QUESTION:'}
                      </div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">{pillar.keyArchitectureQuestions}</p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3">
                    <div className="border-[1.5px] border-[#1A1A1A] p-4 bg-[#F7F7F5] space-y-3">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6]">
                          {isEs ? 'ENTREGABLE TÉCNICO A SOLICITAR (SOW / PROYECTO)' : 'TECHNICAL DELIVERABLE TO SCOPE (SOW / PROJECT)'}
                        </div>
                        <div className="text-sm font-extrabold text-[#1A1A1A] mt-0.5">{pillar.psoOfferingName}</div>
                        <div className="text-xs text-[#1A1A1A]/75 mt-1">{pillar.psoDeliverable}</div>
                      </div>

                      <div className="border-t border-[#1A1A1A]/20 pt-2.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A]/70 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {isEs ? 'Perfiles Técnicos Requeridos para la Ejecución:' : 'Technical Roles Needed for Execution:'}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {pillar.specialistRoles.map((role) => (
                            <span
                              key={role}
                              className="text-[11px] font-bold px-2 py-0.5 bg-white border border-[#1A1A1A]"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#1A1A1A]/20 pt-2.5">
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#1A1A1A]/70">
                          {isEs ? 'Servicios Google Cloud Involucrados:' : 'Google Cloud Services Involved:'}
                        </div>
                        <ul className="mt-1 space-y-1">
                          {[pillar.primaryProduct, ...pillar.supportingProducts].map((srv, dIdx) => (
                            <li key={dIdx} className="text-xs text-[#1A1A1A] flex items-center gap-1.5">
                              <Layers className="w-3 h-3 text-[#1B5FA6] shrink-0" />
                              <span>{srv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Ready-to-Send Communication Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[3px_3px_0px_#1A1A1A]">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1A1A] pb-3 mb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6]">
                {isEs ? 'PLANTILLA 1 · PARA TU EQUIPO DE INFRAESTRUCTURA' : 'TEMPLATE 1 · FOR YOUR TECH & INFRA TEAM'}
              </span>
              <h4 className="text-sm font-extrabold text-[#1A1A1A]">
                {isEs
                  ? 'Resumen Directo para Slack / Jira / Correo Interno'
                  : 'Ready-to-Paste Brief for Slack / Jira / Engineering'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('bottom-infra', blueprint.readySlackToInfraTeam)}
              className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
            >
              {copiedKey === 'bottom-infra' ? <Check className="w-3.5 h-3.5 text-[#FBE017]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'bottom-infra' ? (isEs ? '¡Copiado!' : 'Copied!') : (isEs ? 'Copiar para Infra' : 'Copy Infra Brief')}</span>
            </button>
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap bg-[#F7F7F5] border border-[#1A1A1A] p-3.5 max-h-60 overflow-y-auto text-[#1A1A1A]">
            {blueprint.readySlackToInfraTeam}
          </pre>
        </div>

        <div className="bg-white border-2 border-[#1A1A1A] p-5 shadow-[3px_3px_0px_#1A1A1A]">
          <div className="flex items-center justify-between border-b-[1.5px] border-[#1A1A1A] pb-3 mb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1B5FA6]">
                {isEs ? 'PLANTILLA 2 · PARA ENVIAR A TU EQUIPO DE GOOGLE CLOUD' : 'TEMPLATE 2 · TO SEND TO YOUR GOOGLE CLOUD TEAM'}
              </span>
              <h4 className="text-sm font-extrabold text-[#1A1A1A]">
                {isEs
                  ? 'Correo Listo para Solicitar Servicios, Cuotas y Acompañamiento a Google Cloud'
                  : 'Ready-to-Send Email Requesting GCP Services, Quotas & Technical Guidance'}
              </h4>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('bottom-gcp', blueprint.readyEmailToGoogleTeam)}
              className="bg-[#1B5FA6] hover:bg-[#154b85] text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
            >
              {copiedKey === 'bottom-gcp' ? <Check className="w-3.5 h-3.5 text-[#FBE017]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'bottom-gcp' ? (isEs ? '¡Copiado!' : 'Copied!') : (isEs ? 'Copiar Correo GCP' : 'Copy GCP Email')}</span>
            </button>
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap bg-[#F7F7F5] border border-[#1A1A1A] p-3.5 max-h-60 overflow-y-auto text-[#1A1A1A]">
            {blueprint.readyEmailToGoogleTeam}
          </pre>
        </div>
      </div>

      {onSwitchToAuditStep && (
        <div className="flex justify-center pt-2 pb-6">
          <button
            type="button"
            onClick={onSwitchToAuditStep}
            className="text-xs font-bold px-4 py-2 border-[1.5px] border-[#1A1A1A] bg-white hover:bg-[#ECECEC]"
          >
            {isEs
              ? '← Volver al Paso 1: Detalle Control por Control de la Auditoría'
              : '← Back to Step 1: Control-by-Control Diagnostic Audit Report'}
          </button>
        </div>
      )}
    </div>
  );
}
