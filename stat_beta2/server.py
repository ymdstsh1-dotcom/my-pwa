"""ベータ積分 学習PWA の静的配信サーバー。

問題・選択肢・正答はフロント(app.js)に埋め込み、Service Worker でキャッシュするため
完全オフラインで動作する。本サーバーは PWA の配信のみを担当する。

起動:
    uvicorn server:app --reload
ブラウザで http://127.0.0.1:8000/ を開く。
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

DIR = Path(__file__).parent
app = FastAPI(title="ベータ分布の積分 学習PWA")


@app.get("/")
def index():
    return FileResponse(DIR / "index.html")


# index.html / style.css / app.js / manifest.json / service-worker.js / icons などを配信
app.mount("/", StaticFiles(directory=DIR, html=True), name="static")
