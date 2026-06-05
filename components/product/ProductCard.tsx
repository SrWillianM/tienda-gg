"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useCart } from "@/components/cart/CartContext";
import { buildSelectionLabel, formatPrice, type CartSelection, type Product } from "@/lib/shop";
import { cn } from "@/lib/cn";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const createInitialSelection = (product: Product): CartSelection =>
  product.variants.reduce<CartSelection>((selection, variant) => {
    selection[variant.label] = variant.options[0] ?? "";
    return selection;
  }, {});

export function ProductCard({ product, className }: ProductCardProps) {
  const initialSelection = useMemo(() => createInitialSelection(product), [product]);
  const [selection, setSelection] = useState<CartSelection>(initialSelection);
  const { addItem, openDrawer } = useCart();

  const handleAddToCart = () => {
    addItem(product, selection);
    openDrawer();
  };

  const variantSummary = buildSelectionLabel(selection);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-3xl border border-border bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.badge ? <Badge>{product.badge}</Badge> : null}
          {product.offer ? (
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
              Oferta
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              {product.category}
            </p>
            <h3 className="mt-2 text-xl font-bold leading-tight text-foreground">
              {product.name}
            </h3>
          </div>
        </div>

        <p className="text-sm leading-6 text-muted">{product.shortDescription}</p>

        <div className="flex items-end gap-3">
          <p className="text-2xl font-bold text-foreground">{formatPrice(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="pb-1 text-sm font-medium text-muted line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          ) : null}
        </div>

        {product.variants.length > 0 ? (
          <div className="grid gap-3">
            {product.variants.map((variant) => (
              <div key={variant.label} className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {variant.label}
                </label>
                <Select
                  value={selection[variant.label]}
                  onChange={(event) =>
                    setSelection((currentSelection) => ({
                      ...currentSelection,
                      [variant.label]: event.target.value,
                    }))
                  }
                >
                  {variant.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        ) : null}

        {variantSummary ? (
          <p className="text-sm text-muted">{variantSummary}</p>
        ) : null}

        <Button className="w-full" onClick={handleAddToCart}>
          Agregar al carrito
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
