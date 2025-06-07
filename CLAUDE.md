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
```

### Frontend Development

```bash
cd narou-react
npm install                # Install dependencies
npm start                  # Start dev server on port 3000
npm run build             # Build for production
npm test                   # Run tests
```

### Testing

```bash
# Backend tests
go test ./...

# Frontend tests
cd narou-react
npm test

# Full check (runs from project root)
./check.sh
```

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

- `github.com/PuerkitoBio/goquery` - HTML parsing
- `github.com/koizuka/scraper` - Web scraping framework
- Standard library for HTTP server

### Frontend

- React 19.1.0
- Material-UI 7.1.0
- SWR for data fetching
- Luxon for date handling
- TypeScript for type safety
