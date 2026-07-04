"""
utils.py — Shared retry helper for Gemini calls (orchestrator only).
Azure agent retries are handled internally in agents/azure_client.py.
"""
import time
import random
from google.api_core.exceptions import ResourceExhausted


def send_with_retry(chat, message, max_retries=5, base_delay=15):
    """Send a Gemini message with exponential backoff on 429 quota errors."""
    for attempt in range(max_retries):
        try:
            return chat.send_message(message)
        except ResourceExhausted:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 2)
            print(f"[Gemini rate limit] Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})...")
            time.sleep(delay)
