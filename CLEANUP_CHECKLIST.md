# Codebase Cleanup Checklist

## Phase 1: SAFE DELETIONS (0% Risk)
No other files depend on these. Safe to delete immediately.

### Backup Directories (14.7M)
- [ ] `/home/user/an-theme/themes/product_backup_20250907_162341/`
- [ ] `/home/user/an-theme/themes/website.v23_backup/`
- [ ] `/home/user/an-theme/themes/landing.v23_backup/`
- [ ] `/home/user/an-theme/themes/website_backup_20250929_125544/`
- [ ] `/home/user/an-theme/themes/website.backup_current/`
- [ ] `/home/user/an-theme/themes/landing.backup_current/`

Delete command:
```bash
rm -rf /home/user/an-theme/themes/product_backup_20250907_162341/ \
       /home/user/an-theme/themes/website.v23_backup/ \
       /home/user/an-theme/themes/landing.v23_backup/ \
       /home/user/an-theme/themes/website_backup_20250929_125544/ \
       /home/user/an-theme/themes/website.backup_current/ \
       /home/user/an-theme/themes/landing.backup_current/
```

### Test Files (7.6K)
- [ ] `/home/user/an-theme/shared/sections/footer_test_blocks.liquid`
- [ ] `/home/user/an-theme/shared/sections/footer_test_form.liquid`
- [ ] `/home/user/an-theme/shared/sections/footer_test_menus.liquid`
- [ ] `/home/user/an-theme/shared/sections/footer_test_minimal.liquid`

Delete command:
```bash
rm /home/user/an-theme/shared/sections/footer_test_*.liquid
```

### Unused Page Sections (186K)
- [ ] `/home/user/an-theme/shared/sections/about-page-ultra-editable.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_content.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_rsak.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_sa_full.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_sa_v1.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_sa_v2.liquid`
- [ ] `/home/user/an-theme/shared/sections/page_sales_content.liquid`
- [ ] `/home/user/an-theme/shared/sections/speaking-page-editable.liquid`
- [ ] `/home/user/an-theme/shared/sections/speaking-page-ultra-editable.liquid`

Delete command:
```bash
rm /home/user/an-theme/shared/sections/about-page-ultra-editable.liquid \
   /home/user/an-theme/shared/sections/page_content.liquid \
   /home/user/an-theme/shared/sections/page_rsak.liquid \
   /home/user/an-theme/shared/sections/page_sa_full.liquid \
   /home/user/an-theme/shared/sections/page_sa_v1.liquid \
   /home/user/an-theme/shared/sections/page_sa_v2.liquid \
   /home/user/an-theme/shared/sections/page_sales_content.liquid \
   /home/user/an-theme/shared/sections/speaking-page-editable.liquid \
   /home/user/an-theme/shared/sections/speaking-page-ultra-editable.liquid
```

**After Phase 1: 14.9M saved, 0% risk**

---

## Phase 2: CONSOLIDATION (5% Risk - REQUIRES TESTING)

### Before deletion, verify:
1. [ ] Test `book_showcase_unified.liquid` on a page
2. [ ] Verify all features from old variants work
3. [ ] Test `an_testimonials.liquid` on a page
4. [ ] Verify all layout options work
5. [ ] Export themes and test in Kajabi

### Book Showcase Consolidation (21K)
Old versions to delete (after testing):
- [ ] `/home/user/an-theme/shared/sections/book_showcase_modern.liquid` (7.4K)
- [ ] `/home/user/an-theme/shared/sections/book_showcase_sa.liquid` (7.0K)
- [ ] `/home/user/an-theme/shared/sections/book_showcase_rsak.liquid` (6.5K)

Replace with:
- [ ] `/home/user/an-theme/shared/sections/book_showcase_unified.liquid` (34K)

Delete command:
```bash
rm /home/user/an-theme/shared/sections/book_showcase_modern.liquid \
   /home/user/an-theme/shared/sections/book_showcase_sa.liquid \
   /home/user/an-theme/shared/sections/book_showcase_rsak.liquid
```

### Testimonials Consolidation (53K + 34K)
Old versions to delete (after testing):
- [ ] `/home/user/an-theme/shared/sections/testimonial_grid_cards.liquid` (18K)
- [ ] `/home/user/an-theme/shared/sections/testimonial_sa_book_style.liquid` (12K)
- [ ] `/home/user/an-theme/shared/sections/testimonial_enhanced_highlights.liquid` (11K)
- [ ] `/home/user/an-theme/shared/sections/testimonial_book_split_layout.liquid` (20K)
- [ ] `/home/user/an-theme/shared/sections/content_quote_block.liquid` (12K)
- [ ] `/home/user/an-theme/shared/sections/feature_testimonialbottom.liquid` (34K)

Replace with:
- [ ] `/home/user/an-theme/shared/sections/an_testimonials.liquid` (35K)

Delete command:
```bash
rm /home/user/an-theme/shared/sections/testimonial_grid_cards.liquid \
   /home/user/an-theme/shared/sections/testimonial_sa_book_style.liquid \
   /home/user/an-theme/shared/sections/testimonial_enhanced_highlights.liquid \
   /home/user/an-theme/shared/sections/testimonial_book_split_layout.liquid \
   /home/user/an-theme/shared/sections/content_quote_block.liquid \
   /home/user/an-theme/shared/sections/feature_testimonialbottom.liquid
```

**After Phase 2: +87K saved (53K consolidated), 5% risk**

---

## Phase 3: CLEANUP (1% Risk - LOWER PRIORITY)

### Remaining Completely Unused Sections (114 sections, ~1.2M)

These are NOT actively used. Delete in batches with testing:

#### Hero Sections (6 sections, ~70K)
- [ ] hero_about_page.liquid
- [ ] hero_clean.liquid
- [ ] hero_clean2.liquid
- [ ] hero_modern.liquid
- [ ] hero_parallax.liquid
- [ ] hero_video.liquid

#### Blog/Content Sections (12+ sections, ~150K)
- [ ] blog_listing_grid.liquid
- [ ] blog_newsletter_content.liquid
- [ ] blog_newsletter_grid.liquid
- [ ] blog_newsletter_recent.liquid
- [ ] blog_post_content.liquid
- [ ] blog_search_results.liquid
- [ ] content_advanced_bio.liquid
- [ ] content_author_bio.liquid
- [ ] content_contact_form.liquid
- [ ] content_colored_highlight.liquid
- [ ] content_faq_accordion.liquid
- [ ] content_featured_resources.liquid
- [ ] content_instagram_feed.liquid
- [ ] content_resource_downloads.liquid
- [ ] content_stats_bar.liquid
- [ ] content_team_coaches.liquid
- [ ] content_thank_you.liquid

#### CTA/Feature Sections (15+ sections, ~150K)
- [ ] cta_free_chapter.liquid
- [ ] cta_free_resource.liquid
- [ ] cta_full_width.liquid
- [ ] cta_mobile_sticky.liquid
- [ ] cta_newsletter_modern.liquid
- [ ] cta_purchase_book.liquid
- [ ] cta_slim.liquid
- [ ] cta_standard.liquid
- [ ] cta_two_step_optin.liquid
- [ ] feature_dark_cards.liquid
- [ ] feature_logo_bar.liquid
- [ ] feature_press_logos.liquid
- [ ] feature_single_clean.liquid
- [ ] feature_tabs_scroll.liquid
- [ ] feature_two_column_list.liquid

#### Book Related Sections (9 sections, ~150K)
- [ ] book_author_sa.liquid
- [ ] book_bonuses_sa.liquid
- [ ] book_details.liquid
- [ ] book_hero_sa.liquid
- [ ] book_journey_sa.liquid
- [ ] book_purchase.liquid
- [ ] book_retailers_sa.liquid
- [ ] book_workbook_preview_sa.liquid
- [ ] books_showcase_grid.liquid

#### Generic Section Templates (30+ sections, ~400K)
- [ ] section.liquid (370K - largest, verify before deleting)
- [ ] section_accordion.liquid
- [ ] section_announcement_banner.liquid
- [ ] section_announcements_page.liquid
- [ ] section_big_idea_card.liquid
- [ ] section_blog_filtered.liquid
- [ ] section_blog_post_simple.liquid
- [ ] section_featured_grid.liquid
- [ ] section_landing_hero.liquid
- [ ] section_library_event_card.liquid
- [ ] section_prefilled_form.liquid
- [ ] section_pricing_pwyc.liquid
- [ ] section_pricing_pwyc_simple.liquid
- [ ] section_program_dashboard.liquid
- [ ] section_program_flip_cards.liquid
- [ ] section_program_overview.liquid
- [ ] section_program_overview_flagship.liquid
- [ ] section_resource_library_dashboard.liquid
- [ ] section_slim_card.liquid
- [ ] section_spp_1.liquid
- [ ] section_spp_cta.liquid
- [ ] section_spp_details.liquid
- [ ] section_spp_expert.liquid
- [ ] section_spp_letter.liquid
- [ ] section_spp_modules.liquid
- [ ] section_success_experience.liquid
- [ ] section_support_dashboard.liquid
- [ ] section_support_help_center.liquid
- [ ] section_thin_hero.liquid
- [ ] section_universal_blocks.liquid
- [ ] section_video_portrait.liquid
- [ ] section_videoask_popup.liquid

#### Pricing/Product Sections (5 sections, ~70K)
- [ ] pricing_program_cards.liquid
- [ ] pricing_pwyc.liquid
- [ ] pricing_pwyc_slider.liquid
- [ ] product_grid.liquid
- [ ] gated_resource.liquid

#### Member/Utility Sections (8+ sections, ~80K)
- [ ] master_listing_grid.liquid
- [ ] member_progress_dashboard.liquid
- [ ] table_section.liquid
- [ ] utility_announcements.liquid
- [ ] utility_exit_popup.liquid
- [ ] utility_login.liquid
- [ ] utility_logo.liquid
- [ ] utility_member_directory.liquid
- [ ] utility_store_builder.liquid

### Remaining Unused Snippets (107 snippets, ~150K)

High-priority unused snippets to delete:

#### Block Helpers (28 snippets, ~80K)
- [ ] block_accordion.liquid
- [ ] block_assessment.liquid
- [ ] block_audio.liquid
- [ ] block_blog.liquid
- [ ] block_card.liquid
- [ ] block_coaching_scheduling_widget.liquid
- [ ] block_code.liquid
- [ ] block_countdown.liquid
- [ ] block_cta.liquid
- [ ] block_event.liquid
- [ ] block_event_video.liquid
- [ ] block_external_widget.liquid
- [ ] block_feature.liquid
- [ ] block_form.liquid
- [ ] block_image.liquid
- [ ] block_link_list.liquid
- [ ] block_login.liquid
- [ ] block_multi_video.liquid
- [ ] block_offer.liquid
- [ ] block_password_edit.liquid
- [ ] block_password_reset.liquid
- [ ] block_pricing.liquid
- [ ] block_social_icons.liquid
- [ ] block_social_share.liquid
- [ ] block_text.liquid
- [ ] block_video.liquid
- [ ] block_video_embed.liquid
- [ ] block.liquid

#### Blog/Newsletter (12+ snippets, ~50K)
- [ ] blog_listing.liquid
- [ ] blog_post_body_cta.liquid
- [ ] blog_post_body_media.liquid
- [ ] blog_post_body_opt_in.liquid
- [ ] blog_search_result.liquid
- [ ] blog_sidebar.liquid
- [ ] newsletter_categories.liquid
- [ ] newsletter_form.liquid
- [ ] newsletter_listing.liquid
- [ ] newsletter_search.liquid
- [ ] newsletter_sidebar.liquid
- [ ] newsletter_social_share.liquid

#### UI/Sidebar Elements (remaining, ~20K)
- [ ] alert_messages.liquid
- [ ] custom_card.liquid
- [ ] download_card.liquid
- [ ] editor_grid.liquid
- [ ] editor_guides.liquid
- [ ] editor_reveal.liquid
- [ ] element_button.liquid
- [ ] element_button_login.liquid
- [ ] element_button_section.liquid
- [ ] element_button_submit_block.liquid
- [ ] element_button_submit_search.liquid
- [ ] element_button_submit_section.liquid
- [ ] element_progress.liquid
- [ ] element_social_icons.liquid
- [ ] element_social_icons_style.liquid
- [ ] footer_block.liquid
- [ ] footer_block_copyright.liquid
- [ ] footer_block_social_icons.liquid
- [ ] header_block.liquid
- [ ] member.liquid
- [ ] member_search.liquid
- [ ] nav_minimal.liquid
- [ ] offer_card.liquid
- [ ] offer_pricing.liquid
- [ ] pagination.liquid
- [ ] product.liquid
- [ ] resume_course.liquid
- [ ] sales_page_tags.liquid
- [ ] section_styles.liquid
- [ ] shared_block_logo.liquid
- [ ] shared_block_menu.liquid
- [ ] sidebar_categories.liquid
- [ ] sidebar_cta.liquid
- [ ] sidebar_custom.liquid
- [ ] sidebar_image.liquid
- [ ] sidebar_instructor.liquid
- [ ] sidebar_recent_posts.liquid
- [ ] sidebar_search.liquid
- [ ] sidebar_social.liquid
- [ ] sidebar_social_share.liquid

**After Phase 3: +3.2M saved, 1% risk**

---

## Summary

| Phase | Risk | Savings | Recommendation |
|-------|------|---------|-----------------|
| Phase 1 | 0% | 14.9M | DELETE NOW |
| Phase 2 | 5% | 87K | DELETE AFTER TESTING |
| Phase 3 | 1% | 3.2M | DELETE IN BATCHES |
| **TOTAL** | - | **18.2M** | - |

---

## Git Workflow

Suggested commit structure:

```bash
# Commit 1: Delete backups (14.7M)
git add -A
git commit -m "chore: Remove backup directories

Remove 6 backup directories that duplicate current themes:
- product_backup_20250907_162341
- website.v23_backup
- landing.v23_backup
- website_backup_20250929_125544
- website.backup_current
- landing.backup_current

Saves 14.7M of disk space and reduces repo size."

# Commit 2: Delete test files (7.6K)
git commit -m "chore: Remove footer test sections

These test sections are no longer needed:
- footer_test_blocks.liquid
- footer_test_form.liquid
- footer_test_menus.liquid
- footer_test_minimal.liquid"

# Commit 3: Clean up unused pages (186K)
git commit -m "chore: Remove unused page sections

Remove page sections that are no longer in use:
- about-page-ultra-editable
- page_content, page_rsak, page_sa_*
- speaking-page variants

Currently used pages remain:
- page-about, page-coaching
- page-raising-securely-attached-kids
- page-securely-attached variants
- page-speaking variants"

# After consolidation testing...
# Commit 4: Consolidate testimonials (53K saved)
git commit -m "chore: Consolidate testimonial sections

Replace 5 separate testimonial sections with unified an_testimonials:
- testimonial_grid_cards
- testimonial_sa_book_style
- testimonial_enhanced_highlights
- testimonial_book_split_layout
- feature_testimonialbottom

The an_testimonials section supports all previous layouts via settings."

# Commit 5: Consolidate book showcases (21K saved)
git commit -m "chore: Consolidate book showcase sections

Replace 3 book showcase variants with book_showcase_unified:
- book_showcase_modern
- book_showcase_sa
- book_showcase_rsak

The unified version supports all previous layouts and features."
```

---

## Verification Steps

After each phase, verify:

1. Run theme export:
   ```bash
   npm run theme:export website patch "Cleanup phase N"
   npm run theme:export landing patch "Cleanup phase N"
   npm run theme:export product patch "Cleanup phase N"
   ```

2. Check for errors in build process

3. Verify all sections are still available in Kajabi

4. Test pages that use consolidated sections

5. Check git diff to confirm correct files deleted

---

## Questions Before Starting

Before beginning cleanup:
1. Are the backup directories truly unnecessary?
2. Have consolidated sections (book_showcase_unified, an_testimonials) been fully tested?
3. Are there any dynamic section references that might break?
4. Is it safe to assume all section references use `{% section 'name' %}` format?

See CODEBASE_ANALYSIS_REPORT.md for full details and analysis.
