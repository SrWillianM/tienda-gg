import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSessionFromRequest } from "@/lib/auth";

const CARTS_PATH = path.join(process.cwd(), "data", "carts.json");

async function readCarts() {
  try {
    const content = await fs.readFile(CARTS_PATH, "utf-8");
    return JSON.parse(content) as Record<string, any[]>;
  } catch {
    return {};
  }
}

async function writeCarts(carts: Record<string, any[]>) {
  await fs.mkdir(path.dirname(CARTS_PATH), { recursive: true });
  await fs.writeFile(CARTS_PATH, JSON.stringify(carts, null, 2), "utf-8");
}

export async function POST(request: Request) {
  const session = await getSessionFromRequest((request as any));

  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const username = session.username as string;

  const carts = await readCarts();
  const serverCart = Array.isArray(carts[username]) ? carts[username] : [];
  const localCart = body.items as any[];

  const merged = new Map<string, any>();

  for (const item of [...serverCart, ...localCart]) {
    if (!item?.lineId) continue;
    const existing = merged.get(item.lineId);
    if (existing) {
      existing.quantity = (existing.quantity || 0) + (item.quantity || 0);
      merged.set(item.lineId, existing);
    } else {
      merged.set(item.lineId, { ...item });
    }
  }

  const mergedArray = Array.from(merged.values());
  carts[username] = mergedArray;
  await writeCarts(carts);

  return NextResponse.json({ items: mergedArray });
}
