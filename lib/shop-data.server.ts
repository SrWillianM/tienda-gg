import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { defaultProducts, defaultShopConfig, type Product, type ShopConfig } from "@/lib/shop";

export interface ShopDataRecord {
  config: ShopConfig;
  products: Product[];
}

const seedData: ShopDataRecord = {
  config: defaultShopConfig,
  products: defaultProducts,
};

const seedIfEmpty = async () => {
  const [shopDataCount, productCount] = await Promise.all([
    prisma.shopData.count(),
    prisma.product.count(),
  ]);

  if (shopDataCount === 0) {
    await prisma.shopData.create({
      data: {
        config: seedData.config as unknown as Prisma.InputJsonValue,
      },
    });
  }

  if (productCount === 0) {
    await prisma.product.createMany({
      data: seedData.products.map((product) => ({
        ...product,
        compareAtPrice: product.compareAtPrice ?? null,
        badge: product.badge ?? null,
        rating: product.rating ?? null,
        reviews: product.reviews ?? null,
        images: product.images as unknown as Prisma.InputJsonValue,
        variants: product.variants as unknown as Prisma.InputJsonValue,
        highlights: (product.highlights ?? []) as unknown as Prisma.InputJsonValue,
      })),
    });
  }
};

export async function readShopData(): Promise<ShopDataRecord> {
  await seedIfEmpty();

  const [shopData, products] = await Promise.all([
    prisma.shopData.findFirst({ orderBy: { id: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return {
    config: (shopData?.config as ShopConfig | undefined) ?? seedData.config,
    products: products.map((product) => ({
      ...product,
      compareAtPrice: product.compareAtPrice ?? undefined,
      badge: product.badge ?? undefined,
      rating: product.rating ?? undefined,
      reviews: product.reviews ?? undefined,
      images: product.images as string[],
      variants: product.variants as unknown as Product["variants"],
      highlights: (product.highlights as unknown as string[] | null | undefined) ?? [],
    })),
  };
}

export async function writeShopData(data: ShopDataRecord): Promise<ShopDataRecord> {
  // CRITICAL FIX: No longer destructive delete + recreate.
  // Use upsert per product to preserve IDs, createdAt, and avoid data loss.
  const normalizedProducts = data.products.map((product) => ({
    ...product,
    compareAtPrice: product.compareAtPrice ?? null,
    badge: product.badge ?? null,
    rating: product.rating ?? null,
    reviews: product.reviews ?? null,
    images: product.images as unknown as Prisma.InputJsonValue,
    variants: product.variants as unknown as Prisma.InputJsonValue,
    highlights: (product.highlights ?? []) as unknown as Prisma.InputJsonValue,
  }));

  await prisma.$transaction(async (tx) => {
    // 1. Upsert global config
    await tx.shopData.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        config: data.config as unknown as Prisma.InputJsonValue,
      },
      update: {
        config: data.config as unknown as Prisma.InputJsonValue,
      },
    });

    // 2. For each product: upsert (create or update). This keeps history.
    for (const p of normalizedProducts) {
      await tx.product.upsert({
        where: { id: p.id },
        create: p as any,
        update: {
          slug: p.slug,
          name: p.name,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          category: p.category,
          shortDescription: p.shortDescription,
          description: p.description,
          images: p.images,
          variants: p.variants,
          featured: p.featured,
          offer: p.offer,
          badge: p.badge,
          rating: p.rating,
          reviews: p.reviews,
          highlights: p.highlights,
        },
      });
    }

    // 3. Remove products that no longer exist in the payload (true deletes)
    const currentIds = normalizedProducts.map((p) => p.id);
    await tx.product.deleteMany({
      where: { id: { notIn: currentIds.length ? currentIds : ["__none__"] } },
    });
  });

  return {
    config: data.config,
    products: data.products,
  };
}

export async function resetShopData(): Promise<ShopDataRecord> {
  await prisma.product.deleteMany();
  await prisma.shopData.deleteMany();
  return writeShopData(seedData);
}
