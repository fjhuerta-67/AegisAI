import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Key, Copy, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { ApiKey } from '../../types';
import { DivisionHeader } from '../layout/BrandAssets';

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function ApiConnectionView() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      setApiKeys([]);
      return;
    }
    const keysQuery = query(collection(db, 'apiKeys'), where('ownerUid', '==', currentUid));
    const unsubscribe = onSnapshot(keysQuery, (snapshot) => {
      const keys: ApiKey[] = [];
      snapshot.forEach((docSnap) => keys.push(docSnap.data() as ApiKey));
      setApiKeys(keys.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
    return () => unsubscribe();
  }, []);

  const generateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) {
      alert('Debes iniciar sesión con tu cuenta corporativa para generar una API Key.');
      return;
    }
    setLoading(true);

    const rawKey = `aisvs_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyHash = await sha256Hex(rawKey);
    const keyPreview = `${rawKey.slice(0, 12)}...${rawKey.slice(-4)}`;
    const currentEmail = auth.currentUser?.email || '';
    const currentTenant = currentEmail.includes('@') ? currentEmail.split('@')[1].toLowerCase() : '';
    const newApiKey: ApiKey = {
      id: keyHash,
      keyHash,
      keyPreview,
      name: newKeyName.trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
      ownerUid: currentUid,
      ...(currentEmail ? { ownerEmail: currentEmail } : {}),
      ...(currentTenant ? { tenantDomain: currentTenant } : {}),
    };

    try {
      await setDoc(doc(db, 'apiKeys', keyHash), newApiKey);
      setNewlyCreatedKey(rawKey);
      setNewKeyName('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `apiKeys/${keyHash}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteKey = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas revocar esta API Key? Las integraciones dejarán de funcionar inmediatamente.')) return;
    try {
      await deleteDoc(doc(db, 'apiKeys', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `apiKeys/${id}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto flex-1 overflow-y-auto font-sans">
      <DivisionHeader
        title="Conexión por API"
        subtitle="Gestiona tus claves de API para automatizar auditorías desde tus pipelines CI/CD o sistemas de backend."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <CardHeader className="border-b border-[#1A1A1A] pb-4">
              <CardTitle className="text-lg font-bold text-[#1A1A1A]">Instructivo de Integración</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Usa estos endpoints para ejecutar verificaciones asíncronas.</p>
            </CardHeader>
            <CardContent className="space-y-6 text-sm text-[#1A1A1A] pt-6">
              
              <div className="space-y-3">
                <h3 className="font-bold text-[#1A1A1A] text-base">1. Iniciar una Auditoría (Asíncrona)</h3>
                <p className="text-gray-700">Envía un POST con la descripción de tu sistema. El endpoint responderá de inmediato con un <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] font-mono text-xs font-bold">jobId</code>.</p>
                <div className="bg-[#1A1A1A] text-gray-100 p-4 rounded-none border-[1.5px] border-[#1A1A1A] overflow-x-auto font-mono text-xs">
                  <pre>
{`curl -X POST https://tu-dominio.com/api/v1/audits \\
  -H "Authorization: Bearer TU_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "systemName": "Microservicio Recomendador",
    "technicalLead": "Juan Pérez",
    "email": "juan@empresa.com",
    "standardType": "FULL",
    "description": "Arquitectura RAG usando Vertex AI y Cloud Run..."
  }'`}
                  </pre>
                </div>
                <p className="text-xs text-gray-600 mt-1">Nota: <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] text-[#1A1A1A] font-mono">standardType</code> puede ser <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] text-[#1A1A1A] font-mono">AI-SVS</code>, <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] text-[#1A1A1A] font-mono">ISO-42001</code> o <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] text-[#1A1A1A] font-mono">FULL</code>.</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-[#1A1A1A] text-base">2. Consultar el Estado</h3>
                <p className="text-gray-700">Usa el <code className="bg-[#ECECEC] px-1 rounded-none border border-[#1A1A1A] font-mono text-xs font-bold">jobId</code> recibido para consultar si el reporte está listo.</p>
                <div className="bg-[#1A1A1A] text-gray-100 p-4 rounded-none border-[1.5px] border-[#1A1A1A] overflow-x-auto font-mono text-xs">
                  <pre>
{`curl -X GET https://tu-dominio.com/api/v1/audits/JOB-123456789 \\
  -H "Authorization: Bearer TU_API_KEY"`}
                  </pre>
                </div>
                <p className="mt-2 text-gray-700 font-medium">Respuesta cuando termine:</p>
                <div className="bg-[#1A1A1A] text-gray-100 p-4 rounded-none border-[1.5px] border-[#1A1A1A] overflow-x-auto font-mono text-xs">
                  <pre>
{`{
  "status": "COMPLETED",
  "resultId": "FULL-2026-0491",
  "report": { ...objeto completo del reporte... }
}`}
                  </pre>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <CardHeader className="border-b border-[#1A1A1A] pb-3">
              <CardTitle className="text-base font-bold text-[#1A1A1A]">Generar nueva API Key</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <form onSubmit={generateApiKey} className="flex gap-2">
                <Input 
                  placeholder="Ej. CI/CD GitHub Actions" 
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !newKeyName.trim()} variant="primary" className="px-3 rounded-none">
                  <Plus size={18} />
                </Button>
              </form>
              {newlyCreatedKey && (
                <div className="p-3 bg-amber-50 border border-amber-400 text-xs space-y-2">
                  <p className="font-bold text-amber-900">
                    Copia tu API Key ahora. Por seguridad solo almacenamos su hash SHA-256 y no volverá a mostrarse completa:
                  </p>
                  <div className="flex items-center justify-between bg-white border border-amber-500 p-1.5 pl-2">
                    <span className="font-mono font-bold text-gray-900 break-all">{newlyCreatedKey}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(newlyCreatedKey)}
                      className="text-gray-700 hover:text-black p-1 shrink-0"
                    >
                      {copiedKey === newlyCreatedKey ? <CheckCircle2 size={14} className="text-[#1B5FA6]" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <CardHeader className="border-b border-[#1A1A1A] pb-3">
              <CardTitle className="text-base font-bold text-[#1A1A1A]">Tus API Keys</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {apiKeys.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No tienes API Keys generadas.</p>
              ) : (
                <ul className="space-y-3">
                  {apiKeys.map(key => {
                    const displayPreview = key.keyPreview || (key.key ? `${key.key.substring(0, 15)}...` : `SHA256:${key.id.slice(0, 12)}...`);
                    return (
                      <li key={key.id} className="p-3 bg-[#ECECEC]/30 border-[1.5px] border-[#1A1A1A] rounded-none flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm text-[#1A1A1A]">{key.name}</span>
                          <button onClick={() => deleteKey(key.id)} className="text-gray-500 hover:text-red-700 transition-colors p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between bg-white border border-[#1A1A1A] rounded-none p-1.5 pl-2 group">
                          <span className="text-xs font-mono font-bold text-gray-700 truncate">{displayPreview}</span>
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">SHA-256</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">Creada: {new Date(key.createdAt).toLocaleDateString()}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
