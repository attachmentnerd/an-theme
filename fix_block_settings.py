#!/usr/bin/env python3
"""
Fix Kajabi compatibility issue: Change block "settings" to "elements"
This script carefully updates only block-level settings, not section-level settings.
"""

import os
import re
import json

def fix_block_settings(file_path):
    """Fix block settings in a single file"""
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Extract schema section
    schema_match = re.search(r'{% schema %}(.*?){% endschema %}', content, re.DOTALL)
    if not schema_match:
        return False, "No schema found"
    
    schema_content = schema_match.group(1)
    
    try:
        # Parse JSON schema
        schema = json.loads(schema_content)
        
        # Check if file needs updating
        needs_update = False
        
        # Process blocks array if it exists
        if 'blocks' in schema and isinstance(schema['blocks'], list):
            for block in schema['blocks']:
                if 'settings' in block and 'elements' not in block:
                    # Move settings to elements
                    block['elements'] = block['settings']
                    del block['settings']
                    needs_update = True
        
        if needs_update:
            # Convert back to JSON with proper formatting
            updated_schema = json.dumps(schema, indent= 2)
            
            # Replace the schema in the original content
            updated_content = content.replace(
                schema_match.group(0),
                '{% schema %}\n' + updated_schema + '\n{% endschema %}'
            )
            
            # Write the updated content back
            with open(file_path, 'w') as f:
                f.write(updated_content)
            
            return True, "Updated successfully"
        else:
            return False, "No updates needed"
            
    except json.JSONDecodeError as e:
        return False, f"JSON parse error: {str(e)}"
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Process all shared sections"""
    sections_dir = '/Users/macbook/Documents/GitHub/an-theme/shared/sections'
    
    # List of files that need updating (from our analysis)
    files_to_update = [
        'an_book_showcase.liquid',
        'an_testimonials.liquid',
        'book_author_sa.liquid',
        'book_details.liquid',
        'book_hero_sa.liquid',
        'book_purchase.liquid',
        'book_showcase_modern.liquid',
        'book_showcase_rsak.liquid',
        'book_showcase_sa.liquid',
        'book_showcase_unified.liquid',
        'content_advanced_bio.liquid',
        'content_author_bio.liquid',
        'content_colored_highlight.liquid',
        'content_contact_form.liquid',
        'content_featured_resources.liquid',
        'content_instagram_feed.liquid',
        'content_quote_block.liquid',
        'content_resource_downloads.liquid',
        'content_stats_bar.liquid',
        'content_team_coaches.liquid',
        'cta_free_resource.liquid',
        'cta_purchase_book.liquid',
        'cta_standard.liquid',
        'feature_dark_cards.liquid',
        'feature_highlight.liquid',
        'feature_logo_bar.liquid',
        'feature_press_logos.liquid',
        'feature_showcase.liquid',
        'feature_single_clean.liquid',
        'feature_tabs_scroll.liquid',
        'feature_testimonialbottom.liquid',
        'hero_about_page.liquid',
        'hero_modern.liquid',
        'hero_parallax.liquid',
        'hero_video.liquid',
        'master_listing_grid.liquid',
        'nav_footer_bio.liquid',
        'nav_footer_modern.liquid',
        'nav_header_static.liquid',
        'nav_main.liquid',
        'pricing_program_cards.liquid',
        'pricing_pwyc.liquid',
        'testimonial_book_split_layout.liquid',
        'testimonial_enhanced_highlights.liquid',
        'testimonial_grid_cards.liquid',
        'testimonial_sa_book_style.liquid',
        'utility_logo.liquid'
    ]
    
    print("Fixing Kajabi compatibility issue: Block settings -> elements")
    print("=" * 60)
    
    updated_count = 0
    error_count = 0
    
    for filename in files_to_update:
        file_path = os.path.join(sections_dir, filename)
        
        if not os.path.exists(file_path):
            print(f"❌ {filename}: File not found")
            error_count += 1
            continue
        
        success, message = fix_block_settings(file_path)
        
        if success:
            print(f"✅ {filename}: {message}")
            updated_count += 1
        else:
            print(f"⚠️  {filename}: {message}")
            if "No updates needed" not in message:
                error_count += 1
    
    print("=" * 60)
    print(f"Summary: {updated_count} files updated, {error_count} errors")
    
    if updated_count > 0:
        print("\n⚠️  IMPORTANT: Please review the changes and test in Kajabi!")
        print("The script has updated block 'settings' to 'elements' as required.")

if __name__ == "__main__":
    main()