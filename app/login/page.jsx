import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in · Plantify",
  description: "Sign in to access your wishlist and account.",
};

function LoginFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 -mt-8">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </main> 
  );
}
