# Navigation Control System

The AN theme now includes a comprehensive navigation control system that allows you to toggle navigation visibility at both global and page levels.

## Global Theme Setting

### Theme Settings Panel
Navigate to **Theme Settings > Navigation** and toggle **"Show Main Navigation"**:

- **Enabled (Default)**: Navigation appears on all pages
- **Disabled**: Navigation is hidden site-wide

### Setting Details
- **Setting ID**: `show_navigation`
- **Type**: Checkbox (boolean)
- **Default**: `true`
- **Location**: Available in both Website and Landing theme settings

## Page-Level Control

For developers who need granular control over navigation visibility on specific templates or sections, use the `navigation_controller` snippet with parameters:

### Basic Usage
```liquid
<!-- Use global theme setting -->
{% include "navigation_controller" %}
```

### Force Show Navigation
```liquid
<!-- Show navigation regardless of global setting -->
{% include "navigation_controller", force_show: true %}
```

### Force Hide Navigation
```liquid
<!-- Hide navigation regardless of global setting -->
{% include "navigation_controller", force_hide: true %}
```

### Custom Navigation Section
```liquid
<!-- Use alternative navigation section -->
{% include "navigation_controller", nav_section: "nav_header_static" %}
```

### Combined Parameters
```liquid
<!-- Force show with custom navigation section -->
{% include "navigation_controller", force_show: true, nav_section: "nav_alt" %}
```

## Available Navigation Sections

The theme includes several navigation section options:

1. **`nav_main`** (Default) - Full-featured navigation with mobile menu
2. **`nav_header_static`** - Static header navigation
3. **`nav_alt`** - Alternative navigation styles
4. **Custom sections** - Any navigation section you create

## Implementation Examples

### Landing Page Without Navigation
Create a template that forces navigation to be hidden:

```liquid
<!-- templates/landing-clean.liquid -->
{% include "navigation_controller", force_hide: true %}

<section class="hero">
  <!-- Landing page content -->
</section>
```

### Login Page with Minimal Navigation
```liquid
<!-- templates/login.liquid -->
{% include "navigation_controller", nav_section: "nav_header_static" %}

<div class="login-form">
  <!-- Login form content -->
</div>
```

### Blog with Custom Navigation
```liquid
<!-- templates/blog.liquid -->
{% include "navigation_controller", nav_section: "nav_blog_custom" %}

{{ content_for_layout }}
```

## Developer Notes

### Priority System
The navigation controller uses this priority order:

1. **`force_hide: true`** - Always hides navigation
2. **`force_show: true`** - Always shows navigation
3. **Global setting** - Uses `settings.show_navigation`

### Theme Integration
The navigation controller is automatically included in:
- `themes/website/layouts/theme.liquid`
- `themes/landing/layouts/theme.liquid`

### Legacy Compatibility
Existing templates and sections will continue to work. The global setting only affects the main layout-level navigation.

## Use Cases

### Marketing Landing Pages
Disable navigation globally and enable it only on specific pages:
```liquid
{% include "navigation_controller", force_show: true %}
```

### Clean Checkout Flow
Hide navigation during checkout process:
```liquid
{% include "navigation_controller", force_hide: true %}
```

### A/B Testing
Test pages with and without navigation:
```liquid
{% if ab_test_variant == 'with_nav' %}
  {% include "navigation_controller", force_show: true %}
{% else %}
  {% include "navigation_controller", force_hide: true %}
{% endif %}
```

### Mobile-Only Navigation
Show different navigation on mobile vs desktop:
```liquid
<div class="hidden-mobile">
  {% include "navigation_controller", nav_section: "nav_desktop" %}
</div>
<div class="hidden-desktop">
  {% include "navigation_controller", nav_section: "nav_mobile" %}
</div>
```

## Best Practices

1. **Use global setting** for site-wide control
2. **Use page-level overrides** sparingly for specific needs
3. **Test thoroughly** when implementing custom navigation sections
4. **Document any custom implementations** for future reference
5. **Consider user experience** when hiding navigation

## Troubleshooting

### Navigation Not Showing
1. Check global theme setting: Settings > Navigation > Show Main Navigation
2. Verify template isn't using `force_hide: true`
3. Ensure navigation section exists and is properly configured

### Navigation Still Showing When Disabled
1. Check for `force_show: true` in template
2. Verify you're using `navigation_controller` snippet, not direct section calls
3. Clear theme cache and reload

### Custom Navigation Not Working
1. Verify custom navigation section name is correct
2. Check that custom section has proper schema and blocks
3. Ensure section is included in theme build/export