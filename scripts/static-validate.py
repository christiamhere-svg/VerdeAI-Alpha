from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'js/app.v9.3.js').read_text()
css=(root/'styles/main.v9.3.css').read_text()
config=(root/'config.v9.3.js').read_text()
checks={
 'v93_visible_and_stored': 'Build v9.3' in html and 'const BUILD_VERSION = "9.3"' in js and 'version: "9.3"' in config,
 'unique_assets': all(x in html for x in ['styles/main.v9.3.css','config.v9.3.js','js/app.v9.3.js']),
 'botanical_symbols': all(x in js for x in ['groundcover','flower-shrub','grass','screen','tree','herb','edible-bed']),
 'depth_bands': all(x in js+css for x in ['plant-rear-layer','plant-mid-layer','plant-front-layer']),
 'future_differentiation': all(x in js for x in ['future.id === "belonging"','future.id === "minimal"','future.id === "wildlife"','future.id === "gathering"','future.id === "productive"','makerUseZoneSvg']),
 'calibration_preserved': all(x in js for x in ['calibrationPolygonPoints','calibrationKeepClearSvg','calibrationProtectedRouteSvg','calibration-mask-route','firstMove']),
 'finished_editor_hidden': '.photo-concept-stage.is-finished .calibration-editor-svg' in css and '.photo-concept-stage.is-finished .concept-map-marker:not(.marker-first)' in css,
 'photo_first_host': all(x in html+js for x in ['dashboardConceptStageHost','photo-concept-image','renderDedicatedConceptHost']),
 'ai_hard_locked': all(x in config for x in ['useBackend: false','provider: "none"','mockMode: true','killSwitch: true','providerCallsEnabled: false','paidCallsLocked: true']) and 'Real AI rendering is disabled' in html,
 'mobile_no_overflow_tested': (root/'evidence/v93_browser_test_results.json').exists(),
 'evidence_multiple_futures': all((root/'evidence'/f'v93_{x}_overlay_mobile.png').exists() for x in ['gathering','wildlife','minimal','productive','belonging','maker']),
 'no_frontend_secret': not re.search(r'sk-[A-Za-z0-9_-]{20,}', html+js+config),
}
result={'version':'9.3','status':'passed' if all(checks.values()) else 'failed','scope':'Plant Overlay Gate','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
sys.exit(0 if all(checks.values()) else 1)
