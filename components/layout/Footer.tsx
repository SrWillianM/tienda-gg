import Link from "next/link";
import { MapPin, Phone, ShoppingBag } from "lucide-react";
import { useShopData } from "@/components/admin/ShopDataProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const footerLinks = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/cart", label: "Carrito" },
  { href: "/checkout", label: "Checkout" },
];

export function Footer() {
  const { shopConfig, categories } = useShopData();
  const { session } = useAuth();

  return (
    <footer className="border-t border-border bg-header text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3 text-lg font-bold">
            <ShoppingBag className="h-6 w-6 text-accent" />
            {shopConfig.storeName}
          </div>
          <p className="max-w-lg text-sm leading-7 text-white/70">{shopConfig.description}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">Links</p>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            {session?.role === "ceo" || session?.role === "admin" ? (
              <Link href="/admin" className="transition hover:text-white">
                Panel
              </Link>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">Contacto</p>
          <div className="mt-4 grid gap-3 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-accent" />
              {shopConfig.supportPhone}
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-accent" />
              Paraguay y Latam
            </div>
            <p className="text-white/60">Categorías: {categories.join(" · ")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/45">
        © {new Date().getFullYear()} {shopConfig.storeName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
