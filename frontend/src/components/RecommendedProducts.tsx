import useApiQuery from "@/hooks/useApiQuery";
import React, { useEffect, useRef, useState } from "react";
import { Product, ProductsDataProps } from "@/types/types";
import { useCustomToast } from "@/context/CustomToastContext";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import LocalData from "@/data_frontend/data.json";

const RecommendedProducts = () => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 12;
  const { showToast, showLoadingToast, hideLoadingToast } = useCustomToast();
  const t = useTranslations("Shop");
  const toastT = useTranslations("Toast");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [useLocal, setUseLocal] = useState(false);
  const hasShownDummyInfo = useRef(false);

  const { data, isLoading, isError } = useApiQuery<ProductsDataProps>(
    `/sneakers/?page=${page}&limit=${limit}&fetchType=scroll`,
    ["Sneakers", page, limit],
    !useLocal
  );

  useEffect(() => {
    if (isError || useLocal) {
      setUseLocal(true);
      setAllProducts(LocalData.products);
    }
  }, [isError, useLocal]);

  // when new data arrives → append to state
  useEffect(() => {
    // loading
    if (isLoading) {
      showLoadingToast(t("Loading the data"));
    } else {
      setTimeout(() => hideLoadingToast(), 1000);
    }

    // dummy data
    if (!isLoading && !data && !hasShownDummyInfo.current) {
      showToast("info", toastT("Info"), toastT("Dummy data working"));
      hasShownDummyInfo.current = true; // prevent duplicates
    }

    if (data?.data) {
      setAllProducts((prev) => {
        const newProducts = data.data.filter(
          (p) => !prev.some((existing) => existing.id === p.id)
        ); // filters if any of the new products already exist in the state
        return [...prev, ...newProducts];
      });
      setHasMore(data?.hasMore || false);
    }
  }, [data, isLoading]); // eslint-disable-line

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

    return () => observer.disconnect();
  }, [isLoading, hasMore]);

  return (
    <div>
      <div className="md:text-2xl font-bold mb-4 sm:text-xl text-lg">
        Recommended Just For You
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-8 md:gap-6 gap-3 mb-10">
        {allProducts?.length > 0 &&
          allProducts.map((product: Product, index: number) => (
            <ProductCard product={product} key={index} />
          ))}
      </div>

      {hasMore && !useLocal && (
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
