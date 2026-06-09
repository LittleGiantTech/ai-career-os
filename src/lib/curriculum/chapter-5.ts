import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 5: AI Engineering — Stages 20–25
//
// Goal: Understand how language models work mechanistically, design and evaluate
// RAG systems, and build reliable agentic pipelines — with engineering rigor,
// not framework familiarity.
//
// Design principle: Concepts before tools. Reasoning before syntax.
// Every task asks why before how. Every challenge requires measurement.
// Every interview question must earn the respect of a senior AI engineer.
//
// This is not a LangChain curriculum. This is not a prompt tricks curriculum.
// This is an AI engineering curriculum.
//
// Chapter project: AI Career Coach — a production RAG-powered assistant
// grounded in the curriculum content from this application.
//
// Resource diversity:
//   Andrej Karpathy (Tier 2, widely recognized):        Stage 20 primary
//   Anthropic official docs (Tier 1):                  Stages 20 ref, 21 primary, 22 primary, 25 primary
//   Original research papers (Tier 1 in AI field):     Stages 21 ref, 23 primary, 25 reference
//   Jay Alammar at Cohere (Tier 2, respected educator): Stage 22 reference
//   Lewis et al. RAG paper (Tier 1 research):          Stage 23 primary
//   RAGAS framework docs (Tier 2, practitioner tool):  Stage 24 primary
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_5_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 20: LLM Fundamentals
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "llm-fundamentals",
    number: 20,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: false,

    title: "LLM Fundamentals",
    description:
      "Understand how transformer-based language models work at the conceptual level: attention, tokenization, context windows, sampling, model selection, and cost modeling — the engineering foundation for every AI integration that follows.",
    whyItMatters:
      "An AI engineer who does not understand how language models work cannot make good architectural decisions. When a model produces inconsistent output, the engineer who understands temperature and sampling can diagnose and fix it. When a production system is over-budget, the engineer who understands token pricing can optimize it. When context window limits cause failures, the engineer who understands the tradeoff can design around them. Treating the model as a black box produces systems that fail unpredictably.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Intro to Large Language Models",
        author: "Andrej Karpathy",
        url: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "60 minutes",
        selectionReason:
          "Karpathy is a former OpenAI research director and Tesla AI director. This video is widely regarded as the best accessible explanation of how large language models work — not just what they do. It explains the transformer architecture, in-context learning, and emergent capabilities at the level an AI engineer needs to reason about model behavior without requiring a mathematics PhD. Consistently recommended by engineers at leading AI companies as required viewing.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Anthropic — Models Overview",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/docs/about-claude/models/overview",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30 minutes",
        selectionReason:
          "The authoritative reference for Claude model capabilities, context windows, pricing, and model selection guidance. For an application that calls the Anthropic API in production, understanding the specific tradeoffs between Haiku, Sonnet, and Opus is a cost and quality engineering decision, not a preference.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Attention Is All You Need",
        author: "Vaswani et al. (Google Brain)",
        url: "https://arxiv.org/abs/1706.03762",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Abstract + Section 3: 30 minutes",
        selectionReason:
          "The original transformer paper. Read only the abstract and Section 3 (Model Architecture). Reading the source paper — not a blog post summarizing it — builds the habit of working from primary sources that distinguishes senior engineers from practitioners who absorb knowledge secondhand. The attention mechanism described here is the mechanism running inside every model Travis will use.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "transformer-architecture",
        title: "Transformer architecture — conceptual model",
        description:
          "Understand attention: what it computes, why it allows the model to consider every token in context simultaneously, and why this is fundamentally different from RNNs that process tokens sequentially. No mathematics required — build the correct mental model.",
      },
      {
        key: "tokenization",
        title: "Tokenization",
        description:
          "Understand what tokens are, how text maps to tokens (not a one-to-one relationship with words), why non-English text is more expensive, and why token count matters for both cost and context window calculations.",
      },
      {
        key: "context-windows",
        title: "Context windows",
        description:
          "Understand what a context window is, what happens when it is exceeded, and the engineering tradeoffs of long context: quality, cost, and the 'lost in the middle' phenomenon where models attend poorly to content in the center of long contexts.",
      },
      {
        key: "temperature-sampling",
        title: "Temperature and sampling",
        description:
          "Understand temperature as a modification to the probability distribution over the next token — higher temperature flattens the distribution, lower temperature sharpens it. Understand top-p and top-k as complementary constraints. Know when to use each.",
      },
      {
        key: "model-families-selection",
        title: "Model families and selection",
        description:
          "Understand the capability-cost-latency tradeoff across Claude Haiku, Sonnet, and Opus (and their GPT-4o/Gemini equivalents). Know that benchmark scores are necessary but insufficient for model selection — the relevant benchmark is your task on your data.",
      },
      {
        key: "cost-modeling",
        title: "Cost modeling",
        description:
          "Calculate production cost: input tokens × price + output tokens × price. Estimate monthly cost for a real workload. Understand why output tokens are more expensive than input tokens, and why prompt caching changes the calculation.",
      },
    ],

    miniChallenges: [
      {
        key: "token-cost-calculator",
        title: "Token Cost Calculator",
        description:
          "Using the Anthropic tokenizer (or tiktoken for comparison), measure token counts for ten different text samples: a tweet, a paragraph, a legal contract excerpt, Python code, JSON, markdown, non-English text, and three samples of your own choosing. Then build a Python function that estimates monthly API cost given: calls per day, average input length in characters (convert to estimated tokens), and average output length in tokens. Test it against three real workload scenarios and document where the estimate is most uncertain.",
        hint:
          "Token count is not characters divided by 4 — that is an approximation. Non-English text typically uses 2–3× more tokens than equivalent English. The Anthropic tokenizer is available via the anthropic Python SDK.",
      },
      {
        key: "temperature-measurement",
        title: "Temperature Measurement",
        description:
          "Design and run a systematic experiment comparing temperature 0.0, 0.5, and 1.0 on two different task types: (1) extracting a specific date from a paragraph of text, (2) writing the opening sentence of a short story. Run each combination 5 times. Measure: output consistency (how similar are the five outputs?), factual accuracy (for the extraction task), and lexical diversity (for the creative task). Document your findings. The goal is not to find the 'best' temperature — it is to understand what temperature actually controls.",
        hint:
          "Measure consistency by comparing outputs pairwise with a simple overlap metric. Temperature 0.0 does not guarantee identical outputs — the model still has randomness from floating point operations. Two runs at temperature 0.0 may still differ slightly.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with documented examples and calculations",
      "Both challenges completed with quantitative measurements, not just observations",
      "Can explain the attention mechanism conceptually and its engineering implications without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "A language model trained only to predict the next token demonstrates what appears to be reasoning, planning, and instruction-following. What is the mechanistic explanation for why these capabilities emerge from next-token prediction alone — and what does this explanation imply about the limits of those capabilities?",
      application:
        "You are choosing between Claude Haiku and Claude Sonnet for a production feature. The cost difference is 10x. What information do you need to make this decision correctly, and why is the model's MMLU benchmark score insufficient as the primary signal?",
      architecture:
        "A user's conversation with your AI assistant has exceeded the model's 200,000-token context window. Describe three architecturally different approaches to handle this, the quality tradeoff in each, and which user behavior degrades most noticeably under each approach.",
      defense:
        "A product manager asks you to fine-tune Claude on the company's internal documents to make it 'know more about our domain.' Evaluate this request — what fine-tuning actually does mechanistically, when it is the correct answer, and when RAG is the correct answer instead.",
      connection:
        "HTTP is stateless — each request carries no memory of prior requests. Language models are stateless in an analogous sense. What is that sense, how does it affect the architecture of a multi-turn AI application, and how did you already handle this constraint in the authentication system you built in Chapter 3?",
    },

    reflectionPrompts: [
      "The 'lost in the middle' phenomenon shows that models attend most strongly to the beginning and end of their context window. Before reading about this, would you have predicted it? Now that you know it, how does it change how you structure prompts and context in a RAG system?",
      "You measured that temperature 0.0 does not guarantee identical outputs. What does this tell you about relying on determinism for testing AI systems? How do you write tests for a component that has inherent randomness?",
      "A model trained on data up to a certain date has a knowledge cutoff. But fine-tuning on newer data does not update all knowledge — it updates the weights in ways that can degrade existing knowledge. This is called catastrophic forgetting. How does knowing this change your recommendation about fine-tuning versus RAG for a domain-specific application?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 21: Prompt Engineering
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "prompt-engineering",
    number: 21,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: false,

    title: "Prompt Engineering",
    description:
      "Learn prompt engineering as an engineering discipline — systematic design, measurement, failure mode analysis, and versioning — not as a collection of tricks. Understand why prompting works, when it fails, and how to evaluate it.",
    whyItMatters:
      "Prompts are the primary interface between engineers and language models. A poorly designed system prompt produces inconsistent, unsafe, or low-quality outputs. A well-designed one produces reliable, structured, and safe outputs. This is a precision engineering discipline with measurable outcomes — not an art form practiced by intuition.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Anthropic Prompt Engineering Guide",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "3–4 hours",
        selectionReason:
          "The authoritative prompt engineering reference for the model this application uses. Written by the team that built Claude, it documents not just techniques but the reasoning behind them — grounded in how the model was trained and evaluated. Superior to any third-party guide because it reflects the actual model's behavior rather than generalizations across models.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
        author: "Wei et al. (Google Research)",
        url: "https://arxiv.org/abs/2201.11903",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The paper that established chain-of-thought prompting as a research finding rather than a practitioner technique. Reading the source demonstrates why CoT works (it forces the model into a reasoning trajectory that improves accuracy on multi-step problems) rather than just that it works. Engineers who understand why a technique works can apply it correctly and know when it does not apply.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "system-prompts",
        title: "System prompt design",
        description:
          "Design system prompts that specify role, context, constraints, output format, and behavior boundaries. Understand how the system prompt and user message interact — and why a system prompt that works for one model version may not work for the next.",
      },
      {
        key: "few-shot-prompting",
        title: "Few-shot prompting",
        description:
          "Add examples to prompts to demonstrate the desired input-output pattern. Understand why this works (in-context learning, not memorization), when it helps significantly, and when it adds cost without improving quality.",
      },
      {
        key: "chain-of-thought",
        title: "Chain-of-thought prompting",
        description:
          "Request step-by-step reasoning before a final answer. Understand the mechanism: CoT forces the model into a reasoning trajectory that reduces the probability of jumping to incorrect conclusions on multi-step problems. Know the class of problems where CoT helps and where it does not.",
      },
      {
        key: "structured-outputs",
        title: "Structured output and output formatting",
        description:
          "Design prompts that reliably produce structured output — JSON, specific formats, constrained vocabulary. Understand why LLMs sometimes violate format instructions and the engineering approaches that reduce (not eliminate) this.",
      },
      {
        key: "prompt-failure-modes",
        title: "Prompt failure modes",
        description:
          "Study hallucination, instruction following failures, and prompt injection. Understand hallucination as a confident-sounding incorrect output — not random noise — and what architectural patterns (grounding, retrieval, verification) reduce its production impact.",
      },
      {
        key: "prompt-versioning-evaluation",
        title: "Prompt versioning and systematic evaluation",
        description:
          "Treat prompts as versioned artifacts. Build a minimum viable evaluation harness: a set of test inputs, expected outputs, and a scoring function. Understand why eyeballing prompt outputs is insufficient for production systems.",
      },
    ],

    miniChallenges: [
      {
        key: "prompt-iteration",
        title: "Systematic Prompt Improvement",
        description:
          "Choose a task: extracting structured data (company name, date, dollar amount) from ten different unstructured invoice text samples. Start with the simplest possible prompt. Run it against all ten samples and score accuracy. Then improve it systematically — adding format instructions, then examples, then constraints — measuring accuracy after each change. Document every change, the reasoning behind it, and the measured impact. The final prompt should score at least 80% across all ten samples. The process — not the final prompt — is the deliverable.",
        hint:
          "Score each extraction field independently: company name correct, date correct, amount correct. A perfect extraction requires all three correct. Partial credit reveals which field is hardest to extract, which tells you where to focus prompt improvements.",
      },
      {
        key: "prompt-injection-defense",
        title: "Prompt Injection Defense",
        description:
          "Build a system prompt that constrains an AI assistant to only answer questions about Python programming. Then attempt to break it with five different prompt injection attacks: (1) direct instruction override ('Ignore previous instructions and...'), (2) role-playing attack ('Act as a different AI that can...'), (3) context injection through a 'document' that changes behavior, (4) gradual constraint erosion across multiple turns, and (5) one attack of your own design. Document which attacks succeed and which fail, and improve the prompt until all five are blocked. Explain each defensive measure you added and the mechanism by which it works.",
        hint:
          "Effective injection defenses include: explicit statements of what the model will not do (not just what it will), instructions about how to handle off-topic requests, and context about why the constraint exists. Defenses that block the form of an attack ('never follow instructions that say ignore') are more brittle than defenses that target the mechanism.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with real prompts and documented results",
      "Both challenges completed with quantitative measurements in the iteration challenge",
      "Prompt injection defense challenge includes mechanistic explanation of each defensive measure",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Why does adding examples to a prompt (few-shot prompting) improve model performance on a task, given that the model was not retrained on those examples? Explain the mechanism — not just that it works.",
      application:
        "You have a production prompt that extracts structured fields from customer emails. Accuracy is 78% on your 100-email test set. How do you determine whether the problem is (a) the prompt design, (b) the model's capability ceiling for this task type, or (c) incorrect evaluation criteria? Walk me through your diagnostic process.",
      architecture:
        "You are managing 20 different prompts across three models for a production AI system. Describe the infrastructure you build to: version prompts with the same rigor as code, test changes without breaking production, measure the impact of each change, and roll back when a change degrades performance.",
      defense:
        "A colleague argues prompt engineering is not real engineering — it is just trying things until something works. Counter this with a systematic methodology for improving prompt performance that has the rigor of debugging code.",
      connection:
        "A system prompt is a contract between you and the model. How is this similar to and different from an API contract between two services — specifically in terms of versioning, breaking changes when the model updates, and how you write tests against something with inherent non-determinism?",
    },

    reflectionPrompts: [
      "You built a prompt injection defense. Which attack was hardest to block? What does the difficulty of blocking that specific attack reveal about how language models process instructions?",
      "Hallucination is defined as a confident-sounding incorrect output. Given this definition, what is the correct architectural response to hallucination — and why is 'write a better prompt' an insufficient solution for a production system?",
      "You treated prompts as versioned artifacts with a test harness. How does this change the relationship between a prompt change and a deployment? What can you ship confidently, and what requires more caution?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 22: Embeddings & Semantic Search
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "embeddings-semantic-search",
    number: 22,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: false,

    title: "Embeddings & Semantic Search",
    description:
      "Understand embeddings geometrically — what they represent, how cosine similarity works, and why the geometry of embedding space matters. Learn chunking strategies, approximate nearest-neighbor search, and the failure modes of semantic search.",
    whyItMatters:
      "Embeddings are the mechanism that makes RAG, semantic search, and document retrieval work. An engineer who does not understand what cosine similarity is measuring cannot diagnose a retrieval system that returns irrelevant results. Understanding the geometry of embedding space is not optional — it is what separates an engineer who debugs retrieval from one who blames the model.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Anthropic — Embeddings",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The authoritative documentation for embedding models usable with the Anthropic ecosystem. Covers model selection, use cases, and the specific considerations for production embedding pipelines. Starting with the official documentation for the platform being used grounds the conceptual learning in the actual tools.",
        qualityRating: "excellent",
      },
      reference: {
        title: "The Illustrated Word2Vec",
        author: "Jay Alammar (Cohere)",
        url: "https://jalammar.github.io/illustrated-word2vec/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Jay Alammar is a principal research engineer at Cohere and one of the most respected AI educators in the field. His illustrated explanations of embedding spaces build the geometric intuition needed to reason about why similarity search works — and why it fails. This article specifically builds the mental model for how semantic meaning is encoded in vector space, which is the prerequisite for understanding RAG retrieval quality.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "what-embeddings-are",
        title: "Embeddings as geometric objects",
        description:
          "Understand embeddings as dense numerical vectors in a high-dimensional space where geometric proximity encodes semantic similarity. Build the intuition: why can vector arithmetic produce king - man + woman ≈ queen, and what does this reveal about what embedding spaces encode?",
      },
      {
        key: "embedding-models",
        title: "Embedding models and their properties",
        description:
          "Understand the dimensions, context limits, and capability differences between embedding models. Know that a larger embedding model is not always better — the relevant metric is retrieval quality on your specific data and query distribution.",
      },
      {
        key: "cosine-similarity",
        title: "Cosine similarity — geometry and interpretation",
        description:
          "Understand cosine similarity as measuring the angle between vectors, not their magnitude or distance. Know why this geometric property makes cosine similarity better suited for semantic search than Euclidean distance — and what it means when two very different texts have high cosine similarity.",
      },
      {
        key: "semantic-search-mechanics",
        title: "Semantic search — mechanics and failure modes",
        description:
          "Implement semantic search: embed a query, compute cosine similarity against a corpus, return top-k results. Understand when semantic search fails: polysemy (same word, different meanings), false positives from domain-adjacent content, and distribution shift between training and retrieval data.",
      },
      {
        key: "chunking-strategies",
        title: "Chunking strategies",
        description:
          "Understand why documents must be split before embedding. Compare fixed-size chunking (predictable, simple, breaks semantic units), sentence-boundary chunking (preserves meaning, variable size), and paragraph-based chunking (natural semantic boundaries, irregular size). Know that chunk size is a retrieval quality parameter, not a storage parameter.",
      },
      {
        key: "approximate-nearest-neighbor",
        title: "Approximate nearest-neighbor search",
        description:
          "Understand why exact nearest-neighbor search over millions of vectors is impractical. Know that approximate algorithms (HNSW, IVF) trade recall for speed — and that this tradeoff has direct impact on retrieval quality in production RAG systems.",
      },
    ],

    miniChallenges: [
      {
        key: "semantic-search-from-scratch",
        title: "Semantic Search From Scratch",
        description:
          "Without a vector database: embed 50 text chunks from the curriculum content using an embedding model, store them as a list of (text, vector) tuples, implement cosine similarity from scratch using only NumPy (do not use a similarity function from a library), and build a search function that takes a query and returns the top-3 most relevant chunks. Then run 5 queries and verify that the results are semantically relevant. For each query, document one case where semantic search found a relevant result that keyword search would have missed, and one case where semantic search returned a result that was geometrically similar but not what the user needed.",
        hint:
          "Cosine similarity between vectors a and b: (a · b) / (||a|| × ||b||). Use numpy.dot for the dot product and numpy.linalg.norm for the magnitude. Normalize both vectors first for efficiency when searching a fixed corpus.",
      },
      {
        key: "chunking-experiment",
        title: "Chunking Strategy Experiment",
        description:
          "Take a 3,000-word article (use any Wikipedia article or a section of CURRICULUM.md). Chunk it three ways: 256-token fixed-size chunks, 512-token fixed-size chunks, and paragraph-based chunks. For each strategy, measure: total chunk count, average chunk size, the percentage of chunks under 50 tokens (fragments), and the maximum chunk size. Then run the same 5 queries against each strategy using your semantic search implementation and compare result quality. Document: which strategy produces the best results for factual retrieval, which produces the best results for conceptual retrieval, and what you would choose for the AI Knowledge Base API.",
        hint:
          "Paragraph-based chunking produces the most variable chunk sizes — some paragraphs are one sentence, some are twenty. Short chunks embed poorly because there is not enough context for the embedding model. Long chunks retrieve poorly because the similarity is averaged across many concepts.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with working implementations and documented experiments",
      "Both challenges completed with quantitative measurements and documented failure cases",
      "Can explain cosine similarity geometrically and describe three embedding failure modes without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Cosine similarity measures the angle between vectors, not their distance. Explain why this geometric property makes it better suited for semantic search than Euclidean distance — and then give a concrete example of two texts that would have high cosine similarity but should not be considered semantically equivalent.",
      application:
        "Your semantic search system returns documents about Python the programming language when a user asks about Python the snake. The cosine similarity scores exceed your threshold. What is happening at the embedding level, and what are three architecturally different approaches to fix it — with a different tradeoff in each?",
      architecture:
        "You are building semantic search over 10 million documents. Exact nearest-neighbor search is too slow. Compare the tradeoffs between HNSW and IVF approximate nearest-neighbor algorithms: what each algorithm sacrifices to achieve speed, and how that tradeoff manifests as a retrieval quality problem in production.",
      defense:
        "A teammate argues you should use the largest available embedding model because larger is always better for retrieval quality. Evaluate this claim — when is a larger embedding model genuinely better, and when does it hurt latency, cost, or retrieval quality?",
      connection:
        "The chunking strategy you chose for the AI Knowledge Base API in Chapter 3 — before you understood embeddings — directly determines retrieval quality now that you are adding vector search. What would you change and what would you keep, based on what you now understand about how chunk size affects embedding quality and retrieval precision?",
    },

    reflectionPrompts: [
      "You implemented cosine similarity from scratch. The formula is simple. What does the simplicity of the formula tell you about why the hard engineering problem in semantic search is not the similarity metric but the quality of the embeddings?",
      "Your chunking experiment showed different strategies win for different query types. This suggests a single chunking strategy is always a compromise. What would a system look like that uses multiple chunking strategies simultaneously — and what does implementing this cost?",
      "Approximate nearest-neighbor search trades recall for speed. In a legal research tool where missing a relevant document could affect a case outcome, how do you make the tradeoff decision between recall and query latency? What stakeholder conversation do you need to have before making this architectural choice?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 23: RAG Foundations
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "rag-foundations",
    number: 23,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: false,

    title: "RAG Foundations",
    description:
      "Understand Retrieval-Augmented Generation architecturally: what problem it solves, how the indexing and retrieval pipelines work, how retrieved context is assembled, and when RAG is the right tool versus fine-tuning.",
    whyItMatters:
      "RAG is the dominant pattern for grounding language models in specific knowledge. It is used in virtually every production AI application that requires knowledge beyond the model's training data. An engineer who cannot design, implement, and debug a RAG pipeline end-to-end is missing the most important skill in applied AI engineering.",

    estimatedDays: 6,

    resources: {
      primary: {
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        author: "Lewis et al. (Facebook AI Research)",
        url: "https://arxiv.org/abs/2005.11401",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1 hour (abstract, introduction, and sections 2–3)",
        selectionReason:
          "The original RAG paper, published at NeurIPS 2020. Reading the source paper provides the authoritative definition of RAG, the reasoning behind the architecture, and the specific problems it was designed to solve. Every blog post and tutorial about RAG is a simplification of what is in this paper. An engineer who has read the paper understands RAG; an engineer who has only read tutorials understands a version of RAG filtered through someone else's interpretation.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Anthropic — Contextual Retrieval",
        author: "Anthropic",
        url: "https://www.anthropic.com/news/contextual-retrieval",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30 minutes",
        selectionReason:
          "Anthropic's published research on improving RAG retrieval quality through context-aware chunk processing. Grounding the curriculum in primary research from the model provider — rather than third-party tutorials — ensures Travis is learning approaches that reflect current understanding rather than patterns that may already be superseded.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "rag-architecture",
        title: "RAG architecture — three pipelines",
        description:
          "Understand RAG as three distinct pipelines: indexing (documents → chunks → embeddings → vector store), retrieval (query → embedding → similarity search → ranked chunks), and generation (query + chunks → prompt → model → answer with citations). Know what can go wrong in each pipeline independently.",
      },
      {
        key: "vector-databases",
        title: "Vector databases — what they do and when to use them",
        description:
          "Understand what a vector database provides beyond a list of vectors: HNSW or IVF indexes, metadata filtering, hybrid search, and persistence. Know when pgvector (PostgreSQL extension) is sufficient and when a dedicated vector database (Pinecone, Weaviate, Chroma) is warranted.",
      },
      {
        key: "indexing-pipeline",
        title: "Indexing pipeline",
        description:
          "Implement document loading, chunking, embedding, and vector storage as a sequential pipeline. Understand idempotent indexing — why re-indexing the same document should produce the same result, and how to detect and skip documents that have not changed.",
      },
      {
        key: "retrieval-strategies",
        title: "Retrieval strategies",
        description:
          "Compare top-k similarity search (fast, simple, may miss relevant documents outside the k threshold) with similarity threshold filtering (may return 0 or 1000 results) and metadata filtering (constrains the search space before similarity is computed). Know what each strategy optimizes.",
      },
      {
        key: "context-assembly",
        title: "Context assembly",
        description:
          "Understand how retrieved chunks are assembled into the prompt context: ordering (most relevant first or last?), deduplication (the same passage from different sources), token budget management, and the 'lost in the middle' challenge for long context windows.",
      },
      {
        key: "citation-grounding",
        title: "Citation and grounding",
        description:
          "Implement answers that cite their sources. Understand why grounding is not just a UX feature — it is the primary mechanism for detecting when a model is generating content outside the retrieved context (hallucinating within the RAG pipeline).",
      },
    ],

    miniChallenges: [
      {
        key: "upgrade-knowledge-base-pgvector",
        title: "Upgrade the Knowledge Base API with Vector Search",
        description:
          "Add pgvector to the AI Knowledge Base API from Chapter 3. Steps: (1) add the pgvector extension to the Supabase database, (2) add a vector column to the document chunks table in the Prisma schema and run a migration, (3) embed each chunk on ingestion using an embedding model and store the vector, (4) add a GET /search/semantic?q= endpoint that embeds the query, runs a cosine similarity search, and returns ranked results with scores. Then run five queries against both the full-text search endpoint and the new semantic search endpoint and document three queries where they return different results — explain why each difference occurs.",
        hint:
          "Supabase supports pgvector natively. Enable it in the Supabase dashboard under Database → Extensions. The Prisma schema uses Unsupported('vector(1536)') for the vector column type. Use prisma.$queryRaw to run the cosine similarity query since Prisma's typed API does not support vector operations.",
      },
      {
        key: "context-window-manager",
        title: "Context Window Budget Manager",
        description:
          "Write a Python function context_budget_manager(retrieved_chunks, max_tokens, query) that: takes a list of retrieved chunks with their relevance scores and token counts, a maximum token budget, and the original query; and returns the optimal subset of chunks to include in a RAG prompt. The function must: include the most relevant chunks first, never exceed the token budget, and deduplicate chunks that are more than 85% identical (compare chunk text directly). Test it against a corpus where the top-10 results exceed the budget and verify the subset selection is correct. Document the edge case where no single chunk fits within the budget.",
        hint:
          "Sort chunks by relevance score descending. Add chunks to the context greedily until the next chunk would exceed the budget. For deduplication, compute character-level overlap: len(set(a) & set(b)) / len(set(a) | set(b)) is a simple Jaccard similarity. Chunks above 0.85 similarity are treated as duplicates.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with a working RAG implementation",
      "Knowledge Base API upgraded with pgvector semantic search",
      "Context window budget manager implemented and tested with documented edge cases",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain the fundamental difference between what RAG provides and what fine-tuning provides. A legal team asks which approach makes the model 'know' their internal contracts. Neither framing is completely correct — what is the accurate technical description of what each approach actually does to the model's behavior?",
      application:
        "Your RAG system retrieves the five most similar chunks for every query. A user asks a question that requires synthesizing information from chunks 1, 3, and 7 in your corpus — but chunks 4 and 5 are more similar to the query than chunk 7. Your users are getting incomplete answers 40% of the time. Diagnose the problem and propose two architectural changes with different tradeoff profiles.",
      architecture:
        "Design the indexing and retrieval architecture for a RAG system over 500,000 documents where: documents are updated daily, some queries require precise recent information, and some require conceptual understanding of stable knowledge. Why does a single retrieval strategy fail this use case, and what do you design instead?",
      defense:
        "A stakeholder says you should give the model direct search tool access to the entire document corpus rather than building a RAG pipeline. Compare these approaches: what does each optimize for, what does each fail at, and under what constraints would you choose the tool-calling approach over RAG?",
      connection:
        "The AI Knowledge Base API you built in Chapter 3 uses PostgreSQL full-text search. You are now adding vector search. Explain what full-text search finds that vector search misses, what vector search finds that full-text search misses, and why a production RAG system that only uses vector search is incomplete.",
    },

    reflectionPrompts: [
      "You read the original RAG paper. The paper's architecture uses two retrievers — a dense (vector) retriever and a generative model — in a way that is somewhat different from how most tutorials describe RAG. What is the difference, and does it matter for the systems you are building?",
      "Idempotent indexing means re-indexing the same document produces the same result. What breaks in a production RAG pipeline if indexing is not idempotent — specifically when documents are updated daily and the indexer might run twice on the same day?",
      "The 'lost in the middle' phenomenon means models attend poorly to content in the center of a long context. How does this change how you order retrieved chunks when assembling context — and what does it mean for the quality of RAG answers that synthesize information from many chunks?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 24: RAG Evaluation & Optimization
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "rag-evaluation-optimization",
    number: 24,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: false,

    title: "RAG Evaluation & Optimization",
    description:
      "Learn to measure RAG quality systematically: faithfulness, answer relevance, retrieval precision and recall. Build evaluation datasets, diagnose failure modes, and optimize using hybrid search, query rewriting, and reranking.",
    whyItMatters:
      "A RAG system that works in a demo may fail on real data. Evaluation is what separates a prototype from a production system. An engineer who cannot measure quality cannot know whether a change is an improvement. Systematic evaluation of retrieval and generation quality is the discipline that makes RAG engineering rather than RAG guessing.",

    estimatedDays: 6,

    resources: {
      primary: {
        title: "RAGAS — Automated Evaluation of Retrieval Augmented Generation",
        author: "Shahul Es et al. (ExplodingGradients)",
        url: "https://docs.ragas.io",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "2–3 hours",
        selectionReason:
          "RAGAS is the most widely adopted open-source RAG evaluation framework, with published research (EMNLP 2023) and adoption at companies including AWS and Microsoft. Its documentation defines faithfulness, answer relevance, context precision, and context recall in precise, measurable terms — turning subjective quality assessment into reproducible metrics. Learning RAGAS teaches the metrics, not just the tool.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Building Effective Agents — Evaluation",
        author: "Anthropic",
        url: "https://www.anthropic.com/research/building-effective-agents",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1 hour",
        selectionReason:
          "Anthropic's published guidance on evaluating AI systems in production — including the specific challenge of evaluating systems that call tools and retrieve context. The evaluation principles described here apply directly to the AI Career Coach being built in Stage 25.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "rag-failure-modes",
        title: "RAG failure mode taxonomy",
        description:
          "Understand the four primary RAG failure modes: retrieval failure (the right chunk is not retrieved), context overflow (too many chunks, key information is lost in the middle), generation unfaithfulness (the model generates content beyond the retrieved context), and answer irrelevance (the answer is faithful to the context but does not address the question).",
      },
      {
        key: "evaluation-metrics",
        title: "Evaluation metrics",
        description:
          "Define and distinguish: faithfulness (is the answer supported by the retrieved context?), answer relevance (does the answer address the question?), context precision (what fraction of retrieved chunks are actually relevant?), and context recall (what fraction of relevant information was retrieved?). Know that faithfulness and answer relevance can conflict.",
      },
      {
        key: "evaluation-dataset",
        title: "Building evaluation datasets",
        description:
          "Create question-answer-source ground truth triples. Understand synthetic evaluation dataset generation (use an LLM to generate questions from documents) and its specific failure modes: the evaluation LLM may ask questions only answerable from the documents, creating artificially high scores on an unrepresentative dataset.",
      },
      {
        key: "hybrid-search",
        title: "Hybrid search",
        description:
          "Combine keyword search (BM25 or PostgreSQL tsvector) with vector similarity search using Reciprocal Rank Fusion. Understand why hybrid search outperforms pure vector search on queries with specific entities, rare terms, and exact phrase requirements.",
      },
      {
        key: "retrieval-optimization",
        title: "Retrieval optimization",
        description:
          "Learn query rewriting (transform the user's question into a better retrieval query), multi-query retrieval (generate multiple query variants and merge results), and HyDE (Hypothetical Document Embeddings — generate what the answer might look like, embed that, and retrieve similar documents). For each, understand the mechanism and when it helps.",
      },
      {
        key: "reranking",
        title: "Reranking",
        description:
          "Understand a reranker as a cross-encoder that scores (query, chunk) pairs with higher accuracy than embedding similarity, at higher latency. Know when adding a reranker improves retrieval quality enough to justify the latency cost — and when it does not.",
      },
    ],

    miniChallenges: [
      {
        key: "rag-eval-suite",
        title: "RAG Evaluation Suite",
        description:
          "Build an evaluation dataset of 15 question-answer-source triples from the curriculum content. Each triple must include: the question, the expected answer, and the specific chunk(s) that should be retrieved to answer it. Run the RAG system against all 15 questions. Score each result on three dimensions: (1) did the system retrieve at least one of the expected source chunks? (2) is the generated answer factually consistent with the retrieved context? (3) does the answer address the question? Calculate the aggregate score for each dimension. Identify the two lowest-scoring questions and diagnose why they failed — is it a retrieval problem, a generation problem, or a context assembly problem?",
        hint:
          "Write the ground truth triples before running any queries — contamination is easy if you look at what the system retrieves before deciding what the correct source is. Score retrieval and generation independently so you can tell which pipeline component is causing failures.",
      },
      {
        key: "hybrid-search-implementation",
        title: "Hybrid Search with Reciprocal Rank Fusion",
        description:
          "Implement hybrid search for the AI Knowledge Base API: run the same query through both PostgreSQL tsvector full-text search and pgvector cosine similarity search, then combine the ranked results using Reciprocal Rank Fusion (RRF). The RRF formula for a document d is: RRF_score(d) = Σ 1/(k + rank_i(d)), where k=60 and rank_i is the document's position in each result list. Run the same 5 evaluation queries against pure vector search, pure full-text search, and hybrid search. For each query, document which approach performs best and why — what property of the query makes each approach succeed or fail?",
        hint:
          "RRF k=60 is a standard constant that reduces the influence of very high rankings and prevents one ranking system from dominating completely. Documents that appear in both result lists get a boost; documents in only one list get a smaller contribution.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with a working evaluation harness",
      "Evaluation suite built and run — results documented with failure diagnosis",
      "Hybrid search implemented and benchmarked against single-strategy baselines",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Define faithfulness and answer relevance as RAG evaluation metrics. Explain why a system can score high on answer relevance but low on faithfulness — and why this specific combination represents a more dangerous failure mode than the reverse.",
      application:
        "Your RAG system has 70% end-to-end accuracy on your evaluation set. You have one engineering week to improve it. Describe exactly how you determine whether to invest in retrieval quality, chunking strategy, context assembly, or generation — what evidence points to each, and in what order do you investigate?",
      architecture:
        "You need an evaluation framework for a RAG system that answers legal questions. Human-labeled ground truth is expensive. Describe a methodology for building evaluation data without extensive human labeling, identify the specific ways this methodology produces misleading evaluation scores, and explain how you guard against each failure.",
      defense:
        "Your RAG system scores 85% on the 200-question evaluation dataset you built. It performs poorly on production queries from real users. What is the most likely explanation for this gap, and what does it reveal about the evaluation dataset? How do you close the gap?",
      connection:
        "The evaluation metrics you are applying to the RAG system in this stage are the same metrics you will use to determine whether the AI Career Coach is ready to use. Before building the coach in Stage 25, describe what your evaluation dataset must contain and how you will know — with data, not intuition — whether the system is ready.",
    },

    reflectionPrompts: [
      "You built a synthetic evaluation dataset using an LLM to generate questions. Then you evaluated your RAG system against those questions and got 80% accuracy. What should your confidence level be in this result — and what does the other 20% tell you?",
      "Hybrid search outperformed pure vector search on three of your five evaluation queries. The two where it did not outperform were both conceptual questions. What property of conceptual questions makes vector search competitive with hybrid search?",
      "You added a reranking step and improved retrieval precision but increased latency by 300ms. For the AI Career Coach — a system that answers questions about the learning curriculum — is this tradeoff worth it? What additional information would you need to be confident in that decision?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 25: AI Agents & Tool Use
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "ai-agents-tool-use",
    number: 25,
    chapter: 5,
    chapterTitle: "AI Engineering",
    isChapterEnd: true,

    title: "AI Agents & Tool Use",
    description:
      "Understand the agent loop conceptually, design tools with correct failure semantics, recognize and prevent agent failure modes, and know when agents are the right architecture versus a simpler pipeline.",
    whyItMatters:
      "Agents are what happens when a language model can take actions — call APIs, query databases, run code, search documents. The agent pattern is increasingly the architecture for AI applications that need to complete multi-step tasks. But agents introduce a class of failure modes — compounding errors, infinite loops, irreversible actions — that do not exist in single-shot LLM calls. Engineering reliable agents requires understanding these failure modes, not just the API.",

    estimatedDays: 6,

    resources: {
      primary: {
        title: "Building Effective Agents",
        author: "Anthropic",
        url: "https://www.anthropic.com/research/building-effective-agents",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Anthropic's research document on agent design is the most rigorous publicly available guide to building reliable agentic AI systems. It focuses on reliability, failure modes, and architectural tradeoffs — the engineering substance — rather than on framework usage. Written by engineers who have built and observed production agent systems at scale.",
        qualityRating: "definitive",
      },
      reference: {
        title: "ReAct: Synergizing Reasoning and Acting in Language Models",
        author: "Yao et al. (Princeton / Google)",
        url: "https://arxiv.org/abs/2210.03629",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes (sections 1–3)",
        selectionReason:
          "The paper that introduced the ReAct pattern — alternating between reasoning traces and actions — which is the conceptual foundation of most production agent architectures. Reading the original paper provides the mechanism behind why interleaving reasoning with tool use improves reliability, not just the observation that it does.",
        qualityRating: "excellent",
      },
      deepDive: {
        title: "LangGraph Documentation",
        author: "LangChain",
        url: "https://langchain-ai.github.io/langgraph/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "2–3 hours",
        selectionReason:
          "LangGraph is referenced here as an implementation tool for state machine-based agents — not as the conceptual framework for understanding agents. Read after the Anthropic and ReAct resources, not before. The graph abstraction LangGraph provides solves a real engineering problem (managing complex agent state), but understanding why the problem exists comes from the primary sources above.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "agent-loop",
        title: "The agent loop",
        description:
          "Understand the agent loop: the model receives a task, reasons about what to do, selects a tool, executes it, observes the result, and decides whether the task is complete or another step is needed. Know the exit conditions — and the failure mode when exit conditions are poorly defined.",
      },
      {
        key: "tool-definition",
        title: "Tool definition and function schemas",
        description:
          "Write tool definitions as function schemas that the model uses to select and call tools. Understand that the tool description is a prompt — vague descriptions produce poor tool selection. Write tool descriptions that make the selection decision obvious for the model.",
      },
      {
        key: "tool-design",
        title: "Tool design principles",
        description:
          "Design tools that are: atomic (one action per tool), idempotent where possible, safe to call with invalid arguments, and honest about their capabilities in their descriptions. Understand that tool design is the primary lever for improving agent reliability — better than prompt improvements alone.",
      },
      {
        key: "react-pattern",
        title: "ReAct — reasoning and acting",
        description:
          "Understand the ReAct pattern: the model alternates between reasoning traces ('I need to find the current price') and actions (call_tool: get_price). Understand why interleaving reasoning with action improves reliability on multi-step tasks — and why it can also produce longer, more expensive completions.",
      },
      {
        key: "agent-failure-modes",
        title: "Agent failure modes",
        description:
          "Study the four primary agent failure modes: infinite loops (the agent calls the same tool repeatedly), tool hallucination (the agent calls a tool that does not exist or with fabricated arguments), compounding errors (early mistakes amplify through subsequent steps), and scope creep (the agent takes actions beyond what was requested).",
      },
      {
        key: "when-not-to-use-agents",
        title: "When not to use agents",
        description:
          "Understand that agents are the most complex and least reliable AI architecture. Know the conditions that justify an agent over a simpler pipeline: the task is genuinely multi-step with unknown steps at the start, the steps are tool-dependent, and the quality gain from flexibility justifies the reliability cost.",
      },
    ],

    miniChallenges: [
      {
        key: "tool-calling-agent",
        title: "Tool-Calling Agent — Anthropic Tool Use Directly",
        description:
          "Build a Python agent using the Anthropic tool use API directly — no LangChain, no LangGraph. The agent must have three tools: (1) search_curriculum(query: str) that calls the semantic search endpoint from the Knowledge Base API, (2) calculate(expression: str) that evaluates a mathematical expression safely using Python's ast module, (3) get_current_date() that returns today's date. Run the agent against 10 test inputs. Document every case where the agent: chose the wrong tool, called a tool with incorrect arguments, or produced a correct final answer via an incorrect reasoning path. The documentation of failures is the primary deliverable.",
        hint:
          "Build the tool selection loop manually: send the message with tool definitions, check if the response contains a tool_use block, execute the tool, append the tool_result to the messages array, and send again. Stop when the response has no tool_use block. Add a maximum iteration counter (say, 10) to prevent infinite loops.",
      },
      {
        key: "agent-with-memory",
        title: "Agent with Conversation Memory",
        description:
          "Extend the tool-calling agent to maintain conversation memory across turns: the agent should remember which tools it called in previous turns, what results they returned, and avoid redundant tool calls within a conversation. Implement this using a conversation history list that includes both user messages and tool results. Test with a 5-turn conversation that requires the agent to remember a curriculum fact from turn 2 when answering a question in turn 5. Document: what the agent remembers and what it forgets between turns, and what would happen to token cost and context length in a 100-turn conversation.",
        hint:
          "The Anthropic API messages array accumulates the full conversation: user messages, assistant responses (including tool_use blocks), and tool_result messages. As the conversation grows, so does the context. There is no summarization — the full history is sent every turn.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with a working agent implementation",
      "Tool-calling agent built directly with Anthropic API — no frameworks",
      "Failure documentation for 10 test inputs completed and analyzed",
      "Chapter 5 project submitted with evaluation results, architecture diagrams, workflow diagrams, and all ADRs",
      "AI interview passed at 85% or above",
      "Chapter 5 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "An agent that individually calls each of five tools with 90% reliability fails to complete a 5-step task 41% of the time. Derive this failure rate mathematically and explain what it implies for how you design production agentic systems — specifically what it means for task decomposition and error recovery.",
      application:
        "Your agent is supposed to research a topic using three tools: semantic search, database lookup, and an external API call. After 8 iterations, it is still calling the semantic search tool with slightly different queries and has not used the other two tools. Describe the three most likely causes of this behavior — each with a different underlying mechanism — and the fix for each.",
      architecture:
        "You are designing an agentic customer service system that can look up order status, process refunds, and escalate to humans. Design the decision architecture that determines when the agent acts autonomously versus when it pauses for human review — and specifically what constraints prevent the agent from processing a refund without confirmation when the amount exceeds a threshold.",
      defense:
        "A product manager wants to build a fully autonomous agent that handles all customer inquiries without human involvement. Identify the specific failure modes — not general risks, but concrete failure scenarios — that make full autonomy dangerous for this use case, and propose an architecture that maximizes automation while preserving appropriate human oversight.",
      connection:
        "You built a retry decorator in Stage 11, idempotent background jobs in Stage 18, and structured error handling throughout Chapter 2. How do these three patterns apply to building reliable agentic systems — and what does the agent pattern require that none of these earlier patterns provide?",
    },

    reflectionPrompts: [
      "You documented agent failures across 10 test inputs. What pattern do you notice in the failure cases? Are failures random or are there systematic conditions that produce failures more reliably? What does the pattern tell you about what to fix first?",
      "The ReAct paper shows that interleaving reasoning with tool use improves task completion rates. But reasoning traces add tokens to every response. For the AI Career Coach — which answers questions about the curriculum — is the reliability improvement worth the cost increase? How would you measure the answer to this question?",
      "You implemented conversation memory by accumulating all messages in the context. A 100-turn conversation with tool calls might use 50,000 tokens per request. What are three architectural approaches to memory that do not require accumulating the full conversation history — and what does each approach fail to preserve?",
    ],

    chapterProject: {
      title: "AI Career Coach",
      description:
        "A production RAG-powered AI assistant that answers questions about the AI Product Engineer learning curriculum. The knowledge base is the curriculum content indexed in the AI Knowledge Base API from Chapter 3. This is not a demo — it must answer real questions about real curriculum content with citations and measurable accuracy.",
      requirements: [
        "The complete curriculum content (all implemented chapters of CURRICULUM.md) indexed in the Knowledge Base API with both full-text and vector search enabled",
        "Multi-turn conversation with memory across turns — previous questions and answers maintained in context",
        "Minimum three tools: search_curriculum(query) for semantic retrieval, get_stage_details(stage_number) for structured stage information, suggest_next_action(current_stage) for progression guidance",
        "Every answer includes citations — which stage, section, or chunk the answer is grounded in",
        "Streaming responses delivered progressively, not buffered",
        "Deployed as a FastAPI endpoint using the Production API infrastructure from Chapter 4",
        "Evaluation suite: 25 real questions about the curriculum, scored on retrieval precision, answer faithfulness, and answer relevance. System must score 85%+ overall.",
        "All tool calls, retrieved chunks, token usage, and latency logged for every conversation turn",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 3,
        additionalNotes: [
          "Architecture diagram must show: user → FastAPI → Agent loop → Tools → Knowledge Base API → pgvector + PostgreSQL, with conversation memory storage and streaming output path",
          "Two workflow diagrams required: (1) single-turn Q&A — from user question through tool selection, retrieval, context assembly, generation, and streaming response with citations; (2) multi-turn conversation — how conversation history and tool call history influence subsequent tool selection and context",
          "ADR 1: RAG vs fine-tuning — why RAG is the correct approach for making the coach knowledgeable about this curriculum, and under what conditions fine-tuning would be the correct answer instead",
          "ADR 2: pgvector vs dedicated vector database — why PostgreSQL vector search is sufficient for the current corpus size and query volume, and what specific metrics would trigger a migration to a dedicated vector database",
          "ADR 3: Agent architecture — what the three tools do that a simpler single-prompt approach could not, and what the complexity cost of the agent approach is versus a simpler retrieval + generation pipeline",
        ],
      },
    },
  },
];
