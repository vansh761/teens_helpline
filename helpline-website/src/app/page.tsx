import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { TopicCard } from "@/components/TopicCard";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";

export default function Home() {
  const recentArticles = getAllArticles().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div className="max-w-2xl">
      <span
        className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full mb-6"
        style={{ background: "var(--amber-tint)", color: "#7a4a1a" }}
      >
        For ages 13&ndash;19 &middot; Free &middot; Always judgement-free
      </span>
      <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-6" style={{ color: "var(--ink)" }}>
        Whatever you&apos;re stuck on, there&apos;s a way through it.
      </h1>
      <p className="text-lg leading-relaxed mb-9 max-w-xl" style={{ color: "var(--ink-soft)" }}>
        Teens Helpline is a space built for you — doubts about schoolwork,
        career confusion, friend group pressure, or stress that&apos;s
        getting hard to carry. Talk it through, read what&apos;s helped
        others, or book time with a real counsellor.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-[var(--radius-sm)] transition-opacity hover:opacity-90"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Start a conversation
        </Link>
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-3 rounded-[var(--radius-sm)] border transition-colors hover:bg-white"
          style={{ borderColor: "var(--mist-dark)", color: "var(--ink)" }}
        >
          Browse guidance topics
        </Link>
      </div>
    </div>

    <div className="hidden lg:block">
      <img
        src="/hero-illustration.png"
        alt="Illustration of a teenager at a signpost choosing between career, doubts, and stress guidance"
        className="w-full rounded-[var(--radius-lg)]"
      />
    </div>
  </div>
</section>

      <div className="trail-divider max-w-6xl mx-auto" />

      {/* 4 paths */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "var(--ink)" }}>
            Pick where you&apos;d like to start
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOPICS.map((topic) => (
            <TopicCard key={topic.key} topic={topic} href={`/chat?topic=${topic.key}`} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "var(--evergreen-dark)" }} className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-12" style={{ color: "var(--paper)" }}>
            How Teens Helpline works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Talk it through, anonymously",
                body: "No sign-up needed. Chat about what's on your mind and get a supportive, judgement-free response right away.",
              },
              {
                step: "02",
                title: "Read what's helped others",
                body: "Articles and guidance written specifically for teenagers navigating school, careers, friendships, and stress.",
              },
              {
                step: "03",
                title: "Book real support",
                body: "When you want more than a chat, book a session with a counsellor or tutor through our booking dashboard.",
              },
            ].map((item) => (
              <div key={item.step}>
                <span className="font-mono text-sm" style={{ color: "var(--gold-soft)" }}>
                  {item.step}
                </span>
                <h3 className="font-display text-lg font-semibold mt-3 mb-2" style={{ color: "var(--paper)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80" style={{ color: "var(--paper)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles teaser */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "var(--ink)" }}>
            From the blog
          </h2>
          <Link href="/blog" className="text-sm font-medium" style={{ color: "var(--evergreen)" }}>
            View all articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
