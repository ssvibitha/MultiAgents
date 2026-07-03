import StoreShell from "@/components/layout/StoreShell";
import WishlistContent from "@/components/wishlist/WishlistContent";

export const metadata = {
  title: "Wishlist · Plantify",
  description: "Products you have saved for later.",
};

export default function WishlistPage() {
  return (
    <StoreShell
      title="Wishlist"
      subtitle="Saved for later — add anything to your cart when you are ready."
    >
      <WishlistContent />
    </StoreShell>
  );
}
