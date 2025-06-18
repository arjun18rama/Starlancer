# Agent Tasks

The following tasks are available for any supporting agents working on this repository. These ideas are meant to be small, well-scoped improvements.

## 1. Testing & Continuous Integration
- Set up an automated test suite for the server using Jest or another framework.
- Configure a GitHub Actions workflow so tests run on every pull request.

## 2. Security Enhancements
- Expand the license-checking logic in `Masqr.js` to verify signed tokens.
- Add an environment variable to override the license server URL.

## 3. Documentation Improvements
- Update `README.md` with deployment instructions for Koyeb.
- Provide an `.env.example` file showcasing all configurable options.

## 4. Do-It Message Logging
- Create a small logging helper to capture every "do it" instruction in detail.
- The helper should append each message with a timestamp to `doit.log`.
- Example implementation:

```js
// logDoIt.js
import fs from "node:fs";

export function logDoIt(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync("doit.log", entry);
}
```

- Run this after completing each task so `doit.log` stays up to date.
