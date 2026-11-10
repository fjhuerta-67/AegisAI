import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Sidebar, ViewType } from './components/layout/Sidebar';
import { Login } from './components/auth/Login';
import { AuditReport } from './types';
import { db, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, doc, setDoc, query, limit } from 'firebase/firestore';
import { SAMPLE_AUDITS } from './lib/sampleAudits';
import { LanguageProvider, useLanguage, useTranslatedAudits } from './lib/i18n';
import {
  sanitizeAuditReportForFirestore,
  saveAuditToLocalBackup,
  loadAuditsFromLocalBackup,
  mergeAuditLists,
} from './lib/auditPersistence';

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
  const [audits, setAudits] = useState<AuditReport[]>(() =>
    mergeAuditLists(loadAuditsFromLocalBackup(), SAMPLE_AUDITS)
  );
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
    setAudits((prev) => mergeAuditLists(prev, loadAuditsFromLocalBackup(), SAMPLE_AUDITS));
    try {
      for (const sample of SAMPLE_AUDITS) {
        if (auth.currentUser) {
          const ownedSample = attachTenantOwnership(sample);
          await setDoc(doc(db, 'audits', ownedSample.id), ownedSample, { merge: true });
        }
      }
    } catch (e) {
      console.warn("Error al persistir auditorías de ejemplo en aegis-ai-db:", e);
    } finally {
      setIsSeeding(false);
    }
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch {
        // Ignore token errors
      }
    }
    return headers;
  };

  const syncAuditToBackendAndFirestore = async (cleanReport: AuditReport) => {
    // 1. Persist via backend Admin SDK endpoint (`/api/audits` -> `aegis-ai-db`)
    let persistedViaBackend = false;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers,
        body: JSON.stringify({ audit: cleanReport }),
      });
      if (res.ok) {
        persistedViaBackend = true;
      }
    } catch (apiErr) {
      console.warn('[AegisPersistence] Backend /api/audits save warning:', apiErr);
    }

    // 2. Fallback to Firebase client SDK only if backend persistence did not succeed
    if (!persistedViaBackend && auth.currentUser) {
      try {
        await setDoc(doc(db, 'audits', cleanReport.id), cleanReport, { merge: true });
      } catch (fsErr) {
        console.warn('[AegisPersistence] Client Firestore setDoc warning:', fsErr);
      }
    }
  };

  // Multi-source Audit Hydration & Real-Time Listener (Backend Admin SDK + Firestore onSnapshot + localStorage backup)
  useEffect(() => {
    if (authLoading) return;
    let isCancelled = false;
    const localBackups = loadAuditsFromLocalBackup();
    const sampleIds = new Set(SAMPLE_AUDITS.map((s) => s.id));

    // Hydrate from backend `/api/audits` (Admin SDK -> `aegis-ai-db`) so users behind Argolis IAP
    // or in Demo Mode always see all saved analyses from `aegis-ai-db`.
    (async () => {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch('/api/audits', { headers });
        if (res.ok && !isCancelled) {
          const data = await res.json();
          const serverAudits: AuditReport[] = Array.isArray(data?.audits) ? data.audits : [];
          for (const srvAudit of serverAudits) {
            if (srvAudit?.id && !sampleIds.has(srvAudit.id)) {
              saveAuditToLocalBackup(srvAudit);
            }
          }
          const currentLocal = loadAuditsFromLocalBackup();
          setAudits((prev) =>
            mergeAuditLists(serverAudits, currentLocal, prev, SAMPLE_AUDITS)
          );
        }
      } catch (err) {
        console.warn('[AegisPersistence] Backend /api/audits fetch fallback:', err);
      }
    })();

    if (!user || !auth.currentUser) {
      setAudits((prev) => mergeAuditLists(localBackups, prev, SAMPLE_AUDITS));
      return () => {
        isCancelled = true;
      };
    }

    const auditsQuery = query(collection(db, 'audits'), limit(100));
    const unsubscribe = onSnapshot(
      auditsQuery,
      async (snapshot) => {
        if (isCancelled) return;
        const fetchedAudits: AuditReport[] = [];
        snapshot.forEach((d) => {
          fetchedAudits.push(d.data() as AuditReport);
        });

        for (const remoteAudit of fetchedAudits) {
          if (remoteAudit?.id && !sampleIds.has(remoteAudit.id)) {
            saveAuditToLocalBackup(remoteAudit);
          }
        }

        const currentLocal = loadAuditsFromLocalBackup();

        if (fetchedAudits.length === 0) {
          // Never drop `prev` (which holds audits already hydrated from `/api/audits`)
          setAudits((prev) => mergeAuditLists(prev, currentLocal, SAMPLE_AUDITS));

          // Only seed sample audits if this is an authoritative server response (not an initial/offline cache fallback)
          // and no real user audits exist locally.
          if (!snapshot.metadata.fromCache && currentLocal.length === 0) {
            for (const s of SAMPLE_AUDITS) {
              try {
                await setDoc(doc(db, 'audits', s.id), attachTenantOwnership(s), { merge: true });
              } catch (err) {
                console.warn("Auto-seed doc error:", err);
              }
            }
          }
        } else {
          setAudits((prev) => mergeAuditLists(fetchedAudits, prev, currentLocal, SAMPLE_AUDITS));
        }
      },
      (error) => {
        console.warn("Firestore error reading 'audits':", error);
        setAudits((prev) => mergeAuditLists(loadAuditsFromLocalBackup(), prev, SAMPLE_AUDITS));
      }
    );

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [user, authLoading]);

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
    const currentEmail = auth.currentUser?.email || (user as any)?.email || report.ownerEmail || report.email || '';
    const currentTenant = currentEmail.includes('@') ? currentEmail.split('@')[1].toLowerCase() : '';
    return sanitizeAuditReportForFirestore(report, {
      uid: currentUid,
      email: currentEmail,
      tenantDomain: currentTenant,
    });
  };

  const handleAuditSubmit = async (report: AuditReport) => {
    const ownedReport = attachTenantOwnership(report);
    // 1. Optimistically update local backup and React UI immediately so the user NEVER loses their analysis
    saveAuditToLocalBackup(ownedReport);
    setAudits((prev) => mergeAuditLists([ownedReport], prev));
    setSelectedAuditId(ownedReport.id);
    setCurrentView('report');

    // 2. Only re-sync to `aegis-ai-db` if the report wasn't already persisted by the server SSE endpoint
    // or if client Firebase ownership needs to be attached to an unowned report
    const alreadyPersistedOnServer =
      Boolean((report as any).persistedOnServer) &&
      (!auth.currentUser?.uid || report.ownerUid === auth.currentUser.uid);
    if (!alreadyPersistedOnServer) {
      await syncAuditToBackendAndFirestore(ownedReport);
    }
  };

  const handleAuditUpdate = async (updatedReport: AuditReport) => {
    const ownedReport = attachTenantOwnership(updatedReport);
    saveAuditToLocalBackup(ownedReport);
    setAudits((prev) => mergeAuditLists([ownedReport], prev));
    await syncAuditToBackendAndFirestore(ownedReport);
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
                  const projectLabel = report.gcpProjectId || 'Google Cloud';
                  await handleAuditSubmit({
                    ...report,
                    id: auditId,
                    date: report.date || new Date().toISOString(),
                    systemName: report.systemName || `GCP Live Scan: ${projectLabel}`,
                    technicalLead: report.technicalLead || '',
                    email: report.email || '',
                    description: report.description || `Auditoría en vivo del proyecto ${projectLabel} (GCP Live Scanner).`,
                  });
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
