# MCAT Study App

A minimal tool for one part of a study method: capturing questions,
section by section, in rounds, with nothing else in the way.

## The method

1. **Sections are numbered**, not titled — 0, 1, 2, ... within each
   chapter. Add a section and it just gets the next number.
2. **Read with a red/blue marker** through the physical text (or PDF), same
   as always. This app doesn't replace that pass — it has no notes feature.

   > **TODO:** if you want to document the marker method itself, drop
   > example photos in `docs/` and describe what red vs. blue means here.

3. **Orate questions into a question doc.** Each section has one or more
   question docs, labeled `section#.Q#` (e.g. `3.Q1`, `3.Q2`...). A doc is
   just a plain text box — press **`?`** and it writes the `?` and drops you
   to a new line, so you can rattle off questions without touching Enter.
4. **Start another round with "+ New question doc"** once you've had that
   round answered (however you're doing that — outside this app, for now)
   and have follow-ups. Keep going until a round doesn't raise anything new.
5. **Move to the next section.** "Next section →" goes to the next one if
   it exists, or creates it on the spot if you're at the end.

That's the whole loop: number → question doc → `?` → more rounds → next
section.

## Answer Styles

A separate, standalone page for building a repertoire of prompts you can
manually copy into Claude/ChatGPT when you sit down to answer a round —
not wired into the question docs themselves. Templates support
`{{question}}` / `{{context}}` placeholders if you want to paste in specifics.

## How data is stored

Plain JSON files under `data/`, not a database:

```
data/
  chapters.json
  sections.json
  answer-styles.json
  sections/<sectionId>/
    question-docs.json
```

Committing this to the repo is itself a study log. There's a seeded example
chapter/section (titled "delete me") — remove its entries from
`data/chapters.json` and `data/sections.json` (and its `data/sections/<id>/`
folder) once you're ready for real content.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whatever port it
prints, if 3000 is taken). Meant to run locally as a personal tool — no auth,
no multi-user support.

Built with Next.js (App Router, Server Actions) and Tailwind CSS.
