from app.config import settings


def describe_image(image_url: str) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_generation_model,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Describe this image factually in 2-3 sentences, noting anything "
                            "relevant for a social media post (setting, activity, mood, visible text)."
                        ),
                    },
                    {"type": "image_url", "image_url": {"url": image_url}},
                ],
            }
        ],
        max_tokens=200,
    )
    return response.choices[0].message.content or ""
