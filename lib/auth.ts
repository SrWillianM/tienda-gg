import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { shopConfig, type AuthRole } from "@/lib/shop";

export const AUTH_COOKIE_NAME = "twp_session";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "tienda-whatsapp-pro-dev-secret";

export interface AuthSession {
  username: string;
  displayName: string;
  role: AuthRole;
}

const secretKey = new TextEncoder().encode(AUTH_SECRET);

export async function signAuthSession(session: AuthSession) {
  return new SignJWT({ displayName: session.displayName, role: session.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.username)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAuthSession(token: string) {
  const { payload } = await jwtVerify(token, secretKey);

  const role = payload.role as AuthRole | undefined;
  const username = payload.sub;
  const displayName = payload.displayName as string | undefined;

  if (!username || !displayName || !role) {
    throw new Error("Invalid session payload");
  }

  return {
    username,
    displayName,
    role,
  } satisfies AuthSession;
}

export function getDemoCredentials() {
  return shopConfig.authUsers;
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthSession(token);
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthSession(token);
  } catch {
    return null;
  }
}
