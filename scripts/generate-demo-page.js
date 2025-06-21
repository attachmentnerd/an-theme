const fs = require('fs');
const path = require('path');

/**
 * Generates a demo page template that includes all shared sections
 */
function generateDemoPage() {
  const sharedSectionsDir = path.join(__dirname, '../shared/sections');
  const outputPath = path.join(__dirname, '../themes/website/templates/demo.liquid');
  
  // Read all section files
  const sectionFiles = fs.readdirSync(sharedSectionsDir)
    .filter(file => file.endsWith('.liquid'))
    .map(file => file.replace('.liquid', ''));
  
  // Categorize sections
  const categories = {
    headers: [],
    heroes: [],
    content: [],
    commerce: [],
    forms: [],
    blog: [],
    social: [],
    footers: [],
    other: []
  };
  
  // Categorize each section
  sectionFiles.forEach(section => {
    if (section.includes('header') || section.includes('navigation')) {
      categories.headers.push(section);
    } else if (section.includes('hero')) {
      categories.heroes.push(section);
    } else if (section.includes('footer')) {
      categories.footers.push(section);
    } else if (section.includes('blog') || section.includes('newsletter') || section.includes('post')) {
      categories.blog.push(section);
    } else if (section.includes('product') || section.includes('pricing') || section.includes('book') || 
               section.includes('store') || section.includes('comparison') || section.includes('program')) {
      categories.commerce.push(section);
    } else if (section.includes('form') || section.includes('contact') || section.includes('cta') || 
               section.includes('two_step') || section.includes('resource')) {
      categories.forms.push(section);
    } else if (section.includes('instagram') || section.includes('social') || section.includes('member')) {
      categories.social.push(section);
    } else if (section.includes('faq') || section.includes('stats') || section.includes('feature') || 
               section.includes('testimonial') || section.includes('team') || section.includes('media') || 
               section.includes('author') || section.includes('about')) {
      categories.content.push(section);
    } else {
      categories.other.push(section);
    }
  });
  
  // Context-specific sections that shouldn't be on demo page
  const excludedSections = [
    'announcements',
    'blog_post_body',
    'blog_search_results',
    'exit_pop',
    'login',
    'page_content',
    'sales_page_body',
    'sales_page_sidebar',
    'thank_you',
    'section',
    'logo'
  ];
  
  // Generate the template
  let template = `{% comment %}
  AN Theme Demo Page - Auto-generated
  Displays all shared sections for testing
  Generated: ${new Date().toISOString()}
  Total sections: ${sectionFiles.length}
{% endcomment %}

<main class="an-demo-page">
  <!-- Demo Page Header -->
  <section class="py-5" style="background: var(--c-brand-100);">
    <div class="container text-center">
      <h1 style="font-size: var(--fs-display); color: var(--c-ink-900); margin-bottom: 1rem;">
        AN Theme Sections Demo
      </h1>
      <p style="font-size: var(--fs-body-lg); color: var(--c-ink-700); max-width: 700px; margin: 0 auto;">
        ${sectionFiles.length} shared sections available
        <br>Last generated: {{ 'now' | date: '%B %d, %Y at %I:%M %p' }}
      </p>
    </div>
  </section>

  <!-- Table of Contents -->
  <section class="py-4 sticky-top bg-white border-bottom">
    <div class="container">
      <nav class="an-demo-nav">
        <strong class="me-3">Jump to:</strong>
`;

  // Add navigation links
  const navItems = [];
  if (categories.headers.length) navItems.push('<a href="#headers" class="me-3">Headers</a>');
  if (categories.heroes.length) navItems.push('<a href="#heroes" class="me-3">Heroes</a>');
  if (categories.content.length) navItems.push('<a href="#content" class="me-3">Content</a>');
  if (categories.commerce.length) navItems.push('<a href="#commerce" class="me-3">Commerce</a>');
  if (categories.forms.length) navItems.push('<a href="#forms" class="me-3">Forms</a>');
  if (categories.blog.length) navItems.push('<a href="#blog" class="me-3">Blog</a>');
  if (categories.social.length) navItems.push('<a href="#social" class="me-3">Social</a>');
  if (categories.footers.length) navItems.push('<a href="#footers" class="me-3">Footers</a>');
  if (categories.other.length) navItems.push('<a href="#other" class="me-3">Other</a>');
  
  template += navItems.join('\n        ');
  template += `
      </nav>
    </div>
  </section>
`;

  // Add each category
  Object.entries(categories).forEach(([category, sections]) => {
    if (sections.length === 0) return;
    
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    
    template += `
  <!-- ${categoryTitle} -->
  <div id="${category}" class="an-demo-section">
    <div class="container py-3">
      <h2 class="h3 text-muted">${categoryTitle} (${sections.length})</h2>
    </div>
`;
    
    sections.forEach(section => {
      if (!excludedSections.includes(section)) {
        template += `    {% section '${section}' %}\n`;
      }
    });
    
    template += `  </div>\n`;
  });
  
  // Add excluded sections note
  template += `
  <!-- Excluded Sections Note -->
  <div class="container py-5">
    <div class="alert alert-info">
      <h4>Context-Specific Sections Not Displayed:</h4>
      <p>The following sections require specific page context and are not shown here:</p>
      <ul class="mb-0">
`;
  
  excludedSections.forEach(section => {
    if (sectionFiles.includes(section)) {
      template += `        <li>${section}.liquid</li>\n`;
    }
  });
  
  template += `      </ul>
    </div>
  </div>
</main>

<style>
  .an-demo-page {
    padding-bottom: 5rem;
  }

  .an-demo-section {
    border-top: 3px solid var(--c-ink-100);
    margin-top: 3rem;
    padding-top: 2rem;
  }

  .an-demo-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    font-size: var(--fs-body-sm);
    gap: 0.5rem;
  }

  .an-demo-nav a {
    color: var(--c-brand-600);
    text-decoration: none;
    font-weight: 500;
    transition: all var(--an-transition-base);
  }

  .an-demo-nav a:hover {
    color: var(--c-brand-800);
    text-decoration: underline;
  }

  .sticky-top {
    position: sticky;
    top: 0;
    z-index: 100;
  }

  /* Add spacing between sections */
  .an-demo-section > section,
  .an-demo-section > div[id*="shopify-section"] {
    margin-bottom: 4rem;
  }

  /* Alternate backgrounds for better visibility */
  .an-demo-section > section:nth-child(even) {
    background-color: var(--c-ink-50) !important;
  }

  /* Section labels */
  .an-demo-section > section::before,
  .an-demo-section > div[id*="shopify-section"]::before {
    content: attr(data-section-name);
    display: block;
    padding: 0.5rem 1rem;
    background: var(--c-brand-600);
    color: white;
    font-size: var(--fs-body-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>

<script>
  // Add section names to each section for identification
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.an-demo-section > section, .an-demo-section > div[id*="shopify-section"]');
    sections.forEach(section => {
      const sectionId = section.id || section.parentElement.id;
      if (sectionId && sectionId.includes('shopify-section-')) {
        const sectionName = sectionId.replace('shopify-section-', '').replace(/-/g, '_');
        section.setAttribute('data-section-name', sectionName + '.liquid');
      }
    });
  });
</script>`;
  
  // Write the file
  fs.writeFileSync(outputPath, template);
  console.log(`✅ Demo page generated with ${sectionFiles.length} sections`);
  console.log(`📍 Location: ${outputPath}`);
  
  // Return stats for logging
  return {
    total: sectionFiles.length,
    categories: Object.fromEntries(
      Object.entries(categories).map(([cat, sections]) => [cat, sections.length])
    )
  };
}

// Run if called directly
if (require.main === module) {
  generateDemoPage();
}

module.exports = generateDemoPage;