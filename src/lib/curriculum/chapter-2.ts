import type { CurriculumStage } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Chapter 2: Python — Stages 7–12
//
// Goal: Write Python programs confidently. Understand types, control flow,
// functions, data structures, file I/O, error handling, and OOP well enough
// to read and extend real-world libraries.
//
// Chapter project: CLI Task Manager — a full Python command-line application
// with file persistence, error handling, clean module structure, and
// engineering documentation.
//
// Resource diversity:
//   Corey Schafer (Tier 2): Stages 7, 9, 12 — video where visual demonstration adds value
//   Python.org official docs (Tier 1): Stages 8, 10 — where the official tutorial is the best source
//   Real Python (Tier 2): Stage 11 — practitioner-focused, peer-reviewed content
// ─────────────────────────────────────────────────────────────────────────────

export const CHAPTER_2_STAGES: CurriculumStage[] = [

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 7: Python Basics
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-basics",
    number: 7,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: false,

    title: "Python Basics",
    description:
      "Set up a Python development environment, understand dynamic typing, work with strings and numeric types, write input/output, and use the REPL for fast exploration.",
    whyItMatters:
      "Python is the primary language of AI engineering. LangChain, FastAPI, the Anthropic SDK, NumPy, Pandas — all Python. This stage is not about writing scripts. It is about building a correct mental model of how Python thinks about types, values, and expressions. A weak foundation here produces hours of debugging later.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "Python Tutorial for Beginners (episodes 1–6)",
        author: "Corey Schafer",
        url: "https://www.youtube.com/@coreyms",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "3–4 hours",
        selectionReason:
          "Corey Schafer's Python series is the most widely recommended beginner Python resource in the engineering community. It is used as supplementary material in university computer science programs and recommended by working Python engineers. His approach explains the why behind Python's design decisions rather than listing syntax — which matches the goal of building correct mental models, not memorizing recipes.",
        qualityRating: "excellent",
      },
      reference: {
        title: "The Python Tutorial — An Informal Introduction to Python",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/introduction.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The official Python tutorial, written and maintained by the Python Software Foundation. Chapter 3 (An Informal Introduction to Python) covers numbers, strings, and basic operations with authoritative precision. There is no more reliable source for how Python actually behaves.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "python-environment-setup",
        title: "Python environment setup",
        description:
          "Install Python 3.11+, create a virtual environment with venv, install packages with pip, and configure VS Code with the Python extension — the professional development baseline.",
      },
      {
        key: "variables-and-types",
        title: "Variables and types",
        description:
          "Understand int, float, str, bool, and None — and what dynamic typing means: the variable has no type, the value does. Use type() to verify.",
      },
      {
        key: "string-operations",
        title: "String operations",
        description:
          "Learn f-strings, .upper(), .lower(), .strip(), .split(), .replace(), and string concatenation — the operations used constantly in data processing and API interaction.",
      },
      {
        key: "operators",
        title: "Operators",
        description:
          "Understand arithmetic, comparison, logical (and, or, not), and assignment operators — and how Python evaluates compound expressions.",
      },
      {
        key: "input-output",
        title: "Input and output",
        description:
          "Use print() with format specifiers, input() for user interaction, and understand the difference between printing a value and returning it.",
      },
      {
        key: "python-repl",
        title: "The Python REPL",
        description:
          "Use the interactive interpreter for fast experimentation — the habit every productive Python engineer has for testing assumptions before writing production code.",
      },
    ],

    miniChallenges: [
      {
        key: "string-transformer",
        title: "String Transformer",
        description:
          "Write a Python function called clean_text that takes a raw string of messy text — mixed case, extra whitespace, special characters — and returns it normalized: stripped of leading and trailing whitespace, lowercased, with punctuation removed, and words separated by a single space. No external libraries. Test it against at least five different input cases including empty strings and strings that are only whitespace.",
        hint:
          "str.strip() handles whitespace at the edges. str.split() without arguments splits on any whitespace and drops empty strings between multiple spaces.",
      },
      {
        key: "type-detective",
        title: "Type Detective",
        description:
          "Write a program that accepts user input as a string and reports: what Python type the raw input is, whether it can be converted to int, whether it can be converted to float, whether it can be converted to bool, and what the converted value is in each successful case. Handle all conversion failures with specific error messages. Test it with: an integer, a float, a word, an empty string, and '0'.",
        hint:
          "All input() calls return strings. Wrap each conversion attempt in a try/except. '0' converts to a valid int but evaluates as False — make sure your output shows both.",
      },
    ],

    completionCriteria: [
      "Python 3.11+ installed, virtual environment created and activated, VS Code configured",
      "All six tasks practiced in both the REPL and saved .py files",
      "Both challenges written, tested, and working with documented test cases",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What does it mean that Python is dynamically typed, and what is the specific class of bugs this design creates that a statically typed language would catch at compile time?",
      application:
        "You receive data from an API response where a field that should be an integer arrives as the string '42'. Walk me through exactly what happens if you try to perform arithmetic on it without converting it first, and how you write defensive code around this.",
      architecture:
        "Why do Python projects use virtual environments, and what specifically breaks if a team of three developers works on the same project without them?",
      defense:
        "A teammate argues Python is too slow for production AI systems and you should use Go for the backend. How do you evaluate this claim, and under what specific conditions do you agree?",
      connection:
        "You learned JavaScript in Stage 4 — another dynamically typed language. Where does that background help you learn Python faster, and where does it create false assumptions that will produce bugs?",
    },

    reflectionPrompts: [
      "Python treats everything as an object — integers, strings, functions, classes. Before this starts feeling abstract: open the REPL and run type(42), type(print), type(type). What do you notice?",
      "Virtual environments solve a dependency isolation problem. Describe in your own words what goes wrong in a shared Python environment when two projects need different versions of the same library.",
      "You will write Python every day for the next five months. What habits from Stage 4 JavaScript will transfer directly, and what habits will you need to unlearn?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 8: Control Flow
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-control-flow",
    number: 8,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: false,

    title: "Control Flow",
    description:
      "Learn conditional logic, for and while loops, list comprehensions, Python's truthiness rules, and structural pattern matching with match/case.",
    whyItMatters:
      "Every AI system makes decisions: retry this request, skip this chunk, route to this agent, handle this error. Fluency with control flow is what separates a developer who can write a working prototype from one who can write a system that behaves correctly under every real-world condition.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "The Python Tutorial — More Control Flow Tools",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/controlflow.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "The Python Software Foundation's own tutorial chapter on control flow is unusually readable and precise. Unlike most official documentation, this chapter is written as a progressive tutorial, not a reference. It covers if, for, range, pass, break, continue, and functions with the exact semantics Python engineers need to know. Primary source with no intermediary interpretation.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Python Tutorial for Beginners — Conditionals and Loops (episodes 7–10)",
        author: "Corey Schafer",
        url: "https://www.youtube.com/@coreyms",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "2 hours",
        selectionReason:
          "When the official documentation is dense, Corey Schafer's explanations provide the visual and verbal clarity needed to internalize the concepts. Use as a supplement after working through the official tutorial when any concept remains unclear.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "conditionals",
        title: "Conditionals",
        description:
          "Write if, elif, and else branches. Understand nested conditions and how Python evaluates compound boolean expressions with short-circuit evaluation.",
      },
      {
        key: "for-loops",
        title: "For loops",
        description:
          "Iterate over lists, strings, and ranges. Use enumerate() to get both index and value. Use zip() to iterate over two iterables simultaneously.",
      },
      {
        key: "while-loops",
        title: "While loops",
        description:
          "Write condition-based loops with break and continue. Understand when a while loop is the right choice versus a for loop — and what makes an infinite loop.",
      },
      {
        key: "list-comprehensions",
        title: "List comprehensions",
        description:
          "Write [expression for item in iterable if condition] comprehensions. Understand when they improve readability versus when they obscure it.",
      },
      {
        key: "python-truthiness",
        title: "Python truthiness",
        description:
          "Know what Python considers falsy: 0, 0.0, '', [], {}, set(), None. Understand why this matters when checking API responses, database results, and function return values.",
      },
      {
        key: "match-case",
        title: "Structural pattern matching",
        description:
          "Use Python 3.10+ match/case for structural matching. Understand when it is clearer than if/elif chains — and when it is overkill.",
      },
    ],

    miniChallenges: [
      {
        key: "fizzbuzz-defended",
        title: "FizzBuzz, Defended",
        description:
          "Write FizzBuzz three ways: using a traditional if/elif/else block, using a list comprehension, and using match/case. Then write a paragraph explaining which version you would use in a production codebase, which you would use in a quick script, and why the answer is different for each context. The explanation is the deliverable — not just the working code.",
        hint:
          "FizzBuzz is not the point. The judgment about which approach fits which context is the point. Be specific about what makes each version appropriate or inappropriate.",
      },
      {
        key: "input-validator",
        title: "Input Validator",
        description:
          "Write a function called validate_registration(email, password, age) that validates user input for a registration form. Rules: email must contain '@' and at least one '.' after the '@'; password must be 8 or more characters and contain at least one digit; age must be an integer between 18 and 120 inclusive. The function must return a list of specific error messages — one per failing rule — or an empty list if everything passes. Test with inputs that trigger each error independently and in combination.",
        hint:
          "Return a list, not a boolean. Multiple rules can fail simultaneously and all failures should be reported. Test the edge cases: age of exactly 18, password of exactly 8 characters, email with no '.' after '@'.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working code examples",
      "Both challenges completed with the explanation component of FizzBuzz written",
      "Can explain Python's truthiness rules and their production implications without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What does Python consider falsy, and why does this matter specifically when you are checking API responses, database query results, and configuration values in a production system?",
      application:
        "You are processing a batch of 5,000 documents through the Anthropic API. Some calls succeed (200), some fail with client errors (4xx), some hit the rate limit (429), and some fail with server errors (500). Write the control flow logic as pseudocode and explain every branching decision.",
      architecture:
        "When is a while loop the correct choice over a for loop in a production AI pipeline? Give a specific scenario where using a for loop would be architecturally wrong.",
      defense:
        "A teammate insists that list comprehensions are always more Pythonic than for loops and refuses to use for loops in any code they write. When do you agree, and when do you push back?",
      connection:
        "Python's truthiness system means that if response.data: fails silently when data is an empty list, zero, or None. How will this behavior affect how you write validation logic when handling AI API responses throughout the rest of this curriculum?",
    },

    reflectionPrompts: [
      "You wrote FizzBuzz three ways and explained which you would use in production. Would your answer change six months from now when you are maintaining code you wrote today? Why?",
      "Python's truthiness system is a convenience and a trap simultaneously. Describe a specific bug it could silently introduce in an AI pipeline that processes documents.",
      "Short-circuit evaluation means Python stops evaluating a boolean expression as soon as the result is determined. How could you use this to write more efficient conditional logic in a loop that processes thousands of items?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 9: Functions & Modules
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-functions-modules",
    number: 9,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: false,

    title: "Functions & Modules",
    description:
      "Learn function definition, *args and **kwargs, Python's LEGB scope rules, lambda functions, module imports, and the Python standard library.",
    whyItMatters:
      "Functions are the unit of reusable logic. Modules are the unit of reusable code. Every professional Python codebase — every LangChain chain, every FastAPI route, every AI pipeline — is organized around functions and modules. A developer who writes scripts instead of functions cannot maintain, test, or extend their code.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "Python Tutorial for Beginners — Functions and Modules (episodes 11–14)",
        author: "Corey Schafer",
        url: "https://www.youtube.com/@coreyms",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "2.5–3 hours",
        selectionReason:
          "Corey Schafer's function and module episodes are the specific content the user approved as the curriculum standard. His treatment of *args, **kwargs, and scope is precise without being academic. These episodes are widely used in bootcamp and self-taught engineer communities as the authoritative video explanation.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Python Standard Library documentation",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/library/",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The complete authoritative reference for every module in Python's standard library. Working engineers consult this when they need the exact behavior, signature, or edge cases of os, pathlib, json, datetime, logging, and every other standard module. There is no substitute.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Python Scope & the LEGB Rule: Resolving Names in Your Code",
        author: "Real Python",
        url: "https://realpython.com/python-scope-legb-rule/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Real Python's LEGB article is the most thorough treatment of Python scope available outside the CPython source code. Real Python is a peer-reviewed platform whose authors are working Python professionals. This specific article resolves the scope confusion that causes persistent bugs in production Python code.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "function-definition",
        title: "Function definition",
        description:
          "Write functions with positional parameters, default arguments, and return values. Understand what happens when a function has no explicit return — and why None is returned.",
      },
      {
        key: "args-kwargs",
        title: "*args and **kwargs",
        description:
          "Accept variable numbers of positional arguments with *args and keyword arguments with **kwargs. Understand when each is appropriate and the difference between defining and calling with unpacking.",
      },
      {
        key: "python-scope-legb",
        title: "Scope — LEGB rule",
        description:
          "Understand Local, Enclosing, Global, and Built-in scope resolution order. Know why global variables are a code smell in production Python and how closures work.",
      },
      {
        key: "lambda-functions",
        title: "Lambda functions",
        description:
          "Write single-expression anonymous functions with lambda. Know when a lambda is appropriate (short key functions for sort/filter) and when a named function is required.",
      },
      {
        key: "modules-imports",
        title: "Modules and imports",
        description:
          "Import modules with import, from/import, and as aliases. Understand what __name__ == '__main__' does and why every Python script should use it.",
      },
      {
        key: "standard-library",
        title: "Python standard library essentials",
        description:
          "Use os, sys, pathlib, datetime, json, and re with at least one real example each. These six modules cover 80% of standard library usage in AI engineering scripts.",
      },
    ],

    miniChallenges: [
      {
        key: "refactor-to-functions",
        title: "Refactor to Functions",
        description:
          "Take the validate_registration function from Stage 8 and refactor it completely: one function per validation rule (validate_email, validate_password, validate_age), one orchestrating function that calls all three and collects errors, a main() function that prompts the user and prints results, and an if __name__ == '__main__' guard. Then write a paragraph documenting what changed architecturally and why the refactored version is easier to test, maintain, and extend.",
        hint:
          "Each validator should accept one argument and return either None (valid) or a specific error string. The orchestrator calls all three and returns the combined list of errors.",
      },
      {
        key: "standard-library-sprint",
        title: "Standard Library Sprint",
        description:
          "Using only Python's standard library — no pip installs: read a JSON file from disk and parse it, parse a date string in the format 'YYYY-MM-DD' into a datetime object, recursively list all .py files in a directory, and write the results (filename and last modified date for each .py file) to a new JSON file. All in one script with a clean main() function.",
        hint:
          "pathlib.Path.rglob('*.py') handles recursive file discovery. os.path.getmtime() or Path.stat().st_mtime returns modification timestamps. datetime.fromtimestamp() converts a Unix timestamp to a readable datetime.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working code examples saved locally",
      "Both challenges completed with the architectural explanation written for the refactoring challenge",
      "Can explain LEGB scope resolution and the mutable default argument trap without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Explain Python's LEGB scope rules. What is the specific problem that global variables create in a production codebase, and why does Python require you to explicitly declare them with the global keyword rather than simply allowing writes to outer scope?",
      application:
        "You are designing a Python function that calls the Anthropic API to summarize a document. What parameters does it accept, what does it return on success, what does it return or raise on failure, and how does its signature communicate its contract to the next engineer who reads it?",
      architecture:
        "When do you split Python code across multiple modules versus keeping it in one file? What signals — specific, not vague — tell you a Python file has grown too large?",
      defense:
        "A teammate has written a 300-line Python script with all logic in the global scope and no functions. It works. They ask why they should refactor it. Make the engineering case — not the aesthetic case.",
      connection:
        "Python has a mutable default argument trap that JavaScript does not have: def process(items=[]) accumulates state across calls. Why does this trap not exist in JavaScript, and what Python-specific behavior causes it?",
    },

    reflectionPrompts: [
      "You refactored a flat function into a composed set of single-responsibility functions. What specifically became easier, and what — if anything — became harder?",
      "The __name__ == '__main__' guard exists because every Python file is also a module that can be imported. What breaks if you omit it and someone imports your script as a module?",
      "Lambda functions are syntactically concise but cognitively expensive when overused. Write one example where a lambda clearly improves readability and one where a named function is strictly better. Explain each choice.",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 10: Data Structures
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-data-structures",
    number: 10,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: false,

    title: "Data Structures",
    description:
      "Learn lists, tuples, dictionaries, sets, their performance characteristics, and how to choose the right structure for the problem.",
    whyItMatters:
      "AI systems handle data constantly. API responses arrive as nested JSON objects. Embedding results are lists of floats. Chat histories are lists of dictionaries. Choosing the right data structure — and understanding why — is what separates engineers who think about their code from engineers who just make it work.",

    estimatedDays: 4,

    resources: {
      primary: {
        title: "The Python Tutorial — Data Structures",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/datastructures.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1 hour",
        selectionReason:
          "Python's official tutorial chapter on data structures is authoritative and remarkably clear. It covers lists, tuples, sets, and dictionaries with the exact semantics the language specification defines. For data structures specifically, going to the primary source avoids the imprecision that accumulates through intermediary explanations.",
        qualityRating: "definitive",
      },
      reference: {
        title: "Python Documentation — Built-in Types",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/library/stdtypes.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "Reference as needed",
        selectionReason:
          "The complete reference for every method on every built-in type — lists, dicts, sets, tuples, strings. When you need to know the exact signature of dict.setdefault() or the difference between list.extend() and list.append(), this is the authoritative source.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "TimeComplexity — Python Wiki",
        author: "Python Software Foundation",
        url: "https://wiki.python.org/moin/TimeComplexity",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "30 minutes",
        selectionReason:
          "The official Python wiki page documenting the time complexity of every operation on every built-in data structure. This is the table working engineers reference when performance matters. Understanding that dict lookup is O(1) and list lookup is O(n) explains the architectural decisions in the interview blueprint for this stage.",
        qualityRating: "definitive",
      },
    },

    tasks: [
      {
        key: "lists",
        title: "Lists",
        description:
          "Create, index, slice, and mutate lists. Use .append(), .extend(), .insert(), .remove(), .pop(), and .sort(). Understand that list lookup is O(n) and why.",
      },
      {
        key: "tuples",
        title: "Tuples",
        description:
          "Understand tuple immutability, when tuples are preferable to lists, and tuple unpacking — the pattern used constantly in Python's enumerate(), items(), and function return values.",
      },
      {
        key: "dictionaries",
        title: "Dictionaries",
        description:
          "Create, access, and modify dicts. Use .get() with defaults, .keys(), .values(), .items(), and .setdefault(). Understand that dict lookup is O(1) and why hash tables make this possible.",
      },
      {
        key: "sets",
        title: "Sets",
        description:
          "Understand set uniqueness, union, intersection, difference, and O(1) membership testing. Know when a set outperforms a list for the same task.",
      },
      {
        key: "choosing-data-structures",
        title: "Choosing the right structure",
        description:
          "Apply the decision: list for ordered sequences with duplicates, dict for key-value pairs, set for uniqueness and membership testing, tuple for immutable ordered data. Know the O(1) vs O(n) implications.",
      },
      {
        key: "nested-structures",
        title: "Nested structures",
        description:
          "Work with lists of dicts, dicts of lists, and deeply nested structures — the exact format that JSON API responses and AI chat histories use.",
      },
    ],

    miniChallenges: [
      {
        key: "chat-history-modeler",
        title: "Chat History Modeler",
        description:
          "Design and implement a Python data structure to represent a multi-turn AI conversation. Each message must store: role (one of 'user', 'assistant', 'system'), content, timestamp, and token count. Implement four functions: add_message that appends a new message, get_last_n that returns the most recent N messages, total_tokens that returns the sum of all token counts, and to_anthropic_format that converts the history to the list-of-dicts format the Anthropic API expects. Document each data structure choice with a one-sentence justification.",
        hint:
          "The Anthropic Messages API expects messages as a list of dicts with 'role' and 'content' keys. Your to_anthropic_format function strips the timestamp and token count since the API does not accept them.",
      },
      {
        key: "set-vs-list-benchmark",
        title: "Set vs List Benchmark",
        description:
          "Write a script that generates 50,000 random strings of 8 characters each. Store them in both a list and a set. Then measure the time to perform 10,000 membership checks (item in container) against each. Print the results in milliseconds. Write two sentences explaining why the results differ, referencing the underlying data structure mechanism.",
        hint:
          "Use the time module: time.time() before and after. Generate the test lookup values separately so both containers are checked with identical queries. The difference should be dramatic — orders of magnitude, not percentages.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working examples demonstrating each operation",
      "Both challenges completed with the written justification in the Chat History Modeler",
      "Can explain O(1) dict lookup and O(n) list lookup from first principles without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "Why is dictionary lookup O(1) while list lookup is O(n)? Describe the underlying mechanism — not just the outcome.",
      application:
        "You are building a document deduplication step for a RAG pipeline that processes 100,000 document chunks. For each chunk, you need to check whether it has been processed before. What data structure do you use, how do you generate a key for each chunk, and what is the performance difference compared to a list?",
      architecture:
        "Design a Python data structure to represent a multi-turn AI conversation. You need to: retrieve the last N messages efficiently, calculate total token usage, and serialize to the Anthropic API format. Walk me through your type choices and justify each one.",
      defense:
        "A teammate stores 500,000 processed document IDs in a list and calls list.count() to check for duplicates before each new document is processed. They say it completes in a few seconds so the performance is acceptable. How do you respond, and what do you change?",
      connection:
        "In Stage 4, JavaScript objects and Python dicts look similar — both are key-value pairs. Where does this mapping hold precisely, and where does it break down in terms of ordering, mutability, key types, and hashing behavior?",
    },

    reflectionPrompts: [
      "You built a chat history modeler. The Anthropic API accepts messages as a list of dicts. Your implementation has more fields. This gap — between what your system stores and what external systems accept — will appear constantly in AI engineering. What is the general pattern for handling it?",
      "You measured the difference between set and list membership checks. At what scale does this performance difference become a real problem in production? Estimate the threshold in number of items.",
      "Python dicts preserve insertion order as of Python 3.7. Before that guarantee existed, what class of bugs could you get from code that depended on dict ordering? Would you have noticed in testing?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 11: File I/O & Error Handling
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-file-io-error-handling",
    number: 11,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: false,

    title: "File I/O & Error Handling",
    description:
      "Learn to read and write files safely using context managers, parse JSON, handle exceptions with precision, create custom exceptions, and use the logging module.",
    whyItMatters:
      "Production systems fail. APIs return errors. Files do not exist. Network connections drop. An engineer who does not write defensive code is writing code that breaks in production silently — often at 3am, processing a batch job that cannot be restarted from scratch. This stage is about writing code that handles reality.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Reading and Writing Files in Python (Guide)",
        author: "Real Python",
        url: "https://realpython.com/read-write-files-python/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Real Python is a peer-reviewed platform whose authors are working Python professionals. This specific guide is one of the most comprehensive treatments of Python file I/O available — covering context managers, encoding, binary files, and the pathlib approach. It is the resource working Python engineers recommend when onboarding new teammates on file handling.",
        qualityRating: "excellent",
      },
      reference: {
        title: "Python Tutorial — Errors and Exceptions (Chapter 8)",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/errors.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "45 minutes",
        selectionReason:
          "The authoritative explanation of Python's exception hierarchy, try/except/else/finally semantics, and how to raise and define exceptions. Chapter 8 of the official tutorial is the most precise treatment of Python exception handling available.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Python Logging: A Stroll Through the Source Code",
        author: "Real Python",
        url: "https://realpython.com/python-logging-source-code/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "1 hour",
        selectionReason:
          "Understanding logging at the source code level — not just the API — produces engineers who use it correctly rather than cargo-culting it. This article explains why the logging module is designed the way it is, which produces lasting understanding rather than copy-paste usage.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "reading-files",
        title: "Reading files",
        description:
          "Open files with open() and context managers (with). Read entire contents, line by line, and specific byte ranges. Understand why context managers guarantee file closure even when exceptions occur.",
      },
      {
        key: "writing-files",
        title: "Writing files",
        description:
          "Write and append to files safely. Understand text versus binary mode, encoding considerations for production systems that handle non-ASCII content, and atomic write patterns.",
      },
      {
        key: "json-files",
        title: "JSON files",
        description:
          "Use json.load() and json.dump() for file I/O, json.loads() and json.dumps() for string conversion. Handle the common case where a JSON file does not exist yet.",
      },
      {
        key: "exception-handling",
        title: "Exception handling",
        description:
          "Write try/except/else/finally blocks. Catch specific exception types. Understand the difference between catching Exception and catching BaseException. Know what the else and finally clauses actually do.",
      },
      {
        key: "custom-exceptions",
        title: "Custom exceptions",
        description:
          "Create exception classes that carry context-specific information. Understand when custom exceptions add value versus when they obscure the original error.",
      },
      {
        key: "logging-module",
        title: "The logging module",
        description:
          "Configure Python logging with levels (DEBUG, INFO, WARNING, ERROR, CRITICAL), handlers, and formatters. Know why print() is insufficient in production and what specific capabilities logging provides.",
      },
    ],

    miniChallenges: [
      {
        key: "resilient-file-processor",
        title: "Resilient File Processor",
        description:
          "Write a Python script that reads a directory of JSON files, parses each one, extracts a specific set of fields, and writes a summary to a new JSON file. The script must handle every realistic failure: directory does not exist, a file is not valid JSON, a file is valid JSON but missing expected fields, the output file cannot be written. Every error must be logged with the filename and a specific message — not just 'an error occurred'. The script must complete successfully even when some individual files fail.",
        hint:
          "Use a try/except block inside the loop for per-file errors so one bad file does not abort the entire batch. Log the error and continue. Track a count of successes and failures and report it at the end.",
      },
      {
        key: "retry-decorator",
        title: "Retry Decorator",
        description:
          "Write a Python decorator called retry(max_attempts=3, delay_seconds=1.0) that wraps any function and automatically retries it if it raises an exception. The decorator must wait delay_seconds between attempts, stop after max_attempts, and raise the final exception if all attempts fail. Test it against a function that succeeds on the third call by tracking call count in a closure. Document what this decorator is doing that the Anthropic SDK does internally for rate limit handling.",
        hint:
          "The decorator returns a wrapper function that runs in a loop with range(max_attempts). Use time.sleep(delay_seconds) between attempts. Store the last exception and re-raise it after the loop exhausts.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with working code handling real edge cases",
      "Both challenges completed — including the architectural note in the Retry Decorator",
      "Can explain try/except/else/finally execution order without notes",
      "AI interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is the difference between catching a specific exception like FileNotFoundError versus catching the base Exception class? What specific class of bugs does catching Exception hide, and why is catching BaseException almost always wrong?",
      application:
        "You have a Python script that processes 2,000 PDF files, extracts text, and sends each to the Anthropic API for summarization. The script runs for 4 hours. On file 1,847, the API throws a RateLimitError. Walk me through how you write this script so it handles the rate limit, does not lose the work already done, and can be safely restarted without reprocessing completed files.",
      architecture:
        "Why do production Python applications use the logging module instead of print statements? Name three specific things logging provides that print cannot do.",
      defense:
        "A teammate wraps every function body in try/except Exception: pass because it prevents crashes. Explain why this is worse than no error handling at all, using a specific scenario where it produces a dangerous silent failure.",
      connection:
        "The retry decorator you built in this stage is the same pattern the Anthropic Python SDK uses internally when it handles rate limits. How does building it from scratch change your understanding of what a library is doing on your behalf — and why does that matter when the library behaves unexpectedly?",
    },

    reflectionPrompts: [
      "You wrote a resilient file processor that continues when individual files fail. This is the pattern for every batch AI job you will write. What additional information would you want logged that your current implementation does not capture?",
      "The retry decorator you built introduces latency: three failures at 1-second delay means the caller waits at least 2 seconds before seeing an error. How do you expose this tradeoff to the caller of the decorated function?",
      "Python's context manager (with statement) guarantees cleanup even when exceptions occur. What would you have to write manually — and what could go wrong — if context managers did not exist?",
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Stage 12: Object-Oriented Python
  // ───────────────────────────────────────────────────────────────────────────
  {
    key: "python-oop",
    number: 12,
    chapter: 2,
    chapterTitle: "Python",
    isChapterEnd: true,

    title: "Object-Oriented Python",
    description:
      "Learn classes, instance methods, class methods, static methods, properties, inheritance, dunder methods, and dataclasses — with the goal of reading and extending class-based libraries confidently.",
    whyItMatters:
      "LangChain, FastAPI, Pydantic, and virtually every Python AI library is built around classes. Travis does not need to be an OOP purist. He needs to be fluent enough to subclass a LangChain BaseTool, extend a Pydantic model, and read library source code without friction. OOP fluency is the prerequisite for working with professional Python libraries.",

    estimatedDays: 5,

    resources: {
      primary: {
        title: "Object-Oriented Programming in Python (full series)",
        author: "Corey Schafer",
        url: "https://www.youtube.com/@coreyms",
        type: "video",
        tier: "tier-2-educator",
        estimatedDuration: "4–5 hours",
        selectionReason:
          "Corey Schafer's OOP series is the most referenced Python OOP video content in the engineering community. It is used in computer science programs as supplementary material and is consistently recommended by working Python engineers when onboarding new developers. The series covers dunder methods and class structure with the same depth a university course would provide.",
        qualityRating: "excellent",
      },
      reference: {
        title: "The Python Tutorial — Classes (Chapter 9)",
        author: "Python Software Foundation",
        url: "https://docs.python.org/3/tutorial/classes.html",
        type: "documentation",
        tier: "tier-1-official",
        estimatedDuration: "1.5 hours",
        selectionReason:
          "Chapter 9 of the official Python tutorial is the authoritative explanation of Python's class system — including the precise semantics of inheritance, method resolution order, and the difference between class and instance attributes. When Corey Schafer's explanation raises a question about exact behavior, this is where to verify.",
        qualityRating: "definitive",
      },
      deepDive: {
        title: "Dataclasses in Python 3.7+",
        author: "Real Python",
        url: "https://realpython.com/python-data-classes/",
        type: "documentation",
        tier: "tier-2-educator",
        estimatedDuration: "1 hour",
        selectionReason:
          "Dataclasses are the idiomatic Python pattern for data-carrying objects — the pattern Pydantic builds on and the pattern used throughout modern Python AI libraries. Real Python's treatment explains when to use dataclasses versus regular classes versus Pydantic, which is an architectural judgment this stage requires.",
        qualityRating: "excellent",
      },
    },

    tasks: [
      {
        key: "classes-instances",
        title: "Classes and instances",
        description:
          "Write class definitions with __init__, instance attributes, and self. Understand the difference between class attributes (shared) and instance attributes (per-object).",
      },
      {
        key: "methods",
        title: "Instance, class, and static methods",
        description:
          "Distinguish instance methods (operate on self), class methods (@classmethod, operate on cls), and static methods (@staticmethod, no implicit argument). Know when each is correct.",
      },
      {
        key: "properties",
        title: "Properties",
        description:
          "Use @property to create computed attributes and setters that validate input. Understand when properties are the right abstraction versus direct attribute access.",
      },
      {
        key: "inheritance",
        title: "Inheritance",
        description:
          "Subclass existing classes, call super(), override methods, and use isinstance() for type checking. Understand method resolution order (MRO) in multiple inheritance.",
      },
      {
        key: "dunder-methods",
        title: "Dunder methods",
        description:
          "Implement __str__, __repr__, __len__, __eq__, and __hash__. Understand why __repr__ should always produce a string that could recreate the object, and why __eq__ and __hash__ must be defined together.",
      },
      {
        key: "dataclasses",
        title: "Dataclasses",
        description:
          "Use @dataclass to generate __init__, __repr__, and __eq__ automatically. Understand when a dataclass is more appropriate than a dict, a regular class, or a Pydantic model.",
      },
    ],

    miniChallenges: [
      {
        key: "pydantic-reverse-engineering",
        title: "Pydantic Model Reverse Engineering",
        description:
          "Before installing Pydantic: read the Pydantic documentation for BaseModel and write a paragraph predicting what Python features it uses under the hood — which dunder methods, which class machinery, and how it achieves automatic validation. Then install Pydantic, create a model, and verify your predictions by calling type(), dir(), and vars() on the model class and an instance. Document what you got right, what you got wrong, and what surprised you.",
        hint:
          "Pydantic models use __init_subclass__, __annotations__, and class-level validators. You will not predict everything correctly — the goal is to make a genuine engineering prediction before seeing the implementation.",
      },
      {
        key: "message-class-hierarchy",
        title: "Message Class Hierarchy",
        description:
          "Design and implement a class hierarchy for AI messages. Requirements: a base Message class with content (string) and timestamp (datetime) attributes; three subclasses — UserMessage, AssistantMessage, SystemMessage — each with a role property that returns the appropriate string. Every class must implement __repr__ that produces a string you could use to recreate the object, __eq__ that compares by content and role, and to_dict() that returns the Anthropic API format. Use @dataclass where it reduces boilerplate without sacrificing clarity.",
        hint:
          "The role property is an excellent candidate for @property in each subclass — it returns a constant string and requires no storage. __eq__ in the base class can compare type(self) == type(other) first to prevent UserMessage == AssistantMessage even if the content matches.",
      },
    ],

    completionCriteria: [
      "All six tasks practiced with complete, working code examples",
      "Both challenges completed with the written prediction component in the Pydantic challenge",
      "Can implement a class hierarchy from memory including dunder methods",
      "Chapter 2 project submitted with public GitHub link, architecture diagram, workflow diagram, and both ADRs",
      "AI interview passed at 85% or above",
      "Chapter 2 synthesis interview passed at 85% or above",
    ],

    interviewBlueprint: {
      concept:
        "What is the difference between an instance method, a class method, and a static method? Do not define them — give me a specific scenario where using the wrong one would produce a bug or incorrect behavior.",
      application:
        "LangChain requires you to subclass BaseTool and implement specific methods to build a custom tool. Without looking at the documentation, describe what you expect to need to implement based on your understanding of Python inheritance, abstract classes, and the conventions Python libraries use.",
      architecture:
        "You are building a Python system that calls three different AI APIs — Anthropic, OpenAI, and a local Ollama instance. Design a class hierarchy that shares retry logic, error handling, and token counting without duplicating code. What classes do you create and what does each contain?",
      defense:
        "A teammate argues that Python OOP is overengineering for AI scripts and you should use functions exclusively. Under what specific circumstances do you agree, and under what circumstances does the project genuinely require classes?",
      connection:
        "LangChain, FastAPI, and Pydantic — three libraries central to this curriculum — are all heavily class-based. How does fluency with Python's class system, dunder methods, and inheritance change how quickly you can read their source code versus treating them as black boxes?",
    },

    reflectionPrompts: [
      "You predicted how Pydantic works before seeing the implementation. What did this exercise reveal about how much you can infer about a library's internals from its public API?",
      "The message class hierarchy you built mirrors the exact structure the Anthropic API uses. You will implement this in a real context in Stage 20. How does building it as a pure Python exercise now change how you will approach it then?",
      "Python's OOP model is 'duck typing' — if it has the right methods, it is the right type. This is fundamentally different from Java or C++ where types are enforced at compile time. How does this affect how you design interfaces between components in a Python AI system?",
    ],

    chapterProject: {
      title: "CLI Task Manager",
      description:
        "A command-line task management application in Python. This project proves command of all Chapter 2 concepts by requiring correct data structure choices, robust error handling, module organization, and engineering documentation.",
      requirements: [
        "Commands: add a task, list all tasks, mark a task complete, delete a task — all via command-line arguments",
        "Persistence: tasks saved to a JSON file between sessions, file created on first run if it does not exist",
        "Display: tasks shown in a formatted table using only the standard library — no rich, tabulate, or third-party libraries",
        "Error handling: all failure cases handled gracefully — file not found, invalid input, empty task list, corrupted JSON — with specific error messages, never tracebacks shown to the user",
        "--help flag that documents every available command",
        "Structured logging throughout using Python's logging module at appropriate levels",
        "Code organized into modules — not a single-file script. Minimum: a tasks module for data operations and a main entry point",
        "All task operations validated with a custom exception class",
      ],
      requiredArtifacts: {
        architectureDiagram: true,
        workflowDiagram: true,
        minAdrCount: 2,
        additionalNotes: [
          "Architecture diagram must show: CLI entry point, command parser, task manager module, file storage layer, and data flow for each command",
          "Workflow diagram must show the add-task and complete-task workflows including the file read-modify-write cycle",
          "ADR 1: Persistence format — why JSON instead of SQLite, CSV, or pickle. Include what would change the decision.",
          "ADR 2: CLI interface design — why argparse (or the chosen alternative). What does the chosen approach make easy and what does it constrain.",
        ],
      },
    },
  },
];
