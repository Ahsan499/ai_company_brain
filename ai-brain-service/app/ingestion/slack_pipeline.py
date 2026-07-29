from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.config import get_settings
from app.connectors.slack import SlackConnector
from app.core.vector_store import VectorStore
from app.ingestion.chunker import chunk_text

logger = logging.getLogger(__name__)


def _sanitize_metadata(metadata: Dict[str, Any]) -> Dict[str, Any]:
    clean: Dict[str, Any] = {}
    for key, value in metadata.items():
        if value is None:
            continue
        if isinstance(value, (str, int, float, bool)):
            clean[key] = value
        else:
            clean[key] = str(value)
    return clean


def _collection_name() -> str:
    return get_settings().chroma_collection


def ingest_slack_channel(
    channel_id: str,
    connector: SlackConnector,
    vector_store: VectorStore,
) -> Dict[str, Any]:
    channels = connector.list_channels()
    channel_info = next((c for c in channels if c["id"] == channel_id), None)
    channel_name = channel_info["name"] if channel_info else channel_id

    if channel_info and not channel_info.get("is_member"):
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "Bot is not a member of this channel. Invite the bot first.",
        }

    try:
        messages = connector.get_channel_messages(channel_id, limit=200)
    except Exception as exc:
        logger.exception("Failed to fetch messages for channel %s", channel_id)
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "error",
            "detail": f"Failed to fetch messages: {exc}",
        }

    if not messages:
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "Channel has no messages (or bot cannot access them).",
        }

    text = connector.format_messages_as_text(channel_name, messages)
    if not text.strip():
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "No human messages after filtering bot/system messages.",
        }

    base_metadata = {
        "source": "slack",
        "source_id": f"slack_{channel_id}",
        "channel_id": channel_id,
        "channel_name": channel_name,
        "message_count": len(messages),
        "ingested_at": datetime.now(tz=timezone.utc).isoformat(),
    }

    chunks = chunk_text(text, metadata=base_metadata)
    if not chunks:
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "skipped",
            "detail": "Chunker produced no chunks.",
        }

    try:
        vector_store.add_documents(
            collection_name=_collection_name(),
            documents=[c["text"] for c in chunks],
            metadatas=[_sanitize_metadata(c["metadata"]) for c in chunks],
            ids=[c["id"] for c in chunks],
        )
    except Exception as exc:
        logger.exception("Failed to upsert Slack chunks for channel %s", channel_id)
        return {
            "channel_id": channel_id,
            "channel_name": channel_name,
            "chunks_created": 0,
            "status": "error",
            "detail": f"Chroma upsert failed: {exc}",
        }

    return {
        "channel_id": channel_id,
        "channel_name": channel_name,
        "chunks_created": len(chunks),
        "status": "success",
        "detail": f"Ingested {len(chunks)} chunk(s) into '{_collection_name()}'",
    }


def ingest_all_slack_channels(
    connector: SlackConnector,
    vector_store: VectorStore,
) -> Dict[str, Any]:
    try:
        channels = connector.list_channels()
    except Exception as exc:
        logger.exception("Failed to list Slack channels")
        return {
            "total_channels": 0,
            "ingested": 0,
            "skipped": 0,
            "errors": 1,
            "details": [{
                "channel_id": None,
                "channel_name": None,
                "chunks_created": 0,
                "status": "error",
                "detail": f"list_channels failed: {exc}",
            }],
        }

    member_channels = [c for c in channels if c.get("is_member")]
    details: List[Dict[str, Any]] = []
    ingested = 0
    skipped = 0
    errors = 0

    for ch in member_channels:
        result = ingest_slack_channel(
            channel_id=ch["id"],
            connector=connector,
            vector_store=vector_store,
        )
        details.append(result)
        status = result.get("status")
        if status == "success":
            ingested += 1
        elif status == "skipped":
            skipped += 1
        else:
            errors += 1

    skipped_non_member = len(channels) - len(member_channels)

    return {
        "total_channels": len(channels),
        "member_channels": len(member_channels),
        "skipped_not_member": skipped_non_member,
        "ingested": ingested,
        "skipped": skipped,
        "errors": errors,
        "details": details,
    }
