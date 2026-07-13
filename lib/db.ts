import { promises as fs } from "fs";
import path from "path";
import type { Section, QuestionDoc, SectionImage } from "./types";

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

// Images (manifest per section + binary files on disk)

export async function getImages(sectionId: string): Promise<SectionImage[]> {
  return readJson<SectionImage[]>(`sections/${sectionId}/images.json`, []);
}

export async function saveImages(
  sectionId: string,
  images: SectionImage[]
): Promise<void> {
  await writeJson(`sections/${sectionId}/images.json`, images);
}

function imageFilePath(sectionId: string, imageId: string, ext: string): string {
  return path.join(DATA_DIR, "sections", sectionId, "images", `${imageId}.${ext}`);
}

export async function writeImageFile(
  sectionId: string,
  imageId: string,
  ext: string,
  buffer: Buffer
): Promise<void> {
  const full = imageFilePath(sectionId, imageId, ext);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buffer);
}

export async function readImageFile(
  sectionId: string,
  imageId: string,
  ext: string
): Promise<Buffer> {
  return fs.readFile(imageFilePath(sectionId, imageId, ext));
}

export async function deleteImageFile(
  sectionId: string,
  imageId: string,
  ext: string
): Promise<void> {
  await fs.rm(imageFilePath(sectionId, imageId, ext), { force: true });
}
