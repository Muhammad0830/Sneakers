import React from "react";
import { AboutCardType } from "@/types/types";

const AboutCard = ({
  className,
  item,
}: {
  className?: string;
  item: AboutCardType;
}) => {
  return (
    <div
      className={`${className} flex flex-col gap-4 h-full bg-white rounded-xl shadow-md px-4 py-6 justify-between items-center border border-varBlack/20`}
    >
      <div className="rounded-lg bg-primary w-16 aspect-square flex items-center justify-center">
        {item.icon}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <h1 className="md:text-xl text-lg font-bold text-center">{item.title}</h1>
        <h3 className="text-md font-normal text-varBlack/70 text-center">{item.thesis}</h3>
      </div>
    </div>
  );
};

export default AboutCard;
