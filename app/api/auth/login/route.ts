import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getDemoCredentials, signAuthSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json({ error: "Credenciales incompletas" }, { status: 400 });
  }

  const user = getDemoCredentials().find(
    (candidate) => candidate.username === username && candidate.password === password,
  );

  if (!user) {
    return NextResponse.json({ error: "Usuario o contraseña inválidos" }, { status: 401 });
  }

  const token = await signAuthSession({
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  });

  const response = NextResponse.json({
    session: {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
