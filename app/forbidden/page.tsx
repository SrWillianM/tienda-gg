import Link from "next/link";
import { buttonClassName } from "@/components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="container-shell flex min-h-[70vh] items-center justify-center py-16 text-center">
      <div className="max-w-xl rounded-[2rem] border border-border bg-white p-10 shadow-soft">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Acceso restringido</p>
        <h1 className="mt-4 text-3xl font-bold text-foreground">No tienes permiso para ver esta sección</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Tu cuenta no tiene el rol necesario para entrar aquí.
        </p>
        <Link href="/" className={buttonClassName("primary", "lg", "mt-8") }>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
