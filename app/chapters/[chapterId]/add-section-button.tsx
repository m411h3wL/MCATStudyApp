"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSection } from "@/lib/actions";

export function AddSectionButton({ chapterId }: { chapterId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const section = await createSection(chapterId);
          router.push(`/chapters/${chapterId}/sections/${section.id}`);
        })
      }
      className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40"
    >
      {isPending ? "Creating..." : "+ Add section"}
    </button>
  );
}
