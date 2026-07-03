"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

function safeRedirect(raw) {
  if (!raw || typeof raw !== "string") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setPending(true);

  const res = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  setPending(false);

  if (res?.error) {
    setError(res.error);
  } else {
    router.push(redirect);
    router.refresh();
  }
};

  return (
    <div className="w-full max-w-md border border-gray-200 rounded-2xl p-8 bg-white">
      {/* Heading */}
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-5">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-semibold text-black">
          Welcome back
        </h1>

        <p className="text-gray-500 mt-2 text-sm">
          Sign in to continue to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email address
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-black"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 outline-none focus:border-black"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-black underline decoration-black underline-offset-2 transition-colors duration-200 hover:text-gray-700"            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Sign in */}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-black text-white py-3 rounded-xl font-medium transition-colors duration-200 hover:bg-gray-800 disabled:opacity-60"        >
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-sm text-gray-500">
          Or 
        </span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full border border-gray-300 rounded-xl py-3 font-medium transition-colors duration-200 hover:bg-gray-100 hover:border-gray-400 flex items-center justify-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-5 h-5"
        >
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 15 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 10-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.5-6.1 7.1l6.2 5.2C39.1 37 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
          />
        </svg>

        Sign in with Google
      </button>

      {/* Footer */}
      <Link
        href="/signup"
        className="block text-center text-sm text-black underline decoration-black underline-offset-2 mt-6 transition-colors duration-200 hover:text-gray-700"      >
        Don’t have an account? Sign up
      </Link>
    </div>
  );
}