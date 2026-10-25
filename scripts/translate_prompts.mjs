import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const rawPrompts = JSON.parse(fs.readFileSync('/tmp/sanitized_prompts.json', 'utf8'));

function determinePhase(p) {
  const ts = p.timestamp || '';
  const conv = p.conv || '';
  if (conv.startsWith('2fa751ab')) {
    return {
      phaseNumber: 1,
      phaseName: 'Phase 1: Inception, Discovery & Full-Stack Architecture',
      phaseNameEs: 'Fase 1: Concepción, Descubrimiento y Arquitectura Full-Stack'
    };
  } else if (conv.startsWith('13376fc5')) {
    return {
      phaseNumber: 2,
      phaseName: 'Phase 2: Automated UI Testing & Early Verification',
      phaseNameEs: 'Fase 2: Pruebas Automatizadas de Interfaz y Verificación Temprana'
    };
  } else if (conv.startsWith('8b260bd6')) {
    return {
      phaseNumber: 3,
      phaseName: 'Phase 3: OWASP AISVS, ISO 42001 Standards & Dual-LLM Engine',
      phaseNameEs: 'Fase 3: Estándares OWASP AISVS, ISO 42001 y Motor Dual-LLM'
    };
  } else if (conv.startsWith('dc6ca0bc')) {
    return {
      phaseNumber: 4,
      phaseName: 'Phase 4: Modern Enterprise UI Redesign & Database Isolation',
      phaseNameEs: 'Fase 4: Rediseño Moderno Enterprise y Aislamiento de Base de Datos'
    };
  } else if (conv.startsWith('61488ff2')) {
    if (ts.startsWith('2026-09-24') || ts.startsWith('2026-09-25T00') || ts.startsWith('2026-09-25T01')) {
      return {
        phaseNumber: 5,
        phaseName: 'Phase 5: Cloud Security Audit, GCP SCC Comparison & Technical Manuals',
        phaseNameEs: 'Fase 5: Auditoría Cloud, Comparativa con GCP SCC y Manuales Técnicos'
      };
    } else if (ts.startsWith('2026-09-25')) {
      return {
        phaseNumber: 6,
        phaseName: 'Phase 6: Code Sanitization, PDF Generation & Open Source GitHub Release',
        phaseNameEs: 'Fase 6: Sanitización de Código, Generación de PDFs y Lanzamiento en GitHub'
      };
    } else {
      return {
        phaseNumber: 7,
        phaseName: 'Phase 7: Live Runtime Operations & Bilingual Documentation Suite',
        phaseNameEs: 'Fase 7: Operación en Tiempo Real y Suite de Documentación Bilingüe'
      };
    }
  }
  return {
    phaseNumber: 1,
    phaseName: 'General Development & Architecture',
    phaseNameEs: 'Desarrollo General y Arquitectura'
  };
}

async function translateBatch(items) {
  const prompt = `You are an expert AI software engineering translator.
Translate the following user prompts used during the development of AegisAI (an enterprise AI Security & Governance platform) from Spanish to technical, professional English.

Maintain the original intent, software engineering terminology, and instructions precisely.
Do not summarize. Provide a faithful, clean translation.

Input JSON:
${JSON.stringify(items.map(it => ({ id: it.id, original: it.original })), null, 2)}

Respond ONLY with a valid JSON array matching this format:
[
  {
    "id": <number>,
    "translated": "<English translation of the prompt>",
    "category": "<Brief 2-4 word topic, e.g. 'Database Setup', 'OWASP Control', 'UI Redesign'>"
  }
]
`;

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(res.text.trim());
    return parsed;
  } catch (err) {
    console.warn('Batch translation API error:', err.message);
    return items.map(it => ({
      id: it.id,
      translated: it.original,
      category: 'Engineering'
    }));
  }
}

async function main() {
  console.log(`Starting translation of ${rawPrompts.length} prompts...`);
  
  const mapped = rawPrompts.map((p, idx) => {
    const phaseInfo = determinePhase(p);
    return {
      id: idx + 1,
      ...p,
      ...phaseInfo
    };
  });

  const batchSize = 15;
  const results = [];

  for (let i = 0; i < mapped.length; i += batchSize) {
    const batch = mapped.slice(i, i + batchSize);
    console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mapped.length / batchSize)} (items ${i + 1} to ${i + batch.length})...`);
    const translations = await translateBatch(batch);
    
    for (const item of batch) {
      const match = translations.find(t => t.id === item.id);
      results.push({
        id: item.id,
        timestamp: item.timestamp,
        conv: item.conv,
        phaseNumber: item.phaseNumber,
        phaseName: item.phaseName,
        phaseNameEs: item.phaseNameEs,
        category: match?.category || 'Engineering',
        translated: match?.translated || item.original,
        original: item.original
      });
    }
  }

  fs.writeFileSync('/tmp/translated_prompts.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Successfully saved translated prompts to /tmp/translated_prompts.json');
}

main().catch(console.error);
