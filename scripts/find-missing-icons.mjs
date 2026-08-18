/**
 * Finds all icon names imported from the icons module that are NOT
 * currently exported by icons.ts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const ICONS_FILE = path.join(ROOT, "src", "app", "lib", "icons.ts");

// Parse the icons.ts file to get all exports
const iconsContent = fs.readFileSync(ICONS_FILE, "utf8");
const exportedNames = new Set();

// Match export const NAME
for (const m of iconsContent.matchAll(/export\s+(?:const|type)\s+(\w+)/g)) {
  exportedNames.add(m[1]);
}
// Match export { NAME } and export { NAME as ALIAS }
for (const m of iconsContent.matchAll(/export\s*\{([^}]+)\}/g)) {
  for (const part of m[1].split(",")) {
    const asMatch = part.trim().match(/(?:\w+\s+as\s+)?(\w+)/);
    if (asMatch) exportedNames.add(asMatch[1]);
  }
}

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

const missingNames = new Set();

for (const filePath of walk(SRC_DIR)) {
  if (filePath === ICONS_FILE) continue;
  
  const content = fs.readFileSync(filePath, "utf8");
  
  // Find imports from icons module
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["'][^"']*\/icons["']/g;
  for (const match of content.matchAll(importRegex)) {
    const importBlock = match[1];
    for (const part of importBlock.split(",")) {
      let name = part.trim();
      // Handle "type X" imports
      name = name.replace(/^type\s+/, "");
      // Handle "X as Y" - we need the source name X
      const asMatch = name.match(/^(\w+)\s+as\s+/);
      if (asMatch) {
        name = asMatch[1];
      }
      // Strip whitespace
      name = name.trim();
      if (name && !exportedNames.has(name)) {
        missingNames.add(name);
      }
    }
  }
}

console.log("Missing exports from icons.ts:");
for (const name of [...missingNames].sort()) {
  console.log(`  - ${name}`);
}
console.log(`\nTotal missing: ${missingNames.size}`);
