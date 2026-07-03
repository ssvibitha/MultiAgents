"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import StoreShell from "@/components/layout/StoreShell";

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const user = session?.user ?? null;
  const loading = status === "loading";

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.replace("/login?redirect=/account");
    return null;
  }

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  if (loading || !user) {
    return (
      <StoreShell title="Account">
        <p className="text-gray-500">Loading…</p>
      </StoreShell>
    );
  }

  return (
    <StoreShell
      title="Your account"
      subtitle="Manage your session for protected areas of the shop."
    >
      <div className="max-w-xl bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <dl className="space-y-4">
          <div>
            <dt className="text-sm text-gray-500">Signed in as</dt>
            <dd className="text-lg font-medium mt-1">{user.name || user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-lg font-medium mt-1">{user.email}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/wishlist"
            className="inline-flex items-center justify-center border border-black px-5 py-2.5 rounded-md hover:bg-black hover:text-white transition font-medium"
          >
            View wishlist
          </Link>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center bg-gray-100 px-5 py-2.5 rounded-md hover:bg-gray-200 transition font-medium"
          >
            Log out
          </button>
        </div>
      </div>
    </StoreShell>
  );
}
