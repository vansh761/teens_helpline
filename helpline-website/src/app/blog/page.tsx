import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata = {
  title: "Articles & Blog — Teens Helpline",
  description: "Practical, honest articles for teenagers on career choices, peer pressure, stress, and doubt-solving.",
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
          Articles &amp; blog
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Honest, practical writing on the things teenagers actually deal
          with — written to be read in one sitting, not skimmed past.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
