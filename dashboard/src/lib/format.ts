export const SESSION_TYPE_LABELS: Record<string, string> = {
  career: "Career counselling",
  mental_health: "Mental health counselling",
  peer_pressure: "Peer pressure guidance",
  tuition: "Subject tuition",
};

export function sessionTypeLabel(type: string): string {
  return SESSION_TYPE_LABELS[type] ?? type;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const dateLabel = start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const startTime = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endTime = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateLabel}, ${startTime} – ${endTime}`;
}
