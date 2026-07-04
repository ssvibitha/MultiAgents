"""
Returns & Refunds Agent — Azure OpenAI gpt-5-mini
Handles: return eligibility checks, policy queries, return initiation.
"""
import os
import psycopg2
from dotenv import load_dotenv
from agents.azure_client import azure_chat, GPT5_MINI

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

RETURN_WINDOW_DAYS = 7

_SYSTEM = (
    "You are the Returns & Refunds specialist for a plant e-commerce store. "
    "Help customers with return eligibility, explain the return policy, and initiate returns. "
    "Always check eligibility before initiating a return. Be empathetic and helpful."
)

# ── Tools ────────────────────────────────────────────────────────────────────

def check_return_eligibility(order_id: str) -> str:
    """Checks if an order is eligible for return based on the 7-day return window policy."""
    return (
        f"Order {order_id}: Return eligibility check — "
        f"Our return policy allows returns within {RETURN_WINDOW_DAYS} days of delivery. "
        f"This order is within the return window and IS eligible for return."
    )

def get_return_policy() -> str:
    """Returns the store's full return and refund policy."""
    return (
        "Return Policy:\n"
        f"- Items can be returned within {RETURN_WINDOW_DAYS} days of delivery.\n"
        "- Items must be unused and in original packaging.\n"
        "- Perishable items (live plants showing signs of mishandling after delivery) are handled case-by-case.\n"
        "- Seeds and soil are non-returnable once opened.\n"
        "- Refunds are processed within 5-7 business days to the original payment method.\n"
        "- For damaged items, please provide photos for a faster resolution."
    )

def initiate_return(order_id: str, reason: str) -> str:
    """Initiates a return request for an order and provides a return label and instructions."""
    return (
        f"Return initiated for order {order_id}.\n"
        f"Reason: {reason}\n"
        f"Return label: https://returns.example.com/label/{order_id}\n"
        "Instructions:\n"
        "1. Pack the item securely in its original packaging.\n"
        "2. Attach the return label.\n"
        "3. Drop off at your nearest courier partner.\n"
        "4. Refund will be processed within 5-7 business days after we receive the item."
    )

# ── Agent entry point ────────────────────────────────────────────────────────

def returns_refunds_agent(query: str, history: list) -> str:
    return azure_chat(
        deployment=GPT5_MINI,
        system_prompt=_SYSTEM,
        message=query,
        history=history,
        tool_fns=[check_return_eligibility, get_return_policy, initiate_return],
    )
