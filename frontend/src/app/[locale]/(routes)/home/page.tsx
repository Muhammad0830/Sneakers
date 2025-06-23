"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import SVGpathComponent from "@/components/SVGpathComponent";
import Image from "next/image";
import SimpleButton from "@/components/ui/SimpleButton";
import useApiQuery from "@/hooks/useApiQuery";
import { Product } from "@/types/types";
import EmblaCarousel from "@/components/MobileTrending";

const Home = () => {
  const t = useTranslations("Home");
  const SVGpathComponentRef = useRef<{
    moveToIndex: (index: number) => void;
    hello: () => void;
  }>(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [centerIndex, setCenterIndex] = useState(0);
  const [responsiveX, setYResponsive] = useState(0.8);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setYResponsive(1); // mobile
      else if (width < 768) setYResponsive(0.5); // sm
      else if (width < 1024) setYResponsive(0.7); // md
      else setYResponsive(1); // lg+
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    data: products = [],
    isLoading,
    error,
  } = useApiQuery<Product[]>("/trending", "Trending");

  console.log('products', products)
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

  const slides = Array.from(Array(products.length).keys())

  return (
    <div className="h-full">
      <div className="relative z-10 lg:min-h-[80vh] min-h-[60vh] w-full flex sm:flex-row flex-col overflow-hidden sm:px-16 px-4">
        <EmblaCarousel products={products} slides={slides} options={{ loop: true}} className="sm:hidden block w-[80%]" />

        <div className="lg:w-3/8 md:w-1/2 sm:w-6/11 w-full lg:min-h-[80vh] md:min-h-[60vh] flex flex-col justify-center gap-6 px-6 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="lg:text-4xl text-center sm:text-start md:text-3xl text-2xl font-bold">
              {t("MainTitle")}
            </h1>
            <h3 className="lg:text-lg sm:text-md text-lg text-center sm:text-start font-normal sm:font-bold text-varBlack/50">
              {t("MainThesis")}
            </h3>
          </div>
          <div className="flex justify-center sm:justify-start">
            <Link href={"/shop"}>
              <Button
                isLinkButton
                className="flex gap-2 transition-gap duration-200 cursor-pointer group-hover:gap-4 items-center"
              >
                <span className="text-sm sm:text-md">{t("ShopNow")}</span>
                <div>
                  <ChevronRight size={20} color="white" />
                </div>
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative -z-10 flex-1 sm:flex hidden">
          <SVGpathComponent
            ref={SVGpathComponentRef}
            setIsAnimating={setIsAnimating}
            initialIndex={centerIndex}
          />
        </div>

        <div className="lg:w-3/8 md:w-1/6 sm:w-1/5 relative sm:block hidden">
          {products?.map((item: Product, index: number) => {
            const relativeIndex = index - centerIndex;

            const distance = Math.abs(relativeIndex);
            const scale = distance === 0 ? 2 : distance === 1 ? 1.1 : 0.3;
            const translateY = relativeIndex * 220;
            const translateX = distance * 150 * responsiveX;
            const rotate = relativeIndex * 25;

            return (
              <div
                key={index}
                className={`absolute left-[20%] md:top-[40%] sm:top-[42%] transition-all duration-700 ease-in-out`}
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
                <div className="relative lg:w-40 md:w-30 sm:w-25 aspect-square">
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
