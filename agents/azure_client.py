"""
Shared Azure OpenAI client and helper for all specialist agents.

Usage in an agent:
    from agents.azure_client import azure_chat

    reply = azure_chat(
        deployment="gpt-5-mini",        # or "gpt-5"
        system_prompt="You are ...",
        tools=[...],                    # list of OpenAI tool dicts (optional)
        history=[...],                  # list of {"role": ..., "content": ...}
        message="user query here",
        json_mode=False,                # set True for structured JSON output
    )
"""
import os
import time
import random
import json
from openai import AzureOpenAI
from openai import RateLimitError, APIStatusError
from dotenv import load_dotenv

load_dotenv()

_client = AzureOpenAI(
    azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
    api_key=os.environ["AZURE_OPENAI_API_KEY"],
    api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-01-01-preview"),
)

# Deployment names read from env so they're easy to change
GPT5 = os.environ.get("AZURE_DEPLOYMENT_GPT5", "gpt-5")
GPT5_MINI = os.environ.get("AZURE_DEPLOYMENT_GPT5_MINI", "gpt-5-mini")


def _run_tool_loop(deployment, messages, tools, json_mode, max_tool_rounds=5):
    """Run the model + automatic tool-call loop, return final text reply."""
    for _ in range(max_tool_rounds):
        kwargs = dict(
            model=deployment,
            messages=messages,
        )
        if tools:
            kwargs["tools"] = tools
            kwargs["tool_choice"] = "auto"
        if json_mode:
            kwargs["response_format"] = {"type": "json_object"}

        response = _client.chat.completions.create(**kwargs)
        msg = response.choices[0].message

        # No tool calls → we have the final text answer
        if not msg.tool_calls:
            return msg.content or ""

        # Append the assistant's tool-call turn
        messages.append({"role": "assistant", "tool_calls": [
            {
                "id": tc.id,
                "type": "function",
                "function": {"name": tc.function.name, "arguments": tc.function.arguments},
            }
            for tc in msg.tool_calls
        ]})

        # Execute each tool call and append its result
        for tc in msg.tool_calls:
            fn_name = tc.function.name
            fn_args = json.loads(tc.function.arguments)
            # Look up the callable from the registered tools
            fn_callable = _TOOL_REGISTRY.get(fn_name)
            if fn_callable:
                try:
                    result = fn_callable(**fn_args)
                except Exception as e:
                    result = f"Error calling {fn_name}: {e}"
            else:
                result = f"Tool '{fn_name}' not found."

            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": str(result),
            })

    return "I was unable to complete the request after several attempts."


# Global registry mapping function name → callable (populated by each agent)
_TOOL_REGISTRY: dict = {}


def register_tools(tool_fns: list):
    """Register Python callables so the tool loop can invoke them."""
    for fn in tool_fns:
        _TOOL_REGISTRY[fn.__name__] = fn


def python_fn_to_openai_tool(fn) -> dict:
    """
    Convert a plain Python function with a docstring into an OpenAI tool dict.
    Uses the function's __name__ and __doc__ for description.
    Parameters are inferred from the type annotations (str, int, float only).
    """
    import inspect
    sig = inspect.signature(fn)
    properties = {}
    required = []
    type_map = {str: "string", int: "integer", float: "number", bool: "boolean"}

    for name, param in sig.parameters.items():
        annotation = param.annotation
        json_type = type_map.get(annotation, "string")
        properties[name] = {"type": json_type, "description": name.replace("_", " ")}
        if param.default is inspect.Parameter.empty:
            required.append(name)

    return {
        "type": "function",
        "function": {
            "name": fn.__name__,
            "description": (fn.__doc__ or "").strip(),
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": required,
            },
        },
    }


def azure_chat(
    deployment: str,
    system_prompt: str,
    message: str,
    history: list = None,
    tool_fns: list = None,
    json_mode: bool = False,
    max_retries: int = 5,
    base_delay: float = 15.0,
) -> str:
    """
    Send a message to Azure OpenAI with automatic tool-call execution and
    exponential backoff on 429 rate-limit errors.

    Args:
        deployment:    Azure deployment name (GPT5 or GPT5_MINI constant).
        system_prompt: System instruction string.
        message:       The user's query.
        history:       Prior conversation as [{"role": ..., "content": ...}].
        tool_fns:      Python callables to expose as tools (auto-converted).
        json_mode:     If True, forces JSON output format.
        max_retries:   Max retry attempts on rate-limit.
        base_delay:    Base seconds for exponential backoff.
    """
    # Build the messages list
    messages = [{"role": "system", "content": system_prompt}]
    for turn in (history or []):
        role = turn.get("role")
        content = turn.get("content", "")
        if role in ("user", "model", "assistant"):
            messages.append({"role": "user" if role == "user" else "assistant", "content": content})
    messages.append({"role": "user", "content": message})

    # Convert Python callables → OpenAI tool schema & register them
    tools = None
    if tool_fns:
        register_tools(tool_fns)
        tools = [python_fn_to_openai_tool(fn) for fn in tool_fns]

    for attempt in range(max_retries):
        try:
            return _run_tool_loop(deployment, messages, tools, json_mode)
        except RateLimitError as e:
            if attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 2)
            print(f"[Azure rate limit] Retrying in {delay:.1f}s (attempt {attempt + 1}/{max_retries})...")
            time.sleep(delay)
        except APIStatusError as e:
            raise

    return "Service temporarily unavailable. Please try again."
