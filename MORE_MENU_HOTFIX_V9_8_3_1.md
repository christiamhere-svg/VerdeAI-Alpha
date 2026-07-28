# VerdeAI v9.8.3.1 — More Menu Hotfix

## Physical-test issue found
On desktop, clicking **More** changed the native details state and showed a toast, but the menu itself was clipped by the sticky navigation container.

## Repair
- The simplified journey navigation now permits visible overflow.
- The More panel receives an explicit stacking layer above the page content.
- Desktop placement is anchored below the More button.
- Mobile keeps the verified bottom-sheet layout.
- The misleading “More tools opened” toast was removed.
- `aria-expanded` now follows the real open/closed state.

## Preserved
- Results, Photo & clues, Images counter, and More navigation.
- Compact mobile pending-image slots.
- Browser-only photo handling.
- Real rendering off, provider calls off, paid calls locked, kill switch on.

## Deployment state
Local candidate only. Do not copy to GitHub until physical desktop testing confirms the More panel is visibly open.
