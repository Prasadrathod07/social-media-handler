from app.config import settings


def generate_text(system_prompt: str, user_prompt: str, max_tokens: int = 800) -> str:
    """Provider-agnostic generation call. Defaults to Anthropic; set
    GENERATION_PROVIDER=openai to switch without touching callers."""
    if settings.generation_provider == "openai":
        return _generate_openai(system_prompt, user_prompt, max_tokens)
    return _generate_anthropic(system_prompt, user_prompt, max_tokens)


def _generate_anthropic(system_prompt: str, user_prompt: str, max_tokens: int) -> str:
    from anthropic import Anthropic

    client = Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    return "".join(block.text for block in response.content if block.type == "text")


def _generate_openai(system_prompt: str, user_prompt: str, max_tokens: int) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_generation_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content or ""
