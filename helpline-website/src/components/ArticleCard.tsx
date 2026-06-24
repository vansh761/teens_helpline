import Link from "next/link";
import type { Article } from "@/lib/articles";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col p-6 rounded-[var(--radius-md)] border transition-all hover:-translate-y-0.5"
      style={{ background: "var(--paper-raised)", borderColor: "var(--mist)", boxShadow: "var(--shadow-soft)" }}
    >
      <span className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--sky)" }}>
        {article.publishedLabel}
      </span>
      <h3 className="font-display text-lg font-semibold leading-snug mb-2.5" style={{ color: "var(--ink)" }}>
        {article.title}
      </h3>
      <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--ink-soft)" }}>
        {article.excerpt}
      </p>
      <span className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
        {article.readMinutes} min read
      </span>
    </Link>
  );
}
