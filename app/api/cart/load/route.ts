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

export async function GET(request: Request) {
  const session = await getSessionFromRequest((request as any));

  if (!session) {
    return NextResponse.json({ items: [] });
  }

  const username = session.username as string;
  const carts = await readCarts();
  const serverCart = Array.isArray(carts[username]) ? carts[username] : [];

  return NextResponse.json({ items: serverCart });
}
