import http from 'http';

const BASE_URL = 'http://localhost:3000';

const sampleOmniArch = `
ESPECIFICACIÓN DE ARQUITECTURA TÉCNICA EMPRESARIAL
Sistema: AegisOmni Financial Advisor
Organización: Corporativo Financiero Global S.A. de C.V.
Alcance: OWASP AI-SVS 1.0, ISO/IEC 42001:2023, LFPDPPP México y LFPC México

1. IDENTIDAD Y TRANSPARENCIA COMERCIAL (LFPC Art. 76 BIS, ISO 42001 A.8)
- Identificación de Bot: Al inicio de cada sesión se muestra de forma explícita: "Asistente Virtual Automatizado impulsado por IA. No soy humano."
- Escalamiento a Persona Física: Botón permanente de transferencia inmediata a un ejecutivo humano disponible 24/7.
- Folios de Aclaración: Toda interacción emite un folio alfanumérico único para efectos de auditoría y aclaraciones ante PROFECO.
- Factual Grounding: Datos de cotizaciones, CAT y comisiones extraídos de APIs bancarias oficiales mediante function calling; las cotizaciones tienen vigencia de 7 días.

2. PRIVACIDAD Y GOBERNANZA DE DATOS (LFPDPPP Art. 6, 8, 16, 21, ISO 42001 A.7)
- Aviso de Privacidad: Aviso integral del INAI para IA generativa con consentimiento expreso del usuario.
- Redacción DLP Pre-Inferencia: Módulo Microsoft Presidio que anonimiza RFC, CURP, números de tarjeta y nombres antes de enviar información a LLMs.
- Base Vectorial Segura: Qdrant vector DB con cifrado AES-256 en reposo, CMEK y control de acceso RBAC por inquilino.
- Derechos ARCO: Microservicio para purga y desindexación de vectores en cascada cuando se solicita cancelación o eliminación.

3. SEGURIDAD TÉCNICA DE MODELOS Y LLMS (OWASP AI-SVS C01-C12)
- Plataforma: Google Gemini Enterprise SaaS con Zero Data Retention (ZDR) contractual.
- Sanitización de Entradas y Salidas: Filtros de Llama Guard y NeMo Guardrails para prevenir Prompt Injections y fuga de datos en outputs.
- Aislamiento de Ejecución: Inferencia en microVMs aisladas (gVisor) con mTLS 1.3 y tokens rotativos con KMS.
- Registro Inmutable: Logs centralizados en Cloud Logging y Cloud Audit Logs con almacenamiento WORM (OWASP Invariante 4).
`;

async function testMultiStandardAudit() {
  console.log('======================================================');
  console.log('🧪 TEST AUTOMATIZADO: AUDITORÍA MULTI-NORMATIVA SIMULTÁNEA');
  console.log('======================================================');

  const selectedStandards = [
    'fw-lfpdppp-mex-2026',
    'fw-lfpc-mex-2026'
  ];

  const payload = JSON.stringify({
    standardType: 'MULTI',
    selectedStandards,
    systemName: 'AegisOmni Financial Advisor',
    technicalLead: 'Ing. Alejandro Silva',
    email: 'alejandro.silva@corporativo.com.mx',
    techPlatform: 'gemini-enterprise',
    targetLevel: 'L2',
    description: sampleOmniArch
  });

  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${BASE_URL}/api/evaluate`);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let sseBuffer = '';
      let progressEvents = [];
      let finalAudit = null;

      res.on('data', (chunk) => {
        sseBuffer += chunk.toString();
        const parts = sseBuffer.split('\n\n');
        sseBuffer = parts.pop() || '';

        for (const part of parts) {
          const lines = part.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace(/^data:\s*/, '').trim();
              if (dataStr) {
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.type === 'progress' || parsed.percent !== undefined) {
                    progressEvents.push(parsed);
                    process.stdout.write(`\r[Progreso SSE] Etapa ${parsed.stage}/${parsed.totalStages} (${parsed.percent}%): ${parsed.message.slice(0, 50)}...`);
                  } else if (parsed.type === 'result' && parsed.data) {
                    finalAudit = parsed.data;
                  } else if (parsed.id && parsed.chapters) {
                    finalAudit = parsed;
                  }
                } catch (e) {
                  // Ignore
                }
              }
            }
          }
        }
      });

      res.on('end', () => {
        // Process any leftover in buffer
        if (sseBuffer.trim()) {
          const lines = sseBuffer.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace(/^data:\s*/, '').trim();
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === 'result' && parsed.data) {
                  finalAudit = parsed.data;
                } else if (parsed.id && parsed.chapters) {
                  finalAudit = parsed;
                }
              } catch (e) {}
            }
          }
        }

        console.log('\n\n======================================================');
        console.log('📊 VERIFICACIÓN DE RESULTADOS MULTI-NORMATIVOS');
        console.log('======================================================');

        if (!finalAudit) {
          console.error('❌ Error: No se recibió el reporte de auditoría final.');
          return reject(new Error('No audit report received'));
        }

        console.log(`✅ ID de Auditoría: ${finalAudit.id}`);
        console.log(`✅ Tipo de Norma: ${finalAudit.standard} (Esperado: MULTI)`);
        console.log(`✅ Normas Evaluadas: ${JSON.stringify(finalAudit.standards)}`);
        console.log(`✅ Calificación Global Ponderada: ${finalAudit.overallScore.toFixed(1)}%`);
        console.log(`✅ Total de Capítulos Generados: ${finalAudit.chapters.length}`);

        // Verify breakdown
        if (!finalAudit.standardsBreakdown || finalAudit.standardsBreakdown.length !== selectedStandards.length) {
          console.error(`❌ Fallo: standardsBreakdown esperado con ${selectedStandards.length} normas, recibido: ${finalAudit.standardsBreakdown?.length}`);
          return reject(new Error('Invalid standardsBreakdown length'));
        }

        console.log('\n📈 DESGLOSE POR NORMATIVA (Compliance 360°):');
        finalAudit.standardsBreakdown.forEach(st => {
          console.log(`  - [${st.standardId}] ${st.standardName}: ${st.score.toFixed(1)}% (${st.passedControls}/${st.totalControls} controles aprobados)`);
        });

        // Verify chapter attribution
        const missingAttribution = finalAudit.chapters.filter(ch => !ch.standardId || !ch.standardName);
        if (missingAttribution.length > 0) {
          console.error(`❌ Error: Hay ${missingAttribution.length} capítulos sin standardId/standardName.`);
          return reject(new Error('Missing standard attribution in chapters'));
        }

        console.log('\n✅ Todos los capítulos cuentan con atribución explícita a su estándar padre.');
        console.log('🎉 AUDITORÍA MULTI-NORMATIVA SIMULTÁNEA VALIDADA EXITOSAMENTE!');
        resolve(finalAudit);
      });
    });

    req.on('error', (err) => {
      console.error('❌ Error en solicitud HTTP:', err);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

testMultiStandardAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
