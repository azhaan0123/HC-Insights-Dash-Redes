/**
 * Heroicons migration script.
 * 
 * Replaces all `from "lucide-react"` and `from 'lucide-react'` import paths
 * with the correct relative path to `src/app/lib/icons`.
 * 
 * Run with: node scripts/migrate-icons.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");

function walk(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results = results.concat(walk(fullPath));
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Compute the relative import path from `filePath` to `src/app/lib/icons`.
 * Returns e.g. `"../lib/icons"` or `"../../lib/icons"`.
 */
function relativeImport(filePath) {
  const iconsFile = path.join(ROOT, "src", "app", "lib", "icons");
  const fileDir = path.dirname(filePath);
  let rel = path.relative(fileDir, iconsFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

let totalChanged = 0;

for (const filePath of walk(SRC_DIR)) {
  const original = fs.readFileSync(filePath, "utf8");

  // Match both single and double-quoted imports from lucide-react
  // Handle multi-line imports too
  const pattern = /from\s+["']lucide-react["']/g;

  if (!pattern.test(original)) continue;

  const rel = relativeImport(filePath);
  const updated = original.replace(/from\s+["']lucide-react["']/g, `from "${rel}"`);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✔ ${path.relative(ROOT, filePath)} → ${rel}`);
    totalChanged++;
  }
}

console.log(`\n✅ Done. Updated ${totalChanged} files.`);
