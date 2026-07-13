export type SectionStatus =
  | "reading"
  | "questioning"
  | "brainstorming"
  | "ready"
  | "finalized";

export const SECTION_STATUS_LABEL: Record<SectionStatus, string> = {
  reading: "Reading",
  questioning: "Questioning",
  brainstorming: "Flashcard Brainstorm",
  ready: "Ready to Finalize",
  finalized: "Finalized",
};

export const SECTION_STATUS_ORDER: SectionStatus[] = [
  "reading",
  "questioning",
  "brainstorming",
  "ready",
  "finalized",
];

export type Chapter = {
  id: string;
  title: string;
  order: number;
  createdAt: string;
};

export type Section = {
  id: string;
  chapterId: string;
  title: string;
  order: number;
  status: SectionStatus;
  createdAt: string;
};

export type Question = {
  id: string;
  sectionId: string;
  round: number;
  text: string;
  answerStyleId?: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
};

export type BrainstormItem = {
  id: string;
  sectionId: string;
  front: string;
  back: string;
  createdAt: string;
};

export type Grade = "again" | "hard" | "good" | "easy";

export type FlashcardSrs = {
  interval: number;
  ease: number;
  reps: number;
  dueDate: string;
  lastResult?: Grade;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  chapterId: string;
  sectionId: string;
  createdAt: string;
  srs: FlashcardSrs;
};

export type AnswerStyle = {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
};
