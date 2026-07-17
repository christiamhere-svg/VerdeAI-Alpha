from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'js/app.v9.2.1.js').read_text()
config=(root/'config.v9.2.1.js').read_text()
backend=(root/'backend/render/renderService.js').read_text()
worker=(root/'cloudflare-worker/src/index.js').read_text()
checks={
 'v921_visible_and_stored': 'Build v9.2.1' in html and 'const BUILD_VERSION = "9.2.1"' in js and 'version: "9.2.1"' in config,
 'unique_assets': all(x in html for x in ['styles/main.v9.2.1.css','config.v9.2.1.js','js/app.v9.2.1.js']),
 'one_render_only': 'Create one AI concept render' in html and 'renderAllFuturesBtn' not in js and 'render all six' not in html.lower(),
 'five_owner_decisions': all(x in html for x in ['ownerProviderControl','ownerBackendControl','ownerBudgetControl','ownerTesterControl','ownerRetentionControl']),
 'zero_approvals_and_disabled_activation': '0 of 5 approvals recorded' in html and 'activateOwnerPilotBtn' in html and 'disabled aria-describedby="ownerActivationLockStatus"' in html,
 'owner_copy_and_safe_reset': all(x in js for x in ['copyOwnerApprovalRequest','ownerApprovalRequestText','resetOwnerSafeState']),
 'config_hard_locks': all(x in config for x in ['mockMode: true','killSwitch: true','providerCallsEnabled: false','paidCallsLocked: true','frontendApiKeyPresent: false']),
 'refined_failure_states': all(x in js for x in ['SAFE STOP · NO AUTOMATIC RETRY','SAFE FALLBACK · PROVIDER RESPONSE FAILED','BLOCKED BEFORE PROVIDER CONTACT','No charge started','Back to rehearsal']),
 'confirmation_fields': all(x in html for x in ['confirmRenderPrivacy','confirmRenderImageUse','confirmRenderCost','confirmRenderConcept']),
 'calibration_prompt': all(x in js for x in ['usableGround','keepClear','protectedAccessRoute','opportunityPoint','marker5','firstMove']),
 'browser_preprocess': all(x in js for x in ['prepareImageForRender','toDataURL("image/jpeg"','PILOT_MAX_IMAGE_BYTES','metadataStripped: true']),
 'backend_locked': all(x in backend for x in ['real-rendering-disabled','hard-kill-switch-on','test-mode-on','pilot-spend-cap-not-approved']),
 'server_secret_only': 'OPENAI_API_KEY' in worker and 'OPENAI_API_KEY' not in html and not re.search(r'sk-[A-Za-z0-9_-]{20,}', ''.join(p.read_text(errors='ignore') for p in root.rglob('*') if p.is_file() and p.stat().st_size < 2_000_000)),
 'fallback_states': all(x in js for x in ['timeout','provider-error','budget-lock','FREE OVERLAY FALLBACK']),
 'core_preserved': all(x in js for x in ['runAnalysis','runShadedGardenSelfTest','openConceptCalibration','renderFeedbackReview','importFeedbackCsvFile','restoreCurrentSession']),
 'android_evidence_included': all((root/'evidence'/x).exists() for x in ['v92_android_mock_result.jpg','v92_android_timeout_state.jpg','v92_android_provider_error_state.jpg','v92_android_budget_lock_state.jpg']),
}
result={'version':'9.2.1','status':'passed' if all(checks.values()) else 'failed','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(0 if all(checks.values()) else 1)
