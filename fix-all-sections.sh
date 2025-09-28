#!/bin/bash

# Fix CSS specificity issues across ALL problematic sections
# This prevents text disappearing when sections are reordered

SECTIONS_DIR="/Users/macbook/My Drive/GitHub/an-theme/shared/sections"

echo "Fixing CSS specificity issues in ALL sections..."

# All sections that need fixing based on grep results
PROBLEM_FILES=(
  "content_contact_form.liquid"
  "cta_newsletter_modern.liquid"
  "cta_slim.liquid"
  "feature_showcase.liquid"
  "feature_testimonialbottom.liquid"
  "hero_about_page.liquid"
  "hero_modern.liquid"
  "speaking-page-editable.liquid"
  "speaking-page-ultra-editable.liquid"
  "an_testimonials.liquid"
  "pricing_pwyc.liquid"
  "page-securely-attached-v2.liquid"
  "page_sa_v2.liquid"
  "page-raising-securely-attached-kids.liquid"
  "page_rsak.liquid"
  "page-speaking-structured.liquid"
  "book_showcase_unified.liquid"
)

for file in "${PROBLEM_FILES[@]}"; do
  filepath="$SECTIONS_DIR/$file"
  if [ -f "$filepath" ]; then
    echo "Processing $file..."
    
    # Extract the main section class from the HTML
    section_class=$(grep -o 'class="[^"]*"' "$filepath" | head -1 | sed 's/class="//;s/".*//;s/ .*//')
    
    if [ -n "$section_class" ]; then
      # Create backup
      cp "$filepath" "$filepath.backup"
      
      # Fix generic CSS classes by adding section prefix
      # Only add prefix if not already present
      sed -i '' "s/\([^.]\)\(\.feature-text\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.feature-item\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.feature-icon\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.feature-column\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.feature-pill\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.content-text\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.content-item\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.card-body\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.footer-text\)/\1.$section_class \2/g" "$filepath"
      sed -i '' "s/\([^.]\)\(\.btn-primary-modern\)/\1.$section_class \2/g" "$filepath"
      
      # Fix media queries - add section prefix inside media query blocks
      sed -i '' "/^[[:space:]]*@media/,/^[[:space:]]*}/ {
        s/\([^.]\)\(\.feature-text\)/\1.$section_class \2/g
        s/\([^.]\)\(\.feature-item\)/\1.$section_class \2/g
        s/\([^.]\)\(\.feature-icon\)/\1.$section_class \2/g
        s/\([^.]\)\(\.feature-column\)/\1.$section_class \2/g
        s/\([^.]\)\(\.content-text\)/\1.$section_class \2/g
        s/\([^.]\)\(\.card-body\)/\1.$section_class \2/g
        s/\([^.]\)\(\.footer-text\)/\1.$section_class \2/g
        s/\([^.]\)\(\.btn-primary-modern\)/\1.$section_class \2/g
      }" "$filepath"
      
      # Clean up any double prefixes that might have been created
      sed -i '' "s/\\.$section_class \\.$section_class/.$section_class/g" "$filepath"
      
      echo "  Fixed specificity for .$section_class"
    else
      echo "  Could not determine section class for $file"
    fi
  else
    echo "  File not found: $file"
  fi
done

echo ""
echo "CSS specificity fixes complete!"
echo "Backups created with .backup extension"
echo ""
echo "Sections fixed:"
echo "- All generic .feature-* classes now have section prefixes"
echo "- All .btn-primary-modern classes scoped"
echo "- All .content-* and .card-* classes scoped"
echo "- Media queries updated with proper prefixes"
echo ""
echo "This prevents text disappearing when sections are reordered on pages."