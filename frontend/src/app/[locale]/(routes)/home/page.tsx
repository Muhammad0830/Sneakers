"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Link from "next/link";
import SVGpathComponent from "@/components/SVGpathComponent";
import Image from "next/image";
import SimpleButton from "@/components/ui/SimpleButton";
import useApiQuery from "@/hooks/useApiQuery";
import EmblaCarousel from "@/components/MobileTrending";
import AboutCard from "@/components/AboutCard";
import {
  Truck,
  Headset,
  ShieldCheck,
  CircleDollarSign,
  Coins,
  Sparkle,
  Star,
  ChevronRight,
  Check,
  PhoneCall,
  MailCheck,
  Pencil,
} from "lucide-react";
import TestimonialCard from "@/components/TestimonialCard";
import { AboutCardType, TestimonialType, Product } from "@/types/types";

const AboutUsData = [
  {
    id: 1,
    title: "Free and Fast Delivery",
    thesis: "Free delivery for all orders over $100 - $200",
    icon: <Truck size={36} color="white" />,
  },
  {
    id: 2,
    title: "24/7 Customer Service",
    thesis: "Friendly 24/7 customer support",
    icon: <Headset size={36} color="white" />,
  },
  {
    id: 3,
    title: "Money Back Guarantee",
    thesis: "We return your money within 14-30 days",
    icon: <ShieldCheck size={36} color="white" />,
  },
  {
    id: 4,
    title: "Unbeatable Prices",
    thesis: "Get the best deals on all products every day",
    icon: <CircleDollarSign size={36} color="white" />,
  },
  {
    id: 5,
    title: "Buy Now, Pay Later",
    thesis: "Shop now and split your payments with easy plans",
    icon: <Coins size={36} color="white" />,
  },
  {
    id: 6,
    title: "Exclusive Member Discounts",
    thesis: "Special deals and offers for our members",
    icon: <Sparkle size={36} color="white" />,
  },
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const TestimonialRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const { data: testimonials = [] } = useApiQuery<TestimonialType[]>(
    "/testimonials",
    "Testimonials"
  );

  const handleLeftRight = (number: number) => {
    setIsAnimating(true);
    if (number < testimonials.length && number >= 0) {
      setCurrentIndex(number);
      if (TestimonialRef.current && width) {
        TestimonialRef.current.style.transform = `translateX(-${
          width * number
        }px)`;
      }
    }
    setTimeout(() => {
      setIsAnimating(false);
    }, 510);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWidth(width / 3);
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

  const slides = Array.from(Array(products.length).keys());

  return (
    <div className="h-full">
      {/* main */}
      <div className="relative z-10 lg:min-h-[80vh] min-h-[60vh] w-full flex sm:flex-row flex-col overflow-hidden sm:px-16 px-4 mb-16">
        <EmblaCarousel
          products={products}
          slides={slides}
          options={{ loop: true }}
          className="sm:hidden block w-[80%]"
        />

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
              className="cursor-pointer px-3"
            >
              Up
            </SimpleButton>
            <SimpleButton
              onClick={() => handleClick(centerIndex + 1)}
              className="cursor-pointer px-3"
              disabled={isAnimating}
            >
              Down
            </SimpleButton>
          </div>
        </div>
      </div>

      {/* About Us */}
      <div className="sm:px-16 px-6 flex items-center flex-col gap-5 my-10">
        <div className="text-4xl font-bold text-center">{t("AboutUs")}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 w-full [grid-auto-rows:1fr]">
          {AboutUsData.map((item: AboutCardType, index: number) => {
            return (
              <div key={index}>
                <AboutCard item={item} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing */}
      <div className="px-4 sm:px-16 my-16">
        <div className="text-4xl font-bold text-center">{t("Pricing")}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="border px-3 py-6 rounded-md flex flex-col items-center cursor-pointer">
            <div className="w-20 aspect-square bg-primary flex justify-center items-center rounded-2xl mb-4">
              <Check size={50} color="white" />
            </div>
            <div className="text-center text-2xl font-bold">
              {t("Sneakers Free")}
            </div>
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">$0.00</span>
              <span className="text-xl font-normal">/{t("Month")}</span>
            </div>
            <div className="flex flex-col gap-1 border-t-1 border-gray-500/70 pt-2">
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("we return money within")}
                  {t("14 days")}
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>{t("24/7 customer service")}</p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>{t("special discounts up to")} 10%</p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>{t("free delivery for all orders over")} $200</p>
              </div>
            </div>
          </div>
          <div className="border px-3 py-6 rounded-md flex flex-col items-center cursor-pointer">
            <div className="w-20 aspect-square bg-primary flex justify-center items-center rounded-2xl mb-4">
              <Sparkle size={50} color="white" />
            </div>
            <div className="text-center text-2xl font-bold">
              {t("Sneakers Pro")}
            </div>
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">$2.99</span>
              <span className="text-xl font-normal">/{t("Sneakers Pro")}</span>
            </div>
            <div className="flex flex-col gap-1 border-t-1 border-gray-500/70 pt-2">
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("we return money within")}{" "}
                  <span className="text-primary font-bold">{t("21 days")}</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>{t("24/7 customer service")}</p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("special discounts up to")}{" "}
                  <span className="text-primary font-bold">20%</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("free delivery for all orders over")}{" "}
                  <span className="text-primary font-bold">$150</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("split your payments for")}
                  {t("2 Months")}
                </p>
              </div>
            </div>
          </div>
          <div className="border px-3 py-6 rounded-md flex flex-col items-center cursor-pointer">
            <div className="w-20 aspect-square bg-primary flex justify-center items-center rounded-2xl mb-4">
              <Star size={50} color="white" />
            </div>
            <div className="text-center text-2xl font-bold">
              {t("Sneakers Premium")}
            </div>
            <div className="text-center mb-2">
              <span className="text-3xl font-bold">$3.99</span>
              <span className="text-xl font-normal">/{t("Month")}</span>
            </div>
            <div className="flex flex-col gap-1 border-t-1 border-gray-500/70 pt-2">
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("we return money within")}{" "}
                  <span className="text-primary font-bold">30 days</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>{t("24/7 customer service")}</p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("special discounts up to")}{" "}
                  <span className="text-primary font-bold">30%</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("free delivery for all orders over")}{" "}
                  <span className="text-primary font-bold">$100</span>
                </p>
              </div>
              <div className="flex gap-1 items-start">
                <div className="pt-1">
                  <Check size={20} color="var(--primary)" />
                </div>
                <p>
                  {t("split your payments for")}{" "}
                  <span className="text-primary font-bold">
                    {t("4 Months")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="px-4 md:px-16 sm:px-8 mb-30">
        <div className="text-4xl font-bold text-center ">
          {t("Testimonials")}
        </div>
        <div className="w-full flex sm:flex-row sm:px-0 px-5 flex-col sm:items-start items-center gap-15 relative mt-10">
          <div className="relative z-20 sm:w-1/2 min-w-[280px] max-w-[75%] flex flex-col gap-3 py-8 rounded-2xl bg-varWhite/70 backdrop-blur-xs px-4">
            <h1 className="lg:text-2xl md:text-xl text-lg font-bold sm:text-start text-center">
              {t("Our customers love shopping with us!")}
            </h1>
            <h3 className="lg:text-lg md:text-md text-sm font-normal sm:text-start text-center">
              {t(
                "Their kind words reflect our commitment to quality, service, and a seamless experience"
              )}
            </h3>
            <div className="flex sm:justify-start justify-center">
              <Button isLinkButton className="md:text-md text-sm">
                {t("View More")}
              </Button>
            </div>
          </div>

          <div className="sm:flex-1 sm:mx-0 mx-20 w-full sm:overflow-visible overflow-scroll items-center sm:justify-center justify-start flex sm:self-end self-center ">
            <div
              ref={TestimonialRef}
              className="flex sm:absolute relative sm:left-[60%] left-0 top-0 bottom-0 sm:items-center transition-transform duration-500"
              style={{ gap: width < 640 / 3 ? "2rem" : "0" }}
            >
              {testimonials.map((item: TestimonialType, index: number) => {
                return (
                  <div
                    key={index}
                    className="sm:self-auto self-stretch sm:w-[33vw] w-[60vw] transition-all duration-500 ease-in-out"
                    style={{
                      scale:
                        width < 640 / 3
                          ? "1"
                          : index === currentIndex
                          ? "1"
                          : "0.7",
                      opacity:
                        width < 640 / 3
                          ? 1
                          : `${Math.abs(currentIndex - index) >= 2 ? 0 : 1}`,
                    }}
                  >
                    <TestimonialCard
                      className="h-full"
                      item={item}
                      index={index}
                    />
                  </div>
                );
              })}
            </div>
            <div className="sm:relative left-0 bottom-0 right-0 justify-center absolute flex gap-3 lg:translate-y-[250%] translate-y-[300%]">
              <div className="hidden sm:flex gap-3 items-center px-3 py-2 absolute -top-[50%] -translate-y-[100%]">
                {testimonials.map((item: TestimonialType, index: number) => {
                  return (
                    <button
                      style={{
                        backgroundColor:
                          currentIndex === index
                            ? "var(--primary)"
                            : "var(--primary)/0",
                      }}
                      key={index}
                      onClick={() => handleLeftRight(index)}
                      className="w-3 h-3 rounded-full border border-primary cursor-pointer transition-backgroundColor duration-500"
                    ></button>
                  );
                })}
              </div>
              <SimpleButton
                disabled={isAnimating}
                onClick={() => handleLeftRight(currentIndex - 1)}
                className="px-2 cursor-pointer hidden sm:block border-primary text-primary font-bold"
              >
                {t("Left")}
              </SimpleButton>
              <SimpleButton
                disabled={isAnimating}
                onClick={() => handleLeftRight(currentIndex + 1)}
                className="px-2 cursor-pointer hidden sm:block border-primary text-primary font-bold"
              >
                {t("Right")}
              </SimpleButton>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="px-4 md:px-16 sm:px-8 mb-30">
        <div className="text-4xl font-bold text-center mb-10">
          {t("Contact")}
        </div>
        <div className="flex sm:flex-row flex-col gap-3 items-center">
          <div className="lg:w-2/5 sm:w-1/2 w-full sm:px-0 px-4 flex flex-col gap-4">
            <h1 className="font-bold lg:text-3xl text-2xl flex flex-col gap-1 sm:items-start items-center">
              <span>{t("Any ideas or issues")}</span>
              <span>{t("Contact with Us!")}</span>
            </h1>

            <h3 className="font-normal lg:text-lg text-md flex flex-col gap-3 items-start">
              <span className="sm:text-start text-center">
                {t(
                  "You can contact with us using our email and phone number or writing here"
                )}
              </span>
              <span className="text-start sm:block hidden">
                {" "}
                {t(
                  "**If you are not signed up or signed in, please sign in/up first before writing here"
                )}
              </span>
            </h3>
            <div className="sm:flex flex-row sm:justify-start items-center gap-4 justify-center hidden">
              <Button wrapperClassName="hover-trigger" isLinkButton>
                {t("Sign Up")}
              </Button>
              <Button
                wrapperClassName="hover-target duration-300 transition-translate"
                isLinkButton
              >
                {t("Sign In")}
              </Button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex lg:flex-row flex-col gap-4 w-full">
              <div className="flex flex-1 sm:flex-col flex-row sm:items-start sm:justify-start justify-between items-center gap-2 p-4 rounded-lg bg-varWhite">
                <div className="flex flex-row gap-2 justify-start items-center">
                  <div className="bg-primary aspect-square sm:w-10 w-7 rounded-lg sm:flex hidden justify-center items-center">
                    <PhoneCall
                      size={width * 3 < 640 ? 18 : 25}
                      color={"white"}
                    />
                  </div>
                  <h2 className="lg:text-2xl sm:text-xl text-md font-bold">
                    {t("Call to us")}
                  </h2>
                </div>
                <div>
                  <h3 className="lg:text-md text-sm text font-normal sm:block hidden">
                    {t("Call to us using this number")}
                  </h3>
                  <h3 className="lg:text-md sm:text-sm text-xs font-normal">
                    +999894-410-15-51
                  </h3>
                </div>
              </div>
              <div className="flex flex-1 sm:flex-col flex-row sm:items-start sm:justify-start justify-between items-center gap-2 p-4 rounded-lg bg-varWhite">
                <div className="flex flex-row gap-2 justify-start items-center">
                  <div className="bg-primary aspect-square sm:w-10 w-7 rounded-lg sm:flex hidden justify-center items-center">
                    <MailCheck
                      size={width * 3 < 640 ? 18 : 25}
                      color={"white"}
                    />
                  </div>
                  <div className="lg:text-2xl sm:text-xl text-sm font-bold">
                    {t("Write to us")}
                  </div>
                </div>
                <div>
                  <h3 className="lg:text-md text-sm font-normal sm:block hidden">
                    {t("Call to us using this email")}
                  </h3>
                  <h3 className="lg:text-md sm:text-sm text-xs font-normal">
                    abduqayumovm1@gmail.com
                  </h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-varWhite">
              <div className="flex flex-row gap-2 items-center">
                <div className="bg-primary aspect-square sm:w-10 w-7 rounded-lg sm:flex hidden justify-center items-center">
                  <Pencil size={width * 3 < 640 ? 18 : 25} color={"white"} />
                </div>
                <div className="lg:text-2xl sm:text-xl text-sm font-bold flex-1">
                  {t("Write your words here")}
                </div>
                <div>
                  <Button className="sm:text-md text-sm">{t("Submit")}</Button>
                </div>
              </div>
              <div className="rounded-md border border-primary lg:h-25 h-30">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Type here"
                  className="w-full h-full p-2 resize-none"
                ></textarea>
              </div>
            </div>
            <h3 className="font-normal text-md flex flex-col gap-3 items-start sm:hidden">
              <span className="text-center">
                {" "}
                {t(
                  "**If you are not signed up or signed in, please sign in/up first before writing here"
                )}
              </span>
            </h3>
            <div className="flex flex-row sm:justify-start items-center gap-4 justify-center sm:hidden">
              <Button wrapperClassName="hover-trigger" isLinkButton>
                {t("Sign Up")}
              </Button>
              <Button
                wrapperClassName="hover-target duration-300 transition-translate"
                isLinkButton
              >
                {t("Sign In")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
