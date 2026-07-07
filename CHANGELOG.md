# Changelog

## VerdeAI Tester Beta v1.27

### Added
- 7-day check-in screen after the weekend experiment.
- Goal-specific reflection questions for each tester goal.
- Postcode-prefix local context notes for selected Australian postcode ranges.
- Local note in Property Story and final result.
- Check-in prompts in copied result text.

### Changed
- Timeline now includes a 7-day check-in stage.
- Result output now includes local note and check-in prompts.
- Future selection logic now preserves valid choices and resets only when needed.

### Bug fixes
- Prevented the selected future from always resetting unnecessarily when rerendering futures.
- Improved postcode handling and local context fallback text.

### Testing notes
- Verified static file generation.
- Verified required project files are present.
- Manual browser testing should confirm upload flow, demo flow, goal changes, postcode notes, 7-day check-in, copy result and mobile layout.
