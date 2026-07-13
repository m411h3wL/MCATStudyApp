import Link from "next/link";
import * as db from "@/lib/db";
import { NewChapterForm } from "./new-chapter-form";

export default async function ChaptersPage() {
  const [chapters, sections] = await Promise.all([db.getChapters(), db.getSections()]);
  const sorted = [...chapters].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Chapters</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          A chapter holds the sections you define as you read.
        </p>
      </div>

      <NewChapterForm />

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {sorted.map((chapter) => {
          const chapterSections = sections.filter((s) => s.chapterId === chapter.id);
          return (
            <li key={chapter.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <Link href={`/chapters/${chapter.id}`} className="font-medium hover:underline">
                  {chapter.title}
                </Link>
                <p className="text-xs text-zinc-500">
                  {chapterSections.length} section{chapterSections.length === 1 ? "" : "s"}
                </p>
              </div>
            </li>
          );
        })}
        {sorted.length === 0 && (
          <li className="px-4 py-6 text-sm text-zinc-500">No chapters yet.</li>
        )}
      </ul>
    </div>
  );
}
