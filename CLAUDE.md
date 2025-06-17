# AN Kajabi Themes - Development Guide

This guide documents the CSS architecture and development conventions for the AN Kajabi themes to prevent breaking changes and maintain consistency.

## Theme Structure

The project contains three distinct themes:
1. **Website Theme** (`/themes/website/`) - Main marketing and content pages
2. **Landing Theme** (`/themes/landing/`) - Focused landing pages
3. **Product Theme** (`/themes/product/`) - Product/course pages

## CSS Architecture

### 1. Main Styles File
Each theme has a primary `styles.scss.liquid` file that contains:
- AOS (Animate On Scroll) animation definitions at the beginning
- Core theme styles
- Component-specific styles
- Responsive breakpoints

### 2. CSS Naming Conventions
The themes use **BEM-like naming** with Kajabi-specific patterns:
- Block: `.header`, `.section`, `.block`
- Element: `.header__content`, `.header__nav`, `.block__title`
- Modifier: `.header--fixed`, `.btn--primary`, `.hidden--mobile`
- Special: `.hamburger--slice-1` (numbered variants)

### 3. Liquid Integration
CSS files use Liquid templating for dynamic styles:
```liquid
.header {
  {% if section.settings.background_color != blank %}
    background-color: {{ section.settings.background_color }};
  {% endif %}
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

1. `styles.scss.liquid` - Main theme styles (compiled)
2. `overrides.css` - Custom user styles (empty by default)
3. Inline `<style>` blocks in section files

## Responsive Design

### Breakpoints
- Mobile: `max-width: 767px`
- Tablet: `768px - 991px` 
- Desktop: `992px+`

### Visibility Classes
- `.hidden--mobile` - Hidden on mobile
- `.hidden--desktop` - Hidden on desktop
- `.hidden--tablet` - Hidden on tablet

## Best Practices

### DO:
1. **Test on multiple devices** before deploying CSS changes
2. **Use existing class patterns** when adding new components
3. **Maintain the 4-slice hamburger structure**
4. **Use Liquid variables** for colors that users can customize
5. **Add styles to the END of files** to avoid conflicts
6. **Use specific selectors** to avoid unintended cascade effects

### DON'T:
1. **Don't modify hamburger menu structure** without extensive testing
2. **Don't change existing class names** - add new ones if needed
3. **Don't remove Liquid conditionals** around styles
4. **Don't use `!important`** unless absolutely necessary
5. **Don't modify AOS animation definitions** at the beginning of files

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

## Testing Checklist

Before deploying CSS changes:
- [ ] Test hamburger menu animation
- [ ] Check mobile menu open/close
- [ ] Verify sticky header behavior  
- [ ] Test all responsive breakpoints
- [ ] Validate in Kajabi theme editor
- [ ] Check for console errors
- [ ] Test with different color settings

Remember: The CSS in these themes is tightly integrated with Kajabi's platform. Always test thoroughly in the Kajabi environment before releasing changes.