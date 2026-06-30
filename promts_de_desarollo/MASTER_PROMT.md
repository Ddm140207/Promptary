# 🧠 MASTER PROMPT — Promptary Web App (Full Stack Frontend + Firebase Static Hosting)

## ROLE

You are a senior front-end engineer and product designer.
You are building a production-ready MVP of a platform called **Promptary**.

You must generate a fully functional web application using:

* HTML5
* CSS3 (modern UI, dark mode first)
* Vanilla JavaScript (no frameworks)
* Firebase (Firestore optional + Firebase Hosting for deployment)

The result must be clean, scalable, and visually close to a modern AI SaaS product.

---

# 🚀 PRODUCT CONTEXT

Build **Promptary**, an open-source prompt knowledge library for data scientists and AI developers.

It works like a “GitHub for prompts”, where users can:

* Browse prompts
* Search prompts
* View prompt details
* Copy prompts
* Save prompts locally
* Create new prompts
* Simulate “forking” prompts (improving them)
* Explore by categories

No backend server is required initially. Use:

* LocalStorage for persistence (MVP)
* Firebase optional integration for hosting + future scaling

---

# 🎯 CORE FEATURES (MUST IMPLEMENT)

## 1. Landing / Home (Dashboard)

Create a modern AI-style dashboard with:

### Sections:

* Trending Prompts (mock data)
* Categories grid
* Search bar (global search)
* Recent prompts

### Trending Prompt Card UI must include:

* Title
* Category
* Tags
* Usage count
* Buttons:

  * View
  * Copy
  * Save

---

## 2. Categories System

Include fixed categories:

* Exploratory Data Analysis (EDA)
* Data Cleaning
* Machine Learning
* Data Visualization
* SQL & Databases
* Python Utilities
* AI Workflows
* Debugging

Each category filters prompts dynamically.

---

## 3. Prompt Detail View (Modal or Page)

When a user clicks a prompt:

Show:

### Creator section:

* Name
* Role
* LinkedIn (placeholder link)
* GitHub (placeholder link)

### Prompt content:

* Full prompt in code-style box

### Actions:

* Copy prompt to clipboard
* Save prompt (LocalStorage)
* Fork prompt (creates editable copy)

---

## 4. Create Prompt Page

Form fields:

### Creator Info:

* Name
* Role
* LinkedIn URL
* GitHub URL

### Prompt Info:

* Title
* Category (dropdown)
* Description
* Prompt content (textarea)
* Tags (comma separated)

### Button:

* “Publish Prompt”

On submit:

* Save to LocalStorage
* Redirect to dashboard

---

## 5. Search System

Implement live search that filters:

* Title
* Tags
* Category
* Creator name

Must update results instantly.

---

## 6. Save System

Use LocalStorage:

* Save prompts locally
* Allow unsave
* Saved prompts section

---

## 7. Fork System (Important)

When user clicks “Fork”:

* Duplicate prompt
* Allow editing
* Save as new prompt

---

# 🎨 UI / UX DESIGN REQUIREMENTS

## Visual Style:

* Dark mode default
* Futuristic AI aesthetic
* Minimal UI
* Glassmorphism cards (subtle)
* Soft shadows
* Blue / violet accent gradient

## Inspiration:

* Linear
* Notion
* Vercel
* GitHub
* OpenAI dashboard UI

## Layout Rules:

* Grid-based design
* Responsive (mobile-first)
* Clean spacing
* Large typography for titles
* Subtle hover animations

---

# 🧱 TECHNICAL REQUIREMENTS

## HTML

* Semantic structure
* Modular sections:

  * header
  * sidebar (optional)
  * main content area

## CSS

* Use variables for theme:

  * background
  * primary color
  * accent color
* Use flexbox + grid
* Smooth transitions (0.2–0.3s)

## JavaScript

Must include:

* renderPrompts()
* filterPrompts()
* searchPrompts()
* savePrompt()
* unsavePrompt()
* copyToClipboard()
* createPrompt()
* forkPrompt()

Data structure example:

```js
{
  id: "prompt_1",
  title: "Advanced Data Cleaning Pipeline",
  category: "Data Cleaning",
  description: "...",
  prompt: "...",
  tags: ["python", "pandas"],
  author: {
    name: "Diego",
    role: "Data Scientist",
    github: "",
    linkedin: ""
  },
  usageCount: 1200
}
```

---

# 🌐 FIREBASE (OPTIONAL INTEGRATION)

Prepare code structure so Firebase can be added later:

* firebaseConfig placeholder
* firestore-ready architecture
* hosting compatible build

BUT MVP MUST WORK WITHOUT FIREBASE.

---

# 📦 PROJECT STRUCTURE OUTPUT

Generate code as:

```
/index.html
/styles.css
/app.js
/firebase.js (optional placeholder)
```

---

# ⚡ BEHAVIOR RULES

* Do NOT use frameworks (React, Vue, etc.)
* Do NOT over-engineer backend
* Focus on clean UI + working functionality
* Keep code readable and production-like
* Prioritize UX over complexity

---

# 🧠 FINAL GOAL

Build a working MVP of:

> Promptary — The Library of AI prompts for Data Science

It must feel like a real startup product, not a demo.

