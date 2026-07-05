"""
Orchestrator — Azure OpenAI GPT-5
Routes the customer's message to the right specialist agent using
Azure OpenAI's native function-calling (tool_choice="required").
"""
import os
import json
from dotenv import load_dotenv
from openai import AzureOpenAI, RateLimitError
import time
import random

load_dotenv()

_client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-01-01-preview"),
)

GPT5 = os.environ.get("AZURE_DEPLOYMENT_GPT5", "gpt-5")

# ── Tool declarations (OpenAI format) ────────────────────────────────────────

ROUTER_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "order_shipping_agent",
            "description": "Order status, tracking, delivery estimates, reship/refund workflows.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "The customer's query"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "product_agent",
            "description": "Product catalog, stock/size availability, recommendations, cross-sell.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "The customer's query about products"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "returns_refunds_agent",
            "description": "Return eligibility, return policy, return labels, refunds within approved limits.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "The customer's query about returns or refunds"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "billing_agent",
            "description": "Failed payments, duplicate charges, promo codes, invoices, refund processing.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "The customer's billing-related query"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "loyalty_account_agent",
            "description": "Account details, loyalty points, point redemption, subscription changes.",
            "parameters": {
                "type": "object",
                "properties": {"query": {"type": "string", "description": "The customer's account or loyalty query"}},
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "escalate_to_human",
            "description": "Frustrated customer, complex complaint, or anything outside other agents' scope.",
            "parameters": {
                "type": "object",
                "properties": {"reason": {"type": "string", "description": "Why this needs human escalation"}},
                "required": ["reason"],
            },
        },
    },
]

_SYSTEM = (
    "You are a customer service router for a plant e-commerce store. "
    "Classify the customer's message and call the single most relevant tool. "
    "Always call a tool — never respond with plain text."
)


def _build_messages(message: str, history: list) -> list:
    messages = [{"role": "system", "content": _SYSTEM}]
    for turn in history:
        role = turn.get("role", "user")
        # DB stores role as "model" — map to "assistant" for OpenAI
        if role == "model":
            role = "assistant"
        messages.append({"role": role, "content": turn.get("content", "")})
    messages.append({"role": "user", "content": message})
    return messages


def route(message: str, history: list, max_retries: int = 5, base_delay: float = 15.0):
    """
    Send the customer message to GPT-5 and get back a routing decision.
    Returns:
        {"type": "tool_use", "name": "<agent_name>", "args": {...}}
      or on fallback:
        {"type": "text", "text": "<direct reply>"}
    """
    messages = _build_messages(message, history)

    for attempt in range(max_retries):
        try:
            response = _client.chat.completions.create(
                model=GPT5,
                messages=messages,
                tools=ROUTER_TOOLS,
                tool_choice="required",   # always route — never reply directly
            )
            break
        except RateLimitError:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 2)
            print(f"[Azure rate limit] Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})...")
            time.sleep(delay)

    msg = response.choices[0].message

    if msg.tool_calls:
        tc = msg.tool_calls[0]
        try:
            args = json.loads(tc.function.arguments)
        except Exception:
            args = {}
        return {"type": "tool_use", "name": tc.function.name, "args": args}

    # Fallback — model replied directly despite tool_choice="required"
    return {"type": "text", "text": msg.content or "I'm not sure how to help with that."}


def dispatch_to_specialist(agent_name: str, args: dict, customer_id: str, history: list):
    query = args.get("query", "")
    reason = args.get("reason", "")

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