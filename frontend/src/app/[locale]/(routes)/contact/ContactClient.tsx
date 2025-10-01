"use client";
import Button from "@/components/ui/CustomButton";
import { useAuth } from "@/context/AuthContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Link } from "@/i18n/navigation";
import { MailCheck, Pencil, PhoneCall } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

const ContactClient = () => {
  const [width, setWidth] = useState(0);
  const [messageValue, setMessageValue] = useState("");

  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const t = useTranslations("Contact");
  const toastT = useTranslations("Toast");

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const { mutate: handleSendMessage } = useApiMutation<
    { message: string },
    { message: string }
  >("/user/contactMessage", "post");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user?.user?.id) {
      handleSendMessage(
        { message: messageValue },
        {
          onSuccess: () => {
            showToast("success", toastT("Your message is submitted"));
            setMessageValue("");
          },
          onError: (error) => {
            showToast("error", toastT("Failed to perform the action"));
            console.error("submit error:", error);
          },
        }
      );
    } else showToast("warning", toastT("Please sign in or sign up first"));
  };

  return (
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px]">
      <div className="px-4 md:px-16 sm:px-8 min-h-[calc(100vh-68px)] pt-5 flex flex-col">
        <div className="flex gap-1 items-center">
          <span>pathName:</span>
          <Link
            href={"/home"}
            className="px-1 rounded-sm bg-primary text-white"
          >
            Home
          </Link>
          <span className="mr-1">/</span>
          <div className="px-1 rounded-sm bg-primary shadow-[0px_0px_5px_2px_var(--primary)] text-white cursor-default">
            {t("Contact")}
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 flex-1 justify-center lg:mt-0 mt-4">
          <div className="w-full sm:px-0 px-4 flex justify-center md:justify-between items-center gap-4">
            <h1 className="font-bold lg:w-auto min-w-[250px] md:items-start items-center lg:text-3xl text-2xl flex flex-col gap-1">
              <span>{t("Any ideas or issues")}</span>
              <span>{t("Contact with Us!")}</span>
            </h1>

            <h3 className="font-normal lg:text-lg md:flex hidden text-md lg:w-[400px] w-auto flex-col gap-3 items-start">
              <span className="text-end">
                {t(
                  "You can contact with us using our email and phone number or writing here"
                )}
              </span>
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex md:flex-row flex-col gap-4 w-full">
              <div className="flex flex-1 justify-between md:flex-col min-[400px]:flex-row flex-col sm:items-start items-center min-[400px]:gap-2 gap-1 min-[400px]:p-4 p-2 rounded-lg bg-varWhite">
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
                  <h3 className="lg:text-md text-sm text font-normal sm:block hidden md:text-start text-end">
                    {t("Call to us using this number")}
                  </h3>
                  <h3 className="lg:text-md sm:text-sm text-xs font-normal md:text-start text-end">
                    +999894-410-15-51
                  </h3>
                </div>
              </div>
              <div className="flex flex-1 md:flex-col min-[400px]:flex-row flex-col sm:items-start justify-between items-center min-[400px]:gap-2 gap-1 min-[400px]:p-4 p-2 rounded-lg bg-varWhite">
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
                  <h3 className="lg:text-md text-sm font-normal sm:block hidden md:text-start text-end">
                    {t("Call to us using this email")}
                  </h3>
                  <h3 className="lg:text-md sm:text-sm text-xs font-normal md:text-start text-end">
                    abduqayumovm1@gmail.com
                  </h3>
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col min-[400px]:gap-2 gap-1 p-2 min-[400px]:p-4 rounded-lg bg-varWhite"
            >
              <div className="flex flex-row gap-2 items-center">
                <div className="bg-primary aspect-square sm:w-10 w-7 rounded-lg sm:flex hidden justify-center items-center">
                  <Pencil size={width * 3 < 640 ? 18 : 25} color={"white"} />
                </div>
                <div className="lg:text-2xl sm:text-xl text-sm font-bold flex-1">
                  {t("Write your words here")}
                </div>
                <div className="sm:flex hidden">
                  <Button type="submit" className="sm:text-md text-sm">
                    {t("Submit")}
                  </Button>
                </div>
              </div>
              <div className="sm:rounded-md rounded-sm border border-primary lg:h-25 h-30">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Type here"
                  className="w-full h-full p-2 resize-none"
                  value={messageValue}
                  onChange={(e) => setMessageValue(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="sm:hidden flex cursor-pointer px-2 py-0.5 rounded-sm bg-primary text-white"
                >
                  {"Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactClient;
