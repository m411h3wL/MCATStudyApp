export type Section = {
  id: string;
  order: number;
  title?: string;
  createdAt: string;
};

export type QuestionDoc = {
  id: string;
  sectionId: string;
  index: number;
  content: string;
  createdAt: string;
};

export type SectionImage = {
  id: string;
  sectionId: string;
  ext: string;
  createdAt: string;
};
