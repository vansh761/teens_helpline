import type { TopicKey } from "./topics";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  topic: TopicKey;
  readMinutes: number;
  publishedLabel: string;
  body: string; // markdown-ish HTML-safe paragraphs, rendered via dangerouslySetInnerHTML in a controlled way
}

export const ARTICLES: Article[] = [
  {
    slug: "choosing-a-stream-after-10th",
    title: "Choosing a stream after 10th: a calmer way to decide",
    excerpt:
      "Science, commerce, or arts — the decision feels huge because everyone treats it like it's permanent. It isn't. Here's how to actually think it through.",
    topic: "career",
    readMinutes: 6,
    publishedLabel: "Career guidance",
    body: `
<p>If you're choosing a stream right now, you've probably already heard a dozen opinions — from relatives, from seniors, from random forums. Most of that advice skips the actual question: what do <em>you</em> want to spend the next two years thinking about?</p>

<h2>Start with what you enjoy doing without being told to</h2>
<p>Not what you're good at on paper — what you actually gravitate toward when no one's grading you. Do you find yourself reading about how things work, or how people behave, or how money moves, or how to make things look or sound good? That instinct is more honest than a rank list.</p>

<h2>The stream is not a life sentence</h2>
<p>Plenty of people switch fields after 12th, after their degree, even after a few years of working. A commerce student can become a UX designer. A science student can end up in policy or journalism. Choosing a stream sets up your next two years, not your entire future — treat the decision with that proportion of seriousness, not more.</p>

<h2>Questions worth asking yourself</h2>
<ul>
<li>Which subjects do I keep choosing to read more about, even outside class?</li>
<li>Do I want a path with more flexibility later (arts, commerce) or more structure (science)?</li>
<li>Am I choosing this because of genuine interest, or because of pressure to "keep options open"?</li>
<li>What would I choose if no one I knew would find out?</li>
</ul>

<h2>If you're still unsure</h2>
<p>That's completely normal at this age. Talk to teachers across different subjects, not just your favourite one. Ask people already in a stream what their actual day-to-day study looks like, not just the glamorous bits. And if you want to talk it through with someone directly, our counsellors run career guidance sessions you can book through the dashboard.</p>
`,
  },
  {
    slug: "when-your-friend-group-pressures-you",
    title: "When your friend group pressures you into something you don't want",
    excerpt:
      "Saying no to your friends feels riskier than it actually is. A practical guide to holding your ground without blowing up the friendship.",
    topic: "peer_pressure",
    readMinutes: 5,
    publishedLabel: "Peer pressure",
    body: `
<p>Peer pressure rarely looks like a villain in a movie. It's usually just a friend saying "come on, it's not a big deal" — and the fear isn't really about the thing itself, it's about what happens to the friendship if you say no.</p>

<h2>Why saying no feels so much bigger than it is</h2>
<p>At your age, your friend group can feel like your entire social world. Disagreeing with them can feel like risking all of it. But real friendships survive disagreement — what they don't survive long-term is one person constantly overriding their own judgement to keep the peace.</p>

<h2>A few ways to say no that don't sound like a lecture</h2>
<ul>
<li>"Not my thing, but you guys go ahead" — short, no drama, keeps you in the group without joining the activity.</li>
<li>"I'm good, I'll catch up with you after" — works for situations you want to exit without explaining yourself.</li>
<li>Just a flat "nah, I'm not feeling it today" — repeated calmly, without over-explaining, is surprisingly effective.</li>
</ul>

<h2>If the pressure keeps escalating</h2>
<p>Notice if it's a one-time ask versus a pattern. A friend who keeps pushing after you've said no clearly isn't really asking — they're testing whether you'll hold your line. That's useful information about the friendship, even if it's uncomfortable to sit with.</p>

<h2>You don't have to figure this out alone</h2>
<p>If a situation feels like it's gone beyond "awkward" into something that worries you, talk to a trusted adult or chat with us. You don't need a dramatic reason to ask for help thinking it through.</p>
`,
  },
  {
    slug: "exam-stress-that-wont-switch-off",
    title: "What to do when exam stress won't switch off at night",
    excerpt:
      "Lying awake running through everything you haven't finished is exhausting and it doesn't actually help you study better. Here's what does.",
    topic: "stress",
    readMinutes: 7,
    publishedLabel: "Stress & anxiety",
    body: `
<p>There's a specific kind of tired that comes from exam stress — not from studying itself, but from the constant low hum of worry running in the background, even when you're not actively revising.</p>

<h2>Why your brain won't let go of it</h2>
<p>Stress keeps your brain in a kind of "watch for danger" mode, and an exam genuinely registers as a threat to your brain's alarm system, even though no tiger is actually chasing you. That's why you can feel tired and wired at the same time — exhausted, but unable to switch off.</p>

<h2>Things that actually help, not just distract</h2>
<ul>
<li><strong>Write down the worry, not just the to-do list.</strong> "I'm worried I'll forget chapter 4 in the exam" written down on paper is often enough to quiet the loop in your head, because your brain stops needing to hold onto it.</li>
<li><strong>Break revision into something you can finish today,</strong> not "finish the whole syllabus." An unfinishable task creates constant low-grade anxiety because there's no point at which your brain gets to feel done.</li>
<li><strong>Protect your sleep window deliberately.</strong> Staying up later to cram usually costs you more the next day than it gives you that night — tired memory consolidation is worse, not better.</li>
<li><strong>Move your body for ten minutes.</strong> A short walk or stretch genuinely lowers stress hormones; it's not just a cliché adults repeat.</li>
</ul>

<h2>When it's more than exam nerves</h2>
<p>If the anxiety is constant — not just before tests, but most days, affecting your sleep, appetite, or ability to enjoy anything — that's worth talking to someone about directly, whether that's a school counsellor, a parent, or one of our counsellors through the booking dashboard. Persistent anxiety isn't a personal failing, and it responds well to support.</p>

<p style="margin-top:1.5rem;">If you ever feel like things are too much to carry, Tele-MANAS (14416) and KIRAN (1800-599-0019) are free, confidential, and available 24/7 in India.</p>
`,
  },
  {
    slug: "how-to-actually-ask-for-help-with-a-subject",
    title: "How to actually ask for help with a subject you're falling behind in",
    excerpt:
      "Most students wait until they're badly behind before asking for help, because asking feels embarrassing. It doesn't have to be — here's a better approach.",
    topic: "doubt",
    readMinutes: 5,
    publishedLabel: "Doubt solving",
    body: `
<p>There's a strange logic that kicks in when you're behind in a subject: the further behind you fall, the harder it feels to ask, because now you'd also have to admit how far behind you are. That logic keeps a lot of students stuck.</p>

<h2>Reframe what "behind" actually means</h2>
<p>Being behind in one topic doesn't mean you're bad at the subject — it usually means one specific concept didn't click, and everything built on top of it has felt shaky since. Find that one concept, and a lot of the later confusion often resolves on its own.</p>

<h2>A simple way to ask for help that doesn't feel exposing</h2>
<p>Instead of "I don't understand this chapter," try being specific: "I get the formula, but I don't understand why we use this method instead of that one." Specific questions get specific answers, and they don't require you to admit total confusion — just one honest gap.</p>

<h2>Where to actually go</h2>
<ul>
<li>A teacher, right after class, when there's less pressure than raising your hand in front of everyone.</li>
<li>A classmate who's clearly comfortable with the topic — peer explanations are often more direct.</li>
<li>A tutor for that specific subject, if the gap has been building for a while — you can book subject-specific tuition sessions through the dashboard.</li>
<li>Our chat, anytime, if you just want to talk through what's confusing you before deciding next steps.</li>
</ul>

<h2>The part that actually matters</h2>
<p>Asking early is always cheaper than asking late — not just in time, but in how much pressure you're carrying by the time you finally do it. There's no version of "too small a question" that's actually true.</p>
`,
  },
  {
    slug: "talking-to-parents-about-career-choices",
    title: "Talking to your parents about a career choice they don't understand",
    excerpt:
      "When your interest doesn't match what your family expected, the conversation can feel impossible. It's not — but it does need a strategy.",
    topic: "career",
    readMinutes: 6,
    publishedLabel: "Career guidance",
    body: `
<p>A lot of career conversations with parents go badly not because parents don't care, but because both sides are arguing from fear instead of information. Yours is the fear of being misunderstood. Theirs is usually the fear of you struggling financially or socially.</p>

<h2>Understand what they're actually afraid of</h2>
<p>Most parental resistance to an unconventional path isn't really about the path — it's about uncertainty. "Will this actually lead to a stable life?" is the real question underneath "why don't you just do engineering." If you can answer that underlying question with real information, the conversation changes.</p>

<h2>Come with information, not just passion</h2>
<p>Passion convinces you. Information is what convinces a worried parent. Before the conversation, find out: what does this field actually pay early on? What's the realistic path — internships, portfolio, specific courses? Who has done this successfully that you can point to? Showing you've done the homework changes how seriously you're taken.</p>

<h2>Propose a middle path if it helps</h2>
<p>You don't always have to win the argument outright. "Let me try this alongside my regular studies for six months and we'll revisit it" is often an easier yes than "I'm abandoning the safe path entirely." Time and evidence are persuasive in ways a single conversation isn't.</p>

<h2>If the conversation keeps breaking down</h2>
<p>Sometimes it helps to have a neutral third person in the room — a relative both sides trust, or a career counsellor who can speak to both the practical realities and your genuine interest without either side feeling like they're losing. That's exactly the kind of session our counsellors run.</p>
`,
  },
  {
    slug: "recognising-burnout-before-it-hits-hard",
    title: "Recognising burnout before it hits you hard",
    excerpt:
      "Burnout in teenagers doesn't always look like exhaustion — sometimes it looks like suddenly not caring about things you used to love. Here's how to catch it early.",
    topic: "stress",
    readMinutes: 6,
    publishedLabel: "Stress & anxiety",
    body: `
<p>Burnout has a reputation as something that happens to tired adults in office jobs, but it shows up in students too — and it often gets mistaken for laziness, both by the student experiencing it and by people around them.</p>

<h2>What it actually looks like</h2>
<ul>
<li>Things you used to enjoy now feel flat or pointless, not just tiring.</li>
<li>You're putting in hours of "studying" but very little is actually sinking in.</li>
<li>Small tasks that used to take ten minutes start feeling unbearable.</li>
<li>You feel guilty resting, but resting doesn't actually make you feel recharged anyway.</li>
</ul>

<h2>Why it's easy to miss in yourself</h2>
<p>Burnout creeps in slowly, so the comparison point you're using is yesterday, not three months ago — and yesterday looked almost the same as today. It's often a parent, friend, or teacher who notices the shift before you do, which is part of why talking to someone matters here.</p>

<h2>What actually helps, in order</h2>
<ol>
<li><strong>Reduce load before adding more techniques.</strong> Burnout usually needs less input, not a better productivity system.</li>
<li><strong>Protect one non-negotiable rest activity</strong> — something with zero achievement attached to it, purely because you enjoy it.</li>
<li><strong>Talk about it out loud,</strong> even just to name what's happening. Burnout that goes unnamed tends to get treated as a discipline problem instead of what it is.</li>
</ol>

<h2>When to get more support</h2>
<p>If this has been going on for weeks, not days, it's worth talking to someone directly — a school counsellor, a parent, or one of our counsellors. Persistent burnout responds well to support; it rarely resolves just by "pushing through," and pushing through is usually what got it this bad in the first place.</p>
`,
  },
];

export function getAllArticles(): Article[] {
  return ARTICLES;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByTopic(topic: TopicKey): Article[] {
  return ARTICLES.filter((a) => a.topic === topic);
}
