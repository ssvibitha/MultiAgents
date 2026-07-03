"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })}
      className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition font-medium"
    >
      Log out
    </button>
  );
}
