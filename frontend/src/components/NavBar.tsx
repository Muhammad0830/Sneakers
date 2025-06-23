"use client";
import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LinkComponent from "./ui/Link";
import SimpleButton from "@/components/ui/SimpleButton";
import { usePathname } from "next/navigation";

const logo = "SNEAKER";
const theme = "light";

const data = {
  navLinks: [
    {
      name: "Home",
      href: "/home",
    },
    {
      name: "Shop",
      href: "/shop",
    },
    {
      name: "Contact",
      href: "/contact",
    },
    {
      name: "Sign Up",
      href: "/signup",
    },
  ],
};

const NavBar = () => {
  const t = useTranslations("NavBar");
  const [size, setSize] = useState(20);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [pathName, setPathName] = useState<string | null>(null);

  useEffect(() => {
    const newPathName = pathname.split("/")[2];
    setPathName(newPathName);
  }, [pathname]);

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
    <header className="md:px-4 z-50 fixed left-0 right-0 top-0 bg-varWhite/50 backdrop-blur-xs py-4 lg:px-6 px-4 flex items-center justify-between shadow-gray-500/20 shadow-lg">
      <div className="flex-1 flex sm:justify-center justify-between lg:gap-10 sm:gap-4 gap-6 items-center">
        {/* left side Links | Desktop */}
        <nav className="flex-1 sm:flex lg:gap-10 sm:gap-4 gap-6 justify-end hidden">
          <div className="lg:text-xl text-xl">
            <LinkComponent animated={"home" === pathName} href="/home">
              {t("home")}
            </LinkComponent>
          </div>
          <div className="lg:text-xl text-xl">
            <LinkComponent animated={"shop" === pathName} href="/shop">
              {t("shop")}
            </LinkComponent>
          </div>
        </nav>

        {/* Logo | Desktop */}
        <div className="lg:text-3xl md:text-2xl text-2xl font-bold cursor-default">{logo}</div>

        <div className="flex-1 flex lg:gap-10 sm:gap-4 gap-6 justify-end sm:justify-between items-center">
          {/* right side Links | Desktop*/}
          <nav className="sm:flex hidden lg:gap-10 sm:gap-4 gap-6">
            <div className="lg:text-xl text-xl">
              <LinkComponent animated={"contact" === pathName} href="/contact">
                {t("contact")}
              </LinkComponent>
            </div>
            <div className="lg:text-xl text-xl">
              <LinkComponent animated={"signup" === pathName} href="/signup">
                {t("signup")}
              </LinkComponent>
            </div>
          </nav>

          {/* icons | Desktop */}
          <div className="lg:flex gap-1.5 bg-varWhite rounded-full px-1 py-1 hidden">
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
            <LinkComponent href={"/signup"}>{t("signup")}</LinkComponent>
          </div>
          <SimpleButton
            onClick={() => setOpen((prev) => !prev)}
            className="lg:hidden flex justify-center items-center"
          >
            <Menu size={30} color="var(--color-varBlack)" />
          </SimpleButton>
        </div>
      </div>

      {/* Menu */}
      <div
        className={`flex flex-col gap-3 absolute px-10 py-10 left-[0] ${
          open ? "translate-t-[0%]" : "-translate-y-[100%]"
        } transition:left duration-150 top-0 right-0 h-screen bg-varWhite lg:hidden`}
      >
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{logo}</div>

          <div className="absolute top-10 right-10 flex flex-col gap-3 items-center">
            <SimpleButton
              onClick={() => setOpen(false)}
              className="flex justify-center items-center"
            >
              <X size={30} color="var(--color-varBlack)" />
            </SimpleButton>

            <div className="flex flex-col gap-2 bg-background rounded-full px-1.5 py-2">
              <div className="p-1 cursor-pointer rounded-full">
                <Search size={size + 8} color="var(--color-varBlack)" />
              </div>
              <div className="p-1 cursor-pointer rounded-full">
                <ShoppingCart size={size + 8} color="var(--color-varBlack)" />
              </div>
              <div className="p-1 cursor-pointer rounded-full">
                <Globe size={size + 8} color="var(--color-varBlack)" />
              </div>
              <div className="p-1 cursor-pointer rounded-full">
                {theme === "light" ? (
                  <Moon size={size + 8} color="var(--color-varBlack)" />
                ) : (
                  <Sun size={size + 8} color="var(--color-varBlack)" />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <div className="flex flex-col gap-3 justify-between items-center">
            {data?.navLinks?.map(
              (item: { name: string; href: string }, index: number) => {
                return (
                  <LinkComponent
                    key={index}
                    onClick={() => setOpen(false)}
                    className="md:text-3xl text-2xl"
                    href={item.href}
                  >
                    {item.name}
                  </LinkComponent>
                );
              }
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
