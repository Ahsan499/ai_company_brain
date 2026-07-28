from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from app.config import get_settings
from app.connectors.drive import SUPPORTED_MIME_TYPES, DriveConnector
from app.core.vector_store import VectorStore
from app.ingestion.chunker import chunk_text

logger = logging.getLogger(__name__)


def _sanitize_metadata(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Chroma metadata values must be str/int/float/bool."""
    clean: Dict[str, Any] = {}
    for key, value in metadata.items():
        if value is None:
            continue
        if isinstance(value, (str, int, float, bool)):
            clean[key] = value
        else:
            clean[key] = str(value)
    return clean


def _get_vector_store() -> VectorStore:
    settings = get_settings()
    return VectorStore(persist_directory=str(settings.chroma_persist_path))


def _collection_name() -> str:
    return get_settings().chroma_collection


def ingest_drive_file(
    file_id: str,
    connector: DriveConnector,
    vector_store: VectorStore,
) -> Dict[str, Any]:
    """Extract, chunk, and upsert one Drive file into Chroma."""
    try:
        meta = connector.get_file_metadata(file_id)
    except Exception as exc:
        logger.exception("Failed to fetch Drive metadata for %s", file_id)
        return {
            "file_id": file_id,
            "file_name": None,
            "chunks_created": 0,
            "status": "error",
            "detail": f"Failed to fetch metadata: {exc}",
        }

    file_name = meta.get("name") or "unknown"
    mime_type = meta.get("mimeType") or ""

    if mime_type not in SUPPORTED_MIME_TYPES:
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": f"Unsupported mime type: {mime_type}",
        }

    try:
        content = connector.get_file_content(file_id=file_id, mime_type=mime_type)
    except Exception as exc:
        logger.exception("Failed to extract content for %s", file_id)
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "error",
            "detail": f"Content extraction failed: {exc}",
        }

    if content is None:
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": f"Content extractor returned None for mime type: {mime_type}",
        }

    if not content.strip():
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "Extracted content was empty",
        }

    base_metadata = {
        "source": "google_drive",
        "file_id": file_id,
        "file_name": file_name,
        "mime_type": mime_type,
        "web_view_link": meta.get("webViewLink") or "",
        "modified_time": meta.get("modifiedTime") or "",
    }

    chunks = chunk_text(content, metadata=base_metadata)
    if not chunks:
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "Chunker produced no chunks",
        }

    try:
        vector_store.add_documents(
            collection_name=_collection_name(),
            documents=[c["text"] for c in chunks],
            metadatas=[_sanitize_metadata(c["metadata"]) for c in chunks],
            ids=[c["id"] for c in chunks],
        )
    except Exception as exc:
        logger.exception("Failed to upsert chunks for %s", file_id)
        return {
            "file_id": file_id,
            "file_name": file_name,
            "chunks_created": 0,
            "status": "error",
            "detail": f"Chroma upsert failed: {exc}",
        }

    return {
        "file_id": file_id,
        "file_name": file_name,
        "chunks_created": len(chunks),
        "status": "success",
        "detail": f"Ingested {len(chunks)} chunk(s) into '{_collection_name()}'",
    }


def ingest_drive_folder(
    folder_id: Optional[str],
    connector: DriveConnector,
    vector_store: VectorStore,
    max_files: Optional[int] = None,
) -> Dict[str, Any]:
    """Ingest all supported Drive files in a folder (or across My Drive if None)."""
    try:
        files = connector.list_files(folder_id=folder_id, page_size=100)
    except Exception as exc:
        logger.exception("Failed to list Drive files for folder_id=%s", folder_id)
        return {
            "total_files": 0,
            "ingested": 0,
            "skipped": 0,
            "errors": 1,
            "details": [
                {
                    "file_id": None,
                    "file_name": None,
                    "chunks_created": 0,
                    "status": "error",
                    "detail": f"list_files failed: {exc}",
                }
            ],
        }

    if max_files is not None and max_files >= 0:
        files = files[:max_files]

    details: List[Dict[str, Any]] = []
    ingested = 0
    skipped = 0
    errors = 0

    for item in files:
        file_id = item.get("id")
        if not file_id:
            skipped += 1
            details.append(
                {
                    "file_id": None,
                    "file_name": item.get("name"),
                    "chunks_created": 0,
                    "status": "skipped",
                    "detail": "Missing file id",
                }
            )
            continue

        result = ingest_drive_file(file_id=file_id, connector=connector, vector_store=vector_store)
        details.append(result)
        status = result.get("status")
        if status == "success":
            ingested += 1
        elif status == "skipped":
            skipped += 1
        else:
            errors += 1

    return {
        "total_files": len(files),
        "ingested": ingested,
        "skipped": skipped,
        "errors": errors,
        "details": details,
    }
