# AN Theme Shared Components System

## Overview

This document describes the shared component system for the AN Kajabi themes. The system allows us to maintain consistency across all three themes (website, landing, product) while reducing duplication and making updates more efficient.

## Structure

```
/shared
  /scripts     - Shared JavaScript files
  /sections    - Shared Liquid sections (hero, etc.)
  /snippets    - Shared Liquid snippets
  /styles      - Shared CSS files (brand variables, common styles)
```

## Current Shared Components

### CSS (`/shared/styles/`)
- **overrides.css** - Complete shared styles containing:
  - AN brand CSS variables (colors, spacing, typography, shadows, transitions)
  - Typography base styles
  - Common button styles (primary, secondary, coral/emotional)
  - Shared navigation styles (desktop and mobile)
  - Shared footer styles with enhancements
  - Book Section styles
  - Book Buy Section styles
  - Modern navigation (white/blue design)
  - Complete mobile navigation implementation
  - Form styling improvements
  - Extended utility classes (spacing, display, flexbox, text, borders, shadows, radius)
  - Responsive helpers

### Sections (`/shared/sections/`)
- **hero.liquid** - Flexible hero section with multiple layout options
- **about_hero.liquid** - About page hero section (legacy)

### Snippets (`/shared/snippets/`)
- **shared_block_menu.liquid** - Basic navigation menu
- **shared_block_menu_styled.liquid** - Styled navigation menu
- **shared_block_logo.liquid** - Logo block
- **shared_block_logo_enhanced.liquid** - Enhanced logo with additional features
- **footer_block.liquid** - Footer content block
- **footer_block_copyright.liquid** - Copyright section
- **footer_block_social_icons.liquid** - Social media icons

## How It Works

1. **Development**: Edit files in the `/shared` folder
2. **Build Process**: The `theme-manager.js` script automatically copies shared components to each theme during build
3. **Export**: Each theme gets its own complete copy, making it Kajabi-compatible

## Build Commands

```bash
# Build individual themes
node scripts/theme-manager.js build website
node scripts/theme-manager.js build landing
node scripts/theme-manager.js build product

# Export themes with version bump
node scripts/theme-manager.js export website patch "Update shared styles"
node scripts/theme-manager.js export landing minor "Add new features"
```

## Adding New Shared Components

### 1. CSS Files
Place new CSS files in `/shared/styles/`:
```bash
/shared/styles/new-component.css
```

### 2. Sections
Place new Liquid sections in `/shared/sections/`:
```bash
/shared/sections/new-section.liquid
```
**Note**: Only share sections that are truly universal. Theme-specific sections should remain in individual theme folders.

### 3. Snippets
Place new Liquid snippets in `/shared/snippets/`:
```bash
/shared/snippets/new-snippet.liquid
```

### 4. Scripts
Place new JavaScript files in `/shared/scripts/`:
```bash
/shared/scripts/new-script.js
```

## CSS Management Workflow

### Development Process
1. **All CSS edits go in `/shared/styles/overrides.css`** - Never edit individual theme CSS files
2. **Individual theme CSS files remain empty** - They only contain a comment explaining the shared system
3. **Theme-specific styles** - Can be added to individual theme CSS files ONLY for truly unique features

### Theme-Specific CSS
- **Website Theme**: Currently empty (all styles shared)
- **Landing Theme**: Contains landing-specific styles (hero, features)
- **Product Theme**: Contains course-specific styles (video player, syllabus, modules, etc.)

## Best Practices

1. **Test All Themes**: When updating shared components, test all three themes
2. **Version Control**: Use semantic versioning when exporting themes
3. **Document Changes**: Update this file when adding new shared components
4. **Backwards Compatibility**: Ensure changes don't break existing functionality
5. **CSS Location**: ALWAYS edit `/shared/styles/overrides.css` for shared styles

## CSS Variable Reference

Key brand variables available in all themes:

```css
/* Core Brand Colors */
--an-navy: #1A2D4E;      /* Primary headings, buttons */
--an-teal: #2AB3B1;      /* Interactive states */
--an-coral: #F57C6F;     /* Emotional CTAs */
--an-gold: #FFC63F;      /* Highlights, icons */
--an-plum: #A449A5;      /* Links, accents */
--an-peach: #FFF4F0;     /* Soft backgrounds */
--an-white: #FFFFFF;     /* Base white */
--an-grey: #F8F7F5;      /* Secondary backgrounds */
--an-slate: #3A4A63;     /* Body text */
```

## Troubleshooting

### Shared component not appearing in build
1. Check file is in correct shared folder
2. Ensure file extension is correct (.css, .liquid, .js)
3. Run build command again
4. Check build output in `/build/[theme-name]/`

### CSS not applying
1. Verify overrides.css is loading in browser
2. Check CSS specificity
3. Ensure no syntax errors in shared CSS

## Future Improvements

- [ ] Add shared sections support
- [ ] Create automated testing for shared components
- [ ] Add visual regression testing
- [ ] Create component preview system