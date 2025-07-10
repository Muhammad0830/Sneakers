"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show delay on hard reload or very first load
    const navEntry = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const navType = navEntry?.type;
    console.log("📦 Navigation type:", navType); // ← this should show "navigate" or "reload"

    const isInitialVisit = navType === "navigate" || navType === "reload";

    if (isInitialVisit) {
      setShow(true);
      sessionStorage.setItem("hasVisited", "true");

      const timeout = setTimeout(() => {
        setShow(false);
      }, 1500); // delay duration

      return () => clearTimeout(timeout);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
  );
}
