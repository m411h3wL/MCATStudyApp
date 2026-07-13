const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

export function extFromDataUrl(dataUrl: string): string | null {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,/);
  if (!match) return null;
  return MIME_TO_EXT[match[1]] ?? null;
}

export function bufferFromDataUrl(dataUrl: string): Buffer {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Buffer.from(base64, "base64");
}

export function mimeFromExt(ext: string): string {
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}
