# Kajabi Section Compatibility Report

## Critical Issue #1: Blocks Using "settings" Instead of "elements" 

**⚠️ THIS IS THE MOST CRITICAL ISSUE - AFFECTS 43 FILES**

According to Kajabi's requirements, blocks within sections MUST use `"elements": []` instead of `"settings": []` for their configuration. This is a fundamental compatibility issue that will break sections in Kajabi.

### Files Affected: 43 Total

1. `an_testimonials.liquid`
2. `book_author_sa.liquid`
3. `book_bonuses_sa.liquid`
4. `book_hero_sa.liquid`
5. `book_journey_sa.liquid`
6. `book_retailers_sa.liquid`
7. `book_showcase_unified.liquid`
8. `book_workbook_preview_sa.liquid`
9. `content_advanced_bio.liquid`
10. `content_author_bio.liquid`
11. `content_colored_highlight.liquid`
12. `content_contact_form.liquid`
13. `content_faq_accordion.liquid`
14. `content_featured_resources.liquid`
15. `content_instagram_feed.liquid`
16. `content_resource_downloads.liquid`
17. `content_stats_bar.liquid`
18. `content_team_coaches.liquid`
19. `cta_free_chapter.liquid`
20. `cta_free_resource.liquid`
21. `cta_full_width.liquid`
22. `cta_newsletter_modern.liquid`
23. `cta_purchase_book.liquid`
24. `feature_dark_cards.liquid`
25. `feature_highlight.liquid`
26. `feature_logo_bar.liquid`
27. `feature_press_logos.liquid`
28. `feature_showcase.liquid`
29. `feature_single_clean.liquid`
30. `feature_tabs_scroll.liquid`
31. `feature_testimonialbottom.liquid`
32. `feature_two_column_list.liquid`
33. `hero_about_page.liquid`
34. `hero_modern.liquid`
35. `nav_footer_bio.liquid`
36. `nav_footer_modern.liquid`
37. `nav_main.liquid`
38. `pricing_program_cards.liquid`
39. `pricing_pwyc.liquid`
40. `section.liquid`
41. `testimonial_enhanced_highlights.liquid`
42. `testimonial_grid_cards.liquid`
43. `testimonial_sa_book_style.liquid`

### Required Change

**Before (INCORRECT):**
```json
"blocks": [
  {
    "type": "testimonial",
    "name": "Testimonial",
    "settings": [  // ❌ WRONG - This breaks Kajabi
      {
        "type": "text",
        "id": "quote",
        "label": "Quote"
      }
    ]
  }
]
```

**After (CORRECT):**
```json
"blocks": [
  {
    "type": "testimonial", 
    "name": "Testimonial",
    "elements": [  // ✅ CORRECT - Kajabi requires "elements"
      {
        "type": "text",
        "id": "quote",
        "label": "Quote"
      }
    ]
  }
]
```

### Impact of Not Fixing

- Sections won't appear in Kajabi's section picker
- Cannot edit block settings in the admin
- May cause JavaScript errors in the editor
- Sections may not save properly

---

## Additional Issues Found in Unified Sections

After analyzing the new unified sections (`an_testimonials.liquid` and `an_book_showcase.liquid`) against working sections (`blog_listing_grid.liquid` and `feature_showcase.liquid`), I've identified several other potential issues that could break the Kajabi admin builder.

## Key Issues Found

### 1. **CSS Variable Usage (CRITICAL)**

**Problem**: The new sections use modern CSS variables that may not be recognized by Kajabi's builder:

```css
/* New sections use: */
color: var(--c-brand-600);
background: var(--c-brand-100);
color: var(--c-ink-900);

/* Working sections use: */
color: {{ section.settings.color_title_text }}; /* Direct Liquid variables */
background-color: {{ section.settings.background_color }};
```

**Solution**: Replace CSS variables with either:
- Direct hex values
- Liquid settings variables
- Fallback values: `color: var(--c-brand-600, #5E3BFF);`

### 2. **Include Statements Without Quote Marks**

**Problem**: New sections use bare include statements:
```liquid
{% include 'icon' %}
{% include 'responsive-image' %}
```

**Working sections use**:
```liquid
{% include "blog_listing" %}
{% include "pagination" %}
```

**Solution**: Always use quotes around snippet names.

### 3. **Complex Conditional Logic**

**Problem**: New sections have deeply nested conditional logic that might confuse Kajabi's parser:
```liquid
{% if section.settings.layout_style == 'single_quote' %}
  {% for block in section.blocks %}
    {% if block.type == 'quote' %}
      <!-- Multiple nested conditions -->
    {% endif %}
  {% endfor %}
{% elsif section.settings.layout_style == 'grid' %}
  <!-- More logic -->
{% endif %}
```

**Solution**: Simplify logic or split into separate sections.

### 4. **Inline Styles with CSS Variables**

**Problem**: Direct inline styles using CSS variables:
```liquid
style="font-size: 48px; font-weight: 700; color: var(--c-brand-600);"
```

**Solution**: Use either:
```liquid
style="font-size: 48px; font-weight: 700; color: #5E3BFF;"
<!-- OR -->
style="font-size: 48px; font-weight: 700; color: {{ section.settings.brand_color | default: '#5E3BFF' }};"
```

### 5. **Animation Keyframes**

**Problem**: New sections define animations that might not be supported:
```css
@keyframes fadeUp {
  to { opacity: 1; transform: translateY(0); }
  from { opacity: 0; transform: translateY(20px); }
}
```

**Solution**: Move animations to the main CSS file or remove them.

### 6. **Schema Issues**

**Problem**: Complex schema with potential formatting issues:
```json
{ "value": "var(--c-brand-100)", "label": "Lavender" }
```

**Solution**: Use hex values in schema:
```json
{ "value": "#E9E6FF", "label": "Lavender" }
```

### 7. **Block Type Validation**

**Problem**: Complex block filtering:
```liquid
{% assign featured_testimonial = section.blocks | where: 'type', 'featured' | first %}
{% assign grid_testimonials = section.blocks | where: 'type', 'testimonial' %}
```

**Solution**: Use simpler iteration:
```liquid
{% for block in section.blocks %}
  {% if block.type == 'featured' %}
    <!-- Handle featured -->
  {% endif %}
{% endfor %}
```

### 8. **Responsive Image Include**

**Problem**: Complex variable passing to includes:
```liquid
{% assign responsive_image = block.settings.author_image %}
{% assign responsive_alt = block.settings.author_name %}
{% include 'responsive-image' %}
```

**Solution**: Use direct image tags or ensure the snippet exists and is compatible.

## Recommended Fixes

### 1. Replace All CSS Variables
Create a mapping in the section's style block:
```liquid
<style>
  /* Define fallbacks */
  .an-testimonials {
    --c-brand-600: {{ section.settings.brand_color | default: '#5E3BFF' }};
    --c-brand-100: {{ section.settings.brand_light | default: '#E9E6FF' }};
  }
</style>
```

### 2. Simplify Layout Logic
Instead of complex if/elsif chains, consider separate sections:
- `an_testimonials_grid.liquid`
- `an_testimonials_featured.liquid`
- `an_testimonials_quote.liquid`

### 3. Remove Modern CSS Features
- Remove `inset` property
- Replace `gap` with margins
- Remove CSS custom properties from inline styles
- Use traditional animation syntax or remove animations

### 4. Fix Schema Values
Replace all CSS variable references in schema with hex values.

### 5. Test Include Dependencies
Ensure all included snippets exist and don't use unsupported features.

## Quick Test Checklist

1. [ ] Remove all `var(--variable)` usage
2. [ ] Add quotes to all include statements
3. [ ] Replace complex filters with simple loops
4. [ ] Use hex values in all schema options
5. [ ] Remove or simplify animations
6. [ ] Test each layout style separately
7. [ ] Ensure all referenced snippets exist

## Working Section Patterns to Follow

From `blog_listing_grid.liquid`:
- Uses conditional CSS with Liquid variables
- Simple block iteration
- Direct color values in styles
- Clear separation of desktop/mobile styles

From `feature_showcase.liquid`:
- Defines CSS variables via inline Liquid
- Uses simple conditional rendering
- Straightforward schema structure
- No complex array filtering

## Conclusion

The main issues stem from using modern CSS features and complex logic that Kajabi's builder might not support. The safest approach is to:
1. Use Liquid variables for all dynamic values
2. Keep logic simple and linear
3. Avoid modern CSS features
4. Test incrementally with each layout type

Consider breaking these unified sections back into simpler, single-purpose sections that are easier for Kajabi to parse and render in the admin interface.

---

## PRIORITY FIX ORDER

### 🚨 CRITICAL - Fix Immediately:

1. **Replace "settings" with "elements" in 43 files** - This is the #1 priority as it completely breaks Kajabi compatibility
2. **Remove CSS variables from inline styles** - These cause immediate rendering issues
3. **Add quotes to all include statements** - Parsing errors without quotes

### ⚠️ HIGH - Fix Before Testing:

4. **Replace CSS variable values in schema** - Schema won't validate with var() syntax
5. **Simplify complex conditional logic** - Can cause editor freezes
6. **Fix responsive-image includes** - May break if snippet doesn't exist

### 📋 MEDIUM - Fix for Production:

7. **Remove or simplify animations** - May not render in editor
8. **Use hex values instead of CSS variables** - Better compatibility
9. **Simplify array filtering** - Use basic loops instead

### 💡 LOW - Nice to Have:

10. **Consider splitting unified sections** - Easier maintenance
11. **Add fallback values for all CSS variables** - Extra safety
12. **Document all dependencies** - For future developers

**Estimated Time to Fix All Issues: 4-6 hours**

The most critical fix (settings → elements) can be done with careful find/replace in about 1-2 hours.