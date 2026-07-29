from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

from app.config import get_settings

logger = logging.getLogger(__name__)

SKIP_SUBTYPES = {
    "channel_join",
    "channel_leave",
    "channel_topic",
    "channel_purpose",
    "channel_name",
    "channel_archive",
    "channel_unarchive",
    "group_join",
    "group_leave",
    "group_topic",
    "group_purpose",
    "group_name",
    "group_archive",
    "group_unarchive",
    "bot_message",
    "bot_add",
    "bot_remove",
    "pinned_item",
    "unpinned_item",
}


class SlackConnector:
    """Read-only Slack connector using a Bot User OAuth Token."""

    def __init__(self, token: Optional[str] = None):
        settings = get_settings()
        self._token = token or settings.slack_bot_token
        if not self._token:
            raise ValueError("SLACK_BOT_TOKEN is not set.")
        self._client = WebClient(token=self._token)
        self._user_cache: Dict[str, str] = {}

    def list_channels(self) -> List[Dict[str, Any]]:
        channels: List[Dict[str, Any]] = []
        cursor = None
        while True:
            kwargs: Dict[str, Any] = {
                "types": "public_channel,private_channel",
                "exclude_archived": True,
                "limit": 200,
            }
            if cursor:
                kwargs["cursor"] = cursor

            resp = self._client.conversations_list(**kwargs)
            for ch in resp.get("channels", []):
                channels.append({
                    "id": ch.get("id"),
                    "name": ch.get("name"),
                    "is_member": bool(ch.get("is_member")),
                })
            cursor = (resp.get("response_metadata") or {}).get("next_cursor")
            if not cursor:
                break
        return channels

    def get_channel_messages(
        self, channel_id: str, limit: int = 200
    ) -> List[Dict[str, Any]]:
        messages: List[Dict[str, Any]] = []
        cursor = None
        remaining = limit

        while remaining > 0:
            page_size = min(remaining, 200)
            kwargs: Dict[str, Any] = {
                "channel": channel_id,
                "limit": page_size,
            }
            if cursor:
                kwargs["cursor"] = cursor

            try:
                resp = self._client.conversations_history(**kwargs)
            except SlackApiError as exc:
                if exc.response.get("error") == "not_in_channel":
                    logger.warning("Bot is not in channel %s", channel_id)
                    return []
                raise

            batch = resp.get("messages", [])
            messages.extend(batch)
            remaining -= len(batch)

            if not resp.get("has_more"):
                break
            cursor = (resp.get("response_metadata") or {}).get("next_cursor")
            if not cursor:
                break

        return messages

    def get_user_name(self, user_id: str) -> str:
        if not user_id:
            return "unknown"
        if user_id in self._user_cache:
            return self._user_cache[user_id]
        try:
            resp = self._client.users_info(user=user_id)
            user = resp.get("user", {})
            name = (
                user.get("real_name")
                or user.get("profile", {}).get("display_name")
                or user.get("name")
                or user_id
            )
            self._user_cache[user_id] = name
            return name
        except SlackApiError:
            logger.warning("Failed to resolve user %s", user_id)
            self._user_cache[user_id] = user_id
            return user_id

    def format_messages_as_text(
        self, channel_name: str, messages: List[Dict[str, Any]]
    ) -> str:
        # Filter out bot/system messages and sort oldest-first.
        human_msgs = []
        for msg in messages:
            subtype = msg.get("subtype")
            if subtype in SKIP_SUBTYPES:
                continue
            if msg.get("bot_id"):
                continue
            text = (msg.get("text") or "").strip()
            if not text:
                continue
            human_msgs.append(msg)

        human_msgs.sort(key=lambda m: float(m.get("ts") or 0))

        lines: List[str] = [f"Slack channel: #{channel_name}", ""]
        for msg in human_msgs:
            ts = float(msg.get("ts") or 0)
            dt = datetime.fromtimestamp(ts, tz=timezone.utc)
            date_str = dt.strftime("%Y-%m-%d %H:%M")
            user_id = msg.get("user") or ""
            user_name = self.get_user_name(user_id)
            text = msg.get("text", "").strip()
            lines.append(f"[{date_str}] {user_name}: {text}")

        return "\n".join(lines).strip()
