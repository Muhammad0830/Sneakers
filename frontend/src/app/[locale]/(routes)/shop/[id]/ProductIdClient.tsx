"use client";
import RecommendedProducts from "@/components/RecommendedProducts";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  ShoppingCart,
  Star,
  ThumbsUp,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import React, { useState } from "react";

const ProductIdClient = () => {
  const params = useParams();
  const id = params?.id;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { theme } = useTheme();

  const product = {
    id: 1,
    title: "Sneakers 2",
    price: 49.99,
    gender: "Men",
    rating: 4.5,
    reviews: [
      {
        id: 1,
        title: "Review 1",
        content: "Content 1",
        rating: 4.5,
        user: {
          id: 1,
          name: "User 1",
          avatar: "https://i.pravatar.cc/150?img=1",
        },
      },
      {
        id: 2,
        title: "Review 2",
        content: "Content 2",
        rating: 4.5,
        user: {
          id: 2,
          name: "User 2",
          avatar: "https://i.pravatar.cc/150?img=2",
        },
      },
    ],
    colors: ["#ffffff", "#000000", "#ff0000", "#00ff00"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: `Step into comfort and style with our all-new Sneakers – the perfect fusion of performance, durability, and everyday fashion. Designed for those on the move, these sneakers feature a lightweight, breathable upper, a cushioned insole for all-day support, and a rubber outsole that delivers reliable grip and traction.Whether you're hitting the gym, exploring the city, or just keeping it casual, these sneakers adapt to your lifestyle with effortless ease. Minimalist in design yet bold in attitude, they pair perfectly with jeans, joggers, or athleisure wear.`,
    image: null,
    variants: ["image", "image", "image", "image"],
    keyFeatures: [
      "Breathable mesh or knit upper for maximum airflow",
      "Cushioned midsole for superior comfort",
      "Durable rubber outsole for enhanced grip",
      "Sleek, modern design that suits any outfit",
      "Available in multiple colorways",
    ],
  };

  if (!id) return notFound();

  return (
    <div className="mt-4 px-[60px]">
      <div>
        PathName: <span>Home</span>
        <span>/Shop/{id}</span>
      </div>

      {/* product main page */}
      <div className="relative w-full flex items-center gap-4 mb-4">
        <div className="relative w-full min-h-[450px] mt-5 ">
          <div className="absolute w-1/2 top-0">
            {/* product variants */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-2">
              {product.variants.map((v, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedVariant(index);
                  }}
                  className={`w-[80px] ${
                    index === selectedVariant
                      ? "shadow-[0px_0px_10px_2px_var(--primary)]"
                      : ""
                  } bg-white hover:shadow-[0px_0px_10px_2px_var(--primary)] dark:bg-black relative aspect-square border border-primary rounded-md cursor-pointer transition-all duration-300`}
                >
                  <Image
                    src={`/sneakers-${index + 1}.png`}
                    alt={product.title}
                    fill
                  />
                </button>
              ))}
            </div>

            {/* left right buttons */}
            <div className="absolute top-[50%] left-0 right-0 -translate-y-[50%] h-10 z-20">
              <button
                disabled={selectedVariant === 0}
                onClick={() => {
                  setSelectedVariant(selectedVariant - 1);
                }}
                className={`absolute left-0 trasnition-transform duration-200 flex items-center justify-center p-1.5 rounded-[50%] aspect-square bg-black/50 dark:bg-white/50 ${
                  selectedVariant === 0
                    ? "opacity-50 hover:scale-100 cursor-default"
                    : "opacity-100 hover:scale-110 cursor-pointer"
                }`}
              >
                <ArrowLeft
                  size={28}
                  color={theme === "light" ? "white" : "black"}
                />
              </button>
              <button
                disabled={selectedVariant === product.variants.length - 1}
                onClick={() => {
                  setSelectedVariant(selectedVariant + 1);
                }}
                className={`absolute right-0 trasnition-all duration-200 flex items-center justify-center p-1.5 rounded-[50%] aspect-square bg-black/50 dark:bg-white/50 ${
                  selectedVariant === product.variants.length - 1
                    ? "opacity-50 hover:scale-100 cursor-default"
                    : "opacity-100 hover:scale-110 cursor-pointer"
                }`}
              >
                <ArrowRight
                  size={28}
                  color={theme === "light" ? "white" : "black"}
                />
              </button>
            </div>

            {/* product images */}
            <div className="mt-20 relative min-h-[350px] w-full flex items-center justify-center">
              {product.variants.map((v, index) => {
                const translateX = (selectedVariant - index) * -42;
                const diff = Math.abs(selectedVariant - index);

                return (
                  <div
                    key={index}
                    className={`absolute z-10 aspect-square w-[300px] transition-all duration-1000`}
                    style={{
                      transform:
                        diff <= 1
                          ? `translateX(${translateX}vw)`
                          : `translateX(${
                              translateX > 0 ? translateX + 20 : translateX - 20
                            }vw)`,
                      scale: diff === 0 ? 1 : diff === 1 ? 0.7 : 0.5,
                    }}
                  >
                    <Image
                      src={`/sneakers-${index + 1}.png`}
                      alt={product.title}
                      className="z-10"
                      fill
                    />

                    <div
                      className={`absolute -bottom-[15%] left-0 right-0 ${
                        diff === 0 ? "h-10" : diff === 1 ? "h-8" : "h-6"
                      } bg-primary/60 shadow-[0px_6px_10px_3px_var(--primary)] rounded-[50%] transition-all duration-1000`}
                    ></div>
                  </div>
                );
              })}

              <div className="absolute inset-0 flex justify-center items-center">
                <div
                  className={`h-5/9 w-4/7 rounded-t-[50%] rounded-b-[30%] blur-2xl bg-primary/40 dark:bg-primary/20`}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* product info card */}
        <div className="absolute z-20 h-full right-0 top-0 w-1/2 flex items-center justify-center">
          <div className="p-5 mt-5 flex flex-col gap-1 rounded-2xl dark:shadow-[0px_0px_15px_1px_#ffffff50] shadow-[0px_0px_15px_1px_#00000080] backdrop-blur-xs bg-white/70 dark:bg-black/70">
            <div className="font-bold text-2xl">{product.title}</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-3xl font-bold">{product.price}$</div>
              <div className="flex items-center gap-2 bg-primary rounded-full px-2">
                <span className="font-bold text-2xl text-white">
                  {product.rating}
                </span>
                <Star color="yellow" size={24} fill="yellow" />
              </div>
            </div>
            <div>
              <div>Choose a size</div>
              <div className="flex gap-1 items-center mb-1">
                {product.sizes.map((size, index) => {
                  return (
                    <button
                      className="px-1 py-0.5 min-w-[30px] border border-black/50 dark:border-white/50 rounded-md"
                      key={index}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div>Choose a color</div>
              <div className="flex items-center gap-1">
                {product.colors.map((color, index) => {
                  return (
                    <button
                      style={{ backgroundColor: `${color}` }}
                      className={`w-[25px] aspect-square border border-black/50 dark:border-white/50 rounded-md`}
                      key={index}
                    ></button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 font-bold text-lg">
              <span>
                Delivery: <span className="text-primary">Free</span>
              </span>
              <span>For {product.gender}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button className="flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                <span>Add to Cart</span>
                <ShoppingCart size={16} color="white" />
              </Button>
              <Button className="flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                <span>Rate</span>
                <ThumbsUp size={16} color="white" />
              </Button>
              <Button className="flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                <span>Comment</span>
                <MessageCircle size={16} color="white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* product description */}
      <div className="mt-20 mb-4">
        <div className="text-xl font-bold mb-2">Description</div>
        <div className="font-semibold">{product.description}</div>
      </div>

      {/* product key features */}
      <div className="mb-4">
        <div className="text-xl font-bold mb-2">Key Features</div>
        <ul className="list-disc ml-7">
          {product.keyFeatures.map((f, index) => (
            <li className="font-semibold" key={index}>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* recommended products */}
      <RecommendedProducts />
    </div>
  );
};

export default ProductIdClient;
