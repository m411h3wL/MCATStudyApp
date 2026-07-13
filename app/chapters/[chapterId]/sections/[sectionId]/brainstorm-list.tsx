"use client";

import { useRef, useTransition } from "react";
import { addBrainstormItem, deleteBrainstormItem } from "@/lib/actions";
import type { BrainstormItem } from "@/lib/types";

export function BrainstormList({
  chapterId,
  sectionId,
  items,
}: {
  chapterId: string;
  sectionId: string;
  items: BrainstormItem[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">
        Once you&apos;ve fully worked through this section&apos;s questions,
        brainstorm everything from it that could become a flashcard. These are
        candidates only — you&apos;ll pick the real flashcards once every 3
        sections, on the{" "}
        <a href="/finalize" className="underline">
          Finalize
        </a>{" "}
        page.
      </p>

      <form
        ref={formRef}
        action={async (formData) => {
          await addBrainstormItem(chapterId, sectionId, formData);
          formRef.current?.reset();
        }}
        className="grid gap-2 sm:grid-cols-2"
      >
        <input
          name="front"
          placeholder="Front (prompt/question)"
          required
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
        <input
          name="back"
          placeholder="Back (answer)"
          required
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="sm:col-span-2 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
        >
          Add brainstorm candidate
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex items-start justify-between gap-3"
          >
            <div className="text-sm">
              <p className="font-medium">{item.front}</p>
              <p className="text-zinc-500">{item.back}</p>
            </div>
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(() => deleteBrainstormItem(chapterId, sectionId, item.id))
              }
              className="text-xs text-red-600 dark:text-red-400 hover:underline shrink-0"
            >
              Remove
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-zinc-400 italic">No candidates yet.</li>
        )}
      </ul>
    </div>
  );
}
