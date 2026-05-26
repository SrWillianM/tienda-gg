"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { buttonClassName } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";
import { shopConfig } from "@/lib/shop";
import { cn } from "@/lib/cn";

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

  return (
    <nav className="border-b border-border bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src={shopConfig.logo} alt={shopConfig.storeName} width={164} height={48} priority />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {navigationItems.map((item) => {
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

          <Link href="/checkout" className={buttonClassName("primary", "md", "hidden lg:inline-flex")}> 
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
          {navigationItems.map((item) => {
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

          <button type="button" onClick={openDrawer} className={buttonClassName("outline", "md", "justify-between") }>
            <span>Abrir carrito</span>
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
