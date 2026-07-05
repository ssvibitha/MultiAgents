"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const menuItems = [
  {
    title: "Outdoor Plants",
    slug: "outdoor-plants",
    image: "/categories/flowering.jpg",
    links: [
      {
        label: "Flowering Plants",
        href: "/outdoor-plants/flowering-plants",
        tag: "flowering-plants", 
      },
      {
        label: "Fruit Plants",
        href: "/outdoor-plants/fruit-plants",
        tag: "fruit-plants",
      },
      {
        label: "Herbs & Greens",
        href: "/outdoor-plants/herbs-greens",
        tag: "herbs-greens",
      },
      {
        label: "Climbers & Vines",
        href: "/outdoor-plants/climbers-vines",
        tag: "climbers-vines",
      },  
    ],
  },

  {
    title: "Indoor Plants",
    slug: "indoor-plants",
    image: "categories/air-purifying.png",
    links: [
      {
        label: "Air Purifying",
        href: "/indoor-plants/air-purifying",
        tag: "air-purifying",
      },
      {
        label: "Low Light",
        href: "/indoor-plants/low-light",
        tag: "low-light",
      },
      {
        label: "Succulents",
        href: "/indoor-plants/succulents",
        tag: "succulents",
      },
      {
        label: "Hanging Plants",
        href: "/indoor-plants/hanging-plants",
        tag: "hanging-plants",
      },
    ],
  },

  {
    title: "Seeds",
    slug: "seeds",
    image:"categories/vegetable-seeds.jpg",
    links: [
      {
        label: "Fruit Seeds",
        href: "/seeds/fruit-seeds",
        tag: "fruit-seeds",
      },
      {
        label: "Vegetable Seeds",
        href: "/seeds/vegetable-seeds",
        tag: "vegetable-seeds",
      },
      {
        label: "Flower Seeds",
        href: "/seeds/flower-seeds",
        tag: "flower-seeds",
      },
      {
        label: "Herb Seeds",
        href: "/seeds/herb-seeds",
        tag: "herb-seeds",
      },
      {
        label: "Microgreens",
        href: "/seeds/microgreens",
        tag: "microgreens",
      },
    ],
  },

  {
    title: "Tools & Care",
    slug: "tools-care",
    image: "/categories/tools.jpg",
    links: [
      {
        label: "Gardening Tools",
        href: "/tools-care/gardening-tools",
        tag: "gardening-tools",
      }, 
      {
        label: "Pruning & Cutting",
        href: "/tools-care/pruning-cutting",
        tag: "pruning-cutting",
      },
      {
        label: "Planters",
        href: "/tools-care/planters",
        tag: "planters",
      },
      {
        label: "Watering Cans",
        href: "/tools-care/watering-cans",
        tag: "watering-cans",
      },
      {
        label: "Soil & Fertilizers",
        href: "/tools-care/soil-fertilizers",
        tag: "soil-fertilizers",
      },
      {
        label: "Pest Control",
        href: "/tools-care/pest-control",
        tag: "pest-control",
      },
      {
        label: "Grow Lights",
        href: "/tools-care/grow-lights",
        tag: "grow-lights",
      },
    ],
  },
];

export default function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <>
      {menuItems.map((item) => (
        <div
          key={item.title}
          className="relative h-full flex items-center"
          onMouseEnter={() => setActiveMenu(item.title)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          {/* Trigger */}
            <Link
                href={`/shop?category=${item.slug}`}
                className="flex items-center gap-1 font-medium transition hover:text-[#C0CCA4]"
            >
                {item.title}
                <ChevronDown size={15} />
            </Link>

          {/* Mega Menu */}
          {activeMenu === item.title && (
            <div
              className="
                fixed
                left-0
                right-0
                top-[100px]
                bg-white
                border-t
                border-[#E7E0D3]
                shadow-xl
                z-50
            "
            >
              <div className="mx-auto max-w-7xl px-8 py-6">
                <div className="grid grid-cols-12 gap-12">

                  {/* Left Section */}
                  <div className="col-span-8">
                    <h3 className="mb-6 text-xl font-semibold text-[#2F4638]">
                      {item.title}
                    </h3>

                    <div className="flex flex-col gap-4">
                      {item.links.map((link) => (
                        <Link
                          key={link.label}
                          href={`/shop?category=${item.slug}&tag=${link.tag}`}
                          className="
                            text-base
                            text-gray-700
                            transition
                            hover:text-[#7F9360]
                          "
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Square Image */}
                  <div className="col-span-4">
                    <div className="relative aspect-square overflow-hidden rounded-2xl">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}