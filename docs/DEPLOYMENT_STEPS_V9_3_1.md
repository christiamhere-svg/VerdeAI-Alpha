# VerdeAI v9.3.1 — Exact Deployment Steps

This is a static frontend hotfix. Do not change Cloudflare Worker settings, API tokens, backend configuration or paid rendering.

1. Download `VerdeAI_v9_3_1_Plant_Overlay_Future_Selection_Hotfix.zip`.
2. Extract the ZIP once.
3. Open the extracted folder named `VerdeAI_v9_3_1_Plant_Overlay_Future_Selection_Hotfix`.
4. Copy its contents into the verified local VerdeAI repository root.
5. Open GitHub Desktop and confirm the changed files belong to v9.3.1.
6. Use the commit summary: `Build v9.3.1 Plant Overlay and Future Selection Hotfix`.
7. Commit to `main`.
8. Push origin.
9. Wait for the existing static Pages deployment to finish.
10. Open the live VerdeAI site and force-refresh it.
11. Confirm the page displays **Public Beta · Build v9.3.1**.
12. Run `docs/ANDROID_PLANT_OVERLAY_CHECKLIST_V9_3_1.md` on the physical Android phone.

## Stop conditions

Stop and do not claim tester readiness if:

- the live page still says v9.3;
- Other possible futures is missing;
- fewer than six futures appear;
- Wildlife Haven cannot be selected;
- the photograph is covered by a broad green tint;
- future switching does not visibly change the composition;
- calibration or refresh persistence regresses.

## Safety check

The correct build keeps `useBackend: false`, `providerCallsEnabled: false`, `paidCallsLocked: true`, `killSwitch: true` and `mockMode: true` in `config.v9.3.1.js`.
