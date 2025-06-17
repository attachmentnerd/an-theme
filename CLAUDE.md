# AN Kajabi Themes - Development Guide

This guide documents the CSS architecture and development conventions for the AN Kajabi themes to prevent breaking changes and maintain consistency.

## Theme Structure

The project contains three distinct themes:
1. **Website Theme** (`/themes/website/`) - Main marketing and content pages
2. **Landing Theme** (`/themes/landing/`) - Focused landing pages
3. **Product Theme** (`/themes/product/`) - Product/course pages

## CSS Architecture

### Overview
We use a **hybrid CSS Variables + organized overrides.css** approach for maintainable, scalable styling across all themes.

### 1. CSS Variables Design System
All themes include CSS custom properties defined in header.liquid:
```css
:root {
  /* Core Colors */
  --an-primary: #4F46E5;
  --an-primary-hover: #4338CA;
  
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

### 2. File Structure
```
styles.scss.liquid   - Main theme styles (DO NOT EDIT - compiled by Kajabi)
overrides.css       - Custom styles using CSS variables (EDIT THIS)
global_custom_css   - User settings CSS from theme editor
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

### 5. Adding New Sections
When creating new sections, add styles to overrides.css:
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

### Color System
```css
--an-primary: #4F46E5;          /* Main brand color */
--an-primary-hover: #4338CA;    /* Hover state */
--an-text-dark: #1F2937;        /* Primary text */
--an-text-medium: #4B5563;      /* Secondary text */
--an-bg-light: #F9FAFB;         /* Light backgrounds */
--an-border: #E5E7EB;           /* Border color */
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
2. **Add new styles to overrides.css** with proper section comments
3. **Test on multiple devices** before deploying CSS changes
4. **Maintain the 4-slice hamburger structure**
5. **Document new sections** with date and purpose
6. **Use semantic variable names** (e.g., `--an-primary` not `--blue`)

### DON'T:
1. **Don't edit styles.scss.liquid** - it's compiled by Kajabi
2. **Don't append to files with cat >>** - can break CSS
3. **Don't modify hamburger menu structure** without extensive testing
4. **Don't use hard-coded colors** - use CSS variables
5. **Don't use `!important`** unless absolutely necessary
6. **Don't forget to test** in Kajabi's preview mode

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

## Theme-Specific Notes

### Website Theme
- Has the most complete implementation
- Includes blog and newsletter sections
- Full e-commerce support

### Landing Theme  
- Simplified header/footer
- Focus on conversion
- Limited navigation options

### Product Theme
- Different CSS structure
- No hamburger menu implementation
- Course-specific components

## Cross-Theme CSS Management

### Implementing Changes Across All Themes

1. **CSS Variables** - Copy the `:root` block to all theme headers:
   - `/themes/website/sections/header.liquid`
   - `/themes/landing/sections/header.liquid`
   - `/themes/product/sections/header.liquid` (if it has a header)

2. **overrides.css** - Each theme has its own, but use consistent structure:
   ```
   themes/website/assets/overrides.css
   themes/landing/assets/overrides.css
   themes/product/assets/overrides.css
   ```

3. **Shared Styles** - For truly universal styles, consider:
   - Creating a shared snippet that all themes include
   - Maintaining consistent section numbers in overrides.css

### CSS Workflow

1. **Development**: Work in website theme first
2. **Testing**: Validate in Kajabi preview
3. **Propagation**: Copy tested changes to other themes
4. **Version**: Update all theme versions together

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