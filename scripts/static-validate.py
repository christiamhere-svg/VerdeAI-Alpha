from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'js/app.v9.2.js').read_text()
backend=(root/'backend/render/renderService.js').read_text()
worker=(root/'cloudflare-worker/src/index.js').read_text()
checks={
 'v92_visible_and_stored': 'Build v9.2' in html and 'const BUILD_VERSION = "9.2"' in js,
 'unique_assets': all(x in html for x in ['styles/main.v9.2.css','config.v9.2.js','js/app.v9.2.js']),
 'one_render_only': 'Create one AI concept render' in html and 'renderAllFuturesBtn' not in js and 'render all six' not in html.lower(),
 'owner_gate': all(x in html for x in ['Provider calls off','paid calls locked','kill switch on','test mode on']),
 'confirmation_fields': all(x in html for x in ['confirmRenderPrivacy','confirmRenderImageUse','confirmRenderCost','confirmRenderConcept']),
 'calibration_prompt': all(x in js for x in ['usableGround','keepClear','protectedAccessRoute','opportunityPoint','marker5','firstMove']),
 'preservation_prompt': all(x in js for x in ['rooflines','doors, windows','Do not make structural modifications','inspiration only']),
 'browser_preprocess': all(x in js for x in ['prepareImageForRender','toDataURL("image/jpeg"','PILOT_MAX_IMAGE_BYTES','metadataStripped: true']),
 'backend_locked': all(x in backend for x in ['real-rendering-disabled','hard-kill-switch-on','test-mode-on','pilot-spend-cap-not-approved']),
 'server_secret_only': 'OPENAI_API_KEY' in worker and 'OPENAI_API_KEY' not in html and not re.search(r'sk-[A-Za-z0-9_-]{20,}', ''.join(p.read_text(errors='ignore') for p in root.rglob('*') if p.is_file() and p.stat().st_size < 2_000_000)),
 'worker_atomic_guard': all(x in worker for x in ['class PilotGuard','storage.transaction','totalReserved','invited-tester-limit']),
 'fallback_states': all(x in js for x in ['timeout','provider-error','budget-lock','FREE OVERLAY FALLBACK']),
 'core_preserved': all(x in js for x in ['runAnalysis','runShadedGardenSelfTest','openConceptCalibration','renderFeedbackReview','importFeedbackCsvFile','restoreCurrentSession']),
}
result={'version':'9.2','status':'passed' if all(checks.values()) else 'failed','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(0 if all(checks.values()) else 1)
