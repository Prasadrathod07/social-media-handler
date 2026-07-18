from fastapi import FastAPI

from app.routes import agents, knowledge

app = FastAPI(title="Social Media Handler AI Service", version="0.1.0")

app.include_router(knowledge.router)
app.include_router(agents.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
