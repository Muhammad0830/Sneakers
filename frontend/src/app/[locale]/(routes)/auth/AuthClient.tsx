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
import { useAuth } from "@/context/AuthContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useRouter } from "next/navigation";

export default function AuthClient() {
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const toastT = useTranslations("Toast");

  const modeFromUrl = searchParams.get("mode") || "signup";

  const [mode, setMode] = useState<"signin" | "signup">(
    modeFromUrl === "signin" ? "signin" : "signup"
  );
  const [customMode, setCustomMode] = useState<"signin" | "signup">(
    modeFromUrl === "signin" ? "signin" : "signup"
  );
  const { login, register, loading, error, setError, success, setSuccess } =
    useAuth();
  const { showToast } = useCustomToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMode(modeFromUrl === "signin" ? "signin" : "signup");
  }, [modeFromUrl]);

  useEffect(() => {
    if (error !== null) {
      showToast(
        "error",
        error === "login"
          ? "Failed to login"
          : error === "signup"
          ? "Failed to signup"
          : "Failed to Logout",
        error === "login"
          ? "Please check your credentials and try again"
          : error === "signup"
          ? "Please try again"
          : "Internal server error"
      );
      setError(null);
    }
  }, [error]); // eslint-disable-line

  useEffect(() => {
    if (
      success &&
      (success === "login" || success === "signup" || success === "logout")
    ) {
      showToast(
        "success",
        toastT("Successfull"),
        toastT(
          success === "login"
            ? "Welcome back"
            : success === "signup"
            ? "Your journey begins here"
            : "Come back anytime"
        )
      );
      setSuccess(null);
      if (success === "signup" || success === "login") router.push("/");
    }
  }, [success]); // eslint-disable-line

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (name && email && password) {
        await register(name, email, password);
      } else {
        showToast(
          "warning",
          toastT("Warning"),
          toastT("Please fill all the fields")
        );
      }
    } else {
      if (email && password) {
        await login(email, password);
      } else {
        showToast(
          "warning",
          toastT("Warning"),
          toastT("Please fill all the fields")
        );
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
              "sm:w-1/2 w-full flex flex-col gap-2 items-center transition-all duration-1000 z-10",
              customMode === "signin"
                ? "opacity-0 -translate-x-[150%]"
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
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-2"
            >
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Name")}
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Email")}
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text"
                  className="w-full h-full p-2"
                  placeholder={t("Password")}
                  security="true"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <Button
                  type="submit"
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
                  onClick={() => {
                    setCustomMode("signin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
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
              "sm:w-1/2 flex sm:relative absolute inset-0 px-4 sm:px-0 flex-col gap-2 items-center justify-center transition-all duration-1000 z-10",
              customMode === "signin"
                ? "opacity-100 translate-x-[0%]"
                : "opacity-0 translate-x-[150%]"
            )}
          >
            <div className="flex justify-center text-primary text-4xl font-bold">
              {t("Sign In")}
            </div>
            <div className="text-center justify-center w-[80%] text-lg">
              {t("Welcome back")}
            </div>
            <div className="mt-2 text-sm">{t("Enter your details below")}</div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-2"
            >
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="text"
                  className="w-full h-full p-2"
                  placeholder="Email"
                />
              </div>
              <div className="border border-primary rounded-md overflow-hidden">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="text"
                  className="w-full h-full p-2"
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                <Button
                  type="submit"
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
                  onClick={() => {
                    setCustomMode("signup");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  href={`/auth?mode=signup`}
                >
                  <span className="text-primary font-semibold underline">
                    {t("sign up")}
                  </span>
                </Link>
              </div>
            </form>
          </div>

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
