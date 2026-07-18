from app.services.vector_store import add_and_index


def index_knowledge(user_id: str, text: str) -> tuple[int, str]:
    return add_and_index(user_id, text)
