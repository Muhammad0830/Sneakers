"use client";

import Button from "@/components/ui/CustomButton";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations("Home");

  useEffect(() => {
    console.error("Error in Product page:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-red-600 cursor-pointer mb-5">
        Something went wrong.
      </h1>
      <div className="flex gap-3 items-center justify-center">
        <Button onClick={() => reset()}>Try again</Button>
        <Link href={"/home"}>
          <Button>{t("goHome")}</Button>
        </Link>
      </div>
    </div>
  );
}
