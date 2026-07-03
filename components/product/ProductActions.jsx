// "use client";

// import { useCart } from "@/context/CartContext";
// import { useWishlist } from "@/context/WishlistContext";

// export default function ProductActions({ product }) {
//   const { addItem } = useCart();
//   const { toggle, has } = useWishlist();
//   const inWishlist = has(product.id);

//   return (
//     <div className="flex flex-col sm:flex-row gap-3 mt-8">
//       <button
//         type="button"
//         onClick={() => addItem(product, 1)}
//         className="flex-1 bg-black text-white py-3.5 rounded-md hover:bg-gray-800 transition font-medium"
//       >
//         Add to cart
//       </button>
//       <button
//         type="button"
//         onClick={() => toggle(product)}
//         className={`flex-1 border py-3.5 rounded-md transition font-medium ${
//           inWishlist
//             ? "border-black bg-gray-100"
//             : "border-gray-300 hover:border-black"
//         }`}
//       >
//         {inWishlist ? "Saved to wishlist" : "Add to wishlist"}
//       </button>
//     </div>
//   );
// }
"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";

export default function ProductActions({ product, quantity }) {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const isWishlisted = wishlist?.some((item) => item.slug === product.slug);

  const handleAddToCart = async () => {
    setLoading(true);

    addToCart({
      id: product.id || product.sku,
      name: product.name || product.title,
      price: product.price || product.basePrice,
      image: product.images?.[0]?.url || product.images?.[0],
      quantity,
    });

    setLoading(false);
  };

  const handleBuyNow = async () => {
    addToCart({
      id: product.id || product.sku,
      name: product.name || product.title,
      price: product.price || product.basePrice,
      image: product.images?.[0]?.url || product.images?.[0],
      quantity,
    });

    router.push("/checkout");
  };

  const handleWishlist = () => {
    toggleWishlist({
      id: product.id || product.sku,
      name: product.name || product.title,
      image: product.images?.[0]?.url || product.images?.[0],
      price: product.price || product.basePrice,
      slug: product.slug,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* PRIMARY ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:opacity-90 transition"
        >
          <Zap size={18} />
          Buy Now
        </button>
      </div>

      {/* WISHLIST */}
      <button
        onClick={handleWishlist}
        className={`flex items-center justify-center gap-2 border py-3 rounded-lg transition ${
          isWishlisted
            ? "bg-red-50 border-red-300 text-red-600"
            : "hover:bg-gray-50"
        }`}
      >
        <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
      </button>
    </div>
  );
}