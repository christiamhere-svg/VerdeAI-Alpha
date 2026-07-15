# VerdeAI v8.8 Workshop Build

VerdeAI is a public-beta property futures app: photo → pattern → futures → first move.

v8.8 makes the uploaded property photo the main explanation of the result. It adds a three-mode photo comparison, layered scenario-specific SVG overlays, future-specific visual treatments, a compact five-marker legend, and a first move tied to marker 5.

## Deploy
Upload the full unzipped folder to the existing Cloudflare Pages deployment. No build command is required.

## Visible version
The header and footer display `Build v8.8`.

## Test the milestone
1. Run the shaded garden self-test or upload a property photo.
2. Confirm the board opens at **Your property · visual concept** before the long reports.
3. Switch between **Original**, **VerdeAI Concept**, and **Selected Future**.
4. Select a different future and tap **View this future on my photo**.
5. Confirm the selected overlay changes while the Recommended badge stays on VerdeAI’s best fit.
6. Check marker 5 and the matching First move entry below the photo.
7. Save, refresh, and confirm the selected future and image mode remain.
8. Open AI Setup and confirm Disabled / Not connected yet / Not added / Locked.

## Visual overlay system
The build stays static and free. It uses responsive inline SVG, CSS transparency, perspective-shaped zones, and the uploaded image as a background anchor. It does not claim photorealistic rendering or computer vision.

Four scenario geometries are included:
- shaded / under-building;
- blank canvas / front yard;
- overgrown recovery;
- workshop / awkward access.

Six future treatments visibly alter the concept image:
- Belonging Garden;
- Sanctuary Garden;
- Possibility / Wildlife Garden;
- Gathering Space;
- Productive Garden;
- Maker / Workshop Yard.

## Privacy in this static beta
Photos, autosaved sessions, saved projects, feedback, and imported CSV data remain in the current browser/domain. Copying, exporting, importing, or sharing is deliberate.

## Safe rendering state
Real AI rendering is disabled. The backend is not connected. No API key is included. Paid calls are locked.

See `CHANGELOG.md`, `BUILD_STATUS.md`, and `VALIDATION_RESULTS.json` for details.
