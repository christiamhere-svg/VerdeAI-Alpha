# VerdeAI v8.5 Workshop Build

VerdeAI is a public-beta property futures app: photo → pattern → futures → first move.

v8.5 prepares the app for a small public-tester batch. Feedback is now stored as structured local records, reviewed inside the app, and exported as a spreadsheet-friendly CSV. Clear privacy wording and an accessibility pass were added without connecting a backend or paid AI rendering.

## Deploy
Upload the full unzipped folder to the existing Cloudflare Pages or Netlify static deployment. No build command is required.

## Visible version
The header and footer display `Build v8.5`.

## Test the milestone
1. Run the shaded garden self-test.
2. Tap Useful, Confusing, or Not believable.
3. Open Saved → Local Feedback Review.
4. Confirm the record contains build, situation, recommendation, selected future, reaction, optional note, and time.
5. Export Feedback CSV and open it in a spreadsheet.

## Privacy in this static beta
Photos, autosaved sessions, saved projects, and feedback remain in the current browser/domain. VerdeAI does not send the photo to a backend in this build. Copying, exporting, or sharing is deliberate.

## Safe rendering state
Real AI rendering is disabled. The backend is not connected. No API key is included. Paid calls are locked.

See `CHANGELOG.md` and `BUILD_STATUS.md` for the full milestone record and live-phone checklist.
