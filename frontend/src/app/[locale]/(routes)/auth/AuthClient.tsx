"use client";
import React from "react";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import GoogleIconSVG from "@/components/ui/GoogleIconSVG";

export default function AuthClient() {
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  const modeFromUrl = searchParams.get("mode") || "signup";

  const [mode, setMode] = useState<"signin" | "signup">(
    modeFromUrl === "signin" ? "signin" : "signup"
  );
  const [customMode, setCustomMode] = useState<"signin" | "signup">(
    modeFromUrl === "signin" ? "signin" : "signup"
  );

  useEffect(() => {
    setMode(modeFromUrl === "signin" ? "signin" : "signup");
  }, [modeFromUrl]);

  return (
    <div className="h-screen lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] pt-4">
      <div className="absolute">
        PathName: <span>Home</span>
        <span>/Auth/{mode}</span>
      </div>
      <div className="flex h-[90%] items-center justify-center">
        <div className="relative md:min-w-[700px] min-w-[300px] w-[900px] flex items-center justify-between gap-5 rounded-lg border border-primary overflow-hidden p-4">
          <div
            className={cn(
              "sm:w-1/2 w-full flex flex-col gap-2 items-center transition-all duration-1000",
              customMode === "signin"
                ? "opacity-0 -translate-x-[150%] sm:-translate-x-[0%]"
                : "opacity-100 -translate-x-[0%]"
            )}
          >
            <div className="flex justify-center text-primary text-4xl font-bold">
              {t("SignUp")}
            </div>
            <div className="text-center justify-center w-[80%] text-lg">
              {t("Create an account and shop your favorites!")}
            </div>
            <div className="mt-2 text-sm">{t("Enter your details below")}</div>
            <form className="w-full flex flex-col gap-2">
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Name")}
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Email")}
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Password")}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <Button
                  wrapperClassName="flex-1 w-full sm:w-auto "
                  className="flex justify-center items-center text-white"
                >
                  {t("Register")}
                </Button>
                <button className="flex-1  w-full sm:w-auto  cursor-pointer py-2 px-3 flex items-center justify-center gap-1 border border-primary rounded-md">
                  <div>
                    <GoogleIconSVG />
                  </div>
                  <span>{t("withGoogle")}</span>
                </button>
              </div>
              <div className="text-center flex gap-2 items-center justify-center">
                {t("Already have an Account?")}
                <Link
                  onClick={() => setCustomMode("signin")}
                  href={`/auth?mode=signin`}
                >
                  <span className="text-primary font-semibold underline">
                    {t("sign in")}
                  </span>
                </Link>
              </div>
            </form>
          </div>

          <div
            className={cn(
              "sm:w-1/2 flex sm:relative absolute inset-0 px-4 sm:px-0 flex-col gap-2 items-center justify-center transition-all duration-1000",
              customMode === "signin"
                ? "opacity-100 translate-x-[0%]"
                : "opacity-0 translate-x-[150%] sm:translate-x-[0%]"
            )}
          >
            <div className="flex justify-center text-primary text-4xl font-bold">
              {t("Sign In")}
            </div>
            <div className="text-center justify-center w-[80%] text-lg">
              {t("Welcome back")}
            </div>
            <div className="mt-2 text-sm">{t("Enter your details below")}</div>
            <form className="w-full flex flex-col gap-2">
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  type="text"
                  className="w-full h-full p-2"
                  placeholder="Email"
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  type="text"
                  className="w-full h-full p-2"
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <Button
                  wrapperClassName="flex-1 w-full sm:w-auto "
                  className="flex justify-center items-center text-white"
                >
                  {t("Login")}
                </Button>
                <button className="flex-1 w-full sm:w-auto  cursor-pointer py-2 px-3 flex items-center justify-center gap-1 border border-primary rounded-md">
                  <div className="flex">
                    <GoogleIconSVG />
                  </div>
                  <span>{t("withGoogle")}</span>
                </button>
              </div>
              <div className="text-center flex gap-2 items-center justify-center">
                {t("Don't have an Account?")}
                <Link
                  onClick={() => setCustomMode("signup")}
                  href={`/auth?mode=signup`}
                >
                  <span className="text-primary font-semibold underline">
                    {t("sign up")}
                  </span>
                </Link>
              </div>
            </form>
          </div>

          {/* image */}
          <div
            className={cn(
              "absolute w-1/2 h-full sm:flex hidden items-center justify-center left-0 transition-translate duration-1000",
              customMode === "signin" ? "" : "translate-x-full"
            )}
          >
            <div
              className={cn(
                "relative md:min-w-[350px] min-w-[250px] w-[400px] aspect-square transition-transform duration-[1050ms]",
                customMode === "signin"
                  ? "rotate-0 -translate-y-[0px]"
                  : "-rotate-45 -translate-y-[20px]"
              )}
            >
              <Image src="/sneakers.png" alt="sneakers" fill />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
