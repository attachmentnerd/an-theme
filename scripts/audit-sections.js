#!/usr/bin/env node

/**
 * Section Audit Script
 * Analyzes all Liquid sections for:
 * 1. Images without responsive-image snippet
 * 2. Hero sections missing priority: true
 * 3. Images without aspect_ratio
 * 4. Missing alt text
 * 5. Form inputs without ARIA labels
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.join(__dirname, '..');
const SHARED_SECTIONS = path.join(ROOT, 'shared/sections');
const PRODUCT_SECTIONS = path.join(ROOT, 'themes/product/sections');

// Colors for terminal output
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';

const issues = {
  imageOptimization: [],
  missingPriority: [],
  missingAspectRatio: [],
  missingAlt: [],
  missingAria: [],
  noBlurUp: []
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const isHero = /hero|banner/i.test(fileName) || /hero|banner/i.test(content.substring(0, 500));

  // Check for basic <img> tags (not using responsive-image)
  const imgTagMatches = content.match(/<img[^>]*>/g);
  if (imgTagMatches) {
    imgTagMatches.forEach(imgTag => {
      // Skip if it's within a responsive-image render
      const beforeTag = content.substring(0, content.indexOf(imgTag));
      const lastRender = beforeTag.lastIndexOf("{% render 'responsive-image'");
      const lastImgTag = beforeTag.lastIndexOf('<img');

      if (lastImgTag > lastRender) {
        issues.imageOptimization.push({
          file: fileName,
          line: content.substring(0, content.indexOf(imgTag)).split('\n').length,
          tag: imgTag.substring(0, 100)
        });

        // Check for missing alt
        if (!/alt\s*=/i.test(imgTag) || /alt\s*=\s*['"]\s*['"]/i.test(imgTag)) {
          issues.missingAlt.push({
            file: fileName,
            line: content.substring(0, content.indexOf(imgTag)).split('\n').length,
            tag: imgTag.substring(0, 100)
          });
        }
      }
    });
  }

  // Check responsive-image renders
  const renderMatches = content.matchAll(/\{%\s*render\s+['"]responsive-image['"][^}]*%\}/gs);
  for (const match of renderMatches) {
    const renderBlock = match[0];
    const lineNum = content.substring(0, match.index).split('\n').length;

    // Check for priority on hero sections
    if (isHero && !/priority:\s*true/i.test(renderBlock)) {
      issues.missingPriority.push({
        file: fileName,
        line: lineNum,
        context: 'Hero section without priority: true'
      });
    }

    // Check for aspect_ratio
    if (!/aspect_ratio:/i.test(renderBlock)) {
      issues.missingAspectRatio.push({
        file: fileName,
        line: lineNum,
        context: 'No aspect_ratio specified'
      });
    }

    // Check for blur_up
    if (!/blur_up:\s*true/i.test(renderBlock)) {
      issues.noBlurUp.push({
        file: fileName,
        line: lineNum,
        context: 'No blur_up enabled'
      });
    }
  }

  // Check for form inputs without ARIA labels
  const inputMatches = content.matchAll(/<input[^>]*>/g);
  for (const match of inputMatches) {
    const inputTag = match[0];
    const lineNum = content.substring(0, match.index).split('\n').length;

    if (!/aria-label/i.test(inputTag) && !/id\s*=/i.test(inputTag)) {
      issues.missingAria.push({
        file: fileName,
        line: lineNum,
        tag: inputTag.substring(0, 100)
      });
    }
  }
}

function scanDirectory(dir, label) {
  console.log(`\n${BLUE}Scanning ${label}...${RESET}`);

  if (!fs.existsSync(dir)) {
    console.log(`${YELLOW}Directory not found: ${dir}${RESET}`);
    return;
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.liquid'));

  files.forEach(file => {
    analyzeFile(path.join(dir, file));
  });

  console.log(`${GREEN}✓ Scanned ${files.length} files${RESET}`);
}

function printReport() {
  console.log('\n' + '='.repeat(80));
  console.log(`${BLUE}SECTION AUDIT REPORT${RESET}`);
  console.log('='.repeat(80));

  // Image Optimization
  if (issues.imageOptimization.length > 0) {
    console.log(`\n${RED}❌ CRITICAL: Images Not Using responsive-image Snippet (${issues.imageOptimization.length})${RESET}`);
    issues.imageOptimization.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   ${YELLOW}${issue.tag}...${RESET}`);
    });
    if (issues.imageOptimization.length > 10) {
      console.log(`   ${YELLOW}... and ${issues.imageOptimization.length - 10} more${RESET}`);
    }
  }

  // Missing Priority
  if (issues.missingPriority.length > 0) {
    console.log(`\n${RED}❌ Hero Sections Missing priority: true (${issues.missingPriority.length})${RESET}`);
    issues.missingPriority.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.context}`);
    });
  }

  // Missing Aspect Ratio
  if (issues.missingAspectRatio.length > 0) {
    console.log(`\n${YELLOW}⚠️  Images Missing aspect_ratio (${issues.missingAspectRatio.length})${RESET}`);
    issues.missingAspectRatio.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.context}`);
    });
    if (issues.missingAspectRatio.length > 10) {
      console.log(`   ${YELLOW}... and ${issues.missingAspectRatio.length - 10} more${RESET}`);
    }
  }

  // No Blur Up
  if (issues.noBlurUp.length > 0) {
    console.log(`\n${YELLOW}⚠️  Images Without blur_up (${issues.noBlurUp.length})${RESET}`);
    console.log(`   ${issues.noBlurUp.length} images could benefit from blur-up placeholders`);
  }

  // Missing Alt Text
  if (issues.missingAlt.length > 0) {
    console.log(`\n${RED}❌ ACCESSIBILITY: Images Missing Alt Text (${issues.missingAlt.length})${RESET}`);
    issues.missingAlt.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
      console.log(`   ${YELLOW}${issue.tag}...${RESET}`);
    });
    if (issues.missingAlt.length > 10) {
      console.log(`   ${YELLOW}... and ${issues.missingAlt.length - 10} more${RESET}`);
    }
  }

  // Missing ARIA
  if (issues.missingAria.length > 0) {
    console.log(`\n${YELLOW}⚠️  ACCESSIBILITY: Form Inputs Missing ARIA Labels (${issues.missingAria.length})${RESET}`);
    issues.missingAria.slice(0, 10).forEach(issue => {
      console.log(`   ${issue.file}:${issue.line}`);
    });
    if (issues.missingAria.length > 10) {
      console.log(`   ${YELLOW}... and ${issues.missingAria.length - 10} more${RESET}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  const totalIssues =
    issues.imageOptimization.length +
    issues.missingPriority.length +
    issues.missingAspectRatio.length +
    issues.missingAlt.length +
    issues.missingAria.length;

  if (totalIssues === 0) {
    console.log(`${GREEN}✅ No issues found! All sections are optimized.${RESET}`);
  } else {
    console.log(`${RED}Total Issues: ${totalIssues}${RESET}`);
    console.log(`  - ${RED}Critical (CWV):${RESET} ${issues.imageOptimization.length + issues.missingPriority.length + issues.missingAspectRatio.length}`);
    console.log(`  - ${YELLOW}Accessibility:${RESET} ${issues.missingAlt.length + issues.missingAria.length}`);
    console.log(`  - ${YELLOW}Enhancement:${RESET} ${issues.noBlurUp.length}`);
  }
  console.log('='.repeat(80) + '\n');

  // Export to JSON for programmatic fixing
  fs.writeFileSync(
    path.join(__dirname, 'audit-results.json'),
    JSON.stringify(issues, null, 2)
  );
  console.log(`${GREEN}✓ Results exported to scripts/audit-results.json${RESET}\n`);
}

// Run the audit
scanDirectory(SHARED_SECTIONS, 'Shared Sections');
scanDirectory(PRODUCT_SECTIONS, 'Product Theme Sections');
printReport();