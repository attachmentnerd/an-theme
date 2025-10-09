#!/usr/bin/env node

/**
 * Automated Image Optimization Fixer
 * Converts basic <img> tags to responsive-image snippets with proper optimization
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');

// Load audit results
const auditResults = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'audit-results.json'), 'utf8')
);

// Colors
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

let fixedCount = 0;
let skippedCount = 0;

/**
 * Determine appropriate aspect ratio based on image size hint
 */
function getAspectRatio(sizeHint) {
  if (!sizeHint) return "'16/9'";

  // Parse size hint like '400x600', '120x120', '800x450'
  const match = sizeHint.match(/(\d+)x(\d+)/);
  if (match) {
    const width = parseInt(match[1]);
    const height = parseInt(match[2]);

    // Square images (avatars, logos)
    if (width === height) return "'1/1'";

    // Book covers (2:3)
    if (Math.abs(width / height - 2/3) < 0.1) return "'2/3'";

    // Videos/heroes (16:9)
    if (Math.abs(width / height - 16/9) < 0.2) return "'16/9'";

    // Landscape (4:3)
    if (Math.abs(width / height - 4/3) < 0.2) return "'4/3'";

    // Portrait (3:4)
    if (Math.abs(width / height - 3/4) < 0.2) return "'3/4'";
  }

  return "'16/9'"; // Default
}

/**
 * Determine placeholder type based on context
 */
function getPlaceholderType(imageVar, context) {
  const varLower = imageVar.toLowerCase();

  if (varLower.includes('hero') || varLower.includes('banner')) return "'hero'";
  if (varLower.includes('book') && !varLower.includes('author')) return "'book'";
  if (varLower.includes('avatar') || varLower.includes('author') || varLower.includes('profile')) return "'avatar'";
  if (varLower.includes('logo') || varLower.includes('badge')) return "'logo'";

  return "'feature'"; // Default
}

/**
 * Determine appropriate widths based on size hint and type
 */
function getWidths(sizeHint, placeholderType) {
  if (placeholderType === "'avatar'" || placeholderType === "'logo'") {
    return "'60,120,180,240'";
  }

  if (placeholderType === "'book'") {
    return "'280,400,600,800'";
  }

  if (placeholderType === "'hero'") {
    return "'800,1200,1600,2000,2400'";
  }

  // Default for features
  return "'400,600,800,1200'";
}

/**
 * Determine sizes attribute based on context
 */
function getSizes(placeholderType, isHero) {
  if (isHero || placeholderType === "'hero'") {
    return "'100vw'";
  }

  if (placeholderType === "'avatar'" || placeholderType === "'logo'") {
    return "'120px'";
  }

  if (placeholderType === "'book'") {
    return "'(max-width: 767px) 280px, 400px'";
  }

  // Responsive default
  return "'(max-width: 767px) 100vw, (max-width: 991px) 50vw, 800px'";
}

/**
 * Convert <img> tag to responsive-image snippet
 */
function convertImgToResponsive(imgTag, context, isHero) {
  // Extract attributes
  const srcMatch = imgTag.match(/src=["']([^"']+)["']/);
  const altMatch = imgTag.match(/alt=["']([^"']+)["']/);
  const classMatch = imgTag.match(/class=["']([^"']+)["']/);

  if (!srcMatch) return null;

  const src = srcMatch[1];
  const alt = altMatch ? altMatch[1] : '';
  const cssClass = classMatch ? classMatch[1] : 'img-fluid';

  // Extract image variable and size hint
  const imageVarMatch = src.match(/\{\{\s*([^|]+)\s*\|/);
  const sizeHintMatch = src.match(/image_picker_url:\s*'([^']+)'/);

  if (!imageVarMatch) {
    // Skip CDN images or hardcoded URLs
    skippedCount++;
    return null;
  }

  const imageVar = imageVarMatch[1].trim();
  const sizeHint = sizeHintMatch ? sizeHintMatch[1] : null;

  // Determine parameters
  const aspectRatio = getAspectRatio(sizeHint);
  const placeholderType = getPlaceholderType(imageVar, context);
  const widths = getWidths(sizeHint, placeholderType);
  const sizes = getSizes(placeholderType, isHero);
  const priority = isHero ? ',\n  priority: true' : '';
  const blurUp = (placeholderType !== "'avatar'" && placeholderType !== "'logo'") ? ',\n  blur_up: true' : '';

  // Generate responsive-image snippet
  const responsive = `{% render 'responsive-image',
  image: ${imageVar},
  alt: '${alt}',
  class: '${cssClass}',
  sizes: ${sizes},
  aspect_ratio: ${aspectRatio},
  widths: ${widths},
  placeholder_type: ${placeholderType}${priority}${blurUp}
%}`;

  return responsive;
}

/**
 * Fix images in a file
 */
function fixFile(filePath, issues) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const fileName = path.basename(filePath);
  const isHero = /hero|banner/i.test(fileName);

  // Sort issues by line number in reverse order to maintain correct positions
  const sortedIssues = issues.sort((a, b) => b.line - a.line);

  for (const issue of sortedIssues) {
    // Find the actual img tag in content
    const lines = content.split('\n');
    const lineIndex = issue.line - 1;

    if (lineIndex < 0 || lineIndex >= lines.length) continue;

    // Get context around the image (might span multiple lines)
    let imgTagStart = lineIndex;
    let imgTagEnd = lineIndex;
    let imgTagContent = lines[lineIndex];

    // Find full img tag (might span multiple lines)
    while (imgTagStart > 0 && !lines[imgTagStart].includes('<img')) {
      imgTagStart--;
    }

    while (imgTagEnd < lines.length - 1 && !imgTagContent.includes('>')) {
      imgTagEnd++;
      imgTagContent += '\n' + lines[imgTagEnd];
    }

    // Extract full img tag
    const fullContext = lines.slice(imgTagStart, imgTagEnd + 1).join('\n');
    const imgMatch = fullContext.match(/<img[^>]*>/s);

    if (!imgMatch) continue;

    const imgTag = imgMatch[0];

    // Convert to responsive-image
    const responsive = convertImgToResponsive(imgTag, fullContext, isHero);

    if (responsive) {
      // Get indentation from the img tag line
      const indentMatch = lines[imgTagStart].match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      // Indent all lines of the responsive snippet
      const indentedResponsive = responsive
        .split('\n')
        .map((line, idx) => idx === 0 ? indent + line : indent + line)
        .join('\n');

      // Replace in content
      content = content.replace(imgTag, indentedResponsive);
      modified = true;
      fixedCount++;

      console.log(`${GREEN}✓${RESET} Fixed: ${fileName}:${issue.line}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  return modified;
}

/**
 * Main execution
 */
console.log(`\n${BLUE}Starting automated image optimization...${RESET}\n`);

// Group issues by file
const fileIssues = new Map();

for (const issue of auditResults.imageOptimization) {
  // Determine full path
  let filePath;
  if (fs.existsSync(path.join(ROOT, 'shared/sections', issue.file))) {
    filePath = path.join(ROOT, 'shared/sections', issue.file);
  } else if (fs.existsSync(path.join(ROOT, 'themes/product/sections', issue.file))) {
    filePath = path.join(ROOT, 'themes/product/sections', issue.file);
  } else {
    continue;
  }

  if (!fileIssues.has(filePath)) {
    fileIssues.set(filePath, []);
  }
  fileIssues.get(filePath).push(issue);
}

// Fix each file
for (const [filePath, issues] of fileIssues) {
  fixFile(filePath, issues);
}

console.log(`\n${GREEN}✅ Automated fixes complete!${RESET}`);
console.log(`   Fixed: ${GREEN}${fixedCount}${RESET} images`);
console.log(`   Skipped: ${YELLOW}${skippedCount}${RESET} images (CDN/hardcoded URLs)`);
console.log(`\n${YELLOW}⚠️  Manual review recommended for:${RESET}`);
console.log(`   - Hero sections (verify priority: true)`);
console.log(`   - Complex layouts (verify aspect ratios)`);
console.log(`   - Alt text quality\n`);