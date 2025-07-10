"use client";

import { useLoading } from "@/context/LoadingContext";

export default function FullScreenLoader() {
  const { isVisible, message } = useLoading();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="text-center text-white animate-pulse">
        <div className="text-lg font-semibold">{message || "Loading..."}</div>
        <div className="mt-4 h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}

// usage 👇
// import { useLoading } from '@/contexts/LoadingContext';
// const { show, hide } = useLoading();

// const handleLike = async () => {
//   show("Liking...");
//   try {
//     await fetch("/api/like", { method: "POST" });
//     // success logic
//   } catch (e) {
//     // error toast
//   } finally {
//     setTimeout(() => hide(), 1000); // at least 1s
//   }
// };
