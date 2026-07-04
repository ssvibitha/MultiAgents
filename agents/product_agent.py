"""
Product Agent — Azure OpenAI gpt-5-mini
Handles: product search, availability checks, recommendations.
"""
import os
import psycopg2
from dotenv import load_dotenv
from agents.azure_client import azure_chat, GPT5_MINI

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

_SYSTEM = (
    "You are the Product specialist for a plant e-commerce store. "
    "Help the customer find products, check availability, and get details. "
    "Use search_products to find products and get_product_details for specifics. "
    "Be concise, helpful, and recommend related products when appropriate."
)

# ── Tools ────────────────────────────────────────────────────────────────────

def _get_db_connection():
    return psycopg2.connect(DATABASE_URL)


def search_products(keyword: str) -> str:
    """Searches the product catalog for products matching a keyword. Returns names, prices, and stock levels."""
    conn = _get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT p.title, p."basePrice", p.stock, c.name as category
            FROM "Product" p
            JOIN "Category" c ON p."categoryId" = c.id
            WHERE p."isActive" = true
              AND (p.title ILIKE %s OR p.description ILIKE %s OR c.name ILIKE %s)
            ORDER BY p."isFeatured" DESC, p.title ASC
            LIMIT 10
            ''',
            (f'%{keyword}%', f'%{keyword}%', f'%{keyword}%')
        )
        rows = cur.fetchall()
        cur.close()
    finally:
        conn.close()

    if not rows:
        return f"No products found matching '{keyword}'."

    results = []
    for title, price, stock, category in rows:
        stock_status = f"{stock} in stock" if stock > 0 else "Out of stock"
        results.append(f"- {title} (₹{price}) [{category}] — {stock_status}")
    return "\n".join(results)


def get_product_details(product_name: str) -> str:
    """Gets detailed information about a specific product by name, including description, price, stock, and brand."""
    conn = _get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT p.title, p.description, p."basePrice", p."compareAtPrice",
                   p.stock, p.brand, c.name as category, p.sku
            FROM "Product" p
            JOIN "Category" c ON p."categoryId" = c.id
            WHERE p."isActive" = true AND p.title ILIKE %s
            LIMIT 1
            ''',
            (f'%{product_name}%',)
        )
        row = cur.fetchone()
        cur.close()
    finally:
        conn.close()

    if not row:
        return f"Product '{product_name}' not found."

    title, desc, price, compare_price, stock, brand, category, sku = row
    stock_status = f"{stock} in stock" if stock > 0 else "Out of stock"
    details = f"Name: {title}\nDescription: {desc}\nPrice: ₹{price}"
    if compare_price:
        details += f" (was ₹{compare_price})"
    details += f"\nBrand: {brand}\nCategory: {category}\nSKU: {sku}\nAvailability: {stock_status}"
    return details

# ── Agent entry point ────────────────────────────────────────────────────────

def product_agent(query: str, history: list) -> str:
    return azure_chat(
        deployment=GPT5_MINI,
        system_prompt=_SYSTEM,
        message=query,
        history=history,
        tool_fns=[search_products, get_product_details],
    )
