# Tech Radar

A static architecture knowledge viewer backed by Git. Human or AI contributors edit small YAML files, the content compiler validates and normalizes them, and nginx serves the resulting React application with generated `content.json`.

## Quick start

```text
corepack pnpm install
corepack pnpm content:build
corepack pnpm dev
```

The example source content lives in `radar-data/`. The generated runtime contract is `public/content/content.json` and is intentionally ignored by Git.

## Branding

The application uses the Smrodek mark from `public/logo/logo.svg` in the header and favicon. Replace that asset to update the brand without changing the application shell.

## Content workflow

```text
radar-data/*.yaml → corepack pnpm content:build → public/content/content.json → corepack pnpm build
```

The compiler validates IDs, fixed areas and rings, references, dates, history, replacement graphs, and ADR supersession cycles. Errors include the source file and field path.

## Docker

```text
docker build -t tech-radar .
docker run --rm -p 8080:8080 tech-radar
```

The runtime image contains only the built static assets, generated demo content, and nginx. A private deployment can replace the generated file in the image:

```dockerfile
FROM ghcr.io/example/tech-radar:0.1.0
COPY generated/content.json /usr/share/nginx/html/content/content.json
```

Do not put secrets in radar content. Architecture data may itself be sensitive; keep private source repositories and deployment images private.

## V1 boundaries

No backend, database, authentication, GUI editing, Markdown parser, raw HTML rendering, collaboration, plugins, analytics, or arbitrary radar layouts. The application is an architecture knowledge viewer, not a knowledge-management platform.
