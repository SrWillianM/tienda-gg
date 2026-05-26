"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { CartItem } from "@/components/cart/CartItem";
import { useCart } from "@/components/cart/CartContext";
import { buttonClassName } from "@/components/ui/Button";
import { formatPrice, shopConfig } from "@/lib/shop";
import { cn } from "@/lib/cn";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, totalItems, clearCart } = useCart();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
          isDrawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[30rem] flex-col border-l border-border bg-background shadow-lift transition-transform duration-300",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Carrito lateral"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">
              Carrito
            </p>
            <h2 className="text-xl font-bold text-foreground">{totalItems} productos</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full border border-border p-2 text-muted transition hover:bg-surface hover:text-foreground"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {items.length === 0 ? (
            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 px-6 text-center">
              <p className="text-lg font-semibold text-foreground">Tu carrito está vacío</p>
              <p className="mt-2 text-sm text-muted">
                Agrega productos desde la tienda y te mostramos el resumen aquí.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className={buttonClassName("primary", "md", "mt-6")}
              >
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.lineId} item={item} compact />
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border bg-surface/50 px-6 py-5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="text-base font-bold text-foreground">{formatPrice(subtotal)}</span>
          </div>

          <div className="mt-4 grid gap-3">
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className={buttonClassName("primary", "lg", "w-full")}
            >
              Ir al checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className={buttonClassName("outline", "md", "w-full")}
              >
                Ver carrito
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className={buttonClassName("ghost", "md", "w-full")}
              >
                Vaciar
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted">
            Pedido rápido por WhatsApp con atención al cliente directa al {shopConfig.supportPhone}.
          </p>
        </div>
      </aside>
    </>
  );
}
