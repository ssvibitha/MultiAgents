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
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import MegaMenu from "@/components/layout/MegaMenu";
import dynamic from "next/dynamic";

const AIChatPanel = dynamic(() => import("@/components/ai/AIChatPanel"), { ssr: false });

export default function Navbar() {
  const router = useRouter();
  const { totalCount } = useCart();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

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
    <>
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

      {/* CENTER SEARCH + ASK AI */}
      <div className="flex-1 flex items-center justify-center pl-50 gap-3">
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

        {/* ── Ask AI button ── */}
        <button
          id="ask-ai-navbar-btn"
          onClick={() => setChatOpen(true)}
          className="relative cursor-pointer py-2.5 px-5 text-center font-semibold inline-flex justify-center items-center gap-2 text-sm uppercase text-white rounded-lg border-solid transition-transform duration-300 ease-in-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden bg-[#2F4638] shrink-0"
          style={{ letterSpacing: "0.04em" }}
        >
          <Sparkles size={15} className="relative z-20" />
          <span className="relative z-20 whitespace-nowrap">Ask AI</span>
          {/* shimmer sweep */}
          <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
          {/* corner borders */}
          <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />
          <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />
          <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />
          <span className="w-1/2 drop-shadow-3xl transition-all duration-300 block border-[#D4EDF9] absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
        </button>
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
    {/* ── Full-window AI Chat ── */}
    <AIChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
