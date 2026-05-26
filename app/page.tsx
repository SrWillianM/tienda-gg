import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { featuredProducts, offerProducts, shopConfig, storeCategories } from "@/lib/shop";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";

const benefits = [
  {
    icon: Truck,
    title: "Entrega ágil",
    description: "Experiencia optimizada para vender con logística clara y rápida respuesta en WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Plantilla confiable",
    description: "Código modular, limpio y listo para escalar sin tocar la base técnica.",
  },
  {
    icon: HeartHandshake,
    title: "Venta asistida",
    description: "Checkout directo a WhatsApp para cerrar más pedidos sin fricción.",
  },
  {
    icon: Sparkles,
    title: "Look premium",
    description: "Espaciado generoso, tarjetas modernas y micro-interacciones suaves.",
  },
];

const stats = [
  { value: "+3x", label: "más claro para el cliente" },
  { value: "100%", label: "responsive" },
  { value: "1 click", label: "para pedir por WhatsApp" },
];

export default function HomePage() {
  const specialOffer = offerProducts[0] ?? featuredProducts[0];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-white">
        <div className="absolute inset-0 bg-[length:32px_32px] opacity-40 [background-image:var(--hero-grid)]" />
        <div className="container-shell relative grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <Badge className="w-fit">{shopConfig.tagline}</Badge>
            <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Tu tienda online lista para vender por WhatsApp con estética premium.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Diseñada para emprendedores de Paraguay y Latam que quieren una plantilla moderna,
              editable y enfocada en convertir visitantes en pedidos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/products" className={buttonClassName("primary", "lg") }>
                Ver productos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products?category=Oferta" className={buttonClassName("outline", "lg") }>
                Ver ofertas
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
                    <h2 className="mt-2 text-2xl font-bold text-foreground">Selección premium 2026</h2>
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
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Compra por colección</h2>
          </div>
          <Link href="/products" className="hidden text-sm font-semibold text-accent transition hover:text-accentHover lg:inline-flex">
            Explorar catálogo
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {storeCategories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="group rounded-[2rem] border border-border bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Colección</p>
              <h3 className="mt-3 text-2xl font-bold text-foreground">{category}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Productos pensados para vender mejor con un catálogo limpio y ordenado.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition group-hover:text-accentHover">
                Ver categoría <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Productos destacados</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Lista para convertir</h2>
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
                  Dale protagonismo a tus productos estrella con una promoción visualmente potente.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  Este bloque está pensado para resaltar promociones, bundles o lanzamientos con estilo premium.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/products" className={buttonClassName("primary", "lg") }>
                    Ver oferta
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/checkout" className={buttonClassName("outline", "lg", "border-white/20 bg-white text-header hover:bg-white/90") }>
                    Ir al checkout
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

      <section className="container-shell pb-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Por qué elegir esta tienda</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Beneficios que venden</h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div key={benefit.title} className="rounded-[2rem] border border-border bg-white p-6 shadow-soft">
                <div className="inline-flex rounded-2xl bg-accent/10 p-3 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
