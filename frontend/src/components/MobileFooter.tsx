"use client";
import React from "react";
import LinkComponent from "./ui/Link";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTelegram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

//  handling hydration error || problem: height: 0px in the MobileFooterSections component
//  style={{ height: open ? buttonHeight + linksHeight : buttonHeight }}
const MobileFooterSections = dynamic(
  () => import("@/components/MobileFooterSections"),
  {
    ssr: false,
  }
);

const MobileFooter = ({ className }: { className?: string }) => {
  return (
    <div
      className={`${className} w-full py-4 px-4 flex flex-col items-center bg-[#D1D1D1] dark:bg-black`}
    >
      <MobileFooterSections title="Support">
        <div className="flex flex-col items-center">
          <p className="text-md">
            111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
          </p>
          <p className="text-md">abduqayumovm1@gmail.com</p>
          <p className="text-md">+998944101551</p>
        </div>
      </MobileFooterSections>

      <MobileFooterSections title="Account">
        <div className="flex flex-col items-center">
          <LinkComponent className="text-xl" href={"/profile"}>
            My Account
          </LinkComponent>
          <LinkComponent className="text-xl" href={"/auth/login"}>
            Login
          </LinkComponent>
          <LinkComponent className="text-xl" href={"/auth/register"}>
            Register
          </LinkComponent>
        </div>
      </MobileFooterSections>

      <MobileFooterSections title="Quick Link">
        <div className="flex flex-col items-center">
          <LinkComponent className="text-xl" href={"/privacy"}>
            Privacy & Policy
          </LinkComponent>
          <LinkComponent className="text-xl" href={"/terms"}>
            Terms & Conditions
          </LinkComponent>
          <LinkComponent className="text-xl" href={"/faq"}>
            FAQ
          </LinkComponent>
        </div>
      </MobileFooterSections>

      <MobileFooterSections title="Socials">
        <div className="flex items-center gap-2 justify-center ">
          <FontAwesomeIcon
            icon={faInstagram}
            size="lg"
            className="hover:scale-[1.2] duration-200"
          />
          <FontAwesomeIcon
            icon={faFacebookF}
            size="lg"
            className="hover:scale-[1.2] duration-200"
          />
          <FontAwesomeIcon
            icon={faXTwitter}
            size="lg"
            className="hover:scale-[1.2] duration-200"
          />
          <FontAwesomeIcon
            icon={faTelegram}
            size="lg"
            className="hover:scale-[1.2] duration-200"
          />
        </div>
      </MobileFooterSections>
    </div>
  );
};

export default MobileFooter;
