# Adaptable Navigation Guide

This guide shows how to use the new adaptable navigation features in the AN Kajabi themes.

## Overview

The navigation is now fully customizable through Kajabi's theme editor. You can:
- Show/hide the logo
- Add custom links anywhere
- Add featured buttons with custom colors
- Add spacers for perfect alignment
- Reorder all navigation elements
- Create completely custom navigation layouts

## Available Block Types

### 1. Logo Block
- **Show/Hide**: Toggle logo visibility
- **Type**: Choose between image or text logo
- **Styling**: Custom width and colors
- **Alignment**: Left, center, or right

### 2. Menu Block
- **Menu Selection**: Choose from your Kajabi navigation menus
- **New Tab**: Option to open links in new tab
- **Stretch**: Fill remaining space
- **Alignment**: Control text alignment

### 3. Custom Link Block
- **Link Text**: Custom text for your link
- **Link Action**: Supports all Kajabi action types:
  - Page link
  - Products page
  - Offers page
  - Blog
  - External URL
  - Email
  - Phone
- **New Tab**: Open in new window option

### 4. Featured Button Block
- **Button Text**: Custom CTA text
- **Button Action**: All Kajabi action types
- **Button Style**: 
  - Primary (Blue)
  - Secondary (Outline)
  - White
- **Button Size**: Small, Medium, Large
- **Custom Color**: Override default button color
- **New Tab**: Open in new window option

### 5. Spacer Block
- **Space Size**: 
  - Small (8px)
  - Medium (16px)
  - Large (32px)
  - Extra Large (48px)
  - Auto (fills available space)

### 6. User Menu Block
- Shows user account dropdown
- Login/logout functionality

### 7. Dropdown Menu Block
- Custom dropdown navigation
- Supports sub-menus

### 8. Social Icons Block
- Add social media links
- Customizable colors and size

## Example Configurations

### Configuration 1: Simple Navigation
```
[Logo] [Spacer-Auto] [Menu] [Login] [Featured Button: "Get Started"]
```

### Configuration 2: No Logo, Multiple CTAs
```
[Custom Link: "Home"] [Custom Link: "About"] [Spacer-Auto] [Featured Button: "Sign Up"] [Featured Button: "Login"]
```

### Configuration 3: Center-Aligned Logo
```
[Menu] [Spacer-Auto] [Logo] [Spacer-Auto] [User Menu] [Featured Button: "Book Demo"]
```

### Configuration 4: Landing Page Style
```
[Logo] [Spacer-Auto] [Custom Link: "Features"] [Custom Link: "Pricing"] [Featured Button: "Start Free Trial"]
```

## How to Use

1. **Access Theme Editor**: 
   - Go to your Kajabi admin
   - Navigate to Website > Design > Edit
   - Click on the Header section

2. **Add Blocks**:
   - Click "Add Block" in the header section
   - Choose from available block types
   - Configure each block's settings

3. **Reorder Blocks**:
   - Drag and drop blocks to reorder
   - Use spacer blocks for alignment

4. **Style Your Navigation**:
   - Each block has individual style settings
   - Use custom colors where available
   - Control alignment and spacing

## CSS Classes for Custom Styling

If you need additional customization, these are the CSS classes:

```css
/* Custom link styling */
.header__block--custom-link .link-list__link {
  /* Your custom styles */
}

/* Featured button styling */
.header__block--featured-button .btn {
  /* Your custom styles */
}

/* Spacer styling */
.header__spacer {
  /* Your custom styles */
}
```

## Tips

1. **Use Auto Spacers**: Place an auto spacer between logo and menu to push menu to the right
2. **Multiple Buttons**: You can add multiple featured buttons with different styles
3. **Mobile Consideration**: Test your navigation on mobile - blocks stack vertically
4. **Custom Links**: Great for adding direct links to specific pages or external resources
5. **Hide Logo**: Useful for landing pages where you want a minimal header

## Limitations

- Blocks appear in the order they're added
- Some styling options depend on your theme's CSS
- Mobile menu shows all blocks in a vertical stack
- Maximum recommended blocks: 8-10 for desktop visibility

This adaptable navigation system gives you complete control over your header layout without touching any code!