"use client";

import { useRef } from "react";
import { createSection } from "@/lib/actions";

export function NewSectionForm({ chapterId }: { chapterId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createSection(chapterId, formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="title"
        placeholder="New section title (define what counts as a section for you)"
        required
        className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Add section
      </button>
    </form>
  );
}
