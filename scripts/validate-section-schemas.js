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

function extractSchema(content) {
  const match = content.match(
    /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/
  );
  return match ? match[1] : null;
}

function validateJson(jsonText) {
  try {
    JSON.parse(jsonText);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

function main() {
  const roots = [
    path.join(__dirname, "..", "shared", "sections"),
    path.join(__dirname, "..", "shared", "sections_optional"),
    path.join(__dirname, "..", "themes"),
  ];

  const results = [];

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const file of walk(root)) {
      const content = fs.readFileSync(file, "utf8");
      const schema = extractSchema(content);
      if (!schema) continue;
      const { ok, error } = validateJson(schema);
      if (!ok) {
        results.push({ file, error: error.message });
      }
    }
  }

  if (results.length === 0) {
    console.log("✓ All section schemas valid JSON");
    return;
  }

  console.log(`✗ Found ${results.length} invalid section schema(s):`);
  for (const r of results) {
    console.log(`- ${r.file}\n  Error: ${r.error}`);
  }
  process.exitCode = 1;
}

main();
