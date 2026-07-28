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

## Ingestion (Step D3)

- `POST /ingestion/drive/file/{file_id}`
- `POST /ingestion/drive/folder` with body `{"folder_id": null}` (optional `max_files`)
- `GET /ingestion/status`
- Temporary: `GET /ingestion/debug/search?q=...`