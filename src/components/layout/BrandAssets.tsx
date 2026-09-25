import React from 'react';

/**
 * Ícono de la Nube oficial de Google Cloud en vector SVG escalable
 */
export function GoogleCloudIcon({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg 
      className={`shrink-0 ${className}`} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Google Cloud"
    >
      {/* Base Azul Google Cloud */}
      <path 
        d="M38.4 21.2C37.3 14.8 31.8 10 25.1 10c-5.4 0-10.1 3.2-12.2 7.8-5.3.8-9.4 5.4-9.4 11 0 6.2 5 11.2 11.2 11.2h23.4c5.5 0 10-4.5 10-10 0-4.9-3.6-8.9-8.3-9.8z" 
        fill="#4285F4"
      />
      {/* Detalle Verde Google */}
      <path 
        d="M22.7 18.2c-.8-.2-1.7-.3-2.6-.3-4.2 0-7.8 2.8-9 6.7 1.1-.4 2.3-.6 3.6-.6 5 0 9.2 3.6 10 8.4l1.3-.2c-.3-4.5-2.2-8.5-5.3-11.2l2-2.8z" 
        fill="#34A853" 
        fillOpacity="0.95"
      />
      {/* Detalle Amarillo Google */}
      <path 
        d="M38.4 21.2c-.4 0-.8.1-1.2.1 1.2 2.2 1.9 4.7 1.9 7.4 0 .4 0 .7-.1 1.1h9.1c.5-1.1.9-2.3.9-3.6 0-4.9-3.6-8.9-8.3-9.8l-2.4 4.8z" 
        fill="#FBBC05" 
        fillOpacity="0.95"
      />
      {/* Detalle Rojo Google */}
      <path 
        d="M25.1 10c1.7 0 3.3.3 4.8 1l2.4-4.8C29.9 5.4 27.6 5 25.1 5c-7.3 0-13.6 4.1-16.7 10.1l4.5 2.6c2.1-4.6 6.8-7.7 12.2-7.7z" 
        fill="#EA4335" 
        fillOpacity="0.95"
      />
    </svg>
  );
}

/**
 * Logotipo oficial completo de Google Cloud con tipografía Google
 */
export function GoogleCloudLogo({ className = "h-7 w-auto", showWordmark = true }: { className?: string; showWordmark?: boolean }) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <GoogleCloudIcon className="h-full w-auto aspect-square" />
      {showWordmark && (
        <span className="font-sans font-medium text-slate-800 text-[15px] tracking-tight leading-none whitespace-nowrap">
          Google <span className="text-slate-600 font-normal">Cloud</span>
        </span>
      )}
    </div>
  );
}

/**
 * Emblema corporativo de AegisAI con gradiente metálico y Google Cloud Blue
 */
export function AegisCloudLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <GoogleCloudIcon className="h-7 w-auto" />
      </div>
      <div className="flex flex-col">
        <span className="font-sans font-bold text-slate-900 text-base tracking-tight leading-tight">
          Aegis<span className="text-[#1A73E8]">AI</span>
        </span>
        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
          Google Cloud
        </span>
      </div>
    </div>
  );
}

/**
 * Compatibilidad con nombres anteriores
 */
export const DivisionLoopLogo = AegisCloudLogo;
export const AppLogo = AegisCloudLogo;

/**
 * Componente genérico para ícono de nube asociada
 */
export function CloudIconLogo({ className = "h-4 w-auto" }: { className?: string; alt?: string }) {
  return <GoogleCloudIcon className={className} />;
}

/**
 * Encabezado de Vista Moderno Enterprise
 * Acabado metálico, micro-insignia Google Cloud y tipografía Google Sans
 */
interface DivisionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function DivisionHeader({ 
  title, 
  subtitle, 
  badge, 
  actions, 
  className = "mb-6",
}: DivisionHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 transition-all duration-300 ${className}`}>
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300/70 flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105">
          <GoogleCloudIcon className="h-6 w-auto" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-tight m-0 font-sans">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-normal mt-1 m-0 leading-normal font-sans">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/90 rounded-full shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
          <GoogleCloudIcon className="h-3.5 w-auto" />
          <span className="text-[11px] font-semibold text-slate-700 tracking-tight font-sans">Google Cloud</span>
        </div>
        {actions && (
          <div className="flex items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
