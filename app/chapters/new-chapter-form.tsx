"use client";

import { useRef } from "react";
import { createChapter } from "@/lib/actions";

export function NewChapterForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createChapter(formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="title"
        placeholder="New chapter title (e.g. Biochemistry Ch. 3 — Enzymes)"
        required
        className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Add chapter
      </button>
    </form>
  );
}
