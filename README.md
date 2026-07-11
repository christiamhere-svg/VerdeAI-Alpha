# VerdeAI v3.8 — Property Futures Board

VerdeAI helps a tester upload one property photo, choose simple clues, and receive a Property Futures Board showing what the place could become.

## v3.8 focus
v3.8 makes the Futures Dashboard feel like a generated result board for any upload, demo, or self-test.

The board includes:

- Your Property Today
- Six Possible Futures
- VerdeAI Recommendation
- Property Compass
- Next Step
- Five-Year Property Movie
- Optional AI Render Setup

## Important rendering note
Real AI image rendering is **not connected yet**. v3.8 uses honest concept boards and prompt scaffolding until a safe backend provider connection exists.

No paid AI image calls are made by this build.

## Deploy
This is a static site and can be deployed to GitHub Pages or Netlify by replacing the existing project files with this folder’s contents.

## Local test
```bash
npm test
```

## Next likely development step
v3.9 should either:

- continue polishing the public board layout and copy, or
- begin the safe backend/proxy connection plan for one real image-render provider.
