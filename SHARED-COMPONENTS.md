# Shared Components System

## Overview

As of v10.0.6+, the AN Kajabi themes use a unified shared component architecture where Website and Landing themes share ALL components, while Product theme remains separate due to its unique course-specific functionality.

## Architecture

```
/shared/
├── styles/
│   └── overrides.css          # All common CSS (1,321 lines)
├── snippets/                  # 107 shared snippets
│   ├── Navigation & Headers
│   ├── Footers
│   ├── Content Blocks
│   ├── Forms & CTAs
│   ├── Blog Components
│   ├── Newsletter Components
│   └── Utility Components
└── sections/                  # 29 shared sections
    ├── Heroes & CTAs
    ├── Content Sections
    ├── Blog & Newsletter
    ├── E-commerce
    └── Utility Sections
```

## Theme Structure

### Website Theme
- **Sections**: 0 (all in shared)
- **Snippets**: 0 (all in shared)
- **Purpose**: Full-featured marketing site with blog, newsletter, and e-commerce
- **Uses**: All shared components

### Landing Theme  
- **Sections**: 0 (all in shared)
- **Snippets**: 0 (all in shared)
- **Purpose**: Focused landing pages for campaigns
- **Uses**: All shared components (user selects which to use)

### Product Theme
- **Sections**: Theme-specific (course functionality)
- **Snippets**: Theme-specific (course UI components)
- **Purpose**: Course/product delivery
- **Uses**: Only shared CSS, maintains separate components

## Shared Sections (29 total)

### Core Sections
- `header.liquid` - Main site header
- `header_landing.liquid` - Simplified landing page header
- `footer.liquid` - Site footer
- `hero.liquid` - Flexible hero section
- `about_hero.liquid` - About page hero

### Content Sections
- `section.liquid` - Generic content section
- `page_content.liquid` - Page body content
- `carousel.liquid` - Testimonial/content carousel
- `book.liquid` - Book showcase
- `book_buy.liquid` - Book purchase links

### CTA & Conversion
- `cta_section.liquid` - Gradient CTA section
- `full_width_cta.liquid` - Full-width image CTA
- `exit_pop.liquid` - Exit intent popup
- `two_step.liquid` - Two-step opt-in

### Blog & Newsletter
- `blog_listings.liquid` - Blog post grid
- `blog_post_body.liquid` - Single blog post
- `blog_search_results.liquid` - Blog search
- `newsletter_hero.liquid` - Newsletter signup hero
- `newsletter_listings.liquid` - Newsletter archive
- `newsletter_post_body.liquid` - Newsletter post
- `newsletter_recent_posts.liquid` - Recent newsletters

### E-commerce
- `products.liquid` - Product grid
- `store_builder.liquid` - Store layout
- `sales_page_body.liquid` - Sales page content
- `sales_page_sidebar.liquid` - Sales page sidebar

### Utility
- `announcements.liquid` - Site announcements
- `login.liquid` - Login form
- `member_directory.liquid` - Member listing
- `thank_you.liquid` - Thank you page

## Shared Snippets (107 total)

The shared snippets include all UI components, form elements, navigation parts, and utility functions used across both Website and Landing themes.

## CSS Architecture

### Shared CSS (`/shared/styles/overrides.css`)
- 1,321 lines of consolidated styles
- AN brand design system
- Component styles for all shared elements
- Responsive utilities
- Animation and transition effects

### Theme-Specific CSS
- **Website**: Empty (uses 100% shared)
- **Landing**: Empty (uses 100% shared)  
- **Product**: Course-specific styles only

## Build Process

The `theme-manager.js` script handles the build process:

1. Copies theme base files
2. Copies ALL shared snippets (overwrites existing)
3. Copies ALL shared sections (overwrites existing)
4. Merges shared CSS + theme CSS
5. Creates versioned export

## Benefits

1. **Complete Unification**: Website and Landing themes are truly unified
2. **Single Source of Truth**: One place to update components
3. **No Duplication**: Zero duplicate code between Website/Landing
4. **Maximum Flexibility**: Landing pages can use any component
5. **Easier Maintenance**: Update once, deploy everywhere
6. **Consistent Experience**: Guaranteed parity between themes

## Development Workflow

### Adding New Components

1. **Sections**: Add to `/shared/sections/`
2. **Snippets**: Add to `/shared/snippets/`
3. **Styles**: Add to `/shared/styles/overrides.css`
4. **Export**: Run `npm run theme:export website` or `landing`

### Modifying Components

1. Edit the file in `/shared/`
2. Test with both themes
3. Export both themes when ready

### Theme-Specific Customization

For Website/Landing differences:
- Use Liquid conditionals checking theme type
- Use CSS classes with theme prefixes
- Leverage section settings for variations

## Best Practices

1. **Component Naming**: Use descriptive, purpose-based names
2. **Documentation**: Comment complex components
3. **Settings**: Make components flexible via settings
4. **Testing**: Always test in both Website and Landing contexts
5. **Versioning**: Update version numbers when making changes

## Version History

- **v10.0.6+**: Full unification of Website/Landing components
- **v10.0.3-10.0.5**: Initial shared component system
- **Pre-v10.0.3**: Separate components per theme