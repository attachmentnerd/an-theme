#!/usr/bin/env node

/**
 * Remove all dev placeholders from theme files
 * Replaces picsum.photos and generic placeholders with brand-appropriate alternatives
 */

const fs = require('fs').promises;
const path = require('path');

const PLACEHOLDER_PATTERNS = [
  {
    // Picsum photos with various IDs
    pattern: /https:\/\/picsum\.photos\/id\/\d+\/\d+\/\d+(\?[^"']+)?/g,
    replacement: '{{ svg_placeholder_default }}',
    needsInclude: true
  },
  {
    // Picsum photos without ID
    pattern: /https:\/\/picsum\.photos\/\d+\/\d+(\?[^"']+)?/g,
    replacement: '{{ svg_placeholder_default }}',
    needsInclude: true
  },
  {
    // Generic "Feature Image" text
    pattern: /"Feature Image"/g,
    replacement: '"Image"'
  },
  {
    // Generic placeholder text in defaults
    pattern: /"default":\s*"Feature/g,
    replacement: '"default": "'
  }
];

async function processFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    let needsInclude = false;

    PLACEHOLDER_PATTERNS.forEach(({ pattern, replacement, needsInclude: includeFlag }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
        if (includeFlag) needsInclude = true;
      }
    });

    // If we need the SVG include and it's not already there
    if (needsInclude && !content.includes("{% include 'svg_placeholders' %}")) {
      // Find a good place to add the include (after the first liquid comment)
      const firstCommentEnd = content.indexOf('%}') + 2;
      if (firstCommentEnd > 1) {
        content = content.slice(0, firstCommentEnd) + 
                  "\n\n{% include 'svg_placeholders' %}\n" + 
                  content.slice(firstCommentEnd);
        modified = true;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, content);
      console.log(`✓ Updated: ${path.basename(filePath)}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
  return false;
}

async function findAndProcessFiles(dir) {
  let processedCount = 0;
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
        processedCount += await findAndProcessFiles(fullPath);
      } else if (item.isFile() && item.name.endsWith('.liquid')) {
        if (await processFile(fullPath)) {
          processedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return processedCount;
}

async function main() {
  console.log('🔍 Searching for dev placeholders in theme files...\n');
  
  const sharedDir = path.join(__dirname, '..', 'shared');
  const themesDir = path.join(__dirname, '..', 'themes');
  
  let totalProcessed = 0;
  
  console.log('Processing shared components...');
  totalProcessed += await findAndProcessFiles(sharedDir);
  
  console.log('\nProcessing theme-specific files...');
  totalProcessed += await findAndProcessFiles(themesDir);
  
  console.log(`\n✅ Complete! Updated ${totalProcessed} files.`);
  console.log('\n⚠️  Remember to review the changes and test thoroughly!');
}

main().catch(console.error);