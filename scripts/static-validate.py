from bs4 import BeautifulSoup
from pathlib import Path
import tinycss2, re, json
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
js=(root/'js/app.js').read_text()
css=(root/'styles/main.css').read_text()
soup=BeautifulSoup(html,'lxml')
issues=[]
ids=[x.get('id') for x in soup.find_all(id=True)]
dups=sorted({x for x in ids if ids.count(x)>1})
if dups: issues.append(f'duplicate ids: {dups}')
for el in soup.select('[aria-controls]'):
    target=el.get('aria-controls')
    if not soup.find(id=target): issues.append(f'missing aria-controls target {target}')
for el in soup.select('[aria-describedby]'):
    for target in (el.get('aria-describedby') or '').split():
        if not soup.find(id=target): issues.append(f'missing aria-describedby target {target}')
for src in [x.get('src') for x in soup.find_all('script',src=True)]+[x.get('href') for x in soup.find_all('link',href=True)]:
    asset = (src or '').split('?',1)[0].split('#',1)[0]
    if asset and not asset.startswith(('http:','https:','#')) and not (root/asset).exists(): issues.append(f'missing asset {src}')
for el in soup.find_all('button'):
    if not el.get('type'): issues.append(f'button missing type: {el.get_text(" ",strip=True)[:30]}')
for rid in ['feedbackReactionFilter','feedbackSituationFilter','feedbackBuildFilter','feedbackEvidenceFilter','feedbackReviewSummary','feedbackDisagreementSummary','feedbackEvidenceInsight','feedbackGroupSummary','feedbackNoteThemes','feedbackEvidenceBoundary','feedbackCsvInput']:
    if not soup.find(id=rid): issues.append(f'missing id {rid}')
for token in ['conceptVisualHtml','conceptOverlaySvg','visualModeSwitchHtml','visualLegendItems','feedbackDisagreementStats','evidenceInsight','filteredFeedback','importFeedbackCsvFile','parseCsvRows','state.version = BUILD_VERSION','Selected different from recommendation','testerEvidenceItems','repeatedTesterNoteLanguage','Evidence type','Issue area','defaultCalibrationForScenario','calibrationDefsSvg','bindCalibrationUi','normaliseCalibration','calibrationSafePoint','setCalibrationDragging','calibrationHandleMarkup','calibration-finish-bar']:
    if token not in js: issues.append(f'missing JS token {token}')
rules=tinycss2.parse_stylesheet(css,skip_comments=False,skip_whitespace=True)
parse_errors=[r.message for r in rules if r.type=='error']
if parse_errors: issues.append(f'css parse errors: {parse_errors[:5]}')
for a,b in [('app.js','js/app.js'),('main.css','styles/main.css'),('main.css','css/styles.css')]:
    if (root/a).read_bytes() != (root/b).read_bytes(): issues.append(f'unsynced {a} {b}')
patterns={
 'openai_key':r'\bsk-[A-Za-z0-9_-]{20,}',
 'google_key':r'\bAIza[0-9A-Za-z_-]{20,}',
 'aws_key':r'\bAKIA[0-9A-Z]{16}\b',
 'private_key':r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'
}
for name,pat in patterns.items():
    for p in root.rglob('*'):
        if p.is_file() and p.suffix.lower() not in {'.png','.jpg','.jpeg','.zip'}:
            try: text=p.read_text(errors='ignore')
            except: continue
            if re.search(pat,text): issues.append(f'{name} in {p.relative_to(root)}')
for p in ['index.html','app.js','js/app.js','config.js','package.json','README.md','BUILD_STATUS.md']:
    if '9.1' not in (root/p).read_text(): issues.append(f'9.1 missing in {p}')
# Ensure old version is not forced during state restoration.
if 'state.version = "8.4"' in js or 'state.version = "8.5"' in js: issues.append('stale hardcoded restore version remains')
result={'status':'passed' if not issues else 'failed','issues':issues,'id_count':len(ids),'css_rule_count':len(rules),'files':sum(1 for p in root.rglob('*') if p.is_file())}
(root/'static-validation.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))
raise SystemExit(1 if issues else 0)
