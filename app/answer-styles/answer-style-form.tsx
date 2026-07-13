"use client";

import { useRef } from "react";
import { createAnswerStyle } from "@/lib/actions";

export function AnswerStyleForm() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createAnswerStyle(formData);
        formRef.current?.reset();
      }}
      className="space-y-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"
    >
      <input
        name="name"
        placeholder="Style name (e.g. Socratic Follow-up)"
        required
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <input
        name="description"
        placeholder="Short description of when to use this style"
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <textarea
        name="promptTemplate"
        placeholder="Prompt template. Use {{question}} and {{context}} as placeholders."
        rows={3}
        required
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-mono"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Add answer style
      </button>
    </form>
  );
}
