import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSessionFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

// Allowed image types
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Only admin + ceo can upload product images
  if (!["admin", "ceo"].includes(session.role)) {
    return NextResponse.json({ error: "Sin permisos para subir imágenes" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se enviaron archivos" }, { status: 400 });
    }

    // Ensure directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    const savedPaths: string[] = [];

    for (const file of files) {
      if (!ALLOWED.includes(file.type)) {
        return NextResponse.json({ error: `Tipo no permitido: ${file.type}` }, { status: 400 });
      }

      if (file.size > 8 * 1024 * 1024) {
        return NextResponse.json({ error: "Archivo demasiado grande (máx 8MB)" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = file.name.split(".").pop() || "jpg";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = path.join(UPLOAD_DIR, uniqueName);

      await writeFile(filePath, buffer);

      // Public URL path (served statically by Next)
      savedPaths.push(`/uploads/products/${uniqueName}`);
    }

    return NextResponse.json({ paths: savedPaths });
  } catch (err) {
    console.error("Upload error", err);
    return NextResponse.json({ error: "Error al guardar las imágenes" }, { status: 500 });
  }
}
