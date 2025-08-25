"use client";

import React from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { MessageCircle, Star, StarIcon, ThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";

const ProductCard = ({ product }: { product: Product }) => {
  const colors = product.color.split(", ");
  const sizes = product.size.split(", ");
  const { theme } = useTheme();

  const rating = Number(product.rating).toFixed(1);

  if (!product) {
    return null;
  }

  return (
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
        <div className="absolute cursor-pointer z-30 hidden lg:flex capitalize top-3 font-semibold text-sm left-3 bg-primary border-primary text-white px-1 rounded-sm">
          {product.gender}
        </div>

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
            <div className="text-center text-xl font-bold">{product.title}</div>
            <div className="text-center text-2xl font-bold">
              {product.price}$
            </div>
          </div>

          {/* mobile & tablet (title and price) */}
          <div className="lg:hidden flex flex-col sm:gap-0 gap-1 px-2">
            <div className="flex sm:flex-row flex-col justify-between sm:gap-2 items-center w-full">
              <span className="text-center sm:text-lg text-md font-semibold">
                {product.title}
              </span>
              <span className="text-center sm:text-lg text-md font-bold">
                {product.price}$
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

        <div className="absolute cardButtonsWrapper -translate-y-[0%] top-0 py-1 z-0 left-0 right-0 bg-background transition-transform duration-200 flex items-center justify-between">
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
  );
};

export default ProductCard;
