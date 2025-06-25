#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SECTIONS_PATH = path.join(__dirname, '..', 'shared', 'sections');
const OUTPUT_PATH = path.join(__dirname, '..', 'demo.html');

// Sections to skip in demo (context-specific or structural sections)
const SKIP_SECTIONS = [
  'header.liquid',
  'header_static.liquid',
  'footer.liquid',
  'footer_bio.liquid',
  'footer_modern.liquid',
  'navigation.liquid',
  'navigation_old.liquid',
  'login.liquid',
  'blog_post_body.liquid',
  'newsletter_post_body.liquid',
  'sales_page_body.liquid',
  'sales_page_sidebar.liquid',
  'blog_search_results.liquid',
  'exit_pop.liquid',
  'thank_you.liquid',
  'sticky_mobile_bar.liquid',
  'sticky_mobile_cta.liquid',
  'member_directory.liquid',
  'store_builder.liquid',
  'section.liquid',
  'page_content.liquid'
];

// Category mapping for sections
const CATEGORIES = {
  'Heroes & Headers': ['hero', 'parallax_hero', 'utility_hero', 'about_hero', 'video_hero', 'newsletter_hero', 'sa_hero'],
  'Content Sections': ['feature_showcase', 'feature_highlight', 'colored_highlight', 'journey', 'patterns', 'key_benefits'],
  'Book Showcases': ['book_showcase', 'book_buy', 'book', 'an_book_showcase', 'sa_book_showcase', 'book_testimonial_showcase'],
  'Testimonials': ['testimonials', 'book_testimonials_modern', 'sa_testimonials', 'an_testimonial_cta'],
  'CTAs & Forms': ['cta_section', 'full_width_cta', 'newsletter_cta_modern', 'two_step', 'slim_cta', 'free_chapter_cta', 'purchase_cta', 'an_contact_form'],
  'Resources': ['featured_resources', 'free_resource', 'an_resource_downloads', 'workbook_preview'],
  'Blog & Newsletter': ['blog_listings', 'newsletter_listings', 'newsletter_recent_posts'],
  'E-commerce': ['products', 'pwyc_pricing_slider', 'pwyc_slider_enhanced', 'sa_retailers', 'sa_bonuses'],
  'About & Team': ['author_bio_modern', 'sa_author_modern', 'an_team_coaches'],
  'Media & Social': ['an_media_press', 'an_instagram_feed', 'logo', 'an_logo_carousel'],
  'Data & Stats': ['an_stats_bar', 'an_comparison_table'],
  'Interactive': ['an_faq_accordion', 'an_program_cards', 'announcements'],
  'Page Templates': ['page-coaching', 'page-raising-securely-attached-kids', 'page-securely-attached']
};

// Image size mappings for different contexts
const IMAGE_SIZES = {
  hero: '1920x800',
  book: '600x900',
  author: '400x400',
  feature: '800x600',
  testimonial: '100x100',
  logo: '200x100',
  icon: '64x64',
  default: '800x600'
};

// Helper function to get category for a section
function getCategory(filename) {
  const name = filename.replace('.liquid', '').toLowerCase();
  
  for (const [category, patterns] of Object.entries(CATEGORIES)) {
    if (patterns.some(pattern => name.includes(pattern))) {
      return category;
    }
  }
  
  return 'Other Sections';
}

// Helper function to determine image size based on context
function getImageSize(content, context = '') {
  if (content.includes('hero') || context.includes('hero')) return IMAGE_SIZES.hero;
  if (content.includes('book') || context.includes('book')) return IMAGE_SIZES.book;
  if (content.includes('author') || content.includes('avatar')) return IMAGE_SIZES.author;
  if (content.includes('testimonial')) return IMAGE_SIZES.testimonial;
  if (content.includes('logo')) return IMAGE_SIZES.logo;
  if (content.includes('icon')) return IMAGE_SIZES.icon;
  if (content.includes('feature')) return IMAGE_SIZES.feature;
  return IMAGE_SIZES.default;
}

// Helper function to replace Liquid variables with demo content
function processLiquidContent(content, sectionName) {
  let processed = content;
  
  // Remove Liquid schema blocks
  processed = processed.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g, '');
  
  // Replace section settings with demo values
  const demoSettings = {
    heading: `Demo ${sectionName} Heading`,
    subheading: 'This is a demo subheading showing how this section looks with content.',
    title: `${sectionName} Title`,
    subtitle: 'Subtitle text for demonstration purposes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    button_text: 'Learn More',
    cta_text: 'Get Started',
    link: '#',
    url: '#',
    text: 'Sample text content for this section.',
    content: '<p>This is sample content demonstrating how rich text appears in this section. It can include <strong>bold text</strong>, <em>italic text</em>, and multiple paragraphs.</p><p>Second paragraph showing layout and spacing.</p>',
    label: 'Featured',
    name: 'John Doe',
    bio: 'Professional in the field with years of experience.',
    quote: 'This is an inspirational quote that demonstrates how testimonials appear in this section.',
    testimonial: 'I absolutely love this product! It has transformed the way I work.',
    author: 'Jane Smith',
    author_title: 'CEO, Example Company',
    email_placeholder: 'Enter your email',
    placeholder: 'Your email address',
    statistics_1_label: 'Happy Customers',
    statistics_1_value: '10,000+',
    statistics_2_label: 'Years of Experience', 
    statistics_2_value: '15',
    statistics_3_label: 'Success Rate',
    statistics_3_value: '98%',
    price: '$99',
    original_price: '$149',
    discount_text: 'Save 33%',
    features: 'Feature 1|Feature 2|Feature 3|Feature 4'
  };
  
  // Replace section.settings variables
  Object.entries(demoSettings).forEach(([key, value]) => {
    const patterns = [
      new RegExp(`\\{\\{\\s*section\\.settings\\.${key}\\s*\\}\\}`, 'g'),
      new RegExp(`\\{\\{\\s*section\\.settings\\.${key}\\s*\\|[^}]+\\}\\}`, 'g')
    ];
    
    patterns.forEach(pattern => {
      processed = processed.replace(pattern, value);
    });
  });
  
  // Replace block settings
  processed = processed.replace(/\{\{\s*block\.settings\.(\w+)\s*\}\}/g, (match, key) => {
    return demoSettings[key] || `Demo ${key}`;
  });
  
  // Replace image URLs with Lorem Picsum
  const imageSize = getImageSize(content, sectionName);
  let imageCounter = 1;
  processed = processed.replace(/\{\{\s*[^}]*image[^}]*\|\s*image_picker_url[^}]*\}\}/g, () => {
    return `https://picsum.photos/${imageSize}?random=${imageCounter++}`;
  });
  processed = processed.replace(/\{\{\s*section\.settings\.\w*image\w*\s*\}\}/g, () => {
    return `https://picsum.photos/${imageSize}?random=${imageCounter++}`;
  });
  processed = processed.replace(/\{\{\s*block\.settings\.\w*image\w*\s*\}\}/g, () => {
    return `https://picsum.photos/${imageSize}?random=${imageCounter++}`;
  });
  
  // Handle for loops - create demo blocks
  processed = processed.replace(/\{%\s*for\s+(\w+)\s+in\s+section\.blocks\s*%\}/g, (match, varName) => {
    let demoBlocks = '';
    for (let i = 1; i <= 3; i++) {
      demoBlocks += `<div class="demo-block-${i}">`;
    }
    return demoBlocks;
  });
  processed = processed.replace(/\{%\s*endfor\s*%\}/g, '</div></div></div>');
  
  // Replace block.type checks with demo content
  processed = processed.replace(/\{%\s*if\s+block\.type\s*==\s*['"](\w+)['"]\s*%\}/g, '<!-- Demo block type: $1 -->');
  processed = processed.replace(/\{%\s*elsif\s+block\.type\s*==\s*['"](\w+)['"]\s*%\}/g, '<!-- Demo block type: $1 -->');
  
  // Handle unless statements
  processed = processed.replace(/\{%\s*unless[^%]*%\}/g, '<!-- unless -->');
  processed = processed.replace(/\{%\s*endunless\s*%\}/g, '<!-- endunless -->');
  
  // Replace remaining Liquid variables with placeholders
  processed = processed.replace(/\{\{\s*[^}]+\}\}/g, (match) => {
    if (match.includes('forloop.index')) return '1';
    if (match.includes('forloop.first')) return 'true';
    if (match.includes('forloop.last')) return 'false';
    if (match.includes('class') || match.includes('id')) return '';
    if (match.includes('url') || match.includes('link')) return '#';
    if (match.includes('size') || match.includes('length')) return '3';
    return '';
  });
  
  // Clean up Liquid tags we don't need for demo
  processed = processed.replace(/\{%\s*liquid[\s\S]*?%\}/g, '');
  processed = processed.replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, '');
  processed = processed.replace(/\{%\s*raw\s*%\}[\s\S]*?\{%\s*endraw\s*%\}/g, '');
  
  // Convert remaining Liquid to HTML comments
  processed = processed.replace(/\{%[^%]*%\}/g, (match) => `<!-- ${match} -->`);
  
  return processed;
}

// Main function to generate demo page
function generateDemoPage() {
  console.log('🚀 Generating demo page...');
  
  // Read all section files
  const sectionFiles = fs.readdirSync(SECTIONS_PATH)
    .filter(file => file.endsWith('.liquid'))
    .filter(file => !SKIP_SECTIONS.includes(file))
    .sort();
  
  console.log(`📁 Found ${sectionFiles.length} sections to include`);
  
  // Group sections by category
  const sectionsByCategory = {};
  sectionFiles.forEach(file => {
    const category = getCategory(file);
    if (!sectionsByCategory[category]) {
      sectionsByCategory[category] = [];
    }
    sectionsByCategory[category].push(file);
  });
  
  // Start building HTML
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AN Theme - Section Demo</title>
  
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Demo Styles -->
  <style>
    :root {
      /* AN Brand Colors */
      --c-brand-600: #5E3BFF;
      --c-brand-800: #4025E0;
      --c-brand-100: #E9E6FF;
      --c-accent-teal: #18D5E4;
      --c-accent-peach: #FF8BCB;
      --c-accent-lemon: #FFE86B;
      --c-ink-900: #1A1A1A;
      --c-ink-700: #4A4A4A;
      --an-primary: #5E3BFF;
      --an-teal: #18D5E4;
      --an-coral: #FF8BCB;
      --an-gold: #FFE86B;
      --an-lavender: #E9E6FF;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    .demo-header {
      background: linear-gradient(135deg, var(--c-brand-600) 0%, var(--c-brand-800) 100%);
      color: white;
      padding: 3rem 0;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .demo-nav {
      background: #f8f9fa;
      padding: 1rem 0;
      position: sticky;
      top: 0;
      z-index: 999;
      border-bottom: 1px solid #dee2e6;
      max-height: 60vh;
      overflow-y: auto;
    }
    
    .demo-nav a {
      color: #495057;
      text-decoration: none;
      padding: 0.5rem 1rem;
      display: block;
      border-radius: 0.25rem;
      transition: all 0.3s ease;
    }
    
    .demo-nav a:hover {
      background: var(--c-brand-100);
      color: var(--c-brand-600);
    }
    
    .section-wrapper {
      margin: 2rem 0;
      position: relative;
      border: 2px dashed #dee2e6;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .section-wrapper:nth-child(even) {
      background: #f8f9fa;
    }
    
    .section-label {
      position: absolute;
      top: 0;
      left: 0;
      background: var(--c-brand-600);
      color: white;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 10;
      border-bottom-right-radius: 0.25rem;
    }
    
    .section-content {
      padding-top: 3rem;
    }
    
    .category-header {
      background: linear-gradient(to right, var(--c-brand-100), transparent);
      padding: 1.5rem;
      margin: 3rem 0 2rem 0;
      border-left: 4px solid var(--c-brand-600);
    }
    
    .category-header h2 {
      margin: 0;
      color: var(--c-brand-800);
    }
    
    .demo-footer {
      background: #212529;
      color: white;
      padding: 2rem 0;
      margin-top: 4rem;
      text-align: center;
    }
    
    /* Hide certain elements that don't work in static demo */
    [data-aos], .aos-init {
      opacity: 1 !important;
      transform: none !important;
    }
    
    /* Ensure images don't break layout */
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Button styles */
    .btn-primary {
      background: var(--c-brand-600);
      border-color: var(--c-brand-600);
    }
    
    .btn-primary:hover {
      background: var(--c-brand-800);
      border-color: var(--c-brand-800);
    }
    
    /* Quick navigation */
    .quick-nav {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 1000;
    }
    
    .quick-nav .btn {
      display: block;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <!-- Demo Header -->
  <header class="demo-header">
    <div class="container">
      <h1 class="display-4 mb-3">AN Theme Section Demo</h1>
      <p class="lead mb-0">Browse all available sections from the AN theme</p>
      <p class="mb-0"><small>Total Sections: ${sectionFiles.length} | Generated: ${new Date().toLocaleDateString()}</small></p>
    </div>
  </header>
  
  <!-- Navigation -->
  <nav class="demo-nav">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h5 class="mb-3">Quick Navigation</h5>
          <div class="row">
`;

  // Add navigation links
  Object.keys(sectionsByCategory).forEach(category => {
    const anchorId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    html += `            <div class="col-md-4 col-sm-6 mb-2">
              <a href="#${anchorId}"><i class="fas fa-folder me-2"></i>${category} (${sectionsByCategory[category].length})</a>
            </div>\n`;
  });

  html += `          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Main Content -->
  <main class="container my-5">
`;

  // Process each category
  Object.entries(sectionsByCategory).forEach(([category, sections]) => {
    const anchorId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    html += `    <div class="category-header" id="${anchorId}">
      <h2>${category}</h2>
      <p class="mb-0 text-muted">${sections.length} sections</p>
    </div>\n`;
    
    // Process each section in the category
    sections.forEach(sectionFile => {
      const sectionName = sectionFile.replace('.liquid', '');
      const sectionPath = path.join(SECTIONS_PATH, sectionFile);
      
      try {
        let content = fs.readFileSync(sectionPath, 'utf8');
        content = processLiquidContent(content, sectionName);
        
        html += `    <div class="section-wrapper">
      <div class="section-label">${sectionName}</div>
      <div class="section-content">
${content}
      </div>
    </div>\n`;
      } catch (error) {
        console.warn(`⚠️  Error processing ${sectionFile}: ${error.message}`);
        html += `    <div class="section-wrapper">
      <div class="section-label">${sectionName}</div>
      <div class="section-content">
        <div class="alert alert-warning m-3">
          <strong>Error loading section:</strong> ${error.message}
        </div>
      </div>
    </div>\n`;
      }
    });
  });

  html += `  </main>
  
  <!-- Footer -->
  <footer class="demo-footer">
    <div class="container">
      <p class="mb-0">AN Theme Demo Page | Generated on ${new Date().toLocaleDateString()}</p>
      <p class="mb-0"><small>This is a static demo showing all available sections</small></p>
    </div>
  </footer>
  
  <!-- Quick Navigation Buttons -->
  <div class="quick-nav">
    <a href="#" class="btn btn-primary btn-sm" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;">
      <i class="fas fa-arrow-up"></i> Top
    </a>
  </div>
  
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Demo Scripts -->
  <script>
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.loading = 'lazy';
      });
    }
  </script>
</body>
</html>`;

  // Write the file
  fs.writeFileSync(OUTPUT_PATH, html);
  console.log(`✅ Demo page generated successfully!`);
  console.log(`📄 Output: ${OUTPUT_PATH}`);
  console.log(`📊 Total sections: ${sectionFiles.length}`);
  console.log(`📁 Categories: ${Object.keys(sectionsByCategory).length}`);
  console.log(`\n🌐 To view the demo page:`);
  console.log(`   Open: file://${OUTPUT_PATH}`);
  console.log(`   Or run: open ${OUTPUT_PATH} (on macOS)`);
}

// Run the generator
generateDemoPage();