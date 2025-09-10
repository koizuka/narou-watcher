# Repository Guidelines

## Project Structure & Module Organization

- Go backend (server/API): root `main.go`, packages under `narou/` (parsing/scraping with tests), and binaries under `cmd/` (`client/`, `standalone/`). Go tests live beside sources as `*_test.go`.
- React frontend: `narou-react/` with `src/components/`, `src/hooks/`, `src/reducer/`, `src/narouApi/`, app entry `src/index.tsx`, assets in `public/`. Config: `vite.config.ts`, `vitest.config.js`, `eslint.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands

- Backend (Go):
  - Build: `go build ./...`
  - Run (local): `go run . -open` or `go run ./cmd/standalone`
  - Test: `go test ./...`
- Frontend (React):
  - Setup: `cd narou-react && npm install`
  - Dev server: `npm start` (Vite at <http://localhost:5173>)
  - Build: `npm run build`
  - Lint: `npm run lint`
  - Test (watch/CI): `npm test` / `npm run test:ci`

## Coding Style & Naming Conventions

- Go: formatted with `gofmt`; package names lower-case; exported identifiers `PascalCase`, unexported `camelCase`.
- TypeScript/React: ESLint flat config is enforced (`eslint.config.mjs`) with React, Hooks, Testing Library, and Vitest rules. Use 2-space indent.
  - Components: `PascalCase` in `src/components/` (e.g., `NarouUpdates.tsx`).
  - Hooks: prefix with `use` in `src/hooks/` (e.g., `useHotKeys.tsx`).
  - Tests: name `*.test.tsx/ts` next to sources.

## Testing Guidelines

- Backend: add table-driven tests in `*_test.go`; run `go test ./narou -v` for package tests. Prefer `go-cmp` and quicktest-style assertions already used in repo.
- Frontend: use Vitest + Testing Library; respect ESLint async query rules. Example: `npm test`. Aim to cover API hooks and critical components.

## Commit & Pull Request Guidelines

- Commit style follows conventional prefixes seen in history: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `enhance`/`improve`.
- Use present tense, concise messages, and group related changes.
- PRs should include: clear description, linked issues, reproduction or steps to verify; screenshots for UI; API/flag changes documented in README.

## Security & Configuration Tips

- Do not commit secrets, cookies, or captured logs. Use `-debug` only locally; logs write under `log/narou/<session>`.
- Default server port is `7676`. Frontend connects to it or runs via reverse-proxy; document any new flags/endpoints in README.

## Agent-Specific Instructions

- Keep changes minimal and focused; avoid broad refactors.
- Preserve existing module layout and naming. If you change commands/flags, update README and tests in the same PR.
