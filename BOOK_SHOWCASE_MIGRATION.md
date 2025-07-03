# Book Showcase Section Migration Guide

## Overview
The new `an_book_showcase.liquid` section replaces 5 separate book/product showcase sections with a single, flexible solution.

## Replaced Sections
1. `book_showcase_modern.liquid`
2. `book_showcase_sa.liquid` 
3. `book_showcase_rsak.liquid`
4. `book_details.liquid`
5. `feature_single_clean.liquid`

## Migration Instructions

### 1. Book Showcase Modern → an_book_showcase
```liquid
<!-- Old -->
{% section 'book_showcase_modern' %}

<!-- New -->
{% section 'an_book_showcase' %}
```

**Settings Migration:**
- Set `layout_style: "modern"`
- Enable `enable_glow: true`
- Use `micro_label` for small text above title
- Use `floating_badge_text` for the yellow badge
- Set `feature_display: "pills"` for pill-style features
- Enable `show_testimonial` and add testimonial content

### 2. Book Showcase SA → an_book_showcase
```liquid
<!-- Old -->
{% section 'book_showcase_sa' %}

<!-- New -->
{% section 'an_book_showcase' %}
```

**Settings Migration:**
- Set `layout_style: "classic"`
- Set `background_style: "#FAFAFA"`
- Use `feature_display: "list"` for checkmark list
- Add feature blocks with checkmark icons
- Enable `show_testimonial` for blockquote style

### 3. Book Showcase RSAK → an_book_showcase
```liquid
<!-- Old -->
{% section 'book_showcase_rsak' %}

<!-- New -->
{% section 'an_book_showcase' %}
```

**Settings Migration:**
- Use `top_badge_text` and `bottom_badge_text` for corner badges
- Add multiple button blocks for retailers:
  - Amazon button with `icon: "amazon"`
  - Barnes & Noble with custom text
  - Target with `icon: "bullseye"`
- Enable `show_cta_box` for free chapter signup

### 4. Book Details → an_book_showcase
```liquid
<!-- Old -->
{% section 'book_details' %}

<!-- New -->
{% section 'an_book_showcase' %}
```

**Settings Migration:**
- Set `layout_style: "three_column"`
- Enable `show_logo_row: true`
- Add logo blocks for press logos
- Add testimonial blocks with `position: "left"` and `position: "right"`
- Enable `show_badge` for book badge

### 5. Feature Single Clean → an_book_showcase
This section was already attempting to be a unified version, so migration is straightforward:

```liquid
<!-- Old -->
{% section 'feature_single_clean' %}

<!-- New -->
{% section 'an_book_showcase' %}
```

## Key Differences

### Layout Styles
- **Classic**: Traditional layout with grey background
- **Modern**: Z-pattern with glow effects and animations
- **Clean**: Minimal styling, no decorations
- **Three Column**: Unique layout with testimonials on sides

### Feature Display
- **List**: Traditional checkmark list
- **Pills**: Modern pill badges with optional icons

### Badge Options
- `micro_label`: Small text above title
- `floating_badge`: Angled badge (modern only)
- `top_badge_text`: Top corner badge
- `bottom_badge_text`: Bottom corner badge

### Button Flexibility
- Add unlimited buttons via blocks
- Each button can have:
  - Custom style (primary, secondary, outline)
  - Optional icon
  - New tab option
  - Custom URL

### Testimonial Options
- Inline testimonial for 2-column layouts
- Side testimonials for 3-column layout
- Modern card or classic blockquote styles

## Benefits of Migration

1. **Single Source of Truth**: One section to maintain instead of five
2. **More Flexibility**: Mix and match features from all variants
3. **Better Performance**: Less code duplication
4. **Future-Proof**: Easy to add new features to one section
5. **Consistent Updates**: Changes apply everywhere

## Example Configurations

### Modern Book Launch
```liquid
{% section 'an_book_showcase' %}
Settings:
- layout_style: "modern"
- micro_label: "💙 FOR COUPLES"
- floating_badge_text: "BESTSELLER"
- enable_glow: true
- feature_display: "pills"
- show_testimonial: true
```

### Classic Product Page
```liquid
{% section 'an_book_showcase' %}
Settings:
- layout_style: "classic"
- background_style: "#FAFAFA"
- feature_display: "list"
- Multiple retailer buttons
```

### Press Kit Style
```liquid
{% section 'an_book_showcase' %}
Settings:
- layout_style: "three_column"
- show_logo_row: true
- Add press logos
- Add side testimonials
```

## Next Steps

1. Update all page templates to use `an_book_showcase`
2. Create saved sections in Kajabi for common configurations
3. Remove old sections from theme after migration
4. Update any custom CSS targeting old section classes

## Support

For questions about migration or to report issues, please reference this guide and the section schema.