"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { TOPICS, getTopic, type TopicKey } from "@/lib/topics";
import { API_BASE_URL } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  text: string;
  flagged?: boolean;
}

function getOrCreateSessionId(): string {
  const key = "th_chat_session_id";
  let id = typeof window !== "undefined" ? window.sessionStorage.getItem(key) : null;
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    if (typeof window !== "undefined") window.sessionStorage.setItem(key, id);
  }
  return id;
}

export function ChatClient() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") as TopicKey | null;

  const [topic, setTopic] = useState<TopicKey | null>(initialTopic);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const activeTopic = getTopic(topic ?? undefined);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          message: text,
          category: topic ?? undefined,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data: { reply: string; flagged_for_crisis: boolean } = await res.json();

      setMessages((prev) => [...prev, { role: "assistant", text: data.reply, flagged: data.flagged_for_crisis }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "I couldn't reach the server just now. Please try again in a moment, or check the Resources page in the meantime.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col" style={{ minHeight: "calc(100vh - 180px)" }}>
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
          Talk to us
        </h1>
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          Anonymous, no sign-up needed. Nothing here is shared with anyone you know.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {TOPICS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTopic(t.key)}
            className="text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors"
            style={
              topic === t.key
                ? { background: "var(--evergreen)", color: "var(--paper)", borderColor: "var(--evergreen)" }
                : { background: "var(--paper-raised)", color: "var(--ink-soft)", borderColor: "var(--mist)" }
            }
          >
            {t.shortLabel}
          </button>
        ))}
      </div>

      <div
        className="flex-1 rounded-[var(--radius-md)] border p-5 mb-4 flex flex-col gap-4 overflow-y-auto"
        style={{ background: "var(--paper-raised)", borderColor: "var(--mist)", minHeight: "320px", maxHeight: "55vh" }}
      >
        {messages.length === 0 && (
          <div className="m-auto text-center max-w-sm py-8">
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {activeTopic
                ? `Start by telling us what's going on with ${activeTopic.label.toLowerCase()}.`
                : "Pick a topic above, or just start typing — we'll figure it out together."}
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-[var(--radius-md)] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
              style={
                m.role === "user"
                  ? { background: "var(--evergreen)", color: "var(--paper)" }
                  : { background: "var(--mist)", color: "var(--ink)" }
              }
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-[var(--radius-md)] px-4 py-2.5 text-sm" style={{ background: "var(--mist)", color: "var(--ink-soft)" }}>
              Thinking…
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type what's on your mind…"
          className="flex-1 px-4 py-3 rounded-[var(--radius-sm)] border text-sm outline-none"
          style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-[var(--radius-sm)] text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Send
        </button>
      </form>

      <p className="text-xs mt-4 text-center" style={{ color: "var(--ink-soft)" }}>
        This chat offers support, not therapy. In a crisis, contact Tele-MANAS at 14416, available 24/7.
      </p>
    </div>
  );
}
