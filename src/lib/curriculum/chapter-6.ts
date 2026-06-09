import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 6: AI Architecture — Stages 26–29
//
// Goal: Design, defend, and operate production AI systems at the level a senior
// AI engineer would recognize as rigorous. The learner should finish this chapter
// able to sit in an architecture review and justify every decision — not merely
// describe it.
//
// Design principle: Architecture, tradeoffs, and reasoning over tools.
// If every framework used in this chapter disappeared tomorrow, the learner
// retains: the ability to reason about AI system design, observability,
// reliability, cost, and enterprise governance.
//
// Chapter project: Enterprise AI Platform Design — a complete architecture
// document, threat model, cost model, proof-of-concept, and technical
// presentation that Travis could deliver to an engineering review board.
//
// Resource diversity:
//   Chip Huyen's production AI blog (Tier 2, widely respected):  Stage 26 primary
//   Anthropic Prompt Caching docs (Tier 1):                      Stage 26 reference
//   Eugene Yan's LLM patterns blog (Tier 2, Amazon scientist):   Stage 27 primary
//   OWASP LLM Top 10 (Tier 1, industry security standard):       Stage 28 primary
//   Anthropic Safety documentation (Tier 1):                     Stage 28 reference
//   C4 Model documentation (Tier 1, architecture standard):      Stage 29 primary
//   NIST AI Risk Management Framework (Tier 1, government):      Stage 29 reference
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_6_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 26: AI System Design
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "ai-system-design",
    number: 26,
    chapter: 6,
    chapterTitle: "AI Architecture",
    isChapterEnd: false,

    title: "AI System Design",
    description:
      "Learn to reason about AI system design as a trilemma of latency, quality, and cost. Understand caching strategies, model routing, observability, and fallback design — the architectural decisions that determine whether an AI product is economically viable and operationally maintainable.",
    whyItMatters:
      "Building an AI feature that works in a demo is straightforward. Building one that costs less than it earns, responds within user tolerance, maintains quality at scale, and degrades gracefully when dependencies fail — that is system design. This stage is where AI engineering and software architecture intersect, and where most AI products fail in production.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Building LLM Applications for Production",
        author: "Chip Huyen",
        url: "https://huyenchip.com/2023/04/11/llm-engineering.html",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "2 hours",
        selectionReason:
          "Chip Huyen is the author of 'Designing Machine Learning Systems' (O'Reilly) and an adjunct professor at Stanford. This article is the most widely referenced technical treatment of what is different about production LLM systems compared to traditional software — covering latency, cost, non-determinism, and evaluation. It is read and cited by AI engineers at major technology companies.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Anthropic — Prompt Caching",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "Prompt caching is the most impactful cost optimization available for AI applications with large, stable system prompts. The authoritative documentation covers which token positions qualify for caching, cache lifetime, cost structure, and the specific prompt organization required. Understanding this feature changes the cost calculation for every production AI system Travis will build.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "latency-quality-cost-trilemma",
        title: "The latency-quality-cost trilemma",
        description:
          "Understand that AI system design is a three-way tradeoff: improving quality costs money and latency, reducing cost degrades quality or increases latency, and reducing latency often costs more. Know the specific levers available for each dimension and what each lever sacrifices.",
      },
      {
        key: "caching-strategies",
        title: "Caching strategies — three layers",
        description:
          "Distinguish prompt caching (model-level, caches token sequences), semantic caching (application-level, caches responses to semantically similar queries), and exact-match response caching (output-level, caches identical queries). Understand what each layer caches, what it costs to implement, and what failure mode each introduces.",
      },
      {
        key: "model-routing",
        title: "Model routing",
        description:
          "Understand model routing as directing requests to different models based on inferred complexity, cost budget, or latency requirement. Know the three approaches: rule-based (fast, brittle), classifier-based (flexible, requires training data), and cascade (try cheap model first, escalate on low confidence).",
      },
      {
        key: "ai-observability",
        title: "AI-specific observability",
        description:
          "Understand what AI systems require beyond standard application monitoring: token usage per request, model latency (time to first token vs total time), refusal rate, quality score distribution, and cost per unit of work. Know why standard APM tools are insufficient for AI observability.",
      },
      {
        key: "fallback-design",
        title: "Fallback and degradation design",
        description:
          "Design explicit fallback strategies: primary model unavailable → use backup model with different tradeoffs, quality below threshold → escalate to human review, cost budget exceeded → switch to cheaper model or queue for off-peak processing. Understand graceful degradation as an architecture requirement, not an afterthought.",
      },
      {
        key: "prompt-caching-economics",
        title: "Prompt caching economics",
        description:
          "Calculate the cost impact of prompt caching for a real workload. Understand which token positions qualify for caching (the stable prefix), what the cache lifetime means for workload design, and when prompt caching requires restructuring the prompt to maximize cache hits.",
      },
    ],

    miniChallenges: [
      {
        key: "cost-optimization-analysis",
        title: "Cost Optimization Analysis",
        description:
          "Analyze the cost profile of the AI Career Coach from Chapter 5. Using real token counts from actual conversations (run at least 10 test conversations and log token usage), calculate: (1) current monthly cost at 100 daily active users, (2) projected cost with prompt caching enabled — calculate what fraction of tokens qualify for caching in the current prompt design, (3) projected cost with model routing that sends simple factual questions to Haiku and complex multi-step reasoning to Sonnet — estimate what fraction of queries fall into each category, (4) projected cost with semantic caching that serves repeated similar queries from cache. For each optimization, document the implementation cost and the specific quality risk it introduces.",
        hint:
          "Prompt caching requires the cacheable prefix to appear at the beginning of the prompt, before any dynamic content. The system prompt and curriculum context are candidates. Dynamic content (the user's question) must appear after the cached prefix. Calculate cache hit rate as the fraction of requests that hit the same prefix.",
      },
      {
        key: "observability-implementation",
        title: "Observability Implementation",
        description:
          "Add structured observability to the AI Career Coach. For every conversation turn, log to a database table: timestamp, session_id, user_message_token_count, retrieved_chunks_count, context_token_count, response_token_count, time_to_first_token_ms, total_latency_ms, model_used, tools_called (as JSON array), cache_hit (boolean), and estimated_cost_usd. Then write three database queries: (1) the 10 most expensive sessions by total cost, (2) average latency by hour of day, (3) the 5 queries with the most retrieved chunks — and explain what each query tells you about system behavior.",
        hint:
          "Log estimated_cost_usd as (input_tokens * input_price + output_tokens * output_price) using the current Anthropic pricing. Cache hits have a different input price — make sure the calculation uses the correct rate based on whether the prefix was cached.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with documented examples and calculations",
      "Cost optimization analysis completed with specific numbers from real conversation logs",
      "Observability implementation running and queries producing meaningful results",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is semantic caching, how does it differ from exact-match response caching, and what is the specific failure mode that makes it unsafe for a legal information service — even when implemented correctly?",
      application:
        "Your AI application costs $12,000 per month. You need to reduce it by 40% without degrading the user experience that drives retention. Walk me through your diagnostic process: what data you collect, what hypotheses you form, and in what order you test them.",
      architecture:
        "Design a model routing system for an AI application where 80% of queries are simple factual lookups and 20% require multi-step reasoning. Specify: what determines the routing decision, how you prevent misclassification, what happens to user experience when the classifier routes a complex query to the cheap model, and how you measure whether the routing is working.",
      defense:
        "A CTO proposes hosting an open-source LLM internally to eliminate $50,000 per month in API costs and reduce vendor lock-in. Evaluate this proposal: what it actually costs to host and operate a comparable model, what capabilities are sacrificed, what operational burden is added, and under what specific conditions this is the right decision.",
      connection:
        "The AI Career Coach from Chapter 5 has a system prompt and curriculum context that are identical across all users. Recalculate its cost with prompt caching: what fraction of the average conversation's tokens qualify for caching, and how does this change the monthly cost projection you calculated in the cost optimization challenge?",
    },

    reflectionPrompts: [
      "You calculated the cost of the AI Career Coach at 100 daily active users. At what daily active user count does the cost become unsustainable for a solo developer? What specific optimization would you implement first at that scale?",
      "Semantic caching is unsafe for legal information because two semantically similar questions may have different correct answers. What other AI application domains share this property — where semantic similarity does not imply answer equivalence? What domains are safe for semantic caching?",
      "You designed a fallback strategy for when the primary model is unavailable. The fallback model has lower quality. How do you communicate the degraded state to users in a way that preserves trust — and how do you decide when the degradation is severe enough to disable the feature entirely rather than serve lower quality?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 27: Multi-Agent Systems
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "multi-agent-systems",
    number: 27,
    chapter: 6,
    chapterTitle: "AI Architecture",
    isChapterEnd: false,

    title: "Multi-Agent Systems",
    description:
      "Understand multi-agent orchestration patterns, inter-agent coordination, state management, failure propagation, and the conditions under which agents are the correct architecture — and the conditions under which they are not.",
    whyItMatters:
      "Complex AI tasks exceed what a single agent can do reliably. A research agent, analysis agent, and writing agent working together can produce work that none could produce alone. But multi-agent systems amplify the failure modes of single agents: compounding errors, coordination failures, and inconsistent state become system-level problems. Understanding these patterns — independent of any framework — is what makes multi-agent design an engineering discipline rather than an experiment.",

    estimatedDays: 6,

    resources: {
      primary: {
        title: "Patterns for Building LLM-based Systems and Products",
        author: "Eugene Yan (Amazon)",
        url: "https://eugeneyan.com/writing/llm-patterns/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "2 hours",
        selectionReason:
          "Eugene Yan is an applied scientist at Amazon who has built and evaluated production LLM systems at scale. This article systematically catalogs the architectural patterns that work in production — evals, RAG, fine-tuning, caching, guardrails, orchestration — with honest analysis of when each pattern is appropriate and when it is not. It is frequently recommended by engineers at AI-native companies as one of the clearest treatments of production LLM architecture available.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Anthropic — Building Effective Agents (Orchestration section)",
        author: "Anthropic",
        url: "https://www.anthropic.com/research/building-effective-agents",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30 minutes",
        selectionReason:
          "The orchestration and multi-agent sections of Anthropic's agent design guide provide authoritative guidance on when to introduce agent complexity and what architectural patterns they have observed to be reliable versus fragile in production. Referenced here specifically for the orchestration content, not as a general re-read of Stage 25 material.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "orchestration-patterns",
        title: "Orchestration patterns",
        description:
          "Understand four orchestration patterns and what each optimizes for: orchestrator-worker (one coordinator, multiple specialists — clear authority, single point of failure), pipeline (sequential handoffs — predictable, brittle at each boundary), supervisor (hierarchical authority with escalation paths — robust, slower), and fully autonomous (agents negotiate — flexible, hardest to reason about).",
      },
      {
        key: "inter-agent-coordination",
        title: "Inter-agent coordination",
        description:
          "Understand the three coordination mechanisms: shared state (agents read and write a common state object — simple, requires consistency management), message passing (agents communicate via explicit messages — decoupled, harder to debug), and structured handoffs (one agent's output is explicitly typed as another's input — predictable, inflexible). Know what each mechanism makes easy and what it makes hard to debug.",
      },
      {
        key: "state-management-agents",
        title: "State management in multi-agent systems",
        description:
          "Understand what state must be shared versus what should remain local to each agent. Know the specific consistency problems that arise when multiple agents write to shared state concurrently — and the architectural patterns that prevent them without requiring distributed locks.",
      },
      {
        key: "failure-propagation",
        title: "Failure propagation",
        description:
          "Understand how failure in one agent propagates through a multi-agent system: early errors amplify through subsequent steps, malformed outputs cascade, and silent failures (wrong but confident outputs) are the most dangerous class. Know the circuit breaker and checkpoint patterns that limit failure blast radius.",
      },
      {
        key: "parallel-vs-sequential",
        title: "Parallel versus sequential execution",
        description:
          "Understand when agents should run in parallel (independent subtasks, results merged at the end) versus sequentially (each step depends on prior results). Calculate the error rate implications: sequential agents compound errors multiplicatively, parallel agents accumulate errors additively but may produce conflicting outputs that require resolution.",
      },
      {
        key: "when-not-to-use-multi-agent",
        title: "When multi-agent is the wrong architecture",
        description:
          "Recognize the conditions that justify multi-agent complexity: the task is genuinely parallelizable into specialized subtasks, the quality improvement from specialization exceeds the coordination overhead, and the failure modes are well-understood and recoverable. Know that single-agent with good tools and single well-structured pipeline are both better defaults.",
      },
    ],

    miniChallenges: [
      {
        key: "two-agent-pipeline",
        title: "Two-Agent Pipeline — Manual Orchestration",
        description:
          "Build a two-agent pipeline without any agent framework — using only the Anthropic Python SDK and your own orchestration code. Agent 1 (Researcher): receives a topic, calls the curriculum search tool, and produces a structured outline with section titles and key points. Agent 2 (Writer): receives the outline and expands each section into a paragraph explanation. The orchestrator: calls Agent 1, validates the output is a valid outline structure, passes it to Agent 2, and returns the final document. Every inter-agent handoff must be explicitly logged: what was sent, what was received, and whether the output met the expected structure. Do not use LangGraph, LangChain, or any agent framework.",
        hint:
          "The orchestrator is a Python function, not a framework. Call the Anthropic API for Agent 1, parse and validate the response, then call the API again for Agent 2. The validation step — checking that Agent 1 returned a valid outline before invoking Agent 2 — is more important than the content.",
      },
      {
        key: "failure-mode-simulation",
        title: "Failure Mode Simulation",
        description:
          "Intentionally break the two-agent pipeline in three different ways and document exactly what happens: (1) Agent 1 returns a malformed outline — the JSON is valid but missing required fields. What does the orchestrator do? What does Agent 2 do if the orchestrator passes it forward? (2) Agent 2 receives a well-formed outline but refuses to expand a section because it considers the topic out of scope. What does the user experience? (3) The pipeline runs successfully but Agent 2's expansion contradicts a claim in Agent 1's outline. How would you detect this automatically? For each failure, implement a specific recovery mechanism and document why you chose it over the alternatives.",
        hint:
          "The malformed outline failure requires the orchestrator to validate structure before proceeding. The refusal failure requires detecting when Agent 2's output does not match the expected structure and retrying or escalating. The contradiction failure requires a verification step — either a third agent or a structured comparison — because neither Agent 1 nor Agent 2 can detect it alone.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with documented analysis",
      "Two-agent pipeline built with manual orchestration — no frameworks",
      "All three failure modes simulated with recovery mechanisms implemented and documented",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Describe the difference between an orchestrator-worker multi-agent system and a fully autonomous peer-to-peer agent system. What does each optimize for, what does each fail at, and which class of problems is genuinely better served by the peer-to-peer pattern?",
      application:
        "Your research agent system has five specialized agents. Agent 3 returns a malformed response that Agent 4 cannot process. Trace the failure end-to-end: what does your orchestrator do, what does the user experience, and what does your architecture need to prevent this from silently producing an answer that looks correct but is based on no real research?",
      architecture:
        "Design a multi-agent system for a complex business analysis task: gather market data, analyze competitive position, assess financial risk, and produce an executive summary. Specify: the agents, the orchestration pattern, how you handle an agent that exceeds its time budget, the data format for inter-agent handoffs, and where human review is required before any output reaches the user.",
      defense:
        "A teammate proposes using a 'voting' architecture where three agents independently answer a question and the majority answer wins, arguing this improves accuracy. Evaluate this proposal: when does majority voting help, when does it hurt (all three agents can be confidently wrong for the same reason), and what does it cost compared to a single high-quality agent?",
      connection:
        "In Stage 25, you calculated that 5 sequential agents at 90% individual reliability produce 41% task failure. In a parallel multi-agent system where 5 agents work simultaneously and their outputs are merged, how does the error rate calculation change — and what new failure mode emerges from parallel execution that does not exist in sequential execution?",
    },

    reflectionPrompts: [
      "You built a two-agent pipeline with manual orchestration. What did writing the orchestrator yourself reveal about what frameworks like LangGraph are actually doing — and what specific problems they solve that you would not have noticed if you had used the framework from the start?",
      "The contradiction failure mode — two agents produce outputs that are mutually inconsistent — is the hardest to detect automatically. In the business analysis scenario from the architecture interview question, what specific contradictions could occur between agents, and what is the minimum verification step that would catch them before the user sees the output?",
      "You chose between orchestrator-worker, pipeline, supervisor, and peer-to-peer orchestration. For the AI Career Coach from Chapter 5, which pattern applies — and is it the correct choice? What would need to change about the coach's requirements to justify a different pattern?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 28: Production AI Operations
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "production-ai-operations",
    number: 28,
    chapter: 6,
    chapterTitle: "AI Architecture",
    isChapterEnd: false,

    title: "Production AI Operations",
    description:
      "Learn to operate AI systems in production: detecting and diagnosing quality degradation, writing incident runbooks for AI-specific failures, implementing safety layers, managing model and prompt versions, and attributing cost across users and features.",
    whyItMatters:
      "Shipping an AI system is the beginning of the engineering work, not the end. AI systems fail in ways that are invisible to traditional monitoring — quality degrades gradually, models behave differently on data distributions they have not seen, and prompt changes have unintended consequences. Operating an AI system requires a different set of skills than operating a traditional web application, and this stage is where the gap between AI engineer and AI builder is most visible.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "OWASP Top 10 for Large Language Model Applications",
        author: "OWASP Foundation",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "2 hours",
        selectionReason:
          "OWASP is the industry standard for application security. Their LLM-specific Top 10 — covering prompt injection, insecure output handling, training data poisoning, and model denial of service — is the security reference for AI applications at major enterprises. It was produced by a working group of security professionals with production AI experience. No equivalent authority exists for this set of AI-specific vulnerabilities.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Anthropic — Responsible Scaling Policy",
        author: "Anthropic",
        url: "https://www.anthropic.com/news/anthropics-responsible-scaling-policy",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "Understanding how Anthropic thinks about safety at the model provider level provides context for the safety responsibilities that shift to the application developer. This document is not an operational guide — it is a framework for thinking about AI system risk that informs how Travis designs safety layers in his own applications.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "quality-drift-detection",
        title: "Quality drift detection",
        description:
          "Understand response quality drift as a statistical phenomenon: quality degrades gradually, not suddenly, making it invisible to threshold-based alerting. Know the three detection approaches: automatic scoring (use a judge model to score responses), user feedback signals (thumbs up/down, regenerate requests), and regression testing (run a fixed evaluation set on a schedule).",
      },
      {
        key: "ai-incident-response",
        title: "AI-specific incident response",
        description:
          "Understand the four classes of AI production incidents: quality regression (answers are worse), cost spike (usage or cost per request increases unexpectedly), safety failure (harmful or policy-violating outputs), and availability failure (model API unavailable). Know that each class requires a different diagnostic and recovery process.",
      },
      {
        key: "safety-layers",
        title: "Safety and content filtering",
        description:
          "Design output filtering, input sanitization, and PII detection as independent safety layers. Understand the defense-in-depth principle: no single safety layer is sufficient. Know the tradeoff between false positive rate (blocking legitimate content) and false negative rate (allowing harmful content), and how to tune the threshold for a given application.",
      },
      {
        key: "model-version-management",
        title: "Model and prompt version management",
        description:
          "Treat prompt versions with the same rigor as code versions: commit prompts to version control, test changes against an evaluation suite before deployment, maintain a rollback path. Understand model version pinning — why locking to a specific model version prevents silent regressions when a model is updated.",
      },
      {
        key: "cost-attribution",
        title: "Cost attribution",
        description:
          "Design cost attribution at three levels: per user (which users are most expensive), per feature (which features consume the most tokens), and per model (which model accounts for what fraction of total spend). Understand how cost attribution drives product decisions — features that cost more than they generate value should be redesigned or removed.",
      },
      {
        key: "owasp-llm-top-10",
        title: "OWASP LLM Top 10 — applied to this application",
        description:
          "Study the OWASP LLM Top 10 and identify which vulnerabilities apply to the AI Career Coach specifically: prompt injection (a user crafts a message that overrides the system prompt), insecure output handling (the coach produces content that is rendered unsafely in the UI), and data privacy (the coach surfaces curriculum content that should not be visible to this user). For each applicable vulnerability, identify the specific attack vector and the mitigation.",
      },
    ],

    miniChallenges: [
      {
        key: "incident-response-runbooks",
        title: "Incident Response Runbooks",
        description:
          "Write incident response runbooks for three AI-specific incidents in the AI Career Coach: (1) Response quality drops — users report the coach is giving wrong answers about the curriculum. Detection: how do you know? Diagnosis: what do you check in what order? Mitigation: what are the immediate actions? Recovery: how do you verify quality is restored? Root cause: what are the five most likely causes? (2) Cost spike — the monthly API cost doubles overnight with no code change. Same four sections. (3) Prompt injection detected — the coach is answering questions outside its curriculum scope, suggesting a user found a way to override the system prompt. Same four sections. Each runbook must be specific enough that a developer unfamiliar with the system could execute it.",
        hint:
          "Quality drop root causes to consider: model API change (provider silently updated the model), prompt regression (recent deploy changed a prompt), data distribution shift (new users asking different questions), evaluation drift (the problem existed before but you are only now measuring it). Your runbook should distinguish between these in the diagnosis section.",
      },
      {
        key: "safety-layer",
        title: "Safety Layer Implementation",
        description:
          "Add a safety layer to the AI Career Coach that: (1) detects and blocks responses that contain patterns matching personal contact information (email addresses, phone numbers) — the coach should never output this; (2) detects when the coach's response is off-topic (not about the curriculum) using a classifier call or keyword approach, and logs the event without blocking (rate of off-topic responses is a quality metric); (3) detects potential prompt injection attempts in user input — log and flag but do not block (false positive rate is too high to block). For each safety check, document: the detection approach, the false positive rate in your test set (run 20 test inputs), and the action taken on a positive detection.",
        hint:
          "PII detection: use a regex for email and phone patterns as a first pass. Off-topic detection: a simple approach is checking whether the response mentions any curriculum stage number or topic name — absence of both suggests off-topic. Prompt injection detection: look for phrases like 'ignore previous instructions', 'you are now', 'pretend you are' — but recognize this list is incomplete and users will find ways around it.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with documented analysis applied to the AI Career Coach",
      "Three incident runbooks written — specific enough to execute without the author present",
      "Safety layer implemented with false positive rates documented",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is response quality drift in a production AI application, and why is it fundamentally harder to detect than performance degradation in a traditional web service — specifically, what property of AI output makes threshold-based alerting inadequate?",
      application:
        "Your AI application's response quality has declined — users are complaining that answers are less accurate. No code was deployed in the past week. Walk me through every possible cause, what you check to distinguish between them, and in what order you investigate — starting with the most likely cause.",
      architecture:
        "Design the complete observability system for the AI Career Coach: what metrics you collect and at what granularity, how you store them, the alerting rules and their thresholds, and the runbooks for the three most likely production incidents. Be specific — 'monitor quality' is not an architecture.",
      defense:
        "A security team requires all AI outputs be filtered through a content moderation layer before reaching users. The moderation layer adds 200ms latency and has a 3% false positive rate (blocking legitimate content). Evaluate this requirement: what does it prevent, what does the false positive rate cost in user experience, and under what conditions is this tradeoff worth accepting?",
      connection:
        "The structured logging from Stage 19, the evaluation metrics from Stage 24, and the observability implementation from Stage 26 are three components of a complete production AI monitoring system. What does each one measure that the others cannot? How do you combine them to detect the quality drift scenario from the concept question above?",
    },

    reflectionPrompts: [
      "You wrote incident runbooks before any incident has occurred. What assumptions did you make about how the system would fail? What would force you to rewrite these runbooks after the first real incident?",
      "Your safety layer has a 3% false positive rate on 20 test inputs. At 1,000 daily users each sending 5 messages, how many legitimate messages are blocked per day? Is this acceptable? How do you make this decision systematically rather than intuitively?",
      "Model version pinning prevents silent regressions when a provider updates a model. But it also means you do not automatically benefit from model improvements. How do you design a process for evaluating whether to upgrade to a new model version — what is the minimum evidence required before changing a pinned version in production?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 29: Enterprise AI Architecture
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "enterprise-ai-architecture",
    number: 29,
    chapter: 6,
    chapterTitle: "AI Architecture",
    isChapterEnd: true,

    title: "Enterprise AI Architecture",
    description:
      "Design, document, and defend complete AI system architectures using the C4 model. Understand data governance, multi-tenancy, security at the enterprise level, and the specific architectural consequences of AI non-determinism. Synthesize the entire curriculum into defensible engineering judgment.",
    whyItMatters:
      "Enterprise AI architecture is where every earlier decision compounds. A weak data model surfaces in the governance design. A poor security architecture in Chapter 3 propagates into the enterprise threat model. A misunderstood embedding system produces an unreliable RAG pipeline that cannot be audited. This stage is synthesis: the ability to stand in an architecture review, explain every decision, and defend it against intelligent opposition. That is the definition of senior engineering capability.",

    estimatedDays: 7,

    resources: {
      primary: {
        title: "The C4 Model for Software Architecture",
        author: "Simon Brown",
        url: "https://c4model.com",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "2 hours",
        selectionReason:
          "The C4 model is the industry standard for communicating software architecture — used by engineering teams at companies including Spotify, HSBC, and ThoughtWorks. Simon Brown created and maintains it as an open standard. It provides a precise vocabulary (Context, Container, Component, Code) for describing systems at different levels of abstraction, which is exactly what a senior AI architect needs for documenting systems that must be understood by both engineers and non-technical stakeholders.",
        qualityRating: "definitive",
      },
      reference: {
        title: "NIST AI Risk Management Framework",
        author: "National Institute of Standards and Technology",
        url: "https://www.nist.gov/artificial-intelligence/ai-risk-management-framework",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Read the AI RMF Core: 1.5 hours",
        selectionReason:
          "The NIST AI RMF is the US government's framework for managing AI risk — adopted by major enterprises and referenced in AI procurement requirements. Understanding its four core functions (Govern, Map, Measure, Manage) provides the vocabulary and structure for enterprise AI governance conversations. In a senior AI engineering role, this framework is referenced in compliance discussions, client questionnaires, and enterprise architecture reviews.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "ai-non-determinism-consequences",
        title: "Architectural consequences of AI non-determinism",
        description:
          "Understand how non-determinism — the same input producing different outputs — changes fundamental software architecture assumptions: testing cannot be input-output verification, caching must account for multiple valid responses, SLAs must be probabilistic not absolute, and incidents cannot be reproduced by replaying the same request. Know how each of these changes the architecture of AI-powered systems compared to traditional software.",
      },
      {
        key: "enterprise-patterns",
        title: "Enterprise AI architecture patterns",
        description:
          "Understand three enterprise AI deployment patterns: centralized (one platform, all teams use it — easy governance, single point of failure), federated (each team has its own AI capabilities — flexible, hard to govern), and hub-and-spoke (shared infrastructure with team-specific customization — balanced, complex to operate). Know what each pattern costs in governance complexity versus deployment flexibility.",
      },
      {
        key: "data-governance-ai",
        title: "Data governance for AI",
        description:
          "Understand AI-specific data governance requirements: data lineage (where did the training data and retrieval data come from?), consent management (was the data used with appropriate permissions?), PII handling in retrieval (what happens when PII is in the knowledge base?), and audit trails (can you prove what data was used to generate a specific response?). Know that audit trails for AI systems are harder than for traditional software because the model's reasoning is not inspectable.",
      },
      {
        key: "multi-tenancy-ai",
        title: "Multi-tenancy in AI platforms",
        description:
          "Design multi-tenant AI systems where tenants share infrastructure but are isolated in data, cost, and access. Understand three isolation levels: row-level security (same database, different rows), schema isolation (same database, different schemas), and database isolation (completely separate databases). Know the cost and complexity tradeoffs of each approach for an AI application that has per-tenant knowledge bases.",
      },
      {
        key: "security-architecture-ai",
        title: "Security architecture for AI systems",
        description:
          "Apply zero-trust principles to AI systems: assume any component can be compromised, authenticate every inter-service call, authorize every data access, and audit everything. Understand AI-specific attack surfaces: prompt injection from external data sources, model inversion attacks, and training data extraction. Know what each attack surface requires architecturally to mitigate.",
      },
      {
        key: "architecture-documentation",
        title: "Architecture documentation — C4 model and ADRs",
        description:
          "Write C4 model diagrams at Context, Container, and Component levels. Write Architecture Decision Records that document context, decision, consequences, and alternatives — not post-hoc justifications. Understand that architecture documentation is a communication artifact, not a record-keeping artifact — it must be readable by the person joining the team six months from now.",
      },
    ],

    miniChallenges: [
      {
        key: "retrospective-adr",
        title: "Retrospective Architecture Decision Record",
        description:
          "Write a retrospective ADR for one of the most consequential architectural decisions made across the entire curriculum. Candidates: RAG over fine-tuning for the AI Career Coach, pgvector over a dedicated vector database, FastAPI BackgroundTasks over Celery, the agent pattern over a simpler pipeline, or the Clerk authentication decision. The retrospective must include: the context at the time of the decision (what did you know, what did you not know), the decision made, what you know now that you did not know then, whether the decision still holds, and what you would do differently. This ADR is not an exercise — it is a real engineering document about a real system.",
        hint:
          "The most valuable retrospective ADRs are honest about what was uncertain. 'We chose pgvector because we did not know whether we would need a dedicated vector database' is more useful than 'we chose pgvector because it has these three advantages.' Document the uncertainty, not just the rationale.",
      },
      {
        key: "enterprise-system-design-defense",
        title: "Enterprise System Design Defense",
        description:
          "Design a complete AI platform for a 200-person professional services company. Requirements: employees need access to an internal knowledge base assistant that knows the company's methodologies and past project work; all AI interactions must be logged for compliance and reviewed if a client complaint is filed; PII from client engagements must not be sent to external AI providers; each practice area (finance, operations, technology) has its own knowledge base and cost budget; the platform must work if the primary AI provider has a multi-hour outage. Produce: (1) a C4 Context diagram showing the system and its actors, (2) a C4 Container diagram showing the major technical components, (3) a data flow diagram for a user query that involves PII-adjacent client data, (4) a fallback architecture for the provider outage scenario. Be prepared to defend every component and data flow in the AI interview.",
        hint:
          "PII handling requires a classification and filtering step before any data reaches the AI provider — not just policy, but architecture. The fallback for provider outage must specify what the system does (cached responses, degraded mode, full unavailability) and how users are informed. Cost budget per practice area requires attribution at the inference level — each practice area's requests must be tagged.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with applied analysis of the AI Career Coach and the enterprise design",
      "Retrospective ADR written and committed to the repository",
      "Enterprise system design completed with all four diagrams",
      "Chapter 6 project submitted with complete C4 diagrams, threat model, cost model, proof-of-concept, and presentation",
      "AI interview passed at 85% or above",
      "Chapter 6 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain the architectural consequence of AI non-determinism — the same input producing different outputs — on four fundamental software engineering practices: writing unit tests, implementing caching, defining SLAs, and reproducing production incidents.",
      application:
        "A Fortune 500 company wants an internal AI assistant that accesses customer data. Their legal team requires: all AI interactions logged for 7 years with retrieval provenance, no customer PII sent to external AI providers, and audit trails showing specifically which data was used to generate each response. Design the architecture that satisfies all three requirements simultaneously — and identify where they conflict with each other.",
      architecture:
        "Design a multi-tenant AI platform for a SaaS company where each of 50 customer tenants has their own knowledge base, usage budget, and rate limit. Specify: the isolation boundary between tenants, the mechanism for cost attribution and budget enforcement, what happens architecturally when one tenant exhausts their budget, and how a tenant's knowledge base is prevented from appearing in another tenant's responses.",
      defense:
        "Present the architecture of the AI Career Coach to an engineering review board. You will be questioned on: why RAG over fine-tuning, why pgvector over Pinecone, why the agent pattern over a simpler retrieval pipeline, whether the evaluation methodology is rigorous enough for production, and what the recovery plan is when the Anthropic API is unavailable for four hours. Defend each decision against the most plausible counterargument.",
      connection:
        "From Stage 1 to Stage 29: you learned how DNS and HTTP work, how to write Python, how to design databases, how to build APIs, how RAG works, and how to design enterprise AI systems. Identify one decision you made in Chapters 1–3 that you would make differently now, given what you understand about AI system architecture — and explain how the earlier decision constrained your options in a later chapter.",
    },

    reflectionPrompts: [
      "You wrote a retrospective ADR for a real decision made earlier in the curriculum. The decision that seemed obvious at the time looks different now. What does this tell you about when architecture decisions should be made — and why 'decide as late as possible' is sometimes the correct engineering principle?",
      "The enterprise system design challenge required you to handle PII without sending it to an external AI provider. The most straightforward AI architecture — send everything to the model, let it sort it out — is not available. How does this constraint change the system's complexity, and what does it tell you about the relationship between compliance requirements and architectural complexity in enterprise AI?",
      "You have completed 29 stages of deliberate practice in AI engineering. What is the most important thing you now understand that you did not understand at Stage 1 — not a fact or a technique, but a way of thinking about systems?",
    ],

    chapterProject: {
      title: "Enterprise AI Platform Design",
      description:
        "A complete architecture for a production-grade enterprise AI platform — documented, threat-modeled, costed, partially implemented, and presented as a technical deliverable. This project represents the synthesis of the entire curriculum and the standard of work expected of a senior AI engineer.",
      requirements: [
        "C4 model diagrams at all four levels: Context (system in its environment), Container (major technical components), Component (internal structure of key containers), Code (implementation detail for the most complex component)",
        "Security threat model: identify the three highest-priority attack surfaces, the mechanism of each attack, the architectural mitigation, and the residual risk after mitigation",
        "Working proof-of-concept: implement the most architecturally complex component of the design — the PII filtering layer, the multi-tenant isolation mechanism, or the provider fallback system",
        "Cost model: estimate monthly cost at 50 users, 200 users, and 1,000 users — with assumptions documented for each scale point and the specific infrastructure changes required at each transition",
        "Operational runbook: deployment procedure, health verification checklist, and the top three incident response procedures specific to this platform",
        "20-minute technical presentation structured as an architecture review: system overview, key decisions and their rationale, risks and mitigations, and a live demonstration of the proof-of-concept",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 5,
        additionalNotes: [
          "Architecture diagrams must use the C4 model — all four levels. Each level targets a different audience: Context for executives, Container for architects, Component for senior engineers, Code for the implementing engineer.",
          "Three workflow diagrams required: (1) user query with PII-adjacent data — from browser through filtering, retrieval, generation, and response; (2) tenant budget enforcement — from request through attribution check to enforcement action; (3) provider fallback — from outage detection through degraded mode activation to recovery.",
          "ADR 1: Platform topology — centralized vs federated vs hub-and-spoke. Include the organizational constraints that drive the decision, not just the technical ones.",
          "ADR 2: Tenant isolation level — row-level security vs schema isolation vs database isolation. Include the cost of each approach at 50, 200, and 1,000 tenants.",
          "ADR 3: PII handling architecture — filter-before-retrieval vs filter-before-model vs sanitize-output. Include the accuracy tradeoff of each approach.",
          "ADR 4: Provider fallback strategy — backup provider vs cached responses vs graceful unavailability. Include what user behavior each strategy preserves.",
          "ADR 5: Retrospective ADR — any significant decision from Chapters 1–5 evaluated with the benefit of completing the full curriculum. What would change and why.",
        ],
      },
    },
  },
];
