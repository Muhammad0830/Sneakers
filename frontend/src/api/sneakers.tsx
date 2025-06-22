import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/types/types";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const GetTrending = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/sneakers/trending");
  return data;
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Product) => {
      const { data } = await api.post("/products", newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// usage 👇
// const { mutate, isLoading, error } = useCreateProduct();

// const handleSubmit = () => {
//   mutate({ name: "Nike", size: "42" });
// };