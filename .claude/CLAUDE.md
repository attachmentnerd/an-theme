Kajabi Theme Development Guide
A comprehensive guide for building, organizing, and uploading Kajabi themes. Kajabi uses a Shopify-derived Liquid engine with its own objects, filters, and restrictions.

## 🚨 CRITICAL: ALWAYS use {% include %} - NEVER {% render %}

**Kajabi does NOT support Shopify's {% render %} tag!**

```liquid
❌ WRONG - Will break in Kajabi:
{% render 'responsive-image', image: hero_image %}

✅ CORRECT - Always use include:
{% include 'responsive-image', image: hero_image %}
```

**Verify before committing:**
```bash
# This should return 0 files
find shared/sections shared/snippets -name "*.liquid" -exec grep -l "{% render" {} \;
```

🚀 Pre-Upload Checklist
Before uploading your theme, ensure you've completed these critical steps:
✅ VERIFY NO {% render %} tags exist (use {% include %} instead).
Change all "type": "url" to "type": "action" (in all schema files).
Change all "type": "richtext" to "type": "rich_text".
Add settings_validatable: true under the theme_info object in config/settings_schema.json.
Use "elements" to define fields in schemas. The "settings" key is only used inside a preset to assign default values.
Remove the theme.json file and the locales/ directory.
Include all required templates (see "Required Files" section below).
Remove all Shopify-specific code (e.g., collections, cart, order, {% form 'product' %}).
Include config/settings_data.json for default values.
Include assets/styles.scss.liquid as the main stylesheet.
Run a validation script (best practice) to catch common errors.
📁 Theme Structure
Generated code
theme/
├── assets/ # Images, JS, CSS (styles.scss.liquid is mandatory)
├── config/ # settings_schema.json & settings_data.json
├── layouts/ # Layout templates (e.g., theme.liquid)
├── sections/ # Reusable sections (HTML/Liquid + schema)
├── snippets/ # Partial includes (header.liquid, footer.liquid, etc.)
└── templates/ # Page templates (must include all required templates)
Use code with caution.
Required Templates
For Site Themes (all 11 are required):
templates/404.liquid
templates/blog.liquid
templates/blog_post.liquid
templates/blog_search.liquid
templates/forgot_password.liquid
templates/forgot_password_edit.liquid
templates/index.liquid
templates/library.liquid
templates/login.liquid
templates/page.liquid
templates/thank_you.liquid
For Landing Page Themes (only 1 is required):
templates/index.liquid
⚠️ Critical Shopify → Kajabi Differences
Forbidden Shopify Features
Objects & Filters NOT Supported: collections, cart, checkout, order, variant, line_item, customer. Filters like money_with_currency, payment_type_img_url.
Tags to Replace:
{% render %} → Use {% include %}.
{% section %} → Kajabi uses {% section 'section-name' %} but does not support Shopify's dynamic section tags ({% sections ... %}).
{% form 'product' %} → Use standard HTML <form> tags.
Files/Directories to Remove: theme.json, locales/ directory.
Attributes to Remove: block.shopify_attributes, #shopify-section-{{ section.id }}.
Schema Field Type Changes
"type": "url" → "type": "action"
"type": "richtext" → "type": "rich_text"
🔧 Kajabi-Specific Features
Core Objects
Generated liquid

<!-- Site-wide Information -->
<h1>{{ site.name }}</h1>
<img src="{{ site.logo_image }}" alt="Logo">

<!-- Member/User Access -->

{% if member %}
Hello, {{ member.first_name }}!
{% endif %}

<!-- Products & Offers -->

{% for product in products %}
{{ product.title }} — {{ product.price | money }}
{% endfor %}

{% for offer in offers %}
{{ offer.name }} — {{ offer.price | money }}
{% endfor %}
Use code with caution.
Liquid
URL Routes
Generated liquid
{{ routes.root_url }}
{{ routes.products_url }}
{{ routes.account_url }}
{{ routes.login_url }}
{{ routes.logout_url }}
{{ routes.library_url }} {# Alias for account_courses_url #}
Use code with caution.
Liquid
💻 Development Guidelines

1. Settings Schema Structure
   The top-level settings_schema.json must start with theme_info. Use "elements" to define the fields for a settings group.
   Generated json
   [
   {
   "name": "theme_info",
   "settings_validatable": true,
   "theme_name": "My Awesome Theme",
   "theme_version": "1.0.0",
   "theme_author": "Developer Name"
   },
   {
   "name": "Colors & Fonts",
   "elements": [
   {
   "type": "color",
   "id": "primary_color",
   "label": "Primary Color",
   "default": "#000000"
   }
   ]
   }
   ]
   Use code with caution.
   Json
2. CSS Variables & Theme Settings
   Reference theme settings in your stylesheet. Note: a .scss.liquid file should only contain CSS/SCSS code, not HTML tags.
   Generated css
   /_ In assets/styles.scss.liquid _/
   :root {
   --primary-color: {{ settings.primary_color }};
   --body-font: {{ settings.body_font }};
   }
   Use code with caution.
   Css
3. Authentication & Member Access
Always check for the member object to determine login status.
Generated liquid
{% if member %}
  <p>Welcome back, {{ member.first_name }}!</p>
  <a href="{{ routes.library_url }}">My Library</a>
{% else %}
  <a href="{{ routes.login_url }}">Login</a>
{% endif %}
Use code with caution.
Liquid
4. Displaying Products
Loop through the products object. Note: courses is a legacy alias for products and still works, but products is the current standard.
Generated liquid
<div class="product-list">
  {% for product in products %}
    <div class="product-card">
      {% if product.poster_image_url %}
        <img src="{{ product.poster_image_url | image_url: '400x225' }}" alt="{{ product.title }}">
      {% endif %}
      <h3>{{ product.title }}</h3>
      <a href="{{ product.url }}" class="btn">View Product</a>
    </div>
  {% endfor %}
</div>
Use code with caution.
Liquid
5. Forms
Use standard HTML <form> tags with Kajabi routes in the action attribute.
Generated liquid
<form action="{{ routes.login_url }}" method="post">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Login</button>
</form>
Use code with caution.
Liquid
6. Pagination
   Use the paginate tag for collections like blog.posts.
   Generated liquid
   {% paginate blog.posts by 5 %}
   {% for post in blog.posts %}
   <!-- Post content here -->
   {% endfor %}

{% if paginate.pages > 1 %}
<nav class="pagination">
<!-- Pagination links here -->
</nav>
{% endif %}
{% endpaginate %}
Use code with caution.
Liquid
📦 Section Development
Section File Structure
Generated liquid

<!-- sections/hero-banner.liquid -->
<div class="hero-banner">
  <h1>{{ section.settings.title }}</h1>
  <img src="{{ section.settings.background_image | image_picker_url }}" alt="">
</div>

{% schema %}
{
"name": "Hero Banner",
"elements": [
{
"type": "text",
"id": "title",
"label": "Heading"
},
{
"type": "image_picker",
"id": "background_image",
"label": "Background Image"
}
],
"presets": [
{
"name": "Hero Banner",
"category": "Hero",
"settings": {
"title": "Welcome to Our Site"
}
}
]
}
{% endschema %}
Use code with caution.
Liquid
Key Schema Rules:
elements: Use this array to define the input fields for the section and for its blocks.
blocks: Defines the repeatable block types a user can add to the section.
presets: Defines the default configuration for the section when a user adds it from the theme editor. It uses the settings key to assign default values.
🐛 Common Issues & Solutions
Issue Solution
Upload Error ("Error processing...")
Using {% render %} Replace with {% include %}.
Schema has "type": "url" Change to "type": "action".
Schema has "type": "richtext" Change to "type": "rich_text".
Missing settings_validatable: true Add it to the theme_info object in settings_schema.json.
Using "settings" outside of a preset Use "elements" to define fields.
theme.json or locales/ present Remove these files/directories.
Missing required files Add settings_data.json and styles.scss.liquid.
Section Issues
Section not appearing in "Add Section" Add a "presets" array to the section's schema. This is required to make it available in the editor.
Section settings not saving or appearing Check your schema for syntax errors. Ensure you are using "elements" to define fields, not "settings".
Broken {% include %} in a section Verify the snippet name is correct and the file exists in the snippets/ directory.
Member/Access Issues
Checking for a logged-in user Use {% if member %}. The customer object does not exist in Kajabi.
Checking product ownership Loop through products and check if product.is_enrolled. You can also check if member.products contains product.
Login/Logout links not working Use the correct routes: {{ routes.login_url }} and {{ routes.logout_url }}.
📝 Best Practices
Modular SCSS: Organize your styles into subdirectories within assets/ (e.g., assets/styles/components/, assets/styles/sections/) and use @import in assets/styles.scss.liquid to combine them. This keeps your main stylesheet clean.
Responsive Images: Use the image_url filter with size parameters (e.g., {{ product.poster_image_url | image_url: '800x' }}) to serve appropriately sized images and improve performance.
Schema Organization: Use "type": "header" and "type": "divider" within your schema's elements array to create visual groupings and instructions for the end-user in the theme editor.
CSS Variables for Theming: Expose customizable styles (colors, fonts, spacing) as CSS variables powered by theme settings. This provides maximum flexibility for users.
Nil-Proofing: Always check if an object or property exists before trying to access it, especially for optional settings like images or text.
Generated liquid
{% if section.settings.optional_image %}
<img src="{{ section.settings.optional_image | image_picker_url }}" alt="">
{% endif %}
Use code with caution.
Liquid
Validation: Create or use a validation script to run basic checks on your theme before zipping and uploading. This can save significant time by catching simple errors like missing files or incorrect syntax.
🔍 Quick Reference
Must Replace
{% render %} → {% include %}
"type": "url" → "type": "action"
"type": "richtext" → "type": "rich_text"
customer object → member object
"settings" key (for defining fields) → "elements" key
Must Remove
theme.json file
locales/ directory
All Shopify-specific objects and filters (e.g., collections, cart, order)
Shopify-specific {% form %} tags
block.shopify_attributes and other #shopify-section attributes
Must Include
All 11 required templates for a Site Theme (or just index.liquid for a Landing Page Theme).
config/settings_data.json (can be a minimal {} but must exist).
assets/styles.scss.liquid (even if empty, it's the required primary stylesheet).
settings_validatable: true inside the theme_info object in config/settings_schema.json.
