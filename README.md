# Smrodek Tech Radar

[![CI workflow status](https://github.com/CaffeinatedPinguin/tech-radar/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CaffeinatedPinguin/tech-radar/actions/workflows/ci.yml)
[![Latest version](https://img.shields.io/github/v/release/CaffeinatedPinguin/tech-radar?label=version&sort=semver)](https://github.com/CaffeinatedPinguin/tech-radar/releases/latest)
[![License](https://img.shields.io/github/license/CaffeinatedPinguin/tech-radar)](LICENSE)

A small, Git-backed architecture knowledge viewer for the Smrodek homelab. Technologies and
architecture decisions live as YAML; a deterministic compiler validates the source and generates the
JSON consumed by the React frontend.

The app is intentionally static: no backend, database, authentication, Markdown parser or GUI editor.
The frontend is React 19 with React Router and TypeScript, built by Vite. Zod validates the content,
and nginx serves the production image.

**Status:** active, maintained by one person on a best-effort basis. Issues are welcome; outside
pull requests are not accepted. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Features

- A visual radar with four technology rings and four architecture areas.
- A searchable catalog with URL-shareable filters.
- Technology history, review metadata and linked architecture decisions.
- ADR pages with alternatives, consequences and revisit conditions.
- Schema validation for YAML content, references, dates and relationship cycles.
- A minimal nginx image for static deployment.

## Requirements

- Node.js 22.22.2 or newer
- pnpm 11 or newer
- Docker, only for the container image

The repository pins pnpm in `package.json`. Corepack keeps local and CI installs on the same version.

## Getting started

```bash
corepack pnpm install
corepack pnpm content:build
corepack pnpm dev
```

Open the Vite URL shown in the terminal. The content compiler must run before the app can load its
generated runtime contract.

## Repository layout

```text
radar-data/                # Canonical YAML source content
  radar.yaml               # Radar title and fixed area definitions
  technologies/            # Technology records
  adrs/                    # Architecture decision records
scripts/build-content.mjs  # Validation and deterministic JSON compiler
src/                       # React application
  app/                     # Application shell, routing, and content context
  content/                 # Runtime content loading and validation
  domain/                  # Shared content contract and domain types
  features/                # Feature-specific UI and behavior
  pages/                   # Route-level page composition
  shared/                  # Small domain-neutral UI primitives
public/logo/               # Smrodek logo and public brand assets
Dockerfile                 # Build and nginx runtime stages
```

`public/content/content.json` is generated and ignored by Git. Do not edit it by hand.

## Content workflow

Edit files under `radar-data/`, then regenerate the runtime contract:

```bash
corepack pnpm content:build
```

The compiler reports the source file and field path for invalid data. It checks:

- technology and ADR identifiers;
- required areas, rings, usages and statuses;
- ISO dates and URLs;
- references between technologies and ADRs;
- duplicate identifiers;
- replacement and ADR supersession cycles.

The browser loads the generated contract through the Zod schema, so bad runtime data shows a clear
load error instead of an unsafe cast.

## Development commands

```bash
corepack pnpm dev              # Start the Vite development server
corepack pnpm content:build    # Validate YAML and generate content.json
corepack pnpm test             # Run the Vitest suite once
corepack pnpm lint             # Check the repository with ESLint
corepack pnpm lint:fix         # Apply safe ESLint fixes
corepack pnpm typecheck        # Run the TypeScript compiler without emitting files
corepack pnpm build            # Generate content and build the frontend
```

Before a pull request, run the content build, tests, lint, typecheck and production build. CI runs
the same checks, then builds and smoke-tests the Docker image. `main` needs `ci-required` to be
green; Dependabot keeps GitHub Actions, npm dependencies and the Docker image current. Version tags
also run the release job.

## Docker

```bash
docker build -t tech-radar .
docker run --rm -p 8080:8080 tech-radar
```

The image serves the compiled site through nginx. The health endpoint is `/healthz`.

## Releases

Stable tags use `vX.Y.Z`. A matching tag validates the version against `package.json`, runs the full
verification suite, publishes the image to GHCR and creates a GitHub Release with the commits since
the previous tag.

```bash
docker pull ghcr.io/caffeinatedpinguin/tech-radar:vX.Y.Z
```

Images are in the [GitHub Container Registry package](https://github.com/CaffeinatedPinguin/tech-radar/pkgs/container/tech-radar),
and releases are listed on the [GitHub Releases page](https://github.com/CaffeinatedPinguin/tech-radar/releases).

## Branding

The header and favicon use `public/logo/logo.svg`. The header reads the displayed version from
`package.json`. Replace the logo or bump the package version to change those details without touching
the application shell.

## Contributing

1. Create or update the relevant YAML source under `radar-data/`.
2. Run `corepack pnpm content:build` and review the result locally.
3. Run the verification commands above.
4. Keep changes small and easy to review.

Bug reports and feature requests go through the issue forms. Pull requests from outside contributors
are not accepted; see [CONTRIBUTING.md](CONTRIBUTING.md). Content can describe internal architecture,
so check the repository visibility and deployment target before publishing new records.

## License

Apache-2.0. See [LICENSE](LICENSE).
