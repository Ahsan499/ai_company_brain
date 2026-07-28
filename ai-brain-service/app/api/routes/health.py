from fastapi import APIRouter
from typing import Dict, Union

from app.config import get_settings
from app.core.vector_store import VectorStore

router = APIRouter(tags=["health"])


@router.get("/health")
@router.get("/api/v1/health")
def health_check() -> Dict[str, Union[bool, str]]:
    settings = get_settings()
    store = VectorStore(persist_directory=str(settings.chroma_persist_path))
    connected = store.check_connection()
    return {"status": "ok", "chroma_connected": connected}
