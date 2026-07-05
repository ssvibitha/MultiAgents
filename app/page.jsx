export const dynamic = "force-dynamic";

import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/home/ProductGrid";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import NavBar from "@/components/layout/Navbar";
export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    include: {
      images: true,
    },
    take: 8,
  });

  // Prisma → ProductCard format
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.title,
    slug: product.slug,
    price: Number(product.basePrice),
    image: product.images?.[0]?.url || "/placeholder.jpg",
  }));

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <NavBar />
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="text-center mb-5">
          <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-stone-400 mb-1">
            Explore
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
            Featured Plants
          </h2>
        </div>
        <ProductGrid
          products={formattedProducts}
        />
      </section>
      <Footer />
    </main>
  );
}