# Predikt backend integration slots

The production UI is intentionally schema-agnostic until the database model is supplied.

## Required domains

### users
Expected capabilities: account identity, phone/email, locale, status, role, created_at.

### kyc_profiles
Expected capabilities: user relation, age check, identity document metadata, review status, audit timestamps.

### fixtures
Expected capabilities: competition, teams, kickoff time, status, score/result, provider identifiers.

### markets
Expected capabilities: fixture relation, market type, selections, decimal odds, state, timestamps.

### slips
Expected capabilities: user relation, selections, combined display odds, sandbox stake, status, result.

### wallet_accounts
Expected capabilities: user relation, currency, available balance, reserved balance, sandbox/live flag.

### wallet_ledger
Expected capabilities: immutable credit/debit entries, reference, amount, currency, type, status, metadata, timestamps.

### deposit_intents
Expected capabilities: payment method, amount, asset/network where relevant, provider reference, state, sandbox/live flag.

### notifications
Expected capabilities: user relation, category, title, body, read state, timestamps.

### risk_events
Expected capabilities: user relation, severity, rule code, reason, operator note, resolution state, timestamps.

### audit_log
Expected capabilities: actor, action, entity, entity_id, before/after metadata, timestamp.

## Integration rule

Keep the UI calling `src/integrations/contracts.js`. Replace adapter implementations only after the final database/API schemas are provided. Do not couple screens directly to table names or provider-specific response shapes.
