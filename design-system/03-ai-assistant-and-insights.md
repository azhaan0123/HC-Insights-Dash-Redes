# 03. AI Assistant & Insights Integration

The AI Assistant suite integrates embedded conversational intelligence and proactive clinical anomaly detection directly into the healthcare analytics workflow.

---

## 1. RightAiSidebar (`src/app/components/ai/RightAiSidebar.tsx`)

### Purpose
A slide-out right drawer panel (`Sheet`) or split-screen co-pilot panel accessible from any page in the application. It acts as an interactive assistant capable of analyzing whatever data cohort or chart the clinician currently has active on the screen.

### Structure & Tabs
Organized into three primary tab views using Radix UI tabs:
1. **Chat (`AiChatInterface`)**: Conversational Q&A interface for ad-hoc clinical and financial inquiries.
2. **Insights (`AiInsightsTab`)**: Automated feed of statistical anomalies, trend alerts, and utilization highlights.
3. **Actions (`AiActionsTab`)**: Prescriptive action items recommended by the AI engine.

---

## 2. AiChatInterface (`src/app/components/ai/AiChatInterface.tsx`)

### Purpose
Renders the conversational interface for the clinical AI co-pilot. Enables users to ask natural language questions (e.g., *"Why did inpatient readmissions increase in Q2?"* or *"Summarize the care gaps for Dr. Smith's diabetic cohort."*).

### Key Features
* **Conversation History Stream**: Scrollable message area distinguishing between user prompts and markdown-formatted AI responses.
* **Context Awareness Banner**: Displays a tag indicating the currently active page and applied filters so users know what context the AI is analyzing.
* **Input Controller**: Auto-growing textarea with send button, keyboard shortcuts (`Cmd/Ctrl + Enter` to send), and a loading state indicator with streaming response animations.

---

## 3. AiPresetQuestions (`src/app/components/ai/AiPresetQuestions.tsx`)

### Purpose
Surfaces context-sensitive prompt starter chips above the chat input box. Helps users discover capabilities without staring at a blank prompt.

### Example Preset Categories
* **Executive Overview**: *"Identify top 3 cost drivers across primary care networks."*
* **Utilization Gaps**: *"List top 5 providers with the highest mammography screening deficits."*
* **Patient Engagement**: *"Generate an outreach sequence script for unengaged high-risk patients."*

---

## 4. AiInsightsTab (`src/app/components/ai/AiInsightsTab.tsx`)

### Purpose
An automated intelligence feed displaying proactive analytical findings generated in the background by data anomaly detection algorithms.

### Insight Card Anatomy
* **Severity Badge**: Tagged as `Critical`, `Warning`, or `Positive Trend`.
* **Metric Headline**: E.g., *"Spike in 30-Day All-Cause Readmissions Detected."*
* **Root Cause Summary**: Concise narrative explaining underlying data drivers (e.g., *"Driven primarily by congestive heart failure patients discharged without 7-day follow-up appointments."*).
* **One-Click Action**: Button allowing immediate navigation to the impacted patient roster or creating an intervention workflow.

---

## 5. AiActionsTab (`src/app/components/ai/AiActionsTab.tsx`)

### Purpose
Translates analytical insights into operational tasks. Displays AI-generated action checklists assigned to care managers, practice administrators, or quality directors.

### Capabilities
* **Bulk Action Execution**: Enable one-click export of patient call lists or automated EHR task creation.
* **Impact Estimator**: Shows projected clinical or financial return if the recommendation is executed (e.g., *"Estimated Quality Bonus Impact: +$45,000"*).
