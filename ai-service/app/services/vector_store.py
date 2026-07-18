import json
import os
import threading

import faiss
import numpy as np

from app.config import settings
from app.services.embeddings import embed_text

_locks: dict[str, threading.Lock] = {}
_indexes: dict[str, faiss.IndexIDMap] = {}
_texts: dict[str, dict[int, str]] = {}


def _index_path(user_id: str) -> str:
    os.makedirs(settings.faiss_index_dir, exist_ok=True)
    return os.path.join(settings.faiss_index_dir, f"{user_id}.index")


def _texts_path(user_id: str) -> str:
    os.makedirs(settings.faiss_index_dir, exist_ok=True)
    return os.path.join(settings.faiss_index_dir, f"{user_id}.texts.json")


def _get_lock(user_id: str) -> threading.Lock:
    return _locks.setdefault(user_id, threading.Lock())


def _load_index(user_id: str) -> faiss.IndexIDMap:
    if user_id in _indexes:
        return _indexes[user_id]
    path = _index_path(user_id)
    if os.path.exists(path):
        index = faiss.read_index(path)
    else:
        index = faiss.IndexIDMap(faiss.IndexFlatL2(settings.embedding_dim))
    _indexes[user_id] = index
    return index


def _load_texts(user_id: str) -> dict[int, str]:
    if user_id in _texts:
        return _texts[user_id]
    path = _texts_path(user_id)
    if os.path.exists(path):
        with open(path) as f:
            raw = json.load(f)
        texts = {int(k): v for k, v in raw.items()}
    else:
        texts = {}
    _texts[user_id] = texts
    return texts


def _persist(user_id: str, index: faiss.IndexIDMap, texts: dict[int, str]) -> None:
    faiss.write_index(index, _index_path(user_id))
    with open(_texts_path(user_id), "w") as f:
        json.dump(texts, f)


def add_and_index(user_id: str, text: str) -> tuple[int, str]:
    """Embed `text` with OpenAI and store the vector in the user's FAISS index.

    Returns (faissVectorId, faissIndexNamespace) — the namespace is the userId
    since each user gets their own on-disk FAISS index.
    """
    vector = embed_text(text)
    with _get_lock(user_id):
        index = _load_index(user_id)
        texts = _load_texts(user_id)
        vector_id = index.ntotal
        index.add_with_ids(
            np.array([vector], dtype="float32"),
            np.array([vector_id], dtype="int64"),
        )
        texts[vector_id] = text
        _persist(user_id, index, texts)
    return vector_id, user_id


def retrieve_context(user_id: str, query: str, top_k: int = 5) -> list[str]:
    """RAG lookup: the top_k stored chunks most relevant to `query`."""
    with _get_lock(user_id):
        index = _load_index(user_id)
        if index.ntotal == 0:
            return []
        texts = _load_texts(user_id)
        query_vector = embed_text(query)
        _distances, ids = index.search(np.array([query_vector], dtype="float32"), min(top_k, index.ntotal))
        return [texts[int(i)] for i in ids[0] if i != -1 and int(i) in texts]
