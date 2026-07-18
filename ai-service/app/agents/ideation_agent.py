import json

from app.models.schemas import TopicSuggestion
from app.services.llm import generate_text
from app.services.vector_store import retrieve_context

SYSTEM_PROMPT = (
    "You are a social media strategist. Given a user's professional background, "
    "propose specific, engaging post subjects for the given platform. "
    'Respond with ONLY a JSON array of objects: [{"subjectText": "...", "rationale": "..."}]'
)


def suggest_topics(user_id: str, platform: str, count: int) -> list[TopicSuggestion]:
    context_chunks = retrieve_context(
        user_id, f"{platform} post ideas about the user's work and background", top_k=8
    )
    context = "\n---\n".join(context_chunks) if context_chunks else "No profile information available yet."

    user_prompt = (
        f"Platform: {platform}\n"
        f"Number of subjects needed: {count}\n\n"
        f"User context:\n{context}\n\n"
        "Return only the JSON array, no other text."
    )

    raw = generate_text(SYSTEM_PROMPT, user_prompt, max_tokens=600)
    try:
        parsed = json.loads(raw)
        suggestions = [TopicSuggestion(**item) for item in parsed]
        return suggestions[:count] if suggestions else _fallback(raw)
    except (json.JSONDecodeError, TypeError, ValueError):
        return _fallback(raw)


def _fallback(raw: str) -> list[TopicSuggestion]:
    return [TopicSuggestion(subjectText=raw.strip()[:200] or "Share an update about your recent work")]
