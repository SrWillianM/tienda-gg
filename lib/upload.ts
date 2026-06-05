// Client helper to upload images via our protected API
export async function uploadProductImages(files: File[]): Promise<string[]> {
  if (!files.length) return [];

  const formData = new FormData();
  files.forEach((f) => formData.append("files", f));

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "No se pudieron subir las imágenes");
  }

  const data = await res.json();
  return data.paths || [];
}

// Helper: filter out any accidental base64/data: URLs (they bloat DB)
export function sanitizeImageList(images: string[] | undefined): string[] {
  if (!images) return [];
  return images.filter((img) => {
    if (!img) return false;
    if (img.startsWith("data:")) return false; // block base64
    if (img.length > 500 && img.includes(",")) return false; // looks like embedded
    return true;
  });
}
