import archiver from "archiver";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const THEME_TYPES = [
  "website",
  "landing",
  "product",
  "product-premier",
  "product-premier-raw",
  "checkout",
];
const VERSION_FILE = path.join(__dirname, "..", "versions.json");

// Load or initialize versions
function loadVersions() {
  if (fs.existsSync(VERSION_FILE)) {
    return JSON.parse(fs.readFileSync(VERSION_FILE, "utf8"));
  }
  // Initialize with version 10.x.x to avoid Kajabi conflicts
  return {
    website: "10.0.0",
    landing: "10.0.0",
    product: "10.0.0",
    "product-premier": "10.0.0",
    "product-premier-raw": "10.0.0",
    checkout: "10.0.0",
    email: "10.0.0",
  };
}

// Save versions
function saveVersions(versions) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2));
}

// Return a short build suffix that is stable per run
function getBuildSuffix() {
  try {
    const hash = execSync("git rev-parse --short HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (hash) return hash;
  } catch (_) {
    // ignore if not a git repo
  }
  // Fallback: 3-digit counter based on time-of-day seconds
  const now = new Date();
  const seconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return String(seconds % 1000).padStart(3, "0");
}

// Format current date as YYYY.MM.DD
function getDateStamp() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

// Map type to canonical theme_name and prefix for display version
function getTypeMeta(type) {
  switch (type) {
    case "website":
      return { themeName: "AN Website Theme", prefix: "AN-WEB" };
    case "landing":
      return { themeName: "AN Landing Theme", prefix: "AN-LP" };
    case "product":
      return { themeName: "AN Product Theme", prefix: "AN-PROD" };
    case "product-premier":
      return { themeName: "AN Product Premier", prefix: "AN-PREM" };
    case "product-premier-raw":
      return { themeName: "AN Product Premier Raw", prefix: "AN-PREM-RAW" };
    case "checkout":
      return { themeName: "AN Checkout Theme", prefix: "AN-CHK" };
    default:
      return {
        themeName: `AN ${type[0].toUpperCase()}${type.slice(1)} Theme`,
        prefix: `AN-${type.toUpperCase()}`,
      };
  }
}

// Build human-facing Kajabi-safe display version string per type
function buildDisplayVersion(type, dateStamp, suffix) {
  const { prefix } = getTypeMeta(type);
  return `${prefix} ${dateStamp}+${suffix}`;
}

// Build theme
async function buildTheme(type) {
  const sourceDir = path.join(__dirname, "..", "themes", type);
  const buildDir = path.join(__dirname, "..", "build", type);
  const sharedDir = path.join(__dirname, "..", "shared");
  const includeOptionalSections =
    String(process.env.INCLUDE_OPTIONAL_SECTIONS || "").toLowerCase() ===
      "true" || String(process.env.INCLUDE_OPTIONAL_SECTIONS || "") === "1";

  console.log(`Building ${type} theme...`);

  // Clean build directory
  await fs.remove(buildDir);
  await fs.ensureDir(buildDir);

  // File include filter (exclude drafts, styles folder, backups and OS cruft)
  const shouldInclude = (src) => {
    const lower = src.toLowerCase();
    const base = path.basename(lower);
    if (lower.includes("/_")) return false; // underscored drafts
    if (lower.includes("/styles/")) return false; // styles handled separately
    if (base.endsWith(".backup") || base.endsWith(".bak")) return false;
    if (base.endsWith("~") || base.endsWith(".tmp") || base === ".ds_store")
      return false;
    // Exclude long full-page optional sections by default (can be included via flag)
    if (lower.includes("/shared/sections/")) {
      const isOptional =
        base.startsWith("page_") ||
        base.startsWith("page-") ||
        base.startsWith("speaking-page");
      if (isOptional && !includeOptionalSections) return false;
    }
    return true;
  };

  // Copy theme files
  await fs.copy(sourceDir, buildDir, { filter: shouldInclude });

  // Self-contained themes: skip shared components
  if (
    type === "checkout" ||
    type === "product-premier-raw" ||
    type === "product-premier"
  ) {
    console.log(`${type} theme - skipping shared components`);
  } else {
    // Copy shared components for other themes
    // IMPORTANT: overwrite: false means theme-specific files take precedence

    // Check if theme wants to use shared components (default: true for backward compatibility)
    const useSharedComponents = process.env.USE_SHARED !== 'false';

    if (useSharedComponents) {
      if (fs.existsSync(path.join(sharedDir, "snippets"))) {
        const sharedSnippets = await fs.readdir(path.join(sharedDir, "snippets"));
        console.log(`Copying ${sharedSnippets.length} shared snippets (won't overwrite theme-specific)`);
        await fs.copy(
          path.join(sharedDir, "snippets"),
          path.join(buildDir, "snippets"),
          { overwrite: false, filter: shouldInclude }
        );
      }

      // Copy shared sections
      if (fs.existsSync(path.join(sharedDir, "sections"))) {
        const sharedSections = await fs.readdir(path.join(sharedDir, "sections"));
        console.log(`Copying ${sharedSections.length} shared sections (won't overwrite theme-specific)`);
        await fs.copy(
          path.join(sharedDir, "sections"),
          path.join(buildDir, "sections"),
          { overwrite: false, filter: shouldInclude }
        );
      }
    } else {
      console.log('Skipping shared components (USE_SHARED=false)');
    }

    // Optionally copy optional sections directory if present and enabled
    const optionalSectionsDir = path.join(sharedDir, "sections_optional");
    if (includeOptionalSections && fs.existsSync(optionalSectionsDir)) {
      await fs.copy(optionalSectionsDir, path.join(buildDir, "sections"), {
        overwrite: false,
        filter: shouldInclude,
      });
    }

    // Copy styles.scss.liquid directly (don't compile - it has Liquid tags)
    const sassPath = path.join(sourceDir, "assets", "styles.scss.liquid");
    if (fs.existsSync(sassPath)) {
      await fs.ensureDir(path.join(buildDir, "assets"));
      await fs.copy(
        sassPath,
        path.join(buildDir, "assets", "styles.scss.liquid")
      );
    }

    // Copy shared scripts
    if (fs.existsSync(path.join(sharedDir, "scripts"))) {
      const scripts = await fs.readdir(path.join(sharedDir, "scripts"));
      for (const script of scripts) {
        if (script.endsWith(".js")) {
          await fs.copy(
            path.join(sharedDir, "scripts", script),
            path.join(buildDir, "assets", script)
          );
        }
      }
    }

    // Copy shared styles
    if (useSharedComponents && fs.existsSync(path.join(sharedDir, "styles"))) {
      const styles = await fs.readdir(path.join(sharedDir, "styles"));
      for (const style of styles) {
        // Skip _tokens.css and README files - tokens are inlined into overrides.css
        if (style === "_tokens.css" || style.endsWith(".md")) continue;

        if (style.endsWith(".css") || style.endsWith(".scss")) {
          // For CSS files, we need to handle merging
          if (style === "overrides.css") {
            // Special-case: for product-premier, defer to the theme's SCSS compiler
            // Do not generate overrides.css so Kajabi compiles assets/overrides.scss -> overrides.css
            if (type === "product-premier") {
              continue;
            }
            // Read shared CSS
            let sharedCSS = await fs.readFile(
              path.join(sharedDir, "styles", style),
              "utf8"
            );

            // Handle @import of _tokens.css by inlining it (support both single and double quotes)
            const importRegex = /@import\s+url\(['"]_tokens\.css['"]\);/g;
            if (importRegex.test(sharedCSS)) {
              const tokensPath = path.join(sharedDir, "styles", "_tokens.css");
              if (fs.existsSync(tokensPath)) {
                const tokensCSS = await fs.readFile(tokensPath, "utf8");
                // Replace the @import with the actual tokens CSS content
                sharedCSS = sharedCSS.replace(
                  importRegex,
                  `/* Inlined from _tokens.css */\n${tokensCSS}\n/* End of _tokens.css */`
                );
              }
            }

            // Check if theme has its own overrides.css with theme-specific styles
            const themeOverridesPath = path.join(sourceDir, "assets", style);
            let themeSpecificCSS = "";

            if (fs.existsSync(themeOverridesPath)) {
              const themeCSS = await fs.readFile(themeOverridesPath, "utf8");
              // Extract everything after the header comment if it contains theme-specific styles
              const parts = themeCSS.split(
                "Theme-specific styles (if any) can be added below."
              );
              if (parts.length > 1 && parts[1].trim()) {
                // Use the content after the header comment
                themeSpecificCSS = parts[1];
              } else if (
                themeCSS.trim() &&
                !themeCSS.includes("This file is intentionally empty")
              ) {
                // Use the whole file if no header comment
                themeSpecificCSS = "\n\n" + themeCSS;
              }
            }

            // Write combined CSS
            await fs.writeFile(
              path.join(buildDir, "assets", style),
              sharedCSS + themeSpecificCSS
            );
          } else {
            // For other files, just copy
            await fs.copy(
              path.join(sharedDir, "styles", style),
              path.join(buildDir, "assets", style)
            );
          }
        }
      }
    }
  }

  // Preserve layouts for all themes so head/scripts are included
  // (Previously, landing/email layouts were removed, which broke CSS/script includes)

  console.log(`✓ Built ${type} theme`);
}

// Get all files in a directory recursively
async function getAllFiles(dir, fileList = [], baseDir = dir) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList, baseDir);
    } else {
      // Get relative path from base directory
      const relativePath = path.relative(baseDir, filePath);
      fileList.push(relativePath);
    }
  }

  return fileList;
}

// Compare two theme builds and generate change report
async function generateChangeReport(type, previousVersion, currentVersion) {
  const previousExportPath = path.join(
    __dirname,
    "..",
    "exports",
    "releases",
    `v${previousVersion}`
  );
  const currentBuildPath = path.join(__dirname, "..", "build", type);

  const report = {
    version: {
      previous: previousVersion,
      current: currentVersion,
    },
    added: [],
    modified: [],
    removed: [],
    timestamp: new Date().toISOString(),
  };

  // Get current files
  const currentFiles = await getAllFiles(currentBuildPath);

  // Check if previous version exists
  const previousZips =
    previousVersion && fs.existsSync(previousExportPath)
      ? await fs.readdir(previousExportPath)
      : [];

  const previousZip = previousZips.find((f) => f.endsWith(".zip"));

  if (previousZip) {
    // Extract previous version temporarily
    const tempDir = path.join(
      __dirname,
      "..",
      "temp",
      `${type}-${previousVersion}`
    );
    await fs.ensureDir(tempDir);

    try {
      // Extract zip
      const AdmZip = (await import("adm-zip")).default;
      const zip = new AdmZip(path.join(previousExportPath, previousZip));
      zip.extractAllTo(tempDir, true);

      // Find the theme subdirectory
      const dirs = await fs.readdir(tempDir);
      const themeDir = dirs.find((d) => d.includes("AN_") || d.includes("AN-"));
      const previousBuildPath = themeDir
        ? path.join(tempDir, themeDir)
        : tempDir;

      // Get previous files
      const previousFiles = await getAllFiles(previousBuildPath);

      // Compare files
      const previousSet = new Set(previousFiles);
      const currentSet = new Set(currentFiles);

      // Find added files
      for (const file of currentFiles) {
        if (!previousSet.has(file)) {
          report.added.push(file);
        }
      }

      // Find removed files
      for (const file of previousFiles) {
        if (!currentSet.has(file)) {
          report.removed.push(file);
        }
      }

      // Find modified files
      for (const file of currentFiles) {
        if (previousSet.has(file)) {
          const currentPath = path.join(currentBuildPath, file);
          const previousPath = path.join(previousBuildPath, file);

          if (fs.existsSync(previousPath)) {
            const currentContent = await fs.readFile(currentPath, "utf8");
            const previousContent = await fs.readFile(previousPath, "utf8");

            if (currentContent !== previousContent) {
              report.modified.push(file);
            }
          }
        }
      }

      // Clean up temp directory
      await fs.remove(tempDir);
    } catch (error) {
      console.error("Error comparing versions:", error);
      // Clean up on error
      if (fs.existsSync(tempDir)) {
        await fs.remove(tempDir);
      }
    }
  } else {
    // No previous version, all files are new
    report.added = currentFiles;
  }

  return report;
}

// Generate version starting from 10.x.x to avoid Kajabi internal version conflicts
function generateKajabiSafeVersion(type, major, minor, patch) {
  // Start from version 10 to avoid all Kajabi reserved versions
  // Kajabi uses versions up to 7.x.x, so 10+ should be safe
  return `${major}.${minor}.${patch}`;
}

// Sync website and landing page versions to be the same
function syncWebsiteAndLandingVersions(versions, updatedType, newVersion) {
  if (updatedType === "website" || updatedType === "landing") {
    // Set both website and landing to the same version
    versions.website = newVersion;
    versions.landing = newVersion;
    console.log(`✓ Synced website and landing versions to ${newVersion}`);
  }
  return versions;
}

// Export theme
async function exportTheme(type, versionBump, message) {
  let versions = loadVersions();
  // For website/landing, always base on the higher of the two to avoid drift
  let currentVersion = versions[type] || "10.0.0";
  if (type === "website" || type === "landing") {
    const w = versions.website.split(".").map(Number);
    const l = versions.landing.split(".").map(Number);
    const wVal = w[0] * 1_000_000 + w[1] * 1_000 + w[2];
    const lVal = l[0] * 1_000_000 + l[1] * 1_000 + l[2];
    currentVersion = wVal >= lVal ? versions.website : versions.landing;
  }

  // Parse version - always numeric format now
  let [major, minor, patch] = currentVersion.split(".").map(Number);

  // Ensure we start from version 10 minimum
  if (major < 10) {
    major = 10;
    minor = 0;
    patch = 0;
  }

  // Calculate new version numbers
  switch (versionBump) {
    case "major":
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case "minor":
      minor += 1;
      patch = 0;
      break;
    case "none":
      // Do not change version numbers; use current version as-is
      break;
    case "patch":
    default:
      patch += 1;
  }

  // Generate Kajabi-safe version with text prefix
  const newVersion = generateKajabiSafeVersion(type, major, minor, patch); // numeric for internal tracking

  // Build one shared stamp for this export run
  const dateStamp = getDateStamp();
  // Use the numeric version as the suffix to guarantee uniqueness per export
  const displayVersionFor = (t) =>
    buildDisplayVersion(t, dateStamp, newVersion);

  // Update version in settings_schema.json BEFORE building
  const schemaPath = path.join(
    __dirname,
    "..",
    "themes",
    type,
    "config",
    "settings_schema.json"
  );
  let themeName = `AN-${type}`;

  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
    const themeInfo = schema.find((s) => s.name === "theme_info");
    if (themeInfo) {
      // Enforce canonical theme_name per type and stamped display version
      const { themeName: canonicalName } = getTypeMeta(type);
      const cleanThemeInfo = {
        name: "theme_info",
        theme_name: canonicalName,
        theme_version: displayVersionFor(type),
        theme_author: themeInfo.theme_author || "AN Themes",
        theme_documentation_url:
          themeInfo.theme_documentation_url || "https://anthemes.com/docs",
        theme_support_url:
          themeInfo.theme_support_url || "https://anthemes.com/support",
        settings_validatable: true,
      };

      // Replace the theme_info object with clean version and ensure it's first
      const themeInfoIndex = schema.findIndex((s) => s.name === "theme_info");
      schema[themeInfoIndex] = cleanThemeInfo;
      if (themeInfoIndex !== 0) {
        schema.splice(themeInfoIndex, 1);
        schema.unshift(cleanThemeInfo);
      }

      if (cleanThemeInfo.theme_name) {
        themeName = cleanThemeInfo.theme_name.replace(/\s+/g, "_");
      }

      // Write updated schema back to file
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    }
  }

  // If this is website or landing theme, also update the other theme's settings file
  if (type === "website" || type === "landing") {
    const otherType = type === "website" ? "landing" : "website";
    const otherSchemaPath = path.join(
      __dirname,
      "..",
      "themes",
      otherType,
      "config",
      "settings_schema.json"
    );

    if (fs.existsSync(otherSchemaPath)) {
      try {
        const otherSchema = JSON.parse(
          fs.readFileSync(otherSchemaPath, "utf8")
        );
        const otherThemeInfo = otherSchema.find((s) => s.name === "theme_info");

        if (otherThemeInfo) {
          // Update the other theme's display version using same stamp, and enforce canonical name
          const { themeName: otherCanonical } = getTypeMeta(otherType);
          otherThemeInfo.theme_name = otherCanonical;
          otherThemeInfo.theme_version = displayVersionFor(otherType);
          otherThemeInfo.settings_validatable = true;

          // Ensure theme_info is first
          const idx = otherSchema.findIndex((s) => s.name === "theme_info");
          if (idx !== 0) {
            otherSchema.splice(idx, 1);
            otherSchema.unshift(otherThemeInfo);
          }

          // Write updated schema back to file
          fs.writeFileSync(
            otherSchemaPath,
            JSON.stringify(otherSchema, null, 2)
          );
          console.log(
            `✓ Updated ${otherType} theme settings to version ${otherThemeInfo.theme_version}`
          );
        }
      } catch (error) {
        console.warn(
          `⚠️  Could not update ${otherType} theme settings:`,
          error.message
        );
      }
    }
  }

  // Build theme after updating version
  await buildTheme(type);

  // Create export directory
  const exportDir = path.join(
    __dirname,
    "..",
    "exports",
    "releases",
    `v${newVersion}`
  );
  await fs.ensureDir(exportDir);

  // Create ZIP with proper structure
  // Use underscores in filename but keep version format as-is
  const safeVersion = newVersion.replace(/[^a-zA-Z0-9.-]/g, "_");
  const zipPath = path.join(exportDir, `${themeName}_${safeVersion}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.pipe(output);

  const buildDir = path.join(__dirname, "..", "build", type);

  // All themes need files inside a named folder (verified with v33.16.1)
  const folderName = themeName.replace(/ /g, "_");
  archive.directory(buildDir, folderName);

  await archive.finalize();

  // Wait for stream to finish
  await new Promise((resolve) => output.on("close", resolve));

  // Remove macOS extended attributes
  try {
    execSync(`xattr -cr "${zipPath}"`, { stdio: "inherit" });
  } catch (e) {
    // xattr might not be available on all systems
  }

  // Update version and sync website/landing if needed
  versions[type] = newVersion;
  versions = syncWebsiteAndLandingVersions(versions, type, newVersion);
  saveVersions(versions);

  // Create version log
  const logPath = path.join(exportDir, "version-log.txt");
  const logContent = `Theme: ${themeName}
Type: ${type}
Version: ${newVersion}
Date: ${new Date().toISOString()}
Message: ${message || "No message provided"}
File: ${path.basename(zipPath)}
`;
  await fs.writeFile(logPath, logContent);

  // Generate change report
  console.log("Generating change report...");
  const changeReport = await generateChangeReport(
    type,
    currentVersion,
    newVersion
  );

  // Save change report as JSON
  const changeReportPath = path.join(exportDir, "change-report.json");
  await fs.writeFile(changeReportPath, JSON.stringify(changeReport, null, 2));

  // Save human-readable change report
  const readableReportPath = path.join(exportDir, "CHANGES.md");
  let readableReport = `# Theme Changes Report\n\n`;
  readableReport += `**Theme:** ${themeName}\n`;
  readableReport += `**Version:** ${currentVersion} → ${newVersion}\n`;
  readableReport += `**Date:** ${new Date().toLocaleString()}\n`;
  readableReport += `**Message:** ${message || "No message provided"}\n\n`;

  readableReport += `## Summary\n`;
  readableReport += `- **Added:** ${changeReport.added.length} files\n`;
  readableReport += `- **Modified:** ${changeReport.modified.length} files\n`;
  readableReport += `- **Removed:** ${changeReport.removed.length} files\n\n`;

  if (changeReport.added.length > 0) {
    readableReport += `## Added Files\n`;
    changeReport.added.forEach((file) => {
      readableReport += `- ${file}\n`;
    });
    readableReport += `\n`;
  }

  if (changeReport.modified.length > 0) {
    readableReport += `## Modified Files\n`;
    changeReport.modified.forEach((file) => {
      readableReport += `- ${file}\n`;
    });
    readableReport += `\n`;
  }

  if (changeReport.removed.length > 0) {
    readableReport += `## ⚠️ Removed Files (Manual Action Required)\n`;
    readableReport += `**Important:** Kajabi does not automatically remove files when updating themes.\n`;
    readableReport += `You must manually delete these files from your Kajabi theme:\n\n`;
    changeReport.removed.forEach((file) => {
      readableReport += `- [ ] ${file}\n`;
    });
    readableReport += `\n`;
    readableReport += `### How to remove files in Kajabi:\n`;
    readableReport += `1. Go to Website → Themes → Edit Code\n`;
    readableReport += `2. Find each file listed above\n`;
    readableReport += `3. Click the trash icon next to the file name\n`;
    readableReport += `4. Confirm deletion\n`;
  }

  await fs.writeFile(readableReportPath, readableReport);

  console.log(`✓ Exported ${themeName} v${newVersion} to ${zipPath}`);
  console.log(`✓ Change report saved to ${readableReportPath}`);

  // Also display removed files in console if any
  if (changeReport.removed.length > 0) {
    console.log("\n⚠️  FILES TO MANUALLY REMOVE IN KAJABI:");
    changeReport.removed.forEach((file) => {
      console.log(`   - ${file}`);
    });
    console.log("\n");
  }

  return zipPath;
}

// CLI commands
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "build":
    if (!args[0] || !THEME_TYPES.includes(args[0])) {
      console.error("Usage: npm run theme:build <type>");
      console.error(`Types: ${THEME_TYPES.join(", ")}`);
      process.exit(1);
    }
    buildTheme(args[0]);
    break;

  case "export":
    if (!args[0] || !THEME_TYPES.includes(args[0])) {
      console.error(
        "Usage: npm run theme:export <type> [patch|minor|major] [message]"
      );
      console.error(`Types: ${THEME_TYPES.join(", ")}`);
      process.exit(1);
    }
    exportTheme(args[0], args[1] || "patch", args.slice(2).join(" "));
    break;

  case "version":
    const versions = loadVersions();
    if (args[0] && args[1]) {
      // Set version
      if (THEME_TYPES.includes(args[0])) {
        versions[args[0]] = args[1];
        // Sync website and landing if setting one of them
        versions = syncWebsiteAndLandingVersions(versions, args[0], args[1]);
        saveVersions(versions);
        console.log(`✓ Set ${args[0]} version to ${args[1]}`);
      }
    } else {
      // Show versions
      console.log("Current theme versions:");
      for (const [type, version] of Object.entries(versions)) {
        console.log(`  ${type}: v${version}`);
      }
    }
    break;

  case "sync":
    // Manually sync website and landing versions
    const versionsToSync = loadVersions();
    const websiteVersion = versionsToSync.website;
    const landingVersion = versionsToSync.landing;

    if (websiteVersion !== landingVersion) {
      // Use the higher version number as the sync target
      const syncVersion =
        websiteVersion > landingVersion ? websiteVersion : landingVersion;
      versionsToSync.website = syncVersion;
      versionsToSync.landing = syncVersion;
      saveVersions(versionsToSync);
      console.log(`✓ Synced website and landing versions to ${syncVersion}`);
      console.log(`  Website: ${websiteVersion} → ${syncVersion}`);
      console.log(`  Landing: ${landingVersion} → ${syncVersion}`);
    } else {
      console.log(
        "✓ Website and landing versions are already in sync at",
        websiteVersion
      );
    }
    break;

  case "export-both": {
    // Export website and landing together, ensuring one shared version
    // Usage: export-both [patch|minor|major|none] [message]
    const bump = args[0] || "patch";
    const message = args.slice(1).join(" ");

    // Decide which base version to bump from (use the higher of the two)
    const current = loadVersions();
    const [wMaj, wMin, wPat] = current.website.split(".").map(Number);
    const [lMaj, lMin, lPat] = current.landing.split(".").map(Number);
    const wVal = wMaj * 1_000_000 + wMin * 1_000 + wPat;
    const lVal = lMaj * 1_000_000 + lMin * 1_000 + lPat;
    const baseType = wVal >= lVal ? "website" : "landing";

    // First export baseType with bump to compute the new shared version
    await exportTheme(baseType, bump, message || "Exporting both: base");

    // Read the new shared version
    const after = loadVersions();
    const sharedVersion = after.website; // synced by exportTheme

    // Export the other theme with 'none' bump to keep same version
    const other = baseType === "website" ? "landing" : "website";
    await exportTheme(other, "none", message || "Exporting both: other");

    console.log(
      `✓ Exported both themes at version ${sharedVersion} (base: ${baseType})`
    );
    break;
  }

  default:
    console.error("Unknown command:", command);
    console.error("Available commands: build, export, version, sync");
    process.exit(1);
}
