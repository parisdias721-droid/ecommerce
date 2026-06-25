"use client";

import { useState } from "react";

const categoryPlaceholders: Record<string, string> = {
  electronics: "/images/electronics-placeholder.svg",
  furniture: "/images/furniture-placeholder.svg",
  fashion: "/images/fashion-placeholder.svg",
  accessories: "/images/accessories-placeholder.svg",
  home: "/images/home-placeholder.svg",
  sports: "/images/sports-placeholder.svg",
  beauty: "/images/beauty-placeholder.svg",
  books: "/images/books-placeholder.svg",
  computers: "/images/computers-placeholder.svg",
  cellphones: "/images/cellphones-placeholder.svg",
};

const defaultPlaceholder = "/images/product-placeholder.svg";

export default function ProductImage({
  src,
  alt,
  category,
  className = "",
}: {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}) {
  const categoryPlaceholder = (category && categoryPlaceholders[category]) || defaultPlaceholder;
  const [imgSrc, setImgSrc] = useState(src || categoryPlaceholder);

  const handleError = () => {
    if (imgSrc !== categoryPlaceholder) {
      setImgSrc(categoryPlaceholder);
    } else {
      setImgSrc(defaultPlaceholder);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
    />
  );
}
