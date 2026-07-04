import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // { protocol: "https", hostname: "m.media-amazon.com" },
      // { protocol: "https", hostname: "theaffordableorganicstore.com" },
      // { protocol: "https", hostname: "images.squarespace-cdn.com" },
      // { protocol: "https", hostname: "radhakrishnaagriculture.in" },
      // { protocol: "https", hostname: "upload.wikimedia.org" },
      // { protocol: "https", hostname: "www.urvann.com" },
      // { protocol: "https", hostname: "nurserylive.com" },
      // { protocol: "https", hostname: "creativefarmer.in" },
      // { protocol: "https", hostname: "himadrigardens.com" },
      // { protocol: "https", hostname: "plantsguru.com" },
      // { protocol: "https", hostname: "5.imimg.com" },
      // { protocol: "https", hostname: "www.newnessplant.com" },
      // { protocol: "https", hostname: "encrypted-tbn0.gstatic.com" },
      // { protocol: "https", hostname: "nurserynisarga.in" },
      // { protocol: "https", hostname: "organicbazar.net" },
      // { protocol: "https", hostname: "shop.indiagardening.com" },
      // { protocol: "https", hostname: "img.drz.lazcdn.com" },
      // { protocol: "https", hostname: "nativeindianorganics.com" },
      // { protocol: "https", hostname: "www.levels.com" },
      // { protocol: "https", hostname: "rukmini1.flixcart.com" },
      // { protocol: "https", hostname: "makerbazar.in" },
      // { protocol: "https", hostname: "plastrip.co.za" },
      // { protocol: "https", hostname: "dukaan.b-cdn.net" },
      // { protocol: "https", hostname: "www.carbongold.com" },
    ],
  },
};

export default nextConfig;
