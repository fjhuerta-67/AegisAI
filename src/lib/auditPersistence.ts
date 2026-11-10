import { AuditReport } from '../types';

export const LOCAL_STORAGE_AUDITS_KEY = 'aegis_saved_audits_v1';
export const MAX_FIRESTORE_DESCRIPTION_CHARS = 95_000;
export const MAX_FIRESTORE_EXEC_SUMMARY_CHARS = 95_000;
export const MAX_FIRESTORE_REMEDIATED_DOC_CHARS = 190_000;
export const MAX_FIRESTORE_RATIONALE_CHARS = 19_000;
export const MAX_FIRESTORE_DOC_UTF8_BYTES = 850_000; // Safe margin below Firestore 1,048,576 byte (1 MiB) hard limit

export interface AuditUserIdentity {
  uid?: string | null;
  email?: string | null;
  tenantDomain?: string | null;
}

const VALID_AUDIT_ID_REGEX = /^[A-Za-z0-9_.-]{1,128}$/;

const OPTIONAL_STRING_FIELDS: ReadonlyArray<string> = [
  'customFrameworkId',
  'customFrameworkName',
  'targetLevel',
  'achievedLevel',
  'levelAssessmentRationale',
  'remediatedArchitectureDoc',
  'ownerUid',
  'ownerEmail',
  'tenantDomain',
  'gcpProjectId',
  'normativeCorpusHash',
];

/**
 * Generates or validates a canonical AuditReport ID that complies with firestore.rules (1..128 chars).
 */
export function generateAuditId(
  standard?: string,
  standards?: string[],
  existingId?: string
): string {
  if (existingId && typeof existingId === 'string') {
    const trimmed = existingId.trim();
    if (VALID_AUDIT_ID_REGEX.test(trimmed)) {
      return trimmed;
    }
  }

  const resolvedStandards = Array.isArray(standards) && standards.length > 0
    ? standards
    : (standard ? [standard] : ['AI-SVS']);
  const isMulti = resolvedStandards.length > 1 || standard === 'MULTI' || standard === 'FULL';

  let prefix = 'AISVS';
  if (isMulti) {
    prefix = 'MULTI';
  } else if (resolvedStandards[0] === 'ISO-42001' || standard === 'ISO-42001') {
    prefix = 'ISO42001';
  } else if (resolvedStandards[0] && resolvedStandards[0] !== 'AI-SVS') {
    prefix = resolvedStandards[0].replace(/[^A-Za-z0-9]/g, '').slice(0, 8).toUpperCase() || 'CUSTOM';
  }

  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${randomSuffix}`;
}

/**
 * Recursively removes keys with `undefined` values from objects and converts `undefined` array elements.
 */
export function stripUndefinedDeep<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (typeof value === 'object' && !(value instanceof Date)) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        result[k] = stripUndefinedDeep(v);
      }
    }
    return result as T;
  }
  return value;
}

/**
 * Computes UTF-8 byte length of a string across both Node and Browser environments.
 */
export function getUtf8ByteLength(str: string): number {
  if (typeof Buffer !== 'undefined' && typeof Buffer.byteLength === 'function') {
    return Buffer.byteLength(str, 'utf8');
  }
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return unescape(encodeURIComponent(str)).length;
}

/**
 * Sanitizes and normalizes an AuditReport so it strictly satisfies all Firestore SDK rules,
 * `firestore.rules` (`isValidAuditReport` / `isOptionalString`), and Firestore's 1 MiB limit.
 */
export function sanitizeAuditReportForFirestore(
  report: Partial<AuditReport> & { systemName?: string; chapters?: any[] },
  userIdentity?: AuditUserIdentity | null
): AuditReport {
  const cleanClone = stripUndefinedDeep({ ...report }) as Record<string, any>;

  const resolvedStandards: string[] = Array.isArray(cleanClone.standards) && cleanClone.standards.length > 0
    ? cleanClone.standards.filter((s: unknown) => typeof s === 'string' && s.trim().length > 0)
    : (typeof cleanClone.standard === 'string' && cleanClone.standard ? [cleanClone.standard] : ['AI-SVS']);

  const standard = typeof cleanClone.standard === 'string' && cleanClone.standard.trim()
    ? cleanClone.standard.trim().slice(0, 64)
    : (resolvedStandards.length > 1 ? 'MULTI' : 'AI-SVS');

  const id = generateAuditId(standard, resolvedStandards, cleanClone.id);

  const rawEmail = (
    userIdentity?.email ||
    cleanClone.ownerEmail ||
    cleanClone.email ||
    ''
  ).toString().trim().toLowerCase();

  const derivedDomain = rawEmail.includes('@') ? rawEmail.split('@')[1] : undefined;
  const ownerUid = (cleanClone.ownerUid || userIdentity?.uid || '').toString().trim();
  const ownerEmail = (cleanClone.ownerEmail || userIdentity?.email || rawEmail || '').toString().trim().toLowerCase();
  const tenantDomain = (cleanClone.tenantDomain || userIdentity?.tenantDomain || derivedDomain || '').toString().trim().toLowerCase();

  const numericScore = Number(cleanClone.overallScore);
  const overallScore = Number.isFinite(numericScore)
    ? Math.max(0, Math.min(100, Math.round(numericScore * 10) / 10))
    : 0;

  const systemName = (typeof cleanClone.systemName === 'string' && cleanClone.systemName.trim())
    ? cleanClone.systemName.trim().slice(0, 500)
    : 'AI System Architecture Audit';

  const technicalLead = (typeof cleanClone.technicalLead === 'string')
    ? cleanClone.technicalLead.trim().slice(0, 300)
    : '';

  const email = (typeof cleanClone.email === 'string' && cleanClone.email.trim())
    ? cleanClone.email.trim().slice(0, 320)
    : ownerEmail.slice(0, 320);

  const date = (typeof cleanClone.date === 'string' && cleanClone.date.trim())
    ? cleanClone.date.trim().slice(0, 64)
    : new Date().toISOString();

  const description = (typeof cleanClone.description === 'string')
    ? cleanClone.description.slice(0, MAX_FIRESTORE_DESCRIPTION_CHARS)
    : '';

  const executiveSummary = (typeof cleanClone.executiveSummary === 'string')
    ? cleanClone.executiveSummary.slice(0, MAX_FIRESTORE_EXEC_SUMMARY_CHARS)
    : '';

  const chapters = Array.isArray(cleanClone.chapters)
    ? cleanClone.chapters.slice(0, 100)
    : [];

  const sanitized: Record<string, any> = {
    ...cleanClone,
    id,
    date,
    systemName,
    technicalLead,
    email,
    description,
    executiveSummary,
    overallScore,
    standard,
    standards: resolvedStandards,
    chapters,
  };

  if (ownerUid) sanitized.ownerUid = ownerUid.slice(0, 128);
  else delete sanitized.ownerUid;

  if (ownerEmail) sanitized.ownerEmail = ownerEmail.slice(0, 320);
  else delete sanitized.ownerEmail;

  if (tenantDomain) sanitized.tenantDomain = tenantDomain.slice(0, 255);
  else delete sanitized.tenantDomain;

  if (typeof sanitized.remediatedArchitectureDoc === 'string' && sanitized.remediatedArchitectureDoc.trim().length > 0) {
    sanitized.remediatedArchitectureDoc = sanitized.remediatedArchitectureDoc.slice(0, MAX_FIRESTORE_REMEDIATED_DOC_CHARS);
  } else {
    delete sanitized.remediatedArchitectureDoc;
  }

  if (typeof sanitized.levelAssessmentRationale === 'string' && sanitized.levelAssessmentRationale.trim().length > 0) {
    sanitized.levelAssessmentRationale = sanitized.levelAssessmentRationale.slice(0, MAX_FIRESTORE_RATIONALE_CHARS);
  } else {
    delete sanitized.levelAssessmentRationale;
  }

  if (Array.isArray(sanitized.uploadedDocuments) && sanitized.uploadedDocuments.length > 0) {
    sanitized.uploadedDocuments = sanitized.uploadedDocuments
      .slice(0, 15)
      .filter((d: any) => d && typeof d === 'object' && typeof d.fileName === 'string')
      .map((d: any, idx: number) => {
        const docRecord: Record<string, any> = {
          id: typeof d.id === 'string' && d.id.trim() ? d.id.trim().slice(0, 64) : `doc-${idx + 1}`,
          fileName: d.fileName.trim().slice(0, 255),
          originalContent: typeof d.originalContent === 'string' ? d.originalContent.slice(0, 45_000) : '',
        };
        if (typeof d.mimeType === 'string' && d.mimeType.trim()) {
          docRecord.mimeType = d.mimeType.trim().slice(0, 128);
        }
        if (typeof d.remediatedContent === 'string' && d.remediatedContent.trim()) {
          docRecord.remediatedContent = d.remediatedContent.slice(0, 60_000);
        }
        if (typeof d.remediatedSummary === 'string' && d.remediatedSummary.trim()) {
          docRecord.remediatedSummary = d.remediatedSummary.slice(0, 2_500);
        }
        if (Array.isArray(d.appliedControls)) {
          docRecord.appliedControls = d.appliedControls
            .filter((c: any) => typeof c === 'string')
            .slice(0, 50);
        }
        if (typeof d.updatedAt === 'string' && d.updatedAt.trim()) {
          docRecord.updatedAt = d.updatedAt.trim().slice(0, 64);
        }
        return docRecord;
      });
  } else {
    delete sanitized.uploadedDocuments;
  }

  // Ensure optional string fields are either valid bounded strings or completely omitted (never null/undefined/empty)
  for (const field of OPTIONAL_STRING_FIELDS) {
    const val = sanitized[field];
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      delete sanitized[field];
    }
  }

  // Enforce 1 MiB Firestore document size guard (850 KB UTF-8 JSON ceiling)
  let serialized = JSON.stringify(sanitized);
  let byteLen = getUtf8ByteLength(serialized);

  if (byteLen > MAX_FIRESTORE_DOC_UTF8_BYTES && Array.isArray(sanitized.uploadedDocuments)) {
    const perDocCap = Math.max(4_000, Math.floor(180_000 / Math.max(1, sanitized.uploadedDocuments.length)));
    sanitized.uploadedDocuments = sanitized.uploadedDocuments.map((d: any) => ({
      ...d,
      originalContent: typeof d.originalContent === 'string' && d.originalContent.length > perDocCap
        ? d.originalContent.slice(0, perDocCap) + '\n...[Truncated]...'
        : d.originalContent,
      remediatedContent: typeof d.remediatedContent === 'string' && d.remediatedContent.length > perDocCap
        ? d.remediatedContent.slice(0, perDocCap) + '\n...[Truncated]...'
        : d.remediatedContent,
    }));
    serialized = JSON.stringify(sanitized);
    byteLen = getUtf8ByteLength(serialized);
  }

  if (byteLen > MAX_FIRESTORE_DOC_UTF8_BYTES && typeof sanitized.remediatedArchitectureDoc === 'string') {
    const excess = byteLen - MAX_FIRESTORE_DOC_UTF8_BYTES + 40_000;
    const targetLen = Math.max(8_000, sanitized.remediatedArchitectureDoc.length - excess);
    sanitized.remediatedArchitectureDoc =
      sanitized.remediatedArchitectureDoc.slice(0, targetLen) +
      '\n\n...[Truncated to fit Firestore 1 MiB document size limit]...';
    serialized = JSON.stringify(sanitized);
    byteLen = getUtf8ByteLength(serialized);
  }

  if (byteLen > MAX_FIRESTORE_DOC_UTF8_BYTES && typeof sanitized.description === 'string' && sanitized.description.length > 8_000) {
    sanitized.description =
      sanitized.description.slice(0, 8_000) +
      '\n\n...[Truncated to fit Firestore 1 MiB document size limit]...';
    serialized = JSON.stringify(sanitized);
    byteLen = getUtf8ByteLength(serialized);
  }

  // Iterative control text compaction until strictly <= MAX_FIRESTORE_DOC_UTF8_BYTES
  const controlCaps = [
    { patch: 1200, rec: 1200, ev: 1000, desc: 600 },
    { patch: 600, rec: 700, ev: 600, desc: 400 },
    { patch: 250, rec: 350, ev: 350, desc: 250 },
  ];

  for (const cap of controlCaps) {
    if (byteLen <= MAX_FIRESTORE_DOC_UTF8_BYTES || !Array.isArray(sanitized.chapters)) {
      break;
    }
    sanitized.chapters = sanitized.chapters.map((ch: any) => {
      const nextCh: Record<string, any> = { ...ch };
      if (Array.isArray(ch.puntosProbados)) {
        nextCh.puntosProbados = ch.puntosProbados.map((pt: any) => {
          const nextPt = { ...pt };
          if (typeof nextPt.remediation === 'string' && nextPt.remediation.length > cap.rec) {
            nextPt.remediation = nextPt.remediation.slice(0, cap.rec) + '...';
          }
          if (typeof nextPt.textoEvidencia === 'string' && nextPt.textoEvidencia.length > cap.ev) {
            nextPt.textoEvidencia = nextPt.textoEvidencia.slice(0, cap.ev) + '...';
          }
          if (typeof nextPt.comoFallo === 'string' && nextPt.comoFallo.length > cap.desc) {
            nextPt.comoFallo = nextPt.comoFallo.slice(0, cap.desc) + '...';
          }
          if (typeof nextPt.comoSeAprobo === 'string' && nextPt.comoSeAprobo.length > cap.desc) {
            nextPt.comoSeAprobo = nextPt.comoSeAprobo.slice(0, cap.desc) + '...';
          }
          if (nextPt.remediationDetails && typeof nextPt.remediationDetails === 'object') {
            const rd = { ...nextPt.remediationDetails };
            if (typeof rd.codeOrConfigExample === 'string' && rd.codeOrConfigExample.length > cap.patch) {
              rd.codeOrConfigExample = rd.codeOrConfigExample.slice(0, cap.patch) + '\n// ...[Truncated]...';
            }
            if (typeof rd.verificationRecipe === 'string' && rd.verificationRecipe.length > cap.rec) {
              rd.verificationRecipe = rd.verificationRecipe.slice(0, cap.rec) + '...';
            }
            if (typeof rd.strategy === 'string' && rd.strategy.length > cap.desc) {
              rd.strategy = rd.strategy.slice(0, cap.desc) + '...';
            }
            nextPt.remediationDetails = rd;
          }
          return nextPt;
        });
      }
      if (Array.isArray(ch.controls)) {
        nextCh.controls = ch.controls.map((ctrl: any) => {
          const nextCtrl = { ...ctrl };
          if (typeof nextCtrl.remediationPatch === 'string' && nextCtrl.remediationPatch.length > cap.patch) {
            nextCtrl.remediationPatch = nextCtrl.remediationPatch.slice(0, cap.patch) + '\n// ...[Truncated]...';
          }
          if (typeof nextCtrl.recommendations === 'string' && nextCtrl.recommendations.length > cap.rec) {
            nextCtrl.recommendations = nextCtrl.recommendations.slice(0, cap.rec) + '...';
          }
          if (typeof nextCtrl.evidence === 'string' && nextCtrl.evidence.length > cap.ev) {
            nextCtrl.evidence = nextCtrl.evidence.slice(0, cap.ev) + '...';
          }
          if (typeof nextCtrl.description === 'string' && nextCtrl.description.length > cap.desc) {
            nextCtrl.description = nextCtrl.description.slice(0, cap.desc) + '...';
          }
          return nextCtrl;
        });
      }
      return nextCh;
    });
    serialized = JSON.stringify(sanitized);
    byteLen = getUtf8ByteLength(serialized);
  }

  return stripUndefinedDeep(sanitized) as AuditReport;
}

/**
 * Validates whether a candidate object satisfies every constraint in `firestore.rules` `isValidAuditReport`.
 * Useful for pre-flight checks and unit tests.
 */
export function validateAuditReportSchema(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Report must be an object'] };
  }

  const checkOptionalString = (field: string, maxLen: number) => {
    if (field in data) {
      if (data[field] === undefined) {
        errors.push(`Field "${field}" is undefined (Firestore SDK rejects undefined fields unless stripped)`);
      } else if (typeof data[field] !== 'string') {
        errors.push(`Field "${field}" must be a string or omitted, got ${typeof data[field]}`);
      } else if (data[field].length > maxLen) {
        errors.push(`Field "${field}" length (${data[field].length}) exceeds maxLen (${maxLen})`);
      }
    }
  };

  if (typeof data.id !== 'string' || data.id.length < 1 || data.id.length > 128) {
    errors.push('id must be a string between 1 and 128 chars');
  }
  if (typeof data.systemName !== 'string' || data.systemName.length < 1 || data.systemName.length > 500) {
    errors.push('systemName must be a string between 1 and 500 chars');
  }
  if (typeof data.technicalLead !== 'string' || data.technicalLead.length > 300) {
    errors.push('technicalLead must be a string <= 300 chars');
  }
  if (typeof data.email !== 'string' || data.email.length > 320) {
    errors.push('email must be a string <= 320 chars');
  }
  if (typeof data.date !== 'string' || data.date.length < 4 || data.date.length > 64) {
    errors.push('date must be a string between 4 and 64 chars');
  }
  if (typeof data.description !== 'string' || data.description.length > 100_000) {
    errors.push(`description must be a string <= 100000 chars (got ${data.description?.length})`);
  }
  if (typeof data.executiveSummary !== 'string' || data.executiveSummary.length > 100_000) {
    errors.push(`executiveSummary must be a string <= 100000 chars (got ${data.executiveSummary?.length})`);
  }
  if (typeof data.overallScore !== 'number' || Number.isNaN(data.overallScore) || data.overallScore < 0 || data.overallScore > 100) {
    errors.push(`overallScore must be a number in [0, 100] (got ${typeof data.overallScore}: ${data.overallScore})`);
  }
  if (!Array.isArray(data.chapters) || data.chapters.length > 100) {
    errors.push('chapters must be an array with <= 100 items');
  }

  checkOptionalString('standard', 64);
  checkOptionalString('customFrameworkId', 128);
  checkOptionalString('customFrameworkName', 300);
  checkOptionalString('targetLevel', 16);
  checkOptionalString('achievedLevel', 32);
  checkOptionalString('levelAssessmentRationale', 20_000);
  checkOptionalString('remediatedArchitectureDoc', 200_000);
  checkOptionalString('ownerUid', 128);
  checkOptionalString('ownerEmail', 320);
  checkOptionalString('tenantDomain', 255);

  const byteLen = getUtf8ByteLength(JSON.stringify(data));
  if (byteLen > 1_048_576) {
    errors.push(`Total serialized UTF-8 byte length (${byteLen}) exceeds Firestore 1 MiB limit`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Merges multiple lists of AuditReports, deduplicating by `id` and sorting newest first.
 */
export function mergeAuditLists(...lists: Array<AuditReport[] | undefined | null>): AuditReport[] {
  const byId = new Map<string, AuditReport>();

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      if (!item || typeof item.id !== 'string' || !item.id.trim()) continue;
      const existing = byId.get(item.id);
      if (!existing) {
        byId.set(item.id, item);
      } else {
        // Prefer whichever entry has more appealHistory entries or ownership metadata
        const existingAppeals = (existing as any).appealHistory?.length || 0;
        const incomingAppeals = (item as any).appealHistory?.length || 0;
        if (incomingAppeals > existingAppeals || (!existing.ownerEmail && item.ownerEmail)) {
          byId.set(item.id, { ...existing, ...item });
        }
      }
    }
  }

  const sorted = Array.from(byId.values()).sort((a, b) => {
    const tA = new Date(a.date || 0).getTime() || 0;
    const tB = new Date(b.date || 0).getTime() || 0;
    return tB - tA;
  });

  // Collapse duplicate Live GCP Scan records for the same GCP project / system name (keeping the newest scan)
  const seenGcpScanKeys = new Set<string>();
  return sorted.filter((item) => {
    const isGcpScan =
      Boolean((item as any).isLiveGcpScan) ||
      Boolean(item.gcpProjectId) ||
      item.id.startsWith('gcp-audit-') ||
      /^Proyecto (Google Cloud|GCP):/i.test(item.systemName || '') ||
      /^GCP Live Scan:/i.test(item.systemName || '');
    if (!isGcpScan) return true;

    const extractedProject =
      (item.gcpProjectId || '').trim() ||
      (item.systemName || '')
        .replace(/^(Proyecto Google Cloud:|Proyecto GCP:|GCP Live Scan:)\s*/i, '')
        .trim();
    const gcpKey = (extractedProject || item.systemName || item.id).toLowerCase();
    if (seenGcpScanKeys.has(gcpKey)) {
      return false;
    }
    seenGcpScanKeys.add(gcpKey);
    return true;
  });
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

function getDefaultStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (_) {
    // Ignore storage access errors in restricted iframes
  }
  return null;
}

/**
 * Loads locally backed-up audits from localStorage so reports survive page reloads and sign-in transitions.
 */
export function loadAuditsFromLocalBackup(storage: StorageLike | null = getDefaultStorage()): AuditReport[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(LOCAL_STORAGE_AUDITS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((a) => a && typeof a.id === 'string' && Array.isArray(a.chapters));
  } catch (e) {
    console.warn('[AegisPersistence] Could not read local audit backup:', e);
    return [];
  }
}

/**
 * Saves or updates an AuditReport in localStorage backup (caps at 25 most recent reports to respect browser quota).
 */
export function saveAuditToLocalBackup(
  report: AuditReport,
  storage: StorageLike | null = getDefaultStorage()
): AuditReport[] {
  const existing = loadAuditsFromLocalBackup(storage);
  const merged = mergeAuditLists([report], existing).slice(0, 25);
  if (!storage) return merged;

  try {
    storage.setItem(LOCAL_STORAGE_AUDITS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    // Progressive compaction tiers if localStorage quota is tight
    const tiers = [8, 3, 1];
    for (const count of tiers) {
      try {
        const compact = merged.slice(0, count).map((item, idx) =>
          idx === 0 && count > 1
            ? item
            : {
                ...item,
                remediatedArchitectureDoc: undefined,
                description: (item.description || '').slice(0, 3000),
              }
        );
        storage.setItem(LOCAL_STORAGE_AUDITS_KEY, JSON.stringify(compact));
        return compact;
      } catch {
        // Try next smaller tier
      }
    }
    console.warn('[AegisPersistence] LocalStorage quota full even after progressive compaction.');
  }
  return merged;
}

/**
 * Removes an audit ID from localStorage backup when explicitly deleted by the user.
 */
export function removeAuditFromLocalBackup(
  auditId: string,
  storage: StorageLike | null = getDefaultStorage()
): AuditReport[] {
  const existing = loadAuditsFromLocalBackup(storage);
  const filtered = existing.filter((a) => a.id !== auditId);
  if (storage) {
    try {
      storage.setItem(LOCAL_STORAGE_AUDITS_KEY, JSON.stringify(filtered));
    } catch (_) {
      // Ignore
    }
  }
  return filtered;
}
