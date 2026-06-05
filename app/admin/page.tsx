"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, FileUp, ImageUp, Plus, RotateCcw, Save, Sparkles, Trash2, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useShopData } from "@/components/admin/ShopDataProvider";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { buttonClassName } from "@/components/ui/Button";
import { ProductEditor } from "@/components/admin/ProductEditor";
import type { Product } from "@/lib/shop";

const IMAGE_ACCEPT = ".png,.jpg,.jpeg,.webp,.gif,.svg,image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

const buildBlankProduct = (categories: string[]): Product => ({
  id: `producto-${Date.now()}`,
  slug: `producto-${Date.now()}`,
  name: "Nuevo producto",
  price: 0,
  compareAtPrice: 0,
  category: categories[0] ?? "General",
  shortDescription: "Descripción corta del producto.",
  description: "Descripción completa del producto.",
  images: ["/images/product-1.svg"],
  variants: [],
  featured: false,
  offer: false,
  badge: "Nuevo",
  rating: 4.8,
  reviews: 0,
  highlights: [],
});

// Legacy dataURL reader removed — we now use real /api/upload (see ProductEditor)

export default function AdminPage() {
  const {
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
  } = useShopData();
  const { session } = useAuth();

  const canEditStore = session?.role === "admin";
  const canEditCatalog = session?.role === "admin" || session?.role === "ceo";

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? "");
  const [categoryDraft, setCategoryDraft] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // REAL-TIME SYNC: Poll for changes made by other users/roles (CEO or Admin)
  // Every ~22s. Other open admin tabs will see updates without F5.
  useEffect(() => {
    if (!canEditCatalog) return;

    const interval = window.setInterval(() => {
      void refresh();
    }, 22000);

    return () => window.clearInterval(interval);
  }, [canEditCatalog, refresh]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0] ?? buildBlankProduct(categories),
    [categories, products, selectedProductId],
  );

  const categoryOptions = useMemo(() => {
    const values = new Set<string>([...categories, ...products.map((product) => product.category), selectedProduct.category]);
    return Array.from(values).filter(Boolean);
  }, [categories, products, selectedProduct.category]);

  const categoriesText = shopConfig.categories.join(", ");
  // Images now handled inside ProductEditor (real uploads + sanitize)

  // Grouped + searchable product list for admin (solves "impossible to find when many products")
  const filteredAndGrouped = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    const filtered = !q
      ? products
      : products.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.shortDescription || "").toLowerCase().includes(q)
        );

    const groups: Record<string, Product[]> = {};
    for (const p of filtered) {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    }
    return groups;
  }, [products, productSearch]);

  const persistProduct = (nextProduct: Product) => {
    upsertProduct(nextProduct);
    setSelectedProductId(nextProduct.id);
  };

  const updateProductField = <K extends keyof Product>(field: K, value: Product[K]) => {
    persistProduct({
      ...selectedProduct,
      [field]: value,
      slug: field === "name" ? String(value).toLowerCase().replace(/\s+/g, "-") : selectedProduct.slug,
    });
  };

  const handleCategoryAdd = () => {
    const nextCategory = categoryDraft.trim();
    if (!nextCategory || shopConfig.categories.includes(nextCategory)) {
      setCategoryDraft("");
      return;
    }

    updateShopConfig({ categories: [...shopConfig.categories, nextCategory] });
    setCategoryDraft("");
  };

  const handleCategoryRemove = (categoryToRemove: string) => {
    updateShopConfig({ categories: shopConfig.categories.filter((category) => category !== categoryToRemove) });
  };

  const handleSave = async () => {
    try {
      await saveShopData();
      setSaveMessage("Cambios guardados correctamente en el servidor");
      window.setTimeout(() => setSaveMessage(null), 2800);
    } catch (e: any) {
      setSaveMessage(`Error al guardar: ${e.message || e}`);
      // Keep the message visible longer on error
    }
  };

  const handleExport = () => {
    const blob = new Blob([exportShopData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "tienda-whatsapp-pro-backup.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (file: File | null) => {
    if (!file) {
      return;
    }

    const text = await file.text();
    await importShopData(text);
    setSaveMessage("Backup importado y guardado");
    window.setTimeout(() => setSaveMessage(null), 2500);
  };

  // Image handling for LOGO is kept simple (still allows URL paste + file for now)
  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    // For logo we keep data URL for simplicity (small file). For heavy product photos use the new uploader.
    const reader = new FileReader();
    reader.onload = () => updateShopConfig({ logo: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="container-shell py-16">
      <div className="max-w-5xl">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted">Panel de personalización</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">Edita casi toda la tienda sin tocar código.</h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          {canEditStore
            ? "Admin puede modificar textos, imágenes, logo, colores, categorías, productos y mensajes. CEO puede editar el catálogo y la organización de productos."
            : "Tu rol puede editar catálogo, categorías, variantes y ofertas, pero no la configuración global."}
        </p>
      </div>

      {isLoading && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cargando datos reales desde la base de datos... (los cambios que hagas se guardarán de forma permanente)
        </div>
      )}

      <div className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        {canEditStore ? (
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Tienda</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Datos globales</h2>
              </div>
              <Sparkles className="h-6 w-6 text-accent" />
            </div>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Nombre de la tienda</label>
                  <Input value={shopConfig.storeName} onChange={(event) => updateShopConfig({ storeName: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Texto del botón principal</label>
                  <Input value={shopConfig.ctaText} onChange={(event) => updateShopConfig({ ctaText: event.target.value })} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Tagline</label>
                  <Input value={shopConfig.tagline} onChange={(event) => updateShopConfig({ tagline: event.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Teléfono de soporte</label>
                  <Input value={shopConfig.supportPhone} onChange={(event) => updateShopConfig({ supportPhone: event.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Descripción principal</label>
                <Textarea
                  value={shopConfig.description}
                  onChange={(event) => updateShopConfig({ description: event.target.value })}
                  className="min-h-28"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mensaje de envío / nota logística</label>
                <Textarea
                  value={shopConfig.shippingNote}
                  onChange={(event) => updateShopConfig({ shippingNote: event.target.value })}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm font-semibold text-foreground">Logo de la empresa</label>
                  <button type="button" onClick={() => logoInputRef.current?.click()} className={buttonClassName("outline", "sm")}>
                    <ImageUp className="h-4 w-4" />
                    Subir logo
                  </button>
                </div>
                <Input value={shopConfig.logo} onChange={(event) => updateShopConfig({ logo: event.target.value })} placeholder="URL o imagen subida" />
                <input
                  ref={logoInputRef}
                  type="file"
                  accept={IMAGE_ACCEPT}
                  className="hidden"
                  onChange={(event) => void handleLogoUpload(event.target.files?.[0] ?? null)}
                />
                <p className="text-xs leading-6 text-muted">Acepta PNG, JPG, JPEG, WEBP, GIF y SVG. También puedes pegar una URL directa.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Número de WhatsApp</label>
                <Input value={shopConfig.whatsappNumber} onChange={(event) => updateShopConfig({ whatsappNumber: event.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Mensaje base para WhatsApp</label>
                <Textarea
                  value={shopConfig.whatsappMessageTemplate}
                  onChange={(event) => updateShopConfig({ whatsappMessageTemplate: event.target.value })}
                  className="min-h-40"
                />
                <p className="text-xs leading-6 text-muted">
                  Usa {"{name}"}, {"{items}"}, {"{total}"} y {"{storeName}"}.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Acceso CEO</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Panel limitado</h2>
            <p className="mt-4 text-sm leading-7 text-muted">
              Puedes gestionar productos, categorías, variantes y ofertas. La configuración global queda reservada para admin.
            </p>
          </Card>
        )}

        <div className="grid gap-8">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Catálogo</p>
                <h2 className="mt-2 text-2xl font-bold text-foreground">Gestionar productos</h2>
              </div>
              {canEditCatalog ? (
                <button
                  type="button"
                  onClick={async () => {
                    const newProduct = buildBlankProduct(categoryOptions);
                    persistProduct(newProduct);
                    // Auto-save the new blank product immediately
                    try {
                      await saveShopData();
                      setSaveMessage("Nuevo producto creado y guardado");
                      setTimeout(() => setSaveMessage(null), 1600);
                    } catch (e: any) {
                      setSaveMessage("Producto creado localmente (guarda manualmente)");
                    }
                  }}
                  className={buttonClassName("primary", "sm")}
                >
                  <Plus className="h-4 w-4" />
                  Agregar producto
                </button>
              ) : null}
            </div>

            {/* Search + Collapsible by category (much better when you have 30+ products) */}
            <div className="mt-4 mb-3">
              <Input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Buscar productos por nombre o categoría..."
                className="h-10"
              />
            </div>

            <div className="mt-2 space-y-2 max-h-[420px] overflow-auto pr-1">
              {Object.keys(filteredAndGrouped).length === 0 && (
                <div className="text-sm text-muted py-6 text-center">No se encontraron productos.</div>
              )}

              {Object.entries(filteredAndGrouped).map(([cat, prods]) => {
                const isOpen = openCategories[cat] !== false; // default open
                return (
                  <div key={cat} className="border border-border rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenCategories(prev => ({ ...prev, [cat]: !isOpen }))}
                      className="w-full flex items-center justify-between px-4 py-2.5 bg-surface text-left text-sm font-semibold"
                    >
                      <span>{cat} <span className="font-normal text-muted">({prods.length})</span></span>
                      <span className="text-xs text-muted">{isOpen ? "−" : "+"}</span>
                    </button>

                    {isOpen && (
                      <div className="divide-y">
                        {prods.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => setSelectedProductId(product.id)}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition ${
                              selectedProductId === product.id ? "bg-accent/10" : "hover:bg-surface"
                            }`}
                          >
                            <div>
                              <div className="font-medium text-foreground">{product.name}</div>
                              <div className="text-xs text-muted">
                                {product.offer ? "Oferta · " : ""}{product.featured ? "Destacado" : ""}
                              </div>
                            </div>

                            {canEditCatalog && (
                              <button
                                type="button"
                                onClick={async (ev) => {
                                  ev.stopPropagation();
                                  removeProduct(product.id);
                                  try {
                                    await saveShopData();
                                    setSaveMessage("Eliminado y guardado");
                                    setTimeout(() => setSaveMessage(null), 1600);
                                  } catch (e: any) {
                                    setSaveMessage("Eliminado local (guarda para confirmar)");
                                  }
                                }}
                                className="p-1.5 rounded hover:bg-white text-muted hover:text-red-600"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Editor avanzado</p>
                <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
              </div>
              {canEditCatalog && (
                <button
                  onClick={async () => {
                    try {
                      await saveShopData();
                      setSaveMessage("Guardado");
                      const isNew = selectedProduct.name === "Nuevo producto" || selectedProduct.id.startsWith("producto-");
                      if (isNew) {
                        const fresh = buildBlankProduct(categoryOptions);
                        persistProduct(fresh);
                        setSaveMessage("Guardado. Editor listo para nuevo producto.");
                      }
                      setTimeout(() => setSaveMessage(null), 1800);
                    } catch (e: any) {
                      setSaveMessage(`Error: ${e.message}`);
                    }
                  }}
                  className={buttonClassName("primary", "md")}
                >
                  <Save className="h-4 w-4" /> Guardar producto
                </button>
              )}
            </div>

            {/* THE NEW SUPERIOR PRODUCT EDITOR - type aware, no JSON, real uploads */}
            <ProductEditor
              product={selectedProduct}
              categories={categoryOptions}
              canEdit={canEditCatalog}
              onChange={(next) => {
                persistProduct(next);
              }}
            />

            {/* Categories manager (only for full admin) */}
            {canEditCatalog ? (
              <div className="mt-8 pt-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Categorías</p>
                    <p className="text-xs text-muted">Organiza tu catálogo</p>
                  </div>
                  <button onClick={() => updateShopConfig({ categories: Array.from(new Set([...shopConfig.categories, ...products.map(p => p.category)])) })} className={buttonClassName("outline", "sm")}>
                    <Sparkles className="h-4 w-4" /> Sincronizar
                  </button>
                </div>

                <div className="flex gap-2">
                  <Input value={categoryDraft} onChange={(e) => setCategoryDraft(e.target.value)} placeholder="Nueva categoría" onKeyDown={(e) => e.key === "Enter" && handleCategoryAdd()} />
                  <button onClick={handleCategoryAdd} className={buttonClassName("primary", "sm")}><Plus className="h-4 w-4" /> Agregar</button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {shopConfig.categories.map((cat) => (
                    <span key={cat} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm bg-white">
                      {cat}
                      <button onClick={() => handleCategoryRemove(cat)} className="text-muted hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Global actions */}
            <div className="flex flex-wrap gap-3 pt-8 mt-6 border-t">
              {canEditCatalog && (
                <button
                  onClick={async () => {
                    try {
                      await saveShopData();
                      setSaveMessage("Producto guardado en el servidor");
                      const isNew = selectedProduct.name === "Nuevo producto" || selectedProduct.id.startsWith("producto-");
                      if (isNew) {
                        const fresh = buildBlankProduct(categoryOptions);
                        persistProduct(fresh);
                        setSaveMessage("Guardado. Listo para agregar el siguiente producto.");
                      }
                      setTimeout(() => setSaveMessage(null), 2200);
                    } catch (e: any) {
                      setSaveMessage(`Error al guardar: ${e.message || e}`);
                    }
                  }}
                  className={buttonClassName("primary", "md")}
                >
                  <Save className="h-4 w-4" /> Guardar este producto
                </button>
              )}
              {canEditStore && (
                <>
                  <button onClick={handleSave} className={buttonClassName("outline", "md")}>Guardar todo al servidor</button>
                  <button onClick={handleExport} className={buttonClassName("outline", "md")}><Download className="h-4 w-4" /> Exportar backup</button>
                  <button onClick={() => fileInputRef.current?.click()} className={buttonClassName("outline", "md")}><FileUp className="h-4 w-4" /> Importar</button>
                  <button onClick={resetShopData} className={buttonClassName("ghost", "md")}><RotateCcw className="h-4 w-4" /> Reset demo</button>
                  <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => void handleImport(e.target.files?.[0] ?? null)} />
                </>
              )}
            </div>

            {/* Dirty state + global save */}
            <div className="mt-4 flex items-center gap-3">
              {isDirty && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  Cambios sin guardar en el servidor
                </div>
              )}
              <button onClick={handleSave} className={buttonClassName("outline", "sm")}>
                Guardar todo ahora
              </button>
            </div>

            {saveMessage && <p className="mt-3 text-sm text-accent font-medium">{saveMessage}</p>}

            <div className="mt-4 text-[11px] text-muted">
              Sistema listo para producción: cada acción importante (agregar, eliminar, guardar) hace guardado real + lectura inmediata del servidor.
              Lo que ves después de guardar = lo que hay en la base de datos.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
