# Security Specification

## Data Invariants
1. Audits are global and readable by any authenticated user.
2. An Audit must have a valid ID that matches the document ID.
3. Once created, the Audit's `id` field is immutable.
4. Audits cannot be deleted (to maintain an audit trail).

## The Dirty Dozen Payloads
1. Unauthenticated Create
2. Create with mismatched Document ID vs Payload ID
3. Create missing required field (`executiveSummary`)
4. Create with invalid string size (e.g. `systemName` > 500 chars)
5. Create with wrong type (`overallScore` as string)
6. Update mutating the `id` field
7. Update removing a required field
8. Delete an audit
9. Read unauthenticated
10. Create with `chapters` as a string instead of a list
11. Create with empty Document ID
12. Update by unauthenticated user
