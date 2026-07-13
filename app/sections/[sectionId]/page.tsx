import Link from "next/link";
import { notFound } from "next/navigation";
import * as db from "@/lib/db";
import { QuestionDocEditor } from "./question-doc-editor";
import { AddQuestionDocButton } from "./add-question-doc-button";
import { SectionNav } from "./section-nav";
import { ImagePasteArea } from "./image-paste-area";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ sectionId: string }>;
}) {
  const { sectionId } = await params;

  const [section, allSections] = await Promise.all([
    db.getSection(sectionId),
    db.getSections(),
  ]);
  if (!section) notFound();

  const sorted = [...allSections].sort((a, b) => a.order - b.order);
  const prevSection = sorted.find((s) => s.order === section.order - 1);
  const nextSection = sorted.find((s) => s.order === section.order + 1);

  const [docs, images] = await Promise.all([
    db.getQuestionDocs(sectionId).then((d) => d.sort((a, b) => a.index - b.index)),
    db.getImages(sectionId),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Sections
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight mt-1">
          Section {section.order}
          {section.title ? ` — ${section.title}` : ""}
        </h1>
      </div>

      <ImagePasteArea sectionId={sectionId} initialImages={images} />

      <div className="space-y-6">
        {docs.map((doc) => (
          <QuestionDocEditor
            key={doc.id}
            sectionId={sectionId}
            sectionOrder={section.order}
            doc={doc}
            autoFocus={docs.length === 1 && doc.content === ""}
          />
        ))}
        {docs.length === 0 && (
          <p className="text-sm text-zinc-500">
            No question docs yet for this section.
          </p>
        )}
        <AddQuestionDocButton sectionId={sectionId} />
      </div>

      <SectionNav prevSectionId={prevSection?.id} nextSectionId={nextSection?.id} />
    </div>
  );
}
