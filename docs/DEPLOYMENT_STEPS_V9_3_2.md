# Simple Deployment Steps — v9.3.2

## Do not upload the ZIP itself to GitHub

1. Download `VerdeAI_v9_3_2_Botanical_Overlay_Realism_Pass.zip`.
2. In Downloads, right-click the ZIP and choose **Extract All**.
3. Open the extracted `VerdeAI_v9_3_2_Botanical_Overlay_Realism_Pass` folder.
4. Open the existing VerdeAI repository folder:
   `Documents > GitHub > VerdeAI-Alpha-v127 > VerdeAI-Alpha`
5. Copy everything inside the extracted v9.3.2 folder into the repository folder.
6. Choose **Replace the files in the destination** when Windows asks.
7. Open GitHub Desktop.
8. Confirm the current repository is `VerdeAI-Alpha` and the branch is `main`.
9. In Summary, type:
   `Build v9.3.2 Botanical Overlay Realism Pass`
10. Click **Commit to main**.
11. Click **Push origin**.
12. Open the live site and force-refresh.
13. Confirm the badge reads `Public Beta · Build v9.3.2`.
14. Run `docs/ANDROID_REALISM_CHECKLIST_V9_3_2.md`.

This deployment does not require Cloudflare Worker changes, API tokens, backend activation, or paid rendering.
