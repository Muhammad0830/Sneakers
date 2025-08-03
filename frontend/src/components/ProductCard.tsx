"use client";

import React from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { Star } from "lucide-react";

const ProductCard = ({ product }: { product: Product }) => {
  const colors = product.color.split(", ");
  const sizes = product.size.split(", ");

  return (
    <div
      style={{
        background: `linear-gradient(-45deg, white 0%, var(--color-primary-80) 50%, white 100%)`,
      }}
      className="group relative p-2f rounded-md border border-primary cursor-pointer flex flex-col items-center gap-2"
    >
      <div
        className={`flex absolute justify-center items-center w-[170px] h-[170px] group-hover:-translate-y-[70px]
       group-hover:-rotate-[30deg] group-hover:scale-60 transition-transform duration-300`}
      >
        <Image
          src={"/sneakers.png"}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="relative overflow-hidden">
        <div className="w-[170px] h-[170px]"></div>
        <div
          className={`transition-transform duration-300 group-hover:-translate-y-[96px] -translate-y-[10px]`}
        >
          <div className="text-center text-xl font-bold">{product.title}</div>
          <div className="text-center text-2xl font-bold">{product.price}$</div>
        </div>
        <div
          className={`absolute flex flex-col gap-2 justify-center items-center left-0 right-0 bottom-[1rem] transition-transform duration-300 translate-y-[150%] group-hover:translate-y-[0%]`}
        >
          <div className="flex items-center gap-2 justify-center">
            <div className="flex items-center gap-2 justify-center text-sm bg-white px-1 rounded-md">
              <Star size={12} color="yellow" fill="yellow" /> {product.rate} / 5
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
    </div>
  );
};

export default ProductCard;
