"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy-load the heavy panel so it doesn't affect initial page load
const AIChatPanel = dynamic(() => import("@/components/ai/AIChatPanel"), {
  ssr: false,
});

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Pulse animation to draw attention after 3s on first visit
    const timer = setTimeout(() => setPulse(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Stop pulsing once user opens the panel
  const handleOpen = () => {
    setOpen(true);
    setPulse(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Ask AI button */}
      <button
        id="ask-ai-btn"
        onClick={handleOpen}
        className={`plantai-fab ${pulse ? "plantai-fab-pulse" : ""}`}
        aria-label="Ask Plantify AI"
        title="Ask Plantify AI"
      >
        <Sparkles size={20} className="plantai-fab-icon" />
        <span className="plantai-fab-label">Ask AI</span>
      </button>

      {/* Panel (only rendered after mount) */}
      <AIChatPanel isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
