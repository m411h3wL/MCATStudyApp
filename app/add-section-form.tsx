"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSection } from "@/lib/actions";

export function AddSectionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const section = await createSection(title);
          router.push(`/sections/${section.id}`);
        });
      }}
      className="flex gap-2"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Section name (optional)"
        className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Adding..." : "+ Add section"}
      </button>
    </form>
  );
}
