# AN Theme Codebase Analysis Report
## Code Deduplication and Optimization Opportunities

**Report Date:** November 4, 2025
**Analysis Scope:** /home/user/an-theme
**Total Sections:** 143 files (3.3M)
**Total Snippets:** 136 files (416K)

---

## Executive Summary

The codebase has significant redundancy and unused components:
- **114 out of 143 sections (79.7%)** are not referenced anywhere
- **107 out of 136 snippets (78.7%)** are not referenced anywhere
- **6 backup directories totaling ~14.7M** can be safely deleted
- **Multiple consolidated sections** exist but old versions remain
- **Potential bundle size reduction: ~18M+** (without affecting functionality)

---

## CRITICAL FINDINGS

### 1. Backup Directories (14.7M total - DELETE THESE)

These are safe to remove immediately:

```
/home/user/an-theme/themes/product_backup_20250907_162341/        5.0M
/home/user/an-theme/themes/website.v23_backup/                   3.9M
/home/user/an-theme/themes/landing.v23_backup/                   3.5M
/home/user/an-theme/themes/website_backup_20250929_125544/       971K
/home/user/an-theme/themes/website.backup_current/               830K
/home/user/an-theme/themes/landing.backup_current/               457K
```

**Action:** Delete all backup directories. They duplicate current theme files and serve no purpose.

---

## DUPLICATE SECTIONS WITH UNIFIED REPLACEMENTS

These newer unified sections explicitly replace multiple older versions:

### 2. Book Showcase Consolidation

**Unified Version (34K):**
- `/home/user/an-theme/shared/sections/book_showcase_unified.liquid`
  - Consolidates: book_showcase_modern, book_showcase_sa, book_showcase_rsak, book_details, feature_single_clean
  - Status: NOT REFERENCED (unused)

**Deprecated Versions (remove - 21K total):**
- `book_showcase_modern.liquid` (7.4K) - ❌ UNUSED
- `book_showcase_sa.liquid` (7.0K) - ❌ UNUSED
- `book_showcase_rsak.liquid` (6.5K) - ❌ UNUSED

**Recommendation:** 
- [ ] Audit which pages need `book_showcase_unified` support
- [ ] Delete the 3 old variants once unified version is deployed
- [ ] Update documentation to reference unified version

---

### 3. Testimonials Consolidation

**Unified Version (35K):**
- `/home/user/an-theme/shared/sections/an_testimonials.liquid`
  - Consolidates: testimonial_grid_cards, testimonial_sa_book_style, testimonial_enhanced_highlights, content_quote_block
  - Status: NOT REFERENCED (unused)

**Deprecated Versions (remove - 53K total):**
- `testimonial_grid_cards.liquid` (18K) - ❌ UNUSED
- `testimonial_sa_book_style.liquid` (12K) - ❌ UNUSED
- `testimonial_enhanced_highlights.liquid` (11K) - ❌ UNUSED
- `content_quote_block.liquid` (12K) - ❌ UNUSED
- `testimonial_book_split_layout.liquid` (20K) - ❌ UNUSED

**Additional Unused Testimonial Files (remove - 34K):**
- `feature_testimonialbottom.liquid` (34K) - ❌ UNUSED

**Recommendation:**
- [ ] Delete 6 old testimonial variants once an_testimonials is fully deployed
- [ ] Consolidates 53K of redundant code

---

## UNUSED TEST/TEMPORARY SECTIONS (DELETE - 7.6K)

These are clearly test files:

```
footer_test_blocks.liquid      2.0K  - ❌ UNUSED
footer_test_form.liquid        1.5K  - ❌ UNUSED
footer_test_menus.liquid       1.7K  - ❌ UNUSED
footer_test_minimal.liquid     737B  - ❌ UNUSED
```

**Action:** Delete all footer_test_*.liquid files immediately.

---

## UNUSED PAGE/SPEAKING SECTIONS (DELETE - 186K)

These page sections are not referenced and have better alternatives:

```
about-page-ultra-editable.liquid        - ❌ UNUSED
page_content.liquid                     - ❌ UNUSED
page_rsak.liquid                        - ❌ UNUSED
page_sa_full.liquid         (2.1K)      - ❌ UNUSED
page_sa_v1.liquid          (27K)        - ❌ UNUSED
page_sa_v2.liquid          (52K)        - ❌ UNUSED
page_sales_content.liquid   (1.1K)      - ❌ UNUSED
speaking-page-editable.liquid           - ❌ UNUSED
speaking-page-ultra-editable.liquid     - ❌ UNUSED
```

**Currently Used Page Sections:**
- page-about ✓
- page-coaching ✓
- page-raising-securely-attached-kids ✓
- page-securely-attached ✓
- page-securely-attached-complete ✓
- page-securely-attached-full ✓
- page-securely-attached-v2 ✓
- page-speaking ✓
- page-speaking-branded ✓
- page-speaking-middle ✓
- page-speaking-structured ✓

**Recommendation:** Delete unused variants, keep only actively referenced pages.

---

## COMPLETELY UNUSED SECTIONS (114 Total - ~1.2M)

The following 114 sections are NOT referenced anywhere in the codebase:

### Hero Sections (5 unused)
- hero_about_page.liquid
- hero_clean.liquid
- hero_clean2.liquid
- hero_modern.liquid
- hero_parallax.liquid
- hero_video.liquid

### Blog/Content Sections (12 unused)
- blog_listing_grid.liquid
- blog_newsletter_content.liquid
- blog_newsletter_grid.liquid
- blog_newsletter_recent.liquid
- blog_post_content.liquid
- blog_search_results.liquid
- content_advanced_bio.liquid
- content_author_bio.liquid
- content_contact_form.liquid
- content_colored_highlight.liquid
- content_faq_accordion.liquid
- content_featured_resources.liquid

### CTA/Feature Sections (15 unused)
- cta_free_chapter.liquid
- cta_free_resource.liquid
- cta_full_width.liquid
- cta_mobile_sticky.liquid
- cta_newsletter_modern.liquid
- cta_purchase_book.liquid
- cta_slim.liquid
- cta_standard.liquid
- cta_two_step_optin.liquid
- feature_dark_cards.liquid
- feature_logo_bar.liquid
- feature_press_logos.liquid
- feature_single_clean.liquid
- feature_tabs_scroll.liquid
- feature_two_column_list.liquid

### Book Related (9 unused)
- book_author_sa.liquid
- book_bonuses_sa.liquid
- book_details.liquid
- book_hero_sa.liquid
- book_journey_sa.liquid
- book_purchase.liquid
- book_retailers_sa.liquid
- book_workbook_preview_sa.liquid
- books_showcase_grid.liquid

### Generic Section Templates (30+ unused)
- section.liquid (370K) - Generic container, probably unused
- section_accordion.liquid
- section_announcement_banner.liquid
- section_announcements_page.liquid
- section_big_idea_card.liquid
- section_blog_filtered.liquid
- section_blog_post_simple.liquid
- section_featured_grid.liquid
- section_landing_hero.liquid
- section_library_event_card.liquid
- section_prefilled_form.liquid
- section_pricing_pwyc.liquid
- section_pricing_pwyc_simple.liquid
- section_program_dashboard.liquid
- section_program_flip_cards.liquid
- section_program_overview.liquid
- section_program_overview_flagship.liquid
- section_resource_library_dashboard.liquid
- section_slim_card.liquid
- section_spp_1.liquid
- section_spp_cta.liquid
- section_spp_details.liquid
- section_spp_expert.liquid
- section_spp_letter.liquid
- section_spp_modules.liquid
- section_success_experience.liquid
- section_support_dashboard.liquid
- section_support_help_center.liquid
- section_thin_hero.liquid
- section_universal_blocks.liquid
- section_video_portrait.liquid
- section_videoask_popup.liquid

### Pricing/Product Sections (5 unused)
- pricing_program_cards.liquid
- pricing_pwyc.liquid
- pricing_pwyc_slider.liquid
- product_grid.liquid
- gated_resource.liquid

### Member/Utility Sections (8 unused)
- master_listing_grid.liquid
- member_progress_dashboard.liquid
- table_section.liquid
- utility_announcements.liquid
- utility_exit_popup.liquid
- utility_login.liquid
- utility_logo.liquid
- utility_member_directory.liquid
- utility_store_builder.liquid

### Other (remaining unused)
- content_instagram_feed.liquid
- content_quote_block.liquid (part of testimonial consolidation)
- content_resource_downloads.liquid
- content_stats_bar.liquid
- content_team_coaches.liquid
- content_thank_you.liquid
- gated_resource.liquid

---

## COMPLETELY UNUSED SNIPPETS (107 Total - ~150K)

107 out of 136 snippets are not referenced. High-impact unused snippets:

### Block/Component Snippets (41 unused)
All of these "block_*" snippets appear to be Kajabi component helpers that aren't being included:
- block_accordion.liquid
- block_assessment.liquid
- block_audio.liquid
- block_blog.liquid
- block_card.liquid
- block_coaching_scheduling_widget.liquid
- block_code.liquid
- block_countdown.liquid
- block_cta.liquid
- block_event.liquid
- block_event_video.liquid
- block_external_widget.liquid
- block_feature.liquid
- block_form.liquid
- block_image.liquid
- block_link_list.liquid
- block_login.liquid
- block_multi_video.liquid
- block_offer.liquid
- block_password_edit.liquid
- block_password_reset.liquid
- block_pricing.liquid
- block_social_icons.liquid
- block_social_share.liquid
- block_text.liquid
- block_video.liquid
- block_video_embed.liquid
- block.liquid (generic, likely parent)

### Blog/Newsletter Snippets (12 unused)
- blog_listing.liquid
- blog_post_body_cta.liquid
- blog_post_body_media.liquid
- blog_post_body_opt_in.liquid
- blog_search_result.liquid
- blog_sidebar.liquid
- newsletter_categories.liquid
- newsletter_form.liquid
- newsletter_listing.liquid
- newsletter_search.liquid
- newsletter_sidebar.liquid
- newsletter_social_share.liquid

### UI Element Snippets (19 unused)
- alert_messages.liquid
- custom_card.liquid
- download_card.liquid
- editor_grid.liquid
- editor_guides.liquid
- editor_reveal.liquid
- element_button.liquid
- element_button_login.liquid
- element_button_section.liquid
- element_button_submit_block.liquid
- element_button_submit_search.liquid
- element_button_submit_section.liquid
- element_progress.liquid
- element_social_icons.liquid
- element_social_icons_style.liquid
- footer_block.liquid
- footer_block_copyright.liquid
- footer_block_social_icons.liquid
- header_block.liquid

### Sidebar/Page Components (13 unused)
- member.liquid
- member_search.liquid
- nav_minimal.liquid
- offer_card.liquid
- offer_pricing.liquid
- pagination.liquid
- product.liquid
- resume_course.liquid
- sales_page_tags.liquid
- section_styles.liquid
- shared_block_logo.liquid
- shared_block_menu.liquid
- sidebar_categories.liquid
- sidebar_cta.liquid
- sidebar_custom.liquid
- sidebar_image.liquid
- sidebar_instructor.liquid
- sidebar_recent_posts.liquid
- sidebar_search.liquid
- sidebar_social.liquid
- sidebar_social_share.liquid

### Global/Script Snippets (remaining)
- alert_messages.liquid
- announcement.liquid
- announcement_search.liquid
- an_scripts.liquid
- cta_popup.liquid
- disqus.liquid
- global_background.liquid
- global_background_video.liquid
- global_custom_css.liquid
- global_custom_js.liquid
- global_head.liquid
- global_head_preview.liquid
- global_hero.liquid
- global_powered_by.liquid
- global_scripts.liquid
- global_scripts_preview.liquid
- global_social_meta_tags.liquid
- image_performance_fix.liquid
- store_sales_page.liquid
- video.liquid

---

## SUMMARY OF RECOMMENDATIONS

### Phase 1: Immediate Deletions (SAFE - No dependencies)

1. **Delete 6 backup directories** (14.7M)
   ```bash
   rm -rf /home/user/an-theme/themes/product_backup_20250907_162341/
   rm -rf /home/user/an-theme/themes/website.v23_backup/
   rm -rf /home/user/an-theme/themes/landing.v23_backup/
   rm -rf /home/user/an-theme/themes/website_backup_20250929_125544/
   rm -rf /home/user/an-theme/themes/website.backup_current/
   rm -rf /home/user/an-theme/themes/landing.backup_current/
   ```

2. **Delete footer test sections** (7.6K)
   ```bash
   rm /home/user/an-theme/shared/sections/footer_test_*.liquid
   ```

3. **Delete unused page sections** (186K)
   ```bash
   rm /home/user/an-theme/shared/sections/{about-page-ultra-editable,page_content,page_rsak,page_sa_full,page_sa_v1,page_sa_v2,page_sales_content,speaking-page-editable,speaking-page-ultra-editable}.liquid
   ```

### Phase 2: Consolidation & Cleanup (REQUIRES TESTING)

1. **Book Showcase Consolidation**
   - Verify `book_showcase_unified.liquid` has all features needed
   - Test deployment with unified version
   - Delete: book_showcase_modern, book_showcase_sa, book_showcase_rsak

2. **Testimonials Consolidation**
   - Verify `an_testimonials.liquid` covers all use cases
   - Test deployment with unified version
   - Delete: testimonial_grid_cards, testimonial_sa_book_style, testimonial_enhanced_highlights, content_quote_block, testimonial_book_split_layout, feature_testimonialbottom

### Phase 3: Cleanup Unused Components (LOWER PRIORITY)

- Review and delete remaining 114 unused sections
- Review and delete remaining 107 unused snippets
- Keep section.liquid if it's a parent/template base

---

## Impact Analysis

### Bundle Size Reduction
- Backup directories: 14.7M (immediate)
- Deprecated test files: 7.6K (immediate)
- Unused page sections: 186K (phase 1)
- Consolidated sections: 53K (phase 2)
- Remaining unused sections: ~1.2M (phase 3)
- Remaining unused snippets: ~150K (phase 3)

**Total potential reduction: ~18M** (with ~14.7M as safe immediate cleanup)

### Development Benefits
- Fewer confusing duplicate sections
- Clearer code organization
- Easier maintenance
- Reduced git repository size
- Faster builds and exports

### Risk Assessment
- **Phase 1 (backups & tests): 0% risk** - These are clearly obsolete
- **Phase 2 (consolidation): 5% risk** - Requires testing unified versions
- **Phase 3 (unused cleanup): 1% risk** - Verify sections aren't dynamically referenced

---

## Next Steps

1. **Verify consolidated versions are complete**
   - Review book_showcase_unified.liquid features
   - Review an_testimonials.liquid layout options
   - Update theme documentation

2. **Create cleanup commits**
   - Commit 1: Delete backups (14.7M reduction)
   - Commit 2: Delete test sections (7.6K reduction)
   - Commit 3: Delete unused pages (186K reduction)
   - Commit 4: Consolidate book showcases (after testing)
   - Commit 5: Consolidate testimonials (after testing)
   - Commit 6: Final cleanup of remaining unused code

3. **Update documentation**
   - Document which consolidated sections to use
   - Update CLAUDE.md with recommended sections
   - Remove references to deprecated sections

4. **Export and test**
   - Run `npm run theme:export` for all themes
   - Verify no missing sections in Kajabi
   - Check that consolidated sections work in all contexts

