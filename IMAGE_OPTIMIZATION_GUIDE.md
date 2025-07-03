# Image Optimization Migration Guide

This guide explains how to migrate existing `<img>` tags to use the responsive-image snippet for better performance.

## Why Migrate?

The responsive-image snippet provides:
- **Responsive srcset** - Serves appropriately sized images for each device
- **Layout shift prevention** - Aspect ratios prevent content jumping
- **Blur-up placeholders** - Smooth loading experience
- **Priority loading** - LCP optimization for hero images
- **Brand placeholders** - Professional fallbacks when images are missing

## Basic Migration Pattern

### Before (Basic img tag):
```liquid
<img src="{{ image | image_picker_url: '800x' }}" 
     alt="Description" 
     class="img-fluid"
     loading="lazy">
```

### After (Responsive image):
```liquid
{% render 'responsive-image',
  image: image,
  alt: 'Description',
  class: 'img-fluid',
  sizes: '(max-width: 767px) 100vw, 800px',
  aspect_ratio: '16/9',
  placeholder_type: 'default',
  blur_up: true
%}
```

## Common Use Cases

### 1. Hero Images (Above-fold, LCP Critical)
```liquid
{% render 'responsive-image',
  image: section.settings.hero_image,
  alt: 'Hero image',
  sizes: '100vw',
  priority: true,              # Critical for LCP
  aspect_ratio: '16/9',
  widths: '800,1200,1600,2000,2400',
  placeholder_type: 'hero',
  blur_up: true
%}
```

### 2. Book Covers
```liquid
{% render 'responsive-image',
  image: section.settings.book_image,
  alt: book_title,
  sizes: '(max-width: 767px) 280px, 400px',
  aspect_ratio: '2/3',          # Book aspect ratio
  widths: '280,400,600,800',
  placeholder_type: 'book',
  blur_up: true
%}
```

### 3. Avatar Images
```liquid
{% render 'responsive-image',
  image: author_image,
  alt: author_name,
  class: 'rounded-circle',
  sizes: '60px',
  aspect_ratio: '1/1',          # Square for avatars
  widths: '60,120,180',
  placeholder_type: 'avatar'
%}
```

### 4. Feature Images
```liquid
{% render 'responsive-image',
  image: block.settings.image,
  alt: block.settings.alt_text,
  sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw',
  aspect_ratio: '4/3',
  placeholder_type: 'feature',
  blur_up: true
%}
```

## Parameters Reference

### Required Parameters:
- `image`: The image URL from image_picker_url
- `alt`: Alt text for accessibility

### Optional Parameters:
- `class`: CSS classes (default: 'img-fluid')
- `sizes`: Responsive sizes attribute (has smart defaults)
- `loading`: 'lazy' or 'eager' (default: 'lazy')
- `priority`: true for LCP images (adds fetchpriority="high")
- `widths`: Comma-separated widths (default: "400,600,800,1200,1600,2000")
- `width`/`height`: Explicit dimensions
- `aspect_ratio`: CSS aspect ratio (e.g., "16/9", "2/3", "1/1")
- `placeholder_type`: 'default', 'avatar', 'book', 'feature', 'logo', 'hero'
- `blur_up`: Enable blur-up effect (default: false)

## Sizes Attribute Guide

The `sizes` attribute tells browsers which image size to download:

```liquid
# Full width on all devices
sizes: '100vw'

# Full width mobile, 800px desktop
sizes: '(max-width: 767px) 100vw, 800px'

# Responsive columns
sizes: '(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw'

# Fixed size
sizes: '400px'

# Complex responsive
sizes: '(max-width: 575px) 100vw, (max-width: 767px) 90vw, (max-width: 991px) 50vw, 33vw'
```

## Aspect Ratio CSS Classes

Use these utility classes on image containers:

- `.aspect-square` - 1:1 (avatars, logos)
- `.aspect-video` - 16:9 (videos, heroes)
- `.aspect-book` - 2:3 (book covers)
- `.aspect-landscape` - 4:3 (general images)
- `.aspect-portrait` - 3:4 (portraits)
- `.aspect-wide` - 21:9 (banners)
- `.aspect-golden` - 1.618:1 (golden ratio)

### Responsive Aspect Ratios:
- `.aspect-square--mobile` - Square on mobile only
- `.aspect-video--tablet-up` - 16:9 on tablet+

## Migration Checklist

1. ✅ Replace `<img>` with `{% render 'responsive-image' %}`
2. ✅ Add appropriate `sizes` attribute
3. ✅ Set `priority: true` for above-fold images
4. ✅ Add `aspect_ratio` to prevent layout shift
5. ✅ Choose appropriate `placeholder_type`
6. ✅ Enable `blur_up` for better UX (optional)
7. ✅ Optimize `widths` array for your use case
8. ✅ Test on multiple devices and connection speeds

## Performance Best Practices

1. **Hero Images**: Always use `priority: true` and `loading: 'eager'`
2. **Above-fold**: First 3-4 images should have `priority: true`
3. **Below-fold**: Use default lazy loading
4. **Small images**: Use smaller widths array (e.g., "100,200,400")
5. **Background images**: Consider using CSS for decorative backgrounds

## Testing Your Migration

1. **Chrome DevTools**:
   - Network tab: Check which image size loads
   - Lighthouse: Run performance audit
   - Coverage: Verify no unused image bytes

2. **Core Web Vitals**:
   - LCP: Should improve with priority loading
   - CLS: Should be near 0 with aspect ratios
   - Check on PageSpeed Insights

3. **Visual Testing**:
   - Verify blur-up effect works
   - Check placeholder displays correctly
   - Test on slow 3G connection

## Common Issues

### Issue: Blur-up not working
**Solution**: Ensure `blur_up: true` is set and image has proper container styling

### Issue: Layout shift still occurring
**Solution**: Add explicit `aspect_ratio` or use `width` and `height` attributes

### Issue: Wrong image size loading
**Solution**: Adjust `sizes` attribute to match your layout

### Issue: Image not displaying
**Solution**: Check that image variable is passed correctly without filters

## Example: Complete Section Migration

### Before:
```liquid
<section class="hero">
  <img src="{{ section.settings.hero_bg | image_picker_url: '1920x' }}" 
       alt="Hero background">
  <div class="content">
    <img src="{{ section.settings.author_photo | image_picker_url: '200x' }}"
         alt="Author"
         class="avatar">
    <h1>{{ section.settings.title }}</h1>
  </div>
</section>
```

### After:
```liquid
<section class="hero">
  {% render 'responsive-image',
    image: section.settings.hero_bg,
    alt: 'Hero background',
    sizes: '100vw',
    priority: true,
    aspect_ratio: '16/9',
    widths: '800,1200,1600,2000,2400',
    placeholder_type: 'hero',
    blur_up: true
  %}
  <div class="content">
    {% render 'responsive-image',
      image: section.settings.author_photo,
      alt: 'Author',
      class: 'avatar rounded-circle',
      sizes: '200px',
      priority: true,
      aspect_ratio: '1/1',
      widths: '200,400',
      placeholder_type: 'avatar'
    %}
    <h1>{{ section.settings.title }}</h1>
  </div>
</section>
```

This migration guide should help maintain consistency when optimizing images across the AN themes.