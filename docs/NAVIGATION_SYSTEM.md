# AN Theme Navigation System

## 1. Overview

The AN theme features a comprehensive, modular navigation system designed for flexibility and performance. It consists of three main pillars:

1.  **Modular Architecture**: Separates header, navigation bar, and mobile menu into distinct, reusable components.
2.  **Adaptable Navigation**: Allows full customization of navigation items (links, buttons, logos) via the Kajabi Theme Editor using blocks.
3.  **Visibility Control**: Provides granular control over where navigation appears, from global settings to page-level overrides.

---

## 2. Modular Architecture

The system separates the header into three distinct sections, allowing you to mix and match based on page requirements.

### Components

#### 1. Header (`header.liquid`)
A minimal header containing only the logo and basic layout settings.
*   **Features**: Logo (image/text), sticky support, overlay positioning.
*   **Use Case**: Essential branding on every page.

#### 2. Navigation (`navigation.liquid`)
The main navigation bar containing menu links, CTAs, and user controls.
*   **Features**: Menu links, dropdowns, CTA buttons, user account links, shopping cart, social icons.
*   **Use Case**: Add to pages where full navigation is required.

#### 3. Mobile Menu (`mobile_menu.liquid`)
A dedicated slide-out menu for mobile devices.
*   **Features**: Multi-level navigation, CTA button, custom footer content, smooth animations.
*   **Use Case**: Essential for mobile navigation (works with the hamburger icon in the Navigation section).

### Implementation Examples

*   **Marketing Site**: Header (Sticky) + Navigation + Mobile Menu
*   **Landing Page**: Header (Logo only) + Mobile Menu (Optional)
*   **Product Page**: Header + Navigation (Product links) + Mobile Menu

---

## 3. Adaptable Navigation (Theme Editor)

The **Navigation** section is fully customizable using "Blocks" in the Kajabi Theme Editor. This allows you to build your menu layout visually without touching code.

### Available Blocks

1.  **Logo Block**: Toggle visibility, choose image/text, set alignment.
2.  **Menu Block**: Select a Kajabi navigation menu, control alignment.
3.  **Custom Link Block**: Add individual links (Page, URL, Email, etc.).
4.  **Featured Button Block**: Add CTA buttons with custom styles (Primary, Outline, White) and colors.
5.  **Spacer Block**: Control spacing (Small, Medium, Large, Auto). *Tip: Use "Auto" to push items to the right.*
6.  **User Menu Block**: Login/Logout and account dropdown.
7.  **Dropdown Menu Block**: Create custom dropdowns with sub-menus.
8.  **Social Icons Block**: Display social media links.

### Example Configuration
To create a standard layout with a logo on the left, menu in the center, and CTA on the right:
`[Logo] [Spacer-Auto] [Menu] [Spacer-Auto] [Featured Button]`

---

## 4. Visibility Control System

Control exactly where your navigation appears using global settings or page-level overrides.

### Global Setting
Go to **Theme Settings > Navigation** and toggle **"Show Main Navigation"**.
*   **Enabled (Default)**: Navigation appears on all pages.
*   **Disabled**: Navigation is hidden site-wide.

### Page-Level Overrides (For Developers)
Use the `navigation_controller` snippet in your templates (`templates/*.liquid`) to override global settings.

**Force Hide (e.g., for Checkout/Landing pages):**
```liquid
{% include "navigation_controller", force_hide: true %}
```

**Force Show (e.g., if globally disabled):**
```liquid
{% include "navigation_controller", force_show: true %}
```

**Use Custom Navigation Section:**
```liquid
{% include "navigation_controller", nav_section: "nav_header_static" %}
```

### Priority Order
1.  `force_hide: true`
2.  `force_show: true`
3.  Global Setting (`settings.show_navigation`)

---

## 5. Styling & Customization

### CSS Classes
*   **Header**: `.header-simple`
*   **Navigation**: `.navigation`
*   **Mobile Menu**: `.mobile-menu`

### Common Customizations
**Sticky Navigation**:
To make the navigation sticky below a sticky header:
```css
.header-simple--sticky + .navigation--sticky {
  top: 60px; /* Adjust to match header height */
}
```

**Mobile Breakpoints**:
The default breakpoint for switching to mobile navigation is `767px`.

---

## 6. Troubleshooting

*   **Mobile menu not opening?** Ensure the "Header" section has "Enable Mobile Menu Button" checked and the "Mobile Menu" section is added to the page.
*   **Navigation not showing?** Check the global "Show Main Navigation" setting and ensure no page-level `force_hide` overrides are active.
*   **Dropdowns not working?** Ensure you are using the "Dropdown" block type and the menu has child items in Kajabi navigation settings.
