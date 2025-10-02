"use client";

import { InCartProducts } from "@/types/types";
import React, { createContext, useContext, useState } from "react";

interface CheckoutContextProps {
  cartItems: InCartProducts[];
  setCartItems: React.Dispatch<React.SetStateAction<InCartProducts[]>>;
}

const CheckoutContext = createContext<CheckoutContextProps>({
  cartItems: [],
  setCartItems: () => {},
});

export const CheckoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState<InCartProducts[]>([]);

  return (
    <CheckoutContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => useContext(CheckoutContext);
