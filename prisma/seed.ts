import { defaultProducts, defaultShopConfig } from "@/lib/shop";
import { writeShopData } from "@/lib/shop-data.server";

async function main() {
  await writeShopData({
    config: defaultShopConfig,
    products: defaultProducts,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
