# narou-watcher Repository Guidelines

## Overview

narou-watcher is a web application for tracking novel updates on "小説家になろう" (Narou), a Japanese novel publishing platform. It consists of a Go backend server that proxies and parses Narou's website, and a React frontend for displaying updates.

## Project Structure & Module Organization

- **Go backend (server/API)**: root `main.go` (entry point and route definitions), parsing/scraping packages under `narou/` (tests live beside sources as `*_test.go`), data models in `cmd/model/`, and binaries under `cmd/` (`client/`, `standalone/`). Default port: 7676.
- **React frontend**: `narou-react/` with `src/components/`, `src/hooks/`, `src/reducer/`, `src/narouApi/`, app entry `src/index.tsx`, assets in `public/`. Config: `vite.config.ts`, `vitest.config.js`, `eslint.config.mts`, `tsconfig.json`. Build tool: Vite. UI framework: Material-UI.

### Important Files

- Backend: `main.go`, `narou/NarouWatcher.go` (main watcher logic), `narou/IsNoticeList.go` (update notification parser), `narou/FavNovelList.go` (bookmark list parser), `narou/NovelInfo.go` (novel details parser), `cmd/model/*.go` (data models)
- Frontend: `src/components/App.tsx` (main app), `src/components/NarouUpdates.tsx` (updates display), `src/hooks/useNarouApi.tsx` (API client hook), `src/narouApi/NarouApi.ts` (API interface)

## Build, Test, and Development Commands

### Backend (Go)

```bash
go build                    # Build the server binary
go test ./...               # Run tests
./narou-watcher             # Run server on localhost:7676
./narou-watcher -open       # Run and open browser
./narou-watcher -debug      # Run with debug logging
./narou-watcher -testdata   # Run with test data (no login required)
```

**Test Data Mode (`-testdata`):**

- Runs without accessing the actual Narou website; returns predefined test data for all API endpoints
- No login required — useful for frontend development and testing
- Simulates various update times and time-based behavior (e.g., episodes appearing after 1 minute)
- Test data includes: 10 novels with different update times, 4 bookmark categories, episode details

### Frontend (React)

```bash
cd narou-react
npm install                # Install dependencies
npm start                  # Start dev server on port 3000
npm run build              # Build for production
npm run lint               # Lint
npm test                   # Run tests (watch mode)
npm run test:ci            # Run tests once (CI mode)
```

**Development Server Configuration:**

- Vite listens on `0.0.0.0:3000` (accessible from network)
- API requests (`/narou/*`, `/r18/*`) are proxied to `localhost:7676`
- This allows mobile device testing without additional configuration

**Mobile Access:**

1. Start backend: `./narou-watcher`
2. Start frontend: `cd narou-react && npm start`
3. Access from mobile: `http://<PC_IP>:3000` (e.g., `http://192.168.0.60:3000`)

### Full Check

`./check.sh` (from project root) runs the full check: Go vet/test/build plus frontend lint and tests.

## Testing Guidelines

- Backend: add table-driven tests in `*_test.go`; run `go test ./narou -v` for package tests. Prefer `go-cmp` and quicktest-style assertions already used in repo.
- Frontend: use Vitest + Testing Library; respect ESLint async query rules. Aim to cover API hooks and critical components.

### Visual Regression Testing

Visual regression tests use Vitest Browser Mode with Playwright to detect UI changes after MUI updates.

**Important**: Only Linux (CI) snapshots are committed to the repository. Local macOS/Windows snapshots are gitignored.

**Workflow:**

1. **First PR (Initial Setup)**: CI automatically generates Linux snapshots and commits them to your PR; after the auto-commit, CI re-runs and tests pass.
2. **Normal Development with UI Changes**: Push your changes to PR. CI detects visual differences but **doesn't fail** — snapshots are **automatically updated and committed** to your PR branch, and you get a PR comment ("✅ Visual snapshots automatically updated"). Diff images are uploaded as artifacts. Review the snapshot changes in the Files tab and merge when ready.
3. **Manual Update (if needed)**: Actions → "Update Visual Snapshots (Manual)", select branch and run.
4. **Local Testing** (optional): `npm run test:visual` runs tests locally but generates macOS snapshots (gitignored, not used in CI).

**Files:**

- Test files: `src/**/*.browser.test.tsx`
- Snapshots: `src/**/__screenshots__/**/*-linux.png` (committed), `*-darwin.png` (gitignored)

## API Endpoints

Routes are defined in `main.go`. See README.md for full request/response specifications.

- `POST /narou/login` — Login with credentials
- `GET /narou/logout` — Logout
- `GET /narou/isnoticelist`, `GET /r18/isnoticelist` — Update notifications
- `GET /narou/bookmarks/`, `GET /r18/bookmarks/` — List bookmark categories
- `GET /narou/bookmarks/:no`, `GET /r18/bookmarks/:no` — Specific bookmark (1-10)
- `GET /narou/novels/:ncode`, `GET /r18/novels/:ncode` — Novel details
- `GET /narou/check-novel-access/:ncode/:episode`, `GET /r18/check-novel-access/:ncode/:episode` — Check episode accessibility (no login required)
- `GET /narou/fav-user-updates` — Favorite user updates
- `GET /narou/notification` — User-top notification presence/count

## Coding Style & Naming Conventions

- Go: formatted with `gofmt`; package names lower-case; exported identifiers `PascalCase`, unexported `camelCase`.
- TypeScript/React: ESLint flat config is enforced (`eslint.config.mts`) with React, Hooks, Testing Library, and Vitest rules. Use 2-space indent.
  - Components: `PascalCase` in `src/components/` (e.g., `NarouUpdates.tsx`).
  - Hooks: prefix with `use` in `src/hooks/` (e.g., `useHotKeys.tsx`).
  - Tests: name `*.test.tsx/ts` next to sources.

## Commit & Pull Request Guidelines

- Commit style follows conventional prefixes seen in history: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `enhance`/`improve`.
- Use present tense, concise messages, and group related changes.
- PRs should include: clear description, linked issues, reproduction or steps to verify; screenshots for UI; API/flag changes documented in README.

## Development Notes

1. **Cookie Management**: The server prefixes Narou cookies with `narou-` to avoid conflicts
2. **Auto-refresh**: Frontend refreshes every 5 minutes and when tab becomes active
3. **Unread Badge**: Shows unread count in browser tab and app badge
4. **Keyboard Shortcuts**: Press Enter to open the oldest unread novel
5. **API Server Detection** (`src/hooks/useNarouApi.tsx`): the frontend picks the API server in this order:
   1. Query parameter `?server=<URL>` overrides everything
   2. `http:` protocol → current host (Vite proxy in development)
   3. Otherwise, if not on `github.io` → same origin (production deployment)

## Deployment

### Local Development

1. Run backend: `./narou-watcher -open`
2. Frontend uses production build from GitHub Pages by default

### Production Server

```bash
./narou-watcher -public-url https://your-domain.com -port 7676
```

Then configure nginx/Apache to reverse proxy to localhost:7676

## Common Tasks

### Adding a New API Endpoint

1. Add parser in `narou/` directory
2. Add route handler in `main.go`
3. Add model in `cmd/model/`
4. Update frontend API client in `src/narouApi/NarouApi.ts`
5. Document the endpoint in README.md

### Debugging

1. Use `-debug` flag to enable request/response logging
2. Logs are saved in `log/narou/` directory
3. Check browser console for frontend errors

## Dependencies

Versions are managed by dependabot — always check `go.mod` and `narou-react/package.json` for current versions instead of documenting them here.

- Backend: `goquery` (HTML parsing), `koizuka/scraper` (web scraping framework), `rs/cors` (CORS middleware), standard library HTTP server
- Frontend: React, Material-UI (+ Emotion), TypeScript, Vite, Vitest, SWR, date-fns

## Security & Configuration Tips

- Do not commit secrets, cookies, or captured logs. Use `-debug` only locally; logs write under `log/narou/<session>`.
- Default server port is `7676`. Frontend connects to it or runs via reverse-proxy; document any new flags/endpoints in README.

## Agent-Specific Instructions

- Keep changes minimal and focused; avoid broad refactors.
- Preserve existing module layout and naming. If you change commands/flags, update README and tests in the same PR.
