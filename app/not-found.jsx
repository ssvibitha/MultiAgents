import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">
        404
      </h1>

      <p className="text-gray-600 mb-8">
        Page not found.
      </p>

      <Link
        href="/"
        className="border border-black px-6 py-3 rounded-md hover:bg-black hover:text-white transition"
      >
        Return Home
      </Link>
    </div>
  );
}