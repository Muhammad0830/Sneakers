"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
}

interface Props {
  news: NewsItem[]; // fetched from backend
  speed?: number; // pixels per second
  direction?: "left" | "right";
}

export default function InfiniteScrollCards({
  news,
  speed = 100,
  direction = "left",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // measure container width (for seamless loop)
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2); // half because we duplicate
    }
  }, [news]);

  const duration = containerWidth / speed;

  return (
    <div className="overflow-hidden w-full mt-5">
      <motion.div
        ref={containerRef}
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? [-containerWidth, 0] : [0, -containerWidth],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration,
          },
        }}
      >
        {[...news, ...news].map((item, idx) => (
          <div
            key={idx}
            className="mr-4 sm:p-4 p-2 rounded-md border bg-white dark:bg-black"
          >
            <div className="flex items-center justify-between sm:gap-2 gap-1 sm:mb-2 mb-1">
              <div className="flex items-center gap-2">
                <div className="md:w-12 w-7 aspect-square rounded-full bg-primary flex items-center justify-center text-white font-bold sm:text-xl text-xs">
                  M
                </div>
                <div className="flex flex-col">
                  <div className="sm:text-[16px] text-xs font-semibold">
                    Abdukayumov M.
                  </div>
                  <div className="sm:text-sm text-[10px] text-gray-500">
                    2025.09.08
                  </div>
                </div>
              </div>
            </div>
            <p className="sm:text-[16px] text-xs sm:w-[300px] w-[150px] line-clamp-2 text-wrap">
              {item.title}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
