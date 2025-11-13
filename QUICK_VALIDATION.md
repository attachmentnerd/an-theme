# Quick Validation Guide

## Run Validation

```bash
# Quick check (shared files only - recommended)
npm run validate:quick

# Full check (all themes)
npm run validate
```

## Install Pre-Commit Hook (Recommended)

```bash
bash scripts/install-hooks.sh
```

This automatically validates before every commit!

## Common Errors Fixed

### ✅ Incomplete Alt Attributes
```liquid
❌ alt="{{ var | default: "
✅ alt="{{ var | default: 'Description' }}"
```

### ✅ Using {% render %} in Kajabi
```liquid
❌ {% render 'snippet' %}
✅ {% include 'snippet' %}
```

### ✅ Ternary Operators
```liquid
❌ {{ condition ? 'yes' : 'no' }}
✅ {% if condition %}yes{% else %}no{% endif %}
```

## Exit Codes

- ✅ `0` = All checks passed
- ❌ `1` = Errors found (fix before committing)

See `scripts/VALIDATION.md` for complete documentation.
