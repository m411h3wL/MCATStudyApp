import Link from "next/link";
import * as db from "@/lib/db";

export default async function Dashboard() {
  const [chapters, sections] = await Promise.all([db.getChapters(), db.getSections()]);

  const chapterTitle = (chapterId: string) =>
    chapters.find((c) => c.id === chapterId)?.title ?? "Untitled chapter";

  const latestByChapter = new Map<string, (typeof sections)[number]>();
  for (const s of sections) {
    const current = latestByChapter.get(s.chapterId);
    if (!current || s.order > current.order) latestByChapter.set(s.chapterId, s);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          {chapters.length} chapter{chapters.length === 1 ? "" : "s"} ·{" "}
          {sections.length} section{sections.length === 1 ? "" : "s"}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Jump back in</h2>
        {chapters.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Nothing yet.{" "}
            <Link href="/chapters" className="underline">
              Add a chapter
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            {chapters.map((c) => {
              const latest = latestByChapter.get(c.id);
              return (
                <li key={c.id} className="px-4 py-3 flex items-center justify-between">
                  <span className="font-medium">{chapterTitle(c.id)}</span>
                  {latest ? (
                    <Link
                      href={`/chapters/${c.id}/sections/${latest.id}`}
                      className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Continue at Section {latest.order} →
                    </Link>
                  ) : (
                    <Link
                      href={`/chapters/${c.id}`}
                      className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Start Section 0 →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
