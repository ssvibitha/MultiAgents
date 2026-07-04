"""
Billing Agent — Azure OpenAI gpt-5
Handles: payment status, duplicate charges, refunds (with hard ₹2000 guardrail), promo codes.

Uses gpt-5 (not mini) because:
- Hard refund limit guardrail must not be bypassed
- Accurate financial reasoning matters more than speed/cost here
"""
import os
import psycopg2
from dotenv import load_dotenv
from agents.azure_client import azure_chat, GPT5

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

AUTO_REFUND_LIMIT = 2000  # ₹2000 — refunds above this MUST be escalated

_SYSTEM = (
    "You are the Billing specialist for a plant e-commerce store. "
    "Help customers with payment issues, duplicate charges, refunds, and promo codes. "
    f"CRITICAL GUARDRAIL: You can ONLY auto-approve refunds up to ₹{AUTO_REFUND_LIMIT}. "
    "For refunds above this amount, use apply_refund — it will automatically escalate. "
    "Always verify payment status before processing refunds. Be clear and professional."
)

# ── Tools ────────────────────────────────────────────────────────────────────

def check_payment_status(order_id: str) -> str:
    """Checks the payment status, method, and amount for a given order ID."""
    return (
        f"Payment for order {order_id}:\n"
        f"Status: Paid\n"
        f"Method: UPI\n"
        f"Amount: ₹580.00\n"
        f"Transaction ID: TXN-{order_id}-2026"
    )

def check_for_duplicate_charge(order_id: str) -> str:
    """Checks whether there are any duplicate charges for a given order."""
    return (
        f"Duplicate charge check for order {order_id}:\n"
        f"No duplicate charges found. Only one successful transaction recorded."
    )

def apply_refund(order_id: str, amount: float, reason: str) -> str:
    """Applies a refund for an order. Refunds above ₹2000 are automatically escalated and cannot be processed by this agent."""
    # HARD GUARDRAIL — enforced in code, not just the prompt
    if amount > AUTO_REFUND_LIMIT:
        return (
            f"⚠️ REFUND BLOCKED — Amount ₹{amount:.2f} exceeds the auto-approval limit of ₹{AUTO_REFUND_LIMIT:.2f}.\n"
            f"This refund request for order {order_id} has been ESCALATED to a human agent for manual review.\n"
            f"Reason provided: {reason}\n"
            f"The customer will be contacted within 24 hours."
        )
    return (
        f"✅ Refund processed successfully!\n"
        f"Order: {order_id}\n"
        f"Amount: ₹{amount:.2f}\n"
        f"Reason: {reason}\n"
        f"Refund will appear in the original payment method within 5-7 business days."
    )

def validate_promo_code(promo_code: str) -> str:
    """Validates a promotional code and returns its discount details and validity."""
    promos = {
        "PLANT10": "10% off on all indoor plants. Valid until July 31, 2026.",
        "WELCOME20": "₹20 off on first order above ₹200. One-time use.",
        "FREESHIP": "Free shipping on orders above ₹500. No expiry.",
    }
    if promo_code.upper() in promos:
        return f"Promo code '{promo_code.upper()}' is valid: {promos[promo_code.upper()]}"
    return f"Promo code '{promo_code}' is invalid or expired."

# ── Agent entry point ────────────────────────────────────────────────────────

def billing_agent(query: str, history: list) -> str:
    return azure_chat(
        deployment=GPT5,  # Full gpt-5 for financial accuracy
        system_prompt=_SYSTEM,
        message=query,
        history=history,
        tool_fns=[check_payment_status, check_for_duplicate_charge, apply_refund, validate_promo_code],
    )
