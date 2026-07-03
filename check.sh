#!/bin/sh

set -e

# Go backend
go vet ./...
go test ./...
go build ./...

# React frontend
cd narou-react
npm ci
npm run lint
npm run test:ci
