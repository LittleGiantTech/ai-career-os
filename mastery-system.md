# Mastery System

**Version:** 1.0  
**Scope:** One user (Travis), one curriculum path (AI Product Engineer), 29 stages across 6 chapters  
**Optimization target:** Long-term retention and technical independence — not rapid progression

---

## Core Principle

A stage is not complete because time was spent on it.  
A stage is not complete because tasks were checked off.  
A stage is complete when the AI interview proves understanding.

The mastery system exists to enforce this distinction at every layer.

---

## 1. The Mastery Score

### Definition

The **Mastery Score** is a per-stage composite score, expressed as a percentage (0–100), that represents the depth and confidence of understanding demonstrated during the AI interview.

It is NOT:
- A percentage of tasks completed
- A self-assessed rating
- An average across all stages
- A single lifetime number

Each stage has its own mastery score. The score is determined by the interview, not by the study process.

### Score Composition

Each interview contains 5 primary questions — one per question type — plus up to 2 historical weakness questions when applicable.

Each primary question is scored on a **0–4 rubric**:

| Score | Label | Definition |
|---|---|---|
| 0 | No Answer | Travis does not answer, says "I don't know," or gives a completely unrelated response |
| 1 | Incorrect | Answer is factually wrong in a material way, or demonstrates a fundamental misconception |
| 2 | Partial | Answer is directionally correct but missing 1–2 critical aspects the stage explicitly taught |
| 3 | Correct | Answer is accurate, complete, and demonstrates command of the concept at the level the stage requires |
| 4 | Excellent | Answer is accurate, complete, and demonstrates genuine depth — connection to adjacent concepts, anticipation of tradeoffs, or insight beyond what the stage required |

**Maximum primary score:** 5 questions × 4 points = **20 points**

**Mastery Score calculation:**

```
MasteryScore = (TotalPointsEarned / TotalPossiblePoints) × 100
```

For a standard 5-question interview with no weakness questions:
- 20 points possible
- 17+ points = 85%+ = PASS

### Follow-up Question Score Adjustments

Follow-up questions do not add points. They adjust the score of the primary question:

- If follow-up reveals correct understanding that was unclear in the primary answer: primary score increases by 1 (up to max 4)
- If follow-up reveals a gap or misconception hidden by a surface-correct primary answer: primary score decreases by 1 (down to min 0)
- Maximum one adjustment per primary question regardless of follow-up count

### Confidence Score

Separate from the answer score. Not factored into pass/fail. Used only for weakness tracking.

| Confidence | Label | Definition |
|---|---|---|
| 1 | Hedged | Answer contains multiple hedges: "I think," "maybe," "I'm not sure but," "it might be" |
| 2 | Moderate | Answer is mostly direct with minor uncertainty markers |
| 3 | Confident | Answer is delivered as declarative statements without hedges |

A question scored 3/4 with Confidence 1 is a **fragile knowledge** flag. The answer was technically correct but not yet internalized. It enters the weakness tracker for future resurfacing despite the passing score.

---

## 2. The 85% Advancement Threshold

### Primary Threshold

To pass an interview and advance: **score ≥ 85% (17/20 points for a standard 5-question interview).**

### Hard Floor Rules

The following conditions cause an immediate FAIL regardless of the total score:

1. **Any question scored 0** — a complete blank means the concept was not engaged with
2. **Two or more questions scored 1** — multiple incorrect answers indicate a foundational gap, not a minor miss
3. **Architecture or Defense question scored below 2** — these are the most important question types for the stated goal of technical independence; weakness here cannot be offset by strength elsewhere

### Why 85% and Not 100%

100% is a memorization standard. 85% is a mastery standard. A score of 3/4 on a question means the concept is understood correctly. The 15% tolerance exists for:

- Partial answers that are correct at the level expected but could be deeper
- Minor imprecision in language that doesn't indicate a conceptual gap
- Valid alternative framings that were not anticipated in the rubric

An interview at exactly 85% (17/20) means: all five question types were answered at an acceptable level with no complete failures. That is an honest mastery signal.

---

## 3. Stage Completion Requirements

All five conditions must be satisfied. No exceptions. No partial credit.

**Condition 1: All tasks complete**  
Every task in the stage marked complete. Self-reported. The interview will surface gaps if tasks were marked without actual engagement.

**Condition 2: All challenges complete**  
Every challenge built, verified functional, and marked complete. Self-reported. The interview's Application question directly tests challenge content.

**Condition 3: Project submitted**  
Project URL or deliverable link stored in the system. For stage projects: a GitHub URL with working code. For chapter projects: a public URL plus GitHub repository link. A project link is required before an interview can begin.

**Condition 4: AI interview passed at 85%+**  
Score ≥ 17/20 on the standard 5-question interview, with no hard floor failures.

**Condition 5: No complete blanks**  
No question scored 0 in the passing interview. A 0 on any question is an automatic failure regardless of total score.

---

## 4. Chapter Completion Requirements

All chapter stages must be individually complete before the chapter itself completes.

**Additionally, the chapter project requires:**

1. Working code/deployment at a public URL
2. Architecture diagram committed to the repository
3. Workflow diagram committed to the repository
4. All required ADRs committed (minimums vary by chapter: 2–5)
5. All chapter project-specific completion criteria met (defined per project in the curriculum)

**Chapter Synthesis Interview:**  
The final stage of each chapter includes a chapter-level interview in addition to the stage interview. This interview:
- Covers integration of concepts across all stages in the chapter
- References the chapter project specifically
- Includes Connection questions that reach back to prior chapters
- Has the same 85% pass threshold
- Uses a 7-question format (5 primary + 2 synthesis questions that span multiple stages)
- Maximum: 7 × 4 = 28 points; threshold: 24 points (85.7%)

The chapter synthesis interview cannot be taken until all individual stage interviews in the chapter are passed.

---

## 5. Remediation Workflow

Triggered when an interview scores below 85% or any hard floor rule is violated.

### Step 1: Immediate Diagnosis

On interview failure, the system generates a remediation report identifying:

- Total score and points breakdown per question type
- Which question types failed (scored below 2)
- Which question types passed but are fragile (scored 3 with Confidence 1)
- The specific concepts that were missed (derived from question content, not just category)

Example output:

```
Interview Result: FAIL (14/20 — 70%)

Breakdown:
  Concept:      3/4 ✓  (fragile — confidence 1)
  Application:  1/4 ✗  (incorrect — API rate limit handling)
  Architecture: 2/4 ~  (partial — missing async considerations)
  Defense:      4/4 ✓
  Connection:   4/4 ✓

Hard floor: None triggered
Primary gaps: API error handling, async programming patterns

Remediation:
  1. Re-study Stage 11, Task 6 (Error Handling in Python) and Stage 17, Task 4 (Async routes)
  2. Rebuild Challenge 1 from Stage 11 from scratch — pay attention to the error types
  3. Minimum wait before re-interview: 48 hours
```

### Step 2: Minimum Wait Period

| Failure pattern | Minimum wait |
|---|---|
| First failure on a stage | 48 hours |
| Second consecutive failure on the same stage | 7 days |
| Third consecutive failure on the same stage | 7 days + mandatory approach change (different primary resource) |

The wait period is enforced in the application. The re-interview button is disabled until the wait expires.

**What Travis can do during the wait:**
- Re-study the specific tasks identified in the remediation report
- Rebuild failed challenges
- Add notes to ADRs
- Begin preparing for future stages (studying only, not marking complete)

**What Travis cannot do during the wait:**
- Take another interview for this stage
- Mark the stage complete
- Advance to the next stage

### Step 3: Targeted Re-study

The remediation report specifies exact tasks and challenges to re-engage — not "re-read everything." Re-study is targeted and specific.

If a Concept question failed: re-study the specific task where that concept was taught, not the entire stage.

If an Application question failed: rebuild the specific challenge that tested that application, not all challenges.

If an Architecture question failed: review relevant ADRs from prior chapter projects where that architectural pattern appeared.

### Step 4: Re-interview

A re-interview is a full 5-question interview, not a targeted quiz. The same question types are covered. Questions may differ from the original interview but test the same concepts.

Historical weakness questions from prior stages are still injected if applicable.

---

## 6. Weakness Tracking

### What Constitutes a Weakness

A weakness is recorded when any of the following occur:

| Trigger | Weakness type |
|---|---|
| Question scored 0 | Critical gap |
| Question scored 1 | Incorrect understanding |
| Question scored 2 | Incomplete understanding |
| Question scored 3 with Confidence 1 | Fragile knowledge |
| Same question type scored below 3 in two consecutive stage interviews | Pattern weakness |

### Weakness Record Structure

Each weakness record stores:

```
weakness_id:        unique identifier
stage_number:       which stage the weakness appeared in
question_type:      concept | application | architecture | defense | connection
concept_tested:     human-readable description of the specific concept tested
score:              0 | 1 | 2 | 3 (with confidence 1)
confidence:         1 | 2 | 3
interview_id:       reference to the source interview
date_identified:    timestamp
cleared:            boolean (default false)
cleared_date:       null until cleared
resurface_count:    number of times this weakness has been re-tested
last_resurface_date: timestamp of most recent resurfacing
```

### Weakness Severity Tiers

| Tier | Criteria | Resurfacing frequency |
|---|---|---|
| Critical | Score 0 or score 1 | Every 2 stages |
| Significant | Score 2 | Every 3 stages |
| Fragile | Score 3, Confidence 1 | Every 5 stages |
| Pattern | Same type fails in 2+ consecutive interviews | Every 2 stages until pattern breaks |

### Clearing a Weakness

A weakness is cleared when Travis scores 3+ with Confidence 2+ on a resurfaced version of the same concept.

A cleared weakness:
- No longer resurfaces on a regular schedule
- Is archived but not deleted
- May be cited in connection questions if a later stage directly builds on it
- Contributes to the "areas mastered" historical record

---

## 7. Historical Weakness Resurfacing

### Purpose

The forgetting curve is real. A concept mastered in Stage 5 may be forgotten by Stage 15. Resurfacing prevents this. It is not punishment — it is the mechanism that converts short-term performance into long-term retention.

### Resurfacing Schedule

At the start of each interview, the weakness tracker is queried. Weaknesses are injected into the interview as additional questions beyond the standard 5.

| Tier | First resurface | Second resurface | Third resurface |
|---|---|---|---|
| Critical | +2 stages | +3 stages | +5 stages |
| Significant | +3 stages | +5 stages | +8 stages |
| Fragile | +5 stages | +8 stages | +12 stages |

Example: A Critical weakness from Stage 5 resurfaces in Stage 7, then Stage 10, then Stage 15.

### Injection Rules

- Maximum 2 weakness questions added per interview
- If more than 2 weaknesses are due for resurfacing, prioritize by: (1) highest severity tier, (2) not resurfaced most recently
- Weakness questions do not affect the 85% pass threshold calculation — they are scored separately
- However: failing a resurfaced weakness question (scoring 0 or 1) generates a new remediation note even if the main interview passes
- The maximum total interview length is 7 questions (5 primary + 2 weakness)

### Resurfacing Question Generation

The AI Interviewer generates resurfacing questions by:
1. Looking up the original concept_tested field from the weakness record
2. Generating a question that tests the same concept from a different angle than the original
3. Ensuring the question references something Travis has built or learned since the original weakness (to test transfer, not memorization)

Example:
- Original weakness (Stage 5): "JWT token structure — scored 2, couldn't explain the signature component"
- Resurfacing question (Stage 10): "In the CRM API you built in Chapter 3, how does the JWT token verification work? What prevents a malicious user from modifying the payload?"

The resurfacing question is harder than the original because it requires Travis to apply the concept to something he has since built.

---

## 8. Progress Calculations

### Path Progress

```
PathProgress = (StagesCompleted / 29) × 100
```

A stage is "completed" only when all five completion conditions are satisfied. A stage with all tasks done but interview not yet passed does not count.

### Chapter Progress

```
ChapterProgress = (StagesCompletedInChapter / TotalStagesInChapter) × 100
```

### Stage Progress (in-progress stage)

Stage progress has three sub-components:

```
TaskProgress      = (TasksComplete / TotalTasks) × 100
ChallengeProgress = (ChallengesComplete / TotalChallenges) × 100
ProjectStatus     = "not started" | "in progress" | "submitted"
```

None of these contribute to the stage completion — they are informational only. Completion is binary and determined by the interview.

### Overall Mastery Index

A single number representing the quality of knowledge across completed stages:

```
MasteryIndex = Average(InterviewScore for all completed stages)
```

This is a trailing average of all interview scores, expressed as a percentage. A MasteryIndex of 91% means Travis consistently scores 91% on interviews, not that 91% of the path is complete.

The MasteryIndex is displayed on the dashboard. It is the primary signal of knowledge quality, not just quantity.

### Weak Areas Count

```
ActiveWeaknesses = Count(weakness records where cleared = false)
```

Displayed on the dashboard. Target is 0 active weaknesses. This number increases after every interview and decreases as weaknesses are cleared through resurfacing.

---

## 9. Streak Calculations

### Qualifying Activity

A day counts as active if Travis performs at least one of:
- Marks a task complete
- Marks a challenge complete
- Submits a project URL
- Completes a full interview attempt (pass or fail — attempting counts)
- Adds or updates an ADR

Reading the curriculum or navigating the app does not count.

### Streak Rules

- Streak increments at midnight local time if the previous calendar day had qualifying activity
- Streak resets to 0 if two or more consecutive calendar days pass without qualifying activity
- **Grace day rule:** One missed day per 7-calendar-day rolling window does not break the streak. It extends the streak window by one day. Maximum one grace day per week. The grace day must be used on a day adjacent to active days (not two consecutive misses).
- Streak is stored as an integer on the User record
- lastActiveAt is updated on every qualifying activity event

### Streak Significance

The streak is a consistency metric, not a quality metric. A high streak with low MasteryIndex means Travis is showing up but not retaining. Both numbers are shown on the dashboard together because neither alone tells the full story.

---

## 10. Failure Conditions

### Stage Failure

A stage interview fails when any of:
- Total score < 17/20 (below 85%)
- Any question scored 0
- Two or more questions scored 1
- Architecture or Defense question scored below 2

Consequence: remediation workflow is triggered. Stage cannot be completed until a passing interview is recorded.

### Escalating Failure

| Condition | Consequence |
|---|---|
| Second consecutive failure on the same stage | 7-day wait, remediation report includes note that study approach should change |
| Third consecutive failure on the same stage | 7-day wait + forced review of prerequisite stages (system identifies which prior stages have concepts that directly underlie the failing questions) |
| Failure on a stage that was previously passed (from resurfacing) | New weakness record created. Does not reverse stage completion. Does trigger a targeted remediation note. |

### What Never Causes Stage Reversal

Once a stage is marked complete (all 5 conditions satisfied), it is never un-completed. Poor performance on resurfacing questions adds to the weakness tracker but does not reopen the stage. The historical record is preserved.

The reason: reversal would be demoralizing and architecturally complex. The weakness tracker and resurfacing system handle retention without requiring regression.

---

## 11. Advancement Rules

### Stage-to-Stage

- Cannot start Stage N+1 until Stage N is complete (all 5 conditions)
- "Start" means: cannot take the Stage N+1 interview or mark Stage N+1 tasks complete
- "View" is always permitted: Travis can read any stage's curriculum content at any time

### Chapter-to-Chapter

- Cannot start Chapter N+1 until every stage in Chapter N is complete AND the chapter synthesis interview is passed
- Chapter synthesis interview becomes available after the final stage interview in the chapter is passed

### No Time-Based Advancement

There is no "advance after 30 days regardless of score." The only advancement trigger is a passing interview. A stage that takes Travis 3 weeks to pass takes 3 weeks. A stage that takes 2 days takes 2 days. The system does not penalize fast learners or force artificial pacing.

---

## 12. Retake Interview Rules

### When Retakes Are Available

| Scenario | Wait before retake |
|---|---|
| First failure on a stage | 48 hours minimum |
| Second consecutive failure on the same stage | 7 days minimum |
| Third+ consecutive failure on the same stage | 7 days minimum + forced prerequisite review |
| Passing score already recorded (seeking improvement) | Not applicable — re-interviews are not available for passing stages |

### Retake Format

A retake is a full 5-question interview. Not a targeted quiz. Not a subset of failed questions. The same format as the original.

Questions will differ from the previous interview but test the same concepts. The AI Interviewer has access to the previous interview transcript and will not ask the same questions — but will probe the same areas that were previously weak.

### Can Travis Choose Not to Retake?

There is no mechanism to skip a failed stage. The system prevents advancement until the interview is passed. The retake is not optional.

### Maximum Attempts

There is no maximum number of attempts. A stage may require 5 or 10 interviews. The system does not fail Travis out permanently. What changes with repeated failures:

- Wait periods increase
- Remediation reports become more specific
- Prerequisite review is triggered after three consecutive failures
- The dashboard reflects the difficulty Travis is having (interview attempt count per stage is visible)

---

## 13. Dashboard Mastery Calculations

The dashboard answers five questions. The mastery system provides the data for each.

**Question 1: What am I working on?**  
→ Current active stage. If no stage is active (chapter just completed): "Select next stage from Roadmap."

**Question 2: Why does this stage matter?**  
→ The `whyItMatters` field from the curriculum for the current stage.

**Question 3: What is the single next action?**  
→ Determined by this priority order:
1. If tasks remain incomplete → "Complete next task: [task title]"
2. If all tasks done but challenges remain → "Complete challenge: [challenge title]"
3. If all tasks and challenges done but no project submitted → "Submit your project"
4. If project submitted but interview not yet taken → "Begin your interview"
5. If interview failed → "Re-interview available in [X hours/days]" or "Begin remediation"
6. If stage complete → "Advance to Stage [N+1] on the Roadmap"

**Question 4: What am I intentionally not working on?**  
→ Parking Lot item count and most recent item title.

**Question 5: How far have I come?**  
→ Three numbers:
- Path Progress: N/29 stages complete (with progress bar)
- Mastery Index: trailing average interview score (e.g., "91% avg")
- Active Weaknesses: count of uncleared weakness records

---

## 14. Summary: The Complete Mastery Contract

A stage is complete when Travis can demonstrate, under AI interrogation, that he understands the concepts, can apply them, can architect with them, can defend his choices, and can connect them to prior learning.

Nothing else counts.

Not finishing the tasks.  
Not building the project.  
Not the time spent.  
Not the number of days on the stage.  

The interview is the grade.  
The interview is the only grade.  
85% is the minimum.  
And 85% with fragile knowledge is not the goal — it is the floor.
