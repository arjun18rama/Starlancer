import fs from "node:fs";
import spdy from "spdy";
import path from "node:path";
import { createBareServer } from "@nebula-services/bare-server-node";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import compression from "compression";
import basicAuth from "express-basic-auth";
import rateLimit from "express-rate-limit";
import mime from "mime";
import fetch from "node-fetch";
// import { setupMasqr } from "./Masqr.js";
import config from "./config.js";

console.log(chalk.yellow("🚀 Starting server..."));

const __dirname = process.cwd();
const server = spdy.createServer({
  spdy: {
    plain: true,
    protocols: ["h2", "http/1.1"],
  },
});
const app = express();
const bareServer = createBareServer("/ca/");
const PORT = process.env.PORT || 8080;
const trustedOrigins = (process.env.TRUSTED_ORIGINS || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || trustedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
const cache = new Map();
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // Cache for 30 Days
const CACHE_MAX_ENTRIES = 100; // Maximum number of cached items
const BASE_URLS = {
  "/e/1/": "https://raw.githubusercontent.com/qrs/x/fixy/",
  "/e/2/": "https://raw.githubusercontent.com/3v1/V5-Assets/main/",
  "/e/3/": "https://raw.githubusercontent.com/3v1/V5-Retro/master/",
};

if (config.challenge !== false) {
  console.log(chalk.green("🔒 Password protection is enabled!"));
  if (process.env.LOG_CREDENTIALS === "true") {
    console.warn(
      chalk.yellow(
        "⚠️  LOG_CREDENTIALS is enabled. Usernames and passwords will be logged.",
      ),
    );
    // biome-ignore lint/complexity/noForEach:
    console.log(chalk.blue("User credentials are configured and in use."));
  }
  app.use(basicAuth({ users: config.users, challenge: true }));
}

app.get("/e/*", async (req, res, next) => {
  try {
    if (cache.has(req.path)) {
      const cached = cache.get(req.path);
      const { data, contentType, timestamp } = cached;
      if (Date.now() - timestamp > CACHE_TTL) {
        cache.delete(req.path);
      } else {
        cache.delete(req.path); // move to end to mark as recently used
        cache.set(req.path, cached);
        res.writeHead(200, { "Content-Type": contentType });
        return res.end(data);
      }
    }

    let reqTarget;
    for (const prefix in BASE_URLS) {
      const baseUrl = BASE_URLS[prefix];
      if (req.path.startsWith(prefix)) {
        reqTarget = baseUrl + req.path.slice(prefix.length);
        break;
      }
    }

    if (!reqTarget) {
      return next();
    }

    const asset = await fetch(reqTarget);
    if (!asset.ok) {
      return next();
    }

    const data = Buffer.from(await asset.arrayBuffer());
    const ext = path.extname(reqTarget);
    const no = [".unityweb"];
    const contentType = no.includes(ext)
      ? "application/octet-stream"
      : mime.getType(ext);

    if (cache.size >= CACHE_MAX_ENTRIES) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(req.path, { data, contentType, timestamp: Date.now() });
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    console.error("Error fetching asset:", error);
    res.setHeader("Content-Type", "text/html");
    res.status(500).send("Error fetching the asset");
  }
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* if (process.env.MASQR === "true") {
  console.log(chalk.green("Masqr is enabled"));
  setupMasqr(app);
} */

app.use(express.static(path.join(__dirname, "static")));
app.use("/ca", cors(corsOptions));

const routes = [
  { path: "/b", file: "apps.html" },
  { path: "/a", file: "games.html" },
  { path: "/play.html", file: "games.html" },
  { path: "/c", file: "settings.html" },
  { path: "/d", file: "tabs.html" },
  { path: "/", file: "index.html" },
];

// biome-ignore lint/complexity/noForEach:
routes.forEach(route => {
  app.get(route.path, (_req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "static", "404.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).sendFile(path.join(__dirname, "static", "404.html"));
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.on("listening", () => {
  console.log(chalk.green(`🌍 Server is running on http://localhost:${PORT}`));
});

server.listen({ port: PORT });
