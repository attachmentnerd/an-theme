# Mobile Dropdown System Update - nav_main.liquid

## Summary of Changes

The mobile dropdown system in `nav_main.liquid` has been redesigned to use a more intuitive nested block structure, eliminating the need for manual ID matching between dropdowns and their content.

## Key Changes Made:

### 1. Schema Updates
- **Removed**: The separate `mobile_card` block type
- **Updated**: The `mobile_dropdown` block now supports nested blocks within it
- **Added**: Two nested block types:
  - `dropdown_link` - Simple link items
  - `dropdown_card` - Cards with images/colors

### 2. Rendering Logic Updates
- Removed complex parent matching logic that required matching titles
- Updated to loop through `block.blocks` for nested content
- Automatically detects whether to render cards or links based on nested block types

### 3. New CSS Added
- Added `.kajabi-nav__mobile-dropdown-links` styles for link lists
- Includes hover effects and smooth transitions

## How to Use the New System:

### In Kajabi Editor:
1. Add a "Mobile Dropdown Section" block
2. Set the dropdown title and expanded state
3. Click into the dropdown block to add nested content:
   - Add "Dropdown Link" blocks for simple links
   - Add "Dropdown Card" blocks for visual cards

### Example Structure:
```
Mobile Dropdown Section: "Books"
  ├── Dropdown Card: "Securely Attached"
  ├── Dropdown Card: "Raising Securely Attached Kids"
  └── Dropdown Card: "Uniquely Us"

Mobile Dropdown Section: "Resources"
  ├── Dropdown Link: "Blog"
  ├── Dropdown Link: "Podcast"
  └── Dropdown Link: "Free Downloads"
```

## Benefits:
- ✅ Visual, intuitive editing experience
- ✅ No manual ID/title matching required
- ✅ Mix cards and links in the same dropdown
- ✅ Cleaner, more maintainable code
- ✅ Better user experience in Kajabi editor

## Migration Notes:
- Existing sections using the old `mobile_card` blocks will need to be recreated
- The new structure is not backward compatible with the old parent_dropdown system
- All styling and functionality remains the same for end users