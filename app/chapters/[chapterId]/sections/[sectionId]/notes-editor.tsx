"use client";

import { useState, useTransition } from "react";
import { saveSectionNotes } from "@/lib/actions";

export function NotesEditor({
  chapterId,
  sectionId,
  initialContent,
}: {
  chapterId: string;
  sectionId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const dirty = content !== savedContent;

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500">
        Typed reference notes for this section — a companion to your physical
        red/blue marker pass on the text, not a replacement for it. Use this
        for anything you want searchable or worth keeping digitally.
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        placeholder="Type up notes, definitions, diagrams-as-text, whatever you want to keep from this section..."
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-mono"
      />
      <button
        disabled={!dirty || isPending}
        onClick={() =>
          startTransition(async () => {
            await saveSectionNotes(chapterId, sectionId, content);
            setSavedContent(content);
          })
        }
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Saving..." : dirty ? "Save notes" : "Saved"}
      </button>
    </div>
  );
}
