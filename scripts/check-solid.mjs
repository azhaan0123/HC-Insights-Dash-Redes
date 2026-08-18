import * as solid from "@heroicons/react/24/solid";
import fs from "fs";

const content = fs.readFileSync("src/app/lib/icons.ts", "utf8");
const match = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']@heroicons\/react\/24\/solid["']/);

if (!match) {
  console.log("Could not find import block");
  process.exit(1);
}

const rawList = match[1];
const items = rawList.split("\n").map(l => l.trim()).filter(Boolean);

const missing = [];
for (const item of items) {
  const clean = item.replace(/,/g, "").split(/\s+as\s+/)[0].trim();
  if (clean && !solid[clean]) {
    missing.push(clean);
  }
}

console.log("Missing icons in @heroicons/react/24/solid:", missing);
