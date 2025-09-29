import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calcPrice = (
  productPrice: number,
  value: number,
  type?: string
): number => {
  if (type === "percentage")
    return Number((productPrice - productPrice * (value / 100)).toFixed(2));
  else if (type === "fixed") return Number((productPrice - value).toFixed(2));
  return productPrice;
};
