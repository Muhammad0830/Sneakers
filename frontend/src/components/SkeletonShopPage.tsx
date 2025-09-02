import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonProducts = () => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-8 md:gap-6 gap-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} className="h-[200px] bg-primary/40 rounded-md" />
      ))}
    </div>
  );
};

export const SkeletonPagination = () => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <Skeleton className="h-10 w-20 bg-primary/30" />
      <Skeleton className="h-10 w-10 bg-primary/30" />
      <Skeleton className="h-10 w-10 bg-primary/30" />
      <Skeleton className="h-10 w-10 bg-primary/30" />
      <Skeleton className="h-10 w-20 bg-primary/30" />
    </div>
  );
};
