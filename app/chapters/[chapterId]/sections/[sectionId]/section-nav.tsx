"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSection } from "@/lib/actions";

export function SectionNav({
  chapterId,
  prevSectionId,
  nextSectionId,
}: {
  chapterId: string;
  prevSectionId?: string;
  nextSectionId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center justify-between">
      {prevSectionId ? (
        <Link
          href={`/chapters/${chapterId}/sections/${prevSectionId}`}
          className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          ← Previous section
        </Link>
      ) : (
        <span />
      )}

      {nextSectionId ? (
        <Link
          href={`/chapters/${chapterId}/sections/${nextSectionId}`}
          className="text-sm rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 font-medium hover:opacity-90"
        >
          Next section →
        </Link>
      ) : (
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const section = await createSection(chapterId);
              router.push(`/chapters/${chapterId}/sections/${section.id}`);
            })
          }
          className="text-sm rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 font-medium hover:opacity-90 disabled:opacity-40"
        >
          {isPending ? "Creating..." : "Start next section →"}
        </button>
      )}
    </div>
  );
}
