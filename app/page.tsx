"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { useShopData } from "@/components/admin/ShopDataProvider";

const benefits = [
  {
    icon: Truck,
    title: "Operación centralizada",
    description: "Catálogo, textos e imágenes listos para actualizar desde un solo panel.",
  },
  {
    icon: ShieldCheck,
    title: "Datos compartidos",
    description: "Los cambios guardados se reflejan para todos los visitantes de la web.",
  },
  {
    icon: HeartHandshake,
    title: "Pedido simple",
    description: "El flujo de compra pide lo mínimo y deriva el pedido a WhatsApp.",
  },
  {
    icon: Sparkles,
    title: "Imagen de marca",
    description: "Una presentación clara para operar como sitio oficial de la empresa.",
  },
];

const stats = [
  { value: "GGcuentaspy", label: "web oficial de la empresa" },
  { value: "Pedidos", label: "listos en un paso" },
  { value: "Panel", label: "editable por admin" },
];

export default function HomePage() {
  const { shopConfig, products, categories } = useShopData();
  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const offerProducts = products.filter((product) => product.offer);
  const specialOffer = offerProducts[0] ?? featuredProducts[0];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="absolute inset-0 bg-[length:32px_32px] opacity-40 [background-image:var(--hero-grid)]" />
        <div className="container-shell relative grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit">{shopConfig.tagline}</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              GGcuentaspy, catálogo oficial para pedidos rápidos y claros
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Una web preparada para mostrar productos, recibir pedidos y mantener la información actualizada desde un panel central.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className={buttonClassName("primary", "lg") }>
                Ver catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/checkout" className={buttonClassName("outline", "lg") }>
                Ir al pedido
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-border bg-surface p-5">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-accent/15 blur-3xl" />
            <div className="absolute bottom-4 right-0 h-36 w-36 rounded-full bg-black/5 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-header p-5 shadow-lift">
              <div className="rounded-[1.75rem] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Colección destacada</p>
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Producto Destacado</h2>
                  </div>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Top venta</Badge>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-surface">
                  <Image
                    src={featuredProducts[0]?.images[0] ?? "/images/product-1.svg"}
                    alt={featuredProducts[0]?.name ?? "Producto destacado"}
                    width={900}
                    height={700}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {featuredProducts.slice(0, 2).map((product) => (
                    <div key={product.id} className="rounded-3xl border border-border bg-surface p-4">
                      <p className="text-sm font-semibold text-foreground">{product.name}</p>
                      <p className="mt-1 text-sm text-muted">{product.shortDescription}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Categorías destacadas</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Explora el catálogo por línea de producto</h2>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-accent transition hover:text-accentHover lg:inline-flex">
            Explorar catálogo
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group rounded-[2rem] border border-border bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Colección</p>
              <h3 className="mt-3 text-2xl font-bold text-foreground">{category}</h3>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:text-accentHover">
                Abrir categoría <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Productos destacados</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Selección vigente</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold text-accent transition hover:text-accentHover">
            Ver todo
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {specialOffer ? (
        <section className="container-shell py-20">
          <div className="overflow-hidden rounded-[2.25rem] border border-border bg-header text-white shadow-lift">
            <div className="grid gap-8 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-12">
              <div className="flex flex-col justify-center">
                <Badge className="border-white/20 bg-white/10 text-white">Oferta especial</Badge>
                <h2 className="mt-5 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
                  Producto destacado de la semana
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  Resalta aquí el artículo que quieras poner primero en la web oficial y en los pedidos.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/products" className={buttonClassName("primary", "lg") }>
                    Ver producto
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/checkout" className={buttonClassName("outline", "lg", "border-white/20 bg-white text-header hover:bg-white/90") }>
                    Ir al pedido
                  </Link>
                </div>
              </div>

              <div className="rounded-[2rem] bg-white p-6 text-foreground">
                <Image
                  src={specialOffer.images[0]}
                  alt={specialOffer.name}
                  width={900}
                  height={700}
                  className="rounded-[1.5rem] object-cover"
                />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Oferta de la semana</p>
                    <h3 className="mt-2 text-2xl font-bold text-foreground">{specialOffer.name}</h3>
                    <p className="mt-2 text-sm text-muted">{specialOffer.shortDescription}</p>
                  </div>
                  <div className="rounded-3xl bg-surface px-4 py-3 text-right">
                    <p className="text-sm text-muted line-through">{specialOffer.compareAtPrice ? `${specialOffer.compareAtPrice.toLocaleString("es-PY")} Gs.` : ""}</p>
                    <p className="text-xl font-bold text-foreground">{specialOffer.price.toLocaleString("es-PY")} Gs.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(specialOffer.highlights ?? []).slice(0, 4).map((highlight) => (
                    <div key={highlight} className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      
    </div>
  );
}
