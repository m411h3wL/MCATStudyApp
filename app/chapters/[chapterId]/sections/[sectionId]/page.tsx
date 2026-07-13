import Link from "next/link";
import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import { SectionWorkspace } from "./section-workspace";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ chapterId: string; sectionId: string }>;
}) {
  const { chapterId, sectionId } = await params;

  const [chapter, section] = await Promise.all([
    db.getChapter(chapterId),
    db.getSection(sectionId),
  ]);
  if (!chapter || !section || section.chapterId !== chapterId) notFound();

  const [notes, questions, brainstorm, answerStyles] = await Promise.all([
    db.getNotes(sectionId),
    db.getQuestions(sectionId),
    db.getBrainstorm(sectionId),
    db.getAnswerStyles(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/chapters/${chapterId}`}
          className="text-sm text-zinc-500 hover:underline"
        >
          ← {chapter.title}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">{section.title}</h1>
      </div>

      <SectionWorkspace
        section={section}
        chapterTitle={chapter.title}
        notes={notes}
        questions={questions}
        brainstorm={brainstorm}
        answerStyles={answerStyles}
      />
    </div>
  );
}
