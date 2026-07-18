from app.services.llm import generate_text
from app.services.vector_store import retrieve_context

PLATFORM_GUIDELINES = {
    "linkedin": "Professional tone, 150-250 words, hook + insight + reflection prompt. Max 3 hashtags.",
    "x": "Punchy, under 280 characters, conversational. Max 2 hashtags.",
    "instagram": "Warm, visual-first caption, short paragraphs, 3-8 relevant hashtags at the end.",
    "facebook": "Friendly, conversational, 80-200 words.",
    "blog": "Long-form article: intro, 2-4 sections with subheadings, conclusion.",
}

SYSTEM_PROMPT = "You are an expert social media copywriter who writes in the user's authentic voice."


def generate_post(user_id: str, platform: str, subject_text: str) -> str:
    context_chunks = retrieve_context(user_id, subject_text, top_k=6)
    context = "\n---\n".join(context_chunks) if context_chunks else "No profile information available yet."
    guideline = PLATFORM_GUIDELINES.get(platform, "")

    user_prompt = (
        f"Platform: {platform}\n"
        f"Style guideline: {guideline}\n"
        f"Post subject: {subject_text}\n\n"
        f"User background context:\n{context}\n\n"
        "Write the final post content only, ready to publish."
    )

    return generate_text(SYSTEM_PROMPT, user_prompt, max_tokens=900).strip()
