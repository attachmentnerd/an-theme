# AN Kajabi Themes - Development Guide

This guide documents the CSS architecture and development conventions for the AN (Attachment Nerd) Kajabi themes to prevent breaking changes and maintain consistency.

## ⚠️ IMPORTANT: Unified Architecture (v10.0.6+)

**Website and Landing themes now share 100% of their components!**
- ALL sections and snippets live in `/shared/`
- Theme folders only contain configuration files
- Any changes to shared components affect BOTH themes
- Product theme remains completely separate

## Brand Identity
**Mission**: Equip every caregiver with science-backed, relationship-building tools so children grow up feeling safe, seen, soothed, and secure.
**Tagline**: "Deep Science, Practical Parenting, Secure Futures."

## Theme Structure

The project contains three distinct themes:
1. **Website Theme** (`/themes/website/`) - Main marketing and content pages
2. **Landing Theme** (`/themes/landing/`) - Focused landing pages
3. **Product Theme** (`/themes/product/`) - Product/course pages

### Shared Component Architecture (FULLY UNIFIED)

As of v10.0.6+, Website and Landing themes are FULLY UNIFIED, sharing 100% of components:

```
/shared/
├── styles/
│   └── overrides.css      # All CSS (1,321 lines)
├── snippets/              # 107 snippets (ALL from website)
│   ├── Navigation (header blocks, menus)
│   ├── Footer components
│   ├── Content blocks
│   ├── Blog components
│   ├── Newsletter components
│   ├── E-commerce elements
│   └── Utility snippets
└── sections/              # 29 sections (ALL from website)
    ├── Headers & Heroes
    ├── Content sections
    ├── Blog & Newsletter
    ├── E-commerce
    └── Utility sections
```

**Complete Unification:**
- Website Theme: 0 local components (100% shared)
- Landing Theme: 0 local components (100% shared)
- Product Theme: Separate (course-specific)

**How it works:**
1. ALL components live in `/shared/`
2. Theme folders only contain config files
3. Build process copies everything from shared
4. No theme-specific overrides needed for Website/Landing

## CSS Architecture

### Overview
We use a **hybrid CSS Variables + organized overrides.css** approach for maintainable, scalable styling across all themes.

### 1. CSS Variables Design System - Modern Brand
All CSS variables are now defined in `/shared/styles/overrides.css` and load automatically with the theme:
```css
:root {
  /* Core Brand Colors */
  --c-brand-600: #5E3BFF;      /* Brand Primary - Buttons, links */
  --c-brand-800: #4025E0;      /* Brand Dark - Hover states */
  --c-brand-100: #E9E6FF;      /* Brand Light - Backgrounds */
  --c-accent-teal: #18D5E4;    /* Accent Teal */
  --c-accent-peach: #FF8BCB;   /* Accent Peach */
  --c-accent-lemon: #FFE86B;   /* Accent Lemon */
  
  /* Legacy AN mappings for compatibility */
  --an-primary: #5E3BFF;
  --an-teal: #18D5E4;
  --an-coral: #FF8BCB;
  --an-gold: #FFE86B;
  --an-lavender: #E9E6FF;
  
  /* Typography, Spacing, Shadows, etc. */
  /* All design system variables... */
}
```

**Benefits:**
- Consistent design tokens across themes
- Easy to update globally
- Works with Kajabi's platform
- No build process required

### 2. File Structure (Updated with Shared System)
```
/shared/styles/overrides.css     - Shared CSS for all themes (EDIT THIS FOR COMMON STYLES)
/themes/[theme]/assets/
  ├── styles.scss.liquid         - Main theme styles (DO NOT EDIT - compiled by Kajabi)
  ├── overrides.css             - Theme-specific overrides only (MOSTLY EMPTY)
  └── global_custom_css         - User settings CSS from theme editor

During build:
- shared/styles/overrides.css + theme/assets/overrides.css → merged overrides.css
```

### 3. overrides.css Organization
```css
/* ==========================================================================
   AN Theme Custom Styles
   Version: X.X.X
   ========================================================================== */

/* Table of Contents
   1. CSS Variables (Brand Design System)
   2. Typography Base
   3. Common Button Styles
   4. Shared Navigation Styles
   5. Shared Footer Styles
   6. Utility Classes
   7. Responsive Helpers
   ...
   14. Comprehensive Utility Classes
   15. About Hero Section
   16. Responsive Utilities
   17. Component-Specific Utilities
*/
```

### 4. CSS Naming Conventions
The themes use **BEM-like naming** with Kajabi-specific patterns:
- Block: `.header`, `.section`, `.block`
- Element: `.header__content`, `.header__nav`, `.block__title`
- Modifier: `.header--fixed`, `.btn--primary`, `.hidden--mobile`
- Special: `.hamburger--slice-1` (numbered variants)

### 5. Adding New Components (Updated for Full Unification)

#### For ALL Website/Landing Components:
**IMPORTANT**: Website and Landing themes now share 100% of components. Always add to shared:

##### New Sections:
Add to `/shared/sections/[section-name].liquid`

##### New Snippets:
Add to `/shared/snippets/[snippet-name].liquid`

##### New Styles:
Add to `/shared/styles/overrides.css`:
```css
/* ==========================================================================
   Section: [Section Name]
   Added: [Date]
   ========================================================================== */
.section-name {
  padding: var(--an-space-xl) 0;
  background: var(--an-bg-light);
}
```

#### For Product Theme Only:
Add to `/themes/product/` folders (sections, snippets, assets)

#### Build Process:
Run `npm run theme:export [theme]` to build with all shared components

## Critical CSS Components

### Hamburger Menu (DO NOT MODIFY WITHOUT TESTING)
The hamburger menu uses a specific 4-slice structure that MUST be maintained:

```html
<div class="hamburger">
  <div class="hamburger__slices">
    <div class="hamburger__slice hamburger--slice-1"></div>
    <div class="hamburger__slice hamburger--slice-2"></div>
    <div class="hamburger__slice hamburger--slice-3"></div>
    <div class="hamburger__slice hamburger--slice-4"></div>
  </div>
</div>
```

**⚠️ WARNING**: Changing this structure (e.g., to 3 lines or using `<span>` elements) will break the CSS animations and cause visual issues.

### Header Styles
The header component has complex state management:
- `.header` - Base header
- `.header--fixed` - Sticky header state
- `.header__content--desktop` - Desktop-specific content
- `.header__content--mobile` - Mobile menu container

Color settings are controlled via Liquid variables:
- `section.settings.text_color` - Default text color
- `section.settings.mobile_header_text_color` - Mobile override
- `section.settings.hamburger_color` - Hamburger lines color
- `section.settings.sticky_hamburger_color` - Sticky state color

## CSS Load Order

1. `styles.scss.liquid` - Main theme styles (compiled - DO NOT EDIT DIRECTLY)
2. `overrides.css` - Custom user styles (USE THIS FOR CUSTOM CSS)
3. Inline `<style>` blocks in section files

**⚠️ IMPORTANT**: Never append CSS directly to styles.scss.liquid as it's a compiled file. Always use overrides.css for custom CSS additions.

## Responsive Design

### Breakpoints
- Mobile: `max-width: 767px`
- Tablet: `768px - 991px` 
- Desktop: `992px+`

### Visibility Classes
- `.hidden--mobile` - Hidden on mobile
- `.hidden--desktop` - Hidden on desktop
- `.hidden--tablet` - Hidden on tablet

## CSS Variable Reference

### Attachment Nerd Brand Colors
```css
/* Core Brand Colors */
--an-navy: #1A2D4E;            /* Primary headings, buttons */
--an-teal: #2AB3B1;            /* Interactive states, charts */
--an-coral: #F57C6F;           /* Emotional CTAs, alerts */
--an-gold: #FFC63F;            /* Highlights, icons */
--an-plum: #A449A5;            /* Depth accents, links */
--an-peach: #FFF4F0;           /* Soft backgrounds */
--an-white: #FFFFFF;           /* Base */
--an-grey: #F8F7F5;            /* Secondary backgrounds */
--an-slate: #3A4A63;           /* Body text */

/* Legacy Mappings */
--an-primary: var(--an-navy);
--an-secondary: var(--an-teal);
--an-text-dark: var(--an-slate);
--an-bg-light: var(--an-grey);
```

### Spacing System
```css
--an-space-xs: 4px;    /* Tight spacing */
--an-space-sm: 8px;    /* Small spacing */
--an-space-md: 16px;   /* Default spacing */
--an-space-lg: 24px;   /* Large spacing */
--an-space-xl: 32px;   /* Extra large */
--an-space-2xl: 48px;  /* 2X large */
--an-space-3xl: 64px;  /* 3X large */
```

### Typography Scale
```css
--an-font-xs: 0.75rem;    /* 12px */
--an-font-sm: 0.875rem;   /* 14px */
--an-font-base: 1rem;     /* 16px */
--an-font-lg: 1.125rem;   /* 18px */
--an-font-xl: 1.25rem;    /* 20px */
--an-font-2xl: 1.5rem;    /* 24px */
--an-font-3xl: 1.875rem;  /* 30px */
--an-font-4xl: 2.25rem;   /* 36px */
```

### Other Design Tokens
```css
/* Borders & Radius */
--an-border: rgba(26, 45, 78, 0.1);
--an-radius-sm: 4px;
--an-radius-md: 8px;
--an-radius-lg: 16px;
--an-radius-full: 9999px;

/* Shadows */
--an-shadow-sm: 0 1px 2px 0 rgba(26, 45, 78, 0.05);
--an-shadow-md: 0 4px 6px -1px rgba(26, 45, 78, 0.1);
--an-shadow-lg: 0 10px 15px -3px rgba(26, 45, 78, 0.1);

/* Transitions */
--an-transition-fast: 150ms ease-in-out;
--an-transition-base: 200ms ease-in-out;
--an-transition-slow: 300ms ease-in-out;
```

## Comprehensive Utility Classes (v11.1.0+)

The AN themes now include an extensive utility class system that leverages the CSS variables design system. This eliminates the need to redeclare colors and styles in section CSS.

### Color Utilities
```html
<!-- Text colors -->
<p class="text-navy">Navy text</p>
<p class="text-teal">Teal text</p>
<p class="text-coral">Coral text</p>
<p class="text-slate">Slate text</p>

<!-- Background colors -->
<div class="bg-peach">Peach background</div>
<div class="bg-grey">Grey background</div>
<section class="section-navy">Navy section with white text</section>
```

### Typography Utilities
```html
<!-- Font sizes -->
<h1 class="text-4xl">Extra large heading</h1>
<p class="text-lg">Large paragraph text</p>
<small class="text-xs">Extra small text</small>

<!-- Font weight -->
<p class="font-bold">Bold text</p>
<p class="font-medium">Medium weight text</p>

<!-- Text transform -->
<p class="uppercase tracking-wide">UPPERCASE WITH SPACING</p>
<p class="capitalize">Capitalize Each Word</p>

<!-- Alignment -->
<p class="text-center">Centered text</p>
<p class="text-right">Right aligned</p>
```

### Spacing Utilities
```html
<!-- Margin (m) and Padding (p) -->
<!-- Format: {property}{direction}-{size} -->
<!-- Directions: t(top), r(right), b(bottom), l(left), x(horizontal), y(vertical) -->
<!-- Sizes: 0-6 mapping to space variables -->

<div class="mt-4 mb-2">Margin top 4, bottom 2</div>
<div class="px-3 py-4">Padding x-axis 3, y-axis 4</div>
<div class="m-auto">Auto margins (centered)</div>

<!-- Responsive spacing -->
<div class="mt-2 mt-4--tablet-up">Different spacing on tablet+</div>
```

### Layout Utilities
```html
<!-- Display -->
<div class="d-flex">Flexbox container</div>
<div class="d-none d-block--tablet-up">Hidden on mobile</div>

<!-- Flexbox -->
<div class="d-flex justify-content-between align-items-center">
  <div>Left content</div>
  <div>Right content</div>
</div>

<!-- Gap utilities -->
<div class="d-flex gap-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Position -->
<div class="position-relative">
  <div class="position-absolute top-0 right-0">Corner badge</div>
</div>

<!-- Width/Height -->
<div class="w-full h-screen">Full width, viewport height</div>
<div class="max-w-md mx-auto">Max width medium, centered</div>
```

### Border & Shadow Utilities
```html
<!-- Borders -->
<div class="border border-teal rounded-lg">Teal bordered box</div>
<div class="border-bottom pb-3 mb-3">Bottom border divider</div>

<!-- Shadows -->
<div class="shadow-lg rounded p-4">Large shadow card</div>
<div class="card-shadow">Hover effect shadow</div>
```

### Component Utilities
```html
<!-- Buttons -->
<button class="btn btn-navy">Navy button</button>
<button class="btn btn-coral">Coral CTA button</button>
<button class="btn btn-outline-teal">Outlined teal button</button>

<!-- Badges -->
<span class="badge badge-gold">NEW</span>
<span class="badge badge-teal">FEATURED</span>

<!-- Sections -->
<section class="section-peach py-5">
  <!-- Peach background with appropriate text color -->
</section>

<!-- Cards -->
<div class="card-border card-shadow p-4">
  <!-- Bordered card with shadow -->
</div>
```

### State & Animation Utilities
```html
<!-- Hover effects -->
<button class="hover-lift">Lifts on hover</button>
<div class="hover-shadow">Shadow on hover</div>

<!-- States -->
<button class="disabled">Disabled button</button>
<a class="active">Active navigation item</a>

<!-- Animations -->
<div class="animate-fade-in">Fades in</div>
<div class="animate-slide-up">Slides up</div>

<!-- Transitions -->
<div class="transition-all hover-opacity">Smooth opacity change</div>
```

### Responsive Utilities
```html
<!-- Visibility -->
<div class="hidden--mobile">Hidden on mobile</div>
<div class="hidden--desktop">Hidden on desktop</div>

<!-- Responsive text -->
<h2 class="text-2xl text-3xl--tablet-up">Responsive heading</h2>

<!-- Responsive layout -->
<div class="flex-column flex-row--tablet-up">
  <!-- Column on mobile, row on tablet+ -->
</div>
```

### Best Practices for Utility Classes

1. **Use utilities instead of inline styles**:
   ```html
   <!-- ❌ Don't -->
   <div style="background-color: #FFF4F0; padding: 32px;">
   
   <!-- ✅ Do -->
   <div class="bg-peach p-4">
   ```

2. **Combine utilities for complex layouts**:
   ```html
   <section class="section-grey py-5">
     <div class="max-w-xl mx-auto text-center">
       <h2 class="text-3xl font-bold text-navy mb-3">Title</h2>
       <p class="text-lg text-slate">Description</p>
     </div>
   </section>
   ```

3. **Use responsive utilities for mobile-first design**:
   ```html
   <div class="px-3 px-5--tablet-up">
     <h1 class="text-2xl text-4xl--tablet-up">Responsive heading</h1>
   </div>
   ```

4. **Leverage component utilities for consistency**:
   ```html
   <button class="btn btn-coral hover-lift">
     Get Started
   </button>
   ```

### Usage Example
```css
.my-section {
  padding: var(--an-space-xl) 0;
  background: var(--an-bg-light);
  border-top: 1px solid var(--an-border);
}

.my-section__title {
  color: var(--an-text-dark);
  margin-bottom: var(--an-space-md);
}
```

## Best Practices

### DO:
1. **Use CSS variables** for all colors, spacing, and common values
2. **Use utility classes** instead of inline styles or redeclaring colors
3. **Add ALL Website/Landing components to /shared/** folders
4. **Add Product-specific components to /themes/product/**
5. **Test on multiple devices** before deploying CSS changes
6. **Maintain the 4-slice hamburger structure**
7. **Document new sections** with date and purpose
8. **Use semantic variable names** (e.g., `--an-primary` not `--blue`)
9. **Run `npm run theme:export [theme]`** to build themes with shared components
10. **Test in BOTH Website and Landing** contexts when modifying shared components
11. **Leverage utility classes** for consistent styling across sections

### DON'T:
1. **Don't edit styles.scss.liquid** - it's compiled by Kajabi
2. **Don't add Website/Landing components to theme folders** - use shared
3. **Don't modify hamburger menu structure** without extensive testing
4. **Don't use hard-coded colors** - use CSS variables or utility classes
5. **Don't use `!important`** unless in utility classes
6. **Don't forget to test** in Kajabi's preview mode
7. **Don't create theme-specific versions** of Website/Landing components
8. **Don't redeclare colors in section CSS** - use utility classes instead

## Version Management

When making CSS changes:
1. Increment version number in `settings_schema.json`
2. Test all three themes if making shared component changes
3. Document breaking changes in commit messages
4. Use semantic versioning (major.minor.patch)

## CSS Debugging Tips

1. **Check cascade order**: Later styles override earlier ones
2. **Verify Liquid variables**: Use browser inspector to see compiled CSS
3. **Test mobile menu**: Always test hamburger menu functionality
4. **Check z-index hierarchy**: Modal/dropdown stacking contexts
5. **Validate responsive behavior**: Test all breakpoints

## Common Issues and Solutions

### Issue: Hamburger menu not animating
**Cause**: Structure changed from 4 slices
**Solution**: Restore original 4-slice structure

### Issue: Styles not applying
**Cause**: Liquid conditionals preventing output
**Solution**: Check section settings and defaults

### Issue: Mobile menu overlapping content
**Cause**: z-index conflicts
**Solution**: Maintain z-index hierarchy (header: 100, mobile-menu: 1000)

## Theme-Specific Notes (Updated for Full Unification)

### Website Theme
- **Components**: 100% shared with Landing
- **Purpose**: Full-featured marketing site
- **Includes**: Blog, newsletter, e-commerce sections
- **Local files**: Config only (settings_schema.json)

### Landing Theme  
- **Components**: 100% shared with Website
- **Purpose**: Campaign/conversion focused pages
- **Access to**: ALL components (user chooses which to use)
- **Local files**: Config only (settings_schema.json)

### Product Theme
- **Components**: Completely separate
- **Purpose**: Course delivery platform
- **Unique**: Different CSS structure, no hamburger menu
- **Local files**: All components are theme-specific

## Cross-Theme CSS Management (Updated with Shared System)

### Implementing Changes Across All Themes

With the shared component system, cross-theme management is simplified:

1. **Common CSS** - Edit `/shared/styles/overrides.css`:
   - Automatically included in all theme builds
   - No manual copying required
   - Single source of truth

2. **Theme-Specific CSS** - Edit individual theme files only when needed:
   ```
   themes/website/assets/overrides.css  # Usually empty
   themes/landing/assets/overrides.css   # Hero/feature styles only
   themes/product/assets/overrides.css   # Course-specific styles
   ```

3. **CSS Variables** - Still defined in each theme's header.liquid:
   - `/themes/website/sections/header.liquid`
   - `/themes/landing/sections/header.liquid`
   - `/themes/product/sections/header.liquid`

### CSS Workflow (Simplified)

1. **Development**: Edit `/shared/styles/overrides.css` for common styles
2. **Build**: Run `npm run export [theme]` or `npm run export:all`
3. **Testing**: Validate in Kajabi preview
4. **Version**: Themes automatically versioned during export

## Testing Checklist

Before deploying CSS changes:
- [ ] Test hamburger menu animation
- [ ] Check mobile menu open/close
- [ ] Verify sticky header behavior  
- [ ] Test all responsive breakpoints
- [ ] Validate in Kajabi theme editor
- [ ] Check for console errors
- [ ] Test with different color settings
- [ ] Verify CSS variables are loading
- [ ] Check overrides.css is applied correctly
- [ ] Test on actual mobile devices

Remember: The CSS in these themes is tightly integrated with Kajabi's platform. Always test thoroughly in the Kajabi environment before releasing changes.

## Build Process and Commands

The project uses a Node.js build system to manage shared components:

### Available Commands:

```bash
# Export themes with version control (recommended)
npm run theme:export website patch "Fixed navigation styles"
npm run theme:export landing minor "Added new hero section"
npm run theme:export product major "Complete redesign"

# Generate demo page with all sections
npm run demo:generate

# Export all themes at once
npm run export:all

# Clean build artifacts
npm run clean
```

#### Version Bump Types:
- `patch`: Bug fixes, small changes (1.0.0 → 1.0.1)
- `minor`: New features, backwards compatible (1.0.0 → 1.1.0)  
- `major`: Breaking changes (1.0.0 → 2.0.0)

#### Legacy Export Commands:
```bash
# Auto-increments patch version (deprecated - use theme:export instead)
npm run export website    # Exports website theme
npm run export landing    # Exports landing theme  
npm run export product    # Exports product theme
```

**Note**: Always use `npm run theme:export` with version type and message for better version tracking.

### What happens during build:
1. Creates temporary build directory
2. Generates demo page for website theme (auto-updates section list)
3. Copies theme files to build directory
4. Copies shared snippets (overwrites if exists)
5. Copies shared sections (doesn't overwrite existing)
6. Merges shared CSS + theme CSS into final overrides.css
7. Creates versioned ZIP file in `/exports/releases/`
8. Cleans up temporary files

### Demo Page Feature

The website theme includes an auto-generated demo page that displays all shared sections:

1. **Access**: Navigate to `/pages/demo` in your Kajabi site after uploading the theme
2. **Auto-generation**: The demo page is automatically updated during website theme builds
3. **Manual generation**: Run `npm run demo:generate` to update the demo page
4. **Features**:
   - Displays all 66+ shared sections organized by category
   - Quick navigation menu to jump to section types
   - Shows total section count and last generated timestamp
   - Excludes context-specific sections (like blog post body, login, etc.)
   - Each section is labeled for easy identification
   - Alternating backgrounds for better visual separation

This is incredibly useful for:
- Testing all sections after CSS changes
- Showcasing available sections to clients
- Quick visual QA during development
- Finding the right section for a specific need

### Build Configuration:
- Edit `scripts/theme-manager.js` to modify build process
- Version numbers auto-increment on each export
- Exports saved to `/exports/releases/v[version]/`

## JavaScript Architecture (NEW)

### Modern JavaScript Implementation (v11.0.0+)

The AN themes now use a modern, modular JavaScript approach replacing the legacy 980KB scripts.js bundle:

#### Core Scripts (~20KB total)
1. **an-core.js** (12KB) - Essential functionality:
   - Mobile menu handler (vanilla JS)
   - Sticky header logic
   - Dropdown menus
   - Smooth scrolling
   - Countdown timers (no moment.js)
   - Component lazy loading

2. **an-modules.js** (8KB) - Feature modules:
   - Social sharing
   - Event videos
   - Two-step opt-ins
   - Responsive video embeds
   - Search filters

#### Conditional Loading Strategy
```liquid
<!-- In an_scripts.liquid -->
<!-- Core always loads -->
{{ 'an-core.js' | asset_url | script_tag }}
{{ 'an-modules.js' | asset_url | script_tag }}

<!-- Heavy libraries load only when needed -->
{% if page.content contains 'data-aos' %}
  <!-- AOS loads from CDN -->
{% endif %}

{% if has_countdown %}
  <!-- Moment.js loads from CDN -->
{% endif %}
```

#### Performance Improvements
- **Bundle size**: 980KB → 20KB (98% reduction)
- **jQuery**: Optional, only if Kajabi requires
- **AOS**: Lazy loaded from CDN when needed
- **Moment.js**: CDN loaded only for countdown sections
- **Slick Carousel**: CDN loaded only if carousels exist

#### Migration Notes
1. Replace `{{ "scripts.js" | asset_url | script_tag }}` with `{% include "an_scripts" %}`
2. All jQuery functionality replaced with vanilla JS
3. Native Date API for countdowns (moment.js optional)
4. CSS transitions replace jQuery animations
5. Modern ES6+ features with broad browser support

## Version History

### v11.1.0 (2025-01-18)
- **COMPREHENSIVE UTILITY CLASSES**: Extensive utility-first CSS system
- Added 600+ utility classes leveraging existing CSS variables
- Complete spacing utilities (margin/padding all directions)
- Typography utilities (sizes, weights, transforms, alignment)
- Layout utilities (display, flexbox, position, sizing)
- Component utilities (buttons, badges, sections, cards)
- Responsive utilities with mobile-first approach
- Animation and transition utilities
- Eliminates need to redeclare colors in section CSS
- Updated CLAUDE.md with comprehensive utility documentation
- overrides.css grew from 1,321 to 1,889 lines

### v11.0.0 (2025-01-18)
- **MODERN JAVASCRIPT**: Complete JavaScript architecture overhaul
- Replaced 980KB scripts.js bundle with 20KB modular approach
- Created an-core.js with essential vanilla JS functionality
- Created an-modules.js with feature-specific modules
- Implemented conditional loading for heavy libraries (AOS, moment.js, Slick)
- Removed jQuery dependency (loads only if Kajabi requires)
- Native Date API for countdowns instead of moment.js
- CSS transitions replace jQuery slideToggle animations
- Lazy loading for all non-critical JavaScript
- 98% reduction in JavaScript bundle size

### v10.0.6+ (2025-01-18)
- **FULL UNIFICATION**: Website and Landing themes now share 100% of components
- Moved ALL sections (29) and snippets (107) from Website theme to shared
- Removed all components from Landing theme folders
- Landing theme now identical to Website theme in functionality
- Updated documentation to reflect unified architecture
- Exported themes:
  - Website: v10.0.6
  - Landing: v10.0.7

### v10.0.3-10.0.5 (2025-01-17)
- **SHARED COMPONENT ARCHITECTURE**: Initial shared component system
- Created `/shared/` folder structure for CSS, snippets, and sections
- Consolidated all common CSS into `/shared/styles/overrides.css` (1,321 lines)
- Moved navigation and footer snippets to shared folder
- Created flexible hero.liquid and about_hero.liquid shared sections
- Updated theme-manager.js to handle shared component copying and CSS merging
- Fixed missing About Hero CSS in landing theme (v10.0.5)

### v10.7.2 (2025-01-17)
- **NAVIGATION FIX**: Fixed desktop navigation styling issues
- Corrected CSS selectors to use Kajabi's `.link-list__link` class structure
- Changed overrides.css loading from async to synchronous for proper cascade
- Added modern hover effects with underline animations on navigation links
- Enhanced dropdown menu styling with teal accent colors
- Fixed specificity issues by targeting both `.header` and `.header__content--desktop`
- Applied same fixes to both website and landing themes

### v10.7.0 (2025-01-16)
- **BRAND UPDATE**: Implemented Attachment Nerd brand colors across all themes
- Updated CSS variables to use brand palette (Navy, Teal, Coral, Gold, Plum, etc.)
- Enhanced button styles with brand-specific classes (.btn--coral, .btn--emotional)
- Maintained legacy color mappings for backward compatibility
- Updated mobile menu to use brand colors (Blush Peach background, Coral accent)

### v10.6.2 (2025-01-16)
- Added clean, minimal mobile menu design to both website and landing themes
- Full-screen mobile menu with beige background and terracotta accent
- Large navigation links (24px) for better mobile UX
- Minimal rounded button styling

### v10.12.1 (2025-01-17)
- **BOOK SECTION**: Added new book section for testimonials and social proof
- Implemented center book image with quotes on both sides
- Added author avatars, names, and bios for testimonials
- Included logo row for press/partner logos with hover effects
- **IMPORTANT FIX**: Sections in Kajabi require "category" field in presets to appear in editor
- Applied to both website and landing themes

### v10.5.2 (2025-01-16)  
- Established CSS Variables design system
- Created organized overrides.css structure
- Added comprehensive documentation (CLAUDE.md)
- Fixed CSS breaking issues from improper file editing

## Kajabi Section Development

### Creating New Sections

When creating new sections for Kajabi themes, follow these requirements:

1. **File Location**: Place section files in `/shared/sections/` for website/landing themes

2. **Section Types - Static vs Dynamic**:
   
   **Static Sections**: Pre-loaded on specific pages, not moveable
   - No `"presets"` in schema
   - Added to templates with `{% section 'section_name' %}`
   - User can edit content but not location
   
   **Dynamic Sections**: User can add/remove/reorder
   - MUST have `"presets"` array with `"category"` field
   - Appear in Kajabi's section picker
   - Added by users through the editor
   
   ```liquid
   {% schema %}
   {
     "name": "Section Name",
     "elements": [
       {
         "type": "text",
         "id": "heading",
         "label": "Heading"
       }
     ],
     "blocks": [
       {
         "type": "block_type",
         "name": "Block Name",
         "elements": [
           {
             "type": "text",
             "id": "text",
             "label": "Text"
           }
         ]
       }
     ],
     "presets": [
       {
         "name": "Section Name",
         "category": "Content",  // REQUIRED for dynamic sections!
         "description": "Brief description",
         "settings": {}
       }
     ]
   }
   {% endschema %}
   ```

3. **Making Sections Dynamic (Building Blocks)**:
   - **MUST** include `"presets"` array in schema
   - **MUST** include `"category"` in each preset
   - Valid categories: "Content", "Hero", "Features", "Media", "Commerce", etc.
   - Without presets = static section only

4. **Required Fields for Dynamic Sections**:
   - `"presets"` array must exist
   - Each preset MUST have a `"category"` field
   - Each preset should have a `"name"` field
   - Optional but recommended: `"description"` field

5. **Common Gotchas**:
   - Missing `"category"` = section won't appear in picker
   - No `"presets"` = static section only (not pickable)
   - Using `"settings"` instead of `"elements"` = incompatible
   - Not including section in theme export = section missing

### Section Compatibility

Kajabi has specific rules for section compatibility:
- **Same theme type only**: Website sections work on website pages, landing on landing pages
- **Saved sections**: Can only be reused within same theme type
- **Cross-theme sharing**: Not supported between different theme types (e.g., Encore to Premiere)

### Debugging Missing Sections

If a section doesn't appear in the Kajabi editor:
1. Check the schema has `"presets"` array
2. Verify each preset has a `"category"` field
3. Confirm using `"elements"` not `"settings"`
4. Re-export the theme after changes
5. Clear browser cache and reload Kajabi editor

### Kajabi Element Type Requirements

**CRITICAL**: Kajabi only supports specific element types in section schemas:

#### Valid Element Types:
- `"text"` - Single line text input
- `"textarea"` - Multi-line text input
- `"select"` - Dropdown selection
- `"radio"` - Radio button group
- `"checkbox"` - Boolean toggle
- `"color"` - Color picker
- `"image_picker"` - Image upload/selection
- `"range"` - Slider input (NOT "number"!)
- `"link_list"` - Navigation menu selector
- `"action"` - URL/action input
- `"header"` - Section divider (content only)

#### Invalid Types That Will Cause Errors:
- ❌ `"number"` - Use `"range"` instead
- ❌ `"url"` - Use `"text"` or `"action"` instead
- ❌ `"email"` - Use `"text"` instead
- ❌ `"integer"` - Use `"range"` instead

#### Range Type Configuration:
When using `"range"` type, always include:
```json
{
  "type": "range",
  "id": "font_size",
  "label": "Font Size",
  "default": 16,
  "min": 10,
  "max": 48,
  "step": 1,
  "unit": "px"
}
```

### Liquid Syntax Restrictions

Kajabi has specific Liquid syntax requirements:

#### ❌ NOT Supported:
```liquid
<!-- Ternary operators -->
{{ condition ? 'true' : 'false' }}

<!-- Filter chains with ternary -->
{{ value | default: condition ? 'a' : 'b' }}
```

#### ✅ Use Instead:
```liquid
<!-- If/else statements -->
{% if condition %}true{% else %}false{% endif %}

<!-- Separate if blocks -->
{% if condition %}
  {{ value | default: 'a' }}
{% else %}
  {{ value | default: 'b' }}
{% endif %}
```

### Common Section Development Issues

1. **Section Not Appearing in Picker**
   - Missing `"presets"` array in schema
   - Missing `"category"` in preset
   - Missing `"description"` in preset (recommended)
   - Invalid element types (e.g., "number" instead of "range")

2. **Schema Validation Errors**
   - Using `"type": "number"` → Change to `"type": "range"`
   - Missing required range properties (min, max, step)
   - Using unsupported Liquid syntax (ternary operators)

3. **Best Practices for Presets**
   ```json
   "presets": [
     {
       "name": "Section Name",
       "description": "Brief description of section",
       "category": "Content",
       "blocks": [
         { "type": "block_type" }
       ]
     }
   ]
   ```
   - Keep block definitions simple in presets
   - Don't include settings in preset blocks
   - Use valid categories from existing theme

## Accessibility Features (v13.0.0+)

The AN themes include comprehensive accessibility features to ensure an inclusive experience for all users:

### Core Accessibility Features
1. **ARIA Support**:
   - Progress bars with proper ARIA attributes
   - Form inputs with labels and ARIA descriptions
   - Buttons with aria-labels where needed
   - Landmarks and regions properly marked

2. **Keyboard Navigation**:
   - Full keyboard support for all interactive elements
   - Focus indicators on all focusable elements
   - Skip-to-content link for screen reader users
   - Proper tab order throughout the interface

3. **Screen Reader Support**:
   - Visually hidden helper text (.visually-hidden, .sr-only)
   - Proper heading hierarchy
   - Descriptive link and button text
   - Alt text for all images

4. **Visual Accessibility**:
   - High contrast mode support
   - Focus visible indicators
   - Minimum touch target sizes (44x44px)
   - Reduced motion support

### Implementation Examples

#### Progress Bars
```liquid
{% render 'element_progress', percent: 75, label: 'Course progress' %}
```

#### Accessible Buttons
```liquid
{% render 'element_button', 
  block: block,
  btn_text: 'Start Course',
  btn_aria_label: 'Start the JavaScript fundamentals course'
%}
```

#### Form Inputs
```html
<label for="search-{{ block.id }}" class="visually-hidden">Search</label>
<input 
  id="search-{{ block.id }}"
  type="search" 
  aria-label="Search blog posts"
>
```

### CSS Utilities for Accessibility
- `.visually-hidden` / `.sr-only` - Hide visually but keep for screen readers
- `.skip-to-content` - Skip navigation link
- Focus styles automatically applied to interactive elements
- High contrast mode adjustments
- Reduced motion preferences respected

## Creating Modern Website & Landing Pages

### Overview
When creating new pages for Website or Landing themes, follow these best practices to maintain consistency and leverage our existing shared components.

### 1. Page Template Structure

#### Static + Dynamic Hybrid Approach
For the best user experience, use a hybrid approach that provides structure while allowing customization:

```liquid
<!-- Example: books.liquid template -->
<main>
  <!-- Pre-configured sections for template structure -->
  {% section 'books_hero' %}
  {% section 'book_showcase_modern' %}
  {% section 'book_testimonials_modern' %}
  {% section 'author_bio_modern' %}
  {% section 'newsletter_cta_modern' %}
  
  <!-- Allow additional dynamic sections -->
  {{ content_for_index }}
</main>
```

**Benefits:**
- Users see a complete, professional layout immediately
- All content remains editable through Kajabi's editor
- Users can add more sections below the template
- Provides guidance while maintaining flexibility

### 2. Leverage Existing Shared Sections

Before creating new sections, check our extensive library of shared sections:

#### Hero Sections
- `hero.liquid` - General purpose hero with CTA
- `books_hero.liquid` - Modern hero with brand colors
- `parallax_hero.liquid` - Hero with parallax effect
- `utility_hero.liquid` - Simple hero for utility pages
- `newsletter_hero.liquid` - Hero optimized for newsletter signup

#### Content Sections
- `book_showcase_modern.liquid` - Z-pattern product showcase
- `feature_showcase.liquid` - Feature highlights
- `feature_highlight.liquid` - Single feature focus
- `colored_highlight.liquid` - Content with background colors
- `testimonials.liquid` - Customer testimonials
- `book_testimonials_modern.liquid` - Modern card-style testimonials

#### CTA Sections
- `cta_section.liquid` - General call-to-action
- `full_width_cta.liquid` - Full-width CTA block
- `newsletter_cta_modern.liquid` - Modern newsletter signup
- `two_step.liquid` - Two-step opt-in

#### E-commerce Sections
- `products.liquid` - Product grid
- `pwyc_pricing_slider.liquid` - Pay-what-you-can pricing
- `book.liquid` - Book details
- `book_buy.liquid` - Purchase options

#### About/Team Sections
- `author_bio_modern.liquid` - Modern author/team bio
- `about_hero.liquid` - About page hero

### 3. Modern Design System Integration

When creating new sections, follow our modern brand guidelines:

#### Color Usage
```css
/* Use CSS variables for all colors */
background: var(--c-brand-100);    /* Lavender backgrounds */
color: var(--c-ink-900);           /* Dark text */
background: var(--g-brand);        /* Gradient for primary CTAs */
```

#### Typography Scale
```css
/* Use typography variables */
font-size: var(--fs-display);      /* 48px - Hero headings */
font-size: var(--fs-h1);          /* 40px - Section titles */
font-size: var(--fs-body-lg);     /* 18px - Subheadings */
```

#### Component Classes
```html
<!-- Modern buttons -->
<a href="#" class="btn btn-primary-modern">Primary CTA</a>
<a href="#" class="btn btn-secondary-modern">Secondary</a>

<!-- Cards -->
<div class="card-modern">Content</div>

<!-- Animations -->
<div class="animate-fade-up">Animated content</div>
```

### 4. Section Design Patterns

#### Hero Pattern
```liquid
<section class="hero-section position-relative overflow-hidden" style="background: var(--c-brand-100); padding: 80px 0;">
  <div class="container">
    <div class="text-center animate-fade-up">
      <h1 style="font-size: var(--fs-display); color: var(--c-ink-900);">
        {{ section.settings.heading }}
      </h1>
      <p style="font-size: var(--fs-body-lg); color: var(--c-ink-700);">
        {{ section.settings.subheading }}
      </p>
      <div class="mt-4">
        <a href="#" class="btn btn-primary-modern">CTA</a>
      </div>
    </div>
  </div>
</section>
```

#### Z-Pattern Content
```liquid
<section class="py-5">
  <div class="container">
    <div class="row align-items-center {% if alternate %}flex-lg-row-reverse{% endif %}">
      <div class="col-lg-6">
        <!-- Visual with glow effect -->
        <div style="border-radius: 16px; box-shadow: 0 0 48px rgba(94,59,255,.15);">
          <img src="{{ image }}" class="img-fluid">
        </div>
      </div>
      <div class="col-lg-6">
        <!-- Content with max-width -->
        <div style="max-width: 560px;">
          <h2 style="font-size: var(--fs-h1);">{{ heading }}</h2>
          <p style="font-size: var(--fs-body-lg);">{{ content }}</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Card Grid Pattern
```liquid
<section class="py-5" style="background: #FAFAFA;">
  <div class="container">
    <div class="row g-4">
      {% for item in items %}
        <div class="col-lg-4">
          <div class="card-modern h-100">
            <!-- Card content -->
          </div>
        </div>
      {% endfor %}
    </div>
  </div>
</section>
```

### 5. Best Practices for New Pages

1. **Always check shared sections first** - We likely already have what you need
2. **Use the hybrid approach** - Combine static sections for structure with dynamic capability
3. **Follow the design system** - Use CSS variables and utility classes
4. **Think mobile-first** - All sections should be responsive
5. **Include entrance animations** - Use animate-fade-up, animate-fade-in classes
6. **One primary CTA per viewport** - Follow the brand guidelines
7. **Test in Kajabi** - Always preview in the actual environment

### 6. Creating New Page Templates

When creating new page templates, use simple static sections without dynamic insertion points, as Kajabi's `{% dynamic_sections_for %}` doesn't work as expected in practice.

**Recommended Template Pattern:**
```liquid
<!-- template_name.liquid -->
<main>
  {% section 'hero' %}
  {% section 'features' %}
  {% section 'testimonials' %}
  {% section 'cta' %}
  
  <!-- Optional: Allow dynamic sections at the end only -->
  {{ content_for_index }}
</main>
```

This pattern:
- Provides a structured default layout
- Keeps templates simple and predictable
- Allows additional sections at the end if needed
- Works reliably with Kajabi's platform

### 7. Common Page Types & Recommended Sections

#### Books/Products Page
- `books_hero.liquid`
- `book_showcase_modern.liquid` (multiple instances)
- `book_testimonials_modern.liquid`
- `author_bio_modern.liquid`
- `newsletter_cta_modern.liquid`

#### About Page
- `about_hero.liquid`
- `feature_showcase.liquid`
- `author_bio_modern.liquid`
- `testimonials.liquid`
- `full_width_cta.liquid`

#### Landing Page
- `hero.liquid` or `parallax_hero.liquid`
- `feature_highlight.liquid`
- `colored_highlight.liquid`
- `testimonials.liquid`
- `pwyc_pricing_slider.liquid`
- `newsletter_cta_modern.liquid`

#### Blog/Content Page
- `utility_hero.liquid`
- `blog_listings.liquid`
- `newsletter_hero.liquid`
- `cta_section.liquid`

### 8. Performance Considerations

- **Lazy load images** - Use loading="lazy" attribute
- **Minimize custom CSS** - Leverage utility classes
- **Use shared components** - Don't duplicate code
- **Optimize animations** - Use CSS transforms over position changes

### 9. Template Best Practices

For Kajabi templates, keep it simple with static sections and optional dynamic content at the end:

#### Recommended Approach: Static Sections + content_for_index

```liquid
<!-- template_name.liquid -->
<main>
  <!-- Pre-configured sections provide structure -->
  {% section 'hero' %}
  {% section 'features' %}
  {% section 'testimonials' %}
  {% section 'cta' %}
  
  <!-- Allow additional sections at the end -->
  {{ content_for_index }}
</main>
```

**Benefits:**
- Simple and reliable
- Works consistently across Kajabi
- Provides default structure
- Users can add sections at the end
- No complex dynamic zone management

#### Important Note on dynamic_sections_for

While Kajabi documents `{% dynamic_sections_for %}`, in practice it doesn't work as expected. Avoid using it in templates as it can cause issues or simply not function.

#### Best Practices:
1. Use static sections for core page structure
2. Include `{{ content_for_index }}` at the end for flexibility
3. Keep templates simple and predictable
4. Test thoroughly in Kajabi's environment
5. Document which sections are included by default

## Version History

### v16.0.0 (2025-01-20)
- **MAJOR CONTENT SECTIONS**: Added PWYC pricing and testimonials
- Created Pay What You Can (PWYC) pricing slider section
  - Flexible 2-4 tier pricing with visual selection
  - Supports Stripe/Kajabi checkout URLs
  - Auto-select suggested tier option
  - Integrated scholarship link
  - Mobile-optimized with scroll-snap
  - Analytics tracking (GA4 compatible)
- Created modern testimonials section
  - Grid layout with 2-3 column options
  - Star ratings and customer photos
  - Category badges for organization
  - Featured testimonial highlighting
  - Statistics bar with success metrics
  - Smooth entrance animations
- Added comprehensive CSS utilities for both sections
- Updated shared components to 31 sections total
- Synchronized all theme versions to v16.0.0

### v15.0.6 (2025-01-19)
- **NAVIGATION & SIDEBAR HOVER EFFECTS**: Enhanced UI interactions
- Fixed double underline issue on navigation hover
- Added smooth underline animation on nav links using ::after pseudo-element
- Implemented purple brand color (#5E3BFF) for navigation hover states
- Added comprehensive sidebar hover effects:
  - Title slide animation (translateX) on hover
  - Teal underline animation for section headings
  - Tag hover with elevation and shadow effects
  - Category link indent animation
  - Social icon scale and lift effects
  - Enhanced search input focus states
  - Instructor image zoom on hover
- Prevented Kajabi default underlines with more specific CSS selectors
- All hover effects use modern CSS transitions for smooth animations

### v15.0.0 (2025-01-18)
- **CLEAN MODULAR HEADER ARCHITECTURE**: Complete redesign with separated components
- Cleaned header.liquid to minimal version (logo only)
- Removed all navigation and mobile menu code from header
- Created navigation.liquid - Flexible navigation bar with mobile hamburger
- Created mobile_menu.liquid - Dedicated slide-out mobile menu
- Benefits:
  - Enable/disable navigation on specific pages
  - Different navigation styles per page possible
  - Cleaner separation of concerns
  - Better mobile experience with dedicated menu
  - Faster page loads with minimal header
  - More maintainable codebase

### v14.0.0 (2025-01-18)
- **REMOVED ALL SLIDERS**: Simplified site by removing carousel/slider functionality
- Deleted testimonial_slider.liquid section
- Deleted carousel.liquid section  
- Removed all tiny-slider CSS (273 lines)
- Removed carousel loading code from an-core.js
- Cleaner, faster page loads without slider dependencies
- Encourages static content for better performance and SEO

### v13.2.0 (2025-01-18)
- **SIMPLIFIED CAROUSEL LOADING**: Switched to traditional script loading for better compatibility
- Updated testimonial_slider.liquid to use traditional <script> tags instead of ES6 modules
- Updated carousel.liquid to use traditional script loading
- Removed the separate fallback version as it's no longer needed
- All carousel/slider sections now use consistent loading approach
- Better compatibility across all browsers and Kajabi environments
- Maintains all features while ensuring reliable initialization

### v13.1.0 (2025-01-18)
- **LIGHTWEIGHT CAROUSEL IMPLEMENTATION**: Replaced Slick with tiny-slider
- Created new testimonial_slider.liquid section with tiny-slider (5KB vs 43KB)
- Updated carousel.liquid to use tiny-slider instead of Slick Carousel
- Removed jQuery dependency for carousels
- Updated an-core.js to remove Slick carousel code
- Added comprehensive tiny-slider CSS styles
- Carousel features maintained: autoplay, navigation, fade mode, responsive
- 88% reduction in carousel library size (43KB → 5KB)
- Better accessibility with ARIA labels and keyboard navigation

### v13.0.0 (2025-01-18)
- **ACCESSIBILITY IMPROVEMENTS**: Comprehensive accessibility enhancements
- Updated progress components with ARIA attributes and labels
- Enhanced button elements to use proper `<button>` tags when appropriate
- Added visually-hidden utility classes for screen reader text
- Implemented focus-visible styles for keyboard navigation
- Added skip-to-content functionality
- Updated form inputs with proper labels and ARIA attributes
- Added keyboard support for role="button" links in an-core.js
- Included high contrast mode and reduced motion support
- Minimum touch target sizes enforced (44x44px)
- Updated shared CSS to 2,061 lines with accessibility utilities

### v12.0.0 (2025-01-18)
- **MAJOR BRAND REDESIGN**: Complete overhaul to new modern brand style guide
- Updated color system:
  - Brand purple (#5E3BFF) as primary with gradient
  - New accent colors: Teal (#18D5E4), Peach (#FF8BCB), Lemon (#FFE86B)
  - Updated ink colors for text hierarchy
  - Lavender (#E9E6FF) as default hero background
- Typography updates:
  - New type scale with display (48px), h1 (40px), h2 (30px)
  - Inter font family
  - Medium weight (500) for headings
- Component redesign:
  - Pill-shaped primary buttons with gradient and glow effect
  - Updated secondary buttons with subtle borders
  - New card designs with updated shadows
  - Modernized form inputs with focus states
- Motion and animation:
  - New easing curves (ease-spring, ease-out)
  - Hover lift effects
  - Fade and slide animations
- Updated hero sections with lavender backgrounds
- Modernized CTA sections with white content boxes
- Maintained backward compatibility with legacy color mappings

### v11.1.0 (2025-01-18)
- **COMPREHENSIVE UTILITY CLASSES**: Extensive utility-first CSS system
- Added 600+ utility classes leveraging existing CSS variables
- Complete spacing utilities (margin/padding all directions)
- Typography utilities (sizes, weights, transforms, alignment)
- Layout utilities (display, flexbox, position, sizing)
- Component utilities (buttons, badges, sections, cards)
- Responsive utilities with mobile-first approach
- Animation and transition utilities
- Eliminates need to redeclare colors in section CSS
- Updated CLAUDE.md with comprehensive utility documentation
- overrides.css grew from 1,321 to 1,889 lines

### v11.0.0 (2025-01-18)
- **MODERN JAVASCRIPT**: Complete JavaScript architecture overhaul
- Replaced 980KB scripts.js bundle with 20KB modular approach
- Created an-core.js with essential vanilla JS functionality
- Created an-modules.js with feature-specific modules
- Implemented conditional loading for heavy libraries (AOS, moment.js, Slick)
- Removed jQuery dependency (loads only if Kajabi requires)
- Native Date API for countdowns instead of moment.js
- CSS transitions replace jQuery slideToggle animations
- Lazy loading for all non-critical JavaScript
- 98% reduction in JavaScript bundle size

### v10.0.6+ (2025-01-18)
- **FULL UNIFICATION**: Website and Landing themes now share 100% of components
- Moved ALL sections (29) and snippets (107) from Website theme to shared
- Removed all components from Landing theme folders
- Landing theme now identical to Website theme in functionality
- Updated documentation to reflect unified architecture
- Exported themes:
  - Website: v10.0.6
  - Landing: v10.0.7

### v12.1.0 (2025-01-19)
- **MODULAR HEADER ARCHITECTURE**: Complete separation of concerns
- Removed all sliders/carousels from the site (testimonial_slider, carousel)
- Removed 273 lines of slider CSS from overrides.css
- Created modular header system:
  - header.liquid: Scripts/analytics only (no visual elements)
  - navigation.liquid: Flexible navigation bar component
  - mobile_menu.liquid: Slide-out mobile menu
- Moved ALL CSS variables from header sections to shared/styles/overrides.css
- CSS variables now load automatically with the theme (no manual section needed)
- Fixed footer heading color overrides with more specific CSS selectors
- Enables page-specific control over visual elements while maintaining consistent script loading

## AI Page Generation Workflow

### Overview
The AN theme includes an automated workflow for converting AI-generated HTML pages into editable Kajabi sections. This allows LLMs to create complete page designs while maintaining Kajabi's image picker functionality.

### How It Works

1. **AI Creates HTML** → Save to `/llm-drafts/pagename.html`
   - Complete HTML page with inline CSS
   - Use descriptive alt text for images
   - Add `<!--@id=custom_id-->` comments above images for custom IDs

2. **Run Conversion Script** → `npm run inject:drafts`
   - Converts HTML to Kajabi section in `/shared/sections/page-pagename.liquid`
   - Extracts and scopes all CSS to prevent conflicts
   - Replaces `<img>` tags with Kajabi image pickers
   - Adds schema with image settings

3. **Use in Kajabi** → Add section from "Pages" category
   - NO template files needed - users create pages and add sections
   - All images editable through Kajabi interface
   - CSS properly scoped to section class

### Example Workflow

```bash
# 1. AI generates page
# Save output to: llm-drafts/coaching.html

# 2. Convert to Kajabi section
npm run inject:drafts

# 3. Export theme
npm run theme:export website patch "Added coaching page section"

# 4. In Kajabi:
# - Create new page
# - Add "Coaching Page" section from Pages category
# - Upload images through section settings
```

### File Structure
```
/llm-drafts/           # AI-generated HTML files
  coaching.html        # Complete HTML page with CSS
  
/shared/sections/      # Converted Kajabi sections
  page-coaching.liquid # Auto-generated section with image pickers
  
/scripts/
  inject-schema.js     # Conversion script
```

### Script Features
- **CSS Optimizer** - Removes redundant styles and minifies output
  - Strips :root variables (already in theme)
  - Removes common resets (* {}, body {}, .container {})
  - Detects patterns that could use utility classes
  - Minifies CSS while preserving readability
  - Adds helpful comments about available utilities
- Extracts and scopes CSS to `.page-{name}` class
- Preserves media queries and animations
- Groups images by section (Hero, Features, etc.)
- Supports custom image IDs via HTML comments
- Adds SEO settings if meta tags present
- Uses proper `image_picker_url` filter for Kajabi

### Best Practices for AI-Generated Pages
1. Use semantic HTML structure with sections
2. Include all CSS in `<style>` tags
3. Use descriptive alt text for accessibility
4. Add `<!--@id=hero_bg-->` above images for readable IDs
5. Keep image IDs under 30 characters
6. Use CSS variables for consistent theming

### Important Notes
- **No template files needed** - Users will create pages in Kajabi
- Sections appear in "Pages" category automatically
- All shared sections available to both Website and Landing themes
- Images use Kajabi's CDN with proper responsive sizing
- CSS is scoped to prevent conflicts with other sections

### Example: Working Section
See `/shared/sections/page-coaching.liquid` for a complete example of an AI-generated page converted to a Kajabi section.

## Section Consolidation Strategy

### Unified Book Showcase Section

The theme now includes `an_book_showcase.liquid` - a unified section that replaces multiple book showcase variants:

#### Replaced Sections:
- `book_showcase.liquid` → Use `layout_style: "classic"`
- `book_showcase_modern.liquid` → Use `layout_style: "modern"`
- `book_showcase_sa.liquid` → Use presets or saved sections
- `book_showcase_rsak.liquid` → Use presets or saved sections
- `book_showcase_modern_alt.liquid` → Use `layout_style: "modern"` + `image_position: "right"`

#### Migration Guide:

**Classic Layout (book_showcase.liquid)**:
```liquid
{% section 'an_book_showcase' %}
Settings:
- layout_style: "classic"
- image_position: "left" or "right"
- Enable top/bottom badges
- feature_display: "list" with icon support
```

**Modern Layout (book_showcase_modern.liquid)**:
```liquid
{% section 'an_book_showcase' %}
Settings:
- layout_style: "modern"
- enable_glow: true
- micro_label: "17 YEARS OF CLINICAL WISDOM"
- floating_badge_text: "BESTSELLER"
- feature_display: "pills"
- enable_animations: true
```

**With Testimonial Integration**:
```liquid
{% section 'an_book_showcase' %}
Settings:
- show_testimonial: true
- testimonial_text, author, etc.
```

**Multiple Retailer Buttons**:
Use the "Additional Button" blocks with icons:
- Amazon: `icon: "fab fa-amazon"`
- Barnes & Noble: `text: "B&N"`
- Target: `icon: "fas fa-bullseye"`

#### Benefits of Consolidation:
1. **Single source of truth** - All book showcases use one section
2. **Easier maintenance** - Update one file instead of five
3. **More flexibility** - Mix and match features from all variants
4. **Better performance** - Less code duplication
5. **Simplified theme** - Fewer sections to manage

#### Creating Presets for Common Configurations:

For frequently used configurations (like specific books), create presets in the schema:

```json
"presets": [
  {
    "name": "Securely Attached Book",
    "category": "Content",
    "settings": {
      "book_title": "Securely Attached",
      "layout_style": "modern",
      "image_position": "right",
      "show_testimonial": true
    }
  }
]
```

This consolidation approach should be applied to other duplicate sections in the theme for better maintainability.

## Background Textures & SVG Shapes Library

### Overview
The AN theme includes a comprehensive library of SVG background shapes and textures that add visual depth without being distracting. These are implemented as utility classes in `shared/styles/overrides.css`.

### Available Background Textures

#### Organic Blob Shapes
- `.bg-texture--blob-1` - Purple blob, top-right positioning
- `.bg-texture--blob-2` - Teal blob, bottom-left positioning  
- `.bg-texture--blob-3` - Peach blob, centered

#### Geometric Patterns
- `.bg-texture--circles` - Repeating cross pattern
- `.bg-texture--dots` - Subtle dot grid
- `.bg-texture--zigzag` - Zigzag pattern

#### Gradient Overlays
- `.bg-texture--gradient-1` - Radial gradient from top-right
- `.bg-texture--gradient-2` - Radial gradient from bottom-left
- `.bg-texture--gradient-mesh` - Multi-point mesh gradient

#### Floating Shapes
- `.bg-texture--float-1` - Animated star shape
- `.bg-texture--float-2` - Animated concentric circles

#### Wave Patterns
- `.bg-texture--wave-top` - Wave shape at top of section
- `.bg-texture--wave-bottom` - Wave shape at bottom

#### Corner Decorations
- `.bg-texture--corner-1` - Curved lines in top-right
- `.bg-texture--corner-2` - Rotated squares in bottom-left

### Usage Examples

#### Basic Usage
```html
<section class="bg-texture bg-texture--blob-1">
  <!-- Content -->
</section>
```

#### Combining Multiple Textures
```html
<section class="bg-texture bg-texture--blob-1 bg-texture--gradient-mesh">
  <!-- Combines blob shape with mesh gradient -->
</section>
```

#### With Modifiers
```html
<!-- Subtle effect -->
<section class="bg-texture bg-texture--dots bg-texture--subtle">

<!-- Strong effect -->  
<section class="bg-texture bg-texture--blob-2 bg-texture--strong">

<!-- Animated -->
<section class="bg-texture bg-texture--float-1 bg-texture--animated">

<!-- Hide on mobile -->
<section class="bg-texture bg-texture--corner-1 bg-texture--hide-mobile">
```

### Implementation in Sections

#### FAQ Accordion Example
```liquid
<section class="an-faq-section py-5 bg-texture bg-texture--blob-1 bg-texture--gradient-mesh bg-texture--subtle">
```
- Uses subtle blob and gradient mesh for depth
- FAQ items have hover-activated corner decorations

#### Stats Bar Example  
```liquid
<section class="an-stats-bar py-5 bg-texture {% if gradient %}bg-texture--float-1 bg-texture--float-2{% else %}bg-texture--dots bg-texture--gradient-2{% endif %}">
```
- Gradient backgrounds use floating shapes
- Solid backgrounds use dots pattern
- Stats items have hover-activated decorative accents

### Best Practices

1. **Subtlety is Key**: Use low opacity (0.03-0.1) for backgrounds
2. **Combine Thoughtfully**: Mix organic and geometric shapes
3. **Consider Context**: Match texture style to section content
4. **Performance**: SVGs are inline data URIs for fast loading
5. **Accessibility**: All decorative elements use `pointer-events: none`

### Technical Details

- All SVG shapes use data URIs to avoid external requests
- Colors use URL-encoded hex values (e.g., `%235E3BFF` for #5E3BFF)
- Animations use CSS transforms for smooth performance
- Z-index is managed to keep decorations behind content
- Responsive hiding available with `.bg-texture--hide-mobile`

### Creating Custom Shapes

To add new SVG shapes:
1. Create SVG with minimal markup
2. URL-encode special characters
3. Add as background-image in data URI format
4. Use appropriate opacity (0.03-0.1 typical)
5. Position with absolute positioning

Example:
```css
.bg-texture--custom::before {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%235E3BFF' fill-opacity='0.05'/%3E%3C/svg%3E");
}
```
