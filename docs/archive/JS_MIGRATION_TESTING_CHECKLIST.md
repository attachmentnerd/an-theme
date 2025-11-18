# JavaScript Migration Testing Checklist

## Theme Versions
- Website Theme: v10.1.0
- Landing Theme: v10.1.0  
- Product Theme: v10.1.0

## Files Changed
- Replaced 980KB scripts.js with:
  - an-core.js (12KB)
  - an-modules.js (8KB)
  - an_scripts.liquid (conditional loader)

## Testing Required

### Core Functionality
- [ ] **Mobile Menu**
  - [ ] Hamburger menu opens/closes smoothly
  - [ ] 4-slice animation works correctly
  - [ ] Menu closes on scroll (if enabled)
  - [ ] Responsive behavior at 768px breakpoint

- [ ] **Sticky Header**
  - [ ] Header becomes sticky on scroll
  - [ ] Proper padding added to main content
  - [ ] Smooth transitions

- [ ] **Dropdowns**
  - [ ] Click to open/close
  - [ ] Proper positioning (no overflow)
  - [ ] Close on outside click
  - [ ] Icon rotation animation

- [ ] **Smooth Scrolling**
  - [ ] Anchor links scroll smoothly
  - [ ] Excludes #two-step and #next-pipeline-step

### Feature Modules
- [ ] **Countdown Timers**
  - [ ] Display correct time
  - [ ] Update every second
  - [ ] End actions work (redirect, hide section)
  - [ ] No moment.js errors

- [ ] **Social Sharing**
  - [ ] Share modal opens/closes
  - [ ] All social platforms work
  - [ ] Copy to clipboard works
  - [ ] Proper modal positioning

- [ ] **Event Videos**
  - [ ] Before/during/after states work
  - [ ] Countdown displays correctly
  - [ ] Video plays at correct time
  - [ ] Wistia integration works

- [ ] **Two-Step Opt-in**
  - [ ] Modal opens on trigger click
  - [ ] Close button works
  - [ ] Background scroll lock works

- [ ] **Carousels** (if present)
  - [ ] Slick loads from CDN
  - [ ] Navigation works
  - [ ] Responsive behavior

- [ ] **AOS Animations** (if present)
  - [ ] Library loads from CDN
  - [ ] Animations trigger on scroll
  - [ ] Only loads if data-aos elements exist

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Performance Checks
- [ ] Page load time improved
- [ ] No console errors
- [ ] Network tab shows conditional loading
- [ ] Total JS size ~20KB (not 980KB)

### Kajabi-Specific
- [ ] Theme editor preview works
- [ ] Section reloads don't break functionality
- [ ] All Kajabi core features work
- [ ] No conflicts with Kajabi's encore_core.js

## Rollback Plan
If issues are found:
1. Backups saved in `/backups/legacy-js/`
2. Replace an-core.js with old scripts.js
3. Update global_scripts.liquid to use scripts.js
4. Re-export themes

## Notes
- jQuery loads only if Kajabi requires it
- All animations now use CSS transitions
- Countdown uses native Date API
- Heavy libraries load from CDN on demand