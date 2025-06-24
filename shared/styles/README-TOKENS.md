# Design Tokens Guide for Marketing Team

## Overview
The `_tokens.css` file contains all the design variables (colors, spacing, typography) for the AN themes. This allows you to update the look and feel of the entire website without touching any other CSS files.

## Quick Start

### 1. Changing Brand Colors
Open `_tokens.css` and find the "BRAND COLORS" section:

```css
/* Primary Brand Colors */
--c-brand-600: #5E3BFF;      /* Change this to update primary purple */
--c-brand-800: #4025E0;      /* Change this for darker purple states */
--c-brand-100: #E9E6FF;      /* Change this for light backgrounds */
```

### 2. Common Color Changes

#### Update Primary Button Color
Change `--c-brand-600` to your new color:
```css
--c-brand-600: #0066CC;  /* New blue primary */
```

#### Update Accent Colors
```css
--c-accent-teal: #00B4D8;    /* New teal */
--c-accent-peach: #FF6B6B;   /* New coral/pink */
--c-accent-lemon: #FFD60A;   /* New yellow */
```

#### Update Text Colors
```css
--c-ink-900: #000000;        /* Darker headings */
--c-ink-700: #333333;        /* Darker body text */
```

### 3. Adjusting Spacing
Find the "SPACING SYSTEM" section:

```css
--space-lg: 24px;   /* Change to 32px for more breathing room */
--space-xl: 32px;   /* Change to 48px for larger sections */
```

### 4. Changing Typography Sizes
Find the "TYPOGRAPHY SCALE" section:

```css
--fs-h1: 2.5rem;        /* Change to 3rem for larger headlines */
--fs-body: 1rem;        /* Change to 1.125rem for larger body text */
```

## Important Notes

1. **Test Changes**: Always preview changes in Kajabi before publishing
2. **Keep Units**: Don't remove "px" or "rem" from values
3. **Use Hex Colors**: Use format `#RRGGBB` for colors
4. **Save Backups**: Copy original values before making changes

## After Making Changes

1. Save the `_tokens.css` file
2. Run the theme export:
   ```bash
   npm run theme:export website patch "Updated brand colors"
   ```
3. Upload the new theme ZIP file to Kajabi
4. Preview before publishing

## Common Scenarios

### Scenario 1: Complete Rebrand
```css
/* Update all primary colors */
--c-brand-600: #FF5722;      /* New orange primary */
--c-brand-800: #D84315;      /* Darker orange */
--c-brand-100: #FFF3E0;      /* Light orange background */
```

### Scenario 2: Holiday Theme
```css
/* Temporary holiday colors */
--c-brand-600: #C41E3A;      /* Holiday red */
--c-accent-teal: #165B33;    /* Holiday green */
--c-accent-lemon: #FFD700;   /* Holiday gold */
```

### Scenario 3: More Professional Look
```css
/* Corporate color scheme */
--c-brand-600: #003366;      /* Navy blue */
--c-ink-900: #000000;        /* Pure black headings */
--fs-body: 0.875rem;         /* Smaller, tighter text */
--space-lg: 16px;            /* Tighter spacing */
```

## Getting Help

- For color inspiration: https://coolors.co
- For accessibility checking: https://webaim.org/resources/contrastchecker/
- Contact development team for advanced changes

Remember: All changes in `_tokens.css` will affect the ENTIRE website!