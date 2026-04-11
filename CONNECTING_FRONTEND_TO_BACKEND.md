# Connecting the Frontend to FastAPI

## Current State

The proxy layer that connects the frontend to the backend is **already configured** in two places:

1. **Dev mode** — `vite.config.js` proxies `/api` requests to `http://localhost:3000`
2. **Production (Docker)** — `nginx.conf` proxies `/api/*` to `http://backend:3000`

No extra "listener" or middleware component is needed. What's missing is the actual code on **both ends** of that proxy.

---

## What Needs to Happen

### 1. Define API Routes in FastAPI (Backend)

Right now `main.py` has no routes. Routes need to be added that start with `/api/` — that's what the Vite proxy and Nginx config look for.

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/api/chat")
async def chat(request: ChatRequest):
    # query MongoDB, call LLM, return recommendations
    return {"reply": "...", "games": [...]}
```

### 2. Make `fetch` Calls from the React Frontend

In `App.jsx`, replace the hardcoded `DEAD_SPACE_REPLY` with an actual API call:

```javascript
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: input }),
});
const data = await response.json();
```

Because of the proxy config, `/api/chat` gets forwarded to FastAPI automatically — no need to hardcode `http://localhost:3000` in frontend code.

### 3. Fill in the Supporting Pieces

| What                              | Where                    | Current Status |
| --------------------------------- | ------------------------ | -------------- |
| FastAPI route(s) under `/api/`    | `backend/app/main.py`   | Missing        |
| Frontend `fetch()` calls          | `frontend/src/App.jsx`  | Missing        |
| MongoDB credentials in `.env`     | `.env`                   | Empty          |
| Database connection logic         | `backend/app/database.py`| Empty          |
| LLM integration                   | `backend/app/llm.py`    | Empty          |

---

## Summary

The proxy infrastructure is in place. To complete the connection:

1. Add `@app.post("/api/chat")` (or similar) routes in FastAPI
2. Call `fetch("/api/chat", ...)` from React instead of using hardcoded data
3. Wire up MongoDB and the `.env` so the backend can actually query data
