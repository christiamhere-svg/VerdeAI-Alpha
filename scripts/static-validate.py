from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'js/app.v9.2.2.js').read_text()
config=(root/'config.v9.2.2.js').read_text()
worker=(root/'cloudflare-worker/src/index.js').read_text()
wrangler=(root/'cloudflare-worker/wrangler.jsonc').read_text()
safe=(root/'cloudflare-worker/wrangler.safe-lock.jsonc').read_text()
all_small=''.join(p.read_text(errors='ignore') for p in root.rglob('*') if p.is_file() and p.stat().st_size < 2_000_000 and not {'evidence','node_modules','dist-dry-run','dist-safe-dry-run'}.intersection(p.parts))
checks={
 'v922_visible_and_stored': 'Build v9.2.2' in html and 'const BUILD_VERSION = "9.2.2"' in js and 'version: "9.2.2"' in config,
 'unique_assets': all(x in html for x in ['styles/main.v9.2.2.css','config.v9.2.2.js','js/app.v9.2.2.js']),
 'one_render_only': 'Create one AI concept render' in html and 'renderAllFuturesBtn' not in js and 'render all six' not in html.lower() and 'count !== 1' in worker,
 'five_owner_approvals': '5 of 5 approvals recorded' in html and all(x in html for x in ['ownerProviderControl','ownerBackendControl','ownerBudgetControl','ownerTesterControl','ownerRetentionControl']),
 'frontend_live_health_gate': all(x in js for x in ['refreshPilotHealth','isLivePilotReady','providerKeyPresent','inviteCodesConfigured','configuredApiBaseUrl']),
 'invited_code_confirmation': all(x in html+js for x in ['pilotAccessCode','confirmRenderPrivacy','confirmRenderImageUse','confirmRenderCost','confirmRenderConcept']),
 'approved_config_no_secret': all(x in config for x in ['pilotApproved: true','providerCallsEnabled: true','paidCallsLocked: false','frontendApiKeyPresent: false']) and 'apiBaseUrl: ""' in config,
 'calibration_prompt': all(x in js for x in ['usableGround','keepClearAreas','protectedAccessRoute','opportunityPoint','marker5','firstMove']),
 'browser_preprocess': all(x in js for x in ['prepareImageForRender','toDataURL("image/jpeg"','PILOT_MAX_IMAGE_BYTES','metadataStripped: true']),
 'worker_approved_gates': all(x in worker for x in ['worker-version-mismatch','invalid-invite-code','invite-code-used','session-render-limit','ip-daily-render-limit','invited-tester-limit','pilot-budget-lock']),
 'worker_provider_edit': all(x in worker for x in ['https://api.openai.com/v1/images/edits','gpt-image-2','1536x1024','output_compression']),
 'durable_budget_and_invites': all(x in worker for x in ['class PilotGuard','totalReserved','invite:${input.inviteHash}','input.capUsd !== 5','input.testerLimit !== 10']),
 'server_secret_only': 'env.OPENAI_API_KEY' in worker and 'OPENAI_API_KEY' not in html and not re.search(r'sk-[A-Za-z0-9_-]{20,}', all_small),
 'required_worker_secrets': all(x in wrangler for x in ['OPENAI_API_KEY','RATE_LIMIT_SALT','PILOT_INVITE_CODE_HASHES']),
 'approved_caps': all(x in wrangler for x in ['"PILOT_SPEND_CAP_USD": "5"','"INVITED_TESTER_LIMIT": "10"','"MAX_COST_PER_RENDER_USD": "0.15"']),
 'rollback_safe_lock': all(x in safe for x in ['"REAL_RENDERING_ENABLED": "false"','"RENDER_KILL_SWITCH": "true"','"PILOT_SPEND_CAP_USD": "0"']),
 'fallback_states': all(x in js for x in ['timeout','provider-error','budget-lock','Use free calibrated overlay']),
 'core_preserved': all(x in js for x in ['runAnalysis','runShadedGardenSelfTest','openConceptCalibration','renderFeedbackReview','importFeedbackCsvFile','restoreCurrentSession']),
 'android_evidence_preserved': all((root/'evidence'/x).exists() for x in ['v92_android_mock_result.jpg','v92_android_timeout_state.jpg','v92_android_provider_error_state.jpg','v92_android_budget_lock_state.jpg']),
}
result={'version':'9.2.2','status':'passed' if all(checks.values()) else 'failed','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(0 if all(checks.values()) else 1)
