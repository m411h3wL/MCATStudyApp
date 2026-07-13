import Link from "next/link";
import * as db from "@/lib/db";
import { StatusBadge } from "@/components/status-badge";

export default async function Dashboard() {
  const [chapters, sections, flashcards] = await Promise.all([
    db.getChapters(),
    db.getSections(),
    db.getFlashcards(),
  ]);

  const inProgress = sections
    .filter((s) => s.status !== "finalized")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const readySections = sections.filter((s) => s.status === "ready");
  const dueCards = flashcards.filter((c) => new Date(c.srs.dueDate) <= new Date());

  const chapterTitle = (chapterId: string) =>
    chapters.find((c) => c.id === chapterId)?.title ?? "Untitled chapter";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Your next actions in the read → question → brainstorm → finalize
          cycle.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sections in progress" value={inProgress.length} />
        <StatCard
          label="Ready to finalize"
          value={readySections.length}
          hint={readySections.length >= 3 ? "3+ ready — go finalize" : undefined}
        />
        <StatCard label="Flashcards due" value={dueCards.length} />
      </div>

      {dueCards.length > 0 && (
        <Link
          href="/flashcards/review"
          className="block rounded-lg border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950 px-5 py-4 hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
        >
          <span className="font-medium">Review {dueCards.length} due flashcard{dueCards.length === 1 ? "" : "s"} →</span>
        </Link>
      )}

      {readySections.length >= 3 && (
        <Link
          href="/finalize"
          className="block rounded-lg border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950 px-5 py-4 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
        >
          <span className="font-medium">
            {readySections.length} sections are ready — finalize flashcards →
          </span>
        </Link>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Sections in progress</h2>
        {inProgress.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nothing in progress.{" "}
            <Link href="/chapters" className="underline">
              Start a chapter
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {inProgress.map((s) => (
              <li key={s.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <Link
                    href={`/chapters/${s.chapterId}/sections/${s.id}`}
                    className="font-medium hover:underline"
                  >
                    {s.title}
                  </Link>
                  <p className="text-xs text-zinc-500">{chapterTitle(s.chapterId)}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="text-3xl font-semibold mt-1">{value}</p>
      {hint && <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{hint}</p>}
    </div>
  );
}
