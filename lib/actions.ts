"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import * as db from "./db";
import { extFromDataUrl, bufferFromDataUrl } from "./images";
import type { Section, SectionImage } from "./types";

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

export async function renameSection(sectionId: string, title: string) {
  const sections = await db.getSections();
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return;
  section.title = title.trim() ? title.trim() : undefined;
  await db.saveSections(sections);
  revalidatePath("/");
  revalidatePath(`/sections/${sectionId}`);
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

// Images

export async function addImage(sectionId: string, dataUrl: string): Promise<SectionImage> {
  const ext = extFromDataUrl(dataUrl);
  if (!ext) throw new Error("Unsupported image type");

  const id = randomUUID();
  await db.writeImageFile(sectionId, id, ext, bufferFromDataUrl(dataUrl));

  const image: SectionImage = {
    id,
    sectionId,
    ext,
    createdAt: new Date().toISOString(),
  };
  const images = await db.getImages(sectionId);
  await db.saveImages(sectionId, [...images, image]);

  revalidatePath(`/sections/${sectionId}`);
  return image;
}

export async function deleteImage(sectionId: string, imageId: string) {
  const images = await db.getImages(sectionId);
  const image = images.find((i) => i.id === imageId);
  if (!image) return;

  await db.deleteImageFile(sectionId, imageId, image.ext);
  await db.saveImages(
    sectionId,
    images.filter((i) => i.id !== imageId)
  );
  revalidatePath(`/sections/${sectionId}`);
}
