import http from 'http';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';

function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  const body = options.body;
  const urlObj = new URL(url);

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runIntegrationVerification() {
  console.log('🧪 INICIANDO SUITE DE INTEGRACIÓN Y VERIFICACIÓN FUNCIONAL');
  console.log('🎯 Servidor: http://localhost:3000');
  console.log(`⏰ Fecha: ${new Date().toISOString()}\n`);

  const tests = [];

  // Test 1: Health Check
  try {
    const res = await request('/api/health');
    const ok = res.statusCode === 200 && JSON.parse(res.data).status === 'ok';
    tests.push({ name: '1. Endpoint de Salud (/api/health)', passed: ok, details: `HTTP ${res.statusCode}` });
  } catch (e) {
    tests.push({ name: '1. Endpoint de Salud (/api/health)', passed: false, details: e.message });
  }

  // Test 2: Frameworks List
  try {
    const res = await request('/api/frameworks');
    const fws = JSON.parse(res.data);
    const hasEU = fws.some(f => f.shortCode === 'EU-AI-ACT');
    const hasLFPDPPP = fws.some(f => f.shortCode === 'LFPDPPP-MX');
    const hasLFPC = fws.some(f => f.shortCode === 'LFPC-MX');
    const passed = res.statusCode === 200 && fws.length >= 3 && hasEU && hasLFPDPPP && hasLFPC;
    tests.push({
      name: '2. Catálogo Dinámico de Marcos (/api/frameworks)',
      passed,
      details: `Total marcos: ${fws.length} (EU AI Act: ${hasEU}, LFPDPPP: ${hasLFPDPPP}, LFPC: ${hasLFPC})`
    });
  } catch (e) {
    tests.push({ name: '2. Catálogo Dinámico de Marcos (/api/frameworks)', passed: false, details: e.message });
  }

  // Test 3: LFPDPPP Detail & Controls Integrity
  try {
    const res = await request('/api/frameworks/fw-lfpdppp-mex-2026');
    const fw = JSON.parse(res.data);
    const passed = res.statusCode === 200 && fw.totalChapters === 6 && fw.totalControls === 14 && fw.chapters.length === 6;
    tests.push({
      name: '3. Integridad Estructural LFPDPPP (/api/frameworks/:id)',
      passed,
      details: `Capítulos: ${fw.chapters?.length}/6, Controles: ${fw.totalControls}/14`
    });
  } catch (e) {
    tests.push({ name: '3. Integridad Estructural LFPDPPP (/api/frameworks/:id)', passed: false, details: e.message });
  }

  // Test 4: LFPC Detail & Controls Integrity
  try {
    const res = await request('/api/frameworks/fw-lfpc-mex-2026');
    const fw = JSON.parse(res.data);
    const passed = res.statusCode === 200 && fw.totalChapters === 6 && fw.totalControls === 14 && fw.chapters.length === 6;
    tests.push({
      name: '4. Integridad Estructural LFPC (/api/frameworks/:id)',
      passed,
      details: `Capítulos: ${fw.chapters?.length}/6, Controles: ${fw.totalControls}/14`
    });
  } catch (e) {
    tests.push({ name: '4. Integridad Estructural LFPC (/api/frameworks/:id)', passed: false, details: e.message });
  }

  // Test 5: Admin Connection Test with valid ADMIN_API_TOKEN
  try {
    const adminToken = process.env.ADMIN_API_TOKEN || 'aisvs_admin_sec_2026_9f8d1c4e7b2a';
    const res = await request('/api/admin/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({ model: 'gemini-3.1-flash-lite' })
    });
    const parsed = JSON.parse(res.data);
    const passed = res.statusCode === 200 && parsed.ok === true;
    tests.push({
      name: '5. Verificación de Inferencia y Conexión Gemini (/api/admin/test-connection)',
      passed,
      details: `Modelo: ${parsed.model || 'gemini'}, Latencia: ${parsed.latencyMs || 0}ms, Respuesta: ${parsed.sampleResponse || 'OK'}`
    });
  } catch (e) {
    tests.push({ name: '5. Verificación de Inferencia y Conexión Gemini', passed: false, details: e.message });
  }

  // Test 6: Static Assets & Security Headers
  try {
    const res = await request('/');
    const headers = res.headers;
    const hasNosniff = headers['x-content-type-options'] === 'nosniff';
    const hasFrame = headers['x-frame-options'] === 'SAMEORIGIN';
    const passed = res.statusCode === 200 && hasNosniff && hasFrame;
    tests.push({
      name: '6. Frontend SPA y Cabeceras HTTP de Seguridad',
      passed,
      details: `HTTP ${res.statusCode}, nosniff: ${hasNosniff}, SAMEORIGIN: ${hasFrame}`
    });
  } catch (e) {
    tests.push({ name: '6. Frontend SPA y Cabeceras HTTP de Seguridad', passed: false, details: e.message });
  }

  // Summary
  console.log('======================================================');
  console.log('📋 RESULTADOS DE INTEGRACIÓN Y VERIFICACIÓN:');
  console.log('======================================================');
  tests.forEach(t => {
    console.log(`${t.passed ? '✅ PASS' : '❌ FAIL'} | ${t.name.padEnd(50)} | ${t.details}`);
  });

  const allPassed = tests.every(t => t.passed);
  console.log(`\n🏆 Estado General de Integración: ${allPassed ? '100% EXITOSO' : 'CON OBSERVACIONES'}`);
  fs.writeFileSync('scripts/integration_verification_report.json', JSON.stringify({ date: new Date().toISOString(), tests, allPassed }, null, 2));
}

runIntegrationVerification().catch(console.error);
