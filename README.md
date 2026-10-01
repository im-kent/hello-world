# Hello World — Minimal

An elegant, minimalistic hello world built with:

- **Node.js** — tiny vanilla `http` server (`server.js`, no framework)
- **Vanilla HTML** — semantic markup (`public/index.html`)
- **Vanilla JS** — theme toggle, clock, interactions (`public/app.js`)
- **TailwindCSS** — via CDN, responsive mobile-first layout

No React, no Angular, no build step.

## Run locally

```bash
npm start
# open http://localhost:3000
```

Health check: `GET /api/health` → `{ "status": "ok" }`

## Deploy

Docker-ready (`Dockerfile`, `EXPOSE 3000`). Works on Coolify, Railway, Render, Fly, or any container host.

## License

MIT
