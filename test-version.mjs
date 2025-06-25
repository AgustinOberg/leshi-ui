#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, ".");
const packageJsonPath = path.join(repoRoot, "package.json");

// Read version from package.json
let version = "1.0.0"; // fallback
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    version = packageJson.version;
    console.log("Version from package.json:", version);
  } catch (e) {
    console.log("Error reading package.json:", e.message);
  }
} else {
  console.log("package.json not found at:", packageJsonPath);
}