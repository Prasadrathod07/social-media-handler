from typing import Literal, Optional

from pydantic import BaseModel

Platform = Literal["linkedin", "x", "instagram", "facebook", "blog"]
SourceType = Literal["resume", "bio", "note", "image", "pastPost"]


class IndexKnowledgeRequest(BaseModel):
    userId: str
    sourceType: SourceType
    sourceRefId: Optional[str] = None
    text: str


class IndexKnowledgeResponse(BaseModel):
    faissVectorId: int
    faissIndexNamespace: str


class TopicSuggestion(BaseModel):
    subjectText: str
    rationale: Optional[str] = None


class SuggestTopicsRequest(BaseModel):
    userId: str
    platform: Platform
    count: int = 3


class SuggestTopicsResponse(BaseModel):
    suggestions: list[TopicSuggestion]


class GenerateContentRequest(BaseModel):
    userId: str
    platform: Platform
    subjectText: str


class GenerateContentResponse(BaseModel):
    content: str


class ChatRequest(BaseModel):
    userId: str
    conversationId: str
    message: str


class ChatResponse(BaseModel):
    reply: str


class VisionDescribeRequest(BaseModel):
    userId: str
    imageUrl: str


class VisionDescribeResponse(BaseModel):
    description: str
