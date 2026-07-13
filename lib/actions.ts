"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import * as db from "./db";
import { nextSrsState, initialSrs } from "./srs";
import type { Grade, SectionStatus } from "./types";

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

export async function createSection(chapterId: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const sections = await db.getSections();
  const existingInChapter = sections.filter((s) => s.chapterId === chapterId);
  const section = {
    id: randomUUID(),
    chapterId,
    title,
    order: existingInChapter.length,
    status: "reading" as SectionStatus,
    createdAt: new Date().toISOString(),
  };
  await db.saveSections([...sections, section]);
  revalidatePath(`/chapters/${chapterId}`);
  revalidatePath("/");
}

export async function setSectionStatus(sectionId: string, status: SectionStatus) {
  const sections = await db.getSections();
  const section = sections.find((s) => s.id === sectionId);
  if (!section) return;
  section.status = status;
  await db.saveSections(sections);
  revalidatePath(`/chapters/${section.chapterId}/sections/${sectionId}`);
  revalidatePath(`/chapters/${section.chapterId}`);
  revalidatePath("/finalize");
  revalidatePath("/");
}

// Notes

export async function saveSectionNotes(
  chapterId: string,
  sectionId: string,
  content: string
) {
  await db.saveNotes(sectionId, content);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

// Questions

export async function addQuestion(
  chapterId: string,
  sectionId: string,
  round: number,
  formData: FormData
) {
  const text = String(formData.get("text") || "").trim();
  if (!text) return;

  const questions = await db.getQuestions(sectionId);
  questions.push({
    id: randomUUID(),
    sectionId,
    round,
    text,
    createdAt: new Date().toISOString(),
  });
  await db.saveQuestions(sectionId, questions);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

export async function setQuestionAnswerStyle(
  chapterId: string,
  sectionId: string,
  questionId: string,
  answerStyleId: string
) {
  const questions = await db.getQuestions(sectionId);
  const q = questions.find((q) => q.id === questionId);
  if (!q) return;
  q.answerStyleId = answerStyleId;
  await db.saveQuestions(sectionId, questions);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

export async function saveQuestionAnswer(
  chapterId: string,
  sectionId: string,
  questionId: string,
  answer: string
) {
  const questions = await db.getQuestions(sectionId);
  const q = questions.find((q) => q.id === questionId);
  if (!q) return;
  q.answer = answer;
  q.answeredAt = new Date().toISOString();
  await db.saveQuestions(sectionId, questions);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

export async function startNextRound(chapterId: string, sectionId: string) {
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

// Flashcard brainstorm

export async function addBrainstormItem(
  chapterId: string,
  sectionId: string,
  formData: FormData
) {
  const front = String(formData.get("front") || "").trim();
  const back = String(formData.get("back") || "").trim();
  if (!front || !back) return;

  const items = await db.getBrainstorm(sectionId);
  items.push({
    id: randomUUID(),
    sectionId,
    front,
    back,
    createdAt: new Date().toISOString(),
  });
  await db.saveBrainstorm(sectionId, items);
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
}

export async function deleteBrainstormItem(
  chapterId: string,
  sectionId: string,
  itemId: string
) {
  const items = await db.getBrainstorm(sectionId);
  await db.saveBrainstorm(
    sectionId,
    items.filter((i) => i.id !== itemId)
  );
  revalidatePath(`/chapters/${chapterId}/sections/${sectionId}`);
  revalidatePath("/finalize");
}

// Finalization: turn brainstorm items from a batch of "ready" sections into real flashcards

export async function finalizeSections(sectionIds: string[], keepItemIds: string[]) {
  if (sectionIds.length === 0) return;

  const sections = await db.getSections();
  const keepSet = new Set(keepItemIds);
  const flashcards = await db.getFlashcards();

  for (const sectionId of sectionIds) {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) continue;

    const brainstorm = await db.getBrainstorm(sectionId);
    for (const item of brainstorm) {
      if (!keepSet.has(item.id)) continue;
      flashcards.push({
        id: randomUUID(),
        front: item.front,
        back: item.back,
        chapterId: section.chapterId,
        sectionId: section.id,
        createdAt: new Date().toISOString(),
        srs: initialSrs(),
      });
    }

    section.status = "finalized";
  }

  await db.saveFlashcards(flashcards);
  await db.saveSections(sections);

  revalidatePath("/finalize");
  revalidatePath("/flashcards");
  revalidatePath("/");
  for (const sectionId of sectionIds) {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      revalidatePath(`/chapters/${section.chapterId}/sections/${sectionId}`);
      revalidatePath(`/chapters/${section.chapterId}`);
    }
  }
}

// Flashcard review (SRS)

export async function reviewFlashcard(flashcardId: string, grade: Grade) {
  const cards = await db.getFlashcards();
  const card = cards.find((c) => c.id === flashcardId);
  if (!card) return;
  card.srs = nextSrsState(card.srs, grade);
  await db.saveFlashcards(cards);
  revalidatePath("/flashcards");
  revalidatePath("/flashcards/review");
}

export async function deleteFlashcard(flashcardId: string) {
  const cards = await db.getFlashcards();
  await db.saveFlashcards(cards.filter((c) => c.id !== flashcardId));
  revalidatePath("/flashcards");
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
