"use client";
import React, { useEffect, useState } from "react";
import { Search, ShoppingCart, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LinkComponent from "./ui/Link";
import SimpleButton from "@/components/ui/SimpleButton";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useCustomToast } from "@/context/CustomToastContext";
import ProfileButton from "./ProfileButton";
import AllPagesLinks from "./AllPagesLinks";

const logo = "SNEAKER";

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
      href: "/auth?mode=signup",
    },
    {
      name: "Testimonials",
      href: "/testimonials",
    },
  ],
};

const NavBar = () => {
  const t = useTranslations("NavBar");
  const toastT = useTranslations("Toast");
  const [size, setSize] = useState(20);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [pathName, setPathName] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [width, setWidth] = useState<number | null>(null);

  const { user } = useAuth();
  const { showToast } = useCustomToast();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const newPathName = pathname.split("/")[2];
    setPathName(newPathName);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWidth(width);
      if (width < 640) setSize(12); // mobile
      else if (width < 768) setSize(16); // sm
      else if (width < 1024) setSize(18); // md
      else setSize(20); // lg+
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return (
    <header className="md:px-4 z-50 fixed left-0 right-0 top-0 bg-varWhite/50 backdrop-blur-xs py-4 lg:px-6 px-4 flex items-center justify-between shadow-gray-500/20 shadow-lg">
      <div className="flex-1 flex sm:justify-center justify-between lg:gap-10 sm:gap-4 gap-6 items-center">
        {/* all page Links button */}
        <AllPagesLinks />
        <SimpleButton
          onClick={() => setOpen((prev) => !prev)}
          className="px-1 rounded-sm border bg-white dark:bg-black border-primary py-1 lg:hidden sm:flex hidden justify-center items-center"
        >
          <Menu className="w-5 h-5 text-primary" />
        </SimpleButton>

        {/* left side Links | Desktop */}
        <nav className="flex-1 sm:flex lg:gap-10 sm:gap-4 gap-6 justify-end hidden">
          <div className="lg:text-lg text-md">
            <LinkComponent animated={"home" === pathName} href="/home">
              {t("home")}
            </LinkComponent>
          </div>
          <div className="lg:text-lg text-md">
            <LinkComponent animated={"shop" === pathName} href="/shop">
              {t("shop")}
            </LinkComponent>
          </div>
        </nav>

        {/* Logo | Desktop */}
        <div className="lg:text-3xl md:text-2xl text-2xl font-bold cursor-default">
          {logo}
        </div>

        <div className="flex-1 flex lg:gap-6 sm:gap-4 gap-6 justify-end sm:justify-between items-center">
          {/* right side Links | Desktop*/}
          <nav className="sm:flex hidden lg:gap-10 sm:gap-4 gap-6">
            <div className="lg:text-lg text-md">
              <LinkComponent animated={"contact" === pathName} href="/contact">
                {t("contact")}
              </LinkComponent>
            </div>
            <div className="lg:text-lg text-md">
              {user ? (
                <LinkComponent animated={"Cart" === pathName} href="/cart">
                  {t("Cart")}
                </LinkComponent>
              ) : (
                <div className="relative group/child">
                  <LinkComponent
                    animated={"auth" === pathName}
                    href="/auth?mode=signup"
                    className="z-30"
                  >
                    {t("signup")}
                  </LinkComponent>

                  {pathName !== "auth" && (
                    <div
                      className={cn(
                        "absolute inset-[50%] opacity-0 bg-white dark:bg-black border-primary border rounded-md transition-all duration-300",
                        "group-hover/child:-inset-2 group-hover/child:-bottom-10 group-hover/child:opacity-100"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute bottom-2 -inset-x-8 flex justify-center z-30 translate-y-[100%] transition-all duration-300",
                          "group-hover/child:translate-y-0"
                        )}
                      >
                        <LinkComponent
                          animated={"auth" === pathName}
                          href="/auth?mode=signin"
                        >
                          {t("signin")}
                        </LinkComponent>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* icons | Desktop */}
          <div className="flex items-center justify-end gap-4">
            <div className="lg:flex gap-1 bg-varWhite rounded-full px-1 py-1 hidden items-center">
              <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
                <Search size={size} color="var(--color-varBlack)" />
              </div>
              {user ? null : (
                <button
                  onClick={() => {
                    showToast(
                      "warning",
                      toastT("Please sign in or sign up first")
                    );
                  }}
                  className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5"
                >
                  <ShoppingCart size={size} color="var(--color-varBlack)" />
                </button>
              )}
              <div className="p-1 cursor-pointer rounded-full hover:bg-varBlack/5">
                <Globe size={size} color="var(--color-varBlack)" />
              </div>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1 overflow-hidden cursor-pointer relative rounded-full hover:bg-varBlack/5"
              >
                <div
                  className={`relative ${
                    theme === "dark"
                      ? "-translate-y-[120%]"
                      : "-translate-y-[0%]"
                  } transition-transform duration-300`}
                >
                  <Moon size={size} color="var(--color-varBlack)" />
                </div>
                <div
                  className={`absolute top-0 bottom-0 flex items-center justify-center ${
                    theme === "dark" ? "translate-y-[0%]" : "translate-y-[120%]"
                  } transition-transform duration-300`}
                >
                  <Sun size={size} color="var(--color-varBlack)" />
                </div>
              </button>
            </div>
            {user && (width ? width >= 1024 : true) ? (
              <ProfileButton user={user} />
            ) : null}
          </div>

          {/* just for mobile and Tablet */}
          <div className="flex items-center gap-2 justify-end lg:hidden">
            <SimpleButton
              onClick={() => setOpen((prev) => !prev)}
              className="sm:hidden flex justify-center items-center"
            >
              <Menu size={30} color="var(--color-varBlack)" />
            </SimpleButton>
            {user && (width ? width <= 1024 : true) ? (
              <ProfileButton user={user} />
            ) : (
              <div className="text-md sm:hidden">
                <LinkComponent href={"/auth?mode=signup"}>
                  {t("signup")}
                </LinkComponent>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div
        className={`flex flex-col gap-3 z-50 absolute px-10 py-10 left-[0] ${
          open ? "translate-t-[0%]" : "-translate-y-[100%]"
        } transition:left duration-150 top-0 right-0 h-screen bg-varWhite lg:hidden`}
      >
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{logo}</div>

          <div className="absolute top-10 right-10 flex flex-col gap-3 items-center">
            <SimpleButton
              onClick={() => setOpen(false)}
              className="px-0.5 py-1 flex justify-center items-center border-red-500"
            >
              <X className="w-7 h-7 text-red-500" />
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
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-1 cursor-pointer rounded-full"
              >
                {theme === "light" ? (
                  <Moon size={size + 8} color="var(--color-varBlack)" />
                ) : (
                  <Sun size={size + 8} color="var(--color-varBlack)" />
                )}
              </button>
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
                    href={
                      item.href.startsWith("/auth") && user
                        ? "/cart"
                        : item.href
                    }
                  >
                    {item.href.startsWith("/auth") && user
                      ? t("Cart")
                      : item.name}
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
