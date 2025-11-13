# Liquid Syntax Validation

A comprehensive validation tool to catch common Liquid syntax errors before they break in Kajabi production.

## Usage

### Quick Validation (Shared Files Only)
```bash
npm run validate:quick
```

### Full Validation (All Themes)
```bash
npm run validate
```

### Manual Validation
```bash
node scripts/validate-liquid.cjs
```

## What It Checks

### Errors (Will Fail CI/CD)

1. **Incomplete Liquid Variable Tags**
   ```liquid
   ❌ {{ section.settings.title
   ✅ {{ section.settings.title }}
   ```

2. **Incomplete Alt Attributes with Default Filter**
   ```liquid
   ❌ alt="{{ section.settings.image_alt | default: "
   ✅ alt="{{ section.settings.image_alt | default: 'Image' }}"
   ```

3. **Incomplete Src/Href Attributes**
   ```liquid
   ❌ src="{{ image | default: "
   ✅ src="{{ image | default: 'placeholder.png' }}"
   ```

4. **Use of {% render %} Instead of {% include %}**
   ```liquid
   ❌ {% render 'snippet-name' %}
   ✅ {% include 'snippet-name' %}
   ```
   **Critical:** Kajabi does NOT support Shopify's `{% render %}` tag!

5. **Ternary Operators**
   ```liquid
   ❌ {{ condition ? 'yes' : 'no' }}
   ✅ {% if condition %}yes{% else %}no{% endif %}
   ```
   **Note:** Kajabi does not support ternary operators in Liquid.

### Warnings (Won't Fail Build)

1. **Empty Alt Attributes**
   ```liquid
   ⚠️ alt=""
   ℹ️ Consider adding descriptive text for accessibility
   ```
   Empty alt is acceptable for decorative images, but should be intentional.

2. **Shopify linklists Object**
   ```liquid
   ⚠️ linklists[menu_handle]
   ℹ️ Kajabi uses current_site.link_lists instead
   ```

3. **Potential Unclosed Tags**
   ```liquid
   ⚠️ Nested {% if %} without clear {% endif %}
   ```

## Common Errors Fixed

### The Pattern That Was Causing Issues

The most common error we fixed was incomplete `default` filters in image attributes:

```liquid
<!-- WRONG - Missing closing }} and quote -->
<img src="{{ image | image_picker_url: '400x' }}"
     alt="{{ section.settings.alt | default: "
     class="img-fluid">

<!-- CORRECT -->
<img src="{{ image | image_picker_url: '400x' }}"
     alt="{{ section.settings.alt | default: 'Description' }}"
     class="img-fluid">
```

### How This Happened

When copying/pasting responsive image templates with multiline srcset attributes, sometimes the alt attribute's default filter got corrupted:

```liquid
<!-- Template had this: -->
srcset="..."
alt="{{ var | default: 'text' }}"

<!-- But ended up as: -->
srcset="...\n..."  <!-- Extra newline escape -->
alt="{{ var | default: "   <!-- Missing closing -->
```

## Integration with CI/CD

### Pre-Commit Hook (Recommended)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "Running Liquid validation..."
npm run validate:quick

if [ $? -ne 0 ]; then
  echo "❌ Liquid validation failed. Please fix errors before committing."
  exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### GitHub Actions

Add to `.github/workflows/validate.yml`:

```yaml
name: Validate Liquid Syntax

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run validate
```

## Extending Validation Rules

Edit `scripts/validate-liquid.cjs` and add to the `rules` array:

```javascript
{
  name: 'Your Rule Name',
  pattern: /your-regex-pattern/,
  severity: 'error', // or 'warning'
  message: 'Description of what went wrong'
}
```

### Advanced: Excluding Patterns

Some patterns might be valid in certain contexts. Add an `exclude` pattern:

```javascript
{
  name: 'Incomplete Liquid variable tags',
  pattern: /\{\{[^}]*$/m,
  exclude: /\{\{[^}]+\|[^}]+:[\s\S]*$/m, // Allow multiline filters
  severity: 'error',
  message: 'Liquid variable tag {{ not properly closed with }}'
}
```

## Testing the Validator

After modifying validation rules, test with:

```bash
# Should pass with 0 errors
npm run validate

# Create a test file with intentional errors
echo 'alt="{{ var | default: "' > test.liquid
npm run validate  # Should catch the error
rm test.liquid
```

## Performance

- Scans ~1000 Liquid files in ~2-3 seconds
- Only scans `.liquid` files
- Skips `node_modules`, `.git`, `exports`, and `llm-drafts`

## Exit Codes

- `0`: All checks passed (warnings are OK)
- `1`: Errors found (will fail CI/CD)

## Quick Reference

| Command | Description | Exit on Errors? |
|---------|-------------|-----------------|
| `npm run validate` | Full validation | Yes |
| `npm run validate:quick` | Shared files only | Yes |
| `node scripts/validate-liquid.cjs` | Manual run | Yes |

## Troubleshooting

### False Positives

If the validator flags valid Liquid code:

1. Check if the pattern needs refinement
2. Add an `exclude` pattern for that specific case
3. Document why it's valid in code comments

### False Negatives

If the validator misses actual errors:

1. Add a new rule to catch that pattern
2. Test the new rule with both valid and invalid examples
3. Update this documentation

## History

- **2025-01-13**: Created to catch incomplete `alt` attribute defaults
- Fixed 6 errors across 3 files (content_advanced_bio, content_quote_block, book_details)
- Prevents similar issues from reaching production

## Support

For questions or issues with the validator:
- Check CLAUDE.md for Liquid syntax guidelines
- Review this documentation
- Test your changes with `npm run validate` before committing
