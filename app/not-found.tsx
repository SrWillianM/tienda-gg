import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClassName } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[70vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">404</p>
        <h1 className="mt-4 text-5xl font-extrabold text-foreground sm:text-6xl">Página no encontrada</h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Puede que el enlace haya cambiado o la página no exista en esta plantilla.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClassName("primary", "lg") }>
            Ir al inicio
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/products" className={buttonClassName("outline", "lg") }>
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
