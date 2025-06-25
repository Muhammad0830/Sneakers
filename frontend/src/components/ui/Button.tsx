"use client";
import React from "react";
import { useTranslations } from "next-intl";

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLinkButton?: boolean;
};

const Button = ({
  onClick,
  className,
  children,
  type,
  disabled,
  isLinkButton,
}: ButtonProps) => {
  const t = useTranslations("Home");
  return (
    <button
      className="relative group"
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      <div
        className={`px-3 py-2 relative z-10 bg-primary rounded-md text-white font-bold ${className}`}
      >
        {children}
      </div>
      <div
        className="absolute z-0 top-0 bottom-0 left-[100%] -translate-x-[120%] transition-translate duration-200 group-hover:-translate-x-[0%] flex items-center cursor-pointer"
        style={{ display: isLinkButton ? "flex" : "none" }}
      >
        <div className="h-[70%] bg-white py-1 px-2 text-xs flex justify-center items-center rounded-br-md rounded-tr-md border-t-1 border-b-1 border-r-1 border-primary">{t("Move")}</div>
      </div>
    </button>
  );
};

export default Button;
