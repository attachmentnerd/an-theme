#!/usr/bin/env node
/**
 * AI Draft to Kajabi Section Converter
 * 
 * Converts LLM-generated HTML pages into Kajabi sections with image pickers
 * Usage: npm run inject:drafts
 * Watch: npm run inject:watch
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '../llm-drafts');
const OUT_DIR = path.join(__dirname, '../shared/sections');

// Ensure directories exist
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
}

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function processHtmlFile(filename) {
  const filepath = path.join(SRC_DIR, filename);
  const html = fs.readFileSync(filepath, 'utf8');
  
  // Parse HTML
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Extract page name from filename
  const pageName = path.parse(filename).name;
  const sectionName = `page-${pageName}`;
  
  // Build schema
  const schema = {
    name: `Page - ${pageName.charAt(0).toUpperCase() + pageName.slice(1)}`,
    class: `page-${pageName}`,
    elements: [],
    presets: [
      {
        name: `${pageName.charAt(0).toUpperCase() + pageName.slice(1)} Page`,
        category: "Pages"
      }
    ]
  };
  
  // Define smart selectors for editable content
  const EDITABLE_CONTENT = {
    // Headlines - using both tag and class selectors
    'h1': { type: 'text', group: 'Headlines' },
    'h2:not(.h3)': { type: 'text', group: 'Headlines' }, // Exclude utility classes
    '.hero h3': { type: 'text', group: 'Hero Content' },
    '.journey-step h3': { type: 'text', group: 'Journey Steps' },
    
    // Hero content
    '.hero-subtitle': { type: 'textarea', group: 'Hero Content' },
    '.bestseller-badge span:last-child': { type: 'text', group: 'Hero Content' },
    
    // Buttons
    '.btn-primary': { type: 'text', group: 'Call to Action', isButton: true },
    '.btn-secondary': { type: 'text', group: 'Call to Action', isButton: true },
    
    // Stats
    '.stat-number': { type: 'text', group: 'Statistics' },
    '.stat-label': { type: 'text', group: 'Statistics' },
    
    // Journey/Process
    '.journey-subtitle': { type: 'textarea', group: 'Journey Section' },
    '.journey-step p': { type: 'textarea', group: 'Journey Steps' },
    
    // Features
    '.feature-list li': { type: 'text', group: 'Features List' },
    
    // Testimonials
    '.expert-quote': { type: 'textarea', group: 'Expert Testimonials' },
    '.expert-info h4': { type: 'text', group: 'Expert Testimonials' },
    '.expert-info p': { type: 'text', group: 'Expert Testimonials' },
    '.review-text': { type: 'textarea', group: 'Customer Reviews' },
    '.review-name': { type: 'text', group: 'Customer Reviews' },
    
    // Author
    '.author-bio': { type: 'textarea', group: 'Author Section' },
    '.author-tagline': { type: 'text', group: 'Author Section' },
    '.credential-text h4': { type: 'text', group: 'Author Credentials' },
    '.credential-text p': { type: 'text', group: 'Author Credentials' },
    
    // CTA
    '.cta-content h2': { type: 'text', group: 'Final CTA' },
    '.cta-content p': { type: 'textarea', group: 'Final CTA' }
  };
  
  // Track which groups have been added
  const addedGroups = {};
  let elementIndex = 0;
  
  // Process text content
  Object.entries(EDITABLE_CONTENT).forEach(([selector, config]) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach((el, i) => {
      const text = el.textContent.trim();
      if (!text) return;
      
      // Generate a readable ID
      const baseId = selector.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const shortText = text.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const id = `${baseId}_${i + 1}_${shortText}`.substring(0, 50);
      
      // Add group header if needed
      if (!addedGroups[config.group]) {
        schema.elements.push({
          type: "header",
          content: config.group
        });
        addedGroups[config.group] = true;
      }
      
      // Create schema element
      const schemaElement = {
        type: config.type,
        id: id,
        label: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        default: text
      };
      
      // Add button URL if it's a button
      if (config.isButton && el.getAttribute('href')) {
        schema.elements.push(schemaElement);
        
        // Add URL field right after button text
        schema.elements.push({
          type: "action",
          id: id + '_url',
          label: text + ' - Link',
          default: el.getAttribute('href')
        });
        
        // Update element with both text and URL
        el.textContent = `{{ section.settings.${id} }}`;
        el.setAttribute('href', `{{ section.settings.${id}_url }}`);
      } else {
        schema.elements.push(schemaElement);
        
        // Replace content with Liquid variable
        el.textContent = `{{ section.settings.${id} }}`;
      }
      
      elementIndex++;
    });
  });
  
  // Process images (keeping existing logic but moving after text)
  schema.elements.push({
    type: "header",
    content: "Images"
  });
  
  const images = document.querySelectorAll('img');
  
  images.forEach((img, i) => {
    // Check for custom ID hint
    const prevComment = img.previousSibling;
    let customId = null;
    if (prevComment && prevComment.nodeType === 8) {
      const match = prevComment.textContent.match(/@id=([a-z0-9_]+)/);
      if (match) customId = match[1];
    }
    
    // Generate ID
    const alt = img.getAttribute('alt') || '';
    const id = customId || `img_${i + 1}_${alt}`.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 30);
    
    schema.elements.push({
      type: "image_picker",
      id: id,
      label: alt || `Image ${i + 1}`,
      default: img.getAttribute('src')
    });
    
    // Replace image src with Liquid (using Kajabi's image_picker_url filter)
    img.setAttribute('src', `{{ section.settings.${id} | image_picker_url: '2000x' }}`);
    img.removeAttribute('srcset');
    
    // Add responsive loading
    img.setAttribute('loading', 'lazy');
    
    // For Kajabi, alt text is static (not from image object)
    if (alt) {
      img.setAttribute('alt', alt);
    }
  });
  
  // Add SEO settings if page has meta tags
  const hasMetaTags = document.querySelector('meta[name="description"], title');
  if (hasMetaTags) {
    schema.elements.push(
      { type: "header", content: "SEO Settings" },
      { type: "text", id: "meta_title", label: "Page Title", default: document.title || "" },
      { type: "textarea", id: "meta_description", label: "Meta Description", default: document.querySelector('meta[name="description"]')?.content || "" }
    );
  }
  
  // Extract CSS styles
  const styleElements = document.querySelectorAll('style');
  let cssContent = '';
  
  if (styleElements.length > 0) {
    // Combine all style tags
    const allStyles = Array.from(styleElements).map(style => style.textContent).join('\n');
    
    // CSS Optimizer - Remove redundant styles
    let optimizedStyles = allStyles;
    
    // 1. Remove :root variables (already in overrides.css)
    optimizedStyles = optimizedStyles.replace(/:root\s*{[^}]*}/g, '');
    
    // 2. Remove common resets that are already global
    const commonResets = [
      /\*\s*{\s*margin:\s*0;\s*padding:\s*0;\s*box-sizing:\s*border-box;\s*}/g,
      /body\s*{\s*font-family:[^;]+;\s*line-height:[^;]+;\s*color:[^;]+;\s*}/g,
      /\.container\s*{\s*max-width:\s*1200px;\s*margin:\s*0\s*auto;\s*padding:\s*0\s*20px;\s*}/g
    ];
    
    commonResets.forEach(pattern => {
      optimizedStyles = optimizedStyles.replace(pattern, '');
    });
    
    // 3. Clean up empty lines and extra whitespace
    optimizedStyles = optimizedStyles
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
    
    // 4. Detect patterns that could use utility classes
    const utilityReplacements = detectUtilityOpportunities(optimizedStyles);
    
    // 5. Scope CSS to the section
    const scopedStyles = scopeCSS(optimizedStyles, sectionName);
    
    // 6. Minify CSS (basic minification)
    const minifiedStyles = minifyCSS(scopedStyles);
    
    // 7. Add utility class suggestions if found
    const utilitySuggestions = utilityReplacements.length > 0 
      ? '\n/* Consider using these utility classes instead:\n' + 
        utilityReplacements.map(r => ` * ${r}`).join('\n') + '\n */'
      : '';
    
    // 8. Add helpful comments
    cssContent = `<style>
/* Auto-generated styles for ${sectionName} */
/* Common styles removed - using theme utilities from /shared/styles/overrides.css */
/* 
 * Available utilities:
 * - Layout: container, d-flex, gap-3, max-w-xl
 * - Colors: text-navy, bg-lavender, section-peach
 * - Typography: text-4xl, font-bold, text-center
 * - Spacing: py-5, mt-4, mb-3, px-3
 * - Components: btn-primary-modern, card-modern, badge
 * - Animations: animate-fade-up, hover-lift
 */${utilitySuggestions}
${minifiedStyles}
</style>`;
  }
  
  // Helper function to detect utility class opportunities
  function detectUtilityOpportunities(css) {
    const suggestions = [];
    
    // Common patterns that could use utilities
    const patterns = [
      { regex: /text-align:\s*center/gi, utility: 'text-center' },
      { regex: /font-weight:\s*(600|700|bold)/gi, utility: 'font-bold' },
      { regex: /font-size:\s*48px/gi, utility: 'text-4xl' },
      { regex: /font-size:\s*40px/gi, utility: 'text-3xl' },
      { regex: /font-size:\s*32px/gi, utility: 'text-2xl' },
      { regex: /font-size:\s*24px/gi, utility: 'text-xl' },
      { regex: /display:\s*flex/gi, utility: 'd-flex' },
      { regex: /justify-content:\s*center/gi, utility: 'justify-content-center' },
      { regex: /align-items:\s*center/gi, utility: 'align-items-center' },
      { regex: /margin-top:\s*16px/gi, utility: 'mt-3' },
      { regex: /margin-bottom:\s*16px/gi, utility: 'mb-3' },
      { regex: /padding:\s*80px\s*0/gi, utility: 'py-5' },
      { regex: /background:\s*#E9E6FF/gi, utility: 'bg-lavender' },
      { regex: /color:\s*#5E3BFF/gi, utility: 'text-primary' }
    ];
    
    patterns.forEach(({ regex, utility }) => {
      if (regex.test(css)) {
        suggestions.push(utility);
      }
    });
    
    return [...new Set(suggestions)]; // Remove duplicates
  }
  
  // Helper function to scope CSS
  function scopeCSS(css, scopeClass) {
    // Preserve comments
    let commentIndex = 0;
    const commentMap = {};
    const cssWithPlaceholders = css.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      const placeholder = `__COMMENT_${commentIndex}__`;
      commentMap[placeholder] = match;
      commentIndex++;
      return placeholder;
    });
    
    // Scope selectors
    const scoped = cssWithPlaceholders.replace(/([^{}]+){/g, (match, selector) => {
      // Don't scope @media, @keyframes, etc
      if (selector.trim().startsWith('@')) {
        return match;
      }
      
      const cleanSelector = selector.trim();
      if (!cleanSelector) return match;
      
      // Add scope to each selector part
      const scopedSelectors = cleanSelector.split(',').map(s => {
        const trimmed = s.trim();
        if (!trimmed || trimmed.startsWith(`.${scopeClass}`)) {
          return trimmed;
        }
        return `.${scopeClass} ${trimmed}`;
      }).join(', ');
      
      return `${scopedSelectors} {`;
    });
    
    // Restore comments
    let finalCSS = scoped;
    Object.entries(commentMap).forEach(([placeholder, comment]) => {
      finalCSS = finalCSS.replace(placeholder, comment);
    });
    
    return finalCSS;
  }
  
  // Helper function to minify CSS
  function minifyCSS(css) {
    return css
      // Remove comments except our helpful ones
      .replace(/\/\*(?!.*Auto-generated|.*Common styles|.*Available utilities)[\s\S]*?\*\//g, '')
      // Remove unnecessary whitespace
      .replace(/\s+/g, ' ')
      // Remove space around specific characters
      .replace(/\s*([{}:;,])\s*/g, '$1')
      // Add newlines after } for readability
      .replace(/}/g, '}\n')
      // Remove trailing semicolon before }
      .replace(/;}/g, '}')
      .trim();
  }
  
  // Extract the body content (remove meta tags)
  const bodyContent = document.body.innerHTML;
  
  // Build Liquid template
  const liquid = `{% comment %}
  Auto-generated from ${filename}
  Generated: ${new Date().toISOString()}
  
  This is a static page section with editable images.
  To use: Create a template with {% section '${sectionName}' %}
{% endcomment %}

${cssContent}

<div class="${sectionName}">
${bodyContent}
</div>

{% schema %}
${JSON.stringify(schema, null, 2)}
{% endschema %}`;
  
  // Write to sections folder
  const outputPath = path.join(OUT_DIR, `${sectionName}.liquid`);
  fs.writeFileSync(outputPath, liquid);
  
  console.log(`✅ Generated: shared/sections/${sectionName}.liquid`);
  
  // Note: Template files are NOT created automatically
  // Users will create pages in Kajabi and add the section from "Pages" category
}

// Process all HTML files
function processAllDrafts() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.html'));
  
  if (files.length === 0) {
    console.log('ℹ️  No HTML drafts found in llm-drafts/');
    return;
  }
  
  console.log(`\n🚀 Processing ${files.length} draft(s)...\n`);
  
  files.forEach(file => {
    try {
      processHtmlFile(file);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\n✨ Done! Remember to export your theme with: npm run theme:export website\n');
}

// Run
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllDrafts();
}

export { processHtmlFile, processAllDrafts };