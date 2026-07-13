# MCAT Study App

A personal tool that enforces a specific study method: read a section, log
every question you have as you go, get those questions answered, keep
generating follow-up rounds until you run dry, *then* brainstorm flashcards —
and only turn brainstormed candidates into real flashcards once you've done
that for a batch of sections. The app exists to keep you honest about the
process, not to speed-run it.

## The method

1. **Define your sections.** A "section" is whatever chunk of reading you
   decide to fully process before moving on — you set the boundary, not the
   textbook's chapter breaks.
2. **Read with a red/blue marker** through the physical text (or PDF), same
   as always. This app doesn't replace that pass.

   > **TODO:** drop example photos of your marker method here, e.g.
   > `docs/notetaking-method-1.jpg`, and reference them:
   > `![marker method example](docs/notetaking-method-1.jpg)`
   > Explain what red vs. blue means to you, and what you're marking for.

3. **Orate questions as you go.** Every question that comes up while
   reading gets logged — not answered yet, just captured. In the app this is
   the **Questions** tab on a section, **Round 1**.
4. **Get the round answered, then log the follow-ups.** Use an **Answer
   Style** (see below) to generate a ready-to-paste prompt for each question,
   paste the AI's answer back in, and log whatever new questions that answer
   raises as **Round 2**. Repeat until a round produces nothing new — that's
   the signal you actually understand the section.
5. **Brainstorm flashcard candidates.** Once a section's questions are
   exhausted, brainstorm everything from it that's worth a flashcard. These
   are candidates, not commitments — dump ideas freely in the **Flashcard
   Brainstorm** tab.
6. **Move to the next section** and repeat steps 2–5.
7. **Finalize every ~3 sections.** On the **Finalize** page, pull up the
   combined brainstorm pool from your last few sections and decide, with
   that wider view, which candidates actually earn a spot in the deck. This
   is what turns a brainstorm item into a real, reviewable flashcard.
8. **Review digital flashcards on a spaced-repetition schedule** in
   **Flashcards → Review**. Keep your physical deck as a hand-made mirror of
   whatever gets finalized digitally.

The section status badge (`Reading → Questioning → Flashcard Brainstorm →
Ready to Finalize → Finalized`) tracks where each section is in that cycle.

## Answer Styles

Rather than call an AI API directly, the app generates prompts you paste into
Claude/ChatGPT yourself, in whatever style you choose — this is the
"repertoire of ways AI can answer back a question" the method calls for. Five
starting styles are seeded in `data/answer-styles.json` (Feynman/Analogy,
Socratic Follow-up, First-Principles Breakdown, Exam-Style Application,
Mnemonic/Memory Hook). Add, edit, or remove styles on the **Answer Styles**
page — a template supports `{{question}}` and `{{context}}` placeholders.

## How data is stored

Everything lives as plain markdown/JSON files under `data/`, not a database:

```
data/
  chapters.json
  sections.json
  flashcards.json
  answer-styles.json
  sections/<sectionId>/
    notes.md
    questions.json
    brainstorm.json
```

This is deliberate: your notes, questions, and flashcards are readable and
diffable, and committing them to this repo is itself a study log. There's a
seeded example chapter/section (titled "delete me") — remove its entries from
`data/chapters.json` and `data/sections.json` (and its `data/sections/<id>/`
folder) once you're ready to add real content, or just leave it as a
reference for the workflow.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). This is meant to run
locally as a personal tool — there's no auth or multi-user support.

Built with Next.js (App Router, Server Actions) and Tailwind CSS.
