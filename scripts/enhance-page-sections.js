#!/usr/bin/env node

/**
 * Enhance existing page sections with editable text content
 * This script re-processes HTML drafts to extract ALL text content
 */

import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for editable content extraction
const EDITABLE_CONTENT = {
  // Headlines - using both tag and class selectors
  'h1': { type: 'text', group: 'Headlines' },
  'h2:not(.h3)': { type: 'text', group: 'Headlines' },
  '.hero h3': { type: 'text', group: 'Hero Content' },
  '.journey-step h3': { type: 'text', group: 'Journey Steps' },
  
  // Hero content
  '.hero-subtitle': { type: 'textarea', group: 'Hero Content' },
  '.bestseller-badge span:last-child': { type: 'text', group: 'Hero Content' },
  
  // Buttons
  '.btn-primary': { type: 'text', group: 'Call to Action', isButton: true },
  '.btn-secondary': { type: 'text', group: 'Call to Action', isButton: true },
  '.cta-button': { type: 'text', group: 'Call to Action', isButton: true },
  'a.button': { type: 'text', group: 'Call to Action', isButton: true },
  
  // Statistics
  '.stat-number': { type: 'text', group: 'Statistics' },
  '.stat-label': { type: 'text', group: 'Statistics' },
  
  // Features/Benefits
  '.feature-title': { type: 'text', group: 'Features' },
  '.feature-description': { type: 'textarea', group: 'Features' },
  '.benefit-text': { type: 'text', group: 'Features' },
  
  // Testimonials
  '.testimonial-text': { type: 'textarea', group: 'Testimonials' },
  '.testimonial-author': { type: 'text', group: 'Testimonials' },
  '.testimonial-role': { type: 'text', group: 'Testimonials' },
  '.expert-quote': { type: 'textarea', group: 'Expert Testimonials' },
  '.expert-info h4': { type: 'text', group: 'Expert Testimonials' },
  '.expert-info p': { type: 'text', group: 'Expert Testimonials' },
  '.review-text': { type: 'textarea', group: 'Reader Reviews' },
  
  // Journey/Steps
  '.journey-step p': { type: 'textarea', group: 'Journey Steps' },
  '.step-description': { type: 'textarea', group: 'Journey Steps' },
  
  // Author/Bio
  '.author-tagline': { type: 'text', group: 'Author Bio' },
  '.author-bio': { type: 'textarea', group: 'Author Bio' },
  '.credential-text h4': { type: 'text', group: 'Author Bio' },
  '.credential-text p': { type: 'text', group: 'Author Bio' },
  
  // Content sections
  'section h3': { type: 'text', group: 'Section Headlines' },
  '.section-subtitle': { type: 'textarea', group: 'Section Content' },
  '.content-text': { type: 'textarea', group: 'Section Content' },
  
  // Lists
  '.feature-list li': { type: 'text', group: 'Features' },
  'ul li': { type: 'text', group: 'Content Lists', limit: 10 }, // Limit to avoid too many
  
  // Preview/Inside content
  '.preview-title': { type: 'text', group: 'Preview Content' },
  '.preview-prompt': { type: 'textarea', group: 'Preview Content' },
  
  // CTA sections
  '.cta-content h2': { type: 'text', group: 'Final CTA' },
  '.cta-content p': { type: 'textarea', group: 'Final CTA' },
  '.cta-guarantee': { type: 'text', group: 'Final CTA' },
  
  // Generic fallbacks
  'p.subtitle': { type: 'textarea', group: 'Content' },
  'p.description': { type: 'textarea', group: 'Content' },
  '.text-content': { type: 'textarea', group: 'Content' }
};

// Helper function to create valid Liquid variable names
function createLiquidId(selector, index, text) {
  // Create ID from selector and text content
  const selectorPart = selector.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const textPart = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `${selectorPart}_${index}_${textPart}`;
}

// Process HTML to extract text content
function extractTextContent(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const textElements = [];
  const processedElements = new Set();
  
  // Track selector counts for unique IDs
  const selectorCounts = {};
  
  // Process each selector
  Object.entries(EDITABLE_CONTENT).forEach(([selector, config]) => {
    const elements = doc.querySelectorAll(selector);
    let count = 0;
    
    elements.forEach((el, index) => {
      // Skip if already processed or empty
      if (processedElements.has(el) || !el.textContent.trim()) return;
      
      // Apply limit if specified
      if (config.limit && count >= config.limit) return;
      
      processedElements.add(el);
      count++;
      
      // Get selector count for unique ID
      selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
      
      const text = el.textContent.trim();
      const id = createLiquidId(selector, selectorCounts[selector], text);
      
      const element = {
        id,
        selector,
        text,
        type: config.type,
        group: config.group,
        label: text.substring(0, 50) + (text.length > 50 ? '...' : '')
      };
      
      // Handle button links
      if (config.isButton && el.tagName === 'A') {
        const href = el.getAttribute('href');
        if (href) {
          element.link = href;
          element.linkId = `${id}_url`;
        }
      }
      
      textElements.push(element);
    });
  });
  
  return textElements;
}

// Re-process an HTML draft
async function reprocessDraft(htmlPath, sectionPath) {
  console.log(`\n🔄 Re-processing: ${path.basename(htmlPath)}`);
  
  try {
    // Read the HTML
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // Read the existing section to get images and structure
    const existingSection = fs.readFileSync(sectionPath, 'utf-8');
    
    // Extract text content
    const textElements = extractTextContent(html);
    console.log(`   📝 Found ${textElements.length} text elements`);
    
    // Extract the existing image elements from schema
    const schemaMatch = existingSection.match(/{% schema %}([\s\S]*?){% endschema %}/);
    if (!schemaMatch) {
      console.log('   ❌ No schema found in existing section');
      return;
    }
    
    const existingSchema = JSON.parse(schemaMatch[1]);
    const existingImages = existingSchema.elements.filter(el => el.type === 'image_picker');
    
    // Build new schema with grouped elements
    const groupedElements = [];
    const groups = {};
    
    // Group text elements
    textElements.forEach(el => {
      if (!groups[el.group]) {
        groups[el.group] = [];
      }
      groups[el.group].push(el);
    });
    
    // Add elements by group
    Object.entries(groups).forEach(([groupName, elements]) => {
      // Add group header
      groupedElements.push({
        type: "header",
        content: groupName
      });
      
      // Add elements in group
      elements.forEach(el => {
        groupedElements.push({
          type: el.type,
          id: el.id,
          label: el.label,
          default: el.text
        });
        
        // Add link field for buttons
        if (el.link !== undefined) {
          groupedElements.push({
            type: "action",
            id: el.linkId,
            label: `${el.label} - Link`,
            default: el.link
          });
        }
      });
    });
    
    // Add images at the end
    if (existingImages.length > 0) {
      groupedElements.push({
        type: "header",
        content: "Images"
      });
      groupedElements.push(...existingImages);
    }
    
    // Update the schema
    existingSchema.elements = groupedElements;
    existingSchema.name = existingSchema.name.replace(' (Enhanced)', '') + ' (Enhanced)';
    
    // Replace Liquid variables in the section content
    let newContent = existingSection.substring(0, schemaMatch.index);
    
    // Replace text content with Liquid variables
    textElements.forEach(el => {
      const escapedText = el.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`>\\s*${escapedText}\\s*<`, 'g');
      newContent = newContent.replace(regex, `>{{ section.settings.${el.id} }}<`);
      
      // Also try to replace in attributes (for buttons, etc)
      if (el.link) {
        const escapedLink = el.link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const hrefRegex = new RegExp(`href="${escapedLink}"`, 'g');
        newContent = newContent.replace(hrefRegex, `href="{{ section.settings.${el.linkId} }}"`);
      }
    });
    
    // Add updated schema
    newContent += '\n{% schema %}\n' + JSON.stringify(existingSchema, null, 2) + '\n{% endschema %}';
    
    // Update the comment to indicate enhancement
    newContent = newContent.replace(
      'Auto-generated from',
      'Auto-generated (Enhanced) from'
    );
    
    // Write the enhanced section
    fs.writeFileSync(sectionPath, newContent);
    console.log(`   ✅ Enhanced with ${textElements.length} editable text fields`);
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

// Main function
async function main() {
  const draftsDir = path.join(__dirname, '..', 'llm-drafts');
  const sectionsDir = path.join(__dirname, '..', 'shared', 'sections');
  
  // Find all HTML drafts
  const htmlFiles = fs.readdirSync(draftsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(draftsDir, f));
  
  console.log(`🚀 Found ${htmlFiles.length} HTML draft(s) to process\n`);
  
  // Process each draft
  for (const htmlPath of htmlFiles) {
    const basename = path.basename(htmlPath, '.html');
    const sectionName = `page-${basename}`;
    const sectionPath = path.join(sectionsDir, `${sectionName}.liquid`);
    
    // Check if section exists
    if (fs.existsSync(sectionPath)) {
      await reprocessDraft(htmlPath, sectionPath);
    } else {
      console.log(`⏭️  Skipping ${basename} - no existing section found`);
    }
  }
  
  console.log('\n✨ Done! Remember to export your theme.');
}

// Run if called directly
main().catch(console.error);

export { extractTextContent, reprocessDraft };