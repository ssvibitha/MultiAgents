"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";

export default function ProductInfo({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock === 0;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => setQuantity((q) => Math.min(product.stock, q + 1));

  const cartPayload = {
    id: product.id,
    slug: product.slug,
    name: product.title,
    price: product.basePrice,
    image: product.images?.[0]?.url || "",
  };

  const handleAddToCart = () => {
    addItem(cartPayload, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(cartPayload, quantity);
    router.push("/cart");
  };

  return (
    <div className="flex flex-col">
      {/* Category */}
      {product.category?.name && (
        <p className="text-xs uppercase tracking-[0.18em] text-[#839958] font-semibold mb-2">
          {product.category.name}
        </p>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#0A3323] tracking-tight">
        {product.title}
      </h1>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-light text-[#0A3323]">
          ₹{product.basePrice.toFixed(2)}
        </span>
        {product.compareAtPrice && (
          <span className="text-lg text-gray-400 line-through">
            ₹{product.compareAtPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock badge */}
      <div className="mt-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            product.stock > 0
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock"}
        </span>
      </div>

      {/* Description */}
      <p className="mt-6 text-[#105666]/80 leading-relaxed text-base">
        {product.description}
      </p>

      {/* Divider */}
      <hr className="my-6 border-gray-200" />

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#0A3323] mb-3">
          Quantity
        </label>
        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={decrease}
            disabled={isOutOfStock || quantity <= 1}
            className="
              w-10 h-10 flex items-center justify-center
              text-gray-600 hover:bg-gray-50
              transition disabled:opacity-30 disabled:cursor-not-allowed
              cursor-pointer border-none bg-transparent
            "
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 h-10 flex items-center justify-center text-sm font-medium text-[#0A3323] border-x border-gray-200">
            {quantity}
          </span>
          <button
            onClick={increase}
            disabled={isOutOfStock || quantity >= product.stock}
            className="
              w-10 h-10 flex items-center justify-center
              text-gray-600 hover:bg-gray-50
              transition disabled:opacity-30 disabled:cursor-not-allowed
              cursor-pointer border-none bg-transparent
            "
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {isOutOfStock ? (
          <button
            disabled
            className="
              flex-1 py-3.5 rounded-xl font-semibold text-base
              bg-gray-200 text-gray-400 cursor-not-allowed
            "
          >
            Out of Stock
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              className={`
                flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-semibold text-base
                transition-all duration-200 cursor-pointer border-none
                ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[#0A3323] text-white hover:bg-[#0A3323]/90"
                }
              `}
            >
              <ShoppingCart size={18} />
              {added ? "Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={handleBuyNow}
              className="
                flex-1 flex items-center justify-center gap-2
                py-3.5 rounded-xl font-semibold text-base
                bg-[#2563EB] text-white
                hover:bg-[#1d4ed8] transition-all duration-200
                cursor-pointer border-none
              "
            >
              <Zap size={18} />
              Buy Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
