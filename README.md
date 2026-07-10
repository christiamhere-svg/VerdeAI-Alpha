# VerdeAI v2.9 Workshop Build

VerdeAI is a static, low-cost public tester beta for exploring what a property could become from one uploaded photo, a few human clues, overlay concepts, and one practical first move.

## What changed in v2.9

v2.9 was built directly from the existing v2.8 Workshop Build. The project was not recreated from scratch. Existing upload, one-tap starter clues, analysis, overlays, reports, local save/load, history, Vision Board, Export, Share Code, tester invite, backend scaffold, API scaffold, and smoke testing were preserved.

The main v2.9 focus is **less Chris babysitting**: testers can accidentally close the page and still recover the latest local session when they reopen the same VerdeAI URL in the same browser/domain.

## New in v2.9

- Added local **Current Session Autosave**.
- Added automatic session restore on page reopen.
- Added a visible **Autosaved current session** recovery card.
- Added a **Current session autosaved** card on the Saved screen.
- Added a one-tap **Save Project Card** from the autosaved session.
- Preserved current analysis, overlays, report, design refinements, and selected future during autosave.
- Added pagehide and visibilitychange persistence so mobile browser closes are less destructive.
- Updated smoke tests to check autosave/recovery hooks.
- Updated package, backend, API, README, CHANGELOG, and BUILD_STATUS to v2.9.

## Still preserved from earlier builds

- v2.8 smart next action flow.
- v2.8 one-tap starter clue analysis.
- v2.8 tester invite/checklist/share handoff.
- v2.7 tester invite and beta handoff tools.
- v2.6 photo compression and Share Code export/import.
- v2.5 design refinement stability.
- v2.4 shaded/under-building starter clue improvements.
- Static-site deployment with no paid backend required.

## Important limitation

Autosave is still **local browser/domain storage only**. It can recover after closing and reopening the same site in the same browser, but it cannot magically move data between:

- `pages.dev` and `github.io`
- Chrome and another in-app browser
- different phones/computers
- cleared browser storage

Use **Save Project**, **Copy Share Code**, or **Download Project JSON** before changing browsers or devices.

## Files

- `index.html` — static app shell
- `styles/main.css` — responsive visual system
- `js/app.js` — frontend engine, autosave, overlays, reports, storage
- `data/futures.json` — future set mirror
- `backend/server.js` — optional mock backend
- `api/openapi-alpha.json` — future API scaffold
- `scripts/smoke-test.mjs` — smoke test
- `CHANGELOG.md`
- `BUILD_STATUS.md`

## Run locally

```bash
npm test
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

## Replace GitHub project

1. Extract `VerdeAI_v2.9_Workshop_Build.zip`.
2. Open the extracted `verdeai-v2.9` folder.
3. Copy the contents of that folder.
4. Paste into the existing GitHub repository folder that GitHub Desktop opens via **Repository → Show in Explorer**.
5. Replace files when Windows asks.
6. Commit with: `Build VerdeAI v2.9`.
7. Push origin.
8. Refresh the live page and confirm the badge says `Workshop Build v2.9`.

## Suggested v2.9 live test

1. Open VerdeAI live page.
2. Upload the shaded under-building photo.
3. Tap **Looks shaded / under cover**.
4. Confirm analysis says **Sheltered Shade Pocket**.
5. Close the page.
6. Reopen the same live URL.
7. Confirm VerdeAI restores the previous session instead of starting empty.
8. Open Report and Vision Board to confirm they still match the analysis.

## AI status

Real AI vision/rendering is still not connected. v2.9 remains clue-guided rule logic using the uploaded image as the overlay base.
