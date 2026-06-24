"""
Deterministic crisis-language detection.

This intentionally does NOT rely on the LLM to decide whether a message
indicates self-harm risk. The check here runs first, every time, and if it
fires, the response includes crisis resources regardless of what the AI
generates afterward. The AI is still asked to respond with care, but the
resource surfacing itself never depends on model judgment alone.

This list is deliberately short, pattern-level, and not meant to be
exhaustive of every possible phrasing — it's a first-pass safety net, not a
clinical screening tool. It is not the only protective measure: the system
prompt also instructs the model to recognize distress and respond
supportively in its own right.
"""
import re

_CRISIS_PATTERNS = [
    r"\bkill myself\b",
    r"\bend my life\b",
    r"\bsuicid",
    r"\bwant to die\b",
    r"\bdon'?t want to (be alive|live)\b",
    r"\bhurt(ing)? myself\b",
    r"\bself.?harm\b",
    r"\bcut(ting)? myself\b",
    r"\bno reason to live\b",
    r"\bbetter off dead\b",
]

_COMPILED = [re.compile(p, re.IGNORECASE) for p in _CRISIS_PATTERNS]

# India-specific helplines, since the primary audience is based in India.
# Tele-MANAS and KIRAN are government-run, national, free, and 24/7 — listed
# first as the most consistently available options. Numbers verified via
# web search; re-verify periodically since helpline numbers can change.
CRISIS_RESOURCES_TEXT = (
    "Tele-MANAS, India's free 24/7 national mental health helpline, is "
    "available by calling 14416 or 1-800-891-4416. KIRAN, the government "
    "mental health helpline, is also available 24/7 at 1800-599-0019. "
    "AASRA offers 24/7 confidential support at +91 9820466726. If you're "
    "outside India, please look up a local crisis line, or contact "
    "emergency services if you're in immediate danger."
)


def check_for_crisis_language(message: str) -> bool:
    return any(pattern.search(message) for pattern in _COMPILED)
