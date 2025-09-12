"use client";
import React from "react";
import { useRouter } from "next/navigation";

type LinkProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  animated?: boolean;
  disableEffect?: boolean;
};

const LinkComponent = ({
  onClick,
  className = "",
  type = "button",
  children,
  href,
  animated,
  disableEffect,
}: LinkProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <button
      className={`relative group flex items-center cursor-pointer ${className}`}
      type={type}
      onClick={() => {
        if (href) {
          router.push(href);
        }
        handleClick();
      }}
    >
      {children}
      <div
        className={`${
          disableEffect ? "hidden" : "flex"
        } absolute bottom-0 left-0 ${
          animated ? "right-[0%]" : "right-[100%]"
        } group-hover:right-[0%] duration-300 translate-right h-0.75 bg-primary rounded-full`}
      ></div>
    </button>
  );
};

export default LinkComponent;
