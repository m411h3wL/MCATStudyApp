import Link from "next/link";
import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import { AddSectionButton } from "./add-section-button";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const chapter = await db.getChapter(chapterId);
  if (!chapter) notFound();

  const sections = await db.getSectionsByChapter(chapterId);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/chapters" className="text-sm text-zinc-500 hover:underline">
          ← Chapters
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{chapter.title}</h1>
      </div>

      <AddSectionButton chapterId={chapterId} />

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {sections.map((section) => (
          <li key={section.id} className="px-4 py-3">
            <Link
              href={`/chapters/${chapterId}/sections/${section.id}`}
              className="font-medium hover:underline"
            >
              Section {section.order}
            </Link>
          </li>
        ))}
        {sections.length === 0 && (
          <li className="px-4 py-6 text-sm text-zinc-500">
            No sections yet — add the first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
