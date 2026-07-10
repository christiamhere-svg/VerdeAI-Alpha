# VerdeAI v2.9 Mock Backend

This backend is optional. The main v2.9 app still works as a static Netlify-ready frontend.

## Run

```bash
cd backend
npm install
npm start
```

Then open:

```text
http://localhost:8080/api/health
```

## Endpoints

- `GET /api/health`
- `POST /api/analyse`
- `POST /api/futures`
- `POST /api/render`
- `POST /api/report`

The endpoints are intentionally mock-only. They preserve the integration contract while the product remains free to test without paid AI services.
