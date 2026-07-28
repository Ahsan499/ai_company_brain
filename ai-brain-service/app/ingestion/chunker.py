from __future__ import annotations

import hashlib
import logging
import re
from typing import Any, Dict, List

logger = logging.getLogger(__name__)

# Prefer paragraph/sentence breaks, then whitespace, then hard character splits.
_SEPARATORS = ["\n\n", "\n", ". ", " ", ""]


def _split_with_separator(text: str, separator: str) -> List[str]:
    if separator == "":
        return list(text)
    if not separator:
        return [text]
    return [part for part in text.split(separator) if part != ""]


def _merge_splits(splits: List[str], separator: str, chunk_size: int, chunk_overlap: int) -> List[str]:
    chunks: List[str] = []
    current: List[str] = []
    current_len = 0
    sep_len = len(separator)

    for piece in splits:
        piece_len = len(piece)
        extra = sep_len if current else 0
        if current and current_len + extra + piece_len > chunk_size:
            chunk = separator.join(current).strip()
            if chunk:
                chunks.append(chunk)

            # Keep overlap from the end of the current window.
            if chunk_overlap > 0:
                overlap_text = separator.join(current)
                while len(overlap_text) > chunk_overlap and current:
                    current = current[1:]
                    overlap_text = separator.join(current)
                current_len = len(overlap_text)
            else:
                current = []
                current_len = 0

            extra = sep_len if current else 0

        if current:
            current_len += sep_len + piece_len
        else:
            current_len = piece_len
        current.append(piece)

    if current:
        chunk = separator.join(current).strip()
        if chunk:
            chunks.append(chunk)
    return chunks


def _recursive_split(text: str, separators: List[str], chunk_size: int, chunk_overlap: int) -> List[str]:
    if len(text) <= chunk_size:
        stripped = text.strip()
        return [stripped] if stripped else []

    separator = separators[0]
    remaining = separators[1:] if len(separators) > 1 else [""]
    splits = _split_with_separator(text, separator)

    final_chunks: List[str] = []
    buffer: List[str] = []

    for split in splits:
        if len(split) <= chunk_size:
            buffer.append(split)
            continue

        if buffer:
            final_chunks.extend(_merge_splits(buffer, separator, chunk_size, chunk_overlap))
            buffer = []
        final_chunks.extend(_recursive_split(split, remaining, chunk_size, chunk_overlap))

    if buffer:
        final_chunks.extend(_merge_splits(buffer, separator, chunk_size, chunk_overlap))
    return final_chunks


def _chunk_id(source_key: str, chunk_index: int) -> str:
    digest = hashlib.sha256(f"{source_key}:{chunk_index}".encode("utf-8")).hexdigest()
    return f"chunk_{digest[:32]}"


def chunk_text(
    text: str,
    metadata: Dict[str, Any],
    chunk_size: int = 1000,
    chunk_overlap: int = 150,
) -> List[Dict[str, Any]]:
    """
    Split text into overlapping retrieval-sized chunks.

    Uses a small custom recursive character splitter (same idea as LangChain's
    RecursiveCharacterTextSplitter) to avoid adding a langchain dependency
    while keeping paragraph/sentence-aware boundaries.
    """
    cleaned = (text or "").strip()
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)

    if not cleaned:
        logger.warning("chunk_text received empty text; skipping.")
        return []

    if chunk_size <= 0:
        raise ValueError("chunk_size must be > 0")
    if chunk_overlap < 0 or chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be >= 0 and < chunk_size")

    pieces = _recursive_split(cleaned, _SEPARATORS, chunk_size, chunk_overlap)
    if not pieces:
        return []

    source_key = str(
        metadata.get("file_id")
        or metadata.get("source_id")
        or metadata.get("id")
        or "unknown"
    )
    total = len(pieces)
    results: List[Dict[str, Any]] = []

    for index, piece in enumerate(pieces):
        chunk_meta = {
            **metadata,
            "chunk_index": index,
            "total_chunks": total,
        }
        results.append(
            {
                "id": _chunk_id(source_key, index),
                "text": piece,
                "metadata": chunk_meta,
            }
        )

    return results
