import { promises as fs } from "fs";
import path from "path";
import type { Chapter, Section, QuestionDoc, AnswerStyle } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(relPath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, relPath), "utf-8");
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson<T>(relPath: string, data: T): Promise<void> {
  const full = path.join(DATA_DIR, relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// Chapters

export async function getChapters(): Promise<Chapter[]> {
  return readJson<Chapter[]>("chapters.json", []);
}

export async function saveChapters(chapters: Chapter[]): Promise<void> {
  await writeJson("chapters.json", chapters);
}

export async function getChapter(chapterId: string): Promise<Chapter | undefined> {
  const chapters = await getChapters();
  return chapters.find((c) => c.id === chapterId);
}

// Sections

export async function getSections(): Promise<Section[]> {
  return readJson<Section[]>("sections.json", []);
}

export async function saveSections(sections: Section[]): Promise<void> {
  await writeJson("sections.json", sections);
}

export async function getSection(sectionId: string): Promise<Section | undefined> {
  const sections = await getSections();
  return sections.find((s) => s.id === sectionId);
}

export async function getSectionsByChapter(chapterId: string): Promise<Section[]> {
  const sections = await getSections();
  return sections
    .filter((s) => s.chapterId === chapterId)
    .sort((a, b) => a.order - b.order);
}

// Question docs (one JSON file per section, holding all its rounds)

export async function getQuestionDocs(sectionId: string): Promise<QuestionDoc[]> {
  return readJson<QuestionDoc[]>(`sections/${sectionId}/question-docs.json`, []);
}

export async function saveQuestionDocs(
  sectionId: string,
  docs: QuestionDoc[]
): Promise<void> {
  await writeJson(`sections/${sectionId}/question-docs.json`, docs);
}

// Answer styles

export async function getAnswerStyles(): Promise<AnswerStyle[]> {
  return readJson<AnswerStyle[]>("answer-styles.json", []);
}

export async function saveAnswerStyles(styles: AnswerStyle[]): Promise<void> {
  await writeJson("answer-styles.json", styles);
}
