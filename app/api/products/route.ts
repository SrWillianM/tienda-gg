import { NextResponse } from "next/server";
import { products } from "@/lib/shop";

export function GET() {
  return NextResponse.json({ products, count: products.length });
}
