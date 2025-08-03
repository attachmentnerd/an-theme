#!/usr/bin/env python3
import os
import re
import json

sections_dir = "/Users/macbook/Documents/GitHub/an-theme/shared/sections"
files_with_issues = []

def check_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find the schema section
    schema_match = re.search(r'{% schema %}(.*?){% endschema %}', content, re.DOTALL)
    if not schema_match:
        return None
    
    schema_content = schema_match.group(1)
    
    # Look for blocks array
    blocks_match = re.search(r'"blocks"\s*:\s*\[(.*?)\](?=\s*,\s*"presets"|\s*})', schema_content, re.DOTALL)
    if not blocks_match:
        return None
    
    blocks_content = blocks_match.group(0)
    
    # Check if any block has "settings" instead of "elements"
    # Pattern: inside blocks array, find objects with "settings" array
    if re.search(r'"type"\s*:\s*"[^"]+"\s*,\s*"name"\s*:\s*"[^"]+"\s*,\s*"settings"\s*:\s*\[', blocks_content):
        return True
    
    # Alternative pattern where settings might come before name
    if re.search(r'"type"\s*:\s*"[^"]+"\s*,\s*"settings"\s*:\s*\[', blocks_content):
        return True
        
    return False

# Check all liquid files
for filename in os.listdir(sections_dir):
    if filename.endswith('.liquid'):
        filepath = os.path.join(sections_dir, filename)
        if check_file(filepath):
            files_with_issues.append(filename)

print("Files with blocks using 'settings' instead of 'elements':")
print("=" * 60)
for file in sorted(files_with_issues):
    print(f"✗ {file}")

print(f"\nTotal files with issues: {len(files_with_issues)}")