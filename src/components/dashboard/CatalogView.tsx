import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { StandardChapter, CustomFramework } from '../../types';
import { aisvsDatabaseSeed } from '../../lib/aisvsData';
import { iso42001DatabaseSeed } from '../../lib/iso42001Data';
import { 
  Database, 
  Loader2, 
  UploadCloud, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Scale, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  BookOpen, 
  Building2
} from 'lucide-react';
import { DivisionHeader } from '../layout/BrandAssets';

interface CatalogViewProps {
  onAuditWithFramework?: (frameworkId: string) => void;
}

export function CatalogView({ onAuditWithFramework }: CatalogViewProps = {}) {
  const [activeTab, setActiveTab] = useState<'AI-SVS' | 'ISO-42001' | 'CUSTOM'>('AI-SVS');
  const [chapters, setChapters] = useState<StandardChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // BYOF (Bring Your Own Framework) state
  const [customFrameworks, setCustomFrameworks] = useState<CustomFramework[]>([]);
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string | null>(null);
  const [loadingFrameworks, setLoadingFrameworks] = useState(false);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);

  // Ingestion Modal Form State
  const [ingestForm, setIngestForm] = useState({
    name: '',
    shortCode: '',
    jurisdiction: '',
    description: '',
    granularity: 'standard' as 'standard' | 'detailed',
    rawText: ''
  });
  const [ingestFiles, setIngestFiles] = useState<File[]>([]);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestProgress, setIngestProgress] = useState<{ stage: number; totalStages: number; message: string; percent: number } | null>(null);
  const [ingestError, setIngestError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCatalog = async (standard: 'AI-SVS' | 'ISO-42001') => {
    setLoading(true);
    try {
      const collectionName = standard === 'ISO-42001' ? 'standards_iso42001' : 'standards_aisvs';
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(doc => doc.data() as StandardChapter);
      if (data && data.length > 0) {
        data.sort((a, b) => a.order - b.order);
        setChapters(data);
      } else {
        const seedData = standard === 'ISO-42001' ? iso42001DatabaseSeed : aisvsDatabaseSeed;
        setChapters(seedData);
      }
    } catch (error) {
      console.warn("Error fetching catalog from Firestore, using local seeds:", error);
      const seedData = standard === 'ISO-42001' ? iso42001DatabaseSeed : aisvsDatabaseSeed;
      setChapters(seedData);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomFrameworks = async () => {
    setLoadingFrameworks(true);
    try {
      const res = await fetch('/api/frameworks');
      if (res.ok) {
        const data: CustomFramework[] = await res.json();
        setCustomFrameworks(data);
        if (data.length > 0 && !selectedFrameworkId) {
          setSelectedFrameworkId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching custom frameworks:', err);
    } finally {
      setLoadingFrameworks(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'CUSTOM') {
      fetchCustomFrameworks();
    } else {
      fetchCatalog(activeTab);
    }
  }, [activeTab]);

  const handleSeedDatabase = async () => {
    if (activeTab === 'CUSTOM') return;
    setSeeding(true);
    try {
      const collectionName = activeTab === 'ISO-42001' ? 'standards_iso42001' : 'standards_aisvs';
      const seedData = activeTab === 'ISO-42001' ? iso42001DatabaseSeed : aisvsDatabaseSeed;
      
      for (const chapter of seedData) {
        await setDoc(doc(db, collectionName, chapter.chapterId), chapter);
      }
      await fetchCatalog(activeTab);
    } catch (error) {
      console.error("Error seeding database:", error);
    } finally {
      setSeeding(false);
    }
  };

  const handleDeleteFramework = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el marco regulatorio "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/frameworks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomFrameworks(prev => prev.filter(f => f.id !== id));
        if (selectedFrameworkId === id) {
          const remaining = customFrameworks.filter(f => f.id !== id);
          setSelectedFrameworkId(remaining.length > 0 ? remaining[0].id : null);
        }
      } else {
        const err = await res.json();
        alert(`Error al eliminar: ${err.error || 'Error desconocido'}`);
      }
    } catch (err: any) {
      console.error('Error deleting framework:', err);
      alert('Error de conexión al eliminar el marco.');
    }
  };

  const handleStartIngestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ingestFiles.length === 0 && (!ingestForm.rawText || ingestForm.rawText.trim().length < 50)) {
      setIngestError('Debes subir al menos un archivo (PDF, DOCX, TXT, MD) o pegar un texto de al menos 50 caracteres.');
      return;
    }

    setIsIngesting(true);
    setIngestError(null);
    setIngestProgress({
      stage: 1,
      totalStages: 4,
      message: 'Preparando documentos e iniciando descomposición con IA...',
      percent: 10
    });

    try {
      const data = new FormData();
      data.append('name', ingestForm.name);
      data.append('shortCode', ingestForm.shortCode);
      data.append('jurisdiction', ingestForm.jurisdiction);
      data.append('description', ingestForm.description);
      data.append('granularity', ingestForm.granularity);
      data.append('rawText', ingestForm.rawText);

      ingestFiles.forEach(f => {
        data.append('files', f);
      });

      const res = await fetch('/api/frameworks/ingest', {
        method: 'POST',
        headers: {
          'Accept': 'text/event-stream'
        },
        body: data
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Error en el servidor al descomponer el marco.');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Flujo de respuesta no disponible');

      const decoder = new TextDecoder();
      let buffer = '';
      let createdFramework: CustomFramework | null = null;

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
                setIngestProgress({
                  stage: event.stage,
                  totalStages: event.totalStages,
                  message: event.message,
                  percent: event.percent
                });
              } else if (event.type === 'result') {
                createdFramework = event.data;
              } else if (event.type === 'error') {
                throw new Error(event.error);
              }
            } catch (pErr: any) {
              if (pErr.message && !pErr.message.includes('JSON')) {
                throw pErr;
              }
            }
          }
        }
      }

      if (!createdFramework) {
        throw new Error('No se recibió la confirmación del marco descompuesto.');
      }

      // Add to list and select
      setCustomFrameworks(prev => [createdFramework!, ...prev]);
      setSelectedFrameworkId(createdFramework.id);
      setIsIngestModalOpen(false);
      setIngestForm({
        name: '',
        shortCode: '',
        jurisdiction: '',
        description: '',
        granularity: 'standard',
        rawText: ''
      });
      setIngestFiles([]);
    } catch (err: any) {
      console.error('Ingestion error:', err);
      setIngestError(err.message || 'Error al procesar la regulación con IA.');
    } finally {
      setIsIngesting(false);
      setIngestProgress(null);
    }
  };

  const selectedCustomFramework = customFrameworks.find(f => f.id === selectedFrameworkId);

  return (
    <div className="p-8 h-full overflow-y-auto bg-white text-[#1A1A1A] flex flex-col">
      {/* Official Division Header */}
      <DivisionHeader
        title={activeTab === 'CUSTOM' 
          ? 'Leyes, Regulaciones y Políticas (BYOF)'
          : activeTab === 'ISO-42001' 
          ? 'Catálogo AegisAI ISO/IEC 42001:2023' 
          : 'Catálogo AegisAI OWASP AI-SVS v1.0'}
        subtitle={activeTab === 'CUSTOM'
          ? 'Motor de Ingesta y Descomposición Universal: carga cualquier ley externa o política interna y desagrégala en controles auditables.'
          : activeTab === 'ISO-42001'
          ? 'Sistema de Gestión de Inteligencia Artificial (AIMS) operacionalizado en controles técnicos.'
          : 'Estándar de Verificación de Seguridad de Aplicaciones de IA OWASP (Niveles L1, L2 y L3).'}
        actions={
          <div className="flex items-center gap-2">
            {activeTab === 'CUSTOM' ? (
              <button
                onClick={() => setIsIngestModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FBE017] text-[#1A1A1A] rounded-none font-bold text-xs border-[1.5px] border-[#1A1A1A] hover:bg-[#ebd009] transition-colors"
              >
                <Plus size={16} />
                Ingestar Nueva Ley o Política
              </button>
            ) : (
              chapters.length === 0 && !loading && (
                <button 
                  onClick={handleSeedDatabase}
                  disabled={seeding}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1B5FA6] text-white rounded-none font-bold text-xs border-[1.5px] border-[#1A1A1A] hover:bg-[#164F86] transition-opacity disabled:opacity-50"
                >
                  {seeding ? <Loader2 className="animate-spin" size={16} /> : <Database size={16} />}
                  Inicializar Catálogo (Seed)
                </button>
              )
            )}
          </div>
        }
      />

      {/* Normative Standard Navigation Tabs */}
      <div className="mb-6 flex space-x-2 border-b-[1.5px] border-[#1A1A1A] pb-3">
        <button
          className={`py-2 px-4 font-bold text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-2 ${
            activeTab === 'AI-SVS' 
              ? 'bg-[#1B5FA6] text-white' 
              : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
          }`}
          onClick={() => setActiveTab('AI-SVS')}
        >
          <ShieldCheck size={14} />
          OWASP AI-SVS
        </button>
        <button
          className={`py-2 px-4 font-bold text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-2 ${
            activeTab === 'ISO-42001' 
              ? 'bg-[#1B5FA6] text-white' 
              : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
          }`}
          onClick={() => setActiveTab('ISO-42001')}
        >
          <Layers size={14} />
          ISO/IEC 42001
        </button>
        <button
          className={`py-2 px-4 font-bold text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-colors flex items-center gap-2 ${
            activeTab === 'CUSTOM' 
              ? 'bg-[#D9EBF7] text-[#1B5FA6]' 
              : 'bg-white text-[#1A1A1A] hover:bg-[#ECECEC]'
          }`}
          onClick={() => setActiveTab('CUSTOM')}
        >
          <Scale size={14} />
          Leyes y Políticas (BYOF)
          {customFrameworks.length > 0 && (
            <span className="ml-1 text-[10px] bg-white text-[#1B5FA6] border border-[#1A1A1A] font-bold px-1.5 py-0.2 rounded-none">
              {customFrameworks.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      {activeTab === 'CUSTOM' ? (
        /* BYOF Custom Frameworks View */
        loadingFrameworks ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 py-20">
            <Loader2 className="animate-spin mr-2" /> Cargando marcos y leyes ingestadas...
          </div>
        ) : customFrameworks.length === 0 ? (
          <div className="text-center py-16 border-[1.5px] border-[#1A1A1A] rounded-none bg-[#FBF3C9] text-[#1A1A1A] space-y-4">
            <Scale className="mx-auto text-[#1A1A1A]" size={48} />
            <div>
              <h3 className="text-base font-extrabold text-[#1A1A1A] mb-1">Ninguna Ley o Política Ingestada</h3>
              <p className="text-xs max-w-lg mx-auto text-[#1A1A1A]/80 leading-relaxed">
                AegisAI te permite incorporar cualquier marco normativo (por ejemplo: la <strong>Ley de IA de la UE</strong>, la <strong>Circular de IA de la CNBV</strong> o políticas internas de tu organización). Sube el documento original y la IA lo descompondrá en capítulos técnicos y controles auditables con niveles L1, L2 y L3.
              </p>
            </div>
            <button
              onClick={() => setIsIngestModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FBE017] text-[#1A1A1A] font-bold text-xs rounded-none border-[1.5px] border-[#1A1A1A] hover:bg-[#ebd009] transition-colors"
            >
              <UploadCloud size={16} />
              Ingestar Primera Regulación
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Framework Selector Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customFrameworks.map((fw) => {
                const isSelected = fw.id === selectedFrameworkId;
                return (
                  <div
                    key={fw.id}
                    onClick={() => setSelectedFrameworkId(fw.id)}
                    className={`cursor-pointer p-4 rounded-none border-[1.5px] border-[#1A1A1A] text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#D9EBF7] border-[2px]'
                        : 'bg-white hover:bg-[#ECECEC]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-wider bg-white text-[#1A1A1A] border border-[#1A1A1A]">
                          {fw.shortCode}
                        </span>
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1B5FA6]" />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFramework(fw.id, fw.name);
                            }}
                            title="Eliminar este marco"
                            className="text-[#1A1A1A]/50 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-extrabold text-sm text-[#1A1A1A] mb-1 leading-snug">{fw.name}</h3>
                      <p className="text-xs text-[#1A1A1A]/70 line-clamp-2 mb-3">{fw.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1A1A1A]/15 flex items-center justify-between text-[10px] text-[#1A1A1A]/70 font-bold">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} className="text-[#1A1A1A]" />
                        {fw.jurisdiction}
                      </span>
                      <span>
                        <strong>{fw.totalChapters}</strong> Cap. / <strong>{fw.totalControls}</strong> Controles
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Framework Chapters & Controls Breakdown */}
            {selectedCustomFramework && (
              <div className="space-y-6 pt-2">
                <div className="p-5 bg-[#D9EBF7] border-[1.5px] border-[#1A1A1A] text-[#1A1A1A] rounded-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded-none border border-[#1A1A1A]">
                        {selectedCustomFramework.shortCode}
                      </span>
                      <span className="text-xs text-[#1A1A1A]">
                        Jurisdicción: <strong>{selectedCustomFramework.jurisdiction}</strong>
                      </span>
                    </div>
                    <h2 className="text-lg font-extrabold text-[#1A1A1A]">{selectedCustomFramework.name}</h2>
                    <p className="text-xs text-[#1A1A1A]/80 mt-1 max-w-3xl">
                      {selectedCustomFramework.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#1B5FA6]">
                        {selectedCustomFramework.totalControls}
                      </span>
                      <span className="text-xs text-[#1A1A1A] block font-bold">Controles Técnicos Auditables</span>
                    </div>
                    {onAuditWithFramework && (
                      <button
                        type="button"
                        onClick={() => onAuditWithFramework(selectedCustomFramework.id)}
                        className="px-4 py-2 bg-[#FBE017] text-[#1A1A1A] hover:bg-[#ebd009] font-bold text-xs rounded-none border-[1.5px] border-[#1A1A1A] transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <ShieldCheck size={16} className="text-[#1A1A1A]" />
                        Auditar con este Marco
                      </button>
                    )}
                  </div>
                </div>

                {/* Chapter Accordions */}
                <div className="space-y-4">
                  {selectedCustomFramework.chapters.map((chapter) => (
                    <div key={chapter.chapterId} className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="font-bold text-sm text-[#1B5FA6] bg-[#D9EBF7] border border-[#1A1A1A] px-2.5 py-1 rounded-none shrink-0">
                          {chapter.chapterId}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-base text-[#1A1A1A] mb-1">{chapter.title}</h3>
                          <p className="text-xs text-[#1A1A1A]/70 mb-2 leading-relaxed">{chapter.fullDescription}</p>
                        </div>
                      </div>

                      {chapter.controls && chapter.controls.length > 0 && (
                        <div className="mt-4 border-[1.5px] border-[#1A1A1A] rounded-none overflow-hidden bg-white">
                          <div className="px-4 py-2 border-b-[1.5px] border-[#1A1A1A] bg-[#ECECEC] font-bold text-xs text-[#1A1A1A] uppercase tracking-wider flex justify-between">
                            <span>Controles Operacionalizados ({chapter.controls.length})</span>
                            <span>Criterios de Verificación y Remediación Técnica</span>
                          </div>
                          <div className="divide-y divide-[#1A1A1A]/10">
                            {chapter.controls.map(control => (
                              <div key={control.id} className="p-4 flex flex-col md:flex-row gap-4 hover:bg-[#ECECEC]/30 transition-colors">
                                <div className="md:w-1/3 shrink-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#ECECEC] border border-[#1A1A1A] px-2 py-0.5 rounded-none">{control.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider border border-[#1A1A1A] ${
                                      control.level === 'L1' ? 'bg-[#D9EBF7] text-[#1B5FA6]' :
                                      control.level === 'L2' ? 'bg-[#FBF3C9] text-[#1A1A1A]' :
                                      'bg-[#ECECEC] text-[#1A1A1A]'
                                    }`}>
                                      Nivel {control.level}
                                    </span>
                                  </div>
                                  <h4 className="font-bold text-xs text-[#1A1A1A] mb-1">{control.title}</h4>
                                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed mb-2">{control.description}</p>
                                  {control.objective && (
                                    <div className="text-[10px] text-[#1A1A1A] bg-[#ECECEC]/50 p-2 rounded-none border border-[#1A1A1A]/30">
                                      <strong>Objetivo:</strong> {control.objective}
                                    </div>
                                  )}
                                </div>
                                <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                  <div className="p-3 bg-white border border-[#1A1A1A] rounded-none">
                                    <span className="font-bold text-[10px] uppercase text-[#1A1A1A]/60 block mb-1">Guía de Verificación Técnica</span>
                                    <p className="text-[#1A1A1A] leading-relaxed">{control.verificationGuidance}</p>
                                  </div>
                                  <div className="p-3 bg-[#FBF3C9]/40 border border-[#1A1A1A] rounded-none">
                                    <span className="font-bold text-[10px] uppercase text-[#1A1A1A] block mb-1">Guía de Remediación Técnica</span>
                                    <p className="text-[#1A1A1A] leading-relaxed">{control.remediationGuidance}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Standard OWASP or ISO View */
        loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 py-20">
            <Loader2 className="animate-spin mr-2" /> Cargando catálogo de la base de datos...
          </div>
        ) : chapters.length === 0 && !seeding ? (
          <div className="text-center py-16 border-[1.5px] border-[#1A1A1A] rounded-none bg-[#ECECEC]/40 text-[#1A1A1A]">
            <Database className="mx-auto mb-4 opacity-50" size={48} />
            <h3 className="text-base font-bold mb-1">Base de datos vacía</h3>
            <p className="text-xs max-w-md mx-auto text-[#1A1A1A]/70">
              La colección de este estándar no contiene capítulos. Haz clic en "Inicializar Catálogo (Seed)" para poblar los controles.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div key={chapter.chapterId} className="bg-white border-[1.5px] border-[#1A1A1A] rounded-none p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="font-bold text-sm text-[#1B5FA6] bg-[#D9EBF7] border border-[#1A1A1A] px-2.5 py-1 rounded-none shrink-0">
                    {chapter.chapterId}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-[#1A1A1A] mb-1">{chapter.title}</h3>
                    <p className="text-xs text-[#1A1A1A]/70 mb-2 leading-relaxed">{chapter.fullDescription}</p>
                  </div>
                </div>

                {chapter.controls && chapter.controls.length > 0 && (
                  <div className="mt-4 border-[1.5px] border-[#1A1A1A] rounded-none overflow-hidden bg-white">
                    <div className="px-4 py-2 border-b-[1.5px] border-[#1A1A1A] bg-[#ECECEC] font-bold text-xs text-[#1A1A1A] uppercase tracking-wider">
                      Controles Detallados L1 - L3
                    </div>
                    <div className="divide-y divide-[#1A1A1A]/10">
                      {chapter.controls.map(control => (
                        <div key={control.id} className="p-4 flex flex-col md:flex-row gap-4 hover:bg-[#ECECEC]/30 transition-colors">
                          <div className="md:w-1/3 shrink-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#ECECEC] border border-[#1A1A1A] px-2 py-0.5 rounded-none">{control.id}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-none font-bold uppercase tracking-wider border border-[#1A1A1A] ${
                                control.level === 'L1' ? 'bg-[#D9EBF7] text-[#1B5FA6]' :
                                control.level === 'L2' ? 'bg-[#FBF3C9] text-[#1A1A1A]' :
                                'bg-[#ECECEC] text-[#1A1A1A]'
                              }`}>
                                Nivel {control.level}
                              </span>
                            </div>
                            <h4 className="font-bold text-xs text-[#1A1A1A] mb-1">{control.title}</h4>
                            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed">{control.description}</p>
                          </div>
                          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-white border border-[#1A1A1A] rounded-none">
                              <span className="font-bold text-[10px] uppercase text-[#1A1A1A]/60 block mb-1">Guía de Verificación</span>
                              <p className="text-[#1A1A1A] leading-relaxed">{control.verificationGuidance}</p>
                            </div>
                            <div className="p-3 bg-[#FBF3C9]/40 border border-[#1A1A1A] rounded-none">
                              <span className="font-bold text-[10px] uppercase text-[#1A1A1A] block mb-1">Guía de Remediación</span>
                              <p className="text-[#1A1A1A] leading-relaxed">{control.remediationGuidance}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Ingestion Modal Dialog */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-none border-[2px] border-[#1A1A1A] max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="px-6 py-4 border-b-[1.5px] border-[#1A1A1A] flex items-center justify-between sticky top-0 bg-[#ECECEC] z-10">
              <div>
                <h3 className="text-sm font-extrabold text-[#1A1A1A] flex items-center gap-2">
                  <Scale className="text-[#1B5FA6]" size={18} />
                  Ingestar y Descomponer Nueva Regulación o Política
                </h3>
                <p className="text-[10px] text-[#1A1A1A]/70 mt-0.5">
                  Universal Normative Decomposer Engine • AegisAI
                </p>
              </div>
              {!isIngesting && (
                <button
                  onClick={() => setIsIngestModalOpen(false)}
                  className="p-1 border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#ECECEC] transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <form onSubmit={handleStartIngestion} className="p-6 space-y-4 flex-1">
              {ingestError && (
                <div className="p-3 bg-[#FBF3C9] border-[1.5px] border-[#1A1A1A] rounded-none text-xs text-[#1A1A1A] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Error en la descomposición:</span> {ingestError}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Nombre del Marco o Ley *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isIngesting}
                    placeholder="Ej. Ley de IA de la Unión Europea (EU AI Act)"
                    value={ingestForm.name}
                    onChange={(e) => setIngestForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Código Corto / Acrónimo
                  </label>
                  <input
                    type="text"
                    disabled={isIngesting}
                    placeholder="Ej. EU-AIACT o CNBV-IA"
                    value={ingestForm.shortCode}
                    onChange={(e) => setIngestForm(prev => ({ ...prev, shortCode: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Jurisdicción u Organismo Emisor
                  </label>
                  <input
                    type="text"
                    disabled={isIngesting}
                    placeholder="Ej. Unión Europea o CNBV México"
                    value={ingestForm.jurisdiction}
                    onChange={(e) => setIngestForm(prev => ({ ...prev, jurisdiction: e.target.value }))}
                    className="w-full text-xs px-3 py-2 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                    Granularidad de Descomposición
                  </label>
                  <select
                    disabled={isIngesting}
                    value={ingestForm.granularity}
                    onChange={(e) => setIngestForm(prev => ({ ...prev, granularity: e.target.value as any }))}
                    className="w-full text-xs px-3 py-2 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none"
                  >
                    <option value="standard">Estándar (3 a 6 capítulos sustantivos)</option>
                    <option value="detailed">Detallada (5 a 8 capítulos de alta granularidad)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Descripción u Objetivo de la Regulación (Opcional)
                </label>
                <input
                  type="text"
                  disabled={isIngesting}
                  placeholder="Breve resumen del alcance o propósito normativo"
                  value={ingestForm.description}
                  onChange={(e) => setIngestForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-xs px-3 py-2 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none"
                />
              </div>

              {/* File Attachment Drag & Drop */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  Documento Normativo (PDF, DOCX, TXT, Markdown)
                </label>
                <div 
                  onClick={() => !isIngesting && fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#1A1A1A] rounded-none p-4 text-center cursor-pointer transition-colors bg-[#ECECEC]/30 hover:bg-[#D9EBF7]/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    disabled={isIngesting}
                    accept=".pdf,.docx,.doc,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        setIngestFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <UploadCloud className="mx-auto text-[#1B5FA6] mb-1" size={28} />
                  <p className="text-xs font-bold text-[#1A1A1A]">
                    Haz clic o arrastra los archivos de la ley o política aquí
                  </p>
                  <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
                    Soporta PDFs oficiales, documentos Word y textos normativos de hasta 50MB
                  </p>
                </div>

                {ingestFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {ingestFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-[#ECECEC] rounded-none text-xs border border-[#1A1A1A]">
                        <span className="font-bold text-[#1A1A1A] truncate max-w-md">{file.name}</span>
                        <button
                          type="button"
                          disabled={isIngesting}
                          onClick={() => setIngestFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-600 text-xs font-bold hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Paste Text Fallback */}
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                  O Pega el Texto Normativo o Política Directamente
                </label>
                <textarea
                  rows={4}
                  disabled={isIngesting}
                  placeholder="Pega aquí el articulado, títulos, circulares o lineamientos normativos..."
                  value={ingestForm.rawText}
                  onChange={(e) => setIngestForm(prev => ({ ...prev, rawText: e.target.value }))}
                  className="w-full text-xs p-3 border-[1.5px] border-[#1A1A1A] rounded-none bg-white text-[#1A1A1A] focus:outline-none font-mono"
                />
              </div>

              {/* Progress State */}
              {isIngesting && ingestProgress && (
                <div className="p-3 bg-[#D9EBF7] border-[1.5px] border-[#1A1A1A] rounded-none space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1B5FA6]">
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin text-[#1B5FA6]" size={16} />
                      {ingestProgress.message}
                    </span>
                    <span>{ingestProgress.percent}%</span>
                  </div>
                  <div className="w-full bg-white border border-[#1A1A1A] rounded-none h-2.5 overflow-hidden">
                    <div 
                      className="bg-[#1B5FA6] h-full transition-all duration-300"
                      style={{ width: `${ingestProgress.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div className="pt-3 border-t-[1.5px] border-[#1A1A1A] flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isIngesting}
                  onClick={() => setIsIngestModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:bg-[#ECECEC] border-[1.5px] border-[#1A1A1A] rounded-none transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isIngesting}
                  className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-[#1A1A1A] bg-[#FBE017] hover:bg-[#ebd009] disabled:opacity-50 rounded-none border-[1.5px] border-[#1A1A1A] transition-colors"
                >
                  {isIngesting ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Descomponiendo con IA...
                    </>
                  ) : (
                    <>
                      <Scale size={14} />
                      Descomponer e Ingestar Marco
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

