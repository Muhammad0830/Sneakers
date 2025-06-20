"use client";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SVGpathComponent from "@/components/SVGpathComponent";
import Image from "next/image";
import SimpleButton from "@/components/ui/SimpleButton";
import { useQuery } from "@tanstack/react-query";
import { GetTrending } from "@/api/sneakers";

interface Product {
  id: number;
  name: string;
  size: string;
}

const Home = () => {
  const t = useTranslations("Home");
  const SVGpathComponentRef = useRef<{
    moveToIndex: (index: number) => void;
    hello: () => void;
  }>(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sneakers"],
    queryFn: () => GetTrending(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleClick = (newIndex: number) => {
    if (isAnimating) return;

    let updatedIndex = newIndex;

    if (newIndex < 0) {
      updatedIndex = products.length - 1;
    } else if (newIndex >= products?.length) {
      updatedIndex = 0;
    }

    setIsAnimating(true);
    setCenterIndex(updatedIndex);
    SVGpathComponentRef.current?.moveToIndex(updatedIndex);

    setTimeout(() => {
      // setCurrentIndex(updatedIndex);
      setIsAnimating(false);
    }, 700);
  };

  return (
    <div className="px-16">
      <div className="relative z-10 min-h-[80vh] w-full flex">
        <div className="w-3/8 min-h-[80vh] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">{t("MainTitle")}</h1>
            <h3 className="text-lg font-bold text-varBlack/50">
              {t("MainThesis")}
            </h3>
          </div>
          <div>
            <Link href={"/shop"}>
              <Button
                isLinkButton
                className="flex gap-2 transition-gap duration-200 cursor-pointer group-hover:gap-4 items-center"
              >
                <span>{t("ShopNow")}</span>
                <div>
                  <ChevronRight size={20} color="white" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative -z-10 flex-1">
          <SVGpathComponent
            ref={SVGpathComponentRef}
            setIsAnimating={setIsAnimating}
            initialIndex={centerIndex}
          />
        </div>

        <div className="w-3/8 relative">
          {products?.map((item: Product, index: number) => {
            const relativeIndex = index - centerIndex;

            const distance = Math.abs(relativeIndex);
            const scale = distance === 0 ? 2 : distance === 1 ? 1.1 : 0.3;
            const translateY = relativeIndex * 220;
            const translateX = distance * 150;
            const rotate = relativeIndex * 25;

            return (
              <div
                key={index}
                className={`absolute left-[20%] top-[30%] transition-all duration-700 ease-in-out`}
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                  zIndex: 10 - distance,
                  opacity: distance >= 1 ? 0.8 : distance > 1 ? 0 : 1,
                  filter:
                    distance >= 1
                      ? "blur(2px)"
                      : distance > 1
                      ? "blur(5px)"
                      : "blur(0px)",
                }}
              >
                <div className="relative w-40 h-40">
                  <Image
                    src="/sneakers.png"
                    fill
                    className="object-contain"
                    alt="sneakers"
                  />
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-10 z-50 left-1/2 transform -translate-x-1/2 flex gap-4">
            <SimpleButton
              onClick={() => handleClick(centerIndex - 1)}
              disabled={isAnimating}
              className="cursor-pointer"
            >
              Up
            </SimpleButton>
            <SimpleButton
              onClick={() => handleClick(centerIndex + 1)}
              className="cursor-pointer"
              disabled={isAnimating}
            >
              Down
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
