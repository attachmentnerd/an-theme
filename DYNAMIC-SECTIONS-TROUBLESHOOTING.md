# Dynamic Sections Troubleshooting Guide

## Issue: Cannot Add Dynamic Sections to Securely Attached Page

### ✅ Section Configuration Status
All sections are properly configured:
- All SA sections have `"presets"` with `"category"` fields
- Template includes `{{ content_for_index }}`
- Sections are being exported correctly

### 🔍 Troubleshooting Steps

#### 1. Verify Page Type in Kajabi
Dynamic sections only work on certain page types:
- ✅ Website pages
- ✅ Landing pages
- ❌ Product pages (different system)
- ❌ Email pages
- ❌ System pages (login, etc.)

**Check**: Is your Securely Attached page created as a "Website" page?

#### 2. Check Theme Assignment
- Go to your page settings in Kajabi
- Verify it's using the "Website" theme, not "Landing" or "Product"
- Dynamic sections are theme-specific

#### 3. Clear Kajabi Cache
1. Log out of Kajabi
2. Clear browser cache
3. Log back in
4. Try editing the page again

#### 4. Test with a New Page
1. Create a new Website page
2. Select the Website theme
3. Try adding dynamic sections
4. If it works, the issue is page-specific

#### 5. Check for JavaScript Errors
1. Open browser developer console (F12)
2. Look for any red errors when loading the editor
3. Kajabi's editor relies on JavaScript

### 🛠️ Solutions

#### Solution 1: Re-create the Page
If the page was created before theme updates:
1. Create a new page
2. Select "Website" as page type
3. Choose your Website theme
4. Apply the `securely_attached` template

#### Solution 2: Manual Section Addition
If dynamic sections still don't work, you can manually add sections to the template:

```liquid
<!-- securely_attached.liquid -->
<main>
  <!-- Existing sections... -->
  
  <!-- Add any specific section you need -->
  {% section 'pwyc_pricing_slider' %}
  {% section 'book_testimonials_modern' %}
  
  <!-- Keep this for future dynamic sections -->
  {{ content_for_index }}
</main>
```

#### Solution 3: Contact Kajabi Support
If none of the above work, it might be a Kajabi platform issue:
- Some accounts have restrictions
- Beta features might affect editor
- Theme compatibility issues

### 📋 Quick Checklist
- [ ] Page is "Website" type, not "Product" or other
- [ ] Using Website theme (not Landing/Product)
- [ ] Cleared cache and reloaded
- [ ] No JavaScript errors in console
- [ ] Theme was exported after adding sections
- [ ] `{{ content_for_index }}` is in template

### 🎯 Most Likely Cause
Based on the code review, the most likely issue is:
1. **Page type mismatch** - The page might have been created as a different type
2. **Theme assignment** - The page might be using the wrong theme variant

All your sections are properly configured for dynamic use!