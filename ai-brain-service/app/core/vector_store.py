from __future__ import annotations

from typing import Any, Dict, List, Optional

import chromadb
from chromadb.api import Collection


class VectorStore:
    """Thin wrapper around Chroma PersistentClient."""

    def __init__(self, persist_directory: str, embedding_function: Optional[Any] = None):
        self.persist_directory = persist_directory
        self.embedding_function = embedding_function
        self._client = chromadb.PersistentClient(path=persist_directory)

    def check_connection(self) -> bool:
        """Return True when the Chroma client responds."""
        try:
            self._client.heartbeat()
            return True
        except Exception:
            return False

    def get_or_create_collection(self, name: str) -> Collection:
        kwargs: Dict[str, Any] = {"name": name}
        if self.embedding_function is not None:
            kwargs["embedding_function"] = self.embedding_function
        return self._client.get_or_create_collection(**kwargs)

    def add_documents(
        self,
        collection_name: str,
        documents: List[str],
        metadatas: Optional[List[Dict[str, Any]]],
        ids: List[str],
    ) -> None:
        """Upsert documents so re-ingesting the same IDs overwrites instead of duplicating."""
        collection = self.get_or_create_collection(collection_name)
        collection.upsert(documents=documents, metadatas=metadatas, ids=ids)

    def count(self, collection_name: str) -> int:
        collection = self.get_or_create_collection(collection_name)
        return int(collection.count())

    def collection_stats(self, collection_name: str) -> Dict[str, Any]:
        """Lightweight status: total count + file_name breakdown from metadata only."""
        collection = self.get_or_create_collection(collection_name)
        total = int(collection.count())
        by_file: Dict[str, int] = {}
        by_source: Dict[str, int] = {}

        if total == 0:
            return {
                "collection": collection_name,
                "total_chunks": 0,
                "by_file_name": {},
                "by_source": {},
            }

        # Metadata-only fetch is much cheaper than loading document bodies.
        result = collection.get(include=["metadatas"])
        for meta in result.get("metadatas") or []:
            if not isinstance(meta, dict):
                continue
            file_name = str(meta.get("file_name") or "unknown")
            source = str(meta.get("source") or "unknown")
            by_file[file_name] = by_file.get(file_name, 0) + 1
            by_source[source] = by_source.get(source, 0) + 1

        return {
            "collection": collection_name,
            "total_chunks": total,
            "by_file_name": by_file,
            "by_source": by_source,
        }

    def query(
        self,
        collection_name: str,
        query_text: str,
        n_results: int = 5,
    ) -> Dict[str, Any]:
        collection = self.get_or_create_collection(collection_name)
        safe_n = max(1, min(n_results, max(1, collection.count()) or 1))
        if collection.count() == 0:
            return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}
        return collection.query(query_texts=[query_text], n_results=safe_n)
