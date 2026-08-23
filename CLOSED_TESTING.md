# AI Lab — Closed Testing Review

The AI Lab is fully **offline and zero-cost**: no OpenAI / Gemini / Claude / paid
API, no cloud execution, no external services. Everything runs on local data,
rules, templates and a deterministic local simulation. Do **not** enable a real
AI provider until closed-test feedback validates the concept.

## How to reach it
Home → bottom tab **🧪 AI Lab** → pick a mission (or **🎲 Surprise Me** / **🧪 Free Build**).

## Internal tester checklist

For each question: how the build supports it, and the residual risk to watch in testing.

1. **Can a new user understand AI Lab without instructions?**
   - Supports: hub has a title + one-line subtitle, an AI-Builder level card, mission cards each showing emoji, difficulty and the concept they teach; a prominent Surprise Me and Free Build entry.
   - Risk: first-timers may not realise cards are tappable — watch for hesitation on the hub.

2. **Can they complete the first mission?**
   - Supports: mission screen shows objective + "what you'll learn" + "Build Your AI" with a tray and pipeline; live validation explains what's missing until the build is valid; completion card appears when valid.
   - Risk: users might not connect "add component" (tap) with "arrange" (drag).

3. **Do they understand drag/drop?**
   - Supports: tap-to-add from the tray; long-press-then-drag to reorder with a reorder handle icon, numbered steps and ↓ connectors; remove via the ✕ on each row.
   - Risk: the 200 ms long-press to start a drag can feel unintuitive — watch for users trying to drag immediately.

4. **Do they understand why a component is required?**
   - Supports: validation never just says "wrong" — each missing/invalid component gets a plain-language reason and a suggestion (e.g. "Your AI can hear the user but cannot understand the words → Add Speech-to-Text"). Success states describe the working flow.
   - Risk: low. Confirm the wording reads naturally to non-technical testers.

5. **Are challenges fun?**
   - Supports: 16 challenges across 6 types (missing/wrong component, wrong connection, missing capability, optimisation, debugging); each is a broken build the user fixes; "🎉 Problem solved!" + confetti + a why-it-works explanation; progress bar across a mission's challenges.
   - Risk: some fixes are single-component adds — watch whether they feel too easy.

6. **Is the simulation convincing but clearly labelled?**
   - Supports: "Test My AI" runs sample inputs through the pipeline with an animated trace and chat bubbles; it is explicitly badged **"Simulation Mode"** with a "runs offline with sample data — no real AI is involved" note; it degrades honestly when the build is incomplete.
   - Risk: none on honesty; confirm testers don't expect free-text input (inputs are predefined samples).

7. **Do they want to build another AI?**
   - Supports: 8 distinct missions, Surprise Me, Free Build (8 categories), AI-Builder level + XP + 8 badges, best-score replay, save/resume of projects.
   - Risk: measure repeat rate — the main signal for the whole feature.

8. **Does the experience become repetitive?**
   - Supports: seeded randomisation shuffles challenge order, wording variants and tray option order, with anti-repetition history; each mission teaches a different concept.
   - Risk: only a subset of challenges have multiple wordings yet — add more variants if testers notice repetition.

9. **Are there confusing interactions?**
   - Supports: consistent design-system UI; clear empty/success/error/advisory states; accessibility labels; safe-area handling; Reset + Save actions in the header.
   - Risk: two header icons (Save / Reset) are icon-only — confirm their meaning is clear.

10. **Do they understand what they learned?**
    - Supports: every mission names its concept; the completion showcase lists "Concepts learned" derived from the real build (each component + its role) and shows the architecture visually; Share My AI captures the build as an image.
    - Risk: low. Confirm the concept phrasing lands for the target audience.

## What to record per tester
- Time to first completed mission.
- Whether they discovered drag-to-reorder unaided.
- Whether they built a second AI.
- Any moment of visible confusion (which screen, what they expected).
- One thing they say they learned.

## Do NOT do yet
- No real AI provider, no API keys, no network calls.
- No paid rewards.
Wait for tester feedback before considering the future `RealAIProvider`.
