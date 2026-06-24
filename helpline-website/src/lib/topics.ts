export type TopicKey = "doubt" | "career" | "peer_pressure" | "stress";

export interface Topic {
  key: TopicKey;
  label: string;
  shortLabel: string;
  description: string;
  accent: "evergreen" | "amber" | "sky";
}

export const TOPICS: Topic[] = [
  {
    key: "doubt",
    label: "Doubt solving",
    shortLabel: "Doubts",
    description:
      "Stuck on a subject, a decision, or just don't know who to ask? Start here.",
    accent: "sky",
  },
  {
    key: "career",
    label: "Career guidance",
    shortLabel: "Career",
    description:
      "Streams, courses, colleges, and figuring out what actually fits you.",
    accent: "amber",
  },
  {
    key: "peer_pressure",
    label: "Peer pressure",
    shortLabel: "Peer pressure",
    description:
      "Friend group pressure, fitting in, saying no without losing people you care about.",
    accent: "evergreen",
  },
  {
    key: "stress",
    label: "Stress & anxiety",
    shortLabel: "Stress",
    description:
      "Exam stress, overwhelm, anxious thoughts that won't switch off — you're not alone in this.",
    accent: "evergreen",
  },
];

export function getTopic(key: string | undefined): Topic | undefined {
  return TOPICS.find((t) => t.key === key);
}
