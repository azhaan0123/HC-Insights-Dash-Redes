import fs from "fs";

const filePath = "src/app/lib/icons.ts";
let code = fs.readFileSync(filePath, "utf8");

// Remove wrapIcon helper
code = code.replace(/\/\*\* Helper function[\s\S]*?return Wrapped as unknown as HeroIcon;\n\}/m, "");
code = code.replace(/import React, \{ forwardRef \} from "react";\n/g, "");

// Unwrap export const X = wrapIcon(Y);
code = code.replace(/export\s+const\s+(\w+)\s*=\s*wrapIcon\((\w+)\);/g, (m, name, target) => {
  return `export const ${name.padEnd(16)} = ${target};`;
});

fs.writeFileSync(filePath, code, "utf8");
console.log("Successfully unwrapped all icons in icons.ts");
