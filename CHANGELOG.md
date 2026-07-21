# Changelog

## v9.3.1 — Plant Overlay and Future Selection Hotfix

### Fixed

- Restored the top-level **Other possible futures** section after the recommended result.
- Restored all six selectable future cards on Android and desktop.
- Added a runtime recovery guard that repositions and reveals the future panel if older layout code hides or nests it.
- Confirmed **Wildlife Haven** can be selected while VerdeAI’s recommendation remains unchanged.
- Removed the broad green photo wash and kept the uploaded property photograph at full opacity with no image filter.
- Reduced ground and depth colouring to faint placement cues rather than full-image masks.

### Improved

- Added more varied botanical silhouettes: ferns, strappy plants, flowering perennials and irregular foliage mounds.
- Increased variation in plant height, rotation, scale, spacing and overlap.
- Strengthened foreground, middle and rear planting bands without covering buildings or the protected access route.
- Reworked each future as a different composition:
  - **Feature Garden:** focal anchor with supporting lower planting.
  - **Low-Maintenance Haven:** repeated restrained planting and strong negative space.
  - **Wildlife Haven:** the densest habitat layering with varied flowering and foliage forms.
  - **Gathering Space:** open social centre framed by edge planting.
  - **Food Garden:** recognisable productive beds with working space.
  - **Maker / Workshop Yard:** durable work and storage zones with practical screening.
- Replaced abstract future-card illustrations with previews using the actual uploaded property photograph.
- Added an Android-friendly single-column future picker with clear selected-state feedback.

### Preserved

- Photo upload, demo mode and shaded self-test.
- Scenario analysis and recommendation logic.
- Five-step calibration, keep-clear zones, protected access route, opportunity point and marker 5.
- Dedicated clean photo stage and Original / VerdeAI Concept / Selected Future modes.
- Independent recommended and selected futures.
- Autosave, refresh recovery, saved projects, reports, history and export.
- Finished-state behaviour: editor handles disappear and marker 5 remains.
- Accessibility and responsive behaviour.

### Safety boundary

- Real AI rendering remains disabled.
- Backend use remains off.
- Mock mode remains on.
- Kill switch remains on.
- Provider calls remain off.
- Paid calls remain locked.
- No Cloudflare Worker, API token, pricing or provider activation work was performed.
