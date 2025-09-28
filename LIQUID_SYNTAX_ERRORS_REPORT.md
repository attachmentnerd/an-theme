# Liquid Syntax Errors Report

Generated: 2025-08-22

## Summary

Comprehensive search across all sections in `/shared/sections/` revealed systematic Liquid syntax errors that need to be fixed.

## Error Types Found

### 1. Double Mustache Brackets (`{{ {{`)
**Pattern**: `{{ {{ variable }} }}`
**Should be**: `{{ variable }}`

**Files affected (21 total):**
- testimonial_enhanced_highlights.liquid
- book_author_sa.liquid
- book_details.liquid (multiple occurrences)
- stats_bar.liquid
- book_showcase_modern.liquid
- product_value_stack.liquid
- logo_list.liquid
- feature_showcase.liquid
- feature_comparison.liquid
- link_list.liquid
- media_text.liquid
- quote_blocks.liquid
- book_showcase.liquid
- full_width_media.liquid
- media_feature.liquid
- stats_section.liquid
- video_feature.liquid
- faq_accordion.liquid
- lead_magnet.liquid
- about_hero.liquid
- cta_section.liquid

### 2. Incomplete Default Filters
**Pattern**: `| default: }}`
**Should be**: `| default: 'Default Value' }}`

**Files affected (11 total):**
- book_details.liquid (lines 19, 52, 73, 106)
- book_author_sa.liquid
- stats_bar.liquid
- book_showcase_modern.liquid
- logo_list.liquid
- feature_showcase.liquid
- stats_section.liquid
- faq_accordion.liquid
- testimonial_enhanced_highlights.liquid
- lead_magnet.liquid
- hero.liquid

### 3. Complex Conditionals with Parentheses
**Pattern**: `{% if condition1 or (condition2 and condition3) %}`
**Issue**: Kajabi's Liquid doesn't support parentheses in conditionals

**Files affected:**
- an_testimonials.liquid

## Recommended Fix Strategy

### Option 1: Manual Fixes
Fix each file individually as they cause errors in Kajabi.

### Option 2: Automated Script (Recommended)
Create a script to automatically fix all occurrences:

```bash
# Fix double mustache brackets
find /shared/sections -name "*.liquid" -exec sed -i '' 's/{{ {{ \([^}]*\) }} }}/{{ \1 }}/g' {} \;

# Fix incomplete default filters (requires more careful handling)
# Each case needs appropriate default value based on context
```

### Option 3: Systematic Review
1. Fix all double bracket errors first (simple find/replace)
2. Review each incomplete default filter to add appropriate values
3. Refactor complex conditionals to use intermediate variables

## Priority Files to Fix

Based on frequency and impact:
1. **book_details.liquid** - 4 errors
2. **stats_bar.liquid** - Multiple errors
3. **book_showcase_modern.liquid** - Multiple errors
4. **an_testimonials.liquid** - Complex conditional error

## Next Steps

1. Create backup of all affected files
2. Run automated fixes for double brackets
3. Manually review and fix default filter values
4. Test each section in Kajabi after fixes
5. Export updated themes

## Prevention

To prevent future errors:
1. Use linting tools for Liquid syntax
2. Test sections in Kajabi before committing
3. Avoid complex conditionals with parentheses
4. Always provide default values for filters
5. Be careful with nested Liquid tags