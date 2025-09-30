"use client";
import MobileMenuButton from "@/components/MobileMenuButton";
import ProductCard from "@/components/ProductCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { MyComments, Product, User } from "@/types/types";
import { Camera, Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// eslint-disable-next-line
function timeAgo(date: Date, t: (key: string, values?: any) => string): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes <= 1) {
    return t("justNow");
  } else if (diffMinutes < 60) {
    return t("minutesAgo", { count: diffMinutes });
  } else if (diffHours < 24) {
    return t("hoursAgo", { count: diffHours });
  } else {
    return t("daysAgo", { count: diffDays });
  }
}

const Profile = () => {
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [myComments, setMyComments] = useState<MyComments[]>([]);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<MyComments | null>(
    null
  );
  const [name, setName] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("Profile");
  const toastT = useTranslations("Toast");
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [selected, setSelected] = useState("favourites");
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  useEffect(() => {
    if (mode) setSelected(mode);
  }, [mode]);

  const { mutate: updateUser } = useApiMutation<User, { name: string }>(
    "/user/update",
    "put"
  );
  const { mutate: DeleteFavourite } = useApiMutation<
    { message: string },
    { id: number }
  >(({ id }) => `/user/favourite/${id}`, "delete");

  const { mutate: DeleteMyComment } = useApiMutation<
    { message: string },
    { id: number }
  >(({ id }) => `/sneakers/product/comment/${id}`, "delete");

  const { mutate: EditMyComment } = useApiMutation<
    { message: string },
    { id: number; comment: string }
  >(({ id }) => `/user/comment/${id}`, "put");

  const {
    data: user,
    isLoading,
    refetch,
  } = useApiQuery<User>("/user/me", { key: ["User"] });

  const { data: favouritesData, isLoading: favouritesLoading } = useApiQuery<{
    data: Product[];
  }>("/user/favourites", { key: ["Sneakers"] });

  const {
    data: myCommentsData,
    isLoading: myCommentsLoading,
    refetch: refetchMyComments,
  } = useApiQuery<MyComments[]>("/user/myComments", { key: ["MyComments"] });

  useEffect(() => {
    if (user) setName(user.user.name);
  }, [user]);

  useEffect(() => {
    if (favouritesData) setFavourites(favouritesData.data);
    if (myCommentsData) setMyComments(myCommentsData);
  }, [favouritesData, myCommentsData]);

  if (isLoading || favouritesLoading || myCommentsLoading)
    return <div>Loading...</div>;

  if (!user) return router.push("/auth?mode=signin");

  const ProfileText = user.user.name
    .split(" ")
    .map((l) => l[0])
    .filter((l, index) => index < 3 && l !== " ")
    .join("");

  const handleSubmit = () => {
    if (name !== user.user.name) {
      updateUser(
        { name },
        {
          onSuccess: (data: User) => {
            setName(data.user.name);
            refetch();
            showToast(
              "success",
              toastT("Success"),
              toastT("Your profile has been updated")
            );
          },
        }
      );
    } else {
      showToast(
        "success",
        toastT("Success"),
        toastT("Your profile has been updated")
      );
    }
  };

  const handleDelete = (id: number) => {
    DeleteFavourite(
      { id: id },
      {
        onSuccess: () => {
          showToast("success", toastT("Deleted Successfully"));
          refetch();
          setFavourites((prev) => prev.filter((f) => f.id !== id));
        },
        onError: (data) => {
          showToast("error", toastT("Error"), toastT("Internal server error"));
          console.error("favourite error", data.message);
        },
      }
    );
  };

  const handleDeleteComment = (commentId?: number) => {
    if (user?.user?.id && commentId) {
      DeleteMyComment(
        { id: commentId },
        {
          onSuccess: () => {
            showToast("success", toastT("Deleted Successfully"));
            refetch();
            setMyComments((prev) => prev.filter((c) => c.id !== commentId));
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
    }
  };

  const handleEditComment = (commentId?: number) => {
    if (user?.user?.id && commentId) {
      EditMyComment(
        { id: commentId, comment: commentValue },
        {
          onSuccess: () => {
            showToast("success", toastT("Edited Successfully"));
            refetch();
            refetchMyComments();
            setIsEditingComment(false);
            setCommentDialogOpen(false);
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
    }
  };

  return (
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] mb-20 min-h-[calc(100svh-152px)]">
      <div className="pt-4">
        PathName:{" "}
        <Link className="text-white bg-primary rounded-sm px-1" href={"/home"}>
          {t("Home")}
        </Link>
        /{" "}
        <Link
          className="text-white bg-primary rounded-sm px-1 shadow-[0px_0px_5px_2px_var(--primary)]"
          href={"/profile"}
        >
          {t("Profile")}
        </Link>
      </div>

      <div className="flex flex-row justify-between gap-4 mt-5">
        <div className="flex items-center sm:gap-4 gap-2">
          <button className="relative group sm:w-20 w-10 aspect-square cursor-default flex justify-center items-center rounded-full border border-primary bg-gradient-to-br via-primary from-white/10 to-white/10">
            <span className="sm:text-4xl text-[16px] font-bold text-white">
              {ProfileText}
            </span>
            <div className="absolute opacity-0 group-hover:opacity-100 inset-0 rounded-full group-hover:bg-black/50 backdrop-blur-xs cursor-pointer flex items-center justify-center transition-all duration-300">
              <Camera className="sm:w-[40px] sm:h-[40px] w-[25px] h-[25px] text-white" />
            </div>
          </button>
          <div className="flex flex-col items-start justify-center">
            <div
              className={cn(
                "lg:text-2xl sm:text-xl border border-transparent text-sm font-bold text-black dark:text-white",
                isEditing ? "hidden" : "block"
              )}
            >
              {user.user.name}
            </div>
            <input
              className={cn(
                "lg:text-2xl sm:text-xl text-sm font-bold bg-primary/30 sm:px-2 pl-1 sm:-translate-x-2 -translate-x-1 rounded border border-primary text-black dark:text-white",
                isEditing ? "block" : "hidden"
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="lg:text-[16px] text-xs text-black dark:text-white">
              {user.user.email}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-end">
          <button
            onClick={() => {
              if (isEditing) {
                handleSubmit();
              }
              setIsEditing(!isEditing);
            }}
            className="sm:flex hidden px-2 py-0.5 rounded-sm border-1 border-primary bg-white dark:bg-black text-primary gap-2 items-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
          >
            {isEditing ? (
              t("Save")
            ) : (
              <>
                <span>{t("Edit Name")}</span>
                <Pencil className="w-5 aspect-square" />
              </>
            )}
          </button>
          <Link
            href={"/cart"}
            className="sm:flex hidden px-2 py-0.5 rounded-sm border-1 border-primary bg-white dark:bg-black text-primary gap-2 items-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <span>{t("Go to the Cart")}</span>
            <ShoppingCart className="w-5 aspect-square" />
          </Link>

          <MobileMenuButton
            setIsEditing={setIsEditing}
            setMobileMenuOpen={setMobileMenuOpen}
            handleSubmit={handleSubmit}
            mobileMenuOpen={mobileMenuOpen}
            isEditing={isEditing}
            setSelected={setSelected}
            selected={selected}
          />
        </div>
      </div>

      <div className="w-full sm:flex hidden justify-start">
        <div className="relative mt-6 border-primary border rounded-sm flex overflow-hidden">
          <button
            onClick={() => {
              setSelected("favourites");
              router.push("/profile?mode=favourites");
            }}
            className={cn(
              "px-3 py-1 text-black dark:text-white cursor-pointer font-semibold sm:text-xl text-[16px] transition-all duration-200",
              selected === "favourites" ? "bg-primary text-white" : ""
            )}
          >
            {t("Favourites")}
          </button>
          <div className="h-full border border-primary"></div>
          <button
            onClick={() => {
              setSelected("myComments");
              router.push("/profile?mode=myComments");
            }}
            className={cn(
              "px-3 py-1 text-black dark:text-white cursor-pointer font-semibold sm:text-xl text-[16px] transition-all duration-200",
              selected === "myComments" ? "bg-primary text-white" : ""
            )}
          >
            {t("My Comments")}
          </button>
        </div>
      </div>

      {selected === "favourites" ? (
        <div className="mt-8">
          <div className="sm:text-2xl text-lg font-bold sm:mb-4 mb-2">
            {t("Favourites")}
          </div>
          {favourites?.length > 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-4 gap-2">
              {favourites?.map((f: Product, index: number) => {
                return (
                  <div className="relative" key={index}>
                    <ProductCard noAnimatedButtons={true} product={f} />

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className={cn(
                            "absolute top-2 right-2 z-30 cursor-pointer scale-90 hover:scale-100 transition-scale duration-200 bg-red-500 rounded-full sm:p-1.5 p-1",
                            f.discount_type
                              ? "sm:right-10 right-2 max-sm:top-12"
                              : ""
                          )}
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </DialogTrigger>
                      <DialogContent
                        aria-describedby="are you sure to delete"
                        className="p-4"
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
                              onClick={() => handleDelete(f.id)}
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
              })}
            </div>
          ) : (
            <div className="min-h-[150px] w-full flex justify-center items-center border border-primary rounded-md">
              <div className="text-center text-xl font-bold">
                {t("No Favourites Yet")}
              </div>
            </div>
          )}
        </div>
      ) : selected === "myComments" ? (
        <div className="mt-8">
          <div className="sm:text-2xl text-lg font-bold sm:mb-4 mb-2">
            {t("My Comments")}
          </div>
          <div className="flex flex-col gap-2">
            {myComments?.length > 0 ? (
              myComments.map((comment: MyComments, index: number) => {
                const createdAt = new Date(comment.created_at);

                return (
                  <div
                    className="relative bg-white dark:bg-black border border-primary rounded-sm p-2 flex sm:flex-row flex-col gap-2"
                    key={index}
                  >
                    <div className="w-full flex gap-2 items-center justify-between">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Link
                          href={`/shop/${comment.product.id}`}
                          className="sm:text-lg text-sm md:hidden flex font-semibold leading-none text-nowrap"
                        >
                          {comment.product.title}
                        </Link>
                        <Link
                          href={`/shop/${comment.product.id}`}
                          className="relative md:w-20 md:h-20 w-15 h-15 border border-primary rounded-sm cursor-pointer"
                        >
                          <Image
                            src={"/sneakers.png"}
                            alt="sneakers"
                            fill
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>

                      <div className="md:flex lg:px-4 px-2 hidden flex-col gap-1 justify-center self-stretch">
                        <Link
                          href={`/shop/${comment.product.id}`}
                          className="text-2xl font-semibold"
                        >
                          {comment.product.title}
                        </Link>
                      </div>

                      <button
                        onClick={() => {
                          setCommentDialogOpen(true);
                          setSelectedComment(comment);
                        }}
                        className="flex-1 sm:min-h-[84px] overflow-hidden border border-primary rounded-sm sm:p-[5px] p-1.5 self-stretch cursor-pointer flex text-start"
                      >
                        <span className="sm:line-clamp-3 line-clamp-3 sm:text-[16px] text-sm overflow-hidden">
                          {comment.comment}
                        </span>
                      </button>

                      <div className="self-strech sm:flex hidden flex-col gap-2 md:min-w-[130px] min-w-[100px] items-center self-stretch">
                        <div className="md:text-lg text-sm font-semibold">
                          {t("Created at")}
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1 md:text-[16px] text-sm">
                          <span>{createdAt.toLocaleDateString()}</span>
                          <span>
                            {String(createdAt.getHours()).padStart(2, "0")}:
                            {String(createdAt.getMinutes()).padStart(2, "0")}
                          </span>
                        </div>
                      </div>

                      <div className="sm:flex hidden self-stretch items-center">
                        <div className="h-[85%] border border-primary border-r-0"></div>
                      </div>

                      <div className="sm:flex hidden flex-col gap-1 items-center md:min-w-[100px] min-w-[70px] self-stretch">
                        <div className="md:text-lg text-sm font-semibold">
                          {t("Actions")}
                        </div>
                        <div className="flex-1 flex justify-center items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="cursor-pointer p-1 bg-red-500 rounded-sm border text-white">
                                <Trash2 className="w-5 h-5 text-white" />
                              </button>
                            </DialogTrigger>
                            <DialogContent
                              aria-describedby="are you sure to delete"
                              className="p-4"
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
                                    onClick={() => {
                                      handleDeleteComment(comment.id);
                                    }}
                                    className="px-2 py-1 rounded-sm font-semibold border border-red-500 text-red-500 cursor-pointer"
                                  >
                                    {t("Delete")}
                                  </button>
                                </DialogClose>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <button
                            onClick={() => {
                              setCommentDialogOpen(true);
                              setSelectedComment(comment);
                              setCommentValue(comment.comment);
                              setIsEditingComment(true);
                            }}
                            className="cursor-pointer p-1 bg-white dark:bg-black rounded-sm border border-black/40 dark:border-white/40"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="sm:hidden flex justify-between items-center self-stretch">
                      <div className="text-sm">{timeAgo(createdAt, t)}</div>
                      <div className="flex items-center gap-1 justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="cursor-pointer p-1 bg-red-500 rounded-sm border text-white">
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </DialogTrigger>
                          <DialogContent
                            aria-describedby="are you sure to delete"
                            className="p-4"
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
                                  onClick={() => {
                                    handleDeleteComment(comment.id);
                                  }}
                                  className="px-2 py-1 rounded-sm font-semibold border border-red-500 text-red-500 cursor-pointer"
                                >
                                  {t("Delete")}
                                </button>
                              </DialogClose>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <button
                          onClick={() => {
                            setCommentDialogOpen(true);
                            setSelectedComment(comment);
                            setCommentValue(comment.comment);
                            setIsEditingComment(true);
                          }}
                          className="cursor-pointer p-1 bg-white dark:bg-black rounded-sm border border-black/40 dark:border-white/40"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full bg-white dark:bg-black min-h-[150px] flex justify-center items-center rounded-md border border-primary">
                <span>{t("No Comments yet")}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <Dialog
        open={commentDialogOpen}
        onOpenChange={(e) => {
          setCommentDialogOpen(e);
          setIsEditingComment(false);
          setSelectedComment(null);
          setCommentValue("");
        }}
      >
        <DialogContent
          aria-describedby="My Comment"
          className="!w-[80vw] !max-w-[800px] p-4"
        >
          <DialogTitle className="sm:text-2xl text-xl flex gap-2">
            <span className="max-[400px]:hidden">{t("My Comments")}:</span>
            <span>{selectedComment?.product.title}</span>
          </DialogTitle>

          {isEditingComment ? (
            <textarea
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
              className="border border-primary rounded-md p-2"
            ></textarea>
          ) : (
            <div className="border border-primary rounded-md p-2">
              {selectedComment?.comment}
            </div>
          )}

          <div className="w-full flex justify-between gap-2">
            <button
              onClick={() => setCommentDialogOpen(false)}
              className="px-2 py-1 rounded-sm cursor-pointer text-primary border border-primary"
            >
              {t("Close")}
            </button>
            <div className="flex items-center gap-2">
              {isEditingComment ? (
                <button
                  onClick={() => {
                    setIsEditingComment(false);
                    setCommentValue("");
                  }}
                  className="px-2 py-1 flex gap-2 items-center rounded-sm text-red-500 border border-red-500 cursor-pointer"
                >
                  <span>{t("Cancel")}</span>
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="px-2 py-1 flex gap-2 items-center border border-red-500 rounded-sm bg-red-500 text-white cursor-pointer">
                      <span>{t("Delete")}</span>
                      <Trash2 className="max-[340px]:hidden w-5 h-5 text-white" />
                    </button>
                  </DialogTrigger>
                  <DialogContent
                    aria-describedby="are you sure to delete"
                    className="p-4"
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
                          onClick={() => {
                            handleDeleteComment(selectedComment?.id);
                            setCommentDialogOpen(false);
                          }}
                          className="px-2 py-1 rounded-sm font-semibold border border-red-500 text-red-500 cursor-pointer"
                        >
                          {t("Delete")}
                        </button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <button
                onClick={() => {
                  if (isEditingComment) {
                    handleEditComment(selectedComment?.id);
                  } else {
                    setCommentValue(selectedComment?.comment || "");
                    setIsEditingComment(true);
                  }
                }}
                className={cn(
                  "px-2 py-1 flex gap-2 items-center border border-primary rounded-sm cursor-pointer",
                  isEditingComment
                    ? "bg-primary text-white"
                    : "text-primary bg-transparent"
                )}
              >
                <span>{t("Edit")}</span>
                <Pencil className="max-[340px]:hidden w-5 h-5" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
