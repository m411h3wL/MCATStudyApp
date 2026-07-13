"use client";

import { useState } from "react";
import { addImage, deleteImage } from "@/lib/actions";
import type { SectionImage } from "@/lib/types";

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImagePasteArea({
  sectionId,
  initialImages,
}: {
  sectionId: string;
  initialImages: SectionImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [isPasting, setIsPasting] = useState(false);

  async function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const item = [...e.clipboardData.items].find((i) => i.type.startsWith("image/"));
    if (!item) return;
    e.preventDefault();
    const file = item.getAsFile();
    if (!file) return;

    setIsPasting(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      const image = await addImage(sectionId, dataUrl);
      setImages((prev) => [...prev, image]);
    } finally {
      setIsPasting(false);
    }
  }

  async function handleDelete(imageId: string) {
    setImages((prev) => prev.filter((i) => i.id !== imageId));
    await deleteImage(sectionId, imageId);
  }

  return (
    <div className="space-y-3">
      <div
        tabIndex={0}
        onPaste={handlePaste}
        className="rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-6 text-center text-sm text-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-400"
      >
        {isPasting ? "Pasting..." : "Click here, then paste an image (⌘V / Ctrl+V)"}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/sections/${sectionId}/images/${img.id}`}
                alt=""
                className="w-full h-32 object-cover rounded-md border border-zinc-200 dark:border-zinc-800"
              />
              <button
                onClick={() => handleDelete(img.id)}
                aria-label="Delete image"
                title="Delete image"
                className="absolute top-1 right-1 rounded-full bg-black/60 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
