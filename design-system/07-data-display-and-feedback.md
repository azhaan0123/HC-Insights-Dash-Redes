# 07. Data Display & Feedback Primitives

Data display primitives structure content, highlight status states, and present asynchronous feedback across the dashboard.

---

## 1. Card (`src/app/components/ui/card.tsx`)

### Purpose
The foundational surface container used for grouping related content. Features subtle shadows (`--shadow-sm`), rounded borders (`rounded-lg border border-border bg-card text-card-foreground`), and clear semantic sub-sections (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).

---

## 2. Badge (`src/app/components/ui/badge.tsx`)

### Purpose
Compact inline tags used to highlight patient risk tiers, clinical status, or filter pills.

### Variants
* `default`: Solid primary crimson fill (`bg-primary text-primary-foreground`).
* `secondary`: Soft muted fill (`bg-secondary text-secondary-foreground`).
* `destructive`: Solid red alert tag (`bg-destructive text-destructive-foreground`).
* `outline`: Bordered tag (`text-foreground border border-border`).

---

## 3. Avatar (`src/app/components/ui/avatar.tsx`)

### Purpose
Circular identity indicator for clinician profiles, patient avatars, or practice logos. Automatically falls back to initials (`AvatarFallback`) if remote image URLs (`AvatarImage`) fail to load.

---

## 4. Table Primitive (`src/app/components/ui/table.tsx`)

### Purpose
Accessible HTML table wrappers (`Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`) with hover state highlights (`hover:bg-muted/50`) and active row selection styling (`data-[state=selected]:bg-muted`). Powers the high-level `DataTable` widget.

---

## 5. Accordion & Collapsible (`src/app/components/ui/accordion.tsx`, `collapsible.tsx`)

### Purpose
* **Accordion**: Vertically stacked interactive panels where expanding one item collapses others. Used for detailed FAQ guides or clinical guideline checklists.
* **Collapsible**: Single expandable content box used for progressive disclosure of complex medical claim details or raw EHR JSON payloads.

---

## 6. ICD10Code (`src/app/components/ui/icd10-code.tsx`)

### Purpose
A healthcare domain-specific badge component designed to format and highlight International Classification of Diseases (ICD-10) diagnosis codes (e.g., `E11.9`, `I10`). Formatted in monospace font with integrated hover definitions explaining the exact medical diagnosis.

---

## 7. Progress & Skeleton (`src/app/components/ui/progress.tsx`, `skeleton.tsx`)

### Purpose
* **Progress**: Horizontal bar visualizing completion ratios (e.g., *Care Gap Closure Rate: 74%* or *File Onboarding Progress*).
* **Skeleton**: Shimmering background placeholder box (`animate-pulse rounded-md bg-muted`) displayed while data queries load.

---

## 8. Sonner Toast (`src/app/components/ui/sonner.tsx`)

### Purpose
Non-blocking notification system powered by `sonner`. Displays success alerts (*"Export completed successfully"*), warning messages, or error notifications (*"Failed to sync practice EHR connection"*) at the edge of the viewport.

---

## 9. Carousel & AspectRatio (`src/app/components/ui/carousel.tsx`, `aspect-ratio.tsx`)

### Purpose
* **Carousel**: Employs Embla Carousel for slide navigation through interactive product onboarding tours or multi-page executive summaries.
* **AspectRatio**: Maintains strict width-to-height ratios (`16/9`, `4/3`) when embedding video tutorials or responsive medical imagery.

---

## 10. Resizable, ScrollArea & Separator (`src/app/components/ui/resizable.tsx`, `scroll-area.tsx`, `separator.tsx`)

### Purpose
* **Resizable**: Split-pane layout containers allowing users to drag and resize sidebars or chart panels.
* **ScrollArea**: Custom styled scrollbars ensuring visual consistency across Windows, macOS, and Linux web browsers.
* **Separator**: Accessible visual divider line (`<hr />`) supporting horizontal and vertical orientations.

---

## 11. ImageWithFallback (`src/app/components/figma/ImageWithFallback.tsx`)

### Purpose
A resilient image display wrapper that gracefully detects network load failures or broken CDN links, rendering a clean fallback SVG placeholder rather than a broken image icon.
