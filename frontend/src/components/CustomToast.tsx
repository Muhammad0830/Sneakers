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
      "border-green-500/60 border",
      "green",
    ],
    error: [
      "border-red-500 shadow-[0_0_10px_1px_#ff0000] dark:shadow-[0_0_10px_3px_#ff000060]",
      "border-red-500/60 border",
      "red",
    ],
    warning: [
      "border-yellow-500 shadow-[0_0_10px_1px_#ffff00] dark:shadow-[0_0_10px_3px_#ffff0040]",
      "border-yellow-500/60 border",
      "yellow",
    ],
    info: [
      "border-blue-500 shadow-[0_0_10px_1px_#0000ff] dark:shadow-[0_0_10px_3px_#0000ff60]",
      "border-blue-500/60 border",
      "blue",
    ],
  };

  return (
    <div className="fixed flex items-center gap-2 bottom-6 right-6 z-50">
      {toasts.map((toast) => {
        return (
          <button
            onClick={() => removeToast(toast.id)}
            key={toast.id}
            className={cn(
              "absolute cursor-pointer text-black dark:text-white block right-0 bottom-0 bg-white border-[2px] dark:bg-black translate-x-[50%] opacity-0 transition-all duration-300 dark:shadow-[0_0_10px_2px_#ffffff40] px-3 pb-3 pt-2 rounded-md z-50 transform", //shadow-[0_0_10px_2px_#22222250]
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
              className={cn(
                "md:text-[16px]  text-sm text-nowrap px-1.5 py-0.5 rounded-[4px]",
                typeStyles[toast.type][1]
              )}
            >
              {toast.message}
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
