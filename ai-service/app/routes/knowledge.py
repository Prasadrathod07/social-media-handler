from fastapi import APIRouter, Depends

from app.agents.profile_agent import index_knowledge
from app.models.schemas import IndexKnowledgeRequest, IndexKnowledgeResponse
from app.security import verify_internal_api_key

router = APIRouter(prefix="/knowledge", tags=["knowledge"], dependencies=[Depends(verify_internal_api_key)])


@router.post("/index", response_model=IndexKnowledgeResponse)
def index_text(payload: IndexKnowledgeRequest) -> IndexKnowledgeResponse:
    vector_id, namespace = index_knowledge(payload.userId, payload.text)
    return IndexKnowledgeResponse(faissVectorId=vector_id, faissIndexNamespace=namespace)
