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

## Shared Sections (31 total)

### Core Sections
- `header.liquid` - Main site header (used by both website and landing)
- `footer.liquid` - Site footer
- `hero.liquid` - Flexible hero section
- `about_hero.liquid` - About page hero

### Content Sections
- `section.liquid` - Generic content section
- `page_content.liquid` - Page body content
- `carousel.liquid` - Testimonial/content carousel
- `testimonials.liquid` - Modern testimonial cards grid
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
- `pwyc_pricing_slider.liquid` - Pay What You Can pricing selector

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

## Component Documentation

### Pay What You Can (PWYC) Pricing Slider

**File**: `shared/sections/pwyc_pricing_slider.liquid`  
**Added**: v16.0.0 (2025-01-20)  
**Purpose**: Flexible pricing selector for course sales pages

#### Features
- 2-4 price tiers with visual selection
- Customizable price cards with icons and badges
- Auto-select suggested tier option
- Integrated scholarship link
- Mobile-optimized with scroll-snap
- Analytics tracking (GA4 compatible)
- Accessibility compliant (ARIA labels, keyboard nav)

#### Settings
- Heading and subheading text
- CTA button text
- Background style (default, white, or brand lavender)
- Auto-select suggested price toggle
- Scholarship link configuration

#### Block Settings (Price Cards)
- Price display (e.g., "$49")
- Label (e.g., "Budget", "Suggested")
- Description text
- Checkout URL (Stripe or Kajabi)
- Optional badge text
- Optional icon image

#### Usage
1. Add section: "Pay What You Can Pricing"
2. Configure 2-4 price cards
3. Set checkout URLs for each price point
4. Customize text and styling
5. Enable scholarship link if needed

#### CSS Utilities
- `.pwyc-card-grid-2/3/4` - Control grid columns
- `.pwyc-hover-lift/scale` - Hover animations
- `.pwyc-selected-glow` - Selection effect
- `.pwyc-badge-*` - Badge positioning
- `.pwyc-price-small/medium/large` - Price sizing
- `.pwyc-mobile-stack/scroll` - Mobile layouts

### Testimonials Section

**File**: `shared/sections/testimonials.liquid`  
**Added**: v16.0.0 (2025-01-20)  
**Purpose**: Display customer testimonials in a modern card grid layout

#### Features
- Grid layout (2 or 3 columns)
- Star ratings (0-5 stars)
- Customer photos with fallback avatars
- Category badges (Sleep, Behavior, Connection, etc.)
- Featured testimonial highlighting
- Statistics bar (families helped, success rate, etc.)
- Animated card entrance effects
- Optional CTA button

#### Settings
- Heading and subheading text
- Background style (default, white, or lavender)
- Column count (2 or 3)
- Statistics display toggle
- CTA button configuration

#### Block Settings (Testimonial Cards)
- Quote text
- Customer name and details
- Optional photo
- Star rating (0-5)
- Category selection
- Featured flag

#### CSS Utilities
- `.testimonial-masonry` - Pinterest-style masonry layout
- `.testimonial-minimal` - Hide author info
- `.testimonial-compact` - Smaller card padding
- `.testimonial-dark` - Dark theme variant
- `.testimonial-hover-quote/shadow` - Hover effects
- `.stars-large/small/brand/teal` - Star rating variations

## Version History

- **v16.0.0**: Added PWYC pricing slider and testimonials components
- **v10.0.6+**: Full unification of Website/Landing components
- **v10.0.3-10.0.5**: Initial shared component system
- **Pre-v10.0.3**: Separate components per theme