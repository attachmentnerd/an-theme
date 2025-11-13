#!/usr/bin/env node

/**
 * Liquid Syntax Validator for Kajabi Themes
 * Catches common Liquid syntax errors before they break in production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const errors = [];
const warnings = [];

/**
 * Validation rules
 */
const rules = [
  {
    name: 'Incomplete Liquid variable tags',
    pattern: /\{\{[^}]*$/m,
    exclude: /\{\{[^}]+\|[^}]+:[\s\S]*$/m, // Allow multiline filters
    severity: 'error',
    message: 'Liquid variable tag {{ not properly closed with }}'
  },
  {
    name: 'Incomplete alt attributes with default filter',
    pattern: /alt="\{\{[^}]*\|\s*default:\s*"[^}]*$/m,
    severity: 'error',
    message: 'Alt attribute has incomplete default filter (missing closing }} and quote)'
  },
  {
    name: 'Incomplete src attributes',
    pattern: /src="\{\{[^}]*\|\s*default:\s*"[^}]*$/m,
    severity: 'error',
    message: 'Src attribute has incomplete default filter (missing closing }} and quote)'
  },
  {
    name: 'Incomplete href attributes',
    pattern: /href="\{\{[^}]*\|\s*default:\s*"[^}]*$/m,
    severity: 'error',
    message: 'Href attribute has incomplete default filter (missing closing }} and quote)'
  },
  {
    name: 'Use of {% render %} instead of {% include %}',
    pattern: /\{%\s*render\s+/,
    severity: 'error',
    message: 'Kajabi does NOT support {% render %}. Use {% include %} instead.'
  },
  {
    name: 'Ternary operators in Liquid',
    pattern: /\{\{[^}]*\?[^}]*:[^}]*\}\}/,
    severity: 'error',
    message: 'Kajabi does not support ternary operators (?:). Use {% if %} instead.'
  },
  {
    name: 'Shopify linklists object',
    pattern: /linklists\[/,
    severity: 'warning',
    message: 'Kajabi uses current_site.link_lists (not linklists). Verify this works in Kajabi.'
  },
  {
    name: 'Unclosed {% if %} tags',
    pattern: /\{%\s*if\s+[^%]*\{%\s*if\s+/,
    severity: 'warning',
    message: 'Potential unclosed {% if %} tag (nested if without endif)'
  },
  {
    name: 'Empty alt attributes',
    pattern: /alt=""\s*(?!\/?>)/,
    severity: 'warning',
    message: 'Empty alt attribute. Consider adding descriptive text for accessibility.'
  },
  {
    name: 'String comparison with number',
    pattern: /(section|block)\.settings\.\w+\s*[><=!]+\s*\d+/,
    severity: 'error',
    message: 'Comparing setting value to number without conversion. Use | plus: 0 to convert to number first.',
    customCheck: (line, content, lineIndex) => {
      // Check if there's an assign with plus: 0 conversion within 5 lines before
      const lines = content.split('\n');
      const match = line.match(/(section|block)\.settings\.(\w+)/);
      if (!match) return false;

      const settingName = match[2];
      const startLine = Math.max(0, lineIndex - 5);

      for (let i = startLine; i < lineIndex; i++) {
        if (lines[i].includes('assign') && lines[i].includes(settingName) && lines[i].includes('plus: 0')) {
          return false; // Conversion found, no error
        }
      }
      return true; // No conversion found, report error
    }
  }
];

/**
 * Find all .liquid files
 */
function findLiquidFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Skip node_modules and other irrelevant directories
      if (!['node_modules', '.git', 'exports', 'llm-drafts'].includes(file)) {
        results = results.concat(findLiquidFiles(filePath));
      }
    } else if (file.endsWith('.liquid')) {
      results.push(filePath);
    }
  });

  return results;
}

/**
 * Validate a single file
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileErrors = [];
  const fileWarnings = [];

  rules.forEach(rule => {
    // Check if we should exclude this pattern
    if (rule.exclude && rule.exclude.test(content)) {
      return;
    }

    lines.forEach((line, index) => {
      if (rule.pattern.test(line)) {
        // Run custom check if provided
        if (rule.customCheck && !rule.customCheck(line, content, index)) {
          return; // Custom check failed, skip this issue
        }

        const issue = {
          file: filePath,
          line: index + 1,
          rule: rule.name,
          message: rule.message,
          content: line.trim()
        };

        if (rule.severity === 'error') {
          fileErrors.push(issue);
        } else {
          fileWarnings.push(issue);
        }
      }
    });
  });

  return { errors: fileErrors, warnings: fileWarnings };
}

/**
 * Format and print results
 */
function printResults(errors, warnings) {
  console.log('\n');
  console.log(colors.bold + '═'.repeat(80) + colors.reset);
  console.log(colors.bold + colors.cyan + '  Liquid Syntax Validation Results' + colors.reset);
  console.log(colors.bold + '═'.repeat(80) + colors.reset);
  console.log('\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log(colors.green + colors.bold + '✓ All checks passed! No issues found.' + colors.reset);
    console.log('\n');
    return true;
  }

  // Print errors
  if (errors.length > 0) {
    console.log(colors.red + colors.bold + `✗ ${errors.length} ERROR${errors.length > 1 ? 'S' : ''} FOUND:` + colors.reset);
    console.log(colors.red + '─'.repeat(80) + colors.reset);

    errors.forEach((error, index) => {
      console.log(`\n${colors.bold}${index + 1}.${colors.reset} ${colors.red}${error.file}:${error.line}${colors.reset}`);
      console.log(`   ${colors.yellow}Rule:${colors.reset} ${error.rule}`);
      console.log(`   ${colors.yellow}Issue:${colors.reset} ${error.message}`);
      console.log(`   ${colors.blue}Line:${colors.reset} ${error.content.substring(0, 100)}${error.content.length > 100 ? '...' : ''}`);
    });
    console.log('\n');
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(colors.yellow + colors.bold + `⚠ ${warnings.length} WARNING${warnings.length > 1 ? 'S' : ''} FOUND:` + colors.reset);
    console.log(colors.yellow + '─'.repeat(80) + colors.reset);

    warnings.forEach((warning, index) => {
      console.log(`\n${colors.bold}${index + 1}.${colors.reset} ${colors.yellow}${warning.file}:${warning.line}${colors.reset}`);
      console.log(`   ${colors.cyan}Rule:${colors.reset} ${warning.rule}`);
      console.log(`   ${colors.cyan}Issue:${colors.reset} ${warning.message}`);
      console.log(`   ${colors.blue}Line:${colors.reset} ${warning.content.substring(0, 100)}${warning.content.length > 100 ? '...' : ''}`);
    });
    console.log('\n');
  }

  console.log(colors.bold + '─'.repeat(80) + colors.reset);
  console.log(colors.bold + 'Summary:' + colors.reset);
  console.log(`  ${colors.red}Errors:${colors.reset} ${errors.length}`);
  console.log(`  ${colors.yellow}Warnings:${colors.reset} ${warnings.length}`);
  console.log(colors.bold + '─'.repeat(80) + colors.reset);
  console.log('\n');

  return errors.length === 0;
}

/**
 * Main execution
 */
function main() {
  console.log('\n' + colors.cyan + '🔍 Scanning Liquid files...' + colors.reset + '\n');

  const rootDir = process.cwd();
  const liquidFiles = findLiquidFiles(rootDir);

  console.log(`Found ${liquidFiles.length} Liquid files\n`);

  let totalErrors = [];
  let totalWarnings = [];

  liquidFiles.forEach(file => {
    const result = validateFile(file);
    totalErrors = totalErrors.concat(result.errors);
    totalWarnings = totalWarnings.concat(result.warnings);
  });

  const success = printResults(totalErrors, totalWarnings);

  // Exit with error code if there are errors
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateFile, findLiquidFiles };
