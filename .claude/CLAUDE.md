Kajabi Theme Development Guide
A comprehensive guide for building, organizing, and uploading Kajabi themes. Kajabi uses a Shopify-derived Liquid engine with its own objects, filters, and restrictions.

🚀 Pre-Upload Checklist
Before uploading your theme, ensure you've completed these critical steps:

Replace all {% render %} with {% include %}
Change all "type": "url" → "type": "action" (in all schema files)
Change all "type": "richtext" → "type": "rich_text"
Add settings_validatable: true under theme_info in settings_schema.json
Use "elements" (not "settings") for schema fields; only blocks inside presets use "settings"
Remove any theme.json file and the locales/ directory
Include all required templates (see Required Files section)
Remove all Shopify-specific code (collections, cart, order, etc.)
Include config/settings_data.json for default values
Include assets/styles.scss.liquid as the main stylesheet
Run validation using a script like ./validate-kajabi-theme.sh
📁 Theme Structure
theme/
├── assets/ # Images, JS, CSS (styles.scss.liquid is mandatory)
├── config/ # settings_schema.json & settings_data.json
├── layouts/ # Layout templates (e.g., theme.liquid, minimal.liquid)
├── sections/ # Reusable sections (HTML/Liquid + schema)
├── snippets/ # Partial includes (header, footer, etc.)
└── templates/ # Page templates (must include all required)
Required Templates
For Site Themes (all 11 required):

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
For Landing Page Themes (only 1 required):

templates/index.liquid
⚠️ Critical Shopify → Kajabi Differences
Forbidden Shopify Features
Objects & Filters NOT Supported
collections, cart.items, checkout, order, variant, line_item
Filters like money_with_currency, payment_type_img_url
Tags to Replace
{% render %} → Use {% include %}
{% section %} (Shopify style) → Use Kajabi's section syntax
{% form 'product' %} → Use HTML forms
{% layout 'theme' %} → Not supported
Files/Directories to Remove
theme.json
locales/ directory
Shopify-specific attributes (block.shopify_attributes, #shopify-section-)
Schema Field Type Changes
"type": "url" → "type": "action"
"type": "richtext" → "type": "rich_text"
🔧 Kajabi-Specific Features
Core Objects
liquid

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
URL Routes
liquid
{{ routes.root_url }}
{{ routes.products_url }}
{{ routes.account_url }}
{{ routes.account_courses_url }}
{{ routes.community_url }}
{{ routes.account_login_url }}
{{ routes.account_logout_url }}
💻 Development Guidelines

1. Settings Schema Structure
   Top-level settings_schema.json must start with theme_info:

json
[
{
"name": "theme_info",
"settings_validatable": true,
"theme_name": "My Theme",
"theme_version": "1.0.0",
"theme_author": "Developer Name",
"theme_documentation_url": "https://docs.example.com",
"theme_support_url": "https://support.example.com"
},
{
"name": "Colors",
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
Key Points:

Use "elements" array for input fields (not "settings")
Only blocks inside sections use "settings" for their fields 2. CSS Variables & Theme Settings
Reference theme settings in your SCSS:

liquid

<!-- In assets/styles.scss.liquid -->
<style>
  :root {
    --primary-color: {{ settings.primary_color }};
    --font-family: {{ settings.font_family }};
  }
</style>

3.  Authentication & Member Access
liquid
{% if member %}
  <p>Welcome back, {{ member.first_name }}!</p>
  {% if member.has_active_courses %}
    <a href="{{ routes.account_courses_url }}">My Courses</a>
  {% endif %}
{% else %}
  <a href="{{ routes.account_login_url }}">Login</a>
{% endif %}
4.  Displaying Courses
    liquid
    <div class="course-list">
      {% for course in courses %}
        <div class="course-card">
          {% if course.featured_image %}
            <img src="{{ course.featured_image | image_url: '400x225' }}" alt="{{ course.title }}">
          {% endif %}
          <h3>{{ course.title }}</h3>
          <p>{{ course.description | truncate: 150 }}</p>

          {% if course.enrollment_status == 'enrolled' %}
            <p>Progress: {{ course.user_progress }}%</p>
            <a href="{{ course.url }}" class="btn">Continue</a>
          {% else %}
            <p>{{ course.price | money }}</p>
            <a href="{{ course.url }}" class="btn">Learn More</a>
          {% endif %}
        </div>

    {% endfor %}
    </div>

5.  Forms
    Use HTML forms (not Shopify's {% form %} tags):

liquid

<form action="{{ routes.account_login_url }}" method="post">
  <input type="email" name="email" required>
  <input type="password" name="password" required>
  <button type="submit">Login</button>
</form>
6. Pagination
liquid
{% if paginate.pages > 1 %}
  <nav class="pagination">
    {% if paginate.previous %}
      <a href="{{ paginate.previous.url }}">Previous</a>
    {% endif %}

    {% for part in paginate.parts %}
      {% if part.is_link %}
        <a href="{{ part.url }}">{{ part.title }}</a>
      {% else %}
        <span class="current">{{ part.title }}</span>
      {% endif %}
    {% endfor %}

    {% if paginate.next %}
      <a href="{{ paginate.next.url }}">Next</a>
    {% endif %}

  </nav>
{% endif %}
📦 Section Development
Section File Structure
liquid
<!-- sections/hero_banner.liquid -->
<div class="hero-banner-section">
  <div class="content">
    <h1>{{ section.settings.title }}</h1>

    {% for block in section.blocks %}
      {% case block.type %}
        {% when 'button' %}
          <a href="{{ block.settings.button_link }}" class="btn">
            {{ block.settings.button_text }}
          </a>
        {% when 'image' %}
          <img src="{{ block.settings.image | image_picker_url: 'placeholder.png' }}" alt="Section Image">
      {% endcase %}
    {% endfor %}

  </div>
</div>

{% schema %}
{
"name": "Hero Banner",
"elements": [
{
"type": "text",
"id": "title",
"label": "Heading",
"default": "Welcome to Our Site"
},
{
"type": "image_picker",
"id": "background_image",
"label": "Background Image"
}
],
"blocks": [
{
"type": "button",
"name": "Button",
"elements": [
{
"type": "text",
"id": "button_text",
"label": "Button Text",
"default": "Click Here"
},
{
"type": "action",
"id": "button_link",
"label": "Button Link"
}
]
}
],
"presets": [
{
"name": "Hero Banner",
"category": "Hero",
"settings": {
"title": "Welcome to Our Site"
},
"blocks": [
{
"type": "button",
"settings": {
"button_text": "Get Started"
}
}
]
}
]
}
{% endschema %}
Including Sections
In layouts or templates:

liquid
{% section 'header' %}
🐛 Common Issues & Solutions
Upload Errors ("Error processing your theme")
Issue Solution
Using {% render %} Replace with {% include %}
Schema has "type": "url" Change to "type": "action"
Schema has "type": "richtext" Change to "type": "rich_text"
Missing settings_validatable: true Add to theme_info object
Using "settings" in top-level schema Use "elements" instead
theme.json or locales/ present Remove these files/directories
Missing required files Add settings_data.json and styles.scss.liquid
Shopify-specific code Remove all references to collection, cart, order, etc.
Section Issues
Issue Solution
Sections not appearing Add "presets" to section schema
Settings not saving Use "elements" not "settings" for top-level fields
Broken includes Ensure using {% include %} not {% render %}
Member/Access Issues
Issue Solution
Using customer object Use member instead
Checking wrong properties Use member.has_active_courses, member.purchases
📝 Best Practices
Modular SCSS: Store section styles in /styles/sections/\_section_name.scss
Responsive Images: Use image_url filter with multiple sizes
Member Checks: Always use member not customer
Forms: Use HTML forms with Kajabi route actions
Validation: Run theme validation before every upload
CSS Variables: Expose customizable values through theme settings
Schema Organization: Group related settings with headers/dividers
🔍 Quick Reference
Must Replace
{% render %} → {% include %}
"type": "url" → "type": "action"
"type": "richtext" → "type": "rich_text"
customer → member
"settings" → "elements" (in top-level schema)
Must Remove
theme.json
locales/ directory
All Shopify-specific objects and filters
{% form %} tags
block.shopify_attributes
Must Include
All 11 required templates (or just index.liquid for landing pages)
config/settings_data.json
assets/styles.scss.liquid
settings_validatable: true in theme_info
