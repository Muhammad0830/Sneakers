"use client";
import { PhoneInput } from "@/components/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useCheckoutContext } from "@/context/CheckoutContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { calcPrice, cn } from "@/lib/utils";
import { InCartProducts } from "@/types/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const router = useRouter();
  const { showToast } = useCustomToast();
  const { user } = useAuth();
  const { cartItems, setCartItems } = useCheckoutContext();
  const toastT = useTranslations("Toast");
  const t = useTranslations("Checkout");

  useEffect(() => {
    if (user?.user?.name) setName(user.user.name);
  }, [user]);

  useEffect(() => {
    if (cartItems.length <= 0) {
      const localStorageCartItems = localStorage.getItem("cartItems") || "[]";
      const localStorageCartItemsParsed = JSON.parse(localStorageCartItems);
      setCartItems(localStorageCartItemsParsed);
    }
  }, []); // eslint-disable-line

  const { mutate: placeOrder } = useApiMutation<
    { message: string },
    {
      name: string;
      phoneNumber: string;
      address: string;
      selectedMethod: string;
      cardholderName: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cartItems: InCartProducts[];
    }
  >("/sneakers/placeOrder", "post");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    placeOrder(
      {
        name,
        phoneNumber,
        address,
        selectedMethod,
        cardholderName,
        cardNumber,
        expiryDate,
        cvv,
        cartItems,
      },
      {
        onSuccess: () => {
          router.push("/cart");
          setName("");
          setPhoneNumber("");
          setAddress("");
          setSelectedMethod("visa");
          setCardholderName("");
          setCardNumber("");
          setExpiryDate("");
          setCvv("");
          setCartItems([]);
          showToast(
            "success",
            toastT("Successfull"),
            toastT("Your order is placed")
          );
        },
        onError: (data) => {
          showToast("error", toastT("Error"), toastT("Internal server error"));
          console.error("placing order error", data.message);
        },
      }
    );
  };

  const selectedProducts = cartItems.map((p) => ({
    quantity: p.quantity,
    price: calcPrice(
      Number(p.product.price),
      Number(p.product.discount_value),
      p.product.discount_type
    ),
  }));

  const totalNumberProducts = selectedProducts.reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const totalPrice = selectedProducts
    .reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
    .toFixed(2);

  const checkAllFields = () => {
    return (
      !name ||
      !phoneNumber ||
      !address ||
      !selectedMethod ||
      !cardholderName ||
      !cardNumber ||
      !expiryDate ||
      !cvv
    );
  };

  return (
    <div className="lg:px-[60px] md:px-10 sm:-px-[30px] px-5 mb-4">
      <form
        onSubmit={handleSubmit}
        id="myForm"
        className="flex flex-col gap-y-4 mb-4"
      >
        <div>
          {cartItems?.length > 0 ? (
            <>
              <h1 className="lg:text-3xl md:text-2xl text-xl font-bold mt-4 mb-2">
                {t("My Orders")}
              </h1>
              <div className="sm:flex grid grid-cols-3 max-[440px]:grid-cols-2 gap-2 flex-wrap">
                {cartItems.map((cart, index) => {
                  return (
                    <div
                      key={index}
                      className="p-2 sm:min-w-[180px] min-w-[120px] flex flex-col gap-2 rounded-sm border border-primary bg-white dark:bg-black relative overflow-hidden"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <div className="lg:text-xl md:text-lg text-base lg:font-bold font-semibold">
                          {cart.product.title}
                        </div>
                        <div className="rounded-full font-bold bg-primary text-white md:h-7 h-5 md:text-base text-sm flex justify-center items-center aspect-square">
                          {cart.quantity}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="sm:w-16 sm:h-16 w-12 h-12 rounded-sm border border-primary relative overflow-hidden">
                          <Image
                            className="w-full h-full object-cover"
                            src={"/sneakers.png"}
                            alt={cart.product.title}
                            fill
                          />
                        </div>
                        <div className="flex flex-col items-end lg:text-2xl md:text-xl sm:text-lg text-base font-bold">
                          {cart.product.discount_type ? (
                            <span className="text-sm/4 text-gray-500">
                              {cart.product.price}$
                            </span>
                          ) : null}
                          <span>
                            {calcPrice(
                              Number(cart.product.price),
                              Number(cart.product.discount_value),
                              cart.product.discount_type
                            )}
                            $
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center sm:gap-2 gap-0.5 pt-1 border-0 border-t-1 border-primary">
                        <div className="font-semibold md:text-xl text-sm">
                          {t("SubTotal")}
                        </div>
                        <div className="font-bold md:text-xl text-sm">
                          {calcPrice(
                            Number(cart.product.price),
                            Number(cart.product.discount_value),
                            cart.product.discount_type
                          ) * cart.quantity}
                          $
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <div className="lg:text-2xl sm:text-xl text-base font-bold mt-2 px-2 py-1 rounded-sm bg-white dark:bg-black border border-primary">
                  <span>{t("Total")}: </span>
                  <span>{totalPrice}$</span>
                </div>
                <div className="lg:text-2xl sm:text-xl text-base font-bold mt-2 px-2 py-1 rounded-sm bg-white dark:bg-black border border-primary">
                  <span>{t("Products")}: </span>
                  <span>{totalNumberProducts}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 min-h-[200px] w-full border rounded-sm border-primary bg-white dark:bg-black flex justify-center items-center">
              <span className="sm:text-xl text-lg font-semibold">
                {t("No Products Chosen")}
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Shipping info")}
          </h1>
          <div className="flex md:flex-row flex-col gap-2 md:items-center mt-2">
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
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="lg:text-3xl md:text-2xl text-xl font-bold">
            {t("Payment Method")}
          </div>
          <div className="flex sm:gap-2 gap-1 items-center">
            <Button
              type="button"
              onClick={() => setSelectedMethod("visa")}
              className={cn(
                "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary20 bg-white dark:bg-black border border-primary text-primary font-bold",
                selectedMethod === "visa"
                  ? "bg-primary hover:bg-primary dark:hover:bg-primary dark:bg-primary text-white"
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
              type="button"
              onClick={() => setSelectedMethod("mastercard")}
              className={cn(
                "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary20 bg-white dark:bg-black border border-primary text-primary font-bold",
                selectedMethod === "mastercard"
                  ? "bg-primary hover:bg-primary dark:hover:bg-primary dark:bg-primary text-white"
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
              type="button"
              onClick={() => setSelectedMethod("paypal")}
              className={cn(
                "rounded-sm min-[400px]:px-2 px-1 py-1 h-auto cursor-pointer min-[400px]:gap-2 gap-1 hover:bg-primary10 dark:hover:bg-primary20 bg-white dark:bg-black border border-primary text-primary font-bold",
                selectedMethod === "paypal"
                  ? "bg-primary hover:bg-primary dark:hover:bg-primary dark:bg-primary text-white"
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
            <div className="flex sm:flex-row flex-col gap-2 md:w-auto w-full">
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
            <div className="flex sm:flex-row flex-col gap-2 md:w-auto w-full">
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
      </form>

      <div>
        <button
          disabled={checkAllFields()}
          type="submit"
          form="myForm"
          className={cn(
            "sm:px-3 sm:py-1.5 px-2 py-1 sm:text-lg text-base font-semibold rounded-md border-primary bg-primary text-white shadow-[0px_0px_0px_0px_var(--color-primary)] border transition-all duration-200",
            checkAllFields()
              ? "opacity-50"
              : "cursor-pointer hover:shadow-[0px_0px_5px_1px_var(--color-primary)] hover:border-white"
          )}
        >
          {t("Place an Order")}
        </button>
      </div>
    </div>
  );
};

export default Page;
