"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createQuestionDoc } from "@/lib/actions";

export function AddQuestionDocButton({ sectionId }: { sectionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await createQuestionDoc(sectionId);
          router.refresh();
        })
      }
      aria-label="New question doc"
      title="New question doc"
      className="inline-flex items-center gap-1 rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-zinc-700 dark:text-zinc-300"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
      <span className="text-base font-semibold leading-none text-zinc-700 dark:text-zinc-300">
        +
      </span>
    </button>
  );
}
