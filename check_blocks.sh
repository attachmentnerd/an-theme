#!/bin/bash

# Script to find sections with blocks using "settings" instead of "elements"

cd /Users/macbook/Documents/GitHub/an-theme/shared/sections

echo "Files with blocks using 'settings' instead of 'elements':"
echo "========================================================="

for file in *.liquid; do
    if grep -q '"blocks"' "$file"; then
        # Check if there's a pattern like "blocks": [ ... "settings": within the schema
        if grep -Pzo '(?s)"blocks":\s*\[[^]]*"settings":\s*\[' "$file" > /dev/null 2>&1; then
            echo "✗ $file - Has blocks with 'settings' (should be 'elements')"
            # Show a snippet of the problematic area
            grep -A 5 -B 2 '"blocks"' "$file" | grep -A 3 -B 3 '"settings"' | head -20
            echo "---"
        fi
    fi
done