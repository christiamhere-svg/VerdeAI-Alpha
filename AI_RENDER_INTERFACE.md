# VerdeAI v9.2 One-Render Interface

The public frontend exposes one optional action: **Create one AI concept render**.

It accepts one property photo and the current selected future. It has no batch route. The request cannot proceed without privacy, image-use, cost and concept-only confirmations.

The supplied build runs this as a mock rehearsal and falls back to the free calibrated overlay. See `docs/SECURE_PILOT_ARCHITECTURE_V9_2.md` for the backend contract.
