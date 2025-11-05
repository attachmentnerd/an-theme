#!/bin/bash
# Comprehensive snippet usage checker - ALL themes

cd /home/user/an-theme

echo "Checking all 136 snippets across ALL themes and shared components..."
echo ""

phase_a=0
phase_b=0
phase_c=0

phase_a_file="/tmp/phase-a-comprehensive.txt"
phase_b_file="/tmp/phase-b-comprehensive.txt"
phase_c_file="/tmp/phase-c-comprehensive.txt"

> "$phase_a_file"
> "$phase_b_file"
> "$phase_c_file"

for snippet in shared/snippets/*.liquid; do
    name=$(basename "$snippet" .liquid)
    size=$(du -k "$snippet" | cut -f1)

    # Search in ALL themes + shared
    actual_refs=$(grep -r "$name" \
        themes/ \
        shared/sections/ \
        shared/snippets/ 2>/dev/null | \
        grep -E "({% include|{% render)" | \
        grep -v "shared/snippets/$name.liquid" | \
        wc -l | tr -d ' ')

    # Categorize based on reference count
    if [ "$actual_refs" -eq 0 ]; then
        echo "$name.liquid|${size}KB|0" >> "$phase_a_file"
        ((phase_a++))
    elif [ "$actual_refs" -le 2 ]; then
        echo "$name.liquid|${size}KB|$actual_refs" >> "$phase_b_file"
        ((phase_b++))
    else
        echo "$name.liquid|${size}KB|$actual_refs" >> "$phase_c_file"
        ((phase_c++))
    fi

    # Progress indicator
    if [ $((phase_a + phase_b + phase_c)) -eq 136 ]; then
        echo "Completed all 136 snippets!"
    fi
done

echo ""
echo "Analysis complete!"
echo ""
echo "Phase A (0 refs): $phase_a snippets"
echo "Phase B (1-2 refs): $phase_b snippets"
echo "Phase C (3+ refs): $phase_c snippets"
echo ""
echo "Results saved to /tmp/phase-*-comprehensive.txt"
