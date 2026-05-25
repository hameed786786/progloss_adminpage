import { copyFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const shellPath = resolve("dist/client/_shell.html");
const indexPath = resolve("dist/client/index.html");

if (!existsSync(shellPath)) {
  throw new Error(`Missing build artifact: ${shellPath}`);
}

copyFileSync(shellPath, indexPath);