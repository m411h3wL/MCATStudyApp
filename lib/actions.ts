"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import * as db from "./db";
import type { Section } from "./types";

// Chapters

export async function createChapter(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const chapters = await db.getChapters();
  const chapter = {
    id: randomUUID(),
    title,
    order: chapters.length,
    createdAt: new Date().toISOString(),
  };
  await db.saveChapters([...chapters, chapter]);
  revalidatePath("/chapters");
  revalidatePath("/");
}

// Sections

export async function createSection(chapterId: string): Promise<Section> {
  const sections = await db.getSections();
  const existingInChapter = sections.filter((s) => s.chapterId === chapterId);
  const section: Section = {
    id: randomUUID(),
    chapterId,
    order: existingInChapter.length,
    createdAt: new Date().toISOString(),
  };
  await db.saveSections([...sections, section]);
  revalidatePath(`/chapters/${chapterId}`);
  revalidatePath("/");
  return section;
}

// Question docs

export async function createQuestionDoc(chapterId: string, sectionId: string) {
  const docs = await db.getQuestionDocs(sectionId);
  const doc = {
    id: randomUUID(),
    sectionId,
    index: docs.length + 1,
    content: "",
    createdAt: new Date().toISOString(),
  };
  await db.saveQuestionDocs(sectionId, [...docs, doc]);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
  return doc;
}

export async function saveQuestionDocContent(
  chapterId: string,
  sectionId: string,
  docId: string,
  content: string
) {
  const docs = await db.getQuestionDocs(sectionId);
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return;
  doc.content = content;
  await db.saveQuestionDocs(sectionId, docs);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

// Answer styles

export async function createAnswerStyle(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const promptTemplate = String(formData.get("promptTemplate") || "").trim();
  if (!name || !promptTemplate) return;

  const styles = await db.getAnswerStyles();
  styles.push({ id: randomUUID(), name, description, promptTemplate });
  await db.saveAnswerStyles(styles);
  revalidatePath("/answer-styles");
}

export async function deleteAnswerStyle(styleId: string) {
  const styles = await db.getAnswerStyles();
  await db.saveAnswerStyles(styles.filter((s) => s.id !== styleId));
  revalidatePath("/answer-styles");
}
