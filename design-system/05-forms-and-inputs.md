# 05. Form Controls & Inputs

Form controls are styled for high accessibility and clarity, integrating seamlessly with `react-hook-form` and `zod` schema validation.

---

## 1. Button (`src/app/components/ui/button.tsx`)

### Purpose
The primary trigger for interactive actions across the application. Utilizes `class-variance-authority` (`cva`) to provide standardized variant and size combinations.

### Variants
* `default`: Brand primary fill (`bg-primary text-primary-foreground hover:bg-primary/90`).
* `destructive`: Danger red fill (`bg-destructive text-destructive-foreground hover:bg-destructive/90`) for clinical alerts or data deletion.
* `outline`: Neutral border with background hover (`border border-input bg-background hover:bg-accent hover:text-accent-foreground`).
* `secondary`: Subtle pink/neutral fill (`bg-secondary text-secondary-foreground hover:bg-secondary/80`).
* `ghost`: Transparent background until hovered (`hover:bg-accent hover:text-accent-foreground`).
* `link`: Underlined text link (`text-primary underline-offset-4 hover:underline`).

### Sizes
* `default`: `h-9 px-4 py-2`
* `sm`: `h-8 rounded-md px-3 text-xs`
* `lg`: `h-10 rounded-md px-8`
* `icon`: `h-9 w-9` (for icon-only action triggers)

---

## 2. Input & Textarea (`src/app/components/ui/input.tsx`, `textarea.tsx`)

### Purpose
Standard text entry fields styled with consistent focus rings (`focus-visible:ring-1 focus-visible:ring-ring`), disabled states (`disabled:cursor-not-allowed disabled:opacity-50`), and placeholder contrast ratios.

---

## 3. InputOTP (`src/app/components/ui/input-otp.tsx`)

### Purpose
Segmented one-time password input boxes built around `input-otp`. Used during Multi-Factor Authentication (MFA) step verifications or secure HIPAA data onboarding authorizations.

---

## 4. Select & Command (`src/app/components/ui/select.tsx`, `command.tsx`)

### Purpose
* **Select**: Radix UI accessible styled dropdown selector for choosing options from defined lists (e.g., selecting a Practice or Payer).
* **Command**: Command palette and searchable combobox (`cmdk`). Used inside filter sidebars or search bars where clinicians need to type-ahead filter across thousands of ICD-10 diagnosis codes or NPI registries.

---

## 5. Checkbox, RadioGroup & Switch (`src/app/components/ui/checkbox.tsx`, `radio-group.tsx`, `switch.tsx`)

### Purpose
* **Checkbox**: Multi-select toggle box with checkmark animation. Used in data tables for batch patient selection.
* **RadioGroup**: Mutually exclusive selection lists.
* **Switch**: Immediate toggle switch (e.g., toggling *Risk-Adjusted Metrics* on/off or enabling automated AI alert digests).

---

## 6. Calendar & Slider (`src/app/components/ui/calendar.tsx`, `slider.tsx`)

### Purpose
* **Calendar**: Built upon `react-day-picker`. Renders date picking grids for filtering clinical claims ranges or scheduling outreach appointments.
* **Slider**: Range slider for numerical thresholds (e.g., filtering patients aged 65–85 or risk score > 3.5).

---

## 7. Toggle & ToggleGroup (`src/app/components/ui/toggle.tsx`, `toggle-group.tsx`)

### Purpose
Two-state pressed buttons used for formatting toolbars or layout view switchers (e.g., switching between Grid View and Table View).

---

## 8. Form & Label Primitives (`src/app/components/ui/form.tsx`, `label.tsx`)

### Purpose
Provides complete bindings for `react-hook-form`. Automatically attaches `id` and `aria-describedby` attributes linking input fields to validation error messages (`FormMessage`) and helper descriptions (`FormDescription`).
