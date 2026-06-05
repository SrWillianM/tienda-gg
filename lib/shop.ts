// NOTE: These JSON imports are ONLY used as fallback seed data.
// Real data always comes from Prisma via shop-data.server.ts + API.
// Never import products/config directly in pages/components.
import configData from "@/data/config.json";
import rawProducts from "@/data/products.json";

export type AuthRole = "user" | "ceo" | "admin";

export interface AuthUser {
  username: string;
  password: string;
  role: AuthRole;
  displayName: string;
}

export interface ProductVariant {
  label: string;
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  shortDescription: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  featured?: boolean;
  offer?: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
  highlights?: string[];
}

export interface CartSelection {
  [variantLabel: string]: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  selectedOptions: CartSelection;
  badge?: string;
}

export interface ShopConfig {
  storeName: string;
  tagline: string;
  description: string;
  whatsappNumber: string;
  supportPhone: string;
  logo: string;
  whatsappMessageTemplate: string;
  categories: string[];
  authUsers: AuthUser[];
  currency: string;
  accent: string;
  accentHover: string;
  background: string;
  secondaryBackground: string;
  text: string;
  mutedText: string;
  deepHeader: string;
  border: string;
  ctaText: string;
  shippingNote: string;
}

export const shopConfig = configData as ShopConfig;
export const products = rawProducts as Product[];
export const defaultShopConfig = shopConfig;
export const defaultProducts = products;

export const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
export const offerProducts = products.filter((product) => product.offer);
export const storeCategories = shopConfig.categories.length
  ? shopConfig.categories
  : Array.from(new Set(products.map((product) => product.category)));

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: shopConfig.currency,
    maximumFractionDigits: 0,
  }).format(value);

export const buildSelectionLabel = (selection: CartSelection) =>
  Object.entries(selection)
    .map(([label, value]) => `${label}: ${value}`)
    .join(" · ");

export const buildLineId = (productId: string, selection: CartSelection) =>
  `${productId}-${Object.entries(selection)
    .map(([label, value]) => `${label}-${value}`)
    .join("-")
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

export const buildWhatsAppMessage = (params: {
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  items: CartLine[];
  total: number;
}, config: ShopConfig = shopConfig) => {
  const { customer, items, total } = params;
  const itemsText = items
    .map((item, index) => {
      const selectionText = buildSelectionLabel(item.selectedOptions);
      return `${index + 1}. ${item.name}${selectionText ? ` (${selectionText})` : ""} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
    })
    .join("\n");

  const template = config.whatsappMessageTemplate || [
    "Hola, soy {name}. Quiero hacer este pedido:",
    "",
    "{items}",
    "",
    "Total: {total}",
    "Tienda: {storeName}",
  ].join("\n");

  return [
    ["{name}", customer.name],
    ["{phone}", customer.phone ?? ""],
    ["{address}", customer.address ?? ""],
    ["{items}", itemsText],
    ["{total}", formatPrice(total)],
    ["{storeName}", config.storeName],
  ].reduce(
    (currentMessage, [token, value]) => currentMessage.replaceAll(token, value),
    template,
  );
};

export const buildWhatsAppUrl = (message: string, config: ShopConfig = shopConfig) => {
  const phone = config.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};