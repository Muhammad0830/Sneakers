"use client";
import { PhoneInput } from "@/components/PhoneInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";

const orderedProducts = [
  {
    id: 1,
    name: "Sneakers1",
    price: 19.99,
    image: "/sneakers-1.png",
    quantity: 1,
  },
  {
    id: 2,
    name: "Sneakers2",
    price: 29.99,
    image: "/sneakers-2.png",
    quantity: 1,
  },
  {
    id: 3,
    name: "Sneakers3",
    price: 19.99,
    image: "/sneakers-3.png",
    quantity: 2,
  },
  {
    id: 4,
    name: "Sneakers4",
    price: 39.99,
    image: "/sneakers-4.png",
    quantity: 1,
  },
  {
    id: 5,
    name: "Sneakers5",
    price: 29.99,
    image: "/sneakers-4.png",
    quantity: 1,
  },
];

const Page = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<
    "visa" | "mastercard" | "paypal"
  >("visa");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const t = useTranslations("Checkout");

  const totalPrice = orderedProducts
    .reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    .toFixed(2);

  return (
    <div className="lg:px-[60px] md:px-10 sm:-px-[30px] px-5 flex flex-col gap-y-4 mb-4">
      <div>
        {orderedProducts?.length > 0 ? (
          <>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold mt-4 mb-2">
              {t("My Orders")}
            </h1>
            <div className="sm:flex grid grid-cols-3 max-[440px]:grid-cols-2 gap-2 flex-wrap">
              {orderedProducts.map((product, index) => {
                return (
                  <div
                    key={index}
                    className="p-2 sm:min-w-[180px] min-w-[120px] flex flex-col gap-2 rounded-sm border border-primary bg-white dark:bg-black relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div className="lg:text-xl md:text-lg text-base lg:font-bold font-semibold">
                        {product.name}
                      </div>
                      <div className="rounded-full font-bold bg-primary text-white md:h-7 h-5 md:text-base text-sm flex justify-center items-center aspect-square">
                        {product.quantity}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="sm:w-16 sm:h-16 w-12 h-12 rounded-sm border border-primary relative overflow-hidden">
                        <Image
                          className="w-full h-full object-cover"
                          src={product.image}
                          alt={product.name}
                          fill
                        />
                      </div>
                      <div className="lg:text-2xl md:text-xl sm:text-lg text-base font-bold">
                        {product.price}$
                      </div>
                    </div>
                    <div className="flex justify-between items-center sm:gap-2 gap-0.5 pt-1 border-0 border-t-1 border-primary">
                      <div className="font-semibold md:text-xl text-sm">
                        {t("SubTotal")}
                      </div>
                      <div className="font-bold md:text-xl text-sm">
                        {product.price * product.quantity}$
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex">
              <div className="lg:text-2xl sm:text-xl text-lg font-bold mt-2 px-2 py-1 rounded-sm bg-white dark:bg-black border border-primary">
                <span>{t("Total")}: </span>
                <span>{totalPrice}$</span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div>
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Shipping info")}
        </h1>
        <form
          id="shippingForm"
          className="flex md:flex-row flex-col gap-2 md:items-center mt-2"
        >
          <div className="flex gap-2 sm:flex-row flex-col">
            <div className="lg:w-[300px] md:w-[200px] sm:w-1/2 w-full">
              <div className="text-sm font-semibold">{t("Name")}</div>
              <Input
                className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Name")}
              />
            </div>
            <div className="lg:w-[250px] md:w-[210px] sm:w-1/2 w-full">
              <div className="text-sm font-semibold">{t("Phone Number")}</div>
              <PhoneInput
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value)}
                className="shadow-[0px_0px_0px_0px_var(--primary)] h-10 w-full rounded-sm border border-primary bg-white dark:bg-black"
                placeholder={t("Phone Number")}
              />
            </div>
          </div>
          <div className="md:flex-1 w-full">
            <div className="text-sm font-semibold">{t("Address")}</div>
            <Input
              className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("Address")}
            />
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        <div className="lg:text-3xl md:text-2xl text-xl font-bold">
          {t("Payment Method")}
        </div>
        <div className="flex sm:gap-2 gap-1 items-center">
          <Button
            onClick={() => setSelectedMethod("visa")}
            className={cn(
              "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary10 bg-white dark:bg-black border border-primary text-primary font-bold",
              selectedMethod === "visa"
                ? "bg-primary hover:bg-primary text-white"
                : "bg-primary0"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border",
                selectedMethod === "visa"
                  ? "border-white bg-blue-500"
                  : "border-primary bg-white"
              )}
            />
            <span className="sm:inline-block hidden">Visa</span>
            <span className="inline-block text-[10px] text-white rounded bg-orange-400 border border-orange-400 px-0.5">
              VISA
            </span>
          </Button>
          <Button
            onClick={() => setSelectedMethod("mastercard")}
            className={cn(
              "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary10 bg-white dark:bg-black border border-primary text-primary font-bold",
              selectedMethod === "mastercard"
                ? "bg-primary hover:bg-primary text-white"
                : "bg-primary0"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border",
                selectedMethod === "mastercard"
                  ? "border-white bg-blue-500"
                  : "border-primary bg-white"
              )}
            />
            <span className="sm:inline-block hidden">MasterCARD</span>
            <span className="inline-block text-[10px] text-white rounded bg-orange-400 border border-orange-400 px-0.5">
              MasterCARD
            </span>
          </Button>
          <Button
            onClick={() => setSelectedMethod("paypal")}
            className={cn(
              "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary10 bg-white dark:bg-black border border-primary text-primary font-bold",
              selectedMethod === "paypal"
                ? "bg-primary hover:bg-primary text-white"
                : "bg-primary0"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border",
                selectedMethod === "paypal"
                  ? "border-white bg-blue-500"
                  : "border-primary bg-white"
              )}
            />
            <span className="sm:inline-block hidden">PayPal</span>
            <span className="text-[10px] text-white inline-block rounded bg-orange-400 border border-orange-400 px-0.5">
              PAYPAL
            </span>
          </Button>
        </div>
        <div className="flex md:flex-row flex-col gap-2 items-center">
          <div className="flex sm:flex-row flex-col gap-2 w-full">
            <div className="sm:w-1/2 md:w-auto w-full">
              <div className="text-sm font-bold">{t("Cardholder Name")}</div>
              <Input
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder={t("Cardholder Name")}
                className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
              />
            </div>
            <div className="sm:w-1/2 md:w-auto w-full">
              <div className="text-sm font-bold">
                {t("Card Number (16digits)")}
              </div>
              <Input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder={t("Card Number (16digits)")}
                className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
              />
            </div>
          </div>
          <div className="flex sm:flex-row flex-col gap-2 w-full">
            <div className="sm:w-1/2 md:w-auto w-full">
              <div className="text-sm font-bold">{t("Expiry Date")}</div>
              <Input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder={t("Expiry Date")}
                className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
              />
            </div>
            <div className="sm:w-1/2 md:w-auto w-full">
              <div className="text-sm font-bold">{t("CVV (3digits)")}</div>
              <Input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder={t("CVV (3digits)")}
                className="h-10 w-full text-base rounded-sm border border-primary bg-white dark:bg-black"
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <button className="sm:px-3 sm:py-1.5 px-2 py-1 sm:text-lg text-base font-semibold rounded-md border-primary bg-primary text-white cursor-pointer shadow-[0px_0px_0px_0px_var(--color-primary)] hover:shadow-[0px_0px_5px_1px_var(--color-primary)] border hover:border-white transition-all duration-200">
          {t("Place and Order")}
        </button>
      </div>
    </div>
  );
};

export default Page;
