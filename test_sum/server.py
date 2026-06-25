import random
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

DIR = Path(__file__).parent
app = FastAPI()

pending: dict[str, int] = {}


class AnswerBody(BaseModel):
    id: str
    z: int


@app.get("/")
def index():
    return FileResponse(DIR / "index.html")


@app.post("/api/question")
def new_question():
    x = random.randint(0, 9)
    y = random.randint(0, 9)
    qid = str(random.randint(100000, 999999))
    pending[qid] = x + y
    return {"id": qid, "x": x, "y": y}


@app.post("/api/answer")
def check_answer(body: AnswerBody):
    correct = pending.pop(body.id, None) == body.z
    return {"correct": correct}
