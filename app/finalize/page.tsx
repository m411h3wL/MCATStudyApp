import * as db from "@/lib/db";
import { FinalizeWorkspace } from "./finalize-workspace";

export default async function FinalizePage() {
  const [sections, chapters] = await Promise.all([db.getSections(), db.getChapters()]);
  const ready = sections
    .filter((s) => s.status === "ready")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const readySections = await Promise.all(
    ready.map(async (section) => ({
      section,
      chapterTitle:
        chapters.find((c) => c.id === section.chapterId)?.title ?? "Untitled chapter",
      brainstorm: await db.getBrainstorm(section.id),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Finalize</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Every few sections, review the brainstormed candidates together and
          decide which ones actually earn a spot in your flashcard deck.
        </p>
      </div>

      {readySections.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No sections are marked &ldquo;Ready to Finalize&rdquo; yet. Move a
          section through its stages first.
        </p>
      ) : (
        <FinalizeWorkspace readySections={readySections} />
      )}
    </div>
  );
}
