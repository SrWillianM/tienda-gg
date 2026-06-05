"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ShopDataProvider } from "@/components/admin/ShopDataProvider";
import { CartProvider } from "@/components/cart/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isStandaloneAuthScreen = pathname === "/login" || pathname === "/forbidden";

  if (isStandaloneAuthScreen) {
    return (
      <AuthProvider>
        <ShopDataProvider>
          <CartProvider>{children}</CartProvider>
        </ShopDataProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <ShopDataProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
          </div>
        </CartProvider>
      </ShopDataProvider>
    </AuthProvider>
  );
}
