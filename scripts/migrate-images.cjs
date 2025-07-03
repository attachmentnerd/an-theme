#!/usr/bin/env node

/**
 * Automated Image Migration Script
 * Converts <img> tags to use the responsive-image snippet
 * 
 * Usage: node scripts/migrate-images.js [options]
 * Options:
 *   --dry-run    Show what would be changed without modifying files
 *   --file PATH  Migrate a specific file
 *   --type TYPE  Migrate only specific image types (hero, book, avatar, etc.)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  dryRun: process.argv.includes('--dry-run'),
  specificFile: process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : null,
  imageType: process.argv.includes('--type') ? process.argv[process.argv.indexOf('--type') + 1] : null,
  paths: {
    sections: 'shared/sections/**/*.liquid',
    snippets: 'shared/snippets/**/*.liquid'
  }
};

// Image type detection patterns
const imagePatterns = {
  hero: {
    keywords: ['hero', 'banner', 'header_image', 'background_image'],
    sizes: '100vw',
    widths: '800,1200,1600,2000,2400',
    aspectRatio: '16/9',
    priority: true,
    placeholderType: 'hero'
  },
  book: {
    keywords: ['book', 'cover', 'product_image'],
    sizes: '(max-width: 767px) 280px, 400px',
    widths: '280,400,600,800',
    aspectRatio: '2/3',
    priority: false,
    placeholderType: 'book'
  },
  avatar: {
    keywords: ['avatar', 'author', 'profile', 'testimonial_image', 'team_member'],
    sizes: '60px',
    widths: '60,120,180',
    aspectRatio: '1/1',
    priority: false,
    placeholderType: 'avatar'
  },
  logo: {
    keywords: ['logo', 'brand', 'partner'],
    sizes: '(max-width: 767px) 120px, 180px',
    widths: '120,180,240,360',
    aspectRatio: 'auto',
    priority: false,
    placeholderType: 'logo'
  },
  feature: {
    keywords: ['feature', 'icon', 'illustration'],
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw',
    widths: '400,600,800,1200',
    aspectRatio: '4/3',
    priority: false,
    placeholderType: 'feature'
  },
  content: {
    keywords: ['image', 'photo', 'picture'],
    sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw',
    widths: '400,600,800,1200,1600',
    aspectRatio: '16/9',
    priority: false,
    placeholderType: 'default'
  }
};

// Regular expressions for matching img tags
const imgTagRegex = /<img\s+([^>]*?)>/gis;  // Added 's' flag for multiline
const attributeRegex = /(\w+)=["']([^"']+)["']/g;

// Statistics tracking
const stats = {
  filesProcessed: 0,
  imagesFound: 0,
  imagesMigrated: 0,
  errors: []
};

/**
 * Detect image type based on variable name and context
 */
function detectImageType(imgTag, variableName, fileContent) {
  // Check variable name against patterns
  const lowerVarName = variableName.toLowerCase();
  
  for (const [type, pattern] of Object.entries(imagePatterns)) {
    if (pattern.keywords.some(keyword => lowerVarName.includes(keyword))) {
      return type;
    }
  }
  
  // Check for loading="eager" or fetchpriority="high" indicating hero image
  if (imgTag.includes('loading="eager"') || imgTag.includes('fetchpriority="high"')) {
    return 'hero';
  }
  
  // Check for rounded-circle class indicating avatar
  if (imgTag.includes('rounded-circle')) {
    return 'avatar';
  }
  
  // Default to content type
  return 'content';
}

/**
 * Parse img tag attributes
 */
function parseImgAttributes(imgTag) {
  const attributes = {};
  let match;
  
  while ((match = attributeRegex.exec(imgTag)) !== null) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
}

/**
 * Extract variable name from src attribute
 */
function extractVariableName(src) {
  // Match patterns like {{ variable | image_picker_url: 'size' }}
  // or {{ variable | img_url: 'size' }}
  const match = src.match(/\{\{\s*([^|}\s]+(?:\.[^|}\s]+)*)\s*\|/);
  return match ? match[1].trim() : null;
}

/**
 * Convert img tag to responsive-image snippet
 */
function convertToResponsiveImage(imgTag, fileContent) {
  const attributes = parseImgAttributes(imgTag);
  const variableName = extractVariableName(attributes.src || '');
  
  if (!variableName) {
    console.warn('Could not extract variable name from:', imgTag);
    return null;
  }
  
  // Detect image type
  const imageType = detectImageType(imgTag, variableName, fileContent);
  const pattern = imagePatterns[imageType];
  
  // Check for kjb-settings-id to preserve - need to capture the whole attribute
  const kjbMatch = imgTag.match(/(kjb-settings-id=["'][^"']+["'])/);
  
  // Build responsive-image render tag
  let renderTag = `{% render 'responsive-image',\n`;
  renderTag += `  image: ${variableName},\n`;
  renderTag += `  alt: '${attributes.alt || ''}',\n`;
  
  // Add class if present
  if (attributes.class) {
    renderTag += `  class: '${attributes.class}',\n`;
  }
  
  // Add responsive attributes
  renderTag += `  sizes: '${pattern.sizes}',\n`;
  
  // Priority for hero images or if loading="eager"
  if (pattern.priority || attributes.loading === 'eager') {
    renderTag += `  priority: true,\n`;
  }
  
  // Add aspect ratio unless it's auto
  if (pattern.aspectRatio !== 'auto') {
    renderTag += `  aspect_ratio: '${pattern.aspectRatio}',\n`;
  }
  
  renderTag += `  widths: '${pattern.widths}',\n`;
  renderTag += `  placeholder_type: '${pattern.placeholderType}'`;
  
  // Add blur_up for larger images
  if (imageType !== 'avatar' && imageType !== 'logo') {
    renderTag += `,\n  blur_up: true`;
  }
  
  renderTag += `\n%}`;
  
  // Wrap in kjb-settings div if needed
  if (kjbMatch) {
    const kjbAttr = kjbMatch[1] || kjbMatch[0];
    renderTag = `<div ${kjbAttr}>\n${renderTag.split('\n').map(line => '  ' + line).join('\n')}\n</div>`;
  }
  
  return {
    original: imgTag,
    converted: renderTag,
    type: imageType,
    variableName
  };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    const conversions = [];
    
    // Find all img tags
    const matches = content.match(imgTagRegex) || [];
    stats.imagesFound += matches.length;
    
    for (const imgTag of matches) {
      // Skip if already using responsive-image
      if (content.includes('responsive-image') && 
          content.indexOf('responsive-image') < content.indexOf(imgTag)) {
        continue;
      }
      
      // Skip if it's within a comment
      const imgIndex = content.indexOf(imgTag);
      const lastCommentStart = content.lastIndexOf('{% comment %}', imgIndex);
      const lastCommentEnd = content.lastIndexOf('{% endcomment %}', imgIndex);
      if (lastCommentStart > lastCommentEnd) {
        continue;
      }
      
      // Skip background images in style attributes
      if (imgTag.includes('background')) {
        console.log('   Skipping background image:', imgTag.substring(0, 50) + '...');
        continue;
      }
      
      // Convert to responsive-image
      const conversion = convertToResponsiveImage(imgTag, content);
      
      if (conversion) {
        conversions.push(conversion);
        hasChanges = true;
        stats.imagesMigrated++;
      }
    }
    
    // Apply conversions
    if (hasChanges && !config.dryRun) {
      // Replace in reverse order to maintain string positions
      conversions.reverse().forEach(conversion => {
        newContent = newContent.replace(conversion.original, conversion.converted);
      });
      
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Migrated ${conversions.length} images`);
    } else if (hasChanges && config.dryRun) {
      console.log(`🔍 Would migrate ${conversions.length} images:`);
      conversions.forEach(c => {
        console.log(`   - ${c.variableName} (${c.type})`);
      });
    } else {
      console.log('   No images to migrate');
    }
    
    stats.filesProcessed++;
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    stats.errors.push({ file: filePath, error: error.message });
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Image Migration Script');
  console.log('========================');
  console.log(`Mode: ${config.dryRun ? 'DRY RUN' : 'LIVE'}`);
  
  if (config.specificFile) {
    // Process single file
    if (fs.existsSync(config.specificFile)) {
      processFile(config.specificFile);
    } else {
      console.error(`File not found: ${config.specificFile}`);
      process.exit(1);
    }
  } else {
    // Process all files
    const files = [
      ...glob.sync(config.paths.sections),
      ...glob.sync(config.paths.snippets)
    ];
    
    // Exclude responsive-image.liquid itself
    const filesToProcess = files.filter(f => !f.includes('responsive-image.liquid'));
    
    console.log(`Found ${filesToProcess.length} files to process\n`);
    
    filesToProcess.forEach(processFile);
  }
  
  // Print summary
  console.log('\n📊 Migration Summary');
  console.log('===================');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Images found: ${stats.imagesFound}`);
  console.log(`Images migrated: ${stats.imagesMigrated}`);
  
  if (stats.errors.length > 0) {
    console.log(`\n❌ Errors: ${stats.errors.length}`);
    stats.errors.forEach(e => {
      console.log(`   ${e.file}: ${e.error}`);
    });
  }
  
  if (config.dryRun) {
    console.log('\n⚠️  This was a dry run. No files were modified.');
    console.log('Run without --dry-run to apply changes.');
  }
}

// Run the script
main();