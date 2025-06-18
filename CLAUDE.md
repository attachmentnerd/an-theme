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

### 1. CSS Variables Design System - Attachment Nerd Brand
All themes include CSS custom properties defined in header.liquid:
```css
:root {
  /* Core Brand Colors */
  --an-navy: #1A2D4E;      /* Nerd Navy - Primary headings, buttons */
  --an-teal: #2AB3B1;      /* Secure Teal - Interactive states */
  --an-coral: #F57C6F;     /* Sunrise Coral - Emotional CTAs */
  --an-gold: #FFC63F;      /* Sunshine Gold - Highlights, icons */
  --an-plum: #A449A5;      /* Modern Plum - Depth accents, links */
  --an-peach: #FFF4F0;     /* Blush Peach - Soft backgrounds */
  --an-white: #FFFFFF;     /* White - Base */
  --an-grey: #F8F7F5;      /* Warm Grey - Secondary backgrounds */
  --an-slate: #3A4A63;     /* Slate Ink - Body text */
  
  /* Legacy mappings for compatibility */
  --an-primary: var(--an-navy);
  --an-secondary: var(--an-teal);
  
  /* Spacing System */
  --an-space-sm: 8px;
  --an-space-md: 16px;
  --an-space-lg: 24px;
  
  /* And more... */
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
   1. Design System Extensions
   2. Mobile Navigation
   3. Enhanced Buttons
   4. Form Improvements
   5. Custom Sections
   6. Utility Classes
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
--an-space-xs: 4px;   /* Tight spacing */
--an-space-sm: 8px;   /* Small spacing */
--an-space-md: 16px;  /* Default spacing */
--an-space-lg: 24px;  /* Large spacing */
--an-space-xl: 32px;  /* Extra large */
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
2. **Add ALL Website/Landing components to /shared/** folders
3. **Add Product-specific components to /themes/product/**
4. **Test on multiple devices** before deploying CSS changes
5. **Maintain the 4-slice hamburger structure**
6. **Document new sections** with date and purpose
7. **Use semantic variable names** (e.g., `--an-primary` not `--blue`)
8. **Run `npm run theme:export [theme]`** to build themes with shared components
9. **Test in BOTH Website and Landing** contexts when modifying shared components

### DON'T:
1. **Don't edit styles.scss.liquid** - it's compiled by Kajabi
2. **Don't add Website/Landing components to theme folders** - use shared
3. **Don't modify hamburger menu structure** without extensive testing
4. **Don't use hard-coded colors** - use CSS variables
5. **Don't use `!important`** unless absolutely necessary
6. **Don't forget to test** in Kajabi's preview mode
7. **Don't create theme-specific versions** of Website/Landing components

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
# Export a specific theme
npm run export website    # Exports website theme
npm run export landing    # Exports landing theme  
npm run export product    # Exports product theme

# Export all themes at once
npm run export:all

# Clean build artifacts
npm run clean
```

### What happens during build:
1. Creates temporary build directory
2. Copies theme files to build directory
3. Copies shared snippets (overwrites if exists)
4. Copies shared sections (doesn't overwrite existing)
5. Merges shared CSS + theme CSS into final overrides.css
6. Creates versioned ZIP file in `/exports/releases/`
7. Cleans up temporary files

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

1. **File Location**: Place section files in `/themes/[theme-name]/sections/`

2. **Schema Structure**: Kajabi uses `"elements"` instead of `"settings"`:
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
         "category": "Content",  // REQUIRED for section to appear in editor!
         "settings": {}
       }
     ]
   }
   {% endschema %}
   ```

3. **Required Fields for Visibility**:
   - `"presets"` array must exist
   - Each preset MUST have a `"category"` field
   - Valid categories: "Content", "Hero", "Features", etc.

4. **Common Gotchas**:
   - Missing `"category"` = section won't appear in editor
   - Using `"settings"` instead of `"elements"` = incompatible section
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