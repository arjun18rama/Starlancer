import fs from "node:fs";

export function logDoIt(message) {
  const entry = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync("AGENT_LOG.md", entry);
}

if (process.argv[2]) {
  logDoIt(process.argv.slice(2).join(" "));
}
