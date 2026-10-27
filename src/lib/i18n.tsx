import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Globe, Check, ChevronDown, Loader2 } from 'lucide-react';
import { AuditReport, AISVSChapter, PuntoProbado } from '../types';
import { SupportedLanguage, EXACT_TRANSLATIONS, PATTERN_TRANSLATIONS, CHAPTER_INFO_I18N } from './translationsDict';
import { getLocalizedSampleAudit, SAMPLE_AUDITS_BY_LANG } from './sampleAuditsEn';

export type { SupportedLanguage };
export { CHAPTER_INFO_I18N };

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', label: 'Español', shortLabel: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'English', shortLabel: 'EN', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', shortLabel: 'PT', flag: '🇧🇷' },
  { code: 'fr', label: 'Français', shortLabel: 'FR', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', shortLabel: 'DE', flag: '🇩🇪' },
];

const STORAGE_LANG_KEY = 'aegis_preferred_lang';
const STORAGE_CACHE_KEY = 'aegis_i18n_cache_v4';

// In-memory dynamic translation cache hydrated from localStorage
const dynamicCache: Record<string, Record<string, string>> = {
  en: {},
  pt: {},
  fr: {},
  de: {},
};

try {
  if (typeof window !== 'undefined') {
    // Purge legacy caches that could contain broken multi-line or untranslated fallback strings
    window.localStorage.removeItem('aegis_i18n_cache_v1');
    window.localStorage.removeItem('aegis_i18n_cache_v2');
    window.localStorage.removeItem('aegis_i18n_cache_v3');
    const raw = window.localStorage.getItem(STORAGE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        for (const k of ['en', 'pt', 'fr', 'de']) {
          if (parsed[k] && typeof parsed[k] === 'object') {
            Object.assign(dynamicCache[k], parsed[k]);
          }
        }
      }
    }
  }
} catch {
  // Ignore storage errors
}

function saveDynamicCache() {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(dynamicCache));
    }
  } catch {
    // Ignore quota errors
  }
}

// Per-language lookup of already-translated target strings so DOMTranslator never queues an already-translated string for /api/translate-batch
const KNOWN_TRANSLATED_BY_LANG: Record<SupportedLanguage, Set<string>> = {
  es: new Set<string>(),
  en: new Set<string>(),
  pt: new Set<string>(),
  fr: new Set<string>(),
  de: new Set<string>(),
};

for (const entry of Object.values(EXACT_TRANSLATIONS)) {
  if (entry.en) KNOWN_TRANSLATED_BY_LANG.en.add(entry.en.trim());
  if (entry.pt) KNOWN_TRANSLATED_BY_LANG.pt.add(entry.pt.trim());
  if (entry.fr) KNOWN_TRANSLATED_BY_LANG.fr.add(entry.fr.trim());
  if (entry.de) KNOWN_TRANSLATED_BY_LANG.de.add(entry.de.trim());
}

for (const langKey of ['en', 'pt', 'fr', 'de'] as const) {
  const chMap = CHAPTER_INFO_I18N[langKey] || {};
  for (const ch of Object.values(chMap)) {
    if (ch.title) KNOWN_TRANSLATED_BY_LANG[langKey].add(ch.title.trim());
    if (ch.desc) KNOWN_TRANSLATED_BY_LANG[langKey].add(ch.desc.trim());
  }
  const sampleMap = SAMPLE_AUDITS_BY_LANG[langKey] || {};
  for (const auditLoc of Object.values(sampleMap)) {
    if (auditLoc.systemName) KNOWN_TRANSLATED_BY_LANG[langKey].add(auditLoc.systemName.trim());
    if (auditLoc.description) KNOWN_TRANSLATED_BY_LANG[langKey].add(auditLoc.description.trim());
    if (auditLoc.executiveSummary) KNOWN_TRANSLATED_BY_LANG[langKey].add(auditLoc.executiveSummary.trim());
    if (auditLoc.levelAssessmentRationale) KNOWN_TRANSLATED_BY_LANG[langKey].add(auditLoc.levelAssessmentRationale.trim());
    for (const ch of auditLoc.chapters || []) {
      if (ch.chapterName) KNOWN_TRANSLATED_BY_LANG[langKey].add(ch.chapterName.trim());
      for (const pt of ch.puntosProbados || []) {
        if (pt.name) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.name.trim());
        if (pt.comoSeAprobo) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.comoSeAprobo.trim());
        if (pt.comoFallo) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.comoFallo.trim());
        if (pt.fuenteEvidencia) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.fuenteEvidencia.trim());
        if (pt.textoEvidencia) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.textoEvidencia.trim());
        if (pt.remediation) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.remediation.trim());
        if (pt.remediationDetails?.strategy) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.remediationDetails.strategy.trim());
        if (pt.remediationDetails?.effortLevel) KNOWN_TRANSLATED_BY_LANG[langKey].add(pt.remediationDetails.effortLevel.trim());
        for (const step of pt.remediationDetails?.actionableSteps || []) {
          if (step) KNOWN_TRANSLATED_BY_LANG[langKey].add(step.trim());
        }
      }
    }
  }
  for (const val of Object.values(dynamicCache[langKey] || {})) {
    if (val) KNOWN_TRANSLATED_BY_LANG[langKey].add(val.trim());
  }
}

/**
 * Checks whether a string looks like a non-translatable token (numbers, IDs, URLs, emails, hashes, etc.)
 */
function isNonTranslatableToken(trimmed: string): boolean {
  if (!trimmed || trimmed.length < 2) return true;
  if (/^[\d\s.,:%+\-*/=()[\]{}|•·—–_#@!$?<>~`"'\\]+$/.test(trimmed)) return true;
  if (/^(C\d+|A\.\d+(\.\d+)*|Clause\s*\d+|L[123]|v\d+(\.\d+)*|ISO\/IEC.*|OWASP.*|NIST.*|EU AI Act|N\/A|SaaS|PaaS|IaaS|On-Prem|Auto|JSON|PDF|CSV|SHA-256|TLS\s*1\.\d|AES-256)$/i.test(trimmed)) return true;
  if (/^(https?:\/\/|gs:\/\/|projects\/|roles\/|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/.test(trimmed)) return true;
  if (/^[a-z0-9-_]{12,}$/i.test(trimmed) && !trimmed.includes(' ')) return true;
  return false;
}

/**
 * Synchronously translates a Spanish string using EXACT_TRANSLATIONS, PATTERN_TRANSLATIONS, or dynamicCache.
 * Returns { text, found } so callers know whether an async fallback is needed.
 */
export function translateLookup(raw: string, lang: SupportedLanguage): { text: string; found: boolean } {
  if (!raw || lang === 'es') return { text: raw, found: true };

  const trimmed = raw.trim();
  if (!trimmed || isNonTranslatableToken(trimmed)) {
    return { text: raw, found: true };
  }

  const norm = trimmed.replace(/\s+/g, ' ');
  const leadingSpaces = raw.match(/^\s*/)?.[0] || '';
  const trailingSpaces = raw.match(/\s*$/)?.[0] || '';

  // 1. Exact dictionary match (try raw trimmed first, then normalized whitespace)
  const exact = EXACT_TRANSLATIONS[trimmed] || EXACT_TRANSLATIONS[norm];
  if (exact) {
    const translated = exact[lang as keyof typeof exact] || exact.en;
    if (translated) {
      return { text: `${leadingSpaces}${translated}${trailingSpaces}`, found: true };
    }
  }

  // 2. Dynamic cache match
  const cached = dynamicCache[lang]?.[trimmed] || dynamicCache[lang]?.[norm];
  if (cached) {
    return { text: `${leadingSpaces}${cached}${trailingSpaces}`, found: true };
  }

  // 3. Pattern regex match
  for (const pat of PATTERN_TRANSLATIONS) {
    const match = trimmed.match(pat.regex) || (norm !== trimmed ? norm.match(pat.regex) : null);
    if (match) {
      const fn = (pat as any)[lang] || pat.en;
      if (typeof fn === 'function') {
        const result = fn(...match.slice(1));
        return { text: `${leadingSpaces}${result}${trailingSpaces}`, found: true };
      }
    }
  }

  // 4. Already translated in the active target language (e.g. rendered by t() or useTranslatedAudit)
  if (KNOWN_TRANSLATED_BY_LANG[lang]?.has(trimmed) || KNOWN_TRANSLATED_BY_LANG[lang]?.has(norm)) {
    return { text: raw, found: true };
  }

  return { text: raw, found: false };
}

export function translateStatic(raw: string, lang: SupportedLanguage): string {
  return translateLookup(raw, lang).text;
}

interface LanguageContextValue {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  t: (text: string) => string;
  tStatus: (status: string) => string;
  tRisk: (risk: string) => string;
  isTranslating: boolean;
  cacheVersion: number;
  queueMissingTexts: (texts: string[]) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  setLang: () => {},
  t: (text: string) => text,
  tStatus: (status: string) => status,
  tRisk: (risk: string) => risk,
  isTranslating: false,
  cacheVersion: 0,
  queueMissingTexts: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

// Build a point-level lookup table from SAMPLE_AUDITS_BY_LANG so even if a sample audit was saved to Firestore under a new ID, its points still translate in 0ms!
const SAMPLE_POINT_TRANSLATIONS: Record<SupportedLanguage, Record<string, Partial<PuntoProbado>>> = {
  es: {},
  en: {},
  pt: {},
  fr: {},
  de: {},
};

for (const langKey of ['en', 'pt', 'fr', 'de'] as const) {
  const mapForLang = SAMPLE_AUDITS_BY_LANG[langKey] || {};
  for (const [auditId, auditLoc] of Object.entries(mapForLang)) {
    for (const ch of auditLoc.chapters || []) {
      for (const pt of ch.puntosProbados || []) {
        // Store both by composite key and point ID
        SAMPLE_POINT_TRANSLATIONS[langKey][`${auditId}::${pt.id}`] = pt;
        if (!SAMPLE_POINT_TRANSLATIONS[langKey][pt.id]) {
          SAMPLE_POINT_TRANSLATIONS[langKey][pt.id] = pt;
        }
      }
    }
  }
}

/**
 * Translates a single AuditReport into the target language while strictly preserving `status` ('Aprobado' | 'Fallido' | 'Falta Evidencia')
 * so that all compliance calculations and charts continue to work seamlessly.
 */
export function localizeAuditReportSync(
  audit: AuditReport,
  lang: SupportedLanguage,
  missingCollector?: Set<string>
): AuditReport {
  if (!audit || lang === 'es') return audit;

  // Step 1: Apply instant pre-translated sample audit if ID matches one of the 5 sample audits
  const sampleLocalized = getLocalizedSampleAudit(audit, lang);
  const isKnownSampleId = Boolean(SAMPLE_AUDITS_BY_LANG[lang]?.[audit.id]);
  if (isKnownSampleId) {
    return sampleLocalized;
  }

  const resolveStr = (str?: string): string => {
    if (!str) return str || '';
    const { text, found } = translateLookup(str, lang);
    if (!found && missingCollector) {
      missingCollector.add(str.trim());
    }
    return text;
  };

  const localizedChapters: AISVSChapter[] = (audit.chapters || []).map((ch) => {
    const chInfo = CHAPTER_INFO_I18N[lang]?.[ch.chapterId];
    const chapterName = chInfo?.title || resolveStr(ch.chapterName);

    const puntosProbados: PuntoProbado[] = (ch.puntosProbados || []).map((p) => {
      // Check if this exact point matches our pre-translated sample point library (e.g., if sample audit was cloned)
      const samplePt = SAMPLE_POINT_TRANSLATIONS[lang]?.[`${audit.id}::${p.id}`];
      if (samplePt) {
        return {
          ...p,
          name: samplePt.name || p.name,
          comoSeAprobo: samplePt.comoSeAprobo || p.comoSeAprobo,
          comoFallo: samplePt.comoFallo || p.comoFallo,
          fuenteEvidencia: samplePt.fuenteEvidencia || p.fuenteEvidencia,
          textoEvidencia: samplePt.textoEvidencia || p.textoEvidencia,
          remediation: samplePt.remediation || p.remediation,
          remediationDetails: p.remediationDetails && samplePt.remediationDetails
            ? {
                ...p.remediationDetails,
                strategy: samplePt.remediationDetails.strategy || p.remediationDetails.strategy,
                actionableSteps: samplePt.remediationDetails.actionableSteps || p.remediationDetails.actionableSteps,
                effortLevel: samplePt.remediationDetails.effortLevel || p.remediationDetails.effortLevel,
              }
            : p.remediationDetails,
          status: p.status, // Never mutate canonical status
        };
      }

      return {
        ...p,
        name: resolveStr(p.name),
        comoSeAprobo: p.comoSeAprobo ? resolveStr(p.comoSeAprobo) : p.comoSeAprobo,
        comoFallo: p.comoFallo ? resolveStr(p.comoFallo) : p.comoFallo,
        fuenteEvidencia: p.fuenteEvidencia ? resolveStr(p.fuenteEvidencia) : p.fuenteEvidencia,
        textoEvidencia: p.textoEvidencia ? resolveStr(p.textoEvidencia) : p.textoEvidencia,
        remediation: p.remediation ? resolveStr(p.remediation) : p.remediation,
        remediationDetails: p.remediationDetails
          ? {
              ...p.remediationDetails,
              strategy: p.remediationDetails.strategy ? resolveStr(p.remediationDetails.strategy) : p.remediationDetails.strategy,
              effortLevel: p.remediationDetails.effortLevel ? resolveStr(p.remediationDetails.effortLevel) : p.remediationDetails.effortLevel,
              actionableSteps: (p.remediationDetails.actionableSteps || []).map((step) => resolveStr(step)),
            }
          : p.remediationDetails,
        status: p.status, // Never mutate canonical status
      };
    });

    return {
      ...ch,
      chapterName,
      puntosProbados,
    };
  });

  return {
    ...audit,
    systemName: resolveStr(audit.systemName),
    description: resolveStr(audit.description),
    executiveSummary: audit.executiveSummary ? resolveStr(audit.executiveSummary) : audit.executiveSummary,
    levelAssessmentRationale: audit.levelAssessmentRationale ? resolveStr(audit.levelAssessmentRationale) : audit.levelAssessmentRationale,
    customFrameworkName: audit.customFrameworkName ? resolveStr(audit.customFrameworkName) : audit.customFrameworkName,
    chapters: localizedChapters,
  };
}

/**
 * Hook that returns a localized array of AuditReports and automatically fetches batch translations for any custom findings.
 */
export function useTranslatedAudits(audits: AuditReport[]): AuditReport[] {
  const { lang, cacheVersion, queueMissingTexts } = useLanguage();

  const { localized, missing } = useMemo(() => {
    if (lang === 'es') return { localized: audits, missing: [] as string[] };
    const collector = new Set<string>();
    const list = audits.map((a) => localizeAuditReportSync(a, lang, collector));
    return { localized: list, missing: Array.from(collector) };
  }, [audits, lang, cacheVersion]);

  useEffect(() => {
    if (missing.length > 0 && lang !== 'es') {
      queueMissingTexts(missing);
    }
  }, [missing, lang, queueMissingTexts]);

  return localized;
}

/**
 * Hook that returns a single localized AuditReport and automatically translates any custom findings.
 */
export function useTranslatedAudit(audit: AuditReport): AuditReport {
  const { lang, cacheVersion, queueMissingTexts } = useLanguage();

  const { localized, missing } = useMemo(() => {
    if (lang === 'es') return { localized: audit, missing: [] as string[] };
    const collector = new Set<string>();
    const item = localizeAuditReportSync(audit, lang, collector);
    return { localized: item, missing: Array.from(collector) };
  }, [audit, lang, cacheVersion]);

  useEffect(() => {
    if (missing.length > 0 && lang !== 'es') {
      queueMissingTexts(missing);
    }
  }, [missing, lang, queueMissingTexts]);

  return localized;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<SupportedLanguage>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_LANG_KEY) as SupportedLanguage | null;
      if (saved && ['es', 'en', 'pt', 'fr', 'de'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'es';
  });

  const [cacheVersion, setCacheVersion] = useState(0);
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingSetRef = useRef<Set<string>>(new Set());
  const inFlightSetRef = useRef<Set<string>>(new Set());
  const flushTimerRef = useRef<number | null>(null);

  const setLang = useCallback((nextLang: SupportedLanguage) => {
    setLangState(nextLang);
    try {
      window.localStorage.setItem(STORAGE_LANG_KEY, nextLang);
      document.documentElement.lang = nextLang;
    } catch {
      // ignore
    }
  }, []);

  const flushPendingTranslations = useCallback(async (targetLang: SupportedLanguage) => {
    if (targetLang === 'es') {
      pendingSetRef.current.clear();
      return;
    }
    const items = Array.from<string>(pendingSetRef.current).filter(
      (txt) => !dynamicCache[targetLang]?.[txt] && !inFlightSetRef.current.has(`${targetLang}::${txt}`)
    );
    pendingSetRef.current.clear();

    if (items.length === 0) return;

    items.forEach((txt) => inFlightSetRef.current.add(`${targetLang}::${txt}`));
    setIsTranslating(true);

    try {
      // Send in chunks of 60 strings for maximum speed
      const CHUNK_SIZE = 60;
      for (let i = 0; i < items.length; i += CHUNK_SIZE) {
        const chunk = items.slice(i, i + CHUNK_SIZE);
        const res = await fetch('/api/translate-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ texts: chunk, targetLang }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.translations && typeof data.translations === 'object') {
            if (!dynamicCache[targetLang]) dynamicCache[targetLang] = {};
            for (const [orig, trans] of Object.entries(data.translations)) {
              if (typeof trans === 'string' && trans.trim() && trans.trim() !== orig.trim()) {
                dynamicCache[targetLang][orig] = trans;
                KNOWN_TRANSLATED_BY_LANG[targetLang]?.add(trans.trim());
              }
            }
            saveDynamicCache();
            setCacheVersion((v) => v + 1);
          }
        }
      }
    } catch (err) {
      console.warn('Batch translation warning:', err);
    } finally {
      items.forEach((txt) => inFlightSetRef.current.delete(`${targetLang}::${txt}`));
      setIsTranslating(false);
    }
  }, []);

  const queueMissingTexts = useCallback(
    (texts: string[]) => {
      if (lang === 'es' || !texts.length) return;
      let added = false;
      for (const raw of texts) {
        const trimmed = raw?.trim();
        if (
          trimmed &&
          !isNonTranslatableToken(trimmed) &&
          !dynamicCache[lang]?.[trimmed] &&
          !inFlightSetRef.current.has(`${lang}::${trimmed}`)
        ) {
          pendingSetRef.current.add(trimmed);
          added = true;
        }
      }
      if (added) {
        if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
        flushTimerRef.current = window.setTimeout(() => {
          flushPendingTranslations(lang);
        }, 45);
      }
    },
    [lang, flushPendingTranslations]
  );

  const t = useCallback(
    (text: string): string => {
      if (!text || lang === 'es') return text;
      const { text: translated, found } = translateLookup(text, lang);
      if (!found) {
        queueMissingTexts([text]);
      }
      return translated;
    },
    [lang, cacheVersion, queueMissingTexts]
  );

  const tStatus = useCallback(
    (status: string): string => {
      if (lang === 'es') return status;
      const map: Record<SupportedLanguage, Record<string, string>> = {
        es: { Aprobado: 'Aprobado', Fallido: 'Fallido', 'Falta Evidencia': 'Falta Evidencia' },
        en: { Aprobado: 'Passed', Fallido: 'Failed', 'Falta Evidencia': 'Missing Evidence' },
        pt: { Aprobado: 'Aprovado', Fallido: 'Falhou', 'Falta Evidencia': 'Falta Evidência' },
        fr: { Aprobado: 'Approuvé', Fallido: 'Échoué', 'Falta Evidencia': 'Preuve Manquante' },
        de: { Aprobado: 'Bestanden', Fallido: 'Fehlgeschlagen', 'Falta Evidencia': 'Fehlende Nachweise' },
      };
      return map[lang]?.[status] || t(status);
    },
    [lang, t]
  );

  const tRisk = useCallback(
    (risk: string): string => {
      if (lang === 'es') return risk;
      const map: Record<SupportedLanguage, Record<string, string>> = {
        es: { Alto: 'Alto', Medio: 'Medio', Bajo: 'Bajo', Crítico: 'Crítico' },
        en: { Alto: 'High', Medio: 'Medium', Bajo: 'Low', Crítico: 'Critical' },
        pt: { Alto: 'Alto', Medio: 'Médio', Bajo: 'Baixo', Crítico: 'Crítico' },
        fr: { Alto: 'Élevé', Medio: 'Moyen', Bajo: 'Faible', Crítico: 'Critique' },
        de: { Alto: 'Hoch', Medio: 'Mittel', Bajo: 'Niedrig', Crítico: 'Kritisch' },
      };
      return map[lang]?.[risk] || t(risk);
    },
    [lang, t]
  );

  // Automatic DOM translation observer so every view, modal, table, tooltip, placeholder, and dynamic finding is 100% localized
  useEffect(() => {
    const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'NOSCRIPT', 'SVG', 'PATH']);
    let isApplyingDOM = false;

    const processRoot = (rootNode: Node) => {
      if (isApplyingDOM) return;
      isApplyingDOM = true;
      const missingBatch: string[] = [];

      try {
        const walker = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        let currentNode: Node | null = walker.currentNode;

        while (currentNode) {
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const el = currentNode as HTMLElement;
            if (el.hasAttribute('data-no-translate')) {
              currentNode = walker.nextNode();
              continue;
            }
            // Translate placeholder and title attributes
            for (const attr of ['placeholder', 'title']) {
              const currentAttr = el.getAttribute(attr);
              if (currentAttr) {
                const origKey = `__origEs_${attr}`;
                const lastAppliedKey = `__lastApplied_${attr}`;
                const savedOrig = (el as any)[origKey] as string | undefined;
                const lastApplied = (el as any)[lastAppliedKey] as string | undefined;

                let baseEs = savedOrig;
                if (!baseEs || currentAttr !== lastApplied) {
                  baseEs = currentAttr;
                  (el as any)[origKey] = baseEs;
                }

                if (lang === 'es') {
                  if (baseEs && currentAttr !== baseEs) {
                    el.setAttribute(attr, baseEs);
                  }
                  (el as any)[lastAppliedKey] = baseEs;
                } else if (baseEs) {
                  const { text: translatedAttr, found } = translateLookup(baseEs, lang);
                  if (!found) {
                    missingBatch.push(baseEs.trim());
                  }
                  if (translatedAttr !== currentAttr) {
                    el.setAttribute(attr, translatedAttr);
                  }
                  (el as any)[lastAppliedKey] = translatedAttr;
                }
              }
            }
          } else if (currentNode.nodeType === Node.TEXT_NODE) {
            const parent = currentNode.parentElement;
            if (parent && !SKIP_TAGS.has(parent.tagName) && !parent.closest('[data-no-translate="true"], pre, code')) {
              const currentVal = currentNode.nodeValue || '';
              if (currentVal.trim()) {
                const nAny = currentNode as any;
                const savedOrig: string | undefined = nAny.__origEsText;
                const lastApplied: string | undefined = nAny.__lastAppliedText;

                let baseEs = savedOrig;
                // If React updated the text node to a new value that wasn't our own translation output, capture it as the new base text
                if (!baseEs || currentVal !== lastApplied) {
                  baseEs = currentVal;
                  nAny.__origEsText = baseEs;
                }

                if (lang === 'es') {
                  if (baseEs && currentVal !== baseEs) {
                    currentNode.nodeValue = baseEs;
                  }
                  nAny.__lastAppliedText = baseEs;
                } else if (baseEs) {
                  const { text: translatedVal, found } = translateLookup(baseEs, lang);
                  if (!found) {
                    missingBatch.push(baseEs.trim());
                  }
                  if (translatedVal !== currentVal) {
                    currentNode.nodeValue = translatedVal;
                  }
                  nAny.__lastAppliedText = translatedVal;
                }
              }
            }
          }
          currentNode = walker.nextNode();
        }
      } finally {
        isApplyingDOM = false;
      }

      if (missingBatch.length > 0 && lang !== 'es') {
        queueMissingTexts(missingBatch);
      }
    };

    // Initial pass over document.body
    processRoot(document.body);

    // Observe dynamic DOM changes (view switches, modals, accordion expansions, live scan logs)
    let rafId: number | null = null;
    const observer = new MutationObserver(() => {
      if (isApplyingDOM) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        processRoot(document.body);
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [lang, cacheVersion, queueMissingTexts]);

  const contextValue = useMemo(
    () => ({
      lang,
      setLang,
      t,
      tStatus,
      tRisk,
      isTranslating,
      cacheVersion,
      queueMissingTexts,
    }),
    [lang, setLang, t, tStatus, tRisk, isTranslating, cacheVersion, queueMissingTexts]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const LanguageSelector: React.FC<{
  variant?: 'sidebar' | 'header' | 'dark' | 'compact';
  className?: string;
}> = ({ variant = 'header', className = '' }) => {
  const { lang, setLang, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'sidebar') {
    return (
      <div
        ref={containerRef}
        data-no-translate="true"
        className={`relative px-4 py-2 ${className}`}
      >
        <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700/80 rounded-lg p-1.5">
          <div className="flex items-center gap-1.5 px-1.5 text-xs font-medium text-slate-300">
            {isTranslating ? (
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              {lang === 'es' ? 'Idioma' : 'Language'}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {LANGUAGES.map((opt) => {
              const active = opt.code === lang;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  title={opt.label}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {opt.shortLabel}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const isDark = variant === 'dark';

  return (
    <div
      ref={containerRef}
      data-no-translate="true"
      className={`relative inline-block text-left ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-xs ${
          isDark
            ? 'bg-slate-800/90 text-slate-100 border-slate-700 hover:bg-slate-700'
            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-indigo-300'
        }`}
      >
        {isTranslating ? (
          <Loader2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
        ) : (
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
        )}
        <span>{currentOption.flag}</span>
        <span>{currentOption.label}</span>
        <span className="px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 font-mono text-[10px] font-bold">
          {currentOption.shortLabel}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-1.5 w-44 rounded-xl shadow-xl border z-50 py-1 overflow-hidden ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          {LANGUAGES.map((opt) => {
            const active = opt.code === lang;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLang(opt.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                  active
                    ? isDark
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                      : 'bg-indigo-50 text-indigo-700 font-semibold'
                    : isDark
                    ? 'hover:bg-slate-800 text-slate-300'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <span>{opt.label}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono opacity-60">{opt.shortLabel}</span>
                  {active && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
