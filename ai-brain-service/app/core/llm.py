from __future__ import annotations

from typing import List, Optional

from anthropic import Anthropic

from app.config import get_settings

SYSTEM_PROMPT = (
    "Answer based on the provided context. "
    "If the context does not contain the answer, say you don't know."
)

RAG_SYSTEM_PROMPT = """You are the AI Company Brain knowledge assistant for an internal company tool.

Answer the user's question using ONLY the provided document context below.
Rules you must follow:
1. Use only facts that appear in the context. Do not use general knowledge, assumptions, or outside information.
2. When you use information from the context, cite the source file name(s) inline (e.g. "According to department_workload_report (1), ...").
3. If multiple sources support the answer, mention each relevant file name.
4. If the context does not contain enough information to answer, reply exactly with:
   I don't have information about that in the connected documents.
5. Do not invent numbers, names, dates, or details that are not present in the context.
6. Keep answers clear and concise for workplace use."""


def _extract_text(response) -> str:
    text_parts: List[str] = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            text_parts.append(block.text)
    return "\n".join(text_parts).strip()


def ask_claude(prompt: str, context: str = "") -> str:
    """Generic Claude helper (non-RAG / placeholder use cases)."""
    settings = get_settings()

    if not settings.anthropic_api_key:
        raise ValueError("ANTHROPIC_API_KEY is not set.")

    client = Anthropic(api_key=settings.anthropic_api_key)
    context_block = context.strip() or "No context provided."
    user_message = f"Context:\n{context_block}\n\nQuestion:\n{prompt.strip()}"

    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    return _extract_text(response)


def ask_claude_rag(
    question: str,
    context: str,
    source_names: Optional[List[str]] = None,
    max_tokens: int = 1024,
) -> str:
    """Claude call dedicated to grounded RAG answers with strict source discipline."""
    settings = get_settings()

    if not settings.anthropic_api_key:
        raise ValueError("ANTHROPIC_API_KEY is not set.")

    names = source_names or []
    sources_line = ", ".join(names) if names else "none listed"
    user_message = (
        f"Document context:\n{context.strip()}\n\n"
        f"Available source file names: {sources_line}\n\n"
        f"Question:\n{question.strip()}\n\n"
        "Answer using only the document context above."
    )

    client = Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=max_tokens,
        system=RAG_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )
    return _extract_text(response)
