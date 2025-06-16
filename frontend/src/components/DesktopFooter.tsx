"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faFacebookF,
  faInstagram,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import LinkComponent from "@/components/Link";

const DesktopFooter = ({ className }: { className?: string }) => {
  return (
    <div
      className={`bg-[#D1D1D1] w-full lg:px-12 px-8 py-6 gap-4 flex-wrap justify-between flex ${className}`}
    >
      {/* Footer Links */}
      <div className="md:flex-3 w-[45%]">
        <div className="lg:text-3xl text-xl font-bold mb-2">Support</div>
        <p className="lg:text-lg text-md font-normal">
          111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.
        </p>
        <p className="lg:text-lg text-md font-normal">
          abduqayumovm1@gmail.com
        </p>
        <p className="lg:text-lg text-md font-normal">+998944101551</p>
      </div>

      <div className="md:flex-2 w-[45%]">
        <div className="lg:text-3xl text-xl font-bold mb-2">Account</div>
        <p className="lg:text-lg text-md font-normal">
          <LinkComponent href={"/profile"}>My Account</LinkComponent>
        </p>
        <p className="lg:text-lg text-md font-normal flex items-center gap-1">
          <LinkComponent href={"/auth/login"}>Login</LinkComponent>
          <span className="cursor-default"> / </span>
          <LinkComponent href={"/auth/register"}>Register</LinkComponent>
        </p>
        <p className="lg:text-lg text-md font-normal">
          <LinkComponent href={"/cart"}>Cart</LinkComponent>
        </p>
      </div>

      <div className="md:flex-2 w-[45%]">
        <div className="lg:text-3xl text-xl font-bold mb-2">Quick Link</div>
        <p className="lg:text-lg text-md font-normal">
          <LinkComponent href={"/privacy"}>Privacy & Policy</LinkComponent>
        </p>
        <p className="lg:text-lg text-md font-normal">
          <LinkComponent href={"/terms"}>Terms & Conditions</LinkComponent>
        </p>
        <p className="lg:text-lg text-md font-normal">
          <LinkComponent href="/faq">FAQ</LinkComponent>
        </p>
      </div>

      <div className="md:flex-1 w-[45%]">
        <div className="lg:text-3xl text-xl font-bold mb-2">Socials</div>
        <div className="flex gap-2 items-center">
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
      </div>
    </div>
  );
};

export default DesktopFooter;
