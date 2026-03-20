import bbtSteamRice from "@/assets/products/bbt-steam-rice.jpg";
import hmtSteamRice from "@/assets/products/hmt-steam-rice.jpg";
import bbtRawRice from "@/assets/products/bbt-raw-rice.jpg";
import sonaMasoori from "@/assets/products/sona-masoori.jpg";
import ponniBoiled from "@/assets/products/ponni-boiled.jpg";
import goldenSella from "@/assets/products/golden-sella.jpg";
import idliRice from "@/assets/products/idli-rice.jpg";
import hmtRawRice from "@/assets/products/hmt-raw-rice.jpg";
import rawRice from "@/assets/products/raw-rice.jpg";

const productImageMap: Record<string, string> = {
  "/products/bbt-steam-rice": bbtSteamRice,
  "/products/hmt-steam-rice": hmtSteamRice,
  "/products/bbt-raw-rice": bbtRawRice,
  "/products/sona-masoori": sonaMasoori,
  "/products/ponni-boiled": ponniBoiled,
  "/products/golden-sella": goldenSella,
  "/products/idli-rice": idliRice,
  "/products/hmt-raw-rice": hmtRawRice,
  "/products/raw-rice": rawRice,
};

export const getProductImage = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("/products/")) {
    return productImageMap[imageUrl] || null;
  }
  return imageUrl;
};
