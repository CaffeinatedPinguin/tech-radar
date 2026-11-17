# Contributing

This project is developed and maintained by a single person. To keep it sustainable:

- **Bugs and feature requests:** open an issue using one of the forms. Include everything the form
  asks for. Reports that cannot be reproduced get the `needs-info` label and are closed after 14 days
  without a reply. Search existing issues first.
- **Pull requests from outside contributors are not accepted.** Only collaborators can open them. If
  you have a fix, describe it in the issue and the maintainer will implement it.
- **Security issues:** never public. See [SECURITY.md](SECURITY.md).

## Local development

Requires Node.js 22.22.2 or newer, pnpm 11 or newer and Docker for the container image. The
repository pins pnpm in `package.json`; Corepack keeps local and CI installs on the same version.

```bash
corepack pnpm install
corepack pnpm content:build
corepack pnpm dev
```

Common commands:

| Command | Description |
|---|---|
| `corepack pnpm dev` | Start the Vite development server |
| `corepack pnpm content:build` | Validate YAML and generate `content.json` |
| `corepack pnpm test` | Run the Vitest suite once |
| `corepack pnpm lint` | Check the repository with ESLint |
| `corepack pnpm lint:fix` | Apply safe ESLint fixes |
| `corepack pnpm typecheck` | Run TypeScript without emitting files |
| `corepack pnpm build` | Generate content and build the frontend |

Before a pull request, run the content build, tests, lint, typecheck and production build. CI runs
the same checks, then builds and smoke-tests the Docker image. `main` needs `ci-required` to be
green; Dependabot keeps GitHub Actions, npm dependencies and the Docker image current. Version tags
also run the release job.

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
