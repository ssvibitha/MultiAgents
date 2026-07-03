import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/LogoutButton";

export const metadata = {
  title: "Profile · Cartflow",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <p className="text-gray-500 mb-4">Logged in as: <strong className="text-black">{session.user.email}</strong></p>
          <LogoutButton />
        </div>
      </div>
      <Footer />
    </main>
  );
}
