# Section Audit Report - AN Theme

## Summary
All sections with presets have proper category fields configured, which is required for dynamic sections in Kajabi.

## Dynamic Sections (34 total)
These sections can be added/removed/reordered by users:

### Hero Sections
- about_hero.liquid ✓
- hero.liquid ✓
- parallax_hero.liquid ✓
- utility_hero.liquid ✓

### Content Sections
- author_bio.liquid ✓
- author_bio_modern.liquid ✓
- book.liquid ✓
- book_buy.liquid ✓
- book_showcase.liquid ✓
- book_showcase_modern.liquid ✓
- book_testimonials_modern.liquid ✓
- colored_highlight.liquid ✓
- feature_highlight.liquid ✓
- feature_showcase.liquid ✓
- free_resource.liquid ✓
- section.liquid ✓
- testimonials.liquid ✓

### CTA Sections
- cta_section.liquid ✓
- full_width_cta.liquid ✓
- newsletter_cta_modern.liquid ✓

### Pricing
- pwyc_pricing_slider.liquid ✓

### Navigation/Header/Footer
- footer.liquid ✓
- footer_modern.liquid ✓
- header.liquid ✓
- logo.liquid ✓
- navigation.liquid ✓
- navigation_old.liquid ✓

### Securely Attached Sections (ALL DYNAMIC ✓)
- sa_book_showcase.liquid ✓
- sa_free_chapter_cta.liquid ✓
- sa_hero.liquid ✓
- sa_key_benefits.liquid ✓
- sa_purchase_cta.liquid ✓
- sa_testimonials.liquid ✓
- sa_workbook_preview.liquid ✓

## Static Sections (22 total)
These sections can only be added via templates:

### Blog/Newsletter
- announcements.liquid
- blog_listings.liquid
- blog_post_body.liquid
- blog_search_results.liquid
- newsletter_hero.liquid
- newsletter_listings.liquid
- newsletter_post_body.liquid
- newsletter_recent_posts.liquid

### E-commerce
- products.liquid
- store_builder.liquid
- sales_page_body.liquid
- sales_page_sidebar.liquid

### Other
- book_showcase_modern_alt.liquid
- book_showcase_rsak.liquid
- book_showcase_sa.liquid
- exit_pop.liquid
- header_static.liquid
- login.liquid
- member_directory.liquid
- page_content.liquid
- thank_you.liquid
- two_step.liquid

## Potential Issues & Solutions

### 1. Securely Attached Page Dynamic Sections
The issue you're experiencing is NOT due to missing categories. All SA sections are properly configured.

**Possible causes:**
1. **Theme type mismatch**: Ensure the Securely Attached page is using the Website theme, not Landing or Product
2. **Cache issue**: Clear Kajabi's cache and reload the editor
3. **Page type**: Some page types in Kajabi don't support dynamic sections
4. **Template issue**: Verify {{ content_for_index }} is present (it is in your template)

### 2. Sections That Could Be Made Dynamic
Consider adding presets to these commonly-used sections:

**High Priority:**
- newsletter_hero.liquid - Often needed on multiple pages
- two_step.liquid - Useful for various opt-ins
- blog_listings.liquid - Could be added to any page

**Medium Priority:**
- products.liquid - For showcasing products anywhere
- exit_pop.liquid - For conversion optimization

### 3. Recommendations

1. **Test in Kajabi**: 
   - Create a new page with Website theme
   - Check if dynamic sections work there
   - If yes, the issue is page-specific, not section-specific

2. **Add Presets to Key Static Sections**:
   ```liquid
   "presets": [
     {
       "name": "Newsletter Hero",
       "category": "Hero",
       "description": "Hero section optimized for newsletter signups",
       "settings": {}
     }
   ]
   ```

3. **Section Categories in Use**:
   - Content (most common)
   - Hero
   - Features
   - Media
   - Commerce

All existing dynamic sections use appropriate categories.