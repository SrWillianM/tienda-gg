"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Shield, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { shopConfig } from "@/lib/shop";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { refreshSession } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "No se pudo iniciar sesión");
        return;
      }

      // Merge local cart with server cart after successful login
      try {
        const local = typeof window !== "undefined" ? window.localStorage.getItem("tienda-whatsapp-pro-cart") : null;
        const items = local ? JSON.parse(local) : [];

        await fetch("/api/cart/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });

        // Load merged cart from server and replace local cart
        const mergedRes = await fetch("/api/cart/load");
        if (mergedRes.ok) {
          const mergedData = await mergedRes.json();
          if (typeof window !== "undefined") {
            window.localStorage.setItem("tienda-whatsapp-pro-cart", JSON.stringify(mergedData.items || []));
          }
        }
      } catch {
        // ignore sync failures
      }

      // Refresh session context so the name/role appears in Navbar immediately
      try {
        await refreshSession();
      } catch {}

      router.push(nextPath);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.08),transparent_28%),var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6 text-foreground">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            Acceso por roles
          </div>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Entra con tu rol y usa la tienda con permisos distintos para cada perfil.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted">
            {shopConfig.storeName} separa navegación, compra y administración para que el cliente vea solo lo que necesita y el equipo gestione el negocio con orden.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
              <Users className="h-6 w-6 text-accent" />
              <p className="mt-3 text-sm font-semibold text-foreground">User</p>
              <p className="mt-2 text-sm leading-6 text-muted">Solo compra y navega el catálogo.</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
              <Sparkles className="h-6 w-6 text-accent" />
              <p className="mt-3 text-sm font-semibold text-foreground">CEO</p>
              <p className="mt-2 text-sm leading-6 text-muted">Gestiona productos, categorías y ofertas.</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-5 shadow-soft">
              <Shield className="h-6 w-6 text-accent" />
              <p className="mt-3 text-sm font-semibold text-foreground">Admin</p>
              <p className="mt-2 text-sm leading-6 text-muted">Modifica toda la tienda y su configuración.</p>
            </div>
          </div>
        </div>

        <Card className="p-6 sm:p-8 lg:p-10">
          <div className="inline-flex rounded-full bg-header px-4 py-2 text-sm font-semibold text-white">
            <Lock className="mr-2 h-4 w-4 text-accent" />
            Ingreso seguro
          </div>

          <h2 className="mt-6 text-3xl font-bold text-foreground">Iniciar sesión</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            Usa una cuenta de demostración o reemplázala en <span className="font-semibold text-foreground">data/config.json</span>.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Usuario</label>
              <Input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="user@demo.com"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Contraseña</label>
              <Input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 grid gap-3 rounded-3xl border border-border bg-surface p-5 text-sm text-muted">
            <p className="font-semibold text-foreground">Credenciales demo</p>
            <p>User: user@demo.com / User123!</p>
            <p>CEO: ceo@demo.com / Ceo123!</p>
            <p>Admin: admin@demo.com / Admin123!</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
