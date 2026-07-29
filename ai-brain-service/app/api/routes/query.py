from __future__ import annotations

import logging
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.config import get_settings
from app.core.rag import answer_question
from app.core.vector_store import VectorStore

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/query", tags=["query"])


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1)
    n_results: int = Field(default=5, ge=1, le=20)


@router.post("")
@router.post("/")
def query_knowledge(payload: QueryRequest) -> Dict[str, Any]:
    settings = get_settings()
    store = VectorStore(persist_directory=str(settings.chroma_persist_path))

    try:
        return answer_question(
            question=payload.question,
            vector_store=store,
            n_results=payload.n_results,
        )
    except ValueError as exc:
        # Typically missing ANTHROPIC_API_KEY
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("RAG query failed")
        raise HTTPException(status_code=500, detail=f"Query failed: {exc}") from exc
