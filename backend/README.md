# VerdeAI v8.5 Safe Render Proxy Scaffold

This backend is optional for the static public beta. It exists to prepare safe real AI rendering later.

## Run locally

```bash
cd backend
npm install
npm start
```

Open:

```text
http://localhost:8080/api/health
```

## Endpoints

- `GET /api/health`
- `GET /api/render/providers`
- `POST /api/render/estimate`
- `POST /api/render`
- `POST /api/analyse`
- `POST /api/futures`
- `POST /api/report`

## Safety rules

- Real paid providers are disabled by default.
- Set `VERDEAI_REAL_RENDERING_ENABLED=true` only when ready.
- API keys stay in server environment variables.
- The frontend must never contain provider secrets.
- Render one future first.
- Render all six only after separate cost confirmation.
- Concept boards remain the fallback if rendering fails.
