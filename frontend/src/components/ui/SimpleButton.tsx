import React from "react";

type SimpleButtonProps = {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
};

const SimpleButton = ({
  onClick,
  className = "",
  type = "button",
  children,
  disabled,
}: SimpleButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-0.75 py-0.5 rounded-md border ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default SimpleButton;
