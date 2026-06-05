"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircleMore, ShoppingBag } from "lucide-react";
import { useShopData } from "@/components/admin/ShopDataProvider";
import { useCart } from "@/components/cart/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatPrice,
} from "@/lib/shop";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { shopConfig } = useShopData();
  const [customerName, setCustomerName] = useState("");

  const total = subtotal;
  const isDisabled = items.length === 0 || !customerName;

  const message = useMemo(
    () =>
      buildWhatsAppMessage({
        customer: {
          name: customerName || "Cliente",
        },
        items,
        total,
      }, shopConfig),
    [customerName, items, shopConfig, total],
  );

  const handleWhatsAppCheckout = () => {
    const url = buildWhatsAppUrl(message, shopConfig);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Pedido</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
          Escribe tu nombre y envía el pedido por WhatsApp.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          El pedido se prepara con los productos elegidos y se comparte por WhatsApp en un solo paso.
        </p>
      </div>

      {items.length === 0 ? (
        <Card className="mt-10 p-10 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-accent" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">No hay productos en el carrito</h2>
          <p className="mt-3 text-sm leading-7 text-muted">Agrega productos antes de ir al checkout.</p>
          <Link href="/products" className={buttonClassName("primary", "lg", "mt-6") }>
            Ir al catálogo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Datos del pedido</p>
            <div className="mt-6 grid gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nombre</label>
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nombre y apellido" />
              </div>

              <div className="rounded-3xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-foreground">Envío por WhatsApp</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Al continuar, se abre WhatsApp con el detalle del pedido y tu nombre para coordinar la atención.
                </p>
              </div>

              <Button onClick={handleWhatsAppCheckout} size="lg" className="mt-2 w-full text-base" disabled={isDisabled}>
                {shopConfig.ctaText}
                <MessageCircleMore className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          <Card className="h-fit p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Resumen del pedido</p>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <CartItem key={item.lineId} item={item} compact />
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-border pt-6">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-header p-5 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-white/60">Confirmación</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                El pedido se enviará al número {shopConfig.supportPhone}. Puedes ajustar el mensaje en <code className="font-semibold text-white">data/config.json</code>.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
