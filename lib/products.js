import { categories, products } from "@/data/products";

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) ?? null;
}

export function getCategoryBySlug(slug) {
  return categories.find((c) => c.slug === slug) ?? null;
}

export function getProductsByCategorySlug(categorySlug) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => {
    const cat = getCategoryBySlug(p.categorySlug);
    const hay = `${p.name} ${p.description} ${cat?.name ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}

export { categories, products };
