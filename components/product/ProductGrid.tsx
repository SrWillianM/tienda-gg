"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice, type Product } from "@/lib/shop";
import { cn } from "@/lib/cn";

interface ProductGridProps {
  products: Product[];
  defaultCategory?: string;
}

export function ProductGrid({ products, defaultCategory }: ProductGridProps) {
  const allCategories = useMemo(() => ["Todos", ...new Set(products.map((product) => product.category))], [products]);
  const maxCatalogPrice = useMemo(
    () => Math.max(...products.map((product) => product.price)),
    [products],
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    defaultCategory && allCategories.includes(defaultCategory) ? defaultCategory : "Todos",
  );
  const [maxPrice, setMaxPrice] = useState(maxCatalogPrice);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesSearch =
          `${product.name} ${product.shortDescription} ${product.category}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesCategory = category === "Todos" || product.category === category;
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
      }),
    [category, maxPrice, products, search],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-border bg-white p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar productos, marcas o categorías"
              className="pl-12"
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-4 text-sm text-muted">
              <span>Precio máximo</span>
              <span className="font-semibold text-foreground">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={maxCatalogPrice}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-green-500"
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {allCategories.map((itemCategory) => (
            <Button
              key={itemCategory}
              variant={category === itemCategory ? "primary" : "outline"}
              size="sm"
              onClick={() => setCategory(itemCategory)}
              className={cn("shrink-0 rounded-full px-4", category === itemCategory && "shadow-none")}
            >
              {itemCategory}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Catálogo</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {filteredProducts.length} productos encontrados
          </h2>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-[2rem] border border-dashed border-border bg-surface/70 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">No encontramos coincidencias</p>
          <p className="mt-2 text-sm text-muted">
            Ajusta la búsqueda o prueba otra categoría para seguir explorando.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
