"use client";
import InfiniteScrollCards from "@/components/InfiniteScroll";
import { useAuth } from "@/context/AuthContext";
import { useCustomToast } from "@/context/CustomToastContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [messageValue, setMessageValue] = useState("");
  const [width, setWidth] = useState(0);

  const theme = useTheme();
  const { user } = useAuth();
  const t = useTranslations("Testimonials");
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();

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
    }
  };

  return (
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] pt-5 min-h-[calc(100vh-68px)]">
      <div className="flex gap-1 items-center">
        <span>pathName:</span>
        <Link href={"/home"} className="px-1 rounded-sm bg-primary text-white">
          {t("Home")}
        </Link>
        <span className="mr-1">/</span>
        <div className="px-1 rounded-sm bg-primary shadow-[0px_0px_5px_2px_var(--primary)] text-white cursor-default">
          {t("Testimonials")}
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-center md:text-4xl sm:text-3xl text-xl  font-bold">
          {t("Our customers love shopping with us!")}
        </h1>
        <h3 className="sm:flex hidden text-center sm:text-xl text-[16px] font-semibold">
          {t(
            "Their kind words reflect our commitment to quality, service, and a seamless experience"
          )}
        </h3>
      </div>
      <div className="relative">
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              theme.theme === "dark"
                ? "linear-gradient(to right, black, transparent, transparent, transparent, black)"
                : "linear-gradient(to right, white, transparent, transparent, transparent, white)",
          }}
        ></div>
        <InfiniteScrollCards
          news={[
            { id: 1, title: "Breaking: Market Hits Record High" },
            { id: 2, title: "Tech Giant Releases New AI Tool" },
            { id: 3, title: "Local Startup Secures Funding" },
            { id: 4, title: "Sports Team Wins Championship" },
            { id: 5, title: "Weather Alert: Storm Incoming" },
          ]}
          speed={width > 640 ? 150 : 50}
          direction="left"
        />
      </div>

      <div className="flex flex-col items-center sm:mt-8 mt-4 gap-2">
        <h2 className="text-center md:text-3xl sm:text-xl text-lg font-semibold">
          {t("Want to share your own experience?")}
        </h2>
        <h3 className="sm:flex hidden text-center sm:text-xl text-[16px] font-semibold">
          {t(
            "Be part of our growing family of satisfied customers—share your thoughts today!"
          )}
        </h3>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="sm:rounded-md rounded-sm border border-primary lg:h-25 h-30 sm:w-[60vw] w-[85vw] max-w-[800px]">
            <textarea
              name="message"
              id="message"
              placeholder="Type here"
              className="w-full h-full p-2 resize-none"
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="cursor-pointer px-2 py-0.5 rounded-sm bg-primary text-white"
            >
              {"Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
