# AI Engineer OS — System Architecture

**Version:** 1.0  
**Status:** Approved for implementation  
**Scope:** Full system architecture for the AI Product Engineer curriculum application

---

## Assumptions Challenged Before Finalizing

**"Sprint = Stage"** — Confirmed. One Sprint record per curriculum stage. A Sprint is the user's mutable instance of an immutable curriculum stage.

**"Chapter synthesis interview belongs to its own Sprint"** — Rejected. The chapter synthesis interview is attached to the chapter-ending stage's Sprint (e.g., Stage 6's Sprint holds both the stage interview and the chapter synthesis interview). The `isChapterSynthesis` flag on the Interview record distinguishes them. No separate Sprint needed.

**"User.currentStage advances after stage interview passes"** — Rejected for chapter-ending stages. For chapter-ending stages, `currentStage` advances only after BOTH the stage interview AND the chapter synthesis interview pass AND the chapter project is submitted. The `completeStage` server action enforces this.

**"Evaluation is synchronous"** — Rejected. The evaluation call to Claude for a full interview transcript takes 30–60 seconds. Travis should not wait synchronously. The interview transitions to `AWAITING_EVALUATION` status. The evaluation runs as a background job. The results page polls for completion.

**"curriculum.ts needs version tracking"** — Rejected for now. Single user. Curriculum changes are code deployments. If structural changes (adding/removing tasks mid-sprint) are needed, they are handled as one-off migrations at that time. No versioning system added to MVP.

**"Weakness resurfacing by date"** — Rejected. Resurfacing by stage number is more deterministic. Store `nextResurfaceStage: Int` on Weakness. When building Stage N's interview, query weaknesses where `nextResurfaceStage <= N` and `cleared = false`.

**"The evaluation call can fail silently"** — Rejected. If the evaluation call fails (API error, parse error, timeout), the Interview stays in `AWAITING_EVALUATION` status and a retry mechanism re-attempts the evaluation. Travis is never left in limbo with no score.

---

## 1. Database Architecture

### Complete Schema

```prisma
// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

enum ParkingLotCategory {
  TOOL
  FRAMEWORK
  CONCEPT
  TECHNOLOGY
  OTHER
}

enum SprintTaskType {
  TASK
  CHALLENGE
  KNOWLEDGE_CHECK  // reserved for future AI Coach — not yet used
}

enum InterviewStatus {
  PENDING              // created, not yet started
  IN_PROGRESS          // actively being conducted
  AWAITING_EVALUATION  // all questions answered, evaluation call not yet complete
  COMPLETE             // evaluated, score and pass/fail recorded
  EXPIRED              // session inactive > 72 hours
}

enum SessionStatus {
  ACTIVE    // interview in progress
  PAUSED    // browser closed, resumable
  COMPLETE  // all questions answered
  EXPIRED   // inactive > 72 hours
}

enum QuestionType {
  CONCEPT
  APPLICATION
  ARCHITECTURE
  DEFENSE
  CONNECTION
  WEAKNESS_RETEST  // resurfaced historical weakness
}

enum WeaknessSeverity {
  CRITICAL     // score 0 or 1
  SIGNIFICANT  // score 2
  FRAGILE      // score 3 with confidence 1
  PATTERN      // same type fails in 2+ consecutive stage interviews
}

// ─────────────────────────────────────────────
// CORE MODELS
// ─────────────────────────────────────────────

model User {
  id                  String              @id @default(cuid())
  clerkId             String              @unique
  email               String              @unique
  name                String?
  currentStage        Int                 @default(1)   // 1–29
  streak              Int                 @default(0)
  lastActiveAt        DateTime?
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  sprints             Sprint[]
  parkingLot          ParkingLotItem[]
  interviews          Interview[]
  weaknesses          Weakness[]
  chapterCompletions  ChapterCompletion[]
}

model Sprint {
  id                  String        @id @default(cuid())
  userId              String
  user                User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Curriculum snapshot (written at startStage time, never updated)
  stageKey            String        // "html-fundamentals" — stable curriculum identifier
  stageNumber         Int           // 1–29
  chapterNumber       Int           // 1–6
  title               String
  goal                String
  durationDays        Int
  projectTitle        String?       // null for non-chapter-end stages
  projectDescription  String?
  completionCriteria  String?

  // Mutable state
  isActive            Boolean       @default(true)
  completedAt         DateTime?

  // Project submission (chapter-end stages only)
  projectUrl              String?
  architectureDiagramUrl  String?
  workflowDiagramUrl      String?
  adrCount                Int?

  createdAt           DateTime      @default(now())
  updatedAt           DateTime      @updatedAt

  tasks               SprintTask[]
  interviews          Interview[]

  @@unique([userId, stageKey])  // one sprint per stage per user, enforced at DB level
  @@index([userId, isActive])
  @@index([userId, stageNumber])
}

model SprintTask {
  id          String         @id @default(cuid())
  sprintId    String
  sprint      Sprint         @relation(fields: [sprintId], references: [id], onDelete: Cascade)

  type        SprintTaskType @default(TASK)
  title       String
  isComplete  Boolean        @default(false)
  order       Int            @default(0)
  completedAt DateTime?
  createdAt   DateTime       @default(now())

  @@index([sprintId, type])
  @@index([sprintId, isComplete])
}

model ParkingLotItem {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  description String?
  category    ParkingLotCategory  @default(TOOL)
  createdAt   DateTime            @default(now())

  @@index([userId])
}

// ─────────────────────────────────────────────
// INTERVIEW MODELS
// ─────────────────────────────────────────────

model Interview {
  id                      String          @id @default(cuid())
  userId                  String
  user                    User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  sprintId                String
  sprint                  Sprint          @relation(fields: [sprintId], references: [id], onDelete: Cascade)

  stageNumber             Int
  chapterNumber           Int
  isChapterSynthesis      Boolean         @default(false)
  attemptNumber           Int             // 1, 2, 3... per stage (or synthesis)

  status                  InterviewStatus @default(PENDING)

  // Timing
  startedAt               DateTime?
  completedAt             DateTime?       // all questions answered
  evaluatedAt             DateTime?       // evaluation pass complete
  expiresAt               DateTime?       // 72 hours after startedAt
  reinterviewAvailableAt  DateTime?       // populated on failure

  // Results (populated by evaluation pass)
  totalScore              Int?
  maxScore                Int?
  percentage              Float?
  passed                  Boolean?
  failReason              String?
  remediationReport       Json?           // RemediationReport structure

  // Evaluation retry state
  evaluationAttempts      Int             @default(0)
  lastEvaluationError     String?

  createdAt               DateTime        @default(now())
  updatedAt               DateTime        @updatedAt

  session                 InterviewSession?
  transcript              InterviewTranscript?
  questions               InterviewQuestion[]
  sourceWeaknesses        Weakness[]      @relation("SourceInterview")
  clearedWeaknesses       Weakness[]      @relation("ClearedInterview")

  @@index([userId, stageNumber])
  @@index([userId, status])
  @@index([sprintId])
}

model InterviewSession {
  id                    String        @id @default(cuid())
  interviewId           String        @unique
  interview             Interview     @relation(fields: [interviewId], references: [id], onDelete: Cascade)

  // Pre-generated question queue (JSON array of Question objects)
  // Structure: [{type, topic, questionText, isWeaknessRetest, sourceWeaknessId}]
  questionQueue         Json

  // Mutable conversation state
  conversationHistory   Json          @default("[]")  // [{role, content, timestamp, questionIndex}]
  currentQuestionIndex  Int           @default(0)
  currentFollowUpCount  Int           @default(0)

  // Partial scores (recorded as each question completes)
  // Structure: [{questionIndex, score, confidence, weaknessFlagged}]
  partialScores         Json          @default("[]")

  status                SessionStatus @default(ACTIVE)
  lastActivityAt        DateTime      @default(now())
  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt
}

model InterviewTranscript {
  id                String    @id @default(cuid())
  interviewId       String    @unique
  interview         Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)

  // Full conversation log after interview completes
  // Structure: [{role, content, timestamp, questionType?, isFollowUp?, questionIndex?}]
  entries           Json

  totalTurns        Int
  durationMinutes   Int?

  createdAt         DateTime  @default(now())
}

model InterviewQuestion {
  id                  String       @id @default(cuid())
  interviewId         String
  interview           Interview    @relation(fields: [interviewId], references: [id], onDelete: Cascade)

  questionType        QuestionType
  conceptTested       String        // human-readable: "JWT token signature verification"
  questionText        String        // the actual question asked
  responseText        String        // Travis's final answer (concatenated if multi-turn)
  followUpCount       Int           @default(0)

  score               Int           // 0–4
  confidence          Int           // 1–3
  weaknessFlagged     Boolean       @default(false)
  weaknessDescription String?
  notes               String?       // evaluator's internal notes

  order               Int           // position in the interview
  isWeaknessRetest    Boolean       @default(false)
  sourceWeaknessId    String?       // if isWeaknessRetest, which weakness was retested

  createdAt           DateTime      @default(now())

  @@index([interviewId])
  @@index([interviewId, questionType])
}

// ─────────────────────────────────────────────
// MASTERY MODELS
// ─────────────────────────────────────────────

model Weakness {
  id                    String          @id @default(cuid())
  userId                String
  user                  User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  stageNumber           Int
  chapterNumber         Int
  questionType          QuestionType
  conceptTested         String          // "exponential backoff in API rate limiting"
  description           String          // detailed description of what was wrong

  initialScore          Int             // 0–3
  initialConfidence     Int             // 1–3
  severity              WeaknessSeverity

  sourceInterviewId     String
  sourceInterview       Interview       @relation("SourceInterview", fields: [sourceInterviewId], references: [id])

  // Resurfacing (stage-number-based, not date-based)
  resurfaceCount        Int             @default(0)
  nextResurfaceStage    Int             // the stage number at which this should next be retested
  lastResurfacedStage   Int?

  // Clearing
  cleared               Boolean         @default(false)
  clearedAt             DateTime?
  clearedInInterviewId  String?
  clearedInterview      Interview?      @relation("ClearedInterview", fields: [clearedInInterviewId], references: [id])

  createdAt             DateTime        @default(now())
  updatedAt             DateTime        @updatedAt

  @@index([userId, cleared])
  @@index([userId, nextResurfaceStage, cleared])
}

model ChapterCompletion {
  id                      String    @id @default(cuid())
  userId                  String
  user                    User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  chapterNumber           Int

  // Chapter synthesis interview reference
  synthesisInterviewId    String?   @unique
  synthesisScore          Float?
  synthesisPassedAt       DateTime?

  // Chapter project artifacts
  projectUrl              String?
  architectureDiagramUrl  String?
  workflowDiagramUrl      String?
  adrCount                Int       @default(0)

  completedAt             DateTime?

  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  @@unique([userId, chapterNumber])
}
```

### Migration Strategy

The current schema has 4 models (User, Sprint, SprintTask, ParkingLotItem). The target has 10 models. This requires a single migration that:

1. Adds `SprintTaskType` enum and `type` column to `SprintTask`
2. Adds `stageKey`, `chapterNumber`, `architectureDiagramUrl`, `workflowDiagramUrl`, `adrCount` to `Sprint`
3. Adds `@@unique([userId, stageKey])` constraint to `Sprint`
4. Creates `Interview`, `InterviewSession`, `InterviewTranscript`, `InterviewQuestion`
5. Creates `Weakness`
6. Creates `ChapterCompletion`
7. Adds `interviews`, `weaknesses`, `chapterCompletions` relations to `User`
8. Adds `interviews` relation to `Sprint`

The `Sprint.stage` field (already Int) maps to `stageNumber` in the new schema. Existing data: the seed sprint has `stage: 2`. A data migration must set `stageKey` on existing Sprint rows. Since only one sprint exists (seed data), this is trivial.

### Key Indexes

Performance-critical query patterns and their required indexes:

| Query pattern | Index |
|---|---|
| Active sprint for user | `@@index([userId, isActive])` on Sprint |
| Sprint by stage | `@@index([userId, stageNumber])` on Sprint |
| Tasks by type | `@@index([sprintId, type])` on SprintTask |
| Incomplete tasks | `@@index([sprintId, isComplete])` on SprintTask |
| Interviews by stage | `@@index([userId, stageNumber])` on Interview |
| Active interviews | `@@index([userId, status])` on Interview |
| Pending weaknesses | `@@index([userId, nextResurfaceStage, cleared])` on Weakness |

---

## 2. Curriculum Architecture

### TypeScript Type Definitions

`src/lib/curriculum.ts` is the source of truth for all learning content. It exports a typed constant. It is never written to by the application — only read.

```typescript
// src/lib/curriculum.ts

export type Resource = {
  title: string
  author: string
  url: string
  type: "video" | "documentation" | "article" | "book"
  durationMinutes?: number
}

export type CurriculumTask = {
  key: string         // "task-variables" — stable identifier, matches SprintTask.title at creation
  title: string
  description: string // one sentence
}

export type MiniChallenge = {
  key: string         // "challenge-string-transformer"
  title: string
  description: string
  hint?: string
}

export type InterviewBlueprint = {
  concept: string
  application: string
  architecture: string
  defense: string
  connection: string  // must reference a prior stage by name
}

export type ChapterProject = {
  title: string
  description: string
  requirements: string[]
  requiredArtifacts: {
    architectureDiagram: boolean
    workflowDiagram: boolean
    minAdrCount: number
    additionalNotes?: string[]
  }
}

export type KnowledgeCheck = {
  question: string
  type: "free-text" | "multiple-choice"
  options?: string[]
  correctAnswer?: string
  aiEvalContext?: string
}

export type CurriculumStage = {
  // Identity
  key: string             // "html-fundamentals" — stable, kebab-case, never changes
  number: number          // 1–29
  chapter: number         // 1–6
  chapterTitle: string

  // Chapter structure
  isChapterEnd: boolean   // true = this stage's sprint includes the chapter project
  chapterProject?: ChapterProject  // defined only when isChapterEnd = true

  // Content
  title: string
  description: string     // 2–3 sentences: what this stage covers
  whyItMatters: string    // 1–2 paragraphs: why this exists in the path

  estimatedDays: number   // mastery-based estimate, not task completion

  resources: {
    primary: Resource
    reference: Resource
    deepDive?: Resource
  }

  tasks: CurriculumTask[]           // 5–8, ordered
  miniChallenges: MiniChallenge[]   // 1–3

  completionCriteria: string[]
  interviewBlueprint: InterviewBlueprint
  reflectionPrompts: string[]       // 3–5, display-only, never tracked

  // Future: AI Coach integration point
  knowledgeChecks?: KnowledgeCheck[]  // empty for all stages in initial release
}

// The complete curriculum
export const CURRICULUM: CurriculumStage[] = [
  // ... 29 stages defined here
]

// Lookup helpers — exported for use across the application
export function getStage(stageNumber: number): CurriculumStage | undefined
export function getChapterStages(chapterNumber: number): CurriculumStage[]
export function getChapterEndStage(chapterNumber: number): CurriculumStage | undefined
export function getStageByKey(key: string): CurriculumStage | undefined
```

### Consumption Patterns

Every curriculum read goes through the exported constant and helpers. No component reads the curriculum file directly — they call the helper functions.

| Consumer | What it reads | When |
|---|---|---|
| Roadmap page | `CURRICULUM` (all stages): title, chapter, estimatedDays | Server render |
| Stage detail page | `getStage(n)`: full stage object | Server render |
| Sprint page | `getStage(n)`: resources, challenge descriptions, reflection prompts | Server render |
| `startStage()` | `getStage(n)`: tasks, challenges, projectTitle, durationDays | Server action |
| Interview system | `getStage(n)`: interviewBlueprint, task/challenge descriptions | Interview session creation |
| `isStageStartable()` | `getStage(n)`: number, chapter | Validation |
| Stage unlock logic | `CURRICULUM`: stage numbers per chapter | Progression gating |

### Invariants

1. `stageKey` values are permanent. Once a sprint is created with `stageKey: "html-fundamentals"`, that key must always map to the same stage. Key renames require a data migration.
2. `number` values are permanent. Stage 5 is always Stage 5.
3. Tasks and challenges can be edited in curriculum.ts (content improvements). This is safe because the DB stores only `title` (the task name) and `type`. Descriptions live in the curriculum and are always read fresh.
4. Adding tasks to a stage after the sprint for that stage has been created does NOT add SprintTask rows. The sprint is a snapshot. Only new sprints created after the curriculum change will have the new tasks.
5. The curriculum must always export exactly 29 stages, chapters 1–6, with exactly one `isChapterEnd: true` per chapter.

---

## 3. Interview Architecture

### Session Flow

```
CREATE INTERVIEW
  POST /api/interview/create { sprintId }
  ← Validates: tasks done, challenges done, project submitted (if chapter-end)
  ← Creates: Interview (status: PENDING)
  ← Builds: question queue from interviewBlueprint + weakness injection
  ← Creates: InterviewSession with question queue
  ← Returns: { interviewId, sessionId }
  → Client navigates to /interview/[interviewId]

LOAD INTERVIEW
  GET /interview/[interviewId]
  ← Fetches: InterviewSession
  ← If session.status === PAUSED: resumes from currentQuestionIndex
  ← If session.status === EXPIRED: displays expiry message, no action available
  ← Renders: current question from conversationHistory or first from queue

SUBMIT ANSWER
  POST /api/interview/[sessionId]/respond { answer: string }
  ← Appends: answer to conversationHistory with role "travis"
  ← Calls Claude (streaming): full conversationHistory + system prompt
  ← Streams: Claude's response (next question or follow-up)
  ← Appends: response to conversationHistory with role "interviewer"
  ← Evaluates: is this turn the final question answered?
    → If yes: sets Interview.status = AWAITING_EVALUATION, triggers evaluation job
    → If no: updates currentQuestionIndex and/or currentFollowUpCount
  ← Updates: InterviewSession.lastActivityAt
  ← Returns: streamed response

EVALUATION JOB (background, triggered when all questions answered)
  ← Reads: full conversationHistory from InterviewSession
  ← Calls Claude (separate, non-streaming): evaluation prompt + full transcript
  ← Parses: structured InterviewOutput JSON from Claude
  ← On parse failure: increments evaluationAttempts, retries (max 3)
  ← On 3 failures: marks Interview status COMPLETE with error state, alerts via dashboard
  ← Creates: InterviewTranscript record
  ← Creates: InterviewQuestion records (one per question in the queue)
  ← Creates: Weakness records for newly identified weaknesses
  ← Updates: existing Weakness records (cleared weaknesses)
  ← Updates: Interview (score, passed, remediationReport, evaluatedAt, status: COMPLETE)
  ← If passed + chapter-end: triggers chapter completion check
  ← If passed: no immediate stage advancement (completeStage is a separate user action)

RESULTS PAGE
  GET /interview/[interviewId]/results
  ← Polls for Interview.status === COMPLETE (max 120 seconds, 3-second intervals)
  ← Renders: score breakdown, pass/fail, weakness summary, remediation report
```

### Claude Call Architecture

**Call 1: Interview Conductor** (streaming)

One call per conversation turn. Receives the full conversation history each time.

```typescript
const conductorPayload = {
  model: AI_INTERVIEW_MODEL,  // "claude-sonnet-4-6"
  max_tokens: 600,            // one question at a time
  stream: true,
  system: buildInterviewSystemPrompt(stage, weaknesses, previousTranscripts, isRetake),
  messages: session.conversationHistory  // full history
}
```

**Call 2: Interview Evaluator** (non-streaming, structured output)

One call per interview, triggered after all questions are answered.

```typescript
const evaluatorPayload = {
  model: AI_INTERVIEW_MODEL,
  max_tokens: 4000,           // full scoring report with reasoning
  stream: false,
  system: EVALUATOR_SYSTEM_PROMPT,  // static, versioned, focused only on scoring
  messages: [{
    role: "user",
    content: buildEvaluatorPrompt(stage, transcript, weaknessesInjected)
  }]
}
```

The evaluator prompt includes:
1. The scoring rubric (0–4 per question, confidence 1–3)
2. The full conversation transcript
3. Which weaknesses were injected and their original descriptions
4. Instructions to output structured JSON matching `InterviewOutput` type
5. Instructions NOT to explain or coach — only evaluate

### System Prompt Construction

`buildInterviewSystemPrompt()` assembles five sections:

```typescript
function buildInterviewSystemPrompt(
  stage: CurriculumStage,
  weaknessesToInject: Weakness[],
  previousTranscripts: InterviewTranscript[],
  isRetake: boolean,
  isChapterSynthesis: boolean
): string {
  return [
    PERSONA_SECTION,                      // static: senior engineer persona + rules
    buildStageContextSection(stage),      // dynamic: stage title, tasks, challenges, project
    buildWeaknessSection(weaknesses),     // dynamic: 0–2 weakness contexts to probe
    buildRetakeSection(previousTranscripts, isRetake),  // dynamic: areas to probe harder
    buildSynthesisSection(stage, isChapterSynthesis),   // dynamic: chapter context if synthesis
    SCORING_INSTRUCTIONS,                 // static: rubric reference, output format
  ].join("\n\n---\n\n")
}
```

### Question Queue Construction

```typescript
type QueuedQuestion = {
  type: QuestionType
  topic: string          // human-readable concept name
  hint: string           // interviewer context (not shown to Travis)
  isWeaknessRetest: boolean
  sourceWeaknessId?: string
}

function buildQuestionQueue(
  stage: CurriculumStage,
  weaknesses: Weakness[],
  isChapterSynthesis: boolean
): QueuedQuestion[] {
  const primaryQuestions: QueuedQuestion[] = [
    { type: "CONCEPT",       topic: derivedFromBlueprint },
    { type: "APPLICATION",   topic: derivedFromBlueprint },
    { type: "ARCHITECTURE",  topic: derivedFromBlueprint },
    { type: "DEFENSE",       topic: derivedFromBlueprint },
    { type: "CONNECTION",    topic: derivedFromBlueprint },
  ]

  if (isChapterSynthesis) {
    // Replace CONNECTION with two SYNTHESIS questions spanning the whole chapter
    primaryQuestions.push(
      { type: "CONNECTION", topic: "chapter synthesis 1" },
      { type: "CONNECTION", topic: "chapter synthesis 2" }
    )
  }

  const weaknessQuestions: QueuedQuestion[] = weaknesses
    .slice(0, 2)  // maximum 2 weakness questions
    .map(w => ({
      type: "WEAKNESS_RETEST",
      topic: w.conceptTested,
      hint: w.description,
      isWeaknessRetest: true,
      sourceWeaknessId: w.id
    }))

  return [...primaryQuestions, ...weaknessQuestions]
}
```

### Conversation Storage Format

```typescript
type ConversationEntry = {
  role: "interviewer" | "travis"
  content: string
  timestamp: string        // ISO 8601
  questionIndex?: number   // which question in the queue (for interviewer messages)
  isFollowUp?: boolean
  questionType?: QuestionType
}
```

Stored as JSON array in `InterviewSession.conversationHistory`. Written after every turn (interviewer message and Travis message). This is the resumption source if the browser closes.

### Session Expiry

If `Interview.status === IN_PROGRESS` and `Interview.expiresAt < now()`:
- A background job (or on-demand check) marks `Interview.status = EXPIRED`
- `InterviewSession.status = EXPIRED`
- Questions answered so far are scored (partially answered questions scored 0)
- Travis must begin a new interview attempt
- The expiry counts as a failure attempt, triggering the 48-hour wait

---

## 4. Mastery Architecture

### Source of Truth

`src/lib/mastery.ts` — all mastery calculations live here. No calculations scattered in components.

### Score Calculation

```typescript
function calculateInterviewScore(questions: InterviewQuestion[]): {
  totalScore: number
  maxScore: number
  percentage: number
} {
  const primaryQuestions = questions.filter(q => q.questionType !== "WEAKNESS_RETEST")
  const totalScore = primaryQuestions.reduce((sum, q) => sum + q.score, 0)
  const maxScore = primaryQuestions.length * 4
  return {
    totalScore,
    maxScore,
    percentage: (totalScore / maxScore) * 100
  }
}
```

### Pass/Fail Determination

```typescript
function determinePassed(questions: InterviewQuestion[]): {
  passed: boolean
  failReason?: string
} {
  const primary = questions.filter(q => q.questionType !== "WEAKNESS_RETEST")
  const { percentage } = calculateInterviewScore(questions)

  if (percentage < 85) {
    return { passed: false, failReason: `Score ${percentage.toFixed(1)}% below 85% threshold` }
  }

  const hasZero = primary.some(q => q.score === 0)
  if (hasZero) {
    return { passed: false, failReason: "One or more questions received no answer (score 0)" }
  }

  const belowTwoCount = primary.filter(q => q.score < 2).length
  if (belowTwoCount >= 2) {
    return { passed: false, failReason: "Two or more questions scored below 2" }
  }

  const architectureQ = primary.find(q => q.questionType === "ARCHITECTURE")
  const defenseQ = primary.find(q => q.questionType === "DEFENSE")
  if (architectureQ && architectureQ.score < 2) {
    return { passed: false, failReason: "Architecture question scored below 2" }
  }
  if (defenseQ && defenseQ.score < 2) {
    return { passed: false, failReason: "Defense question scored below 2" }
  }

  return { passed: true }
}
```

### Mastery Index Calculation

```typescript
async function calculateMasteryIndex(userId: string): Promise<number> {
  // Average of all passing interview scores (primary questions only)
  const passedInterviews = await prisma.interview.findMany({
    where: { userId, passed: true, isChapterSynthesis: false },
    select: { percentage: true }
  })

  if (passedInterviews.length === 0) return 0

  const sum = passedInterviews.reduce((acc, i) => acc + (i.percentage ?? 0), 0)
  return Math.round(sum / passedInterviews.length)
}
```

### Weakness Identification

```typescript
function identifyWeaknesses(
  questions: InterviewQuestion[],
  interviewId: string,
  stageNumber: number,
  chapterNumber: number
): Omit<Weakness, "id" | "userId" | "createdAt" | "updatedAt">[] {
  return questions
    .filter(q => {
      if (q.score <= 2) return true        // 0, 1, 2 = weakness
      if (q.score === 3 && q.confidence === 1) return true  // fragile
      if (q.score === 4 && q.confidence === 1) return true  // fragile
      return false
    })
    .map(q => ({
      stageNumber,
      chapterNumber,
      questionType: q.questionType,
      conceptTested: q.conceptTested,
      description: q.weaknessDescription ?? "",
      initialScore: q.score,
      initialConfidence: q.confidence,
      severity: deriveSeverity(q.score, q.confidence),
      sourceInterviewId: interviewId,
      resurfaceCount: 0,
      nextResurfaceStage: calculateNextResurfaceStage(stageNumber, deriveSeverity(q.score, q.confidence), 0),
      lastResurfacedStage: null,
      cleared: false,
      clearedAt: null,
      clearedInInterviewId: null
    }))
}

function deriveSeverity(score: number, confidence: number): WeaknessSeverity {
  if (score <= 1) return "CRITICAL"
  if (score === 2) return "SIGNIFICANT"
  return "FRAGILE"  // score 3 or 4 with confidence 1
}

function calculateNextResurfaceStage(
  currentStage: number,
  severity: WeaknessSeverity,
  resurfaceCount: number
): number {
  const intervals = {
    CRITICAL:    [2, 3, 5],
    SIGNIFICANT: [3, 5, 8],
    FRAGILE:     [5, 8, 12],
    PATTERN:     [2, 3, 5]
  }
  const idx = Math.min(resurfaceCount, 2)
  return currentStage + intervals[severity][idx]
}
```

### Weakness Injection

```typescript
async function getWeaknessesToInject(
  userId: string,
  currentStageNumber: number
): Promise<Weakness[]> {
  return prisma.weakness.findMany({
    where: {
      userId,
      cleared: false,
      nextResurfaceStage: { lte: currentStageNumber }
    },
    orderBy: [
      { severity: "desc" },  // CRITICAL first
      { lastResurfacedStage: "asc" }  // not resurfaced most recently, first
    ],
    take: 2  // maximum 2 weakness questions per interview
  })
}
```

### Streak Update

Called inside `getOrCreateUser()` on every authenticated request:

```typescript
function updateStreak(user: User): { streak: number; lastActiveAt: Date } {
  const now = new Date()
  const lastActive = user.lastActiveAt

  if (!lastActive) {
    return { streak: 1, lastActiveAt: now }
  }

  const daysSinceActive = differenceInCalendarDays(now, lastActive)

  if (daysSinceActive === 0) {
    // Already active today — no change
    return { streak: user.streak, lastActiveAt: user.lastActiveAt! }
  }

  if (daysSinceActive === 1) {
    // Active yesterday — streak continues
    return { streak: user.streak + 1, lastActiveAt: now }
  }

  if (daysSinceActive === 2 && hasGraceDayAvailableThisWeek(user)) {
    // One grace day per 7-day window
    return { streak: user.streak, lastActiveAt: now }
  }

  // 2+ days without activity — reset
  return { streak: 1, lastActiveAt: now }
}
```

---

## 5. Dashboard Architecture

### getNextAction()

```typescript
type NextActionType =
  | "complete_task"
  | "complete_challenge"
  | "submit_project"
  | "begin_interview"
  | "interview_in_progress"
  | "await_reinterview"
  | "remediate"
  | "advance_stage"
  | "start_chapter_synthesis"
  | "start_new_stage"
  | "path_complete"

type NextAction = {
  type: NextActionType
  label: string
  href?: string
  metadata?: Record<string, string | number | boolean>
}

async function getNextAction(userId: string): Promise<NextAction> {
  // 1. Is there an active sprint?
  const sprint = await prisma.sprint.findFirst({
    where: { userId, isActive: true },
    include: {
      tasks: true,
      interviews: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  })

  if (!sprint) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user!.currentStage > 29) return { type: "path_complete", label: "Path complete" }
    return { type: "start_new_stage", label: "Start Stage on Roadmap", href: "/roadmap" }
  }

  // 2. Tasks incomplete?
  const nextTask = sprint.tasks
    .filter(t => t.type === "TASK" && !t.isComplete)
    .sort((a, b) => a.order - b.order)[0]
  if (nextTask) {
    return { type: "complete_task", label: `Complete: ${nextTask.title}`, href: "/sprint" }
  }

  // 3. Challenges incomplete?
  const nextChallenge = sprint.tasks
    .filter(t => t.type === "CHALLENGE" && !t.isComplete)
    .sort((a, b) => a.order - b.order)[0]
  if (nextChallenge) {
    return { type: "complete_challenge", label: `Complete: ${nextChallenge.title}`, href: "/sprint" }
  }

  // 4. Chapter-end stage: project required?
  const stage = getStage(sprint.stageNumber)
  if (stage?.isChapterEnd && !sprint.projectUrl) {
    return { type: "submit_project", label: "Submit chapter project", href: "/sprint" }
  }

  // 5. Check latest interview state
  const latestInterview = sprint.interviews[0]

  if (!latestInterview) {
    return { type: "begin_interview", label: "Begin stage interview", href: "/interview/new" }
  }

  if (latestInterview.status === "IN_PROGRESS" || latestInterview.status === "AWAITING_EVALUATION") {
    return { type: "interview_in_progress", label: "Resume interview", href: `/interview/${latestInterview.id}` }
  }

  if (latestInterview.status === "COMPLETE" && !latestInterview.passed) {
    const now = new Date()
    const availableAt = latestInterview.reinterviewAvailableAt
    if (availableAt && availableAt > now) {
      return {
        type: "await_reinterview",
        label: `Re-interview available ${formatDistance(availableAt, now, { addSuffix: true })}`,
        metadata: { availableAt: availableAt.toISOString() }
      }
    }
    return { type: "remediate", label: "Review remediation and retake interview", href: `/interview/remediation/${latestInterview.id}` }
  }

  // 6. Stage interview passed — check chapter synthesis if chapter-end
  if (stage?.isChapterEnd) {
    const synthesisPassed = await prisma.interview.findFirst({
      where: { sprintId: sprint.id, isChapterSynthesis: true, passed: true }
    })
    if (!synthesisPassed) {
      return { type: "start_chapter_synthesis", label: "Begin chapter synthesis interview", href: "/interview/new?synthesis=true" }
    }
  }

  // 7. Everything done — advance
  return { type: "advance_stage", label: "Advance to next stage", href: "/roadmap" }
}
```

### Dashboard Data Queries

All executed in parallel on dashboard load:

```typescript
const [user, nextAction, masteryIndex, activeWeaknesses, sprint] = await Promise.all([
  getOrCreateUser(),
  getNextAction(userId),
  calculateMasteryIndex(userId),
  prisma.weakness.count({ where: { userId, cleared: false } }),
  prisma.sprint.findFirst({
    where: { userId, isActive: true },
    include: { tasks: true, interviews: { take: 1, orderBy: { createdAt: "desc" } } }
  })
])
```

---

## 6. Progression Architecture

### Stage Unlock Logic

```typescript
// src/lib/stage.ts

// All 29 stages are always viewable. No content is hidden.
function isStageViewable(stageNumber: number): boolean {
  return stageNumber >= 1 && stageNumber <= 29
}

// A stage is startable only when: it matches currentStage, no active sprint exists,
// and no sprint for this stageKey has already been created.
async function isStageStartable(
  stageKey: string,
  stageNumber: number,
  userId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.currentStage !== stageNumber) return false

  const activeSprint = await prisma.sprint.findFirst({ where: { userId, isActive: true } })
  if (activeSprint) return false

  const existingSprint = await prisma.sprint.findUnique({
    where: { userId_stageKey: { userId, stageKey } }
  })
  return !existingSprint
}

// A stage is complete when: sprint exists for this stage, sprint has a passing interview.
async function isStageComplete(stageNumber: number, userId: string): Promise<boolean> {
  const sprint = await prisma.sprint.findFirst({
    where: { userId, stageNumber },
    include: { interviews: { where: { passed: true, isChapterSynthesis: false } } }
  })
  return sprint !== null && sprint.interviews.length > 0
}

// A chapter is complete when: all its stages are complete AND chapter synthesis passed.
async function isChapterComplete(chapterNumber: number, userId: string): Promise<boolean> {
  const chapterRecord = await prisma.chapterCompletion.findUnique({
    where: { userId_chapterNumber: { userId, chapterNumber } }
  })
  return chapterRecord?.completedAt !== null && chapterRecord?.completedAt !== undefined
}
```

### startStage Server Action

```typescript
// src/actions/stage.ts
"use server"

async function startStage(stageNumber: number): Promise<void> {
  const user = await getOrCreateUser()
  const stage = getStage(stageNumber)
  if (!stage) throw new Error("Stage not found in curriculum")

  const canStart = await isStageStartable(stage.key, stageNumber, user.id)
  if (!canStart) throw new Error("Stage cannot be started")

  await prisma.sprint.create({
    data: {
      userId: user.id,
      stageKey: stage.key,
      stageNumber: stage.number,
      chapterNumber: stage.chapter,
      title: stage.title,
      goal: stage.description,
      durationDays: stage.estimatedDays,
      projectTitle: stage.isChapterEnd ? stage.chapterProject?.title : null,
      projectDescription: stage.isChapterEnd ? stage.chapterProject?.description : null,
      completionCriteria: stage.completionCriteria.join(" | "),
      isActive: true,
      tasks: {
        create: [
          ...stage.tasks.map((task, i) => ({
            type: "TASK" as const,
            title: task.title,
            order: i
          })),
          ...stage.miniChallenges.map((challenge, i) => ({
            type: "CHALLENGE" as const,
            title: challenge.title,
            order: stage.tasks.length + i
          }))
        ]
      }
    }
  })

  redirect("/sprint")
}
```

### completeStage Server Action

```typescript
"use server"

async function completeStage(sprintId: string): Promise<void> {
  const user = await getOrCreateUser()
  const sprint = await prisma.sprint.findUnique({
    where: { id: sprintId },
    include: {
      tasks: true,
      interviews: { where: { passed: true } }
    }
  })

  if (!sprint || sprint.userId !== user.id) throw new Error("Sprint not found")

  const stage = getStage(sprint.stageNumber)
  if (!stage) throw new Error("Stage not found in curriculum")

  // Validate: all tasks complete
  const allTasksDone = sprint.tasks.filter(t => t.type === "TASK").every(t => t.isComplete)
  if (!allTasksDone) throw new Error("Not all tasks are complete")

  // Validate: all challenges complete
  const allChallengesDone = sprint.tasks.filter(t => t.type === "CHALLENGE").every(t => t.isComplete)
  if (!allChallengesDone) throw new Error("Not all challenges are complete")

  // Validate: stage interview passed
  const stageInterviewPassed = sprint.interviews.some(i => !i.isChapterSynthesis)
  if (!stageInterviewPassed) throw new Error("Stage interview not yet passed")

  // If chapter-end: validate project submission and synthesis interview
  if (stage.isChapterEnd) {
    if (!sprint.projectUrl) throw new Error("Chapter project URL required")
    const synthesisPassed = sprint.interviews.some(i => i.isChapterSynthesis)
    if (!synthesisPassed) throw new Error("Chapter synthesis interview not yet passed")
  }

  await prisma.$transaction(async (tx) => {
    // Mark sprint complete
    await tx.sprint.update({
      where: { id: sprintId },
      data: { isActive: false, completedAt: new Date() }
    })

    // Advance user stage
    await tx.user.update({
      where: { id: user.id },
      data: {
        currentStage: user.currentStage + 1,
        lastActiveAt: new Date()
      }
    })

    // If chapter-end: create ChapterCompletion record
    if (stage.isChapterEnd) {
      const synthInterview = sprint.interviews.find(i => i.isChapterSynthesis)
      await tx.chapterCompletion.create({
        data: {
          userId: user.id,
          chapterNumber: stage.chapter,
          synthesisInterviewId: synthInterview?.id,
          synthesisScore: synthInterview?.percentage,
          synthesisPassedAt: synthInterview?.evaluatedAt,
          projectUrl: sprint.projectUrl,
          architectureDiagramUrl: sprint.architectureDiagramUrl,
          workflowDiagramUrl: sprint.workflowDiagramUrl,
          adrCount: sprint.adrCount ?? 0,
          completedAt: new Date()
        }
      })
    }
  })

  redirect("/roadmap")
}
```

---

## 7. Weakness Tracking Architecture

### Lifecycle

```
IDENTIFIED  →  RESURFACING  →  CLEARED
    |               |
    |         (resurfaces every N stages based on severity)
    |               |
    └───────────────┘ (if not cleared, cycle repeats at increasing intervals)
```

### Resurfacing Schedule

| Severity | Intervals (stages ahead) |
|---|---|
| CRITICAL | +2, then +3, then +5 |
| SIGNIFICANT | +3, then +5, then +8 |
| FRAGILE | +5, then +8, then +12 |
| PATTERN | +2, then +3, then +5 |

After the third resurfacing, if still not cleared, the interval repeats at the last value indefinitely until cleared.

### Clearing a Weakness

```typescript
async function attemptClearWeakness(
  weaknessId: string,
  questionResult: InterviewQuestion,
  interviewId: string
): Promise<void> {
  const weakness = await prisma.weakness.findUnique({ where: { id: weaknessId } })
  if (!weakness) return

  const cleared = questionResult.score >= 3 && questionResult.confidence >= 2

  await prisma.weakness.update({
    where: { id: weaknessId },
    data: {
      resurfaceCount: { increment: 1 },
      lastResurfacedStage: weakness.nextResurfaceStage,
      nextResurfaceStage: cleared
        ? 999  // effectively never resurfaces again
        : calculateNextResurfaceStage(
            weakness.nextResurfaceStage,
            weakness.severity as WeaknessSeverity,
            weakness.resurfaceCount + 1
          ),
      cleared,
      clearedAt: cleared ? new Date() : null,
      clearedInInterviewId: cleared ? interviewId : null
    }
  })
}
```

---

## 8. Remediation Architecture

### Report Structure

```typescript
type RemediationReport = {
  failedAreas: {
    questionType: QuestionType
    conceptTested: string
    score: number
    confidence: number
    whatWasWrong: string
    studyActions: string[]      // specific curriculum references
    practiceQuestion: string    // a question Travis can try before retaking
  }[]
  fragileAreas: {
    questionType: QuestionType
    conceptTested: string
    suggestion: string
  }[]
  reinterviewAvailableAt: string  // ISO timestamp
  requiredActions: string[]        // 1–3 ordered actions before retaking
  waitDays: number                 // 2 or 7
}
```

### Remediation Generation

Generated by the evaluator Claude call. The evaluator prompt includes instructions to produce the `remediationReport` JSON alongside the question scores. The report is stored as `Interview.remediationReport` (Json field).

No separate DB model for remediation. It is an attribute of a failed interview.

### Wait Period Enforcement

`Interview.reinterviewAvailableAt` is calculated during the evaluation pass:

```typescript
function calculateReinterviewAvailableAt(
  attemptNumber: number,
  evaluatedAt: Date
): Date {
  if (attemptNumber === 1) return addHours(evaluatedAt, 48)
  return addDays(evaluatedAt, 7)  // second and subsequent failures
}
```

The server action that creates a new Interview validates this field:

```typescript
const latestFailedInterview = await prisma.interview.findFirst({
  where: { sprintId, passed: false, status: "COMPLETE" },
  orderBy: { createdAt: "desc" }
})

if (latestFailedInterview?.reinterviewAvailableAt) {
  if (latestFailedInterview.reinterviewAvailableAt > new Date()) {
    throw new Error("Re-interview not yet available")
  }
}
```

---

## 9. Constants and Configuration

### Single Source of Truth

```typescript
// src/lib/constants.ts

// AI model — never hardcoded elsewhere
export const AI_INTERVIEW_MODEL = "claude-sonnet-4-6" as const

// Mastery system
export const MASTERY_THRESHOLD = 85                // percentage
export const MAX_SCORE_PER_QUESTION = 4
export const STANDARD_INTERVIEW_QUESTIONS = 5
export const SYNTHESIS_INTERVIEW_QUESTIONS = 7
export const MAX_WEAKNESS_INJECTIONS = 2
export const MAX_FOLLOW_UPS_PER_QUESTION = 3
export const SESSION_EXPIRY_HOURS = 72
export const FIRST_FAILURE_WAIT_HOURS = 48
export const SUBSEQUENT_FAILURE_WAIT_DAYS = 7
export const MAX_SPRINT_TASKS = 15                 // tasks + challenges combined

// Stage limits
export const TOTAL_STAGES = 29
export const TOTAL_CHAPTERS = 6

// Chapter boundaries [firstStage, lastStage]
export const CHAPTER_BOUNDARIES: Record<number, [number, number]> = {
  1: [1, 6],
  2: [7, 12],
  3: [13, 16],
  4: [17, 19],
  5: [20, 25],
  6: [26, 29]
}
```

---

## 10. File Structure After Full Implementation

```
src/
  lib/
    constants.ts          ← all magic numbers and model names
    curriculum.ts         ← FIRST ARTIFACT: 29 stages, complete TypeScript definition
    stage.ts              ← isStageViewable, isStageStartable, isStageComplete, isChapterComplete
    mastery.ts            ← score calculation, weakness identification, streak
    interview.ts          ← session management, system prompt construction, question queue
    user.ts               ← getOrCreateUser with streak update
    prisma.ts             ← Prisma client singleton

  actions/
    stage.ts              ← startStage, completeStage
    sprint.ts             ← toggleTask (keep), createInterview
    interview.ts          ← submitAnswer, triggerEvaluation

  app/
    (auth)/               ← landing, sign-in, sign-up (keep)
    (dashboard)/
      dashboard/          ← redesigned: getNextAction-driven
      roadmap/
        page.tsx           ← all 29 stages, chapter groups, unlock states
        [stage]/
          page.tsx         ← full stage detail
      sprint/
        page.tsx           ← redesigned: curriculum-driven, no creation form
      interview/
        new/page.tsx       ← create interview, redirect to session
        [id]/page.tsx      ← live interview UI with streaming
        [id]/results/page.tsx  ← score, weaknesses, remediation
        remediation/[id]/page.tsx ← remediation report detail
      parking-lot/
        page.tsx           ← Sprint 3

  components/
    curriculum/           ← stage card, resource card, task item (read-only display)
    interview/            ← interview UI, question display, answer input, results
    dashboard/            ← next-action card, mastery index, weakness count
    sprint/               ← keep SprintTaskItem, remove SprintForm/TaskListInput
    layout/               ← keep sidebar/mobile-nav

  api/
    interview/
      [sessionId]/
        respond/route.ts  ← streaming answer submission
    webhooks/
      evaluation/route.ts ← background evaluation job trigger (if using external queue)
                           ← OR: evaluation triggered in-process via respond route

prisma/
  schema.prisma           ← full expanded schema (10 models)
  migrations/
    20260603172513_init/  ← existing
    [timestamp]_mastery/  ← new migration with all additions
```

### Dead Code to Delete Before New Implementation Begins

| File | Reason |
|---|---|
| `src/app/(dashboard)/sprint/new/page.tsx` | User-created sprints eliminated |
| `src/components/sprint/sprint-form.tsx` | User-created sprints eliminated |
| `src/components/sprint/task-list-input.tsx` | User-created sprints eliminated |
| `src/actions/sprint.ts` → `createSprint` | Replaced by `startStage` |

`toggleTask` in `src/actions/sprint.ts` is kept. Only `createSprint` and related exports are removed.
