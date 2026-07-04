import os
import uuid
import asyncpg
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google.api_core.exceptions import ResourceExhausted
from openai import RateLimitError as AzureRateLimitError
from orchestrator import route, dispatch_to_specialist

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.db_pool = await asyncpg.create_pool(DATABASE_URL)
    yield
    # Shutdown
    await app.state.db_pool.close()

app = FastAPI(lifespan=lifespan)

class ChatRequest(BaseModel):
    session_id: str
    customer_id: str
    message: str

async def get_history(pool, session_id: str) -> list:
    async with pool.acquire() as conn:
        # Fetch session to see if it exists
        session = await conn.fetchrow('SELECT id FROM "ChatSession" WHERE id = $1', session_id)
        if not session:
            return []
            
        # Fetch history
        rows = await conn.fetch('SELECT role, content FROM "ChatMessage" WHERE "sessionId" = $1 ORDER BY "createdAt" ASC', session_id)
        return [{"role": r["role"], "content": r["content"]} for r in rows]

async def save_turn(pool, session_id: str, customer_id: str, message: str, reply: str):
    async with pool.acquire() as conn:
        # Ensure session exists
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
            
        # Insert User Message
        user_msg_id = uuid.uuid4().hex
        await conn.execute(
            'INSERT INTO "ChatMessage" (id, "sessionId", role, content) VALUES ($1, $2, $3, $4)',
            user_msg_id, session_id, "user", message
        )
        
        # Insert Model Reply
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

    except (ResourceExhausted, AzureRateLimitError):
        raise HTTPException(
            status_code=503,
            detail={
                "error": "rate_limit_exceeded",
                "message": "The AI service is temporarily rate-limited. Please try again in a few seconds.",
                "retry_after_seconds": 15,
            }
        )