import Link from "next/link";
import { TOPICS } from "@/lib/topics";
import { getArticlesByTopic } from "@/lib/articles";

export const metadata = {
  title: "Guidance topics — Teens Helpline",
  description: "Structured guidance for doubt-solving, career decisions, peer pressure, and stress.",
};

const QUICK_TIPS: Record<string, string[]> = {
  doubt: [
    "Name the specific gap, not the whole topic — \"I don't get why we use this formula\" beats \"I don't get this chapter.\"",
    "Ask right after class while it's fresh, rather than waiting until revision season.",
    "If a teacher's explanation doesn't click, try a classmate's — different explanations work for different people.",
  ],
  career: [
    "A stream or degree choice shapes your next few years, not your whole life — treat the decision with proportional weight.",
    "Talk to people actually working in a field, not just people who studied it on paper.",
    "If family and personal interest conflict, bring information to the conversation, not just passion.",
  ],
  peer_pressure: [
    "A short, calm \"not my thing\" is a complete sentence — you don't owe a long justification.",
    "Notice the difference between a one-time ask and a repeated push after you've said no.",
    "Real friendships survive disagreement; what they don't survive is you constantly overriding your own judgement.",
  ],
  stress: [
    "Write worries down on paper before bed — it quiets the mental loop more than you'd expect.",
    "Break revision into something finishable today, not an unfinishable \"whole syllabus\" task.",
    "A 10-minute walk measurably lowers stress hormones — it's not just a cliché.",
  ],
};

export default function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <div className="max-w-2xl mb-14">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-4" style={{ color: "var(--ink)" }}>
          Guidance topics
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Quick, practical starting points for the four things we hear about
          most. Pick a topic to see tips, related articles, and a direct line
          to chat about it.
        </p>
      </div>

      <div className="space-y-16">
        {TOPICS.map((topic) => {
          const articles = getArticlesByTopic(topic.key);
          const tips = QUICK_TIPS[topic.key] ?? [];

          return (
            <section key={topic.key} id={topic.key}>
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl font-semibold mb-1.5" style={{ color: "var(--ink)" }}>
                    {topic.label}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    {topic.description}
                  </p>
                </div>
                <Link
                  href={`/chat?topic=${topic.key}`}
                  className="shrink-0 inline-flex items-center text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]"
                  style={{ background: "var(--evergreen)", color: "var(--paper)" }}
                >
                  Talk about this
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div
                  className="rounded-[var(--radius-md)] p-6 border"
                  style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--ink-soft)" }}>
                    Quick tips
                  </h3>
                  <ul className="space-y-3">
                    {tips.map((tip, i) => (
                      <li key={i} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                        <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "var(--amber)" }} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: "var(--ink-soft)" }}>
                    Related articles
                  </h3>
                  <ul className="space-y-3">
                    {articles.map((article) => (
                      <li key={article.slug}>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="block p-4 rounded-[var(--radius-sm)] border transition-colors hover:bg-white"
                          style={{ borderColor: "var(--mist)" }}
                        >
                          <span className="text-sm font-medium block mb-1" style={{ color: "var(--ink)" }}>
                            {article.title}
                          </span>
                          <span className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>
                            {article.readMinutes} min read
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
