import Link from "next/link";
import type { Topic } from "@/lib/topics";

const ACCENT_STYLES: Record<Topic["accent"], { bg: string; fg: string; ring: string }> = {
  evergreen: { bg: "var(--evergreen-tint)", fg: "var(--evergreen-dark)", ring: "var(--evergreen)" },
  amber: { bg: "var(--amber-tint)", fg: "#7a4a1a", ring: "var(--amber)" },
  sky: { bg: "var(--sky-tint)", fg: "#2c4a55", ring: "var(--sky)" },
};

export function TopicCard({ topic, href }: { topic: Topic; href: string }) {
  const styles = ACCENT_STYLES[topic.accent];
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-6 rounded-[var(--radius-md)] border transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--paper-raised)",
        borderColor: "var(--mist)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div>
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-[var(--radius-sm)] mb-4 text-sm font-semibold"
          style={{ background: styles.bg, color: styles.fg }}
        >
          {topic.shortLabel.charAt(0)}
        </span>
        <h3 className="font-display text-lg font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
          {topic.label}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          {topic.description}
        </p>
      </div>
      <span
        className="inline-flex items-center gap-1 text-sm font-medium mt-5 group-hover:gap-2 transition-all"
        style={{ color: styles.ring }}
      >
        Explore
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
