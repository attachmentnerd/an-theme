# AN Kajabi Themes

A collection of professional Kajabi themes with automated build and export system.

## 🎨 Available Themes

1. **AN Website Theme** - Full website theme with blog, courses, and member features
2. **AN Landing Theme** - High-converting landing page theme
3. **AN Product Theme** - Product and course sales theme

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Test all themes
npm test

# Export themes
npm run theme:export website patch "Your change description"
npm run theme:export landing minor "New features added"
npm run theme:export product major "Major update"
```

## 📁 Project Structure

```
themes/
├── website/     # Full website theme
├── landing/     # Landing page theme
└── product/     # Product/course theme

shared/          # Shared components
├── styles/      # Shared SCSS
├── snippets/    # Shared Liquid snippets
└── scripts/     # Shared JavaScript

exports/         # Exported theme ZIPs
└── releases/
    └── v1.0.1/
        └── ThemeName_1.0.1.zip
```

## 🛠️ Development

### Build a Theme
```bash
npm run theme:build website
```

### Version Management
```bash
# Check versions
npm run theme:version

# Set version manually
npm run theme:version landing 2.0.0
```

### Local Preview
```bash
npm start
```

## 📦 Export Process

The export system automatically:
- ✅ Creates proper ZIP structure with subdirectory
- ✅ Validates all required files
- ✅ Updates version numbers
- ✅ Removes macOS extended attributes
- ✅ Generates version logs

## 🔧 Theme Requirements

Each theme type has specific requirements:

### Website Themes
- Must have `layouts/theme.liquid`
- Requires 11 template files
- Full site functionality

### Landing Pages
- No layouts directory
- Single `templates/index.liquid`
- Optimized for conversions

### Product Themes
- Must have `layouts/theme.liquid`
- Requires `sales_page.liquid` and `thank_you.liquid`
- Course/product focused

## 📝 Important Notes

1. **ZIP Structure**: Files must be in a subdirectory, not at root level
2. **Settings**: All themes must have `settings_validatable: true`
3. **Liquid Syntax**: Use `{% include %}` not `{% render %}`
4. **No Shopify Code**: Remove any Shopify-specific objects

## 🤝 Contributing

1. Make changes in `themes/{type}/` directories
2. Test with `npm test`
3. Export with proper version bump
4. Upload to Kajabi to verify

## 📄 License

Private repository - All rights reserved

---

Built with ❤️ for Kajabi theme developers