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
          url: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Peace Lily",
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
          url: "https://images.unsplash.com/photo-1616189597001-9046fce2594d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Jade Plant",
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
          url: "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Rose Plant",
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
            url: "https://images.unsplash.com/photo-1684472993236-b605bb80ca0b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Jasmine"
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
            url: "https://images.unsplash.com/photo-1732472581875-89ff83f18439?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Mango Plant"
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
            url: "https://images.unsplash.com/photo-1605185189315-fc269c231e41?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Lemon Plant"
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
            url: "https://images.unsplash.com/photo-1768692857070-e57811d9ccaa?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            alt: "Areca Palm"
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
          url: "/categories/vegetable-seeds.jpg",
          alt: "Ladyfinger seeds packet"
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
          url: "https://images.unsplash.com/photo-1640490201159-b3ae61c54747?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Chilli seeds packet"
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
          url: "https://images.unsplash.com/photo-1470509037663-253afd7f0f51?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Sunflower seeds packet"
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
          url: "https://images.unsplash.com/photo-1500420254515-0faefa2dac99?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Basil seeds"
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
          url: "https://images.unsplash.com/photo-1535734668010-da0c7d3085f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Microgreens mix"
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
          url: "/categories/tools.jpg",
          alt: "Garden trowel",
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
          url: "https://images.unsplash.com/photo-1680124744736-859f16257ef0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Pruning shears with ergonomic handle",
        },
        {
          url: "https://images.unsplash.com/photo-1557240231-9378fcdeefa9?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
          url: "https://images.unsplash.com/photo-1667992714862-df8713baf8c6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Watering can for plants"
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
          url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Organic compost",
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
          url: "https://images.unsplash.com/photo-1631323272726-9b6c17a0efaf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          alt: "Grow light with full spectrum",
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
