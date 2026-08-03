---
name: Monolithic Inventory
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1eded'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1c'
  on-surface-variant: '#47464b'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#77767b'
  outline-variant: '#c8c5cb'
  surface-tint: '#5f5e61'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1e'
  on-primary-container: '#858387'
  inverse-primary: '#c8c5ca'
  secondary: '#5d5e66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#63646c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b16'
  on-tertiary-container: '#88837c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e1e6'
  primary-fixed-dim: '#c8c5ca'
  on-primary-fixed: '#1b1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#e8e2d9'
  tertiary-fixed-dim: '#cbc6bd'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#494640'
  background: '#fdf8f8'
  on-background: '#1c1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-data:
    fontFamily: Geist Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

The design system is engineered for utility, clarity, and high-density information management. It targets professionals who require an interface that minimizes cognitive load and maximizes data throughput. 

The aesthetic is **Corporate Modern with a Minimalist lean**. It prioritizes a systematic approach where every element has a clear functional purpose. The UI utilizes a neutral, low-chroma palette to ensure that status indicators (success, warning, error) remain highly visible and actionable. The emotional response should be one of reliability, precision, and structural integrity.

## Colors

The palette is derived from the Zinc and Slate scales, providing a sophisticated, neutral backdrop that emphasizes content over container.

- **Core Neutrals**: Use Zinc-50 for the primary application background to reduce screen glare compared to pure white. Use White exclusively for surface containers and cards to create clear visual separation.
- **Typography**: Primary text utilizes Zinc-900 for maximum legibility. Secondary and metadata text uses Zinc-500.
- **Action Colors**: The primary action color is Zinc-900, providing a high-contrast, authoritative trigger point. 
- **Status Indicators**: Functional colors (Green-600, Yellow-500, Red-600) are used sparingly for status chips, validation states, and critical alerts.

## Typography

This design system uses **Geist** for its technical, precision-oriented character. 

- **Scale**: The hierarchy is tight, avoiding excessive size differences to maintain a professional, data-rich environment.
- **Weights**: Use Semibold (600) for headings to provide clear section breaks. Medium (500) is reserved for labels and navigation items. Regular (400) is used for all body and tabular data.
- **Data Display**: For SKU numbers, quantities, and timestamps, an optional Monospaced variant (Geist Mono) should be used to ensure vertical alignment and readability in tables.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Sidebars and navigation remain at fixed widths, while the primary content area stretches to a maximum of 1440px.

- **Grid**: A 12-column grid is used for dashboard layouts. 
- **Rhythm**: All spacing is based on a 4px baseline. Use 16px (md) for standard component padding and 24px (lg) for section margins.
- **Responsive Behavior**: 
  - **Desktop**: 12 columns, 24px margins.
  - **Tablet**: 8 columns, 16px margins.
  - **Mobile**: 4 columns, 16px margins, stacking all multi-column form elements.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Subtle Shadows** rather than intense color shifts.

- **Base Layer**: Zinc-50 (Background).
- **Surface Layer**: White (Cards, Modals, Inputs).
- **Shadows**: Use a single `shadow-sm` (0 1px 2px 0 rgb(0 0 0 / 0.05)) for cards and elevated elements. This keeps the interface feeling grounded and flat, preventing visual clutter in data-heavy views.
- **Borders**: All interactive elements and containers must have a 1px border in Zinc-200. This provides definition between white surfaces and the light gray background.

## Shapes

The shape language is strictly **Rounded (8px)**.

- **Uniformity**: Every interactive element—including buttons, input fields, dropdowns, and cards—must use the `rounded-lg` (0.5rem) value.
- **Exceptions**: Checkboxes use a smaller 4px radius to maintain their square-like profile while softening the edges.

## Components

### Buttons
- **Primary**: Zinc-900 background, White text. No border.
- **Secondary**: White background, Zinc-900 text, Zinc-200 border.
- **Ghost**: No background or border, Zinc-500 text; transitions to Zinc-100 background on hover.

### Input Fields
- **Default**: White background, 1px Zinc-200 border, Zinc-900 text.
- **Focus State**: `ring-2 ring-zinc-500` with a `border-zinc-500`.
- **Placeholder**: Zinc-400.

### Tables
- **Header**: Zinc-50 background, Zinc-900 bold text, 1px Zinc-200 bottom border.
- **Body**: White background, Zinc-900 text.
- **Striping**: Use Zinc-50 for even rows (`zebra-striping`) to assist horizontal eye-tracking.
- **Row Hover**: Zinc-100 subtle highlight.

### Chips/Badges
- **Status**: Small text, semibold. Use a light background (e.g., Green-50) with high-contrast text (Green-700) for "In Stock" or "Success" states.

### Cards
- **Container**: White background, 1px Zinc-200 border, `shadow-sm`.
- **Padding**: Standardized 24px (lg) for internal padding.