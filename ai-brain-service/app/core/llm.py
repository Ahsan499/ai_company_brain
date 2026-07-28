from anthropic import Anthropic

from app.config import get_settings

SYSTEM_PROMPT = (
    "Answer based on the provided context. "
    "If the context does not contain the answer, say you don't know."
)


def ask_claude(prompt: str, context: str = "") -> str:
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

    text_parts = []
    for block in response.content:
        if getattr(block, "type", None) == "text":
            text_parts.append(block.text)
    return "\n".join(text_parts).strip()
