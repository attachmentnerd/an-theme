# Shared Sections Implementation Plan

## Overview
This document outlines which sections should be shared across themes and which should remain theme-specific.

## Sections to Share (Phase 1)

### 1. Universal Sections (Identical across themes)
- **carousel.liquid** - Image/content carousel
- **exit_pop.liquid** - Exit intent popup
- **two_step.liquid** - Two-step opt-in

### 2. Nearly Identical Sections (Minor tweaks needed)
- **book.liquid** - Book testimonials section
- **book_buy.liquid** - Book purchase links
- **footer.liquid** - Site footer (website/landing only)
- **about_hero.liquid** - About page hero

## Sections to Keep Theme-Specific

### Website Theme Only
- blog_listings.liquid
- blog_post_body.liquid
- blog_search_results.liquid
- newsletter_*.liquid (all newsletter sections)
- member_directory.liquid
- page_content.liquid

### Landing Theme Only
- Landing-specific hero variations
- Conversion-focused CTAs
- Simplified navigation

### Product Theme Only
- Course-specific layouts
- Video players
- Learning management features

## Implementation Steps

### Step 1: Test Sharing Strategy
1. Create `/shared/sections/` directory
2. Move `carousel.liquid` as test case
3. Verify it works in all themes
4. Document any issues

### Step 2: Gradual Migration
1. Move truly identical sections first
2. Add theme detection where needed
3. Use settings for customization
4. Test thoroughly in each theme

### Step 3: Section Flexibility
Make sections adaptable through:
- Kajabi settings/elements
- Theme detection in Liquid
- CSS classes based on theme context

## Benefits
- Reduce code duplication
- Easier maintenance
- Consistent functionality
- Single source of truth for common sections

## Risks to Manage
- Theme-specific features breaking
- Increased complexity in shared sections
- Testing overhead increases
- Kajabi platform limitations

## Decision Criteria
Share a section only if:
1. It's 90%+ identical across themes
2. Differences can be handled via settings
3. It doesn't compromise theme-specific needs
4. Testing confirms no regression

## Recommended Approach
Start with the safest candidates (carousel, exit_pop) and gradually expand based on success and actual maintenance needs.