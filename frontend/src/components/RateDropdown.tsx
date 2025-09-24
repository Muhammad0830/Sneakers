"use client";
import { cn } from "@/lib/utils";
import { Star, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

const RateDropdown = ({
  handleRate,
  rated,
  rating,
  setRating,
}: {
  handleRate: () => void;
  rated: boolean;
  rating: number;
  setRating: (rating: number) => void;
}) => {
  const [open, setOpen] = useState(false);

  const t = useTranslations("Product");
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        parentRef.current &&
        !parentRef.current.contains(event.target as Node)
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
  return (
    <div className="relative flex justify-center z-20" ref={parentRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-sm lg:px-2 px-1 py-1 bg-primary cursor-pointer flex items-center gap-2 border border-white shadow-[0px_0px_0px01px_var(--primary)] hover:shadow-[0px_0px_10px_1px_var(--primary)] duration-300 transition-all"
      >
        <span className="lg:block hidden text-white font-semibold">
          {t("Rate")}
        </span>
        <ThumbsUp
          size={18}
          color="white"
          fill={rated ? "white" : "transparent"}
        />
      </button>

      <div
        className={cn(
          "absolute p-2 rounded-sm border border-primary bg-white dark:bg-black transition-all duration-300 origin-bottom flex flex-col items-center justify-center",
          open
            ? "bottom-[115%] opacity-100 scale-[1]"
            : "bottom-[90%] opacity-0 scale-[0]"
        )}
      >
        <div className="flex items-center mb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              onClick={() => setRating(i + 1)}
              key={i}
              className="cursor-pointer px-0.5"
            >
              <Star
                className="w-5 h-5 text-yellow-500"
                fill={rating >= i + 1 ? "yellow" : "transparent"}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 justify-between self-center">
          <div className="relative h-10">
            <Input
              type="text"
              value={rating.toString()}
              onChange={(e) => {
                const val = e.target.value;

                if (val === "") {
                  setRating(1);
                  return;
                }

                const lastChar = val[val.length - 1];

                if (!/^[1-5]$/.test(lastChar)) return;

                setRating(Number(lastChar));
              }}
              placeholder="1"
              style={{ fontSize: "1.5rem" }}
              className="absolute p-0 rounded-sm z-10 w-full h-full border border-black/40 dark:border-white/40 bg-primary/40 dark:bg-primary/20 text-center text-2xl flex font-bold"
            />
            <span className="text-2xl w-full font-bold px-3 py-0.5 inline-block h-full opacity-0 border">
              5
            </span>
          </div>
          <span>/</span>
          <div className="rounded-sm h-10">
            <span className="text-2xl font-bold px-3 py-0.5 w-full text-center inline-block h-full border border-black/40 dark:border-white/40 rounded-sm">
              5
            </span>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 justify-between">
          <button
            onClick={() => setOpen(false)}
            className="px-2 py-0.5 cursor-pointer border border-primary text-primary bg-white dark:bg-black font-bold rounded-sm"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() => {
              handleRate();
              setOpen(false);
            }}
            className="px-2 py-0.5 cursor-pointer bg-primary text-white font-bold rounded-sm"
          >
            {t("Rate")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateDropdown;
