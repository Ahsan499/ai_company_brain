from __future__ import annotations

import logging
from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Query

from app.config import get_settings
from app.connectors.slack import SlackConnector
from app.core.vector_store import VectorStore
from app.ingestion.slack_pipeline import ingest_all_slack_channels, ingest_slack_channel

logger = logging.getLogger(__name__)

router = APIRouter(tags=["slack"])


def _connector() -> SlackConnector:
    return SlackConnector()


def _vector_store() -> VectorStore:
    settings = get_settings()
    return VectorStore(persist_directory=str(settings.chroma_persist_path))


@router.get("/slack/channels")
def slack_list_channels() -> Dict[str, Any]:
    try:
        channels = _connector().list_channels()
        return {"count": len(channels), "channels": channels}
    except Exception as exc:
        logger.exception("Failed to list Slack channels")
        raise HTTPException(status_code=500, detail=f"Slack list failed: {exc}") from exc


@router.get("/slack/channels/{channel_id}/messages")
def slack_channel_messages(
    channel_id: str,
    limit: int = Query(default=50, ge=1, le=200),
) -> Dict[str, Any]:
    try:
        connector = _connector()
        messages = connector.get_channel_messages(channel_id, limit=limit)
        return {"channel_id": channel_id, "count": len(messages), "messages": messages}
    except Exception as exc:
        logger.exception("Failed to fetch Slack messages for %s", channel_id)
        raise HTTPException(status_code=500, detail=f"Slack messages failed: {exc}") from exc


@router.post("/ingestion/slack/channel/{channel_id}")
def ingest_single_slack_channel(channel_id: str) -> Dict[str, Any]:
    if not channel_id.strip():
        raise HTTPException(status_code=400, detail="channel_id is required")
    return ingest_slack_channel(
        channel_id=channel_id,
        connector=_connector(),
        vector_store=_vector_store(),
    )


@router.post("/ingestion/slack/all")
def ingest_all_slack() -> Dict[str, Any]:
    return ingest_all_slack_channels(
        connector=_connector(),
        vector_store=_vector_store(),
    )
