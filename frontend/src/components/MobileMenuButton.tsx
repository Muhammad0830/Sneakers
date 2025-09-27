"use client";
import { Pencil, Plus, X } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const MobileMenuButton = ({
  setMobileMenuOpen,
  mobileMenuOpen,
  setIsEditing,
  isEditing,
  handleSubmit,
  selected,
  setSelected,
}: {
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mobileMenuOpen: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  handleSubmit: () => void;
  selected: string;
  setSelected: (selected: string) => void;
}) => {
  const t = useTranslations("Profile");
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="sm:hidden cursor-pointer flex p-1 rounded-sm bg-white dark:bg-black border border-black/40 dark:border-white/40"
      >
        <Plus className="w-4 h-4" />
      </button>

      {isEditing ? (
        <button
          onClick={() => {
            setIsEditing(false);
            handleSubmit();
          }}
          className="sm:hidden flex absolute right-0 top-[150%] px-1.5 py-0.5 rounded-sm bg-primary text-white"
        >
          {t("Save")}
        </button>
      ) : null}

      <motion.div
        initial={{ x: "110%" }}
        animate={{
          x: mobileMenuOpen ? "0" : "110%",
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className="fixed inset-0 bg-white/10 dark:bg-black/70 backdrop-blur-lg z-[1000] p-4 flex flex-col justify-center items-center"
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute right-5 top-5 aspect-square p-1 cursor-pointer rounded-md border-black/40 dark:border-white/40 border bg-red-500 text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-2 items-center">
          <div>
            <button
              onClick={() => {
                setIsEditing(true);
                setMobileMenuOpen(false);
              }}
              className="flex px-2 py-0.5 rounded-sm border-1 border-primary bg-white dark:bg-black text-primary gap-2 items-center font-semibold hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
            >
              <span>{t("Edit Name")}</span>
              <Pencil className="w-4 aspect-square" />
            </button>
          </div>

          <div className="bg-white dark:bg-black relative mt-6 border-primary border rounded-sm flex overflow-hidden p-2 flex-col gap-1 items-center">
            <button
              onClick={() => {
                setSelected("favourites");
                router.push("/profile?mode=favourites");
              }}
              className={cn(
                "px-3 py-1 w-full cursor-pointer font-semibold sm:text-xl text-[16px] transition-all sm:duration-200 duration-150 rounded-sm",
                selected === "favourites" ? "bg-primary" : ""
              )}
            >
              {t("Favourites")}
            </button>
            <button
              onClick={() => {
                setSelected("myComments");
                router.push("/profile?mode=myComments");
              }}
              className={cn(
                "px-3 py-1 w-full cursor-pointer font-semibold sm:text-xl text-[16px] transition-all sm:duration-200 duration-150 rounded-sm",
                selected === "myComments" ? "bg-primary" : ""
              )}
            >
              {t("My Comments")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileMenuButton;
