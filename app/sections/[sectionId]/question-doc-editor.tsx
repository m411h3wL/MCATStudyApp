"use client";

import { useEffect, useRef, useState } from "react";
import { saveQuestionDocContent } from "@/lib/actions";
import type { QuestionDoc } from "@/lib/types";

const COPY_PROMPT = "One by one go through each question and help me understand it.";

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
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
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

  function handleCopy() {
    navigator.clipboard.writeText(`${COPY_PROMPT}\n\n${content}`);
    setCopied(true);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved" : ""}
          </span>
          <button
            onClick={handleCopy}
            aria-label="Copy questions with prompt"
            title="Copy questions with prompt"
            className="inline-flex items-center justify-center rounded-md border border-zinc-300 dark:border-zinc-700 p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-green-600 dark:text-green-400"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-zinc-700 dark:text-zinc-300"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>
        </div>
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
