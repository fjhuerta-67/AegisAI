/**
 * Unit tests for firestore.rules (AegisAI, database `aegis-ai-db`).
 *
 * Run against the Firestore emulator, e.g.:
 *   npm_config_allow_remote=all npx -y firebase-tools emulators:exec --only firestore \
 *     --project demo-aegis "npx tsx firestore.rules.test.ts"
 *
 * NOTE: the Firestore emulator JAR (v1.19.x) does not boot on JDK 24+ ("Enabling a
 * Security Manager is not supported", JEP 486). Put a JDK 21 first on PATH to run it.
 *
 * The rules only govern the browser client (Firebase JS SDK + Google sign-in);
 * the Express server uses the Admin SDK, which bypasses Security Rules.
 */
import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
// Real data written by the UI: every object must pass the rules unchanged.
import { SAMPLE_AUDITS } from './src/lib/sampleAudits';
import { aisvsDatabaseSeed } from './src/lib/aisvsData';
import { iso42001DatabaseSeed } from './src/lib/iso42001Data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let testEnv: RulesTestEnvironment;

type Db = ReturnType<ReturnType<RulesTestEnvironment['unauthenticatedContext']>['firestore']>;

// ---------------------------------------------------------------------------
// Minimal test runner: runs every case, then prints a pass/fail summary.
// ---------------------------------------------------------------------------
let passed = 0;
const failed: string[] = [];

async function test(name: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`PASS: ${name}`);
  } catch (e) {
    failed.push(name);
    console.error(`FAIL: ${name}\n      ${e instanceof Error ? e.message : String(e)}`);
  }
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------
const REQUIRED_AUDIT_FIELDS = [
  'id', 'date', 'systemName', 'technicalLead', 'email',
  'description', 'overallScore', 'executiveSummary', 'chapters',
] as const;

const validAudit = (id: string): Record<string, unknown> => ({
  id,
  date: '2026-01-01T00:00:00.000Z',
  systemName: 'Test System',
  technicalLead: 'Lead Name',
  email: 'lead@test.com',
  description: 'Test description',
  overallScore: 85,
  executiveSummary: 'Test summary',
  chapters: [],
});

const validChapter = (chapterId: string): Record<string, unknown> => ({
  chapterId,
  title: 'Chapter title',
  shortDescription: 'Short description',
  fullDescription: 'Full description',
  controls: [{
    id: `${chapterId}.1`,
    title: 'Control',
    description: 'Description',
    level: 'L1',
    objective: 'Objective',
    verificationGuidance: 'Verification',
    remediationGuidance: 'Remediation',
  }],
  order: 1,
});

// Same generator and document shape as ApiConnectionView.generateApiKey().
const newApiKeyId = () => `aisvs_${randomUUID().replace(/-/g, '')}`;
const validApiKey = (keyId: string): Record<string, unknown> => ({
  id: keyId,
  key: keyId,
  name: 'CI/CD GitHub Actions',
  createdAt: new Date().toISOString(),
  status: 'active',
});

async function runTests() {
  const projectId = process.env.GCLOUD_PROJECT || 'demo-aegis';
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(resolve(__dirname, 'firestore.rules'), 'utf8'),
    },
  });

  try {
    await testEnv.clearFirestore();

    const verified = (uid: string, email: string): Db =>
      testEnv.authenticatedContext(uid, { email, email_verified: true }).firestore();

    // Allowed identities.
    const googleDb = verified('alice_google', 'alice@google.com');
    const altostratDb = verified('bob_altostrat', 'bob@fjhuerta.altostrat.com');
    const adminAltoDb = verified('admin_altostrat', 'admin@fjhuerta.altostrat.com');
    const mixedCaseDb = verified('carol_mixed', 'Carol.Smith@Google.COM');

    // Identities that must be denied everywhere.
    const deniedIdentities: { label: string; db: Db }[] = [
      { label: 'unauthenticated', db: testEnv.unauthenticatedContext().firestore() },
      { label: 'unverified @google.com', db: testEnv.authenticatedContext('u_unverified', { email: 'mallory@google.com', email_verified: false }).firestore() },
      { label: '@google.com without email_verified claim', db: testEnv.authenticatedContext('u_noclaim', { email: 'mallory@google.com' }).firestore() },
      { label: "@google.com with email_verified='true' (string)", db: testEnv.authenticatedContext('u_strclaim', { email: 'mallory@google.com', email_verified: 'true' as unknown as boolean }).firestore() },
      { label: 'verified token without email claim', db: testEnv.authenticatedContext('u_noemail', { email_verified: true }).firestore() },
      { label: '@gmail.com', db: verified('u_gmail', 'eve@gmail.com') },
      { label: '@coppel.com', db: verified('u_coppel', 'eve@coppel.com') },
      { label: '@evil.google.com (subdomain)', db: verified('u_subdomain', 'eve@evil.google.com') },
      { label: '@google.com.evil.com (suffix trick)', db: verified('u_suffix', 'eve@google.com.evil.com') },
      { label: '@notgoogle.com (look-alike)', db: verified('u_lookalike', 'eve@notgoogle.com') },
      { label: '@altostrat.com (parent domain)', db: verified('u_parent', 'eve@altostrat.com') },
      { label: '@sub.fjhuerta.altostrat.com (subdomain)', db: verified('u_subalto', 'eve@sub.fjhuerta.altostrat.com') },
    ];

    // Pre-existing documents (written with rules disabled, like the Admin SDK would).
    const EXISTING_AUDIT = 'AISVS-2026-0001';
    const EXISTING_KEY = newApiKeyId();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await db.collection('audits').doc(EXISTING_AUDIT).set(validAudit(EXISTING_AUDIT));
      await db.collection('standards_aisvs').doc('C01').set(validChapter('C01'));
      await db.collection('standards_iso42001').doc('Clause 4').set(validChapter('Clause 4'));
      await db.collection('apiKeys').doc(EXISTING_KEY).set(validApiKey(EXISTING_KEY));
      await db.collection('asyncAudits').doc('JOB-1').set({ id: 'JOB-1', status: 'PROCESSING', createdAt: '2026-01-01T00:00:00.000Z', systemName: 'Server job' });
      await db.collection('custom_frameworks').doc('fw-eu-aiact').set({ id: 'fw-eu-aiact', name: 'EU AI Act', chapters: [] });
      await db.collection('system_config').doc('admin_settings').set({ id: 'admin_settings', authMethod: 'auto' });
    });

    // -----------------------------------------------------------------------
    console.log('\n# 1. Identity / email-domain allow-list');
    // -----------------------------------------------------------------------
    await test('verified @google.com user can list audits (limit 50)', () =>
      assertSucceeds(googleDb.collection('audits').limit(50).get()));
    await test('verified @fjhuerta.altostrat.com user can list audits (limit 50)', () =>
      assertSucceeds(altostratDb.collection('audits').limit(50).get()));
    await test('domain check is case-insensitive (Carol.Smith@Google.COM can get an audit)', () =>
      assertSucceeds(mixedCaseDb.collection('audits').doc(EXISTING_AUDIT).get()));

    for (const { label, db } of deniedIdentities) {
      const auditId = 'AISVS-2026-0666';
      const keyId = newApiKeyId();
      await test(`[${label}] cannot list audits`, () =>
        assertFails(db.collection('audits').limit(50).get()));
      await test(`[${label}] cannot get an audit`, () =>
        assertFails(db.collection('audits').doc(EXISTING_AUDIT).get()));
      await test(`[${label}] cannot create a valid audit`, () =>
        assertFails(db.collection('audits').doc(auditId).set(validAudit(auditId))));
      await test(`[${label}] cannot update an audit`, () =>
        assertFails(db.collection('audits').doc(EXISTING_AUDIT).set({ ...validAudit(EXISTING_AUDIT), overallScore: 1 })));
      await test(`[${label}] cannot list standards_aisvs`, () =>
        assertFails(db.collection('standards_aisvs').get()));
      await test(`[${label}] cannot write a valid standards chapter`, () =>
        assertFails(db.collection('standards_iso42001').doc('Clause 4').set(validChapter('Clause 4'))));
      await test(`[${label}] cannot list apiKeys`, () =>
        assertFails(db.collection('apiKeys').get()));
      await test(`[${label}] cannot create a valid apiKey`, () =>
        assertFails(db.collection('apiKeys').doc(keyId).set(validApiKey(keyId))));
      await test(`[${label}] cannot delete an apiKey`, () =>
        assertFails(db.collection('apiKeys').doc(EXISTING_KEY).delete()));
    }

    // -----------------------------------------------------------------------
    console.log('\n# 2. audits - allowed operations');
    // -----------------------------------------------------------------------
    await test('@google.com user can create a valid audit', () =>
      assertSucceeds(googleDb.collection('audits').doc('AISVS-2026-1234').set(validAudit('AISVS-2026-1234'))));
    await test('@fjhuerta.altostrat.com user can create a valid audit', () =>
      assertSucceeds(altostratDb.collection('audits').doc('ISO-2026-5678').set(validAudit('ISO-2026-5678'))));
    await test('@fjhuerta.altostrat.com user can get an audit created by another user', () =>
      assertSucceeds(altostratDb.collection('audits').doc('AISVS-2026-1234').get()));
    await test('@google.com user can get an audit', () =>
      assertSucceeds(googleDb.collection('audits').doc('ISO-2026-5678').get()));
    await test('update via setDoc (remediation toggle: chapters + fractional overallScore) is allowed', () =>
      assertSucceeds(altostratDb.collection('audits').doc('AISVS-2026-1234').set({
        ...validAudit('AISVS-2026-1234'),
        chapters: [{ chapterId: 'C1', chapterName: 'Chapter', puntosProbados: [], remediated: true }],
        overallScore: 200 / 3,
      })));
    await test('partial update that keeps the document valid is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('AISVS-2026-1234').update({ overallScore: 50 })));
    await test('audit with optional C05.4 ownership/tenant metadata (ownerUid, ownerEmail, tenantDomain) is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('AISVS-2026-OWNED').set({
        ...validAudit('AISVS-2026-OWNED'),
        ownerUid: 'alice_google',
        ownerEmail: 'Alice@Google.com',
        tenantDomain: 'google.com',
      })));
    await test('updating an owned audit while preserving ownerUid is allowed', () =>
      assertSucceeds(altostratDb.collection('audits').doc('AISVS-2026-OWNED').set({
        ...validAudit('AISVS-2026-OWNED'),
        ownerUid: 'alice_google',
        ownerEmail: 'alice@google.com',
        tenantDomain: 'google.com',
        overallScore: 95,
      })));
    await test('report with extra evaluation metadata (AuditForm shape) is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('MULTI-2026-0042').set({
        ...validAudit('MULTI-2026-0042'),
        standard: 'MULTI',
        standards: ['AI-SVS', 'ISO-42001'],
        standardsBreakdown: [{ standardId: 'AI-SVS', standardName: 'OWASP AISVS', score: 80, totalControls: 10, passedControls: 8, failedControls: 1, missingControls: 1 }],
        targetLevel: 'AUTO',
        assessedLevel: 'L2',
        levelAssessmentRationale: 'Rationale',
        techPlatform: 'vertex-ai',
        techPlatformName: 'Google Cloud Vertex AI',
        deploymentType: 'PaaS',
        modelUsed: 'gemini-2.5-pro',
        latencyMs: 1234,
        promptTokens: 1000,
        completionTokens: 2000,
      })));
    await test('GCP live-scan report with all required fields + telemetry is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('gcp-audit-1761424478000').set({
        ...validAudit('gcp-audit-1761424478000'),
        standard: 'MULTI',
        isLiveGcpScan: true,
        gcpProjectId: 'aegis-fintech-ai-prod',
        gcpTelemetry: { projectId: 'aegis-fintech-ai-prod', scanTime: '2026-01-01T00:00:00.000Z', authModeUsed: 'demo', totalResourcesFound: 0, componentsScanned: [] },
      })));
    await test('optional standard of exactly 32 chars is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('AISVS-2026-0032').set({ ...validAudit('AISVS-2026-0032'), standard: 's'.repeat(32) })));
    await test('remediatedArchitectureDoc of exactly 200000 chars is allowed', () =>
      assertSucceeds(googleDb.collection('audits').doc('AISVS-2026-2000').set({ ...validAudit('AISVS-2026-2000'), remediatedArchitectureDoc: 'r'.repeat(200000) })));
    await test('@google.com user cannot delete an audit', () =>
      assertFails(googleDb.collection('audits').doc('AISVS-2026-1234').delete()));
    await test('@fjhuerta.altostrat.com user cannot delete an audit', () =>
      assertFails(altostratDb.collection('audits').doc(EXISTING_AUDIT).delete()));

    for (const sample of SAMPLE_AUDITS) {
      await test(`SAMPLE_AUDITS '${sample.id}' can be seeded (create)`, () =>
        assertSucceeds(googleDb.collection('audits').doc(sample.id).set(sample)));
    }
    await test('SAMPLE_AUDITS can be re-seeded over existing docs with a new date (update)', async () => {
      for (const sample of SAMPLE_AUDITS) {
        await assertSucceeds(altostratDb.collection('audits').doc(sample.id).set({ ...sample, date: new Date().toISOString() }));
      }
    });

    // -----------------------------------------------------------------------
    console.log('\n# 3. audits - invalid documents and ids (allowed user)');
    // -----------------------------------------------------------------------
    const audits = googleDb.collection('audits');
    await test('create with document id != payload id is denied', () =>
      assertFails(audits.doc('AISVS-2026-9999').set(validAudit('AISVS-2026-1234'))));
    await test('update that changes the id field is denied', () =>
      assertFails(audits.doc('AISVS-2026-1234').update({ id: 'NEW-ID' })));
    await test('overwrite with a payload id of another document is denied', () =>
      assertFails(audits.doc('AISVS-2026-1234').set(validAudit('ISO-2026-5678'))));
    await test('document id with illegal characters is denied', () =>
      assertFails(audits.doc('bad id!').set(validAudit('bad id!'))));
    await test('document id longer than 128 chars is denied', () => {
      const longId = 'a'.repeat(129);
      return assertFails(audits.doc(longId).set(validAudit(longId)));
    });
    for (const field of REQUIRED_AUDIT_FIELDS) {
      await test(`create missing required field '${field}' is denied`, () => {
        const { [field]: _omitted, ...rest } = validAudit('AISVS-2026-3000');
        return assertFails(audits.doc('AISVS-2026-3000').set(rest));
      });
    }
    await test('overwrite (update) that drops a required field is denied', () => {
      const { executiveSummary: _omitted, ...rest } = validAudit('AISVS-2026-1234');
      return assertFails(audits.doc('AISVS-2026-1234').set(rest));
    });
    await test('report missing date/systemName/technicalLead/email/description is denied', () =>
      assertFails(audits.doc('gcp-audit-1').set({ id: 'gcp-audit-1', overallScore: 80, executiveSummary: 'Summary', chapters: [], isLiveGcpScan: true })));
    await test("wrong type: overallScore as string '85' is denied", () =>
      assertFails(audits.doc('AISVS-2026-3001').set({ ...validAudit('AISVS-2026-3001'), overallScore: '85' })));
    await test('wrong type: chapters as a map is denied', () =>
      assertFails(audits.doc('AISVS-2026-3002').set({ ...validAudit('AISVS-2026-3002'), chapters: { C1: true } })));
    await test('wrong type: systemName as a number is denied', () =>
      assertFails(audits.doc('AISVS-2026-3003').set({ ...validAudit('AISVS-2026-3003'), systemName: 123 })));
    await test('wrong type: date as a timestamp is denied', () =>
      assertFails(audits.doc('AISVS-2026-3004').set({ ...validAudit('AISVS-2026-3004'), date: new Date() })));
    await test('wrong type: standard as a number is denied', () =>
      assertFails(audits.doc('AISVS-2026-3005').set({ ...validAudit('AISVS-2026-3005'), standard: 42 })));
    await test('overallScore above 100 is denied', () =>
      assertFails(audits.doc('AISVS-2026-3006').set({ ...validAudit('AISVS-2026-3006'), overallScore: 100.5 })));
    await test('negative overallScore is denied', () =>
      assertFails(audits.doc('AISVS-2026-3007').set({ ...validAudit('AISVS-2026-3007'), overallScore: -1 })));
    const oversized: [string, number][] = [
      ['date', 101], ['systemName', 501], ['technicalLead', 201], ['email', 201],
      ['description', 100001], ['executiveSummary', 100001], ['standard', 33],
      ['remediatedArchitectureDoc', 200001],
      ['ownerUid', 129], ['ownerEmail', 201], ['tenantDomain', 101],
    ];
    for (const [field, size] of oversized) {
      await test(`${field} of ${size} chars is denied`, () =>
        assertFails(audits.doc('AISVS-2026-3100').set({ ...validAudit('AISVS-2026-3100'), [field]: 'x'.repeat(size) })));
    }
    await test('create audit with spoofed ownerUid != request.auth.uid is denied', () =>
      assertFails(audits.doc('AISVS-2026-3102').set({ ...validAudit('AISVS-2026-3102'), ownerUid: 'bob_altostrat' })));
    await test('create audit with spoofed ownerEmail != request.auth.token.email is denied', () =>
      assertFails(audits.doc('AISVS-2026-3103').set({ ...validAudit('AISVS-2026-3103'), ownerEmail: 'bob@fjhuerta.altostrat.com' })));
    await test('wrong type: ownerUid as a number is denied', () =>
      assertFails(audits.doc('AISVS-2026-3104').set({ ...validAudit('AISVS-2026-3104'), ownerUid: 123 })));
    await test('update that hijacks existing ownerUid is denied', () =>
      assertFails(altostratDb.collection('audits').doc('AISVS-2026-OWNED').update({ ownerUid: 'bob_altostrat' })));
    await test('overwrite (setDoc) that drops existing ownerUid is denied', () =>
      assertFails(altostratDb.collection('audits').doc('AISVS-2026-OWNED').set(validAudit('AISVS-2026-OWNED'))));
    await test('chapters list with 501 entries is denied', () =>
      assertFails(audits.doc('AISVS-2026-3101').set({ ...validAudit('AISVS-2026-3101'), chapters: Array.from({ length: 501 }, (_, i) => i) })));
    await test('update bypass: valid audit updated with an oversized description is denied', () =>
      assertFails(audits.doc('AISVS-2026-1234').update({ description: 'x'.repeat(100001) })));

    // -----------------------------------------------------------------------
    console.log('\n# 4. standards_aisvs / standards_iso42001');
    // -----------------------------------------------------------------------
    await test('@google.com user can list standards_aisvs', () =>
      assertSucceeds(googleDb.collection('standards_aisvs').get()));
    await test('@fjhuerta.altostrat.com user can list standards_iso42001', () =>
      assertSucceeds(altostratDb.collection('standards_iso42001').get()));
    await test('@google.com user can get a chapter', () =>
      assertSucceeds(googleDb.collection('standards_iso42001').doc('Clause 4').get()));
    for (const chapter of aisvsDatabaseSeed) {
      await test(`aisvsDatabaseSeed '${chapter.chapterId}' can be seeded`, () =>
        assertSucceeds(googleDb.collection('standards_aisvs').doc(chapter.chapterId).set(chapter)));
    }
    for (const chapter of iso42001DatabaseSeed) {
      await test(`iso42001DatabaseSeed '${chapter.chapterId}' can be seeded`, () =>
        assertSucceeds(altostratDb.collection('standards_iso42001').doc(chapter.chapterId).set(chapter)));
    }
    await test('re-seeding (update) every AISVS and ISO chapter is allowed', async () => {
      for (const chapter of aisvsDatabaseSeed) {
        await assertSucceeds(altostratDb.collection('standards_aisvs').doc(chapter.chapterId).set(chapter));
      }
      for (const chapter of iso42001DatabaseSeed) {
        await assertSucceeds(googleDb.collection('standards_iso42001').doc(chapter.chapterId).set(chapter));
      }
    });
    await test('valid chapter update by another allowed user is allowed', () =>
      assertSucceeds(altostratDb.collection('standards_aisvs').doc('C01').set({ ...validChapter('C01'), title: 'Updated title' })));

    const aisvs = googleDb.collection('standards_aisvs');
    await test('chapterId != document id is denied', () =>
      assertFails(aisvs.doc('C99').set(validChapter('C01'))));
    await test('missing controls is denied', () => {
      const { controls: _omitted, ...rest } = validChapter('C50');
      return assertFails(aisvs.doc('C50').set(rest));
    });
    await test('extra (unknown) field is denied', () =>
      assertFails(aisvs.doc('C51').set({ ...validChapter('C51'), injected: 'malicious' })));
    await test('controls as a string is denied', () =>
      assertFails(aisvs.doc('C52').set({ ...validChapter('C52'), controls: 'none' })));
    await test('controls list with 201 entries is denied', () =>
      assertFails(aisvs.doc('C53').set({ ...validChapter('C53'), controls: Array.from({ length: 201 }, (_, i) => i) })));
    await test('order as a string is denied', () =>
      assertFails(aisvs.doc('C54').set({ ...validChapter('C54'), order: '1' })));
    await test('title of 201 chars is denied', () =>
      assertFails(aisvs.doc('C55').set({ ...validChapter('C55'), title: 't'.repeat(201) })));
    await test('shortDescription of 1001 chars is denied', () =>
      assertFails(aisvs.doc('C56').set({ ...validChapter('C56'), shortDescription: 's'.repeat(1001) })));
    await test('fullDescription of 10001 chars is denied', () =>
      assertFails(aisvs.doc('C57').set({ ...validChapter('C57'), fullDescription: 'f'.repeat(10001) })));
    await test('chapterId of 33 chars is denied', () => {
      const longId = 'C'.repeat(33);
      return assertFails(aisvs.doc(longId).set(validChapter(longId)));
    });
    await test('chapter id with illegal characters is denied', () =>
      assertFails(aisvs.doc('C01;drop').set(validChapter('C01;drop'))));
    await test('chapter id with a double space is denied', () =>
      assertFails(googleDb.collection('standards_iso42001').doc('Clause  4').set(validChapter('Clause  4'))));
    await test('update bypass: existing chapter updated with an oversized title is denied', () =>
      assertFails(aisvs.doc('C01').update({ title: 't'.repeat(201) })));
    await test('deleting a standards_aisvs chapter is denied', () =>
      assertFails(aisvs.doc('C01').delete()));
    await test('deleting a standards_iso42001 chapter is denied', () =>
      assertFails(altostratDb.collection('standards_iso42001').doc('Clause 4').delete()));

    // -----------------------------------------------------------------------
    console.log('\n# 5. apiKeys');
    // -----------------------------------------------------------------------
    const createdKey = newApiKeyId();
    await test('allowed user can create an API key with the exact UI shape', () =>
      assertSucceeds(googleDb.collection('apiKeys').doc(createdKey).set(validApiKey(createdKey))));
    await test('allowed user can list apiKeys (onSnapshot on the collection)', () =>
      assertSucceeds(altostratDb.collection('apiKeys').get()));
    await test('updating an API key is denied (status -> revoked)', () =>
      assertFails(googleDb.collection('apiKeys').doc(createdKey).update({ status: 'revoked' })));
    await test('overwriting an existing API key with setDoc is denied', () =>
      assertFails(googleDb.collection('apiKeys').doc(createdKey).set(validApiKey(createdKey))));
    await test('another allowed user can delete (revoke) a legacy API key without ownerUid', () =>
      assertSucceeds(altostratDb.collection('apiKeys').doc(createdKey).delete()));

    const ownedKey1 = newApiKeyId();
    const ownedKey2 = newApiKeyId();
    await test('allowed user can create an API key with optional C05.4 ownership fields', () =>
      assertSucceeds(googleDb.collection('apiKeys').doc(ownedKey1).set({
        ...validApiKey(ownedKey1),
        ownerUid: 'alice_google',
        ownerEmail: 'alice@google.com',
        tenantDomain: 'google.com',
      })));
    await test('allowed user can create a second owned API key for admin-delete test', () =>
      assertSucceeds(googleDb.collection('apiKeys').doc(ownedKey2).set({
        ...validApiKey(ownedKey2),
        ownerUid: 'alice_google',
        ownerEmail: 'alice@google.com',
        tenantDomain: 'google.com',
      })));
    await test('non-owner allowed user cannot delete another user\'s owned API key', () =>
      assertFails(altostratDb.collection('apiKeys').doc(ownedKey1).delete()));
    await test('owner can delete their own owned API key', () =>
      assertSucceeds(googleDb.collection('apiKeys').doc(ownedKey1).delete()));
    await test('admin@fjhuerta.altostrat.com can delete another user\'s owned API key', () =>
      assertSucceeds(adminAltoDb.collection('apiKeys').doc(ownedKey2).delete()));

    const keys = googleDb.collection('apiKeys');
    const badKeyCases: [string, string, Record<string, unknown>][] = (() => {
      const k = newApiKeyId();
      const { name: _omitted, ...missingName } = validApiKey(k);
      return [
        ['id != document id', k, { ...validApiKey(k), id: newApiKeyId() }],
        ['key != document id', k, { ...validApiKey(k), key: newApiKeyId() }],
        ["status 'revoked' on create", k, { ...validApiKey(k), status: 'revoked' }],
        ['extra privilege field (role: admin)', k, { ...validApiKey(k), role: 'admin' }],
        ['server-managed field lastUsedAt', k, { ...validApiKey(k), lastUsedAt: new Date().toISOString() }],
        ['missing name', k, missingName],
        ['empty name', k, { ...validApiKey(k), name: '' }],
        ['name of 201 chars', k, { ...validApiKey(k), name: 'n'.repeat(201) }],
        ["createdAt not ISO-8601 ('yesterday')", k, { ...validApiKey(k), createdAt: 'yesterday' }],
        ['createdAt as a timestamp', k, { ...validApiKey(k), createdAt: new Date() }],
        ['spoofed ownerUid != request.auth.uid', k, { ...validApiKey(k), ownerUid: 'bob_altostrat' }],
        ['ownerUid of 129 chars', k, { ...validApiKey(k), ownerUid: 'u'.repeat(129) }],
        ['ownerEmail of 201 chars', k, { ...validApiKey(k), ownerEmail: 'e'.repeat(201) }],
        ['tenantDomain of 101 chars', k, { ...validApiKey(k), tenantDomain: 'd'.repeat(101) }],
        ["document id without the 'aisvs_' prefix", 'my-custom-key-000000000000000000000000', { ...validApiKey('my-custom-key-000000000000000000000000') }],
        ['document id too short (aisvs_abc)', 'aisvs_abc', { ...validApiKey('aisvs_abc') }],
      ];
    })();
    for (const [label, keyId, payload] of badKeyCases) {
      await test(`apiKey create with ${label} is denied`, () =>
        assertFails(keys.doc(keyId).set(payload)));
    }

    // -----------------------------------------------------------------------
    console.log('\n# 6. Server-only collections (asyncAudits, custom_frameworks, system_config)');
    // -----------------------------------------------------------------------
    const serverOnly: [string, string, Record<string, unknown>][] = [
      ['asyncAudits', 'JOB-1', { id: 'JOB-2', status: 'PROCESSING', createdAt: '2026-01-01T00:00:00.000Z', systemName: 'Client job' }],
      ['custom_frameworks', 'fw-eu-aiact', { id: 'fw-new', name: 'Injected framework', chapters: [] }],
      ['system_config', 'admin_settings', { id: 'injected_config', authMethod: 'sa' }],
    ];
    const allowedDbs: [string, Db][] = [['@google.com', googleDb], ['@fjhuerta.altostrat.com', altostratDb]];
    for (const [collection, existingId, payload] of serverOnly) {
      for (const [label, db] of allowedDbs) {
        await test(`[${label}] cannot list ${collection}`, () =>
          assertFails(db.collection(collection).get()));
        await test(`[${label}] cannot get ${collection}/${existingId}`, () =>
          assertFails(db.collection(collection).doc(existingId).get()));
        await test(`[${label}] cannot create in ${collection}`, () =>
          assertFails(db.collection(collection).doc(String(payload.id)).set(payload)));
        await test(`[${label}] cannot update ${collection}/${existingId}`, () =>
          assertFails(db.collection(collection).doc(existingId).update({ status: 'COMPLETED' })));
        await test(`[${label}] cannot delete ${collection}/${existingId}`, () =>
          assertFails(db.collection(collection).doc(existingId).delete()));
      }
    }

    // -----------------------------------------------------------------------
    console.log('\n# 7. Default deny');
    // -----------------------------------------------------------------------
    await test('unknown collection read is denied for an allowed user', () =>
      assertFails(googleDb.collection('users').doc('alice_google').get()));
    await test('unknown collection write is denied for an allowed user', () =>
      assertFails(googleDb.collection('users').doc('alice_google').set({ role: 'admin' })));
    await test('sub-collection under audits is denied for an allowed user', () =>
      assertFails(googleDb.collection('audits').doc(EXISTING_AUDIT).collection('comments').doc('c1').set({ text: 'hi' })));
    await test('collection-group query is denied for an allowed user', () =>
      assertFails(googleDb.collectionGroup('comments').get()));
  } finally {
    await testEnv.cleanup();
  }

  console.log(`\n${passed} passed, ${failed.length} failed (${passed + failed.length} total)`);
  if (failed.length > 0) {
    console.error('Failed tests:\n' + failed.map((name) => `  - ${name}`).join('\n'));
    process.exit(1);
  }
  console.log('ALL TESTS PASSED');
  process.exit(0);
}

runTests().catch((e) => {
  console.error('TEST RUN ABORTED', e);
  process.exit(1);
});
