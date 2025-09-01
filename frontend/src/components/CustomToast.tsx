"use client";

import React from "react";
import { useCustomToast } from "@/context/CustomToastContext";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const CustomToast = () => {
  const { removeToast, toasts } = useCustomToast();

  if (!toasts) return null;

  const typeStyles: Record<string, string[]> = {
    success: [
      "border-green-500 shadow-[0_0_10px_1px_#00ff00] dark:shadow-[0_0_10px_3px_#00ff0060]",
      "bg-green-500",
      "green",
    ],
    error: [
      "border-red-500 shadow-[0_0_10px_1px_#ff0000] dark:shadow-[0_0_10px_3px_#ff000060]",
      "bg-red-500",
      "red",
    ],
    warning: [
      "border-yellow-500 shadow-[0_0_10px_1px_#ffff00] dark:shadow-[0_0_10px_3px_#ffff0040]",
      "bg-yellow-500",
      "yellow",
    ],
    info: [
      "border-blue-500 shadow-[0_0_10px_1px_#0000ff] dark:shadow-[0_0_10px_3px_#0000ff60]",
      "bg-blue-500",
      "blue",
    ],
    loading: [""],
  };

  return (
    <div className="fixed flex items-center gap-2 bottom-6 right-6 z-50">
      {toasts.map((toast) => {
        const isLoading = toast.type === "loading";

        if (isLoading)
          return (
            <div
              key={toast.id}
              className={cn(
                "absolute translate-x-[0%] opacity-100 flex items-center cursor-pointer gap-2 text-black dark:text-white right-0 bottom-0 bg-white border-[1px] border-primary dark:bg-black transition-all duration-300 dark:shadow-[0_0_10px_2px_#ffffff40] px-3 pb-3 pt-2 rounded-md z-50 transform",
                toast.visible
                  ? "translate-x-[0%] opacity-100"
                  : "translate-x-[50%] opacity-0"
              )}
            >
              <span className="text-nowrap">Loading the data...</span>
              <div className="h-6 w-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          );

        return (
          <button
            onClick={() => removeToast(toast.id)}
            key={toast.id}
            className={cn(
              "absolute cursor-pointer block text-black dark:text-white right-0 bottom-0 bg-white border-[2px] dark:bg-black translate-x-[50%] opacity-0 transition-all duration-300 dark:shadow-[0_0_10px_2px_#ffffff40] px-3 pb-3 pt-2 rounded-md z-50 transform", //shadow-[0_0_10px_2px_#22222250]
              typeStyles[toast.type][0],
              toast.visible
                ? "translate-x-[0%] opacity-100"
                : "translate-x-[50%] opacity-0"
            )}
          >
            <div className="md:text-lg text-[16px] font-bold text-nowrap text-start mb-1">
              {toast.title}
            </div>
            <div
              className={
                "md:text-[16px] relative text-sm text-nowrap px-1.5 py-0.5 rounded-[4px]"
              }
            >
              <span>{toast.message}</span>
              <div
                className={cn(
                  "absolute top-0 h-[2px] left-[5%] right-[5%] rounded-[100px]",
                  typeStyles[toast.type][1]
                )}
              ></div>
            </div>
            <div className="absolute top-2 right-2">
              <X size={16} color={typeStyles[toast.type][2]} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CustomToast;
