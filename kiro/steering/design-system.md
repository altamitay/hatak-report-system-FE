---
inclusion: manual
---

# Tene 360 — Design System

This document defines the exact design tokens, visual language, and component patterns used across all Tene 360 applications. Any sub-application (e.g. spare parts, ammunition declaration, fire extinguishers) **must** follow these specifications to maintain visual consistency.

---

## 1. Color Palette

### Primary Gradient (brand identity)
Used on: drawer, toggle button, nav active states, notification bell, text gradients, not-found page.
```
linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```
- Default button background: `#667eea`
- Button hover: `#764ba2`
- Button focus ring: `2px solid #667eea`

### App Background

**Light mode (used on all feature screens and auth):**
```
background-color: #f5f5f7
background: linear-gradient(160deg, #d0e8e0 0%, #ddeee6 30%, #ecf1ed 60%, #f5f5f7 100%)
```
Green is dominant at the top, fading to neutral gray at the bottom. This gradient is always applied — there is no dark mode for feature screens.

**Global dark mode (default app shell, not used on feature screens):**
```
background-color: #0f0f23
background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)
```

**Global light mode (app shell):**
```
background-color: #f5f5f7
background: linear-gradient(135deg, #f5f5f7 0%, #e8e8ed 100%)
```

### Teal / Brand Accent
The primary interactive color for all feature screens.
```
Teal-400 (light):  #14b8a6
Teal-600 (base):   #0d9488
Teal-700 (dark):   #0f766e
Teal-900 (deep):   #134e4a
Focus ring:        rgba(13, 148, 136, 0.1)  — 4px ring
Shadow:            rgba(13, 148, 136, 0.3)
```

### Category Colors
Each domain category has a fixed color. Use these consistently for icons, strips, chips, and action cards.
```
Ammunition  → Teal:   #0d9488  (gradient: #14b8a6 → #0f766e)
Spare Parts → Cyan:   #0891b2  (gradient: #06b6d4 → #0e7490)
Fire Ext.   → Indigo: #4f46e5  (gradient: #818cf8 → #4f46e5)
```

### Neutral / Slate Scale
```
slate-50:   #f8fafc
slate-100:  #f1f5f9
slate-200:  #e2e8f0
slate-300:  #cbd5e1
slate-400:  #94a3b8
slate-500:  #64748b
slate-600:  #475569
slate-700:  #334155
slate-800:  #1e293b
slate-900:  #0f172a
```

### Semantic Colors
```
Body text (light screens):  #1f2937
Heading text:               #0f172a  (slate-900)
Subtext / meta:             #64748b  (slate-500)
Timestamp / muted:          #94a3b8  (slate-400)
Divider lines:              #f1f5f9  (slate-100)
Card border:                #e2e8f0  (slate-200)

Error text:                 #ef4444
Error background:           #fef2f2
Error border:               #fca5a5
Error focus ring:           rgba(239, 68, 68, 0.1)
Error dark text:            #7f1d1d

Danger / destructive:       #ef4444
Danger hover:               #dc2626

Disabled:                   #cbd5e1
```

### Overlay Colors
```
Drawer overlay:             rgba(0, 0, 0, 0.5)
Input overlay backdrop:     rgba(13, 47, 47, 0.6)  + backdrop-filter: blur(8px)
Card/content (dark mode):   rgba(255, 255, 255, 0.05)
Card/content (light mode):  rgba(255, 255, 255, 0.8)
Notification modal (light): #ffffff
Notification modal (dark):  #1f2937
```

### Drawer Internal Colors
The drawer always uses the primary gradient background with white-on-gradient elements.
```
Drawer background:          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Header/footer bg:           rgba(0, 0, 0, 0.1)
Nav hover:                  rgba(255, 255, 255, 0.1)
Nav active:                 rgba(255, 255, 255, 0.15)
Active indicator strip:     #ffffff  (4px, inset-inline-start)
Logout button:              rgba(255, 255, 255, 0.15)
Logout button hover:        rgba(255, 255, 255, 0.25)
Text on drawer:             rgba(255, 255, 255, 0.9)
Muted text on drawer:       rgba(255, 255, 255, 0.7)
```

---

## 2. Typography

### Font Family
```
Primary: 'Heebo', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
Monospace (IDs, numbers): 'Courier New', Courier, monospace
```
Heebo is the required font for all Hebrew and general UI text. It supports RTL natively.

### Font Scale
```
Section label (uppercase):  0.75rem  / 700 / tracking: 0.1em
Filter chip:                0.8125rem / 700
Card label (action):        0.8125rem / 700
Entity ID / meta:           0.75rem  / 400 / monospace
Timestamp:                  0.6875rem / 500
Entity subtitle:            0.75rem  / 400
Item action title:          0.9375rem / 700
Overlay section label:      0.875rem  / 700 / tracking: 0.05em / uppercase
Overlay title:              1.25rem  / 700
Input value:                1.125rem  / 700 / monospace
Display value (overlay):    2.25rem  / 900 / monospace / tracking: 0.2em
Keypad digit:               1.5rem   / 700 / monospace
Keypad clear:               0.875rem / 600
h1:                         2.5rem   / 700
h2:                         2rem     / 600
Body:                       1rem     / 400
Line height (body):         1.6
```

---

## 3. Spacing & Layout

### Page Container
```
Max width:        600px  (centered, margin: 0 auto)
Padding (desktop): 4.5rem top, 1.5rem horizontal, 2rem bottom
Padding (mobile ≤480px): 4rem top, 1rem horizontal, 1.5rem bottom
Section gap:      1.5rem  (desktop), 1.25rem (mobile)
```

### Component Internal Spacing
```
Section gap (RecentActivity, AvailableActions): 1.25rem
Divider gap (between lines and label):          0.75rem
List item padding:                              0.875rem (all sides)
List item padding-inline-start (strip side):    1.5rem
Icon container margin-inline-end:               0.875rem
Top row margin-block-end:                       0.125rem
Chip padding:                                   0.5rem 1.25rem
Chip gap:                                       0.625rem
Action card gap (grid):                         1rem
Action card padding:                            0.5rem 0
```

---

## 4. Border Radius

```
Input / search bar:         0.75rem
Filter chip:                9999px  (pill)
List card container:        0.75rem
List item icon:             0.375rem
Action card icon box:       1.125rem
Keypad key:                 1.5rem
Overlay sheet top corners:  2.5rem 2.5rem 0 0
Overlay display:            1.5rem
Overlay submit button:      1rem
Drawer toggle:              0.75rem
Drawer:                     0 (full height panel)
Badge:                      9999px  (pill)
Close button:               9999px  (circle)
Handle bar:                 9999px
```

---

## 5. Shadows & Elevation

### Pillow Effect (primary surface style)
Used on: search input, filter chips, keypad digit keys, overlay display area.
```scss
background: linear-gradient(to bottom, #ffffff, #f8fafc);
box-shadow:
  0 8px 20px -4px rgba(0, 0, 0, 0.08),
  0 2px 6px -1px rgba(0, 0, 0, 0.04);
border: 1px solid #ffffff;
```

### Card / List Container
```
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
border: 1px solid #e2e8f0
background: #ffffff
```

### Action Icon Box
```
box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.15)
```

### Overlay Sheet
```
box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15)
```

### Teal Submit Button
```
box-shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.3)
```

### Teal Submit Button (overlay)
```
box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2)
```

### Drawer Toggle
```
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
```

---

## 6. The "Pillow Effect" Pattern

The pillow effect is the signature surface style of this design system. It creates a soft, raised appearance on interactive elements.

**When to use:** Any tappable surface that sits on the page background — inputs, filter chips, keypad keys, display areas.

**Do not use** on: list containers (use card style instead), action icon boxes (use category gradient), overlay sheets (use flat white).

```scss
// Light pillow (default — for light screens)
background: linear-gradient(to bottom, #ffffff, #f8fafc);
box-shadow:
  0 8px 20px -4px rgba(0, 0, 0, 0.08),
  0 2px 6px -1px rgba(0, 0, 0, 0.04);
border: 1px solid #ffffff;

// Dark pillow (for dark-themed surfaces if needed)
background: linear-gradient(to bottom, #1e293b, #0f172a);
box-shadow:
  0 8px 20px -4px rgba(0, 0, 0, 0.3),
  0 2px 6px -1px rgba(0, 0, 0, 0.2);
border: 1px solid rgba(255, 255, 255, 0.1);
```

---

## 7. Section Divider Pattern

Used to separate named sections (e.g. "Recent Activity", "Available Actions").

```
Layout: flex row — [line] [label] [line]
Label: 0.875rem / 700 / uppercase / tracking: 0.05em / color: #0f766e
Lines: height 1px, flex: 1
```

**Gradient direction (RTL-aware):**
- First line (inline-start side = right in RTL): `linear-gradient(to right, #0f766e, transparent)`
- Last line (inline-end side = left in RTL): `linear-gradient(to left, #0f766e, transparent)`

This ensures the thick (solid) edge is always adjacent to the label text, regardless of text direction.

---

## 8. Category Color Strip

A 3px vertical strip on the inline-start edge of list items, indicating category.

```
Position: absolute, inset-inline-start: 0
Height: inset-block-start: 0.5rem to inset-block-end: 0.5rem
Width: 3px
Border radius (LTR): 0 2px 2px 0  (rounded on right = inward side)
Border radius (RTL): 2px 0 0 2px  (rounded on left = inward side)
```

Colors map to category:
```
Ammunition:       #0d9488
Spare Parts:      #0891b2
Fire Ext.:        #4f46e5
```

---

## 9. Filter Chips

Scrollable horizontal row of category filter buttons.

**Default (unselected):**
```
Pillow effect surface
Color: #64748b
Hover color: #334155
Hover bg: linear-gradient(to bottom, #ffffff, #f1f5f9)
Active: scale(0.95), inset shadow
outline: none (no browser focus ring)
```

**Selected — "All":**
```
background: linear-gradient(to bottom, #1e293b, #0f172a)
color: #ffffff
box-shadow: 0 4px 12px -2px rgba(15, 23, 42, 0.3)
```

**Selected — category (use category gradient):**
```
Teal:   linear-gradient(to bottom, #0d9488, #0f766e) / shadow: rgba(13, 148, 136, 0.3)
Cyan:   linear-gradient(to bottom, #0891b2, #0e7490) / shadow: rgba(8, 145, 178, 0.3)
Indigo: linear-gradient(to bottom, #4f46e5, #4338ca) / shadow: rgba(79, 70, 229, 0.3)
```

---

## 10. Action Icon Cards

Used in the "Available Actions" grid. 3-column equal grid.

```
Icon box size:    3.75rem × 3.75rem
Border radius:    1.125rem
Icon size:        2rem × 2rem (white stroke)
Label:            0.8125rem / 700 / color: #334155
Grid gap:         1rem
Card padding:     0.5rem 0
```

**Gradients per category:**
```
Teal (ammunition):    linear-gradient(135deg, #14b8a6, #0f766e)
Cyan (spare parts):   linear-gradient(135deg, #06b6d4, #0e7490)
Indigo (fire ext.):   linear-gradient(135deg, #818cf8, #4f46e5)
```

**"Coming Soon" badge:**
```
Background: #ffffff
Color: #0f766e
Font: 0.625rem / 700
Padding: 0.125rem 0.5rem
Border radius: 9999px
Shadow: 0 1px 4px rgba(0, 0, 0, 0.1)
Position: absolute, centered above icon box (inset-block-start: -0.375rem)
RTL: translateX(50%) instead of translateX(-50%)
```

---

## 11. Animations & Transitions

```
Standard transition:        all 0.2s ease
Color transition:           color 0.2s ease
Background transition:      background 200ms ease
Button press:               transform: scale(0.95)
Button hover lift:          translateY(-1px)
Button hover shadow:        0 4px 12px rgba(102, 126, 234, 0.3)

Overlay backdrop:           fadeIn 200ms ease-out
Overlay sheet:              slideUp 400ms cubic-bezier(0.32, 0.72, 0, 1)
Action button appear:       scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)  (spring)
Spinner:                    spin 0.6s linear infinite

Drawer open/close:          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
Drawer overlay:             opacity 0.3s ease-in-out
```

---

## 12. RTL / Internationalization

The app defaults to Hebrew (RTL). All layout must use CSS logical properties.

```
Use:                        margin-inline-start / margin-inline-end
                            padding-inline-start / padding-inline-end
                            inset-inline-start / inset-inline-end
                            inset-block-start / inset-block-end
Do NOT use:                 margin-left / margin-right / left / right / top / bottom

RTL direction set by:       document.documentElement.setAttribute('dir', 'rtl')
                            (via useDirection hook, triggered by i18n language = 'he')

Chevron icons:              flip with [dir='rtl'] & { transform: scaleX(-1) }
Numeric inputs/keypads:     always dir="ltr" (numbers are LTR regardless of UI direction)
Badge centering (RTL):      translateX(50%) instead of translateX(-50%)
```

---

## 13. Buttons

### Global Default Button (from index.module.scss)
```
background: #667eea
color: white
border-radius: 0.5rem
padding: 0.6em 1.2em
font: 1em / 500 / Heebo
hover bg: #764ba2
hover: translateY(-1px), shadow: 0 4px 12px rgba(102, 126, 234, 0.3)
focus: outline 2px solid #667eea, offset 2px
disabled: opacity 0.5
```

**Override this for feature-specific buttons** — the global style is a fallback only.

### Teal Primary Button (feature screens)
```
background: linear-gradient(to bottom, #14b8a6, #0d9488)
border: 1px solid rgba(20, 184, 166, 0.5)
color: #ffffff
border-radius: 1rem
font: 1.125rem / 700
shadow: 0 4px 12px rgba(13, 148, 136, 0.2)
active: scale(0.98)
disabled: background #cbd5e1, no shadow
```

### Teal Icon Button (search submit)
```
background: #0d9488
color: #ffffff
border-radius: 0.75rem
shadow: 0 4px 6px -1px rgba(13, 148, 136, 0.3)
hover: #0f766e
active: scale(0.95)
disabled: #cbd5e1
```

### Ghost / Utility Button (scan, close)
```
background: #f1f5f9  (or #e2e8f0 for close)
color: #64748b  (or #475569 for close)
border-radius: 0.75rem  (or 9999px for circle)
hover bg: #e2e8f0  (or #cbd5e1)
active: scale(0.95)
```

### Destructive Button (clear)
```
background: linear-gradient(to bottom, #f97316, #ea580c)
color: #ffffff
shadow: 0 4px 10px -2px rgba(249, 115, 22, 0.3)
hover: linear-gradient(to bottom, #fb923c, #f97316)
```

---

## 14. Form Inputs

### Search / Numeric Input
```
Height:           4rem
Border-radius:    0.75rem
Font:             1.125rem / 700 / monospace
Color:            #0f172a
Padding-inline-start: 3.5rem  (icon side)
Padding-inline-end:   4rem    (action button side)
Surface:          pillow effect
Placeholder:      color #94a3b8 / weight 500
Focus ring:       0 0 0 4px rgba(13, 148, 136, 0.1)
```

**Icon positioning (RTL-aware):**
- Search icon: `inset-inline-start: 0` (right side in RTL)
- Action button: `inset-inline-end: 0.75rem` (left side in RTL)

---

## 15. List / Feed Items

### Container Card
```
background: #ffffff
border-radius: 0.75rem
border: 1px solid #e2e8f0
overflow: hidden
shadow: 0 1px 3px rgba(0, 0, 0, 0.05)
```

### Item Row
```
Padding: 0.875rem (all), padding-inline-start: 1.5rem (strip side)
Active bg: #f1f5f9
Divider: 1px #f1f5f9, margin-inline-start: 4rem, margin-inline-end: 1rem
```

### Item Icon Container
```
Size: 1.75rem × 1.75rem
Border-radius: 0.375rem
Background: category color (solid, not gradient)
Icon: 1.125rem, white stroke
Shadow: 0 1px 2px rgba(0, 0, 0, 0.1)
Margin-inline-end: 0.875rem
```

### Item Text
```
Action title:   0.9375rem / 700 / #0f172a
Timestamp:      0.6875rem / 500 / #94a3b8
Entity line:    0.75rem / 400 / #64748b / monospace
```

---

## 16. Bottom Sheet / Overlay

```
Backdrop:       rgba(13, 47, 47, 0.6) + blur(8px), z-index: 40
Sheet:          position fixed, inset-block-end: 0, height: 65vh
Background:     #f8fafc
Border-radius:  2.5rem 2.5rem 0 0
z-index:        50
Shadow:         0 -8px 32px rgba(0, 0, 0, 0.15)
Color:          #1f2937
```

### Handle Bar
```
Width: 3rem, height: 0.25rem
Background: #cbd5e1
Border-radius: 9999px
Centered at top
```

---

## 17. Drawer

```
Width:          280px (max 85vw)
Background:     linear-gradient(135deg, #667eea 0%, #764ba2 100%)
z-index:        1000
Transition:     transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)
LTR closed:     translateX(-100%)
RTL closed:     translateX(100%)
```

Toggle button: `position: fixed, inset-inline-start: 1rem, top: 1rem, z-index: 998`
Size: `3rem × 3rem`, same primary gradient, border-radius: `0.75rem`

---

## 18. Coding Conventions

- **Styling:** SCSS Modules (`.module.scss`) co-located with each component
- **Class names:** camelCase in SCSS, accessed via `styles.className`
- **No dark mode overrides** on feature screens — they are always light
- **Shared mixins:** define in a `_mixins.scss` file within the feature's `components/` folder
- **No inline styles** — all values in SCSS modules
- **Logical CSS properties only** — never use physical `left`/`right`/`top`/`bottom` for layout
- **Button resets:** always override the global button style explicitly when building custom buttons (set `background: none`, `border: none`, `box-shadow: none`, `outline: none` as needed)
- **Focus rings:** remove browser default (`outline: none`) and implement custom teal ring where appropriate
- **Scrollbars:** hide on horizontal scroll containers (`scrollbar-width: none`, `-ms-overflow-style: none`, `::-webkit-scrollbar { display: none }`)
