"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { finalizeSections } from "@/lib/actions";
import type { BrainstormItem, Section } from "@/lib/types";

type ReadySection = {
  section: Section;
  chapterTitle: string;
  brainstorm: BrainstormItem[];
};

export function FinalizeWorkspace({ readySections }: { readySections: ReadySection[] }) {
  const router = useRouter();
  const [selectedSectionIds, setSelectedSectionIds] = useState<Set<string>>(
    () => new Set(readySections.slice(0, 3).map((r) => r.section.id))
  );
  const [keepItemIds, setKeepItemIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const selected = readySections.filter((r) => selectedSectionIds.has(r.section.id));
  const candidateItems = useMemo(
    () => selected.flatMap((r) => r.brainstorm.map((item) => ({ ...item, sectionTitle: r.section.title }))),
    [selected]
  );

  function toggleSection(id: string) {
    setSelectedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleItem(id: string) {
    setKeepItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleFinalize() {
    startTransition(async () => {
      await finalizeSections([...selectedSectionIds], [...keepItemIds]);
      router.push("/flashcards");
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold mb-3">1. Choose which sections to finalize</h2>
        <p className="text-sm text-zinc-500 mb-3">
          Traditionally you finalize every 3 sections, but pick whatever batch
          makes sense right now.
        </p>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          {readySections.map(({ section, chapterTitle, brainstorm }) => (
            <li key={section.id} className="px-4 py-3 flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedSectionIds.has(section.id)}
                onChange={() => toggleSection(section.id)}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{section.title}</p>
                <p className="text-xs text-zinc-500">
                  {chapterTitle} · {brainstorm.length} brainstorm candidate
                  {brainstorm.length === 1 ? "" : "s"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">
          2. Pick which candidates become real flashcards
        </h2>
        {candidateItems.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No brainstorm candidates in the selected sections.
          </p>
        ) : (
          <ul className="space-y-2">
            {candidateItems.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 flex items-start gap-3"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={keepItemIds.has(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
                <div className="text-sm">
                  <p className="font-medium">{item.front}</p>
                  <p className="text-zinc-500">{item.back}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.sectionTitle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        disabled={isPending || selectedSectionIds.size === 0}
        onClick={handleFinalize}
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40"
      >
        {isPending
          ? "Finalizing..."
          : `Finalize ${selectedSectionIds.size} section${selectedSectionIds.size === 1 ? "" : "s"} → create ${keepItemIds.size} flashcard${keepItemIds.size === 1 ? "" : "s"}`}
      </button>
    </div>
  );
}
