from pathlib import Path
import json, re, sys
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'js/app.v9.3.1.js').read_text(encoding='utf-8')
css=(root/'styles/main.v9.3.1.css').read_text(encoding='utf-8')
config=(root/'config.v9.3.1.js').read_text(encoding='utf-8')
checks={
 'v931_visible_and_stored': 'Build v9.3.1' in html and 'const BUILD_VERSION = "9.3.1"' in js and 'version: "9.3.1"' in config,
 'unique_assets': all(x in html for x in ['styles/main.v9.3.1.css','config.v9.3.1.js','js/app.v9.3.1.js']),
 'future_panel_static_and_recoverable': all(x in html+js for x in ['futureSelectionPanel','Other possible futures','ensureFutureSelectionPanel','dashboardFutureCards']),
 'requested_future_names': all(x in js for x in ['Feature Garden','Low-Maintenance Haven','Wildlife Haven','Gathering Space','Food Garden','Maker / Workshop Yard']),
 'botanical_symbols': all(x in js for x in ['groundcover','flower-shrub','grass','screen','tree','herb','edible-bed']),
 'depth_bands': all(x in js+css for x in ['plant-rear-layer','plant-mid-layer','plant-front-layer']),
 'future_differentiation': all(x in js for x in ['future.id === "belonging"','future.id === "minimal"','future.id === "wildlife"','future.id === "gathering"','future.id === "productive"','makerUseZoneSvg']),
 'calibration_preserved': all(x in js for x in ['calibrationPolygonPoints','calibrationKeepClearSvg','calibrationProtectedRouteSvg','calibration-mask-route','firstMove']),
 'finished_editor_hidden': '.photo-concept-stage.is-finished .calibration-editor-svg' in css and '.photo-concept-stage.is-finished .concept-map-marker:not(.marker-first)' in css,
 'photo_clear': all(x in css for x in ['.concept-depth-wash{display:none', 'filter:none!important;opacity:1!important', '.site-ground-veil{fill:rgba(59,92,55,.018)']),
 'photo_first_host': all(x in html+js for x in ['dashboardConceptStageHost','photo-concept-image','renderDedicatedConceptHost']),
 'ai_hard_locked': all(x in config for x in ['useBackend: false','provider: "none"','mockMode: true','killSwitch: true','providerCallsEnabled: false','paidCallsLocked: true']) and 'Real AI rendering is disabled' in html,
 'browser_evidence': (root/'evidence/v931_browser_test_results.json').exists(),
 'evidence_multiple_futures': all((root/'evidence'/f'v931_{x}_overlay_mobile.png').exists() for x in ['gathering','wildlife','minimal','productive','belonging','maker']),
 'no_frontend_secret': not re.search(r'sk-[A-Za-z0-9_-]{20,}', html+js+config),
}
result={'version':'9.3.1','status':'passed' if all(checks.values()) else 'failed','scope':'Plant Overlay and Future Selection Hotfix','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
sys.exit(0 if all(checks.values()) else 1)
