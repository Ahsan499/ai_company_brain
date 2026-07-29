from __future__ import annotations

import logging
import time
from typing import Any, Dict, List, Tuple

from app.config import get_settings
from app.core.llm import ask_claude_rag
from app.core.vector_store import VectorStore

logger = logging.getLogger(__name__)

NO_DOCS_ANSWER = "I don't have information about that in the connected documents."


def _build_context_and_sources(raw: Dict[str, Any]) -> Tuple[str, List[Dict[str, Any]], List[str]]:
    documents = (raw.get("documents") or [[]])[0]
    metadatas = (raw.get("metadatas") or [[]])[0]

    context_parts: List[str] = []
    sources: List[Dict[str, Any]] = []
    source_names: List[str] = []

    for index, text in enumerate(documents):
        meta = metadatas[index] if index < len(metadatas) and isinstance(metadatas[index], dict) else {}
        file_name = str(meta.get("file_name") or "unknown")
        file_id = str(meta.get("file_id") or "")
        web_view_link = str(meta.get("web_view_link") or "")
        chunk_text = text or ""

        context_parts.append(f"[Source {index + 1}: {file_name}]\n{chunk_text}")
        sources.append(
            {
                "file_name": file_name,
                "file_id": file_id,
                "web_view_link": web_view_link,
                "chunk_preview": chunk_text[:150],
            }
        )
        if file_name not in source_names:
            source_names.append(file_name)

    return "\n\n".join(context_parts).strip(), sources, source_names


def answer_question(
    question: str,
    vector_store: VectorStore,
    n_results: int = 5,
) -> Dict[str, Any]:
    """Retrieve relevant chunks and generate a grounded Claude answer with citations."""
    started = time.perf_counter()
    settings = get_settings()
    cleaned = (question or "").strip()

    if not cleaned:
        return {
            "question": question,
            "answer": "Please provide a non-empty question.",
            "sources": [],
            "chunks_used": 0,
        }

    collection = settings.chroma_collection
    total = vector_store.count(collection)
    if total == 0:
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        logger.info(
            "RAG question=%r chunks_retrieved=0 collection_empty=true elapsed_ms=%s",
            cleaned,
            elapsed_ms,
        )
        return {
            "question": cleaned,
            "answer": "No relevant documents found. The knowledge base is empty — ingest files first.",
            "sources": [],
            "chunks_used": 0,
        }

    raw = vector_store.query(
        collection_name=collection,
        query_text=cleaned,
        n_results=max(1, min(n_results, 20)),
    )
    context, sources, source_names = _build_context_and_sources(raw)
    chunks_used = len(sources)

    if chunks_used == 0 or not context:
        elapsed_ms = int((time.perf_counter() - started) * 1000)
        logger.info(
            "RAG question=%r chunks_retrieved=0 elapsed_ms=%s",
            cleaned,
            elapsed_ms,
        )
        return {
            "question": cleaned,
            "answer": "No relevant documents found for that question.",
            "sources": [],
            "chunks_used": 0,
        }

    answer = ask_claude_rag(
        question=cleaned,
        context=context,
        source_names=source_names,
        max_tokens=1024,
    )

    elapsed_ms = int((time.perf_counter() - started) * 1000)
    logger.info(
        "RAG question=%r chunks_retrieved=%s elapsed_ms=%s sources=%s",
        cleaned,
        chunks_used,
        elapsed_ms,
        source_names,
    )

    return {
        "question": cleaned,
        "answer": answer,
        "sources": sources,
        "chunks_used": chunks_used,
    }
