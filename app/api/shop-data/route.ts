import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { readShopData, resetShopData, writeShopData } from "@/lib/shop-data.server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET() {
  const data = await readShopData();
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  // Server-side role protection: only admin + ceo can modify catalog/config
  if (!session || !["admin", "ceo"].includes(session.role)) {
    return NextResponse.json({ error: "No autorizado. Solo admin o CEO pueden guardar cambios." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    config?: unknown;
    products?: unknown;
  } | null;

  if (!body || !body.config || !Array.isArray(body.products)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const data = await writeShopData({
    config: body.config as never,
    products: body.products as never,
  });

  return NextResponse.json(data);
}

export async function DELETE() {
  const data = await resetShopData();
  return NextResponse.json(data);
}
