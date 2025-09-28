# Website and Landing Page Version Synchronization Guide

## Overview

The AN Theme system now automatically keeps website and landing page versions synchronized. This ensures consistency across your theme portfolio and simplifies version management.

## How It Works

### Automatic Synchronization

When you export either the website or landing theme, both themes automatically get the same version number:

- **Website theme export** → Both website and landing versions sync to the new version
- **Landing theme export** → Both website and landing versions sync to the new version
- **Product theme export** → Only product version changes (no sync needed)

### Manual Synchronization

You can manually sync versions at any time using the `sync` command:

```bash
npm run theme:sync
# or
node scripts/theme-manager.js sync
```

This command will:

1. Compare current website and landing versions
2. Use the higher version number as the sync target
3. Update both themes to the same version
4. Display the changes made

## Commands

### Check Current Versions

```bash
npm run theme:version
# or
node scripts/theme-manager.js version
```

### Export Theme (Auto-syncs website/landing)

```bash
npm run theme:export <type> [patch|minor|major] [message]
# Examples:
npm run theme:export website patch "Bug fix"
npm run theme:export landing minor "New features"
```

### Manual Sync

```bash
npm run theme:sync
# or
node scripts/theme-manager.js sync
```

### Set Specific Version (Auto-syncs website/landing)

```bash
npm run theme:version <type> <version>
# Examples:
npm run theme:version website 24.0.0
npm run theme:version landing 24.0.0
```

## Examples

### Scenario 1: Website Update

```bash
npm run theme:export website patch "Fixed navigation bug"
```

**Result:** Both website and landing versions become `23.5.6`

### Scenario 2: Landing Update

```bash
npm run theme:export landing minor "Added new hero section"
```

**Result:** Both website and landing versions become `23.6.0`

### Scenario 3: Manual Sync

```bash
npm run theme:sync
```

**Result:** If website is `23.5.6` and landing is `23.5.7`, both become `23.5.7`

## Benefits

1. **Consistency**: Website and landing themes always have matching version numbers
2. **Simplified Management**: No need to manually track which theme has which version
3. **Professional Appearance**: Clients see consistent versioning across themes
4. **Automated Workflow**: Sync happens automatically during exports
5. **Manual Control**: Can manually sync at any time if needed

## Technical Details

- Synchronization only affects website and landing themes
- Product theme versions remain independent
- Version sync happens automatically during export operations
- Manual sync uses the higher version number as the target
- All version changes are logged and saved to `versions.json`

## Troubleshooting

### Versions Out of Sync

If you notice versions are out of sync:

1. Run `npm run theme:sync` to manually sync them
2. Check the console output for any error messages
3. Verify the `versions.json` file has been updated

### Manual Version Override

If you need to set a specific version:

1. Use `npm run theme:version website <version>` or `npm run theme:version landing <version>`
2. The other theme will automatically sync to the same version
3. Verify with `npm run theme:version`

## Best Practices

1. **Always use the export commands** rather than manually editing `versions.json`
2. **Check versions before major releases** to ensure they're in sync
3. **Use descriptive commit messages** when exporting themes
4. **Test the sync functionality** after any theme manager updates
5. **Keep product theme versions independent** unless specifically needed

## Version History

- **v23.5.5**: Initial implementation of automatic synchronization
- Both website and landing themes now automatically sync versions
- Added manual sync command for immediate synchronization
- Enhanced version management workflow

