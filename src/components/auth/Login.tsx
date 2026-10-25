import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleCloudIcon, AegisCloudLogo } from '../layout/BrandAssets';

interface LoginProps {
  onDemoLogin?: () => void;
}

export function Login({ onDemoLogin }: LoginProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const allowedDomainsRaw = (import.meta.env.VITE_ALLOWED_DOMAINS || '*').trim();
  const isWildcard = allowedDomainsRaw === '*' || allowedDomainsRaw === '';
  const allowedList = allowedDomainsRaw.split(',').map((d: string) => d.trim().toLowerCase()).filter(Boolean);

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      const email = (result.user?.email || '').toLowerCase().trim();
      const domain = email.split('@')[1];

      if (!isWildcard && (!domain || !allowedList.includes(domain))) {
        await auth.signOut();
        setError(`Acceso Denegado: La cuenta ${email} no pertenece a los dominios autorizados (${allowedDomainsRaw}). Configura VITE_ALLOWED_DOMAINS en tu archivo .env.`);
        return;
      }
    } catch (e: any) {
      if (e?.code === 'auth/unauthorized-domain') {
        const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'este host';
        setError(`El dominio "${currentHost}" no está en los "Authorized Domains" de Firebase Auth. Agrégalo en Firebase Console > Authentication > Settings o utiliza el botón de Modo Demo.`);
      } else if (e?.code === 'auth/api-key-not-valid' || e?.message?.includes('api-key-not-valid')) {
        setError('Clave de API de Firebase no configurada o inválida. Puedes ingresar de inmediato haciendo clic abajo en "Probar en Modo Demo / Vista Previa".');
      } else if (e?.code === 'auth/popup-closed-by-user') {
        setError('La ventana de autenticación fue cerrada antes de completar el inicio de sesión.');
      } else {
        setError(e?.message || 'Error al iniciar sesión con Google.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoAccess = () => {
    localStorage.setItem('aegis_demo_user', 'true');
    if (onDemoLogin) {
      onDemoLogin();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center font-sans p-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#1A73E8]/10 blur-[120px] rounded-full pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[400px] h-[400px] bg-[#1E8E3E]/10 blur-[100px] rounded-full pointer-events-none -bottom-20 -right-20" />

      {/* Tarjeta Central de Acceso Metálica */}
      <div className="p-8 md:p-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col items-center max-w-md w-full text-center z-10 relative">
        <div className="flex items-center justify-center gap-3 w-full mb-6 pb-5 border-b border-slate-800">
          <GoogleCloudIcon className="w-9 h-9" />
          <div className="text-left">
            <span className="font-bold text-xl text-white tracking-tight flex items-center gap-1.5">
              Aegis<span className="text-[#1A73E8]">AI</span>
            </span>
            <span className="text-[10.5px] text-slate-400 font-medium block">
              Google Cloud AI Security & Governance
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mb-2">
          Control de Acceso y Gobernanza
        </h2>
        <p className="text-xs text-slate-400 mb-5 leading-relaxed font-sans">
          Plataforma de auditoría técnica y aseguramiento continuo para modelos fundacionales, agentes y pipelines RAG.
        </p>

        {/* Badge de Dominio Autorizado */}
        <div className="w-full mb-6 p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center justify-center gap-2">
          <ShieldCheck size={14} className="text-[#1A73E8]" />
          <span className="text-[11px] font-medium text-slate-300">Autenticación:</span>
          <span className="bg-slate-900/90 px-2 py-0.5 border border-slate-700 text-xs font-semibold text-[#1A73E8] rounded-md font-mono">
            {isWildcard ? 'Google Accounts (*)' : allowedDomainsRaw}
          </span>
        </div>

        {error && (
          <div className="w-full mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-left flex items-start gap-2.5 text-xs text-red-200">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{error}</span>
          </div>
        )}

        <div className="w-full space-y-3">
          {/* Botón Principal: Acceso OAuth Google */}
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-3 text-sm disabled:opacity-50 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}
          </button>

          {/* Botón Secundario: Acceso Rápido Modo Demo / Open Source */}
          <button
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-xs border border-slate-700 cursor-pointer"
          >
            <Sparkles size={14} className="text-[#1A73E8]" />
            <span>Probar en Modo Demo / Vista Previa</span>
          </button>
        </div>
      </div>
    </div>
  );
}
