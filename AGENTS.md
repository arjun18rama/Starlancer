# Agent Tasks

The following tasks are available for any supporting agents working on this repository. These ideas are meant to be small, well-scoped improvements.

## 1. Testing & Continuous Integration
- Set up an automated test suite for the server using Jest or another framework.
- Configure a GitHub Actions workflow so tests run on every pull request.
- Make sure `pnpm test` succeeds locally before opening a PR.
- Include status badges in `README.md` once CI is active.
- Run `pnpm run format` and `pnpm run lint` before pushing changes.

## 2. Security Enhancements
- Expand the license-checking logic in `Masqr.js` to verify signed tokens.
- Add an environment variable to override the license server URL.
- Perform input validation on all incoming requests to the proxy.

## 3. Documentation Improvements
- Update `README.md` with deployment instructions for Koyeb.
- Provide an `.env.example` file showcasing all configurable options.
- Document how to run the development server and test suite.

## 4. Do-It Message Logging
- Create a small logging helper to capture every "do it" instruction in detail.
- The helper should append each message with a timestamp to `AGENT_LOG.md`.
- Example implementation:

```js
// logDoIt.js
import fs from "node:fs";

export function logDoIt(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync("AGENT_LOG.md", entry);
}
```

- Run this after completing each task so `AGENT_LOG.md` stays up to date.
- Use UTC timestamps to keep logs consistent.
