# narou-watcher Project Guide

## Overview

narou-watcher is a web application for tracking novel updates on "小説家になろう" (Narou), a Japanese novel publishing platform. It consists of a Go backend server that proxies and parses Narou's website, and a React frontend for displaying updates.

## Architecture

### Backend (Go)

- **Location**: Root directory (`./`)
- **Main file**: `main.go`
- **Default port**: 7676
- **Purpose**: API server that handles authentication, session management, and HTML parsing from Narou

### Frontend (React + TypeScript)

- **Location**: `./narou-react/`
- **Build tool**: Vite
- **UI Framework**: Material-UI
- **Purpose**: SPA that displays novel updates, manages bookmarks, and provides user interface

### Core Library

- **Location**: `./narou/`
- **Purpose**: Contains parsers for various Narou pages and data models

## Key Commands

### Backend Development

```bash
go build                    # Build the server binary
./narou-watcher            # Run server on localhost:7676
./narou-watcher -open      # Run and open browser
./narou-watcher -debug     # Run with debug logging
./narou-watcher -testdata  # Run with test data (no login required)
```

**Test Data Mode:**

- Use `-testdata` flag to run without accessing the actual Narou website
- Returns predefined test data for all API endpoints
- No login required - useful for frontend development and testing
- Simulates various update times and time-based behavior (e.g., episodes appearing after 1 minute)
- Test data includes: 10 novels with different update times, 4 bookmark categories, episode details

### Frontend Development

```bash
cd narou-react
npm install                # Install dependencies
npm start                  # Start dev server on port 3000
npm run build             # Build for production
npm test                   # Run tests
```

**Development Server Configuration:**

- Vite listens on `0.0.0.0:3000` (accessible from network)
- API requests (`/narou/*`, `/r18/*`) are proxied to `localhost:7676`
- This allows mobile device testing without additional configuration

**Mobile Access:**

1. Start backend: `./narou-watcher`
2. Start frontend: `cd narou-react && npm start`
3. Access from mobile: `http://<PC_IP>:3000` (e.g., `http://192.168.0.60:3000`)

### Testing

```bash
# Backend tests
go test ./...

# Frontend tests (unit tests only)
cd narou-react
npm test

# Visual regression tests (local - macOS snapshots, not committed)
npm run test:visual

# Full check (runs from project root)
./check.sh
```

#### Visual Regression Testing

Visual regression tests use Vitest Browser Mode with Playwright to detect UI changes after MUI updates.

**Important**: Only Linux (CI) snapshots are committed to the repository. Local macOS/Windows snapshots are ignored.

**Workflow:**

1. **First PR (Initial Setup)**:
   - CI automatically generates Linux snapshots and commits them to your PR
   - After the auto-commit, CI re-runs and tests pass

2. **Normal Development with UI Changes**:
   - Push your changes to PR
   - CI detects visual differences but **doesn't fail**
   - Snapshots are **automatically updated and committed** to your PR branch
   - You get a PR comment: "✅ Visual snapshots automatically updated"
   - Diff images are uploaded as artifacts for review
   - Review the snapshot changes in the Files tab
   - Merge when ready

3. **Manual Update (if needed)**:
   - Go to Actions → "Update Visual Snapshots (Manual)"
   - Select branch and run
   - Useful for emergency fixes or branch-specific updates

4. **Local Testing** (optional):
   - `npm run test:visual` runs tests locally but generates macOS snapshots
   - These are gitignored and not used in CI

**Files:**
- Test files: `src/**/*.browser.test.tsx`
- Snapshots: `src/**/__screenshots__/**/*-linux.png` (committed)
- Snapshots: `src/**/__screenshots__/**/*-darwin.png` (gitignored)

## API Endpoints

### Authentication

- `POST /narou/login` - Login with credentials
- `GET /narou/logout` - Logout

### Novel Data

- `GET /narou/isnoticelist` - Get update notifications
- `GET /r18/isnoticelist` - Get R18 update notifications
- `GET /narou/bookmarks/` - List bookmark categories
- `GET /narou/bookmarks/:no` - Get specific bookmark (1-10)
- `GET /narou/novels/:ncode` - Get novel details
- `GET /narou/fav-user-updates` - Get favorite user updates

## Important Files

### Backend

- `main.go` - Server entry point and route definitions
- `narou/NarouWatcher.go` - Main watcher logic
- `narou/IsNoticeList.go` - Update notification parser
- `narou/FavNovelList.go` - Bookmark list parser
- `narou/NovelInfo.go` - Novel details parser
- `cmd/model/*.go` - Data models

### Frontend

- `src/components/App.tsx` - Main app component
- `src/components/NarouUpdates.tsx` - Updates display
- `src/hooks/useNarouApi.tsx` - API client
- `src/narouApi/NarouApi.ts` - API interface

## Development Notes

1. **Cookie Management**: The server prefixes Narou cookies with "narou-" to avoid conflicts
2. **Auto-refresh**: Frontend refreshes every 5 minutes and when tab becomes active
3. **Unread Badge**: Shows unread count in browser tab and app badge
4. **Keyboard Shortcuts**: Press Enter to open the oldest unread novel
5. **API Server Detection**: Frontend automatically detects API server based on protocol:
   - `http://` protocol: Uses current host (Vite proxy in development)
   - `https://` protocol: Uses same origin (production deployment)
   - Query parameter `?server=<URL>` overrides auto-detection

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

### Debugging

1. Use `-debug` flag to enable request/response logging
2. Logs are saved in `log/narou/` directory
3. Check browser console for frontend errors

## Dependencies

### Backend

- `github.com/PuerkitoBio/goquery` v1.10.3 - HTML parsing
- `github.com/koizuka/scraper` v0.0.46 - Web scraping framework
- `github.com/rs/cors` v1.11.1 - CORS middleware
- Standard library for HTTP server

### Frontend

- React 19.1.1
- Material-UI 7.1.0
- TypeScript 5.9.2
- Vite 7.1.7 - Build tool and dev server
- Vitest 3.2.4 - Testing framework
- SWR 2.3.6 - Data fetching and caching
- date-fns 4.1.0 - Date/time handling
- Emotion 11.14.x - CSS-in-JS for Material-UI
