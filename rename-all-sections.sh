#!/bin/bash

# Script to rename all shared sections and update their display names

cd /Users/macbook/Documents/GitHub/an-theme/shared/sections

echo "Starting comprehensive section renaming..."
echo "========================================"

# Function to update display name in file
update_display_name() {
    local file=$1
    local old_name=$2
    local new_name=$3
    
    # Update the name in schema
    sed -i '' "s/\"name\": \"$old_name\"/\"name\": \"$new_name\"/g" "$file" 2>/dev/null
    
    # Also check for variations in preset names
    sed -i '' "s/\"name\": \".*$old_name.*\"/\"name\": \"$new_name\"/g" "$file" 2>/dev/null
}

# Hero Sections
echo "Processing Hero sections..."
if [ -f "hero_about.liquid" ]; then
    mv hero_about.liquid hero_about_page.liquid
    update_display_name "hero_about_page.liquid" ".*" "Hero - About Page"
    echo "✓ hero_about.liquid → hero_about_page.liquid"
fi

# Update display names for existing hero sections
update_display_name "hero_modern.liquid" ".*" "Hero - Modern"
update_display_name "hero_parallax.liquid" ".*" "Hero - Parallax"
update_display_name "hero_video.liquid" ".*" "Hero - Video"

# Navigation & Layout
echo -e "\nProcessing Navigation sections..."
if [ -f "header.liquid" ]; then
    mv header.liquid nav_header.liquid
    update_display_name "nav_header.liquid" ".*" "Nav - Header"
    echo "✓ header.liquid → nav_header.liquid"
fi

if [ -f "header_static.liquid" ]; then
    mv header_static.liquid nav_header_static.liquid
    update_display_name "nav_header_static.liquid" ".*" "Nav - Header Static"
    echo "✓ header_static.liquid → nav_header_static.liquid"
fi

if [ -f "navigation.liquid" ]; then
    mv navigation.liquid nav_main.liquid
    update_display_name "nav_main.liquid" ".*" "Nav - Main Menu"
    echo "✓ navigation.liquid → nav_main.liquid"
fi

if [ -f "footer.liquid" ]; then
    mv footer.liquid nav_footer.liquid
    update_display_name "nav_footer.liquid" ".*" "Nav - Footer"
    echo "✓ footer.liquid → nav_footer.liquid"
fi

if [ -f "footer_modern.liquid" ]; then
    mv footer_modern.liquid nav_footer_modern.liquid
    update_display_name "nav_footer_modern.liquid" ".*" "Nav - Footer Modern"
    echo "✓ footer_modern.liquid → nav_footer_modern.liquid"
fi

if [ -f "footer_bio.liquid" ]; then
    mv footer_bio.liquid nav_footer_bio.liquid
    update_display_name "nav_footer_bio.liquid" ".*" "Nav - Footer Bio"
    echo "✓ footer_bio.liquid → nav_footer_bio.liquid"
fi

if [ -f "sticky_mobile_bar.liquid" ]; then
    mv sticky_mobile_bar.liquid nav_mobile_sticky_bar.liquid
    update_display_name "nav_mobile_sticky_bar.liquid" ".*" "Nav - Mobile Sticky Bar"
    echo "✓ sticky_mobile_bar.liquid → nav_mobile_sticky_bar.liquid"
fi

# Delete deprecated navigation
if [ -f "navigation_old.liquid" ]; then
    rm navigation_old.liquid
    echo "✓ Deleted navigation_old.liquid (deprecated)"
fi

# Feature Sections
echo -e "\nProcessing Feature sections..."
if [ -f "feature_clean_single.liquid" ]; then
    mv feature_clean_single.liquid feature_single_clean.liquid
    update_display_name "feature_single_clean.liquid" ".*" "Feature - Single Clean"
    echo "✓ feature_clean_single.liquid → feature_single_clean.liquid"
fi

if [ -f "feature_logos.liquid" ]; then
    mv feature_logos.liquid feature_logo_bar.liquid
    update_display_name "feature_logo_bar.liquid" ".*" "Feature - Logo Bar"
    echo "✓ feature_logos.liquid → feature_logo_bar.liquid"
fi

if [ -f "feature_press.liquid" ]; then
    mv feature_press.liquid feature_press_logos.liquid
    update_display_name "feature_press_logos.liquid" ".*" "Feature - Press Logos"
    echo "✓ feature_press.liquid → feature_press_logos.liquid"
fi

if [ -f "an_feature_two_column_list.liquid" ]; then
    mv an_feature_two_column_list.liquid feature_icon_list.liquid
    update_display_name "feature_icon_list.liquid" ".*" "Feature - Icon List"
    echo "✓ an_feature_two_column_list.liquid → feature_icon_list.liquid"
fi

# Update display names for existing feature sections
update_display_name "feature_dark_cards.liquid" ".*" "Feature - Dark Cards"
update_display_name "feature_highlight.liquid" ".*" "Feature - Highlight"
update_display_name "feature_showcase.liquid" ".*" "Feature - Showcase"
update_display_name "feature_tabs_scroll.liquid" ".*" "Feature - Tabs Scroll"
update_display_name "feature_two_column_list.liquid" ".*" "Feature - Two Column List"

# CTA Sections
echo -e "\nProcessing CTA sections..."
if [ -f "cta_section.liquid" ]; then
    mv cta_section.liquid cta_standard.liquid
    update_display_name "cta_standard.liquid" ".*" "CTA - Standard"
    echo "✓ cta_section.liquid → cta_standard.liquid"
fi

if [ -f "full_width_cta.liquid" ]; then
    mv full_width_cta.liquid cta_full_width.liquid
    update_display_name "cta_full_width.liquid" ".*" "CTA - Full Width"
    echo "✓ full_width_cta.liquid → cta_full_width.liquid"
fi

if [ -f "newsletter_cta_modern.liquid" ]; then
    mv newsletter_cta_modern.liquid cta_newsletter_modern.liquid
    update_display_name "cta_newsletter_modern.liquid" ".*" "CTA - Newsletter Modern"
    echo "✓ newsletter_cta_modern.liquid → cta_newsletter_modern.liquid"
fi

if [ -f "sa_free_chapter_cta.liquid" ]; then
    mv sa_free_chapter_cta.liquid cta_free_chapter.liquid
    update_display_name "cta_free_chapter.liquid" ".*" "CTA - Free Chapter"
    echo "✓ sa_free_chapter_cta.liquid → cta_free_chapter.liquid"
fi

if [ -f "sa_purchase_cta.liquid" ]; then
    mv sa_purchase_cta.liquid cta_purchase_book.liquid
    update_display_name "cta_purchase_book.liquid" ".*" "CTA - Purchase Book"
    echo "✓ sa_purchase_cta.liquid → cta_purchase_book.liquid"
fi

if [ -f "slim_cta.liquid" ]; then
    mv slim_cta.liquid cta_slim.liquid
    update_display_name "cta_slim.liquid" ".*" "CTA - Slim"
    echo "✓ slim_cta.liquid → cta_slim.liquid"
fi

if [ -f "sticky_mobile_cta.liquid" ]; then
    mv sticky_mobile_cta.liquid cta_mobile_sticky.liquid
    update_display_name "cta_mobile_sticky.liquid" ".*" "CTA - Mobile Sticky"
    echo "✓ sticky_mobile_cta.liquid → cta_mobile_sticky.liquid"
fi

if [ -f "two_step.liquid" ]; then
    mv two_step.liquid cta_two_step_optin.liquid
    update_display_name "cta_two_step_optin.liquid" ".*" "CTA - Two Step Optin"
    echo "✓ two_step.liquid → cta_two_step_optin.liquid"
fi

# Content Sections
echo -e "\nProcessing Content sections..."
if [ -f "an_advanced_bio.liquid" ]; then
    mv an_advanced_bio.liquid content_advanced_bio.liquid
    update_display_name "content_advanced_bio.liquid" ".*" "Content - Advanced Bio"
    echo "✓ an_advanced_bio.liquid → content_advanced_bio.liquid"
fi

if [ -f "an_contact_form.liquid" ]; then
    mv an_contact_form.liquid content_contact_form.liquid
    update_display_name "content_contact_form.liquid" ".*" "Content - Contact Form"
    echo "✓ an_contact_form.liquid → content_contact_form.liquid"
fi

if [ -f "an_faq_accordion.liquid" ]; then
    mv an_faq_accordion.liquid content_faq_accordion.liquid
    update_display_name "content_faq_accordion.liquid" ".*" "Content - FAQ Accordion"
    echo "✓ an_faq_accordion.liquid → content_faq_accordion.liquid"
fi

if [ -f "an_instagram_feed.liquid" ]; then
    mv an_instagram_feed.liquid content_instagram_feed.liquid
    update_display_name "content_instagram_feed.liquid" ".*" "Content - Instagram Feed"
    echo "✓ an_instagram_feed.liquid → content_instagram_feed.liquid"
fi

if [ -f "an_program_cards.liquid" ]; then
    mv an_program_cards.liquid content_program_cards.liquid
    update_display_name "content_program_cards.liquid" ".*" "Content - Program Cards"
    echo "✓ an_program_cards.liquid → content_program_cards.liquid"
fi

if [ -f "an_quote_block.liquid" ]; then
    mv an_quote_block.liquid content_quote_block.liquid
    update_display_name "content_quote_block.liquid" ".*" "Content - Quote Block"
    echo "✓ an_quote_block.liquid → content_quote_block.liquid"
fi

if [ -f "an_resource_downloads.liquid" ]; then
    mv an_resource_downloads.liquid content_resource_downloads.liquid
    update_display_name "content_resource_downloads.liquid" ".*" "Content - Resource Downloads"
    echo "✓ an_resource_downloads.liquid → content_resource_downloads.liquid"
fi

if [ -f "an_stats_bar.liquid" ]; then
    mv an_stats_bar.liquid content_stats_bar.liquid
    update_display_name "content_stats_bar.liquid" ".*" "Content - Stats Bar"
    echo "✓ an_stats_bar.liquid → content_stats_bar.liquid"
fi

if [ -f "an_team_coaches.liquid" ]; then
    mv an_team_coaches.liquid content_team_coaches.liquid
    update_display_name "content_team_coaches.liquid" ".*" "Content - Team Coaches"
    echo "✓ an_team_coaches.liquid → content_team_coaches.liquid"
fi

if [ -f "author_bio_modern.liquid" ]; then
    mv author_bio_modern.liquid content_author_bio.liquid
    update_display_name "content_author_bio.liquid" ".*" "Content - Author Bio"
    echo "✓ author_bio_modern.liquid → content_author_bio.liquid"
fi

if [ -f "colored_highlight.liquid" ]; then
    mv colored_highlight.liquid content_colored_highlight.liquid
    update_display_name "content_colored_highlight.liquid" ".*" "Content - Colored Highlight"
    echo "✓ colored_highlight.liquid → content_colored_highlight.liquid"
fi

if [ -f "featured_resources.liquid" ]; then
    mv featured_resources.liquid content_featured_resources.liquid
    update_display_name "content_featured_resources.liquid" ".*" "Content - Featured Resources"
    echo "✓ featured_resources.liquid → content_featured_resources.liquid"
fi

if [ -f "thank_you.liquid" ]; then
    mv thank_you.liquid content_thank_you.liquid
    update_display_name "content_thank_you.liquid" ".*" "Content - Thank You"
    echo "✓ thank_you.liquid → content_thank_you.liquid"
fi

# Book/Product Sections
echo -e "\nProcessing Book/Product sections..."
if [ -f "book.liquid" ]; then
    mv book.liquid book_details.liquid
    update_display_name "book_details.liquid" ".*" "Book - Details"
    echo "✓ book.liquid → book_details.liquid"
fi

if [ -f "book_buy.liquid" ]; then
    mv book_buy.liquid book_purchase.liquid
    update_display_name "book_purchase.liquid" ".*" "Book - Purchase"
    echo "✓ book_buy.liquid → book_purchase.liquid"
fi

if [ -f "book_showcase.liquid" ]; then
    mv book_showcase.liquid book_showcase_classic.liquid
    update_display_name "book_showcase_classic.liquid" ".*" "Book - Showcase Classic"
    echo "✓ book_showcase.liquid → book_showcase_classic.liquid"
fi

if [ -f "book_showcase_modern_alt.liquid" ]; then
    mv book_showcase_modern_alt.liquid book_showcase_modern.liquid
    update_display_name "book_showcase_modern.liquid" ".*" "Book - Showcase Modern"
    echo "✓ book_showcase_modern_alt.liquid → book_showcase_modern.liquid"
fi

if [ -f "an_book_showcase.liquid" ]; then
    mv an_book_showcase.liquid book_showcase_unified.liquid
    update_display_name "book_showcase_unified.liquid" ".*" "Book - Showcase Unified"
    echo "✓ an_book_showcase.liquid → book_showcase_unified.liquid"
fi

# SA-specific book sections
if [ -f "sa_author_modern.liquid" ]; then
    mv sa_author_modern.liquid book_author_sa.liquid
    update_display_name "book_author_sa.liquid" ".*" "Book - Author SA"
    echo "✓ sa_author_modern.liquid → book_author_sa.liquid"
fi

if [ -f "sa_bonuses.liquid" ]; then
    mv sa_bonuses.liquid book_bonuses_sa.liquid
    update_display_name "book_bonuses_sa.liquid" ".*" "Book - Bonuses SA"
    echo "✓ sa_bonuses.liquid → book_bonuses_sa.liquid"
fi

if [ -f "sa_book_showcase.liquid" ]; then
    mv sa_book_showcase.liquid book_hero_sa.liquid
    update_display_name "book_hero_sa.liquid" ".*" "Book - Hero SA"
    echo "✓ sa_book_showcase.liquid → book_hero_sa.liquid"
fi

if [ -f "sa_journey.liquid" ]; then
    mv sa_journey.liquid book_journey_sa.liquid
    update_display_name "book_journey_sa.liquid" ".*" "Book - Journey SA"
    echo "✓ sa_journey.liquid → book_journey_sa.liquid"
fi

if [ -f "sa_key_benefits.liquid" ]; then
    mv sa_key_benefits.liquid book_benefits_sa.liquid
    update_display_name "book_benefits_sa.liquid" ".*" "Book - Benefits SA"
    echo "✓ sa_key_benefits.liquid → book_benefits_sa.liquid"
fi

if [ -f "sa_patterns.liquid" ]; then
    mv sa_patterns.liquid book_patterns_sa.liquid
    update_display_name "book_patterns_sa.liquid" ".*" "Book - Patterns SA"
    echo "✓ sa_patterns.liquid → book_patterns_sa.liquid"
fi

if [ -f "sa_retailers.liquid" ]; then
    mv sa_retailers.liquid book_retailers_sa.liquid
    update_display_name "book_retailers_sa.liquid" ".*" "Book - Retailers SA"
    echo "✓ sa_retailers.liquid → book_retailers_sa.liquid"
fi

if [ -f "sa_workbook_preview.liquid" ]; then
    mv sa_workbook_preview.liquid book_workbook_preview_sa.liquid
    update_display_name "book_workbook_preview_sa.liquid" ".*" "Book - Workbook Preview SA"
    echo "✓ sa_workbook_preview.liquid → book_workbook_preview_sa.liquid"
fi

# Update display names for existing book sections
update_display_name "book_showcase_rsak.liquid" ".*" "Book - Showcase RSAK"
update_display_name "book_showcase_sa.liquid" ".*" "Book - Showcase SA"

# Product sections
if [ -f "products.liquid" ]; then
    mv products.liquid product_grid.liquid
    update_display_name "product_grid.liquid" ".*" "Product - Grid"
    echo "✓ products.liquid → product_grid.liquid"
fi

if [ -f "free_resource.liquid" ]; then
    mv free_resource.liquid product_free_resource.liquid
    update_display_name "product_free_resource.liquid" ".*" "Product - Free Resource"
    echo "✓ free_resource.liquid → product_free_resource.liquid"
fi

# Blog/Newsletter Sections
echo -e "\nProcessing Blog/Newsletter sections..."
if [ -f "blog_listings.liquid" ]; then
    mv blog_listings.liquid blog_listing_grid.liquid
    update_display_name "blog_listing_grid.liquid" ".*" "Blog - Listing Grid"
    echo "✓ blog_listings.liquid → blog_listing_grid.liquid"
fi

if [ -f "blog_post_body.liquid" ]; then
    mv blog_post_body.liquid blog_post_content.liquid
    update_display_name "blog_post_content.liquid" ".*" "Blog - Post Content"
    echo "✓ blog_post_body.liquid → blog_post_content.liquid"
fi

if [ -f "newsletter_listings.liquid" ]; then
    mv newsletter_listings.liquid blog_newsletter_grid.liquid
    update_display_name "blog_newsletter_grid.liquid" ".*" "Blog - Newsletter Grid"
    echo "✓ newsletter_listings.liquid → blog_newsletter_grid.liquid"
fi

if [ -f "newsletter_post_body.liquid" ]; then
    mv newsletter_post_body.liquid blog_newsletter_content.liquid
    update_display_name "blog_newsletter_content.liquid" ".*" "Blog - Newsletter Content"
    echo "✓ newsletter_post_body.liquid → blog_newsletter_content.liquid"
fi

if [ -f "newsletter_recent_posts.liquid" ]; then
    mv newsletter_recent_posts.liquid blog_newsletter_recent.liquid
    update_display_name "blog_newsletter_recent.liquid" ".*" "Blog - Newsletter Recent"
    echo "✓ newsletter_recent_posts.liquid → blog_newsletter_recent.liquid"
fi

# Update display name for existing blog section
update_display_name "blog_search_results.liquid" ".*" "Blog - Search Results"

# Page Sections
echo -e "\nProcessing Page sections..."
if [ -f "page-raising-securely-attached-kids.liquid" ]; then
    mv page-raising-securely-attached-kids.liquid page_rsak.liquid
    update_display_name "page_rsak.liquid" ".*" "Page - RSAK"
    echo "✓ page-raising-securely-attached-kids.liquid → page_rsak.liquid"
fi

if [ -f "page-securely-attached.liquid" ]; then
    mv page-securely-attached.liquid page_sa_v1.liquid
    update_display_name "page_sa_v1.liquid" ".*" "Page - SA v1"
    echo "✓ page-securely-attached.liquid → page_sa_v1.liquid"
fi

if [ -f "page-securely-attached-v2.liquid" ]; then
    mv page-securely-attached-v2.liquid page_sa_v2.liquid
    update_display_name "page_sa_v2.liquid" ".*" "Page - SA v2"
    echo "✓ page-securely-attached-v2.liquid → page_sa_v2.liquid"
fi

if [ -f "page-securely-attached-full.liquid" ]; then
    mv page-securely-attached-full.liquid page_sa_full.liquid
    update_display_name "page_sa_full.liquid" ".*" "Page - SA Full"
    echo "✓ page-securely-attached-full.liquid → page_sa_full.liquid"
fi

if [ -f "sales_page_body.liquid" ]; then
    mv sales_page_body.liquid page_sales_content.liquid
    update_display_name "page_sales_content.liquid" ".*" "Page - Sales Content"
    echo "✓ sales_page_body.liquid → page_sales_content.liquid"
fi

# Update display names for existing page sections
update_display_name "page_content.liquid" ".*" "Page - Content"
update_display_name "page-coaching.liquid" ".*" "Page - Coaching"
# Leave page-coaching.liquid filename as is since it's AI-generated

# Utility Sections
echo -e "\nProcessing Utility sections..."
if [ -f "announcements.liquid" ]; then
    mv announcements.liquid utility_announcements.liquid
    update_display_name "utility_announcements.liquid" ".*" "Utility - Announcements"
    echo "✓ announcements.liquid → utility_announcements.liquid"
fi

if [ -f "exit_pop.liquid" ]; then
    mv exit_pop.liquid utility_exit_popup.liquid
    update_display_name "utility_exit_popup.liquid" ".*" "Utility - Exit Popup"
    echo "✓ exit_pop.liquid → utility_exit_popup.liquid"
fi

if [ -f "login.liquid" ]; then
    mv login.liquid utility_login.liquid
    update_display_name "utility_login.liquid" ".*" "Utility - Login"
    echo "✓ login.liquid → utility_login.liquid"
fi

if [ -f "logo.liquid" ]; then
    mv logo.liquid utility_logo.liquid
    update_display_name "utility_logo.liquid" ".*" "Utility - Logo"
    echo "✓ logo.liquid → utility_logo.liquid"
fi

if [ -f "member_directory.liquid" ]; then
    mv member_directory.liquid utility_member_directory.liquid
    update_display_name "utility_member_directory.liquid" ".*" "Utility - Member Directory"
    echo "✓ member_directory.liquid → utility_member_directory.liquid"
fi

if [ -f "sales_page_sidebar.liquid" ]; then
    mv sales_page_sidebar.liquid utility_sales_sidebar.liquid
    update_display_name "utility_sales_sidebar.liquid" ".*" "Utility - Sales Sidebar"
    echo "✓ sales_page_sidebar.liquid → utility_sales_sidebar.liquid"
fi

if [ -f "store_builder.liquid" ]; then
    mv store_builder.liquid utility_store_builder.liquid
    update_display_name "utility_store_builder.liquid" ".*" "Utility - Store Builder"
    echo "✓ store_builder.liquid → utility_store_builder.liquid"
fi

echo -e "\n========================================"
echo "Section renaming complete!"
echo "Remember to export the theme after these changes."