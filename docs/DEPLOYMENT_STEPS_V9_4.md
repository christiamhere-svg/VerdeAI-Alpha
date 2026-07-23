# Simple Deployment Steps — v9.4

Do not deploy until the ZIP has been reviewed and the repository is clean.

1. Create a clean backup of the current verified repository.
2. Extract `VerdeAI_v9_4_Property_Possibilities_Board.zip` outside the repository.
3. Copy the extracted contents into the verified repository root.
4. Confirm GitHub Desktop shows only intentional v9.4 changes and no `- Copy` duplicates.
5. Commit: `Build v9.4 Property Possibilities Board`.
6. Push `main` to the existing static host.
7. Do not open or change Cloudflare Worker settings.
8. Force-refresh the live site.
9. Confirm `Public Beta · Build v9.4`.
10. Run `docs/ANDROID_BOARD_CHECKLIST_V9_4.md` before sending any tester link.

Safety state: backend off, provider calls off, paid calls locked, real AI rendering disabled.
