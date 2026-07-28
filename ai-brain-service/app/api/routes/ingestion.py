from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.connectors.drive import DriveConnector
from app.core.vector_store import VectorStore
from app.ingestion.pipeline import ingest_drive_file, ingest_drive_folder

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


class FolderIngestRequest(BaseModel):
    folder_id: Optional[str] = Field(
        default=None,
        description="Drive folder ID. Null = list supported files across My Drive.",
    )
    max_files: Optional[int] = Field(
        default=None,
        ge=1,
        description="Optional cap for smoke tests (process only the first N listed files).",
    )


def _vector_store() -> VectorStore:
    settings = get_settings()
    return VectorStore(persist_directory=str(settings.chroma_persist_path))


def _connector() -> DriveConnector:
    return DriveConnector()


@router.post("/drive/file/{file_id}")
def ingest_single_drive_file(file_id: str) -> Dict[str, Any]:
    if not file_id.strip():
        raise HTTPException(status_code=400, detail="file_id is required")
    return ingest_drive_file(
        file_id=file_id,
        connector=_connector(),
        vector_store=_vector_store(),
    )


@router.post("/drive/folder")
def ingest_drive_folder_route(payload: FolderIngestRequest) -> Dict[str, Any]:
    return ingest_drive_folder(
        folder_id=payload.folder_id,
        connector=_connector(),
        vector_store=_vector_store(),
        max_files=payload.max_files,
    )


@router.get("/status")
def ingestion_status() -> Dict[str, Any]:
    settings = get_settings()
    store = _vector_store()
    return store.collection_stats(settings.chroma_collection)


@router.get("/debug/search")
def debug_search(q: str, n_results: int = 5) -> Dict[str, Any]:
    """Temporary semantic-search sanity check for D3 (not the final RAG endpoint)."""
    if not q.strip():
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")

    settings = get_settings()
    store = _vector_store()
    raw = store.query(
        collection_name=settings.chroma_collection,
        query_text=q,
        n_results=n_results,
    )

    ids = (raw.get("ids") or [[]])[0]
    documents = (raw.get("documents") or [[]])[0]
    metadatas = (raw.get("metadatas") or [[]])[0]
    distances = (raw.get("distances") or [[]])[0]

    hits: List[Dict[str, Any]] = []
    for index, doc_id in enumerate(ids):
        text = documents[index] if index < len(documents) else ""
        hits.append(
            {
                "id": doc_id,
                "distance": distances[index] if index < len(distances) else None,
                "metadata": metadatas[index] if index < len(metadatas) else {},
                "preview": (text or "")[:300],
            }
        )

    return {"query": q, "count": len(hits), "hits": hits}
