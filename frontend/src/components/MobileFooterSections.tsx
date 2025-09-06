"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const MobileFooterSections = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const pathname = usePathname();
  const supportLinksRef = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [linksHeight, setLinksHeight] = useState(0);
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (supportLinksRef.current) {
      const height = supportLinksRef.current.offsetHeight;
      setLinksHeight(height);
    }

    if (button.current) {
      const heightOfButton = button.current.offsetHeight;
      setButtonHeight(heightOfButton);
    }
  }, []);

  const handleClick = () => {
    setOpen((prev: boolean) => !prev);
  };

  return (
    <div
      className={`relative w-full overflow-hidden transition-all duration-300`}
      style={{ height: open ? buttonHeight + linksHeight : buttonHeight }}
    >
      <div className="relative z-20 bg-[#D1D1D1] dark:bg-black w-full mx-auto">
        <button
          ref={button}
          onClick={handleClick}
          className="w-full text-2xl flex justify-around gap-2 items-center py-2 px-12"
        >
          <span>{title}</span>
          <ChevronDownIcon
            className={`${
              open ? "rotate-180" : "rotate-0"
            } translate-rotate duration-300`}
          />
        </button>
      </div>
      <div
        className={`absolute w-full ${
          open ? "opacity-100 translate-y-[0%]" : "opacity-0 translate-y-[50%]"
        } transition-all duration-300 z-0 text-center py-2`}
        ref={supportLinksRef}
      >
        {children}
      </div>
    </div>
  );
};

export default MobileFooterSections;
