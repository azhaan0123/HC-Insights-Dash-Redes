# 00. Overview & Design Tokens

The HealthCompiler Insights Dashboard (`HC-Insights-Dash-Redes`) uses CSS Custom Properties defined in `src/styles/theme.css` and `src/styles/globals.css` combined with Tailwind CSS utility classes. This architecture ensures real-time theme switching (Light vs. Dark mode) without re-rendering component trees.

---

## 1. Color System

Colors are defined using hex values mapped to semantic CSS variables. Components reference semantic variables (e.g., `bg-primary`, `text-muted-foreground`, `border-border`) rather than hardcoded colors.

### Light Theme (`:root`)
| Token | Hex / Value | Usage & Meaning |
| :--- | :--- | :--- |
| `--background` | `#ffffff` | Primary app canvas and page backgrounds. |
| `--foreground` | `#382e2e` | Primary body text and deep neutral headers. |
| `--card` / `--popover` | `#ffffff` | Background for elevated surfaces (cards, modals, dropdowns). |
| `--card-foreground` | `#262626` | High-contrast text within card containers. |
| `--primary` | `#e32168` | Brand crimson pink; primary action buttons, active indicators. |
| `--primary-foreground` | `#fff0f4` | Contrast text/icons placed on top of `--primary`. |
| `--secondary` | `#fff0f4` | Soft pink wash for secondary badges, subtle highlights. |
| `--secondary-foreground` | `#ca0055` | Deep rose text for secondary action items. |
| `--muted` | `#f9fafb` | Neutral background wash for table headers, inactive tabs. |
| `--muted-foreground` | `#382e2e` | Secondary body text, captions, timestamps. |
| `--accent` | `#fff0f4` | Hover highlight wash for list items and menu rows. |
| `--accent-foreground` | `#67022a` | Dark crimson text when hovering accent surfaces. |
| `--destructive` | `#ef4444` | Red error indicator for clinical alerts, delete actions. |
| `--border` | `#d4d4d8` | Standard structural borders for dividers and cards. |
| `--input` | `#e5e7eb` | Form input outlines and dropdown borders. |
| `--ring` | `#fb5b87` | Focus ring color for keyboard accessibility (`focus-visible`). |

### Dark Theme (`.dark`)
| Token | Hex / Value | Usage & Meaning |
| :--- | :--- | :--- |
| `--background` | `#171717` | Deep charcoal primary app canvas. |
| `--foreground` | `#e5e5e5` | Light neutral primary text. |
| `--card` / `--popover` | `#262626` | Elevated surface dark background. |
| `--primary` | `#f59e0b` | Warm amber/gold primary accent for high visibility in dark mode. |
| `--primary-foreground` | `#000000` | Black contrast text on primary buttons. |
| `--secondary` | `#262626` | Dark neutral surface for secondary items. |
| `--secondary-foreground`| `#e5e5e5` | Light neutral text on secondary surfaces. |
| `--muted` | `#1f1f1f` | Recessed dark surfaces. |
| `--muted-foreground` | `#a3a3a3` | Medium gray secondary captions. |
| `--accent` | `#92400e` | Deep amber tint for interactive hovers. |
| `--accent-foreground` | `#fde68a` | Bright yellow/amber text on hovered elements. |

---

## 2. Analytics & Chart Color Palette

To ensure clear visual separation across multi-series healthcare visualizations (e.g., Utilization Gaps, Patient Adherence, Risk stratification), chart tokens are explicitly mapped:

| Token | Light Mode Hex | Dark Mode Hex | Intended Data Dimension |
| :--- | :--- | :--- | :--- |
| `--chart-1` | `#fb5b87` | `#fbbf24` | Primary metric (e.g., Total Patients, Current Year) |
| `--chart-2` | `#e32168` | `#d97706` | Secondary metric (e.g., Engaged Patients, Prior Year) |
| `--chart-3` | `#ca0055` | `#92400e` | Critical threshold / Gap metric |
| `--chart-4` | `#ab0045` | `#b45309` | Benchmark / Target line |
| `--chart-5` | `#890037` | `#92400e` | Sub-category breakdown |

---

## 3. Typography System

The design system incorporates a curated font stack configured via CSS variables and Tailwind utilities:

```css
--font-sans: Geist, ui-sans-serif, sans-serif, system-ui;
--font-serif: Merriweather, ui-serif, serif;
--font-mono: JetBrains Mono, monospace;
```

* **Sans-Serif (`Geist`)**: Used for all UI controls, navigation items, KPI figures, table headers, and body text. Provides exceptional digital legibility at small sizes.
* **Serif (`Merriweather`)**: Available for editorial narrative titles or printable healthcare reporting summaries.
* **Monospace (`JetBrains Mono`)**: Used for ICD-10 diagnosis codes, CPT procedure codes, NPI identifiers, and system log outputs.

---

## 4. Border Radius & Spacing Scale

* **Base Radius Token**: `--radius: 0.7rem;`
* **Utility Derivations**:
  * `rounded-lg`: `var(--radius)` (`0.7rem` / `11.2px`)
  * `rounded-md`: `calc(var(--radius) - 2px)` (`0.575rem` / `9.2px`)
  * `rounded-sm`: `calc(var(--radius) - 4px)` (`0.45rem` / `7.2px`)

---

## 5. Elevation & Shadow System

Shadows provide depth and hierarchy, especially when overlaying AI drawers or hovering KPI cards:

* `--shadow-sm`: Subtle border elevation for static data cards.
* `--shadow-md`: Standard elevation for interactive buttons and hoverable rows.
* `--shadow-lg`: Elevated floating popovers, dropdown menus, and tooltips.
* `--shadow-xl` / `--shadow-2xl`: High elevation for modal dialogs and slide-out AI drawers (`RightAiSidebar`).
