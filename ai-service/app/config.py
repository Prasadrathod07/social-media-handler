from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    host: str = "0.0.0.0"
    port: int = 8000

    internal_api_key: str = ""

    openai_api_key: str = ""
    openai_embedding_model: str = "text-embedding-3-small"
    openai_image_model: str = "gpt-image-1"

    generation_provider: str = "anthropic"  # "anthropic" | "openai"
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-5"
    openai_generation_model: str = "gpt-4o"

    faiss_index_dir: str = "./faiss_indexes"
    embedding_dim: int = 1536


settings = Settings()
