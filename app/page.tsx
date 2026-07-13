import Link from "next/link";
import * as db from "@/lib/db";
import { AddSectionForm } from "./add-section-form";

export default async function Home() {
  const sections = (await db.getSections()).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sections</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          {sections.length} section{sections.length === 1 ? "" : "s"}
        </p>
      </div>

      <AddSectionForm />

      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        {sections.map((s) => (
          <li key={s.id} className="px-4 py-3">
            <Link href={`/sections/${s.id}`} className="font-medium hover:underline">
              Section {s.order}
              {s.title ? ` — ${s.title}` : ""}
            </Link>
          </li>
        ))}
        {sections.length === 0 && (
          <li className="px-4 py-6 text-sm text-zinc-500">
            No sections yet — add the first one above.
          </li>
        )}
      </ul>
    </div>
  );
}
