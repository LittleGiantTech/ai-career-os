import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 1: The Web & Internet — Stages 1–6
//
// Goal: Understand how websites, browsers, servers, and APIs communicate.
// Chapter project: Personal Portfolio Website — deployed, publicly accessible.
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_1_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 1: How the Web Works
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "how-the-web-works",
    number: 1,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: false,

    title: "How the Web Works",
    description:
      "Understand what happens between typing a URL and seeing a webpage. Covers DNS resolution, TCP/IP connections, HTTP request-response cycles, status codes, and basic browser rendering.",
    whyItMatters:
      "Every AI system Travis will build lives on the internet and responds to HTTP. DNS, TCP, and HTTP appear constantly in error logs, API debugging, and system design conversations. An engineer who cannot explain this is guessing when things break — and things always break.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "How the Web works",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "MDN is the authoritative reference for web standards, maintained by Mozilla and contributed to by browser vendors. This specific article is the canonical starting point for understanding client-server communication and is linked to from engineering onboarding materials at major companies.",
        qualityRating: "definitive",
      },
      reference: {
        title: "An overview of HTTP",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30 minutes",
        selectionReason:
          "The definitive HTTP reference. Working engineers return to this page repeatedly throughout their careers. Covers methods, status codes, headers, and the request-response model with precision.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "High Performance Browser Networking — Chapter 1: Primer on Latency and Bandwidth",
        author: "Ilya Grigorik (Google)",
        url: "https://hpbn.co/primer-on-latency-and-bandwidth/",
        type: "book",
        tier: "tier-2-educator",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "O'Reilly-published book available free online, written by a Google Chrome engineer. Chapter 1 provides the TCP/IP and networking fundamentals that explain why performance behaves the way it does. Referenced in Google's web performance guidance.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "dns-resolution",
        title: "DNS resolution",
        description: "Understand what happens between typing a URL and a server receiving the request — DNS lookup, IP address resolution, and why it takes time.",
      },
      {
        key: "tcp-ip",
        title: "TCP/IP connections",
        description: "Understand what a TCP connection is, what the three-way handshake means, and why connections have latency costs.",
      },
      {
        key: "http-vs-https",
        title: "HTTP vs HTTPS",
        description: "Understand the HTTP protocol structure — method, URL, headers, body — and why TLS encryption matters for every production application.",
      },
      {
        key: "request-response-cycle",
        title: "Request-response cycle",
        description: "Trace the full path of an HTTP request: client sends, server receives, server processes, server responds, client receives.",
      },
      {
        key: "http-status-codes",
        title: "HTTP status codes",
        description: "Memorize the meaning of 200, 201, 301, 400, 401, 403, 404, and 500 — when each appears and what it signals to the client.",
      },
      {
        key: "browser-rendering",
        title: "Browser rendering pipeline",
        description: "Understand what the browser does after receiving an HTML response — parsing, DOM construction, CSS application, and paint.",
      },
    ],

    miniChallenges: [
      {
        key: "broken-request-diagnosis",
        title: "The Broken Request Diagnosis",
        description:
          "Open browser DevTools, visit three different websites, and document the following for the initial HTML request on each: HTTP method, status code, content-type header, and response time. Write one sentence explaining why each status code was returned.",
        hint: "The Network tab in DevTools shows every request. Click on the first document request to see its headers.",
      },
      {
        key: "status-code-map",
        title: "Status Code Map",
        description:
          "Without referencing any documentation, write one sentence explaining when a developer would encounter each of the following: 200, 201, 301, 400, 401, 403, 404, 500. Then verify each answer against MDN. Correct any that are wrong and document what you misunderstood.",
        hint: "Write your answers first, then verify. The correction process is the learning.",
      },
    ],

    completionCriteria: [
      "All six tasks studied and documented in personal notes",
      "Both challenges completed with written explanations",
      "Can draw the full request-response cycle from memory without references",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What happens between typing a URL and seeing a webpage? Walk me through every step.",
      application:
        "A user reports your API returns a 401 but they are certain they are logged in. Walk me through exactly how you would diagnose this.",
      architecture:
        "Why does HTTPS matter for an AI application that handles user conversations and API keys?",
      defense:
        "A teammate says HTTP is sufficient for internal microservices because they are not internet-facing. Do you agree? Defend your position.",
      connection:
        "How will your understanding of HTTP request structure directly apply when you call the Anthropic Messages API in Stage 20?",
    },

    reflectionPrompts: [
      "What surprised you most about how the internet actually works compared to how you imagined it before this stage?",
      "If HTTP is stateless — the server remembers nothing between requests — how do websites know you are logged in when you navigate between pages? Think through this before looking it up.",
      "Write one paragraph explaining to someone who has never used a computer what happens when they press Enter after typing a URL.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 2: HTML & The Document
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "html-fundamentals",
    number: 2,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: false,

    title: "HTML & The Document",
    description:
      "Learn HTML document structure, semantic elements, forms, links, images, and how to inspect the DOM using browser DevTools.",
    whyItMatters:
      "HTML is not about making websites look good — that is CSS. HTML communicates structure and meaning to browsers, screen readers, and search engines. Semantic markup is the foundation that every UI Travis builds rests on. A div soup works until it doesn't, and the bugs it creates are invisible.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "Structuring content with HTML",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "4–6 hours",
        selectionReason:
          "MDN's structured HTML learning path is the industry standard for learning HTML correctly. It is used as the reference curriculum by professional bootcamps and referenced in browser vendor documentation. Covers semantics, accessibility, and forms with engineering rigor rather than tutorial shortcuts.",
        qualityRating: "definitive",
      },
      reference: {
        title: "HTML elements reference",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The complete authoritative reference for every HTML element. Working engineers consult this to verify correct element usage, attribute support, and accessibility semantics. There is no superior alternative.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Learn HTML",
        author: "web.dev (Google Chrome team)",
        url: "https://web.dev/learn/html",
        type: "course",
        tier: "tier-2-educator",
        estimatedDuration: "6–8 hours",
        selectionReason:
          "Produced by Google's Chrome developer relations team. Covers HTML semantics, accessibility, forms, and document structure at a deeper level than most tutorials. Regularly updated to reflect current standards and best practices.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "html-document-structure",
        title: "Document structure",
        description: "Understand DOCTYPE, html, head, and body elements — what each contains and why the structure exists.",
      },
      {
        key: "semantic-elements",
        title: "Semantic elements",
        description: "Learn header, nav, main, section, article, aside, and footer — what each communicates and when to use each versus a generic div.",
      },
      {
        key: "text-elements",
        title: "Text elements",
        description: "Understand the h1–h6 heading hierarchy, paragraph, strong, em, and blockquote — and why heading order matters for accessibility and SEO.",
      },
      {
        key: "links-and-images",
        title: "Links and images",
        description: "Learn anchor tags, href, src, alt text — and why a missing alt attribute is an accessibility failure, not a minor detail.",
      },
      {
        key: "forms",
        title: "Forms",
        description: "Understand input types, labels, fieldsets, and form action/method attributes — the foundation of every user-facing data collection interface.",
      },
      {
        key: "browser-devtools-dom",
        title: "Browser DevTools — DOM inspection",
        description: "Learn to inspect elements, modify HTML live in the browser, and read the DOM tree — the debugging skill used in every frontend session.",
      },
    ],

    miniChallenges: [
      {
        key: "semantic-audit",
        title: "Semantic Audit",
        description:
          "Find a publicly accessible website that uses heavy div-based structure (a common e-commerce or news site works well). Run it through the WAVE accessibility tool (wave.webaim.org). Document three specific semantic HTML violations — what element is used, what should be used instead, and what accessibility problem the current markup causes.",
        hint: "Look for navigation wrapped in divs instead of nav, content areas using divs instead of main or article, and headings used for styling rather than hierarchy.",
      },
      {
        key: "form-from-memory",
        title: "Form From Memory",
        description:
          "Without referencing any documentation, build an HTML form that collects: name (text), email (email input), experience level (select dropdown with beginner, intermediate, advanced options), a message (textarea), and a submit button. Then verify every element and attribute against MDN. Document what you got wrong and why.",
        hint: "Pay attention to label associations. A label must be connected to its input — either with for/id or by wrapping.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with examples written in a local HTML file",
      "Both challenges completed and documented",
      "Can build a semantic HTML page structure from memory",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is the difference between HTML elements and HTML attributes? Give three concrete examples of each.",
      application:
        "You are building an AI chat interface. What HTML structure would you use for the message list? Walk me through the semantic choices and why you made them.",
      architecture:
        "Why does semantic HTML matter for an AI-powered application that might eventually need to be indexed by search engines or navigated by screen readers?",
      defense:
        "A teammate says 'just use divs everywhere — semantic HTML doesn't matter in production.' How do you respond?",
      connection:
        "How does your understanding of HTML forms connect to what you learned about HTTP POST requests in Stage 1?",
    },

    reflectionPrompts: [
      "Before this stage, what did you think HTML was for? How has your understanding changed?",
      "Pick any website you use daily. Without inspecting it, write down what semantic HTML elements you believe it uses. Then inspect it. Were you right?",
      "Why would a screen reader user have a fundamentally different experience on a page built with divs versus a page built with semantic HTML? Describe the specific difference.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 3: CSS & Layout
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "css-layout",
    number: 3,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: false,

    title: "CSS & Layout",
    description:
      "Learn the CSS box model, specificity, Flexbox, Grid, responsive design with media queries, and CSS custom properties.",
    whyItMatters:
      "CSS is the first thing most developers rush through and the thing that causes the most lost hours later. The box model, specificity, Flexbox, and Grid are not optional knowledge — they are the vocabulary of every layout conversation. Travis will work on UIs throughout this entire path. Fluency here prevents entire categories of bugs.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Kevin Powell — CSS YouTube channel",
        author: "Kevin Powell",
        url: "https://www.youtube.com/@KevinPowell",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "4–5 hours across key videos",
        selectionReason:
          "Kevin Powell is widely recognized as the most respected CSS educator in the web development community. MDN links to his content in its own learning resources. His channel focuses exclusively on CSS with engineering depth rather than tutorial shortcuts. Specifically watch: 'Learn CSS Box Model in 8 Minutes', 'Flexbox or Grid?', and 'Learn CSS Grid the easy way'.",
        qualityRating: "excellent",
      },
      reference: {
        title: "CSS: Cascading Style Sheets — MDN Reference",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The authoritative CSS reference. Every property, value, and browser compatibility table is here. Working engineers consult MDN to verify CSS behavior, not tutorials.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Learn CSS",
        author: "web.dev (Google Chrome team)",
        url: "https://web.dev/learn/css",
        type: "course",
        tier: "tier-2-educator",
        estimatedDuration: "8–10 hours",
        selectionReason:
          "A structured CSS course produced by Google Chrome's developer relations team. Goes deeper than most resources on specificity, cascade, and layout algorithms. Treats CSS as an engineering discipline rather than a visual design tool.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "css-box-model",
        title: "The box model",
        description: "Understand content, padding, border, and margin — how they combine to determine rendered size, and what box-sizing: border-box changes.",
      },
      {
        key: "css-specificity",
        title: "Specificity and cascade",
        description: "Understand why some CSS rules override others — the specificity calculation, cascade order, and how to debug specificity conflicts.",
      },
      {
        key: "css-flexbox",
        title: "Flexbox",
        description: "Learn flex-direction, justify-content, align-items, flex-wrap, and gap — and when Flexbox is the right tool versus Grid.",
      },
      {
        key: "css-grid",
        title: "CSS Grid",
        description: "Learn grid-template-columns, grid-template-rows, grid-area, and placement — and the class of layouts Grid solves that Flexbox cannot.",
      },
      {
        key: "css-responsive",
        title: "Responsive design",
        description: "Understand media queries, mobile-first methodology, and viewport units — how to build layouts that work at every screen width.",
      },
      {
        key: "css-custom-properties",
        title: "CSS custom properties",
        description: "Learn --variables and :root — why custom properties exist, how they enable design systems, and how Tailwind uses them internally.",
      },
    ],

    miniChallenges: [
      {
        key: "layout-reconstruction",
        title: "Layout Reconstruction",
        description:
          "Choose any simple web page with a clear layout (a product landing page or blog post). Without inspecting its CSS, rebuild the layout structure using only Flexbox or Grid. The goal is correct layout logic — not pixel-perfect appearance. Document which layout system you chose and why.",
        hint: "Start with the outermost container and work inward. Identify the primary axis of layout first.",
      },
      {
        key: "responsive-card-grid",
        title: "Responsive Card Grid",
        description:
          "Build a card grid from scratch using only plain CSS (no frameworks, no Tailwind). Requirements: one column on mobile (under 640px), two columns on tablet (640–1024px), three columns on desktop (over 1024px). Each card must have a title, a paragraph, and a footer. Use CSS Grid and media queries only.",
        hint: "Mobile-first means writing your default CSS for the smallest screen, then adding media queries for larger screens.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with working code examples written locally",
      "Both challenges completed and visually correct at all breakpoints",
      "Can explain the box model calculation and specificity rules without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain the CSS box model. If a div has width: 200px, padding: 20px, and border: 2px, what is its total rendered width by default? What changes if you add box-sizing: border-box?",
      application:
        "You are building a dashboard with a fixed sidebar and a scrollable main content area. Walk me through exactly how you implement this layout in CSS — which properties are critical.",
      architecture:
        "When would you choose CSS Grid over Flexbox? Give a concrete example of a layout problem that Grid solves and Flexbox cannot handle cleanly.",
      defense:
        "A designer hands you a mockup that only works on desktop at 1440px wide. How do you push back, and what do you implement instead?",
      connection:
        "How will your understanding of CSS layout apply when you work with Tailwind CSS utility classes in the Next.js portions of this application?",
    },

    reflectionPrompts: [
      "Before this stage, how did you think CSS layout worked? What was the most surprising thing you learned about how the browser actually calculates layout?",
      "Describe a real layout bug you created during the challenges. What caused it, and how did you diagnose it?",
      "Why do professional engineers still struggle with CSS, even with years of experience? What makes it harder than it looks?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 4: JavaScript Fundamentals
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "javascript-fundamentals",
    number: 4,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: false,

    title: "JavaScript Fundamentals",
    description:
      "Learn variables, types, functions, arrays, objects, DOM manipulation, and async JavaScript including Promises and fetch.",
    whyItMatters:
      "JavaScript is the only programming language that runs natively in the browser. Every interactive AI interface — chat UIs, streaming responses, dynamic forms — depends on it. This stage covers fundamentals only. Frameworks change constantly. Fundamentals do not.",

    estimatedDays: 7,

    resources: {
      primary: {
        title: "The Modern JavaScript Tutorial",
        author: "javascript.info",
        url: "https://javascript.info",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "10–12 hours for Part 1",
        selectionReason:
          "javascript.info is widely considered the highest-quality JavaScript learning resource available. MDN links to it. It is recommended by the Node.js documentation. It treats JavaScript as an engineering subject — explaining the why behind every behavior — rather than as a collection of recipes. Part 1 (The JavaScript Language) covers all fundamentals in this stage.",
        qualityRating: "definitive",
      },
      reference: {
        title: "JavaScript — MDN Web Docs",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The authoritative JavaScript language and Web API reference. Every method signature, browser compatibility table, and specification note is here. Working engineers consult MDN to verify behavior, not to learn introductory concepts.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "You Don't Know JS Yet (book series)",
        author: "Kyle Simpson",
        url: "https://github.com/getify/You-Dont-Know-JS",
        type: "book",
        tier: "tier-2-educator",
        estimatedDuration: "Book 1 (Get Started): 3–4 hours",
        selectionReason:
          "Free on GitHub. Kyle Simpson is an industry-recognized JavaScript educator who has contributed to JavaScript specifications and taught at conferences worldwide. This series is the most rigorous free JavaScript resource available and is specifically recommended for engineers who want deep understanding rather than surface-level familiarity.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "js-variables-types",
        title: "Variables and types",
        description: "Understand let, const, string, number, boolean, null, undefined — and what typeof reveals about JavaScript's dynamic type system.",
      },
      {
        key: "js-functions",
        title: "Functions",
        description: "Learn function declaration, function expression, arrow functions, parameters, default arguments, and return values — the unit of reusable logic.",
      },
      {
        key: "js-arrays-objects",
        title: "Arrays and objects",
        description: "Learn array and object creation, access, mutation, and the three most important array methods: map, filter, and reduce.",
      },
      {
        key: "js-control-flow",
        title: "Control flow",
        description: "Understand if/else, ternary operators, for loops, while loops, and how JavaScript determines truthiness and falsiness.",
      },
      {
        key: "js-dom-manipulation",
        title: "DOM manipulation",
        description: "Learn querySelector, addEventListener, innerHTML, classList — how JavaScript reads and modifies the HTML document in real time.",
      },
      {
        key: "js-async",
        title: "Async JavaScript — Promises and fetch",
        description: "Understand why JavaScript is single-threaded, what Promises represent, how async/await works, and how to use fetch to make HTTP requests.",
      },
    ],

    miniChallenges: [
      {
        key: "dom-task-list",
        title: "DOM Task List",
        description:
          "Build a fully functional task list using only vanilla JavaScript — no frameworks, no libraries. Requirements: add tasks via a text input and button, mark tasks complete (with visible strikethrough), delete individual tasks, and persist all tasks to localStorage so they survive a page refresh. Every feature must work without a page reload.",
        hint: "JSON.stringify and JSON.parse handle localStorage serialization. addEventListener on the input for 'keydown' lets users press Enter to add tasks.",
      },
      {
        key: "fetch-and-render",
        title: "Fetch and Render",
        description:
          "Using the fetch API, call a free public REST API — either JSONPlaceholder (jsonplaceholder.typicode.com) or the Open Meteo weather API (open-meteo.com). Render the response data into the DOM dynamically. Implement three states: loading (show a loading indicator while the request is in flight), success (render the data), and error (display a user-readable error message if the request fails).",
        hint: "Use async/await with try/catch. Set a loading state before the fetch call and clear it in a finally block.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with working code examples",
      "Both challenges built and fully functional",
      "Can explain closures, the event loop, and async/await without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Why does JavaScript have both null and undefined, and who is responsible for setting each one?",
      application:
        "You are building a streaming AI chat UI where the response arrives token by token. Walk me through exactly which JavaScript APIs you use, how you handle the stream, and how you append each token to the UI without freezing the page.",
      architecture:
        "Explain event bubbling. Give me a specific example of a bug it would cause in a complex UI and how you would fix it.",
      defense:
        "A teammate insists on using var instead of let and const because 'it works the same.' Walk me through the specific cases where it does not work the same.",
      connection:
        "How does JavaScript's async/await model compare to Python's async handling that you will learn later in the curriculum? Where do they behave the same and where do they diverge?",
    },

    reflectionPrompts: [
      "JavaScript was designed in 10 days in 1995. Which quirks of the language make more sense now that you understand its history and the constraints it was designed under?",
      "Describe the moment during the DOM Task List challenge where something didn't work the way you expected. What was your debugging process?",
      "Why is the single-threaded nature of JavaScript both a constraint and a design advantage for the type of interactive UIs it is used to build?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 5: Git & Version Control
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "git-version-control",
    number: 5,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: false,

    title: "Git & Version Control",
    description:
      "Learn the core Git workflow — init, commit, branch, merge, and push — and how to collaborate using GitHub pull requests.",
    whyItMatters:
      "Every professional engineering workflow runs on Git. Every AI project Travis builds will live in a repository. An engineer who cannot use Git confidently cannot collaborate, deploy safely, or recover from mistakes. Git fluency is a prerequisite for everything in this curriculum.",

    estimatedDays: 3,

    resources: {
      primary: {
        title: "Pro Git (2nd Edition)",
        author: "Scott Chacon and Ben Straub",
        url: "https://git-scm.com/book/en/v2",
        type: "book",
        tier: "tier-1-official",
        estimatedDuration: "Chapters 1–3: 3–4 hours",
        selectionReason:
          "Pro Git is the definitive Git reference — free, hosted by the Git project itself, and written by engineers who built GitHub. It is referenced in the official Git documentation and is the resource professional engineers actually use. Chapters 1–3 cover everything in this stage. No other resource comes close in accuracy and depth.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Git Reference — official documentation",
        author: "Git project",
        url: "https://git-scm.com/docs",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The official Git command reference. Every flag, behavior, and edge case is documented here. When something behaves unexpectedly, this is the authoritative source.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "git-core-concepts",
        title: "Core concepts",
        description: "Understand repository, commit, branch, merge, remote, clone — the vocabulary of every Git workflow and code review conversation.",
      },
      {
        key: "git-daily-workflow",
        title: "Daily workflow",
        description: "Practice init, add, commit, push, pull, status, and log until the sequence is automatic.",
      },
      {
        key: "git-branching",
        title: "Branching and merging",
        description: "Learn to create branches, switch between them, merge changes, and resolve conflicts — the foundation of every team workflow.",
      },
      {
        key: "github-workflow",
        title: "GitHub workflow",
        description: "Learn to create repositories, push branches, open pull requests, and write meaningful README files.",
      },
      {
        key: "gitignore",
        title: ".gitignore",
        description: "Understand what to exclude from version control — node_modules, .env files, build artifacts — and why committing secrets is an irreversible mistake.",
      },
    ],

    miniChallenges: [
      {
        key: "conflict-resolution",
        title: "Conflict Resolution",
        description:
          "Create a Git repository with two branches. On each branch, modify the same line of the same file to different content. Merge one branch into the other, producing a merge conflict. Resolve the conflict manually by editing the file, then commit the resolution. Document: what the conflict markers looked like, what decision you made, and why.",
        hint: "Git marks conflicts with <<<<<<, =======, and >>>>>>>. Everything between <<< and === is one version; everything between === and >>> is the other. Delete the markers and keep what you want.",
      },
      {
        key: "history-archaeology",
        title: "History Archaeology",
        description:
          "On any public GitHub repository — the Next.js repository is a good choice — use git log, git show, and git blame to answer: What was the most recent commit and what did it change? Who last modified a specific file? What is the full diff of a specific commit hash? Document your findings and the exact commands you used.",
        hint: "git log --oneline shows a compact history. git show [hash] shows a specific commit. git blame [filename] shows who last modified each line.",
      },
    ],

    completionCriteria: [
      "All five tasks practiced in a real Git repository with real commits",
      "Both challenges completed with documentation of commands used",
      "Can execute a full branch-commit-push-merge workflow from memory",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is the difference between git merge and git rebase? When would you use each?",
      application:
        "You discover you accidentally committed a .env file containing an API key to a public GitHub repository 10 minutes ago. What do you do right now, in order?",
      architecture:
        "Describe a Git branching strategy for a solo developer deploying a web application weekly. What branches exist and why?",
      defense:
        "A teammate says committing directly to main on a solo project is always fine. Under what conditions do you agree, and under what conditions do you not?",
      connection:
        "How will your Git workflow need to change when you deploy AI applications to production in Chapter 4, where a bad commit can cause a service outage?",
    },

    reflectionPrompts: [
      "Before learning Git, how did you manage changes to files you were working on? What problems did that approach have that Git solves?",
      "Describe the merge conflict you created in the challenge. What made resolving it feel uncertain? What would make it feel more confident in a real codebase?",
      "Why is the ability to recover any previous state of a project an engineering safety property, not just a convenience?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 6: REST APIs & JSON
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "rest-apis-json",
    number: 6,
    chapter: 1,
    chapterTitle: "The Web & Internet",
    isChapterEnd: true,

    title: "REST APIs & JSON",
    description:
      "Understand REST principles, JSON structure, API authentication, how to read API documentation, and how to make authenticated API requests using curl and the browser.",
    whyItMatters:
      "AI APIs are REST APIs. The Anthropic API, every vector database API, and every AI service in this curriculum communicates via HTTP with JSON payloads. Understanding how REST APIs are designed, how to read their documentation, and how to call them confidently is the most directly transferable skill in this chapter.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "HTTP — MDN Web Docs",
        author: "MDN Web Docs",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "2–3 hours across key articles",
        selectionReason:
          "The authoritative HTTP reference. The MDN HTTP section covers methods, headers, authentication schemes, content negotiation, and status codes at the level working engineers need. This is what engineers reference when designing and debugging APIs.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Anthropic API Reference — Messages",
        author: "Anthropic",
        url: "https://docs.anthropic.com/en/api/messages",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30–45 minutes",
        selectionReason:
          "The API Travis will call most frequently throughout this curriculum. Reading the Anthropic Messages API reference — understanding the endpoint, required headers, request body schema, and response format — is direct preparation for Stage 20. It is also a well-designed REST API that demonstrates best practices for API documentation.",
        qualityRating: "excellent",
      },
      deepDive: {
        title: "RESTful Web API Patterns and Practices",
        author: "Mike Amundsen (O'Reilly)",
        url: "https://www.oreilly.com/library/view/restful-web-api/9781098106737/",
        type: "book",
        tier: "tier-2-educator",
        estimatedDuration: "Chapters 1–2: 2–3 hours",
        selectionReason:
          "O'Reilly-published book by a recognized API design authority. Chapters 1–2 cover REST constraints and resource design at a depth that distinguishes engineers who understand APIs from those who only use them.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "rest-principles",
        title: "REST principles",
        description: "Understand the six REST constraints — statelessness, uniform interface, resource-based URLs, HTTP methods — and what makes an API truly RESTful versus just HTTP-based.",
      },
      {
        key: "json-structure",
        title: "JSON structure",
        description: "Learn JSON objects, arrays, nesting, data types, and how JSON maps to (and differs from) Python dictionaries and JavaScript objects.",
      },
      {
        key: "api-authentication",
        title: "API authentication",
        description: "Understand API keys, Bearer tokens, where they go in HTTP headers versus query parameters, and why they must never appear in client-side code.",
      },
      {
        key: "reading-api-docs",
        title: "Reading API documentation",
        description: "Learn to read an API reference: find the endpoint, identify required versus optional parameters, understand the request body schema, and interpret the response format and error codes.",
      },
      {
        key: "api-clients",
        title: "Making API requests",
        description: "Use curl from the command line and fetch from the browser to make authenticated GET and POST requests — the two tools every engineer uses to test APIs.",
      },
      {
        key: "rate-limiting",
        title: "Rate limiting and error handling",
        description: "Understand what rate limits are, how they are communicated (429 status, Retry-After header), and how production applications handle them gracefully.",
      },
    ],

    miniChallenges: [
      {
        key: "api-documentation-sprint",
        title: "API Documentation Sprint",
        description:
          "Without running any code, read the Anthropic Messages API documentation and write out: the exact HTTP method, the full URL, every required request header and its value format, every required request body field and its type, and what a successful 200 response looks like including the response body schema. Then make the actual API call using curl and verify your predictions.",
        hint: "Start at docs.anthropic.com/en/api/messages. The x-api-key header carries your API key. The Content-Type header must be set to application/json.",
      },
      {
        key: "error-handler",
        title: "Error Handler",
        description:
          "Make three intentionally broken API calls to a public API: one with a missing required parameter, one with invalid authentication, and one designed to trigger a 429 rate limit if possible (or simulate the response). For each failure, document: the exact HTTP status code returned, the error message in the response body, what caused it, and how a production application should handle it.",
        hint: "JSONPlaceholder (jsonplaceholder.typicode.com) is a safe API for testing error responses. The Anthropic API will return structured error objects with a type field.",
      },
    ],

    completionCriteria: [
      "All six tasks studied with examples practiced using curl and fetch",
      "Both challenges completed with documented findings",
      "Successfully called the Anthropic Messages API and received a valid response",
      "Chapter 1 project submitted with public URL, GitHub repository, architecture diagram, workflow diagram, and both ADRs",
      "AI interview passed at 85% or above",
      "Chapter 1 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What makes an API RESTful? Walk me through the constraints, and tell me whether a REST API has to use JSON.",
      application:
        "You are integrating a third-party AI API into a production application and it starts returning 429 errors after your traffic increases. What is a 429, why is it happening, and how do you handle it in production code?",
      architecture:
        "What is the difference between API authentication and API authorization? How do API keys relate to each concept?",
      defense:
        "A junior developer on your team wants to put an API key directly in the browser JavaScript so users can call the AI API from the frontend without going through your backend. How do you respond?",
      connection:
        "Everything you learned about REST APIs in this stage applies directly to calling the Anthropic API in Stage 20. What specific knowledge transfers and what new concepts will you encounter?",
    },

    reflectionPrompts: [
      "Before this stage, how did you think applications communicated with external services? How has that mental model changed?",
      "You made your first Anthropic API call in this stage. What did it feel like to get a response from a large language model via a REST request? What surprised you about the process?",
      "If API keys must never appear in client-side code, but the user needs to call the AI from the browser, what architectural pattern solves this? Think through it before moving on.",
    ],

    chapterProject: {
      title: "Personal Portfolio Website",
      description:
        "Build and deploy a personal portfolio website using only HTML, CSS, and vanilla JavaScript — no frameworks. This project proves command of the entire Chapter 1 curriculum by requiring semantic markup, responsive layout, JavaScript interactivity, and deployment.",
      requirements: [
        "Semantic HTML throughout — passes WAVE accessibility checker (wave.webaim.org) with zero errors",
        "Responsive layout — tested and correct at mobile (375px), tablet (768px), and desktop (1440px)",
        "Required sections: About, Skills, Projects (minimum two projects shown), Contact form",
        "Contact form submits to a third-party service (Formspree or similar) — no backend required",
        "Deployed to Vercel or Netlify — publicly accessible URL required",
        "Source code on GitHub with a complete README explaining the project and how to run it locally",
        "Page loads in under 3 seconds on simulated Slow 3G in Chrome DevTools",
        "No CSS frameworks, no component libraries, no JavaScript frameworks — plain HTML, CSS, and JS only",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 2,
        additionalNotes: [
          "Architecture diagram must show: browser → Vercel/Netlify CDN → static files, including the form submission flow to the third-party service",
          "Workflow diagram must show the user journey from landing to form submission",
          "ADR 1: Why vanilla HTML/CSS/JS instead of a framework (React, Next.js, etc.)",
          "ADR 2: Why Vercel or Netlify — what alternatives were considered and what would change the decision",
        ],
      },
    },
  },
];
