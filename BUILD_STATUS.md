# VerdeAI v8.3 Workshop Build — Build Status

Status: Ready for GitHub / Cloudflare Pages deployment.

## Milestone completed
v8.3 audits and polishes the plant overlay and Six Possible Futures experience for phone-sized screens.

## Overlay improvements
- The property photo remains the visual anchor.
- Mobile image labels become four clear numbered markers instead of long text pills over the photo.
- A matching numbered key explains each suggested zone below the image.
- Emoji plant stickers were replaced with softer abstract planting masses and material zones.
- Overlay wording is consolidated around `Concept overlay` and `Concept Board · Not AI Render`.
- The dashboard’s main property photo now includes the same numbered key, so the overlay is understandable without opening another tab.

## Six Possible Futures improvements
- Each future now adds a visibly different concept treatment to the same property photo.
- Mobile cards use one large photo with a compact plan inset instead of two tall stacked visuals.
- Repeated descriptions and tags were reduced while retaining property-specific intent.
- The section carries one honest `Concept Board · Not AI Render` trust label.
- Recommended and Selected are independent states.
- When the recommended card is also selected, the status is combined as `Recommended · Selected`.
- Selecting another future no longer gets reset by the protected analysis snapshot.

## Visible version
- `Build v8.3` appears in the public-beta header.
- A small build/safety footer repeats the version and rendering lock state.

## Preserved functionality
- Photo upload and demo mode.
- Shaded garden self-test.
- Clue-guided analysis and overlays.
- Six future ranking and card selection.
- Reports, save/load, export, history, and Vision Board.
- Tester Page and AI Setup.
- Backend proxy scaffold and mock render planning.

## Safety retained
- Real AI rendering disabled.
- Backend not connected.
- API key not added.
- Paid calls locked.
- No API keys in frontend code.

## Validation completed
- JavaScript syntax check passed.
- Automated project smoke test passed.
- Headless Chromium rendered the self-test futures board at 390 × 844 and the desktop board at 1440 × 1000 without JavaScript errors.
- Six cards rendered with the property image and distinct treatments.
- Numbered overlay markers and keys rendered correctly.
- Recommended remained on the ranked card while Selected moved to another card.
- Report output displayed v8.3.
- Saved project, Vision Board, and AI Setup safe-state content remained available.
- Duplicate runtime files were synchronized.

## Live phone validation after deployment
1. Confirm `Build v8.3` appears in the header or footer.
2. Run the shaded garden self-test.
3. Open Six Possible Futures and check that each card’s photo treatment looks distinct.
4. Select Maker / Workshop Yard and confirm Belonging Garden keeps `Recommended` while Maker shows `Selected`.
5. Open Tester Page and confirm markers 1–4 match the numbered key.
6. Confirm AI Setup still shows Disabled / Not connected / Not added / Locked.
