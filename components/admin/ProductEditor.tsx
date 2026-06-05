"use client";

import { useState } from "react";
import { Plus, Trash2, Upload, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { buttonClassName } from "@/components/ui/Button";
import type { Product, ProductVariant } from "@/lib/shop";
import { uploadProductImages, sanitizeImageList } from "@/lib/upload";

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

type ProductType = "simple" | "variants" | "service" | "kit";

const PRODUCT_TYPES: { key: ProductType; label: string; desc: string; hint: string }[] = [
  { key: "simple", label: "Producto simple", desc: "Sin variantes", hint: "Ideal para un solo artículo sin opciones" },
  { key: "variants", label: "Con variantes", desc: "Color, talle, etc", hint: "El más usado: ropa, tecnología, accesorios" },
  { key: "service", label: "Servicio / Suscripción", desc: "Días de acceso", hint: "Cuentas, licencias, streaming, Canva, etc" },
  { key: "kit", label: "Kit o Pack", desc: "Múltiples items", hint: "Skincare, bundles, sets completos" },
];

interface ProductEditorProps {
  product: Product;
  categories: string[];
  canEdit: boolean;
  onChange: (next: Product) => void;
  onUploadImages?: (paths: string[]) => void;
}

export function ProductEditor({ product, categories, canEdit, onChange, onUploadImages }: ProductEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState<ProductType>("variants");
  const [newVariantLabel, setNewVariantLabel] = useState("");
  const [newOption, setNewOption] = useState<Record<string, string>>({});
  const [newHighlight, setNewHighlight] = useState("");

  const images = sanitizeImageList(product.images);

  const update = (patch: Partial<Product>) => {
    onChange({ ...product, ...patch });
  };

  // Smart presets when user picks a type
  const applyTypePreset = (t: ProductType) => {
    setType(t);
    let nextVariants: ProductVariant[] = [];
    let nextHighlights: string[] = product.highlights ?? [];

    if (t === "simple") {
      nextVariants = [];
    } else if (t === "variants") {
      nextVariants = [
        { label: "Color", options: ["Negro", "Blanco"] },
        { label: "Tamaño", options: ["Único"] },
      ];
    } else if (t === "service") {
      nextVariants = [{ label: "Duración", options: ["7 días", "15 días", "30 días"] }];
      nextHighlights = nextHighlights.length ? nextHighlights : ["Entrega inmediata", "Soporte incluido"];
    } else if (t === "kit") {
      nextVariants = [{ label: "Presentación", options: ["Estándar", "Premium"] }];
      nextHighlights = nextHighlights.length ? nextHighlights : ["Incluye todo lo necesario", "Ahorro del 20%"];
    }

    update({ variants: nextVariants, highlights: nextHighlights });
  };

  // Variants management (no more raw JSON!)
  const addVariantGroup = () => {
    const label = newVariantLabel.trim();
    if (!label) return;
    if (product.variants.some((v) => v.label.toLowerCase() === label.toLowerCase())) return;

    const next: ProductVariant[] = [...product.variants, { label, options: [] }];
    update({ variants: next });
    setNewVariantLabel("");
  };

  const removeVariantGroup = (label: string) => {
    update({ variants: product.variants.filter((v) => v.label !== label) });
  };

  const addOptionToVariant = (label: string) => {
    const value = (newOption[label] || "").trim();
    if (!value) return;

    const next = product.variants.map((v) => {
      if (v.label !== label) return v;
      if (v.options.includes(value)) return v;
      return { ...v, options: [...v.options, value] };
    });
    update({ variants: next });
    setNewOption((prev) => ({ ...prev, [label]: "" }));
  };

  const removeOption = (label: string, option: string) => {
    const next = product.variants.map((v) =>
      v.label === label ? { ...v, options: v.options.filter((o) => o !== option) } : v
    );
    update({ variants: next });
  };

  // Highlights (easy chips, no JSON)
  const addHighlight = () => {
    const h = newHighlight.trim();
    if (!h) return;
    const current = product.highlights ?? [];
    if (current.includes(h)) return;
    update({ highlights: [...current, h] });
    setNewHighlight("");
  };

  const removeHighlight = (h: string) => {
    update({ highlights: (product.highlights ?? []).filter((x) => x !== h) });
  };

  // Image handling with real upload
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || !canEdit) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadProductImages(Array.from(files));
      const combined = [...images, ...uploaded];
      const unique = Array.from(new Set(combined));
      update({ images: unique });
      onUploadImages?.(uploaded);
    } catch (e: any) {
      alert(e.message || "Error subiendo imágenes");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    update({ images: next.length ? next : ["/images/product-1.svg"] });
  };

  const moveImage = (from: number, to: number) => {
    const arr = [...images];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    update({ images: arr });
  };

  return (
    <div className="space-y-8">
      {/* Product Type Presets - THE KEY UX IMPROVEMENT */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Tipo de producto</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRODUCT_TYPES.map((pt) => (
            <button
              key={pt.key}
              type="button"
              onClick={() => applyTypePreset(pt.key)}
              disabled={!canEdit}
              className={`rounded-2xl border p-4 text-left transition ${
                type === pt.key ? "border-accent bg-accent/5 ring-1 ring-accent/30" : "border-border hover:border-accent/40"
              }`}
            >
              <div className="font-semibold text-foreground">{pt.label}</div>
              <div className="text-xs text-muted mt-0.5">{pt.desc}</div>
              <div className="text-[10px] text-muted/70 mt-2 leading-tight">{pt.hint}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">Elige el tipo y el formulario se adapta automáticamente con variantes y campos útiles.</p>
      </div>

      {/* Basic fields */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Nombre del producto</label>
          <Input value={product.name} onChange={(e) => update({ name: e.target.value })} disabled={!canEdit} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug (URL)</label>
          <Input value={product.slug} onChange={(e) => update({ slug: e.target.value })} disabled={!canEdit} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Precio actual (Gs.)</label>
          <Input type="number" value={product.price} onChange={(e) => update({ price: Number(e.target.value) || 0 })} disabled={!canEdit} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Precio anterior (opcional)</label>
          <Input type="number" value={product.compareAtPrice ?? 0} onChange={(e) => update({ compareAtPrice: Number(e.target.value) || undefined })} disabled={!canEdit} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Categoría</label>
          <Select value={product.category} onChange={(e) => update({ category: e.target.value })} disabled={!canEdit}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Badge / Etiqueta</label>
          <Input value={product.badge ?? ""} onChange={(e) => update({ badge: e.target.value || undefined })} disabled={!canEdit} placeholder="Bestseller, Nuevo..." />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Descripción corta (aparece en tarjetas)</label>
        <Textarea value={product.shortDescription} onChange={(e) => update({ shortDescription: e.target.value })} disabled={!canEdit} className="min-h-16" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Descripción completa</label>
        <Textarea value={product.description} onChange={(e) => update({ description: e.target.value })} disabled={!canEdit} className="min-h-28" />
      </div>

      {/* IMAGES - Real uploads, no more base64 hell */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Imágenes del producto</label>
          <label className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border cursor-pointer ${canEdit ? "border-accent text-accent hover:bg-accent/5" : "opacity-50 pointer-events-none"}`}>
            <Upload className="h-4 w-4" />
            {isUploading ? "Subiendo..." : "Subir imágenes"}
            <input
              type="file"
              multiple
              accept={IMAGE_ACCEPT}
              className="hidden"
              disabled={!canEdit || isUploading}
              onChange={(e) => handleImageFiles(e.target.files)}
            />
          </label>
        </div>

        <div className="text-xs text-muted -mt-1">Se guardan en el servidor (no en la base de datos). Máx recomendado 4-6 fotos por producto.</div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.length === 0 ? (
            <div className="border border-dashed rounded-2xl p-8 text-center text-muted">Arrastra o sube fotos usando el botón de arriba</div>
          ) : (
            images.map((url, idx) => (
              <div key={`${url}-${idx}`} className="group relative overflow-hidden rounded-2xl border bg-white">
                <div className="aspect-video bg-surface">
                  <img src={url} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
                <div className="p-3 flex items-center gap-2">
                  <button type="button" onClick={() => moveImage(idx, Math.max(0, idx - 1))} disabled={idx === 0} className={buttonClassName("ghost", "sm")}>↑</button>
                  <button type="button" onClick={() => moveImage(idx, Math.min(images.length - 1, idx + 1))} disabled={idx === images.length - 1} className={buttonClassName("ghost", "sm")}>↓</button>
                  <button type="button" onClick={() => removeImage(idx)} className={buttonClassName("outline", "sm") + " ml-auto text-red-600"}>
                    <X className="h-3.5 w-3.5" /> Quitar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* VARIANTS - Beautiful editor instead of JSON textarea */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Opciones / Variantes</label>
          <div className="flex gap-2">
            <Input
              value={newVariantLabel}
              onChange={(e) => setNewVariantLabel(e.target.value)}
              placeholder="Ej: Color, Talle, Duración"
              className="h-9 w-48"
              disabled={!canEdit}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariantGroup(); } }}
            />
            <button type="button" onClick={addVariantGroup} disabled={!canEdit} className={buttonClassName("outline", "sm")}>
              <Plus className="h-4 w-4" /> Agregar grupo
            </button>
          </div>
        </div>

        {product.variants.length === 0 && (
          <div className="text-sm text-muted border border-dashed rounded-2xl p-4">Sin variantes. El producto se vende tal cual.</div>
        )}

        {product.variants.map((variant) => (
          <div key={variant.label} className="rounded-2xl border bg-surface/60 p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-foreground">{variant.label}</div>
              <button type="button" onClick={() => removeVariantGroup(variant.label)} className="text-muted hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
              {variant.options.length === 0 && <span className="text-xs text-muted">Agrega opciones abajo</span>}
              {variant.options.map((opt) => (
                <span key={opt} className="inline-flex items-center gap-1 bg-white border rounded-full px-3 py-1 text-sm">
                  {opt}
                  <button type="button" onClick={() => removeOption(variant.label, opt)} className="text-muted hover:text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newOption[variant.label] ?? ""}
                onChange={(e) => setNewOption({ ...newOption, [variant.label]: e.target.value })}
                placeholder={`Agregar opción para ${variant.label}`}
                className="h-9"
                disabled={!canEdit}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOptionToVariant(variant.label); } }}
              />
              <button type="button" onClick={() => addOptionToVariant(variant.label)} disabled={!canEdit} className={buttonClassName("primary", "sm")}>
                + Opción
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* HIGHLIGHTS - Easy tag input */}
      <div>
        <label className="text-sm font-semibold block mb-2">Destacados / Beneficios (se muestran como viñetas)</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            placeholder="Ej: Batería de 40 horas"
            disabled={!canEdit}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
          />
          <button type="button" onClick={addHighlight} disabled={!canEdit} className={buttonClassName("outline", "md")}>
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(product.highlights ?? []).map((h) => (
            <span key={h} className="inline-flex items-center gap-1.5 bg-white border rounded-full pl-3 pr-2 py-1 text-sm">
              {h}
              <button type="button" onClick={() => removeHighlight(h)} className="text-muted hover:text-red-600">×</button>
            </span>
          ))}
          {(!product.highlights || product.highlights.length === 0) && <span className="text-xs text-muted">Agrega 3-5 puntos fuertes del producto</span>}
        </div>
      </div>

      {/* Flags */}
      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!product.featured} onChange={(e) => update({ featured: e.target.checked })} disabled={!canEdit} />
          Destacado en portada
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={!!product.offer} onChange={(e) => update({ offer: e.target.checked })} disabled={!canEdit} />
          En oferta (muestra precio tachado)
        </label>
      </div>
    </div>
  );
}
