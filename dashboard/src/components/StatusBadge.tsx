import type { BookingStatus, SlotStatus } from "@/lib/types";

const STYLES: Record<string, { bg: string; fg: string }> = {
  pending: { bg: "var(--status-pending-bg)", fg: "var(--status-pending-fg)" },
  confirmed: { bg: "var(--status-confirmed-bg)", fg: "var(--status-confirmed-fg)" },
  completed: { bg: "var(--status-completed-bg)", fg: "var(--status-completed-fg)" },
  cancelled: { bg: "var(--status-cancelled-bg)", fg: "var(--status-cancelled-fg)" },
  open: { bg: "var(--status-confirmed-bg)", fg: "var(--status-confirmed-fg)" },
  booked: { bg: "var(--status-pending-bg)", fg: "var(--status-pending-fg)" },
};

export function StatusBadge({ status }: { status: BookingStatus | SlotStatus }) {
  const style = STYLES[status] ?? STYLES.pending;
  return (
    <span className="status-badge" style={{ background: style.bg, color: style.fg }}>
      {status}
    </span>
  );
}
