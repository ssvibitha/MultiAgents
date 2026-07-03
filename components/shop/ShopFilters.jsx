"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export default function ShopFilters({ categories, tags }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Update local state when URL changes (e.g. back button)
  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // Reset page to 1 when filters change
      if (name !== "page") {
        params.delete("page");
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleFilter = (name, value) => {
    const current = searchParams.get(name);
    // If clicking the same filter, remove it. Otherwise, set it.
    const newValue = current === value ? null : value;
    router.push(pathname + "?" + createQueryString(name, newValue), { scroll: false });
  };

  const applyPriceFilter = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    
    params.delete("page");
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  const clearFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeCategory = searchParams.get("category");
  const activeTag = searchParams.get("tag");
  const inStock = searchParams.get("inStock") === "true";

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        {Array.from(searchParams.keys()).length > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-black underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => toggleFilter("category", category.slug)}
                className={`text-sm text-left w-full hover:text-[#7F9360] transition-colors ${
                  activeCategory === category.slug ? "text-[#7F9360] font-medium" : "text-gray-600"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleFilter("tag", tag.slug)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                activeTag === tag.slug
                  ? "bg-[#2F4638] border-[#2F4638] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-[#7F9360]"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => toggleFilter("inStock", e.target.checked ? "true" : null)}
            className="rounded border-gray-300 text-[#7F9360] focus:ring-[#7F9360]"
          />
          <span className="text-sm text-gray-600">In stock only</span>
        </label>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Price</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#7F9360]"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#7F9360]"
            />
          </div>
        </div>
        <button
          onClick={applyPriceFilter}
          className="mt-3 w-full py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
