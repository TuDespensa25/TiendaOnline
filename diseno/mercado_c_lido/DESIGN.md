---
name: Mercado Cálido
colors:
  surface: '#fff8f6'
  surface-dim: '#e9d6ce'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#feeae1'
  surface-container-high: '#f8e4dc'
  surface-container-highest: '#f2dfd6'
  on-surface: '#231914'
  on-surface-variant: '#57423b'
  inverse-surface: '#392e28'
  inverse-on-surface: '#ffede6'
  outline: '#8a7269'
  outline-variant: '#dec0b7'
  surface-tint: '#a23f15'
  primary: '#671f00'
  on-primary: '#ffffff'
  primary-container: '#8c2f04'
  on-primary-container: '#ffab8d'
  inverse-primary: '#ffb59b'
  secondary: '#9b4500'
  on-secondary: '#ffffff'
  secondary-container: '#fd8e4a'
  on-secondary-container: '#6b2d00'
  tertiary: '#004029'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a583e'
  on-tertiary-container: '#8fccab'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59b'
  on-primary-fixed: '#380d00'
  on-primary-fixed-variant: '#812900'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68e'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#763300'
  tertiary-fixed: '#b1f0cd'
  tertiary-fixed-dim: '#96d4b2'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#105137'
  background: '#fff8f6'
  on-background: '#231914'
  surface-variant: '#f2dfd6'
typography:
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  price-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  display-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is built on the concept of an "Honest Neighborhood Market." It evokes the warmth of sun-baked terracotta and the functional clarity of traditional grocery signage. The aesthetic is grounded, reliable, and accessible, moving away from tech-industry slickness toward a tactile, human-centric experience.

The style is a blend of **Minimalism** and **Modern-Industrial**:
- **High legibility:** Maximum contrast ratios to ensure visibility in high-glare, outdoor environments.
- **Structural Integrity:** Heavy reliance on grid alignment and clear typographic hierarchy rather than decorative effects.
- **Warmth:** A palette that replaces sterile whites and blacks with organic hues (Bone and Deep Brown) to create an inviting, trustworthy atmosphere.

## Colors
The palette is inspired by natural materials and traditional Cuban market stalls. 

- **Primary (Terracotta Tostado):** Used for brand identity, headers, and price points to signify value and heritage.
- **Secondary (Naranja Cálido):** Reserved exclusively for primary actions (Add to Cart, Checkout). Its vibrancy ensures it stands out against the more muted brand tones.
- **Neutral (Marrón Oscuro):** Used for all body text. Pure black is avoided to maintain the organic, warm feel of the interface.
- **Background (Hueso):** A soft off-white that reduces eye strain and provides a premium, paper-like quality.
- **Semantic Colors:** Green is dedicated to discounts and savings; Red is used strictly for errors or "Out of Stock" notifications.

## Typography
The typographic strategy balances "Signage" (Archivo Narrow) with "Utility" (Inter).

- **Headlines:** Must always be in **Archivo Narrow**, Bold, and Uppercase. This mimics the look of hand-painted or stenciled market signs.
- **Body Content:** Uses **Inter** for its exceptional readability and neutral character.
- **Prices:** Prices are treated as a critical UI element. They use Inter SemiBold in the Primary color (#8C2F04) to ensure they are the first thing a user sees after the product image.
- **Mobile Scaling:** Display headers scale down on mobile to prevent awkward line breaks while maintaining their heavy visual weight.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on vertical stackability, ideal for mobile commerce.

- **Grid:** 12-column desktop grid / 4-column mobile grid.
- **Touch Targets:** A strict minimum of 48px height for all interactive elements (buttons, inputs, list items) to accommodate easy navigation on the go.
- **Rhythm:** Use the 8px base unit for all spacing. Consistent 24px (md) padding within cards and containers creates a clean, organized look.
- **Reflow:** On mobile, product grids transition from 4 columns to 2 columns to keep product imagery large and detailed.

## Elevation & Depth
This design system avoids artificial depth in favor of a flat, honest layout.

- **Flat Surfaces:** Components like cards and headers do not use shadows. Instead, they are defined by subtle 1px borders in a slightly darker shade of the background color or by clear color-blocking against the #F7F5F1 surface.
- **Tonal Separation:** Depth is achieved by stacking: the background is #F7F5F1, while cards or modals may use a pure White (#FFFFFF) to subtly lift them off the page.
- **No Gradients:** Colors must be flat and solid to maintain the "neighborhood market" aesthetic and ensure high contrast.

## Shapes
The shape language is rigid and structural.

- **Corner Radius:** A universal 4px radius is applied to all buttons, input fields, and cards. This creates a "softened-square" look that feels sturdy and professional without being clinical or overly "techy."
- **Icons:** Use thick-stroke (2px), flat icons. Avoid rounded or bubbly icon sets; prefer geometric or slightly industrial styles.

## Components
- **Buttons:** Primary action buttons must be #D97230 with White text. Minimum height: 48px. Weight: SemiBold.
- **Input Fields:** 4px rounded corners, 1px solid border using the Neutral color at 20% opacity. Focused state uses a 2px border in the Primary color.
- **Product Cards:** No shadows. Use a simple 1px border or a subtle background shift. The Price should be prominent in #8C2F04.
- **Chips/Badges:** For discounts, use #2F6B4F with white text. For "Agotado" (Out of Stock), use #B3261E. These should be rectangular with the same 4px radius.
- **Lists:** High-density lists for cart items. Use 16px gutters and ensure the "Remove" or "Edit" actions are at least 48x48px for easy tapping.
- **Navigation:** Top bar should be solid #F7F5F1 or the Primary color #8C2F04 with white text for high-impact branding.