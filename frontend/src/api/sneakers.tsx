import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

interface Product {
  id: number;
  name: string;
  size: string;
}

export const GetTrending = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>("/sneakers/trending");
  return data;
};
