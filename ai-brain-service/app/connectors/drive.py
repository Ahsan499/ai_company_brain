from __future__ import annotations

import io
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from pypdf import PdfReader

from app.config import get_settings

logger = logging.getLogger(__name__)

SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]

SUPPORTED_MIME_TYPES = {
    "application/vnd.google-apps.document",
    "application/vnd.google-apps.spreadsheet",
    "application/pdf",
    "text/plain",
}

MIME_QUERY = (
    "(mimeType='application/vnd.google-apps.document' "
    "or mimeType='application/vnd.google-apps.spreadsheet' "
    "or mimeType='application/pdf' "
    "or mimeType='text/plain')"
)


def _resolve_path(path: Path) -> Path:
    """Resolve relative paths against the ai-brain-service project root."""
    if path.is_absolute():
        return path
    project_root = Path(__file__).resolve().parents[2]
    return (project_root / path).resolve()


class DriveConnector:
    """Google Drive read-only connector (auth + list + text extraction)."""

    def __init__(
        self,
        credentials_path: Optional[str] = None,
        token_path: Optional[str] = None,
    ):
        settings = get_settings()
        self.credentials_path = _resolve_path(
            Path(credentials_path or settings.google_credentials_path)
        )
        self.token_path = _resolve_path(Path(token_path or settings.google_token_path))
        self._service = None

    def is_authenticated(self) -> bool:
        creds = self._load_cached_credentials()
        return bool(creds and creds.valid)

    def authenticate(self) -> Credentials:
        """Return valid credentials, refreshing or running browser OAuth if needed."""
        creds = self._load_cached_credentials()

        if creds and creds.valid:
            return creds

        if creds and creds.expired and creds.refresh_token:
            try:
                creds.refresh(Request())
                self._save_token(creds)
                return creds
            except Exception as exc:
                logger.warning("Token refresh failed, starting browser auth: %s", exc)

        if not self.credentials_path.exists():
            raise FileNotFoundError(
                f"Google OAuth credentials not found at {self.credentials_path}. "
                "Download the Desktop client JSON from Google Cloud Console and "
                "place it at secrets/credentials.json."
            )

        flow = InstalledAppFlow.from_client_secrets_file(
            str(self.credentials_path),
            SCOPES,
        )
        # open_browser=False avoids macOS AppleScript (-10661) failures
        # when uvicorn runs inside Cursor/IDE terminals.
        # The authorization URL is printed to the server terminal — open it
        # manually in Chrome/Safari, then return here after consent.
        print("\n" + "=" * 60)
        print("Google Drive OAuth required")
        print("A URL will be printed next. Open it in your browser,")
        print("approve Drive read-only access, then wait for this request")
        print("to finish (token will be saved to secrets/token.json).")
        print("=" * 60 + "\n")
        creds = flow.run_local_server(
            host="localhost",
            port=8085,
            open_browser=False,
            bind_addr="127.0.0.1",
        )
        self._save_token(creds)
        print("\nGoogle Drive authentication successful. Token cached.\n")
        return creds

    def get_service(self):
        if self._service is None:
            creds = self.authenticate()
            self._service = build("drive", "v3", credentials=creds, cache_discovery=False)
        return self._service

    def list_files(
        self,
        folder_id: Optional[str] = None,
        page_size: int = 50,
    ) -> List[Dict[str, Any]]:
        service = self.get_service()
        query_parts = [MIME_QUERY, "trashed=false"]
        if folder_id:
            # Scope to one folder when requested.
            query_parts.append(f"'{folder_id}' in parents")
        # When folder_id is None, list supported files across My Drive
        # (not only items sitting directly in the Drive root).

        response = (
            service.files()
            .list(
                q=" and ".join(query_parts),
                pageSize=max(1, min(page_size, 100)),
                fields="files(id, name, mimeType, modifiedTime, webViewLink)",
                orderBy="modifiedTime desc",
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            )
            .execute()
        )

        files = response.get("files", [])
        return [
            {
                "id": item.get("id"),
                "name": item.get("name"),
                "mimeType": item.get("mimeType"),
                "modifiedTime": item.get("modifiedTime"),
                "webViewLink": item.get("webViewLink"),
            }
            for item in files
        ]

    def get_file_metadata(self, file_id: str) -> Dict[str, Any]:
        service = self.get_service()
        item = (
            service.files()
            .get(
                fileId=file_id,
                fields="id, name, mimeType, modifiedTime, webViewLink",
                supportsAllDrives=True,
            )
            .execute()
        )
        return {
            "id": item.get("id"),
            "name": item.get("name"),
            "mimeType": item.get("mimeType"),
            "modifiedTime": item.get("modifiedTime"),
            "webViewLink": item.get("webViewLink"),
        }

    def get_file_content(self, file_id: str, mime_type: str) -> Optional[str]:
        if mime_type not in SUPPORTED_MIME_TYPES:
            logger.info("Skipping unsupported mime type %s for file %s", mime_type, file_id)
            return None

        service = self.get_service()

        if mime_type == "application/vnd.google-apps.document":
            data = service.files().export(fileId=file_id, mimeType="text/plain").execute()
            return data.decode("utf-8", errors="replace") if isinstance(data, bytes) else str(data)

        if mime_type == "application/vnd.google-apps.spreadsheet":
            data = service.files().export(fileId=file_id, mimeType="text/csv").execute()
            csv_text = data.decode("utf-8", errors="replace") if isinstance(data, bytes) else str(data)
            return self._csv_to_readable_text(csv_text)

        if mime_type == "application/pdf":
            raw = self._download_bytes(service, file_id)
            return self._extract_pdf_text(raw)

        if mime_type == "text/plain":
            raw = self._download_bytes(service, file_id)
            return raw.decode("utf-8", errors="replace")

        logger.info("Skipping unsupported mime type %s for file %s", mime_type, file_id)
        return None

    def _load_cached_credentials(self) -> Optional[Credentials]:
        if not self.token_path.exists():
            return None
        try:
            return Credentials.from_authorized_user_file(str(self.token_path), SCOPES)
        except Exception as exc:
            logger.warning("Failed to load cached token: %s", exc)
            return None

    def _save_token(self, creds: Credentials) -> None:
        self.token_path.parent.mkdir(parents=True, exist_ok=True)
        self.token_path.write_text(creds.to_json(), encoding="utf-8")

    @staticmethod
    def _download_bytes(service, file_id: str) -> bytes:
        request = service.files().get_media(fileId=file_id)
        buffer = io.BytesIO()
        downloader = MediaIoBaseDownload(buffer, request)
        done = False
        while not done:
            _, done = downloader.next_chunk()
        return buffer.getvalue()

    @staticmethod
    def _extract_pdf_text(raw: bytes) -> str:
        reader = PdfReader(io.BytesIO(raw))
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            if text.strip():
                pages.append(text)
        return "\n\n".join(pages).strip()

    @staticmethod
    def _csv_to_readable_text(csv_text: str) -> str:
        lines = [line.strip() for line in csv_text.splitlines() if line.strip()]
        if not lines:
            return ""
        # Keep CSV structure but make it a bit more readable as plain text rows.
        return "\n".join(f"Row {idx}: {line}" for idx, line in enumerate(lines, start=1))
