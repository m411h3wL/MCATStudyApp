import type { FlashcardSrs, Grade } from "./types";

export function initialSrs(): FlashcardSrs {
  return {
    interval: 0,
    ease: 2.5,
    reps: 0,
    dueDate: new Date().toISOString(),
  };
}

export function nextSrsState(srs: FlashcardSrs, grade: Grade): FlashcardSrs {
  let { interval, ease, reps } = srs;

  if (grade === "again") {
    reps = 0;
    ease = Math.max(1.3, ease - 0.2);
    interval = 0;
  } else {
    reps += 1;
    if (grade === "hard") {
      ease = Math.max(1.3, ease - 0.15);
      interval = reps === 1 ? 1 : Math.max(1, Math.round(interval * 1.2));
    } else if (grade === "good") {
      interval = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(interval * ease);
    } else {
      ease = ease + 0.15;
      interval = reps === 1 ? 3 : Math.round(interval * ease * 1.3);
    }
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + (grade === "again" ? 0 : Math.max(interval, 1)));

  return { interval, ease, reps, dueDate: dueDate.toISOString(), lastResult: grade };
}
