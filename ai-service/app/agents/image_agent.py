from app.config import settings

PLATFORM_IMAGE_SIZE = {
    "instagram": "1024x1024",
    "facebook": "1024x1024",
    "linkedin": "1536x1024",
    "x": "1536x1024",
    "blog": "1536x1024",
}

PLATFORM_STYLE = {
    "instagram": "vibrant, eye-catching, lifestyle photography or bold flat illustration",
    "facebook": "warm, friendly, approachable photography or illustration",
    "linkedin": "clean, professional, corporate-appropriate, understated",
    "x": "bold, high-contrast, attention-grabbing",
    "blog": "editorial, high-quality header image style",
}


def generate_image(platform: str, subject_text: str, content: str) -> str:
    """Generate a banner/poster image for a post. Returns base64-encoded PNG data."""
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)
    style = PLATFORM_STYLE.get(platform, "clean, modern, professional")
    prompt = (
        f"A {style} social media graphic for a {platform} post about: {subject_text}. "
        f"Context: {content[:300]}. No embedded text or typography in the image itself, "
        "high quality, visually striking, brand-neutral."
    )
    size = PLATFORM_IMAGE_SIZE.get(platform, "1024x1024")

    response = client.images.generate(model=settings.openai_image_model, prompt=prompt, size=size, n=1)
    return response.data[0].b64_json
