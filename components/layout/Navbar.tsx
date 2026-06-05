"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { cn } from "@/lib/cn";
import { useShopData } from "@/components/admin/ShopDataProvider";
import { useAuth } from "@/components/auth/AuthProvider";

const navigationItems = [
  { href: "/", label: "Inicio" },
  { href: "/products", label: "Productos" },
  { href: "/cart", label: "Carrito" },
  { href: "/checkout", label: "Checkout" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();
  const { shopConfig } = useShopData();
  const { session, logout, loading } = useAuth();
  const canAccessDashboard = session?.role === "ceo" || session?.role === "admin";

  // Hide the "please login to save cart" banner on login/admin pages and when we are loading auth
  const hideCartBanner = loading || pathname === "/login" || pathname === "/admin" || pathname.startsWith("/admin");
  const menuItems = canAccessDashboard
    ? [...navigationItems.slice(0, 2), { href: "/admin", label: "Panel" }, ...navigationItems.slice(2)]
    : navigationItems;

  return (
    <nav className="border-b border-border bg-white/90 backdrop-blur-xl">
      {/* Banner invitando a iniciar sesión si hay items y no hay sesión */}
      {!hideCartBanner && !session && typeof window !== "undefined" ? (
        (() => {
          try {
            const stored = window.localStorage.getItem("tienda-whatsapp-pro-cart");
            const items = stored ? JSON.parse(stored) : [];
            return items.length > 0 ? (
              <div className="bg-amber-50 border-b border-amber-100 text-amber-800">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
                  <div className="text-sm">Guarda tu carrito iniciando sesión para recuperarlo después.</div>
                  <div className="flex items-center gap-2">
                    <Link href="/login" className={buttonClassName("primary", "sm")}>
                      Iniciar sesión
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          window.localStorage.removeItem("tienda-whatsapp-pro-cart");
                        } catch {}
                        try {
                          location.reload();
                        } catch {}
                      }}
                      className={buttonClassName("ghost", "sm")}
                    >
                      Ignorar
                    </button>
                  </div>
                </div>
              </div>
            ) : null;
          } catch {
            return null;
          }
        })()
      ) : null}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src={shopConfig.logo} alt={shopConfig.storeName} width={164} height={48} priority />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {menuItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-surface text-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {!loading && session ? (
            <div className="hidden items-center gap-3 lg:flex">
              <div className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">
                {session.displayName} · {session.role.toUpperCase()}
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className={buttonClassName("outline", "md")}
              >
                Salir
              </button>
            </div>
          ) : null}

          {!loading && !session ? (
            <Link href="/login" className={buttonClassName("primary", "md", "hidden lg:inline-flex")}>
              Iniciar sesión
            </Link>
          ) : null}

          <button
            type="button"
            onClick={openDrawer}
            className="relative hidden rounded-full border border-border bg-white p-3 text-foreground transition hover:bg-surface lg:inline-flex"
            aria-label="Abrir carrito"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            ) : null}
          </button>

          <Link href="/checkout" className={buttonClassName("primary", "md", "hidden lg:inline-flex") }>
            Finalizar pedido
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="inline-flex rounded-full border border-border bg-white p-3 text-foreground transition hover:bg-surface lg:hidden"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-white lg:hidden",
          isMobileMenuOpen ? "block" : "hidden",
        )}
      >
        <div className="mx-auto grid max-w-7xl gap-2 px-4 py-4 sm:px-6">
          {menuItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive ? "bg-surface text-foreground" : "text-muted hover:bg-surface hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {session ? (
            <button type="button" onClick={() => void logout()} className={buttonClassName("ghost", "md")}>
              Salir
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={buttonClassName("primary", "md")}>
              Iniciar sesión
            </Link>
          )}

          <button type="button" onClick={openDrawer} className={buttonClassName("outline", "md", "justify-between") }>
            <span>Abrir carrito</span>
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
