"use client";
import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import SimpleButton from "@/components/SimpleButton";

const logo = "SNEAKER";
const theme = "light";

const NavBar = () => {
  const t = useTranslations("NavBar");
  const [size, setSize] = useState(20);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setSize(12); // mobile
      else if (width < 768) setSize(16); // sm
      else if (width < 1024) setSize(20); // md
      else setSize(24); // lg+
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="md:px-4 z-50 fixed left-0 right-0 top-0 bg-varWhite/40 py-4 lg:px-6 px-4 backdrop:blur-2xl flex items-center justify-between shadow-gray-200 shadow-md">
      <div className="flex-1 flex sm:justify-center justify-between lg:gap-10 md:gap-4 sm:gap-8 gap-6 items-center">
        {/* left side Links | Desktop */}
        <div className="flex-1 sm:flex lg:gap-10 md:gap-4 sm:gap-8 gap-6 justify-end hidden">
          <div className="lg:text-xl text-[16px]">
            <Link href="/home">{t("home")}</Link>
          </div>
          <div className="lg:text-xl text-[16px]">
            <Link href="/shop">{t("shop")}</Link>
          </div>
        </div>

        {/* Logo | Desktop */}
        <div className="lg:text-3xl md:text-2xl text-2xl font-bold">{logo}</div>

        <div className="flex-1 flex lg:gap-10 md:gap-4 sm:gap-8 gap-6 justify-end sm:justify-between items-center">
          {/* right side Links | Desktop*/}
          <div className="sm:flex hidden lg:gap-10 md:gap-4 sm:gap-8 gap-6">
            <div className="lg:text-xl text-[16px]">
              <Link href="/contact">{t("contact")}</Link>
            </div>
            <div className="lg:text-xl text-[16px]">
              <Link href="/signup">{t("signup")}</Link>
            </div>
          </div>

          {/* icons | Desktop */}
          <div className="md:flex gap-1.5 bg-varWhite rounded-full px-1 py-1 hidden">
            <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
              <Search size={size} color="var(--color-varBlack)" />
            </div>
            <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
              <ShoppingCart size={size} color="var(--color-varBlack)" />
            </div>
            <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
              <Globe size={size} color="var(--color-varBlack)" />
            </div>
            <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
              {theme === "light" ? (
                <Moon size={size} color="var(--color-varBlack)" />
              ) : (
                <Sun size={size} color="var(--color-varBlack)" />
              )}
            </div>
          </div>

          {/* just for mobile and Tablet */}
          <div className="text-md sm:hidden">
            <Link href={"/signup"}>{t("signup")}</Link>
          </div>
          <SimpleButton
            onClick={() => setOpen((prev) => !prev)}
            className="md:hidden flex justify-center items-center"
          >
            <Menu size={30} color="var(--color-varBlack)" />
          </SimpleButton>
        </div>
      </div>

      {/* Menu */}
      {open && (
        <div className="absolute px-10 pt-10 left-0 top-0 right-0 h-screen bg-varWhite justify-between shadow-gray-200 shadow-md">
          <div className="flex justify-between">
            <div className="text-2xl font-bold">{logo}</div>

            <SimpleButton
              onClick={() => setOpen(false)}
              className="flex justify-center items-center"
            >
              <X size={30} color="var(--color-varBlack)" />
            </SimpleButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
