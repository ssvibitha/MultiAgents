import ProductCard from "./ProductCard";

export default function ProductGrid({ products, title }) {
  if (!products?.length) {
    return null;
  }

  return (
    
    <section className="w-full py-8 md:py-12">
      {/* <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">{title}</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
