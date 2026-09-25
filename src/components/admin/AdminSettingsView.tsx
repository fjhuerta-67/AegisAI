import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Badge } from '../ui/Badge';
import { Textarea } from '../ui/Textarea';
import { 
  Key, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Server,
  Lock,
  Globe,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { LLMProviderType, AdminSettingsData, AdminTestResult } from '../../types';
import { DivisionHeader } from '../layout/BrandAssets';

export function AdminSettingsView() {
  const [settings, setSettings] = useState<AdminSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  
  // Selected Provider
  const [provider, setProvider] = useState<LLMProviderType>('gemini');

  // Gemini specific fields
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-3.8-flash');
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // OpenAI / OpenRouter / Custom specific fields
  const [openaiApiKeyInput, setOpenaiApiKeyInput] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('');
  const [openaiModel, setOpenaiModel] = useState('');
  const [customModelId, setCustomModelId] = useState('');
  const [isCustomModel, setIsCustomModel] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [customHeadersInput, setCustomHeadersInput] = useState('');

  // Hyperparameters & Routing
  const [temperature, setTemperature] = useState<number>(0.0);
  const [maxTokens, setMaxTokens] = useState<number>(8192);
  const [fallbackModel, setFallbackModel] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Feedback
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testResult, setTestResult] = useState<AdminTestResult | null>(null);

  const getAdminHeaders = (): HeadersInit => {
    const token = localStorage.getItem('aisvs_admin_token') || 'aisvs_admin_sec_2026_9f8d1c4e7b2a';
    return {
      'Content-Type': 'application/json',
      'x-admin-token': token
    };
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: getAdminHeaders()
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: AdminSettingsData = await res.json();
      setSettings(data);
      
      if (data.provider) setProvider(data.provider);
      if (data.preferredModel) setGeminiModel(data.preferredModel);
      if (data.openaiBaseUrl) setOpenaiBaseUrl(data.openaiBaseUrl);
      if (data.openaiModel) {
        setOpenaiModel(data.openaiModel);
        setCustomModelId(data.openaiModel);
      }
      if (typeof data.temperature === 'number') setTemperature(data.temperature);
      if (typeof data.maxTokens === 'number') setMaxTokens(data.maxTokens);
      if (data.fallbackModel) setFallbackModel(data.fallbackModel);
      if (data.customHeaders && Object.keys(data.customHeaders).length > 0) {
        setCustomHeadersInput(JSON.stringify(data.customHeaders, null, 2));
      }
    } catch (err: any) {
      console.error('Error fetching admin settings:', err);
      setMessage({ type: 'error', text: 'Error al consultar la configuración actual del servidor.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSelectProvider = (newProvider: LLMProviderType) => {
    setProvider(newProvider);
    setTestResult(null);
    setMessage(null);

    if (newProvider === 'openrouter') {
      if (!openaiBaseUrl) setOpenaiBaseUrl('https://openrouter.ai/api/v1');
      if (!openaiModel || openaiModel === 'gpt-4o' || openaiModel.startsWith('gemini')) {
        setOpenaiModel('anthropic/claude-3.7-sonnet');
        setIsCustomModel(false);
      }
    } else if (newProvider === 'openai') {
      if (!openaiBaseUrl || openaiBaseUrl.includes('openrouter')) setOpenaiBaseUrl('https://api.openai.com/v1');
      if (!openaiModel || openaiModel.includes('/') || openaiModel.startsWith('gemini')) {
        setOpenaiModel('gpt-4o');
        setIsCustomModel(false);
      }
    } else if (newProvider === 'custom_openai_compatible') {
      if (!openaiBaseUrl || openaiBaseUrl.startsWith('https://api.openai') || openaiBaseUrl.startsWith('https://openrouter')) {
        setOpenaiBaseUrl('http://localhost:11434/v1');
      }
      if (!openaiModel || openaiModel.startsWith('gemini')) {
        setOpenaiModel('llama3.3:latest');
        setCustomModelId('llama3.3:latest');
        setIsCustomModel(true);
      }
    }
  };

  const getEffectiveModel = (): string => {
    if (provider === 'gemini') return geminiModel;
    return isCustomModel ? customModelId : openaiModel;
  };

  const parseCustomHeaders = (): Record<string, string> | undefined => {
    if (!customHeadersInput.trim()) return undefined;
    try {
      return JSON.parse(customHeadersInput);
    } catch (e) {
      throw new Error('El campo Encabezados HTTP debe ser un objeto JSON válido (ej: {"X-Title": "AegisAI"}).');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      let parsedHeaders: Record<string, string> | undefined = undefined;
      try {
        parsedHeaders = parseCustomHeaders();
      } catch (headerErr: any) {
        setMessage({ type: 'error', text: headerErr.message });
        setSaving(false);
        return;
      }

      const effectiveModelName = getEffectiveModel();

      const payload: any = {
        provider,
        preferredModel: geminiModel,
        openaiBaseUrl: openaiBaseUrl.trim(),
        openaiModel: effectiveModelName.trim(),
        customHeaders: parsedHeaders,
        temperature,
        maxTokens,
        fallbackModel: fallbackModel.trim()
      };

      if (geminiApiKeyInput.trim()) {
        payload.apiKey = geminiApiKeyInput.trim();
      }
      if (openaiApiKeyInput.trim()) {
        payload.openaiApiKey = openaiApiKeyInput.trim();
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al guardar la configuración');
      }

      setMessage({ type: 'success', text: `Configuración de ${provider.toUpperCase()} guardada correctamente y aplicada en caliente.` });
      setGeminiApiKeyInput('');
      setOpenaiApiKeyInput('');
      fetchSettings();
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setMessage({ type: 'error', text: err.message || 'Error al guardar la configuración.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      let parsedHeaders: Record<string, string> | undefined = undefined;
      try {
        parsedHeaders = parseCustomHeaders();
      } catch (headerErr: any) {
        setTestResult({ ok: false, error: headerErr.message });
        setTesting(false);
        return;
      }

      const effectiveModelName = getEffectiveModel();
      const payload: any = {
        provider,
        model: effectiveModelName
      };

      if (provider === 'gemini') {
        if (geminiApiKeyInput.trim()) payload.apiKey = geminiApiKeyInput.trim();
      } else {
        if (openaiApiKeyInput.trim()) payload.apiKey = openaiApiKeyInput.trim();
        if (openaiBaseUrl.trim()) payload.baseUrl = openaiBaseUrl.trim();
        if (parsedHeaders) payload.customHeaders = parsedHeaders;
      }

      const res = await fetch('/api/admin/test-connection', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        ok: false,
        error: err.message || 'No se pudo contactar con el endpoint de prueba.'
      });
    } finally {
      setTesting(false);
    }
  };

  const getProviderNameBadge = () => {
    switch (settings?.provider) {
      case 'gemini': return 'Google Gemini (Nativo)';
      case 'openrouter': return 'OpenRouter Multi-LLM';
      case 'openai': return 'OpenAI Directo';
      case 'custom_openai_compatible': return 'Endpoint Local / Proxy';
      default: return 'Google Gemini';
    }
  };


  return (
    <div className="p-6 max-w-6xl mx-auto flex-1 overflow-y-auto font-sans">
      {/* Division Header */}
      <DivisionHeader
        title="Configuración del Administrador"
        subtitle="Administración de proveedores de IA (Google Gemini, OpenRouter, OpenAI o Routers Locales/Privados) y parámetros de auditoría."
      />

      {/* Status Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
        <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-none border border-[#1A1A1A] ${settings?.isConfigured ? 'bg-[#D9EBF7] text-[#1B5FA6]' : 'bg-[#FBF3C9] text-[#8C1D18]'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Proveedor Activo</p>
              <div className="mt-1 flex items-center gap-2">
                {loading ? (
                  <span className="text-sm text-gray-500">Verificando...</span>
                ) : settings?.isConfigured ? (
                  <Badge variant="success" className="text-xs font-bold">{getProviderNameBadge()}</Badge>
                ) : (
                  <Badge variant="warning" className="text-xs">Sin Configurar</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-none border border-[#1A1A1A] bg-[#FBF3C9] text-[#1A1A1A]">
              <Key size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Clave Vigente</p>
              <div className="mt-1 font-mono text-sm text-[#1A1A1A]">
                {loading ? (
                  <span className="text-sm text-gray-500">Cargando...</span>
                ) : settings?.provider === 'gemini' ? (
                  settings?.maskedKey ? (
                    <span className="bg-[#ECECEC] px-2 py-0.5 rounded-none border border-[#1A1A1A] text-xs font-bold text-[#1A1A1A]">{settings.maskedKey}</span>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No configurada</span>
                  )
                ) : (
                  settings?.maskedOpenaiKey ? (
                    <span className="bg-[#ECECEC] px-2 py-0.5 rounded-none border border-[#1A1A1A] text-xs font-bold text-[#1A1A1A]">{settings.maskedOpenaiKey}</span>
                  ) : (
                    <span className="text-xs text-gray-500 italic">No requerida / ausente</span>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-none border border-[#1A1A1A] bg-[#ECECEC] text-[#1A1A1A]">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Modelo Principal</p>
              <div className="mt-1 font-mono text-xs text-[#1A1A1A] truncate max-w-[200px]" title={settings?.provider === 'gemini' ? settings?.preferredModel : settings?.openaiModel}>
                <span className="bg-[#ECECEC] px-2 py-0.5 rounded-none border border-[#1A1A1A] font-bold">
                  {settings?.provider === 'gemini' 
                    ? (settings?.preferredModel || 'gemini-3.8-flash') 
                    : (settings?.openaiModel || 'anthropic/claude-3.7-sonnet')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-none text-sm font-semibold flex items-center gap-3 border-[1.5px] border-[#1A1A1A] ${
          message.type === 'success' 
            ? 'bg-[#D9EBF7] text-[#1A1A1A]' 
            : 'bg-[#FBF3C9] text-[#8C1D18]'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={18} className="text-[#1B5FA6]" /> : <AlertTriangle size={18} className="text-[#8C1D18]" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <CardHeader className="border-b border-[#1A1A1A] pb-4">
              <CardTitle className="text-lg font-bold text-[#1A1A1A]">Seleccionar Motor y Proveedor de IA</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Elige el proveedor deseado. AegisAI adapta automáticamente los mensajes, el esquema JSON y los reintentos para cualquier proveedor.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Visual Provider Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleSelectProvider('gemini')}
                  className={`p-3.5 text-left rounded-none border-[1.5px] transition-all flex flex-col justify-between ${
                    provider === 'gemini'
                      ? 'border-[#1A1A1A] bg-[#D9EBF7] shadow-none ring-2 ring-[#1B5FA6]'
                      : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles size={20} className={provider === 'gemini' ? 'text-[#1B5FA6]' : 'text-gray-500'} />
                    {provider === 'gemini' && <Badge variant="default" className="text-[10px]">Activo</Badge>}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A1A]">Google Gemini</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">SDK Nativo (1M tokens)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('openrouter')}
                  className={`p-3.5 text-left rounded-none border-[1.5px] transition-all flex flex-col justify-between ${
                    provider === 'openrouter'
                      ? 'border-[#1A1A1A] bg-[#D9EBF7] shadow-none ring-2 ring-[#1B5FA6]'
                      : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Globe size={20} className={provider === 'openrouter' ? 'text-[#1B5FA6]' : 'text-gray-500'} />
                    {provider === 'openrouter' && <Badge variant="default" className="text-[10px]">Activo</Badge>}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A1A]">OpenRouter</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">Claude, GPT-4o, DeepSeek</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('openai')}
                  className={`p-3.5 text-left rounded-none border-[1.5px] transition-all flex flex-col justify-between ${
                    provider === 'openai'
                      ? 'border-[#1A1A1A] bg-[#D9EBF7] shadow-none ring-2 ring-[#1B5FA6]'
                      : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Zap size={20} className={provider === 'openai' ? 'text-[#1B5FA6]' : 'text-gray-500'} />
                    {provider === 'openai' && <Badge variant="default" className="text-[10px]">Activo</Badge>}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A1A]">OpenAI Directo</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">GPT-4o, GPT-4o-mini, o3</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectProvider('custom_openai_compatible')}
                  className={`p-3.5 text-left rounded-none border-[1.5px] transition-all flex flex-col justify-between ${
                    provider === 'custom_openai_compatible'
                      ? 'border-[#1A1A1A] bg-[#D9EBF7] shadow-none ring-2 ring-[#1B5FA6]'
                      : 'border-[#1A1A1A]/40 hover:border-[#1A1A1A] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Server size={20} className={provider === 'custom_openai_compatible' ? 'text-[#1B5FA6]' : 'text-gray-500'} />
                    {provider === 'custom_openai_compatible' && <Badge variant="default" className="text-[10px]">Activo</Badge>}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1A1A1A]">Local / Proxy</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">Ollama, vLLM, LiteLLM</p>
                  </div>
                </button>
              </div>

              {/* Form by Provider */}
              <form onSubmit={handleSaveSettings} className="space-y-5">
                {/* 1. Google Gemini Fields */}
                {provider === 'gemini' && (
                  <div className="space-y-4 p-4 bg-[#ECECEC]/30 rounded-none border-[1.5px] border-[#1A1A1A]">
                    <div>
                      <Label htmlFor="geminiApiKey">Clave de Google Gemini API (API Key)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="geminiApiKey"
                          type={showGeminiKey ? 'text' : 'password'}
                          placeholder={settings?.maskedKey ? `Vigente: ${settings.maskedKey}` : 'Introduce tu API Key (e.g. AIzaSy...)'}
                          value={geminiApiKeyInput}
                          onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                          className="pr-10 font-mono text-sm bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowGeminiKey(!showGeminiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showGeminiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        Dejar en blanco para conservar la clave actual ({settings?.maskedKey || 'ninguna'}).
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="geminiModelSelect">Modelo Preferido para Auditorías</Label>
                      <select
                        id="geminiModelSelect"
                        value={geminiModel}
                        onChange={(e) => setGeminiModel(e.target.value)}
                        className="w-full mt-1 border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-[var(--color-aegis-blue)] focus:outline-none"
                      >
                        <option value="gemini-3.8-flash">gemini-3.8-flash (Predeterminado - Alta velocidad y precisión)</option>
                        <option value="gemini-3.7-flash">gemini-3.7-flash (Fallback 1)</option>
                        <option value="gemini-3.6-flash">gemini-3.6-flash (Fallback 2)</option>
                        <option value="gemini-3.5-flash">gemini-3.5-flash (Fallback 3)</option>
                        <option value="gemini-3.1-pro">gemini-3.1-pro (Razonamiento profundo)</option>
                        <option value="gemini-3.5-pro">gemini-3.5-pro (Alta capacidad analítica)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 2. OpenRouter Fields */}
                {provider === 'openrouter' && (
                  <div className="space-y-4 p-4 bg-[#ECECEC]/30 rounded-none border-[1.5px] border-[#1A1A1A]">
                    <div>
                      <Label htmlFor="openrouterApiKey">Clave de OpenRouter (API Key)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="openrouterApiKey"
                          type={showOpenaiKey ? 'text' : 'password'}
                          placeholder={settings?.maskedOpenaiKey ? `Vigente: ${settings.maskedOpenaiKey}` : 'sk-or-v1-...'}
                          value={openaiApiKeyInput}
                          onChange={(e) => setOpenaiApiKeyInput(e.target.value)}
                          className="pr-10 font-mono text-sm bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1A1A1A]"
                        >
                          {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5">
                        Obtén tu clave en <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-[#1B5FA6] font-bold hover:underline">openrouter.ai/keys</a>.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="openrouterBaseUrl">URL Base del Endpoint</Label>
                      <Input
                        id="openrouterBaseUrl"
                        type="text"
                        value={openaiBaseUrl || 'https://openrouter.ai/api/v1'}
                        onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                        className="mt-1 font-mono text-sm bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="openrouterModelSelect">Modelo de Evaluación</Label>
                      <select
                        id="openrouterModelSelect"
                        value={isCustomModel ? 'custom' : openaiModel}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomModel(true);
                          } else {
                            setIsCustomModel(false);
                            setOpenaiModel(e.target.value);
                          }
                        }}
                        className="w-full mt-1 border-[1.5px] border-[#1A1A1A] rounded-none p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1B5FA6] focus:outline-none"
                      >
                        <option value="anthropic/claude-3.7-sonnet">anthropic/claude-3.7-sonnet (Recomendado - Excelente apego a normas)</option>
                        <option value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet (Alta precisión analítica)</option>
                        <option value="openai/gpt-4o">openai/gpt-4o (Líder multimodal)</option>
                        <option value="openai/gpt-4o-mini">openai/gpt-4o-mini (Ultra rápido y económico)</option>
                        <option value="deepseek/deepseek-r1">deepseek/deepseek-r1 (Razonamiento profundo)</option>
                        <option value="meta-llama/llama-3.3-70b-instruct">meta-llama/llama-3.3-70b-instruct (Open Source de alto rendimiento)</option>
                        <option value="google/gemini-2.5-flash">google/gemini-2.5-flash (vía OpenRouter)</option>
                        <option value="custom">Escribir identificador personalizado...</option>
                      </select>

                      {isCustomModel && (
                        <div className="mt-2">
                          <Input
                            placeholder="Introduce el ID del modelo (ej: mistralai/mistral-large-2411)"
                            value={customModelId}
                            onChange={(e) => setCustomModelId(e.target.value)}
                            className="font-mono text-sm bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. OpenAI Direct Fields */}
                {provider === 'openai' && (
                  <div className="space-y-4 p-4 bg-[#ECECEC]/30 rounded-none border-[1.5px] border-[#1A1A1A]">
                    <div>
                      <Label htmlFor="openaiApiKey">Clave de OpenAI (API Key)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="openaiApiKey"
                          type={showOpenaiKey ? 'text' : 'password'}
                          placeholder={settings?.maskedOpenaiKey ? `Vigente: ${settings.maskedOpenaiKey}` : 'sk-proj-...'}
                          value={openaiApiKeyInput}
                          onChange={(e) => setOpenaiApiKeyInput(e.target.value)}
                          className="pr-10 font-mono text-sm bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1A1A1A]"
                        >
                          {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1.5">
                        Obtén tu clave en <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-[#1B5FA6] font-bold hover:underline">platform.openai.com</a>.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="openaiBaseUrl">URL Base del Endpoint</Label>
                      <Input
                        id="openaiBaseUrl"
                        type="text"
                        value={openaiBaseUrl || 'https://api.openai.com/v1'}
                        onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                        className="mt-1 font-mono text-sm bg-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="openaiModelSelect">Modelo de Evaluación</Label>
                      <select
                        id="openaiModelSelect"
                        value={isCustomModel ? 'custom' : (openaiModel || 'gpt-4o')}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomModel(true);
                          } else {
                            setIsCustomModel(false);
                            setOpenaiModel(e.target.value);
                          }
                        }}
                        className="w-full mt-1 border-[1.5px] border-[#1A1A1A] rounded-none p-2.5 text-sm bg-white focus:ring-2 focus:ring-[#1B5FA6] focus:outline-none"
                      >
                        <option value="gpt-4o">gpt-4o (Predeterminado - Máxima precisión)</option>
                        <option value="gpt-4o-mini">gpt-4o-mini (Económico y rápido)</option>
                        <option value="o3-mini">o3-mini (Razonamiento de última generación)</option>
                        <option value="o1">o1 (Razonamiento exhaustivo)</option>
                        <option value="custom">Escribir identificador personalizado...</option>
                      </select>

                      {isCustomModel && (
                        <div className="mt-2">
                          <Input
                            placeholder="Introduce el ID de modelo (ej: gpt-4o-2024-11-20)"
                            value={customModelId}
                            onChange={(e) => setCustomModelId(e.target.value)}
                            className="font-mono text-sm bg-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Custom / Ollama / Local Fields */}
                {provider === 'custom_openai_compatible' && (
                  <div className="space-y-4 p-4 bg-[#ECECEC]/30 rounded-none border-[1.5px] border-[#1A1A1A]">
                    <div>
                      <Label htmlFor="customBaseUrl">URL Base del Endpoint OpenAI-Compatible</Label>
                      <Input
                        id="customBaseUrl"
                        type="text"
                        placeholder="http://localhost:11434/v1 (Ollama) o http://localhost:8000/v1 (LiteLLM/vLLM)"
                        value={openaiBaseUrl || 'http://localhost:11434/v1'}
                        onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                        className="mt-1 font-mono text-sm bg-white"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        Soporta cualquier backend compatible con la especificación <code>/v1/chat/completions</code>.
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="customApiKey">API Key o Token de Autorización (Opcional si es local)</Label>
                      <div className="relative mt-1">
                        <Input
                          id="customApiKey"
                          type={showOpenaiKey ? 'text' : 'password'}
                          placeholder={settings?.maskedOpenaiKey ? `Vigente: ${settings.maskedOpenaiKey}` : 'Opcional para Ollama/Local, requerido para proxies autenticados'}
                          value={openaiApiKeyInput}
                          onChange={(e) => setOpenaiApiKeyInput(e.target.value)}
                          className="pr-10 font-mono text-sm bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-[#1A1A1A]"
                        >
                          {showOpenaiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="customModelInput">Nombre / Identificador del Modelo</Label>
                      <Input
                        id="customModelInput"
                        placeholder="llama3.3:latest, qwen2.5-coder:32b, etc."
                        value={customModelId || openaiModel || 'llama3.3:latest'}
                        onChange={(e) => {
                          setCustomModelId(e.target.value);
                          setOpenaiModel(e.target.value);
                          setIsCustomModel(true);
                        }}
                        className="mt-1 font-mono text-sm bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Advanced Settings Accordion */}
                <div className="border-[1.5px] border-[#1A1A1A] rounded-none overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full px-4 py-3 bg-[#ECECEC]/40 hover:bg-[#ECECEC] flex items-center justify-between text-left text-xs font-bold text-[#1A1A1A] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sliders size={16} className="text-[#1B5FA6]" />
                      Hiperparámetros y Resiliencia (Temperatura, Tokens, Fallback)
                    </span>
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {showAdvanced && (
                    <div className="p-4 space-y-4 bg-white border-t border-[#1A1A1A] text-xs text-[#1A1A1A]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tempInput" className="text-xs font-bold">Temperatura (Determinismo)</Label>
                          <div className="flex items-center gap-3 mt-1">
                            <Input
                              id="tempInput"
                              type="number"
                              step="0.05"
                              min="0"
                              max="2"
                              value={temperature}
                              onChange={(e) => setTemperature(parseFloat(e.target.value) || 0.0)}
                              className="w-24 text-xs font-mono font-bold"
                            />
                            <span className="text-gray-600 text-[11px]">
                              {temperature === 0.0 ? '0.0 (Determinista, recomendado para auditorías)' : `${temperature} (Muestreo)`}
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="maxTokensInput" className="text-xs font-bold">Límite Máximo de Tokens (max_tokens)</Label>
                          <Input
                            id="maxTokensInput"
                            type="number"
                            step="512"
                            min="512"
                            max="65536"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(parseInt(e.target.value) || 8192)}
                            className="mt-1 text-xs font-mono font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="fallbackModelInput" className="text-xs font-bold">Modelo de Respaldo / Fallback (Opcional)</Label>
                        <Input
                          id="fallbackModelInput"
                          placeholder="ej: openai/gpt-4o-mini o gemini-3.7-flash (si el principal arroja 429)"
                          value={fallbackModel}
                          onChange={(e) => setFallbackModel(e.target.value)}
                          className="mt-1 text-xs font-mono"
                        />
                        <p className="text-[11px] text-gray-500 mt-1">
                          Si el modelo principal falla o se agota su cuota de peticiones, AegisAI conmutará automáticamente a este modelo.
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="customHeadersInput" className="text-xs font-bold">Encabezados HTTP Personalizados (JSON Opcional)</Label>
                        <Textarea
                          id="customHeadersInput"
                          placeholder='{"HTTP-Referer": "https://aegisai.local", "X-Title": "AegisAI Auditor"}'
                          value={customHeadersInput}
                          onChange={(e) => setCustomHeadersInput(e.target.value)}
                          rows={2}
                          className="mt-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-4 border-t border-[#1A1A1A]">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex items-center gap-2 border-[1.5px] border-[#1A1A1A] rounded-none font-bold"
                  >
                    {testing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {testing ? 'Probando conexión...' : `Probar Conexión con ${provider.toUpperCase()}`}
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="flex items-center gap-2 bg-[#1B5FA6] text-white hover:bg-[#164F86] rounded-none font-bold border-[1.5px] border-[#1A1A1A]"
                  >
                    {saving ? 'Guardando...' : 'Guardar y Aplicar en Caliente'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Test Connection Results Card */}
          {testResult && (
            <Card className={`border-[1.5px] border-[#1A1A1A] rounded-none shadow-none border-l-4 ${testResult.ok ? 'border-l-emerald-600' : 'border-l-red-600'}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  {testResult.ok ? (
                    <div className="p-2 bg-[#D9EBF7] text-[#1B5FA6] rounded-none border border-[#1A1A1A] shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                  ) : (
                    <div className="p-2 bg-[#FBF3C9] text-[#8C1D18] rounded-none border border-[#1A1A1A] shrink-0">
                      <AlertTriangle size={20} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[#1A1A1A]">
                      {testResult.ok 
                        ? `Conexión Exitosa con ${testResult.provider?.toUpperCase() || provider.toUpperCase()}` 
                        : `Fallo en la Conexión con ${provider.toUpperCase()}`}
                    </h4>
                    {testResult.ok ? (
                      <div className="mt-2 text-xs text-gray-700 space-y-1">
                        <p><strong>Modelo verificado:</strong> <code className="bg-[#ECECEC] border border-[#1A1A1A] px-1.5 py-0.5 rounded-none font-bold">{testResult.model}</code></p>
                        <p><strong>Latencia de respuesta:</strong> <span className="text-[#1B5FA6] font-bold">{testResult.latencyMs} ms</span></p>
                        <p><strong>Respuesta de verificación:</strong> "{testResult.sampleResponse}"</p>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-[#8C1D18] bg-[#FBF3C9] p-2.5 rounded-none border border-[#1A1A1A]">
                        {testResult.error}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Security & Multi-Model Reference Sidebar */}
        <div className="space-y-6">
          <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <CardHeader className="border-b border-[#1A1A1A] pb-3">
              <CardTitle className="text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <Server size={18} className="text-[#1B5FA6]" />
                Arquitectura de Inferencia
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-gray-700 space-y-3 pt-4">
              <p className="font-bold text-[#1A1A1A]">
                Resolución Dinámica en Caliente:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700 font-medium">
                <li>Configuración del Administrador (<code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A]">config/admin-settings.json</code>)</li>
                <li>Variables de entorno del sistema (<code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A]">GEMINI_API_KEY</code>, <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A]">OPENAI_API_KEY</code>)</li>
              </ol>

              <div className="p-3 bg-[#D9EBF7] rounded-none border border-[#1A1A1A] text-[#1A1A1A] mt-3">
                <p className="font-bold mb-1 flex items-center gap-1.5 text-[#1B5FA6]">
                  <Info size={14} /> Estándar Universal
                </p>
                <p>
                  Para OpenRouter, OpenAI y Proxies Locales, AegisAI interactúa a través de la especificación <code>/v1/chat/completions</code> con formato JSON estricto y extracción defensiva.
                </p>
              </div>

              <div className="p-3 bg-[#FBF3C9] rounded-none border border-[#1A1A1A] text-[#1A1A1A]">
                <p className="font-bold mb-1 text-[#1A1A1A]">Gobernanza y Privacidad (ZDR)</p>
                <p>
                  Los prompts enviados contienen únicamente especificaciones de arquitectura y fragmentos técnicos para evaluación de seguridad bajo OWASP AISVS e ISO 42001.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

