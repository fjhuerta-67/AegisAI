import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AuditReport, VerificationLevel, TechPlatformKey, CustomFramework } from '@/src/types';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ShieldAlert,
  Sparkles, 
  Archive, 
  FileCode, 
  Trash2, 
  X, 
  Layers, 
  FileCheck,
  Cpu,
  Server,
  Terminal,
  Brain,
  Cloud,
  Shield,
  Info,
  BookOpen,
  Scale
} from 'lucide-react';

import { StandardType, StandardBreakdown } from '../../types';
import { DivisionHeader } from '../layout/BrandAssets';

interface AuditFormProps {
  onSubmit: (report: AuditReport) => void;
  onCancel: () => void;
  standardType?: StandardType;
  initialCustomFrameworkId?: string;
  initialDescription?: string;
  initialSystemName?: string;
}

interface ProgressInfo {
  stage: number;
  totalStages: number;
  message: string;
  percent: number;
}

export function AuditForm({ onSubmit, onCancel, standardType: initialStandardType = 'AI-SVS', initialCustomFrameworkId, initialDescription, initialSystemName }: AuditFormProps) {
  const [selectedStandards, setSelectedStandards] = useState<string[]>(() => {
    if (initialStandardType === 'FULL') return ['AI-SVS', 'ISO-42001'];
    if (initialStandardType === 'ISO-42001') return ['ISO-42001'];
    if (initialStandardType === 'CUSTOM' && initialCustomFrameworkId) return [initialCustomFrameworkId];
    return ['AI-SVS'];
  });
  const [customFrameworks, setCustomFrameworks] = useState<CustomFramework[]>([]);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [targetLevel, setTargetLevel] = useState<VerificationLevel>('AUTO');
  const [techPlatform, setTechPlatform] = useState<TechPlatformKey>('gemini-enterprise');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleStandard = (stdId: string) => {
    if (loading) return;
    setSelectedStandards(prev => {
      if (prev.includes(stdId)) {
        if (prev.length === 1) return prev; // At least one standard must remain selected
        return prev.filter(s => s !== stdId);
      } else {
        return [...prev, stdId];
      }
    });
  };

  const selectPreset = (preset: '360' | 'mexico' | 'tech' | 'aisvs' | 'iso') => {
    if (loading) return;
    const lfpdpppFw = customFrameworks.find(f => f.id.includes('lfpdppp'));
    const lfpcFw = customFrameworks.find(f => f.id.includes('lfpc'));
    const lfpdpppId = lfpdpppFw ? lfpdpppFw.id : 'fw-lfpdppp-mex-2026';
    const lfpcId = lfpcFw ? lfpcFw.id : 'fw-lfpc-mex-2026';

    if (preset === '360') {
      setSelectedStandards(['AI-SVS', 'ISO-42001', lfpdpppId, lfpcId]);
    } else if (preset === 'mexico') {
      setSelectedStandards([lfpdpppId, lfpcId]);
    } else if (preset === 'tech') {
      setSelectedStandards(['AI-SVS', 'ISO-42001']);
    } else if (preset === 'aisvs') {
      setSelectedStandards(['AI-SVS']);
    } else if (preset === 'iso') {
      setSelectedStandards(['ISO-42001']);
    }
  };
  const [formData, setFormData] = useState({
    systemName: initialSystemName || '',
    technicalLead: '',
    email: '',
    description: initialDescription || ''
  });

  useEffect(() => {
    if (initialDescription !== undefined || initialSystemName !== undefined) {
      setFormData(prev => ({
        ...prev,
        description: initialDescription ?? prev.description,
        systemName: initialSystemName ?? prev.systemName
      }));
    }
  }, [initialDescription, initialSystemName]);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCustomFrameworks = async () => {
      setLoadingFrameworks(true);
      try {
        const res = await fetch('/api/frameworks');
        if (res.ok) {
          const list: CustomFramework[] = await res.json();
          // Prioritize LFPDPPP, LFPC, and EU AI Act at the top
          list.sort((a, b) => {
            const aRank = a.id.includes('lfpdppp') ? 1 : a.id.includes('lfpc') ? 2 : a.id.includes('eu') ? 3 : 4;
            const bRank = b.id.includes('lfpdppp') ? 1 : b.id.includes('lfpc') ? 2 : b.id.includes('eu') ? 3 : 4;
            return aRank - bRank;
          });
          setCustomFrameworks(list);
        }
      } catch (err) {
        console.warn('Failed to fetch custom frameworks:', err);
      } finally {
        setLoadingFrameworks(false);
      }
    };
    fetchCustomFrameworks();
  }, []);

  const handleFileChange = (newFiles: FileList | File[] | null) => {
    if (!newFiles) return;
    const addedFiles = Array.from(newFiles);
    setFiles(prev => {
      const existingKeys = new Set(prev.map(f => `${f.name}_${f.size}`));
      const nonDuplicates = addedFiles.filter(f => !existingKeys.has(`${f.name}_${f.size}`));
      return [...prev, ...nonDuplicates];
    });
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileName: string) => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.zip')) {
      return <Archive className="w-5 h-5 text-amber-600 shrink-0" />;
    }
    if (lower.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500 shrink-0" />;
    }
    if (lower.endsWith('.py') || lower.endsWith('.ts') || lower.endsWith('.js') || lower.endsWith('.json') || lower.endsWith('.yaml') || lower.endsWith('.yml')) {
      return <FileCode className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-gray-500 shrink-0" />;
  };

  const totalFilesSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStandards.length === 0) {
      setError('Por favor selecciona al menos una normativa para realizar la auditoría.');
      return;
    }

    setLoading(true);

    let baseStages = 1; // +1 for reduce
    selectedStandards.forEach(s => {
      if (s === 'AI-SVS') baseStages += 4;
      else if (s === 'ISO-42001') baseStages += 5;
      else {
        const fw = customFrameworks.find(f => f.id === s);
        baseStages += fw ? Math.ceil((fw.chapters?.length || fw.totalChapters || 4) / 2) : 2;
      }
    });
    const calculatedStages = targetLevel === 'AUTO' ? baseStages + 1 : baseStages;

    setProgress({
      stage: 1,
      totalStages: calculatedStages,
      message: targetLevel === 'AUTO' 
        ? 'Iniciando pipeline de evaluación y analizando criticidad para clasificar nivel de verificación...'
        : 'Iniciando pipeline de evaluación modular y analizando archivos adjuntos...',
      percent: 4
    });
    setError(null);

    try {
      const data = new FormData();
      data.append('systemName', formData.systemName);
      data.append('technicalLead', formData.technicalLead);
      data.append('email', formData.email);
      data.append('description', formData.description);

      const isMulti = selectedStandards.length > 1;
      const effectiveStandardType: StandardType = isMulti 
        ? 'MULTI' 
        : (selectedStandards[0] === 'ISO-42001' ? 'ISO-42001' : (selectedStandards[0] === 'AI-SVS' ? 'AI-SVS' : 'CUSTOM'));

      data.append('standardType', effectiveStandardType);
      data.append('selectedStandards', JSON.stringify(selectedStandards));
      if (!['AI-SVS', 'ISO-42001'].includes(selectedStandards[0])) {
        data.append('customFrameworkId', selectedStandards[0]);
      }
      data.append('targetLevel', targetLevel);
      data.append('techPlatform', techPlatform);

      // Append all uploaded files
      files.forEach(f => {
        data.append('specifications', f);
      });
      // Backward compatibility for single file field
      if (files.length === 1) {
        data.append('specification', files[0]);
      }

      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream'
        },
        body: data,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Error al iniciar la evaluación');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream available');

      const decoder = new TextDecoder();
      let buffer = '';
      let resultData: any = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'progress') {
                setProgress({
                  stage: event.stage,
                  totalStages: event.totalStages,
                  message: event.message,
                  percent: event.percent
                });
              } else if (event.type === 'result') {
                resultData = event.data;
              }
            } catch (parseError) {
              console.warn('Error parsing SSE event:', parseError);
            }
          }
        }
      }

      if (!resultData) {
        throw new Error('No se recibió el dictamen final de la auditoría. Por favor intenta nuevamente.');
      }
      
      const resStandards: string[] = resultData.standards || selectedStandards || [];
      const resIsMulti = resStandards.length > 1 || resultData.standard === 'MULTI';
      const prefix = resIsMulti 
        ? 'MULTI' 
        : (effectiveStandardType === 'CUSTOM' ? 'CUSTOM' : (effectiveStandardType === 'ISO-42001' ? 'ISO' : 'AISVS'));

      const firstCustomId = selectedStandards.find(s => !['AI-SVS', 'ISO-42001'].includes(s));
      const firstCustomFw = firstCustomId ? customFrameworks.find(f => f.id === firstCustomId) : null;

      const newAudit: AuditReport = {
        id: `${prefix}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        date: new Date().toISOString(),
        systemName: formData.systemName,
        technicalLead: formData.technicalLead,
        email: formData.email,
        description: formData.description,
        standard: resultData.standard || effectiveStandardType,
        standards: resStandards,
        standardsBreakdown: resultData.standardsBreakdown,
        customFrameworkId: firstCustomId || undefined,
        customFrameworkName: resultData.customFrameworkName || firstCustomFw?.name || undefined,
        targetLevel,
        techPlatform,
        ...resultData
      };

      onSubmit(newAudit);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error inesperado durante la auditoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 font-sans bg-white">
      <DivisionHeader 
        title="Panel de Auditoría y Verificación"
        subtitle="Configura y solicita tu auditoría de seguridad y gobernanza de IA según normativas técnicas y regulatorias aplicables"
        actions={
          <Button variant="secondary" onClick={onCancel} className="text-xs px-3 py-1.5 cursor-pointer">
            Volver al Panel
          </Button>
        }
      />

      {/* Multi-Standard Normative Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] flex items-center gap-1.5 font-sans">
              <Layers className="w-4 h-4 text-[#1B5FA6]" />
              1. Selecciona las Normativas a Auditar (Auditoría Simultánea)
            </Label>
            <p className="text-xs text-[#4D4D4D] mt-0.5">
              Puedes marcar múltiples normativas técnicas y legales para evaluarlas de forma conjunta en un solo reporte consolidado.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A]">
              {selectedStandards.length} normativa(s) seleccionada(s)
            </span>
          </div>
        </div>

        {/* Quick Access Presets */}
        <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-[1.5px] border-[#1A1A1A]">
          <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FBE017]" />
            Accesos Rápidos:
          </span>
          <button
            type="button"
            onClick={() => selectPreset('360')}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-bold bg-[#D9EBF7] hover:bg-blue-100 text-[#1B5FA6] border border-[#1A1A1A] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            <span>🌟</span>
            <span>Auditoría Integral 360° (4 Normas)</span>
          </button>
          <button
            type="button"
            onClick={() => selectPreset('mexico')}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-bold bg-[#FBF3C9] hover:bg-amber-100 text-[#1A1A1A] border border-[#1A1A1A] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            <span>🇲🇽</span>
            <span>Leyes Mexicanas (LFPDPPP + LFPC)</span>
          </button>
          <button
            type="button"
            onClick={() => selectPreset('tech')}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-bold bg-[#ECECEC] hover:bg-gray-200 text-[#1A1A1A] border border-[#1A1A1A] transition-all flex items-center gap-1.5 cursor-pointer select-none"
          >
            <span>🛡️</span>
            <span>Técnico Dual (AISVS + ISO 42001)</span>
          </button>
          <button
            type="button"
            onClick={() => selectPreset('aisvs')}
            disabled={loading}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer select-none"
          >
            Solo OWASP AISVS
          </button>
          <button
            type="button"
            onClick={() => selectPreset('iso')}
            disabled={loading}
            className="px-2.5 py-1.5 text-xs font-semibold bg-white hover:bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] transition-all cursor-pointer select-none"
          >
            Solo ISO 42001
          </button>
        </div>

        {/* Core Standards Grid (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* OWASP AISVS */}
          {(() => {
            const isSelected = selectedStandards.includes('AI-SVS');
            return (
              <div
                onClick={() => toggleStandard('AI-SVS')}
                className={`p-4 rounded-none border-[1.5px] text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#1A1A1A] bg-[#D9EBF7]'
                    : 'border-[#ECECEC] bg-white hover:border-[#1A1A1A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                      isSelected ? 'bg-[#1B5FA6] text-white border-[#1A1A1A]' : 'bg-[#ECECEC] text-[#4D4D4D] border-[#ECECEC]'
                    }`}>
                      Seguridad Técnica
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded-none accent-[#1B5FA6] cursor-pointer pointer-events-none"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5 mb-1 font-sans">
                    <ShieldCheck className="w-4 h-4 text-[#1B5FA6]" />
                    OWASP AI-SVS 1.0
                  </h3>
                  <p className="text-xs text-[#4D4D4D] leading-relaxed">
                    Estándar de Verificación de Seguridad en IA. Evalúa los 12 capítulos técnicos C01-C12 (Niveles L1 a L3).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#767676]">12 Capítulos</span>
                  <span className={isSelected ? 'text-[#1B5FA6] font-bold' : 'text-[#767676]'}>
                    {isSelected ? '✓ Seleccionado' : '+ Agregar'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ISO/IEC 42001:2023 */}
          {(() => {
            const isSelected = selectedStandards.includes('ISO-42001');
            return (
              <div
                onClick={() => toggleStandard('ISO-42001')}
                className={`p-4 rounded-none border-[1.5px] text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#1A1A1A] bg-[#ECECEC]'
                    : 'border-[#ECECEC] bg-white hover:border-[#1A1A1A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                      isSelected ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-[#ECECEC] text-[#4D4D4D] border-[#ECECEC]'
                    }`}>
                      Gobernanza & AIMS
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded-none accent-[#1A1A1A] cursor-pointer pointer-events-none"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5 mb-1 font-sans">
                    <Layers className="w-4 h-4 text-[#1B5FA6]" />
                    ISO/IEC 42001:2023
                  </h3>
                  <p className="text-xs text-[#4D4D4D] leading-relaxed">
                    Sistema de Gestión de IA (AIMS). Evalúa políticas, controles organizacionales y riesgos (Cl. 4-10 y Anexos A).
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#767676]">Cláusulas + Anexos A</span>
                  <span className={isSelected ? 'text-[#1A1A1A] font-bold' : 'text-[#767676]'}>
                    {isSelected ? '✓ Seleccionado' : '+ Agregar'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* LFPDPPP (Datos Personales México) */}
          {(() => {
            const lfpdpppFw = customFrameworks.find(f => f.id.includes('lfpdppp'));
            const lfpdpppId = lfpdpppFw?.id || 'fw-lfpdppp-mex-2026';
            const isSelected = selectedStandards.includes(lfpdpppId);
            return (
              <div
                onClick={() => toggleStandard(lfpdpppId)}
                className={`p-4 rounded-none border-[1.5px] text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#1A1A1A] bg-[#FBF3C9]'
                    : 'border-[#ECECEC] bg-white hover:border-[#1A1A1A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                      isSelected ? 'bg-[#FBE017] text-[#1A1A1A] border-[#1A1A1A]' : 'bg-[#ECECEC] text-[#4D4D4D] border-[#ECECEC]'
                    }`}>
                      🇲🇽 Ley Federal INAI
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded-none accent-[#1A1A1A] cursor-pointer pointer-events-none"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5 mb-1 font-sans">
                    <Scale className="w-4 h-4 text-[#1A1A1A]" />
                    LFPDPPP (Privacidad)
                  </h3>
                  <p className="text-xs text-[#4D4D4D] leading-relaxed">
                    Protección de datos personales en posesión de particulares: aviso de privacidad, ARCO, consentimiento y transferencias.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#767676]">{lfpdpppFw?.totalChapters || 6} Cap / {lfpdpppFw?.totalControls || 14} Controles</span>
                  <span className={isSelected ? 'text-[#1A1A1A] font-bold' : 'text-[#767676]'}>
                    {isSelected ? '✓ Seleccionado' : '+ Agregar'}
                  </span>
                </div>
              </div>
            );
          })()}

          {/* LFPC (Protección al Consumidor PROFECO) */}
          {(() => {
            const lfpcFw = customFrameworks.find(f => f.id.includes('lfpc'));
            const lfpcId = lfpcFw?.id || 'fw-lfpc-mex-2026';
            const isSelected = selectedStandards.includes(lfpcId);
            return (
              <div
                onClick={() => toggleStandard(lfpcId)}
                className={`p-4 rounded-none border-[1.5px] text-left transition-all relative flex flex-col justify-between cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#1A1A1A] bg-[#D9EBF7]'
                    : 'border-[#ECECEC] bg-white hover:border-[#1A1A1A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider border ${
                      isSelected ? 'bg-[#1B5FA6] text-white border-[#1A1A1A]' : 'bg-[#ECECEC] text-[#4D4D4D] border-[#ECECEC]'
                    }`}>
                      🇲🇽 PROFECO
                    </span>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="w-4 h-4 rounded-none accent-[#1B5FA6] cursor-pointer pointer-events-none"
                    />
                  </div>
                  <h3 className="font-bold text-sm text-[#1A1A1A] flex items-center gap-1.5 mb-1 font-sans">
                    <Scale className="w-4 h-4 text-[#1B5FA6]" />
                    LFPC (Consumidor)
                  </h3>
                  <p className="text-xs text-[#4D4D4D] leading-relaxed">
                    Protección de derechos del consumidor: veracidad algorítmica, no discriminación en precios y términos transparentes.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#1A1A1A]/20 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#767676]">{lfpcFw?.totalChapters || 6} Cap / {lfpcFw?.totalControls || 14} Controles</span>
                  <span className={isSelected ? 'text-[#1B5FA6] font-bold' : 'text-[#767676]'}>
                    {isSelected ? '✓ Seleccionado' : '+ Agregar'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Other Frameworks from Catalog (e.g. EU AI Act, Custom BYOF) */}
        {customFrameworks.filter(f => !f.id.includes('lfpdppp') && !f.id.includes('lfpc')).length > 0 && (
          <div className="p-4 bg-purple-50/40 border border-purple-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                Marcos Regulatorios Adicionales Ingestados (BYOF):
              </span>
              <span className="text-[11px] text-purple-600 font-medium">Haz clic para incluir en la auditoría</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {customFrameworks
                .filter(f => !f.id.includes('lfpdppp') && !f.id.includes('lfpc'))
                .map(fw => {
                  const isSelected = selectedStandards.includes(fw.id);
                  const isEu = fw.id.includes('eu');
                  return (
                    <div
                      key={fw.id}
                      onClick={() => toggleStandard(fw.id)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-purple-600 bg-white shadow-2xs ring-1 ring-purple-500'
                          : 'border-purple-200/70 bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span>{isEu ? '🇪🇺' : '📜'}</span>
                        <div className="truncate">
                          <p className="text-xs font-bold text-gray-900 truncate">{fw.name}</p>
                          <p className="text-[10px] text-gray-500">{fw.jurisdiction} • {fw.totalChapters} Cap</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="w-3.5 h-3.5 rounded text-purple-600 border-gray-300 pointer-events-none"
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Selected Standards Summary Banner */}
        <div className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-gray-700">Normativas en esta Auditoría:</span>
            {selectedStandards.map(s => {
              const fw = customFrameworks.find(f => f.id === s);
              const label = s === 'AI-SVS' ? 'OWASP AI-SVS' : s === 'ISO-42001' ? 'ISO 42001' : (fw?.shortCode || fw?.name || s);
              return (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-white text-gray-800 border border-blue-200 shadow-2xs"
                >
                  <span>{label}</span>
                  {selectedStandards.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleStandard(s); }}
                      className="hover:text-red-500 font-bold ml-0.5"
                      title="Quitar normativa"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
          {selectedStandards.length > 1 && (
            <span className="font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded text-[11px]">
              ✨ Reporte Integral Consolidado (Compliance 360°)
            </span>
          )}
        </div>
      </div>

      {/* Target Level Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--color-aegis-blue)] text-white text-xs flex items-center justify-center font-bold">2</span>
            Nivel de Verificación OWASP AI-SVS (Rigor y Criticidad)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Define el alcance de los requisitos obligatorios para la certificación del sistema. Si eliges auto-detección, AegisAI clasificará la arquitectura según el riesgo del EU AI Act y OWASP AISVS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* AUTO Card */}
          <button
            type="button"
            onClick={() => !loading && setTargetLevel('AUTO')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              targetLevel === 'AUTO'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  targetLevel === 'AUTO' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Inteligente
                </span>
                {targetLevel === 'AUTO' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Auto-detectar con IA
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                El agente analiza sensibilidad, autonomía y severidad para clasificar automáticamente en L1, L2 o L3 con justificación técnica.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-blue-700 font-medium">
              ★ Recomendado
            </div>
          </button>

          {/* L1 Card */}
          <button
            type="button"
            onClick={() => !loading && setTargetLevel('L1')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              targetLevel === 'L1'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  targetLevel === 'L1' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Baseline
                </span>
                {targetLevel === 'L1' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Nivel 1 (L1 - Esencial)
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Higiene básica de seguridad: sanitización de prompts, delimitadores y logging esencial. Para herramientas internas o prototipos.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-500 font-medium">
              Controles L1 obligatorios
            </div>
          </button>

          {/* L2 Card */}
          <button
            type="button"
            onClick={() => !loading && setTargetLevel('L2')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              targetLevel === 'L2'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  targetLevel === 'L2' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Producción
                </span>
                {targetLevel === 'L2' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                Nivel 2 (L2 - Estándar)
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Sistemas en producción: protección de PII, red teaming periódico, control RBAC en bases vectoriales y canaries.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-500 font-medium">
              Controles L1 + L2 obligatorios
            </div>
          </button>

          {/* L3 Card */}
          <button
            type="button"
            onClick={() => !loading && setTargetLevel('L3')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              targetLevel === 'L3'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  targetLevel === 'L3' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Misión Crítica
                </span>
                {targetLevel === 'L3' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                Nivel 3 (L3 - Crítico)
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Sistemas críticos (salud, finanzas, agentes autónomos): sandboxing gVisor/microVM, firma criptográfica y AIBOM estricto.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-500 font-medium">
              Controles L1 + L2 + L3 obligatorios
            </div>
          </button>
        </div>
      </div>

      {/* Technological Platform & Shared Responsibility Model Selector */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[var(--color-aegis-blue)] text-white text-xs flex items-center justify-center font-bold">3</span>
            Plataforma Tecnológica y Modelo Fundacional (Responsabilidad Compartida)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Indica sobre qué plataforma o servicio de IA opera tu sistema. AegisAI aplicará la matriz de <strong>Responsabilidad Compartida</strong>, acreditando automáticamente los controles de pesos, infraestructura y privacidad base cubiertos contractualmente por el proveedor SaaS/PaaS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Gemini Enterprise */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('gemini-enterprise')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'gemini-enterprise'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'gemini-enterprise' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  SaaS Gestionado
                </span>
                {techPlatform === 'gemini-enterprise' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Google Gemini Enterprise
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Workspace / Google Cloud. Zero Data Retention garantizado, pesos protegidos sin acceso y certificación ISO 42001 activa.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-blue-700 font-semibold">
              ✓ Controles de Pesos e Infraestructura Acreditados
            </div>
          </button>

          {/* Google Cloud Vertex AI */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('vertex-ai')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'vertex-ai'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'vertex-ai' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  PaaS Enterprise
                </span>
                {techPlatform === 'vertex-ai' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Google Cloud Vertex AI
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                PaaS con Model Armor, endpoints privados VPC-SC, cifrado CMEK y cumplimiento SOC 2 e ISO/IEC 42001.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-indigo-700 font-semibold">
              ✓ Pesos y Red Aislados por Google Cloud
            </div>
          </button>

          {/* Microsoft Azure OpenAI */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('azure-openai')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'azure-openai'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'azure-openai' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  PaaS Gestionado
                </span>
                {techPlatform === 'azure-openai' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                Azure OpenAI Service
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Servicio gestionado de OpenAI con Azure AI Content Safety, aislamiento VNet y zero data training contractual.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-sky-700 font-semibold">
              ✓ Salvaguardas Heredadas de Microsoft Azure
            </div>
          </button>

          {/* Amazon Bedrock */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('aws-bedrock')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'aws-bedrock'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'aws-bedrock' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  PaaS Serverless
                </span>
                {techPlatform === 'aws-bedrock' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Server className="w-3.5 h-3.5 text-amber-600" />
                Amazon Bedrock
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Modelos fundacionales serverless con Guardrails integrados, cifrado KMS y aislamiento de VPC en AWS.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-amber-700 font-semibold">
              ✓ Seguridad de Hipervisor Nitro y Pesos en AWS
            </div>
          </button>

          {/* Self-Hosted / Open-Weights */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('self-hosted')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'self-hosted'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'self-hosted' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  vLLM / Ollama
                </span>
                {techPlatform === 'self-hosted' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Terminal className="w-3.5 h-3.5 text-gray-700" />
                Auto-hospedado (Open-Weights)
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Infraestructura propia o Kubernetes. Requiere evidencia de firma de pesos (Cosign), microVMs y hardening de host.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-gray-600 font-semibold">
              ⚡ 100% Responsabilidad del Cliente
            </div>
          </button>

          {/* Auto-detect with AI */}
          <button
            type="button"
            onClick={() => !loading && setTechPlatform('auto')}
            disabled={loading}
            className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              techPlatform === 'auto'
                ? 'border-[var(--color-aegis-blue)] bg-blue-50/50 shadow-sm ring-1 ring-[var(--color-aegis-blue)]'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  techPlatform === 'auto' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  Auto-detectar
                </span>
                {techPlatform === 'auto' && <CheckCircle2 className="w-4 h-4 text-[var(--color-aegis-blue)]" />}
              </div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5 mb-1">
                <Brain className="w-3.5 h-3.5 text-purple-600" />
                Detectar con IA
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                AegisAI extraerá automáticamente el proveedor y plataforma a partir de la descripción o archivos adjuntos.
              </p>
            </div>
            <div className="mt-2.5 pt-2 border-t border-gray-100 text-[10px] text-purple-700 font-semibold">
              Heurística contextual automática
            </div>
          </button>
        </div>

        {/* Dynamic Context Banner */}
        {techPlatform === 'gemini-enterprise' && (
          <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              Modelo de Responsabilidad Compartida: Google Gemini Enterprise Activo
            </div>
            <p className="text-blue-800 leading-relaxed">
              <strong>Salvaguardas Acreditadas por Defecto:</strong> Los requisitos de protección física de centros de datos, microVMs confidenciales, inaccesibilidad de pesos de modelos (OWASP AISVS Cap. 6), Zero Data Retention (Cap. 1) y certificación ISO/IEC 42001 de Google Cloud se marcarán como <strong>Aprobados</strong> por herencia.
            </p>
            <p className="text-blue-700 leading-relaxed">
              <strong>Tu Responsabilidad:</strong> La auditoría evaluará la documentación adjunta en autenticación de tu aplicación (RBAC), permisos RAG, sanitización de respuestas en el frontend y compuertas de supervisión humana (HITL).
            </p>
          </div>
        )}

        {techPlatform === 'self-hosted' && (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-xs space-y-1 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Despliegue Auto-Hospedado: Sin Controles Heredados
            </div>
            <p className="text-amber-800 leading-relaxed">
              La organización es responsable del 100% de la arquitectura. Asegúrate de incluir en la descripción o documentación evidencia sobre la firma criptográfica de pesos (Cosign/SHA-256), aislamiento en microVMs (gVisor/Kata) y hardening de hosts de inferencia.
            </p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[var(--color-aegis-blue)]" />
            4. Información de la Arquitectura y Archivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="systemName" className="text-xs font-medium text-gray-700">Nombre del Sistema *</Label>
                <Input
                  id="systemName"
                  value={formData.systemName}
                  onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                  placeholder="Ej. Sistema RAG de Créditos"
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="technicalLead" className="text-xs font-medium text-gray-700">Líder Técnico / Responsable</Label>
                <Input
                  id="technicalLead"
                  value={formData.technicalLead}
                  onChange={(e) => setFormData({ ...formData, technicalLead: e.target.value })}
                  placeholder="Ej. Ing. Alejandro Silva"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700">Correo de Contacto</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seguridad.ia@empresa.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-medium text-gray-700">
                Descripción de Arquitectura, Modelos y Salvaguardas {files.length === 0 ? <span className="text-red-500">*</span> : <span className="text-gray-400 font-normal">(Opcional al adjuntar archivos)</span>}
              </Label>
              <Textarea
                id="description"
                className="min-h-[110px] text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required={files.length === 0}
                disabled={loading}
                placeholder={files.length > 0 
                  ? "Opcional: Añade notas adicionales sobre la arquitectura o deja que el auditor analice directamente los archivos y paquetes ZIP adjuntos..."
                  : "Describe la arquitectura: modelos LLM utilizados, bases de datos vectoriales (k-NN), herramientas de orquestación, endpoints, sanitización de prompts y autenticación..."}
              />
            </div>

            {/* Drag & Drop Multi-file and ZIP Upload Zone */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-gray-700">
                  Documentos de Especificación, Código o Paquetes ZIP (Opcional)
                </Label>
                {files.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearFiles}
                    disabled={loading}
                    className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpiar todos ({files.length})
                  </button>
                )}
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) handleFileChange(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${
                  isDragging 
                    ? 'border-[var(--color-aegis-blue)] bg-blue-50/70 scale-[0.99]' 
                    : 'border-gray-300 bg-gray-50/40 hover:bg-gray-50 hover:border-blue-400'
                } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.zip,.txt,.md,.json,.yaml,.yml,.py,.ts,.js,.java,.go,.sql,application/pdf,application/zip,application/x-zip-compressed,text/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                  disabled={loading}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100/70 text-[var(--color-aegis-blue)] flex items-center justify-center">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Arrastra y suelta tus archivos aquí, o <span className="text-[var(--color-aegis-blue)] underline">examina</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Admite documentos <strong>PDF</strong>, especificaciones <strong>TXT/MD</strong>, código/configuraciones o archivos comprimidos <strong>.ZIP</strong> (Hasta 50MB totales)
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Files List */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                    <span>Archivos seleccionados ({files.length}):</span>
                    <span>Peso total: {formatFileSize(totalFilesSize)}</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {files.map((file, idx) => (
                      <div 
                        key={`${file.name}_${idx}`}
                        className="flex items-center justify-between p-2.5 bg-white border border-gray-200 rounded-lg shadow-2xs text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate mr-3">
                          {getFileIcon(file.name)}
                          <span className="font-medium text-gray-800 truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-gray-400 text-[11px] shrink-0">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                          disabled={loading}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors shrink-0"
                          title="Remover archivo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Real-time SSE Progress Panel */}
            {loading && (
              <div className="p-6 bg-gradient-to-b from-blue-50/50 to-white border border-blue-200/80 rounded-xl shadow-xs space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="w-5 h-5 animate-spin text-[var(--color-aegis-blue)]" />
                    <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      Evaluación Modular en Progreso <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[var(--color-aegis-blue)] bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-full">
                    {progress ? `${progress.percent}%` : 'Iniciando...'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 via-[var(--color-aegis-blue)] to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress ? Math.max(progress.percent, 8) : 8}%` }}
                  />
                </div>

                {/* Active Stage Description */}
                <div className="flex items-start gap-2.5 text-xs text-gray-700 bg-white p-3.5 rounded-lg border border-gray-200 shadow-2xs">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 block">
                      {progress ? `Etapa ${progress.stage} de ${progress.totalStages}:` : 'Preparando entorno...'}
                    </span>
                    <span className="text-gray-600 leading-relaxed">
                      {progress ? progress.message : 'Extrayendo arquitectura, analizando archivos y preparando lotes de capítulos...'}
                    </span>
                  </div>
                </div>

                {/* Stage Visual Pills for AI-SVS */}
                {selectedStandards.includes('AI-SVS') && selectedStandards.length === 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
                    {[
                      { num: 1, label: 'Lote 1', title: 'C01-C03: Datos & Inyección' },
                      { num: 2, label: 'Lote 2', title: 'C04-C06: Infra & Acceso' },
                      { num: 3, label: 'Lote 3', title: 'C07-C09: Salidas & Agentes' },
                      { num: 4, label: 'Lote 4', title: 'C10-C12: MCP & Monitoreo' }
                    ].map((st) => {
                      const isCurrent = progress && progress.stage === st.num;
                      const isDone = progress && progress.stage > st.num;
                      return (
                        <div 
                          key={st.num}
                          className={`p-2 rounded-lg border text-[11px] font-medium transition-all ${
                            isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            isCurrent ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold shadow-2xs' :
                            'bg-gray-50/60 border-gray-200 text-gray-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${
                              isDone ? 'bg-emerald-500' : isCurrent ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'
                            }`} />
                            <span className="truncate">{st.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4 text-sm flex gap-3 items-start">
                <AlertCircle className="shrink-0 mt-0.5" size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={loading || selectedStandards.length === 0} className="px-6">
                {loading 
                  ? 'Ejecutando Auditoría por Lotes...' 
                  : selectedStandards.length === 0
                    ? 'Selecciona al menos un marco normativo'
                    : selectedStandards.length > 1
                      ? `Ejecutar Auditoría Multi-Normativa con AegisAI (${selectedStandards.length} Normas)`
                      : selectedStandards.includes('ISO-42001')
                        ? 'Ejecutar Auditoría con AegisAI (ISO 42001)'
                        : selectedStandards.includes('MX-LFPDPPP')
                          ? 'Ejecutar Auditoría con AegisAI (LFPDPPP México)'
                          : selectedStandards.includes('MX-LFPC')
                            ? 'Ejecutar Auditoría con AegisAI (LFPC México)'
                            : selectedStandards.includes('EU-AI-ACT')
                              ? 'Ejecutar Auditoría con AegisAI (EU AI Act)'
                              : 'Ejecutar Auditoría con AegisAI (OWASP AISVS)'
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
