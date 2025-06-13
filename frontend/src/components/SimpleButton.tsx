import React from "react";

type SimpleButtonProps = {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
};

const SimpleButton = ({
  onClick,
  className = "",
  type = "button",
  children,
}: SimpleButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-0.75 py-0.5 rounded-md border ${className}`}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
