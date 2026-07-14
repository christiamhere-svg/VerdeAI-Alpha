# AI Render Interface — v8.5

Real image rendering remains deliberately disabled. The v8.5 scenario and tester-handoff pass changes analysis, concept overlays, future ranking, and feedback only; it does not connect a provider.

- Frontend provider key: not present.
- Backend proxy: scaffold only and not connected to the public site.
- Paid calls: locked.
- Cost confirmation: required before any future real render.
- Concept boards: retained as the honest fallback.
- Visible status: the public footer states `Concept boards only · Paid rendering locked`.

Provider secrets must be stored in server-side environment variables and must never be committed to frontend files.
