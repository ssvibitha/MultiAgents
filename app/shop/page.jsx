import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/home/ProductGrid";
import ShopFilters from "@/components/shop/ShopFilters";
import ShopSort from "@/components/shop/ShopSort";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Shop · Cartflow",
  description: "Browse our entire collection of plants and tools.",
};

const PAGE_SIZE = 12;

export default async function ShopPage({ searchParams }) {
  const sp = await searchParams;

  // Extract params
  const q = typeof sp?.q === "string" ? sp.q : "";
  const categorySlug = typeof sp?.category === "string" ? sp.category : null;
  const tagSlug = typeof sp?.tag === "string" ? sp.tag : null;
  const inStock = sp?.inStock === "true";
  const minPrice = sp?.minPrice ? parseFloat(sp.minPrice) : null;
  const maxPrice = sp?.maxPrice ? parseFloat(sp.maxPrice) : null;
  const sort = typeof sp?.sort === "string" ? sp.sort : "newest";
  const page = sp?.page ? parseInt(sp.page, 10) : 1;
  const safePage = isNaN(page) || page < 1 ? 1 : page;

  // Build Prisma where clause
  const whereClause = {
    isActive: true,
  };

  if (q) {
    whereClause.title = { contains: q, mode: "insensitive" };
  }
  
  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }
  
  if (tagSlug) {
    whereClause.tags = { some: { slug: tagSlug } };
  }
  
  if (inStock) {
    whereClause.stock = { gt: 0 };
  }
  
  if (minPrice !== null || maxPrice !== null) {
    whereClause.basePrice = {};
    if (minPrice !== null) whereClause.basePrice.gte = minPrice;
    if (maxPrice !== null) whereClause.basePrice.lte = maxPrice;
  }

  // Build Prisma orderBy clause
  let orderByClause = { createdAt: "desc" }; // default to newest
  switch (sort) {
    case "price-asc":
      orderByClause = { basePrice: "asc" };
      break;
    case "price-desc":
      orderByClause = { basePrice: "desc" };
      break;
    case "name-asc":
      orderByClause = { title: "asc" };
      break;
    case "name-desc":
      orderByClause = { title: "desc" };
      break;
    case "newest":
    default:
      orderByClause = { createdAt: "desc" };
      break;
  }

  // Fetch data in parallel
  const [products, totalCount, categories, tags] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      skip: (safePage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { images: true },
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Map products for ProductGrid
  const formattedProducts = products.map((p) => ({
    id: p.id,
    name: p.title,
    slug: p.slug,
    price: p.basePrice?.toNumber?.() ?? 0,
    image: p.images?.[0]?.url || "/placeholder.jpg",
  }));

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop All</h1>
          <p className="text-gray-600">
            {totalCount} product{totalCount === 1 ? "" : "s"} found
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse rounded-lg" />}>
              <ShopFilters categories={categories} tags={tags} />
            </Suspense>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6 flex justify-end">
              <Suspense fallback={null}>
                <ShopSort />
              </Suspense>
            </div>

            {formattedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg mb-4">No products match your filters.</p>
                <Link
                  href="/shop"
                  className="inline-block border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition"
                >
                  Clear all filters
                </Link>
              </div>
            ) : (
              <>
                <ProductGrid products={formattedProducts} title="" />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === safePage;
                      
                      // Build new URL string for pagination link
                      const pageParams = new URLSearchParams(Object.entries(sp).reduce((acc, [k, v]) => {
                        if (v !== undefined) acc[k] = v;
                        return acc;
                      }, {}));
                      pageParams.set("page", pageNum);
                      
                      return (
                        <Link
                          key={pageNum}
                          href={`/shop?${pageParams.toString()}`}
                          className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                            isCurrent
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
