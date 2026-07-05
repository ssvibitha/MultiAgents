import os
import uuid
import ssl
import asyncpg
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import RateLimitError as AzureRateLimitError
from orchestrator import route, dispatch_to_specialist

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL", "")

def _clean_db_url(url: str) -> str:
    """
    asyncpg cannot parse ?sslmode=require&channel_binding=... query params.
    Strip them out — SSL is handled separately via ssl=True.
    """
    if "?" in url:
        url = url[:url.index("?")]
    return url

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup — connect with SSL required for Neon
    ssl_ctx = ssl.create_default_context()
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE
    app.state.db_pool = await asyncpg.create_pool(
        _clean_db_url(DATABASE_URL),
        ssl=ssl_ctx,
    )
    yield
    # Shutdown
    await app.state.db_pool.close()

app = FastAPI(lifespan=lifespan)

# ── CORS ─────────────────────────────────────────────────────────────────────
# Allow requests from your Vercel frontend (and localhost for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    session_id: str
    customer_id: str
    message: str

# ── Health check (Render uses this to verify the service is up) ───────────────
@app.get("/health")
async def health():
    return {"status": "ok"}

async def get_history(pool, session_id: str) -> list:
    async with pool.acquire() as conn:
        session = await conn.fetchrow('SELECT id FROM "ChatSession" WHERE id = $1', session_id)
        if not session:
            return []
        rows = await conn.fetch('SELECT role, content FROM "ChatMessage" WHERE "sessionId" = $1 ORDER BY "createdAt" ASC', session_id)
        return [{"role": r["role"], "content": r["content"]} for r in rows]

async def save_turn(pool, session_id: str, customer_id: str, message: str, reply: str):
    async with pool.acquire() as conn:
        session = await conn.fetchrow('SELECT id FROM "ChatSession" WHERE id = $1', session_id)
        if not session:
            await conn.execute(
                'INSERT INTO "ChatSession" (id, "customerId", "updatedAt") VALUES ($1, $2, NOW())',
                session_id, customer_id
            )
        else:
            await conn.execute(
                'UPDATE "ChatSession" SET "updatedAt" = NOW() WHERE id = $1',
                session_id
            )

        user_msg_id = uuid.uuid4().hex
        await conn.execute(
            'INSERT INTO "ChatMessage" (id, "sessionId", role, content) VALUES ($1, $2, $3, $4)',
            user_msg_id, session_id, "user", message
        )

        model_msg_id = uuid.uuid4().hex
        await conn.execute(
            'INSERT INTO "ChatMessage" (id, "sessionId", role, content) VALUES ($1, $2, $3, $4)',
            model_msg_id, session_id, "model", reply
        )

@app.post("/chat")
async def chat(req: ChatRequest):
    pool = app.state.db_pool

    # 1. Fetch History from Postgres
    history = await get_history(pool, req.session_id)

    try:
        # 2. Send to orchestrator
        result = route(req.message, history)

        if result["type"] == "tool_use":
            agent_name = result["name"]
            args = result["args"]

            # 3. Dispatch to the specific agent
            specialist_reply = dispatch_to_specialist(agent_name, args, req.customer_id, history)

            # 4. Save the turn to Postgres
            await save_turn(pool, req.session_id, req.customer_id, req.message, specialist_reply)
            return {"reply": specialist_reply, "agent": agent_name}

        elif result["type"] == "text":
            text_reply = result["text"]
            await save_turn(pool, req.session_id, req.customer_id, req.message, text_reply)
            return {"reply": text_reply, "agent": "orchestrator"}

        return {"reply": "Sorry, I encountered an error.", "agent": "system"}

    except AzureRateLimitError:
        raise HTTPException(
            status_code=503,
            detail={
                "error": "rate_limit_exceeded",
                "message": "The AI service is temporarily rate-limited. Please try again in a few seconds.",
                "retry_after_seconds": 15,
            }
        )