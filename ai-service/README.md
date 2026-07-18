# AI Service

Python + FastAPI multi-agent service: profile ingestion, ideation, platform-specific content generation, conversational chat, and image understanding — grounded via RAG over a per-user FAISS vector store, embedded with OpenAI.

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Structure

```
app/
  main.py         FastAPI app + router registration
  config.py       Settings (env-driven)
  security.py     Internal API key check (called by the Node backend only)
  models/         Pydantic request/response schemas
  services/
    embeddings.py   OpenAI embedding calls
    vector_store.py FAISS index management (per-user, on-disk) + RAG retrieval
    llm.py          Provider-agnostic generation call (Anthropic default, OpenAI alt)
  agents/
    profile_agent.py    Indexes resume/bio/notes/image captions into FAISS
    ideation_agent.py   RAG-grounded topic suggestions
    content_agent.py    RAG-grounded platform-specific post generation
    chat_agent.py        RAG-grounded conversational replies
    vision_agent.py      Image description (OpenAI vision)
  routes/
    knowledge.py    POST /knowledge/index
    agents.py       POST /agents/ideation/suggest, /agents/content/generate, /agents/chat, /agents/vision/describe
```

All routes require the `X-Internal-Api-Key` header (matches `INTERNAL_API_KEY`) — this service is only ever called by the backend, never directly by the mobile app.
