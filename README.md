# MCAT Study App

A minimal tool for one part of a study method: capturing questions,
section by section, in rounds, with nothing else in the way.

## The method

1. **Sections are numbered** — 0, 1, 2, ... — and can optionally be named.
   Add a section and it gets the next number; give it a name if you want
   one, or leave it blank.
2. **Read with a red/blue marker** through the physical text (or PDF), same
   as always. This app doesn't replace that pass — it has no notes feature.
3. **Orate questions into a question doc.** A new section opens with its
   first question doc, `#.Q1`, already there and focused, ready to type
   into. A doc is just a plain text box — press **`?`** and it writes the
   `?` and drops you to a new line, so you can rattle off questions without
   touching Enter.
4. **Start another round with "+ New question doc"** once you've had that
   round answered (however you're doing that — outside this app, for now)
   and have follow-ups. Keep going until a round doesn't raise anything new.
5. **Move to the next section.** "Next section →" goes to the next one if
   it exists, or creates it (with its own first question doc) on the spot
   if you're at the end.

That's the whole loop: section → question doc → `?` → more rounds → next
section.

## How data is stored

Plain JSON files under `data/`, not a database:

```
data/
  sections.json
  sections/<sectionId>/
    question-docs.json
```

Committing this to the repo is itself a study log. There are two existing
sections in there already from earlier use — leave them as-is or edit
`data/sections.json` / delete a `data/sections/<id>/` folder directly if you
want to clear them out.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or whatever port it
prints, if 3000 is taken). Meant to run locally as a personal tool — no auth,
no multi-user support.

Built with Next.js (App Router, Server Actions) and Tailwind CSS.
