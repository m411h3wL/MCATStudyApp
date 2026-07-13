import { promises as fs } from "fs";
import path from "path";
import type { Section, QuestionDoc } from "./types";

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
