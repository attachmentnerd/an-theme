const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

const THEME_TYPES = ['website', 'landing', 'product', 'email'];
const VERSION_FILE = path.join(__dirname, '..', 'versions.json');

// Load or initialize versions
function loadVersions() {
  if (fs.existsSync(VERSION_FILE)) {
    return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
  }
  // Initialize with version 10.x.x to avoid Kajabi conflicts
  return {
    website: '10.0.0',
    landing: '10.0.0',
    product: '10.0.0',
    email: '10.0.0'
  };
}

// Save versions
function saveVersions(versions) {
  fs.writeFileSync(VERSION_FILE, JSON.stringify(versions, null, 2));
}

// Build theme
async function buildTheme(type) {
  const sourceDir = path.join(__dirname, '..', 'themes', type);
  const buildDir = path.join(__dirname, '..', 'build', type);
  const sharedDir = path.join(__dirname, '..', 'shared');

  console.log(`Building ${type} theme...`);

  // Clean build directory
  await fs.remove(buildDir);
  await fs.ensureDir(buildDir);

  // Copy theme files
  await fs.copy(sourceDir, buildDir, {
    filter: (src) => !src.includes('/_') && !src.includes('styles/')
  });

  // Copy shared components
  if (fs.existsSync(path.join(sharedDir, 'snippets'))) {
    await fs.copy(
      path.join(sharedDir, 'snippets'),
      path.join(buildDir, 'snippets'),
      { overwrite: false }
    );
  }

  // Copy styles.scss.liquid directly (don't compile - it has Liquid tags)
  const sassPath = path.join(sourceDir, 'assets', 'styles.scss.liquid');
  if (fs.existsSync(sassPath)) {
    await fs.ensureDir(path.join(buildDir, 'assets'));
    await fs.copy(
      sassPath,
      path.join(buildDir, 'assets', 'styles.scss.liquid')
    );
  }

  // Copy shared scripts
  if (fs.existsSync(path.join(sharedDir, 'scripts'))) {
    const scripts = await fs.readdir(path.join(sharedDir, 'scripts'));
    for (const script of scripts) {
      if (script.endsWith('.js')) {
        await fs.copy(
          path.join(sharedDir, 'scripts', script),
          path.join(buildDir, 'assets', script)
        );
      }
    }
  }

  // Remove layouts directory for landing and email themes
  if (type === 'landing' || type === 'email') {
    await fs.remove(path.join(buildDir, 'layouts'));
  }

  console.log(`✓ Built ${type} theme`);
}

// Generate version starting from 10.x.x to avoid Kajabi internal version conflicts
function generateKajabiSafeVersion(type, major, minor, patch) {
  // Start from version 10 to avoid all Kajabi reserved versions
  // Kajabi uses versions up to 7.x.x, so 10+ should be safe
  return `${major}.${minor}.${patch}`;
}

// Export theme
async function exportTheme(type, versionBump, message) {
  const versions = loadVersions();
  const currentVersion = versions[type];
  
  // Parse version - always numeric format now
  let [major, minor, patch] = currentVersion.split('.').map(Number);
  
  // Ensure we start from version 10 minimum
  if (major < 10) {
    major = 10;
    minor = 0;
    patch = 0;
  }
  
  // Calculate new version numbers
  switch (versionBump) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
    default:
      patch += 1;
  }
  
  // Generate Kajabi-safe version with text prefix
  const newVersion = generateKajabiSafeVersion(type, major, minor, patch);

  // Update version in settings_schema.json BEFORE building
  const schemaPath = path.join(__dirname, '..', 'themes', type, 'config', 'settings_schema.json');
  let themeName = `AN-${type}`;
  
  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    const themeInfo = schema.find(s => s.name === 'theme_info');
    if (themeInfo) {
      // Ensure theme_info has exactly 6 required fields
      const cleanThemeInfo = {
        name: 'theme_info',
        theme_name: themeInfo.theme_name || themeName,
        theme_version: newVersion,
        theme_author: themeInfo.theme_author || 'AN Themes',
        theme_documentation_url: themeInfo.theme_documentation_url || 'https://anthemes.com/docs',
        theme_support_url: themeInfo.theme_support_url || 'https://anthemes.com/support'
      };
      
      // Replace the theme_info object with clean version
      const themeInfoIndex = schema.findIndex(s => s.name === 'theme_info');
      schema[themeInfoIndex] = cleanThemeInfo;
      
      if (cleanThemeInfo.theme_name) {
        themeName = cleanThemeInfo.theme_name.replace(/\s+/g, '_');
      }
      
      // Write updated schema back to file
      fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    }
  }

  // Build theme after updating version
  await buildTheme(type);

  // Create export directory
  const exportDir = path.join(__dirname, '..', 'exports', 'releases', `v${newVersion}`);
  await fs.ensureDir(exportDir);

  // Create ZIP with proper structure
  // Use underscores in filename but keep version format as-is
  const safeVersion = newVersion.replace(/[^a-zA-Z0-9.-]/g, '_');
  const zipPath = path.join(exportDir, `${themeName}_${safeVersion}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  archive.pipe(output);

  // Add files with subdirectory structure
  const buildDir = path.join(__dirname, '..', 'build', type);
  archive.directory(buildDir, `${themeName}/`);

  await archive.finalize();

  // Wait for stream to finish
  await new Promise((resolve) => output.on('close', resolve));

  // Remove macOS extended attributes
  try {
    execSync(`xattr -cr "${zipPath}"`, { stdio: 'inherit' });
  } catch (e) {
    // xattr might not be available on all systems
  }

  // Update version
  versions[type] = newVersion;
  saveVersions(versions);

  // Create version log
  const logPath = path.join(exportDir, 'version-log.txt');
  const logContent = `Theme: ${themeName}
Type: ${type}
Version: ${newVersion}
Date: ${new Date().toISOString()}
Message: ${message || 'No message provided'}
File: ${path.basename(zipPath)}
`;
  await fs.writeFile(logPath, logContent);

  console.log(`✓ Exported ${themeName} v${newVersion} to ${zipPath}`);
  
  return zipPath;
}

// CLI commands
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'build':
    if (!args[0] || !THEME_TYPES.includes(args[0])) {
      console.error('Usage: npm run theme:build <type>');
      console.error(`Types: ${THEME_TYPES.join(', ')}`);
      process.exit(1);
    }
    buildTheme(args[0]);
    break;

  case 'export':
    if (!args[0] || !THEME_TYPES.includes(args[0])) {
      console.error('Usage: npm run theme:export <type> [patch|minor|major] [message]');
      console.error(`Types: ${THEME_TYPES.join(', ')}`);
      process.exit(1);
    }
    exportTheme(args[0], args[1] || 'patch', args.slice(2).join(' '));
    break;

  case 'version':
    const versions = loadVersions();
    if (args[0] && args[1]) {
      // Set version
      if (THEME_TYPES.includes(args[0])) {
        versions[args[0]] = args[1];
        saveVersions(versions);
        console.log(`✓ Set ${args[0]} version to ${args[1]}`);
      }
    } else {
      // Show versions
      console.log('Current theme versions:');
      for (const [type, version] of Object.entries(versions)) {
        console.log(`  ${type}: v${version}`);
      }
    }
    break;

  default:
    console.error('Unknown command:', command);
    console.error('Available commands: build, export, version');
    process.exit(1);
}