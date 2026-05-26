"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClassName } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-shell flex min-h-[60vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[2rem] border border-border bg-white p-10 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Algo salió mal</p>
        <h1 className="mt-4 text-3xl font-bold text-foreground">No pudimos cargar esta sección</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Puedes intentar de nuevo o volver al inicio para seguir navegando la tienda.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonClassName("primary", "lg") }>
            Reintentar
          </button>
          <Link href="/" className={buttonClassName("outline", "lg") }>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
