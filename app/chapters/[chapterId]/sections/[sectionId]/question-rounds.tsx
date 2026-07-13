"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import {
  addQuestion,
  saveQuestionAnswer,
  setQuestionAnswerStyle,
} from "@/lib/actions";
import type { AnswerStyle, Question } from "@/lib/types";

export function QuestionRounds({
  chapterId,
  sectionId,
  sectionTitle,
  chapterTitle,
  questions,
  answerStyles,
}: {
  chapterId: string;
  sectionId: string;
  sectionTitle: string;
  chapterTitle: string;
  questions: Question[];
  answerStyles: AnswerStyle[];
}) {
  const maxRound = useMemo(
    () => questions.reduce((max, q) => Math.max(max, q.round), 0),
    [questions]
  );
  const [activeRound, setActiveRound] = useState(Math.max(1, maxRound));

  const rounds = useMemo(() => {
    const byRound = new Map<number, Question[]>();
    for (const q of questions) {
      if (!byRound.has(q.round)) byRound.set(q.round, []);
      byRound.get(q.round)!.push(q);
    }
    const roundNumbers = new Set([...byRound.keys(), activeRound]);
    return [...roundNumbers].sort((a, b) => a - b).map((round) => ({
      round,
      questions: (byRound.get(round) ?? []).sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt)
      ),
    }));
  }, [questions, activeRound]);

  const currentRoundQuestions = rounds.find((r) => r.round === activeRound)?.questions ?? [];
  const currentRoundHasUnanswered = currentRoundQuestions.some((q) => !q.answer);
  const context = `Chapter: ${chapterTitle} — Section: ${sectionTitle}`;

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        Log every question that comes up as you read. Answer each one, then
        start a new round for whatever follow-up questions the answers raise.
        Keep going until a round produces no new questions — that&apos;s how
        you know you actually understand the section.
      </p>

      {rounds.map(({ round, questions: roundQuestions }) => (
        <div key={round} className="space-y-3">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Round {round}
          </h3>
          <div className="space-y-3">
            {roundQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                chapterId={chapterId}
                sectionId={sectionId}
                question={q}
                answerStyles={answerStyles}
                context={context}
              />
            ))}
            {roundQuestions.length === 0 && (
              <p className="text-sm text-zinc-400 italic">No questions logged yet.</p>
            )}
          </div>
          {round === activeRound && (
            <AddQuestionForm chapterId={chapterId} sectionId={sectionId} round={round} />
          )}
        </div>
      ))}

      {currentRoundQuestions.length > 0 && !currentRoundHasUnanswered && (
        <button
          onClick={() => setActiveRound((r) => r + 1)}
          className="rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          No more questions from round {activeRound} — start round {activeRound + 1}
        </button>
      )}
    </div>
  );
}

function AddQuestionForm({
  chapterId,
  sectionId,
  round,
}: {
  chapterId: string;
  sectionId: string;
  round: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addQuestion(chapterId, sectionId, round, formData);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input
        name="text"
        placeholder="What are you wondering about right now?"
        required
        className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium hover:opacity-90"
      >
        Add question
      </button>
    </form>
  );
}

function QuestionCard({
  chapterId,
  sectionId,
  question,
  answerStyles,
  context,
}: {
  chapterId: string;
  sectionId: string;
  question: Question;
  answerStyles: AnswerStyle[];
  context: string;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [answerDraft, setAnswerDraft] = useState(question.answer ?? "");
  const [isPending, startTransition] = useTransition();

  const style = answerStyles.find((s) => s.id === question.answerStyleId);
  const prompt = style
    ? style.promptTemplate
        .replaceAll("{{question}}", question.text)
        .replaceAll("{{context}}", context)
    : "";

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{question.text}</p>
        {question.answer && (
          <span className="text-xs shrink-0 text-green-700 dark:text-green-400">Answered</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={question.answerStyleId ?? ""}
          onChange={(e) =>
            startTransition(() =>
              setQuestionAnswerStyle(chapterId, sectionId, question.id, e.target.value)
            )
          }
          className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs"
        >
          <option value="">Choose an answer style...</option>
          {answerStyles.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {style && (
          <button
            onClick={() => setShowPrompt((v) => !v)}
            className="text-xs rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {showPrompt ? "Hide prompt" : "Generate prompt"}
          </button>
        )}
      </div>

      {showPrompt && style && (
        <div className="space-y-2">
          <textarea
            readOnly
            value={prompt}
            rows={4}
            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-xs font-mono"
          />
          <button
            onClick={() => navigator.clipboard.writeText(prompt)}
            className="text-xs rounded-md border border-zinc-300 dark:border-zinc-700 px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Copy prompt to paste into Claude/ChatGPT
          </button>
        </div>
      )}

      <div className="space-y-2">
        <textarea
          value={answerDraft}
          onChange={(e) => setAnswerDraft(e.target.value)}
          rows={3}
          placeholder="Paste the AI's answer back here once you have it..."
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
        <button
          disabled={isPending || answerDraft === (question.answer ?? "")}
          onClick={() =>
            startTransition(() =>
              saveQuestionAnswer(chapterId, sectionId, question.id, answerDraft)
            )
          }
          className="rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40"
        >
          Save answer
        </button>
      </div>
    </div>
  );
}
