"use client";

import { useState, useTransition } from "react";
import { setSectionStatus } from "@/lib/actions";
import { StatusBadge } from "@/components/status-badge";
import {
  SECTION_STATUS_LABEL,
  SECTION_STATUS_ORDER,
  type AnswerStyle,
  type BrainstormItem,
  type Question,
  type Section,
} from "@/lib/types";
import { NotesEditor } from "./notes-editor";
import { QuestionRounds } from "./question-rounds";
import { BrainstormList } from "./brainstorm-list";

type Tab = "notes" | "questions" | "brainstorm";

export function SectionWorkspace({
  section,
  chapterTitle,
  notes,
  questions,
  brainstorm,
  answerStyles,
}: {
  section: Section;
  chapterTitle: string;
  notes: string;
  questions: Question[];
  brainstorm: BrainstormItem[];
  answerStyles: AnswerStyle[];
}) {
  const [tab, setTab] = useState<Tab>("notes");
  const [isPending, startTransition] = useTransition();

  const selectableStatuses = SECTION_STATUS_ORDER.filter((s) => s !== "finalized");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <StatusBadge status={section.status} />
        {section.status === "finalized" ? (
          <span className="text-xs text-zinc-500">
            Finalized — flashcards were generated from this section.
          </span>
        ) : (
          <label className="flex items-center gap-2 text-xs text-zinc-500">
            Stage:
            <select
              value={section.status}
              disabled={isPending}
              onChange={(e) =>
                startTransition(() =>
                  setSectionStatus(section.id, e.target.value as Section["status"])
                )
              }
              className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs"
            >
              {selectableStatuses.map((s) => (
                <option key={s} value={s}>
                  {SECTION_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800">
        {(
          [
            ["notes", "Notes"],
            ["questions", "Questions"],
            ["brainstorm", "Flashcard Brainstorm"],
          ] as [Tab, string][]
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === value
                ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div>
        {tab === "notes" && (
          <NotesEditor
            chapterId={section.chapterId}
            sectionId={section.id}
            initialContent={notes}
          />
        )}
        {tab === "questions" && (
          <QuestionRounds
            chapterId={section.chapterId}
            sectionId={section.id}
            sectionTitle={section.title}
            chapterTitle={chapterTitle}
            questions={questions}
            answerStyles={answerStyles}
          />
        )}
        {tab === "brainstorm" && (
          <BrainstormList
            chapterId={section.chapterId}
            sectionId={section.id}
            items={brainstorm}
          />
        )}
      </div>
    </div>
  );
}
