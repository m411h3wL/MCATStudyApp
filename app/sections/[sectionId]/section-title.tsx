"use client";

import { useState, useTransition } from "react";
import { renameSection } from "@/lib/actions";

export function SectionTitle({
  sectionId,
  order,
  initialTitle,
}: {
  sectionId: string;
  order: number;
  initialTitle?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialTitle ?? "");
  const [title, setTitle] = useState(initialTitle);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await renameSection(sectionId, draft);
      setTitle(draft.trim() ? draft.trim() : undefined);
      setEditing(false);
    });
  }

  function cancel() {
    setDraft(title ?? "");
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 mt-1">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          placeholder="Section name (optional)"
          className="text-2xl font-semibold tracking-tight bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400"
        />
        <button
          disabled={isPending}
          onClick={save}
          className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
        >
          Save
        </button>
        <button
          onClick={cancel}
          className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-1 group">
      <h1 className="text-2xl font-semibold tracking-tight">
        Section {order}
        {title ? ` — ${title}` : ""}
      </h1>
      <button
        onClick={() => setEditing(true)}
        aria-label="Rename section"
        title="Rename section"
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-zinc-500"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
      </button>
    </div>
  );
}
