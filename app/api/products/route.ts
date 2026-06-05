import { NextResponse } from "next/server";
import { readShopData } from "@/lib/shop-data.server";

export async function GET() {
  const { products } = await readShopData();
  return NextResponse.json({ products, count: products.length });
}
