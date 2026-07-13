import * as db from "@/lib/db";
import { Reviewer } from "./reviewer";

export default async function ReviewPage() {
  const flashcards = await db.getFlashcards();
  const due = flashcards
    .filter((c) => new Date(c.srs.dueDate) <= new Date())
    .sort((a, b) => new Date(a.srs.dueDate).getTime() - new Date(b.srs.dueDate).getTime());

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Review</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Tap a card to flip it, then grade how well you knew it.
        </p>
      </div>
      <Reviewer cards={due} />
    </div>
  );
}
