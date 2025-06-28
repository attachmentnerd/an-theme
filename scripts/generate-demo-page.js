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

// Lorem Ipsum generators
const LOREM = {
  // Short phrases for headings
  headings: [
    'Transform Your Life Today',
    'Discover the Science of Connection',
    'Building Secure Futures Together',
    'Evidence-Based Parenting Solutions',
    'Nurturing Bonds That Last',
    'The Path to Secure Attachment',
    'Raising Resilient Children',
    'Science Meets Heart',
    'Empowering Parents Worldwide',
    'Creating Lasting Change'
  ],
  
  // Subheadings
  subheadings: [
    'Join thousands of parents who have transformed their relationships',
    'Evidence-based strategies that actually work in real life',
    'Simple tools for complex parenting challenges',
    'Where neuroscience meets practical parenting',
    'Building secure attachment one moment at a time',
    'Transform challenging behaviors with compassion',
    'The support you need for the family you want',
    'Practical wisdom backed by decades of research'
  ],
  
  // Button text variations
  buttons: [
    'Get Started', 'Learn More', 'Join Now', 'Start Today',
    'Download Guide', 'Watch Free Video', 'Book a Call',
    'Get Instant Access', 'Sign Me Up', 'Yes, I Want This'
  ],
  
  // Paragraphs of varying lengths
  paragraphs: {
    short: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    medium: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  },
  
  // Names for testimonials
  names: [
    'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez', 'David Kim',
    'Jessica Martinez', 'Robert Taylor', 'Amanda Williams', 'Chris Lee',
    'Maria Garcia', 'John Anderson', 'Rachel Brown', 'Alex Thompson'
  ],
  
  // Titles/roles
  titles: [
    'Mother of Two', 'Parent Coach', 'Elementary Teacher', 'Child Psychologist',
    'Father of Three', 'Pediatric Nurse', 'Family Therapist', 'School Counselor',
    'CEO & Mom', 'Stay-at-Home Dad', 'Parenting Educator', 'Child Development Expert'
  ],
  
  // Testimonials
  testimonials: [
    'This program completely transformed our family dynamics. My children are more confident and our home is more peaceful.',
    'I wish I had found this resource years ago! The strategies are practical and actually work in real-life situations.',
    'As a therapist, I recommend this to all my clients. The science-based approach combined with heart makes all the difference.',
    'My anxious child is now thriving thanks to these attachment-focused techniques. We\'re all calmer and more connected.',
    'The support from this community has been invaluable. I finally feel equipped to handle challenging behaviors with confidence.'
  ],
  
  // Product/book titles
  products: [
    'The Attachment Workbook',
    'Raising Securely Attached Kids',
    'Circle of Security Parenting',
    'The Connected Child Handbook',
    'Emotional Regulation for Parents',
    'Building Resilient Families'
  ],
  
  // Email subjects for newsletter
  emailSubjects: [
    'How to Handle Tantrums with Compassion',
    'Building Trust After Difficult Moments',
    'The Science Behind Secure Attachment',
    'Creating Calm in Chaos: 5 Strategies',
    'Why Connection Matters More Than Correction'
  ],
  
  // Resource titles
  resources: [
    'Attachment Theory Quick Guide',
    'Daily Connection Activities',
    'Emotional Regulation Toolkit',
    'Secure Base Checklist',
    'Repair & Reconnect Guide'
  ],
  
  // FAQ questions
  faqQuestions: [
    'How long does it take to see results?',
    'Is this approach evidence-based?',
    'What age groups does this work for?',
    'How is this different from other parenting methods?',
    'Can I use this with neurodivergent children?'
  ],
  
  // FAQ answers
  faqAnswers: [
    'Most parents report seeing positive changes within 2-3 weeks of consistent practice. The key is consistency and patience as you build new patterns of connection.',
    'Yes! Our approach is grounded in over 50 years of attachment research and neuroscience. Every strategy we teach has been validated through rigorous scientific study.',
    'The principles of secure attachment apply from infancy through adolescence. We provide age-appropriate strategies for children from birth to 18 years.',
    'Unlike traditional behavior-focused methods, we address the root cause - the need for connection and safety. This creates lasting change rather than temporary compliance.',
    'Absolutely. In fact, children with ADHD, autism, and other neurodivergent profiles often benefit greatly from attachment-focused approaches that prioritize connection over correction.'
  ],
  
  // Features/benefits
  features: [
    'Science-based strategies',
    'Weekly live coaching calls',
    'Private community access',
    'Downloadable resources',
    'Certificate of completion',
    'Lifetime access to materials',
    'Mobile app included',
    '30-day money-back guarantee'
  ],
  
  // Stats
  stats: {
    labels: ['Happy Families', 'Years of Experience', 'Success Rate', 'Countries Reached', 'Active Members', 'Research Studies'],
    values: ['10,000+', '25', '97%', '45+', '5,000+', '200+']
  }
};

// Lorem Picsum configuration
const PICSUM_CONFIG = {
  // Base URL
  baseUrl: 'https://picsum.photos',
  
  // Size mappings
  sizes: {
    hero: { width: 1920, height: 800 },
    book: { width: 600, height: 900 },
    author: { width: 400, height: 400 },
    avatar: { width: 100, height: 100 },
    feature: { width: 800, height: 600 },
    testimonial: { width: 100, height: 100 },
    logo: { width: 200, height: 100 },
    icon: { width: 64, height: 64 },
    card: { width: 400, height: 300 },
    default: { width: 800, height: 600 }
  },
  
  // Special image IDs for consistent themes
  peopleIds: [64, 65, 91, 103, 177, 203, 334, 338, 342, 349, 433, 447, 473, 505, 548],
  natureIds: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  abstractIds: [1, 48, 82, 99, 119, 145, 168, 184, 190, 237],
  
  // Style variations
  styles: {
    grayscale: '?grayscale',
    blur: '?blur=2',
    normal: ''
  }
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

// Helper function to get random item from array
function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get Lorem Picsum URL
function getLoremPicsumUrl(context = '', imageNumber = 1, sectionName = '') {
  // Determine image type and size
  let sizeKey = 'default';
  let imageId = null;
  let style = PICSUM_CONFIG.styles.normal;
  
  // Match context to size
  if (context.includes('hero') || sectionName.includes('hero')) {
    sizeKey = 'hero';
    imageId = getRandom(PICSUM_CONFIG.natureIds);
  } else if (context.includes('book')) {
    sizeKey = 'book';
    imageId = getRandom(PICSUM_CONFIG.abstractIds);
    style = imageNumber % 2 === 0 ? PICSUM_CONFIG.styles.grayscale : '';
  } else if (context.includes('author') || context.includes('avatar') || context.includes('testimonial')) {
    sizeKey = context.includes('testimonial') ? 'testimonial' : 'author';
    imageId = getRandom(PICSUM_CONFIG.peopleIds);
  } else if (context.includes('logo')) {
    sizeKey = 'logo';
    style = PICSUM_CONFIG.styles.grayscale;
  } else if (context.includes('feature')) {
    sizeKey = 'feature';
  } else if (context.includes('card')) {
    sizeKey = 'card';
  }
  
  const size = PICSUM_CONFIG.sizes[sizeKey];
  
  // Build URL with optional ID
  if (imageId) {
    return `${PICSUM_CONFIG.baseUrl}/id/${imageId}/${size.width}/${size.height}${style}`;
  } else {
    // Use seed for consistency within a section
    const seed = sectionName + imageNumber;
    return `${PICSUM_CONFIG.baseUrl}/seed/${seed}/${size.width}/${size.height}${style}`;
  }
}

// Generate contextual Lorem content
function getLoremContent(key, context = '') {
  switch(key) {
    case 'heading':
    case 'title':
      return getRandom(LOREM.headings);
    
    case 'subheading':
    case 'subtitle':
      return getRandom(LOREM.subheadings);
    
    case 'description':
    case 'text':
      return getRandom([LOREM.paragraphs.short, LOREM.paragraphs.medium]);
    
    case 'content':
      return `<p>${LOREM.paragraphs.medium}</p><p>${LOREM.paragraphs.short}</p>`;
    
    case 'button_text':
    case 'cta_text':
      return getRandom(LOREM.buttons);
    
    case 'name':
    case 'author':
    case 'author_name':
      return getRandom(LOREM.names);
    
    case 'author_title':
    case 'role':
      return getRandom(LOREM.titles);
    
    case 'testimonial':
    case 'quote':
      return getRandom(LOREM.testimonials);
    
    case 'product_title':
    case 'book_title':
      return getRandom(LOREM.products);
    
    case 'bio':
      return LOREM.paragraphs.medium;
    
    case 'email_placeholder':
    case 'placeholder':
      return 'your@email.com';
    
    case 'label':
    case 'micro_label':
      return getRandom(['NEW', 'FEATURED', 'BESTSELLER', 'LIMITED TIME', 'POPULAR']);
    
    case 'price':
      return '$' + (Math.floor(Math.random() * 200) + 49);
    
    case 'original_price':
      return '$' + (Math.floor(Math.random() * 100) + 149);
    
    case 'discount_text':
      return 'Save ' + (Math.floor(Math.random() * 50) + 10) + '%';
    
    case 'question':
    case 'faq_question':
      return getRandom(LOREM.faqQuestions);
    
    case 'answer':
    case 'faq_answer':
      return getRandom(LOREM.faqAnswers);
    
    case 'resource_title':
    case 'resource_name':
      return getRandom(LOREM.resources);
    
    case 'email_subject':
    case 'newsletter_title':
      return getRandom(LOREM.emailSubjects);
    
    case 'video_url':
    case 'youtube_url':
      return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    
    case 'embed_code':
      return '<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>';
    
    default:
      // For stats and other specific keys
      if (key.includes('statistics') && key.includes('label')) {
        return getRandom(LOREM.stats.labels);
      }
      if (key.includes('statistics') && key.includes('value')) {
        return getRandom(LOREM.stats.values);
      }
      if (key === 'features') {
        return LOREM.features.slice(0, 4).join('|');
      }
      if (key.includes('icon')) {
        return getRandom(['fas fa-heart', 'fas fa-star', 'fas fa-check-circle', 'fas fa-shield-alt', 'fas fa-users']);
      }
      
      // Default fallback
      return `Sample ${key.replace(/_/g, ' ')}`;
  }
}

// Helper function to replace Liquid variables with demo content
function processLiquidContent(content, sectionName) {
  let processed = content;
  let imageCounter = 1;
  
  // Remove Liquid schema blocks
  processed = processed.replace(/\{%\s*schema\s*%\}[\s\S]*?\{%\s*endschema\s*%\}/g, '');
  
  // Replace section.settings variables with contextual Lorem content
  processed = processed.replace(/\{\{\s*section\.settings\.(\w+)(?:\s*\|[^}]+)?\s*\}\}/g, (match, key) => {
    const lowerKey = key.toLowerCase();
    
    // Special handling for specific keys
    if (lowerKey.includes('image') || lowerKey.includes('logo') || lowerKey.includes('avatar')) {
      return getLoremPicsumUrl(lowerKey, imageCounter++, sectionName);
    }
    
    if (lowerKey === 'link' || lowerKey === 'url' || lowerKey.includes('_url')) {
      return '#';
    }
    
    // Generate contextual content
    return getLoremContent(lowerKey, sectionName);
  });
  
  // Replace block.settings variables
  processed = processed.replace(/\{\{\s*block\.settings\.(\w+)(?:\s*\|[^}]+)?\s*\}\}/g, (match, key) => {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('image') || lowerKey.includes('logo') || lowerKey.includes('avatar')) {
      return getLoremPicsumUrl(lowerKey, imageCounter++, sectionName);
    }
    
    if (lowerKey === 'link' || lowerKey === 'url' || lowerKey.includes('_url')) {
      return '#';
    }
    
    return getLoremContent(lowerKey, sectionName);
  });
  
  // Replace standalone image variables
  processed = processed.replace(/\{\{\s*[^}]*image[^}]*\|\s*image_picker_url[^}]*\}\}/g, (match) => {
    const context = match.toLowerCase();
    return getLoremPicsumUrl(context, imageCounter++, sectionName);
  });
  
  // Handle for loops - create demo blocks with varied content
  processed = processed.replace(/\{%\s*for\s+(\w+)\s+in\s+section\.blocks\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g, (match, varName, loopContent) => {
    let demoBlocks = '';
    let numBlocks = 3;
    
    // Determine number of blocks based on section type
    if (sectionName.includes('testimonial')) numBlocks = 4;
    if (sectionName.includes('stats') || sectionName.includes('statistics')) numBlocks = 4;
    if (sectionName.includes('feature')) numBlocks = 3;
    if (sectionName.includes('faq')) numBlocks = 5;
    if (sectionName.includes('team') || sectionName.includes('coach')) numBlocks = 3;
    if (sectionName.includes('resource')) numBlocks = 4;
    
    for (let i = 1; i <= numBlocks; i++) {
      let blockContent = loopContent;
      
      // Replace block variables with unique content for each iteration
      blockContent = blockContent.replace(/\{\{\s*(?:block|item)\.settings\.(\w+)(?:\s*\|[^}]+)?\s*\}\}/g, (m, key) => {
        const lowerKey = key.toLowerCase();
        
        if (lowerKey.includes('image') || lowerKey.includes('avatar')) {
          return getLoremPicsumUrl(lowerKey, imageCounter++, sectionName);
        }
        
        // Generate unique content for each block
        if (lowerKey === 'heading' || lowerKey === 'title') {
          return LOREM.headings[(i - 1) % LOREM.headings.length];
        }
        if (lowerKey === 'name' || lowerKey === 'author') {
          return LOREM.names[(i - 1) % LOREM.names.length];
        }
        if (lowerKey === 'testimonial' || lowerKey === 'quote') {
          return LOREM.testimonials[(i - 1) % LOREM.testimonials.length];
        }
        if (lowerKey === 'role' || lowerKey === 'author_title' || lowerKey === 'title') {
          return LOREM.titles[(i - 1) % LOREM.titles.length];
        }
        if (lowerKey === 'question' || lowerKey === 'faq_question') {
          return LOREM.faqQuestions[(i - 1) % LOREM.faqQuestions.length];
        }
        if (lowerKey === 'answer' || lowerKey === 'faq_answer') {
          return LOREM.faqAnswers[(i - 1) % LOREM.faqAnswers.length];
        }
        if (lowerKey === 'stat_value' || lowerKey === 'value') {
          return LOREM.stats.values[(i - 1) % LOREM.stats.values.length];
        }
        if (lowerKey === 'stat_label' || lowerKey === 'label') {
          return LOREM.stats.labels[(i - 1) % LOREM.stats.labels.length];
        }
        
        return getLoremContent(lowerKey, sectionName);
      });
      
      // Also handle {{ block.variable }} pattern without settings
      blockContent = blockContent.replace(/\{\{\s*(?:block|item)\.(\w+)(?:\s*\|[^}]+)?\s*\}\}/g, (m, key) => {
        if (key === 'id') return `block-${i}`;
        if (key === 'type') return 'content_block';
        return '';
      });
      
      // Replace forloop variables
      blockContent = blockContent.replace(/\{\{\s*forloop\.index\s*\}\}/g, i.toString());
      blockContent = blockContent.replace(/\{\{\s*forloop\.index0\s*\}\}/g, (i - 1).toString());
      blockContent = blockContent.replace(/\{\{\s*forloop\.first\s*\}\}/g, i === 1 ? 'true' : '');
      blockContent = blockContent.replace(/\{\{\s*forloop\.last\s*\}\}/g, i === numBlocks ? 'true' : '');
      
      demoBlocks += blockContent;
    }
    
    return demoBlocks;
  });
  
  // Handle if/elsif/else statements more intelligently
  processed = processed.replace(/\{%\s*if\s+([^%]+)\s*%\}([\s\S]*?)(?:\{%\s*else\s*%\}([\s\S]*?))?\{%\s*endif\s*%\}/g, (match, condition, ifContent, elseContent) => {
    // For demo, usually show the if content unless it's checking for empty
    if (condition.includes('blank') || condition.includes('empty') || condition.includes('nil')) {
      return elseContent || '';
    }
    return ifContent;
  });
  
  // Handle unless statements
  processed = processed.replace(/\{%\s*unless\s+([^%]+)\s*%\}([\s\S]*?)\{%\s*endunless\s*%\}/g, (match, condition, content) => {
    // Unless means "if not", so show content if condition would be false
    if (condition.includes('blank') || condition.includes('empty')) {
      return content;
    }
    return '';
  });
  
  // Replace remaining Liquid variables with smart placeholders
  processed = processed.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, variable) => {
    const lowerVar = variable.toLowerCase();
    
    // Handle specific variable patterns
    if (lowerVar.includes('image') && !match.includes('section.settings') && !match.includes('block.settings')) {
      return getLoremPicsumUrl(lowerVar, imageCounter++, sectionName);
    }
    
    if (lowerVar.includes('forloop.index')) return '1';
    if (lowerVar.includes('forloop.first')) return 'true';
    if (lowerVar.includes('forloop.last')) return 'false';
    if (lowerVar.includes('class') || lowerVar.includes('id')) return '';
    if (lowerVar.includes('url') || lowerVar.includes('link') || lowerVar.includes('href')) return '#';
    if (lowerVar.includes('size') || lowerVar.includes('length') || lowerVar.includes('count')) return '3';
    if (lowerVar.includes('price')) return '$99';
    if (lowerVar.includes('date')) return new Date().toLocaleDateString();
    if (lowerVar.includes('time')) return new Date().toLocaleTimeString();
    if (lowerVar.includes('year')) return new Date().getFullYear().toString();
    
    // Handle filters
    if (variable.includes('|')) {
      const parts = variable.split('|');
      const varName = parts[0].trim();
      
      // Try to generate appropriate content based on variable name
      if (varName.includes('title') || varName.includes('heading')) {
        return getRandom(LOREM.headings);
      }
      if (varName.includes('description') || varName.includes('text')) {
        return LOREM.paragraphs.short;
      }
    }
    
    return '';
  });
  
  // Handle include statements for snippets
  processed = processed.replace(/\{%\s*(?:include|render)\s+['"]([^'"]+)['"]\s*(?:,\s*(.+?))?\s*%\}/g, (match, snippetName, params) => {
    return `<!-- Snippet: ${snippetName} ${params ? 'with params' : ''} -->`;
  });
  
  // Clean up remaining Liquid tags
  processed = processed.replace(/\{%\s*liquid[\s\S]*?%\}/g, '');
  processed = processed.replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, '');
  processed = processed.replace(/\{%\s*raw\s*%\}[\s\S]*?\{%\s*endraw\s*%\}/g, '');
  processed = processed.replace(/\{%\s*capture\s+\w+\s*%\}[\s\S]*?\{%\s*endcapture\s*%\}/g, '');
  
  // Handle assign statements
  processed = processed.replace(/\{%\s*assign\s+\w+\s*=\s*[^%]+\s*%\}/g, '');
  
  // Convert remaining Liquid tags to HTML comments
  processed = processed.replace(/\{%[^%]*%\}/g, (match) => {
    // Skip already converted ones
    if (match.includes('<!--')) return match;
    return `<!-- ${match.trim()} -->`;
  });
  
  // Add some demo-specific enhancements
  // Ensure all buttons have hover effects
  processed = processed.replace(/class="([^"]*btn[^"]*)"/g, (match, classes) => {
    if (!classes.includes('btn-')) {
      return `class="${classes} btn-primary"`;
    }
    return match;
  });
  
  // Ensure images have alt text
  processed = processed.replace(/<img([^>]+)>/g, (match, attrs) => {
    if (!attrs.includes('alt=')) {
      return `<img${attrs} alt="Demo image for ${sectionName}">`;
    }
    return match;
  });
  
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
  
  <!-- Theme CSS -->
  <link rel="stylesheet" href="shared/styles/overrides.css">
  
  <!-- Demo Styles -->
  <style>
    /* Demo-specific styles only */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: var(--c-ink-900);
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
  
  <!-- jQuery (if needed by legacy code) -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Theme JavaScript -->
  <script src="themes/website/assets/an-core.js"></script>
  <script src="themes/website/assets/an-modules.js"></script>
  
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