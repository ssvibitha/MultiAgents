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
          url : "https://m.media-amazon.com/images/I/61tFPeyRujL._AC_UF1000,1000_QL80_.jpg",
          alt: "Monstera Deliciosa",
        },  
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
          url: "https://theaffordableorganicstore.com/cdn/shop/files/3cde1db0-e2f1-4f80-a38f-4afa1dd013a1_20260302_234057_0000.webp?v=1772700970",
          alt: "Snake Plant",
        },
        {
          url: "https://images.squarespace-cdn.com/content/v1/54fbb611e4b0d7c1e151d22a/1610074066643-OP8HDJUWUH8T5MHN879K/Snake+Plant.jpg?format=1000w",
          alt: "Snake Plant in modern interior",
        },
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
          url: "https://radhakrishnaagriculture.in/cdn/shop/files/peacelily.jpg?v=1709184309",
          alt: "Peace Lily",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Spathiphyllum_cochlearispathum_RTBG.jpg/960px-Spathiphyllum_cochlearispathum_RTBG.jpg",
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
          url: "https://m.media-amazon.com/images/I/61eUcX92H6L._AC_UF1000,1000_QL80_.jpg",
          alt: "Jade Plant",
        },
        {
          url: "https://m.media-amazon.com/images/I/71psCqI6EDL.jpg",
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
          url: "https://www.urvann.com/s/6176774ef575bbd2b3331c8a/693d42773c203ee75005dcf5/261-640x640.jpg",
          alt: "Rose Plant",
        },
        {
          url: "https://nurserylive.com/cdn/shop/files/rose-scented_b8d09b33-17d1-40b6-bb69-dcf2b3860e81.jpg?v=1751753898",
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
            url: "https://creativefarmer.in/cdn/shop/products/61ubDZoQc4L._SL1024.jpg?v=1647501869",
            alt: "Jasmine"
          },
          {
            url: "https://himadrigardens.com/wp-content/uploads/2024/07/WhatsApp-Image-2024-07-07-at-6.39.32-PM.jpeg",
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
            url: "https://plantsguru.com/cdn/shop/files/Mango_Hapus_Plant.jpg?v=1746859106&width=3840",
            alt: "Mango Plant"
          },
          {
            url: "https://5.imimg.com/data5/VV/KU/MY-11242929/natural-gir-kesar-mangoes-500x500-500x500.jpg",
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
            url: "https://www.newnessplant.com/uploads/bfdb03009feaa96390950dfd02b52b45.JPG",
            alt: "Lemon Plant"
          },
          {
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbhljfBY0za8Kyw6DzchG9JNQGxiE3n7fC1A&s",
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
            url: "https://nurserynisarga.in/wp-content/uploads/2019/03/areca.webp",
            alt: "Areca Palm"
          },
          {
            url: "https://theaffordableorganicstore.com/cdn/shop/files/dacf3142-dd59-48c5-9cc8-a827abd85d20.webp?v=1777556862",
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
          url: "https://organicbazar.net/cdn/shop/files/OkraorLadyFingerSeeds_okraseeds_ladyfingerseeds_vegetableseeds_organicbazarseeds_bhndiKeBeej.jpg?v=1770811840&width=1445",
          alt: "Ladyfinger seeds packet"
        },
        {
          url: "https://shop.indiagardening.com/wp-content/uploads/2020/08/lady-finger.jpg",
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
          url: "https://organicbazar.net/cdn/shop/files/Chilli_Light_Green_Medium_Spicy_Seeds_organic_bazar_seeds_chilli_seeds_green_chilli_seeds_chilli_green_light_seeds_vegetable_seeds.jpg?v=1759558371",
          alt: "Chilli seeds packet"
        },
        {
          url: "https://img.drz.lazcdn.com/static/lk/p/a4256bc619f3455b07f7ca389d59f228.jpg_720x720q80.jpg",
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
          url: "https://organicbazar.net/cdn/shop/files/SunflowerTallYellowSeedsOrganicbazarSeedsOrganicbazarFlowerSeeds_1.jpg?v=1755770926&width=1946",
          alt: "Sunflower seeds packet"
        },
        {
          url: "https://nativeindianorganics.com/cdn/shop/files/How_to_grow_sunflower_seeds.webp?v=1772004556&width=1000",
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
          url: "https://www.levels.com/_next/image?url=https%3A%2F%2Fstatic.levels.com%2F_next%2Fstatic%2Fmedia%2FBasilSeeds.1da20cf5.jpg&w=3840&q=75",
          alt: "Basil seeds"
        },
        {
          url: "https://organicbazar.net/cdn/shop/files/IndianHolyBasil_DesiTulsi_Seeds_DesiTulsiKeBeej_TulsiKeBeej_BasilSeeds.jpg?v=1758176591",
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
          url: "https://m.media-amazon.com/images/I/71qxsULIGBL._AC_UF1000,1000_QL80_.jpg",
          alt: "Microgreens mix"
        },
        {
          url: "https://rukmini1.flixcart.com/image/1500/1500/xif0q/plant-seed/b/m/c/1-microgreens-kit-nurturing-green-original-imahhm2zxp6gf3rd.jpeg?q=70",
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
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF8aNLb4tmKti_P_HhLGuJHiiiJnDrBcjG7Q&s",
          alt: "Garden trowel",
        },
        {
          url: "https://makerbazar.in/cdn/shop/files/HandDiggingTrowel_Steel-6.jpg?v=1770545428&width=1100",
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
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQuPyg-C2RCWVJUaRNg7N4RtRMv-ybFNOEug&s",
          alt: "Pruning shears with ergonomic handle",
        },
        {
          url: "https://plastrip.co.za/cdn/shop/files/WEBDSC_6444editDura5PruningShearjpeg_600x.jpg?v=1701413406",
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
          url: "https://m.media-amazon.com/images/I/51c5crjFdkL._AC_UF894,1000_QL80_.jpg",
          alt: "Watering can for plants"
        },
        {
          url: "https://dukaan.b-cdn.net/700x700/webp/download-and-upload/d288c911-2c24-494c-9667-23a8e6a95877.jpeg",
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
          url: "https://www.carbongold.com/app/uploads/2021/05/JI_100713_CarbonGold_012.jpg",
          alt: "Organic compost",
        },
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRK2CRYwUTP9ag5JgQsFmrRtkQhEAZjwPiNCg&s",
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
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfynx_I1cuaNqnqDuEYKilRTGvaQXY30bjZA&s",
          alt: "Grow light with full spectrum",
        },
        {
          url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJAkww9RdZD0ddox7D7FSBR7GeHO0gffX6lQ&s",
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
