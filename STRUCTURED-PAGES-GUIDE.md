# Structured Pages Guide for Content Teams

This guide explains how to create structured page templates that give content teams the right balance of consistency and flexibility.

## Overview

There are three approaches to page structure in Kajabi:

1. **Fully Dynamic** - Just `{% content_for_index %}` - Complete freedom
2. **Fully Static** - All sections hardcoded - No flexibility  
3. **Hybrid (Recommended)** - Mix of static and dynamic - Best of both worlds

## Hybrid Approach (Recommended)

### Template Structure

```liquid
{% comment %} Fixed header - always at top {% endcomment %}
{% section 'header_static' %}

{% comment %} Page-specific hero - editable but not movable {% endcomment %}
{% section 'hero_static' %}

{% comment %} Default content sections - can be reordered {% endcomment %}
<div class="main-content">
  {% section 'section1' %}
  {% section 'section2' %}
  {% section 'section3' %}
</div>

{% comment %} Dynamic area - add more sections here {% endcomment %}
<div class="dynamic-content">
  {% content_for_index %}
</div>

{% comment %} Fixed footer - always at bottom {% endcomment %}
{% section 'footer_static' %}
```

### Making Sections Static vs Dynamic

#### Static Sections (Cannot be moved/deleted)
Remove the `"presets"` array from the section's schema:

```liquid
{% schema %}
{
  "name": "Header",
  "elements": [
    {
      "type": "text",
      "id": "title",
      "label": "Title"
    }
  ]
  // NO PRESETS = STATIC
}
{% endschema %}
```

#### Dynamic Sections (Can be moved/deleted/added)
Include a `"presets"` array:

```liquid
{% schema %}
{
  "name": "Content Block",
  "elements": [...],
  "presets": [
    {
      "name": "Content Block",
      "category": "Content"
    }
  ]
}
{% endschema %}
```

## Creating New Structured Pages

### Step 1: Define Page Requirements

Example for a "Course Landing Page":
- **Fixed:** Header, Hero, Footer
- **Default but moveable:** Course overview, Instructor bio, Curriculum, Testimonials, Pricing
- **Optional additions:** FAQ, Bonus content, Social proof

### Step 2: Create the Template

Create `/themes/website/templates/course_landing.liquid`:

```liquid
{% comment %} Course Landing Page - Structured Template {% endcomment %}

{% comment %} Fixed top {% endcomment %}
{% section 'header_static' %}
{% section 'course_hero_static' %}

{% comment %} Core content - default order but can be rearranged {% endcomment %}
<main class="course-content">
  {% section 'course_overview' %}
  {% section 'instructor_bio' %}
  {% section 'curriculum' %}
  {% section 'testimonials' %}
  {% section 'pricing' %}
</main>

{% comment %} Optional additions {% endcomment %}
<div class="course-extras">
  {% content_for_index %}
</div>

{% section 'footer_static' %}
```

### Step 3: Create Static Versions of Key Sections

For sections that should never move, create `_static` versions:
- `header_static.liquid` (no presets)
- `hero_static.liquid` (no presets)
- `footer_static.liquid` (no presets)

## Best Practices

### 1. Naming Conventions
- Static sections: `section_name_static.liquid`
- Page templates: Use descriptive names like `course_landing.liquid`, `about_us.liquid`
- Group related sections: `course_overview.liquid`, `course_curriculum.liquid`

### 2. Documentation in Templates
Always document the page structure:

```liquid
{% comment %}
  About Us Page
  
  Structure:
  - Header (static)
  - Hero with team photo (static) 
  - Our Story (default, moveable)
  - Team Members (default, moveable)
  - Values (default, moveable)
  - [Dynamic area for additional sections]
  - Footer (static)
{% endcomment %}
```

### 3. Default Content
Provide sensible defaults in section presets:

```json
"presets": [
  {
    "name": "Team Members",
    "category": "About",
    "settings": {
      "title": "Meet Our Team",
      "subtitle": "The people behind the mission"
    },
    "blocks": [
      {
        "type": "team_member",
        "settings": {
          "name": "Team Member Name",
          "role": "Role/Title",
          "bio": "Brief bio here..."
        }
      }
    ]
  }
]
```

## Common Page Templates

### Homepage
- Static: Header, Hero, Footer
- Default: Features, Testimonials, CTA
- Dynamic area for campaigns

### About Page  
- Static: Header, Hero, Footer
- Default: Story, Team, Values, Mission
- Dynamic area for awards/press

### Product/Course Page
- Static: Header, Hero, Footer  
- Default: Overview, Benefits, Curriculum, Instructor, Testimonials, Pricing, FAQ
- Dynamic area for bonuses

### Blog Post
- Static: Header, Post content, Footer
- Default: Author bio, Related posts
- Dynamic area for CTAs

## Workflow for Content Team

1. **Choose appropriate template** when creating new page
2. **Edit content** in the pre-configured sections  
3. **Reorder** moveable sections if needed (drag & drop)
4. **Add optional sections** from the dynamic area
5. **Cannot accidentally delete** critical sections (header/footer)

## Migration Strategy

When converting existing dynamic pages to structured:

1. Identify the most common section patterns
2. Create static versions of critical sections
3. Update templates gradually
4. Train content team on new structure
5. Document any page-specific requirements

## Testing Checklist

Before deploying a structured template:
- [ ] Static sections cannot be deleted/moved
- [ ] Dynamic sections can be reordered
- [ ] Default content makes sense
- [ ] Additional sections can be added
- [ ] Mobile responsive
- [ ] Page loads quickly
- [ ] Content team can edit without breaking layout