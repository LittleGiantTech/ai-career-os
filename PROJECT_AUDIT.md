# Project Audit

**Date:** 2026-06-04  
**Build status:** Passing (no errors, no warnings)  
**Overall completion:** ~20%

---

## 1. Files That Currently Exist

### Application Source (`src/`)

```
src/
  actions/
    sprint.ts                   ← toggleTask (keep) + createSprint (dead code)

  app/
    (auth)/
      page.tsx                  ← Landing page
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
    (dashboard)/
      layout.tsx                ← Auth guard + sidebar + mobile nav
      dashboard/page.tsx        ← Dashboard (partially functional)
      sprint/page.tsx           ← Sprint view (partially functional)
      sprint/new/page.tsx       ← DEAD CODE — user-created sprint form
    layout.tsx                  ← Root layout (ClerkProvider, ThemeProvider)
    page.tsx                    ← Redirect → /dashboard

  components/
    dashboard/
      stats-row.tsx             ← Stage, streak, status cards
      today-focus.tsx           ← Next incomplete task banner
    layout/
      mobile-nav.tsx            ← Bottom tab bar (mobile)
      nav-items.ts              ← Nav route definitions
      sidebar.tsx               ← Desktop sidebar
    sprint/
      current-sprint-card.tsx   ← Sprint card on dashboard
      no-sprint-state.tsx       ← Empty state linking to /sprint/new (dead link)
      sprint-form.tsx           ← DEAD CODE — user-created sprint form UI
      sprint-task-item.tsx      ← Interactive task checkbox (keep)
      task-list-input.tsx       ← DEAD CODE — dynamic task input for form
    theme-provider.tsx
    ui/
      badge.tsx, button.tsx, card.tsx, input.tsx, progress.tsx,
      separator.tsx, skeleton.tsx, tooltip.tsx

  lib/
    constants.ts                ← MAX_SPRINT_TASKS, STAGE_LABELS (stale — only 6 entries)
    prisma.ts                   ← PrismaClient singleton via PrismaPg adapter
    user.ts                     ← getOrCreateUser (missing streak update)
    utils.ts                    ← cn() helper

  proxy.ts                      ← Clerk auth middleware
```

### Prisma (`prisma/`)

```
prisma/
  migrations/
    20260603172513_init/migration.sql   ← Initial migration (applied)
  schema.prisma                         ← 4 models (incomplete vs ARCHITECTURE.md)
  seed.ts                               ← Seeds Python Fundamentals sprint (uses old schema)
```

### Design Documents (root)

```
ARCHITECTURE.md      ← Full system architecture (approved)
CLAUDE.md            ← Project rules and mission
CURRICULUM.md        ← 29-stage curriculum (approved)
VISION.md            ← Product vision (approved)
ai-interviewer.md    ← AI interviewer design (approved)
mastery-system.md    ← Mastery scoring system (approved)
```

---

## 2. Routes That Currently Exist

| Route | Status | Notes |
|---|---|---|
| `/` | Working | Redirects to `/dashboard` |
| `/` (via auth group) | Working | Landing page — amber grid, sign-in/sign-up CTAs |
| `/sign-in` | Working | Clerk hosted sign-in |
| `/sign-up` | Working | Clerk hosted sign-up |
| `/dashboard` | Partially working | Renders but data is stale (see §7) |
| `/sprint` | Partially working | Shows active sprint; links to dead route |
| `/sprint/new` | Working but obsolete | User-created sprint form — wrong product paradigm |
| `/roadmap` | 404 | Not implemented |
| `/roadmap/[stage]` | 404 | Not implemented |
| `/parking-lot` | 404 | Not implemented |
| `/interview/*` | 404 | Not implemented |

---

## 3. Components That Currently Exist

### Keep — functional and aligned with architecture

| Component | What it does | Status |
|---|---|---|
| `Sidebar` | Desktop nav with amber active states, UserButton | Functional |
| `MobileNav` | Fixed bottom tab bar | Functional |
| `ThemeProvider` | Dark mode wrapper | Functional |
| `SprintTaskItem` | Interactive task checkbox, calls `toggleTask` | Functional |
| `CurrentSprintCard` | Sprint card with progress bar and task list | Partially functional |
| `TodayFocus` | Shows next incomplete task | Partially functional |
| `StatsRow` | Stage, streak, status stat cards | Partially functional |
| All `ui/` components | shadcn/ui primitives | Functional |

### Dead — implements obsolete user-created sprint paradigm

| Component | Why dead |
|---|---|
| `SprintForm` | User-created sprints eliminated; replaced by `startStage` |
| `TaskListInput` | Dynamic task input for SprintForm |
| `NoSprintState` | Links to `/sprint/new` (wrong destination) |

---

## 4. Database Models That Currently Exist

**Deployed in Supabase (4 models):**

| Model | Fields | Status |
|---|---|---|
| `User` | id, clerkId, email, name, currentStage, streak, lastActiveAt | Missing: no indices; streak never written |
| `Sprint` | id, userId, title, goal, stage, durationDays, isActive, completedAt, projectTitle, projectDescription, projectUrl, completionCriteria | Missing: stageKey, chapterNumber, architectureDiagramUrl, workflowDiagramUrl, adrCount |
| `SprintTask` | id, sprintId, title, isComplete, order, completedAt | Missing: type enum (TASK/CHALLENGE/KNOWLEDGE_CHECK) |
| `ParkingLotItem` | id, userId, title, description, category | Complete for current scope |
| `ParkingLotCategory` | TOOL, FRAMEWORK, CONCEPT, TECHNOLOGY, OTHER | Complete |

**Required but missing (per ARCHITECTURE.md):**

| Model | Purpose |
|---|---|
| `Interview` | One record per interview attempt |
| `InterviewSession` | Conversation state, question queue, resumption |
| `InterviewTranscript` | Full Q&A log after interview completes |
| `InterviewQuestion` | Per-question scores, confidence, weakness flags |
| `Weakness` | Tracked weak areas with resurfacing schedule |
| `ChapterCompletion` | Chapter project submission + synthesis interview |
| `SprintTaskType` enum | TASK, CHALLENGE, KNOWLEDGE_CHECK |
| `InterviewStatus` enum | PENDING, IN_PROGRESS, AWAITING_EVALUATION, COMPLETE, EXPIRED |
| `WeaknessSeverity` enum | CRITICAL, SIGNIFICANT, FRAGILE, PATTERN |
| `QuestionType` enum | CONCEPT, APPLICATION, ARCHITECTURE, DEFENSE, CONNECTION, WEAKNESS_RETEST |
| `SessionStatus` enum | ACTIVE, PAUSED, COMPLETE, EXPIRED |

---

## 5. Server Actions That Currently Exist

| Action | File | Status |
|---|---|---|
| `toggleTask` | `actions/sprint.ts` | Functional — marks task complete/incomplete, revalidates dashboard and sprint paths |
| `createSprint` | `actions/sprint.ts` | DEAD CODE — implements user-created sprint paradigm; must be deleted |

**Missing (per ARCHITECTURE.md):**

| Action | File | Purpose |
|---|---|---|
| `startStage` | `actions/stage.ts` | Creates Sprint + SprintTasks from curriculum definition |
| `completeStage` | `actions/stage.ts` | Validates completion, advances currentStage, creates ChapterCompletion |
| `createInterview` | `actions/interview.ts` | Creates Interview + InterviewSession, builds question queue |
| `submitAnswer` | `api/interview/[sessionId]/respond` | Streaming endpoint — submits answer, calls Claude, returns next question |
| `triggerEvaluation` | Background job | Runs evaluation pass, creates InterviewQuestion records, updates Weakness |

---

## 6. What Is Fully Functional

1. **Authentication** — Clerk sign-in, sign-up, session management, proxy middleware protecting all non-public routes. `/__clerk/(.*)` correctly included in matcher.

2. **App shell** — Sidebar (desktop), MobileNav (mobile), route-group-based authenticated layout, server-side auth guard with redirect.

3. **Landing page** — Amber grid aesthetic, correct messaging, sign-in/sign-up CTAs.

4. **Database connection** — Supabase PostgreSQL via Prisma v7 + `@prisma/adapter-pg`. Connection pooler (`DATABASE_URL`) for runtime, direct URL (`DIRECT_URL`) for migrations. Initial migration applied.

5. **Task toggle** — `toggleTask` server action correctly verifies ownership, toggles `isComplete`, sets `completedAt`, revalidates both `/dashboard` and `/sprint`.

6. **Root layout** — ClerkProvider, ThemeProvider (dark default, no system override), TooltipProvider all correctly wired.

---

## 7. What Is Partially Implemented

### Dashboard (`/dashboard`)
- Renders correctly with `TodayFocus`, `CurrentSprintCard`, `StatsRow`
- **Broken:** `STAGE_LABELS` in `constants.ts` only covers stages 1–6; `User.currentStage` defaults to 1, so any stage beyond 6 displays `"Stage N"` with no label
- **Broken:** `StatsRow` Status card is hardcoded to `"Active"` regardless of whether a sprint exists
- **Broken:** Streak is never written — always displays `0`
- **Missing:** `getNextAction()` — the dashboard does not answer "What should I do next?" with the priority logic defined in ARCHITECTURE.md

### Sprint page (`/sprint`)
- Shows active sprint title, goal, day counter, progress bar, task list, project card
- **Broken:** "Start a sprint" button links to `/sprint/new` (dead route in new paradigm)
- **Broken:** `STAGE_LABELS` only covers 6 entries — stage labels break after Stage 6
- **Missing:** No mastery/interview integration — no "Begin Interview" CTA when all tasks are done
- **Missing:** No `SprintTask.type` differentiation — tasks and challenges treated identically

### `CurrentSprintCard`
- Renders sprint header, progress bar, task list, project badge
- **Broken:** `NoSprintState` links to `/sprint/new` — wrong destination

### `TodayFocus`
- Correctly surfaces next incomplete task
- **Broken:** No distinction between TASK and CHALLENGE types (type field doesn't exist in schema yet)

### `getOrCreateUser`
- Creates User record on first login
- **Missing:** Never updates `streak` or `lastActiveAt` — both fields remain at defaults forever

### `constants.ts`
- `MAX_SPRINT_TASKS` is correct
- `STAGE_LABELS` is stale — covers only 6 stages (old architecture), needs to be 29 stages or removed when `curriculum.ts` is the source of truth

---

## 8. What Is Not Implemented

| System | Unblocked by |
|---|---|
| `src/lib/curriculum.ts` — 29 stages, TypeScript types, helper functions | Nothing (implement first) |
| Schema migration — 6 new models, 5 new enums, 5 new fields | Nothing (implement second) |
| Dead code removal | Nothing (can do anytime) |
| `src/lib/stage.ts` — `isStageViewable`, `isStageStartable`, `isStageComplete`, `isChapterComplete` | `curriculum.ts` |
| `src/lib/mastery.ts` — score calculation, weakness identification, streak | Schema migration |
| `src/actions/stage.ts` — `startStage`, `completeStage` | `curriculum.ts` + schema migration |
| Roadmap page (`/roadmap`) | `curriculum.ts` + `stage.ts` |
| Roadmap stage detail (`/roadmap/[stage]`) | `curriculum.ts` |
| Sprint page redesign (curriculum-driven, interview CTA) | `curriculum.ts` + schema migration |
| Dashboard redesign (`getNextAction`-driven) | `stage.ts` + `mastery.ts` |
| Interview creation + session management | Schema migration + `mastery.ts` |
| Interview UI (live streaming conversation) | Interview session architecture |
| Interview evaluation + scoring | Schema migration + Anthropic SDK |
| Weakness tracking and resurfacing | Schema migration + `mastery.ts` |
| Remediation report display | Interview system |
| Parking Lot UI | Schema (exists), just no pages |
| Chapter completion tracking | Schema migration |

---

## 9. Dead Code That Should Be Removed

| Item | Location | Reason |
|---|---|---|
| `/sprint/new` page | `src/app/(dashboard)/sprint/new/page.tsx` | User-created sprints eliminated by product pivot |
| `SprintForm` component | `src/components/sprint/sprint-form.tsx` | Implements the deleted user-created sprint form |
| `TaskListInput` component | `src/components/sprint/task-list-input.tsx` | Input widget for deleted SprintForm |
| `createSprint` function | `src/actions/sprint.ts` | Replaced by `startStage` |
| `CreateSprintInput` type | `src/actions/sprint.ts` | Used only by `createSprint` |
| `CreateSprintResult` type | `src/actions/sprint.ts` | Used only by `createSprint` |
| `STAGE_LABELS` constant | `src/lib/constants.ts` | Only covers 6 stages; will be superseded by `curriculum.ts` helper functions |
| `NoSprintState` component | `src/components/sprint/no-sprint-state.tsx` | Links to `/sprint/new`; the empty-state message and destination both change with the new architecture |

---

## 10. Technical Debt Discovered

| Debt | Location | Severity | Notes |
|---|---|---|---|
| `STAGE_LABELS` only covers 6 stages | `constants.ts` | High | Any user on Stage 7+ sees broken label. Must be removed when `curriculum.ts` ships. |
| `Sprint.stage` vs `Sprint.stageNumber` | `schema.prisma` | High | Field is named `stage` in schema, `stageNumber` in ARCHITECTURE.md. Migration must rename or both names must be reconciled. |
| Streak never updated | `lib/user.ts` | High | `User.streak` and `User.lastActiveAt` default to 0/null and are never written. Dashboard streak display is always 0. |
| `getOrCreateUser` has no streak logic | `lib/user.ts` | High | The architecture defines streak logic in `getOrCreateUser`. It is missing. |
| `StatsRow` Status hardcoded | `stats-row.tsx` | Medium | Always renders "Active — sprint in progress" regardless of actual sprint state. |
| `NoSprintState` links to dead route | `no-sprint-state.tsx` | Medium | Both `CurrentSprintCard` and `/sprint` page show a "Start a sprint" button linking to `/sprint/new`. |
| `sprint/page.tsx` links to `/sprint/new` | `sprint/page.tsx:32` | Medium | Must change to `/roadmap` after new architecture ships. |
| `seed.ts` uses old schema | `prisma/seed.ts` | Medium | Creates sprint without `stageKey` or `chapterNumber`. Will fail after migration adds `@@unique([userId, stageKey])`. |
| Root `/` redirects to `/dashboard` | `src/app/page.tsx` | Low | The landing page lives at `(auth)/page.tsx` but the root page immediately redirects. Unauthenticated users hit `/dashboard`, get bounced to `/sign-in` by middleware, then land on the Clerk-hosted sign-in. They never see the custom landing page. Consider making the root the landing page for unauthenticated users. |
| No Anthropic SDK installed | `package.json` | High | The interview system requires `@anthropic-ai/sdk`. Not yet a dependency. Cannot implement interview without it. |
| `AI_INTERVIEW_MODEL` constant not yet defined | `constants.ts` | Medium | ARCHITECTURE.md requires a single source of truth constant. Currently missing. |
| `prisma.config.ts` migration URL fallback | `prisma.config.ts` | Low | Falls back to `DATABASE_URL` if `DIRECT_URL` is not set. Could cause migrations to run against the pooler on a fresh clone. |
| No `@@unique([userId, stageKey])` constraint | `schema.prisma` | High | ARCHITECTURE.md defines this to prevent duplicate sprints per stage. Not yet in schema. |
| `PrismaPg` constructor called without null check | `lib/prisma.ts` | Low | `process.env.DATABASE_URL!` — non-null assertion. Will throw cryptic error at runtime if env var is missing. |

---

## PROJECT_AUDIT.md Summary

### Current Completion: ~20%

| System | Status | % of total product |
|---|---|---|
| Authentication (Clerk, middleware, auth pages) | Complete | 8% |
| Infrastructure (DB connection, root layout, app shell) | Complete | 7% |
| Landing page | Complete | 2% |
| Dashboard (basic render) | Partial | 3% |
| Sprint view (basic render) | Partial | 3% |
| Task toggle (persistence) | Complete | 2% |
| Design documents (Vision, Curriculum, Architecture, Mastery, Interviewer) | Complete | Not counted as product code |
| `curriculum.ts` | Not started | 10% |
| Schema migration (new models) | Not started | 5% |
| Stage unlock logic | Not started | 5% |
| Mastery library | Not started | 5% |
| `startStage` / `completeStage` | Not started | 5% |
| Roadmap UI | Not started | 10% |
| Sprint page redesign | Not started | 5% |
| Dashboard redesign | Not started | 5% |
| Interview system | Not started | 15% |
| Parking Lot | Not started | 3% |
| Weakness tracking | Not started | 5% |
| Remediation system | Not started | 3% |

---

### Completed Systems

- Clerk authentication (sign-in, sign-up, proxy middleware, ClerkProvider)
- Supabase + Prisma v7 connection (pooler + direct URL, pg adapter)
- Next.js 16 App Router with TypeScript, Tailwind, shadcn/ui
- App shell (sidebar, mobile nav, auth guard, route groups)
- Landing page
- Initial database schema (4 models, 1 enum) — migrated and live
- `toggleTask` server action (functional, persistent, authorized)
- `getOrCreateUser` (creates user record on first auth — missing streak logic)

---

### Missing Systems (in priority order)

1. `curriculum.ts` — blocks everything downstream
2. Schema migration — blocks all mastery/interview features
3. Dead code removal — reduces confusion immediately
4. `lib/stage.ts` — stage unlock logic
5. `lib/mastery.ts` — scoring, streak, weakness identification
6. `actions/stage.ts` — `startStage`, `completeStage`
7. Roadmap UI (`/roadmap`, `/roadmap/[stage]`)
8. Sprint page redesign (curriculum-driven, no creation form)
9. Dashboard redesign (`getNextAction`-driven)
10. Anthropic SDK installation
11. Interview system (session, streaming, evaluation)
12. Weakness tracking and resurfacing
13. Parking Lot UI

---

### Risks

| Risk | Severity | Notes |
|---|---|---|
| `curriculum.ts` is ~1,500–2,000 lines of carefully structured TypeScript | High | Errors in stage data (wrong stage numbers, missing fields, broken keys) propagate silently into the DB. Every downstream feature depends on its correctness. |
| Schema migration while live data exists | Medium | The seed sprint has no `stageKey`. Adding `@@unique([userId, stageKey])` requires either a data migration or deleting existing sprint rows first. |
| Prisma v7 is new and documentation is sparse | Medium | Already encountered breaking changes (no `datasourceUrl` in constructor, `url` removed from schema.prisma). Future migrations may hit similar issues. |
| Interview streaming architecture is the most complex piece | High | Multi-turn, stateful, browser-close recovery, async evaluation pass. No streaming API route exists yet. This is the largest implementation risk in the project. |
| `STAGE_LABELS` stale reference | Medium | Any code that reads `STAGE_LABELS[user.currentStage]` will silently show `undefined` for stages 7–29. Two components currently do this. |
| Dead code routes still registered | Low | `/sprint/new` is a working route that implements the wrong product. A user who navigates directly to it gets the old user-created sprint form. |

---

### Recommended Next Implementation Order

```
Step 1   Delete dead code
         → Remove /sprint/new, SprintForm, TaskListInput, createSprint
         → Unambiguous codebase before adding new systems
         → 1–2 hours

Step 2   Write src/lib/curriculum.ts
         → All 29 stages, complete TypeScript types, helper functions
         → FIRST substantive artifact; everything downstream depends on it
         → 1–2 days

Step 3   Update schema.prisma + run migration
         → Add 6 new models, 5 enums, 5 new fields on existing models
         → Rename Sprint.stage → Sprint.stageNumber (or add stageNumber alongside)
         → Handle seed data conflict (stageKey constraint)
         → 2–4 hours

Step 4   Update src/lib/constants.ts
         → Add AI_INTERVIEW_MODEL constant
         → Remove stale STAGE_LABELS (replaced by curriculum.ts helpers)
         → 30 minutes

Step 5   Write src/lib/stage.ts
         → isStageViewable, isStageStartable, isStageComplete, isChapterComplete
         → 2–3 hours

Step 6   Write src/lib/mastery.ts
         → calculateInterviewScore, determinePassed, identifyWeaknesses
         → calculateMasteryIndex, updateStreak
         → 2–3 hours

Step 7   Update src/lib/user.ts
         → Add streak update logic to getOrCreateUser
         → 1 hour

Step 8   Write src/actions/stage.ts
         → startStage (reads curriculum, creates Sprint + SprintTasks)
         → completeStage (validates, advances currentStage, ChapterCompletion)
         → 2–4 hours

Step 9   Redesign sprint page (/sprint)
         → Curriculum-driven: reads resources, descriptions from curriculum.ts
         → Removes /sprint/new reference
         → Phase visibility (tasks → challenges → project → interview CTA)
         → 1–2 days

Step 10  Build roadmap UI (/roadmap, /roadmap/[stage])
         → All 29 stages, chapter groupings, lock/unlock states
         → Stage detail page with full content
         → 1–2 days

Step 11  Redesign dashboard
         → getNextAction() drives the primary CTA
         → MasteryIndex, active weakness count, streak
         → 1 day

Step 12  Install Anthropic SDK + build interview system
         → npm install @anthropic-ai/sdk
         → InterviewSession management, streaming API route
         → Evaluation pass, InterviewQuestion records, Weakness creation
         → 3–5 days

Step 13  Build parking lot UI
         → 1 day
```
