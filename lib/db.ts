import { promises as fs } from "fs";
import path from "path";
import type {
  Chapter,
  Section,
  Question,
  BrainstormItem,
  Flashcard,
  AnswerStyle,
} from "./types";

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

async function readText(relPath: string, fallback: string): Promise<string> {
  try {
    return await fs.readFile(path.join(DATA_DIR, relPath), "utf-8");
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeText(relPath: string, content: string): Promise<void> {
  const full = path.join(DATA_DIR, relPath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content, "utf-8");
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

// Notes (markdown, one file per section)

export async function getNotes(sectionId: string): Promise<string> {
  return readText(`sections/${sectionId}/notes.md`, "");
}

export async function saveNotes(sectionId: string, content: string): Promise<void> {
  await writeText(`sections/${sectionId}/notes.md`, content);
}

// Questions

export async function getQuestions(sectionId: string): Promise<Question[]> {
  return readJson<Question[]>(`sections/${sectionId}/questions.json`, []);
}

export async function saveQuestions(
  sectionId: string,
  questions: Question[]
): Promise<void> {
  await writeJson(`sections/${sectionId}/questions.json`, questions);
}

// Flashcard brainstorm

export async function getBrainstorm(sectionId: string): Promise<BrainstormItem[]> {
  return readJson<BrainstormItem[]>(`sections/${sectionId}/brainstorm.json`, []);
}

export async function saveBrainstorm(
  sectionId: string,
  items: BrainstormItem[]
): Promise<void> {
  await writeJson(`sections/${sectionId}/brainstorm.json`, items);
}

// Flashcards

export async function getFlashcards(): Promise<Flashcard[]> {
  return readJson<Flashcard[]>("flashcards.json", []);
}

export async function saveFlashcards(cards: Flashcard[]): Promise<void> {
  await writeJson("flashcards.json", cards);
}

// Answer styles

export async function getAnswerStyles(): Promise<AnswerStyle[]> {
  return readJson<AnswerStyle[]>("answer-styles.json", []);
}

export async function saveAnswerStyles(styles: AnswerStyle[]): Promise<void> {
  await writeJson("answer-styles.json", styles);
}
