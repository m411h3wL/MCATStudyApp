import Link from "next/link";
import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import { QuestionDocEditor } from "./question-doc-editor";
import { AddQuestionDocButton } from "./add-question-doc-button";
import { SectionNav } from "./section-nav";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ chapterId: string; sectionId: string }>;
}) {
  const { chapterId, sectionId } = await params;

  const [chapter, section, chapterSections] = await Promise.all([
    db.getChapter(chapterId),
    db.getSection(sectionId),
    db.getSectionsByChapter(chapterId),
  ]);
  if (!chapter || !section || section.chapterId !== chapterId) notFound();

  const docs = (await db.getQuestionDocs(sectionId)).sort((a, b) => a.index - b.index);

  const prevSection = chapterSections.find((s) => s.order === section.order - 1);
  const nextSection = chapterSections.find((s) => s.order === section.order + 1);

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/chapters/${chapterId}`} className="text-sm text-zinc-500 hover:underline">
          ← {chapter.title}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          Section {section.order}
        </h1>
      </div>

      <div className="space-y-6">
        {docs.map((doc) => (
          <QuestionDocEditor
            key={doc.id}
            chapterId={chapterId}
            sectionId={sectionId}
            sectionOrder={section.order}
            doc={doc}
          />
        ))}
        {docs.length === 0 && (
          <p className="text-sm text-zinc-500">
            No question docs yet for this section.
          </p>
        )}
        <AddQuestionDocButton chapterId={chapterId} sectionId={sectionId} />
      </div>

      <SectionNav
        chapterId={chapterId}
        prevSectionId={prevSection?.id}
        nextSectionId={nextSection?.id}
      />
    </div>
  );
}
