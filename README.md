

# AI-Driven Car Guide

An intelligent full-stack MVP designed to guide confused car buyers from an initial state of uncertainty to a highly personalized, confident shortlist of vehicles within minutes. By combining a structured, faceted search interface with a stateful LLM conversational agent, the platform addresses both explicit filtering needs and implicit lifestyle requirements.

---

## 🚀 Quick Start (Local Setup)

This project is built using **Vite + React (TypeScript)** on the frontend and leverages **Supabase** for database management and CRUD operations. 

Follow these simple steps to spin up the project locally in under 2 minutes:

### Prerequisites
Ensure you have **Node.js** (v18+ recommended) installed.

### 1. Clone & Install Dependencies
Navigate to the project root directory and install the required packages:

npm install



### 2. Configure Environment Variables

Create a `.env` file in the root directory and add your API keys:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key

```

### 3. Run the Development Server

Launch the application locally with a single command:

```bash
npm run dev

```

The application will be running locally at `http://localhost:5173`.

---

## 🛠️ Tech Stack & Architecture Justification

The core stack was selected to maximize development velocity, ensure rigorous type safety, and eliminate infrastructure boilerplate within the strict time limits:

| Layer | Technology | Why This Specific Pick? |
| --- | --- | --- |
| **Frontend Framework** | `React 19` & `Vite` | Fast build times, HMR (Hot Module Replacement), and seamless rendering performance. |
| **State & Data Fetching** | `Zustand` & `React Query` | **Zustand** provides low-boilerplate client-side state tracking for the chat session, while **React Query** manages efficient caching and server-state synchronization with Supabase. |
| **Styling** | `Tailwind CSS v4` | Accelerated UI prototyping with utility-first styling, skipping custom CSS compilation time. |
| **Backend & DB Layer** | `Supabase` (`@supabase/supabase-js`) | Completely skipped backend boilerplate. Supabase automatically exposes instantaneous CRUD APIs over our PostgreSQL tables, facilitating swift data fetching without manual server setup. |
| **AI Agent Core** | `LangGraph` (`@langchain/langgraph`) | Provides cyclical, stateful graph control flows. This keeps the agent deterministic, stable, and capable of structured tool execution during chat updates. |
| **Inference Engine** | `Groq` (`@langchain/groq`) | Chosen for its sub-second token delivery speed and highly accessible API tier, keeping conversational interactions immediate. |
| **Validation** | `Zod` | Enforces runtime type validation on LLM tool outputs and database extractions, preventing malformed JSON structures from breaking the UI. |

---

## 🧠 Strategic Deliverables & Q&A

### 1. What did you build and why?

I built a dual-pathway car evaluation interface:

* **Faceted Structural Catalog:** Designed for buyers who know their baseline numbers (e.g., specific pricing bounds, seat counts, or fuel choices).
* **Conversational AI Agent:** Built for completely uncertain buyers who cannot map their lifestyle needs to technical automotive jargon.



**Why?** Confused users frequently search using vague intents (e.g., *"Need something safe for a family of 5 for long weekend trips"*). The conversational agent accepts this unstructured natural language, reasons through the user's intent using LangGraph, and accurately extracts structured constraints to query the automotive catalog, guiding the user straight to a confident shortlist.

### 2. What did you deliberately cut?

To respect the 2-to-3-hour development constraint, specific architectural compromises were made to protect the core value journey:

* **Vector Embeddings / Hybrid Search:** The AI agent executes structured parameter filters against the relational catalog instead of executing a full native vector search.
* **Client-Side Orchestration Layout:** The LangGraph execution agent runs directly on the client side using `@langchain/react` rather than being wrapped behind isolated Supabase Edge Functions or an external Node/Python microservice.
* **Real-Time Web Search Extension:** The agent's knowledge graph is securely bound to the provided internal inventory dataset, removing external live searches to ensure sub-second latency.
* **Polished UI/UX Micro-interactions:** Simple, clean design patterns were favored over elaborate animations or pixel-perfect layout tweaks to ensure an end-to-end working pipeline.


### 3. What did you delegate to AI tools vs. do manually?
* **Delegated to AI (Google Gemini):** Generation of initial mock dataset records, boilerplate SQL schema definitions, structural TypeScript type definitions, and basic syntax layouts for the LangGraph node setup.
* **Done Manually:** System architecture design, agent control-flow engineering, prompt optimization, runtime state transitions, local testing, Git version control, Supabase database configuration, Vercel deployment setup, and data synchronization hooks.
* **Where AI helped most:** It saved massive amounts of time on upfront data augmentation, baseline component boilerplate, and table scripting, which allowed me to focus entirely on core architecture design, integration, and smooth end-to-end user workflows.
* **Where AI got in the way:** During extended design conversations, the AI would occasionally hallucinate or completely lose track of the exact package versions installed in `package.json`. It frequently generated deprecated or mismatched import syntax for newer LangChain/LangGraph modules, requiring manual debugging and code corrections to get everything running perfectly.


### 4. If you had another 4 hours, what would you add?

1. **True Hybrid Search Integration:** Enable the `pgvector` extension inside Supabase to run semantic vector similarity lookups blended alongside PostgreSQL Full-Text Keyword Search.
2. **Schema Normalization:** Decompose the flat car inventory table into highly optimized relational structures (e.g., separate lookup tables for `Brands`, `Transmissions`, and `Fuel_Types`).
3. **Edge Microservice Migration:** Extract the AI graph initialization out of the client application layer and securely deploy it within backend Supabase Edge Functions.
4. **Live Web Tools:** Equip the LangGraph agent with a search tool to augment inventory lookups with real-time on-road pricing updates and current user sentiment trends.

---

## 📊 Evaluation Criteria Alignment

* 
**Product Decisions (35%):** Delivered a highly practical dual-interface MVP explicitly targeted at eliminating user confusion.


* 
**Agentic Tool Usage (30%):** Screen recording demonstrates methodical prompt breakdowns, debugging cycles when encountering LLM output variation, and active system validation.


* 
**Code Quality & Architecture (20%):** Enforces separation of concerns using custom state containers via Zustand, clean TypeScript interfaces, and strict schema validation powered by Zod.


* 
**Execution Speed & Shipping Instinct (15%):** Bootstrapped from a blank directory to a fully functional, multi-dependency AI platform with working persistence in a single execution window.



```

```