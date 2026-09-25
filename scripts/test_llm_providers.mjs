import http from 'http';

const BASE_URL = 'http://localhost:3000';
const ADMIN_TOKEN = 'aisvs_admin_sec_2026_9f8d1c4e7b2a';

async function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN,
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('=== TEST MULTI-PROVIDER LLM CONFIGURATION & TEST-CONNECTION ===\n');

  // Test 1: Fetch initial admin settings
  console.log('1. Consultando configuración actual de administración (/api/admin/settings)...');
  const initialSettings = await makeRequest('/api/admin/settings');
  console.log('Respuesta:', initialSettings.status, initialSettings.data);
  if (initialSettings.status !== 200 || !initialSettings.data.provider) {
    throw new Error('Fallo en Test 1: No se pudo obtener configuración inicial');
  }
  console.log('✅ Test 1 Aprobado: Estructura de proveedor válida.\n');

  // Test 2: Test Gemini connection
  console.log('2. Probando endpoint de prueba con Gemini (/api/admin/test-connection)...');
  const geminiTest = await makeRequest('/api/admin/test-connection', 'POST', {
    provider: 'gemini',
    model: 'gemini-3.8-flash'
  });
  console.log('Respuesta:', geminiTest.status, geminiTest.data);
  if (geminiTest.status !== 200 || !geminiTest.data.ok) {
    throw new Error('Fallo en Test 2: Conexión con Gemini falló');
  }
  console.log(`✅ Test 2 Aprobado: Gemini respondió en ${geminiTest.data.latencyMs}ms con modelo ${geminiTest.data.model}\n`);

  // Test 3: Save OpenRouter configuration in admin settings
  console.log('3. Guardando configuración de OpenRouter en /api/admin/settings...');
  const saveOpenRouter = await makeRequest('/api/admin/settings', 'POST', {
    provider: 'openrouter',
    openaiApiKey: 'sk-or-v1-test-fake-key-1234567890abcdef',
    openaiBaseUrl: 'https://openrouter.ai/api/v1',
    openaiModel: 'anthropic/claude-3.7-sonnet',
    temperature: 0.0,
    maxTokens: 8192,
    fallbackModel: 'openai/gpt-4o-mini',
    customHeaders: {
      'HTTP-Referer': 'https://aegisai.local',
      'X-Title': 'AegisAI Test'
    }
  });
  console.log('Respuesta:', saveOpenRouter.status, saveOpenRouter.data);
  if (saveOpenRouter.status !== 200 || saveOpenRouter.data.provider !== 'openrouter') {
    throw new Error('Fallo en Test 3: No se guardó la configuración de OpenRouter');
  }
  console.log('✅ Test 3 Aprobado: Configuración de OpenRouter aplicada en caliente.\n');

  // Test 4: Verify settings persistence and masking
  console.log('4. Verificando persistencia y enmascaramiento (/api/admin/settings)...');
  const verifySettings = await makeRequest('/api/admin/settings');
  console.log('Respuesta:', verifySettings.status, verifySettings.data);
  if (verifySettings.data.provider !== 'openrouter' || !verifySettings.data.maskedOpenaiKey.includes('...')) {
    throw new Error('Fallo en Test 4: Clave no enmascarada o proveedor incorrecto');
  }
  console.log('✅ Test 4 Aprobado: Clave de OpenRouter enmascarada correctamente y persistida.\n');

  // Test 5: Test connection with Custom/OpenRouter endpoint error handling
  console.log('5. Probando manejo de error con endpoint simulado o clave de prueba...');
  const customTest = await makeRequest('/api/admin/test-connection', 'POST', {
    provider: 'custom_openai_compatible',
    baseUrl: 'http://127.0.0.1:9999/v1',
    model: 'llama3.3:latest'
  });
  console.log('Respuesta (esperada falla controlada por puerto inexistente):', customTest.status, customTest.data);
  if (customTest.status !== 400 || customTest.data.ok !== false) {
    throw new Error('Fallo en Test 5: Debería haber devuelto 400 con ok: false');
  }
  console.log('✅ Test 5 Aprobado: Manejo de errores de conexión y timeout validado.\n');

  // Test 6: Restore provider to Gemini
  console.log('6. Restaurando proveedor a Google Gemini...');
  const restoreRes = await makeRequest('/api/admin/settings', 'POST', {
    provider: 'gemini',
    preferredModel: 'gemini-3.8-flash'
  });
  console.log('Respuesta:', restoreRes.status, restoreRes.data);
  if (restoreRes.status !== 200 || restoreRes.data.provider !== 'gemini') {
    throw new Error('Fallo en Test 6: No se pudo restaurar a Gemini');
  }
  console.log('✅ Test 6 Aprobado: Proveedor restaurado a Google Gemini exitosamente.\n');

  console.log('🎉 TODOS LOS TESTS DE MULTI-PROVEEDOR LLM HAN SIDO SUPERADOS EXITOSAMENTE.');
}

run().catch(err => {
  console.error('❌ Error en las pruebas:', err);
  process.exit(1);
});
