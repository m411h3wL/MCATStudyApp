import { SECTION_STATUS_LABEL, type SectionStatus } from "@/lib/types";

const COLORS: Record<SectionStatus, string> = {
  reading: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  questioning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  brainstorming: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  ready: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  finalized: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
};

export function StatusBadge({ status }: { status: SectionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${COLORS[status]}`}
    >
      {SECTION_STATUS_LABEL[status]}
    </span>
  );
}
