"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
const CartClient = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const t = useTranslations("cart");
  const totalRef = useRef(null);
  const isInView = useInView(totalRef);

  const handleOrder = () => {
    console.log("handleOrder");
  };

  return (
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] mb-20 min-h-screen relative">
      <div className="mt-4 ">
        PathName:{" "}
        <Link className="text-white bg-primary rounded-sm px-1" href={"/home"}>
          {t("Home")}
        </Link>
        /{" "}
        <Link
          className="text-white bg-primary rounded-sm px-1 shadow-[0px_0px_5px_2px_var(--primary)]"
          href={"/home"}
        >
          {t("Profile")}
        </Link>
      </div>

      {/* cart container */}
      <div className="flex gap-2 items-start mt-5">
        <div className="flex-1">
          <div className="border border-primary rounded-t-md border-b-0 pt-2 px-4 pb-3 flex items-center gap-2 justify-between">
            <div className="flex h-5 gap-2 items-center">
              <Checkbox
                checked={allChecked}
                onCheckedChange={(value) => setAllChecked(!!value)}
                id="allProducts"
                className="rounded cursor-pointer"
              />
              <Label htmlFor="allProducts" className="text-[16px] sm:text-sm">
                All products
              </Label>
            </div>
            <div className="sm:block hidden">
              You have currently 3 products in your cart
            </div>
            <div className="sm:hidden block text-sm">3 products</div>
          </div>

          <div className="border border-primary rounded-md p-2 -translate-y-1">
            {/*  */}
            <div className="flex items-center lg:gap-2 gap-1 justify-between sm:py-2 py-1 px-2 relative">
              <div className="flex items-center lg:gap-4 sm:gap-2 gap-1">
                <Label
                  htmlFor="terms"
                  className="cursor-pointer self-stretch flex items-center gap-4"
                >
                  <Checkbox id="terms" className="rounded cursor-pointer" />
                </Label>

                <Link
                  href={`/shop/1`}
                  className="flex items-center justify-center flex-col gap-3"
                >
                  <div className="sm:hidden flex text-[16px] font-bold">
                    Sneakers
                  </div>
                  <div className="sm:w-[100px] md:w-[80px] lg:w-[120px] w-[60px] aspect-square flex justify-center items-center border border-primary rounded-md overflow-hidden relative">
                    <Image
                      src={"/sneakers.png"}
                      alt="product"
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="sm:hidden flex flex-col items-center gap-1">
                    <div className="flex gap-1">
                      <div className="px-1 text-[12px] rounded bg-primary text-white">
                        M
                      </div>
                      <div className="px-1 text-[12px] rounded bg-primary text-white">
                        Men
                      </div>
                    </div>
                    <div className="px-1 text-[12px] rounded bg-primary text-white">
                      White
                    </div>
                  </div>
                </Link>
              </div>

              <div className="sm:flex hidden flex-col gap-1 justify-between self-stretch">
                <Link
                  href={"/shop/1"}
                  className="lg:text-2xl sm:text-xl text-lg font-bold"
                >
                  Sneakers
                </Link>
                <div className="flex flex-col gap-1 items-start text-[16px]">
                  <Link
                    href={"/shop/1"}
                    className="flex lg:flex-row flex-col lg:items-center lg:gap-2 gap-1"
                  >
                    <div>Size: M</div>
                    <div>For: Men</div>
                  </Link>
                  <Link href={"/shop/1"} className="flex items-center gap-1">
                    Color: White{" "}
                    <div className="w-4 aspect-square rounded border border-black/30 bg-white"></div>
                  </Link>
                </div>
              </div>

              <div className="border border-primary rounded-sm lg:p-1 p-0.5 flex sm:flex-col min-[400px]:flex-row flex-col items-center gap-1">
                <button className="sm:order-3 min-[400px]:order-1 order-3 cursor-pointer bg-primary rounded-sm border border-primary p-1 flex justify-center items-center">
                  <Minus className="sm:w-5 sm:h-5 w-4 h-4 text-white dark:text-black" />
                </button>
                <div className="order-2 min-[400px]:px-2 lg:py-1 font-semibold cursor-default">
                  1
                </div>
                <button className="sm:order-1 min-[400px]:order-3 order-1 cursor-pointer bg-primary rounded-sm border border-primary p-1 flex justify-center items-center">
                  <Plus className="sm:w-5 sm:h-5 w-4 h-4 text-white dark:text-black" />
                </button>
              </div>

              <div className="lg:text-3xl sm:text-2xl text-2xl font-bold text-center">
                19.99$
              </div>

              <button className="absolute top-0 right-0 text-red-500 p-1 cursor-pointer">
                <Trash2 className="lg:w-5 lg:h-5 w-4 h-4" />
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute bottom-0 right-0 p-1 cursor-pointer"
              >
                <Heart
                  className="lg:w-5 lg:h-5 w-4 h-4 text-primary"
                  fill={isLiked ? "#24f89c" : "transparent"}
                />
              </button>
            </div>
            {/*  */}
          </div>
        </div>

        <div className="lg:w-[300px] md:w-[200px] md:block hidden border border-primary rounded-md p-2">
          <div className="text-xl font-bold">Your order</div>
          <div className="flex items-center justify-between gap-2">
            <div>Products</div>
            <div className="font-bold">2</div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>Total</div>
            <div className="text-2xl font-bold">39.99$</div>
          </div>
          <button className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-2 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow">
            To order
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: "150%" }}
        animate={isInView ? { opacity: 0, x: "150%" } : { opacity: 1, x: "0%" }}
        transition={{ duration: 0.5, ease: "backInOut" }}
        className="fixed bottom-5 right-5 lg:w-[300px] md:w-[200px] min-w-[150px] max-w-[200px] bg-white md:hidden block border border-primary rounded-md p-2"
      >
        <div className="flex items-center justify-between gap-2">
          <div>Total</div>
          <div className="text-2xl font-bold">39.99$</div>
        </div>
        <button className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-2 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow">
          To order
        </button>
      </motion.div>

      <div
        className={cn("flex justify-end transition-all duration-300")}
        ref={totalRef}
      >
        <div className="lg:w-[300px] md:w-[200px] md:hidden flex gap-4 border border-primary rounded-md p-2">
          <div className="flex items-center justify-between gap-2">
            <div>Total</div>
            <div className="text-2xl font-bold">39.99$</div>
          </div>
          <button
            onClick={() => handleOrder()}
            className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-4 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow"
          >
            To order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartClient;
