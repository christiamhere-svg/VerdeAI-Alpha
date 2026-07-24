from pathlib import Path
import json, re, sys

root = Path(__file__).resolve().parents[1]
html = (root / 'index.html').read_text(encoding='utf-8')
js = (root / 'js/app.v9.4.js').read_text(encoding='utf-8')
css = (root / 'styles/main.v9.4.css').read_text(encoding='utf-8')
config = (root / 'config.v9.4.js').read_text(encoding='utf-8')

checks = {
  'v94_visible_and_stored': 'Build v9.4' in html and 'const BUILD_VERSION = "9.4"' in js and 'version: "9.4"' in config,
  'unique_assets': all(x in html for x in ['styles/main.v9.4.css','config.v9.4.js','js/app.v9.4.js']),
  'possibilities_board': all(x in html for x in ['possibilitiesBoard','What Could Your Property Become?','dashboardBoardToday','dashboardFutureCards','dashboardRecommendation','dashboardEvolution']),
  'six_future_names': all(x in html+js for x in ['Feature Garden','Low-Maintenance Haven','Wildlife Haven','Gathering Space','Food Garden','Maker / Workshop Yard']),
  'original_photo_anchor': 'Your property today before any VerdeAI concept overlay' in js and 'dashboard-board-today' in css,
  'recommended_selected_independent': all(x in js for x in ['recommendedFutureId','selectedFutureId','selectionNote','Dashboard future selected']),
  'procedural_botanical_assets': all(x in js for x in ['botanicalHash','botanicalRandom','botanicalLeafPath','botanicalPlantGeometry','data-plant-variant']),
  'grounding_and_perspective': all(x in js+css for x in ['plant-contact-shadow','perspective','.plant-rear-layer','.plant-mid-layer','.plant-front-layer']),
  'future_text_sync': 'futureCompositionText' in js,
  'calibration_preserved': all(x in js for x in ['calibrationPolygonPoints','calibrationKeepClearSvg','calibrationProtectedRouteSvg','firstMove','openConceptCalibration']),
  'finished_editor_hidden': '.photo-concept-stage.is-finished .calibration-editor-svg' in css and '.photo-concept-stage.is-finished .concept-map-marker:not(.marker-first)' in css,
  'photo_clear': all(x in css for x in ['.concept-depth-wash{display:none', 'filter:none!important;opacity:1!important']),
  'compact_guides_hidden_only': '.possibilities-board .dashboard-future-visual .concept-marker-layer' in css and 'dashboardConceptStageHost' in html,
  'ai_hard_locked': all(x in config for x in ['useBackend: false','provider: "none"','mockMode: true','killSwitch: true','providerCallsEnabled: false','paidCallsLocked: true']) and 'Real AI rendering disabled' in html,
  'no_frontend_secret': not re.search(r'sk-[A-Za-z0-9_-]{20,}', html+js+config),
  'browser_evidence': (root/'evidence/v94_browser_test_results.json').exists(),
  'board_screenshots': all((root/'evidence'/name).exists() for name in ['v94_possibilities_board_desktop.png','v94_possibilities_board_android.png','v94_full_size_selected_android.png']),
}

result = {'version':'9.4','status':'passed' if all(checks.values()) else 'failed','scope':'Property Possibilities Board','checks':checks}
(root/'static-validation.json').write_text(json.dumps(result, indent=2),encoding='utf-8')
print(json.dumps(result, indent=2))
sys.exit(0 if all(checks.values()) else 1)
