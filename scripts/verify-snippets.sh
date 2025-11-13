#!/bin/bash

# Snippet Usage Verification Script
# Checks for ALL references to snippets across the theme

SNIPPETS_DIR="/home/user/an-theme/shared/snippets"
SEARCH_PATHS=(
  "/home/user/an-theme/themes/website"
  "/home/user/an-theme/themes/landing"
  "/home/user/an-theme/shared/sections"
  "/home/user/an-theme/shared/snippets"
)

PHASE_A_FILE="/tmp/phase-a-delete.txt"
PHASE_B_FILE="/tmp/phase-b-review.txt"
PHASE_C_FILE="/tmp/phase-c-keep.txt"

# Clear previous results
> "$PHASE_A_FILE"
> "$PHASE_B_FILE"
> "$PHASE_C_FILE"

echo "Analyzing 136 snippets for usage..."
echo ""

# Process each snippet
for snippet_path in "$SNIPPETS_DIR"/*.liquid; do
  snippet_file=$(basename "$snippet_path")
  snippet_name="${snippet_file%.liquid}"

  # Search for references
  total_refs=0

  for search_path in "${SEARCH_PATHS[@]}"; do
    # Search for include/render patterns
    refs=$(grep -r -l \
      -e "{% include ['\"]$snippet_name['\"]" \
      -e "{% render ['\"]$snippet_name['\"]" \
      -e "'$snippet_name'" \
      -e "\"$snippet_name\"" \
      "$search_path" 2>/dev/null | wc -l)

    total_refs=$((total_refs + refs))
  done

  # Get file size
  size=$(stat -f%z "$snippet_path" 2>/dev/null || stat -c%s "$snippet_path" 2>/dev/null)
  size_kb=$(echo "scale=1; $size/1024" | bc)

  # Categorize
  if [ $total_refs -eq 0 ]; then
    echo "$snippet_file|${size_kb}KB|0" >> "$PHASE_A_FILE"
  elif [ $total_refs -le 2 ]; then
    echo "$snippet_file|${size_kb}KB|$total_refs" >> "$PHASE_B_FILE"
  else
    echo "$snippet_file|${size_kb}KB|$total_refs" >> "$PHASE_C_FILE"
  fi
done

# Generate report
echo "## PHASE A - SAFE TO DELETE (0 references)"
echo "Count: $(wc -l < "$PHASE_A_FILE")"
sort "$PHASE_A_FILE"
echo ""

echo "## PHASE B - NEED MANUAL REVIEW (1-2 references)"
echo "Count: $(wc -l < "$PHASE_B_FILE")"
sort "$PHASE_B_FILE"
echo ""

echo "## PHASE C - KEEP (3+ references)"
echo "Count: $(wc -l < "$PHASE_C_FILE")"
sort "$PHASE_C_FILE"
echo ""

# Summary
phase_a_count=$(wc -l < "$PHASE_A_FILE")
phase_b_count=$(wc -l < "$PHASE_B_FILE")
phase_c_count=$(wc -l < "$PHASE_C_FILE")

echo "## SUMMARY"
echo "Phase A (Safe to delete): $phase_a_count snippets"
echo "Phase B (Need review): $phase_b_count snippets"
echo "Phase C (Keep): $phase_c_count snippets"
echo "Total: $((phase_a_count + phase_b_count + phase_c_count)) snippets"
