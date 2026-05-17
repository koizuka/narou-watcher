# Security Policy

## Reporting a Vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately through GitHub's
[Private Vulnerability Reporting](https://docs.github.com/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability):

1. Open the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Describe the issue, affected versions, and reproduction steps.

If private reporting is unavailable, email the maintainer at koizuka@gmail.com.

We aim to acknowledge reports within a few days. This is a volunteer-maintained
project, so please allow reasonable time for a fix before any public disclosure.

## Supported Versions

Only the latest commit on the default branch (`main`) is supported. Fixes are
delivered as new commits rather than backported to older versions.

## Threat Model

`narou-watcher` is a personal tool that tracks novel updates on "小説家になろう".
The Go server signs in to Narou on the user's behalf and holds the resulting
session cookies (stored with a `narou-` prefix). It is intended to run on
`localhost:7676` for personal use.

When exposed with `-public-url` behind a reverse proxy, authentication and
access control are expected to be enforced at the proxy layer. Exposing the
server directly to untrusted networks or the public internet without such
protection risks session hijacking and is strongly discouraged.

In-scope examples worth reporting:

- Mishandling of Narou credentials or session cookies in the Go server.
- Remote code execution or memory-safety issues in the Go server.
- Cross-site scripting or similar flaws in the React UI.
- Vulnerabilities in third-party dependencies that affect this project.
- Supply-chain weaknesses in the build or CI pipeline.

## Supply-Chain Hardening

For the project's supply-chain security measures and a reusable checklist, see
[`docs/supply-chain-hardening.md`](../docs/supply-chain-hardening.md).
