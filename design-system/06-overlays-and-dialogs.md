# 06. Overlays & Dialogs

Overlays provide layered, focus-trapped presentation surfaces for complex user tasks, critical confirmations, and contextual information without navigating away from the underlying dashboard view.

---

## 1. Dialog & AlertDialog (`src/app/components/ui/dialog.tsx`, `alert-dialog.tsx`)

### Purpose
* **Dialog**: Modal window centered on the screen with a semi-transparent backdrop overlay (`bg-black/80`). Used for patient detail inspections, adding new network practices, or uploading EHR rosters.
* **AlertDialog**: Specialized modal interrupting the workflow requiring explicit confirmation before executing destructive or irreversible actions (e.g., *Disconnecting EHR Data Feeds* or *Archiving Patient Profiles*).

### Sub-Components
* `DialogHeader`, `DialogTitle`, `DialogDescription`: Structured header block guaranteeing screen reader accessibility.
* `DialogFooter`: Aligns cancel and submit action buttons to the right.

---

## 2. Sheet & Drawer (`src/app/components/ui/sheet.tsx`, `drawer.tsx`)

### Purpose
* **Sheet**: Side-sliding drawer panel anchored to any screen edge (`top`, `bottom`, `left`, `right`). Powers both the mobile navigation sidebar (`AppSidebar`) and the right-hand AI Co-pilot (`RightAiSidebar`).
* **Drawer**: Responsive bottom slide-up sheet powered by Vaul. Provides a native mobile sheet feel with draggable dismissal handles when viewing dashboards on phones or tablets.

---

## 3. Popover & HoverCard (`src/app/components/ui/popover.tsx`, `hover-card.tsx`)

### Purpose
* **Popover**: Interactive floating container anchored to a trigger button. Used for date pickers, column visibility toggles, or quick filter builders.
* **HoverCard**: Lightweight preview card that appears when hovering over a UI element. Used in data tables to display provider contact details or clinical care team summaries when hovering over a doctor's name.

---

## 4. Tooltip & ContextMenu (`src/app/components/ui/tooltip.tsx`, `context-menu.tsx`)

### Purpose
* **Tooltip**: Small informational popup with delay triggering (`TooltipProvider delayDuration={200}`). Used across KPI cards (`KpiCard`), table headers, and icon buttons to clarify medical acronyms (e.g., explaining *PMPM* or *HEDIS* score definitions).
* **ContextMenu**: Right-click menu displayed when right-clicking data rows or chart segments. Allows quick actions such as *Open Patient Chart*, *Copy Member ID*, or *Flag for Review*.
