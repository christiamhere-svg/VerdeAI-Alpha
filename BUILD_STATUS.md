# BUILD STATUS — VerdeAI v9.2.1

## Milestone

Owner-only activation preparation. Deployment-ready for static frontend testing; **not approved or capable of real provider activation**.

## Current safety state

| Control | State |
|---|---|
| Mock mode | ON |
| Hard kill switch | ON |
| Provider calls | OFF |
| Paid calls | LOCKED |
| Frontend API key | ABSENT |
| Live backend connection | DISABLED |
| Owner approvals recorded | 0 / 5 |
| Render count | One image only |
| Free calibrated overlay | AVAILABLE |

## Owner decisions still required

1. Rendering provider
2. Backend host
3. Total pilot budget
4. Invited tester limit
5. Retention/deletion policy

## Deployment scope

Deploying this package updates the visible frontend to Build v9.2.1 and exposes the locked owner-review controls. It does not deploy the Worker, add a secret, enable paid calls, or release the kill switch.

## Validation

See `VALIDATION_RESULTS.json`, `static-validation.json`, `evidence/v921_browser_test_results.json`, `evidence/v921_backend_contract_test_results.json`, and `evidence/v921_worker_scaffold_validation.json`.
