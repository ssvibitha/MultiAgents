const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  console.log("Seeding database...");

  // 1. Create Categories
  const indoor = await prisma.category.upsert({
    where: { slug: "indoor-plants" },
    update: {},
    create: { name: "Indoor Plants", slug: "indoor-plants" },
  });

  const outdoor = await prisma.category.upsert({
    where: { slug: "outdoor-plants" },
    update: {},
    create: { name: "Outdoor Plants", slug: "outdoor-plants" },
  });

  const seeds = await prisma.category.upsert({
    where: { slug: "seeds" },
    update: {},
    create: { name: "Seeds", slug: "seeds" },
  });

  const tools = await prisma.category.upsert({
    where: { slug: "tools-care" },
    update: {},
    create: { name: "Tools & Care", slug: "tools-care" },
  });

  // 2. Create Products
  const products = [
    // INDOOR PLANTS
    {
      title: "Monstera Deliciosa",
      slug: "monstera-deliciosa",
      description: "A classic indoor plant with beautiful split leaves.",
      sku: "PLANT001",
      brand: "GreenNest",
      basePrice: 300,
      stock: 10,
      isFeatured: true,
      categoryId: indoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1657628397617-5b2352d6a881?auto=format&fit=crop&q=80&w=800",
          alt: "Monstera Deliciosa in living room",
        }
      ],
      tags: [
        "air-purifying",
        "low-maintenance"
      ]
    },
    {
      title: "Snake Plant",
      slug: "snake-plant",
      description: "Extremely hardy and low-light tolerant.",
      sku: "PLANT002",
      brand: "GreenNest",
      basePrice: 250,
      stock: 15,
      categoryId: indoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1687552212914-03a30c82053c?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Snake Plant",
        }
      ],
      tags: [
        "air-purifying",
        "low-maintenance"
      ]
    },
    { 
      title: "Fiddle Leaf Fig",
      slug: "fiddle-leaf-fig", 
      description: "A popular indoor tree with large, violin-shaped leaves.", 
      sku: "PLANT003", 
      brand: "GreenNest", 
      basePrice: 220, 
      stock: 5, 
      isFeatured: true, 
      categoryId: indoor.id, 
      images: [
        {
          url:"https://images.unsplash.com/photo-1545239705-1564e58b9e4a?auto=format&fit=crop&q=80&w=800",
          alt: "Fiddle Leaf Fig",
        },
        {
          url: "https://images.unsplash.com/photo-1721932547078-38a815bb6b17?auto=format&fit=crop&q=80&w=800",
          alt: "Fiddle Leaf Fig in stylish living room",
        }
      ],
      tags: [
        "air-purifying"
      ]
    },
    
    {
      title: "Peace Lily",
      slug: "peace-lily",
      description: "Elegant flowering indoor plant.",
      sku: "PLANT004",
      brand: "GreenNest",
      basePrice: 280,
      stock: 10,
      categoryId: indoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80",
          alt: "Peace Lily",
        },
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
          alt: "Peace Lily in modern interior",
        }
      ],
      tags: [
        "flowering-plants",
        "air-purifying"
      ]
    },
    {
      title: "Jade Plant",
      slug: "jade-plant",
      description: "Easy-care succulent for homes.",
      sku: "PLANT005",
      brand: "GreenNest",
      basePrice: 180,
      stock: 20,
      categoryId: indoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
          alt: "Jade Plant",
        },
        {
          url: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
          alt: "Jade Plant care"
        }
      ],
      tags: [
        "succulents"
      ]
    },

    // OUTDOOR PLANTS
    {
      title: "Rose Plant",
      slug: "rose-plant",
      description: "Beautiful flowering rose bush.",
      sku: "PLANT006",
      brand: "GreenNest",
      basePrice: 120,
      stock: 15,
      categoryId: outdoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
          alt: "Rose Plant",
        },
        {
          url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
          alt: "Rose Plant in garden",
        }
      ],
      tags: [
        "flowering-plants"
      ]
    },
    {
      title: "Hibiscus",
      slug: "hibiscus",
      description: "Tropical flowering shrub.",
      sku: "PLANT007",
      brand: "GreenNest",
      basePrice: 140,
      stock: 12,
      categoryId: outdoor.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1622396727845-c15ef9ffb419?auto=format&fit=crop&q=80&w=800",
          alt: "Hibiscus",
        },
        {
          url: "https://images.unsplash.com/photo-1609718668518-cdad9531eed9?auto=format&fit=crop&q=80&w=800",
          alt: "Hibiscus in tropical garden",
        }
      ],
      tags: [
        "flowering-plants"
      ]
    },
    {
      title: "Jasmine",
      slug: "jasmine",
      description: "Fragrant flowering climber.",
      sku: "PLANT008",
      brand: "GreenNest",
      basePrice: 2100,
      stock: 10,
      categoryId: outdoor.id,
      images: [
          {
            url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
            alt: "Jasmine"
          },
          {
            url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
            alt: "Climbing jasmine plant"
          }
      ],
      tags: [
        "flowering-plants",
        "climbers-vines"
      ]
    },
    {
      title: "Mango Plant",
      slug: "mango-plant",
      description: "Popular tropical fruit plant.",
      sku: "PLANT009",
      brand: "GreenNest",
      basePrice: 3900,
      stock: 8,
      categoryId: outdoor.id,
      images: [
          {
            url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
            alt: "Mango Plant"
          },
          {
            url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
            alt: "Mango tree with fruits"
          }
      ],
      tags: [
        "fruit-plants",
      ]
    },
    {
      title: "Lemon Plant",
      slug: "lemon-plant",
      description: "Compact citrus fruit plant.",
      sku: "PLANT010",
      brand: "GreenNest",
      basePrice: 3400,
      stock: 10,
      categoryId: outdoor.id,
      images: [
          {
            url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
            alt: "Lemon Plant"
          },
          {
            url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
            alt: "Lemon Plant in garden"
          }
      ],
      tags: [
        "fruit-plants"
      ]
    },
    {
      title: "Areca Palm",
      slug: "areca-palm",
      description: "Popular air-purifying palm.",
      sku: "PLANT011",
      brand: "GreenNest",
      basePrice: 3200,
      stock: 12,
      categoryId: indoor.id,
      images: [
          {
            url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
            alt: "Areca Palm"
          },
          {
            url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
            alt: "Areca palm guide"
          }
      ],
      tags: [
        "air-purifying",
        "low-maintenance",
      ]
    },
    // SEEDS
    {
      title: "Ladyfinger Seeds",
      slug: "ladyfinger-seeds",
      description: "Easy-growing vegetable seeds.",
      sku: "SEED001",
      brand: "OrganicBazar",
      basePrice: 199,
      stock: 100,
      categoryId: seeds.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
          alt: "Ladyfinger seeds packet"
        },
        {
          url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
          alt: "Ladyfinger seeds to plants"
        }
      ],
      tags: [
        "vegetable-seeds"
      ]
    },
    {
      title: "Chilli Seeds",
      slug: "chilli-seeds",
      description: "High-yield chilli variety.",
      sku: "SEED002",
      brand: "OrganicBazar",
      basePrice: 149,
      stock: 120,
      categoryId: seeds.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
          alt: "Chilli seeds packet"
        },
        {
          url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
          alt: "Chilli seeds to plants"
        }
      ],
      tags: [
        "vegetable-seeds"
      ]
    },
    {
      title: "Sunflower Seeds",
      slug: "sunflower-seeds",
      description: "Bright flowering sunflower seeds.",
      sku: "SEED003",
      brand: "OrganicBazar",
      basePrice: 149,
      stock: 100,
      categoryId: seeds.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80",
          alt: "Sunflower seeds packet"
        },
        {
          url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
          alt: "How to grow sunflower seeds"
        }
      ],
      tags: [
        "flower-seeds",
        "flowering-plants"
      ]
    },
    {
      title: "Basil Seeds",
      slug: "basil-seeds",
      description: "Fresh aromatic herb seeds.",
      sku: "SEED004",
      brand: "OrganicBazar",
      basePrice: 179,
      stock: 120,
      categoryId: seeds.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
          alt: "Basil seeds"
        },
        {
          url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
          alt: "Basil seeds packet"
        }
      ],
      tags: [
        "herb-seeds",
        "herbs-greens"
      ]
    },
    {
      title: "Microgreens Mix",
      slug: "microgreens-mix",
      description: "Nutritious microgreens starter mix.",
      sku: "SEED005",
      brand: "Mixup",
      basePrice: 299,
      stock: 80,
      categoryId: seeds.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
          alt: "Microgreens mix"
        },
        {
          url: "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=800&q=80",
          alt: "Microgreens growing kit"
        }
      ],
      tags: [
        "microgreens"
      ]
    },

    // TOOLS & CARE
    {
      title: "Garden Trowel",
      slug: "garden-trowel",
      description: "Essential gardening hand tool.",
      sku: "TOOL001",
      brand: "GreenNest",
      basePrice: 199,
      stock: 50,
      categoryId: tools.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
          alt: "Garden trowel",
        },
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
          alt: "Garden trowel in use",
        }
      ],
      tags: [
        "pruning-cutting"
      ]
    },
    {
      title: "Pruning Shears",
      slug: "pruning-shears",
      description: "Sharp stainless-steel pruners.",
      sku: "TOOL002",
      brand: "GreenNest",
      basePrice: 200,
      stock: 40,
      categoryId: tools.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80",
          alt: "Pruning shears with ergonomic handle",
        },
        {
          url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
          alt: "Pruning shears in use"
        }
      ],
      tags: [
        "pruning-cutting"
      ]
    },
    {
      title: "Watering Can",
      slug: "watering-can",
      description: "Lightweight watering can.",
      sku: "TOOL003",
      brand: "GreenNest",
      basePrice: 120,
      stock: 35,
      categoryId: tools.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
          alt: "Watering can for plants"
        },
        {
          url: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
          alt: "Watering plants with the watering can"
        }
      ],
      tags: [
        "watering-cans"
      ]
    },
    {
      title: "Organic Compost",
      slug: "organic-compost",
      description: "Nutrient-rich organic compost.",
      sku: "TOOL004",
      brand: "GreenNest",
      basePrice: 200,
      stock: 60,
      categoryId: tools.id,
      images: [
        {
          url: "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=800&q=80",
          alt: "Organic compost",
        },
        {
          url: "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&w=800&q=80",
          alt: "Organic compost bag"
        }
      ],
      tags: [
        "soil-fertilizers"
      ]
    },
    {
      title: "LED Grow Light",
      slug: "led-grow-light",
      description: "Indoor plant grow light.",
      sku: "TOOL005",
      brand: "GreenNest",
      basePrice: 800,
      stock: 25,
      categoryId: tools.id,
      images:[
        {
          url: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=800&q=80",
          alt: "Grow light with full spectrum",
        },
        {
          url: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
          alt: "Full Spectrum High Efficiency White LED Grow Light"
        }
      ],
      tags: [
        "grow-lights"
      ]
    },
  ];

  // 3. Create Tags
  const allTags = [...new Set(products.flatMap(p => p.tags || []))];
  for (const tag of allTags) {
    await prisma.tag.upsert({
      where: { slug: tag },
      update: {},
      create: {
        name: tag
          .split("-")
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(" "),
        slug: tag,
      },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: {
        sku: p.sku,
      },
      update: {
        title: p.title,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        brand: p.brand,
        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,
        isFeatured: p.isFeatured ?? false,
        categoryId: p.categoryId,
        images: {
          deleteMany: {},
          create: p.images,
        },
        tags: {
        connect: p.tags.map(tag => ({
          slug: tag,
        })),
      }
      },
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,

        sku: p.sku,
        brand: p.brand,

        basePrice: p.basePrice,
        compareAtPrice: p.compareAtPrice,
        stock: p.stock,

        isActive: true,
        isFeatured: p.isFeatured ?? false,

        categoryId: p.categoryId,

        images: {
          create: p.images,
        },
        tags: {
        connect: p.tags.map(tag => ({
          slug: tag,
        })),
      }
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
