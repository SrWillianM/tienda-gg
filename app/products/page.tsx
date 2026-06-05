"use client";

import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useShopData } from "@/components/admin/ShopDataProvider";

export default function ProductsPage() {
  const { products } = useShopData();

  // Correct Next.js 16+ way for client components:
  // Use the hook instead of the searchParams prop (the prop is now a Promise in the App Router).
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get("category") || undefined;

  return (
    <div className="bg-surface/40">
      <section className="container-shell py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Catálogo oficial</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            Productos publicados de GGcuentaspy
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            Revisa el catálogo vigente, filtra por categoría y envía tu pedido desde la web oficial.
          </p>
        </div>
      </section>

      <ProductGrid products={products} defaultCategory={defaultCategory} />
    </div>
  );
}
