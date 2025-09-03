import { useCustomToast } from "@/context/CustomToastContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

const BaseURL = "http://localhost:3001/sneakers";

const useApiQuery = <T,>(
  url: string,
  key: string | (string | number)[],
  enabled?: boolean
) => {
  const { showToast } = useCustomToast();
  const t = useTranslations("Shop");
  const hasShownError = useRef(false);

  const { data, error, isLoading, refetch, isError } = useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await fetch(`${BaseURL}${url}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    retry: 1,
    enabled: enabled,
  });

  useEffect(() => {
    if (error && !hasShownError.current) {
      showToast("error", t("Error occured"), t("Internal server error"));
      hasShownError.current = true; // prevent duplicates
    }
  }, [error, showToast, t]);

  return { data, error, isLoading, refetch, isError };
};
export default useApiQuery;
