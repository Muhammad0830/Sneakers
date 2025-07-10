"use client";

import { Loader2 } from "lucide-react"; // or any spinner you like

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      <span className="ml-2">Loading site...</span>
    </div>
  );

  return null; // Or show skeletons, fallback, etc.
}
