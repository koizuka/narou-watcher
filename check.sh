#!/bin/sh

set -e
cd narou-react
npm ci
npm run test:ci
