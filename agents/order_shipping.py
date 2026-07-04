"""
Order & Shipping Agent — Azure OpenAI gpt-5-mini
Handles: order status, tracking links, delivery estimates.
"""
from agents.azure_client import azure_chat, GPT5_MINI

_SYSTEM = (
    "You are the Order & Shipping specialist for a plant e-commerce store. "
    "Help the customer with order status, tracking, and delivery queries using the provided tools. "
    "Be concise and helpful."
)

# ── Tools ────────────────────────────────────────────────────────────────────

def get_order_status(order_id: str) -> str:
    """Gets the current status of an order given its order ID."""
    return (
        f"Order {order_id} status: In Transit\n"
        f"Estimated delivery: 2-3 business days\n"
        f"Last update: Package picked up by courier"
    )

def get_tracking(order_id: str) -> str:
    """Gets the tracking link and courier details for an order."""
    return (
        f"Tracking for order {order_id}:\n"
        f"Courier: BlueDart\n"
        f"Tracking link: https://track.example.com/{order_id}\n"
        f"AWB: BD{order_id}2026"
    )

def request_reship(order_id: str, reason: str) -> str:
    """Requests a reship for a lost or damaged order."""
    return (
        f"Reship requested for order {order_id}.\n"
        f"Reason: {reason}\n"
        f"A replacement will be dispatched within 2 business days. "
        f"You will receive a confirmation email shortly."
    )

# ── Agent entry point ────────────────────────────────────────────────────────

def order_shipping_agent(query: str, history: list) -> str:
    return azure_chat(
        deployment=GPT5_MINI,
        system_prompt=_SYSTEM,
        message=query,
        history=history,
        tool_fns=[get_order_status, get_tracking, request_reship],
    )
