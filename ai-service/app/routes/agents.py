from fastapi import APIRouter, Depends

from app.agents.chat_agent import reply as chat_reply
from app.agents.content_agent import generate_post
from app.agents.ideation_agent import suggest_topics
from app.agents.image_agent import generate_image
from app.agents.judge_agent import review_content
from app.agents.vision_agent import describe_image
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    GenerateContentRequest,
    GenerateContentResponse,
    GenerateImageRequest,
    GenerateImageResponse,
    ReviewContentRequest,
    ReviewContentResponse,
    SuggestTopicsRequest,
    SuggestTopicsResponse,
    VisionDescribeRequest,
    VisionDescribeResponse,
)
from app.security import verify_internal_api_key

router = APIRouter(prefix="/agents", tags=["agents"], dependencies=[Depends(verify_internal_api_key)])


@router.post("/ideation/suggest", response_model=SuggestTopicsResponse)
def suggest(payload: SuggestTopicsRequest) -> SuggestTopicsResponse:
    suggestions = suggest_topics(payload.userId, payload.platform, payload.count)
    return SuggestTopicsResponse(suggestions=suggestions)


@router.post("/content/generate", response_model=GenerateContentResponse)
def generate(payload: GenerateContentRequest) -> GenerateContentResponse:
    content = generate_post(payload.userId, payload.platform, payload.subjectText)
    return GenerateContentResponse(content=content)


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    text = chat_reply(payload.userId, payload.message)
    return ChatResponse(reply=text)


@router.post("/vision/describe", response_model=VisionDescribeResponse)
def vision_describe(payload: VisionDescribeRequest) -> VisionDescribeResponse:
    description = describe_image(payload.imageUrl)
    return VisionDescribeResponse(description=description)


@router.post("/image/generate", response_model=GenerateImageResponse)
def image_generate(payload: GenerateImageRequest) -> GenerateImageResponse:
    image_base64 = generate_image(payload.platform, payload.subjectText, payload.content)
    return GenerateImageResponse(imageBase64=image_base64)


@router.post("/judge/review", response_model=ReviewContentResponse)
def judge_review(payload: ReviewContentRequest) -> ReviewContentResponse:
    result = review_content(payload.userId, payload.platform, payload.content)
    return ReviewContentResponse(**result)
