"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types/types";
import Image from "next/image";
import { Heart, MessageCircle, Star, StarIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCustomToast } from "@/context/CustomToastContext";
import { useAuth } from "@/context/AuthContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "./ui/dialog";
import { cn, calcPrice } from "@/lib/utils";

type ProductIdClientLikeProps = {
  id: number;
  userId: number;
};

type ProductIdClientCommentProps = {
  id: number;
  userId: number;
  comment: string;
};

type ResponseProps = {
  message: string;
};

const ProductCard = ({
  product,
  noAnimatedButtons,
  refetch,
}: {
  product: Product;
  noAnimatedButtons?: boolean;
  refetch?: () => void;
}) => {
  const colors = product.color;
  const sizes = product.size;
  const [liked, setLiked] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commented, setCommented] = useState(false);

  const { theme } = useTheme();
  const t = useTranslations("Shop");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  const { user } = useAuth();

  useEffect(() => {
    if (product.comments && product.comments.length > 0) setCommented(true);
    if (product.is_liked !== undefined) setLiked(product.is_liked);
  }, [product]);

  const warnAboutSignIn = () => {
    showToast(
      "info",
      toastT("To make this action"),
      toastT("Please sign in or sign up first")
    );
  };

  const { mutate: likeProduct } = useApiMutation<
    ResponseProps,
    ProductIdClientLikeProps
  >("/sneakers/product/like", "post");

  const { mutate: unlikeProduct } = useApiMutation<
    ResponseProps,
    ProductIdClientLikeProps
  >("/sneakers/product/unlike", "post");

  const { mutate: commentProduct } = useApiMutation<
    ResponseProps,
    ProductIdClientCommentProps
  >("/sneakers/product/comment", "post");

  const handleLikeAction = () => {
    if (user?.user?.id) {
      if (!liked) {
        likeProduct(
          { id: Number(product.id), userId: user.user.id },
          {
            onSuccess: () => {
              setLiked(true);
              showToast(
                "success",
                toastT("Success"),
                toastT("You liked this product")
              );
              if (refetch) refetch();
            },
            onError: (data) => {
              showToast(
                "error",
                toastT("Error"),
                toastT("Internal server error")
              );
              console.error("liking error", data.message);
            },
          }
        );
      } else {
        unlikeProduct(
          { id: Number(product.id), userId: user.user.id },
          {
            onSuccess: () => {
              setLiked(false);
              showToast(
                "success",
                toastT("Success"),
                toastT("You unliked this product")
              );
              if (refetch) refetch();
            },
            onError: (data) => {
              showToast(
                "error",
                toastT("Error"),
                toastT("Internal server error")
              );
              console.error("unliking error", data.message);
            },
          }
        );
      }
    } else warnAboutSignIn();
  };

  const handleComment = (commentValue: string) => {
    if (user?.user?.id) {
      commentProduct(
        { id: Number(product.id), userId: user.user.id, comment: commentValue },
        {
          onSuccess: () => {
            showToast(
              "success",
              toastT("Successfull"),
              toastT("Your comment is submitted")
            );
            setCommentValue("");
            setCommented(true);
            if (refetch) refetch();
          },
          onError: (data) => {
            showToast(
              "error",
              toastT("Error"),
              toastT("Internal server error")
            );
            console.error("comment error", data.message);
          },
        }
      );
    } else warnAboutSignIn();
  };

  const rating = Number(product.rating).toFixed(1);

  if (!product) {
    return null;
  }

  return (
    <div className="relative">
      <div className="productCard group relative flex justify-center gap-2">
        <Link
          href={`/shop/${product.id}`}
          className={`flex absolute cursor-pointer z-30 justify-center items-center sm:w-[170px] sm:h-[170px] w-[100px] h-[100px] productCardImage lg:group-hover:-translate-y-[70px]
       lg:group-hover:-rotate-[30deg] lg:group-hover:scale-60 transition-transform duration-300`}
        >
          <Image
            src={"/sneakers.png"}
            alt={product.title}
            fill
            className="object-cover"
          />
        </Link>
        {/* gender badge */}
        <Link href={`/shop/${product.id}`} className="absolute top-3 left-3">
          <div className="absolute cursor-pointer z-30 flex capitalize font-semibold text-sm bg-primary border-primary text-white px-1 rounded-sm">
            {product.gender}
          </div>
        </Link>

        {/* discount badge */}
        {product.discount_type ? (
          <Link
            href={`/shop/${product.id}`}
            className={cn(
              "absolute aspect-square sm:px-2.5 px-1.5 py-0.5 sm:pt-0.5 flex flex-col rounded-full sm:rounded-bl-none justify-center items-center cursor-pointer z-30 top-2 sm:top-0 right-2 sm:right-0 sm:-translate-y-[30%] sm:translate-x-[30%] bg-yellow-300 transition-all duration-300",
              noAnimatedButtons
                ? ""
                : "group-hover:translate-y-0 group-hover:translate-x-0 sm:group-hover:top-3 sm:group-hover:right-3 group-hover:rounded-bl-full"
            )}
          >
            <span className="sm:text-sm text-xs font-bold  text-[#383838]">
              {t("Sale")}
            </span>
            <span className="sm:text-xs text-[10px] font-bold  text-[#383838]">
              {Number(product.discount_value).toFixed(0)}
              {product.discount_type === "percentage" ? "%" : "$"}
            </span>
          </Link>
        ) : null}

        <Link
          href={`/shop/${product.id}`}
          className="w-full static flex items-center justify-center"
        >
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
                      {calcPrice(
                        Number(product.price),
                        Number(product.discount_value),
                        product.discount_type
                      )}
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
                        {calcPrice(
                          Number(product.price),
                          Number(product.discount_value),
                          product.discount_type
                        )}
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
        </Link>

        <div className="z-10 bg-background absolute left-0 right-0 bottom-0 top-0"></div>

        {noAnimatedButtons ? null : (
          <div className="absolute z-[1000] cardButtonsWrapper opacity-0 lg:flex hidden translate-y-[0%] top-0 py-1 left-0 right-0 bg-transparent transition-all duration-[350ms] items-center justify-between">
            <div className="flex items-center gap-2 ml-[2px]">
              <button
                onClick={() => handleLikeAction()}
                className="p-1 cursor-pointer rounded-2xl cardButtons bg-white text-black border-1 border-black/20 dark:border-transparent translate-y-[150%] transition-all duration-300"
              >
                <Heart
                  size={16}
                  color="black"
                  fill={liked ? "black" : "transparent"}
                />
              </button>
              <button
                onClick={() => setCommentDialogOpen(true)}
                className="p-1 cursor-pointer rounded-2xl bg-white text-black border-1 border-black/20 dark:border-transparent cardButtons translate-y-[150%] transition-all duration-300 delay-75"
              >
                <MessageCircle
                  size={16}
                  color="black"
                  fill={commented ? "black" : "transparent"}
                />
              </button>
            </div>

            <Link
              href={`/shop/${product.id}`}
              className="flex cursor-pointer items-center gap-1 bg-white text-black border-1 border-black/20 dark:border-transparent rounded-2xl px-2 py-0.5 mr-[2px] cardButtons translate-y-[150%] transition-all duration-300 delay-150"
            >
              <span className="text-sm">{t("Quick Look")}</span>
            </Link>
          </div>
        )}
      </div>

      <Dialog
        open={commentDialogOpen}
        onOpenChange={(open) => setCommentDialogOpen(open)}
      >
        <DialogContent
          aria-describedby="comment modal"
          aria-description="comment modal"
          className="!w-[80vw] !max-w-[600px] p-4 flex flex-col gap-2 items-start"
        >
          <DialogTitle className="text-xl flex gap-1">
            <span>{t("Comment section")}:</span>
            <span>{product.title}</span>
          </DialogTitle>
          <div className="w-full">
            <textarea
              name="comment"
              id="comment"
              className="w-full h-40 border border-primary/50 rounded-sm p-2 text-sm sm:text-[16px] "
              placeholder={t("type your comment here")}
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            ></textarea>
          </div>
          <div className={cn("w-full flex items-center gap-2 justify-end")}>
            <DialogClose asChild className="relative">
              <button
                disabled={commentValue.length <= 0}
                onClick={() => {
                  handleComment(commentValue);
                }}
                className={cn(
                  "px-2 py-0.5 rounded-sm bg-primary text-white font-semibold group",
                  commentValue.length <= 0
                    ? "bg-primary/50 text-white/50 cursor-default"
                    : "bg-primary cursor-pointer"
                )}
              >
                {t("Submit")}

                <div
                  className={cn(
                    "absolute left-0 top-[115%] px-2 py-1 min-w-[250px] group-hover:scale-[1] group-hover:opacity-100 opacity-0 scale-[0] text-foreground text-start text-[13px] rounded-sm bg-background border border-foreground/20 transition-opacity duration-200",
                    commentValue.length <= 0 ? "flex" : "hidden"
                  )}
                >
                  {t("please type your comment to submit")}
                </div>
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCard;
