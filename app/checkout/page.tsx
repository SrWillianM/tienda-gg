"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircleMore, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  formatPrice,
  shopConfig,
} from "@/lib/shop";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const total = subtotal;
  const isDisabled = items.length === 0 || !customerName || !customerPhone || !customerAddress;

  const message = useMemo(
    () =>
      buildWhatsAppMessage({
        customer: {
          name: customerName || "Cliente",
          phone: customerPhone || "Sin teléfono",
          address: customerAddress || "Sin dirección",
        },
        items,
        total,
      }),
    [customerAddress, customerName, customerPhone, items, total],
  );

  const handleWhatsAppCheckout = () => {
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container-shell py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Checkout</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
          Completa tus datos y finaliza el pedido por WhatsApp.
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          No usamos pasarelas. Este flujo está pensado para cerrar ventas más rápido y sin fricción.
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
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Datos del cliente</p>
            <div className="mt-6 grid gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nombre completo</label>
                <Input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Teléfono</label>
                <Input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="+595 981 234 567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Dirección</label>
                <Textarea
                  value={customerAddress}
                  onChange={(event) => setCustomerAddress(event.target.value)}
                  placeholder="Barrio, ciudad, referencia y detalles de entrega"
                />
              </div>

              <div className="rounded-3xl border border-border bg-surface p-5">
                <p className="text-sm font-semibold text-foreground">Mensajería automática</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Al hacer clic, se abre WhatsApp con el pedido completo, incluyendo productos, cantidades, variantes y datos del cliente.
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
              <p className="text-sm uppercase tracking-[0.24em] text-white/60">WhatsApp final</p>
              <p className="mt-3 text-sm leading-7 text-white/80">
                Este pedido se enviará al número {shopConfig.supportPhone}. Puedes personalizarlo en <code className="font-semibold text-white">data/config.json</code>.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
