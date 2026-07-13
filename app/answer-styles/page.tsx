import * as db from "@/lib/db";
import { deleteAnswerStyle } from "@/lib/actions";
import { AnswerStyleForm } from "./answer-style-form";

export default async function AnswerStylesPage() {
  const styles = await db.getAnswerStyles();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Answer Styles</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Your repertoire of ways to have a question answered back to you.
          Attach one of these to a question to generate a ready-to-paste
          prompt for Claude or ChatGPT.
        </p>
      </div>

      <AnswerStyleForm />

      <ul className="space-y-2">
        {styles.map((style) => (
          <li
            key={style.id}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-start justify-between gap-3"
          >
            <div>
              <p className="font-medium text-sm">{style.name}</p>
              {style.description && (
                <p className="text-xs text-zinc-500 mt-0.5">{style.description}</p>
              )}
              <p className="text-xs font-mono text-zinc-400 mt-2 whitespace-pre-wrap">
                {style.promptTemplate}
              </p>
            </div>
            <form action={deleteAnswerStyle.bind(null, style.id)}>
              <button
                type="submit"
                className="text-xs text-red-600 dark:text-red-400 hover:underline shrink-0"
              >
                Delete
              </button>
            </form>
          </li>
        ))}
        {styles.length === 0 && (
          <li className="text-sm text-zinc-500">No answer styles yet.</li>
        )}
      </ul>
    </div>
  );
}
