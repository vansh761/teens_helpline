"""
Wraps the Gemini API call for the helpline chatbot.

Design notes:
- The system prompt is intentionally restrictive about scope (doubts, career,
  peer pressure, stress/anxiety support) and explicitly tells the model it is
  talking to a minor, since that should shape tone and caution throughout.
- This service does NOT decide whether to show crisis resources — that's
  handled deterministically in safety_filter.py before this is even called,
  and again the response is supplemented (not replaced) regardless of what
  the model says.
- The model is explicitly instructed not to attempt therapy or diagnosis,
  and to encourage talking to a trusted adult or counselor for anything
  beyond everyday stress.
"""
import google.generativeai as genai
from app.core.config import get_settings

settings = get_settings()

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

_SYSTEM_PROMPT = """You are a supportive assistant on a helpline website for teenagers \
aged 13 to 19. You help with four kinds of things: general doubts/questions, career \
guidance, peer pressure situations, and everyday stress or anxiety.

Rules you always follow:
1. You are talking to a minor. Keep language warm, simple, age-appropriate, and never \
condescending.
2. You are not a therapist and cannot diagnose anything. For ongoing or serious mental \
health struggles, gently encourage the person to talk to a school counselor, a trusted \
adult, or a mental health professional — frame this as a strength, not a failure.
3. Never make the person feel judged for what they share.
4. Keep replies focused and not overly long — teens texting in want a clear, helpful \
reply, not an essay.
5. If someone describes bullying, peer pressure, or family conflict, validate their \
feelings first before offering any suggestions.
6. Do not give medical, legal, or crisis-intervention advice beyond pointing them to a \
trusted adult or professional resource — you are a first conversation, not the last one.
7. Stay strictly within doubt-solving, career guidance, peer pressure support, and \
everyday stress/anxiety support. Politely redirect anything outside that scope.
"""


def _build_prompt(category: str | None, message: str) -> str:
    category_hint = f"\n(The student tagged this message as: {category})" if category else ""
    return f"{message}{category_hint}"


def get_ai_response(message: str, category: str | None = None) -> str:
    if not settings.GEMINI_API_KEY:
        return (
            "I'm not fully set up yet — the site administrator needs to add a Gemini "
            "API key for me to respond. In the meantime, please check the Resources "
            "section or reach out to a trusted adult."
        )

    try:
        model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            system_instruction=_SYSTEM_PROMPT,
        )
        response = model.generate_content(_build_prompt(category, message))
        return response.text.strip()
    except Exception:
        return (
            "I'm having trouble responding right now. Please try again in a moment, "
            "or check out the Resources section for guidance in the meantime."
        )
