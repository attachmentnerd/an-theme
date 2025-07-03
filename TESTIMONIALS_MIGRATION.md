# Testimonials Section Migration Guide

## Overview
The new `an_testimonials.liquid` section replaces 4 separate testimonial sections with a single, flexible solution.

## Replaced Sections
1. `testimonial_grid_cards.liquid`
2. `testimonial_sa_book_style.liquid`
3. `testimonial_enhanced_highlights.liquid`
4. `content_quote_block.liquid`

## Migration Instructions

### 1. Testimonial Grid Cards → an_testimonials
```liquid
<!-- Old -->
{% section 'testimonial_grid_cards' %}

<!-- New -->
{% section 'an_testimonials' %}
```

**Settings Migration:**
- Set `layout_style: "grid"`
- Use `columns` setting for 2-4 column grids
- Enable `show_stats: true` for statistics bar
- Add testimonial blocks with:
  - `category` for badges (Sleep, Big Feelings, etc.)
  - `featured: true` for special styling
  - `rating` for star ratings
- All avatars and placeholders work automatically

### 2. Testimonial SA Book Style → an_testimonials
```liquid
<!-- Old -->
{% section 'testimonial_sa_book_style' %}

<!-- New -->
{% section 'an_testimonials' %}
```

**Settings Migration:**
- Set `layout_style: "mixed"` for featured + grid
- Or use `layout_style: "featured"` for single large testimonial
- Enable `show_stats: true` for the 3 statistics
- Use `featured` block type for the main testimonial
- Add regular `testimonial` blocks for the grid portion

### 3. Testimonial Enhanced Highlights → an_testimonials
```liquid
<!-- Old -->
{% section 'testimonial_enhanced_highlights' %}

<!-- New -->
{% section 'an_testimonials' %}
```

**Settings Migration:**
- Set `layout_style: "mixed"`
- Use `featured` block for the large testimonial
- Add `testimonial` blocks for the 3-column review grid
- Categories automatically become badges
- Initial avatars work when no image provided

### 4. Content Quote Block → an_testimonials
```liquid
<!-- Old -->
{% section 'content_quote_block' %}

<!-- New -->
{% section 'an_testimonials' %}
```

**Settings Migration:**
- Set `layout_style: "single_quote"`
- Enable `show_quote_icon: true`
- Use `quote_alignment` for left/center/right
- Add a `quote` block type
- Set `quote_size` for font size control
- Author images and attribution supported

## Key Features

### Layout Options
1. **Grid**: 2-4 column testimonial cards
2. **Featured**: Single large testimonial with emphasis
3. **Mixed**: Featured testimonial + supporting grid
4. **Single Quote**: Large centered quote (replaces quote block)

### Block Types
- **testimonial**: Standard testimonial for grids
- **featured**: Large testimonial for featured/mixed layouts
- **quote**: Single quote for quote block replacement

### Common Block Settings
- Quote text
- Author name, title, and image
- Star rating (0-5)
- Category badges
- Featured toggle (for grid layout)

### Section Features
- Statistics bar (3 customizable stats)
- Background color options
- Quote icon display
- CTA button
- Animations on scroll

## Benefits of Migration

1. **Single Source**: One section handles all testimonial needs
2. **More Flexible**: Mix and match layouts easily
3. **Better Maintenance**: Update one file instead of four
4. **Consistent Styling**: All testimonials use same design system
5. **Enhanced Features**: Every layout gets all features

## Example Configurations

### Customer Reviews Grid
```liquid
{% section 'an_testimonials' %}
Settings:
- layout_style: "grid"
- columns: 3
- show_stats: true
- Multiple testimonial blocks with categories
```

### Book Testimonials
```liquid
{% section 'an_testimonials' %}
Settings:
- layout_style: "mixed"
- Featured testimonial + 2-column grid
- Statistics bar enabled
```

### Expert Quote
```liquid
{% section 'an_testimonials' %}
Settings:
- layout_style: "single_quote"
- show_quote_icon: true
- quote_alignment: "center"
- Large quote with author attribution
```

### Social Proof Section
```liquid
{% section 'an_testimonials' %}
Settings:
- layout_style: "featured"
- Single powerful testimonial
- Optional CTA button
```

## Migration Checklist

- [ ] Identify all uses of old testimonial sections
- [ ] Map old settings to new layout_style
- [ ] Convert blocks to appropriate new types
- [ ] Test all layouts in Kajabi preview
- [ ] Update any custom CSS targeting old classes
- [ ] Create saved sections for common configs
- [ ] Remove old sections after migration

## Notes

- Avatar placeholders generate automatically when no image
- All animations and hover effects preserved
- Statistics bar can be shown with any layout
- Category badges maintained from grid cards version
- Featured testimonials get special border/badge
- Responsive behavior optimized for all devices