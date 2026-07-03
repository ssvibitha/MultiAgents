import StoreShell from "@/components/layout/StoreShell";
import CartContent from "@/components/cart/CartContent";

export const metadata = {
  title: "Cart · Plantify",
  description: "Review items in your shopping cart.",
};

export default function CartPage() {
  return (
    <StoreShell
      title="Your cart"
      subtitle="Review quantities and subtotal before checkout."
    >
    <CartContent />
    </StoreShell>
  );
}
