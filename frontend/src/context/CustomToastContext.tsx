"use client";

import React, { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  visible: boolean;
}

interface CustomToastContextType {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const CustomToastContext = createContext<CustomToastContextType | null>(null);

export const useCustomToast = () => {
  const ctx = useContext(CustomToastContext);
  if (!ctx)
    throw new Error("useCustomToast must be used within CustomToastProvider");
  return ctx;
};

export const CustomToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (type: ToastType, title: string, message: string) => {
    const id = crypto.randomUUID();

    const newToast: Toast = {
      id,
      type,
      title,
      message,
      visible: false,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
      );
    }, 1);

    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

  return (
    <CustomToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </CustomToastContext.Provider>
  );
};
