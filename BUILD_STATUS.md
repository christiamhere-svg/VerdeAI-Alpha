# VerdeAI Build Status

## Build
**v9.6.5 — One-Screen First-Time Entry**

## Candidate status
Local candidate only. Not deployed. Physical desktop and Android approval is still required.

## What changed
- The opening screen now has one plain-language promise.
- The primary action is **Choose a photo**.
- The only first-time secondary action is **Try an example instead**.
- Internal phrases, the shaded self-test, onboarding strip, tester cards, navigation tabs, and technical build clutter are hidden until the user starts.
- Choosing a photo opens **Upload / Clues** directly.
- Trying the example opens the completed possibilities board directly.
- Returning sessions receive a small **Continue saved result** option.
- Reset returns to the simple entry screen.

## Automated evidence
- Android 390 × 844 first screen: zero horizontal overflow and zero vertical overflow.
- Android photo path: opens Upload / Clues.
- Android example path: opens six-futures board.
- Desktop first screen: zero horizontal overflow.

## Safety
Real AI rendering is disabled. Backend is disconnected. Provider calls are off. API keys are absent. Paid calls are locked. Kill switch remains on.
