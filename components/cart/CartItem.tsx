"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { buildSelectionLabel, formatPrice, type CartLine } from "@/lib/shop";
import { cn } from "@/lib/cn";

interface CartItemProps {
  item: CartLine;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <article
      className={cn(
        "flex gap-4 rounded-3xl border border-border bg-white p-4 shadow-sm",
        compact && "p-3",
      )}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">{item.name}</p>
            <p className="text-sm text-muted">{item.category}</p>
            <p className="mt-1 text-sm text-muted">
              {buildSelectionLabel(item.selectedOptions) || "Sin variación"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            className="rounded-full p-2 text-muted transition hover:bg-surface hover:text-foreground"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
            {item.badge ? <Badge className="mt-2">{item.badge}</Badge> : null}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
              className={buttonClassName("ghost", "sm", "rounded-full border-0 px-3")}
              aria-label="Disminuir cantidad"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-foreground">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
              className={buttonClassName("ghost", "sm", "rounded-full border-0 px-3")}
              aria-label="Aumentar cantidad"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
