import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { getTopic } from "@/lib/topics";

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Teens Helpline`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  ...
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const topic = getTopic(article.topic);

  return (
    <article className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <Link href="/blog" className="text-sm font-medium inline-flex items-center gap-1 mb-8" style={{ color: "var(--evergreen)" }}>
        ← All articles
      </Link>

      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sky)" }}>
        {article.publishedLabel}
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight mt-3 mb-4" style={{ color: "var(--ink)" }}>
        {article.title}
      </h1>
      <p className="text-sm font-mono mb-10" style={{ color: "var(--ink-soft)" }}>
        {article.readMinutes} min read
      </p>

      <div className="prose-article" dangerouslySetInnerHTML={{ __html: article.body }} />

      <div className="trail-divider my-10" />

      <div
        className="rounded-[var(--radius-md)] p-6"
        style={{ background: "var(--evergreen-tint)" }}
      >
        <p className="text-sm font-medium mb-3" style={{ color: "var(--evergreen-dark)" }}>
          Want to talk through something related to {topic?.label.toLowerCase() ?? "this"}?
        </p>
        <Link
          href={`/chat?topic=${article.topic}`}
          className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Start a conversation
        </Link>
      </div>
    </article>
  );
}
