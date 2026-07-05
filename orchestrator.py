import os
import google.generativeai as genai
from google.generativeai.types import FunctionDeclaration, Tool
from google.api_core.exceptions import ResourceExhausted
from dotenv import load_dotenv
import time
import random

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def send_with_retry(chat, message, max_retries=5, base_delay=15):
    """Send a message with exponential backoff on 429 quota errors."""
    for attempt in range(max_retries):
        try:
            return chat.send_message(message)
        except ResourceExhausted:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 2)
            print(f"[Gemini rate limit] Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})...")
            time.sleep(delay)


# ── Tool declarations ────────────────────────────────────────────────────────

order_shipping_func = FunctionDeclaration(
    name="order_shipping_agent",
    description="Order status, tracking, delivery estimates, reship/refund workflows.",
    parameters={
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The customer's query"}},
        "required": ["query"]
    }
)

product_func = FunctionDeclaration(
    name="product_agent",
    description="Product catalog, stock/size availability, recommendations, cross-sell.",
    parameters={
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The customer's query about products"}},
        "required": ["query"]
    }
)

returns_refunds_func = FunctionDeclaration(
    name="returns_refunds_agent",
    description="Return eligibility, return policy, return labels, refunds within approved limits.",
    parameters={
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The customer's query about returns or refunds"}},
        "required": ["query"]
    }
)

billing_func = FunctionDeclaration(
    name="billing_agent",
    description="Failed payments, duplicate charges, promo codes, invoices, refund processing.",
    parameters={
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The customer's billing-related query"}},
        "required": ["query"]
    }
)

loyalty_account_func = FunctionDeclaration(
    name="loyalty_account_agent",
    description="Account details, loyalty points, point redemption, subscription changes.",
    parameters={
        "type": "object",
        "properties": {"query": {"type": "string", "description": "The customer's account or loyalty query"}},
        "required": ["query"]
    }
)

escalate_func = FunctionDeclaration(
    name="escalate_to_human",
    description="Frustrated customer, complex complaint, or anything outside other agents' scope.",
    parameters={
        "type": "object",
        "properties": {"reason": {"type": "string", "description": "Why this needs human escalation"}},
        "required": ["reason"]
    }
)

router_tool = Tool(function_declarations=[
    order_shipping_func, product_func, returns_refunds_func,
    billing_func, loyalty_account_func, escalate_func
])

# ── Model: gemini-2.0-flash (lighter, saves daily quota) ────────────────────
model = genai.GenerativeModel(
    model_name="gemini-3-flash-preview",
    tools=[router_tool],
    system_instruction=(
        "You are a customer service router for an e-commerce store. "
        "Classify the customer's message and call the single most relevant tool. "
        "If it fits none well, or the customer seems frustrated, respond directly "
        "or state you need to escalate."
    )
)


def route(message: str, history: list):
    formatted_history = []
    for turn in history:
        formatted_history.append({"role": turn["role"], "parts": [turn["content"]]})

    chat = model.start_chat(history=formatted_history)
    response = send_with_retry(chat, message)

    try:
        function_call = response.parts[0].function_call if response.parts else None
    except Exception:
        function_call = None

    if function_call and function_call.name:
        try:
            args = dict(function_call.args)
        except Exception:
            args = {}
            for k, v in function_call.args.items():
                args[k] = v

        return {"type": "tool_use", "name": function_call.name, "args": args}
    else:
        return {"type": "text", "text": response.text}


def dispatch_to_specialist(agent_name: str, args: dict, customer_id: str, history: list):
    query = args.get("query") if isinstance(args, dict) else getattr(args, "query", "")
    reason = args.get("reason") if isinstance(args, dict) else getattr(args, "reason", "")

    if agent_name == "order_shipping_agent":
        from agents.order_shipping import order_shipping_agent
        return order_shipping_agent(query or "Help with order", history)
    elif agent_name == "product_agent":
        from agents.product_agent import product_agent
        return product_agent(query or "Help with products", history)
    elif agent_name == "returns_refunds_agent":
        from agents.returns_refunds import returns_refunds_agent
        return returns_refunds_agent(query or "Help with returns", history)
    elif agent_name == "billing_agent":
        from agents.billing import billing_agent
        return billing_agent(query or "Help with billing", history)
    elif agent_name == "loyalty_account_agent":
        from agents.loyalty_account import loyalty_account_agent
        return loyalty_account_agent(query or "Help with account", history, customer_id)
    elif agent_name == "escalate_to_human":
        from agents.escalation import escalation_agent
        return escalation_agent(reason or "Customer needs human assistance", history, customer_id)
    else:
        return f"Agent {agent_name} not found."