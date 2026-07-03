"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.title || product.name,
      price: product.basePrice ?? product.price ?? 0,
      image: product.images?.[0]?.url || product.image || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <button 
        disabled
        className="w-full bg-gray-300 text-gray-500 rounded-xl py-4 font-semibold text-lg cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      className={`w-full rounded-xl py-4 font-semibold text-lg transition ${
        added 
          ? "bg-green-600 text-white" 
          : "bg-black text-white hover:bg-gray-800"
      }`}
    >
      {added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
