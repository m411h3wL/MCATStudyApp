"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewFlashcard } from "@/lib/actions";
import type { Flashcard, Grade } from "@/lib/types";

const GRADES: { grade: Grade; label: string; classes: string }[] = [
  { grade: "again", label: "Again", classes: "bg-red-600 hover:bg-red-700" },
  { grade: "hard", label: "Hard", classes: "bg-amber-600 hover:bg-amber-700" },
  { grade: "good", label: "Good", classes: "bg-green-600 hover:bg-green-700" },
  { grade: "easy", label: "Easy", classes: "bg-blue-600 hover:bg-blue-700" },
];

export function Reviewer({ cards }: { cards: Flashcard[] }) {
  const router = useRouter();
  const [queue, setQueue] = useState(cards);
  const [revealed, setRevealed] = useState(false);
  const [isPending, startTransition] = useTransition();

  const current = queue[0];

  if (!current) {
    return (
      <div className="rounded-lg border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950 p-6 text-center">
        <p className="font-medium">All done for now.</p>
      </div>
    );
  }

  function grade(g: Grade) {
    startTransition(async () => {
      await reviewFlashcard(current.id, g);
      setQueue((q) => q.slice(1));
      setRevealed(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">{queue.length} card{queue.length === 1 ? "" : "s"} remaining</p>
      <div
        onClick={() => setRevealed((v) => !v)}
        className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 text-center min-h-[160px] flex items-center justify-center cursor-pointer"
      >
        <p className="text-lg font-medium">{revealed ? current.back : current.front}</p>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2.5 text-sm font-medium hover:opacity-90"
        >
          Show answer
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {GRADES.map(({ grade: g, label, classes }) => (
            <button
              key={g}
              disabled={isPending}
              onClick={() => grade(g)}
              className={`rounded-md text-white px-3 py-2.5 text-sm font-medium disabled:opacity-40 ${classes}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
