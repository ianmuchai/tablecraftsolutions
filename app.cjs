const { spawn } = require("node:child_process");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const tsxPath = join(__dirname, "node_modules", "tsx", "dist", "cli.mjs");
const serverPath = join(__dirname, "backend", "server.ts");

if (!existsSync(tsxPath)) {
  console.error("Missing dependency: run npm install in cPanel before starting the app.");
  process.exit(1);
}

if (!existsSync(serverPath)) {
  console.error("Missing backend/server.ts. Confirm the full deployment package was uploaded.");
  process.exit(1);
}

const child = spawn(process.execPath, [tsxPath, serverPath], {
  cwd: __dirname,
  env: process.env,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`TableCraft server stopped with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
