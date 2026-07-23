from pathlib import Path
import json,sys
r=Path(__file__).resolve().parents[1]
html=(r/'index.html').read_text();js=(r/'js/app.v9.4.4.js').read_text();css=(r/'styles/main.v9.4.4.css').read_text();cfg=(r/'config.v9.4.4.js').read_text()
checks={
'version': 'Build v9.4.4' in html and 'const BUILD_VERSION = "9.4.4"' in js and 'version: "9.4.4"' in cfg,
'demo_photo': 'assets/demo-overgrown-garden.jpg' in js and (r/'assets/demo-overgrown-garden.jpg').exists(),
'demo_recovery_calibration': all(x in js for x in ['scenario: "recovery"','upper-boundary','stored-materials']),
'edge_safety': 'const isFront = className.includes("front")' in js and 'densityScale = isFront ? .86 : 1' in js,
'finished_route_hidden': '.photo-concept-stage.is-finished .concept-access-protection' in css,
'six_futures': all(x in html+js for x in ['Feature Garden','Low-Maintenance Haven','Wildlife Haven','Gathering Space','Food Garden','Maker / Workshop Yard']),
'board_contrast': all(x in css+js for x in ['future-visual-signature','futureBoardSignature','Same property','transform:scale(1.12)']),
'safety_lock': all(x in cfg for x in ['useBackend: false','providerCallsEnabled: false','paidCallsLocked: true','killSwitch: true'])
}
out={'version':'9.4.4','status':'passed' if all(checks.values()) else 'failed','checks':checks};(r/'static-validation-v944.json').write_text(json.dumps(out,indent=2));print(json.dumps(out,indent=2));sys.exit(0 if all(checks.values()) else 1)
