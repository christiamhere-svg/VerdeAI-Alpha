# VerdeAI v9.8.6.1 — Feedback Selection Hotfix

## Problem found in physical desktop testing
After clicking **Confusing**, the feedback was saved but **Useful** remained visually highlighted. The stored answer and the visible answer disagreed.

## Repair
- All three reactions begin neutral.
- Clicking a reaction sets only that button to `aria-pressed="true"`.
- The selected button receives the filled green style.
- The other two buttons return to the unselected white style.
- The saved choice is restored when the same result is rendered again.

## Preserved
The v9.8.6 Results, photo, compare, Images, feedback, owner tools, reports, imports, calibration, and safety behaviour remain unchanged.

## Safety
Real AI rendering remains off. Backend disconnected. Provider calls off. API keys absent. Paid calls locked. Kill switch on. Browser-only photo handling.
