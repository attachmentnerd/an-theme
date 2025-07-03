import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const THEME_TYPES = ['website', 'landing', 'product'];
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

  // Copy shared sections
  if (fs.existsSync(path.join(sharedDir, 'sections'))) {
    await fs.copy(
      path.join(sharedDir, 'sections'),
      path.join(buildDir, 'sections'),
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

  // Copy shared styles
  if (fs.existsSync(path.join(sharedDir, 'styles'))) {
    const styles = await fs.readdir(path.join(sharedDir, 'styles'));
    for (const style of styles) {
      // Skip _tokens.css and README files - tokens are inlined into overrides.css
      if (style === '_tokens.css' || style.endsWith('.md')) continue;
      
      if (style.endsWith('.css') || style.endsWith('.scss')) {
        // For CSS files, we need to handle merging
        if (style === 'overrides.css') {
          // Read shared CSS
          let sharedCSS = await fs.readFile(
            path.join(sharedDir, 'styles', style),
            'utf8'
          );
          
          // Handle @import of _tokens.css by inlining it (support both single and double quotes)
          const importRegex = /@import\s+url\(['"]_tokens\.css['"]\);/g;
          if (importRegex.test(sharedCSS)) {
            const tokensPath = path.join(sharedDir, 'styles', '_tokens.css');
            if (fs.existsSync(tokensPath)) {
              const tokensCSS = await fs.readFile(tokensPath, 'utf8');
              // Replace the @import with the actual tokens CSS content
              sharedCSS = sharedCSS.replace(
                importRegex,
                `/* Inlined from _tokens.css */\n${tokensCSS}\n/* End of _tokens.css */`
              );
            }
          }
          
          // Check if theme has its own overrides.css with theme-specific styles
          const themeOverridesPath = path.join(sourceDir, 'assets', style);
          let themeSpecificCSS = '';
          
          if (fs.existsSync(themeOverridesPath)) {
            const themeCSS = await fs.readFile(themeOverridesPath, 'utf8');
            // Extract everything after the header comment if it contains theme-specific styles
            const parts = themeCSS.split('Theme-specific styles (if any) can be added below.');
            if (parts.length > 1 && parts[1].trim()) {
              // Use the content after the header comment
              themeSpecificCSS = parts[1];
            } else if (themeCSS.trim() && !themeCSS.includes('This file is intentionally empty')) {
              // Use the whole file if no header comment
              themeSpecificCSS = '\n\n' + themeCSS;
            }
          }
          
          // Write combined CSS
          await fs.writeFile(
            path.join(buildDir, 'assets', style),
            sharedCSS + themeSpecificCSS
          );
        } else {
          // For other files, just copy
          await fs.copy(
            path.join(sharedDir, 'styles', style),
            path.join(buildDir, 'assets', style)
          );
        }
      }
    }
  }

  // Remove layouts directory for landing and email themes
  if (type === 'landing' || type === 'email') {
    await fs.remove(path.join(buildDir, 'layouts'));
  }

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
  const previousExportPath = path.join(__dirname, '..', 'exports', 'releases', `v${previousVersion}`);
  const currentBuildPath = path.join(__dirname, '..', 'build', type);
  
  const report = {
    version: {
      previous: previousVersion,
      current: currentVersion
    },
    added: [],
    modified: [],
    removed: [],
    timestamp: new Date().toISOString()
  };

  // Get current files
  const currentFiles = await getAllFiles(currentBuildPath);
  
  // Check if previous version exists
  const previousZips = previousVersion && fs.existsSync(previousExportPath) 
    ? await fs.readdir(previousExportPath)
    : [];
  
  const previousZip = previousZips.find(f => f.endsWith('.zip'));
  
  if (previousZip) {
    // Extract previous version temporarily
    const tempDir = path.join(__dirname, '..', 'temp', `${type}-${previousVersion}`);
    await fs.ensureDir(tempDir);
    
    try {
      // Extract zip
      const AdmZip = (await import('adm-zip')).default;
      const zip = new AdmZip(path.join(previousExportPath, previousZip));
      zip.extractAllTo(tempDir, true);
      
      // Find the theme subdirectory
      const dirs = await fs.readdir(tempDir);
      const themeDir = dirs.find(d => d.includes('AN_') || d.includes('AN-'));
      const previousBuildPath = themeDir ? path.join(tempDir, themeDir) : tempDir;
      
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
            const currentContent = await fs.readFile(currentPath, 'utf8');
            const previousContent = await fs.readFile(previousPath, 'utf8');
            
            if (currentContent !== previousContent) {
              report.modified.push(file);
            }
          }
        }
      }
      
      // Clean up temp directory
      await fs.remove(tempDir);
      
    } catch (error) {
      console.error('Error comparing versions:', error);
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

  // Generate change report
  console.log('Generating change report...');
  const changeReport = await generateChangeReport(type, currentVersion, newVersion);
  
  // Save change report as JSON
  const changeReportPath = path.join(exportDir, 'change-report.json');
  await fs.writeFile(changeReportPath, JSON.stringify(changeReport, null, 2));
  
  // Save human-readable change report
  const readableReportPath = path.join(exportDir, 'CHANGES.md');
  let readableReport = `# Theme Changes Report\n\n`;
  readableReport += `**Theme:** ${themeName}\n`;
  readableReport += `**Version:** ${currentVersion} → ${newVersion}\n`;
  readableReport += `**Date:** ${new Date().toLocaleString()}\n`;
  readableReport += `**Message:** ${message || 'No message provided'}\n\n`;
  
  readableReport += `## Summary\n`;
  readableReport += `- **Added:** ${changeReport.added.length} files\n`;
  readableReport += `- **Modified:** ${changeReport.modified.length} files\n`;
  readableReport += `- **Removed:** ${changeReport.removed.length} files\n\n`;
  
  if (changeReport.added.length > 0) {
    readableReport += `## Added Files\n`;
    changeReport.added.forEach(file => {
      readableReport += `- ${file}\n`;
    });
    readableReport += `\n`;
  }
  
  if (changeReport.modified.length > 0) {
    readableReport += `## Modified Files\n`;
    changeReport.modified.forEach(file => {
      readableReport += `- ${file}\n`;
    });
    readableReport += `\n`;
  }
  
  if (changeReport.removed.length > 0) {
    readableReport += `## ⚠️ Removed Files (Manual Action Required)\n`;
    readableReport += `**Important:** Kajabi does not automatically remove files when updating themes.\n`;
    readableReport += `You must manually delete these files from your Kajabi theme:\n\n`;
    changeReport.removed.forEach(file => {
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
    console.log('\n⚠️  FILES TO MANUALLY REMOVE IN KAJABI:');
    changeReport.removed.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('\n');
  }
  
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