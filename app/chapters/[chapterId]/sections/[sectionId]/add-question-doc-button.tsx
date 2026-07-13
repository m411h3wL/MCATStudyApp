"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuestionDoc } from "@/lib/actions";

export function AddQuestionDocButton({
  chapterId,
  sectionId,
}: {
  chapterId: string;
  sectionId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await createQuestionDoc(chapterId, sectionId);
          router.refresh();
        })
      }
      className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
    >
      + New question doc
    </button>
  );
}
