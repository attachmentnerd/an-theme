#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sectionsDir = path.join(__dirname, '..', 'shared', 'sections');

// Sections that already have section_id
const sectionsWithId = [
  'hero_clean.liquid',
  'hero_clean2.liquid',
  'feature_highlight.liquid',
  'cta_standard.liquid',
  'books_showcase_grid.liquid',
  'book_hero_sa.liquid',
  'table_section.liquid'
];

// Function to derive default section ID from filename
function getDefaultSectionId(filename) {
  return filename
    .replace('.liquid', '')
    .replace(/_/g, '-')
    .replace(/^page-/, '')
    .replace(/^nav-/, '')
    .replace(/^an-/, '');
}

// Function to add section ID to a file
function addSectionId(filepath) {
  const filename = path.basename(filepath);
  
  if (sectionsWithId.includes(filename)) {
    console.log(`✓ Skipping ${filename} (already has section_id)`);
    return;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  const defaultId = getDefaultSectionId(filename);
  
  // Check if already has section_id in schema
  if (content.includes('"section_id"')) {
    console.log(`✓ Skipping ${filename} (already has section_id)`);
    return;
  }
  
  // Pattern 1: Update <section> tag with id attribute
  const sectionTagRegex = /<section\s+([^>]*?)>/;
  const sectionMatch = content.match(sectionTagRegex);
  
  if (sectionMatch) {
    const sectionTag = sectionMatch[0];
    
    // Check if already has id attribute
    if (!sectionTag.includes(' id=')) {
      // Add id attribute after <section
      const newSectionTag = sectionTag.replace(
        '<section',
        `<section id="{{ section.settings.section_id | default: '${defaultId}' }}-{{ section.id }}"`
      );
      content = content.replace(sectionTag, newSectionTag);
      console.log(`✓ Added id attribute to ${filename}`);
    }
  } else {
    console.log(`⚠️  No <section> tag found in ${filename}`);
  }
  
  // Pattern 2: Add section_id to schema
  const schemaRegex = /{% schema %}\s*\n\s*{\s*\n\s*"name":\s*"([^"]+)",?\s*\n/;
  const schemaMatch = content.match(schemaRegex);
  
  if (schemaMatch) {
    // Find where "elements" or "settings" array starts
    const elementsRegex = /"(elements|settings)":\s*\[\s*\n(\s*{\s*\n)?/;
    const elementsMatch = content.match(elementsRegex);
    
    if (elementsMatch) {
      const indentMatch = content.match(/"(elements|settings)":\s*\[\s*\n(\s*)/);
      const indent = indentMatch ? indentMatch[2] : '    ';
      
      const sectionIdSetting = `${indent}{
${indent}  "type": "header",
${indent}  "content": "General Settings"
${indent}},
${indent}{
${indent}  "type": "text",
${indent}  "id": "section_id",
${indent}  "label": "Section ID",
${indent}  "default": "${defaultId}",
${indent}  "info": "Custom ID for internal linking (e.g., #${defaultId})"
${indent}},`;
      
      // Insert after the elements/settings array opening
      const insertPosition = content.indexOf(elementsMatch[0]) + elementsMatch[0].length;
      
      // Check if there's already a header as the first element
      const afterElements = content.substring(insertPosition, insertPosition + 200);
      if (afterElements.trim().startsWith('{') && afterElements.includes('"type": "header"')) {
        // There's already a header, just add the section_id setting
        const simpleSetting = `${indent}{
${indent}  "type": "text",
${indent}  "id": "section_id",
${indent}  "label": "Section ID",
${indent}  "default": "${defaultId}",
${indent}  "info": "Custom ID for internal linking (e.g., #${defaultId})"
${indent}},
`;
        content = content.substring(0, insertPosition) + simpleSetting + content.substring(insertPosition);
      } else {
        // Add both header and setting
        content = content.substring(0, insertPosition) + sectionIdSetting + '\n' + content.substring(insertPosition);
      }
      
      console.log(`✓ Added section_id setting to ${filename} schema`);
    } else {
      console.log(`⚠️  No elements/settings array found in ${filename} schema`);
    }
  } else {
    console.log(`⚠️  No schema found in ${filename}`);
  }
  
  // Write the updated content back
  fs.writeFileSync(filepath, content, 'utf8');
}

// Process all liquid files in the sections directory
console.log('Adding section IDs to all shared sections...\n');

const files = fs.readdirSync(sectionsDir)
  .filter(file => file.endsWith('.liquid'))
  .sort();

files.forEach(file => {
  const filepath = path.join(sectionsDir, file);
  try {
    addSectionId(filepath);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\n✅ Section ID update complete!');