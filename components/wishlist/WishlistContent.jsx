"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistContent() {
  const { items, hydrated, remove } = useWishlist();
  const { addItem } = useCart();

  if (!hydrated) {
    return (
      <p className="text-gray-500 text-center py-16" aria-live="polite">
        Loading your wishlist…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-lg mx-auto">
        <p className="text-gray-600 mb-6">
          You have not saved any products yet.
        </p>
        <Link
          href="/"
          className="inline-block border border-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition font-medium"
        >
          Browse catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
      {items.map((product) => (
        <div
          key={product.id}
          className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition"
        >
          <Link
            href={`/product/${product.slug}`}
            className="relative block aspect-[4/3] bg-gray-100"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
          </Link>
          <div className="p-4">
            <Link
              href={`/product/${product.slug}`}
              className="font-semibold hover:underline line-clamp-2"
            >
              {product.name}
            </Link>
            <p className="text-gray-600 mt-1 mb-4">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addItem(product, 1)}
                className="flex-1 border border-black py-2 rounded-md text-sm font-medium hover:bg-black hover:text-white transition"
              >
                Add to cart
              </button>
              <button
                type="button"
                onClick={() => remove(product.id)}
                className="px-3 py-2 text-sm text-gray-600 hover:text-red-700 border border-gray-200 rounded-md"
                aria-label="Remove from wishlist"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
