"use client";

import { useEffect, useRef, useState } from "react";
import { saveQuestionDocContent } from "@/lib/actions";
import type { QuestionDoc } from "@/lib/types";

export function QuestionDocEditor({
  sectionId,
  sectionOrder,
  doc,
  autoFocus,
}: {
  sectionId: string;
  sectionOrder: number;
  doc: QuestionDoc;
  autoFocus?: boolean;
}) {
  const [content, setContent] = useState(doc.content);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function scheduleSave(newValue: string) {
    setContent(newValue);
    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveQuestionDocContent(sectionId, doc.id, newValue).then(() => setStatus("saved"));
    }, 600);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "?") return;
    e.preventDefault();
    const el = e.currentTarget;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newValue = content.slice(0, start) + "?\n" + content.slice(end);
    el.value = newValue;
    const pos = start + 2;
    el.setSelectionRange(pos, pos);
    scheduleSave(newValue);
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          {sectionOrder}.Q{doc.index}
        </h3>
        <span className="text-xs text-zinc-400">
          {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : ""}
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => scheduleSave(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        rows={10}
        placeholder="Type a question, press ? to log it and start the next line..."
        className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm font-mono"
      />
    </div>
  );
}
