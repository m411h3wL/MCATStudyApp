"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import * as db from "./db";
import type { Section } from "./types";

export async function createSection(title?: string): Promise<Section> {
  const sections = await db.getSections();
  const section: Section = {
    id: randomUUID(),
    order: sections.length,
    title: title?.trim() ? title.trim() : undefined,
    createdAt: new Date().toISOString(),
  };
  await db.saveSections([...sections, section]);

  await db.saveQuestionDocs(section.id, [
    {
      id: randomUUID(),
      sectionId: section.id,
      index: 1,
      content: "",
      createdAt: new Date().toISOString(),
    },
  ]);

  revalidatePath("/");
  revalidatePath(`/sections/${section.id}`);
  return section;
}

export async function createQuestionDoc(sectionId: string) {
  const docs = await db.getQuestionDocs(sectionId);
  const doc = {
    id: randomUUID(),
    sectionId,
    index: docs.length + 1,
    content: "",
    createdAt: new Date().toISOString(),
  };
  await db.saveQuestionDocs(sectionId, [...docs, doc]);
  revalidatePath(`/sections/${sectionId}`);
  return doc;
}

export async function saveQuestionDocContent(
  sectionId: string,
  docId: string,
  content: string
) {
  const docs = await db.getQuestionDocs(sectionId);
  const doc = docs.find((d) => d.id === docId);
  if (!doc) return;
  doc.content = content;
  await db.saveQuestionDocs(sectionId, docs);
  revalidatePath(`/sections/${sectionId}`);
}
