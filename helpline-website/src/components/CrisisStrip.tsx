/**
 * A thin, always-present strip with crisis helpline numbers. Kept visually
 * quiet (small, low-contrast until hovered) so it doesn't read as alarming
 * on every page load, but it's never hidden behind a click — a teen in
 * crisis shouldn't have to go looking for this.
 */
export function CrisisStrip() {
  return (
    <div
      className="w-full text-center py-1.5 px-4 text-xs"
      style={{ background: "var(--evergreen-dark)", color: "var(--paper)" }}
    >
      <span className="opacity-90">
        In immediate distress? Tele-MANAS (India): <a href="tel:14416" className="underline font-medium">14416</a>
        {" "}&middot; KIRAN: <a href="tel:18005990019" className="underline font-medium">1800-599-0019</a>
        {" "}&mdash; free, confidential, 24/7
      </span>
    </div>
  );
}
