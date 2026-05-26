import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { shopConfig } from "@/lib/shop";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: shopConfig.storeName,
    template: `%s | ${shopConfig.storeName}`,
  },
  description: shopConfig.description,
  keywords: ["tienda whatsapp", "ecommerce paraguay", "plantilla nextjs", "tienda online"],
  openGraph: {
    title: shopConfig.storeName,
    description: shopConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-background font-sans antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
