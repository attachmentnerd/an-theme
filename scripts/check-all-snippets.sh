#!/bin/bash
# Efficient snippet usage checker

cd /home/user/an-theme

echo "Checking all 136 snippets for usage..."
echo ""

phase_a=0
phase_b=0
phase_c=0

phase_a_file="/tmp/phase-a.txt"
phase_b_file="/tmp/phase-b.txt"
phase_c_file="/tmp/phase-c.txt"

> "$phase_a_file"
> "$phase_b_file"
> "$phase_c_file"

for snippet in shared/snippets/*.liquid; do
    name=$(basename "$snippet" .liquid)
    size=$(du -k "$snippet" | cut -f1)

    # Count references (exclude the snippet file itself)
    refs=$(grep -r -l "$name" \
        themes/website/ \
        themes/landing/ \
        shared/sections/ \
        shared/snippets/ 2>/dev/null | \
        grep -E "(include|render|'$name'|\"$name\")" | \
        grep -v "shared/snippets/$name.liquid" | \
        wc -l | tr -d ' ')

    # Better reference check - look for actual include/render patterns
    actual_refs=$(grep -r "$name" \
        themes/website/ \
        themes/landing/ \
        shared/sections/ \
        shared/snippets/ 2>/dev/null | \
        grep -E "({% include|{% render)" | \
        grep -v "shared/snippets/$name.liquid" | \
        wc -l | tr -d ' ')

    # Use actual_refs for categorization
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
done

echo "Analysis complete!"
echo ""
echo "Phase A (0 refs): $phase_a snippets"
echo "Phase B (1-2 refs): $phase_b snippets"
echo "Phase C (3+ refs): $phase_c snippets"
echo ""
echo "Results saved to /tmp/phase-*.txt"
