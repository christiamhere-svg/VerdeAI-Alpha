# VerdeAI v8.6 Workshop Build

VerdeAI is a public-beta property futures app: photo → pattern → futures → first move.

v8.6 adds evidence-led feedback review before real AI rendering. Local and imported tester records can be filtered and grouped, while VerdeAI clearly distinguishes a single clue from a repeated issue.

## Deploy
Upload the full unzipped folder to the existing Cloudflare Pages or Netlify static deployment. No build command is required.

## Visible version
The header and footer display `Build v8.6`.

## Test the milestone
1. Run the shaded garden self-test.
2. Select a future different from VerdeAI’s recommendation.
3. Save one reaction and open Saved → Local Feedback Review.
4. Check the different-choice metric and reaction/situation/build filters.
5. Export the CSV, refresh, and confirm the board and feedback persist.
6. Optionally import a VerdeAI feedback CSV from another tester device.

## Evidence boundary
No v8.5 public-tester dataset was included when v8.6 was built. The app does not invent a trend; it reports only saved or deliberately imported records.

## Privacy in this static beta
Photos, autosaved sessions, saved projects, feedback, and imported CSV data remain in the current browser/domain. Copying, exporting, importing, or sharing is deliberate.

## Safe rendering state
Real AI rendering is disabled. The backend is not connected. No API key is included. Paid calls are locked.

See `CHANGELOG.md` and `BUILD_STATUS.md` for validation details.
