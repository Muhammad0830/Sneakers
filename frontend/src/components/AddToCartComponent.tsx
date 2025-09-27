"use client";
import { InCartProducts } from "@/types/types";
import { Minus, Plus } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { motion } from "framer-motion";

const AddToCartComponent = ({
  cart,
  handleAddToCart,
  handleDelete,
  setOnCartProducts,
  t,
}: {
  cart: InCartProducts;
  handleAddToCart: (
    productId: number,
    newQuantity: number,
    size: string,
    color: string
  ) => void;
  handleDelete: (id: number) => void;
  setOnCartProducts: React.Dispatch<React.SetStateAction<InCartProducts[]>>;
  t: any; // eslint-disable-line
}) => {
  const [areYouSureDialogOpen, setAreYouSureDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number>(0);

  return (
    <div className="border border-primary rounded-sm lg:p-1 p-0.5 flex sm:flex-col min-[400px]:flex-row flex-col items-center gap-1">
      <motion.button
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.15, ease: "easeInOut", type: "spring" }}
        onClick={() => {
          if (cart.quantity > 1) {
            setOnCartProducts((prev) =>
              prev.map((p) =>
                p.id === cart.id
                  ? {
                      ...p,
                      quantity: cart.quantity - 1,
                    }
                  : p
              )
            );
            handleAddToCart(
              cart.product.id,
              cart.quantity - 1,
              cart.size,
              cart.color
            );
          } else {
            setAreYouSureDialogOpen(true);
            setProductToDelete(cart.id);
          }
        }}
        className="sm:order-3 min-[400px]:order-1 order-3 cursor-pointer bg-primary rounded-sm border border-primary p-1 flex justify-center items-center"
      >
        <Minus className="sm:w-5 sm:h-5 w-4 h-4 text-white dark:text-black" />
      </motion.button>
      <div className="order-2 min-[400px]:px-2 lg:py-1 font-semibold cursor-default">
        {cart.quantity}
      </div>
      <motion.button
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.15, ease: "easeInOut", type: "spring" }}
        onClick={() => {
          setOnCartProducts((prev) =>
            prev.map((p) =>
              p.id === cart.id
                ? {
                    ...p,
                    quantity: cart.quantity + 1,
                  }
                : p
            )
          );
          handleAddToCart(
            cart.product.id,
            cart.quantity + 1,
            cart.size,
            cart.color
          );
        }}
        className="sm:order-1 min-[400px]:order-3 order-1 cursor-pointer bg-primary rounded-sm border border-primary p-1 flex justify-center items-center"
      >
        <Plus className="sm:w-5 sm:h-5 w-4 h-4 text-white dark:text-black" />
      </motion.button>

      <Dialog
        open={areYouSureDialogOpen}
        onOpenChange={setAreYouSureDialogOpen}
      >
        <DialogContent
          aria-describedby="are you sure to delete"
          className="!w-[80vw] !max-w-[500px]"
        >
          <DialogTitle>{t("Are you sure to delete?")}</DialogTitle>
          <div className="flex w-full justify-between items-center gap-2">
            <DialogClose asChild>
              <button className="px-2 py-1 rounded-sm font-semibold border border-primary text-white bg-primary cursor-pointer">
                {t("Cancel")}
              </button>
            </DialogClose>
            <DialogClose asChild>
              <button
                onClick={() => handleDelete(productToDelete)}
                className="px-2 py-1 rounded-sm font-semibold border border-red-500 text-red-500 cursor-pointer"
              >
                {t("Delete")}
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddToCartComponent;
