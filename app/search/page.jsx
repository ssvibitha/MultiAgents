import { redirect } from "next/navigation";

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const raw = sp?.q;
  const q = typeof raw === "string" ? raw : "";
  
  if (q) {
    redirect(`/shop?q=${encodeURIComponent(q)}`);
  } else {
    redirect(`/shop`);
  }
}

