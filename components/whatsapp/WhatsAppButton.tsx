"use client";

import { MessageCircleMore } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/shop";
import { useShopData } from "@/components/admin/ShopDataProvider";

export function WhatsAppButton() {
  const { shopConfig } = useShopData();

  const handleClick = () => {
    const message = `Hola, quiero más información sobre ${shopConfig.storeName}.`;
    window.open(buildWhatsAppUrl(message, shopConfig), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full bg-accent px-5 py-4 text-sm font-semibold text-white shadow-lift transition hover:bg-accentHover hover:-translate-y-0.5"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircleMore className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </button>
  );
}
