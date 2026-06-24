import Link from "next/link";

export const metadata = {
  title: "About — Teens Helpline",
  description: "What Teens Helpline is, who it's for, and how it works.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-6" style={{ color: "var(--ink)" }}>
        About Teens Helpline
      </h1>

      <div className="prose-article">
        <p>
          Teens Helpline is a support platform built specifically for
          teenagers between 13 and 19 — an age range that gets a lot of
          advice aimed either at young children or at adults, and not much
          written for exactly where you are.
        </p>
        <p>
          We focus on four things that come up constantly at this age: everyday
          doubts about schoolwork, career and stream decisions, peer pressure
          situations, and stress or anxiety that&apos;s become hard to carry alone.
        </p>

        <h2>What this site offers</h2>
        <ul>
          <li>An anonymous chat you can use without creating an account.</li>
          <li>Articles written specifically for teenagers, not adapted from adult advice.</li>
          <li>A booking dashboard where you can schedule time with real counsellors and tutors.</li>
        </ul>

        <h2>What this isn&apos;t</h2>
        <p>
          This platform is not a replacement for therapy, medical care, or
          emergency services. Our chat is designed to listen, support, and
          point you toward the right next step — not to diagnose or treat
          anything. If you&apos;re in crisis, please use the helpline numbers
          shown at the top of every page.
        </p>

        <h2>A note on this project</h2>
        <p>
          This site was built as a full-stack internship assignment,
          pairing this public-facing website with a separate booking
          dashboard for students, counsellors, and administrators.
        </p>
      </div>

      <div
        className="mt-10 rounded-[var(--radius-md)] p-6 flex items-center justify-between flex-wrap gap-4"
        style={{ background: "var(--evergreen-tint)" }}
      >
        <p className="text-sm font-medium" style={{ color: "var(--evergreen-dark)" }}>
          Ready to talk about something?
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Start a conversation
        </Link>
      </div>
    </div>
  );
}
