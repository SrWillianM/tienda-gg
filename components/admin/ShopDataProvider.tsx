"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultProducts, defaultShopConfig, type Product, type ShopConfig } from "@/lib/shop";

interface ShopDataContextValue {
  shopConfig: ShopConfig;
  products: Product[];
  categories: string[];
  isDirty: boolean; // true = hay cambios locales sin guardar en servidor
  isLoading: boolean; // true while first fetching from DB
  updateShopConfig: (partialConfig: Partial<ShopConfig>) => void;
  upsertProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  saveShopData: (nextData?: { config?: ShopConfig; products?: Product[] }) => Promise<void>;
  // saveShopData now does PUT + immediate GET and replaces state with exactly what is in the database.
  refresh: () => Promise<void>;
  resetShopData: () => Promise<void>;
  exportShopData: () => string;
  importShopData: (payload: string) => Promise<void>;
}

const ShopDataContext = createContext<ShopDataContextValue | null>(null);

export function ShopDataProvider({ children }: { children: ReactNode }) {
  const [shopConfig, setShopConfig] = useState<ShopConfig>(defaultShopConfig);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // true until first successful load from DB

  useEffect(() => {
    let cancelled = false;

    const loadShopData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/shop-data", { cache: "no-store" });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { config?: ShopConfig; products?: Product[] };

        if (cancelled) {
          return;
        }

        if (data.config) {
          setShopConfig(data.config);
        }

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        }
      } catch {
        // Keep seed data if the endpoint is unavailable.
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadShopData();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => (shopConfig.categories.length ? shopConfig.categories : Array.from(new Set(products.map((product) => product.category)))),
    [products, shopConfig.categories],
  );

  const updateShopConfig = (partialConfig: Partial<ShopConfig>) => {
    setShopConfig((currentConfig) => ({ ...currentConfig, ...partialConfig }));
    setIsDirty(true);
  };

  const upsertProduct = (product: Product) => {
    setProducts((currentProducts) => {
      const exists = currentProducts.some((currentProduct) => currentProduct.id === product.id);
      return exists
        ? currentProducts.map((currentProduct) => (currentProduct.id === product.id ? product : currentProduct))
        : [product, ...currentProducts];
    });
    setIsDirty(true);
  };

  const removeProduct = (productId: string) => {
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
    setIsDirty(true);
  };

  /**
   * THE RELIABLE SAVE FUNCTION FOR PRODUCTION
   * 1. Sends current state to server (PUT)
   * 2. Immediately fetches fresh data from server (GET)
   * 3. Replaces local state with exactly what the DB returned
   *
   * This guarantees that after calling this, what you see in the UI == what is persisted.
   * No more "I added but on reload it's gone".
   */
  const saveAndSync = async (nextData?: { config?: ShopConfig; products?: Product[] }) => {
    const payload = {
      config: nextData?.config ?? shopConfig,
      products: nextData?.products ?? products,
    };

    // Step 1: Write
    const putRes = await fetch("/api/shop-data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!putRes.ok) {
      const errText = await putRes.text().catch(() => "");
      throw new Error(`Error guardando (${putRes.status}): ${errText}`);
    }

    // Step 2: Read back the canonical state from DB
    const getRes = await fetch("/api/shop-data", { cache: "no-store" });
    if (!getRes.ok) {
      throw new Error("Guardado pero no se pudo leer el estado actualizado del servidor");
    }

    const fresh = (await getRes.json()) as { config?: ShopConfig; products?: Product[] };

    if (fresh.config) {
      setShopConfig(fresh.config);
    }
    if (Array.isArray(fresh.products)) {
      setProducts(fresh.products);
    }

    setIsDirty(false);
  };

  // Keep old name as alias for backward compatibility in the rest of the app
  const saveShopData = saveAndSync;

  // Lightweight refresh used by polling. IMPORTANT: never overwrite local unsaved work.
  const refresh = async () => {
    if (isDirty) {
      // We have local edits not yet committed. Never overwrite user's work.
      return;
    }
    try {
      const res = await fetch("/api/shop-data", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.config) setShopConfig(data.config);
      if (Array.isArray(data.products)) setProducts(data.products);
    } catch {
      /* ignore */
    }
  };

  const resetShopData = async () => {
    await saveShopData({ config: defaultShopConfig, products: defaultProducts });
  };

  const exportShopData = () =>
    JSON.stringify(
      {
        config: shopConfig,
        products,
      },
      null,
      2,
    );

  const importShopData = async (payload: string) => {
    const parsed = JSON.parse(payload) as { config?: Partial<ShopConfig>; products?: Product[] };
    const nextConfig = parsed.config ? { ...shopConfig, ...parsed.config } : shopConfig;
    const nextProducts = Array.isArray(parsed.products) ? parsed.products : products;

    await saveShopData({ config: nextConfig, products: nextProducts });
  };

  const value: ShopDataContextValue = {
    shopConfig,
    products,
    categories,
    isDirty,
    isLoading,
    updateShopConfig,
    upsertProduct,
    removeProduct,
    saveShopData,
    refresh,
    resetShopData,
    exportShopData,
    importShopData,
  };

  return <ShopDataContext.Provider value={value}>{children}</ShopDataContext.Provider>;
}

export function useShopData() {
  const context = useContext(ShopDataContext);

  if (!context) {
    throw new Error("useShopData debe usarse dentro de ShopDataProvider");
  }

  return context;
}
