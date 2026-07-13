export type Chapter = {
  id: string;
  title: string;
  order: number;
  createdAt: string;
};

export type Section = {
  id: string;
  chapterId: string;
  order: number;
  createdAt: string;
};

export type QuestionDoc = {
  id: string;
  sectionId: string;
  index: number;
  content: string;
  createdAt: string;
};

export type AnswerStyle = {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
};
