"use client";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import api from "@/lib/api";
import { useTranslations } from "next-intl";
import { useCustomToast } from "@/context/CustomToastContext";

export function useApiMutation<TResponse = unknown, TVariables = unknown>(
  url: string,
  method: "post" | "put" | "delete" = "post"
): UseMutationResult<TResponse, Error, TVariables> {
  const toastT = useTranslations("Toast");
  const { showToast } = useCustomToast();
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: async (data: TVariables) => {
      const response = await api[method]<TResponse>(url, data);
      return response.data;
    },
    // eslint-disable-next-line
    onError: (error: any) => {
      showToast(
        "error",
        toastT(`Failed to perform the action`),
        toastT(`Internal server error`)
      );
      throw new Error(error.message);
    },
  });
}
