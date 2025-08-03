"use client";

import React from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { MessageCircle, Star, ThumbsUp } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const colors = product.color.split(", ");
  const sizes = product.size.split(", ");

  return (
    <div className="relative">
      <div className="productCard group relative flex justify-center gap-2">
        <div
          className={`flex absolute z-30 justify-center items-center w-[170px] h-[170px] productCardImage group-hover:-translate-y-[70px]
       group-hover:-rotate-[30deg] group-hover:scale-60 transition-transform duration-300`}
        >
          <Image
            src={"/sneakers.png"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        <div
          style={{
            background: `linear-gradient(-45deg, white 0%, var(--color-primary-80) 50%, white 100%)`,
          }}
          className="z-20 w-full relative overflow-hidden border border-primary rounded-md"
        >
          <div className="w-[170px] h-[170px]"></div>
          <div
            className={`transition-transform duration-300 group-hover:-translate-y-[96px] -translate-y-[10px]`}
          >
            <div className="text-center text-xl font-bold">{product.title}</div>
            <div className="text-center text-2xl font-bold">
              {product.price}$
            </div>
          </div>
          <div
            className={`absolute flex flex-col gap-2 justify-center items-center left-0 right-0 bottom-[1rem] transition-transform duration-300 translate-y-[150%] group-hover:translate-y-[0%]`}
          >
            <div className="flex items-center gap-2 justify-center">
              <div className="flex items-center gap-2 justify-center text-sm bg-white px-1 rounded-md">
                <Star size={12} color="yellow" fill="yellow" /> {product.rate} /
                5
              </div>
              <div className="rounded-md bg-white px-1 text-sm">
                {product.reviews} reviews
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
                <span className="bg-white px-1 rounded-md text-sm" key={index}>
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="z-10 bg-background absolute left-0 right-0 bottom-0 top-0"></div>

        <div className="absolute cardButtonsWrapper -translate-y-[0%] top-0 py-1 z-0 left-0 right-0 bg-background transition-transform duration-200 flex items-center justify-between">
          <div className="flex items-center gap-2 ml-[2px]">
            <div className="p-1 cursor-pointer rounded-2xl cardButtons bg-white translate-y-[150%] transition-transform duration-300">
              <ThumbsUp size={16} color="black" />
            </div>
            <div className="p-1 cursor-pointer rounded-2xl bg-white cardButtons translate-y-[150%] transition-transform duration-300 delay-75">
              <MessageCircle size={16} color="black" />
            </div>
          </div>

          <div className="flex cursor-pointer items-center gap-1 bg-white rounded-2xl px-2 py-0.5 mr-[2px] cardButtons translate-y-[150%] transition-transform duration-300 delay-150">
            <span className="text-sm">Quick Look</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
