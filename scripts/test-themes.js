import { spawnSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_FILES = {
  all: [
    "config/settings_schema.json",
    "config/settings_data.json",
    "assets/styles.scss.liquid",
  ],
  website: [
    "layouts/theme.liquid",
    "templates/index.liquid",
    "templates/404.liquid",
    "templates/about.liquid",
    "templates/blog.liquid",
    "templates/blog_post.liquid",
    "templates/categories.liquid",
    "templates/category.liquid",
    "templates/contact.liquid",
    "templates/library.liquid",
    "templates/page.liquid",
    "templates/post.liquid",
  ],
  landing: ["templates/index.liquid"],
  product: [
    "layouts/theme.liquid",
    "templates/sales_page.liquid",
    "templates/thank_you.liquid",
  ],
  email: ["templates/email.liquid"],
};

function testTheme(type) {
  console.log(`\nTesting ${type} theme...`);
  const themePath = path.join(__dirname, "..", "themes", type);

  if (!fs.existsSync(themePath)) {
    console.error(`✗ Theme directory not found: ${themePath}`);
    return false;
  }

  let passed = true;

  // Check common required files
  for (const file of REQUIRED_FILES.all) {
    const filePath = path.join(themePath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`✗ Missing required file: ${file}`);
      passed = false;
    } else {
      console.log(`✓ Found ${file}`);
    }
  }

  // Check type-specific files
  if (REQUIRED_FILES[type]) {
    for (const file of REQUIRED_FILES[type]) {
      const filePath = path.join(themePath, file);
      if (!fs.existsSync(filePath)) {
        console.error(`✗ Missing required file: ${file}`);
        passed = false;
      } else {
        console.log(`✓ Found ${file}`);
      }
    }
  }

  // Check settings_validatable
  const schemaPath = path.join(themePath, "config", "settings_schema.json");
  if (fs.existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      const themeInfo = schema.find((s) => s.name === "theme_info");
      if (!themeInfo || themeInfo.settings_validatable !== true) {
        console.error("✗ Missing settings_validatable: true in theme_info");
        passed = false;
      } else {
        console.log("✓ settings_validatable: true");
      }

      // Ensure theme_info is the first object
      if (
        !Array.isArray(schema) ||
        schema.length === 0 ||
        schema[0].name !== "theme_info"
      ) {
        console.error(
          "✗ theme_info must be the first object in settings_schema.json"
        );
        passed = false;
      } else {
        console.log("✓ theme_info is first");
      }
    } catch (e) {
      console.error("✗ Invalid settings_schema.json:", e.message);
      passed = false;
    }
  }

  // Check for forbidden syntax
  const checkForbiddenSyntax = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      // Flag backup directories or files regardless of extension
      if (
        file.toLowerCase().endsWith(".backup") ||
        file.toLowerCase().endsWith(".bak")
      ) {
        console.error(`✗ Found backup artifact in theme: ${filePath}`);
        passed = false;
        continue;
      }

      if (stat.isDirectory() && !file.startsWith("_")) {
        checkForbiddenSyntax(filePath);
      } else if (file.endsWith(".liquid")) {
        const content = fs.readFileSync(filePath, "utf8");
        if (content.includes("{% render ")) {
          const ignoreProductRender =
            type === "product" &&
            (String(process.env.IGNORE_PRODUCT_RENDER || "").toLowerCase() ===
              "true" ||
              String(process.env.IGNORE_PRODUCT_RENDER || "") === "1");
          if (!ignoreProductRender) {
            console.error(
              `✗ Found {% render %} in ${filePath} - use {% include %} instead`
            );
            passed = false;
          }
        }
      }
    }
  };

  checkForbiddenSyntax(themePath);

  return passed;
}

// Test all themes (allow override via TEST_THEMES=website,landing)
const types = (
  process.env.TEST_THEMES
    ? process.env.TEST_THEMES.split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : ["website", "landing", "product"]
).filter((t) => ["website", "landing", "product"].includes(t));
let allPassed = true;

for (const type of types) {
  if (!testTheme(type)) {
    allPassed = false;
  }
}

if (allPassed) {
  // Also validate section schemas JSON
  const validatorPath = path.join(__dirname, "validate-section-schemas.js");
  if (fs.existsSync(validatorPath)) {
    const res = spawnSync(process.execPath, [validatorPath], {
      stdio: "inherit",
    });
    if (res.status !== 0) {
      allPassed = false;
    }
  }
}

if (allPassed) {
  console.log("\n✓ All themes passed validation!");
} else {
  console.error("\n✗ Some themes failed validation");
  process.exit(1);
}
