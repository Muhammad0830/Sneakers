"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { Heart, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  InCartProducts,
  ProductIdClientMutateProps,
  ResponseProps,
} from "@/types/types";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useCustomToast } from "@/context/CustomToastContext";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddToCartComponent from "@/components/AddToCartComponent";
import { calcPrice } from "@/lib/utils";

const CartClient = () => {
  const [onCartProducts, setOnCartProducts] = useState<InCartProducts[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [isInView, setIsInView] = useState(false);
  const [isInViewMobile, setIsInViewMobile] = useState(false);

  const { showToast } = useCustomToast();
  const toastT = useTranslations("Toast");
  const t = useTranslations("cart");
  const ref = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const {
    data: data,
    isLoading: onCartProductsLoading,
    refetch,
  } = useApiQuery<InCartProducts[]>("/sneakers/products/cart", {
    key: ["onCartProducts"],
  });

  const { mutate: removeFromCart } = useApiMutation<
    { message: string },
    { id: number }
  >(({ id }) => `/user/onCartProduct/${id}`, "delete");

  const { mutate: likeProduct } = useApiMutation<
    { message: string },
    { id: number }
  >("/sneakers/product/likeUnlike", "post");

  const { mutate: addToCart } = useApiMutation<
    ResponseProps,
    ProductIdClientMutateProps
  >("/sneakers/product/addToCart", "post");

  useLayoutEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === ref.current) {
          setIsInViewMobile(entry.isIntersecting);
        }
        if (entry.target === desktopRef.current) {
          setIsInView(entry.isIntersecting);
        }
      });
    });

    if (ref.current) observer.observe(ref.current);
    if (desktopRef.current) observer.observe(desktopRef.current);

    return () => observer.disconnect();
  }, [onCartProducts]);

  useEffect(() => {
    if (data) return setOnCartProducts(data);
  }, [data]);

  const handleOrder = () => {
    console.log("handleOrder");
  };

  const handleDelete = (id: number) => {
    removeFromCart(
      { id },
      {
        onSuccess: () => {
          showToast(
            "success",
            toastT("Success"),
            toastT("Deleted Successfully")
          );
          refetch();
          setOnCartProducts((prev) => prev.filter((p) => p.id !== id));
        },
        onError: (data) => {
          showToast("error", toastT("Error"), toastT("Internal server error"));
          console.error("cart error", data.message);
        },
      }
    );
  };

  const handleLikeAction = (id: number) => {
    likeProduct(
      { id },
      {
        onSuccess: (data) => {
          refetch();
          setOnCartProducts((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    product: { ...p.product, is_liked: !p.product.is_liked },
                  }
                : p
            )
          );
          showToast(
            "success",
            toastT(
              data.message === "liked"
                ? "Liked successfully"
                : "Unliked successfully"
            )
          );
        },
        onError: (data) => {
          showToast("error", toastT("Error"), toastT("Internal server error"));
          console.error("liking error", data.message);
        },
      }
    );
  };

  const handleAddToCart = (
    productId: number,
    newQuantity: number,
    size: string,
    color: string
  ) => {
    addToCart(
      {
        id: productId,
        quantity: newQuantity,
        size: size,
        color: color,
      },
      {
        onError: (data) => {
          showToast("error", toastT("Error"), toastT("Internal server error"));
          console.error("adding to cart error", data.message);
        },
      }
    );
  };

  const checkAllProductsSelected = () => {
    if (onCartProducts?.length > 0) {
      const allSelected = onCartProducts.map((p) =>
        selected.includes(p.id) ? true : false
      );
      const isAllSelected = allSelected.includes(false);
      return !isAllSelected;
    }
  };

  const selectedProducts = onCartProducts
    .filter((p) => selected.includes(p.id))
    .map((p) => ({
      quantity: p.quantity,
      price: calcPrice(
        Number(p.product.price),
        Number(p.product.discount_value),
        p.product.discount_type
      ),
    }));
  const totalNumberProducts = selectedProducts.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const totalPrice = selectedProducts
    .reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    .toFixed(2);

  if (onCartProductsLoading) return <div>Loading...</div>;

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
          href={"/cart"}
        >
          {t("Cart")}
        </Link>
      </div>

      {/* cart container */}
      <div className="flex gap-2 mt-5 items-start">
        <div className="flex-1">
          <div className="border border-primary rounded-t-md border-b-0 pt-2 px-4 pb-3 flex items-center gap-2 justify-between">
            <div className="flex h-5 gap-2 items-center">
              <Label
                htmlFor="allProducts"
                className="cursor-pointer text-[16px] sm:text-sm flex items-center gap-2"
              >
                <Checkbox
                  checked={checkAllProductsSelected()}
                  onCheckedChange={(value) => {
                    if (value) setSelected(onCartProducts.map((p) => p.id));
                    else setSelected([]);
                  }}
                  id="allProducts"
                  className="rounded cursor-pointer"
                />
                <span>{t("All products")}</span>
              </Label>
            </div>
            <div className="sm:block hidden">
              {t("You have currently products", {
                count: onCartProducts?.length,
              })}
            </div>
            <div className="sm:hidden block text-sm">
              {t("Products Number", { count: onCartProducts?.length })}
            </div>
          </div>

          <div className="border border-primary rounded-md p-2 -translate-y-1">
            {onCartProducts?.map((cart, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center lg:gap-2 gap-1 justify-between sm:py-2 py-1 px-2 relative">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center lg:gap-4 sm:gap-2 gap-1">
                        <Label
                          htmlFor={`${cart.id}`}
                          className="cursor-pointer self-stretch flex items-center gap-4"
                        >
                          <Checkbox
                            checked={selected.includes(cart.id)}
                            onCheckedChange={(value) => {
                              if (value)
                                setSelected((prev) => [...prev, cart.id]);
                              else
                                setSelected((prev) =>
                                  prev.filter((id) => id !== cart.id)
                                );
                            }}
                            id={`${cart.id}`}
                            className="rounded cursor-pointer"
                          />
                        </Label>

                        <Link
                          href={`/shop/${cart.product.id}`}
                          className="flex items-center justify-center flex-col gap-3"
                        >
                          <div className="sm:hidden flex text-[16px] font-bold">
                            {cart.product.title}
                          </div>
                          <div className="sm:w-[100px] md:w-[80px] lg:w-[120px] w-[60px] aspect-square flex justify-center items-center border border-primary rounded-md overflow-hidden relative">
                            <Image
                              src={"/sneakers.png"}
                              alt="product"
                              fill
                              className="object-cover w-full h-full"
                            />
                            {cart.product.discount_type ? (
                              <>
                                <div className="position absolute lg:text-sm/5 text-xs/5 font-semibold top-0 right-0 pl-1 pr-1 py-0.5 rounded-tr-md rounded-bl-lg bg-yellow-500 text-black">
                                  <span>{t("Sale")}</span>
                                </div>
                                <div className="position absolute lg:text-sm/5 text-xs/5 font-semibold bottom-0 right-0 pl-1 pr-1 py-0.5 rounded-tl-lg rounded-br-md bg-yellow-500 text-black">
                                  <span>
                                    {Number(
                                      cart.product.discount_value
                                    ).toFixed(0)}
                                    {cart.product.discount_type === "percentage"
                                      ? "%"
                                      : "$"}
                                  </span>
                                </div>
                              </>
                            ) : null}
                          </div>
                          <div className="sm:hidden flex flex-col items-center gap-1">
                            <div className="flex gap-1">
                              <div className="px-1 text-[12px] rounded bg-primary text-white">
                                {cart.size}
                              </div>
                              <div className="px-1 text-[12px] rounded bg-primary text-white">
                                {t(cart.color)}
                              </div>
                            </div>
                            <div className="px-1 text-[12px] rounded bg-primary text-white">
                              {t(
                                cart.product.gender ? cart.product.gender : ""
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>

                      <div className="md:min-w-[170px] sm:flex hidden flex-col gap-1 justify-between self-stretch">
                        <Link
                          href={`/shop/${cart.product.id}`}
                          className="lg:text-2xl sm:text-xl text-lg font-bold"
                        >
                          {cart.product.title}
                        </Link>
                        <div className="flex flex-col gap-1 items-start text-[16px]">
                          <Link
                            href={`/shop/${cart.product.id}`}
                            className="flex lg:flex-row flex-col lg:items-center lg:gap-2 gap-1"
                          >
                            <div>
                              {t("Size")}: {cart.size}
                            </div>
                            <div>
                              {t("For")}:{" "}
                              {t(
                                cart.product.gender ? cart.product.gender : ""
                              )}
                            </div>
                          </Link>
                          <Link
                            href={`/shop/${cart.product.id}`}
                            className="flex items-center gap-1"
                          >
                            {t("Color")}: {t(cart.color)}
                            <div
                              style={{ backgroundColor: cart.color }}
                              className="w-4 aspect-square rounded border border-black/30"
                            ></div>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="max-sm:flex-auto md:flex-auto flex items-center sm:gap-8 md:gap-3 gap-2 justify-between">
                      <div className="flex md:flex sm:hidden"></div>

                      <AddToCartComponent
                        cart={cart}
                        handleDelete={handleDelete}
                        handleAddToCart={handleAddToCart}
                        setOnCartProducts={setOnCartProducts}
                        t={t}
                      />

                      <div className="lg:text-3xl sm:text-2xl text-2xl font-bold text-end flex flex-col items-center">
                        <div className="text-end flex flex-col">
                          {cart.product.discount_type ? (
                            <span className="text-sm/4 md:text-[16px]/4 text-gray-500">
                              {cart.product.price}$
                            </span>
                          ) : null}
                          <span>
                            {calcPrice(
                              Number(cart.product.price),
                              Number(cart.product.discount_value),
                              cart.product.discount_type
                            )}
                            $
                          </span>
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="absolute top-0 right-0 text-red-500 p-1 cursor-pointer">
                          <Trash2 className="lg:w-5 lg:h-5 w-4 h-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        aria-describedby="are you sure to delete"
                        className="!max-w-[500px] !w-[80vw] p-4"
                      >
                        <DialogTitle className="sm:text-xl text-lg">
                          {t("Are you sure to delete?")}
                        </DialogTitle>
                        <div className="w-full justify-between gap-2 flex items-center">
                          <DialogClose asChild>
                            <button className="px-2 py-1 rounded-sm font-semibold border border-primary text-white bg-primary cursor-pointer">
                              {t("Cancel")}
                            </button>
                          </DialogClose>
                          <DialogClose asChild>
                            <button
                              onClick={() => handleDelete(cart.id)}
                              className="px-2 py-1 rounded-sm font-semibold border border-red-500 text-red-500 cursor-pointer"
                            >
                              {t("Delete")}
                            </button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <motion.button
                      initial={{ scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{
                        duration: 0.15,
                        ease: "easeInOut",
                        type: "spring",
                      }}
                      onClick={() => handleLikeAction(cart.product.id)}
                      className="absolute bottom-0 right-0 p-1 cursor-pointer"
                    >
                      <Heart
                        className="lg:w-5 lg:h-5 w-4 h-4 text-primary"
                        fill={cart.product.is_liked ? "#24f89c" : "transparent"}
                      />
                    </motion.button>
                  </div>
                  {index !== onCartProducts.length - 1 ? (
                    <div className="w-full border border-t-0 border-primary my-2"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={desktopRef}
          className="lg:w-[300px] md:w-[200px] md:block hidden border border-primary rounded-md p-2"
        >
          <div className="text-xl font-bold">{t("Your order")}</div>
          <div className="flex items-center justify-between gap-2">
            <div>{t("Products")}</div>
            <div className="font-bold">{totalNumberProducts}</div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>{t("Total")}</div>
            <div className="text-2xl font-bold">{totalPrice}$</div>
          </div>
          <button className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-2 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow">
            {t("To order")}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: "150%" }}
          animate={
            isInView ? { opacity: 0, x: "150%" } : { opacity: 1, x: "0%" }
          }
          transition={{ duration: 0.5, ease: "backInOut", type: "spring" }}
          className="fixed lg:right-[60px] md:right-[40px] lg:w-[300px] md:w-[200px] md:block hidden border border-primary rounded-md p-2"
        >
          <div className="text-xl font-bold">{t("Your order")}</div>
          <div className="flex items-center justify-between gap-2">
            <div>{t("Products")}</div>
            <div className="font-bold">{totalNumberProducts}</div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div>{t("Total")}</div>
            <div className="text-2xl font-bold">{totalPrice}$</div>
          </div>
          <button className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-2 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow">
            {t("To order")}
          </button>
        </motion.div>
      </div>

      <div
        ref={ref}
        className="flex justify-end transition-all duration-300 z-[100000] relative"
      >
        <div className="lg:w-[300px] md:w-[200px] md:hidden flex sm:flex-row flex-col sm:gap-4 gap-1 border border-primary rounded-md p-2">
          <div className="flex gap-2">
            <div className="flex items-center justify-between gap-2">
              <div>{t("Products")}</div>
              <div className="text-2xl font-bold">{totalNumberProducts}</div>
            </div>
            <div className="border border-primary border-l-0"></div>
            <div className="flex items-center justify-between gap-2">
              <div>{t("Total")}</div>
              <div className="text-2xl font-bold">{totalPrice}$</div>
            </div>
          </div>
          <button
            onClick={() => handleOrder()}
            className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-4 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow"
          >
            {t("To order")}
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: "150%" }}
        animate={
          isInViewMobile ? { opacity: 0, x: "150%" } : { opacity: 1, x: "0%" }
        }
        transition={{ duration: 0.5, ease: "backInOut", type: "spring" }}
        className="fixed bottom-5 right-5 lg:w-[300px] md:w-[200px] min-w-[150px] max-w-[200px] bg-white dark:bg-black md:hidden block border border-primary rounded-md p-2"
      >
        <div className="flex items-center justify-between gap-2">
          <div>{t("Products")}</div>
          <div className="text-2xl font-bold">{totalNumberProducts}</div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div>{t("Total")}</div>
          <div className="text-2xl font-bold">{totalPrice}$</div>
        </div>
        <button className="cursor-pointer rounded font-semibold w-full bg-primary text-white px-2 py-1 shadow-[0px_0px_0px_0px_var(--primary)] hover:shadow-[0px_0px_5px_2px_var(--primary)] transition-shadow">
          {t("To order")}
        </button>
      </motion.div>
    </div>
  );
};

export default CartClient;
