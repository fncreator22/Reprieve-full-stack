#!/usr/bin/env node
/**
 * Reprieve CLI (Node.js distribution)
 * Zero-login autonomous circuit breaker for CI/CD and developer terminals.
 * Edition: Hackathon Production Release · October 15, 2026
 */

import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pythonCli = resolve(__dirname, "../scripts/cli.py");

const pythonBin = process.platform === "win32" ? "python" : "python3";
const args = [pythonCli, ...process.argv.slice(2)];

const child = spawn(pythonBin, args, { stdio: "inherit" });

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
