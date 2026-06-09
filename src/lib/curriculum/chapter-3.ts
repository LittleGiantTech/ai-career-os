import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 3: APIs & Databases — Stages 13–16
//
// Goal: Build and consume REST APIs, design relational schemas, write SQL with
// confidence, use Prisma as an abstraction over PostgreSQL, and understand the
// authentication and security decisions every production application requires.
//
// Chapter project: AI Knowledge Base API — a document ingestion and full-text
// search API over PostgreSQL. The same system is upgraded with vector search in
// Chapter 5, creating a continuous thread from this chapter through RAG.
//
// Resource diversity:
//   Python Requests docs (Tier 1 for the library): Stage 13 primary
//   Anthropic SDK docs (Tier 1 official):          Stage 13 reference
//   PostgreSQL official docs (Tier 1):             Stages 14 primary, 15 reference
//   Select Star SQL (Tier 2, peer-recognized):     Stage 14 reference
//   Prisma official docs (Tier 1 for Prisma):      Stage 15 primary
//   OWASP Cheat Sheet Series (Tier 1, industry std): Stage 16 primary
//   Clerk documentation (Tier 1 for Clerk):        Stage 16 reference
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_3_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 13: Working with APIs in Python
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "apis-in-python",
    number: 13,
    chapter: 3,
    chapterTitle: "APIs & Databases",
    isChapterEnd: false,

    title: "Working with APIs in Python",
    description:
      "Learn to call REST APIs from Python using the requests library, handle authentication and errors defensively, manage secrets with environment variables, and implement exponential backoff for rate limiting.",
    whyItMatters:
      "Every AI integration Travis will build involves calling an external API. The Anthropic API, vector database APIs, embedding APIs — all require understanding HTTP clients, authentication, structured error handling, and rate limit management in Python. The skills in this stage are exercised in every subsequent chapter.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "Requests: HTTP for Humans — Official Documentation",
        author: "Kenneth Reitz / Requests contributors",
        url: "https://docs.python-requests.org/en/latest/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "The official documentation for the requests library — the most widely used Python HTTP client, installed on more than 90% of Python environments. It is the authoritative source for every parameter, authentication type, session behavior, and edge case. For a library this central to Python API work, going to the official docs first avoids the imprecision of tutorial intermediaries.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Anthropic Python SDK — API Reference",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/api/client-sdks",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The SDK Travis will use most throughout this curriculum. Reading its source and documentation now — authentication patterns, error types, retry behavior — builds a mental model that makes Stage 20 significantly easier. It also demonstrates production-quality Python library design.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "requests-library",
        title: "The requests library",
        description:
          "Make GET, POST, PUT, and DELETE requests. Set headers, query parameters, and request bodies. Parse response status codes and JSON. Understand that requests is synchronous by default.",
      },
      {
        key: "api-authentication-python",
        title: "Authentication in practice",
        description:
          "Attach Bearer tokens and API keys in headers versus query parameters. Understand why header-based authentication is preferred and what the difference means for logging and caching.",
      },
      {
        key: "response-handling",
        title: "Defensive response handling",
        description:
          "Check status codes before parsing response bodies. Handle the case where a 200 response still contains an error field. Distinguish between network failures, client errors (4xx), and server errors (5xx).",
      },
      {
        key: "session-objects",
        title: "Session objects",
        description:
          "Use requests.Session() to reuse TCP connections and share default headers across calls. Understand the performance difference between session-based and per-call requests for high-volume API work.",
      },
      {
        key: "environment-variables-python",
        title: "Environment variables and secrets",
        description:
          "Load secrets from .env files with python-dotenv. Understand why API keys must never appear in source code, what os.environ provides, and what happens when a required variable is missing.",
      },
      {
        key: "rate-limiting-backoff",
        title: "Rate limiting and exponential backoff",
        description:
          "Detect 429 responses. Implement exponential backoff with jitter. Understand why immediate retries amplify rate limit problems instead of solving them.",
      },
    ],

    miniChallenges: [
      {
        key: "api-client-class",
        title: "API Client Class",
        description:
          "Build a Python class that wraps the Open-Meteo weather API (open-meteo.com — free, no authentication required). The class must: load any configuration from environment variables, implement at least three methods (current weather, hourly forecast, daily forecast), retry on 429 and 5xx responses with exponential backoff, and raise custom exception types for authentication failures, rate limits, and server errors that a caller can catch independently. Do not use the requests.Session for every call — make an architectural decision about when a session is justified and document it.",
        hint:
          "Exponential backoff means: wait 1s after first failure, 2s after second, 4s after third, with a random jitter of up to 0.5s added to each delay. This prevents synchronized retries from multiple clients hammering the API simultaneously.",
      },
      {
        key: "anthropic-first-call",
        title: "Anthropic API First Call",
        description:
          "Using the Anthropic Python SDK (not the requests library directly): make a call to Claude with a system prompt, a user message, and a model parameter. Print the response text and the token usage. Then make a second call with streaming enabled and print each chunk as it arrives. Document: what changes between a non-streaming and streaming call in terms of response handling, and what the token usage numbers tell you about cost estimation.",
        hint:
          "The SDK handles authentication automatically if ANTHROPIC_API_KEY is set in the environment. For streaming, iterate over the stream object and check each event's type before accessing its content.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working code examples",
      "Both challenges completed — including the architectural note on session usage",
      "Anthropic API called successfully with both standard and streaming modes documented",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "You are designing a Python function that calls the Anthropic API on behalf of users. The call can fail in five distinct ways: network timeout, invalid API key, rate limit exceeded, server error (500), and malformed request (400). How do you structure the error handling so each failure mode is handled appropriately and the caller always receives a specific, actionable result?",
      application:
        "Your Python service processes 10,000 Anthropic API calls per day. The calls arrive in bursts — 500 in the first two minutes of each hour, then silence. How do you design the call pattern to avoid rate limit errors while still processing every request within an acceptable time window?",
      architecture:
        "You need to call three different AI APIs from the same Python service — Anthropic, OpenAI, and a local Ollama instance. Each has different authentication patterns, error formats, and rate limits. Design the module structure that handles all three without duplicating retry logic, credential management, or error normalization. What abstractions do you introduce, and why?",
      defense:
        "A teammate proposes storing API keys in a config.py file that is added to .gitignore. They argue it is safe because the file is never committed to the repository. Walk me through every way this approach can fail and what you recommend instead.",
      connection:
        "In Stage 6, you called the Anthropic API manually with curl. Now you are calling it from Python. What failure modes exist in programmatic API calls that do not exist in manual curl calls — and how does the retry decorator you built in Stage 11 apply here?",
    },

    reflectionPrompts: [
      "The Open-Meteo API client you built makes a design choice: session or no session. What information would you need about traffic patterns to be confident your choice is correct, and how would you measure it?",
      "Exponential backoff with jitter is one solution to rate limiting. What other strategies exist, and under what constraints would each be more appropriate than backoff?",
      "You called the Anthropic API in streaming mode. The response arrives token by token. What changes about how you compute cost, handle errors, and update a user interface compared to a synchronous call?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 14: SQL Fundamentals
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "sql-fundamentals",
    number: 14,
    chapter: 3,
    chapterTitle: "APIs & Databases",
    isChapterEnd: false,

    title: "SQL Fundamentals",
    description:
      "Learn relational database design, SELECT with filtering and ordering, aggregations, JOINs, data modification, and schema design — using PostgreSQL as the target database.",
    whyItMatters:
      "Every production AI system stores state: conversation history, user data, document metadata, evaluation results, cost logs. SQL is not going away. An AI engineer who cannot design a schema, write a JOIN, or understand an index is dependent on others for the data layer of every system they build — and unable to diagnose the most common class of production performance problems.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "PostgreSQL Tutorial",
        author: "PostgreSQL Global Development Group",
        url: "https://www.postgresql.org/docs/current/tutorial.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "3–4 hours",
        selectionReason:
          "The official PostgreSQL tutorial, written by the engineers who built the database. Because this curriculum uses Supabase — which is PostgreSQL — learning SQL from the PostgreSQL documentation directly means no translation layer between what you learn and what your production database does. PostgreSQL's tutorial is notably readable compared to other database official documentation.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Select Star SQL",
        author: "Zi Chun Kao",
        url: "https://selectstarsql.com",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "3–5 hours interactive",
        selectionReason:
          "A free interactive SQL book widely recommended in data engineering communities for teaching set-based thinking rather than procedural thinking. The book's approach — writing queries against real public data and explaining the relational algebra behind each result — produces the mental model needed to write correct SQL without trial and error. Consistently recommended by working data engineers as a supplement to official documentation.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "relational-model",
        title: "The relational model",
        description:
          "Understand tables, rows, columns, primary keys, foreign keys, and referential integrity. Know why NULL is not the same as zero or empty string, and what implications this has for queries.",
      },
      {
        key: "select-queries",
        title: "SELECT — filtering and ordering",
        description:
          "Write SELECT queries with WHERE, AND, OR, NOT, IN, BETWEEN, LIKE, IS NULL, ORDER BY, LIMIT, and OFFSET. Understand how the database evaluates WHERE clauses.",
      },
      {
        key: "aggregations",
        title: "Aggregations",
        description:
          "Use COUNT, SUM, AVG, MAX, MIN with GROUP BY and HAVING. Understand the difference between WHERE (filters rows before grouping) and HAVING (filters groups after aggregation).",
      },
      {
        key: "joins",
        title: "JOINs",
        description:
          "Write INNER JOIN, LEFT JOIN, and understand RIGHT JOIN. Know the specific class of bug each join type produces when used incorrectly — missing rows, unexpected NULLs, or Cartesian explosion.",
      },
      {
        key: "data-modification",
        title: "Data modification",
        description:
          "Write INSERT, UPDATE, DELETE, and UPSERT (INSERT ... ON CONFLICT). Understand why an UPDATE without a WHERE clause is a production incident waiting to happen.",
      },
      {
        key: "schema-design",
        title: "Schema design",
        description:
          "Design normalized schemas with appropriate primary keys, foreign key constraints, and NOT NULL constraints. Understand when to normalize and when denormalization is a deliberate performance tradeoff.",
      },
    ],

    miniChallenges: [
      {
        key: "ai-chat-schema-design",
        title: "AI Chat Application Schema",
        description:
          "Design the complete database schema for a minimal AI chat application. It must store: users (with email and created_at), conversations (each belonging to one user, with a title and model name), messages (each belonging to one conversation, with role, content, and token count), and a running total of tokens per conversation. Write the full CREATE TABLE statements including primary keys, foreign keys, NOT NULL constraints, and DEFAULT values. Then identify every index you would create and write one sentence justifying each — including whether you would index foreign keys and why.",
        hint:
          "Start with the entities (nouns), then the relationships (verbs). Every foreign key is a candidate for an index — but not every foreign key justifies one. The justification depends on query patterns.",
      },
      {
        key: "analytics-queries",
        title: "Analytics Queries",
        description:
          "Create the AI chat schema in a local PostgreSQL or SQLite database and seed it with at least 20 realistic rows. Then write queries to answer: (1) the top 5 users by total tokens consumed across all conversations, (2) all conversations from the last 7 days with their message count and total tokens, (3) the average token count per message grouped by role (user vs assistant), and (4) any conversation where a single message exceeded 1,000 tokens. For each query, explain which clause does the filtering work and why.",
        hint:
          "Query 1 requires joining users → conversations → messages and grouping by user. Query 3 groups by role across all messages, regardless of conversation or user.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with real queries written and executed",
      "Both challenges completed with index justifications written",
      "Can write a JOIN, aggregation, and schema from memory without references",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain what makes SQL declarative rather than procedural, and why this means the query optimizer may produce a different execution plan than the one you mentally imagined when you wrote the query. Why does this matter for debugging slow queries?",
      application:
        "You have a table of 200,000 AI interaction logs with columns: user_id, model, prompt_tokens, completion_tokens, cost_usd, and created_at. Write the SQL query to find the top 10 users by total spend in the last 30 days, but only include users who have made at least 10 interactions in that period. Walk me through every clause and why it is there.",
      architecture:
        "Design the database schema for an AI application that stores users, conversations, messages, and per-message token usage. Identify which columns need indexes, explain the reasoning behind each index, and describe one query pattern that would be slow without each index you chose.",
      defense:
        "A teammate proposes storing conversation history as a JSON column in the users table — one JSON blob per user — instead of relational tables. They argue it is simpler and avoids joins. Under what circumstances is this the correct call, and under what circumstances is it a mistake that compounds over time?",
      connection:
        "The Prisma schema you write in Stage 15 is a TypeScript abstraction over the SQL schema you designed here. What SQL capabilities does Prisma make harder to express cleanly — and when would you drop down to raw SQL even in a Prisma-based application?",
    },

    reflectionPrompts: [
      "You designed the AI chat schema and chose which columns to index. Six months later, the application is slow on a specific query that was not in your original design. Walk through how you would diagnose whether the slowness is a missing index, a slow query, or a data volume problem.",
      "NULL in SQL is not false, not zero, and not empty string. It is the absence of a value. Write three specific queries where failing to account for NULL produces silently wrong results — wrong counts, wrong averages, or missing rows.",
      "A LEFT JOIN and an INNER JOIN return different rows. Without running a query, predict which one an AI application should use when loading conversation messages — and explain what happens to the user experience if you choose the wrong one.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 15: PostgreSQL & Prisma
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "postgresql-prisma",
    number: 15,
    chapter: 3,
    chapterTitle: "APIs & Databases",
    isChapterEnd: false,

    title: "PostgreSQL & Prisma",
    description:
      "Bridge raw SQL to Prisma's TypeScript abstraction: understand what Prisma generates under the hood, write and run migrations, perform CRUD operations, query relations, and use transactions for atomic writes.",
    whyItMatters:
      "Supabase — which powers this application — is PostgreSQL. Prisma is already in this codebase. Travis needs to understand what Prisma is doing under the hood so he can debug the cases where the abstraction leaks, write migrations safely, and know when to drop to raw SQL. ORM fluency requires understanding the SQL it generates, not just the TypeScript API.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Prisma Documentation",
        author: "Prisma",
        url: "https://www.prisma.io/docs",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "3–4 hours across key sections",
        selectionReason:
          "The official Prisma documentation is comprehensive, well-organized, and regularly updated. For a tool as configuration-heavy as an ORM, going to the official documentation first prevents the class of bugs that come from outdated blog posts teaching deprecated API patterns. Specifically: the schema reference, migrations guide, and Prisma Client CRUD sections.",
        qualityRating: "definitive",
      },
      reference: {
        title: "PostgreSQL — Data Definition and Indexes",
        author: "PostgreSQL Global Development Group",
        url: "https://www.postgresql.org/docs/current/ddl.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "When Prisma generates a migration and it behaves unexpectedly, the PostgreSQL DDL documentation explains exactly what each generated statement does — constraint behavior, index types, default evaluation, and locking behavior during ALTER TABLE operations. This is where to look when a migration fails in production.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "postgresql-specifics",
        title: "PostgreSQL-specific features",
        description:
          "Understand PostgreSQL data types that Prisma maps to TypeScript (String, Int, Float, Boolean, DateTime, Json). Use EXPLAIN ANALYZE to read a query execution plan and identify whether an index is being used.",
      },
      {
        key: "prisma-schema",
        title: "Prisma schema",
        description:
          "Write model definitions with field types, @id, @unique, @default, @relation, and @@index. Understand that the schema is the single source of truth — the TypeScript client and the SQL DDL are both generated from it.",
      },
      {
        key: "prisma-migrations",
        title: "Migrations",
        description:
          "Run prisma migrate dev to generate and apply migrations. Read the generated SQL to verify it does what you intended. Understand why rolling back a migration requires a new forward migration, not a revert.",
      },
      {
        key: "prisma-client-crud",
        title: "Prisma Client CRUD",
        description:
          "Use findUnique, findFirst, findMany, create, update, upsert, and delete. Understand the difference between findUnique (throws if multiple results) and findFirst (returns the first match). Know when to use select versus include.",
      },
      {
        key: "prisma-relations",
        title: "Relations in Prisma",
        description:
          "Write one-to-many and one-to-one relations with @relation. Use include to load related records in a single query. Understand the N+1 query problem and how include prevents it.",
      },
      {
        key: "prisma-transactions",
        title: "Transactions",
        description:
          "Use prisma.$transaction to group writes that must succeed or fail together. Understand what atomicity means and give a specific example from this application where a non-atomic write produces corrupted data.",
      },
    ],

    miniChallenges: [
      {
        key: "orm-to-sql-translation",
        title: "ORM to SQL Translation",
        description:
          "Write five Prisma queries: (1) findMany with a nested where filter on a relation, (2) create with a nested createMany for related records, (3) update with an increment operation, (4) findMany with select to return only specific fields, (5) a groupBy aggregation. For each Prisma query, write the equivalent raw SQL. Then run EXPLAIN ANALYZE on the generated SQL in PostgreSQL and identify whether each query uses an index. Document one query where the Prisma abstraction produces SQL you would not have written yourself.",
        hint:
          "Use prisma.$queryRaw to compare raw SQL against Prisma queries against the same data. Prisma logs the generated SQL in development mode — enable queryLog in the Prisma client configuration.",
      },
      {
        key: "transaction-scenario",
        title: "Atomic Write Transaction",
        description:
          "Implement a prisma.$transaction that: (1) checks whether a user already has an active sprint, (2) if not, creates a new sprint and all its tasks in a single atomic operation, (3) updates the user's currentStage field simultaneously. The transaction must guarantee that if any step fails, no partial data is written. Test the atomicity by simulating a failure between steps 2 and 3 and verifying the database is in a clean state afterward.",
        hint:
          "In a Prisma transaction, all operations receive the same transaction client (tx). If any prisma.X.Y() call inside the transaction throws, Prisma rolls back all operations. To simulate a failure, throw an Error after the sprint creation and verify no sprint row exists in the database.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with real Prisma queries and migrations",
      "Both challenges completed with the SQL translation documented",
      "Can write a Prisma schema, run a migration, and explain the generated SQL",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is a database migration, and why is it dangerous to apply schema changes to a production database with live traffic by connecting directly and running ALTER TABLE rather than through a versioned migration system?",
      application:
        "Your Prisma schema adds a required stageKey String field to the Sprint model, which already has 500 rows in the production database. What does prisma migrate dev generate, why will it fail to run as-is, and what do you add to the migration SQL to make it safe?",
      architecture:
        "You need to query 100,000 document chunks, count the most common topics, group them, and return results with their vector embeddings. Describe when you use Prisma's query builder versus $queryRaw for this operation, and what specifically in Prisma's abstraction model makes it the wrong tool for this particular query.",
      defense:
        "A teammate argues that ORMs like Prisma are leaky abstractions that add complexity and you should write raw SQL for everything. Evaluate this argument honestly — where are they correct, where are they wrong, and what is your actual recommendation for this project specifically?",
      connection:
        "The Sprint and SprintTask models in this application's Prisma schema map to SQL tables you could have designed in Stage 14. Open the migration SQL generated in Stage 15 and identify every constraint, index, and foreign key. What does understanding this mapping help you do when a Prisma query returns unexpected results?",
    },

    reflectionPrompts: [
      "You translated Prisma queries to raw SQL. Which Prisma operation produced SQL you would not have written yourself? Is the Prisma-generated SQL better or worse than what you would have written?",
      "The N+1 query problem occurs when you load a list of records and then query each record's relations individually. Before learning Prisma's include, how would this have manifested in application code? What is the performance cost at 1,000 records versus 10 records?",
      "Prisma's transaction guarantees atomicity. Describe a real scenario in this application — not a hypothetical one — where a non-atomic write would produce data corruption that is silent, meaning the application continues working but the data is wrong.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 16: Authentication & Security Basics
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "auth-security-basics",
    number: 16,
    chapter: 3,
    chapterTitle: "APIs & Databases",
    isChapterEnd: true,

    title: "Authentication & Security Basics",
    description:
      "Understand the distinction between authentication and authorization, how JWT tokens work mechanically, what Clerk is doing in this application, API key security, HTTPS, and the OWASP vulnerabilities most relevant to AI applications.",
    whyItMatters:
      "Every AI application Travis builds handles sensitive data: user conversations, API keys, personal information. Security failures in AI applications are not abstract — they produce real data breaches. Understanding authentication, authorization, and the most common vulnerability patterns is a prerequisite for shipping anything that touches real user data.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "OWASP Cheat Sheet Series",
        author: "OWASP Foundation",
        url: "https://cheatsheetseries.owasp.org",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "2–3 hours across relevant sheets",
        selectionReason:
          "OWASP is the industry standard for web application security. The Cheat Sheet Series is used by security engineers at major companies, referenced in security audits, and required reading in software engineering roles with security responsibilities. Specifically read: Authentication Cheat Sheet, Session Management Cheat Sheet, and Secrets Management Cheat Sheet. There is no more authoritative freely available security reference.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Clerk Documentation — How Clerk Works",
        author: "Clerk",
        url: "https://clerk.com/docs/how-clerk-works/overview",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "This application uses Clerk for authentication. Reading how Clerk implements session management, token verification, and OAuth flows connects abstract security concepts to the specific code already running in this project. The Connection interview question for this stage requires understanding the exact flow documented here.",
        qualityRating: "excellent",
      },
      deepDive: {
        title: "JWT.io — Introduction to JSON Web Tokens",
        author: "Auth0",
        url: "https://jwt.io/introduction",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "30 minutes",
        selectionReason:
          "Auth0's JWT documentation is the clearest available explanation of JWT structure, signing algorithms, and verification. Auth0 is an identity infrastructure company whose engineers are primary contributors to the JWT specification. The interactive debugger at jwt.io allows direct inspection of token claims — essential for the JWT Decoder challenge.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "auth-vs-authz",
        title: "Authentication versus authorization",
        description:
          "Understand the precise distinction: authentication proves who you are, authorization decides what you can do. Know the specific class of vulnerability that results from confusing the two in API design.",
      },
      {
        key: "jwt-tokens",
        title: "JWT tokens — structure and verification",
        description:
          "Understand a JWT's three components: header, payload, and signature. Know what the signature proves and, critically, what it does not prove. Understand token expiration and the risk of long-lived tokens.",
      },
      {
        key: "oauth-flow",
        title: "OAuth 2.0 flow",
        description:
          "Trace the authorization code flow: redirect, code exchange, token issuance. Understand what Clerk implements on behalf of this application and why building this from scratch is risky.",
      },
      {
        key: "api-key-security",
        title: "API key security",
        description:
          "Understand key rotation, scope limitation, storage patterns, and what happens operationally when a key is compromised. Know every place an API key can leak in a web application.",
      },
      {
        key: "https-tls",
        title: "HTTPS and TLS",
        description:
          "Understand what TLS encrypts, what it does not encrypt, and why an AI application that sends user conversations over HTTP is a privacy failure even if the server is not internet-facing.",
      },
      {
        key: "owasp-top-10-basics",
        title: "OWASP Top 10 for AI applications",
        description:
          "Study the three OWASP vulnerabilities most relevant to AI applications: injection (prompt injection is a variant), broken authentication, and sensitive data exposure. Understand how each manifests specifically in a system that calls external AI APIs.",
      },
    ],

    miniChallenges: [
      {
        key: "clerk-audit",
        title: "Clerk Implementation Audit",
        description:
          "Audit this application's Clerk implementation. Document: (1) where the session token is created and what claims it carries, (2) where it is validated on each authenticated request, (3) what happens to the request if the token is expired or tampered with, (4) what the proxy.ts middleware does and what requests it does not protect, (5) at least two specific security improvements you would make to the current implementation. Reference specific files and line numbers in your audit.",
        hint:
          "Read src/proxy.ts, src/app/(dashboard)/layout.tsx, and src/lib/user.ts. The middleware and the layout both perform auth checks — understand why both exist and what gap each one closes.",
      },
      {
        key: "jwt-decoder",
        title: "JWT Decoder",
        description:
          "Using only Python's standard library — no jwt, PyJWT, or cryptography packages: obtain a test JWT token (use jwt.io's debugger to generate one), base64-decode the header and payload sections, parse the JSON, and print the claims in a readable format. Then write a paragraph explaining: what the decoded token proves, what it does not prove, and what an attacker could do if they intercepted a valid token with a one-hour expiration.",
        hint:
          "A JWT is three base64url-encoded strings separated by dots. base64url differs from standard base64 — replace - with + and _ with / before decoding, and pad with = to a multiple of 4. The signature is the third section — you can decode it but not verify it without the secret key.",
      },
      {
        key: "defense-in-depth-probe",
        title: "Defense-in-Depth Probe",
        description:
          "Attempt to access protected routes in this application without valid authentication. Using curl (not a browser), make requests to: (1) /dashboard, (2) /api/interview/new if it existed, (3) any server action endpoint directly. For each attempt, document exactly: what HTTP response you receive, what status code, what response body, and which layer of the application stopped the request — the proxy middleware, the layout auth guard, or the server action auth check. Then, for each enforcing layer, answer: if this specific layer were removed but the others remained, what would an attacker be able to do? Produce a table with four columns: endpoint, response received, layer that enforced security, consequence of removing that layer.",
        hint:
          "The proxy.ts middleware runs at the edge for all requests. The dashboard layout's auth() check runs as a server component. Server actions have their own auth() call. Each layer can fail independently — they are not aliases of each other. An attacker who can bypass the middleware but not the layout guard has a different attack surface than one who can bypass the layout guard but not server actions.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with examples connecting each concept to this application's implementation",
      "All three challenges completed — Clerk audit includes specific file references, Defense-in-Depth Probe produces the four-column table",
      "Can explain JWT structure and the authentication/authorization distinction without notes",
      "Chapter 3 project submitted with public URL, GitHub repository, architecture diagram, workflow diagrams, and both ADRs",
      "AI interview passed at 85% or above",
      "Chapter 3 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain the difference between authentication and authorization using a concrete AI application scenario where getting them confused produces a specific, exploitable security vulnerability.",
      application:
        "A user reports they can view another user's conversation history in your AI application. Walk me through exactly how you diagnose whether this is an authentication failure, an authorization failure, or a query bug — and how the fix is different in each case.",
      architecture:
        "Map every point in this application's request flow where a security decision is made: from a browser request through the proxy middleware, through the dashboard layout, through a server action, through a Prisma query. For each decision point, name the threat and the mitigation in place.",
      defense:
        "Your team is building an internal AI tool used by five employees on a private network. A teammate says authentication is unnecessary because the tool is not accessible from the internet. What specific risks are they underestimating, and what is the minimum viable authentication you would implement regardless?",
      connection:
        "This application uses Clerk for authentication. Looking at the proxy.ts middleware and the getOrCreateUser function in lib/user.ts: explain the complete flow when an authenticated user requests the dashboard. Where does Clerk's responsibility end, where does your application code take over, and what would break if the getOrCreateUser function were removed?",
    },

    reflectionPrompts: [
      "You audited this application's Clerk implementation and found at least two improvements. What would it cost — in time and complexity — to implement each one? How do you decide which security improvements are worth their implementation cost?",
      "A JWT token's payload is base64-encoded, not encrypted. What does this mean for what information you should and should not put in a JWT's claims in an AI application that handles sensitive user data?",
      "Prompt injection is OWASP's LLM01 vulnerability — a user crafting input that overrides your system prompt. You will build AI systems throughout the rest of this curriculum. Describe two specific scenarios in a future project where prompt injection could produce a harmful outcome.",
    ],

    chapterProject: {
      title: "AI Knowledge Base API",
      description:
        "A document ingestion and full-text search API built on PostgreSQL with FastAPI and Prisma. This API stores and searches the knowledge base that becomes a full RAG system in Chapter 5. Building it without vector search now — using PostgreSQL's native tsvector full-text search — makes the Chapter 5 upgrade concrete and deliberate rather than a black box.",
      requirements: [
        "FastAPI backend with OpenAPI documentation auto-generated at /docs",
        "PostgreSQL via Prisma — document schema with title, content, source_url, tags (array), created_at, and a tsvector search column",
        "Full-text search using PostgreSQL tsvector: documents indexed at ingestion, searched via tsquery at query time",
        "REST endpoints: POST /documents (ingest), GET /documents (list with pagination and tag filtering), GET /documents/{id} (retrieve single), DELETE /documents/{id} (remove), GET /search?q= (full-text ranked search)",
        "API key authentication on all endpoints — key passed in the Authorization header",
        "Background processing: large documents (over 5,000 characters) are chunked at ingestion time; chunk count stored on the document record",
        "Test the API with at least 10 real documents — use content from CURRICULUM.md as the corpus",
        "README with complete endpoint documentation including request/response examples for each endpoint",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 2,
        additionalNotes: [
          "Architecture diagram must show: API client → FastAPI → Prisma → PostgreSQL, including where tsvector indexing occurs and the background chunking path for large documents",
          "Two workflow diagrams required: (1) document ingestion — from POST /documents through chunking, storage, and tsvector index update; (2) search — from GET /search?q= through tsquery parsing, tsvector match, ranking, and response",
          "ADR 1: Search technology — why PostgreSQL tsvector instead of Elasticsearch, Meilisearch, or a dedicated search service. Include what would change this decision at scale and note that this decision will be revisited in Chapter 5 when vector search is added.",
          "ADR 2: Chunking strategy — how documents are split, what chunk size was chosen and why, what the expected impact is on future semantic search quality when the vector upgrade happens.",
        ],
      },
    },
  },
];
