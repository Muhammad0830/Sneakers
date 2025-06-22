import { useQuery } from "@tanstack/react-query";
const BaseURL = 'http://localhost:3001/sneakers';

const useApiQuery = <T,>(url: string, key: string) => {
  const { data, error, isLoading } = useQuery<T>({
    queryKey: [key],
    queryFn: async () => {
      const response = await fetch(`${BaseURL}${url}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });

  return { data, error, isLoading };
};

export default useApiQuery;
