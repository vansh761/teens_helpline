/**
 * Brand mark: a compass needle crossed with a signpost arrow.
 * The vertical stroke (evergreen) reads as a steady anchor/signpost.
 * The diagonal stroke (amber) reads as a compass needle pointing
 * forward-and-up — progress, guidance, a way through. The two together
 * form a deliberate asymmetric cross rather than a generic plus or
 * compass-rose cliche.
 */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Teens Helpline logo"
    >
      <circle cx="24" cy="24" r="22.5" fill="var(--evergreen-tint)" stroke="var(--evergreen)" strokeWidth="1.5" />
      {/* Anchor / signpost stroke */}
      <path d="M24 11 L24 37" stroke="var(--evergreen)" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 11 L18.5 17" stroke="var(--evergreen)" strokeWidth="3" strokeLinecap="round" />
      {/* Compass needle, pointing forward and up */}
      <path d="M14 31 L33 16" stroke="var(--amber)" strokeWidth="3.25" strokeLinecap="round" />
      <circle cx="24" cy="24" r="3" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="1.25" />
    </svg>
  );
}

export function LogoWithWordmark({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark size={size} />
      <span
        className="font-display leading-tight"
        style={{ color: "var(--ink)" }}
      >
        <span className="block text-[1.05rem] font-semibold tracking-tight">
          Teens Helpline
        </span>
      </span>
    </div>
  );
}
