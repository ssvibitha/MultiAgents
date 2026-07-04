"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import {
  X,
  Send,
  Sparkles,
  Leaf,
  ShoppingCart,
  RotateCcw,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ── Suggestion chips shown on first open ────────────────────────────────────
const SUGGESTIONS = [
  "🌿 Best indoor plants for beginners",
  "📦 Where is my order?",
  "💰 How do I use my loyalty points?",
  "↩️ What's your return policy?",
  "🌸 Recommend a flowering plant",
];

// ── Parse AI reply: detect product-like mentions and render cards ────────────
function parseMessageContent(text) {
  const productLineRegex = /^[-•]\s+(.+?)\s*[\(（]₹([\d,]+(?:\.\d+)?)[\)）]/gm;
  const products = [];
  let match;
  while ((match = productLineRegex.exec(text)) !== null) {
    products.push({ name: match[1].trim(), price: match[2] });
  }
  const cleanText = text
    .replace(productLineRegex, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { cleanText, products };
}

// ── Message bubble ───────────────────────────────────────────────────────────
function Message({ msg, onAddToCart }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <div className="fw-flex fw-justify-end fw-mb-3">
        <div className="fw-user-bubble">{msg.content}</div>
      </div>
    );
  }

  const { cleanText, products } = parseMessageContent(msg.content);

  return (
    <div className="fw-flex fw-gap-2 fw-mb-4">
      <div className="fw-bot-avatar"><Leaf size={14} /></div>
      <div className="fw-flex-1">
        {cleanText && (
          <div className="fw-bot-bubble">
            {cleanText.split("\n").map((line, i) => (
              <p key={i} style={{ margin: line === "" ? "4px 0" : "2px 0", lineHeight: 1.6 }}>
                {line}
              </p>
            ))}
          </div>
        )}
        {products.length > 0 && (
          <div className="fw-product-grid">
            {products.map((p, i) => (
              <ProductCard key={i} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
        {msg.agent && msg.agent !== "orchestrator" && msg.agent !== "system" && (
          <span className="fw-agent-badge">{agentLabel(msg.agent)}</span>
        )}
      </div>
    </div>
  );
}

function agentLabel(agent) {
  const map = {
    order_shipping_agent: "📦 Order & Shipping",
    product_agent: "🌿 Product Specialist",
    returns_refunds_agent: "↩️ Returns",
    billing_agent: "💳 Billing",
    loyalty_account_agent: "⭐ Loyalty & Account",
    escalate_to_human: "🧑 Human Support",
  };
  return map[agent] || agent;
}

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  return (
    <div className="fw-product-card">
      <div className="fw-product-icon">🌱</div>
      <div className="fw-product-info">
        <p className="fw-product-name">{product.name}</p>
        <p className="fw-product-price">₹{product.price}</p>
      </div>
      <button
        onClick={handleAdd}
        className={`fw-add-btn ${added ? "fw-add-btn-added" : ""}`}
        title="Add to cart"
      >
        {added ? "✓" : <ShoppingCart size={14} />}
      </button>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="fw-flex fw-gap-2 fw-mb-4">
      <div className="fw-bot-avatar"><Leaf size={14} /></div>
      <div className="fw-bot-bubble fw-typing">
        <span /><span /><span />
      </div>
    </div>
  );
}

// ── Main full-window chat ─────────────────────────────────────────────────────
export default function AIChatPanel({ isOpen, onClose }) {
  const { data: session } = useSession();
  const { addItem } = useCart();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const customerId = session?.user?.email ?? "guest";

  const sendMessage = useCallback(async (text) => {
    const userText = text.trim();
    if (!userText || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, customer_id: customerId, message: userText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data?.detail?.message || data?.error || "Something went wrong. Please try again.",
          agent: "system",
        }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply, agent: data.agent }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again shortly.",
        agent: "system",
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, sessionId, customerId]);

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input); };

  const handleAddToCart = (product) => {
    const id = `ai-${product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    addItem({ id, slug: id, name: product.name, price: parseFloat(String(product.price).replace(/,/g, "")), image: null, quantity: 1 });
  };

  const clearChat = () => setMessages([]);
  const isEmpty = messages.length === 0;

  return (
    <div className={`fw-overlay ${isOpen ? "fw-overlay-open" : ""}`}>

      {/* ── Full-window container ── */}
      <div className={`fw-window ${isOpen ? "fw-window-open" : ""}`}>

        {/* ── Header ── */}
        <div className="fw-header">
          <div className="fw-header-left">
            <div className="fw-header-icon"><Sparkles size={20} /></div>
            <div>
              <h2 className="fw-header-title">Ask Plantify AI</h2>
              <p className="fw-header-sub">Multi-agent · Product · Orders · Returns · Billing</p>
            </div>
          </div>
          <div className="fw-header-right">
            {!isEmpty && (
              <button className="fw-icon-btn" onClick={clearChat} title="Clear chat">
                <RotateCcw size={16} />
              </button>
            )}
            <button className="fw-icon-btn" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── Content: welcome or messages ── */}
        <div className="fw-content">
          {isEmpty ? (
            <div className="fw-welcome">
              <div className="fw-welcome-emoji">🌿</div>
              <h3 className="fw-welcome-title">
                Hi{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}! How can I help?
              </h3>
              <p className="fw-welcome-sub">
                Ask me anything about plants, your orders, returns, billing, or loyalty points.
              </p>
              <div className="fw-chips">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="fw-chip"
                    onClick={() => sendMessage(s.replace(/^[^\s]+\s/, ""))}
                  >
                    {s}
                    <ChevronRight size={14} style={{ flexShrink: 0, color: "#7F9360" }} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="fw-messages">
              {messages.map((msg, i) => (
                <Message key={i} msg={msg} onAddToCart={handleAddToCart} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ── Input bar ── */}
        <div className="fw-input-area">
          <form onSubmit={handleSubmit} className="fw-input-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plants, orders, returns, billing..."
              className="fw-input"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="fw-send-btn"
              title="Send"
            >
              {loading
                ? <Loader2 size={20} className="fw-spin" />
                : <Send size={18} />}
            </button>
          </form>
          <p className="fw-disclaimer">
            AI responses may not always be accurate. Verify important details.
          </p>
        </div>

      </div>
    </div>
  );
}
