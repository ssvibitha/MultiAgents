"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const inWishlist = has(product.id);

  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.cardImageContainer}>
          <Link href={`/product/${product.slug}`} className="block absolute inset-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>
          <button
            type="button"
            onClick={() => toggle(product)}
            className={`${styles.wishlistBtn} ${inWishlist ? styles.active : ""}`}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              className={inWishlist ? "fill-current" : ""}
              aria-hidden
            />
          </button>
        </div>
        
        <div className={styles.content}>
          <Link href={`/product/${product.slug}`} className={styles.title}>
            {product.name}
          </Link>
          <div className={styles.priceContainer}>
            <p className={styles.price}>₹{product.price.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className={styles.cardBtn}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
