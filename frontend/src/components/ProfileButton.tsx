"use client";
import { useAuth } from "@/context/AuthContext";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/types/types";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

const ProfileButton = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);

  const dropDownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const router = useRouter();
  const t = useTranslations("NavBar");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mouseup", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [open]);

  const profileText = user?.user.name
    .split(" ")
    .map((n: string, index: number) => (index < 2 ? n[0] : null)) // get first letters of first two words
    .filter(Boolean) // remove null values
    .join("");

  const handleLogout = async () => {
    await logout();
    router.push("/auth?mode=login");
  };

  return (
    <div className="relative" ref={dropDownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="aspect-square h-9 rounded-full flex items-center justify-center cursor-pointer bg-primary"
      >
        <span
          className={cn(
            "text-white font-bold",
            profileText?.length === 1 ? "text-[16px]" : "text-[14px]"
          )}
        >
          {profileText}
        </span>
      </button>

      <div
        className={cn(
          "absolute right-0 lg:w-[20vw] w-[200px] p-2 rounded-sm border border-primary bg-white dark:bg-black transition-all duration-300 origin-top-right",
          open
            ? "scale-[1] opacity-100 top-[115%]"
            : "scale-[0] opacity-0 top-[90%]"
        )}
      >
        <Link
          href={"/profile"}
          onClick={() => setOpen(false)}
          className="flex gap-2 items-center justify-between p-1 cursor-pointer rounded border border-primary/50 bg-primary/10 hover:bg-primary/20 w-full"
        >
          <div className="aspect-square h-9 rounded-full flex items-center justify-center cursor-pointer bg-primary">
            <span
              className={cn(
                "text-white font-bold",
                profileText?.length === 1 ? "text-[16px]" : "text-[14px]"
              )}
            >
              {profileText}
            </span>
          </div>
          <div className="flex flex-col items-start flex-1 w-[calc(100%-44px)]">
            <span className="text-start lg:text-[16px] text-sm font-semibold w-full truncate">
              {user.user.name}
            </span>
            <span className="text-start lg:text-sm text-xs font-normal inline-block w-full truncate line-clamp-1">
              {user.user.email}
            </span>
          </div>
        </Link>

        <div className="mt-1 rounded-sm flex flex-col gap-1 justify-start items-start">
          <button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="group cursor-pointer text-start w-full px-2 py-0.5 rounded border border-primary/10 bg-[#ff0000]/70 text-white hover:bg-[#ff0000]"
          >
            <span className="inline-block group-hover:translate-x-1.5 transition-translate duration-100">
              {t("Logout")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileButton;
