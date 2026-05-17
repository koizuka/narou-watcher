# Supply-Chain Hardening Checklist

A reusable checklist of supply-chain security measures, with notes on how this
repository (`narou-watcher`) currently satisfies each item. It can be copied to
other Go / TypeScript projects as a starting point.

Legend: `[x]` done · `[ ]` optional or not applicable.

## GitHub Actions

- [x] **Pin actions to full commit SHAs**, not tags or branches. A tag can be
  moved to point at malicious code; a 40-character SHA cannot. Keep a `# vX.Y.Z`
  comment next to each SHA for readability.
- [x] **Least-privilege `GITHUB_TOKEN`.** Every workflow declares a restrictive
  top-level `permissions:` block (`contents: read`, or `contents: write` only
  where a deploy needs it). Jobs that need more (for example, posting a PR
  comment) elevate with their own job-level block.
- [x] **Avoid `pull_request_target`.** It runs with a read/write token in the
  context of the base repo while checking out untrusted PR code. This repo uses
  only `pull_request`, `push`, and `workflow_dispatch`.
- [x] **Keep actions updated.** Dependabot watches the `github-actions`
  ecosystem so pinned SHAs receive update PRs.
- [ ] Consider a runner-hardening action (e.g. `step-security/harden-runner`) and
  OpenSSF Scorecard if the project's risk profile warrants it.

## npm / Node.js

- [x] **Commit the lockfile** (`narou-react/package-lock.json`) and never delete it.
- [x] **Use `npm ci`**, not `npm install`, in CI and build scripts. `npm ci`
  installs exactly what the lockfile specifies and fails on any drift.
- [x] **No lifecycle scripts** (`postinstall`, etc.) in `narou-react/package.json`
  that run arbitrary code on install.
- [x] **Single source of truth for the Node version.** `narou-react/.nvmrc` pins
  the version; `package.json` `engines.node` records the minimum; CI's
  `setup-node` reads `node-version-file: narou-react/.nvmrc`.
- [x] **Audit dependencies in CI.** The `npm-audit` job runs
  `npm audit --package-lock-only` on pull requests that touch the frontend
  (report-only) and posts a sticky comment when high/critical advisories are found.
- [x] **Dependabot with a cooldown.** A `cooldown` delay avoids pulling a brand-new
  (potentially compromised) release immediately after publication.

## Go

- [x] **Commit `go.sum`.** It records cryptographic checksums for every module;
  `go` verifies downloads against it.
- [x] **Scan with `govulncheck`.** The `go-vuln` CI job runs the official Go
  vulnerability scanner (report-only) and reports reachable vulnerabilities via a
  sticky PR comment. The `govulncheck` tool version is pinned.
- [x] **Keep modules updated.** Dependabot watches the `gomod` ecosystem.
- [ ] Optionally set `GOFLAGS=-mod=readonly` / `GONOSUMCHECK` policy if the build
  environment needs stricter controls.

## Repository configuration

These live in GitHub repository settings rather than in tracked files.

- [x] **`SECURITY.md`** documents private vulnerability reporting.
- [x] **`CODEOWNERS`** designates review responsibility.
- [x] **Branch protection on `main`.** The `CI Summary` status check must pass
  before merging (`strict` off; admins may bypass). Pull-request review is
  intentionally *not* required: this is a single-maintainer repository, so
  requiring approvals would block the maintainer's own and Dependabot PRs.
- [x] **Dependabot alerts and security updates** are enabled.
- [x] **Secret scanning and push protection** are enabled.
- [x] **GitHub Private Vulnerability Reporting** is enabled.

## Verifying locally

```sh
# npm
cd narou-react && npm audit --package-lock-only

# Go (requires network access to vuln.go.dev)
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

Both scans are **report-only** in CI: they surface findings without blocking
merges. Triage findings and let Dependabot deliver the fixes.
