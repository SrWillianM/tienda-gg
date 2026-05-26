import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products, shopConfig } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora el catálogo con filtros por categoría, búsqueda y precio.",
};

interface ProductsPageProps {
  searchParams?: {
    category?: string;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const defaultCategory = searchParams?.category;

  return (
    <div className="bg-surface/40">
      <section className="container-shell py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Catálogo</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
            Productos listos para vender con checkout directo a WhatsApp.
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            {shopConfig.storeName} ofrece una experiencia de catálogo clara, moderna y fácil de editar.
          </p>
        </div>
      </section>

      <ProductGrid products={products} defaultCategory={defaultCategory} />
    </div>
  );
}
