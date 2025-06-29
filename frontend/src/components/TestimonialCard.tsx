import React from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { TestimonialType } from "@/types/types";

const TestimonialCard = ({
  item,
  index,
  className,
}: {
  item: TestimonialType;
  index: number;
  className?: string;
}) => {
  return (
    <div
      className={`bg-varWhite sm:block flex flex-col items-center px-4 py-4 rounded-lg relative w-full ${className}`}
    >
      <div className="sm:absolute relative left-0 top-0 sm:-translate-x-[30%] sm:-translate-y-[30%] w-15 aspect-square rounded-full overflow-hidden">
        <Image
          src={item.image ? item.image : "/testimonialsFace1.png"}
          alt={`testimonials ${index}`}
          fill
          className="object-contain"
        />
      </div>
      <div className="text-center md:text-xl text-md font-bold text-primary">
        {item.name}
      </div>
      <div className="flex gap-1 items-center justify-center mt-1 mb-3">
        <Star size={15} color="yellow" />
        <Star size={15} color="yellow" />
        <Star size={15} color="yellow" />
        <Star size={15} color="yellow" />
        <Star size={15} color="yellow" />
      </div>
      <div className="px-2 relative border border-primary/30 rounded-lg p-2">
        <p className="md:text-md text-sm text-varBlack font-normal">
          {item.text}
        </p>
        <div className="absolute left-0 top-0 -translate-x-[60%] -translate-y-[30%] scale-x-[-1]">
          <Quote size={20} color={"var(--primary)"} strokeWidth={3} />
        </div>
        <div className="absolute bottom-0 right-0 translate-x-[60%] translate-y-[30%] scale-y-[-1]">
          <Quote size={20} color={"var(--primary)"} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
