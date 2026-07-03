"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductImageGallery({ images, productTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
        <Image
          src={images[activeIndex]?.url}
          alt={images[activeIndex]?.alt || productTitle}
          fill
          priority
          className="object-contain transition-opacity duration-300"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer
                ${
                  index === activeIndex
                    ? "border-[#0A3323] shadow-md"
                    : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"
                }
              `}
              aria-label={`View ${img.alt || `image ${index + 1}`}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productTitle} thumbnail ${index + 1}`}
                fill
                className="object-contain transition-opacity duration-300"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
