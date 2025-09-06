"use client";
import RecommendedProducts from "@/components/RecommendedProducts";
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
import React, { useEffect, useState } from "react";

const ProductIdClient = () => {
  const params = useParams();
  const id = params?.id;
  const [selectedVariant, setSelectedVariant] = useState(0);
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="mt-4 lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px]">
      <div>
        PathName: <span>Home</span>
        <span>/Shop/{id}</span>
      </div>

      {/* product main page */}
      <div className="relative w-full sm:flex items-center gap-4 mb-4 mt-5">
        {/* product info card */}
        <div className="sm:absolute z-20 h-full right-0 top-0 sm:w-1/2 w-full flex items-center justify-center">
          <div className="sm:p-5 p-3 sm:mt-5 flex sm:w-auto sm:min-w-auto min-w-[clamp(280px,70vw,400px)] flex-col sm:gap-1 rounded-2xl dark:shadow-[0px_0px_15px_1px_#ffffff50] shadow-[0px_0px_15px_1px_#00000080] backdrop-blur-xs bg-white/70 dark:bg-black/70">
            <div className="font-bold lg:text-2xl sm:text-xl text-[16px] flex justify-between">
              <span>{product.title}</span>
              <span className="sm:hidden inline-block">{product.price}$</span>
            </div>
            <div className="smLflex hidden items-center justify-between gap-2">
              <div className="lg:text-3xl sm:text-xl font-bold">
                {product.price}$
              </div>
              <div className="flex items-center gap-2 bg-primary rounded-full px-2">
                <span className="font-bold lg:text-2xl sm:text-lg text-[16px] text-white">
                  {product.rating}
                </span>
                <Star
                  className="lg:block hidden"
                  color="yellow"
                  size={24}
                  fill="yellow"
                />
                <Star
                  className="lg:hidden block"
                  color="yellow"
                  size={18}
                  fill="yellow"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="sm:text-[16px] text-[12px]">Choose a size</div>
                <div className="flex gap-1 items-center mb-1">
                  {product.sizes.map((size, index) => {
                    return (
                      <button
                        className="px-1 py-0.5 lg:min-w-[30px] sm:min-w-[25px] min-w-[20px] border border-black/50 dark:border-white/50 sm:rounded-md rounded-sm lg:text-[16px] sm:text-[14px] text-[12px]"
                        key={index}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 bg-primary rounded-full px-2">
                <span className="font-bold lg:text-2xl sm:text-lg text-[16px] text-white">
                  {product.rating}
                </span>
                <Star
                  className="lg:hidden block"
                  color="yellow"
                  size={18}
                  fill="yellow"
                />
              </div>
            </div>
            <div>
              <div className="sm:text-[16px] text-[12px]">Choose a color</div>
              <div className="flex items-center gap-1">
                {product.colors.map((color, index) => {
                  return (
                    <button
                      style={{ backgroundColor: `${color}` }}
                      className={`sm:w-[25px] w-[20px] aspect-square border border-black/50 dark:border-white/50 sm:rounded-md rounded-sm`}
                      key={index}
                    ></button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 lg:font-bold lg:text-lg sm:text-[16px] text-[14px]">
              <span>
                Delivery: <span className="text-primary">Free</span>
              </span>
              <span>For {product.gender}</span>
            </div>
            <div className="flex sm:justify-center justify-between items-center gap-2">
              <button className="lg:rounded-md rounded-sm lg:px-3 lg:py-2 px-2 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                <span className="lg:text-[16px] text-[12px] text-white font-semibold">
                  Add to Cart
                </span>
                <ShoppingCart size={18} color="white" />
              </button>
              <div className="flex items-center gap-2">
                <button className="lg:rounded-md rounded-sm lg:px-3 lg:py-2 px-2 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                  <span className="lg:block hidden">Rate</span>
                  <ThumbsUp size={18} color="white" />
                </button>
                <button className="lg:rounded-md rounded-sm lg:px-3 lg:py-2 px-2 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all">
                  <span className="lg:block hidden">Comment</span>
                  <MessageCircle size={18} color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* product images */}
        <div className="relative w-full lg:min-h-[450px] min-h-[350px]">
          <div className="absolute sm:w-1/2 w-full top-0">
            {/* product variants */}
            <div className="absolute sm:flex top-0 left-0 right-0 hidden items-center justify-center">
              <div
                className={`md:flex grid gap-2`}
                style={{
                  gridTemplateColumns: `repeat(${
                    product.variants.length === 4 ? 4 : 3
                  }, 1fr)`,
                }}
              >
                {product.variants.map((v, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedVariant(index);
                    }}
                    className={`lg:w-[70px] w-[50px] sm:w-[40px] ${
                      index === selectedVariant
                        ? "lg:shadow-[0px_0px_10px_2px_var(--primary)] shadow-[0px_0px_5px_1px_var(--primary)]"
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
            </div>

            <div className="sm:mt-20 mt-10 relative lg:min-h-[350px] min-h-[200px] w-full flex items-center justify-center">
              {/* product images */}
              {product.variants.map((v, index) => {
                const translateX =
                  (selectedVariant - index) * (width > 640 ? -42 : -60);
                const diff = Math.abs(selectedVariant - index);

                return (
                  <div
                    key={index}
                    className={`absolute z-10 aspect-square lg:w-[300px] md:w-[250px] sm:w-[200px] w-[200px] transition-all duration-1000`}
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

              {/* product behind shadow */}
              <div className="absolute inset-0 flex justify-center items-center">
                <div
                  className={`h-5/9 w-4/7 rounded-t-[50%] rounded-b-[30%] blur-2xl bg-primary/40 dark:bg-primary/20`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* product description */}
      <div className="md:mt-20 sm:mt-12 mb-4">
        <div className="md:text-2xl sm:text-xl text-lg font-bold mb-2">
          Description
        </div>
        <div className="font-semibold">{product.description}</div>
      </div>

      {/* product key features */}
      <div className="mb-4">
        <div className="md:text-2xl sm:text-xl text-lg font-bold mb-2">
          Key Features
        </div>
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
