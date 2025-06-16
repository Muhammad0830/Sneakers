"use client";
import React from "react";
import DesktopFooter from "./DesktopFooter";
import MobileFooter from "./MobileFooter";

const Footer = () => {
  return (
    <div className="w-full">
      <DesktopFooter className={"sm:flex hidden"} />
      <MobileFooter className="sm:hidden" />
    </div>
  );
};

export default Footer;
