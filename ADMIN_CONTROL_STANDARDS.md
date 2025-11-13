# Admin Control Standards for AN Theme

## Overview
This document defines standardized control templates for all sections to ensure consistency and maximum flexibility without developer intervention.

## Core Principles
1. **Non-destructive**: All controls should be optional with sensible defaults
2. **Responsive-first**: Always provide mobile, tablet, and desktop options
3. **Hierarchical organization**: Use headers and dividers to group related controls
4. **Clear labeling**: Use descriptive labels and info text where helpful
5. **Consistent naming**: Follow established patterns (e.g., `padding_mobile`, `padding_tablet`, `padding_desktop`)

---

## Control Template Library

### 1. Responsive Design Controls

Use these controls for any section that needs device-specific visibility or spacing:

```json
{
  "type": "header",
  "content": "Responsive Settings"
},
{
  "type": "checkbox",
  "id": "hide_on_mobile",
  "label": "Hide on Mobile",
  "default": false,
  "info": "Hide this section on screens smaller than 768px"
},
{
  "type": "checkbox",
  "id": "hide_on_tablet",
  "label": "Hide on Tablet",
  "default": false,
  "info": "Hide this section on screens between 768px and 991px"
},
{
  "type": "checkbox",
  "id": "hide_on_desktop",
  "label": "Hide on Desktop",
  "default": false,
  "info": "Hide this section on screens larger than 992px"
},
{
  "type": "header",
  "content": "Spacing (Responsive)"
},
{
  "type": "range",
  "id": "padding_top_mobile",
  "label": "Top Padding (Mobile)",
  "min": 0,
  "max": 120,
  "step": 4,
  "unit": "px",
  "default": 40
},
{
  "type": "range",
  "id": "padding_bottom_mobile",
  "label": "Bottom Padding (Mobile)",
  "min": 0,
  "max": 120,
  "step": 4,
  "unit": "px",
  "default": 40
},
{
  "type": "range",
  "id": "padding_top_tablet",
  "label": "Top Padding (Tablet)",
  "min": 0,
  "max": 160,
  "step": 4,
  "unit": "px",
  "default": 60
},
{
  "type": "range",
  "id": "padding_bottom_tablet",
  "label": "Bottom Padding (Tablet)",
  "min": 0,
  "max": 160,
  "step": 4,
  "unit": "px",
  "default": 60
},
{
  "type": "range",
  "id": "padding_top_desktop",
  "label": "Top Padding (Desktop)",
  "min": 0,
  "max": 200,
  "step": 4,
  "unit": "px",
  "default": 80
},
{
  "type": "range",
  "id": "padding_bottom_desktop",
  "label": "Bottom Padding (Desktop)",
  "min": 0,
  "max": 200,
  "step": 4,
  "unit": "px",
  "default": 80
}
```

**Liquid Implementation:**
```liquid
<section
  class="my-section
    {% if section.settings.hide_on_mobile %}hidden--mobile{% endif %}
    {% if section.settings.hide_on_tablet %}hidden--tablet{% endif %}
    {% if section.settings.hide_on_desktop %}hidden--desktop{% endif %}"
  style="
    --padding-top-mobile: {{ section.settings.padding_top_mobile }}px;
    --padding-bottom-mobile: {{ section.settings.padding_bottom_mobile }}px;
    --padding-top-tablet: {{ section.settings.padding_top_tablet }}px;
    --padding-bottom-tablet: {{ section.settings.padding_bottom_tablet }}px;
    --padding-top-desktop: {{ section.settings.padding_top_desktop }}px;
    --padding-bottom-desktop: {{ section.settings.padding_bottom_desktop }}px;
  "
>
```

**CSS:**
```css
.my-section {
  padding-top: var(--padding-top-mobile);
  padding-bottom: var(--padding-bottom-mobile);
}

@media (min-width: 768px) {
  .my-section {
    padding-top: var(--padding-top-tablet);
    padding-bottom: var(--padding-bottom-tablet);
  }
}

@media (min-width: 992px) {
  .my-section {
    padding-top: var(--padding-top-desktop);
    padding-bottom: var(--padding-bottom-desktop);
  }
}
```

---

### 2. Background & Styling Controls

Use these controls for sections that need flexible background options:

```json
{
  "type": "header",
  "content": "Background Settings"
},
{
  "type": "select",
  "id": "background_type",
  "label": "Background Type",
  "options": [
    { "value": "color", "label": "Solid Color" },
    { "value": "gradient", "label": "Gradient" },
    { "value": "image", "label": "Image" },
    { "value": "none", "label": "None / Transparent" }
  ],
  "default": "color"
},
{
  "type": "color",
  "id": "background_color",
  "label": "Background Color",
  "default": "#FFFFFF"
},
{
  "type": "color",
  "id": "gradient_start",
  "label": "Gradient Start Color",
  "default": "#5E3BFF"
},
{
  "type": "color",
  "id": "gradient_end",
  "label": "Gradient End Color",
  "default": "#E9E6FF"
},
{
  "type": "range",
  "id": "gradient_angle",
  "label": "Gradient Angle",
  "min": 0,
  "max": 360,
  "step": 15,
  "unit": "deg",
  "default": 135
},
{
  "type": "image_picker",
  "id": "background_image",
  "label": "Background Image"
},
{
  "type": "select",
  "id": "background_size",
  "label": "Background Size",
  "options": [
    { "value": "cover", "label": "Cover" },
    { "value": "contain", "label": "Contain" },
    { "value": "auto", "label": "Auto" }
  ],
  "default": "cover"
},
{
  "type": "select",
  "id": "background_position",
  "label": "Background Position",
  "options": [
    { "value": "center center", "label": "Center" },
    { "value": "top center", "label": "Top" },
    { "value": "bottom center", "label": "Bottom" },
    { "value": "center left", "label": "Left" },
    { "value": "center right", "label": "Right" }
  ],
  "default": "center center"
},
{
  "type": "checkbox",
  "id": "background_fixed",
  "label": "Fixed Background (Parallax)",
  "default": false
},
{
  "type": "range",
  "id": "background_overlay_opacity",
  "label": "Overlay Opacity",
  "min": 0,
  "max": 100,
  "step": 5,
  "unit": "%",
  "default": 0,
  "info": "Darkens the background image for better text readability"
},
{
  "type": "header",
  "content": "Border Settings"
},
{
  "type": "range",
  "id": "border_width",
  "label": "Border Width",
  "min": 0,
  "max": 10,
  "step": 1,
  "unit": "px",
  "default": 0
},
{
  "type": "color",
  "id": "border_color",
  "label": "Border Color",
  "default": "#E9E6FF"
},
{
  "type": "range",
  "id": "border_radius",
  "label": "Border Radius",
  "min": 0,
  "max": 50,
  "step": 2,
  "unit": "px",
  "default": 0
},
{
  "type": "header",
  "content": "Shadow Settings"
},
{
  "type": "select",
  "id": "shadow_size",
  "label": "Shadow Size",
  "options": [
    { "value": "none", "label": "None" },
    { "value": "sm", "label": "Small" },
    { "value": "md", "label": "Medium" },
    { "value": "lg", "label": "Large" },
    { "value": "xl", "label": "Extra Large" }
  ],
  "default": "none"
}
```

**Liquid Implementation:**
```liquid
<section
  class="my-section shadow-{{ section.settings.shadow_size }}"
  style="
    {% if section.settings.background_type == 'color' %}
      background-color: {{ section.settings.background_color }};
    {% elsif section.settings.background_type == 'gradient' %}
      background: linear-gradient({{ section.settings.gradient_angle }}deg, {{ section.settings.gradient_start }}, {{ section.settings.gradient_end }});
    {% elsif section.settings.background_type == 'image' and section.settings.background_image %}
      background-image: url('{{ section.settings.background_image | image_picker_url: "1600x" }}');
      background-size: {{ section.settings.background_size }};
      background-position: {{ section.settings.background_position }};
      background-repeat: no-repeat;
      {% if section.settings.background_fixed %}background-attachment: fixed;{% endif %}
    {% endif %}
    border: {{ section.settings.border_width }}px solid {{ section.settings.border_color }};
    border-radius: {{ section.settings.border_radius }}px;
  "
>
  {% if section.settings.background_type == 'image' and section.settings.background_overlay_opacity > 0 %}
    <div class="bg-overlay" style="opacity: {{ section.settings.background_overlay_opacity | divided_by: 100.0 }};"></div>
  {% endif %}

  <!-- Section content -->
</section>
```

**CSS:**
```css
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(26, 45, 78, 0.05); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(26, 45, 78, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(26, 45, 78, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(26, 45, 78, 0.1); }

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  pointer-events: none;
}
```

---

### 3. Typography Controls

Use these controls for sections with customizable text:

```json
{
  "type": "header",
  "content": "Heading Settings"
},
{
  "type": "checkbox",
  "id": "show_heading",
  "label": "Show Heading",
  "default": true
},
{
  "type": "text",
  "id": "heading",
  "label": "Heading Text",
  "default": "Section Heading"
},
{
  "type": "select",
  "id": "heading_size",
  "label": "Heading Size",
  "options": [
    { "value": "display", "label": "Display (48px)" },
    { "value": "h1", "label": "H1 (40px)" },
    { "value": "h2", "label": "H2 (30px)" },
    { "value": "h3", "label": "H3 (24px)" },
    { "value": "h4", "label": "H4 (20px)" }
  ],
  "default": "h1"
},
{
  "type": "color",
  "id": "heading_color",
  "label": "Heading Color",
  "default": "#1A1A1A"
},
{
  "type": "select",
  "id": "heading_weight",
  "label": "Heading Weight",
  "options": [
    { "value": "400", "label": "Regular" },
    { "value": "500", "label": "Medium" },
    { "value": "600", "label": "Semi Bold" },
    { "value": "700", "label": "Bold" }
  ],
  "default": "500"
},
{
  "type": "select",
  "id": "heading_alignment",
  "label": "Heading Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
},
{
  "type": "header",
  "content": "Subheading Settings"
},
{
  "type": "checkbox",
  "id": "show_subheading",
  "label": "Show Subheading",
  "default": true
},
{
  "type": "textarea",
  "id": "subheading",
  "label": "Subheading Text",
  "default": "Supporting text for your section"
},
{
  "type": "select",
  "id": "subheading_size",
  "label": "Subheading Size",
  "options": [
    { "value": "lg", "label": "Large (20px)" },
    { "value": "base", "label": "Medium (18px)" },
    { "value": "sm", "label": "Small (16px)" }
  ],
  "default": "lg"
},
{
  "type": "color",
  "id": "subheading_color",
  "label": "Subheading Color",
  "default": "#6B7280"
},
{
  "type": "select",
  "id": "subheading_alignment",
  "label": "Subheading Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
},
{
  "type": "header",
  "content": "Body Text Settings"
},
{
  "type": "select",
  "id": "body_size",
  "label": "Body Text Size",
  "options": [
    { "value": "lg", "label": "Large (18px)" },
    { "value": "base", "label": "Medium (16px)" },
    { "value": "sm", "label": "Small (14px)" }
  ],
  "default": "base"
},
{
  "type": "color",
  "id": "body_color",
  "label": "Body Text Color",
  "default": "#4B5563"
},
{
  "type": "range",
  "id": "line_height",
  "label": "Line Height",
  "min": 1.2,
  "max": 2.0,
  "step": 0.1,
  "default": 1.6
}
```

**Liquid Implementation:**
```liquid
{% if section.settings.show_heading %}
  <h2
    class="section-heading size-{{ section.settings.heading_size }} text-{{ section.settings.heading_alignment }}"
    style="
      color: {{ section.settings.heading_color }};
      font-weight: {{ section.settings.heading_weight }};
    "
  >
    {{ section.settings.heading }}
  </h2>
{% endif %}

{% if section.settings.show_subheading %}
  <p
    class="section-subheading size-{{ section.settings.subheading_size }} text-{{ section.settings.subheading_alignment }}"
    style="color: {{ section.settings.subheading_color }};"
  >
    {{ section.settings.subheading }}
  </p>
{% endif %}

<div
  class="section-body size-{{ section.settings.body_size }}"
  style="
    color: {{ section.settings.body_color }};
    line-height: {{ section.settings.line_height }};
  "
>
  <!-- Body content -->
</div>
```

**CSS:**
```css
/* Heading sizes */
.section-heading.size-display { font-size: var(--fs-display); }
.section-heading.size-h1 { font-size: var(--fs-h1); }
.section-heading.size-h2 { font-size: var(--fs-h2); }
.section-heading.size-h3 { font-size: var(--fs-h3); }
.section-heading.size-h4 { font-size: var(--fs-h4); }

/* Body sizes */
.section-body.size-lg { font-size: var(--fs-body-lg); }
.section-body.size-base { font-size: var(--fs-body); }
.section-body.size-sm { font-size: var(--fs-body-sm); }

/* Subheading sizes */
.section-subheading.size-lg { font-size: 20px; }
.section-subheading.size-base { font-size: 18px; }
.section-subheading.size-sm { font-size: 16px; }
```

---

### 4. CTA/Button Controls

Use these controls for sections with call-to-action buttons:

```json
{
  "type": "header",
  "content": "Primary CTA Button"
},
{
  "type": "checkbox",
  "id": "show_primary_cta",
  "label": "Show Primary CTA",
  "default": true
},
{
  "type": "text",
  "id": "primary_cta_text",
  "label": "Button Text",
  "default": "Get Started"
},
{
  "type": "action",
  "id": "primary_cta_link",
  "label": "Button Link"
},
{
  "type": "select",
  "id": "primary_cta_style",
  "label": "Button Style",
  "options": [
    { "value": "primary", "label": "Primary (Purple)" },
    { "value": "secondary", "label": "Secondary (Teal)" },
    { "value": "outline", "label": "Outline" },
    { "value": "ghost", "label": "Ghost" }
  ],
  "default": "primary"
},
{
  "type": "select",
  "id": "primary_cta_size",
  "label": "Button Size",
  "options": [
    { "value": "sm", "label": "Small" },
    { "value": "md", "label": "Medium" },
    { "value": "lg", "label": "Large" }
  ],
  "default": "md"
},
{
  "type": "checkbox",
  "id": "primary_cta_full_width_mobile",
  "label": "Full Width on Mobile",
  "default": false
},
{
  "type": "header",
  "content": "Secondary CTA Button"
},
{
  "type": "checkbox",
  "id": "show_secondary_cta",
  "label": "Show Secondary CTA",
  "default": false
},
{
  "type": "text",
  "id": "secondary_cta_text",
  "label": "Button Text",
  "default": "Learn More"
},
{
  "type": "action",
  "id": "secondary_cta_link",
  "label": "Button Link"
},
{
  "type": "select",
  "id": "secondary_cta_style",
  "label": "Button Style",
  "options": [
    { "value": "primary", "label": "Primary (Purple)" },
    { "value": "secondary", "label": "Secondary (Teal)" },
    { "value": "outline", "label": "Outline" },
    { "value": "ghost", "label": "Ghost" }
  ],
  "default": "outline"
},
{
  "type": "select",
  "id": "cta_alignment",
  "label": "Button Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
}
```

**Liquid Implementation:**
```liquid
<div class="cta-buttons text-{{ section.settings.cta_alignment }}">
  {% if section.settings.show_primary_cta %}
    <a
      href="{{ section.settings.primary_cta_link }}"
      class="btn btn-{{ section.settings.primary_cta_style }} btn-{{ section.settings.primary_cta_size }}
        {% if section.settings.primary_cta_full_width_mobile %}w-full--mobile{% endif %}"
    >
      {{ section.settings.primary_cta_text }}
    </a>
  {% endif %}

  {% if section.settings.show_secondary_cta %}
    <a
      href="{{ section.settings.secondary_cta_link }}"
      class="btn btn-{{ section.settings.secondary_cta_style }} btn-{{ section.settings.primary_cta_size }}"
    >
      {{ section.settings.secondary_cta_text }}
    </a>
  {% endif %}
</div>
```

---

### 5. Layout/Grid Controls

Use these controls for sections with grid or multi-column layouts:

```json
{
  "type": "header",
  "content": "Layout Settings"
},
{
  "type": "range",
  "id": "columns_mobile",
  "label": "Columns (Mobile)",
  "min": 1,
  "max": 2,
  "step": 1,
  "default": 1
},
{
  "type": "range",
  "id": "columns_tablet",
  "label": "Columns (Tablet)",
  "min": 1,
  "max": 3,
  "step": 1,
  "default": 2
},
{
  "type": "range",
  "id": "columns_desktop",
  "label": "Columns (Desktop)",
  "min": 1,
  "max": 4,
  "step": 1,
  "default": 3
},
{
  "type": "range",
  "id": "gap",
  "label": "Gap Between Items",
  "min": 0,
  "max": 80,
  "step": 4,
  "unit": "px",
  "default": 24
},
{
  "type": "select",
  "id": "align_items",
  "label": "Vertical Alignment",
  "options": [
    { "value": "start", "label": "Top" },
    { "value": "center", "label": "Center" },
    { "value": "end", "label": "Bottom" },
    { "value": "stretch", "label": "Stretch" }
  ],
  "default": "start"
},
{
  "type": "select",
  "id": "justify_content",
  "label": "Horizontal Alignment",
  "options": [
    { "value": "start", "label": "Left" },
    { "value": "center", "label": "Center" },
    { "value": "end", "label": "Right" },
    { "value": "space-between", "label": "Space Between" },
    { "value": "space-around", "label": "Space Around" }
  ],
  "default": "start"
}
```

**Liquid Implementation:**
```liquid
<div
  class="grid-container align-items-{{ section.settings.align_items }} justify-content-{{ section.settings.justify_content }}"
  style="
    --columns-mobile: {{ section.settings.columns_mobile }};
    --columns-tablet: {{ section.settings.columns_tablet }};
    --columns-desktop: {{ section.settings.columns_desktop }};
    --gap: {{ section.settings.gap }}px;
  "
>
  <!-- Grid items -->
</div>
```

**CSS:**
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(var(--columns-mobile), 1fr);
  gap: var(--gap);
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(var(--columns-tablet), 1fr);
  }
}

@media (min-width: 992px) {
  .grid-container {
    grid-template-columns: repeat(var(--columns-desktop), 1fr);
  }
}
```

---

### 6. Animation Controls

Use these controls for sections that support animations:

```json
{
  "type": "header",
  "content": "Animation Settings"
},
{
  "type": "checkbox",
  "id": "enable_animations",
  "label": "Enable Animations",
  "default": true
},
{
  "type": "select",
  "id": "animation_type",
  "label": "Animation Type",
  "options": [
    { "value": "fade-up", "label": "Fade Up" },
    { "value": "fade-in", "label": "Fade In" },
    { "value": "slide-up", "label": "Slide Up" },
    { "value": "slide-left", "label": "Slide Left" },
    { "value": "slide-right", "label": "Slide Right" },
    { "value": "zoom-in", "label": "Zoom In" }
  ],
  "default": "fade-up"
},
{
  "type": "range",
  "id": "animation_duration",
  "label": "Animation Duration",
  "min": 200,
  "max": 1000,
  "step": 100,
  "unit": "ms",
  "default": 600
},
{
  "type": "range",
  "id": "animation_delay",
  "label": "Animation Delay",
  "min": 0,
  "max": 1000,
  "step": 100,
  "unit": "ms",
  "default": 0
}
```

**Liquid Implementation:**
```liquid
<div
  class="{% if section.settings.enable_animations %}animate-{{ section.settings.animation_type }}{% endif %}"
  style="
    {% if section.settings.enable_animations %}
      animation-duration: {{ section.settings.animation_duration }}ms;
      animation-delay: {{ section.settings.animation_delay }}ms;
    {% endif %}
  "
>
  <!-- Animated content -->
</div>
```

---

### 7. Image Controls

Use these controls for sections with images:

```json
{
  "type": "header",
  "content": "Image Settings"
},
{
  "type": "checkbox",
  "id": "show_image",
  "label": "Show Image",
  "default": true
},
{
  "type": "image_picker",
  "id": "image",
  "label": "Image"
},
{
  "type": "select",
  "id": "image_size",
  "label": "Image Size",
  "options": [
    { "value": "400x", "label": "Small (400px)" },
    { "value": "800x", "label": "Medium (800px)" },
    { "value": "1200x", "label": "Large (1200px)" },
    { "value": "1600x", "label": "Extra Large (1600px)" },
    { "value": "master", "label": "Original" }
  ],
  "default": "800x"
},
{
  "type": "select",
  "id": "image_fit",
  "label": "Image Fit",
  "options": [
    { "value": "cover", "label": "Cover (Fill)" },
    { "value": "contain", "label": "Contain (Fit)" },
    { "value": "auto", "label": "Auto (Original)" }
  ],
  "default": "cover"
},
{
  "type": "range",
  "id": "image_radius",
  "label": "Image Border Radius",
  "min": 0,
  "max": 50,
  "step": 2,
  "unit": "px",
  "default": 8
},
{
  "type": "select",
  "id": "image_shadow",
  "label": "Image Shadow",
  "options": [
    { "value": "none", "label": "None" },
    { "value": "sm", "label": "Small" },
    { "value": "md", "label": "Medium" },
    { "value": "lg", "label": "Large" }
  ],
  "default": "md"
},
{
  "type": "checkbox",
  "id": "image_glow",
  "label": "Enable Glow Effect",
  "default": false
}
```

**Liquid Implementation:**
```liquid
{% if section.settings.show_image and section.settings.image %}
  <div class="image-wrapper shadow-{{ section.settings.image_shadow }} {% if section.settings.image_glow %}glow-effect{% endif %}">
    <img
      src="{{ section.settings.image | image_picker_url: section.settings.image_size }}"
      srcset="{{ section.settings.image | image_picker_url: '400x' }} 400w,
              {{ section.settings.image | image_picker_url: '800x' }} 800w,
              {{ section.settings.image | image_picker_url: '1200x' }} 1200w"
      sizes="(max-width: 767px) 100vw, 800px"
      alt="{{ section.settings.heading | default: 'Section image' }}"
      class="img-fluid"
      style="
        object-fit: {{ section.settings.image_fit }};
        border-radius: {{ section.settings.image_radius }}px;
      "
      loading="lazy"
    >
  </div>
{% endif %}
```

---

## Implementation Checklist

When adding controls to a section:

- [ ] Add appropriate header dividers to group related controls
- [ ] Include info text for complex or non-obvious settings
- [ ] Set sensible defaults that work without customization
- [ ] Use consistent naming conventions
- [ ] Test responsive behavior on mobile, tablet, and desktop
- [ ] Ensure toggles properly hide/show elements
- [ ] Verify CSS variables are properly scoped
- [ ] Add utility classes where appropriate
- [ ] Document any custom CSS needed in overrides.css
- [ ] Test in Kajabi's theme editor

---

## Priority Implementation Order

1. **Hero Sections** - Most visible, highest impact
2. **CTA Sections** - Critical for conversions
3. **Content Sections** - Most frequently used
4. **Testimonial Sections** - Social proof importance
5. **Footer/Navigation** - Site-wide consistency
6. **Utility Sections** - Lower priority but still important

---

## Testing Strategy

1. **Visual Testing**: Test each control in Kajabi theme editor
2. **Responsive Testing**: Verify mobile, tablet, desktop behavior
3. **Edge Cases**: Test with no content, maximum content, special characters
4. **Performance**: Ensure no negative performance impact
5. **Compatibility**: Test across different browsers

---

## Maintenance Notes

- Update this document when new control patterns emerge
- Keep consistent with existing CSS variables in overrides.css
- Coordinate with design system updates
- Review quarterly for opportunities to standardize further
