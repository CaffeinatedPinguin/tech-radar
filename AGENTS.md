# Tech Radar

Git-backed architecture knowledge viewer. The repository contains a small React/Vite frontend and a YAML content compiler; there is no backend or database.

Main domain: frontend. Shared frontend rules live in `../ai/frontend/AGENTS.md`.

Before changing the application, read:

- `README.md`
- `Tech-Radar-Implementation-Plan.md`
- `../ai/frontend/AGENTS.md`

The canonical content source is `radar-data/`. Never edit `public/content/content.json` by hand; regenerate it with `corepack pnpm content:build`.
