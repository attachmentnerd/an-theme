# Shared Sections Audit & Renaming Plan

## Current Section Analysis (84 total sections)

### Hero Sections (4)
- hero_about.liquid → hero_about_page.liquid → "Hero - About Page"
- hero_modern.liquid → hero_modern.liquid → "Hero - Modern"
- hero_parallax.liquid → hero_parallax.liquid → "Hero - Parallax"
- hero_video.liquid → hero_video.liquid → "Hero - Video"

### Navigation & Layout (8)
- header.liquid → nav_header.liquid → "Nav - Header"
- header_static.liquid → nav_header_static.liquid → "Nav - Header Static"
- navigation.liquid → nav_main.liquid → "Nav - Main Menu"
- navigation_old.liquid → (DELETE - deprecated)
- footer.liquid → nav_footer.liquid → "Nav - Footer"
- footer_modern.liquid → nav_footer_modern.liquid → "Nav - Footer Modern"
- footer_bio.liquid → nav_footer_bio.liquid → "Nav - Footer Bio"
- sticky_mobile_bar.liquid → nav_mobile_sticky_bar.liquid → "Nav - Mobile Sticky Bar"

### Feature Sections (9)
- feature_clean_single.liquid → feature_single_clean.liquid → "Feature - Single Clean"
- feature_dark_cards.liquid → feature_dark_cards.liquid → "Feature - Dark Cards"
- feature_highlight.liquid → feature_highlight.liquid → "Feature - Highlight"
- feature_logos.liquid → feature_logo_bar.liquid → "Feature - Logo Bar"
- feature_press.liquid → feature_press_logos.liquid → "Feature - Press Logos"
- feature_showcase.liquid → feature_showcase.liquid → "Feature - Showcase"
- feature_tabs_scroll.liquid → feature_tabs_scroll.liquid → "Feature - Tabs Scroll"
- feature_two_column_list.liquid → feature_two_column_list.liquid → "Feature - Two Column List"
- an_feature_two_column_list.liquid → feature_icon_list.liquid → "Feature - Icon List"

### Testimonial Sections (7) - ALREADY DONE ✓
- testimonial_book_split_layout.liquid → "Testimonial - Book Split Layout"
- testimonial_cta_overlay.liquid → "Testimonial - CTA Overlay"
- testimonial_enhanced_highlights.liquid → "Testimonial - Enhanced Highlights"
- testimonial_feature_combo.liquid → "Testimonial - Feature Combo"
- testimonial_grid_cards.liquid → "Testimonial - Grid Cards"
- testimonial_modern_book_cards.liquid → "Testimonial - Modern Book Cards"
- testimonial_sa_book_style.liquid → "Testimonial - SA Book Style"

### CTA Sections (8)
- cta_section.liquid → cta_standard.liquid → "CTA - Standard"
- full_width_cta.liquid → cta_full_width.liquid → "CTA - Full Width"
- newsletter_cta_modern.liquid → cta_newsletter_modern.liquid → "CTA - Newsletter Modern"
- sa_free_chapter_cta.liquid → cta_free_chapter.liquid → "CTA - Free Chapter"
- sa_purchase_cta.liquid → cta_purchase_book.liquid → "CTA - Purchase Book"
- slim_cta.liquid → cta_slim.liquid → "CTA - Slim"
- sticky_mobile_cta.liquid → cta_mobile_sticky.liquid → "CTA - Mobile Sticky"
- two_step.liquid → cta_two_step_optin.liquid → "CTA - Two Step Optin"

### Content Sections (13)
- an_advanced_bio.liquid → content_advanced_bio.liquid → "Content - Advanced Bio"
- an_contact_form.liquid → content_contact_form.liquid → "Content - Contact Form"
- an_faq_accordion.liquid → content_faq_accordion.liquid → "Content - FAQ Accordion"
- an_instagram_feed.liquid → content_instagram_feed.liquid → "Content - Instagram Feed"
- an_program_cards.liquid → content_program_cards.liquid → "Content - Program Cards"
- an_quote_block.liquid → content_quote_block.liquid → "Content - Quote Block"
- an_resource_downloads.liquid → content_resource_downloads.liquid → "Content - Resource Downloads"
- an_stats_bar.liquid → content_stats_bar.liquid → "Content - Stats Bar"
- an_team_coaches.liquid → content_team_coaches.liquid → "Content - Team Coaches"
- author_bio_modern.liquid → content_author_bio.liquid → "Content - Author Bio"
- colored_highlight.liquid → content_colored_highlight.liquid → "Content - Colored Highlight"
- featured_resources.liquid → content_featured_resources.liquid → "Content - Featured Resources"
- thank_you.liquid → content_thank_you.liquid → "Content - Thank You"

### Book/Product Sections (17)
- book.liquid → book_details.liquid → "Book - Details"
- book_buy.liquid → book_purchase.liquid → "Book - Purchase"
- book_showcase.liquid → book_showcase_classic.liquid → "Book - Showcase Classic"
- book_showcase_modern_alt.liquid → book_showcase_modern.liquid → "Book - Showcase Modern"
- book_showcase_rsak.liquid → book_showcase_rsak.liquid → "Book - Showcase RSAK"
- book_showcase_sa.liquid → book_showcase_sa.liquid → "Book - Showcase SA"
- an_book_showcase.liquid → book_showcase_unified.liquid → "Book - Showcase Unified"
- sa_author_modern.liquid → book_author_sa.liquid → "Book - Author SA"
- sa_bonuses.liquid → book_bonuses_sa.liquid → "Book - Bonuses SA"
- sa_book_showcase.liquid → book_hero_sa.liquid → "Book - Hero SA"
- sa_journey.liquid → book_journey_sa.liquid → "Book - Journey SA"
- sa_key_benefits.liquid → book_benefits_sa.liquid → "Book - Benefits SA"
- sa_patterns.liquid → book_patterns_sa.liquid → "Book - Patterns SA"
- sa_retailers.liquid → book_retailers_sa.liquid → "Book - Retailers SA"
- sa_workbook_preview.liquid → book_workbook_preview_sa.liquid → "Book - Workbook Preview SA"
- products.liquid → product_grid.liquid → "Product - Grid"
- free_resource.liquid → product_free_resource.liquid → "Product - Free Resource"

### Blog/Newsletter Sections (6)
- blog_listings.liquid → blog_listing_grid.liquid → "Blog - Listing Grid"
- blog_post_body.liquid → blog_post_content.liquid → "Blog - Post Content"
- blog_search_results.liquid → blog_search_results.liquid → "Blog - Search Results"
- newsletter_listings.liquid → blog_newsletter_grid.liquid → "Blog - Newsletter Grid"
- newsletter_post_body.liquid → blog_newsletter_content.liquid → "Blog - Newsletter Content"
- newsletter_recent_posts.liquid → blog_newsletter_recent.liquid → "Blog - Newsletter Recent"

### Page Sections (7)
- page_content.liquid → page_content.liquid → "Page - Content"
- page-coaching.liquid → page_coaching.liquid → "Page - Coaching"
- page-raising-securely-attached-kids.liquid → page_rsak.liquid → "Page - RSAK"
- page-securely-attached.liquid → page_sa_v1.liquid → "Page - SA v1"
- page-securely-attached-v2.liquid → page_sa_v2.liquid → "Page - SA v2"
- page-securely-attached-full.liquid → page_sa_full.liquid → "Page - SA Full"
- sales_page_body.liquid → page_sales_content.liquid → "Page - Sales Content"

### Utility Sections (7)
- announcements.liquid → utility_announcements.liquid → "Utility - Announcements"
- exit_pop.liquid → utility_exit_popup.liquid → "Utility - Exit Popup"
- login.liquid → utility_login.liquid → "Utility - Login"
- logo.liquid → utility_logo.liquid → "Utility - Logo"
- member_directory.liquid → utility_member_directory.liquid → "Utility - Member Directory"
- sales_page_sidebar.liquid → utility_sales_sidebar.liquid → "Utility - Sales Sidebar"
- store_builder.liquid → utility_store_builder.liquid → "Utility - Store Builder"

### System Section (1)
- section.liquid → (KEEP AS IS - system file)

## Summary
- Total sections: 84
- To rename: 76
- To delete: 1 (navigation_old.liquid)
- Already done: 7 (testimonials)

## Naming Convention
- Files: category_descriptive_name.liquid
- Display names: "Category - Descriptive Name"
- Categories: Hero, Nav, Feature, Testimonial, CTA, Content, Book, Product, Blog, Page, Utility