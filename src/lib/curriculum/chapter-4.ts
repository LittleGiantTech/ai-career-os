import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 4: Backend Development — Stages 17–19
//
// Goal: Build, structure, and deploy a production-grade Python API. Understand
// FastAPI's request lifecycle, middleware, dependency injection, background
// jobs, and containerization — the infrastructure every AI product sits on.
//
// Chapter project: Production API — a deployed FastAPI application with
// authentication, streaming AI responses, background job processing,
// observability, and complete engineering documentation.
//
// Resource diversity:
//   FastAPI official docs (Tier 1):   Stage 17 primary
//   Pydantic official docs (Tier 1):  Stage 17 reference
//   FastAPI docs — background tasks:  Stage 18 primary
//   Celery official docs (Tier 1):    Stage 18 reference
//   Docker official docs (Tier 1):    Stage 19 primary
//   Railway official docs (Tier 1):   Stage 19 reference
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_4_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 17: FastAPI Fundamentals
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "fastapi-fundamentals",
    number: 17,
    chapter: 4,
    chapterTitle: "Backend Development",
    isChapterEnd: false,

    title: "FastAPI Fundamentals",
    description:
      "Build REST APIs with FastAPI: routes, path and query parameters, request and response validation with Pydantic, dependency injection, async route handlers, structured error responses, and auto-generated OpenAPI documentation.",
    whyItMatters:
      "AI products need servers. FastAPI is the dominant framework for Python AI backends — it is fast enough for production, generates OpenAPI documentation automatically, and integrates naturally with async Python, which matters when calling AI APIs with variable latency. Every AI service in Chapters 5 and 6 is built on this foundation.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "FastAPI — Official Tutorial",
        author: "Sebastián Ramírez (FastAPI)",
        url: "https://fastapi.tiangolo.com/tutorial/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "4–6 hours",
        selectionReason:
          "The official FastAPI tutorial is among the best framework documentation in the Python ecosystem. It is thorough, sequenced correctly, and written by the framework author. FastAPI's design decisions — dependency injection, Pydantic integration, async support — are explained not just as features but as solutions to specific engineering problems. No third-party tutorial approaches its accuracy or depth.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Pydantic Documentation",
        author: "Pydantic",
        url: "https://docs.pydantic.dev",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "FastAPI's validation layer is Pydantic. Understanding what Pydantic does — field types, validators, serialization, error messages — is inseparable from understanding FastAPI's request handling. The Pydantic documentation is the authoritative source for every validation behavior encountered in production.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "fastapi-routes",
        title: "Routes and parameter types",
        description:
          "Define GET, POST, PUT, and DELETE routes. Distinguish path parameters, query parameters, and request body parameters. Understand what FastAPI does differently from Flask and why the distinction matters.",
      },
      {
        key: "pydantic-models",
        title: "Pydantic request and response models",
        description:
          "Define Pydantic models for request validation and response serialization. Use field types, Optional, default values, and field validators. Understand what happens when a request fails validation — what the error response looks like and who generates it.",
      },
      {
        key: "dependency-injection",
        title: "Dependency injection with Depends()",
        description:
          "Use Depends() to inject shared dependencies — database sessions, authentication checks, configuration — into route functions. Understand why this makes routes independently testable and why direct imports of shared state do not.",
      },
      {
        key: "async-routes",
        title: "Async route handlers",
        description:
          "Understand the difference between async def and def routes in FastAPI. Know when async is required (calling other async code), when it is irrelevant (CPU-bound work), and what blocking inside an async route does to server throughput.",
      },
      {
        key: "error-handling-fastapi",
        title: "Structured error handling",
        description:
          "Raise HTTPException with appropriate status codes and detail messages. Register custom exception handlers for application-specific errors. Understand why consistent error response shapes matter for API consumers.",
      },
      {
        key: "openapi-docs",
        title: "OpenAPI documentation",
        description:
          "Understand what FastAPI auto-generates at /docs and /redoc — what it derives from type hints and Pydantic models. Use the docs interface to test every endpoint. Know what to add to make the generated docs useful rather than just present.",
      },
    ],

    miniChallenges: [
      {
        key: "ai-proxy-endpoint",
        title: "AI Proxy Endpoint",
        description:
          "Build a FastAPI endpoint POST /chat that: accepts a JSON body with message (string, required, max 2000 characters) and model (string, optional, defaults to claude-haiku), validates both fields with Pydantic, calls the Anthropic API with streaming enabled, returns a StreamingResponse that delivers tokens to the client as they arrive, returns a structured 429 response with a retry_after field when the Anthropic API rate-limits, and logs the input token count, output token count, and latency for every call. The endpoint must not buffer the entire response before returning — the client must receive tokens progressively.",
        hint:
          "FastAPI's StreamingResponse accepts a generator. Write an async generator that yields each streamed chunk from the Anthropic client. For rate limit handling, catch anthropic.RateLimitError before the stream begins and return HTTPException(status_code=429).",
      },
      {
        key: "middleware-design",
        title: "Middleware and CORS Design",
        description:
          "Add two pieces of middleware to the FastAPI application: (1) request logging middleware that records — for every request — the timestamp, HTTP method, path, response status code, and response time in milliseconds, structured as JSON to stdout; (2) CORS middleware configured for a specific origin. Document every CORS parameter you set: what it allows, what it blocks, and what the security consequence would be of setting allow_origins=['*'] in a production AI application that handles user session cookies.",
        hint:
          "FastAPI middleware using @app.middleware('http') receives the request before routing and can modify the response after. Time the request by recording time.time() before and after await call_next(request). The CORS security analysis is the deliverable — not just working code.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with a running FastAPI application",
      "Both challenges implemented and testable via the /docs interface",
      "AI Proxy Endpoint delivers tokens progressively — verified by watching the browser or curl output",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain dependency injection in FastAPI. What specific problem does it solve compared to importing a database session or authentication check directly inside a route function — and what does that difference mean for testing?",
      application:
        "Your FastAPI endpoint calls Claude with streaming. The call takes 8–15 seconds for long responses. Walk me through exactly how you return a streaming HTTP response to the client without blocking the server from handling other requests during that time — what FastAPI mechanisms are involved and in what order.",
      architecture:
        "You have a FastAPI endpoint that must: validate the JWT from the Authorization header, check that the user exists in the database, log the request with a generated request ID, call the Anthropic API, store the result in PostgreSQL, and return the response. Map each responsibility to the correct FastAPI mechanism — middleware, dependency, or route function — and justify each placement.",
      defense:
        "A teammate wants to use Flask for the AI backend because they are more familiar with it. Make the specific case for FastAPI — not benchmark numbers, but the concrete features that change how you build and maintain an AI application.",
      connection:
        "FastAPI's async def routes depend on the same async/await model you first encountered in JavaScript in Stage 4 and studied in Python in Stage 9. What transfers directly from those stages, and what is genuinely new about how FastAPI uses async — specifically in the context of calling the Anthropic API from a route handler?",
    },

    reflectionPrompts: [
      "You built a streaming AI endpoint. A user on a slow connection receives tokens progressively. A user on a fast connection receives them all at once because the buffer fills instantly. What does this tell you about when streaming actually improves user experience versus when it is irrelevant?",
      "Dependency injection makes routes testable by making their dependencies replaceable. What would you replace the Anthropic API client with in a test — and how does FastAPI's Depends() mechanism make that replacement possible without changing the route function?",
      "Your CORS analysis showed that allow_origins=['*'] has a specific security consequence for session cookies. Now extend that analysis: what other headers or behaviors change between a restrictive CORS policy and a permissive one, and which changes matter for an AI application?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 18: Middleware & Background Jobs
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "middleware-background-jobs",
    number: 18,
    chapter: 4,
    chapterTitle: "Backend Development",
    isChapterEnd: false,

    title: "Middleware & Background Jobs",
    description:
      "Learn the request-response lifecycle, middleware patterns, background task processing, idempotency, and the architectural decision between in-process background tasks and external job queues.",
    whyItMatters:
      "AI API calls are slow — 3 to 30 seconds for complex operations. A server that blocks on every AI call handles one concurrent user well and ten concurrent users poorly. Background jobs are the architectural pattern that decouples request acceptance from computation time. Understanding when to use them, how to make them reliable, and when they are overkill is production engineering judgment.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "FastAPI — Background Tasks",
        author: "Sebastián Ramírez (FastAPI)",
        url: "https://fastapi.tiangolo.com/tutorial/background-tasks/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The authoritative documentation for FastAPI's built-in background task mechanism. Precise about what BackgroundTasks can and cannot do — which is exactly the knowledge needed to make the architectural decision between in-process tasks and a proper queue. Reading the official documentation before a tutorial prevents the common mistake of using BackgroundTasks for workloads they cannot reliably handle.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Celery Documentation — Getting Started",
        author: "Celery project",
        url: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Celery is the dominant Python distributed task queue. Understanding its architecture — broker, worker, result backend — establishes the mental model for when a full queue is necessary and what it costs to operate. The architectural decision between FastAPI BackgroundTasks and Celery is a judgment call this stage requires Travis to make; the Celery documentation provides the other side of that comparison.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "middleware-lifecycle",
        title: "Middleware and the request lifecycle",
        description:
          "Understand FastAPI's request processing order: middleware stack → routing → dependencies → route handler → response. Know that middleware sees every request regardless of route, and what this makes middleware the correct place for — versus what belongs in dependencies.",
      },
      {
        key: "background-tasks-fastapi",
        title: "FastAPI BackgroundTasks",
        description:
          "Use BackgroundTasks to run work after the response is sent. Understand the critical limitation: background tasks run in the same process, so a server restart kills them. Know exactly what this means for reliability.",
      },
      {
        key: "job-queues-celery",
        title: "Job queues — when BackgroundTasks are not enough",
        description:
          "Understand what a broker, worker, and result backend are in a queue architecture. Know the specific failure modes that make a queue necessary: server restarts, task failures that need retry, tasks longer than the HTTP timeout, and tasks that need horizontal scaling.",
      },
      {
        key: "task-status-polling",
        title: "Task status and polling",
        description:
          "Design the job_id → status → result pattern: the initial request returns a job_id immediately, a second endpoint accepts job_id and returns current status and result. Understand why this pattern exists and what the alternative (long polling or WebSockets) costs.",
      },
      {
        key: "idempotency",
        title: "Idempotency",
        description:
          "Define idempotency precisely: an operation that produces the same result regardless of how many times it is applied. Understand why every AI batch job that might be interrupted and restarted must be idempotent — and what specific data corruption occurs when it is not.",
      },
      {
        key: "webhooks-async-patterns",
        title: "Webhooks and asynchronous callbacks",
        description:
          "Understand webhooks as the server-push alternative to polling. Know when webhooks are the right pattern versus polling — the specific constraints (callback URL required, network accessibility) that make webhooks inapplicable for some use cases.",
      },
    ],

    miniChallenges: [
      {
        key: "async-document-processor",
        title: "Async Document Processor",
        description:
          "Build two FastAPI endpoints: POST /documents/analyze accepts a document (text string, up to 10,000 characters), immediately returns a JSON response with job_id and status='pending', and starts a background task that calls Claude to summarize the document and stores the result in a database. GET /documents/analyze/{job_id} returns the current status ('pending', 'processing', 'complete', or 'failed') and — when complete — the summary. The POST endpoint must return within 100ms regardless of document length. Test by submitting three documents simultaneously and verifying all three complete independently.",
        hint:
          "Use FastAPI BackgroundTasks for the processing. The background task updates a status record in the database as it progresses — pending → processing → complete. The GET endpoint reads the database, not the background task directly. Concurrent submissions work because each has its own job_id and database row.",
      },
      {
        key: "idempotent-processor",
        title: "Idempotent Document Processor",
        description:
          "Extend the document processor to be idempotent: if the same document is submitted twice, return the existing result without calling the Anthropic API a second time. Implement using a content hash (SHA-256 of the document text, truncated to 16 characters as a key). When a document arrives, check whether a result for that hash already exists — if yes, return it immediately with status='cached'; if no, process it. Document: (1) what hashing property makes this work, (2) what failure case this approach does not handle, and (3) what the cost saving is if the same document is submitted 100 times.",
        hint:
          "hashlib.sha256(text.encode()).hexdigest()[:16] produces a consistent hash. The failure case this approach does not handle is a hash collision — two different documents producing the same hash. At 16 hex characters (64-bit space), this is astronomically unlikely but not impossible.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working implementations",
      "Both challenges completed — idempotent processor includes the written analysis",
      "Can explain the exact failure modes of FastAPI BackgroundTasks without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Define idempotency precisely. Why is it a required property for any AI batch processing job that might be interrupted and restarted — and what specific data corruption occurs in an AI summarization job that is not idempotent and runs twice on the same 1,000-document corpus?",
      application:
        "A user submits a 50-page PDF for AI analysis. The job takes 3 minutes. Design the complete system: what the initial POST returns, how the client discovers when the job is done, what happens if the server restarts after 90 seconds of processing, and what the user experiences in each scenario.",
      architecture:
        "When does FastAPI BackgroundTasks become the wrong tool and when do you need a proper job queue? Describe the specific failure mode — with a concrete AI application scenario — that drives you from BackgroundTasks to Celery, and what the queue provides that BackgroundTasks cannot.",
      defense:
        "A teammate argues all AI processing should be synchronous — make the user wait for the result, no background jobs needed. The AI calls take 5–15 seconds. Under what conditions is the teammate correct, and under what conditions is their approach architecturally wrong?",
      connection:
        "The retry decorator from Stage 11 and the background job architecture from this stage both address unreliable operations — one at the function level, one at the system level. How do they solve different parts of the same problem, and describe a real AI pipeline where you would need both simultaneously?",
    },

    reflectionPrompts: [
      "Your idempotent processor caches results by document hash. A document changes between submissions — the same source URL now has updated content. Your cache returns the stale result. How do you design around this without abandoning idempotency?",
      "You built a job-status polling endpoint. A frontend client polls every 3 seconds for 3 minutes. That is 60 API calls for one job. At 100 concurrent users each running one job, that is 6,000 polling requests per minute just for status checks. What architectural alternatives reduce this load, and what do they each cost?",
      "BackgroundTasks run in the same process as the server. What happens to a background task if the route handler that created it throws an exception? What happens if the server receives a SIGTERM signal? Are these acceptable failure modes for the AI Knowledge Base API from Chapter 3?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 19: Deployment & DevOps Basics
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "deployment-devops",
    number: 19,
    chapter: 4,
    chapterTitle: "Backend Development",
    isChapterEnd: true,

    title: "Deployment & DevOps Basics",
    description:
      "Learn Docker containerization, docker-compose for local development, environment management across staging and production, cloud deployment, health checks, and structured logging — the skills that turn a working application into a running service.",
    whyItMatters:
      "A project that runs only on localhost is not a project. It is a draft. Every AI system Travis builds must be deployable, observable, and recoverable. Containerization eliminates environment inconsistency. Health checks enable automated recovery. Structured logging enables diagnosis after the fact. These are not optional for production systems — they are the baseline.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Docker Documentation — Get Started",
        author: "Docker",
        url: "https://docs.docker.com/get-started/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "3–4 hours",
        selectionReason:
          "Docker's official Get Started documentation is sequenced correctly and precise about the distinction between images, containers, layers, and volumes — concepts that are frequently confused in tutorial content. The official documentation avoids the shortcuts that leave engineers confused when Docker behaves unexpectedly in production.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Railway Documentation",
        author: "Railway",
        url: "https://docs.railway.com",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1–2 hours",
        selectionReason:
          "Railway is the deployment platform used in this curriculum. Its documentation covers environment variable management, service linking, health checks, and deployment triggers — the operational concepts needed for the chapter project. Reading the official documentation for the specific platform being used avoids the trial-and-error that typically consumes deployment time.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "docker-fundamentals",
        title: "Docker fundamentals",
        description:
          "Understand images, containers, layers, and the build cache. Know the difference between building an image and running a container. Read a Dockerfile and predict the resulting image without running it.",
      },
      {
        key: "dockerfile-best-practices",
        title: "Writing production Dockerfiles",
        description:
          "Write a multi-stage Dockerfile for a Python application. Understand layer ordering for cache efficiency, why dependencies are installed before code is copied, and why running as a non-root user matters in production containers.",
      },
      {
        key: "docker-compose",
        title: "Docker Compose for local development",
        description:
          "Write a docker-compose.yml that links a FastAPI application with a PostgreSQL container. Understand service networking, volume mounts for data persistence, environment variable injection, and the depends_on health check pattern.",
      },
      {
        key: "environment-management",
        title: "Environment management across stages",
        description:
          "Design environment variable strategy for local, staging, and production. Understand what belongs in environment variables versus application config, what must never be in a Docker image, and how Railway and similar platforms inject variables at runtime.",
      },
      {
        key: "health-checks",
        title: "Health check endpoints",
        description:
          "Implement a GET /health endpoint that verifies: database connectivity, AI API reachability (optional lightweight check), and application startup state. Understand what load balancers do with health check failures and why a health check that always returns 200 is worse than no health check.",
      },
      {
        key: "structured-logging",
        title: "Structured logging for production",
        description:
          "Configure Python logging to emit JSON-structured output. Log at the correct level for each event type. Include request IDs in log context so a complete request can be traced across multiple log lines. Understand why print() is not observable in production.",
      },
    ],

    miniChallenges: [
      {
        key: "containerize-knowledge-base-api",
        title: "Containerize the AI Knowledge Base API",
        description:
          "Take the AI Knowledge Base API from Chapter 3 and containerize it: write a Dockerfile that produces a minimal production image (not a development image), write a docker-compose.yml that runs the application and a PostgreSQL container together with the API key and database URL injected from a .env file, and verify the containerized application is functionally identical to the local version. Document every Dockerfile instruction with one sentence explaining what it does and why it is necessary — not what it does syntactically, but why it exists in this file.",
        hint:
          "Order matters in a Dockerfile for cache efficiency: COPY requirements.txt and RUN pip install before COPY . . so the dependency layer is only rebuilt when requirements change, not on every code change. The .env file used by docker-compose should never be committed — verify it is in .gitignore.",
      },
      {
        key: "deploy-to-production",
        title: "Deploy to Production",
        description:
          "Deploy the containerized AI Knowledge Base API to Railway (or Fly.io). Requirements: the application must be publicly accessible at a stable URL, all environment variables are configured through the platform's interface and not embedded in the image, the /health endpoint returns 200 and validates database connectivity, and deployment can be triggered by a git push to the main branch. After deployment, make a real API call to the public URL and verify the response. Document the complete deployment process including every configuration decision — what you set, where, and why.",
        hint:
          "Railway detects Dockerfiles automatically. The DATABASE_URL in production points to your Supabase instance, not the local PostgreSQL container from docker-compose. Health checks in Railway are configured in the service settings — point it at /health.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with a working containerized application",
      "Both challenges completed — API is deployed and accessible at a public URL",
      "Health check endpoint validates database connectivity — not just returns 200",
      "Chapter 4 project submitted with public URL, GitHub repository, architecture diagram, workflow diagrams, and all three ADRs",
      "AI interview passed at 85% or above",
      "Chapter 4 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is the difference between a Docker image and a Docker container? A teammate says 'stateless containers' are required for production — what does stateless mean in this context, and what breaks if a containerized AI application stores user conversation state in local memory instead of a database?",
      application:
        "Your production FastAPI container needs the ANTHROPIC_API_KEY at runtime. Walk me through every place this key could appear in a Docker-based deployment — Dockerfile, image layers, docker-compose.yml, CI/CD logs, container environment — and identify which of those locations is the correct one and which are security failures.",
      architecture:
        "Design the deployment architecture for a FastAPI AI application that must handle 10x traffic spikes during business hours, maintain zero-downtime deployments, persist conversation history across restarts, and stay within a shared Anthropic API rate limit across all instances. What components exist and what does each one contribute?",
      defense:
        "A teammate argues Docker is unnecessary overhead for a solo developer's AI project — just deploy to a VPS with a virtual environment and a systemd service. What specific risks does this approach accept, and under what conditions would you actually agree with it?",
      connection:
        "The AI Knowledge Base API you containerized in this stage will be upgraded with vector search in Stage 23 and become the data layer for the AI Career Coach in Stage 25. What deployment decisions you made here — how environment variables are injected, how the database connection is configured, how the health check is structured — will need to change to support that upgrade, and which ones are already correct?",
    },

    reflectionPrompts: [
      "You documented every Dockerfile instruction. Which instruction was hardest to justify — where you knew what it did but not confidently why it needed to exist? Look it up now and write the answer.",
      "Your health check validates database connectivity. What happens to users mid-request if the database goes down and the health check starts failing? Trace the sequence from first failure to traffic being rerouted — what does a user experience during that window?",
      "You deployed to Railway. The deployment is triggered by a git push. What happens if you push broken code? What mechanism stops it from reaching production — and if that mechanism does not exist yet, what would you add?",
    ],

    chapterProject: {
      title: "Production API",
      description:
        "A deployed FastAPI application demonstrating every production characteristic introduced in Chapter 4: authentication, streaming AI responses, background job processing, health monitoring, structured logging, containerization, and cloud deployment. This is the backend infrastructure pattern every AI system in Chapters 5 and 6 builds on.",
      requirements: [
        "FastAPI application with OpenAPI documentation auto-generated and accurate at /docs",
        "Minimum six endpoints covering: at least one streaming AI response, at least one background job with status polling, health check, and authenticated CRUD operations",
        "JWT authentication on all non-health endpoints, returning structured 401 responses for missing or invalid tokens",
        "Streaming endpoint delivers tokens progressively — verified by observing progressive output in the browser or curl",
        "Background job endpoint: POST returns job_id within 100ms, GET /jobs/{job_id} returns current status and result",
        "Idempotent: repeated identical requests to the background endpoint return cached results without duplicate AI API calls",
        "Health check endpoint validates database connectivity and returns a structured response indicating which dependencies are healthy",
        "JSON-structured logging with request IDs on every log line",
        "Containerized with Docker, runnable locally with docker-compose",
        "Deployed to Railway or Fly.io — publicly accessible URL required",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 3,
        additionalNotes: [
          "Architecture diagram must show: client → deployed container → FastAPI → database (Supabase), plus the background worker path and its interaction with the job status store",
          "Three workflow diagrams required: (1) authenticated request lifecycle — from HTTP request through JWT validation, dependency injection, route handler, and response; (2) background job lifecycle — from POST submission through async processing to completion; (3) deployment pipeline — from git push to live traffic serving the new version",
          "ADR 1: Deployment platform — why Railway (or Fly.io) over AWS, GCP, Heroku, or Render. Include the specific constraints and what would change the decision.",
          "ADR 2: Authentication strategy — why JWT over session cookies or API keys for this application. What the tradeoffs are and at what scale the decision should be reconsidered.",
          "ADR 3: Background job approach — why FastAPI BackgroundTasks over Celery. What the failure modes of BackgroundTasks are that you are accepting, and what specific trigger would move you to a proper queue.",
        ],
      },
    },
  },
];
