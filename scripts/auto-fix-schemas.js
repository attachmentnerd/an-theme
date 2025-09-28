import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".liquid")) {
      yield full;
    }
  }
}

function extractSchemaBounds(content) {
  const start = content.indexOf("{% schema %}");
  const end = content.indexOf("{% endschema %}");
  if (start === -1 || end === -1) return null;
  const schemaStart = start + "{% schema %}".length;
  const schema = content.slice(schemaStart, end);
  return { start: schemaStart, end, schema };
}

function tryParse(jsonText) {
  try {
    JSON.parse(jsonText);
    return true;
  } catch (_) {
    return false;
  }
}

function fixSchema(schema) {
  let fixed = schema;

  // 1) Collapse duplicated object openers after array open, e.g., "elements": [ { { ... }
  fixed = fixed.replace(/\[(\s*){(\s*){(\s*)/g, "[$1{$2");

  // 2) Ensure header elements are wrapped in an object when they appear bare after a comma
  fixed = fixed.replace(
    /\},(\s*)\n(\s*)"type"\s*:\s*"header"/g,
    '},$1\n$2{\n$2  "type": "header"'
  );

  // 3) Insert missing commas between adjacent objects within arrays: "}\n  {" -> "},\n  {"
  fixed = fixed.replace(/}\s*\n(\s*)\{/g, "},\n$1{");

  // 4) Wrap bare element objects starting with "type": after a closing element
  fixed = fixed.replace(/}\s*\n(\s*)"type"\s*:/g, '},\n$1{\n$1  "type":');

  // 5) Wrap first element in array if it starts bare with "type":
  fixed = fixed.replace(/\[\s*\n(\s*)"type"\s*:/g, '[\n$1{\n$1  "type":');

  // 6) Insert missing opening brace when a comma starts a new element with bare "type":
  fixed = fixed.replace(/,\s*\n(\s*)"type"\s*:/g, ',\n$1{\n$1  "type":');

  // Return both fixed and whether it parses
  return { fixed, ok: tryParse(fixed) };
}

function main() {
  const roots = [
    path.join(__dirname, "..", "shared", "sections"),
    path.join(__dirname, "..", "shared", "sections_optional"),
  ];
  let changed = 0;
  let stillInvalid = [];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      const content = fs.readFileSync(file, "utf8");
      const bounds = extractSchemaBounds(content);
      if (!bounds) continue;
      const original = bounds.schema;
      const { fixed, ok } = fixSchema(original);
      if (fixed !== original) {
        const updated =
          content.slice(0, bounds.start) + fixed + content.slice(bounds.end);
        fs.writeFileSync(file, updated);
        changed++;
      }
      if (!ok) {
        stillInvalid.push(file);
      }
    }
  }

  console.log(`Auto-fix complete. Files updated: ${changed}`);
  if (stillInvalid.length) {
    console.log(`Remaining invalid schemas: ${stillInvalid.length}`);
    stillInvalid.slice(0, 50).forEach((f) => console.log("- " + f));
    process.exitCode = 1;
  }
}

main();
