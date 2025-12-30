# Spur – AI Live Chat Agent

A minimal, production-style AI support chat application built as a take-home assignment for **Spur (Founding Full-Stack Engineer)**.

The app simulates a customer support chat widget where an AI agent responds to user queries using a real LLM, with conversation memory and persistence.

---

## ✨ Features

- 💬 Live chat interface (user ↔ AI)
- 🧠 Contextual replies using conversation history
- 🗂 Session-based conversations (`sessionId`)
- 💾 Persistent storage using SQLite
- 🤖 Real LLM integration (OpenAI / Gemini / Groq)
- 🧩 Clean separation of concerns (UI, API, DB, LLM)
- 🛡 Graceful error handling and input validation

---

## 🧱 Tech Stack

### Frontend

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **shadcn/ui**

### Backend

- **Node.js + TypeScript**
- **Express**
- **SQLite** (via `better-sqlite3`)
- **LangChain** (thin wrapper for LLMs only)

### LLM Providers (configurable)

- OpenAI
- Google Gemini
- Groq

---

## 🏗 Architecture Overview

[ Browser UI ]
|
v
[ Next.js API Route ]
/api/chat/message
|
v
[ Express Backend ]
/chat/message
|
├── SQLite (conversations, messages)
└── LLM Provider (OpenAI / Gemini)

---

### Key Design Decisions

- **Stateless LLM, stateful application**  
  All conversation state is managed by the backend and database.  
  The LLM receives context explicitly on every request.

- **Session-based memory**  
  Each chat is associated with a `sessionId` (conversation ID).  
  Conversation history is loaded from the DB and sent to the LLM.

- **Minimal LangChain usage**  
  LangChain is used only as a lightweight model abstraction.  
  No agents, chains, RAG, or LangGraph are used.

- **SQLite for persistence**  
  Chosen for simplicity, zero setup, and fast local evaluation.

---

## 📂 Data Model

### conversations

| column     | type      |
| ---------- | --------- |
| id         | TEXT (PK) |
| created_at | DATETIME  |

### messages

| column          | type                  |
| --------------- | --------------------- |
| id              | TEXT (PK)             |
| conversation_id | TEXT (FK)             |
| role            | `user` \| `assistant` |
| content         | TEXT                  |
| created_at      | DATETIME              |

---

## 🔌 API Contract

### `POST /chat/message`

**Request**

```json
{
	"message": "What is your return policy?",
	"sessionId": "optional"
}
```

**Response**

```json
{
	"reply": "We accept returns within 30 days of delivery...",
	"sessionId": "abc-123"
}
```

### 🧠 System Prompt & Domain Knowledge

The AI agent is grounded using a system prompt that includes fictional store policies:

Worldwide shipping (including USA)
30-day return window
Refunds in 5–7 business days
Support hours: Mon–Fri, 9am–6pm IST

This prompt is injected on every LLM call to ensure consistent behavior.

⚙️ Environment Variables
Backend (.env)
PORT=6001
PROVIDER=openai

OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
GEMINI_MODEL=gemini-2.0-flash-lite

Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=http://localhost:6001

### 🚀 Running Locally

#### 1️⃣ Backend

cd backend
npm install
npm run dev

This will:
Initialize SQLite DB
Create required tables
Start the Express server on port 6001

#### 2️⃣ Frontend

cd frontend
npm install
npm run dev

Visit:
👉 http://localhost:3000

### 🧪 Testing

Backend tested via Postman (/chat/message)
Frontend tested via browser
Context retention verified using the same sessionId

### 🧠 LLM Notes

Provider selected via PROVIDER env variable
Conversation history is capped implicitly by DB query (can be tuned)
Errors from LLM APIs are caught and returned as friendly messages
No structured output is used for chat responses (intentional)

### ⚖️ Trade-offs & Decisions

No RAG: Domain knowledge is static and small; prompt grounding was sufficient.
No streaming: Simplicity and reliability prioritized.
No auth: Explicitly out of scope.
No Redis: SQLite persistence was enough for the assignment.

### 🔮 If I Had More Time…

Add auto-scroll and “agent is typing” indicator
Persist sessionId in localStorage
Add basic rate limiting
Introduce message windowing for long conversations
Optional RAG for dynamic knowledge bases
Token usage monitoring and cost controls
