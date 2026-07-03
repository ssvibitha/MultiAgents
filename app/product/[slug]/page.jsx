import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!product) return { title: "Product Not Found" };

  return { title: `${product.title} · Cartflow` };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;

  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    notFound();
  }

  // Convert Prisma Decimal → plain number for Client Components
  const safeProduct = {
    ...product,
    basePrice: product.basePrice?.toNumber?.() ?? 0,
    compareAtPrice: product.compareAtPrice?.toNumber?.() ?? null,
  };

  return (
    <main className="min-h-screen bg-[#FFFFF0] flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 lg:px-12 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#105666]/60">
            <li>
              <Link href="/" className="hover:text-[#0A3323] transition-colors no-underline text-[#105666]/60">
                Home
              </Link>
            </li>
            <li><span className="text-[#839958]">/</span></li>
            {safeProduct.category && (
              <>
                <li>
                  <Link
                    href={`/category/${safeProduct.category.slug}`}
                    className="hover:text-[#0A3323] transition-colors no-underline text-[#105666]/60"
                  >
                    {safeProduct.category.name}
                  </Link>
                </li>
                <li><span className="text-[#839958]">/</span></li>
              </>
            )}
            <li className="text-[#0A3323] font-medium truncate max-w-[200px]">
              {safeProduct.title}
            </li>
          </ol>
        </nav>

        {/* Product Layout: Image Left | Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Image Gallery */}
          <ProductImageGallery
            images={safeProduct.images}
            productTitle={safeProduct.title}
          />

          {/* Right — Product Details */}
          <ProductInfo product={safeProduct} />
        </div>
      </div>

      <Footer />
    </main>
  );
}