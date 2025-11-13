#!/usr/bin/env python3
"""
Comprehensive Snippet Usage Verification Script
Checks for ALL references to snippets across the theme
"""

import os
import re
import subprocess
from pathlib import Path
from collections import defaultdict

SNIPPETS_DIR = Path("/home/user/an-theme/shared/snippets")
SEARCH_PATHS = [
    Path("/home/user/an-theme/themes/website"),
    Path("/home/user/an-theme/themes/landing"),
    Path("/home/user/an-theme/shared/sections"),
    Path("/home/user/an-theme/shared/snippets"),
]

def find_snippet_references(snippet_name):
    """Find all references to a snippet across search paths"""
    references = []

    # Patterns to search for
    patterns = [
        f"include ['\"]?{snippet_name}['\"]?",
        f"render ['\"]?{snippet_name}['\"]?",
        f"'{snippet_name}'",
        f'"{snippet_name}"',
    ]

    for search_path in SEARCH_PATHS:
        if not search_path.exists():
            continue

        for pattern in patterns:
            try:
                # Use ripgrep for fast searching
                result = subprocess.run(
                    ["grep", "-r", "-l", pattern, str(search_path)],
                    capture_output=True,
                    text=True,
                    timeout=5
                )

                if result.stdout:
                    files = result.stdout.strip().split('\n')
                    # Filter out self-references
                    for f in files:
                        if f and f != str(SNIPPETS_DIR / f"{snippet_name}.liquid"):
                            references.append(f)
            except Exception as e:
                pass

    # Remove duplicates
    return list(set(references))

def get_file_size(file_path):
    """Get file size in KB"""
    try:
        size_bytes = os.path.getsize(file_path)
        return round(size_bytes / 1024, 1)
    except:
        return 0

def main():
    # Get all snippets
    snippets = sorted(SNIPPETS_DIR.glob("*.liquid"))

    phase_a = []  # 0 references - safe to delete
    phase_b = []  # 1-2 references - need review
    phase_c = []  # 3+ references - keep

    print(f"Analyzing {len(snippets)} snippets...\n")

    for i, snippet_path in enumerate(snippets, 1):
        snippet_name = snippet_path.stem

        # Find references
        refs = find_snippet_references(snippet_name)
        ref_count = len(refs)

        # Get size
        size_kb = get_file_size(snippet_path)

        # Progress indicator
        if i % 10 == 0:
            print(f"Processed {i}/{len(snippets)}...")

        # Categorize
        data = {
            'name': snippet_path.name,
            'size': size_kb,
            'refs': ref_count,
            'files': refs
        }

        if ref_count == 0:
            phase_a.append(data)
        elif ref_count <= 2:
            phase_b.append(data)
        else:
            phase_c.append(data)

    # Generate report
    print("\n" + "="*80)
    print("## PHASE A - SAFE TO DELETE (0 references)")
    print("="*80)
    print(f"Count: {len(phase_a)} snippets\n")

    total_size_a = 0
    for item in sorted(phase_a, key=lambda x: x['name']):
        print(f"- {item['name']:<50} ({item['size']:>6.1f} KB)")
        total_size_a += item['size']

    print(f"\nTotal size: {total_size_a:.1f} KB")

    print("\n" + "="*80)
    print("## PHASE B - NEED MANUAL REVIEW (1-2 references)")
    print("="*80)
    print(f"Count: {len(phase_b)} snippets\n")

    for item in sorted(phase_b, key=lambda x: x['name']):
        print(f"- {item['name']:<50} ({item['size']:>6.1f} KB) - {item['refs']} refs")
        for ref_file in item['files'][:3]:  # Show first 3 references
            print(f"    -> {ref_file}")

    print("\n" + "="*80)
    print("## PHASE C - KEEP (3+ references)")
    print("="*80)
    print(f"Count: {len(phase_c)} snippets\n")

    for item in sorted(phase_c, key=lambda x: x['name']):
        print(f"- {item['name']:<50} ({item['size']:>6.1f} KB) - {item['refs']} refs")

    # Summary
    print("\n" + "="*80)
    print("## SUMMARY")
    print("="*80)
    print(f"Phase A (Safe to delete): {len(phase_a)} snippets ({total_size_a:.1f} KB)")
    print(f"Phase B (Need review):    {len(phase_b)} snippets")
    print(f"Phase C (Keep):           {len(phase_c)} snippets")
    print(f"Total:                    {len(snippets)} snippets")
    print(f"\nSpace to be saved: {total_size_a:.1f} KB ({total_size_a/1024:.1f} MB)")

    # Save Phase A list for deletion
    with open("/tmp/phase-a-safe-delete.txt", "w") as f:
        for item in sorted(phase_a, key=lambda x: x['name']):
            f.write(f"{item['name']}\n")

    print(f"\nPhase A list saved to: /tmp/phase-a-safe-delete.txt")

if __name__ == "__main__":
    main()
