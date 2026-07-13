import * as db from "@/lib/db";
import { mimeFromExt } from "@/lib/images";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sectionId: string; imageId: string }> }
) {
  const { sectionId, imageId } = await params;
  const images = await db.getImages(sectionId);
  const image = images.find((i) => i.id === imageId);
  if (!image) return new Response("Not found", { status: 404 });

  const buffer = await db.readImageFile(sectionId, imageId, image.ext);
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": mimeFromExt(image.ext),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
