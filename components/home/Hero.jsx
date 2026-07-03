import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-screen h-[58vh] md:h-[62vh] overflow-hidden">

      {/* Background Image */}
      <Image
        src="/Hero.png"
        alt="Indoor plant aesthetic"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-6 md:px-20">
        <div className="max-w-xl text-white">
          <p className="uppercase tracking-[0.35em] text-[11px] md:text-xs text-white/70 mb-5">
            Plants for Every Living Space
          </p>

          <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] font-medium mb-5">
            Bring Living Calm Into Your Space
          </h1>

          <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-md">
            Thoughtfully selected plants that purify your air, soften your interiors, and grow with your lifestyle.
          </p>

          <Link
            href="/category/indoor-plants"
            className="inline-flex items-center px-7 py-3 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition-transform duration-200"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}