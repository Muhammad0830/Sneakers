"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { inCartProducts } from "@/types/types";

const AddToCart = ({
  addedToCart,
  handleAddToCart,
  warnAboutSignIn,
  inCartProducts,
  selectedSize,
  selectedColor,
  setAddedToCart,
}: {
  addedToCart: number;
  handleAddToCart: (newAddedToCart: number) => void;
  warnAboutSignIn: () => void;
  inCartProducts: inCartProducts[];
  selectedSize: string;
  selectedColor: string;
  setAddedToCart: (quantity: number) => void;
}) => {
  const { user } = useAuth();
  const t = useTranslations("Product");

  const showPlusMinusButtons = inCartProducts.some(
    (p) => p.size === selectedSize && p.color === selectedColor
  );

  useEffect(() => {
    const newQuantity =
      inCartProducts.filter(
        (p) => p.size === selectedSize && p.color === selectedColor
      )[0]?.quantity || 0;

    if (newQuantity) {
      setAddedToCart(newQuantity);
    }
  }, [inCartProducts, showPlusMinusButtons, selectedSize, selectedColor]); // eslint-disable-line

  return (
    <div className="relative">
      <motion.button
        initial={{ x: "100%", right: "100%", opacity: 0, scale: 1 }}
        animate={
          showPlusMinusButtons
            ? {
                x: "-3px",
                right: "0%",
                opacity: 1,
                transition: {
                  duration: 0.3,
                  delay: 0,
                  ease: "backInOut",
                },
              }
            : {
                x: "100%",
                right: "100%",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  delay: 0.3,
                  ease: "backInOut",
                },
              }
        }
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1, delay: 0 },
        }}
        onClick={() => handleAddToCart(addedToCart + 1)}
        className="z-10 cursor-pointer absolute top-[3px] bottom-[3px]  border border-black/50 flex items-center justify-center bg-white aspect-square rounded-sm"
      >
        <Plus className="w-5 h-5 text-black" />
      </motion.button>

      <motion.button
        initial={{ x: "120%", left: 0, opacity: 0, scale: 1 }}
        animate={
          showPlusMinusButtons
            ? {
                x: "240%",
                left: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  delay: 0.1,
                  ease: "backInOut",
                },
              }
            : {
                x: "120%",
                left: "-50%",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  delay: 0.2,
                  ease: "backInOut",
                },
              }
        }
        className="z-10 cursor-pointer absolute top-[3px] bottom-[3px] aspect-square font-bold text-black flex items-center justify-center"
      >
        <span>{addedToCart}</span>
      </motion.button>
      <motion.button
        onClick={() => handleAddToCart(addedToCart - 1)}
        initial={{ x: "120%", left: 0, opacity: 0, scale: 1 }}
        animate={
          showPlusMinusButtons
            ? {
                x: "120%",
                left: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  delay: 0.2,
                  ease: "backInOut",
                },
              }
            : {
                x: "0",
                left: "-50%",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  delay: 0.1,
                  ease: "backInOut",
                },
              }
        }
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1, delay: 0 },
        }}
        className="z-10 cursor-pointer absolute top-[3px] bottom-[3px] aspect-square bg-white rounded-sm text-black flex items-center justify-center"
      >
        <Minus className="w-5 h-5 text-black" />
      </motion.button>
      <motion.button
        onClick={() => handleAddToCart(0)}
        initial={{ x: "3px", left: 0, opacity: 0, scale: 1 }}
        animate={
          showPlusMinusButtons
            ? {
                x: "3px",
                left: 0,
                opacity: 1,
                transition: {
                  duration: 0.3,
                  delay: 0.3,
                  ease: "backInOut",
                },
              }
            : {
                x: "-120%",
                left: "-50%",
                opacity: 0,
                transition: {
                  duration: 0.3,
                  delay: 0,
                  ease: "backInOut",
                },
              }
        }
        whileTap={{
          scale: 0.9,
          transition: { duration: 0.1, delay: 0 },
        }}
        className="z-10 cursor-pointer absolute top-[3px] bottom-[3px] aspect-square bg-white rounded-sm text-black flex items-center justify-center"
      >
        <Trash2 className="w-5 h-5 text-red-500" />
      </motion.button>
      <button
        onClick={() => {
          if (user?.user?.id) {
            handleAddToCart(addedToCart + 1);
          } else warnAboutSignIn();
        }}
        disabled={showPlusMinusButtons}
        className="relative rounded-sm px-2 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all"
      >
        <span
          className={cn(
            "lg:text-[16px] text-[12px] text-white font-semibold transition-opacity duration-300",
            showPlusMinusButtons ? "opacity-0" : "opacity-100"
          )}
        >
          {t("Add to Cart")}
        </span>
        <ShoppingCart
          size={18}
          color="white"
          className={cn(
            "transition-opacity duration-300",
            showPlusMinusButtons ? "opacity-0" : "opacity-100"
          )}
        />
      </button>
    </div>
  );
};

export default AddToCart;
