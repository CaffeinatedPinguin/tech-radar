# Smrodek Tech Radar

[![CI](https://github.com/CaffeinatedPinguin/tech-radar/actions/workflows/ci.yml/badge.svg)](https://github.com/CaffeinatedPinguin/tech-radar/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

A small, Git-backed architecture knowledge viewer for the Smrodek homelab. Contributors maintain technologies and architecture decisions as structured YAML; a deterministic compiler validates the source and generates the JSON contract consumed by the React frontend.

The project is intentionally static. There is no backend, database, authentication service, Markdown parser, raw HTML rendering, or GUI editor.

## What it provides

- A visual radar with four technology rings and four architecture areas.
- Searchable technology catalog with URL-shareable filters.
- Technology history, review metadata, and linked architecture decisions.
- Structured ADR pages with alternatives, consequences, and revisit conditions.
- Schema validation for YAML content, references, dates, and relationship cycles.
- A minimal nginx runtime image for static deployment.

## Technology stack

- React 19 and React Router
- TypeScript and Vite
- Zod for runtime content validation
- YAML for human-maintained source content
- Vitest and ESLint for verification
- nginx and Docker for the production runtime

## Requirements

- Node.js 22.20 or newer
- pnpm 11 or newer
- Docker, only when building or running the container image

The repository pins its package manager in `package.json`. Corepack is recommended so local and CI installs use the same pnpm version.

## Getting started

```bash
corepack pnpm install
corepack pnpm content:build
corepack pnpm dev
```

Open the local Vite URL shown in the terminal. The content compiler must run before the application can load its generated runtime contract.

## Repository layout

```text
radar-data/                # Canonical YAML source content
  radar.yaml               # Radar title and fixed area definitions
  technologies/            # Technology records
  adrs/                    # Architecture decision records
scripts/build-content.mjs  # Validation and deterministic JSON compiler
src/                      # React application
  app/                     # Application shell, routing, and content context
  content/                 # Runtime content loading and validation
  domain/                  # Shared content contract and domain types
  features/                # Feature-specific UI and behavior
  pages/                   # Route-level page composition
  shared/                  # Small domain-neutral UI primitives
public/logo/               # Smrodek logo and public brand assets
Dockerfile                # Build and nginx runtime stages
```

`public/content/content.json` is generated output and is ignored by Git. Never edit it by hand.

## Content workflow

Edit files under `radar-data/`, then regenerate the runtime contract:

```bash
corepack pnpm content:build
```

The compiler reports the source file and field path for invalid data. It validates:

- technology and ADR identifiers;
- required areas, rings, usages, and statuses;
- ISO calendar dates and URLs;
- references between technologies and ADRs;
- duplicate identifiers;
- replacement and ADR supersession cycles.

The generated contract is loaded again in the browser through the Zod schema, so malformed runtime data produces a clear load error instead of an unsafe cast.

## Development commands

```bash
corepack pnpm dev              # Start the Vite development server
corepack pnpm content:build   # Validate YAML and generate content.json
corepack pnpm test            # Run the Vitest suite once
corepack pnpm lint            # Check the repository with ESLint
corepack pnpm lint:fix        # Apply safe ESLint fixes
corepack pnpm typecheck       # Run the TypeScript compiler without emitting files
corepack pnpm build           # Generate content and build the frontend
```

Before opening a pull request, run the content build, tests, lint, typecheck, and production build. CI runs the same checks and then builds and smoke-tests the Docker image.

## Docker

Build and run the production image:

```bash
docker build -t tech-radar .
docker run --rm -p 8080:8080 tech-radar
```

The image serves the compiled static site through nginx. The health endpoint is available at `/healthz`.

## Branding

The header and favicon use the Smrodek logo from `public/logo/logo.svg`. The header also reads the displayed application version from `package.json`. Replace the logo asset or update the package version to change those brand details without changing the application shell.

## Contributing

1. Create or update the relevant YAML source under `radar-data/`.
2. Run `corepack pnpm content:build` and review the generated result locally.
3. Run the complete verification commands listed above.
4. Keep changes small, explicit, and easy to review.

Content can describe internal architecture, so check the repository visibility and deployment target before publishing new records.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
