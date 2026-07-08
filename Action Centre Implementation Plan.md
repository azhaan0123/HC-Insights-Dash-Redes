# Product Requirements Document (PRD)

## Action Centre

---

# Product Vision

Transform Health Compiler from a retrospective analytics platform into an operational engagement platform that helps Direct Primary Care (DPC) practices identify, prioritize, and act on patient engagement opportunities every day.

Instead of asking *"What happened?"*, users should immediately know:

* Who needs attention?
* Why do they need attention?
* What should we do next?
* What impact will that action have?

---

# Product Strategy

Rather than attempting to launch every capability simultaneously, the Action Centre should be delivered in three progressively smarter phases.

Each phase should independently provide customer value while laying the foundation for the next.

---

# Phase 1 — Operational Visibility

## Goal

Replace passive reporting with actionable work queues.

This phase focuses on surfacing opportunities—not intelligence.

Users should open the dashboard and immediately know which patients need attention.

---

## Primary Objective

Create a daily operational dashboard.

### Success Criteria

* Daily usage begins replacing monthly dashboard visits
* Care coordinators spend less time manually identifying patients
* DPCs begin proactive outreach

---

## Features

### 1. Engagement Overview

Operational summary cards including:

* Patients Requiring Attention
* New Patients Awaiting First Visit
* Engagement Gap Patients
* High Chronic Risk Patients
* Utilization Leakage Patients
* Low Response Patients

Each card displays:

* Current Count
* Week-over-week change
* Month-over-month change
* Percentage change
* View Patient List

---

### 2. Actionable Patient Cohorts

Static rule-based cohorts:

#### New Patient Activation

**Criteria**
* Recently enrolled
* No completed DPC visit
* No onboarding completed

**Suggested Actions**
* Welcome Email
* Welcome SMS
* Schedule Appointment
* Onboarding Call

---

#### Engagement Gap

**Criteria**
* No encounter within:
  * 30 days
  * 60 days
  * 90 days

**Suggested Actions**
* Reminder Email
* Wellness Check
* Phone Outreach

---

#### High Chronic Risk

**Criteria**
* Chronic diagnosis
* Low engagement
* Missing follow-up

**Suggested Actions**
* Care Coordinator Call
* Preventive Appointment

---

#### Utilization Leakage

**Criteria**
* External care usage without recent DPC interaction.

**Suggested Actions**
* Schedule DPC Visit
* Patient Education

---

#### Low Response

**Criteria**
* Multiple unsuccessful outreach attempts.

**Suggested Actions**
* Change communication channel
* Phone outreach

---

### 3. Patient Lists

Each cohort includes:

* Patient Name
* Priority Level
* Last Visit
* Last Outreach
* Reason for Inclusion
* Suggested Next Action

**Sorting**
* Last Visit
* Newest Patient
* Highest Risk
* Longest Inactive

---

### 4. Basic Patient Detail Drawer

Displays:

* Patient Summary
* Engagement History
* Recent Claims
* Recent Encounters
* Recommended Action

---

### 5. Drill-down Navigation

Dashboard ↓ Cohort ↓ Patient

---

## Not Included

* AI recommendations
* Priority scoring
* Trend analytics
* Outreach metrics
* Employer reporting

---

## Success Metrics

* Weekly Active Users
* Dashboard Visits
* Patients Identified
* Outreach Initiated

---

# Phase 2 — Prioritization & Workflow Intelligence

## Goal

Help care teams decide **who should be contacted first** and measure whether outreach is working.

This phase introduces prioritization rather than simple categorization.

---

## Primary Objective

Reduce manual decision-making.

---

## Features

### 1. Engagement Priority Score

Every patient receives a configurable score.

**Example Inputs**
* Days since last visit
* Chronic risk
* Leakage
* Missed follow-up
* Enrollment age
* Previous outreach response

**Example Scores**
* 92 — High
* 74 — Medium
* 38 — Low

---

### 2. Prioritized Work Queue

Instead of alphabetical lists, patients appear ranked by urgency.

**Filters**
* High Priority
* Medium Priority
* Low Priority

**Sort by**
* Priority Score
* Chronic Risk
* Days Inactive
* Leakage

---

### 3. Recommendation Cards

Each patient displays:
* Why this patient appears
* Recommended action
* Expected outcome

**Example**
* Patient has not visited in 104 days.
* **Recommended Action:** Schedule Preventive Follow-up.
* **Expected Outcome:** Reduce disengagement risk.

---

### 4. Engagement Trends

Visualizations:
* Week-over-week
* Month-over-month
* Patient movement between cohorts
* New activations
* Recovered patients
* Growing risk groups

---

### 5. Outreach Performance Dashboard

Track:
* Emails Sent
* SMS Sent
* Calls Logged
* Appointments Scheduled
* Appointments Completed
* Response Rate
* Completion Rate

---

### 6. Saved Filters

Examples:
* My Patients
* Highest Risk
* Needs Calls Today
* New Patients

---

## Not Included

* AI-generated recommendations
* Automation
* Predictive models

---

## Success Metrics

**Increase**
* Outreach completion
* First appointments
* Repeat visits
* Daily active users

**Reduce**
* Patient inactivity
* Manual searching

---

# Phase 3 — Intelligent Engagement Platform

## Goal

Move beyond operational dashboards into proactive engagement intelligence.

This phase transforms Health Compiler into an intelligent engagement assistant.

---

## Primary Objective

Recommend the highest-value intervention before users ask.

---

## Features

### 1. AI Recommendation Engine

Instead of static suggestions, generate personalized recommendations.

**Example**
* Patient has diabetes and has not visited for 84 days.
* Patients with similar profiles typically respond to phone outreach before SMS.
* **Recommended action:** Assign Care Coordinator.

---

### 2. Predictive Risk Models

Predict:
* Likely disengagement
* Future leakage
* Missed follow-up probability
* Appointment no-show risk
* High-cost utilization

---

### 3. Smart Opportunity Feed

Like an inbox.

**Examples**
* 12 New High-Risk Patients
* 5 Patients Likely to Leave DPC
* 8 Members Ready for Annual Wellness Visit

---

### 4. Automated Outreach (Optional)

Integrations:
* Email
* SMS
* CRM
* EHR
* Campaign Builder

Users approve recommendations before sending.

---

### 5. Employer Impact Dashboard

Executive reporting:
* Members Activated
* Leakage Prevented
* Estimated Cost Avoidance
* Engagement Improvements
* DPC Utilization Growth
* ROI Trends
* Employer-ready export

---

### 6. Intelligent Learning

Recommendation engine continuously improves using:
* Completed outreach
* Successful appointments
* Response rates
* Historical outcomes

---

### 7. Opportunity Forecasting

Predict:
* Patients becoming inactive
* Patients requiring follow-up
* Likely high utilizers
* Future workload

---

## Success Metrics

**Increase**
* Patient activation
* Employer retention
* DPC utilization
* Customer retention
* Feature adoption

**Reduce**
* Leakage
* Manual work
* Patient disengagement

---

# Roadmap Summary

| Phase | Theme | Primary User Value | Complexity |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Operational Visibility | See who needs attention today through rule-based cohorts and work queues | Low |
| **Phase 2** | Prioritization & Workflow Intelligence | Rank patients by urgency, provide recommendations, and measure outreach effectiveness | Medium |
| **Phase 3** | Intelligent Engagement Platform | Predict risk, recommend optimal interventions, automate workflows, and demonstrate employer ROI | High |

## Guiding Principle

The roadmap deliberately evolves the product from:

**Analytics → Operations → Intelligence**

* **Phase 1:** "Here are the patients who need attention."
* **Phase 2:** "These are the patients you should prioritize, and here's why."
* **Phase 3:** "Here's the best action to take, the expected outcome, and let us help execute it."

This progression minimizes implementation risk, delivers customer value early, and creates a scalable foundation for future AI-powered engagement capabilities.
