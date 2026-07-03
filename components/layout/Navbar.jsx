"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";
import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import MegaMenu from "@/components/layout/MegaMenu";

export default function Navbar() {
  const router = useRouter();
  const { totalCount } = useCart();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const onSearch = (e) => {
    e.preventDefault();

    const query = q.trim();
    if (!query) return;

    router.push(`/shop?q=${encodeURIComponent(query)}`);
  };

  const logout = async () => {
    setProfileOpen(false);
    await signOut({ redirect: false });
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E7E0D3] bg-[#F8F6F1]">
      {/* PRIMARY NAV */}
    <div className="px-6 lg:px-8 h-20 flex items-center">

      {/* LEFT */}
      <div className="flex items-center gap-5 min-w-fit">
        {/* Logo */}
        <Link
          href="/"
          className="relative w-32 h-12 shrink-0 block"
        >
          <Image
            src="/logo.jpg"
            alt="Plantify"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* CENTER SEARCH */}
      <div className="flex-1 flex justify-center pl-50">
        <form
          onSubmit={onSearch}
          className="w-full max-w-xl"
        >
          <div className="flex items-center overflow-hidden rounded-full border border-[#E7E0D3] bg-white shadow-sm focus-within:border-[#7F9360]">
            <input
              type="search"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plants, tools, seeds..."
              className="w-full bg-transparent px-5 py-3 text-sm text-[#343434] outline-none placeholder:text-[#76706A]"
            />

            <button
              type="submit"
              className="mr-2 rounded-full bg-[#7F9360] p-2 text-white transition hover:bg-[#2F4638]"
            >
              <Search size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5 min-w-fit">
        {/* WishList */}
        <Link
          href="/wishlist"
          className="group relative flex items-center text-[#343434] hover:text-[#7F9360]"
        >
          <Heart size={22} />
          <Tooltip text="Wishlist" />
        </Link>
        {/* Cart */}
        <Link
          href="/cart"
          className="group relative flex items-center text-[#343434] hover:text-[#7F9360]"
        >
          <ShoppingCart size={22} />
          <Tooltip text="Cart" />
          {totalCount > 0 && (
            <span className="flex min-w-[20px] items-center justify-center rounded-full bg-[#7F9360] px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </Link>
        

        {/* Profile/Login */}
        {user ? (
          <div className="relative">
            <button
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="flex items-center gap-2 rounded-full border border-[#E7E0D3] px-4 py-2 text-[#343434] hover:border-[#7F9360] transition"
            >
              <User size={18} />
              <span className="hidden sm:inline text-sm">
                {user.name || user.email?.split("@")[0]}
              </span>
              <ChevronDown size={16} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-[#E7E0D3] bg-white shadow-xl">
                <Link
                  href="/account"
                  className="block px-5 py-3 hover:bg-[#F6F2E8]"
                >
                  Account
                </Link>

                <Link
                  href="/orders"
                  className="block px-5 py-3 hover:bg-[#F6F2E8]"
                >
                  Orders
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-5 py-3 hover:bg-[#F6F2E8]"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-[#7F9360] px-5 py-3 text-sm font-medium text-white hover:bg-[#18392B] transition"
          >
            Login
          </Link>
        )}
      </div>
    </div>
    {/* MEGA MENU */}
    <div className="relative hidden md:flex h-14 items-center justify-center gap-10 border-t border-[#E7E0D3] bg-[#2F4638] px-8 text-sm text-[#F4F1E8]">
      <MegaMenu />
    </div>
    </nav>
  );
}
