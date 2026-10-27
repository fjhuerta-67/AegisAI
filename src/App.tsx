import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { Login } from './components/auth/Login';
import { AuditReport } from './types';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, query, limit } from 'firebase/firestore';
import { SAMPLE_AUDITS } from './lib/sampleAudits';
import { LanguageProvider, useLanguage, useTranslatedAudits } from './lib/i18n';

// Lazy-loaded route views for optimal bundle splitting
const Dashboard = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const AuditForm = lazy(() => import('./components/dashboard/AuditForm').then(m => ({ default: m.AuditForm })));
const AuditReportView = lazy(() => import('./components/dashboard/AuditReportView').then(m => ({ default: m.AuditReportView })));
const CatalogView = lazy(() => import('./components/dashboard/CatalogView').then(m => ({ default: m.CatalogView })));
const ApiConnectionView = lazy(() => import('./components/api/ApiConnectionView').then(m => ({ default: m.ApiConnectionView })));
const ArchitectureView = lazy(() => import('./components/architecture/ArchitectureView').then(m => ({ default: m.ArchitectureView })));
const AdminSettingsView = lazy(() => import('./components/admin/AdminSettingsView').then(m => ({ default: m.AdminSettingsView })));
const GcpLiveScannerView = lazy(() => import('./components/gcp/GcpLiveScannerView').then(m => ({ default: m.GcpLiveScannerView })));

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);
  const [audits, setAudits] = useState<AuditReport[]>(SAMPLE_AUDITS);
  const [isSeeding, setIsSeeding] = useState(false);
  const [auditCustomFrameworkId, setAuditCustomFrameworkId] = useState<string | undefined>(undefined);
  const [remediatedPrefill, setRemediatedPrefill] = useState<{ description: string; systemName: string } | null>(null);
  const localizedAudits = useTranslatedAudits(audits);

  // Auth listener strictly using Firebase Authentication
  useEffect(() => {
    let isMounted = true;
    // Clean up any residual local session for strict zero-trust
    localStorage.removeItem('aisvs_local_user');

    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setAuthLoading(false);
      }
    }, 1200);

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!isMounted) return;
      clearTimeout(safetyTimer);
      if (u) {
        const email = (u.email || '').toLowerCase().trim();
        const domain = email.split('@')[1];
        const allowedDomainsRaw = (import.meta.env.VITE_ALLOWED_DOMAINS || '*').trim();
        const isAllowed = 
          allowedDomainsRaw === '*' || 
          allowedDomainsRaw === '' || 
          allowedDomainsRaw.split(',').map((d: string) => d.trim().toLowerCase()).includes(domain);

        if (isAllowed) {
          setUser(u);
        } else {
          console.warn(`Unauthorized domain rejected: ${email}. Allowed domains: ${allowedDomainsRaw}`);
          auth.signOut();
          setUser(null);
        }
      } else {
        // Demo sessions are only honored when demo mode is enabled at build time.
        const demoUser = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' && localStorage.getItem('aegis_demo_user');
        if (demoUser) {
          setUser({ email: 'auditor@aegisai.enterprise', displayName: 'Auditor Open Source' } as any);
        } else {
          localStorage.removeItem('aegis_demo_user');
          setUser(null);
        }
      }
      setAuthLoading(false);
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aegis_demo_user');
    localStorage.removeItem('aisvs_local_user');
    auth.signOut();
    setUser(null);
  };

  // Manual or automatic seeding handler for the 5 sample audits
  const handleSeedAudits = async () => {
    setIsSeeding(true);
    setAudits(SAMPLE_AUDITS);
    try {
      for (const sample of SAMPLE_AUDITS) {
        await setDoc(doc(db, 'audits', sample.id), sample);
      }
    } catch (e) {
      console.warn("Error al persistir auditorías de ejemplo en aegis-ai-db:", e);
    } finally {
      setIsSeeding(false);
    }
  };

  // Firestore real-time listener with query limit
  useEffect(() => {
    if (!user) {
      setAudits(SAMPLE_AUDITS);
      return;
    }

    const auditsQuery = query(collection(db, 'audits'), limit(50));
    const unsubscribe = onSnapshot(
      auditsQuery,
      async (snapshot) => {
        const fetchedAudits: AuditReport[] = [];
        snapshot.forEach((doc) => {
          fetchedAudits.push(doc.data() as AuditReport);
        });
        
        // Sort descending by date
        fetchedAudits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (fetchedAudits.length === 0) {
          // Si la base aegis-ai-db está vacía en Firestore, persistimos automáticamente las 5 de muestra
          setAudits(SAMPLE_AUDITS);
          for (const s of SAMPLE_AUDITS) {
            try {
              await setDoc(doc(db, 'audits', s.id), s);
            } catch (err) {
              console.warn("Auto-seed doc error:", err);
            }
          }
        } else {
          setAudits(fetchedAudits);
        }
      },
      (error) => {
        console.warn("Firestore error reading 'audits':", error);
        if (audits.length === 0) {
          setAudits(SAMPLE_AUDITS);
        }
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleNewAudit = () => {
    setAuditCustomFrameworkId(undefined);
    setRemediatedPrefill(null);
    setCurrentView('form');
    setSelectedAuditId(null);
  };

  const handleReauditWithRemediation = (remediatedText: string, audit: AuditReport) => {
    setRemediatedPrefill({
      description: remediatedText,
      systemName: `${audit.systemName} (Remediado 100%)`
    });
    if (audit.standard === 'CUSTOM') {
      setAuditCustomFrameworkId(audit.customFrameworkId);
      setCurrentView('form_custom');
    } else if (audit.standard === 'FULL') {
      setCurrentView('form_full');
    } else if (audit.standard === 'ISO-42001') {
      setCurrentView('form_iso');
    } else {
      setCurrentView('form');
    }
  };

  const handleViewAudit = (id: string) => {
    setSelectedAuditId(id);
    setCurrentView('report');
  };

  const attachTenantOwnership = (report: AuditReport): AuditReport => {
    const currentUid = auth.currentUser?.uid;
    const currentEmail = auth.currentUser?.email || '';
    const currentTenant = currentEmail.includes('@') ? currentEmail.split('@')[1].toLowerCase() : '';
    return {
      ...report,
      ...(currentUid ? { ownerUid: currentUid } : {}),
      ...(currentEmail ? { ownerEmail: currentEmail } : {}),
      ...(currentTenant ? { tenantDomain: currentTenant } : {}),
    };
  };

  const handleAuditSubmit = async (report: AuditReport) => {
    const ownedReport = attachTenantOwnership(report);
    try {
      await setDoc(doc(db, 'audits', ownedReport.id), ownedReport);
      setSelectedAuditId(ownedReport.id);
      setCurrentView('report');
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `audits/${ownedReport.id}`);
    }
  };

  const handleAuditUpdate = async (updatedReport: AuditReport) => {
    try {
      await setDoc(doc(db, 'audits', updatedReport.id), updatedReport);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `audits/${updatedReport.id}`);
    }
  };

  const handleDeleteAudit = async (id: string) => {
    alert(t('Por directiva de seguridad y cumplimiento normativo (OWASP AISVS Invariante 4), los registros de auditoría son inmutables y no pueden eliminarse.'));
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAuditId(null);
  };

  if (authLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-white text-[#4D4D4D] font-sans font-medium">{t('Cargando...')}</div>;
  }

  if (!user) {
    return <Login onDemoLogin={() => setUser({ email: 'auditor@aegisai.enterprise', displayName: 'Auditor Open Source' } as any)} />;
  }

  const selectedAudit = localizedAudits.find(a => a.id === selectedAuditId);

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-[#1A1A1A]">
      <Sidebar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />

      <main className="flex-1 overflow-hidden flex flex-col relative bg-white">
        <Suspense fallback={
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-[#767676]">
            <div className="w-8 h-8 border-[3px] border-[#ECECEC] border-t-[#1B5FA6] rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-[#4D4D4D] font-sans">{t('Cargando módulo...')}</p>
          </div>
        }>
          {currentView === 'dashboard' && (
            <Dashboard 
              audits={localizedAudits} 
              onNewAudit={handleNewAudit} 
              onViewAudit={handleViewAudit}
              onDeleteAudit={handleDeleteAudit}
              onSeedAudits={handleSeedAudits}
              isSeeding={isSeeding}
            />
          )}
          
          {(currentView === 'form' || currentView === 'form_iso' || currentView === 'form_full' || currentView === 'form_custom') && (
            <div className="flex-1 overflow-y-auto">
              <AuditForm 
                onSubmit={handleAuditSubmit} 
                onCancel={handleBackToDashboard}
                standardType={currentView === 'form_iso' ? 'ISO-42001' : currentView === 'form_full' ? 'FULL' : currentView === 'form_custom' ? 'CUSTOM' : 'AI-SVS'}
                initialCustomFrameworkId={auditCustomFrameworkId}
                initialDescription={remediatedPrefill?.description}
                initialSystemName={remediatedPrefill?.systemName}
              />
            </div>
          )}

          {currentView === 'gcp_scanner' && (
            <div className="flex-1 overflow-y-auto">
              <GcpLiveScannerView 
                onAuditComplete={async (report) => {
                  const auditId = report.id || `gcp-audit-${Date.now()}`;
                  // The scanner result carries no form metadata; fill the fields every stored audit needs (see firestore.rules).
                  const projectLabel = report.gcpProjectId || 'Google Cloud';
                  const reportWithId = attachTenantOwnership({
                    ...report,
                    id: auditId,
                    date: report.date || new Date().toISOString(),
                    systemName: report.systemName || `GCP Live Scan: ${projectLabel}`,
                    technicalLead: report.technicalLead || '',
                    email: report.email || '',
                    description: (report.description || `Auditoría en vivo del proyecto ${projectLabel} (GCP Live Scanner).`).slice(0, 100000),
                  });
                  try {
                    await setDoc(doc(db, 'audits', auditId), reportWithId);
                  } catch (err) {
                    console.warn("Error guardando auditoría GCP en Firestore:", err);
                  }
                  setAudits(prev => [reportWithId, ...prev]);
                  setSelectedAuditId(auditId);
                  setCurrentView('report');
                }} 
              />
            </div>
          )}

          {currentView === 'report' && selectedAudit && (
            <AuditReportView 
              audit={selectedAudit} 
              onUpdate={handleAuditUpdate}
              onBack={handleBackToDashboard} 
              onReauditWithRemediation={handleReauditWithRemediation}
            />
          )}

          {currentView === 'catalog' && (
            <CatalogView onAuditWithFramework={(fwId) => {
              setAuditCustomFrameworkId(fwId);
              setCurrentView('form_custom');
            }} />
          )}

          {currentView === 'api' && (
            <ApiConnectionView />
          )}

          {currentView === 'architecture' && (
            <ArchitectureView />
          )}

          {currentView === 'settings' && (
            <AdminSettingsView />
          )}
        </Suspense>

        {/* ISO/IEC 42001:2023 AIMS Governance & Whistleblowing Bar */}
        <footer className="border-t border-[#ECECEC] bg-[#FAFAFA] px-5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#4D4D4D] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1A1A1A]">AegisAI AIMS (ISO/IEC 42001:2023 &amp; OWASP AI-SVS)</span>
            <span className="hidden md:inline text-[#767676]">|</span>
            <span className="hidden md:inline">Uso sujeto a Política Corporativa de IA (A.2.1) y Uso Aceptable (A.9.1)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <a
              href="mailto:ai-ethics-whistleblower@aegisai.enterprise?subject=Escalamiento%20Etico%20Confidencial%20ISO%2042001%20A.3.3"
              className="text-[#1B5FA6] hover:underline font-medium"
              title="Canal confidencial de escalamiento ético y preocupaciones sobre IA (ISO/IEC 42001 A.3.3)"
            >
              Canal Ético Confidencial (A.3.3)
            </a>
            <span className="text-[#CCCCCC]">•</span>
            <a
              href="mailto:ai-appeals@aegisai.enterprise?subject=Impugnacion%20y%20Revision%20Humana%20ISO%2042001%20A.5.2"
              className="text-[#1B5FA6] hover:underline font-medium"
              title="Solicitar revisión humana o impugnar un dictamen algorítmico (ISO/IEC 42001 A.5.2)"
            >
              Impugnar Dictamen / Revisión Humana (A.5.2)
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
