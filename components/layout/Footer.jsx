import Link from "next/link";
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4">
        <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight text-blue-600"
          >
            Plantify
          </Link>
        <div className="space-y-2 flex flex-col">
          <h3 className="font-semibold mb-3">Shop</h3>
          <div className="space-y-2">
            <Link href="/shop?category=outdoor-plants" className="block hover:underline">
              Outdoor Plants
            </Link>

            <Link href="/shop?category=indoor-plants" className="block hover:underline">
              Indoor Plants
            </Link>

            <Link href="/shop?category=seeds" className="block hover:underline">
              Seeds
            </Link>

            <Link href="/shop?category=tools-care" className="block hover:underline">
              Tools & Care
            </Link>
          </div>
        </div>
        
      </div>
      <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Violette. All rights reserved.
      </div>

      
    </footer>
  );
}