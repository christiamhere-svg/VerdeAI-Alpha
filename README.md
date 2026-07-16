# VerdeAI v9.2 — Secure Pilot Preparation

Deployment-ready static Cloudflare Pages package for the VerdeAI public beta, with locked reference backend scaffolds for one optional AI concept image.

## v9.2 milestone

- Preserves the verified v9.1.1 Android calibration and clean independent concept-photo stage.
- Adds the owner decision brief and approval gate.
- Adds **Create one AI concept render** as an optional one-image-only rehearsal.
- Adds explicit privacy, image-use, maximum-cost and concept-only confirmations.
- Builds a calibration-aware prompt from usable ground, keep-clear areas, protected access, opportunity point, marker 5 and the first move.
- Includes browser resize/JPEG re-encode/metadata-removal preparation.
- Includes mock progress, success, timeout, provider-error, budget-lock and free-overlay fallback states.
- Includes a preferred Cloudflare Worker + Durable Object scaffold and a local Node reference scaffold.

## Deploy the static app

Upload the complete contents of this folder to the existing Cloudflare Pages project. No frontend build command is required. Confirm the live page displays **Build v9.2**.

Deploying the static folder does **not** deploy the Worker and cannot activate paid rendering.

## Locked safety state

- Real AI rendering disabled.
- Frontend backend connection disabled.
- Provider calls off.
- Paid calls locked.
- Hard kill switch on.
- Test/mock mode on.
- API key absent.
- Pilot spend cap zero.
- Invited tester limit zero.
- Free calibrated overlay fully usable.

Read `docs/OWNER_DECISION_BRIEF_V9_2.md`, `docs/SECURITY_PRIVACY_CHECKLIST_V9_2.md`, `BUILD_STATUS.md` and `VALIDATION_RESULTS.json` before considering activation.
