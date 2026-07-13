import Link from "next/link";
import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import { StatusBadge } from "@/components/status-badge";
import { NewSectionForm } from "./new-section-form";

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

      <NewSectionForm chapterId={chapterId} />

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {sections.map((section) => (
          <li key={section.id} className="px-4 py-3 flex items-center justify-between">
            <Link
              href={`/chapters/${chapterId}/sections/${section.id}`}
              className="font-medium hover:underline"
            >
              {section.title}
            </Link>
            <StatusBadge status={section.status} />
          </li>
        ))}
        {sections.length === 0 && (
          <li className="px-4 py-6 text-sm text-zinc-500">
            No sections yet. Add the first section above — a section is whatever
            chunk of reading you decide to fully process before moving on.
          </li>
        )}
      </ul>
    </div>
  );
}
