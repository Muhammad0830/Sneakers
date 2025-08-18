// app/providers.tsx
"use client";

import { FontAwesomeProvider } from "@/components/FontAwesomeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <FontAwesomeProvider />
      {children}
    </QueryClientProvider>
  );
}
