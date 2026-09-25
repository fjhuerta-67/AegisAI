import http from 'node:http';

const BASE_URL = 'http://localhost:3000';

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(`${BASE_URL}${path}`);
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runGcpLiveScannerTests() {
  console.log('======================================================================');
  console.log('🧪 BATERÍA DE PRUEBAS AUTOMATIZADAS: GCP LIVE SCANNER (AegisAI)');
  console.log('   Inspección en vivo de proyectos Google Cloud (Zero-Footprint)');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  // TEST 1: Prueba de Conexión en Modo Demo
  try {
    console.log('[TEST 1] POST /api/gcp/test-connection (Modo Demo)');
    const res = await postJson('/api/gcp/test-connection', {
      projectId: 'aegis-fintech-ai-prod',
      authMode: 'demo'
    });

    if (res.status === 200 && res.data?.ok && res.data?.projectId === 'aegis-fintech-ai-prod') {
      console.log(`  --> OK: Conexión verificada exitosamente (${res.data.message})`);
      passed++;
    } else {
      throw new Error(`Respuesta inesperada: HTTP ${res.status} - ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.error(`  --> FALLO: ${e.message}`);
    failed++;
  }

  // TEST 2: Validación de Parámetros Requeridos
  try {
    console.log('\n[TEST 2] POST /api/gcp/test-connection (Falta projectId)');
    const res = await postJson('/api/gcp/test-connection', {
      projectId: '',
      authMode: 'demo'
    });

    if (res.status === 400 && res.data?.error) {
      console.log(`  --> OK: Servidor rechazó correctamente la solicitud inválida (${res.data.error})`);
      passed++;
    } else {
      throw new Error(`Se esperaba HTTP 400 pero se recibió ${res.status}`);
    }
  } catch (e) {
    console.error(`  --> FALLO: ${e.message}`);
    failed++;
  }

  // TEST 3: Escaneo de Telemetría e Inventario de Recursos
  let scannedTelemetry = null;
  try {
    console.log('\n[TEST 3] POST /api/gcp/scan (Recolección de Telemetría)');
    const res = await postJson('/api/gcp/scan', {
      projectId: 'aegis-fintech-ai-prod',
      authMode: 'demo',
      components: {
        iam: true,
        storage: true,
        cloudRun: true,
        vertexAi: true,
        kmsAndSecrets: true
      }
    });

    if (res.status === 200 && res.data?.ok && res.data?.telemetry) {
      scannedTelemetry = res.data.telemetry;
      console.log(`  --> Total Activos Encontrados: ${scannedTelemetry.totalResourcesFound}`);
      console.log(`  --> Buckets: ${scannedTelemetry.resources.buckets.length}`);
      console.log(`  --> Cloud Run: ${scannedTelemetry.resources.cloudRunServices.length}`);
      console.log(`  --> Vertex Endpoints: ${scannedTelemetry.resources.vertexEndpoints.length}`);
      console.log(`  --> Hallazgos IAM: ${scannedTelemetry.resources.iamFindings.length}`);
      console.log(`  --> Resumen de Alertas: ${JSON.stringify(scannedTelemetry.findingsSummary)}`);
      
      if (scannedTelemetry.totalResourcesFound >= 7 && scannedTelemetry.rawManifestMarkdown) {
        console.log('  --> OK: Telemetría e inventario estructurados correctamente.');
        passed++;
      } else {
        throw new Error('La telemetría no contiene los recursos mínimos esperados.');
      }
    } else {
      throw new Error(`Respuesta inválida: HTTP ${res.status} - ${JSON.stringify(res.data)}`);
    }
  } catch (e) {
    console.error(`  --> FALLO: ${e.message}`);
    failed++;
  }

  // TEST 4: Auditoría en Vivo con Streaming SSE y Motor Multi-Normativa
  try {
    console.log('\n[TEST 4] POST /api/gcp/audit (SSE Stream con IA y Normativas AISVS + ISO 42001)');
    const auditPromise = new Promise((resolve, reject) => {
      const urlObj = new URL(`${BASE_URL}/api/gcp/audit`);
      const payload = JSON.stringify({
        projectId: 'aegis-fintech-ai-prod',
        authMode: 'demo',
        selectedStandards: ['AI-SVS', 'ISO-42001'],
        systemName: 'GCP Fintech Live Architecture',
        targetLevel: 'L2'
      });

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
        let finalReport = null;

        res.on('data', (chunk) => {
          sseBuffer += chunk.toString();
          const parts = sseBuffer.split('\n\n');
          sseBuffer = parts.pop() || '';

          for (const part of parts) {
            for (const line of part.split('\n')) {
              if (line.startsWith('data: ')) {
                const dataStr = line.replace(/^data:\s*/, '').trim();
                try {
                  const ev = JSON.parse(dataStr);
                  if (ev.type === 'progress') {
                    process.stdout.write(`\r  --> [Progreso SSE] ${ev.percent}%: ${ev.message.slice(0, 55)}...`);
                  } else if (ev.type === 'result' && ev.data) {
                    finalReport = ev.data;
                  }
                } catch (_) {}
              }
            }
          }
        });

        res.on('end', () => {
          if (sseBuffer.trim()) {
            for (const line of sseBuffer.split('\n')) {
              if (line.startsWith('data: ')) {
                try {
                  const ev = JSON.parse(line.replace(/^data:\s*/, '').trim());
                  if (ev.type === 'result' && ev.data) finalReport = ev.data;
                } catch (_) {}
              }
            }
          }

          if (finalReport) {
            console.log('\n  --> Auditoría recibida con éxito!');
            console.log(`  --> Score Global: ${finalReport.overallScore?.toFixed(1)}%`);
            console.log(`  --> isLiveGcpScan: ${finalReport.isLiveGcpScan}`);
            console.log(`  --> gcpProjectId: ${finalReport.gcpProjectId}`);
            console.log(`  --> Capítulos evaluados: ${finalReport.chapters?.length}`);
            resolve(finalReport);
          } else {
            reject(new Error('No se recibió el reporte de auditoría final por SSE.'));
          }
        });
      });

      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    const report = await auditPromise;
    if (report.isLiveGcpScan && report.gcpProjectId === 'aegis-fintech-ai-prod' && report.chapters?.length > 0) {
      console.log('  --> OK: Flujo de auditoría en vivo verificado de principio a fin.');
      passed++;
    } else {
      throw new Error('El reporte no contiene las marcas de auditoría en vivo de GCP.');
    }
  } catch (e) {
    console.error(`  --> FALLO: ${e.message}`);
    failed++;
  }

  console.log('\n======================================================================');
  console.log('📊 RESUMEN FINAL DE PRUEBAS GCP LIVE SCANNER');
  console.log('======================================================================');
  console.log(`  Total pruebas: ${passed + failed} | Aprobadas: ${passed} | Fallidas: ${failed}`);
  console.log(`  Tasa de éxito: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('======================================================================\n');

  if (failed > 0) process.exit(1);
}

runGcpLiveScannerTests().catch(err => {
  console.error('Error no capturado:', err);
  process.exit(1);
});
