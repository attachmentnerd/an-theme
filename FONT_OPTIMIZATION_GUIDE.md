# Font Optimization Guide

## Overview

The AN themes implement a comprehensive font preloading and optimization strategy to improve Core Web Vitals, specifically CLS (Cumulative Layout Shift) and LCP (Largest Contentful Paint) scores.

## Current Font Setup

### Primary Fonts

**Inter (Sans-serif)** - Primary brand typeface
- Weight 400 (Regular) - Body text
- Weight 500 (Medium) - Subheadings
- Weight 600 (SemiBold) - Headings (heavily used - 19+ occurrences)
- Weight 700 (Bold) - Emphasis and strong headings (10+ occurrences)

**Merriweather (Serif)** - Accent font for specific sections
- Weight 400 (Regular) - Used in 10+ sections (quotes, blog content, etc.)

### Font Delivery

- **Source**: Google Fonts CDN (fonts.gstatic.com)
- **Format**: WOFF2 (modern, compressed format)
- **Version**: Inter v13, Merriweather v30
- **Loading Strategy**: Preload + inline @font-face

## Implementation Details

### 1. Font Preloading (`font_preload.liquid`)

**Location**:
- `/home/user/an-theme/shared/snippets/font_preload.liquid` (shared)
- `/home/user/an-theme/themes/website/snippets/font_preload.liquid` (website)

**What it does**:
1. DNS prefetch to `fonts.gstatic.com`
2. Preconnect to establish early connections
3. Preloads all 5 critical font files (Inter 400, 500, 600, 700 + Merriweather 400)
4. Inline @font-face declarations for immediate availability
5. Sets `font-display: swap` to prevent FOIT (Flash of Invisible Text)

**Code Structure**:
```liquid
<!-- DNS prefetch and preconnect -->
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload links for each font weight -->
<link rel="preload" href="[font-url].woff2" as="font" type="font/woff2" crossorigin>

<!-- Inline @font-face declarations -->
<style>
  @font-face {
    font-family: 'Inter';
    font-weight: 400;
    font-display: swap;
    src: url([font-url].woff2) format('woff2');
  }
</style>
```

### 2. Integration in Themes

**Website Theme**:
- Loaded via `themes/website/snippets/global_head.liquid` (line 28)
- `{% include 'font_preload' %}`

**Landing Theme**:
- Loaded via `themes/landing/snippets/global_head.liquid` (line 27)
- `{% include 'font_preload' %}`

**Product Themes**:
- Uses different font loading (Google Fonts CSS)
- Not affected by this optimization

### 3. CSS Variable Integration

The fonts are integrated into the design system via CSS variables in `/shared/styles/overrides.css`:

```css
:root {
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-serif: Merriweather, Georgia, "Times New Roman", serif;
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
}
```

## Performance Impact

### Before Optimization
- Only Inter 400 and 500 preloaded
- Missing weights caused browser to synthesize bold text (performance penalty)
- Potential layout shifts when fonts load
- Slower LCP due to sequential font loading

### After Optimization
- All used font weights preloaded
- Browser uses real font weights (no synthesis)
- Reduced layout shifts from font swaps
- Faster LCP through parallel font loading

### Estimated Improvements

**CLS (Cumulative Layout Shift)**:
- Improvement: 0.05 - 0.15 reduction
- Reason: Proper font weights prevent layout shifts during font swap

**LCP (Largest Contentful Paint)**:
- Improvement: 100-300ms faster
- Reason: Early preload + preconnect reduces font fetch time

**Total Font Payload**:
- Inter 400: ~13KB
- Inter 500: ~13KB
- Inter 600: ~13KB
- Inter 700: ~13KB
- Merriweather 400: ~15KB
- **Total: ~67KB** (minimal for 5 font weights)

## Best Practices

### ✅ DO:

1. **Keep font preloading minimal** - Only preload fonts used above the fold
2. **Use font-display: swap** - Always set to prevent FOIT
3. **Inline critical @font-face** - Reduces network requests
4. **Preconnect to font domains** - Establishes early connections
5. **Use WOFF2 format** - Best compression and browser support
6. **Specify exact weights** - Only load weights actually used

### ❌ DON'T:

1. **Don't preload unused fonts** - Wastes bandwidth
2. **Don't use font-display: block** - Causes FOIT (bad UX)
3. **Don't load Google Fonts CSS** - We inline @font-face instead
4. **Don't preload all font weights** - Be selective
5. **Don't forget crossorigin** - Required for CORS on fonts
6. **Don't use outdated font versions** - Keep URLs current

## Font URLs (Current)

### Inter (v13)
- Regular 400: `https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2`
- Medium 500: `https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7.woff2`
- SemiBold 600: `https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7.woff2`
- Bold 700: `https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0pL7.woff2`

### Merriweather (v30)
- Regular 400: `https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.woff2`

## Updating Fonts

If Google Fonts releases a new version:

1. Visit [Google Fonts](https://fonts.google.com/specimen/Inter)
2. Get the updated WOFF2 URLs
3. Update `/shared/snippets/font_preload.liquid`
4. Update `/themes/website/snippets/font_preload.liquid`
5. Test in browser to ensure fonts load
6. Re-export themes with updated fonts

## Alternative: System Font Stack

For maximum performance, consider using only system fonts:

```css
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
}
```

**Pros**:
- Zero font loading time
- Zero CLS from fonts
- Instant text rendering
- No network requests

**Cons**:
- Less brand consistency across platforms
- Different appearance on Windows vs Mac vs Linux
- No unique brand typography

**When to use**: For maximum performance where brand typography is less critical.

## Monitoring & Testing

### Tools to Test Font Loading

1. **Chrome DevTools**:
   - Network tab → Filter by Font
   - Check font timing and preload priority

2. **PageSpeed Insights**:
   - Check CLS and LCP scores
   - Look for "Ensure text remains visible during webfont load"

3. **WebPageTest**:
   - Waterfall view shows font loading timeline
   - Filmstrip shows when fonts render

### What to Look For

- ✅ Preload fonts load early (high priority)
- ✅ Font swap happens quickly with swap enabled
- ✅ No layout shifts during font loading
- ✅ Text is visible immediately (not invisible)
- ✅ LCP occurs after fonts are loaded

## Troubleshooting

### Issue: Fonts not loading
**Solution**: Check crossorigin attribute on preload links

### Issue: Wrong font weights rendering
**Solution**: Verify @font-face declarations match preload URLs

### Issue: High CLS score
**Solution**: Ensure font-display: swap is set, check for layout shifts

### Issue: Slow LCP
**Solution**: Verify preconnect and preload are working, check Network tab

### Issue: FOIT (invisible text)
**Solution**: Change font-display from block/auto to swap

## Files Modified

### Optimization Implementation (November 2025)

1. `/shared/snippets/font_preload.liquid` - Updated to include Inter 600 & 700
2. `/themes/website/snippets/font_preload.liquid` - Updated to match shared version
3. This guide - Created comprehensive documentation

## Version History

- **v1.0** (2025-11-05): Complete font optimization with all weights
  - Added Inter 600 (SemiBold) preload
  - Added Inter 700 (Bold) preload
  - Updated to Inter v13 URLs
  - Added comprehensive documentation

- **v0.5** (Previous): Basic font preloading
  - Only Inter 400 and 500
  - Missing heavily-used weights

## Related Documentation

- [CLAUDE.md](/home/user/an-theme/CLAUDE.md) - Theme development guide
- [IMAGE_OPTIMIZATION_GUIDE.md](/home/user/an-theme/IMAGE_OPTIMIZATION_GUIDE.md) - Image optimization
- [Core Web Vitals](https://web.dev/vitals/) - Performance metrics

## Support

For questions or issues with font optimization, consult:
- This documentation
- Google Fonts documentation
- Chrome DevTools font analysis
- PageSpeed Insights recommendations
