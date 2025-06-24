# AI-Generated Page Workflow for AN Themes

This workflow enables rapid page creation using AI while maintaining Kajabi's visual editing capabilities.

## Overview

1. AI generates complete HTML page layouts → saved to `/llm-drafts/`
2. Script converts HTML to Kajabi section with image pickers
3. Marketing team can update images through Kajabi interface
4. Pages remain static and performant (no dynamic sections)

## Setup

```bash
# Install dependencies
npm install

# Create drafts folder
mkdir llm-drafts
```

## Usage

### 1. Generate HTML with AI

Ask your AI to create a complete HTML page:

```
Create a modern about page for Attachment Nerd with:
- Hero section with founder image
- Mission statement section
- Team grid with photos
- Testimonials
- CTA section
Use placeholder images from unsplash.com
Include modern CSS with the AN brand colors
```

Save the output as `llm-drafts/about.html`

### 2. Convert to Kajabi Section

```bash
# One-time conversion
npm run inject:drafts

# Watch mode (auto-converts on save)
npm run inject:watch
```

This creates:
- `shared/sections/page-about.liquid` - Section with image pickers
- `themes/website/templates/page.about.liquid` - Template file

### 3. Export and Upload

```bash
npm run theme:export website patch "Added AI-generated about page"
```

## Features

- **Smart Image Detection**: Automatically finds all images and creates pickers
- **Grouped Settings**: Images organized by section (Hero, Features, etc.)
- **SEO Support**: Extracts meta tags if present
- **Alt Text**: Preserves accessibility with editable alt text
- **Responsive**: Adds lazy loading automatically

## Example AI Prompt

```
Create a complete HTML page for a parenting coach website:

Requirements:
- Use these brand colors: #5E3BFF (primary), #18D5E4 (teal), #FF8BCB (peach)
- Modern, clean design with Inter font
- Mobile responsive
- Include these sections:
  1. Hero with background image and CTA
  2. 3-column features with icons
  3. About section with founder photo
  4. Testimonials grid
  5. Newsletter signup

Use placeholder images with descriptive alt text.
Add comments like <!--@id=hero_bg--> before images to set custom IDs.
```

## Customization

### Custom Image IDs

Add a comment before any image to set a custom ID:

```html
<!--@id=founder_photo-->
<img src="placeholder.jpg" alt="Dr. Jane Smith, Founder">
```

### Image Groups

Images are automatically grouped based on their container:

```html
<section class="hero">
  <img src="hero.jpg" alt="Hero background"> <!-- Goes to "Hero Images" -->
</section>

<div class="features">
  <img src="icon1.jpg" alt="Feature 1"> <!-- Goes to "Feature Images" -->
</div>
```

## Best Practices

1. **Descriptive Alt Text**: AI should provide meaningful alt text for all images
2. **Semantic HTML**: Use proper section/article tags for better organization
3. **Brand Consistency**: Include AN brand colors and typography in prompts
4. **Performance**: Keep CSS inline for single-file simplicity
5. **Mobile First**: Ensure AI includes responsive design

## Workflow Benefits

- **Speed**: Generate entire pages in minutes
- **Consistency**: AI follows your design system
- **Editability**: Marketing keeps image control
- **Performance**: Static sections load fast
- **Version Control**: Git tracks all changes

## Troubleshooting

### Images not showing picker
- Check image has valid src attribute
- Ensure alt text doesn't contain special characters
- Verify section schema was generated correctly

### Template not loading
- Confirm template filename matches: `page.[name].liquid`
- Check section reference: `{% section 'page-[name]' %}`
- Ensure theme was exported after changes

### Watch mode not working
- Verify `llm-drafts/` folder exists
- Check npm-watch is installed: `npm install`
- Restart watch mode after installing dependencies

## Integration with Existing Workflow

This approach complements your existing shared components:

1. **Quick Pages**: Use AI for complete page layouts
2. **Modular Sections**: Use existing shared sections for flexibility
3. **Hybrid Approach**: Combine AI pages with dynamic sections

Example hybrid template:
```liquid
{% section 'page-about' %}      <!-- AI-generated static content -->
{% section 'testimonials' %}     <!-- Existing dynamic section -->
{{ content_for_index }}          <!-- Allow additional sections -->
```

## Future Enhancements

- [ ] Support for video elements with Kajabi video pickers
- [ ] Extract and convert inline CSS to utility classes
- [ ] Generate mobile/desktop image variants
- [ ] Auto-optimize images during conversion
- [ ] Integration with Kajabi CLI for live preview