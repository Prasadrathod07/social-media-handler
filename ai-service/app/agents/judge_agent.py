import json

from app.services.llm import generate_text
from app.services.vector_store import retrieve_context

SYSTEM_PROMPT = (
    "You are a strict content safety and quality reviewer for a social media "
    "automation platform. You review AI-generated posts before a human ever sees "
    "them. Flag anything that could embarrass, mislead, or expose legal or "
    "reputational risk to the person posting. Check specifically for: "
    "unverifiable or exaggerated factual claims, sensitive topics (politics, "
    "religion, health, legal advice), inappropriate or offensive language, tone "
    "mismatched to the platform, and claims about the user's work or achievements "
    "that are NOT supported by their provided background. "
    'Respond with ONLY JSON: {"riskLevel": "low"|"medium"|"high", "issues": '
    '["..."], "recommendation": "approve"|"needs_review"|"block"}'
)

_VALID_RISK = {"low", "medium", "high"}
_VALID_RECOMMENDATION = {"approve", "needs_review", "block"}

# If the judge call fails or returns something unparseable, fail closed rather
# than silently letting risky content look "clean" to the caller.
_FALLBACK = {
    "riskLevel": "medium",
    "issues": ["Automated review could not be completed — treat as unreviewed."],
    "recommendation": "needs_review",
}


def review_content(user_id: str, platform: str, content: str) -> dict:
    context_chunks = retrieve_context(user_id, content, top_k=5)
    context = "\n---\n".join(context_chunks) if context_chunks else "No background on file."

    user_prompt = (
        f"Platform: {platform}\n\n"
        f"User's known background (for fact-grounding check):\n{context}\n\n"
        f"Post to review:\n{content}"
    )

    try:
        raw = generate_text(SYSTEM_PROMPT, user_prompt, max_tokens=400)
        parsed = json.loads(raw)
        risk_level = parsed.get("riskLevel")
        recommendation = parsed.get("recommendation")
        issues = parsed.get("issues", [])

        if risk_level not in _VALID_RISK or recommendation not in _VALID_RECOMMENDATION:
            return _FALLBACK

        return {
            "riskLevel": risk_level,
            "issues": issues if isinstance(issues, list) else [],
            "recommendation": recommendation,
        }
    except Exception:
        return _FALLBACK
