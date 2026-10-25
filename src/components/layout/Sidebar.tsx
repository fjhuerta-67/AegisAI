import React from 'react';
import { LayoutDashboard, PlusCircle, BookOpen, LogOut, Settings, Cloud, ShieldCheck } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { GoogleCloudIcon, GoogleCloudLogo } from './BrandAssets';

export type ViewType = 'dashboard' | 'form' | 'form_iso' | 'form_full' | 'form_custom' | 'gcp_scanner' | 'report' | 'catalog' | 'api' | 'architecture' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onLogout?: () => void;
}

export function Sidebar({ currentView, setView, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', num: '01', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'form', num: '02', label: 'Nueva Auditoría', icon: PlusCircle },
    { id: 'gcp_scanner', num: '03', label: 'Auditar Google Cloud', icon: Cloud },
    { id: 'catalog', num: '04', label: 'Catálogos AI', icon: BookOpen },
    { id: 'settings', num: '05', label: 'Configuración Admin', icon: Settings },
  ] as const;

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="w-[276px] bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100/90 border-r border-slate-200/90 flex flex-col shrink-0 h-full p-5 select-none z-20 shadow-xs transition-colors duration-300">
      {/* Encabezado Institucional Google Cloud & AegisAI */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <GoogleCloudLogo className="h-6 w-auto" />
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2 py-0.5 rounded-full">
            <ShieldCheck size={11} /> Enterprise
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-sans font-extrabold text-xl text-slate-900 tracking-tight leading-tight">
            Aegis<span className="text-[#1A73E8]">AI</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-slate-200/70 text-slate-600 rounded">
            v1.0
          </span>
        </div>

        <div className="text-[11px] font-medium text-slate-500 leading-snug mt-1 font-sans">
          Google Cloud AI Security & Governance Platform
        </div>

        {/* Separador metálico sutil */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4" />
      </div>

      {/* Lista de Navegación con animaciones y transiciones suaves */}
      <nav className="flex flex-col gap-1.5 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = 
            currentView === item.id || 
            (item.id === 'dashboard' && currentView === 'report') ||
            (item.id === 'form' && (currentView === 'form_iso' || currentView === 'form_full' || currentView === 'form_custom'));
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center text-left gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all duration-200 ease-out w-full cursor-pointer group
                ${isActive 
                  ? 'bg-white text-[#1A73E8] font-bold border border-slate-200/90 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 font-medium border border-transparent'
                }
              `}
            >
              <span className={`text-[10.5px] font-mono font-semibold transition-colors duration-200 ${isActive ? 'text-[#1A73E8]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                {item.num}
              </span>
              <span className="text-slate-300">·</span>
              <Icon 
                size={16} 
                className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-[#1A73E8]' : 'text-slate-400 group-hover:text-slate-700'}`} 
              />
              <span className="truncate flex-1 tracking-tight">{item.label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] shrink-0 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Pie Institucional Google Cloud y Cierre de Sesión */}
      <div className="pt-4 border-t border-slate-200/80 flex flex-col gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-r from-slate-200/40 via-white/80 to-slate-200/40 border border-slate-200/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoogleCloudIcon className="h-4 w-auto" />
            <div className="flex flex-col">
              <span className="text-[10.5px] font-semibold text-slate-800 leading-tight">Google Cloud</span>
              <span className="text-[9.5px] text-slate-500 leading-tight">AI Trust & Compliance</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Connected" />
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 transition-all duration-200 w-full rounded-xl cursor-pointer border border-transparent font-medium"
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
