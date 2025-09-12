"use client";

import React from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { MessageCircle, Star, StarIcon, ThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useTranslations } from "next-intl";

const ProductCard = ({ product }: { product: Product }) => {
  const colors = product.color;
  const sizes = product.size;
  const { theme } = useTheme();
  const t = useTranslations("Shop");

  const rating = Number(product.rating).toFixed(1);

  if (!product) {
    return null;
  }

  return (
    <Link href={`/shop/${product.id}`}>
      <div className="relative">
        <div className="productCard group relative flex justify-center gap-2">
          <div
            className={`flex absolute cursor-pointer z-30 justify-center items-center sm:w-[170px] sm:h-[170px] w-[100px] h-[100px] productCardImage lg:group-hover:-translate-y-[70px]
       lg:group-hover:-rotate-[30deg] lg:group-hover:scale-60 transition-transform duration-300`}
          >
            <Image
              src={"/sneakers.png"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          {/* gender badge */}
          <div className="absolute cursor-pointer z-30 flex capitalize top-3 font-semibold text-sm left-3 bg-primary border-primary text-white px-1 rounded-sm">
            {product.gender}
          </div>

          {/* discount badge */}
          {product.discount_type ? (
            <div className="absolute aspect-square px-2.5 pt-0.5 flex flex-col rounded-full rounded-bl-none justify-center items-center cursor-pointer z-30 top-0 right-0 -translate-y-[30%] translate-x-[30%] group-hover:translate-y-0 group-hover:translate-x-0 group-hover:top-3 group-hover:right-3 group-hover:rounded-bl-full bg-yellow-300 transition-all duration-300">
              <span className="text-sm font-bold  text-[#383838]">
                {t("Sale")}
              </span>
              <span className="text-[12px] font-bold  text-[#383838]">
                {Number(product.discount_value).toFixed(0)}
                {product.discount_type === "percentage" ? "%" : "$"}
              </span>
            </div>
          ) : null}

          <div
            style={{
              backgroundImage:
                theme === "light"
                  ? `linear-gradient(-45deg, white 0%, var(--color-primary-80) 50%, white 100%)`
                  : `linear-gradient(-45deg, black 0%, var(--color-primary-80) 50%, black 100%)`,
              backgroundColor: theme === "light" ? "" : "#222222",
            }}
            className="z-20 cursor-pointer w-full relative overflow-hidden border border-primary rounded-md p-1"
          >
            <div className="sm:w-[170px] sm:h-[170px] w-[100px] h-[100px]"></div>

            {/* desktop (title and price) */}
            <div
              className={`lg:block hidden transition-transform duration-300 lg:group-hover:-translate-y-[96px] -translate-y-[10px]`}
            >
              <div className="text-center text-xl font-bold">
                {product.title}
              </div>
              <div className="text-center text-2xl font-bold">
                {product.discount_type ? (
                  <div className="flex justify-center items-end">
                    <span className="line-through text-[#22222250] dark:text-[#ffffff70] text-lg">
                      {product.price}$
                    </span>
                    <span>
                      /
                      {(
                        Number(product.price) -
                        (product.discount_type === "percentage"
                          ? Number(product.price) *
                            (Number(product.discount_value) / 100)
                          : Number(product.discount_value))
                      ).toFixed(2)}
                      $
                    </span>
                  </div>
                ) : (
                  <span>{product.price}$</span>
                )}
              </div>
            </div>

            {/* mobile & tablet (title and price) */}
            <div className="lg:hidden flex flex-col sm:gap-0 gap-1 px-2">
              <div className="flex sm:flex-row flex-col justify-between sm:gap-2 items-center w-full">
                <span className="text-center sm:text-lg text-md font-semibold">
                  {product.title}
                </span>
                <span className="text-center text-[16px] font-bold">
                  {product.discount_type ? (
                    <div className="flex sm:flex-col flex-row items-end relative">
                      <span className="sm:absolute bottom-[75%] line-through text-[#22222250] dark:text-[#ffffff70] text-[12px]">
                        {product.price}$
                      </span>
                      <span className="sm:hidden flex">/</span>
                      <span>
                        {(
                          Number(product.price) -
                          (product.discount_type === "percentage"
                            ? Number(product.price) *
                              (Number(product.discount_value) / 100)
                            : Number(product.discount_value))
                        ).toFixed(2)}
                        $
                      </span>
                    </div>
                  ) : (
                    <span>{product.price}$</span>
                  )}
                </span>
              </div>
              <div className="flex flex-row justify-between gap-2 items-center w-full">
                <span className="text-center capitalize sm:text-md text-sm font-semibold">
                  {product.gender}
                </span>
                <div className="flex items-center gap-1">
                  <span className="sm:text-md text-sm font-semibold">
                    {Number(product.rating).toFixed(1)}
                  </span>
                  <StarIcon color="yellow" size={16} fill="yellow" />
                </div>
              </div>
            </div>

            <div
              className={`absolute flex flex-col gap-2 justify-center items-center left-0 right-0 bottom-[1rem] transition-transform duration-300 translate-y-[150%] lg:group-hover:translate-y-[0%]`}
            >
              <div className="flex items-center gap-2 justify-center">
                <div className="flex items-center gap-2 justify-center text-sm bg-white dark:bg-black px-1 rounded-md">
                  <Star size={12} color="yellow" fill="yellow" /> {rating} / 5
                </div>
                <div className="rounded-md bg-white dark:bg-black px-1 text-sm">
                  {product.reviews.length} reviews
                </div>
              </div>
              <div className="flex items-center gap-2 justify-center">
                {colors.map((color, index) => {
                  if (index < 6) {
                    return (
                      <div
                        style={{
                          backgroundColor: color,
                        }}
                        className={`w-4 h-4 rounded-full border border-black`}
                        key={index}
                      ></div>
                    );
                  }
                })}
              </div>
              <div className="flex items-center justify-center gap-1">
                {sizes.map((size, index) => (
                  <span
                    className="bg-white dark:bg-black px-1 rounded-md text-sm"
                    key={index}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="z-10 bg-background absolute left-0 right-0 bottom-0 top-0"></div>

          <div className="absolute cardButtonsWrapper -translate-y-[0%] top-0 py-1 z-0 left-0 right-0 bg-transparent transition-transform duration-200 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-[2px]">
              <div className="p-1 cursor-pointer rounded-2xl cardButtons bg-white text-black border-1 border-black/20 dark:border-transparent translate-y-[150%] transition-transform duration-300">
                <ThumbsUp size={16} color="black" />
              </div>
              <div className="p-1 cursor-pointer rounded-2xl bg-white text-black border-1 border-black/20 dark:border-transparent cardButtons translate-y-[150%] transition-transform duration-300 delay-75">
                <MessageCircle size={16} color="black" />
              </div>
            </div>

            <div className="flex cursor-pointer items-center gap-1 bg-white text-black border-1 border-black/20 dark:border-transparent rounded-2xl px-2 py-0.5 mr-[2px] cardButtons translate-y-[150%] transition-transform duration-300 delay-150">
              <span className="text-sm">Quick Look</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
