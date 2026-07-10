# CHANGELOG

## v2.9 — Local Session Recovery Build

### Summary

v2.9 continues directly from v2.8. The build focuses on the live testing pain point where the page can be closed or lost during mobile testing, forcing Chris to upload and re-run the same photo repeatedly.

The goal is to reduce manual babysitting and make VerdeAI more forgiving for first-time testers.

### Added

- Local current-session autosave key: `verdeai_v2_9_current_session`.
- Automatic restore of the latest local session on page reopen.
- `pagehide` and `visibilitychange` persistence hooks for mobile browser closes.
- Visible Session Recovery card under the quick-start flow.
- Saved screen autosave card when there is an active unsaved session.
- **Save Project Card** button to turn the autosaved current session into a named saved project.
- Smoke test checks for autosave and session recovery features.

### Improved

- Saved screen explains the difference between local project cards and autosaved current session.
- Hero promise explains that v2.9 is more forgiving when testers close the page.
- Tester Mode copy now mentions recovery after accidental page close.
- AI Setup copy clarifies that local session autosave is active.
- README and BUILD_STATUS now include a specific session recovery live test.

### Preserved

- v2.8 smart next-step guide.
- v2.8 one-tap starter clue analysis.
- v2.8 Report/Vision Board/Saved/Export flow.
- v2.7 tester invite/checklist/share handoff tools.
- v2.6 photo compression and Share Code import/export.
- v2.5 design refinement stability.
- v2.4 shaded/under-building analysis improvements.
- Static GitHub Pages/Netlify-ready architecture.

### Known limitations

- Autosave is local to the same browser and domain.
- Autosave does not cross from `pages.dev` to `github.io`.
- Autosave does not cross devices or browser apps.
- Full AI vision/rendering is still scaffolded but not connected.

### Recommended commit message

```text
Build VerdeAI v2.9
```
