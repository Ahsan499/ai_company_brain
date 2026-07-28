from __future__ import annotations

import logging
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException, Query

from app.connectors.drive import DriveConnector

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/drive", tags=["drive"])


def _connector() -> DriveConnector:
    return DriveConnector()


@router.get("/auth-status")
def drive_auth_status() -> Dict[str, bool]:
    connector = _connector()
    return {"authenticated": connector.is_authenticated()}


@router.get("/files")
def drive_list_files(
    folder_id: Optional[str] = Query(default=None),
    page_size: int = Query(default=50, ge=1, le=100),
) -> Dict[str, Any]:
    """
    List supported Drive files.

    If not authenticated yet, this call blocks while OAuth completes.
    Watch the uvicorn terminal for the Google authorization URL and open it
    manually in Chrome (auto-browser open often fails inside IDE terminals).
    Prefer running: `.venv/bin/python scripts/auth_google_drive.py`
    """
    try:
        connector = _connector()
        if not connector.is_authenticated():
            logger.warning(
                "Drive token missing. OAuth URL will print in the server terminal. "
                "Open that URL in Chrome, or run: .venv/bin/python scripts/auth_google_drive.py"
            )
        files = connector.list_files(folder_id=folder_id, page_size=page_size)
        return {"count": len(files), "files": files}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Failed to list Drive files")
        raise HTTPException(status_code=500, detail=f"Drive list failed: {exc}") from exc


@router.get("/files/{file_id}/content")
def drive_file_content(
    file_id: str,
    mime_type: str = Query(..., description="Drive mimeType for this file"),
) -> Dict[str, Any]:
    try:
        connector = _connector()
        content = connector.get_file_content(file_id=file_id, mime_type=mime_type)
        if content is None:
            raise HTTPException(
                status_code=415,
                detail=f"Unsupported or skipped mime type: {mime_type}",
            )

        preview = content[:500]
        logger.info(
            "Extracted Drive file %s (%s): full_length=%s preview_length=%s",
            file_id,
            mime_type,
            len(content),
            len(preview),
        )
        return {
            "file_id": file_id,
            "mime_type": mime_type,
            "content_length": len(content),
            "content_preview": preview,
            "content": preview,
        }
    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Failed to extract Drive file content for %s", file_id)
        raise HTTPException(status_code=500, detail=f"Drive content failed: {exc}") from exc
