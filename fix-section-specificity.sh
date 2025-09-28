#!/bin/bash

# Fix CSS specificity issues across all sections
# This script adds section-specific prefixes to prevent cascade conflicts

SECTIONS_DIR="/Users/macbook/My Drive/GitHub/an-theme/shared/sections"

echo "Fixing CSS specificity issues in sections..."

# First, fix JSON syntax errors
find "$SECTIONS_DIR" -name "*.liquid" -exec sed -i '' 's/"elements": \[[ ]*{[ ]*{/"elements": [\
    {/g' {} \;

find "$SECTIONS_DIR" -name "*.liquid" -exec sed -i '' 's/},[ ]*"type": "header"/},\
    {\
      "type": "header"/g' {} \;

echo "Fixed JSON syntax errors"

# Files that are known to have generic class issues
PROBLEM_FILES=(
  "feature_single_clean.liquid"
  "feature_two_column_list.liquid"
  "content_faq_accordion.liquid"
  "feature_highlight.liquid"
  "feature_showcase.liquid"
  "testimonial_grid_cards.liquid"
  "pricing_pwyc.liquid"
)

for file in "${PROBLEM_FILES[@]}"; do
  filepath="$SECTIONS_DIR/$file"
  if [ -f "$filepath" ]; then
    echo "Processing $file..."
    
    # Extract the main section class from the HTML
    section_class=$(grep -o 'class="[^"]*"' "$filepath" | head -1 | sed 's/class="//;s/".*//;s/ .*//')
    
    if [ -n "$section_class" ]; then
      # Fix CSS by adding section prefix to generic classes
      sed -i '' "s/\\.feature-text/.$section_class .feature-text/g" "$filepath"
      sed -i '' "s/\\.feature-item/.$section_class .feature-item/g" "$filepath"
      sed -i '' "s/\\.feature-icon/.$section_class .feature-icon/g" "$filepath"
      sed -i '' "s/\\.feature-column/.$section_class .feature-column/g" "$filepath"
      sed -i '' "s/\\.feature-pill/.$section_class .feature-pill/g" "$filepath"
      sed -i '' "s/\\.content-text/.$section_class .content-text/g" "$filepath"
      sed -i '' "s/\\.content-item/.$section_class .content-item/g" "$filepath"
      sed -i '' "s/\\.card-body/.$section_class .card-body/g" "$filepath"
      sed -i '' "s/\\.footer-text/.$section_class .footer-text/g" "$filepath"
      
      # Fix duplicates that might have been created
      sed -i '' "s/\\.$section_class \\.$section_class/.$section_class/g" "$filepath"
      
      echo "  Fixed specificity for .$section_class"
    fi
  fi
done

echo "CSS specificity fixes complete!"
echo ""
echo "To prevent this in the future:"
echo "1. Always use section-specific class prefixes (e.g., .my-section .feature-text)"
echo "2. Avoid generic class names like .feature-text, .btn-primary, etc."
echo "3. Use the section's main class as a prefix for all styles"