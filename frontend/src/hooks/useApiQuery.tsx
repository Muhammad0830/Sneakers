"use client";
import { useCustomToast } from "@/context/CustomToastContext";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const useApiQuery = <T,>(
  url: string,
  key: string | (string | number)[],
  enabled?: boolean
) => {
  const { showToast } = useCustomToast();
  const toastT = useTranslations("Toast");
  const hasShownError = useRef(false);

  const { data, error, isLoading, refetch, isError } = useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await api.get(url);
      return response.data;
    },
    retry: 1,
    enabled: enabled,
  });

  useEffect(() => {
    if (error && !hasShownError.current) {
      showToast(
        "error",
        toastT("Error occured"),
        toastT("Internal server error")
      );
      hasShownError.current = true; // prevent duplicates
    }
  }, [error, showToast, toastT]);

  return { data, error, isLoading, refetch, isError };
};
export default useApiQuery;
