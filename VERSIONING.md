# AN Theme Versioning Strategy

## Overview
Our themes use version numbers starting from 10.0.0 to ensure compatibility with Kajabi's update system and avoid conflicts with their internal theme versions.

## Version Format
All theme versions follow semantic versioning: `MAJOR.MINOR.PATCH`

Starting from version 10.0.0:
- **MAJOR**: Incremented for breaking changes or major feature additions (10, 11, 12...)
- **MINOR**: Incremented for new features that are backward compatible
- **PATCH**: Incremented for bug fixes and minor improvements

## Examples
- `10.0.0` - Initial release avoiding Kajabi conflicts
- `10.1.0` - Added new features
- `10.1.1` - Bug fixes
- `11.0.0` - Major redesign or breaking changes

## Why Start at Version 10?
Kajabi reserves certain version numbers for their internal themes:
- Encore uses versions like 0.4.x, 1.x.x
- Premier uses versions like 6.x.x, 7.x.x
- Momentum uses versions like 6.x.x

By starting at version 10.0.0:
1. We avoid all known version conflicts with Kajabi's internal themes
2. Our themes trigger the "update from zip" flow in Kajabi
3. Version numbers remain clean and follow standard semantic versioning

## Reserved Versions to Avoid
Never use these version ranges:
- 0.x.x through 7.x.x (used by Kajabi internal themes)
- 8.x.x and 9.x.x (potentially reserved for future Kajabi use)

## Theme Info Requirements
Each theme's `settings_schema.json` must contain exactly these 6 fields in the theme_info section:
```json
{
  "name": "theme_info",
  "theme_name": "AN Website Theme",
  "theme_version": "10.0.0",
  "theme_author": "AN Themes",
  "theme_documentation_url": "https://anthemes.com/docs",
  "theme_support_url": "https://anthemes.com/support"
}
```

## Export Naming
Export files follow this pattern: `{THEME_NAME}_{VERSION}.zip`
- Example: `AN_Website_Theme_10.0.0.zip`

## Version History

### v11.1.2 (2025-01-18)
- **MOBILE MENU FIX**: Fixed missing mobile menu functionality
  - Updated mobile menu CSS to work with `.active` class from JavaScript
  - Added mobile backdrop and close button functionality
  - Fixed mobile menu content not displaying header blocks
  - Enhanced mobile menu slide-in animation from right side
  - Fixed body scroll lock when mobile menu is open
  - Website and Landing themes updated to v10.1.2

### v11.1.0 (2025-01-18)
- **UNIFIED HEADER**: Consolidated header implementation
  - Removed redundant `header_landing.liquid` variant
  - Single shared `header.liquid` now serves both Website and Landing themes
  - Maintains full Adaptable Nav block system support
  - Theme-specific styling handled through settings/blocks rather than separate files
  - Reduces maintenance burden and ensures consistent navigation UX