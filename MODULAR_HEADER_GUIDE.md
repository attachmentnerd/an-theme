# Modular Header Architecture Guide

## Overview

The AN themes now feature a clean, modular header system that separates the header, navigation, and mobile menu into distinct sections. This gives you complete control over which pages display navigation.

## Components

### 1. Header - `header.liquid`
A minimal header containing only:
- Logo (image or text)
- Sticky header support
- Overlay positioning option
- Responsive sizing options

**Use when:** You need a header on every page (which is usually always).

### 2. Navigation - `navigation.liquid`
A flexible navigation bar that includes:
- Menu links
- Dropdowns
- CTA buttons
- User account links
- Shopping cart
- Social icons
- Custom links
- Mobile hamburger menu (automatically shown on mobile)

**Use when:** You want to add navigation to specific pages only.

### 3. Mobile Menu - `mobile_menu.liquid`
A slide-out mobile menu with:
- Logo display
- Multi-level navigation
- CTA button
- Custom footer content
- Smooth animations

**Use when:** You need mobile navigation (works with the hamburger in Navigation section).

## Implementation Examples

### Example 1: Homepage with Full Navigation
```
1. Header (Simple)
2. Navigation 
3. Hero Section
4. [Other content sections]
5. Mobile Menu
```

### Example 2: Landing Page without Navigation
```
1. Header (Simple) - Logo only
2. Hero Section
3. [Other content sections]
4. Mobile Menu - Optional
```

### Example 3: Different Navigation per Page Type
- **Homepage**: Header + Main Navigation + Mobile Menu
- **Product Pages**: Header + Product Navigation + Mobile Menu  
- **Landing Pages**: Header only + Mobile Menu
- **Blog**: Header + Blog Navigation + Mobile Menu

## Setup Instructions

### Step 1: Add Header (Simple)
1. In Kajabi Theme Editor, add "Header (Simple)" section
2. Configure:
   - Upload logo or set text
   - Choose colors
   - Enable sticky header (optional)
   - Enable mobile menu button

### Step 2: Add Navigation (Optional)
1. Add "Navigation" section below header
2. Add blocks:
   - Menu block for main navigation
   - Spacer block to push items apart
   - Featured Button for CTA
   - Dropdown for sub-menus
3. Configure colors and alignment

### Step 3: Add Mobile Menu
1. Add "Mobile Menu" section (usually at bottom)
2. Configure:
   - Add menu blocks
   - Set up CTA button
   - Customize colors to match brand

## Benefits

### 1. **Page-Specific Navigation**
- Show navigation only where needed
- Different nav styles per page template
- Cleaner landing pages without nav

### 2. **Performance**
- Smaller header = faster load
- Navigation loads only when included
- Less JavaScript overhead

### 3. **Design Flexibility**
- Mix and match components
- Different navigation per page
- Easy A/B testing

### 4. **Mobile Optimization**
- Dedicated mobile menu
- Better mobile performance
- Customizable mobile experience

## Migration from Original Header

If you're currently using the original header:

1. **Keep original header** - It still works perfectly
2. **Or migrate gradually**:
   - Add Header (Simple) to new pages
   - Test Navigation section separately
   - Move to modular approach when ready

## Styling Tips

### Consistent Look
Ensure visual consistency:
```css
/* In overrides.css */
.header-simple,
.navigation {
  /* Same height for alignment */
  min-height: 60px;
}
```

### Sticky Behavior
For sticky nav below sticky header:
```css
.header-simple--sticky + .navigation--sticky {
  top: 60px; /* Height of header */
}
```

### Mobile Breakpoints
Both components hide navigation at 767px by default. Adjust if needed:
```css
@media (max-width: 991px) {
  /* Custom breakpoint */
}
```

## Common Patterns

### 1. **Marketing Site**
- Header (Simple) - Sticky
- Navigation - Main menu + CTA
- Mobile Menu - Full navigation

### 2. **SaaS Product**
- Header (Simple) - Logo + User menu
- Navigation - Product-specific links
- Mobile Menu - Simplified nav

### 3. **Landing Page**
- Header (Simple) - Logo only
- No Navigation section
- Mobile Menu - Optional

### 4. **E-learning Platform**
- Header (Simple) - Logo + Cart
- Navigation - Course categories
- Mobile Menu - Full menu + user

## Troubleshooting

### Mobile menu not opening?
- Ensure Header (Simple) has "Enable Mobile Menu Button" checked
- Mobile Menu section must be added to page
- Check browser console for errors

### Navigation not sticky?
- Enable sticky in Navigation section settings
- Check z-index conflicts in custom CSS

### Dropdown menus not working?
- Use the Dropdown block type
- Ensure menu has child items in Kajabi

## Best Practices

1. **Keep it Simple**
   - Don't duplicate navigation in multiple sections
   - Use one approach per page

2. **Mobile First**
   - Test mobile menu thoroughly
   - Ensure touch targets are large enough

3. **Performance**
   - Only include navigation where needed
   - Minimize blocks in navigation

4. **Accessibility**
   - Use descriptive link text
   - Ensure color contrast is sufficient
   - Test keyboard navigation

## Future Enhancements

This modular approach enables:
- A/B testing different nav layouts
- Personalized navigation per user type
- Progressive enhancement strategies
- Easier maintenance and updates