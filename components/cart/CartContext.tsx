"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildLineId,
  formatPrice,
  type CartLine,
  type CartSelection,
  type Product,
} from "@/lib/shop";

const CART_STORAGE_KEY = "tienda-whatsapp-pro-cart";

interface CartContextValue {
  items: CartLine[];
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  addItem: (product: Product, selection: CartSelection) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  formatSubtotal: string;
}

const CartContext = createContext<CartContextValue | null>(null);

const readCart = (): CartLine[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as CartLine[]) : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(readCart());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const addItem = (product: Product, selection: CartSelection) => {
    const lineId = buildLineId(product.id, selection);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.lineId === lineId);

      if (existingItem) {
        return currentItems.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      const newItem: CartLine = {
        lineId,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        quantity: 1,
        selectedOptions: selection,
        badge: product.badge,
      };

      return [...currentItems, newItem];
    });
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(lineId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.lineId === lineId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (lineId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.lineId !== lineId),
    );
  };

  const clearCart = () => setItems([]);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen((current) => !current);

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    isDrawerOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    formatSubtotal: formatPrice(subtotal),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
