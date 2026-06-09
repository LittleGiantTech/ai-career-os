# AI Product Engineer — Curriculum

**Total path:** 29 stages across 6 chapters  
**Daily budget:** 60–90 minutes  
**Estimated total duration:** 7–9 months at consistent daily work  
**Mastery gate per stage:** All tasks + all challenges + project submitted + AI interview ≥ 85%

---

## Time Estimate Methodology

These estimates assume mastery, not task completion. The distinction matters.

**What is included in each estimate:**
- Learning time: reading, watching, practicing each task
- Challenge time: building, debugging, and verifying each challenge
- Remediation time: 20% of stages require one remediation cycle — re-study (2–3 days) and re-interview
- AI interview time: 30–40 minutes per interview, not counted in stage days but in total path time
- Project time: consistently 1.5–2× longer than initial estimates due to deployment issues, design decisions, and unexpected complexity
- ADR and diagram time: architecture documentation is part of the work, not overhead
- Integration time: time lost re-orienting after breaks, connecting new concepts to prior stages

**What is not included:**
- Life interruptions (add 10–15% for an honest personal buffer)
- Stages where mastery comes slower than average (this path is hard; some concepts will require three or four passes)

The original curriculum estimated 5 months. This estimate is 7–9 months. The difference is honesty about what mastery requires versus what completion requires.

---

## How This Curriculum Works

Each stage follows a single cycle: **Learn → Build → Explain → Defend → Improve**

- **Tasks** are the Learn phase. They are ordered. Complete them in sequence.
- **Challenges** are the Build phase. They are hands-on. No challenge is purely theoretical.
- **Project** proves integration. Stage projects are small. Chapter projects are large and synthesize everything.
- **Interview** is the Explain + Defend phase. The AI asks. Travis answers. Score must reach 85%.
- **Connection questions** link the current stage to prior stages. They force Travis to see the system, not just the parts.

**Every chapter project requires three additional artifacts beyond working code:**

1. **Architecture diagram** — a system diagram showing all components and how they connect. Use Mermaid (renders in GitHub) or Excalidraw. Must include: components, data flows, external dependencies, and deployment topology.

2. **Workflow diagram** — the primary user or data workflow through the system. Every step labeled. Every decision point shown.

3. **Architecture Decision Records (ADRs)** — minimum two per chapter project. Standard format: Title, Status, Context, Decision, Consequences, Alternatives Considered. Written before building, updated after. These are not post-hoc justifications — they are thinking documents.

Resources are deliberately limited. One primary resource. One reference. One optional deep dive. The curation is the product.

---

# CHAPTER 1: The Web & Internet

**Why this chapter exists:**
AI systems are web systems. Every AI product Travis will build lives on the internet, responds to HTTP requests, returns JSON, and runs in a browser or server. Understanding how the web works is not optional background knowledge — it is the foundation every future stage builds on. A developer who does not understand HTTP cannot debug a broken API call. Start here. No shortcuts.

**Estimated chapter duration:** 6–8 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** Personal Portfolio Website — deployed, publicly accessible, documented with ADRs and diagrams.

---

### Stage 1: How the Web Works

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 4–5 days (including interview and potential remediation)

**Why this stage matters:**
Before writing a single line of code, Travis must understand what happens when he types a URL and presses Enter. DNS resolution, TCP connections, HTTP request-response cycles, and status codes appear constantly in error logs, API debugging, and system design conversations. An engineer who cannot explain this is guessing when things break.

**Learning Tasks**
1. DNS resolution — what happens between typing a URL and a server responding
2. TCP/IP — what a connection actually is and why it matters
3. HTTP vs HTTPS — protocol structure, headers, body, method, status code
4. Request-response cycle — client, server, request, response defined precisely
5. HTTP status codes — 200, 201, 301, 400, 401, 403, 404, 500 and what each signals
6. Browser rendering — what the browser does after receiving an HTML response

**Mini Challenges**
1. **The Broken Request Diagnosis** — Open browser DevTools, visit three different websites, and document: the HTTP method, status code, content-type header, and response time for the initial HTML request. Explain in writing why each status code was returned.  
   *Hint: Network tab in DevTools shows every request.*

2. **Status Code Map** — Without looking anything up, write one sentence explaining when a developer would see each of these: 200, 201, 400, 401, 403, 404, 500. Then verify. Correct anything wrong.

**Resources**
- Primary: "How The Internet Works" — Fireship (YouTube, ~10 min)
- Reference: MDN Web Docs — "How the Web works"
- Deep dive: "Computer Networks: A Top Down Approach" — Chapter 2 (optional)

**Interview Blueprint**
- Concept: "What happens between typing a URL and seeing a webpage?"
- Application: "A user reports your API returns a 401 but they swear they're logged in. Walk me through how you'd diagnose this."
- Architecture: "Why does HTTPS matter for an AI application that handles user data?"
- Defense: "Someone says HTTP is enough for internal microservices. Do you agree? Defend your position."
- Connection: "How will understanding HTTP help you when you're calling the Anthropic API in Stage 20?"

**Completion Criteria**
- All 6 tasks studied and documented in notes
- Both challenges completed with written explanations
- Can draw the request-response cycle from memory
- AI interview passed at 85%+

---

### Stage 2: HTML & The Document

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 4–5 days

**Why this stage matters:**
HTML is about structure and meaning. Semantic HTML communicates intent to browsers, screen readers, and search engines. A div soup works until it doesn't — and when it doesn't, the bugs are invisible and the accessibility failures are real.

**Learning Tasks**
1. Document structure — DOCTYPE, html, head, body and why each exists
2. Semantic elements — header, nav, main, section, article, aside, footer
3. Text elements — h1-h6 hierarchy, p, strong, em, blockquote
4. Links and images — anchor tags, href, src, alt text and why alt matters
5. Forms — input types, labels, fieldsets, form action and method
6. Browser DevTools — inspecting elements, modifying HTML live, understanding the DOM

**Mini Challenges**
1. **Semantic Audit** — Find a publicly accessible website with poor semantic structure. Document three specific violations and explain what element should replace each, and why.  
   *Hint: Run any site through the WAVE accessibility tool.*

2. **Form From Memory** — Without referencing documentation, build an HTML form that collects: name, email, a dropdown for experience level, and a submit button. Then verify against MDN. Fix what's wrong.

**Resources**
- Primary: "HTML Full Course for Beginners" — Bro Code (YouTube, first 2 hours)
- Reference: MDN Web Docs — HTML elements reference

**Interview Blueprint**
- Concept: "What is the difference between HTML elements and HTML attributes? Give three examples of each."
- Application: "You're building an AI chat interface. What HTML structure would you use for the message list?"
- Architecture: "Why does semantic HTML matter for an AI-powered application that might be indexed or read by screen readers?"
- Defense: "A teammate says 'just use divs everywhere, semantic HTML doesn't matter in production.' How do you respond?"
- Connection: "How does your understanding of HTML forms connect to what you'll learn about HTTP POST requests?"

**Completion Criteria**
- All 6 tasks studied
- Both challenges completed
- Can build a semantic HTML page structure from memory
- AI interview passed at 85%+

---

### Stage 3: CSS & Layout

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 5–7 days

**Why this stage matters:**
CSS is where most developers move too fast and build shaky foundations. The box model, specificity, flexbox, and grid are the vocabulary of every layout conversation. Travis will work on UIs throughout this path. He needs to speak this vocabulary without hesitation.

**Learning Tasks**
1. The box model — content, padding, border, margin and how they interact
2. Specificity — why some rules win over others and how to debug conflicts
3. Flexbox — flex-direction, justify-content, align-items, gap
4. CSS Grid — grid-template-columns, grid-template-rows, placement
5. Responsive design — media queries, mobile-first methodology, viewport units
6. CSS custom properties — --variables, :root, why they matter for design systems

**Mini Challenges**
1. **Layout Reconstruction** — Pick any simple web page. Without inspecting their CSS, rebuild its layout using only flexbox or grid. The layout logic must be correct, not just visually similar.

2. **Responsive Card Grid** — Build a card grid: 1 column on mobile, 2 on tablet, 3 on desktop. No CSS frameworks. Plain CSS grid and media queries only.

**Resources**
- Primary: "Learn CSS Grid in 20 Minutes" + "Learn Flexbox in 15 Minutes" — Web Dev Simplified (YouTube)
- Reference: CSS-Tricks Flexbox Guide + CSS-Tricks Grid Guide

**Interview Blueprint**
- Concept: "Explain the CSS box model. If a div has width: 200px, padding: 20px, and border: 2px, what is its total rendered width by default?"
- Application: "You're building a dashboard with a fixed sidebar and scrollable main content. How do you implement this?"
- Architecture: "When would you choose CSS Grid over Flexbox? Give a concrete example of each."
- Defense: "A designer hands you a mockup that only works on desktop. How do you push back?"
- Connection: "How will your CSS knowledge apply when working with Tailwind CSS in the Next.js portions of this curriculum?"

**Completion Criteria**
- All 6 tasks studied
- Both challenges completed and visually correct
- Can explain the box model and specificity without notes
- AI interview passed at 85%+

---

### Stage 4: JavaScript Fundamentals

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 7–9 days

**Why this stage matters:**
JavaScript is the only programming language that runs natively in the browser. Every interactive AI interface depends on it. This stage covers only the fundamentals. Frameworks change. Fundamentals do not.

**Learning Tasks**
1. Variables and types — let, const, string, number, boolean, null, undefined, typeof
2. Functions — declaration, expression, arrow functions, parameters, return values
3. Arrays and objects — creation, access, mutation, common methods (map, filter, reduce)
4. Control flow — if/else, ternary, for loops, while loops
5. DOM manipulation — querySelector, addEventListener, innerHTML, classList
6. Async JavaScript — Promises, async/await, fetch API basics

**Mini Challenges**
1. **DOM Task List** — Build a task list in vanilla JavaScript. Requirements: add tasks, mark complete (strikethrough), delete tasks, persist in localStorage. No frameworks. No libraries.

2. **Fetch and Render** — Use the fetch API to call a free public API (JSONPlaceholder or Open Meteo). Render the response data into the DOM. Handle loading state and error state.

**Resources**
- Primary: "JavaScript Full Course" — Bro Code (YouTube, first 4 hours)
- Reference: MDN Web Docs — JavaScript Guide

**Interview Blueprint**
- Concept: "What is the difference between null and undefined in JavaScript?"
- Application: "You're building a streaming AI chat UI. How do you handle the response arriving token by token?"
- Architecture: "Explain event bubbling. Why does understanding it matter when building complex UIs?"
- Defense: "A teammate wants to use var instead of let/const. How do you respond?"
- Connection: "How does JavaScript's async/await model compare to Python's async handling you'll learn later?"

**Completion Criteria**
- All 6 tasks studied
- Both challenges built and functional
- Can explain closures and async/await without notes
- AI interview passed at 85%+

---

### Stage 5: Git & Version Control

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 3–4 days

**Why this stage matters:**
Every professional engineering workflow runs on Git. Every AI project Travis builds will live in a repository. An engineer who cannot use Git confidently cannot collaborate, deploy safely, or recover from mistakes.

**Learning Tasks**
1. Core concepts — repository, commit, branch, merge, remote, clone
2. Daily workflow — init, add, commit, push, pull, status, log
3. Branching — creating branches, switching, merging, resolving conflicts
4. GitHub — creating repos, pushing, pull requests, README conventions
5. .gitignore — what to exclude and why (node_modules, .env files, build artifacts)

**Mini Challenges**
1. **Conflict Resolution** — Create a repository with two branches modifying the same line differently. Merge them, resolve the conflict manually, commit the resolution. Document what the conflict looked like.

2. **History Archaeology** — On any public GitHub repository, use git log, git show, and git blame to find: the most recent commit, who last modified a specific file, and what changed in a specific commit.

**Resources**
- Primary: "Git and GitHub for Beginners" — freeCodeCamp (YouTube, first 1.5 hours)
- Reference: Pro Git Book — git-scm.com/book (free online)

**Interview Blueprint**
- Concept: "What is the difference between git merge and git rebase?"
- Application: "You accidentally committed a .env file with API keys to a public repo. What do you do right now?"
- Architecture: "Describe a Git branching strategy for a solo project with weekly deployments."
- Defense: "Someone says committing directly to main on a solo project is fine. When do you agree?"
- Connection: "How will your Git workflow change when you start deploying AI applications in Chapter 4?"

**Completion Criteria**
- All 5 tasks practiced in a real repository
- Both challenges completed with documentation
- Can execute full commit-branch-merge workflow without notes
- AI interview passed at 85%+

---

### Stage 6: REST APIs & JSON

**Chapter:** 1 — The Web & Internet  
**Estimated time:** 4–6 days

**Why this stage matters:**
AI APIs are REST APIs. The Anthropic API, every vector database API, and every AI service Travis will use communicates via HTTP with JSON. Understanding how REST APIs are designed, how to read their documentation, and how to call them is the most transferable skill in this chapter.

**Learning Tasks**
1. REST principles — resources, endpoints, HTTP methods, statelessness
2. JSON structure — objects, arrays, nesting, types, parsing
3. API authentication — API keys, Bearer tokens, where they go in requests
4. Reading API documentation — endpoints, parameters, request body, response schema, error codes
5. API clients — using curl, Postman/Insomnia, and fetch to make requests
6. Rate limiting and error handling — what rate limits are and how to handle API errors gracefully

**Mini Challenges**
1. **API Documentation Sprint** — Read the Anthropic API documentation for the Messages endpoint. Without running any code, write out: the exact HTTP method, URL, required headers, required body fields, and what a successful response looks like. Then verify by making the call.

2. **Error Handler** — Call a public API with intentionally wrong parameters. Document each error response — status code, error message, what it means, and how a production application should handle it.

**Resources**
- Primary: "APIs for Beginners" — freeCodeCamp (YouTube, first 1.5 hours)
- Reference: Anthropic API Documentation — docs.anthropic.com

**Interview Blueprint**
- Concept: "What makes an API 'RESTful'? What are the constraints?"
- Application: "You're integrating a third-party AI API and it starts returning 429 errors. What is a 429 and how do you handle it?"
- Architecture: "What is the difference between authentication and authorization? How do API keys relate to each?"
- Defense: "A teammate wants to put the API key directly in the frontend JavaScript. How do you respond?"
- Connection: "How does everything you learned about REST APIs directly apply to calling the Anthropic API in Stage 20?"

**Chapter 1 Project: Personal Portfolio Website**

Build and deploy a personal portfolio website using only HTML, CSS, and vanilla JavaScript.

**Requirements:**
- Semantic HTML throughout (passes WAVE accessibility check with no errors)
- Responsive layout (mobile, tablet, desktop — tested at all three breakpoints)
- Sections: about, skills, projects (minimum 2), contact form
- Deployed to Vercel or Netlify with a public URL
- Source code on GitHub with a complete README
- Loads in under 3 seconds on simulated slow 3G (verify in Chrome DevTools)
- Contact form submits somewhere (Formspree or similar — no backend required)

**Architecture Diagram:**  
System topology diagram showing: browser → Vercel CDN → static files. Include: HTML/CSS/JS relationship, asset loading sequence, form submission flow to third-party service.

**Workflow Diagram:**  
User journey: landing → navigation → project view → contact form submission. Every step labeled. Every external service shown.

**Architecture Decision Records (minimum 2):**

*ADR 1: Framework choice*  
Why vanilla HTML/CSS/JS instead of React, Next.js, or another framework? Document the context, the decision, and what would change if the decision were revisited.

*ADR 2: Deployment platform*  
Why Vercel or Netlify? What alternatives were considered? What would the decision be for a dynamic application?

**Completion Criteria**
- All 6 tasks studied
- Both challenges completed
- Portfolio publicly deployed with GitHub link
- Architecture and workflow diagrams in the README
- Both ADRs written and committed
- AI interview passed at 85%+

---

# CHAPTER 2: Python

**Why this chapter exists:**
Python is the language of AI engineering. LangChain, LangGraph, FastAPI, NumPy, Pandas, the Anthropic SDK — all Python. Travis will write Python for every AI system he builds. This chapter builds the foundation from which all AI engineering work grows. Python must become as natural as thinking.

**Estimated chapter duration:** 5–7 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** CLI Task Manager — a full Python command-line application with file persistence, error handling, clean architecture, and engineering documentation.

---

### Stage 7: Python Basics

**Chapter:** 2 — Python  
**Estimated time:** 4–5 days

**Why this stage matters:**
Python's simplicity is deceptive. Variables, types, strings, and operators are where most developers move too fast and build shaky foundations. Understanding how Python handles types dynamically, how strings are immutable, and how None works will save Travis hours of debugging later.

**Learning Tasks**
1. Python setup — Python 3.11+, virtual environments (venv), pip, VS Code with Python extension
2. Variables and types — int, float, str, bool, None, dynamic typing, type()
3. String operations — concatenation, f-strings, .upper(), .lower(), .strip(), .split(), .replace()
4. Operators — arithmetic, comparison, logical (and, or, not), assignment operators
5. Input and output — print(), input(), string formatting
6. Python REPL — using the interactive interpreter for exploration

**Mini Challenges**
1. **String Transformer** — Write a Python function that takes a raw string of messy text (mixed case, extra spaces, special characters) and returns it cleaned: trimmed, lowercase, with special characters removed, words separated by single spaces. No external libraries.

2. **Type Detective** — Write a program that takes user input and correctly identifies: what type Python infers, whether it could be converted to int, float, or bool, and what happens when you try each conversion. Handle all errors gracefully.

**Resources**
- Primary: "Python for Beginners" — Corey Schafer (YouTube, episodes 1–6)
- Reference: Python 3 Official Documentation — docs.python.org

**Interview Blueprint**
- Concept: "What does it mean that Python is dynamically typed? Where does this help and where does it cause bugs?"
- Application: "You receive a string from an API response that says '  42.5  '. Write the Python code to convert it to a float. What can go wrong?"
- Architecture: "Why do Python projects use virtual environments? What problem does this solve?"
- Defense: "Someone says Python is too slow for production AI systems. How do you respond?"
- Connection: "How does Python's string handling compare to JavaScript's? Where are they similar and where do they differ?"

**Completion Criteria**
- Development environment set up and working
- All 6 tasks practiced in the REPL and in files
- Both challenges written and working
- AI interview passed at 85%+

---

### Stage 8: Control Flow

**Chapter:** 2 — Python  
**Estimated time:** 4–5 days

**Why this stage matters:**
Control flow is the logic of programs. Every AI system makes decisions: retry this request, skip this chunk, route to this agent, handle this error. If Travis cannot write clear conditional logic and loops without hesitation, he cannot build systems that behave correctly.

**Learning Tasks**
1. Conditionals — if, elif, else, nested conditions, truthiness and falsiness
2. For loops — iterating over lists, strings, ranges, enumerate(), zip()
3. While loops — condition-based iteration, break, continue, while/else
4. List comprehensions — [x for x in iterable if condition], when to use vs regular loops
5. Truthiness — what Python considers truthy and falsy (0, '', None, [], {})
6. match/case — Python 3.10+ structural pattern matching basics

**Mini Challenges**
1. **FizzBuzz, Defended** — Write FizzBuzz three ways: traditional if/elif/else, list comprehension, and match/case. Explain which you'd use in production, which in a quick script, and why the answer differs.

2. **Input Validator** — Write a function that validates user registration input: email contains @ and a dot, password is 8+ characters with at least one number, age is between 18 and 120. Return specific error messages for each failure. Handle all edge cases.

**Resources**
- Primary: "Python for Beginners" — Corey Schafer (YouTube, episodes 7–10)
- Reference: Python 3 Official Documentation — Control Flow Tools

**Interview Blueprint**
- Concept: "What is the difference between break and continue in a loop?"
- Application: "You're processing a list of API responses: some 200, some 4xx, some 429. Write the control flow logic."
- Architecture: "When would you choose a while loop over a for loop in a production AI system?"
- Defense: "A teammate argues list comprehensions are always better than for loops. When do you disagree?"
- Connection: "How will your understanding of truthiness help when handling optional fields in API responses?"

**Completion Criteria**
- All 6 tasks practiced with written examples
- Both challenges written and working
- Can explain truthiness, comprehensions, and loop control without notes
- AI interview passed at 85%+

---

### Stage 9: Functions & Modules

**Chapter:** 2 — Python  
**Estimated time:** 4–5 days

**Why this stage matters:**
Functions are the unit of reusable logic. Modules are the unit of reusable code. Every professional Python codebase — including every LangChain chain, every FastAPI route, every AI pipeline — is organized around functions and modules.

**Learning Tasks**
1. Function definition — def, parameters, default arguments, return values, None returns
2. *args and **kwargs — variable positional and keyword arguments
3. Scope — local, enclosing, global, built-in (LEGB rule)
4. Lambda functions — when appropriate and when not
5. Modules — import, from/import, as aliases, __name__ == "__main__"
6. Python standard library — os, sys, pathlib, datetime, json, re — one use case each

**Mini Challenges**
1. **Refactor to Functions** — Take the input validator from Stage 8 and refactor it: one function per validation rule, one orchestrating function, proper error collection, a main() function, and an if __name__ == "__main__" guard. Document what changed and why it's better.

2. **Standard Library Sprint** — Using only Python's standard library: read a JSON file, parse a date string into a datetime object, list all .py files in a directory recursively, and write results to a new JSON file. No pip installs.

**Resources**
- Primary: "Python for Beginners" — Corey Schafer (YouTube, episodes 11–14)
- Reference: Python Standard Library Documentation — docs.python.org/3/library/

**Interview Blueprint**
- Concept: "Explain the difference between *args and **kwargs with a concrete example of when you'd use each."
- Application: "You're building an AI pipeline where each step is a function. How do you design the function signatures to make the pipeline composable?"
- Architecture: "What is the LEGB rule and why does it matter when debugging?"
- Defense: "When are lambda functions appropriate and when are they harmful?"
- Connection: "How does Python's module system compare to JavaScript's ES modules?"

**Completion Criteria**
- All 6 tasks practiced with written examples
- Both challenges completed and working
- Can explain scope and *args/**kwargs without notes
- AI interview passed at 85%+

---

### Stage 10: Data Structures

**Chapter:** 2 — Python  
**Estimated time:** 4–6 days

**Why this stage matters:**
AI systems handle data constantly. API responses come back as JSON objects. Embedding results come back as lists of floats. Chat histories are lists of dictionaries. Choosing the right data structure and knowing its performance characteristics is a fundamental engineering skill.

**Learning Tasks**
1. Lists — creation, indexing, slicing, mutation, methods, time complexity
2. Tuples — immutability, when tuples beat lists, unpacking
3. Dictionaries — creation, access, .get(), .keys(), .values(), .items(), nested dicts
4. Sets — uniqueness, union, intersection, difference, O(1) lookup
5. Choosing the right structure — performance tradeoffs: O(1) vs O(n) lookup, mutability, ordering
6. Nested structures — lists of dicts, dicts of lists, how JSON maps to Python structures

**Mini Challenges**
1. **Chat History Modeler** — Design a Python data structure to represent an AI conversation. Store: role (user/assistant/system), content, timestamp, token count per message. Implement: add a message, get last N messages, calculate total tokens, export to JSON. Explain each data structure choice.

2. **Set vs List Benchmark** — Generate 10,000 random strings. Measure time to check membership using a list versus a set for 1,000 lookups. Print results. Explain why they differ.

**Resources**
- Primary: "Python Data Structures" — Corey Schafer (YouTube, episodes 15–18)
- Reference: Python Documentation — Built-in Types

**Interview Blueprint**
- Concept: "What is the time complexity of dictionary lookup versus list lookup in Python? Why?"
- Application: "You're storing 100,000 embeddings in memory. Each is a 1536-float vector. What Python structure do you use?"
- Architecture: "You need to deduplicate a stream of document chunks before passing them to a vector store. What data structure handles this most efficiently?"
- Defense: "A teammate uses a list to check if an item has been processed. You suggest a set. They say it doesn't matter for 'small' data. How do you respond?"
- Connection: "How do Python dictionaries map to JSON objects? Where does the mapping break down?"

**Completion Criteria**
- All 6 tasks practiced with real examples
- Both challenges completed and working
- Can explain time complexity tradeoffs without notes
- AI interview passed at 85%+

---

### Stage 11: File I/O & Error Handling

**Chapter:** 2 — Python  
**Estimated time:** 4–6 days

**Why this stage matters:**
Production systems fail. APIs return errors. Files don't exist. Connections drop. An engineer who does not write defensive code is writing code that breaks in production silently. This stage is about writing code that handles reality, not ideal conditions.

**Learning Tasks**
1. Reading files — open(), context managers (with), read modes, reading line by line
2. Writing files — write mode, append mode, encoding considerations
3. JSON files — json.load(), json.dump(), json.loads(), json.dumps()
4. Exception handling — try/except/else/finally, specific exception types, raising exceptions
5. Custom exceptions — creating exception classes, when they add value
6. Logging — Python logging module, log levels, when to log vs print

**Mini Challenges**
1. **Resilient File Processor** — Write a program that reads a directory of JSON files, parses each, extracts specific fields, and writes a summary CSV. Handle: missing files, malformed JSON, missing fields, write-permission errors. Every error must be logged with context.

2. **Retry Decorator** — Write a @retry(max_attempts=3, delay=1.0) decorator that retries a function on exception, waits between attempts, and raises the final exception if all attempts fail. Test it against a function that randomly fails.

**Resources**
- Primary: "Python for Beginners" — Corey Schafer (YouTube, episodes 19–22)
- Reference: Python Documentation — Exception Handling, logging module

**Interview Blueprint**
- Concept: "What is the difference between try/except/else/finally? When does the else block execute?"
- Application: "You're calling the Anthropic API in a loop over 1,000 documents. It randomly throws RateLimitError. How do you write this defensively?"
- Architecture: "When should you create a custom exception class versus using a built-in Python exception?"
- Defense: "A teammate wraps every function in a bare except: pass. What's the problem?"
- Connection: "How does the retry decorator you built relate to production patterns for AI API calls?"

**Completion Criteria**
- All 6 tasks practiced with real examples
- Both challenges completed and working
- Can explain exception hierarchy and context managers without notes
- AI interview passed at 85%+

---

### Stage 12: Object-Oriented Python

**Chapter:** 2 — Python  
**Estimated time:** 4–6 days

**Why this stage matters:**
LangChain, FastAPI, Pydantic, and most Python AI libraries are built around classes. Reading and extending library code requires fluency with classes, inheritance, and dunder methods. Travis does not need to be an OOP purist — he needs to work with class-based libraries without friction.

**Learning Tasks**
1. Classes and instances — class definition, __init__, instance attributes, self
2. Methods — instance methods, class methods (@classmethod), static methods (@staticmethod)
3. Properties — @property, getters, setters, when they beat direct attribute access
4. Inheritance — subclassing, super(), method overriding, isinstance()
5. Dunder methods — __str__, __repr__, __len__, __eq__, __hash__ and why they matter
6. Dataclasses — @dataclass, field(), when dataclasses beat regular classes

**Mini Challenges**
1. **Pydantic Model Reverse Engineering** — Read the Pydantic BaseModel documentation. Without installing anything, predict what it does using your knowledge of Python classes. Then install Pydantic and verify your predictions by inspecting a real model.

2. **Message Class Hierarchy** — Design a class hierarchy for AI messages: a base Message class, and UserMessage, AssistantMessage, SystemMessage subclasses. Each must: validate that content is non-empty, implement __repr__, be comparable by timestamp, be serializable to a dict. Use dataclasses where appropriate.

**Resources**
- Primary: "Object-Oriented Programming in Python" — Corey Schafer (YouTube, full series)
- Reference: Python Documentation — Classes, dataclasses module

**Interview Blueprint**
- Concept: "What is the difference between a class method and a static method? When would you use each?"
- Application: "You're integrating with a LangChain custom tool that requires you to subclass BaseTool. What do you need to implement and why?"
- Architecture: "When would you choose a dataclass over a regular class over a Pydantic model?"
- Defense: "A teammate says OOP is overengineering for AI scripts. When do you agree?"
- Connection: "How will your understanding of Python classes help you read and extend LangChain source code in Stage 25?"

**Chapter 2 Project: CLI Task Manager**

A command-line task management application in Python.

**Requirements:**
- Add, list, complete, and delete tasks via CLI commands
- Persist tasks to a JSON file between sessions
- Display tasks in a clean formatted table (stdlib only — no rich or tabulate)
- Handle all error conditions: file not found, invalid input, empty task list
- --help flag explaining all commands
- Meaningful logging throughout using the logging module
- Code organized into functions and modules — not a single-file script

**Architecture Diagram:**  
Component diagram showing: CLI entry point → command parser → task manager module → file storage. Show data flow for each command (add, list, complete, delete). Show the storage format.

**Workflow Diagram:**  
Data flow for the add-task and complete-task workflows. Every function call labeled. Show the JSON read-modify-write cycle.

**Architecture Decision Records (minimum 2):**

*ADR 1: Persistence format*  
Why JSON instead of SQLite, CSV, or a plain text file? Document the tradeoffs. Note what would change the decision if requirements changed (e.g., concurrent access, query complexity).

*ADR 2: CLI interface design*  
Why this command structure (argparse, sys.argv, or another approach)? What alternatives were considered? What does the chosen approach make easy and what does it make hard?

**Completion Criteria**
- All 6 tasks practiced with real examples
- Both challenges completed and working
- CLI Task Manager runs without errors and handles all edge cases
- Architecture and workflow diagrams committed to the repository
- Both ADRs written and committed
- AI interview passed at 85%+

---

# CHAPTER 3: APIs & Databases

**Why this chapter exists:**
AI systems are data systems. They receive data via APIs, store and retrieve from databases, and expose their own APIs for other systems. This chapter builds the data layer that every AI application depends on. The chapter project — an AI Knowledge Base API — is not just practice. It will become the foundation of the RAG system Travis builds in Chapter 5.

**Estimated chapter duration:** 4–6 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** AI Knowledge Base API — a document ingestion and search API using PostgreSQL full-text search. The same knowledge base will be enhanced with vector search in Chapter 5.

---

### Stage 13: Working with APIs in Python

**Chapter:** 3 — APIs & Databases  
**Estimated time:** 4–5 days

**Why this stage matters:**
Every AI integration Travis will build involves calling an external API. The Anthropic API, vector database APIs, and every AI service requires understanding HTTP clients, authentication, error handling, and response parsing in Python.

**Learning Tasks**
1. The requests library — GET, POST, PUT, DELETE, headers, params, body
2. Authentication in practice — Bearer tokens, API keys in headers vs query params
3. Response handling — status codes, JSON parsing, error detection
4. Session objects — when to reuse connections, request defaults
5. Environment variables — python-dotenv, loading .env files, never hardcoding secrets
6. Rate limiting — detecting 429s, exponential backoff, respecting API limits

**Mini Challenges**
1. **API Client Class** — Build a Python class wrapping a public API. The class must: load credentials from .env, implement at least 3 API methods, handle rate limiting with automatic retry, and raise informative custom exceptions for each failure type.

2. **Anthropic API First Contact** — Using the Anthropic Python SDK, make your first call to Claude. Send a simple prompt. Print the response. Then: add a system prompt, adjust the temperature, and count the tokens used. Document what each parameter does and why it matters.

**Resources**
- Primary: "Python Requests Library" — Corey Schafer (YouTube)
- Reference: Anthropic Python SDK Documentation — docs.anthropic.com

**Interview Blueprint**
- Concept: "What is the difference between query parameters and request body? When do you use each?"
- Application: "You're building a pipeline that calls an AI API 10,000 times. How do you handle rate limiting without failing the entire batch?"
- Architecture: "Why should API keys never be hardcoded in Python source files? What are all the places they could leak?"
- Defense: "A teammate stores the API key in a config.py file that's in .gitignore. Is this acceptable?"
- Connection: "How does the exponential backoff retry pattern you built here apply to every AI API you'll use in Chapter 5?"

**Completion Criteria**
- All 6 tasks practiced
- Both challenges completed and working
- Anthropic API called successfully with documented results
- AI interview passed at 85%+

---

### Stage 14: SQL Fundamentals

**Chapter:** 3 — APIs & Databases  
**Estimated time:** 5–7 days

**Why this stage matters:**
Every production AI system stores state somewhere. Chat history, user preferences, document metadata, evaluation results — all relational data. An AI engineer who cannot write a JOIN or design a schema is dependent on others for the data layer of every system they build.

**Learning Tasks**
1. Relational model — tables, rows, columns, primary keys, foreign keys
2. SELECT — basic queries, WHERE, ORDER BY, LIMIT, OFFSET
3. Aggregations — COUNT, SUM, AVG, MAX, MIN, GROUP BY, HAVING
4. JOINs — INNER JOIN, LEFT JOIN, RIGHT JOIN — the difference and when to use each
5. Data modification — INSERT, UPDATE, DELETE, UPSERT (INSERT ON CONFLICT)
6. Schema design — normalization basics, when to normalize and when not to

**Mini Challenges**
1. **Schema Design Review** — Design the database schema for a minimal AI chat application. Store: users, conversations, messages (with role and content), and token usage per message. Write CREATE TABLE statements. Identify all primary keys, foreign keys, and indexes. Explain each.

2. **Query Challenge** — Create the schema above in SQLite with sample data. Write queries to: find the user with the most total tokens, get the last 10 messages of a conversation, find all conversations from the last 7 days, calculate average tokens per message by role.

**Resources**
- Primary: "SQL Tutorial for Beginners" — freeCodeCamp (YouTube, first 3 hours)
- Reference: PostgreSQL Documentation — The SQL Language

**Interview Blueprint**
- Concept: "Explain the difference between INNER JOIN and LEFT JOIN. Give an example where using the wrong one produces incorrect results."
- Application: "You have a table of AI interaction logs with user_id, model_used, tokens_in, tokens_out, and cost. Write a query to find the top 10 most expensive users this month."
- Architecture: "What is database normalization and when would you intentionally denormalize?"
- Defense: "A teammate says you can skip SQL and use NoSQL for everything. When do you agree?"
- Connection: "How does your understanding of database schema design apply to designing Prisma schemas?"

**Completion Criteria**
- All 6 topics practiced with real queries
- Both challenges completed and correct
- Can write JOINs and aggregations without references
- AI interview passed at 85%+

---

### Stage 15: PostgreSQL & Prisma

**Chapter:** 3 — APIs & Databases  
**Estimated time:** 5–7 days

**Why this stage matters:**
Supabase — which powers this application — is PostgreSQL. Prisma is already in this codebase. Travis needs to understand what Prisma is doing under the hood, what its schema maps to in SQL, and how to use both together confidently. This stage bridges raw SQL and ORMs.

**Learning Tasks**
1. PostgreSQL specifics — data types, full-text search (tsvector, tsquery), EXPLAIN ANALYZE
2. Prisma schema — model definitions, field types, relations, @id, @unique, @default
3. Migrations — what migrations are, prisma migrate dev, migration history
4. Prisma Client — CRUD operations, findUnique, findMany, create, update, upsert, delete
5. Relations in Prisma — one-to-one, one-to-many, many-to-many, include vs select
6. Transactions — when to use $transaction, why atomicity matters

**Mini Challenges**
1. **ORM to SQL Translation** — Take 5 Prisma queries (including one with include and one with nested where conditions) and write the equivalent raw SQL. Verify using EXPLAIN they produce the same query plan.

2. **Transaction Scenario** — Implement a Prisma transaction that creates a new user, creates their first document, and creates document chunks — but only if the user does not already exist. Prove rollback works by simulating a failure.

**Resources**
- Primary: Prisma official YouTube channel — "Learn Prisma" series
- Reference: Prisma Documentation — prisma.io/docs

**Interview Blueprint**
- Concept: "What is a database migration and why is running arbitrary ALTER TABLE in production dangerous?"
- Application: "You need to add a non-nullable column to a table with 10,000 existing rows. Walk me through this without downtime."
- Architecture: "When would you use raw SQL instead of Prisma? What are the tradeoffs?"
- Defense: "A teammate says ORMs are too slow for production. How do you evaluate this claim?"
- Connection: "What does the Prisma schema for the Sprint model in this application map to in actual PostgreSQL DDL?"

**Completion Criteria**
- All 6 tasks practiced with real queries
- Both challenges completed and verified
- Can write a Prisma schema from scratch and explain the generated migration
- AI interview passed at 85%+

---

### Stage 16: Authentication & Security Basics

**Chapter:** 3 — APIs & Databases  
**Estimated time:** 4–6 days

**Why this stage matters:**
Every AI application handles sensitive data: user conversations, API keys, personal information. Understanding authentication, authorization, and basic security is not optional for production engineering. Clerk is already handling auth in this application — this stage explains what it's doing and why each decision was made.

**Learning Tasks**
1. Authentication vs authorization — the distinction and why conflating them causes bugs
2. JWT tokens — structure, signing, expiration, verification, what's safe in a payload
3. OAuth 2.0 flow — authorization code flow, what Clerk is doing under the hood
4. API key security — rotation, scoping, storage, what happens when a key leaks
5. HTTPS and TLS — why it matters for AI applications handling user data
6. OWASP Top 10 basics — injection, broken authentication, sensitive data exposure

**Mini Challenges**
1. **Clerk Audit** — Audit this application's Clerk implementation. Document: where the session token is created, where it's validated, what happens on each authenticated request, and identify any security gaps. Suggest at least two improvements.

2. **JWT Decoder** — Using only Python's base64 and json modules (no jwt library), decode a JWT token. Read the header, payload, and understand the signature section. Explain: what the token proves, what it doesn't prove, and what would happen if someone tampered with the payload.

**Resources**
- Primary: "Authentication & Authorization Explained" — Fireship (YouTube)
- Reference: OWASP Top Ten — owasp.org, Clerk Documentation — clerk.com/docs

**Interview Blueprint**
- Concept: "Explain the difference between a session cookie and a JWT token. What are the security tradeoffs?"
- Application: "A user reports they can access another user's data in your AI application. How do you diagnose and fix this?"
- Architecture: "Why does this application use Clerk instead of building authentication from scratch? What are the risks of rolling your own?"
- Defense: "A teammate says 'it's fine, we're only an internal tool' to justify skipping authentication. How do you respond?"
- Connection: "How does your understanding of API key security apply to how you'll manage the Anthropic API key in production?"

**Chapter 3 Project: AI Knowledge Base API**

A document ingestion and full-text search API built on PostgreSQL. This is the data foundation that becomes a full RAG system in Chapter 5.

**Requirements:**
- FastAPI backend (introduced here — detailed in Chapter 4)
- PostgreSQL via Prisma with full-text search using tsvector/tsquery
- Document model: title, content, source_url, tags, created_at, chunk_count
- REST endpoints:
  - POST /documents — ingest a document, generate chunks, store
  - GET /documents — list documents with pagination and tag filtering
  - GET /documents/:id — retrieve a single document with chunks
  - DELETE /documents/:id — remove a document and its chunks
  - GET /search?q= — full-text search across documents, return ranked results
- API key authentication on all endpoints
- Background job for processing large documents (chunking on ingest)
- Meaningful error responses with correct HTTP status codes
- Test all endpoints with a collection of at least 10 real documents (use curriculum.md content)
- README with complete API documentation including request/response examples

**Architecture Diagram:**  
System diagram showing: API client → FastAPI → Prisma → PostgreSQL. Include the background job flow for document processing. Show the document → chunk relationship. Label all data stores and external dependencies.

**Workflow Diagram:**  
Two workflow diagrams: (1) Document ingestion workflow — from POST /documents through chunking to storage. (2) Search workflow — from GET /search?q= through tsvector query to ranked results returned to client.

**Architecture Decision Records (minimum 2):**

*ADR 1: Search technology*  
Why PostgreSQL full-text search (tsvector) instead of Elasticsearch, Meilisearch, or Algolia? Document the tradeoffs. Note what would change this decision (scale, query complexity, infrastructure budget). Note that this decision will be revisited in Chapter 5 when vector search is added.

*ADR 2: Chunking strategy*  
How are documents chunked for storage? What chunk size was chosen and why? What alternatives were considered (fixed-size, sentence-boundary, paragraph-boundary)? Document the expected impact on future semantic search quality.

**Completion Criteria**
- All 6 tasks practiced
- Both challenges completed with documentation
- All API endpoints working and tested
- Architecture and workflow diagrams committed
- Both ADRs written and committed
- AI interview passed at 85%+

---

# CHAPTER 4: Backend Development

**Why this chapter exists:**
AI products need servers. Understanding how to build, structure, validate, and deploy a backend application is what separates someone who can demo an AI feature from someone who can ship it to production. FastAPI is the dominant framework for Python AI backends. This chapter makes Travis fluent in it.

**Estimated chapter duration:** 4–6 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** Production API — a FastAPI application deployed to a cloud platform with authentication, validation, background jobs, observability, and complete engineering documentation.

---

### Stage 17: FastAPI Fundamentals

**Chapter:** 4 — Backend Development  
**Estimated time:** 5–7 days

**Why this stage matters:**
FastAPI is the framework of choice for AI backends. It is fast, has automatic OpenAPI documentation, and integrates naturally with async Python — which matters when calling AI APIs with latency. Travis will use FastAPI to build every AI service in Chapters 5 and 6.

**Learning Tasks**
1. FastAPI basics — routes, path parameters, query parameters, response models
2. Pydantic models — request validation, response serialization, field types and validation
3. Dependency injection — Depends(), database sessions, authentication dependencies
4. Async routes — async def vs def, when async matters with AI API calls
5. Error handling — HTTPException, custom exception handlers, consistent error responses
6. OpenAPI — auto-generated docs, testing endpoints via /docs, schema introspection

**Mini Challenges**
1. **AI Proxy Endpoint** — Build a FastAPI endpoint that: accepts a user message, validates it (non-empty, max 2000 chars), calls the Anthropic API, streams the response back using StreamingResponse, and logs token usage. Handle rate limit errors with a proper 429 response.

2. **Middleware Audit** — Add request logging middleware that logs: timestamp, method, path, status code, and response time for every request. Add CORS middleware configured for a specific origin. Explain every parameter in the CORS configuration.

**Resources**
- Primary: FastAPI official tutorial — fastapi.tiangolo.com (complete tutorial, not just the quickstart)
- Reference: FastAPI Documentation — full reference

**Interview Blueprint**
- Concept: "What is dependency injection and why does FastAPI's implementation make testing easier?"
- Application: "You're building an AI endpoint that calls Claude. The call takes 3–10 seconds. How do you handle this without timing out?"
- Architecture: "Explain when you would use StreamingResponse for an AI API endpoint."
- Defense: "A teammate wants to use Flask instead of FastAPI. What's your case for FastAPI?"
- Connection: "How does FastAPI's async handling help when you're running multiple concurrent AI API calls in Stage 27?"

**Completion Criteria**
- All 6 tasks practiced with a running FastAPI app
- Both challenges implemented and tested via /docs
- Can build a FastAPI route with Pydantic validation from memory
- AI interview passed at 85%+

---

### Stage 18: Middleware & Background Jobs

**Chapter:** 4 — Backend Development  
**Estimated time:** 4–6 days

**Why this stage matters:**
AI API calls are slow. Users should not wait synchronously for background processing jobs. This stage covers the patterns that make AI applications feel fast and reliable: middleware for cross-cutting concerns and background tasks for long-running operations.

**Learning Tasks**
1. Middleware patterns — request/response lifecycle, custom middleware, ordering matters
2. Background tasks — FastAPI BackgroundTasks, when to use vs a queue
3. Job queues — Celery + Redis basics, when a full queue is warranted
4. Webhooks — receiving asynchronous callbacks, why AI pipelines use them
5. Task status — polling patterns, how to tell a client their background job is done
6. Idempotency — what it means and why AI batch jobs must implement it

**Mini Challenges**
1. **Async Document Processor** — Build an endpoint that accepts a document, kicks off a background job to summarize it with Claude, stores the result, and returns a job_id immediately. Build a second endpoint that accepts job_id and returns status (pending/processing/complete/failed) and result when done.

2. **Idempotent Endpoint** — Modify the document processor to be idempotent: if the same document is submitted twice (detect by hash), return the existing result without calling the AI API again. Explain the hashing strategy and database design.

**Resources**
- Primary: "Background Tasks in FastAPI" — Official FastAPI documentation
- Reference: Celery Documentation — docs.celeryq.dev

**Interview Blueprint**
- Concept: "What is idempotency and why is it critical for AI batch processing jobs?"
- Application: "A user submits a large document for AI analysis. It takes 45 seconds. Design the entire request flow — from submission to retrieving the result."
- Architecture: "When does a FastAPI BackgroundTask become insufficient and when do you need a proper job queue?"
- Defense: "A teammate says polling is an anti-pattern and you should always use webhooks. When do you agree?"
- Connection: "How does the idempotent job pattern apply to the document processing pipeline you'll build in Stage 23?"

**Completion Criteria**
- All 6 tasks practiced
- Both challenges implemented and tested
- Can explain the full background job lifecycle
- AI interview passed at 85%+

---

### Stage 19: Deployment & DevOps Basics

**Chapter:** 4 — Backend Development  
**Estimated time:** 5–7 days

**Why this stage matters:**
A project that runs only on localhost is not a project. It is a draft. Every AI system Travis builds must be deployable to production. This stage covers containerization, environment management, and cloud deployment.

**Learning Tasks**
1. Docker fundamentals — images, containers, Dockerfile, docker build, docker run
2. Docker Compose — multi-service local development, linking services
3. Environment management — staging vs production, environment-specific config
4. Cloud deployment — Railway or Fly.io, deploying a FastAPI app, environment variables
5. Health checks — /health endpoints, what they check, why load balancers need them
6. Basic observability — structured logging, what to log in an AI system, log levels

**Mini Challenges**
1. **Containerize the Knowledge Base API** — Take the AI Knowledge Base API from Chapter 3 and containerize it: write a Dockerfile, add a docker-compose.yml with the app and PostgreSQL container. Verify it works identically in the container. Document every Dockerfile instruction.

2. **Deploy to Production** — Deploy the containerized Knowledge Base API to Railway or Fly.io. Requirements: publicly accessible, environment variables set via the platform (not in the image), health check endpoint returns 200, deployment triggered by git push. Document the full deployment process.

**Resources**
- Primary: "Docker Tutorial for Beginners" — TechWorld with Nana (YouTube, first 2 hours)
- Reference: Railway Documentation — docs.railway.app

**Interview Blueprint**
- Concept: "What is the difference between a Docker image and a Docker container?"
- Application: "Your AI service runs in Docker and calls an external API whose URL differs between staging and production. How do you handle this?"
- Architecture: "Explain what a health check endpoint should verify for an AI application that depends on a database and an external AI API."
- Defense: "A teammate says Docker is overkill for a solo project. When do you agree?"
- Connection: "How does containerization help when deploying multi-agent AI systems in Stage 27?"

**Chapter 4 Project: Production API**

A deployed FastAPI application demonstrating all production characteristics.

**Requirements:**
- FastAPI application with at least 6 endpoints covering different patterns
- PostgreSQL database via Prisma (Supabase or Railway)
- JWT authentication on all protected routes
- At least one endpoint that calls the Anthropic API with streaming
- At least one background job endpoint with status polling
- Health check endpoint that verifies: database connectivity, AI API reachability
- Structured JSON logging with request ID tracking
- Deployed to Railway, Fly.io, or equivalent — publicly accessible URL
- Complete README with deployment instructions and API documentation

**Architecture Diagram:**  
Full system diagram: client → API Gateway / CDN → FastAPI → PostgreSQL. Show the background job worker. Show external dependencies (Anthropic API, database). Show environment separation (local/staging/production) and where each lives.

**Workflow Diagram:**  
Three workflow diagrams: (1) Authenticated request lifecycle — from request to response with middleware chain labeled. (2) Background job lifecycle — from submission to completion notification. (3) Deployment pipeline — from git push to live traffic.

**Architecture Decision Records (minimum 3):**

*ADR 1: Deployment platform*  
Why Railway (or Fly.io) instead of AWS, GCP, Heroku, or Render? Document the decision criteria and what would change at different scales.

*ADR 2: Authentication strategy*  
Why JWT instead of session cookies or API keys for this application? Document the tradeoffs. At what point would this decision need to be revisited?

*ADR 3: Background job approach*  
Why FastAPI BackgroundTasks instead of Celery or a managed queue (SQS, Cloud Tasks)? What are the failure modes of the chosen approach? When does this decision need to change?

**Completion Criteria**
- All 6 tasks practiced
- Both challenges completed and deployed
- Production API accessible at a public URL
- Architecture and workflow diagrams committed
- All three ADRs written and committed
- AI interview passed at 85%+

---

# CHAPTER 5: AI Engineering

**Why this chapter exists:**
LLMs, embeddings, RAG, and agents are not magic — they are systems built on HTTP, Python, databases, and APIs. Travis now has all the prerequisite skills. This chapter applies them to AI-specific problems. The chapter project is the AI Career Coach — the system that will live inside this application. Travis is not building a demo. He is building a production system.

**Estimated chapter duration:** 9–12 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** AI Career Coach — a production RAG-powered AI assistant with conversation memory, tool use, and the Knowledge Base API from Chapter 3 as its data source.

---

### Stage 20: LLM Fundamentals

**Chapter:** 5 — AI Engineering  
**Estimated time:** 5–6 days

**Why this stage matters:**
An AI engineer who does not understand how LLMs work cannot make good architectural decisions. Tokens, context windows, temperature, and model selection are not black-box settings — they have predictable effects on quality, cost, and latency.

**Learning Tasks**
1. Transformer architecture — attention mechanism, what happens during inference (conceptually, no math required)
2. Tokenization — what tokens are, how text maps to tokens, why token count matters for cost
3. Context windows — what they are, why they matter, what happens when exceeded
4. Temperature and sampling — temperature, top-p, top-k, when to adjust each
5. Model families — Claude (Haiku, Sonnet, Opus), GPT-4o, Gemini — how to choose
6. Cost modeling — input vs output tokens, cost per million tokens, estimating production workload cost

**Mini Challenges**
1. **Token Calculator** — Using the Anthropic tokenizer, calculate token counts for 10 different text samples: a tweet, a paragraph, a legal document excerpt, code, JSON, and more. Build a cost estimator: given calls per day with average input/output sizes, calculate monthly cost at Claude Sonnet pricing.

2. **Temperature Experiment** — Run the same prompt 5 times at temperature=0 and 5 times at temperature=1.0. Document the differences. Find a task where high temperature helps and one where it hurts. Explain why temperature has different effects on different task types.

**Resources**
- Primary: "Intro to Large Language Models" — Andrej Karpathy (YouTube, 1 hour)
- Reference: Anthropic Documentation — Model overview and context windows

**Interview Blueprint**
- Concept: "What is a token? Why does token count matter differently for input versus output?"
- Application: "You're building a chatbot with conversation history. The conversation can go for hours. How do you handle the context window limit?"
- Architecture: "When would you choose Claude Haiku over Claude Sonnet? Give three specific scenarios."
- Defense: "A stakeholder asks for the 'best' AI model. How do you respond?"
- Connection: "How does your understanding of context windows shape the RAG architecture you'll design in Stage 23?"

**Completion Criteria**
- All 6 tasks studied and documented
- Both challenges completed with documented results
- Can explain tokens, context windows, and temperature tradeoffs without notes
- AI interview passed at 85%+

---

### Stage 21: Prompt Engineering

**Chapter:** 5 — AI Engineering  
**Estimated time:** 5–6 days

**Why this stage matters:**
Prompt engineering is the primary interface between engineers and LLMs. A poorly written system prompt produces inconsistent outputs. A well-written one produces reliable, structured, and safe outputs. This is not a soft skill — it is a precision engineering discipline with measurable outcomes.

**Learning Tasks**
1. System prompts — role, context, constraints, output format, persona
2. Few-shot prompting — examples in the prompt, when they help and when they hurt
3. Chain-of-thought — step-by-step reasoning, when to request it, its effect on quality
4. Output formatting — JSON mode, structured outputs, format instructions
5. Prompt failure modes — hallucination, instruction following failures, prompt injection
6. Prompt versioning — treating prompts as code, version control, evaluation

**Mini Challenges**
1. **Prompt Iteration** — Start with a naive prompt for extracting structured data from unstructured text. Run it 10 times. Document failure modes. Improve with system prompt, constraints, and examples. Run again 10 times. Measure the improvement in consistency.

2. **Prompt Injection Defense** — Build a prompt that only answers questions about Python. Attempt to break it with 5 different prompt injection attacks. Document which attacks work. Improve the prompt until all 5 are blocked. Explain each defensive technique.

**Resources**
- Primary: Anthropic Prompt Engineering Guide — docs.anthropic.com/en/guides/prompt-engineering
- Reference: "Prompt Engineering Guide" — promptingguide.ai

**Interview Blueprint**
- Concept: "What is prompt injection and why is it a security vulnerability in AI applications?"
- Application: "You need an LLM to reliably output valid JSON. What techniques do you use to guarantee this?"
- Architecture: "How do you version control and evaluate prompts in a production AI system?"
- Defense: "A teammate says prompt engineering is just guessing. How do you respond?"
- Connection: "How do the system prompt techniques you've learned apply to designing the AI interviewer in this application?"

**Completion Criteria**
- All 6 tasks practiced with real prompts
- Both challenges completed with documented iterations
- Can write a reliable structured-output prompt from memory
- AI interview passed at 85%+

---

### Stage 22: Embeddings & Semantic Search

**Chapter:** 5 — AI Engineering  
**Estimated time:** 5–6 days

**Why this stage matters:**
Embeddings are the mechanism that makes semantic search, RAG, and recommendation systems work. An engineer who does not understand embeddings cannot debug a RAG pipeline that returns irrelevant results. This stage builds the intuition and hands-on skill that every RAG stage depends on.

**Learning Tasks**
1. What embeddings are — high-dimensional vectors, semantic meaning in vector space
2. Embedding models — text-embedding-3-small (OpenAI), voyage-ai (Anthropic), sentence-transformers
3. Cosine similarity — what it measures, how to calculate it, interpreting the score
4. Semantic search — embed a query, embed documents, return nearest neighbors
5. Chunking strategies — why chunking matters, fixed-size vs semantic chunking, overlap
6. Embedding use cases — search, clustering, classification, deduplication, anomaly detection

**Mini Challenges**
1. **Semantic Search From Scratch** — Without a vector database: embed 50 text chunks using an embedding model, store as a Python list of (text, vector) tuples, implement cosine similarity search from scratch using only NumPy, and demonstrate that semantic search finds relevant results that keyword search would miss.

2. **Chunking Experiment** — Take a 5,000-word article. Chunk it three ways: 256-token fixed, 512-token fixed, and semantic paragraphs. For each: count chunks, embed them, run the same 5 queries, and compare which strategy returns the most relevant results. Document conclusions.

**Resources**
- Primary: "Embeddings Explained" — Andrej Karpathy or Fireship (YouTube)
- Reference: Anthropic Documentation — Embeddings

**Interview Blueprint**
- Concept: "Explain what a vector embedding is to someone who has never heard the term."
- Application: "Your RAG system keeps returning irrelevant chunks. Walk me through how you'd diagnose and fix this."
- Architecture: "What is the tradeoff between smaller and larger chunk sizes in a RAG system?"
- Defense: "A teammate says embeddings are just word2vec with more compute. How do you respond?"
- Connection: "How does cosine similarity relate to the relevance ranking you'll implement in your RAG pipeline in Stage 23?"

**Completion Criteria**
- All 6 tasks practiced
- Both challenges completed with documented results
- Can explain embeddings and cosine similarity without notes
- AI interview passed at 85%+

---

### Stage 23: RAG Foundations

**Chapter:** 5 — AI Engineering  
**Estimated time:** 6–8 days

**Why this stage matters:**
Retrieval-Augmented Generation is the dominant pattern for grounding LLMs in specific knowledge. This stage covers the indexing and retrieval pipeline: how documents get stored and how the right ones are found. Stage 24 covers evaluation and optimization. Both stages together constitute a complete, production-worthy RAG implementation.

**Learning Tasks**
1. RAG architecture — the three pipelines: indexing, retrieval, generation
2. Vector databases — pgvector (PostgreSQL), Chroma, Pinecone — when to use each and why
3. Indexing pipeline — document loading, chunking, embedding, storing vectors with metadata
4. Retrieval strategies — top-k similarity search, metadata filtering, similarity thresholds
5. Context assembly — how retrieved chunks become the prompt, ordering and relevance weighting
6. Citation and grounding — returning source references with answers, why grounding matters

**Mini Challenges**
1. **Upgrade the Knowledge Base** — Add pgvector to the AI Knowledge Base API from Chapter 3. Add a vector column to the document chunks table. When a document is ingested, generate and store embeddings for each chunk. Add a GET /search/semantic?q= endpoint that uses vector similarity instead of full-text search. Verify that semantic search finds results that full-text search misses.

2. **Context Window Manager** — Build a function that takes a list of retrieved chunks (each with a relevance score and token count), a maximum context token budget, and returns the optimal subset of chunks to include in a prompt. Chunks should be ordered by relevance, with the highest-scored chunks included first until the budget is exhausted.

**Resources**
- Primary: "RAG From Scratch" — LangChain YouTube channel (episodes 1–8)
- Reference: Anthropic Documentation — Building effective RAG

**Interview Blueprint**
- Concept: "Explain the difference between the indexing pipeline and the retrieval pipeline in a RAG system."
- Application: "Your RAG system is slow — retrieval takes 3 seconds for every query. What are the likely causes and how do you address each?"
- Architecture: "When would you choose pgvector over a dedicated vector database like Pinecone?"
- Defense: "A stakeholder says 'just fine-tune the model instead of using RAG.' How do you evaluate this tradeoff?"
- Connection: "How does the chunking strategy you chose in Stage 22 affect retrieval quality in this stage?"

**Completion Criteria**
- All 6 tasks practiced
- Knowledge Base API upgraded with pgvector search
- Context window manager built and tested
- AI interview passed at 85%+

---

### Stage 24: RAG Evaluation & Optimization

**Chapter:** 5 — AI Engineering  
**Estimated time:** 6–8 days

**Why this stage matters:**
A RAG system that works in a demo may fail on real data. Evaluation is what separates a demo from a production system. This stage builds the skills to measure RAG quality, identify failure modes, and systematically improve performance — skills that distinguish an AI engineer from someone who assembled a tutorial.

**Learning Tasks**
1. RAG failure modes — hallucination despite retrieval, irrelevant retrieval, context overflow, citation errors
2. Evaluation metrics — precision@k, recall@k, answer faithfulness, answer relevance
3. Building an evaluation dataset — creating question-answer-source ground truth pairs
4. Hybrid search — combining keyword (BM25 or tsvector) and semantic search, relevance fusion
5. Retrieval optimization — query rewriting, multi-query retrieval, HyDE (Hypothetical Document Embeddings)
6. Reranking — what a reranker does, cross-encoder vs bi-encoder, when reranking adds value

**Mini Challenges**
1. **RAG Eval Suite** — Write 15 question-answer-source ground truth pairs for the AI Knowledge Base (use curriculum content). Run your RAG pipeline on all 15 questions. Score each: did it retrieve the right sources? Is the answer faithful to the source? Is the answer correct? Calculate precision and recall. Identify the weakest component.

2. **Hybrid Search Implementation** — Add hybrid search to the Knowledge Base API: combine PostgreSQL full-text search scores with vector similarity scores using Reciprocal Rank Fusion (RRF). Compare hybrid results vs. pure semantic results on the same 15 evaluation questions. Document which approach wins on which query types.

**Resources**
- Primary: "RAG Evaluation" — LangChain YouTube channel or RAGAS documentation
- Reference: RAGAS Documentation — docs.ragas.io

**Interview Blueprint**
- Concept: "What is answer faithfulness in RAG evaluation? How do you measure it without a human reviewer?"
- Application: "Your RAG system scores 60% precision on your evaluation set. Walk me through a systematic debugging process."
- Architecture: "When does adding a reranker improve RAG quality and when does it hurt latency without helping quality?"
- Defense: "A teammate says evaluation datasets are too time-consuming to build. How do you respond?"
- Connection: "How does the hybrid search you built here combine the full-text search from Chapter 3 with the vector search from Stage 23?"

**Completion Criteria**
- All 6 tasks practiced
- Evaluation suite built and run with documented results
- Hybrid search implemented and benchmarked
- AI interview passed at 85%+

---

### Stage 25: AI Agents & Tool Use

**Chapter:** 5 — AI Engineering  
**Estimated time:** 6–8 days

**Why this stage matters:**
Agents are what happens when an LLM can take actions — search the web, call APIs, query databases, run code. The agent pattern is increasingly the default for production AI applications that need to do more than generate text. Understanding the agent loop, tool design, and failure modes is essential for building reliable AI systems.

**Learning Tasks**
1. The agent loop — reasoning, tool selection, tool execution, observation, next step
2. Tool definition — function schemas, how LLMs select and call tools
3. Tool design — what makes a good tool vs a bad tool, atomicity, error handling in tools
4. Multi-step reasoning — ReAct pattern, chain-of-thought with tool use
5. Agent failure modes — infinite loops, tool selection errors, hallucinated tool calls
6. LangGraph basics — state machines for agents, conditional edges, checkpointing

**Mini Challenges**
1. **Tool-Calling Agent** — Build a Python agent (using Anthropic tool use directly, no framework) with three tools: a calculator, a mock web search, and the Knowledge Base search endpoint. The agent must use the correct tool for each of 10 test queries. Document every case where it chose the wrong tool and why.

2. **Agent with Memory** — Add conversation memory to the agent: it should remember what tools it used in previous turns and avoid redundant calls. Implement using a turn history in the prompt. Test with a multi-turn conversation that requires remembering prior actions.

**Resources**
- Primary: "LangGraph Tutorial" — LangChain YouTube channel
- Reference: Anthropic Tool Use Documentation — docs.anthropic.com

**Interview Blueprint**
- Concept: "Explain the ReAct pattern. What does the agent do between receiving a tool result and taking the next action?"
- Application: "Your agent is calling the same tool in an infinite loop. How do you detect and prevent this?"
- Architecture: "When would you use LangGraph over a simple loop-based agent? What does the state machine add?"
- Defense: "A stakeholder wants to give the agent unrestricted internet access. What risks do you identify?"
- Connection: "How does the tool-use architecture you built here form the foundation of the multi-agent system in Stage 27?"

**Chapter 5 Project: AI Career Coach**

A production RAG-powered AI assistant that answers questions about the AI Product Engineer learning path. The knowledge base is the curriculum content from this application. This is not a demo. It must work reliably on real queries about real curriculum content.

**Requirements:**
- The curriculum document and all stage content indexed in the Knowledge Base API from Chapter 3
- Answers questions about stages, concepts, resources, projects, and next steps
- Multi-turn conversation with memory (previous messages in context)
- At least 3 tools: search_curriculum, get_current_stage_details, suggest_next_action
- Streaming responses via FastAPI endpoint
- Sources cited in every answer with stage and section references
- Deployed as a production FastAPI endpoint
- Tested with 25 real questions about the curriculum — must score ≥ 88% correct
- All conversation turns logged with: tokens used, tools called, latency, retrieved sources

**Architecture Diagram:**  
Full system diagram: client → FastAPI → Agent loop → Tools → Knowledge Base API → pgvector + PostgreSQL. Show the RAG pipeline inline. Show conversation memory storage. Show all external dependencies. Label every component.

**Workflow Diagram:**  
Two diagrams: (1) Single-turn Q&A workflow — from user question through retrieval, context assembly, generation, to answer with citations. (2) Multi-turn workflow — how conversation history influences retrieval and generation.

**Architecture Decision Records (minimum 3):**

*ADR 1: RAG vs fine-tuning*  
Why RAG instead of fine-tuning Claude on the curriculum content? Document when this decision would reverse.

*ADR 2: pgvector vs dedicated vector database*  
Why pgvector instead of Pinecone, Chroma, or Weaviate? Document the tradeoffs at current scale and at 10× scale.

*ADR 3: Agent architecture*  
Why this particular tool set and agent loop design? What alternative architectures were considered? What would need to change to handle a more complex query type?

**Completion Criteria**
- All stages 20–25 tasks complete
- All chapter challenges complete
- AI Career Coach deployed and functional
- Scores ≥ 88% on the 25-question evaluation set (with documented test results)
- Architecture and workflow diagrams committed
- All three ADRs written and committed
- AI interview (covering all Chapter 5 stages) passed at 85%+

---

# CHAPTER 6: AI Architecture

**Why this chapter exists:**
Shipping an AI prototype is not the same as operating an AI system. Production AI systems have latency constraints, cost constraints, reliability requirements, safety considerations, and compliance requirements. This chapter is about the gap between "it works in demo" and "it works at 3am when the primary model is down and a user has submitted 10,000 documents." The chapter project requires Travis to design, document, and defend a complete enterprise AI system architecture.

**Estimated chapter duration:** 5–8 weeks at 60–90 min/day (mastery-based)  
**Chapter project:** Enterprise AI Platform Design — a complete architecture document, proof-of-concept implementation, and technical presentation for a production-grade multi-agent AI system.

---

### Stage 26: AI System Design

**Chapter:** 6 — AI Architecture  
**Estimated time:** 5–7 days

**Why this stage matters:**
System design is where engineering judgment is demonstrated. It is not about knowing every tool — it is about knowing which tool to use, when, why, and what the tradeoff is. Every AI architecture decision has consequences for latency, cost, reliability, and maintainability.

**Learning Tasks**
1. Latency vs accuracy tradeoffs — when to sacrifice response quality for speed
2. Caching strategies — caching LLM responses, prompt caching, semantic caching
3. Anthropic prompt caching — the prompt caching API, cost and latency implications
4. AI observability — tracing LLM calls, measuring latency, tracking token usage
5. Evaluation systems — how to systematically evaluate AI output quality at scale
6. Fallback strategies — primary model down, degraded mode, model routing

**Mini Challenges**
1. **Cost Optimization Analysis** — Analyze a hypothetical AI application: 10,000 users, average 20 messages per session, 500-token average message, using Claude Sonnet. Calculate monthly cost without optimization, with prompt caching, with response caching for common queries, and with model routing (Haiku for simple queries). Present the full analysis with assumptions documented.

2. **Observability Implementation** — Add structured observability to the AI Career Coach: trace every LLM call with timestamp, model, input tokens, output tokens, latency, and tool calls made. Store traces in a database. Build a query that shows the slowest requests and most expensive sessions.

**Resources**
- Primary: Relevant LLMOps conference talk (search: "LLM production scaling" on YouTube)
- Reference: Anthropic Documentation — Prompt Caching

**Interview Blueprint**
- Concept: "What is semantic caching and when does it break down?"
- Application: "Your AI application's monthly API bill is $8,000. Walk me through reducing it by 40% without degrading user experience."
- Architecture: "Design a fallback system for an AI application where the primary model goes down."
- Defense: "A CTO says the company should host its own LLM to avoid vendor lock-in. Evaluate this decision."
- Connection: "How does prompt caching interact with the RAG system architecture you designed in Stages 23–24?"

**Completion Criteria**
- All 6 tasks studied and documented
- Both challenges completed
- Can draw an AI system architecture diagram and explain every component
- AI interview passed at 85%+

---

### Stage 27: Multi-Agent Systems

**Chapter:** 6 — AI Architecture  
**Estimated time:** 6–8 days

**Why this stage matters:**
Complex AI tasks exceed the capability of a single agent. Multi-agent systems are increasingly the architecture for production AI applications that require research, analysis, writing, verification, and synthesis. Understanding orchestration, communication, and coordination — and when not to use agents — is essential.

**Learning Tasks**
1. Multi-agent patterns — orchestrator-worker, peer-to-peer, hierarchical, competitive
2. Agent communication — shared state, message passing, handoffs in LangGraph
3. Task decomposition — breaking complex tasks into sub-tasks for specialized agents
4. Coordination failures — deadlock, race conditions, conflicting outputs, error propagation
5. Evaluation in multi-agent systems — how do you know the system produced the right answer?
6. When not to use agents — the complexity cost of agents, when a single chain is better

**Mini Challenges**
1. **Two-Agent Pipeline** — Build a two-agent system using LangGraph: Agent 1 receives a topic, searches the Knowledge Base, and produces a structured outline. Agent 2 takes the outline and expands each section into a full explanation. The orchestrator coordinates them and produces a final document. Every handoff must be explicit and logged.

2. **Failure Mode Simulation** — Intentionally break the two-agent system three ways: Agent 1 produces incomplete output, Agent 2 refuses a certain input, shared state becomes inconsistent. Document system behavior in each case. Implement recovery logic for each failure.

**Resources**
- Primary: "Multi-Agent Systems with LangGraph" — LangChain YouTube channel
- Reference: LangGraph Documentation — langchain-ai.github.io/langgraph

**Interview Blueprint**
- Concept: "What is the orchestrator-worker pattern? When is it appropriate?"
- Application: "Design a multi-agent system that researches a company, analyzes their AI maturity, and produces a consulting report. What agents do you create?"
- Architecture: "How do you handle the case where one agent in a pipeline produces invalid output that the next agent cannot process?"
- Defense: "A teammate wants a multi-agent system for a task a single well-prompted LLM could handle. How do you evaluate this?"
- Connection: "How does multi-agent coordination relate to distributed systems concepts in Stage 28?"

**Completion Criteria**
- All 6 tasks practiced
- Both challenges completed and functional
- Can design a multi-agent architecture for a novel problem
- AI interview passed at 85%+

---

### Stage 28: Production AI Operations

**Chapter:** 6 — AI Architecture  
**Estimated time:** 5–7 days

**Why this stage matters:**
Shipping an AI system is the beginning of the work, not the end. Systems break. Models behave unexpectedly. Costs spike. Users find edge cases. Operating a production AI system requires monitoring, alerting, incident response, and the ability to diagnose failures in probabilistic, non-deterministic components.

**Learning Tasks**
1. AI-specific monitoring — response quality drift, refusal rate, latency percentiles, cost per request
2. Alerting strategy — what alerts are worth setting, alert fatigue, runbooks
3. Incident response for AI — diagnosing a quality regression, rolling back a prompt change
4. Cost monitoring — token spend alerts, anomaly detection for unusual usage patterns
5. Safety and content filtering — output filtering, input sanitization, PII detection
6. Model versioning — managing prompt versions, model version pinning, migration strategies

**Mini Challenges**
1. **Incident Response Runbooks** — Write runbooks for three AI-specific incidents: (1) response quality drops suddenly, (2) cost spikes 10× overnight, (3) the primary AI model returns errors for all requests. Each runbook: detection method, diagnostic steps, mitigation, communication template, post-incident action.

2. **Safety Layer** — Add a safety layer to the AI Career Coach: filter outputs containing PII patterns (emails, phone numbers), detect and handle prompt injection attempts, add a content policy (responses must stay on-topic), log every safety event with context. Test with 10 adversarial inputs.

**Resources**
- Primary: LangSmith Documentation (for AI observability) — smith.langchain.com
- Reference: Anthropic Safety Documentation — docs.anthropic.com

**Interview Blueprint**
- Concept: "What is response quality drift in a production LLM application and how do you detect it?"
- Application: "Your AI application's cost spiked 500% overnight. Walk me through exactly how you'd diagnose this."
- Architecture: "Design a safety layer for an AI application that handles medical questions."
- Defense: "A stakeholder says AI safety measures are unnecessary for an internal tool. How do you respond?"
- Connection: "How does the observability you implemented in Stage 26 enable the incident response process you're designing here?"

**Completion Criteria**
- All 6 tasks studied and documented
- Both challenges completed
- Can explain the operational requirements of a production AI system without notes
- AI interview passed at 85%+

---

### Stage 29: Enterprise AI Architecture

**Chapter:** 6 — AI Architecture  
**Estimated time:** 6–9 days

**Why this stage matters:**
Enterprise AI systems have compliance requirements, multi-team governance, security boundaries, scalability constraints, and integration complexity that requires architectural thinking at a different level. This is the final stage. It synthesizes everything into the ability to design, defend, and present a complete AI system architecture — the capstone of the AI Product Engineer path.

**Learning Tasks**
1. Enterprise AI architecture patterns — hub-and-spoke, federated, centralized vs decentralized AI platforms
2. Data governance for AI — data lineage, consent management, PII handling, audit trails
3. Scalability — horizontal scaling for AI workloads, queue-based architectures for burst traffic
4. Security architecture — zero-trust for AI services, secrets management, API gateway patterns
5. Architecture documentation — Architecture Decision Records (ADRs), C4 model system diagrams
6. Technical communication — presenting architecture to non-technical stakeholders

**Mini Challenges**
1. **Architecture Decision Record** — Write a formal ADR for one of the most important decisions made across all chapters: the choice of RAG over fine-tuning, the use of pgvector, the agent architecture, or the deployment platform. Follow the full ADR format. Include: historical context from the chapter where the decision was made, what you know now that you didn't know then, and whether the decision still holds.

2. **System Design Defense** — Design a complete AI platform for a 500-person company that wants to: give employees access to an internal knowledge base assistant, log all AI interactions for compliance, prevent PII from being sent to external AI providers, and track costs by department. Produce a system diagram and be prepared to defend every decision in the AI interview.

**Resources**
- Primary: ByteByteGo or Arpit Bhayani (YouTube) — system design for large-scale systems
- Reference: C4 Model Documentation — c4model.com

**Interview Blueprint**
- Concept: "What is the C4 model? What does each level describe and who is the intended audience for each?"
- Application: "A company wants an AI system that accesses their internal customer database. What security boundaries do you establish and why?"
- Architecture: "Design a multi-tenant AI platform where different departments share infrastructure but are isolated from each other's data and costs."
- Defense: "Present your Enterprise AI Platform design from the mini challenge and defend every major decision under questioning."
- Connection: "Looking back at Stage 1 — how the web works — explain how that foundation connects to every architectural decision you've made across all 29 stages."

**Chapter 6 Project: Enterprise AI Platform Design**

A complete architecture design for a production-grade AI platform, with a working proof-of-concept of the most complex component.

**Requirements:**
- Full system architecture using the C4 model: Context diagram, Container diagram, Component diagram, and Code diagram for the most critical component
- Security threat model: attack vectors, mitigations, residual risks
- Working proof-of-concept: implement the most architecturally complex component of the design (multi-agent orchestration, safety layer, or cost control system)
- Cost model: estimated monthly cost at 100 users, 1,000 users, and 10,000 users with assumptions documented
- Operational runbook: how to deploy, monitor, and respond to incidents for this system
- 20-minute technical presentation that Travis could deliver to an engineering team

**Architecture Diagram:**  
The C4 model diagrams (Context, Container, Component, Code) are the architecture diagrams for this project. Each level must be a separate, complete diagram. All diagrams committed to the repository as Mermaid or exported image files.

**Workflow Diagram:**  
Three diagrams: (1) End-to-end user workflow through the enterprise AI platform. (2) Data governance workflow — how data is ingested, processed, and audited. (3) Incident response workflow — from alert to resolution.

**Architecture Decision Records (minimum 5):**

*ADR 1: Platform topology*  
Centralized vs federated AI platform. Document the chosen approach, the constraints that drove it, and the conditions under which it would need to change.

*ADR 2: Multi-tenancy strategy*  
How departments are isolated — schema isolation, row-level security, separate databases, or separate clusters. Document the tradeoffs at each level.

*ADR 3: PII handling*  
How PII is detected and prevented from reaching external AI providers. Document the technical approach and its limitations.

*ADR 4: Cost attribution*  
How AI spend is tracked and attributed by department. Document the implementation approach and the reporting mechanism.

*ADR 5: Retrospective ADR*  
Look back at any decision made in Chapters 1–5 and write an ADR for it with the benefit of knowing what you know now. What would you do differently?

**Completion Criteria**
- All 6 tasks studied and documented
- Both challenges completed
- C4 model diagrams for all four levels committed
- Proof-of-concept working and documented
- All five ADRs written and committed
- 20-minute presentation prepared
- Final AI interview (covering all Chapter 6 stages) passed at 85%+

---

# Curriculum Summary

| Chapter | Stages | Est. weeks (mastery) | Chapter Project |
|---|---|---|---|
| 1. Web & Internet | 1–6 | 6–8 weeks | Personal Portfolio Website |
| 2. Python | 7–12 | 5–7 weeks | CLI Task Manager |
| 3. APIs & Databases | 13–16 | 4–6 weeks | AI Knowledge Base API |
| 4. Backend Development | 17–19 | 4–6 weeks | Production API |
| 5. AI Engineering | 20–25 | 9–12 weeks | AI Career Coach |
| 6. AI Architecture | 26–29 | 5–8 weeks | Enterprise AI Platform Design |

**Total path:** 33–47 weeks · **7–9 months** at 60–90 min/day

---

## Why the Estimate Is This Long

The original estimate was 5 months based on task completion.

This estimate is 7–9 months based on mastery. The difference:

| Factor | Adds to timeline |
|---|---|
| AI interview per stage (30–40 min each) | ~3 weeks total |
| Remediation cycles (20% of stages fail first interview) | ~3–4 weeks |
| Project time consistently exceeds estimates | ~4–6 weeks |
| ADRs and diagrams per chapter project | ~2–3 weeks |
| Learning friction, debugging, re-reading | ~3–5 weeks |
| Life interruptions and reorientation | ~2–4 weeks |

An engineer who completes this path in 7–9 months with genuine 85%+ interview performance on every stage will be production-capable. An engineer who rushes it in 5 months without mastery will hit a wall in Chapter 5 or on the first job interview.

The path is designed for mastery. Take the time it takes.

---

## Mastery Gate — Applied to Every Stage

A stage is complete when and only when:

1. All tasks have been studied and practiced
2. All challenges have been built, verified, and work correctly
3. The project has been submitted with a public URL or deliverable
4. The AI interview has been passed with a score of 85% or above

No stage is complete because time was spent on it. A stage is complete because the interview proves understanding.

That is the standard. Everything else is preparation for it.
