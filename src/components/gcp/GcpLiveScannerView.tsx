import React, { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  Server, 
  Database, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  ArrowRight, 
  Zap, 
  Info, 
  Cpu, 
  Terminal, 
  RefreshCw,
  Sliders
} from 'lucide-react';
import { GCPAuthMode, GCPScanComponents, GCPScanTelemetry, AuditReport, VerificationLevel } from '../../types';
import { DivisionHeader } from '../layout/BrandAssets';

interface GcpLiveScannerViewProps {
  onAuditComplete: (report: AuditReport) => void;
}

export function GcpLiveScannerView({ onAuditComplete }: GcpLiveScannerViewProps) {
  // Configuración de Conexión
  const [projectId, setProjectId] = useState('aegis-fintech-ai-prod');
  const [authMode, setAuthMode] = useState<GCPAuthMode>('demo');
  const [accessToken, setAccessToken] = useState('');
  const [serviceAccountJson, setServiceAccountJson] = useState('');

  // Prueba de Conexión
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ ok: boolean; message: string; projectNumber?: string } | null>(null);

  // Componentes a escanear
  const [components, setComponents] = useState<GCPScanComponents>({
    iam: true,
    storage: true,
    cloudRun: true,
    vertexAi: true,
    kmsAndSecrets: true,
    logging: true
  });

  // Metadatos de Auditoría
  const [systemName, setSystemName] = useState('Fintech AI Engine (GCP Live)');
  const [technicalLead, setTechnicalLead] = useState('Ing. Alejandro Silva');
  const [email, setEmail] = useState('alejandro.silva@corporativo.com.mx');
  const [targetLevel, setTargetLevel] = useState<VerificationLevel>('L2');

  // Normativas seleccionadas
  const [selectedStandards, setSelectedStandards] = useState<string[]>([
    'AI-SVS',
    'ISO-42001',
    'fw-lfpdppp-mex-2026',
    'fw-lfpc-mex-2026'
  ]);

  // Estado de Ejecución
  const [isAuditing, setIsAuditing] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [progressTotal, setProgressTotal] = useState(6);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [discoveredTelemetry, setDiscoveredTelemetry] = useState<GCPScanTelemetry | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Presets rápidos
  const applyPreset = (preset: '360' | 'mexico' | 'tech' | 'aisvs' | 'iso') => {
    if (preset === '360') {
      setSelectedStandards(['AI-SVS', 'ISO-42001', 'fw-lfpdppp-mex-2026', 'fw-lfpc-mex-2026']);
    } else if (preset === 'mexico') {
      setSelectedStandards(['fw-lfpdppp-mex-2026', 'fw-lfpc-mex-2026']);
    } else if (preset === 'tech') {
      setSelectedStandards(['AI-SVS', 'ISO-42001']);
    } else if (preset === 'aisvs') {
      setSelectedStandards(['AI-SVS']);
    } else if (preset === 'iso') {
      setSelectedStandards(['ISO-42001']);
    }
  };

  const toggleStandard = (id: string) => {
    setSelectedStandards(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(s => s !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Probar Conexión
  const handleTestConnection = async () => {
    if (!projectId.trim()) {
      setConnectionStatus({ ok: false, message: 'Ingrese un ID de proyecto válido.' });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);
    try {
      const res = await fetch('/api/gcp/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId.trim(),
          authMode,
          accessToken,
          serviceAccountJson
        })
      });

      const data = await res.json();
      if (data.ok) {
        setConnectionStatus({
          ok: true,
          message: data.message,
          projectNumber: data.projectNumber
        });
      } else {
        setConnectionStatus({
          ok: false,
          message: data.error || 'Error al conectar con Google Cloud'
        });
      }
    } catch (err: any) {
      setConnectionStatus({
        ok: false,
        message: err.message || 'Error de red al probar conexión'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Ejecutar Auditoría en Vivo con SSE
  const handleStartLiveAudit = async () => {
    if (!projectId.trim()) {
      setErrorMsg('Debe especificar un ID de proyecto de Google Cloud.');
      return;
    }

    setIsAuditing(true);
    setErrorMsg(null);
    setProgressPercent(2);
    setProgressMessage('Iniciando conexión con Google Cloud...');
    setDiscoveredTelemetry(null);

    try {
      const response = await fetch('/api/gcp/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: projectId.trim(),
          authMode,
          accessToken,
          serviceAccountJson,
          components,
          selectedStandards,
          systemName: systemName.trim() || `Proyecto GCP: ${projectId}`,
          technicalLead: technicalLead.trim(),
          email: email.trim(),
          targetLevel
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Error en el servidor: HTTP ${response.status} - ${errText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo inicializar el lector de stream SSE.');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace(/^data:\s*/, '').trim();
              if (dataStr) {
                try {
                  const event = JSON.parse(dataStr);
                  if (event.type === 'progress') {
                    if (event.percent !== undefined) setProgressPercent(event.percent);
                    if (event.stage !== undefined) setProgressStage(event.stage);
                    if (event.totalStages !== undefined) setProgressTotal(event.totalStages);
                    if (event.message) setProgressMessage(event.message);
                    if (event.telemetry) setDiscoveredTelemetry(event.telemetry);
                  } else if (event.type === 'result' && event.data) {
                    setProgressPercent(100);
                    setProgressMessage('¡Auditoría de infraestructura viva completada con éxito!');
                    setTimeout(() => {
                      onAuditComplete(event.data);
                    }, 800);
                  } else if (event.type === 'error') {
                    throw new Error(event.error || 'Error reportado por el motor de auditoría.');
                  }
                } catch (e: any) {
                  // Si no es un JSON completo en el chunk, continuamos
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error('[GCP Live Audit Error]:', err);
      setErrorMsg(err.message || 'Ocurrió un error durante la auditoría en vivo.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 font-sans bg-white">
      {/* Cabecera Principal con firma institucional oficial */}
      <DivisionHeader 
        title="Auditoría en Vivo de Proyectos Google Cloud"
        subtitle="Inspección factual directa de infraestructura, IAM, Cloud Storage, Cloud Run y Vertex AI (Zero-Footprint, solo lectura)"
        actions={
          <button
            onClick={() => {
              setAuthMode('demo');
              setProjectId('aegis-fintech-ai-prod');
              setConnectionStatus({
                ok: true,
                message: 'Entorno de demostración empresarial precargado.',
                projectNumber: '839201948201'
              });
            }}
            className="bg-[#FBE017] hover:bg-[#ebd006] text-[#1A1A1A] px-3.5 py-2 text-xs font-bold border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-2 cursor-pointer select-none"
          >
            <Zap size={14} className="text-[#1A1A1A]" /> Cargar Demo Corporativo
          </button>
        }
      />

      {/* Banner de Garantía Zero-Footprint (L03 Statement) */}
      <div className="mb-6 p-4 bg-[#FAFAFA] border-[1.5px] border-[#1A1A1A] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-sm font-normal text-[#1A1A1A] leading-relaxed">
          Inspección directa de infraestructura en Google Cloud Platform. <span className="mark-yellow">Sin agentes ni recursos desplegados</span> en el proyecto auditado; todo el procesamiento se ejecuta 100% en AegisAI.
        </div>
        <div className="text-[11px] text-[#767676] font-medium shrink-0">
          Garantía de Inviolabilidad · HTTP GET
        </div>
      </div>

      {/* Grid de Configuración */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1 y 2: Parámetros de Conexión y Componentes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Conexión a GCP */}
          <div className="bg-white rounded-none p-6 border-[1.5px] border-[#1A1A1A] shadow-none space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-sans">
                <Cloud size={16} className="text-[#1B5FA6]" /> 1. Conexión al Proyecto de Google Cloud
              </h2>
              <span className="text-xs text-[#767676] font-medium">HTTP GET de solo lectura</span>
            </div>

            {/* Selector de Modo de Autenticación */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-sans">
                Método de Autenticación
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('demo');
                    setProjectId('aegis-fintech-ai-prod');
                    setConnectionStatus(null);
                  }}
                  className={`p-3 rounded-none border text-left transition-all cursor-pointer ${
                    authMode === 'demo'
                      ? 'border-[1.5px] border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6] font-bold'
                      : 'border-[#ECECEC] hover:bg-[#ECECEC] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans">
                    <Zap size={14} className={authMode === 'demo' ? 'text-[#1B5FA6]' : 'text-[#767676]'} />
                    <span>Demo / Simulación</span>
                  </div>
                  <p className="text-[10px] text-[#4D4D4D] font-normal mt-1 font-sans">Sin credenciales requeridas</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('adc');
                    setConnectionStatus(null);
                  }}
                  className={`p-3 rounded-none border text-left transition-all cursor-pointer ${
                    authMode === 'adc'
                      ? 'border-[1.5px] border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6] font-bold'
                      : 'border-[#ECECEC] hover:bg-[#ECECEC] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans">
                    <Server size={14} className={authMode === 'adc' ? 'text-[#1B5FA6]' : 'text-[#767676]'} />
                    <span>ADC / Cloud Run</span>
                  </div>
                  <p className="text-[10px] text-[#4D4D4D] font-normal mt-1 font-sans">Automático en la nube</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('token');
                    setConnectionStatus(null);
                  }}
                  className={`p-3 rounded-none border text-left transition-all cursor-pointer ${
                    authMode === 'token'
                      ? 'border-[1.5px] border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6] font-bold'
                      : 'border-[#ECECEC] hover:bg-[#ECECEC] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans">
                    <Terminal size={14} className={authMode === 'token' ? 'text-[#1B5FA6]' : 'text-[#767676]'} />
                    <span>Token Temporal</span>
                  </div>
                  <p className="text-[10px] text-[#4D4D4D] font-normal mt-1 font-sans">gcloud auth token</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('service_account');
                    setConnectionStatus(null);
                  }}
                  className={`p-3 rounded-none border text-left transition-all cursor-pointer ${
                    authMode === 'service_account'
                      ? 'border-[1.5px] border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6] font-bold'
                      : 'border-[#ECECEC] hover:bg-[#ECECEC] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-sans">
                    <Key size={14} className={authMode === 'service_account' ? 'text-[#1B5FA6]' : 'text-[#767676]'} />
                    <span>Service Account</span>
                  </div>
                  <p className="text-[10px] text-[#4D4D4D] font-normal mt-1 font-sans">JSON en memoria RAM</p>
                </button>
              </div>
            </div>


            {/* Campo Project ID */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5 font-sans">
                Google Cloud Project ID *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    placeholder="ej. mi-empresa-ia-prod"
                    className="w-full bg-white border-[1.5px] border-[#1A1A1A] rounded-none px-3.5 py-2 text-sm font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1B5FA6]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="bg-white hover:bg-[#ECECEC] text-[#1A1A1A] px-4 py-2 rounded-none text-xs font-bold transition-all flex items-center gap-1.5 border-[1.5px] border-[#1A1A1A] shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {testingConnection ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-[#1B5FA6]" /> Probando...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={14} /> Probar Conexión
                    </>
                  )}
                </button>
              </div>

              {/* Mensaje de Estado de Conexión */}
              {connectionStatus && (
                <div
                  className={`mt-2.5 p-3 rounded-none text-xs flex items-start gap-2 border-[1.5px] border-[#1A1A1A] ${
                    connectionStatus.ok
                      ? 'bg-[#D9EBF7] text-[#1B5FA6]'
                      : 'bg-[#FBF3C9] text-[#1A1A1A]'
                  }`}
                >
                  {connectionStatus.ok ? (
                    <CheckCircle size={16} className="text-[#1B5FA6] shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="text-[#1A1A1A] shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">{connectionStatus.message}</span>
                    {connectionStatus.projectNumber && (
                      <span className="block text-[11px] font-mono mt-0.5">
                        Project Number: {connectionStatus.projectNumber}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Campos condicionales de autenticación */}
            {authMode === 'token' && (
              <div className="space-y-1.5 bg-[#FAFAFA] p-3.5 rounded-none border border-[#1A1A1A]">
                <label className="block text-xs font-bold text-[#1A1A1A]">
                  Access Token de Google Cloud (Bearer)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  placeholder="Pegar token (e.g. gcloud auth print-access-token)..."
                  className="w-full bg-white border border-[#1A1A1A] rounded-none px-3 py-2 text-xs font-mono text-[#1A1A1A] focus:outline-none"
                />
                <p className="text-[11px] text-[#4D4D4D]">
                  Tip: Genera un token temporal con: <code className="bg-[#ECECEC] px-1 py-0.5 text-[#1A1A1A]">gcloud auth print-access-token</code>
                </p>
              </div>
            )}

            {authMode === 'service_account' && (
              <div className="space-y-1.5 bg-[#FAFAFA] p-3.5 rounded-none border border-[#1A1A1A]">
                <label className="block text-xs font-bold text-[#1A1A1A] flex items-center justify-between">
                  <span>JSON de Cuenta de Servicio (Solo Lectura)</span>
                  <span className="text-[10px] text-[#1B5FA6] font-semibold">Procesado en memoria volátil</span>
                </label>
                <textarea
                  rows={3}
                  value={serviceAccountJson}
                  onChange={e => setServiceAccountJson(e.target.value)}
                  placeholder='{"type": "service_account", "project_id": "...", "private_key": "..."}'
                  className="w-full bg-white border border-[#1A1A1A] rounded-none p-2 text-xs font-mono text-[#1A1A1A] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Card 2: Componentes de Infraestructura a Inspeccionar */}
          <div className="bg-white rounded-none p-6 border-[1.5px] border-[#1A1A1A] shadow-none space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECECEC] pb-3">
              <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-sans">
                <Sliders size={16} className="text-[#1B5FA6]" /> 2. Componentes de Infraestructura a Inspeccionar
              </h2>
              <span className="text-xs text-[#1B5FA6] font-bold">Inspección integral 360°</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-3 p-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={components.vertexAi}
                  onChange={e => setComponents({ ...components, vertexAi: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-none accent-[#1B5FA6]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Cpu size={14} className="text-[#1B5FA6]" /> Vertex AI (Modelos y Endpoints)
                  </span>
                  <p className="text-[11px] text-[#4D4D4D] mt-0.5">Aislamiento VPC, IP pública, CMEK y monitoreo de drift.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={components.cloudRun}
                  onChange={e => setComponents({ ...components, cloudRun: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-none accent-[#1B5FA6]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Server size={14} className="text-[#1B5FA6]" /> Cloud Run (Microservicios y Agentes)
                  </span>
                  <p className="text-[11px] text-[#4D4D4D] mt-0.5">Restricción de Ingress, cuentas de servicio y variables de entorno.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={components.storage}
                  onChange={e => setComponents({ ...components, storage: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-none accent-[#1B5FA6]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Database size={14} className="text-[#1B5FA6]" /> Cloud Storage (Buckets RAG y Datos)
                  </span>
                  <p className="text-[11px] text-[#4D4D4D] mt-0.5">Uniform Bucket-Level Access, prevención de acceso público y CMEK.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={components.iam}
                  onChange={e => setComponents({ ...components, iam: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-none accent-[#1B5FA6]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Lock size={14} className="text-[#1B5FA6]" /> Cloud IAM & Políticas de Acceso
                  </span>
                  <p className="text-[11px] text-[#4D4D4D] mt-0.5">Mínimo privilegio, detección de roles Owner/Editor y allUsers.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer transition-colors sm:col-span-2">
                <input
                  type="checkbox"
                  checked={components.kmsAndSecrets}
                  onChange={e => setComponents({ ...components, kmsAndSecrets: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded-none accent-[#1B5FA6]"
                />
                <div>
                  <span className="text-xs font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Key size={14} className="text-[#1B5FA6]" /> Secret Manager & Cloud KMS
                  </span>
                  <p className="text-[11px] text-[#4D4D4D] mt-0.5">Políticas de rotación de secretos y llaves de cifrado soberanas.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Columna 3: Normativas y Disparo de la Auditoría */}
        <div className="space-y-6">
          {/* Card 3: Normativas a Evaluar */}
          <div className="bg-white rounded-none p-6 border-[1.5px] border-[#1A1A1A] shadow-none space-y-4">
            <div className="border-b border-[#ECECEC] pb-3">
              <h2 className="text-sm font-bold text-[#1A1A1A] flex items-center gap-2 font-sans">
                <Shield size={16} className="text-[#1B5FA6]" /> 3. Normas de Cumplimiento
              </h2>
              <p className="text-xs text-[#767676] mt-0.5">Selección simultánea multi-normativa</p>
            </div>

            {/* Presets Rápidos */}
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('360')}
                className="px-2.5 py-1 text-xs font-bold bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A] rounded-none transition-all flex items-center gap-1 cursor-pointer select-none"
              >
                <Zap size={12} /> ⚡ 360° Todo
              </button>
              <button
                type="button"
                onClick={() => applyPreset('mexico')}
                className="px-2.5 py-1 text-xs font-bold bg-[#FBF3C9] text-[#1A1A1A] border border-[#1A1A1A] rounded-none transition-all cursor-pointer select-none"
              >
                🇲🇽 México
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tech')}
                className="px-2.5 py-1 text-xs font-bold bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] rounded-none transition-all cursor-pointer select-none"
              >
                🛡️ Tech Suite
              </button>
            </div>

            {/* Lista de Casillas de Normas */}
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedStandards.includes('AI-SVS')}
                  onChange={() => toggleStandard('AI-SVS')}
                  className="rounded-none accent-[#1B5FA6]"
                />
                <span className="font-bold text-[#1A1A1A]">OWASP AI-SVS 1.0</span>
                <span className="ml-auto text-[10px] bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A] px-1.5 py-0.5 font-bold">Técnico</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedStandards.includes('ISO-42001')}
                  onChange={() => toggleStandard('ISO-42001')}
                  className="rounded-none accent-[#1B5FA6]"
                />
                <span className="font-bold text-[#1A1A1A]">ISO/IEC 42001:2023</span>
                <span className="ml-auto text-[10px] bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] px-1.5 py-0.5 font-bold">Gestión</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedStandards.includes('fw-lfpdppp-mex-2026')}
                  onChange={() => toggleStandard('fw-lfpdppp-mex-2026')}
                  className="rounded-none accent-[#1B5FA6]"
                />
                <span className="font-bold text-[#1A1A1A]">LFPDPPP México</span>
                <span className="ml-auto text-[10px] bg-[#FBF3C9] text-[#1A1A1A] border border-[#1A1A1A] px-1.5 py-0.5 font-bold">Privacidad</span>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-none border border-[#1A1A1A] hover:bg-[#FAFAFA] cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={selectedStandards.includes('fw-lfpc-mex-2026')}
                  onChange={() => toggleStandard('fw-lfpc-mex-2026')}
                  className="rounded-none accent-[#1B5FA6]"
                />
                <span className="font-bold text-[#1A1A1A]">LFPC México</span>
                <span className="ml-auto text-[10px] bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A] px-1.5 py-0.5 font-bold">Consumidor</span>
              </label>
            </div>

            {/* Nivel de Verificación */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5 font-sans">
                Nivel de Verificación Objetivo
              </label>
              <select
                value={targetLevel}
                onChange={e => setTargetLevel(e.target.value as VerificationLevel)}
                className="w-full bg-white border-[1.5px] border-[#1A1A1A] rounded-none px-3 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none"
              >
                <option value="L1">Nivel 1 (L1 - Esencial / Baseline)</option>
                <option value="L2">Nivel 2 (L2 - Estándar / Recomendado)</option>
                <option value="L3">Nivel 3 (L3 - Crítico / Alto Riesgo)</option>
              </select>
            </div>

            {/* Botón de Acción Principal (El amarillo señala!) */}
            <button
              type="button"
              onClick={handleStartLiveAudit}
              disabled={isAuditing}
              className="w-full bg-[#FBE017] hover:bg-[#ebd006] text-[#1A1A1A] font-bold py-3.5 px-4 rounded-none border-[1.5px] border-[#1A1A1A] text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-none select-none active:translate-y-0.5"
            >
              {isAuditing ? (
                <>
                  <Loader2 size={18} className="animate-spin text-[#1A1A1A]" />
                  <span>Inspeccionando y Auditando...</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="text-[#1A1A1A]" />
                  <span>Escanear y Auditar ({selectedStandards.length} Normas)</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Banner de Garantía Zero-Footprint */}
          <div className="bg-[#FAFAFA] border border-[#1A1A1A] rounded-none p-4 text-xs text-[#1A1A1A] space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-[#1A1A1A]">
              <Shield size={14} className="text-[#1B5FA6]" /> Garantía de Inviolabilidad
            </div>
            <p className="text-[11px] text-[#4D4D4D] leading-relaxed">
              Esta herramienta solo ejecuta peticiones <code>HTTP GET</code> al plano de control de Google Cloud. 
              <strong> Cero agentes, cero funciones, cero cambios</strong> en tu infraestructura.
            </p>
          </div>
        </div>
      </div>

      {/* Estado de Progreso en Vivo SSE */}
      {isAuditing && (
        <div className="bg-white rounded-none p-6 border-[1.5px] border-[#1A1A1A] shadow-none space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Loader2 size={20} className="animate-spin text-[#1B5FA6]" />
              <div>
                <h3 className="font-bold text-[#1A1A1A] text-sm">Inspección de Google Cloud en Tiempo Real</h3>
                <p className="text-xs text-[#1B5FA6] font-semibold">{progressMessage}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-[#1A1A1A] font-sans">{progressPercent}%</span>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-[#ECECEC] rounded-none h-3 border border-[#1A1A1A] overflow-hidden">
            <div 
              className="bg-[#1B5FA6] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Resumen de Telemetría Descubierta en Vivo */}
          {discoveredTelemetry && (
            <div className="mt-4 pt-4 border-t border-[#ECECEC] grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]">
                <span className="text-[10px] text-[#767676] font-bold uppercase">Buckets Storage</span>
                <span className="block text-lg font-bold text-[#1A1A1A]">{discoveredTelemetry.resources.buckets.length}</span>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]">
                <span className="text-[10px] text-[#767676] font-bold uppercase">Servicios Cloud Run</span>
                <span className="block text-lg font-bold text-[#1A1A1A]">{discoveredTelemetry.resources.cloudRunServices.length}</span>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]">
                <span className="text-[10px] text-[#767676] font-bold uppercase">Vertex Endpoints</span>
                <span className="block text-lg font-bold text-[#1A1A1A]">{discoveredTelemetry.resources.vertexEndpoints.length}</span>
              </div>
              <div className="bg-[#FAFAFA] p-3 rounded-none border border-[#1A1A1A]">
                <span className="text-[10px] text-[#767676] font-bold uppercase">Hallazgos IAM</span>
                <span className="block text-lg font-bold text-[#1A1A1A]">{discoveredTelemetry.resources.iamFindings.length}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mensaje de Error */}
      {errorMsg && (
        <div className="bg-[#FBF3C9] border-[1.5px] border-[#1A1A1A] rounded-none p-4 flex items-start gap-3 text-[#1A1A1A]">
          <AlertTriangle size={20} className="text-[#1A1A1A] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Error al ejecutar la auditoría en vivo</h4>
            <p className="text-xs text-[#4D4D4D] mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
