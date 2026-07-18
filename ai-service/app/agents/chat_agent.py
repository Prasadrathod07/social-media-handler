from app.services.llm import generate_text
from app.services.vector_store import retrieve_context

SYSTEM_PROMPT = (
    "You are the user's social media content assistant. Help them plan, refine, "
    "and brainstorm posts. Be concise and conversational."
)


def reply(user_id: str, message: str) -> str:
    context_chunks = retrieve_context(user_id, message, top_k=5)
    if context_chunks:
        context = "\n---\n".join(context_chunks)
        user_prompt = f"User background context:\n{context}\n\nUser message:\n{message}"
    else:
        user_prompt = message

    return generate_text(SYSTEM_PROMPT, user_prompt, max_tokens=500).strip()
