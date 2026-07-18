from openai import OpenAI

from app.config import settings

_client: OpenAI | None = None


def get_openai_client() -> OpenAI:
    global _client
    if _client is None:
        _client = OpenAI(api_key=settings.openai_api_key)
    return _client


def embed_text(text: str) -> list[float]:
    """Embed a single string using the OpenAI embedding model."""
    client = get_openai_client()
    response = client.embeddings.create(model=settings.openai_embedding_model, input=text)
    return response.data[0].embedding


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Embed a batch of strings using the OpenAI embedding model."""
    client = get_openai_client()
    response = client.embeddings.create(model=settings.openai_embedding_model, input=texts)
    return [item.embedding for item in response.data]
