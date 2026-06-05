"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/shop";
import { useShopData } from "@/components/admin/ShopDataProvider";

export default function CartPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { shopConfig } = useShopData();

  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Carrito</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
          Revisa tu pedido antes de enviarlo por WhatsApp.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          Mantén control del resumen, cantidades y total final antes de finalizar la compra.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="mt-10 p-10 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Tu carrito está vacío</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Explora el catálogo y agrega productos para ver el resumen aquí.
          </p>
          <Link href="/products" className={buttonClassName("primary", "lg", "mt-6") }>
            Ver productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.lineId} item={item} />
            ))}
          </div>

          <Card className="h-fit p-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Resumen</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Productos</span>
                <span className="font-semibold text-foreground">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link href="/checkout" className={buttonClassName("primary", "lg") }>
                Ir al checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className={buttonClassName("outline", "md") }>
                Seguir comprando
              </Link>
              <Button variant="ghost" onClick={clearCart}>
                Vaciar carrito
              </Button>
            </div>

            <div className="mt-6 rounded-2xl bg-surface p-4 text-sm leading-7 text-muted">
              El pedido se enviará directamente al número {shopConfig.supportPhone} por WhatsApp.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
