"use client";
import ProductCard from "@/components/ProductCard";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Product, User } from "@/types/types";
import { Camera, Pencil, ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const [favourites] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const t = useTranslations("Profile");
  const toastT = useTranslations("Toast");
  const router = useRouter();
  const { showToast } = useCustomToast();

  const { mutate: updateUser } = useApiMutation<User, { name: string }>(
    "/user/update",
    "put"
  );

  const {
    data: user,
    isLoading,
    refetch,
  } = useApiQuery<User>("/user/me", ["User"], true);

  useEffect(() => {
    if (user) setName(user.user.name);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

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

  return (
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] mb-20">
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

      <div className="flex flex-row justify-between gap-4 mt-5">
        <div className="flex items-center gap-4">
          <button className="relative group w-20 aspect-square cursor-default flex justify-center items-center rounded-full border border-primary bg-gradient-to-br via-primary from-white/10 to-white/10">
            <span className="text-4xl font-bold text-white">{ProfileText}</span>
            <div className="absolute opacity-0 group-hover:opacity-100 inset-0 rounded-full group-hover:bg-black/50 backdrop-blur-xs cursor-pointer flex items-center justify-center transition-all duration-300">
              <Camera className="w-[40px] h-[40px] text-white" />
            </div>
          </button>
          <div className="flex flex-col items-start justify-center">
            <div
              className={cn(
                "lg:text-2xl sm:text-xl border border-transparent text-lg font-bold text-black dark:text-white",
                isEditing ? "hidden" : "block"
              )}
            >
              {user.user.name}
            </div>
            <input
              className={cn(
                "lg:text-2xl sm:text-xl text-lg font-bold bg-primary/30 px-2 -translate-x-2 rounded border border-primary text-black dark:text-white",
                isEditing ? "block" : "hidden"
              )}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="lg:text-[16px] text-sm text-black dark:text-white">
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
            className="px-2 py-0.5 rounded-sm border-1 border-primary bg-white dark:bg-black text-primary flex gap-2 items-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
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
            className="px-2 py-0.5 rounded-sm border-1 border-primary bg-white dark:bg-black text-primary flex gap-2 items-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <span>{t("Go to the Cart")}</span>
            <ShoppingCart className="w-5 aspect-square" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <div className="text-2xl font-bold">{t("Favourites")}</div>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-4 gap-2">
          {favourites.map((f: Product, index: number) => {
            return <ProductCard key={index} product={f} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
