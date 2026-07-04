"""
Loyalty & Account Agent — Azure OpenAI gpt-5-mini
Handles: account details, loyalty points, redemption, subscription management.
"""
from agents.azure_client import azure_chat, GPT5_MINI

_SYSTEM = (
    "You are the Loyalty & Account specialist for a plant e-commerce store. "
    "Help customers with account details, loyalty points, point redemption, and subscription management. "
    "Be friendly and encouraging about their loyalty status."
)

# ── Tools ────────────────────────────────────────────────────────────────────

def get_account_details(customer_id: str) -> str:
    """Gets the account details for a customer by their customer ID."""
    return (
        f"Account Details for {customer_id}:\n"
        f"Name: Vibitha Varshini\n"
        f"Email: vibitha@example.com\n"
        f"Member since: January 2025\n"
        f"Tier: Gold Member"
    )

def get_loyalty_points(customer_id: str) -> str:
    """Gets the current loyalty points balance and recent point transactions for a customer."""
    return (
        f"Loyalty Points for {customer_id}:\n"
        f"Current Balance: 1,250 points\n"
        f"Points Value: ₹125 (10 points = ₹1)\n\n"
        f"Recent Transactions:\n"
        f"  +200 pts — Order #ORD-789 (Jun 28, 2026)\n"
        f"  +150 pts — Order #ORD-654 (Jun 15, 2026)\n"
        f"  -500 pts — Redeemed on Order #ORD-321 (Jun 10, 2026)"
    )

def redeem_points(customer_id: str, points: int) -> str:
    """Redeems loyalty points for a customer as a discount. Minimum redemption is 100 points."""
    if points < 100:
        return "Minimum redemption is 100 points. Please specify at least 100 points."
    available = 1250
    if points > available:
        return f"Insufficient points. You have {available} points but tried to redeem {points}."
    value = points / 10
    return (
        f"✅ Successfully redeemed {points} points (₹{value:.2f})!\n"
        f"Remaining balance: {available - points} points.\n"
        f"The discount will be applied to your next order automatically."
    )

def update_subscription(customer_id: str, action: str) -> str:
    """Updates subscription status for a customer. Action must be pause, resume, or cancel."""
    valid_actions = ["pause", "resume", "cancel"]
    if action.lower() not in valid_actions:
        return f"Invalid action '{action}'. Valid actions are: {', '.join(valid_actions)}."
    return f"✅ Subscription for {customer_id} has been {action.lower()}d successfully."

# ── Agent entry point ────────────────────────────────────────────────────────

def loyalty_account_agent(query: str, history: list, customer_id: str = "guest") -> str:
    # Inject customer context into the message
    message = f"[Customer ID: {customer_id}] {query}"
    return azure_chat(
        deployment=GPT5_MINI,
        system_prompt=_SYSTEM,
        message=message,
        history=history,
        tool_fns=[get_account_details, get_loyalty_points, redeem_points, update_subscription],
    )
