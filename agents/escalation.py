"""
Escalation Agent — Azure OpenAI gpt-5-mini with JSON mode
Produces a structured JSON summary for human support agents.
"""
import json
from agents.azure_client import azure_chat, GPT5_MINI

_SYSTEM = (
    "You are the Escalation specialist. Your ONLY job is to produce a structured JSON summary "
    "of the customer's issue for a human support agent. Analyze the full conversation history "
    "and produce a JSON object with these exact fields:\n"
    "{\n"
    '  "customer_id": "the customer ID",\n'
    '  "issue_summary": "brief 1-2 sentence summary of the issue",\n'
    '  "category": "one of: billing, order, product, returns, account, other",\n'
    '  "what_was_tried": ["list of actions already attempted by the AI agents"],\n'
    '  "sentiment": "one of: frustrated, neutral, satisfied",\n'
    '  "priority": "one of: low, medium, high, urgent",\n'
    '  "recommended_action": "what the human agent should do next"\n'
    "}\n\n"
    "Return ONLY the JSON object, no other text."
)

def escalation_agent(reason: str, history: list, customer_id: str = "guest") -> str:
    message = (
        f"Customer ID: {customer_id}\n"
        f"Escalation Reason: {reason}\n\n"
        "Please analyze the conversation history above and produce the structured JSON summary."
    )

    raw = azure_chat(
        deployment=GPT5_MINI,
        system_prompt=_SYSTEM,
        message=message,
        history=history,
        json_mode=True,  # Forces valid JSON output via Azure response_format
    )

    try:
        # Strip any accidental markdown fences
        clean = raw.strip()
        if clean.startswith("```"):
            clean = clean.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        parsed = json.loads(clean)
        parsed.setdefault("customer_id", customer_id)
        parsed.setdefault("issue_summary", reason)
        parsed.setdefault("category", "other")
        parsed.setdefault("what_was_tried", [])
        parsed.setdefault("sentiment", "neutral")
        parsed.setdefault("priority", "medium")
        parsed.setdefault("recommended_action", "Review conversation and contact customer.")
        return json.dumps(parsed, indent=2)

    except (json.JSONDecodeError, ValueError):
        fallback = {
            "customer_id": customer_id,
            "issue_summary": reason,
            "category": "other",
            "what_was_tried": ["AI agents attempted to assist but could not resolve"],
            "sentiment": "frustrated",
            "priority": "high",
            "recommended_action": "Review full conversation and contact customer directly.",
        }
        return json.dumps(fallback, indent=2)
