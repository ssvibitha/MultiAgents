import { redirect } from "next/navigation";

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  redirect(`/shop?category=${resolvedParams.slug}`);
}

