# Icon System Documentation

## Overview

The AN theme has migrated from Font Awesome to inline SVG icons for significant performance improvements. This eliminates the ~150KB Font Awesome CSS file and provides full control over icon styling.

## Usage

### Basic Usage

```liquid
{% render 'icon', icon: 'facebook' %}
```

### With Parameters

```liquid
{% render 'icon', 
  icon: 'search',
  size: 24,
  color: '#5E3BFF',
  class: 'icon-primary',
  aria_label: 'Search'
%}
```

### Parameters

- `icon` (required): Icon name from the library
- `size`: Size in pixels (default: 20)
- `color`: Icon color (default: currentColor)
- `class`: Additional CSS classes
- `aria_label`: Accessibility label for screen readers

## Available Icons

### Social Media
- `facebook` - Facebook logo
- `twitter` - Twitter/X logo
- `instagram` - Instagram logo
- `youtube` - YouTube logo
- `pinterest` - Pinterest logo
- `linkedin` - LinkedIn logo
- `tiktok` - TikTok logo
- `github` - GitHub logo
- `amazon` - Amazon logo
- `apple` - Apple logo
- `vimeo` - Vimeo logo
- `tumblr` - Tumblr logo
- `spotify` - Spotify logo
- `medium` - Medium logo
- `soundcloud` - SoundCloud logo
- `slack` - Slack logo
- `dribbble` - Dribbble logo
- `flickr` - Flickr logo
- `yelp` - Yelp logo

### Navigation
- `search` - Magnifying glass
- `chevron-down` - Down arrow
- `chevron-up` - Up arrow
- `chevron-left` - Left arrow
- `chevron-right` - Right arrow
- `arrow-left` - Left arrow with line
- `arrow-right` - Right arrow with line
- `menu` / `bars` - Hamburger menu
- `close` / `times` - X close icon

### UI Elements
- `check` - Checkmark
- `check-circle` - Checkmark in circle
- `lock` - Padlock
- `play` - Play triangle
- `play-circle` - Play button in circle
- `heart` - Heart outline
- `star` - Star outline
- `star-filled` - Filled star
- `plus` - Plus sign
- `minus` - Minus sign
- `info` - Info circle

### Communication
- `email` / `mail` - Envelope
- `phone` - Phone handset
- `external-link` - External link indicator

### Commerce
- `shopping-cart` - Shopping cart
- `download` - Download arrow
- `tag` - Price tag

### Time & Calendar
- `calendar` - Calendar
- `clock` - Clock

### Other
- `user` - User silhouette
- `warning` / `exclamation-triangle` - Warning triangle
- `file` - Generic file
- `file-pdf` - PDF file
- `podcast` - Podcast icon
- `target` / `bullseye` - Target/bullseye

## CSS Classes

The following utility classes are available for icon styling:

```css
/* Sizing */
.icon-xs  /* 12px */
.icon-sm  /* 16px */
.icon-md  /* 20px - default */
.icon-lg  /* 24px */
.icon-xl  /* 32px */
.icon-2xl /* 48px */

/* Colors */
.icon-brand  /* Brand purple */
.icon-teal   /* Accent teal */
.icon-peach  /* Accent peach */
.icon-lemon  /* Accent lemon */
.icon-muted  /* Muted gray */

/* Special styling */
.icon-social /* Adds hover lift effect */
.icon-circle /* Wraps icon in circular background */
```

## Examples

### Social Icons Row
```liquid
<div class="d-flex gap-3">
  {% render 'icon', icon: 'facebook', class: 'icon-social', aria_label: 'Facebook' %}
  {% render 'icon', icon: 'twitter', class: 'icon-social', aria_label: 'Twitter' %}
  {% render 'icon', icon: 'instagram', class: 'icon-social', aria_label: 'Instagram' %}
</div>
```

### Button with Icon
```liquid
<button class="btn btn-primary">
  {% render 'icon', icon: 'download', size: 16 %}
  Download PDF
</button>
```

### Icon in Circle
```liquid
<div class="icon-circle">
  {% render 'icon', icon: 'check' %}
</div>
```

## Migration from Font Awesome

### Before (Font Awesome)
```html
<i class="fab fa-facebook-f"></i>
<i class="fas fa-search"></i>
<i class="fa fa-chevron-down"></i>
```

### After (Icon System)
```liquid
{% render 'icon', icon: 'facebook' %}
{% render 'icon', icon: 'search' %}
{% render 'icon', icon: 'chevron-down' %}
```

## Adding New Icons

1. Find the SVG code for your icon
2. Add a new `when` case in `/shared/snippets/icon.liquid`
3. Ensure the SVG uses `{{ icon_size }}` for dimensions
4. Use `{{ icon_color }}` for fill/stroke colors
5. Include proper accessibility attributes

Example:
```liquid
{% when 'new-icon' %}
  <svg class="icon icon-new {{ icon_class }}" 
       width="{{ icon_size }}" 
       height="{{ icon_size }}" 
       viewBox="0 0 24 24" 
       fill="{{ icon_color }}" 
       xmlns="http://www.w3.org/2000/svg" 
       {% if aria_label %}aria-label="{{ aria_label }}"{% endif %}>
    <!-- SVG path data here -->
  </svg>
```

## Performance Benefits

- **Eliminated Font Awesome**: ~150KB CSS file removed
- **No external requests**: Icons are inline, no HTTP requests
- **Tree-shaking**: Only the icons you use are included
- **Full styling control**: Direct access to SVG properties
- **Better caching**: Icons are part of your HTML
- **Accessibility**: Built-in ARIA label support

## Best Practices

1. Always include `aria_label` for standalone icons
2. Use `currentColor` to inherit text color
3. Apply `.icon-social` class for social media icons
4. Size icons appropriately for their context
5. Use utility classes instead of inline styles

## Browser Support

SVG icons are supported in all modern browsers including:
- Chrome/Edge (all versions)
- Firefox (all versions)  
- Safari (all versions)
- IE 11+ (with some limitations)