import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import { useShopData } from "@/components/admin/ShopDataProvider";

export function Header() {
  const { shopConfig } = useShopData();

  return (
    <header className="sticky top-0 z-30">
      <div className="border-b border-border bg-header text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Badge className="border-white/20 bg-white/10 text-white">GGcuentaspy</Badge>
            <span className="hidden text-white/80 sm:inline">{shopConfig.shippingNote}</span>
          </div>
          <span className="text-white/80">Atención y pedidos: {shopConfig.supportPhone}</span>
        </div>
      </div>
      <Navbar />
    </header>
  );
}
