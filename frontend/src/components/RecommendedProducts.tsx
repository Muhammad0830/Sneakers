import useApiQuery from "@/hooks/useApiQuery";
import React, { useEffect, useRef, useState } from "react";
import { Product, ProductsDataProps } from "@/types/types";
import { useCustomToast } from "@/context/CustomToastContext";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";

const RecommendedProducts = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;
  const { showToast } = useCustomToast();
  const t = useTranslations("Shop");
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const { data, isLoading, isError } = useApiQuery<ProductsDataProps>(
    `/?page=${page}&limit=${limit}&fetchType=scroll`,
    ["Sneakers", page, limit]
  );

  // when new data arrives → append to state
  useEffect(() => {
    if (data?.data) {
      setAllProducts((prev) => [...prev, ...data.data]);
      setHasMore(data?.hasMore || false);
    }
  }, [data]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [isLoading, hasMore]);

  if (isError)
    showToast("error", t("Error Occured"), t("Internal server error"));

  return (
    <div>
      <div>Recommended Just For You</div>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-8 md:gap-6 gap-3 mb-10">
        {allProducts?.length > 0 &&
          allProducts.map((product: Product, index: number) => (
            <ProductCard product={product} key={index} />
          ))}
      </div>

      {hasMore && (
        <div
          ref={observerRef}
          className="w-full h-10 flex justify-center items-center mb-10"
        >
          {isLoading && (
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecommendedProducts;
