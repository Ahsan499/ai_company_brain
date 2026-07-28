"""One-shot Google Drive OAuth (run in macOS Terminal.app if needed).

Usage:
  cd ai-brain-service
  ./.venv/bin/python scripts/auth_google_drive.py
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.connectors.drive import DriveConnector


def main() -> None:
    connector = DriveConnector()
    if connector.is_authenticated():
        print("Already authenticated. Token:", connector.token_path)
        return

    print("Starting Google Drive OAuth...")
    print("Copy the printed URL into Chrome if a browser does not open.")
    connector.authenticate()
    print("Done. Authenticated:", connector.is_authenticated())
    print("Token saved at:", connector.token_path)


if __name__ == "__main__":
    main()
