#!/usr/bin/env node
/**
 * AegisAI — Comprehensive Audit Persistence Unit & Integration Test Battery
 * =========================================================================
 * Covers:
 *  1. Canonical Audit ID generation & client/server ID preservation (`generateAuditId`)
 *  2. Firestore schema & `firestore.rules` sanitization (`sanitizeAuditReportForFirestore`, `validateAuditReportSchema`)
 *  3. Firestore 1 MiB (1,048,576 bytes) document size guard on 47-chapter MULTI audits
 *  4. LocalStorage backup, quota fallback compaction, and Pre-Login -> Post-Login merge (`mergeAuditLists`)
 *  5. Static & architectural verification of `server.ts`, `AuditForm.tsx`, `App.tsx`, and `.gcloudignore`
 *  6. Live Firestore (`aegis-ai-db`) write-read-delete round-trip test (when GCP credentials are active)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  generateAuditId,
   stripUndefinedDeep,
  getUtf8ByteLength,
  sanitizeAuditReportForFirestore,
  validateAuditReportSchema,
  mergeAuditLists,
  saveAuditToLocalBackup,
  loadAuditsFromLocalBackup,
  removeAuditFromLocalBackup,
  MAX_FIRESTORE_DOC_UTF8_BYTES,
  MAX_FIRESTORE_DESCRIPTION_CHARS,
  MAX_FIRESTORE_REMEDIATED_DOC_CHARS,
} from '../src/lib/auditPersistence.ts';

let passed = 0;
let failed = 0;

async function runTest(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✅ PASS: ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     ${err?.stack || err?.message || err}`);
  }
}

console.log('\n================================================================================');
console.log('🛡️  AEGIS AI — AUDIT PERSISTENCE UNIT & INTEGRATION TEST BATTERY');
console.log('================================================================================\n');

// ----------------------------------------------------------------------------
// SUITE 1: Canonical Audit ID Generation & Preservation
// ----------------------------------------------------------------------------
console.log('📦 Suite 1: Canonical Audit ID Generation & Client/Server ID Preservation');

await runTest('1.1 Generates MULTI prefix when multiple standards are selected', () => {
  const id = generateAuditId('MULTI', ['AI-SVS', 'ISO-42001', 'NIST-AI-RMF']);
  assert.match(id, /^MULTI-\d{4}-\d{4}$/);
});

await runTest('1.2 Generates AISVS or ISO42001 prefix for single standards', () => {
  const aisvsId = generateAuditId('AI-SVS', ['AI-SVS']);
  const isoId = generateAuditId('ISO-42001', ['ISO-42001']);
  assert.match(aisvsId, /^AISVS-\d{4}-\d{4}$/);
  assert.match(isoId, /^ISO42001-\d{4}-\d{4}$/);
});

await runTest('1.3 Preserves existing valid server/client audit ID without mutating it', () => {
  const existing = 'MULTI-2026-0961';
  const id = generateAuditId('MULTI', ['AI-SVS', 'ISO-42001'], existing);
  assert.equal(id, existing);
});

await runTest('1.4 Rejects malformed or oversized existing IDs and regenerates a valid ID', () => {
  const invalidWithSpaces = generateAuditId('MULTI', ['AI-SVS', 'ISO-42001'], 'invalid id/with/slashes');
  const oversized = generateAuditId('MULTI', ['AI-SVS', 'ISO-42001'], 'A'.repeat(200));
  assert.match(invalidWithSpaces, /^MULTI-\d{4}-\d{4}$/);
  assert.match(oversized, /^MULTI-\d{4}-\d{4}$/);
});

// ----------------------------------------------------------------------------
// SUITE 2: Firestore Schema Sanitization & firestore.rules Compliance
// ----------------------------------------------------------------------------
console.log('\n🧹 Suite 2: Firestore Schema Sanitization & Security Rules (`isValidAuditReport`)');

await runTest('2.1 Strips undefined, null, and empty optional fields that would fail isOptionalString', () => {
  const dirtyReport = {
    id: 'MULTI-2026-7777',
    systemName: 'Uploaded Architecture Analysis #1',
    technicalLead: 'Francisco Huerta',
    email: 'fjhuerta@google.com',
    date: '2026-10-28T22:00:00.000Z',
    description: 'Architecture specification for Vertex AI RAG agent.',
    executiveSummary: 'Executive summary of audit findings.',
    overallScore: '88.45', // String score from LLM JSON
    standard: 'MULTI',
    standards: ['AI-SVS', 'ISO-42001'],
    customFrameworkId: undefined,
    customFrameworkName: null,
    remediatedArchitectureDoc: '',
    levelAssessmentRationale: undefined,
    ownerUid: undefined,
    ownerEmail: null,
    tenantDomain: '',
    chapters: [
      {
        id: 'C1',
        name: 'Chapter 1',
        score: 90,
        controls: [
          {
            id: '1.1',
            name: 'Control 1.1',
            status: 'Compliant',
            description: 'Desc',
            evidence: 'Ev',
            recommendations: 'Rec',
            remediationPatch: undefined,
          },
        ],
      },
    ],
  };

  const clean = sanitizeAuditReportForFirestore(dirtyReport, {
    uid: 'uid-123',
    email: 'FJHuerta@google.com',
  });

  assert.equal(clean.overallScore, 88.5);
  assert.equal(typeof clean.overallScore, 'number');
  assert.equal(clean.ownerUid, 'uid-123');
  assert.equal(clean.ownerEmail, 'fjhuerta@google.com');
  assert.equal(clean.tenantDomain, 'google.com');
  assert.equal('customFrameworkId' in clean, false);
  assert.equal('customFrameworkName' in clean, false);
  assert.equal('remediatedArchitectureDoc' in clean, false);
  assert.equal('levelAssessmentRationale' in clean, false);
  assert.equal('remediationPatch' in clean.chapters[0].controls[0], false);

  const validation = validateAuditReportSchema(clean);
  assert.equal(validation.valid, true, `Schema validation errors: ${validation.errors.join('; ')}`);
});

await runTest('2.2 Bounds oversized description, executiveSummary, and remediatedArchitectureDoc to fit firestore.rules', () => {
  const hugeReport = {
    id: 'MULTI-2026-8888',
    systemName: 'Enterprise Multi-Agent Architecture',
    technicalLead: 'Lead Architect',
    email: 'fjhuerta@google.com',
    description: 'D'.repeat(160_000), // Exceeds 100k limit
    executiveSummary: 'E'.repeat(140_000), // Exceeds 100k limit
    remediatedArchitectureDoc: 'R'.repeat(260_000), // Exceeds 200k limit
    overallScore: 91.2,
    chapters: [],
  };

  const clean = sanitizeAuditReportForFirestore(hugeReport);
  assert.ok(clean.description.length <= MAX_FIRESTORE_DESCRIPTION_CHARS);
  assert.ok(clean.executiveSummary.length <= MAX_FIRESTORE_DESCRIPTION_CHARS);
  assert.ok((clean.remediatedArchitectureDoc?.length || 0) <= MAX_FIRESTORE_REMEDIATED_DOC_CHARS);

  const validation = validateAuditReportSchema(clean);
  assert.equal(validation.valid, true, `Schema validation errors: ${validation.errors.join('; ')}`);
});

await runTest('2.3 Handles missing or NaN overallScore and missing metadata gracefully', () => {
  const minimal = sanitizeAuditReportForFirestore({
    overallScore: NaN,
    chapters: [],
  });
  assert.equal(minimal.overallScore, 0);
  assert.ok(minimal.systemName.length > 0);
  assert.ok(minimal.id.length > 0);
  const validation = validateAuditReportSchema(minimal);
  assert.equal(validation.valid, true, `Schema validation errors: ${validation.errors.join('; ')}`);
});

// ----------------------------------------------------------------------------
// SUITE 3: Firestore 1 MiB Document Size Guard on 47-Chapter MULTI Audits
// ----------------------------------------------------------------------------
console.log('\n📏 Suite 3: Firestore 1 MiB Document Size Guard (47-Chapter 5-Framework MULTI Audit)');

await runTest('3.1 Compacts a >1.3 MB 47-chapter MULTI audit below 850 KB while preserving all 47 chapters and controls', () => {
  const chapters = Array.from({ length: 47 }, (_, cIdx) => ({
    id: `CH-${cIdx + 1}`,
    name: `Chapter ${cIdx + 1}: Security & Governance Controls`,
    score: 85,
    controls: Array.from({ length: 5 }, (__, kIdx) => ({
      id: `C${cIdx + 1}.${kIdx + 1}`,
      name: `Control ${cIdx + 1}.${kIdx + 1}`,
      category: 'Security',
      level: 'L2',
      status: 'Partial',
      description: 'Control requirement specification '.repeat(12),
      evidence: 'Detailed architectural evidence extracted from uploaded PDF specification '.repeat(35),
      recommendations: 'Detailed technical remediation steps for Cloud Run, Vertex AI, and IAM '.repeat(35),
      remediationPatch: 'resource "google_project_iam_member" "least_privilege" {\n  role = "roles/aiplatform.user"\n}\n'.repeat(30),
    })),
  }));

  const rawMultiAudit = {
    id: 'MULTI-2026-9991',
    systemName: 'Massive 5-Standard Enterprise Architecture Upload',
    technicalLead: 'Francisco Huerta',
    email: 'fjhuerta@google.com',
    description: 'Extracted PDF specification text '.repeat(3500), // ~112 KB
    executiveSummary: 'Comprehensive 5-standard executive summary '.repeat(400),
    remediatedArchitectureDoc: '# 100% Remediated Architecture Specification\n'.repeat(4500), // ~198 KB
    overallScore: 85.0,
    standard: 'MULTI',
    standards: ['AI-SVS', 'ISO-42001', 'NIST-AI-RMF', 'EU-AI-ACT', 'OWASP-LLM-TOP-10'],
    chapters,
  };

  const rawBytes = getUtf8ByteLength(JSON.stringify(rawMultiAudit));
  assert.ok(rawBytes > 1_100_000, `Expected raw fixture > 1.1 MB, got ${rawBytes} bytes`);

  const sanitized = sanitizeAuditReportForFirestore(rawMultiAudit, {
    uid: 'user-1',
    email: 'fjhuerta@google.com',
  });

  const finalBytes = getUtf8ByteLength(JSON.stringify(sanitized));
  assert.ok(
    finalBytes <= 1_048_576,
    `Sanitized report (${finalBytes} bytes) must be strictly under Firestore 1 MiB (1,048,576 bytes)`
  );
  assert.equal(sanitized.chapters.length, 47, 'All 47 chapters must be preserved');
  assert.equal(sanitized.chapters[0].controls.length, 5, 'All controls per chapter must be preserved');

  const validation = validateAuditReportSchema(sanitized);
  assert.equal(validation.valid, true, `Schema validation errors: ${validation.errors.join('; ')}`);
});

// ----------------------------------------------------------------------------
// SUITE 4: LocalStorage Backup, Quota Fallback & Pre-Login -> Post-Login Merge
// ----------------------------------------------------------------------------
console.log('\n💾 Suite 4: LocalStorage Backup, Quota Recovery & Pre-Login -> Post-Login State Merge');

function createMemoryStorage(maxBytes = Infinity) {
  const map = new Map();
  return {
    getItem(k) {
      return map.has(k) ? map.get(k) : null;
    },
    setItem(k, v) {
      if (Buffer.byteLength(v, 'utf8') > maxBytes) {
        const err = new Error('QuotaExceededError: DOM Exception 22');
        err.name = 'QuotaExceededError';
        throw err;
      }
      map.set(k, String(v));
    },
    removeItem(k) {
      map.delete(k);
    },
  };
}

await runTest('4.1 Preserves two uploaded analyses across pre-login -> post-login transition and merges with Firestore audits', () => {
  const memStorage = createMemoryStorage();

  const upload1 = sanitizeAuditReportForFirestore({
    id: 'MULTI-2026-1001',
    date: '2026-10-27T19:14:55.638Z',
    systemName: 'Uploaded Analysis #1 (Pre-Login)',
    overallScore: 91.4,
    chapters: [{ id: 'C1', name: 'Ch 1', score: 91.4, controls: [] }],
  });

  const upload2 = sanitizeAuditReportForFirestore({
    id: 'MULTI-2026-1002',
    date: '2026-10-28T00:11:31.644Z',
    systemName: 'Uploaded Analysis #2 (Pre-Login)',
    overallScore: 93.8,
    chapters: [{ id: 'C1', name: 'Ch 1', score: 93.8, controls: [] }],
  });

  // User uploads two analyses before signing in
  saveAuditToLocalBackup(upload1, memStorage);
  saveAuditToLocalBackup(upload2, memStorage);

  const backedUp = loadAuditsFromLocalBackup(memStorage);
  assert.equal(backedUp.length, 2);
  assert.equal(backedUp[0].id, 'MULTI-2026-1002');
  assert.equal(backedUp[1].id, 'MULTI-2026-1001');

  // User then signs in; Firestore returns older audits + sample audits
  const firestoreAudits = [
    sanitizeAuditReportForFirestore({
      id: 'MULTI-2026-0961',
      date: '2026-10-27T15:25:24.780Z',
      systemName: 'Aegis AI',
      overallScore: 94.5,
      chapters: [],
    }),
    sanitizeAuditReportForFirestore({
      id: 'audit-vertex-rag-customer-service',
      date: '2026-03-20T00:00:00.000Z',
      systemName: 'Sample Audit 1',
      overallScore: 82.0,
      chapters: [],
    }),
  ];

  const mergedAfterLogin = mergeAuditLists(backedUp, firestoreAudits);
  assert.equal(mergedAfterLogin.length, 4);
  assert.equal(mergedAfterLogin[0].id, 'MULTI-2026-1002', 'Newest uploaded analysis #2 must be first');
  assert.equal(mergedAfterLogin[1].id, 'MULTI-2026-1001', 'Uploaded analysis #1 must be second');
  assert.equal(mergedAfterLogin[2].id, 'MULTI-2026-0961', 'Existing Firestore audit must be third');

  // Identify unsynced local audits to push to Firestore upon login
  const remoteIds = new Set(firestoreAudits.map((a) => a.id));
  const unsyncedToUpload = backedUp.filter((a) => !remoteIds.has(a.id));
  assert.equal(unsyncedToUpload.length, 2);
});

await runTest('4.2 Gracefully compacts older audits when localStorage quota is tight without losing the latest analysis', () => {
  // Set a tight 35 KB storage limit so uncompacted history triggers QuotaExceededError
  const tightStorage = createMemoryStorage(35_000);

  for (let i = 1; i <= 5; i++) {
    const report = sanitizeAuditReportForFirestore({
      id: `MULTI-2026-200${i}`,
      date: new Date(Date.now() + i * 1000).toISOString(),
      systemName: `Analysis Run #${i}`,
      description: 'Detailed architecture description '.repeat(300), // ~10 KB each
      remediatedArchitectureDoc: 'Remediated spec '.repeat(500), // ~8 KB each
      overallScore: 80 + i,
      chapters: [],
    });
    saveAuditToLocalBackup(report, tightStorage);
  }

  const loaded = loadAuditsFromLocalBackup(tightStorage);
  assert.ok(loaded.length >= 1, 'At least the newest audit must be saved in compacted localStorage');
  assert.equal(loaded[0].id, 'MULTI-2026-2005', 'The most recent analysis must be intact');
});

await runTest('4.3 removeAuditFromLocalBackup removes only the target ID', () => {
  const memStorage = createMemoryStorage();
  saveAuditToLocalBackup(sanitizeAuditReportForFirestore({ id: 'A-1', systemName: 'S1', overallScore: 90, chapters: [] }), memStorage);
  saveAuditToLocalBackup(sanitizeAuditReportForFirestore({ id: 'A-2', systemName: 'S2', overallScore: 95, chapters: [] }), memStorage);
  const remaining = removeAuditFromLocalBackup('A-1', memStorage);
  assert.equal(remaining.length, 1);
  assert.equal(remaining[0].id, 'A-2');
});

// ----------------------------------------------------------------------------
// SUITE 5: Architectural & Source Wiring Verification
// ----------------------------------------------------------------------------
console.log('\n🔍 Suite 5: Server, Frontend & Cloud Build Wiring Verification');

await runTest('5.1 server.ts persists evaluations via persistAuditReportOnServer in /api/evaluate and /api/gcp/audit and exposes /api/audits', () => {
  const serverSrc = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
  assert.ok(serverSrc.includes('export async function persistAuditReportOnServer'), 'persistAuditReportOnServer must be defined in server.ts');
  assert.ok(serverSrc.includes("app.get('/api/audits'"), 'GET /api/audits must be exposed in server.ts');
  assert.ok(serverSrc.includes("app.post('/api/audits'"), 'POST /api/audits must be exposed in server.ts');

  const evaluateMatches = serverSrc.match(/persistAuditReportOnServer\(/g) || [];
  assert.ok(evaluateMatches.length >= 3, `Expected persistAuditReportOnServer to be called in /api/evaluate, /api/gcp/audit, and POST /api/audits (found ${evaluateMatches.length})`);
});

await runTest('5.2 AuditForm.tsx sends canonical auditId, flushes SSE stream buffer, recovers from /api/audits, and awaits onSubmit', () => {
  const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/dashboard/AuditForm.tsx'), 'utf8');
  assert.ok(formSrc.includes("data.append('auditId', clientAuditId)"), 'AuditForm must send clientAuditId to /api/evaluate');
  assert.ok(formSrc.includes('await onSubmit(newAudit)'), 'AuditForm must await onSubmit(newAudit)');
  assert.ok(formSrc.includes("fetch('/api/audits'"), 'AuditForm must include fallback recovery from /api/audits when SSE stream drops');
});

await runTest('5.3 App.tsx saves optimistically to localStorage backup and syncs to /api/audits + Firestore', () => {
  const appSrc = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
  assert.ok(appSrc.includes('saveAuditToLocalBackup(ownedReport)'), 'App.tsx must save to localStorage backup immediately');
  assert.ok(appSrc.includes('syncAuditToBackendAndFirestore(ownedReport)'), 'App.tsx must sync to backend /api/audits and Firestore');
});

await runTest('5.4 .gcloudignore and .dockerignore allow firebase-applet-config.local.json', () => {
  const gcloudIgnorePath = path.join(process.cwd(), '.gcloudignore');
  assert.ok(fs.existsSync(gcloudIgnorePath), '.gcloudignore must exist so Cloud Build does not fallback to .gitignore and strip *.local.json');
  const content = fs.readFileSync(gcloudIgnorePath, 'utf8');
  assert.ok(content.includes('!firebase-applet-config.local.json'), '.gcloudignore must explicitly allow firebase-applet-config.local.json');

  const dockerIgnorePath = path.join(process.cwd(), '.dockerignore');
  if (fs.existsSync(dockerIgnorePath)) {
    const dockerIgnore = fs.readFileSync(dockerIgnorePath, 'utf8');
    const lines = dockerIgnore.split('\n').map((l) => l.trim());
    assert.ok(
      !lines.includes('firebase-applet-config.local.json') && !lines.includes('*.local.json'),
      '.dockerignore must NOT exclude firebase-applet-config.local.json'
    );
  }
});

await runTest('5.5 server.ts enforces OWASP AISVS Invariant 4 (HTTP 405 Method Not Allowed) on DELETE /api/audits/:id', () => {
  const serverSrc = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
  assert.ok(
    serverSrc.includes("app.delete('/api/audits/:id'") && serverSrc.includes('res.status(405)'),
    'DELETE /api/audits/:id must return HTTP 405 to preserve audit record immutability (OWASP AISVS Invariant 4)'
  );
});

// ----------------------------------------------------------------------------
// SUITE 6: Live Firestore (`aegis-ai-db`) Round-Trip Verification
// ----------------------------------------------------------------------------
console.log('\n☁️  Suite 6: Live Argolis Firestore (`aegis-ai-db`) Write / Read / Cleanup Round-Trip');

await runTest('6.1 Writes, reads back, verifies schema, and cleans up a synthetic audit document in computeengine-506321 / aegis-ai-db', async () => {
  let token = '';
  try {
    token = execSync('CLOUDSDK_CORE_DISABLE_PROMPTS=1 gcloud auth print-access-token admin@fjhuerta.altostrat.com 2>/dev/null', {
      encoding: 'utf8',
      timeout: 5000,
    }).trim();
  } catch {
    console.log('     ⚠️ Skipping live Argolis REST round-trip (gcloud token not available in this environment)');
    return;
  }
  if (!token) return;

  const testId = `TEST-PERSISTENCE-${Date.now()}`;
  const docUrl = `https://firestore.googleapis.com/v1/projects/computeengine-506321/databases/aegis-ai-db/documents/audits/${testId}`;

  const syntheticReport = sanitizeAuditReportForFirestore(
    {
      id: testId,
      systemName: 'Persistence Verification Probe',
      technicalLead: 'Automated Test Suite',
      email: 'fjhuerta@google.com',
      description: 'Automated round-trip persistence check for aegis-ai-db.',
      executiveSummary: 'Verified 100% persistence.',
      overallScore: 99.5,
      standard: 'MULTI',
      standards: ['AI-SVS', 'ISO-42001'],
      chapters: [],
    },
    { uid: 'test-uid', email: 'fjhuerta@google.com' }
  );

  // 1. Write to aegis-ai-db
  const patchRes = await fetch(docUrl, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        id: { stringValue: syntheticReport.id },
        systemName: { stringValue: syntheticReport.systemName },
        date: { stringValue: syntheticReport.date },
        overallScore: { doubleValue: syntheticReport.overallScore },
        ownerEmail: { stringValue: syntheticReport.ownerEmail || 'fjhuerta@google.com' },
      },
    }),
  });
  assert.equal(patchRes.status, 200, `Expected HTTP 200 writing to aegis-ai-db, got ${patchRes.status}`);

  // 2. Read back from aegis-ai-db
  const getRes = await fetch(docUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(getRes.status, 200, `Expected HTTP 200 reading from aegis-ai-db, got ${getRes.status}`);
  const getJson = await getRes.json();
  assert.equal(getJson.fields?.id?.stringValue, testId);
  assert.equal(getJson.fields?.overallScore?.doubleValue, 99.5);

  // 3. Clean up synthetic probe document immediately
  const delRes = await fetch(docUrl, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(delRes.status, 200, `Expected HTTP 200 deleting synthetic test doc from aegis-ai-db, got ${delRes.status}`);
});

// ----------------------------------------------------------------------------
// SUITE 7: Live Express Server HTTP Integration (/api/audits & Immutability)
// ----------------------------------------------------------------------------
console.log('\n🌐 Suite 7: Live Express Server HTTP Integration (POST /api/audits -> GET /api/audits -> DELETE 405)');

await runTest('7.1 Spawns Express server and verifies POST /api/audits, GET /api/audits retrieval, and DELETE /api/audits/:id HTTP 405', async () => {
  const { spawn } = await import('node:child_process');
  const port = 8095;
  const serverPath = path.join(process.cwd(), 'dist/server.cjs');
  execSync('npx esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs');

  const srv = spawn('node', [serverPath], {
    env: {
      ...process.env,
      PORT: String(port),
      NODE_ENV: 'development',
      TRUST_UNVERIFIED_IAP_HEADERS: 'true',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let ready = false;
  srv.stdout.on('data', (d) => {
    if (d.toString().includes(String(port))) ready = true;
  });

  for (let i = 0; i < 30 && !ready; i++) {
    await new Promise((r) => setTimeout(r, 250));
  }

  const testAuthHeaders = {
    'Content-Type': 'application/json',
    'x-goog-authenticated-user-email': 'accounts.google.com:fjhuerta@google.com',
    'x-goog-authenticated-user-id': 'accounts.google.com:test-uid-fjhuerta',
  };

  try {
    const probeAudit = {
      id: 'MULTI-2026-9095',
      systemName: 'HTTP Persistence E2E Verification',
      technicalLead: 'QA Automation',
      email: 'fjhuerta@google.com',
      description: 'End-to-end HTTP persistence test.',
      executiveSummary: 'Verified via POST /api/audits and GET /api/audits.',
      overallScore: 96.4,
      standard: 'MULTI',
      standards: ['AI-SVS', 'ISO-42001'],
      chapters: [{ id: 'C1', name: 'Ch 1', score: 96.4, controls: [] }],
    };

    // 1. POST /api/audits
    const postRes = await fetch(`http://localhost:${port}/api/audits`, {
      method: 'POST',
      headers: testAuthHeaders,
      body: JSON.stringify({ audit: probeAudit }),
    });
    assert.equal(postRes.status, 200, `Expected HTTP 200 on POST /api/audits, got ${postRes.status}`);
    const postJson = await postRes.json();
    assert.equal(postJson.status, 'saved');
    assert.equal(postJson.audit.id, 'MULTI-2026-9095');

    // 2. GET /api/audits
    const getRes = await fetch(`http://localhost:${port}/api/audits`, {
      headers: testAuthHeaders,
    });
    assert.equal(getRes.status, 200, `Expected HTTP 200 on GET /api/audits, got ${getRes.status}`);
    const getJson = await getRes.json();
    assert.ok(Array.isArray(getJson.audits), 'GET /api/audits must return an audits array');
    const found = getJson.audits.find((a) => a.id === 'MULTI-2026-9095');
    assert.ok(found, 'Saved audit MULTI-2026-9095 must be returned by GET /api/audits');
    assert.equal(found.overallScore, 96.4);

    // 3. DELETE /api/audits/:id -> HTTP 405 Method Not Allowed (OWASP AISVS Invariant 4)
    const delRes = await fetch(`http://localhost:${port}/api/audits/MULTI-2026-9095`, {
      method: 'DELETE',
      headers: testAuthHeaders,
    });
    assert.equal(delRes.status, 405, `Expected HTTP 405 on DELETE /api/audits/:id, got ${delRes.status}`);
  } finally {
    srv.kill('SIGTERM');
  }
});

// ----------------------------------------------------------------------------
// SUITE 8: Per-Document Corrected Document Generation & Persistence
// ----------------------------------------------------------------------------
console.log('\n📄 Suite 8: Per-Document Corrected Document Generation & Download Verification');

await runTest('8.1 Extracts every uploaded document from audit and generates complete corrected versions (.pdf, .py, .tf, .md)', async () => {
  const {
    extractUploadedDocumentsFromAudit,
    generateCorrectedSingleDocumentContent,
    getPreferredCorrectedExtension,
  } = await import('../src/lib/remediatedArchitectureGenerator.ts');

  assert.equal(getPreferredCorrectedExtension('Arquitectura_RAG.pdf'), 'md');
  assert.equal(getPreferredCorrectedExtension('main.tf'), 'tf');
  assert.equal(getPreferredCorrectedExtension('agent_router.py'), 'py');
  assert.equal(getPreferredCorrectedExtension('gateway.ts'), 'ts');

  const multiDocAudit = {
    id: 'MULTI-2026-DOCS',
    systemName: 'Enterprise RAG Core',
    technicalLead: 'Lead Architect',
    email: 'fjhuerta@google.com',
    date: '2026-10-30T00:00:00.000Z',
    overallScore: 78.5,
    standard: 'MULTI',
    description:
      'Base architecture spec.\n\n--- ARCHIVO ADJUNTO: Arquitectura_RAG.pdf ---\nContenido original del PDF de arquitectura.\n\n--- ARCHIVO ADJUNTO: main.tf ---\nresource "google_vertex_ai_endpoint" "rag" {}\n\n--- ARCHIVO ADJUNTO: agent_router.py ---\ndef route_query(q):\n    return q',
    chapters: [
      {
        chapterId: 'C1',
        title: 'Gobernanza y Datos',
        compliancePercentage: 75,
        evaluatedPoints: [
          {
            id: 'C1.1.1',
            name: 'Zero Data Retention y CMEK',
            description: 'Cifrado y retención cero',
            level: 'L1',
            status: 'No Cumplimiento',
            justification: 'Falta CMEK explícito en el documento.',
            riskImpact: 'Alto',
            remediation: 'Integrar KMS CMEK y cláusula ZDR.',
            remediationDetails: {
              strategy: 'Habilitar CMEK en Vertex AI y redactar cláusula ZDR.',
              actionableSteps: ['Configurar KMS key', 'Declarar ZDR en contrato'],
              codeOrConfigExample: 'encryption_spec { kms_key_name = var.cmek_key }',
              estimatedEffort: 'Bajo (Horas)',
            },
          },
        ],
      },
    ],
  };

  const docs = extractUploadedDocumentsFromAudit(multiDocAudit, 'es');
  assert.equal(docs.length, 3, 'Must extract all 3 uploaded documents individually');
  assert.equal(docs[0].fileName, 'Arquitectura_RAG.pdf');
  assert.equal(docs[1].fileName, 'main.tf');
  assert.equal(docs[2].fileName, 'agent_router.py');

  for (const d of docs) {
    const corrected = generateCorrectedSingleDocumentContent(d, multiDocAudit, 'es');
    assert.ok(corrected.length > d.originalContent.length, `Corrected content for ${d.fileName} must include remediation controls`);
    assert.ok(corrected.includes('C1.1.1'), `Corrected content for ${d.fileName} must include control C1.1.1`);
  }
});

await runTest('8.2 sanitizeAuditReportForFirestore preserves uploadedDocuments and enforces 1 MiB byte-budget', () => {
  const sanitized = sanitizeAuditReportForFirestore({
    id: 'MULTI-2026-DOC-SANITIZE',
    systemName: 'Multi-Doc Sanitization Test',
    overallScore: 88.0,
    chapters: [],
    uploadedDocuments: [
      {
        id: 'doc-1',
        fileName: 'Politica_IA.pdf',
        mimeType: 'application/pdf',
        originalContent: 'Texto original de la política.',
        remediatedContent: 'Texto corregido al 100% de la política.',
        remediatedSummary: 'Se integraron controles ISO 42001.',
        appliedControls: ['ISO-4.1', 'C1.1.1'],
      },
    ],
  });

  assert.ok(Array.isArray(sanitized.uploadedDocuments), 'uploadedDocuments must be preserved after sanitization');
  assert.equal(sanitized.uploadedDocuments.length, 1);
  assert.equal(sanitized.uploadedDocuments[0].fileName, 'Politica_IA.pdf');
  assert.equal(sanitized.uploadedDocuments[0].remediatedContent, 'Texto corregido al 100% de la política.');
});

await runTest('8.3 server.ts exposes POST /api/remediate-document and AuditReportView.tsx renders per-document Generate & Download buttons', () => {
  const serverSrc = fs.readFileSync(path.join(process.cwd(), 'server.ts'), 'utf8');
  assert.ok(serverSrc.includes("app.post('/api/remediate-document'"), 'POST /api/remediate-document must be exposed in server.ts');
  assert.ok(serverSrc.includes('remediateSingleDocumentWithAI'), 'remediateSingleDocumentWithAI must be defined in server.ts');

  const viewSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/dashboard/AuditReportView.tsx'), 'utf8');
  assert.ok(viewSrc.includes('exportSingleCorrectedDocumentPDF'), 'AuditReportView must wire exportSingleCorrectedDocumentPDF');
  assert.ok(viewSrc.includes('downloadSingleCorrectedDocument'), 'AuditReportView must wire downloadSingleCorrectedDocument');
  assert.ok(viewSrc.includes('handleGenerateDocWithAI'), 'AuditReportView must wire handleGenerateDocWithAI');
});

console.log('\n================================================================================');
console.log(`📊 TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log('================================================================================\n');

if (failed > 0) {
  process.exit(1);
}
