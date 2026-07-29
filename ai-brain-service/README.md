# AI Company Brain - Knowledge Service

Foundation scaffold for a standalone Python microservice that will power knowledge retrieval and RAG workflows.

## Stack

- Python 3.11+ (recommended)
- FastAPI
- ChromaDB (persistent local storage)
- Anthropic SDK

## Setup

```bash
cd ai-brain-service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
uvicorn app.main:app --reload --port 8001
```

Health endpoint:

```bash
curl http://localhost:8001/health
```

Expected response shape:

```json
{
  "status": "ok",
  "chroma_connected": true
}
```

## Query / RAG (Step D4)

```bash
curl -X POST http://127.0.0.1:8001/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What does the workload report say?","n_results":5}'
```

Requires `ANTHROPIC_API_KEY` in `.env`.
