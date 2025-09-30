"use client";
import React, { useEffect, useRef, useState } from "react";
import { MenuIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";

const allPagesLinks = [
  {
    label: "Home",
    href: "/home",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Testimonials",
    href: "/testimonials",
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "My Profile",
    href: "/profile",
  },
];

const AllPagesLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative lg:block hidden" ref={ref}>
      <button
        className={cn(
          "relative flex bg-white dark:bg-black items-center justify-center rounded-sm border overflow-hidden transition-colors duration-300",
          isOpen ? "border-red-500" : "border-primary"
        )}
      >
        <motion.div
          className="w-full h-full p-1 cursor-pointer"
          onClick={() => setIsOpen(true)}
          initial={{ x: "0%", y: "0%" }}
          animate={isOpen ? { x: "100%", y: "100%" } : { x: "0%", y: "0%" }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
        >
          <MenuIcon className="w-5 h-5 text-primary" />
        </motion.div>
        <motion.div
          className="absolute text-red-500 inset-0 flex justify-center items-center cursor-pointer"
          onClick={() => setIsOpen(false)}
          initial={{ x: "-100%", y: "-100%" }}
          animate={isOpen ? { x: "0%", y: "0%" } : { x: "-100%", y: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
        >
          <X className="w-5 h-5" />
        </motion.div>
      </button>

      <motion.div
        initial={{ top: "90%", opacity: 0, scale: 0 }}
        animate={
          isOpen
            ? { top: "115%", opacity: 1, scale: 1 }
            : { top: "90%", opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut", type: "spring" }}
        className="absolute origin-top-left bg-white dark:bg-black left-0 p-2 rounded-sm border border-primary flex flex-col gap-1"
      >
        {allPagesLinks &&
          allPagesLinks.map(
            (link: { label: string; href: string }, index: number) => (
              <Link
                key={index}
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  initial={{
                    backgroundColor:
                      pathName === link.href
                        ? "var(--color-primary10)"
                        : "var(--color-primary0)",
                  }}
                  whileHover={{
                    backgroundColor: "var(--color-primary10)",
                  }}
                  transition={{
                    duration: 0.15,
                    ease: "easeInOut",
                    type: "spring",
                  }}
                  className={cn("px-2 py-0.5 rounded-sm w-full group")}
                >
                  <div
                    className={cn(
                      "group-hover:translate-x-0 transition-translate duration-150",
                      pathName === link.href
                        ? "translate-x-0"
                        : "-translate-x-1"
                    )}
                  >
                    {link.label}
                  </div>
                </motion.div>
              </Link>
            )
          )}
      </motion.div>
    </div>
  );
};

export default AllPagesLinks;
