import { Suspense } from "react";
import { ChatClient } from "./ChatClient";

export const metadata = {
  title: "Talk to us — Teens Helpline",
  description: "Anonymous, judgement-free chat support for doubts, career questions, peer pressure, and stress.",
};

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-5 py-20 text-center">Loading…</div>}>
      <ChatClient />
    </Suspense>
  );
}
