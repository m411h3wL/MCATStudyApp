import Link from "next/link";
import * as db from "@/lib/db";
import { deleteFlashcard } from "@/lib/actions";

export default async function FlashcardsPage() {
  const [flashcards, chapters, sections] = await Promise.all([
    db.getFlashcards(),
    db.getChapters(),
    db.getSections(),
  ]);

  const dueCount = flashcards.filter((c) => new Date(c.srs.dueDate) <= new Date()).length;
  const sorted = [...flashcards].sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const chapterTitle = (id: string) => chapters.find((c) => c.id === id)?.title ?? "";
  const sectionTitle = (id: string) => sections.find((s) => s.id === id)?.title ?? "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Flashcards</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {flashcards.length} total · {dueCount} due
          </p>
        </div>
        {dueCount > 0 && (
          <Link
            href="/flashcards/review"
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Review due cards
          </Link>
        )}
      </div>

      <ul className="space-y-2">
        {sorted.map((card) => (
          <li
            key={card.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex items-start justify-between gap-3"
          >
            <div className="text-sm">
              <p className="font-medium">{card.front}</p>
              <p className="text-zinc-500">{card.back}</p>
              <p className="text-xs text-zinc-400 mt-1">
                {chapterTitle(card.chapterId)} · {sectionTitle(card.sectionId)} · due{" "}
                {new Date(card.srs.dueDate).toLocaleDateString()}
              </p>
            </div>
            <form action={deleteFlashcard.bind(null, card.id)}>
              <button
                type="submit"
                className="text-xs text-red-600 dark:text-red-400 hover:underline shrink-0"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
        {sorted.length === 0 && (
          <li className="text-sm text-zinc-500">
            No flashcards yet — finalize some sections to generate cards.
          </li>
        )}
      </ul>
    </div>
  );
}
