import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let testEnv: RulesTestEnvironment;

async function runTests() {
  const projectId = `test-project-${Date.now()}`;
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(resolve(__dirname, 'DRAFT_firestore.rules'), 'utf8'),
    },
  });

  const unauthedDb = testEnv.unauthenticatedContext().firestore();
  const authedDb = testEnv.authenticatedContext('user_123').firestore();

  const validPayload = {
    id: 'AISVS-2024-1234',
    date: '2024-01-01T00:00:00Z',
    systemName: 'Test System',
    technicalLead: 'Lead Name',
    email: 'lead@test.com',
    description: 'Test description',
    overallScore: 85,
    executiveSummary: 'Test summary',
    chapters: []
  };

  try {
    // 1. Unauthenticated Create
    await assertFails(unauthedDb.collection('audits').doc('AISVS-2024-1234').set(validPayload));
    console.log("PASS: 1. Unauthenticated Create");

    // 2. Create with mismatched Document ID vs Payload ID
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-9999').set(validPayload));
    console.log("PASS: 2. Mismatched ID");

    // 3. Create missing required field
    const { executiveSummary, ...missingFieldPayload } = validPayload;
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').set(missingFieldPayload));
    console.log("PASS: 3. Missing Required Field");

    // 4. Create with invalid string size
    const hugeSystemNamePayload = { ...validPayload, systemName: 'a'.repeat(501) };
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').set(hugeSystemNamePayload));
    console.log("PASS: 4. Invalid String Size");

    // 5. Create with wrong type
    const wrongTypePayload = { ...validPayload, overallScore: '85' };
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').set(wrongTypePayload));
    console.log("PASS: 5. Wrong Type");

    // 6. Update mutating the id field
    await assertSucceeds(authedDb.collection('audits').doc('AISVS-2024-1234').set(validPayload)); // Setup
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').update({ id: 'NEW-ID' }));
    console.log("PASS: 6. Update mutating ID");

    // 7. Update removing a required field (using set to overwrite)
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').set(missingFieldPayload));
    console.log("PASS: 7. Update removing required field");

    // 8. Delete an audit
    await assertFails(authedDb.collection('audits').doc('AISVS-2024-1234').delete());
    console.log("PASS: 8. Delete Audit");

    // 9. Read unauthenticated
    await assertFails(unauthedDb.collection('audits').doc('AISVS-2024-1234').get());
    console.log("PASS: 9. Read unauthenticated");

    // 10. Valid List Query Authenticated
    await assertSucceeds(authedDb.collection('audits').get());
    console.log("PASS: 10. List Authenticated");

    console.log("ALL TESTS PASSED");
  } catch (e) {
    console.error("TEST FAILED", e);
    process.exit(1);
  } finally {
    await testEnv.cleanup();
  }
}

runTests();
