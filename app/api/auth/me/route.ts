import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  return NextResponse.json({ session });
}
