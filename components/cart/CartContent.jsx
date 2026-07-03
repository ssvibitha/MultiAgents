"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartContent() {
  const { items, hydrated, setQuantity, removeItem, subtotal, clear } = useCart();

  if (!hydrated) {
    return (
      <p className="text-gray-500 text-center py-16" aria-live="polite">
        Loading your cart…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-lg mx-auto">
        <p className="text-gray-600 mb-6">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block border border-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition font-medium"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
      <div className="lg:col-span-2 space-y-4">
        {items.map((line) => (
          <div
            key={line.id}
            className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <Link
              href={`/product/${line.slug}`}
              className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100"
            >
              {line.image ? (
                <Image
                  src={line.image}
                  alt={line.name || "Product"}
                  fill
                  className="object-contain"
                  sizes="112px"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}
            </Link>
            <div className="flex-1 min-w-0 flex flex-col">
              <Link
                href={`/product/${line.slug}`}
                className="font-semibold hover:underline truncate"
              >
                {line.name}
              </Link>
              <p className="text-gray-600 text-sm mt-1">
                ₹{(line.price ?? 0).toLocaleString("en-IN")} each
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-auto pt-3">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={line.quantity}
                    onChange={(e) =>
                      setQuantity(line.id, Number(e.target.value))
                    }
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-black"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(line.id)}
                  className="text-sm text-red-700 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right font-semibold shrink-0">
              ₹{((line.price ?? 0) * line.quantity).toLocaleString("en-IN")}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => clear()}
          className="text-sm text-gray-600 hover:text-black underline"
        >
          Clear cart
        </button>
      </div>

      <aside className="lg:col-span-1">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order summary</h2>
          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{(subtotal ?? 0).toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            Shipping and taxes calculated at checkout.
          </p>
          <button
            type="button"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50"
            disabled
          >
            Checkout (demo)
          </button>
        </div>
      </aside>
    </div>
  );
}
